"""Build the Uttarakhand One-Liner book (Hindi + English) as B5 (176 x 250 mm) PDFs.

Front matter (title page, copyright, about + QR links, contents) and a last
page are added around the chapters; the outer cover is built separately by
scripts/build_cover.py.

    python -I scripts/build_book.py                 # all chapters listed in book.yaml
    python -I scripts/build_book.py geo-water       # only these chapter ids (sample)

Content: content/<chapter-id>.yaml, bilingual (en/hi side by side), each fact
carrying a `src` tag (Q:<question id suffix> for the question bank, N:<book
page> for B.S. Negi). Source tags are kept in the data and never printed.
Chapters are numbered in book.yaml order.

Space management
- Chapters follow each other on the same page: a chapter starts right below
  the previous one unless its opener would land in the bottom part of a page.
- Every fact, table row and heading is a "unit" carrying an invisible marker.
  After rendering, the units that fell on a chapter's last page are moved into
  a second two-column block; a block that fits on one page is balanced by
  Chromium (a multi-page one is not), so the chapter ends with two even
  columns and the next chapter can use the rest of the page.
- Tables and boxes split between columns row by row (header repeated).
- The running header (current chapter) is stamped afterwards with PyMuPDF:
  Chromium's named pages would force a page break at every chapter.
- A space audit prints pages where a column ends well above the bottom.
Output: out/one-liner-<lang>[-sample].pdf (+ the .html used).
"""
import html, os, re, sys, time
import yaml
import pymupdf
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT, OUT, FONTS = (os.path.join(HERE, d) for d in ("content", "out", "fonts"))
ORANGE = "#F59307"
MM = 72 / 25.4
MARGIN_TOP, MARGIN_BOTTOM = 14 * MM, 12 * MM
MARGIN_SIDE = 10 * MM  # B5 page: 176 x 250 mm
MIN_UNITS_UNDER_OPENER = 3
MIN_HEAD = 2  # a head block may be just the first heading and one (long, splittable) fact  # heading + 2 items must fit under a chapter opener, else it starts a new page
GAP_REPORT_MM = 18   # space audit: report a column ending this far above the bottom margin
UNIT = re.compile(r"@@U:([\w-]+):(\d+)@@")
OPENER = re.compile(r"@@CH:([\w-]+)@@")

UI = {
    "en": {"book": "Uttarakhand One-Liner", "brand": "UKPSC Decoded", "contents": "Contents", "chapter": "Chapter"},
    "hi": {"book": "उत्तराखण्ड वन-लाइनर", "brand": "UKPSC Decoded", "contents": "अनुक्रमणिका", "chapter": "अध्याय"},
}
BACK_PAGES = 1  # the back page after the last chapter: no running header, not in the space audit

SITE = "www.ukpscdecoded.in"
LINKS = {  # printed text, QR target
    "web": ("www.ukpscdecoded.in", "https://www.ukpscdecoded.in"),
    "courses": ("ukpscdecoded.in/courses", "https://www.ukpscdecoded.in/courses"),
    "tests": ("ukpscdecoded.in/test-platform", "https://www.ukpscdecoded.in/test-platform"),
    "youtube": ("youtube.com/@ukpscdecoded", "https://www.youtube.com/@ukpscdecoded"),
    "telegram": ("t.me/ukpscdecoded", "https://t.me/ukpscdecoded"),
    "instagram": ("instagram.com/ukpscdecoded", "https://instagram.com/ukpscdecoded"),
    "email": ("ukpscdecoded@gmail.com", None),
}

