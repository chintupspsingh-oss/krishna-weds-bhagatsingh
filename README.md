# कृष्णा कंवर एवं भगतसिंह — डिजिटल निमंत्रण

Jodhpur royal wedding invitation for **आयुष्मती कृष्णा कंवर (दीपा)** and **आयुष्मान भ. भगतसिंह (राजसा)**.

Saturday, **21 November 2026** (Vikram Samvat 2083, Kartik Shukla 12).  
Venue: **महाराणा प्रताप पार्क**, Gali 13/2, near Krishna Mandir, New BJS Colony, Jodhpur.

The page is a static site: indigo Mehrangarh ground, sandstone invitation folios, kesariya and gold. It is original — not a copy of any other wedding template.

## Open locally

From this folder:

```bash
python3 -m http.server 8765
```

Then open `http://localhost:8765`.

Opening `index.html` directly also works. Fonts load from Google Fonts, so the first view needs a network connection.

## Put it on Vercel

1. Create a Git repository in this folder and push it to GitHub.
2. In Vercel, import that repository. Framework preset: **Other**. No build command. Output is the project root.
3. Deploy. `vercel.json` is already set for clean URLs.

## Where the words live

All guest-facing copy is in `index.html`, grouped by the printed card:

| Section id | Card page |
| --- | --- |
| `#vivah` | Book post, sender, Solanki family |
| `#parichay` | Mangal parichay, bride and groom |
| `#kshanika` | Dhritpaan through panigrahan |
| `#sthal` | Ashirwad, feast, baraat, map |
| `#parivar` | Natihal, jamwai, sadu |
| `#atithi` | Welcomers, VIPs, Bilada family, special request, children |

`css/styles.css` is the look. `js/main.js` is the gate, the countdown to baraat (21 Nov 2026, 4:15 pm IST), scroll motion, and the phone menu.

The first screen is a Mehrangarh night with a maroon jharokha patrika: Ganesha, the monogram, the script, the names, the shloka, and Enter Experience each arrive on their own beat. Clicking Enter lifts that curtain; the invitation underneath then rises section by section.

शुभ विवाह is a maroon court arch. Lord Ganesha, the gold line drawing in `images/ganesha.png`, sits in the crown of that arch and floats on a breathing gold halo. The words from Marwar through Krishna Weds Bhagatsingh each rise on their own beat once that court enters the screen. शुभ विवाह and आयुष्मती कृष्णा कंवर (दीपा) then keep their gold glow, and भगतसिंह and संग keep a quieter lift. The countdown is one sandstone plaque, divided by gold rules. On Enter the figures count up from 00 while a gold bar fills the plaque, then each change flips and the सेकंड cell keeps a gold beat. `prefers-reduced-motion` holds the figure still.

शगुन क्षणिकाएँ sits on a Mehrangarh night board. Each ritual is a glass card with a gold plate behind it. The crest names the ritual and holds a photograph in the gold arch: the bowl for धृतपान (`images/shagun-dhritpan.jpg`), Vinayak and turmeric for विनायक / हल्दी-रस्म (`images/shagun-haldi.jpg`), the gift tray for मायरा (`images/shagun-mayra.jpg`), the celebration for बड़ी बान्दोली (`images/shagun-bandoli.jpg`), the procession for बारात स्वागत (`images/shagun-baraat.jpg`), the feast for आशीर्वाद समारोह एवं प्रीतिभोज (`images/shagun-ashirvad.jpg`), and the fire for पाणिग्रहण संस्कार (`images/shagun-panigrahan.jpg`). The foot is a haveli jali: दिन carries a surya seal, समय a haveli clock, and स्थल a jharokha, and only where the patrika already gives a place. Hover straightens the plate, lifts the glass, brightens the seals, and brings that picture closer. Saturday cards use kesariya in the crest. Wednesday and Friday sit on their own rows; the three wedding rituals share the row under them, so a shorter day does not leave an empty hole.

स्नेही पक्ष is a set of haveli cards. ननिहाल पक्ष · राठौड़ spans the row, and the names inside it fill across. भण्डारिया, जंवाई and साडू each have their own card on the next row. A leftover name, and every “एवं समस्त…” line, spans its card.

अति विशिष्ट अतिथि, स्वागतकर्ता, दर्शनाभिलाषी, विशेष प्रार्थी, and मीठी मनवार use the same haveli card. A guest of honour has a maroon crest with the name and the role beneath it; the fifth card sits centred. The other lists are lines with a kesariya diamond, two to a row, and an odd last name spans the card. `prefers-reduced-motion` turns the motion off.

स्नेह भरा निमंत्रण is the sender's letter: a maroon crest for सोलंकी परिवार, then the address and the verse on sandstone. आशीर्वाद एवं प्रीतिभोज opens with the flower gate of Maharana Pratap Children Park (`images/park-gate.jpg`), then the park name, with the map in a gold frame. The closing wish is a haveli card on the night page. Once it enters, Krishna weds Bhagatsingh, हार्दिक शुभकामनाओं सहित, the family line, each phone, the address, and the WhatsApp button rise on their own beat. The two crest lines then keep a gold breath.

मंगल परिचय opens with a haveli card: the three नमः lines on a maroon crest, then the hosts and the invitation on sandstone. The bride and groom photographs sit in a jharokha arch. The clan sits above the name on a maroon crest, and संग is the gold seal between them. The photographs live in `images/dulhan.jpg` and `images/dulha.jpg`. `images/park-gate.jpg` is the illuminated flower entrance of the park. `images/jodhpur.jpg` remains the Mehrangarh city view and is no longer used on the page. Replace a file of the same name to swap the art. The Google Maps pin uses Maharana Pratap Children Park in BJS Colony, in front of Krishna Mandir (26.30204, 73.060116).

## Names to re-check before sharing widely

The source note said a few names were hard to read in the original print and were written without clear commas. They were split on titles (`ठा.`, `कुं.`, `भ.`). Please match these against the paper card before the invitation is sent out, especially:

- दर्शनाभिलाषी and ननिहाल lists
- विशेष प्रार्थी places
- डॉ. मीताजी मुल्तानी (no title was printed beside this name)

Phones on the card: **9571645611**, **9928219817**.
