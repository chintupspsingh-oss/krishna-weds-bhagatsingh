/*
  Invitation behaviour:
  - The gate covers the page on every visit
  - Tap to begin unties the ribbon, then the doors open, then the patrika shows
  - after that, each section rises into view as it is reached
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

  /*
    The song must start inside the click, not in a later timer, or the
    browser will refuse the sound. The curtain itself waits: ribbon first,
    doors second, then the invitation. Reduced motion skips the wait.
  */
  function revealInvitation() {
    if (!gate || gate.classList.contains("is-open")) return;
    gate.classList.add("is-open");
    root.classList.remove("has-gate");
    startMotion();
    startClock();
    var main = document.getElementById("top");
    if (main) main.focus();
  }

  function openGate() {
    if (!gate || gate.classList.contains("is-open") || gate.classList.contains("is-untying")) return;
    window.scrollTo(0, 0);
    startDhun(true);
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      revealInvitation();
      return;
    }
    gate.classList.add("is-untying");
    if (enter) enter.disabled = true;
    window.setTimeout(function () {
      gate.classList.add("is-opening");
    }, 1050);
    window.setTimeout(revealInvitation, 3000);
  }

  if (enter) {
    enter.addEventListener("click", openGate);
  }

  /*
    Mangal geet starts on the first page, as soon as the player is ready.
    If the browser blocks that, Tap to begin is the gesture that starts it,
    and that call stays inside the click. The recording stays on YouTube
    (fQWgxAuTTZ8) and begins at 5:00. The picture is not shown.
    The song icon mutes and unmutes the sound.
    Reduced motion does not start the tune on its own.
    When the video ends, playback returns to 5:00 rather than the beginning.
  */
  var YT_ID = "fQWgxAuTTZ8";
  var YT_START = 300;
  var ytPlayer = null;
  var ytWanted = false;
  var ytHold = false;
  var dhunBtn = document.getElementById("dhun");
  var dhunQuiet = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function paintDhun(on) {
    if (!dhunBtn) return;
    dhunBtn.classList.toggle("is-on", on);
    dhunBtn.setAttribute("aria-pressed", on ? "true" : "false");
    dhunBtn.setAttribute("aria-label", on ? "गीत चल रहा है" : "गीत मूक है");
  }

  /* Ignore player events briefly so a late "playing" notice cannot undo a mute. */
  function holdPaint(on) {
    ytHold = true;
    paintDhun(on);
    window.setTimeout(function () { ytHold = false; }, 700);
  }

  var dhunStarted = false;
  var soundLive = false;

  function playFromMark(fromUser) {
    if (!ytPlayer || !ytPlayer.playVideo) return;
    ytPlayer.unMute();
    ytPlayer.setVolume(80);
    if (!dhunStarted) {
      ytPlayer.seekTo(YT_START, true);
      dhunStarted = true;
    }
    ytPlayer.playVideo();
    if (fromUser) holdPaint(true);
  }

  function startDhun(fromUser) {
    if (dhunQuiet) return;
    ytWanted = true;
    playFromMark(fromUser);
  }

  /* The first touch on this page is the gesture browsers require.
     Once the song is actually heard, later taps do not restart it. */
  window.addEventListener("pointerdown", function (event) {
    if (soundLive || dhunQuiet) return;
    if (event.target.closest && event.target.closest("#dhun")) return;
    startDhun(true);
  }, true);

  /* YouTube calls this global once its player library has loaded. */
  window.onYouTubeIframeAPIReady = function () {
    if (!document.getElementById("yt-player")) return;
    ytPlayer = new YT.Player("yt-player", {
      width: "240",
      height: "135",
      videoId: YT_ID,
      playerVars: {
        autoplay: 1,
        start: YT_START,
        rel: 0,
        playsinline: 1,
        modestbranding: 1,
        origin: window.location.origin
      },
      events: {
        onReady: function (event) {
          var frame = event.target.getIframe();
          if (frame) frame.title = "Gaura Shiv Ki Baiyaan Pakad Le";
          /* First page: begin as soon as the player can. A blocked autoplay
             is retried by the tap, which is still a direct user gesture. */
          if (ytWanted || (gate && !gate.classList.contains("is-open"))) startDhun(false);
        },
        onStateChange: function (event) {
          if (event.data === YT.PlayerState.ENDED) {
            event.target.seekTo(YT_START, true);
            event.target.playVideo();
            return;
          }
          if (event.data === YT.PlayerState.PLAYING && !event.target.isMuted()) soundLive = true;
          if (ytHold) return;
          if (event.data === YT.PlayerState.PLAYING) {
            paintDhun(!event.target.isMuted());
          }
          if (event.data === YT.PlayerState.PAUSED) paintDhun(false);
        }
      }
    });
  };

  var ytScript = document.createElement("script");
  ytScript.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(ytScript);

  if (dhunBtn) {
    dhunBtn.addEventListener("click", function () {
      if (!ytPlayer || !ytPlayer.getPlayerState) return;
      var state = ytPlayer.getPlayerState();
      var alive = state === YT.PlayerState.PLAYING
        || state === YT.PlayerState.BUFFERING
        || state === YT.PlayerState.PAUSED;
      var sounding = dhunBtn.classList.contains("is-on");
      if (sounding || (alive && !ytPlayer.isMuted())) {
        ytPlayer.mute();
        holdPaint(false);
        return;
      }
      if (alive) {
        ytPlayer.unMute();
        ytPlayer.setVolume(40);
        if (state === YT.PlayerState.PAUSED) ytPlayer.playVideo();
        holdPaint(true);
        return;
      }
      playFromMark(true);
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

  /*
    Venue map wears a gold leaf. A drag clears it; स्थल दिखाएँ clears it at once.
    Reduced motion never draws the leaf, so the map is visible immediately.
  */
  (function initScratch() {
    var box = document.getElementById("scratch");
    var canvas = document.getElementById("scratch-foil");
    var hint = document.getElementById("scratch-hint");
    var skip = document.getElementById("scratch-skip");
    if (!box || !canvas || !canvas.getContext) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      box.classList.add("is-open");
      return;
    }

    var ctx = canvas.getContext("2d");
    var drawing = false;
    var revealed = false;
    var last = null;
    var moves = 0;

    function paintFoil(w, h) {
      var gold = ctx.createLinearGradient(0, 0, w, h);
      gold.addColorStop(0, "#f6e7bf");
      gold.addColorStop(0.42, "#e4c27a");
      gold.addColorStop(1, "#b8893d");
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = gold;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(255, 248, 230, 0.28)";
      ctx.lineWidth = Math.max(1, w * 0.004);
      var gap = Math.max(14, w * 0.045);
      for (var x = -h; x < w; x += gap) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + h, h);
        ctx.stroke();
      }
    }

    function sizeFoil() {
      if (revealed) return;
      var rect = box.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      paintFoil(canvas.width, canvas.height);
    }

    function point(event) {
      var rect = canvas.getBoundingClientRect();
      return {
        x: (event.clientX - rect.left) * (canvas.width / rect.width),
        y: (event.clientY - rect.top) * (canvas.height / rect.height)
      };
    }

    function erase(x, y) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, Math.max(22, canvas.width * 0.055), 0, Math.PI * 2);
      ctx.fill();
    }

    function stroke(from, to) {
      var dx = to.x - from.x;
      var dy = to.y - from.y;
      var dist = Math.sqrt(dx * dx + dy * dy) || 1;
      var step = Math.max(10, canvas.width * 0.02);
      var count = Math.ceil(dist / step);
      for (var i = 0; i <= count; i++) {
        erase(from.x + (dx * i) / count, from.y + (dy * i) / count);
      }
    }

    function reveal() {
      if (revealed) return;
      revealed = true;
      box.classList.add("is-open");
    }

    function measure() {
      moves += 1;
      if (moves % 5 !== 0) return;
      var data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      var clear = 0;
      var samples = 0;
      for (var i = 3; i < data.length; i += 64) {
        samples += 1;
        if (data[i] < 28) clear += 1;
      }
      var ratio = samples ? clear / samples : 0;
      if (hint) hint.style.opacity = String(Math.max(0, 1 - ratio * 2.2));
      if (ratio > 0.4) reveal();
    }

    canvas.addEventListener("pointerdown", function (event) {
      if (revealed) return;
      try { canvas.setPointerCapture(event.pointerId); } catch (err) {}
      drawing = true;
      last = point(event);
      erase(last.x, last.y);
      measure();
    });
    canvas.addEventListener("pointermove", function (event) {
      if (!drawing || revealed) return;
      var next = point(event);
      stroke(last, next);
      last = next;
      measure();
    });
    function stop() {
      drawing = false;
      last = null;
    }
    canvas.addEventListener("pointerup", stop);
    canvas.addEventListener("pointercancel", stop);
    if (skip) skip.addEventListener("click", reveal);

    sizeFoil();
    window.addEventListener("resize", function () {
      if (!revealed && moves === 0) sizeFoil();
    });
  })();
})();