FRONT = {
    "en": {
        "kicker": "UKPSC · UKSSSC · Upper PCS · Group 'C' · Patwari · VDO",
        "title": "Uttarakhand<br>One-Liner",
        "sub": "Every fact of Uttarakhand GK in one place — geography, history, culture, polity, economy, people and current affairs",
        "chips": ["30 chapters", "Exam-tested facts", "Tables & quick lists", "Current affairs 2025–26"],
        "edition": "English Edition · 2026",
        "copy_title": "Uttarakhand One-Liner (English)",
        "copy": [
            "First edition: November 2026",
            "© 2026 UKPSC Decoded. All rights reserved.",
            "No part of this book may be reproduced, stored, scanned, shared as a PDF or transmitted in any form "
            "without written permission from the publisher, except short quotations for review.",
            "<b>Disclaimer.</b> Every fact has been cross-checked against previous-year and practice exam questions "
            "and standard references. Facts that differ between sources are printed as the exams have asked them. "
            "Offices, rankings and schemes change often — always confirm current figures from official notifications. "
            "The publisher is not responsible for any loss arising from an error.",
            "<b>Found a mistake?</b> Tell us on Telegram or by email; corrections go into the next edition.",
        ],
        "publisher": "Published by <b>UKPSC Decoded</b>",
        "about_h": "About UKPSC Decoded",
        "about": "UKPSC Decoded was started by <b>Bhanu Joshi</b> — a UPSC and UKPSC aspirant with nine years of preparation behind him — "
                 "to make quality Uttarakhand exam preparation available to every aspirant, wherever they live and whatever their budget. "
                 "Coaching is concentrated in Dehradun and Haldwani; our courses, tests and books bring the same preparation to every village of the state.",
        "creds": ["UKPSC Upper PCS — cleared the cut-off", "UKPSC Lower PCS — Rank 9", "5+ years teaching at UPSC coaching institutes"],
        "offer_h": "Prepare with us",
        "offer": [
            ("UKPSC / Upper PCS Prelims Crash Course", "the most-repeated topics, built from our PYQ tracker"),
            ("Uttarakhand GK Intensive", "every part of the state syllabus, chapter by chapter — the companion course to this book"),
            ("Test Series", "full-length tests on the real pattern, with detailed solutions and all-India style ranking"),
            ("Personalised Mentorship", "one-to-one guidance with Bhanu Joshi, from basics to answer writing"),
        ],
        "follow_h": "Free daily practice",
        "follow": "Daily MCQs on Telegram, free lessons and strategy videos on YouTube, and articles on the website.",
        "qr_web": "Website", "qr_courses": "Courses", "qr_yt": "YouTube", "qr_tg": "Telegram",
        "use_h": "How to use this book",
        "use": [
            "Chapters follow the UKPSC syllabus: geography, history, culture, polity, economy, then miscellany and current affairs.",
            "<b>Bold</b> words are the ones exams ask about — names, dates, numbers and 'firsts'. Revise them first.",
            "Tables collect lists (rivers, passes, schemes, award winners) for quick revision on the last days.",
            "Read a chapter, then attempt its tests on our test platform — that is how the facts stay in memory.",
        ],
        "back_h": "Read. Practise. Get selected.",
        "back": "This book gathers the Uttarakhand facts that UKPSC and UKSSSC papers keep asking — every district, river, dynasty, "
                "movement, scheme and personality — in short, exam-ready lines with tables for quick revision.",
        "back_list": ["Geography & districts", "History & freedom struggle", "Folk culture, fairs & temples",
                      "Polity & economy", "People, awards & sports", "Current affairs 2025–26"],
        "back_cta": "Test yourself on what you read",
        "back_cta2": "Chapter-wise and full-length tests on the real exam pattern",
    },
    "hi": {
        "kicker": "UKPSC · UKSSSC · अपर PCS · समूह 'ग' · पटवारी · VDO",
        "title": "उत्तराखण्ड<br>वन-लाइनर",
        "sub": "उत्तराखण्ड सामान्य ज्ञान के सभी तथ्य एक जगह — भूगोल, इतिहास, संस्कृति, राजव्यवस्था, अर्थव्यवस्था, व्यक्तित्व एवं समसामयिकी",
        "chips": ["30 अध्याय", "परीक्षा में पूछे गए तथ्य", "तालिकाएँ एवं त्वरित सूचियाँ", "समसामयिकी 2025–26"],
        "edition": "हिन्दी संस्करण · 2026",
        "copy_title": "उत्तराखण्ड वन-लाइनर (हिन्दी)",
        "copy": [
            "प्रथम संस्करण: नवम्बर 2026",
            "© 2026 UKPSC Decoded. सर्वाधिकार सुरक्षित।",
            "प्रकाशक की लिखित अनुमति के बिना इस पुस्तक के किसी भी अंश की प्रतिलिपि, स्कैन, PDF के रूप में साझा करना "
            "या किसी भी रूप में प्रसारण वर्जित है; समीक्षा हेतु छोटे उद्धरण इसके अपवाद हैं।",
            "<b>अस्वीकरण।</b> प्रत्येक तथ्य का मिलान विगत वर्षों व अभ्यास प्रश्नों तथा मानक स्रोतों से किया गया है। "
            "जहाँ स्रोतों में अंतर है, वहाँ परीक्षा में पूछे गए रूप को लिया गया है। पद, रैंकिंग व योजनाएँ बदलती रहती हैं — "
            "नवीनतम आँकड़े आधिकारिक अधिसूचना से अवश्य जाँचें। किसी त्रुटि से हुई हानि के लिए प्रकाशक उत्तरदायी नहीं है।",
            "<b>कोई त्रुटि मिली?</b> टेलीग्राम या ईमेल पर बताएँ; सुधार अगले संस्करण में किए जाएँगे।",
        ],
        "publisher": "प्रकाशक: <b>UKPSC Decoded</b>",
        "about_h": "UKPSC Decoded के बारे में",
        "about": "UKPSC Decoded की शुरुआत <b>भानु जोशी</b> ने की — नौ वर्षों की तैयारी वाले UPSC व UKPSC अभ्यर्थी — "
                 "ताकि उत्तराखण्ड की परीक्षाओं की गुणवत्तापूर्ण तैयारी हर अभ्यर्थी तक पहुँचे, चाहे वह कहीं भी रहता हो और बजट जो भी हो। "
                 "कोचिंग देहरादून व हल्द्वानी तक सिमटी है; हमारे कोर्स, टेस्ट और पुस्तकें वही तैयारी राज्य के हर गाँव तक पहुँचाते हैं।",
        "creds": ["UKPSC अपर PCS — कट-ऑफ उत्तीर्ण", "UKPSC लोअर PCS — रैंक 9", "UPSC कोचिंग संस्थानों में 5+ वर्ष अध्यापन"],
        "offer_h": "हमारे साथ तैयारी करें",
        "offer": [
            ("UKPSC / अपर PCS प्रारम्भिक क्रैश कोर्स", "सबसे अधिक दोहराए गए विषय, हमारे PYQ ट्रैकर से तैयार"),
            ("उत्तराखण्ड GK इंटेंसिव", "राज्य पाठ्यक्रम का हर भाग, अध्यायवार — इस पुस्तक का साथी कोर्स"),
            ("टेस्ट सीरीज", "वास्तविक पैटर्न पर पूर्ण टेस्ट, विस्तृत हल व रैंकिंग सहित"),
            ("व्यक्तिगत मेंटरशिप", "भानु जोशी के साथ व्यक्तिगत मार्गदर्शन, आधार से उत्तर लेखन तक"),
        ],
        "follow_h": "निःशुल्क दैनिक अभ्यास",
        "follow": "टेलीग्राम पर दैनिक MCQ, यूट्यूब पर निःशुल्क पाठ व रणनीति वीडियो, और वेबसाइट पर लेख।",
        "qr_web": "वेबसाइट", "qr_courses": "कोर्स", "qr_yt": "यूट्यूब", "qr_tg": "टेलीग्राम",
        "use_h": "पुस्तक का उपयोग कैसे करें",
        "use": [
            "अध्याय UKPSC पाठ्यक्रम के क्रम में हैं: भूगोल, इतिहास, संस्कृति, राजव्यवस्था, अर्थव्यवस्था, फिर विविध व समसामयिकी।",
            "<b>मोटे अक्षर</b> वाले शब्द परीक्षा में पूछे जाते हैं — नाम, तिथियाँ, संख्याएँ व 'प्रथम'। इन्हें पहले दोहराएँ।",
            "तालिकाओं में सूचियाँ (नदियाँ, दर्रे, योजनाएँ, पुरस्कार विजेता) हैं — अंतिम दिनों के त्वरित रिवीजन हेतु।",
            "अध्याय पढ़ें, फिर हमारे टेस्ट प्लेटफॉर्म पर उसके टेस्ट दें — इसी से तथ्य याद रहते हैं।",
        ],
        "back_h": "पढ़ें। अभ्यास करें। चयनित हों।",
        "back": "यह पुस्तक उत्तराखण्ड के वे तथ्य एक जगह देती है जो UKPSC व UKSSSC के प्रश्नपत्रों में बार-बार पूछे जाते हैं — हर जनपद, नदी, "
                "राजवंश, आन्दोलन, योजना व व्यक्तित्व — छोटी, परीक्षा-उपयोगी पंक्तियों और त्वरित रिवीजन हेतु तालिकाओं में।",
        "back_list": ["भूगोल एवं जनपद", "इतिहास एवं स्वतंत्रता संग्राम", "लोक संस्कृति, मेले एवं मंदिर",
                      "राजव्यवस्था एवं अर्थव्यवस्था", "व्यक्तित्व, पुरस्कार एवं खेल", "समसामयिकी 2025–26"],
        "back_cta": "जो पढ़ा, उसका टेस्ट दें",
        "back_cta2": "वास्तविक परीक्षा पैटर्न पर अध्यायवार व पूर्ण टेस्ट",
    },
}

