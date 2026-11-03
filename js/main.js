/*
  Invitation behaviour:
  - Enter Experience covers the page on every visit
  - after the click, each section rises into view as it is reached
  - countdown to the baraat welcome (21 Nov 2026, 4:15 pm IST)
  - mobile menu and the current section in the nav
*/

(function () {
  var root = document.documentElement;
  var gate = document.getElementById("gate");
  var enter = document.getElementById("enter");
  var motionStarted = false;

  function showInView() {
    var nodes = document.querySelectorAll(".reveal");
    nodes.forEach(function (el, index) {
      var box = el.getBoundingClientRect();
      var visible = box.top < window.innerHeight * 0.92 && box.bottom > 0;
      if (!visible) return;
      el.style.setProperty("--d", (index % 6) * 80 + "ms");
      el.classList.add("is-in");
    });
  }

  function startMotion() {
    if (motionStarted) return;
    motionStarted = true;
    var motionNodes = document.querySelectorAll(
      ".reveal, .shagun-card, .vip, .name, .family-card, .portrait, .location-frame"
    );
    motionNodes.forEach(function (el) {
      el.classList.add("reveal");
    });

    if ("IntersectionObserver" in window) {
      var revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-in");
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );
      motionNodes.forEach(function (el) {
        revealObserver.observe(el);
      });
      /* The closing wish is not a .reveal card. Its lines rise on their own. */
      var closing = document.querySelector(".closing-card");
      if (closing) revealObserver.observe(closing);
    } else {
      var closingNow = document.querySelector(".closing-card");
      if (closingNow) closingNow.classList.add("is-in");
    }
    window.setTimeout(showInView, 60);
  }

  function openGate() {
    if (!gate) return;
    window.scrollTo(0, 0);
    gate.classList.add("is-open");
    root.classList.remove("has-gate");
    startMotion();
    startClock();
    startDhun();
    var main = document.getElementById("top");
    if (main) main.focus();
  }

  if (enter) {
    enter.addEventListener("click", openGate);
  }

  /*
    Panihari dhun plays after Enter, because that click is the guest's gesture.
    The song icon at the top right mutes and unmutes it. Reduced motion does not
    start the tune on its own.
  */
  var dhun = document.getElementById("panihari");
  var dhunBtn = document.getElementById("dhun");
  var dhunQuiet = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function paintDhun(on) {
    if (!dhunBtn) return;
    dhunBtn.classList.toggle("is-on", on);
    dhunBtn.setAttribute("aria-pressed", on ? "true" : "false");
    dhunBtn.setAttribute("aria-label", on ? "पनिहारी धुन चल रही है" : "पनिहारी धुन मूक है");
  }

  function startDhun() {
    if (!dhun || dhunQuiet) return;
    dhun.muted = false;
    dhun.volume = 0.4;
    var playing = dhun.play();
    if (playing && playing.then) {
      playing.then(function () { paintDhun(true); }).catch(function () { paintDhun(false); });
    }
  }

  if (dhunBtn) {
    dhunBtn.addEventListener("click", function () {
      if (!dhun) return;
      if (dhun.paused) {
        dhun.muted = false;
        dhun.volume = 0.4;
        var playing = dhun.play();
        if (playing && playing.then) {
          playing.then(function () { paintDhun(true); }).catch(function () { paintDhun(false); });
        }
        return;
      }
      dhun.muted = !dhun.muted;
      paintDhun(!dhun.muted);
    });
  }

  /*
    Baraat welcome: Saturday 21 November 2026, 4:15 pm India time.
    On Enter, the four figures count up from 00 while a gold bar fills
    the plaque. After that the live second flip takes over.
  */
  var target = new Date("2026-11-21T16:15:00+05:30").getTime();
  var units = {
    days: document.getElementById("cd-days"),
    hours: document.getElementById("cd-hours"),
    minutes: document.getElementById("cd-minutes"),
    seconds: document.getElementById("cd-seconds"),
  };
  var board = document.querySelector(".countdown");
  var clockStarted = false;

  function pad(n) {
    return String(Math.max(0, n)).padStart(2, "0");
  }

  function parts(diff) {
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
    var totalSeconds = Math.floor(diff / 1000);
    return {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
      done: false,
    };
  }

  function paint(values, flip) {
    var rows = [
      [units.days, values.days],
      [units.hours, values.hours],
      [units.minutes, values.minutes],
      [units.seconds, values.seconds],
    ];
    rows.forEach(function (row) {
      var el = row[0];
      var value = pad(row[1]);
      if (!el || el.textContent === value) return;
      el.textContent = value;
      if (!flip) return;
      el.classList.remove("tick");
      void el.offsetWidth;
      el.classList.add("tick");
    });
  }

  function tick() {
    if (!units.days) return;
    var now = parts(target - Date.now());
    paint(now, true);
    if (!now.done) return;
    var label = document.getElementById("cd-label");
    if (label) label.textContent = "शुभ मुहूर्त आ गया";
  }

  function startClock() {
    if (clockStarted || !units.days) return;
    clockStarted = true;
    var finalParts = parts(target - Date.now());
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      tick();
      setInterval(tick, 1000);
      return;
    }
    paint({ days: 0, hours: 0, minutes: 0, seconds: 0 }, false);
    if (board) board.classList.add("is-loading");
    var started = performance.now();
    var duration = 1400;
    function loadFrame(now) {
      var t = Math.min(1, (now - started) / duration);
      var ease = 1 - Math.pow(1 - t, 3);
      paint({
        days: Math.round(finalParts.days * ease),
        hours: Math.round(finalParts.hours * ease),
        minutes: Math.round(finalParts.minutes * ease),
        seconds: Math.round(finalParts.seconds * ease),
      }, false);
      if (t < 1) {
        requestAnimationFrame(loadFrame);
        return;
      }
      if (board) board.classList.remove("is-loading");
      tick();
      setInterval(tick, 1000);
    }
    requestAnimationFrame(loadFrame);
  }

  var menuBtn = document.getElementById("menu-btn");
  var navLinks = document.getElementById("nav-links");

  function closeMenu() {
    if (!navLinks) return;
    navLinks.classList.remove("open");
    if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
  }

  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navLinks.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu();
    });
  }

  var links = document.querySelectorAll('.nav-links a[href^="#"]');
  var sections = [];
  links.forEach(function (link) {
    var id = link.getAttribute("href").slice(1);
    var section = document.getElementById(id);
    if (section) sections.push({ id: id, el: section, link: link });
  });

  if ("IntersectionObserver" in window && sections.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          sections.forEach(function (item) {
            if (item.el === entry.target) {
              item.link.setAttribute("aria-current", "true");
            } else {
              item.link.removeAttribute("aria-current");
            }
          });
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0.01 }
    );
    sections.forEach(function (item) {
      observer.observe(item.el);
    });
  }
})();