MOUNTAINS = ("<svg class='mtn' viewBox='0 0 176 60' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'>"
             "<path d='M0 60 L0 38 L18 24 L28 31 L44 12 L56 26 L66 20 L82 36 L98 16 L110 27 L121 8 L135 30 L148 22 L160 33 L176 21 L176 60 Z' fill='#fff' opacity='0.18'/>"
             "<path d='M0 60 L0 46 L22 34 L36 42 L52 28 L70 44 L88 30 L104 42 L124 26 L142 40 L158 33 L176 41 L176 60 Z' fill='#fff' opacity='0.3'/>"
             "<path d='M121 8 L117 14 L121 12 L125 15 Z M98 16 L95 21 L98 19 L101 22 Z M44 12 L41 17 L44 15 L47 18 Z' fill='#fff' opacity='0.9'/>"
             "</svg>")


def qr(key, label):
    text, url = LINKS[key]
    return (f"<div class='qrbox'><div class='qr'>{QR_SVG.get(url, '')}</div>"
            f"<div class='qrl'>{label}</div><div class='qrt'>{text}</div></div>")


def front_matter(lang, toc):
    f, ui = FRONT[lang], UI[lang]
    chips = "".join(f"<span>{c}</span>" for c in f["chips"])
    cover = (f"<div class='cover'>"
             f"<div class='cv-top'><div class='cv-brand'>UKPSC <b>Decoded</b></div><div class='cv-kicker'>{f['kicker']}</div>"
             f"<h1>{f['title']}</h1><div class='cv-sub'>{f['sub']}</div>{MOUNTAINS}</div>"
             f"<div class='cv-bottom'><div class='chips'>{chips}</div>"
             f"<div class='cv-foot'><div><div class='cv-ed'>{f['edition']}</div><div class='cv-site'>{SITE}</div></div>"
             f"{qr('web', '')}</div></div></div>")
    copy = (f"<div class='front plain copyright'><div class='cp-title'>{f['copy_title']}</div>"
            + "".join(f"<p>{p}</p>" for p in f["copy"])
            + f"<div class='cp-pub'>{f['publisher']}<br>{LINKS['web'][0]} · {LINKS['email'][0]}<br>"
              f"Telegram {LINKS['telegram'][0]} · YouTube {LINKS['youtube'][0]}</div></div>")
    offer = "".join(f"<li><b>{a}</b> — {b}</li>" for a, b in f["offer"])
    use = "".join(f"<li>{u}</li>" for u in f["use"])
    about = (f"<div class='front plain about'><h1>{f['about_h']}</h1><p class='lead'>{f['about']}</p>"
             f"<div class='creds'>{''.join(f'<span>✓ {c}</span>' for c in f['creds'])}</div>"
             f"<h2>{f['offer_h']}</h2><ul class='facts'>{offer}</ul>"
             f"<h2>{f['follow_h']}</h2><p>{f['follow']}</p>"
             f"<div class='qrrow'>{qr('web', f['qr_web'])}{qr('courses', f['qr_courses'])}"
             f"{qr('youtube', f['qr_yt'])}{qr('telegram', f['qr_tg'])}</div>"
             f"<h2>{f['use_h']}</h2><ul class='facts'>{use}</ul></div>")
    return cover + copy + about + toc


def back_page(lang):
    f = FRONT[lang]
    items = "".join(f"<li>{x}</li>" for x in f["back_list"])
    return (f"<div class='backpage'><div class='bk-in'>"
            f"<div class='cv-brand'>UKPSC <b>Decoded</b></div>"
            f"<h1>{f['back_h']}</h1><p>{f['back']}</p><ul>{items}</ul>"
            f"<div class='bk-cta'><div><div class='bk-ctah'>{f['back_cta']}</div><div>{f['back_cta2']}</div>"
            f"<div class='bk-url'>{LINKS['tests'][0]}</div></div>{qr('tests', '')}</div>"
            f"<div class='qrrow light'>{qr('courses', f['qr_courses'])}{qr('youtube', f['qr_yt'])}{qr('telegram', f['qr_tg'])}</div>"
            f"<div class='bk-site'>{SITE}</div></div>{MOUNTAINS}</div>")


INK = "#14213D"  # deep navy used with the brand orange on the cover and title pages
FRONT_CSS = f"""
@page bleed {{ margin: 0; @bottom-center {{ content: none; }} }}
.cover, .backpage {{ page: bleed; width: 176mm; height: 249.6mm; overflow: hidden; position: relative; break-after: page; }}
.backpage {{ break-before: page; break-after: auto; background: {INK}; color: #fff; }}
.cover {{ background: #fff; display: flex; flex-direction: column; }}
.cv-top {{ background: linear-gradient(160deg, {ORANGE} 0%, #E0700A 100%); color: #fff; padding: 16mm 14mm 0; position: relative; height: 158mm; }}
.cv-brand {{ font: 600 10pt Poppins; letter-spacing: 0.04em; }}
.cv-brand b {{ font-weight: 700; color: {INK}; background: #fff; padding: 0.3mm 1.6mm; border-radius: 1mm; margin-left: 0.6mm; }}
.backpage .cv-brand b {{ color: {INK}; }}
.cv-kicker {{ font: 500 8pt Poppins; margin-top: 10mm; opacity: 0.95; letter-spacing: 0.03em; }}
.cover h1 {{ font: 700 40pt/1.02 Poppins; margin: 4mm 0 5mm; }}
.cover:lang(hi) h1, html[lang=hi] .cover h1 {{ font-family: Mukta, Poppins; font-size: 44pt; line-height: 1.05; }}
.cv-sub {{ font-size: 11.5pt; line-height: 1.35; max-width: 130mm; }}
.mtn {{ position: absolute; left: 0; right: 0; bottom: 0; width: 176mm; height: 34mm; display: block; }}
.cv-bottom {{ flex: 1; padding: 9mm 14mm 10mm; display: flex; flex-direction: column; justify-content: space-between; }}
.chips {{ display: flex; flex-wrap: wrap; gap: 2.5mm; }}
.chips span {{ font: 600 8.6pt Poppins; color: {INK}; border: 0.8pt solid {ORANGE}; border-radius: 5mm; padding: 1.4mm 3.6mm; }}
html[lang=hi] .chips span {{ font-family: Mukta, Poppins; font-size: 10pt; }}
.cv-foot {{ display: flex; align-items: flex-end; justify-content: space-between; border-top: 2pt solid {INK}; padding-top: 4mm; }}
.cv-ed {{ font: 700 11pt Poppins; color: {INK}; }}
html[lang=hi] .cv-ed {{ font-family: Mukta, Poppins; font-size: 12.5pt; }}
.cv-site {{ font: 600 10pt Poppins; color: {ORANGE}; margin-top: 1mm; }}
.qr {{ width: 20mm; height: 20mm; }}
.qr svg {{ width: 100%; height: 100%; display: block; }}
.qrbox {{ text-align: center; }}
.qrl {{ font: 600 8pt Poppins; margin-top: 1.2mm; }}
html[lang=hi] .qrl {{ font-family: Mukta, Poppins; font-size: 9pt; }}
.qrt {{ font-size: 7pt; color: #666; }}
.qrrow {{ display: flex; justify-content: space-between; margin: 3mm 0 4mm; }}
.plain h1 {{ font: 700 18pt Poppins; color: {ORANGE}; margin: 0 0 3mm; }}
html[lang=hi] .plain h1 {{ font-family: Mukta, Poppins; font-size: 20pt; }}
.plain h2 {{ margin-top: 4mm; }}
.plain p {{ margin: 0 0 2.4mm; }}
.about .lead {{ font-size: 1.08em; }}
.creds {{ display: flex; flex-direction: column; gap: 1.4mm; border-left: 2.2mm solid {ORANGE}; background: #fff4e3; padding: 2.4mm 3mm; margin: 1mm 0 2mm; font: 600 9.5pt Poppins; color: {INK}; }}
html[lang=hi] .creds {{ font-family: Mukta, Poppins; font-size: 10.5pt; }}
.copyright {{ display: flex; flex-direction: column; justify-content: flex-end; height: 222mm; font-size: 8.4pt; color: #333; }}
.cp-title {{ font: 700 12pt Poppins; color: {INK}; margin-bottom: 3mm; }}
html[lang=hi] .cp-title {{ font-family: Mukta, Poppins; font-size: 13pt; }}
.cp-pub {{ border-top: 0.8pt solid {ORANGE}; padding-top: 2.5mm; margin-top: 2mm; line-height: 1.5; }}
.bk-in {{ padding: 18mm 14mm 0; position: relative; z-index: 1; }}
.backpage h1 {{ font: 700 22pt/1.15 Poppins; color: {ORANGE}; margin: 8mm 0 4mm; }}
html[lang=hi] .backpage h1 {{ font-family: Mukta, Poppins; font-size: 26pt; }}
.backpage p {{ font-size: 10.5pt; line-height: 1.45; margin: 0 0 4mm; }}
.backpage ul {{ columns: 2; margin: 0 0 6mm; padding-left: 5mm; font-size: 10pt; }}
.backpage li {{ margin-bottom: 1.2mm; }}
.backpage .qr {{ background: #fff; padding: 1.2mm; }}
.backpage .qrt {{ color: #cfd6e6; }}
.bk-cta {{ display: flex; align-items: center; justify-content: space-between; gap: 5mm; background: {ORANGE}; border-radius: 2mm; padding: 4mm 5mm; margin-bottom: 6mm; }}
.bk-ctah {{ font: 700 13pt Poppins; }}
html[lang=hi] .bk-ctah {{ font-family: Mukta, Poppins; font-size: 15pt; }}
.bk-url {{ font: 600 9.5pt Poppins; color: {INK}; margin-top: 1.5mm; }}
.bk-site {{ font: 700 13pt Poppins; color: #fff; text-align: center; margin-top: 2mm; }}
.backpage .mtn {{ opacity: 0.5; }}
"""

QR_SVG = {}  # url -> svg, filled once per run by make_qr_codes()


def make_qr_codes(page):
    """Draw every QR code once (qrcode-generator in the browser) so the book pages need no network."""
    urls = [u for _, u in LINKS.values() if u]
    page.set_content("<html><body>" + QR_JS.replace("document.querySelectorAll", "void 0&&document") + "</body></html>",
                     wait_until="load", timeout=60000)
    svgs = page.evaluate("""(urls) => urls.map(u => { const q = qrcode(0, 'M'); q.addData(u); q.make();
                            return q.createSvgTag({cellSize: 2, margin: 0, scalable: true}); })""", urls)
    QR_SVG.update(zip(urls, svgs))


QR_JS = ("<script src='https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js'></script>"
         "<script>document.querySelectorAll('.qr').forEach(function(e){try{var q=qrcode(0,'M');"
         "q.addData(e.dataset.url);q.make();e.innerHTML=q.createSvgTag({cellSize:2,margin:0,scalable:true});}"
         "catch(err){}});</script>")


def inline(text):
    """Escape, then **bold** and __muted__ markup."""
    t = html.escape(str(text).strip())
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    t = re.sub(r"__(.+?)__", r"<span class='mut'>\1</span>", t)
    return t


def pick(v, lang):
    return v.get(lang, "") if isinstance(v, dict) else v


# ---------- units: the smallest pieces the layout may move between columns ----------

def units(ch, lang):
    """[(group, open_html, close_html, body_html)] in order; consecutive units of one group share a wrapper."""
    out = []
    for si, s in enumerate(ch["sections"]):
        out.append((("h2", si), "", "", f"<h2>{inline(pick(s['h'], lang))}</h2>"))
        for bi, b in enumerate(s["blocks"]):
            gid = (si, bi)
            if "facts" in b:
                for f in b["facts"]:
                    out.append((("ul",) + gid, "<ul class='facts'>", "</ul>", f"<li>{inline(pick(f, lang))}</li>"))
            elif "box" in b:
                bx = b["box"]
                o, c = "<div class='box'><ul class='facts'>", "</ul></div>"
                out.append((("box",) + gid, o, c, f"<li class='boxh'>{inline(pick(bx['title'], lang))}</li>"))
                for f in bx["facts"]:
                    out.append((("box",) + gid, o, c, f"<li>{inline(pick(f, lang))}</li>"))
            elif "table" in b or "timeline" in b:
                if "table" in b:
                    t = b["table"]
                    head = "".join(f"<th>{inline(c)}</th>" for c in t["cols"][lang])
                    o = f"<div class='tbl'><table><thead><tr>{head}</tr></thead><tbody>"
                    rows = ["".join(f"<td>{inline(c)}</td>" for c in r[lang]) for r in t["rows"]]
                    title, note = t.get("title"), t.get("note")
                else:
                    t = b["timeline"]
                    ev = t["events"] if isinstance(t, dict) else t
                    o = "<div class='tbl'><table class='tl'><tbody>"
                    rows = [f"<td class='yr'>{inline(e['year'])}</td><td>{inline(pick(e, lang))}</td>" for e in ev]
                    title = t.get("title") if isinstance(t, dict) else None
                    note = t.get("note") if isinstance(t, dict) else None
                if title:
                    out.append((("cap",) + gid, "", "", f"<div class='cap'>{inline(pick(title, lang))}</div>"))
                # a very long row may continue in the next column instead of leaving a gap
                rows = [f"<tr class='long'>{r}</tr>" if len(re.sub(r"<[^>]+>", "", r)) > 260 else f"<tr>{r}</tr>"
                        for r in rows]
                if len(rows) <= 3:  # tiny table: one unit, never split
                    rows = ["".join(rows)]
                for r in rows:
                    out.append((("tbl",) + gid, o, "</tbody></table></div>", r))
                if note:
                    out.append((("note",) + gid, "", "", f"<div class='tnote'>{inline(pick(note, lang))}</div>"))
            else:
                raise ValueError(f"unknown block {list(b)}")
    return out


def tag(body, cid, k):
    """Put the invisible unit marker inside the unit's first text cell."""
    m = f"<span class='u'>@@U:{cid}:{k}@@</span>"
    return re.sub(r"^(<(?:li|h2|div|tr)[^>]*>(?:<td[^>]*>)?)", lambda x: x.group(1) + m, body, count=1)


def render_units(us, cid, lo, hi):
    parts, cur = [], None
    for k in range(lo, hi):
        g, o, c, body = us[k]
        if g != cur:
            if cur is not None:
                parts.append(us[k - 1][2])
            run = next((j for j in range(k, hi) if us[j][0] != g), hi) - k
            if g[0] == "tbl" and run <= 3:  # a short piece of a table never splits (header stays with its rows)
                o = o.replace("<div class='tbl'>", "<div class='tbl keep'>", 1)
            parts.append(o)
            cur = g
        parts.append(tag(body, cid, k))
    if cur is not None:
        parts.append(us[hi - 1][2])
    return "".join(parts)


def render_chapter(ch, lang, newpage, split, head=None):
    ui = UI[lang]
    cid = ch["id"]
    us = units(ch, lang)
    cls = "opener newpage" if cid in newpage else "opener"
    parts = [
        f"<div class='{cls}' id='{cid}'><span class='marker'>@@CH:{cid}@@</span>"
        f"<div class='chnum'>{ui['chapter']} {ch['num']}</div>"
        f"<h1>{inline(pick(ch['title'], lang))}</h1>"
        f"<div class='part'>{inline(pick(ch['part'], lang))}</div></div>"
    ]
    # block boundaries: an optional short head block (fits the space left on the previous chapter's last
    # page — Chrome will not start a long multi-page column block there), the body, and the balanced tail
    cuts = sorted({0, len(us)} | {x for x in ((head or {}).get(cid), split.get(cid)) if x and 0 < x < len(us)})
    for lo, hi in zip(cuts, cuts[1:]):
        cls = "cols tail" if hi == len(us) and lo == split.get(cid) else "cols"
        parts.append(f"<div class='{cls}'><div class='cstart'></div>{render_units(us, cid, lo, hi)}</div>")
    return "\n".join(parts), len(us)


def css(lang):
    body_font = "'Mukta', 'Poppins'" if lang == "hi" else "'Inter', 'Mukta'"
    size, lh = ("9.6pt", 1.28) if lang == "hi" else ("9pt", 1.3)
    bullet_top = "0.5em" if lang == "hi" else "0.55em"
    fonts = "\n".join(
        f"@font-face{{font-family:'{fam}';src:url('file:///{FONTS.replace(os.sep, '/')}/{file}');font-weight:{w};}}"
        for fam, file, w in [
            ("Poppins", "Poppins-Medium.ttf", 500), ("Poppins", "Poppins-SemiBold.ttf", 600),
            ("Poppins", "Poppins-Bold.ttf", 700), ("Inter", "Inter.ttf", "100 900"),
            ("Mukta", "Mukta-Regular.ttf", 400), ("Mukta", "Mukta-Medium.ttf", 500),
            ("Mukta", "Mukta-SemiBold.ttf", 600), ("Mukta", "Mukta-Bold.ttf", 700),
        ]
    )
    return f"""{fonts}
@page {{
  size: 176mm 250mm; margin: 14mm 10mm 12mm 10mm;
  @bottom-center {{ content: counter(page); font: 600 8pt Poppins; color: #444; }}
}}
@page front {{ @bottom-center {{ content: none; }} }}
* {{ box-sizing: border-box; }}
html {{ -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
body {{ margin: 0; font-family: {body_font}, sans-serif; font-size: {size}; line-height: {lh}; color: #1b1b1b; background: #fff; }}
b {{ font-weight: 600; color: #000; }}
.mut {{ color: #666; font-size: 0.92em; }}
.u {{ font-size: 0.5pt; line-height: 0; color: #fff; white-space: nowrap; }}
.front {{ page: front; break-after: page; }}
.toc h1 {{ font: 700 20pt Poppins; color: {ORANGE}; margin: 0 0 4mm; }}
.toc table {{ width: 100%; border-collapse: collapse; font-size: 10.5pt; }}
.toc td {{ padding: 1.5mm 0; border-bottom: 0.5pt dotted #bbb; }}
.toc td.n {{ width: 22mm; font: 600 9pt Poppins; color: {ORANGE}; }}
.toc td.p {{ width: 14mm; text-align: right; font: 600 9.5pt Poppins; }}
.toc tr.part td {{ font: 700 9pt Poppins; color: #fff; background: {ORANGE}; padding: 1mm 2mm; border: none; }}
.cols {{ column-count: 2; column-gap: 4.5mm; column-rule: 0.4pt solid #e6e6e6; }}
.opener {{ background: {ORANGE}; color: #fff; padding: 2mm 4mm 2mm; border-radius: 1.6mm; margin: 4mm 0 2.4mm; position: relative; break-inside: avoid; break-after: avoid; display: flex; align-items: baseline; gap: 3mm; }}
.opener.newpage {{ break-before: page; }}
main > .opener:first-child {{ margin-top: 0; }}
.opener .chnum {{ font: 600 8pt Poppins; letter-spacing: 0.06em; text-transform: uppercase; opacity: 0.95; white-space: nowrap; }}
.opener h1 {{ font: 700 14pt/1.15 Poppins; margin: 0; flex: 1; }}
.opener .part {{ font: 500 7.5pt Poppins; opacity: 0.9; white-space: nowrap; }}
.marker {{ font-size: 1pt; line-height: 1pt; color: {ORANGE}; position: absolute; left: 1mm; top: 0.3mm; }}
h2 {{ font: 600 10.2pt/1.25 Poppins; color: #222; margin: 2.4mm 0 1.3mm; padding: 0.6mm 0 0.6mm 2mm; border-left: 2.2mm solid {ORANGE}; background: #fff4e3; break-after: avoid; break-inside: avoid; }}
.cols > h2:first-child, .cols > .cstart + h2 {{ margin-top: 0; }}
/* a zero-height first child: without it Chrome may push a column block that opens with a heading to the next page */
.cstart {{ height: 0; }}
ul.facts {{ list-style: none; margin: 0 0 1.5mm; padding: 0; }}
ul.facts li {{ position: relative; padding-left: 3mm; margin: 0 0 0.7mm; break-inside: auto; orphans: 2; widows: 2; }}
/* long bullets may continue in the next column (>= 2 lines each side) so columns stay full */
ul.facts li::before {{ content: ""; position: absolute; left: 0.3mm; top: {bullet_top}; width: 1.3mm; height: 1.3mm; background: {ORANGE}; border-radius: 0.3mm; }}
.cap {{ font: 600 8.4pt Poppins; color: {ORANGE}; margin: 0.6mm 0 0.6mm; break-after: avoid; break-inside: avoid; }}
.tbl {{ margin: 0 0 2mm; }}
.tbl.keep {{ break-inside: avoid; }}
.tbl tr {{ break-inside: avoid; }}
.tbl tr.long {{ break-inside: auto; orphans: 2; widows: 2; }}
.tbl tbody tr:first-child {{ break-before: avoid; }}
.tbl thead {{ break-after: avoid; }}
.tbl table {{ width: 100%; border-collapse: collapse; font-size: 0.9em; line-height: 1.22; }}
.tbl th {{ background: {ORANGE}; color: #fff; font-weight: 600; text-align: left; padding: 0.8mm 1.1mm; }}
.tbl td {{ padding: 0.55mm 1.1mm; border-bottom: 0.4pt solid #ecd9bd; vertical-align: top; }}
.tbl tbody tr:nth-child(even) td {{ background: #fff8ee; }}
.tnote {{ font-size: 0.85em; color: #555; margin: -1.4mm 0 2mm; break-before: avoid; break-inside: avoid; }}
.tbl table.tl td {{ border-bottom: 0.4pt solid #eee; }}
.tbl table.tl tr:nth-child(even) td {{ background: transparent; }}
.tbl table.tl td.yr {{ width: 15mm; font: 600 8pt Poppins; color: {ORANGE}; white-space: nowrap; }}
.box {{ border: 0.8pt solid {ORANGE}; border-radius: 1.5mm; padding: 1.3mm 2mm 0.5mm; margin: 0.6mm 0 2mm; background: #fffaf2; -webkit-box-decoration-break: clone; box-decoration-break: clone; }}
.box ul.facts {{ margin-bottom: 0.6mm; }}
.box li.boxh {{ font: 600 8.6pt Poppins; color: {ORANGE}; padding-left: 0; margin-bottom: 0.8mm; break-after: avoid; }}
.box li.boxh::before {{ display: none; }}
"""


def build_html(lang, chapters, pages, newpage, split, head=None):
    ui = UI[lang]
    rows, last_part = [], None
    for c in chapters:
        part = pick(c["part"], lang)
        if part != last_part:
            rows.append(f"<tr class='part'><td colspan='3'>{inline(part)}</td></tr>")
            last_part = part
        p = pages.get(c["id"], "")
        rows.append(f"<tr><td class='n'>{ui['chapter']} {c['num']}</td><td>{inline(pick(c['title'], lang))}</td><td class='p'>{p}</td></tr>")
    toc = f"<div class='front toc'><h1>{ui['contents']}</h1><table>{''.join(rows)}</table></div>"
    body, counts = [], {}
    for c in chapters:
        h, n = render_chapter(c, lang, newpage, split, head)
        body.append(h)
        counts[c["id"]] = n
    doc = (f"<!doctype html><html lang='{lang}'><head><meta charset='utf-8'><title>{ui['book']}</title>"
           f"<style>{css(lang)}{FRONT_CSS}</style></head><body>{front_matter(lang, toc)}<main>{''.join(body)}</main>"
           f"{back_page(lang)}</body></html>")
    return doc, counts


def scan(pdf):
    """Opener positions [(cid, page, y)] and unit positions {(cid, k): (page, x, y)}."""
    openers, us = [], {}
    for i, page in enumerate(pdf):
        for w in page.get_text("words"):
            m = OPENER.match(w[4])
            if m:
                openers.append((m.group(1), i, w[1]))
            for m in UNIT.finditer(w[4]):
                us.setdefault((m.group(1), int(m.group(2))), (i, w[0], w[1]))
    return openers, us


def stamp_headers(pdf, lang, chapters, openers):
    """Brand on the left, current chapter on the right, rule below; chapter pages only."""
    ui = UI[lang]
    title = {c["id"]: f"{ui['chapter']} {c['num']} · {pick(c['title'], lang)}" for c in chapters}
    arch = pymupdf.Archive(FONTS)
    base = ("@font-face{font-family:P;src:url(Poppins-Medium.ttf);}"
            "@font-face{font-family:PS;src:url(Poppins-SemiBold.ttf);}"
            "body{font-size:7.5pt;margin:0;}")
    for i in range(openers[0][1], len(pdf) - BACK_PAGES):
        page = pdf[i]
        w = page.rect.width
        # chapter at the top of the page: one whose opener is at the very top, else the last one begun before
        top = [m for m in openers if m[1] == i and m[2] < MARGIN_TOP + 25]
        before = [m for m in openers if m[1] < i]
        cur = (top or before or openers[:1])[-1][0]
        y = 8.6 * MM
        page.insert_htmlbox(pymupdf.Rect(MARGIN_SIDE, y, w / 2, y + 12),
                            f"<div style='font-family:PS;color:{ORANGE}'>{html.escape(ui['brand'] + ' · ' + ui['book'])}</div>",
                            css=base, archive=arch)
        page.insert_htmlbox(pymupdf.Rect(w / 2, y, w - MARGIN_SIDE, y + 12),
                            f"<div style='font-family:P;color:#555;text-align:right'>{html.escape(title[cur])}</div>",
                            css=base, archive=arch)
        page.draw_line((MARGIN_SIDE, 12 * MM), (w - MARGIN_SIDE, 12 * MM), color=(0.95, 0.79, 0.54), width=0.6)


def audit(pdf, openers, newpage):
    """Columns ending well above the bottom margin (not counting the page before a forced break or the book's last page)."""
    report = []
    before_break = {m[1] - 1 for m in openers if m[0] in newpage}
    for i in range(openers[0][1], len(pdf) - 1 - BACK_PAGES):
        if i in before_break:
            continue
        page = pdf[i]
        mid, limit = page.rect.width / 2, page.rect.height - MARGIN_BOTTOM
        cols = [0.0, 0.0]
        for w in page.get_text("words"):
            if w[1] > MARGIN_TOP - 2 and w[3] < limit + 2 and not w[4].startswith("@@"):
                k = 0 if w[0] < mid else 1
                cols[k] = max(cols[k], w[3])
        for k, bottom in enumerate(cols):
            gap = (limit - bottom) / MM
            if gap > GAP_REPORT_MM:
                report.append(f"page {i + 1} {'left' if k == 0 else 'right'} column: {gap:.0f} mm empty")
    return report


def render(page, doc, path, pdf_path):
    open(path, "w", encoding="utf-8").write(doc)
    page.goto("file:///" + path.replace(os.sep, "/"), wait_until="load", timeout=300000)
    page.evaluate("document.fonts.ready")
    page.pdf(path=pdf_path, width="176mm", height="250mm", print_background=True, prefer_css_page_size=True)  # noqa
    return pymupdf.open(pdf_path)


def col_bottom(pdf, i):
    """Lowest text line (y, points) on page i, over both columns."""
    page = pdf[i]
    lim = page.rect.height - MARGIN_BOTTOM
    ys = [w[3] for w in page.get_text("words") if w[1] > MARGIN_TOP - 2 and w[3] < lim + 2 and not w[4].startswith("@@")]
    return max(ys) if ys else MARGIN_TOP


def pushed_head(pdf, openers, us, chapters, ci, n, newpage):
    """If chapter ci opens at the top of a page while the previous page ends with lots of free space,
    return how many of its units should fit there (else None)."""
    cid = chapters[ci]["id"]
    if ci == 0 or cid in newpage:
        return None
    op = next(((pg, y) for c2, pg, y in openers if c2 == cid), None)
    if not op or op[1] > MARGIN_TOP + 25 or op[0] == 0:
        return None
    h = pdf[op[0] - 1].rect.height
    free = (h - MARGIN_BOTTOM) - col_bottom(pdf, op[0] - 1)
    if free < 35 * MM:
        return None
    usable = free - 24 * MM  # opener, its margins and the first heading
    mid = pdf[op[0]].rect.width / 2
    pos = [us.get((cid, k)) for k in range(n)]
    on = [(k, p) for k, p in enumerate(pos) if p and p[0] == op[0]]
    if not on:
        return None
    # a balanced two-column head of height `usable` holds about 2 x usable of column text
    total, count = 0.0, 0
    for idx, (k, p) in enumerate(on):
        if k != idx:  # units must run from the chapter's start
            break
        col = p[1] < mid
        nxt = next((q for _, q in on[idx + 1:] if (q[1] < mid) == col), None)
        total += (nxt[2] if nxt else h - MARGIN_BOTTOM) - p[2]
        if total > 2.0 * usable:
            break
        count = k + 1
    return count if count >= MIN_HEAD else None


def layout(page, lang, chapters, hp, raw):
    """Iterate: TOC page numbers, openers pushed off page bottoms, last-page tails split off and balanced."""
    pages, newpage, split, head = {}, set(), {}, {}
    head_tries = {}
    flips = {}  # chapters whose tail split keeps changing get frozen after two changes (avoids oscillation)
    for it in range(25 + 3 * len(chapters)):
        doc, counts = build_html(lang, chapters, pages, newpage, split, head)
        pdf = render(page, doc, hp, raw)
        openers, us = scan(pdf)
        h = pdf[0].rect.height
        changed = False
        # settle chapters in order: chapter i's tail decides where chapter i+1's opener lands
        for ci, c in enumerate(chapters):
            cid, n = c["id"], counts[c["id"]]
            # 0. Chrome pushed the chapter to a new page although the previous page has room: give it a short head block
            want_head = pushed_head(pdf, openers, us, chapters, ci, n, newpage)
            if want_head is not None and head_tries.get(cid, 0) < 3:
                old = head.get(cid)
                new = want_head if old is None else int(old * 0.6)
                if new != old:
                    head_tries[cid] = head_tries.get(cid, 0) + 1
                    if new >= MIN_HEAD:
                        head[cid] = new
                    else:
                        head.pop(cid, None)
                        head_tries[cid] = 99
                    print(f"  [{lang} pass {it + 1}] {cid}: head block {old} -> {head.get(cid)}", flush=True)
                    changed = True
                    break
            # 1. opener stranded at a page bottom (fewer than MIN_UNITS_UNDER_OPENER of its units on the same
            #    page): start the chapter on a new page
            opener_page = next(pg for c2, pg, _ in openers if c2 == cid)
            under = sum(1 for k in range(n) if us.get((cid, k), (None,))[0] == opener_page)
            need = min(MIN_UNITS_UNDER_OPENER, head[cid]) if cid in head else MIN_UNITS_UNDER_OPENER
            if under < need and cid in head and head_tries.get(cid, 0) < 4:
                # the head block was too big for the space left: shrink it before giving up
                head_tries[cid] = head_tries.get(cid, 0) + 1
                new = max(MIN_HEAD, int(head[cid] * 0.6)) if head[cid] > MIN_HEAD else 0
                if new >= MIN_HEAD:
                    head[cid] = new
                else:
                    head.pop(cid)
                    head_tries[cid] = 99
                print(f"  [{lang} pass {it + 1}] {cid}: head block shrunk -> {head.get(cid)}", flush=True)
                changed = True
                break
            if under < need and cid not in newpage:
                newpage.add(cid)
                print(f"  [{lang} pass {it + 1}] {cid}: opener moved to a new page", flush=True)
                changed = True
                break
            # 2. the first unit on the chapter's last page starts the balanced tail block
            pos = [us.get((cid, k)) for k in range(n)]
            missing = [k for k, p in enumerate(pos) if p is None]
            if missing:
                raise RuntimeError(f"{cid}: unit markers not found in PDF: {missing[:5]}")
            last, first = pos[-1][0], pos[0][0]
            k = next(k for k, p in enumerate(pos) if p[0] == last)
            want = k if last > first and k > 0 else None
            if want != split.get(cid) and flips.get(cid, 0) < 2:
                flips[cid] = flips.get(cid, 0) + 1
                print(f"  [{lang} pass {it + 1}] {cid}: tail split {split.get(cid)} -> {want}", flush=True)
                if want is None:
                    split.pop(cid, None)
                else:
                    split[cid] = want
                changed = True
                break
        new_pages = {cid: pg + 1 for cid, pg, _ in openers}
        if new_pages != pages:
            pages = new_pages
            changed = True
        if not changed:
            return pdf, openers, newpage
        pdf.close()
    raise RuntimeError("layout did not settle")


def main():
    os.makedirs(OUT, exist_ok=True)
    order = yaml.safe_load(open(os.path.join(HERE, "book.yaml"), encoding="utf-8"))["chapters"]
    only = sys.argv[1:]
    chapters = []
    order = [c for c in order if os.path.exists(os.path.join(CONTENT, f"{c}.yaml"))]  # not written yet: skipped
    for n, cid in enumerate(order, 1):
        if only and cid not in only:
            continue
        ch = yaml.safe_load(open(os.path.join(CONTENT, f"{cid}.yaml"), encoding="utf-8"))
        ch["num"] = n
        chapters.append(ch)
    suffix = "-sample" if only else ""
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.set_default_timeout(600000)
        try:
            make_qr_codes(page)
        except Exception as e:  # offline: the pages print the links as text only
            print("QR codes skipped:", e)
        for lang in ("hi", "en"):
            hp = os.path.join(OUT, f"one-liner-{lang}{suffix}.html")
            raw = os.path.join(OUT, f"one-liner-{lang}{suffix}.raw.pdf")
            pdf, openers, newpage = layout(page, lang, chapters, hp, raw)
            stamp_headers(pdf, lang, chapters, openers)
            out = os.path.join(OUT, f"one-liner-{lang}{suffix}.pdf")
            try:
                pdf.save(out, garbage=3, deflate=True)
            except Exception:  # the previous PDF is open in a viewer (Windows locks it)
                out = out[:-4] + time.strftime("-%H%M%S.pdf")
                pdf.save(out, garbage=3, deflate=True)
            gaps = audit(pdf, openers, newpage)
            print(f"{lang}: {out} {len(pdf)} pages; chapters moved to a new page: {sorted(newpage) or 'none'}")
            for g in gaps:
                print("  GAP", g)
            pdf.close()
            os.remove(raw)
        browser.close()


if __name__ == "__main__":
    main()
