#!/usr/bin/env python3
"""
UKPSC Quiz Slides — Interactive Q&A Format
Questions from HC ARO 2026 Paper (UK GK + Current Affairs)
Format: Question slide (no answer) + Answer reveal slide

Valid XML guaranteed — uses xml.sax.saxutils.escape()
Output: UKPSC_Quiz_UKGK_CA_2026.pptx
"""
import zipfile
from xml.sax.saxutils import escape as _esc

# ============================================================
EMU = 914400
SLIDE_W = int(13.333 * EMU)
SLIDE_H = int(7.5 * EMU)

NAVY = "16233A"
STEEL = "2E4057"
AMBER = "E0A458"
IVORY = "F7F5F1"
WHITE = "FFFFFF"
CHARCOAL = "2A2A2A"
GREY = "C7CFDB"
MUTED = "6B7280"
GREEN = "27AE60"
RED = "E74C3C"
ORANGE = "F39C12"
TEAL = "1ABC9C"
DARK_GREEN = "2C6E49"

def emu(inches):
    return int(inches * EMU)

def xml_escape(text):
    """Escape all XML special characters"""
    return _esc(str(text))


def make_rect(x, y, w, h, fill, name="R"):
    return (f'<p:sp><p:nvSpPr><p:cNvPr id="0" name="{name}"/>'
            f'<p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr>'
            f'<a:xfrm><a:off x="{x}" y="{y}"/><a:ext cx="{w}" cy="{h}"/></a:xfrm>'
            f'<a:prstGeom prst="roundRect"><a:avLst><a:gd name="adj" fmla="val 5000"/></a:avLst></a:prstGeom>'
            f'<a:solidFill><a:srgbClr val="{fill}"/></a:solidFill>'
            f'<a:ln><a:noFill/></a:ln></p:spPr>'
            f'<p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:endParaRPr lang="en-US"/></a:p></p:txBody></p:sp>')

def make_text(x, y, w, h, lines, align="l"):
    paras = ""
    al = {"l":"l","c":"ctr","r":"r"}.get(align,"l")
    for line in lines:
        if isinstance(line, tuple):
            txt, col, bold, sz = line[0], line[1], line[2], line[3]
        else:
            txt, col, bold, sz = line, WHITE, False, 1400
        txt = xml_escape(txt)
        b = ' b="1"' if bold else ''
        paras += (f'<a:p><a:pPr algn="{al}"/><a:r>'
                  f'<a:rPr lang="en-US" sz="{sz}"{b} dirty="0">'
                  f'<a:solidFill><a:srgbClr val="{col}"/></a:solidFill>'
                  f'<a:latin typeface="Calibri"/></a:rPr>'
                  f'<a:t>{txt}</a:t></a:r></a:p>')
    return (f'<p:sp><p:nvSpPr><p:cNvPr id="0" name="T"/>'
            f'<p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr><p:spPr>'
            f'<a:xfrm><a:off x="{x}" y="{y}"/><a:ext cx="{w}" cy="{h}"/></a:xfrm>'
            f'<a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/></p:spPr>'
            f'<p:txBody><a:bodyPr wrap="square" rtlCol="0"/>'
            f'<a:lstStyle/>{paras}</p:txBody></p:sp>')

def slide_xml(bg, shapes):
    return (f'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            f'<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" '
            f'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" '
            f'xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">'
            f'<p:cSld><p:bg><p:bgPr><a:solidFill><a:srgbClr val="{bg}"/></a:solidFill>'
            f'<a:effectLst/></p:bgPr></p:bg><p:spTree>'
            f'<p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>'
            f'<p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/>'
            f'<a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>'
            f'{shapes}</p:spTree></p:cSld>'
            f'<p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>')


# ============================================================
# QUESTION DATA
# ============================================================

CURRENT_AFFAIRS = [
    {"qno": "Q177", "q": "India-AI Impact Summit 2026 ka official logo kisne design kiya?",
     "opts": ["(a) Sudarshan Veer", "(b) Ajit P. Suresh", "(c) Shekhar Kamat", "(d) Karan Rawat"],
     "ans": "(b) Ajit P. Suresh", "detail": "Ajit P. Suresh ne logo design competition jeeta — AI network + Ashoka Chakra based design.", "diff": "TOUGH"},
    {"qno": "Q178", "q": "Davos, Switzerland mein WEF 2026 ka theme kya tha?",
     "opts": ["(a) A Spirit of Dialogue", "(b) Collaboration for the Intelligent Age", "(c) Rebuilding Trust", "(d) Cooperation in a Fragmented World"],
     "ans": "(a) A Spirit of Dialogue", "detail": "56th WEF Annual Meeting, January 2026.", "diff": "MODERATE"},
    {"qno": "Q179", "q": "March 2026 mein European Council ka President kaun tha?",
     "opts": ["(a) Antonio Costa", "(b) Ursula von der Leyen", "(c) Roberto Metsola", "(d) Sabina Weyand"],
     "ans": "(a) Antonio Costa", "detail": "Former Portuguese PM. Took office 1 Dec 2024.", "diff": "MODERATE"},
    {"qno": "Q180", "q": "Centenary Commonwealth Games 2030 ki mezbani kaun sa desh karega?",
     "opts": ["(a) Australia", "(b) Jamaica", "(c) India", "(d) Canada"],
     "ans": "(c) India", "detail": "Ahmedabad primary host city. Centenary = 100 years of CWG.", "diff": "MODERATE"},
    {"qno": "Q181", "q": "Nobel Peace Prize 2025 kise diya gaya?",
     "opts": ["(a) Maria Corina Machado", "(b) John Clarke", "(c) Yulia Navalnaya", "(d) Nihon Hidankyo"],
     "ans": "(a) Maria Corina Machado", "detail": "Venezuelan opposition leader — struggle for democracy.", "diff": "TOUGH"},
    {"qno": "Q182", "q": "Bharat ke Capacity Building Commission ka vartaman Chairperson kaun hai?",
     "opts": ["(a) Uma Konjilal", "(b) Shashi Prakash Goyal", "(c) S. Radha Chauhan", "(d) Anuradha Thakur"],
     "ans": "(c) S. Radha Chauhan", "detail": "Former IAS officer. Took charge August 2025.", "diff": "TOUGH"},
    {"qno": "Q183", "q": "IOAA 2026 (Astronomy & Astrophysics Olympiad) kahan hoga?",
     "opts": ["(a) Katowice, Poland", "(b) Mumbai, India", "(c) Hanoi, Vietnam", "(d) Rio de Janeiro, Brazil"],
     "ans": "(c) Hanoi, Vietnam", "detail": "19th IOAA = Vietnam. 18th (2025) was Mumbai, India.", "diff": "TOUGH"},
    {"qno": "Q184", "q": "Sri Lanka ke vartaman Prime Minister kaun hain?",
     "opts": ["(a) Anura Kumara Dissanayake", "(b) Sirimavo Bhandaranaike", "(c) Harini Amarasuriya", "(d) Swarna Jayavira"],
     "ans": "(c) Harini Amarasuriya", "detail": "President = Dissanayake, PM = Dr. Harini Amarasuriya.", "diff": "MODERATE"},
    {"qno": "Q185", "q": "Jal Jeevan Mission ki avadhi kis varsh tak badhayi gayi?",
     "opts": ["(a) 2027 tak", "(b) 2028 tak", "(c) 2029 tak", "(d) 2030 tak"],
     "ans": "(b) 2028 tak", "detail": "Extended till December 2028 for rural piped water targets.", "diff": "MODERATE"},
    {"qno": "Q186", "q": "International Women's Day 2026 ka theme kya hai?",
     "opts": ["(a) Mahila Sashaktikaran", "(b) Samaveshi Adhikar", "(c) Ab Laingik Samanta", "(d) Rights. Justice. Action. For ALL Women and Girls"],
     "ans": "(d) Rights. Justice. Action. For ALL Women and Girls", "detail": "UN Women official theme 2026.", "diff": "EASY"},
    {"qno": "Q187", "q": "India ki pehli completely paperless district court kahan inaugurate hui?",
     "opts": ["(a) Kerala", "(b) Tamil Nadu", "(c) New Delhi", "(d) Haryana"],
     "ans": "(a) Kerala", "detail": "CJI Suryakant inaugurated at Kalpetta, Wayanad (Jan 2026).", "diff": "TOUGH"},
    {"qno": "Q188", "q": "January 2026 mein Rashtrapati dwara Ashoka Chakra kise diya gaya?",
     "opts": ["(a) Ajit Doval", "(b) Shubhanshu Shukla", "(c) Manoj Pandey", "(d) Amar Preet Singh"],
     "ans": "(b) Shubhanshu Shukla", "detail": "First Indian astronaut for ISS mission. Republic Day 2026.", "diff": "MODERATE"},
    {"qno": "Q189", "q": "1971 war hero Arun Khetarpal par Jan 2026 mein kaun si film release hui?",
     "opts": ["(a) Ikkis", "(b) Platoon", "(c) Uri", "(d) Hindustan Ki Kasam"],
     "ans": "(a) Ikkis", "detail": "Dir: Sriram Raghavan. Star: Agastya Nanda. Khetarpal was 21.", "diff": "MODERATE"},
    {"qno": "Q191", "q": "2026 mein USA dwara kaun sa rashtrapati giraftar kiya gaya?",
     "opts": ["(a) Kim Jong-Un, North Korea", "(b) Ashraf Ghani, Afghanistan", "(c) Vladimir Putin, Russia", "(d) Nicolas Maduro, Venezuela"],
     "ans": "(d) Nicolas Maduro, Venezuela", "detail": "Jan 2026, US military operation.", "diff": "TOUGH"},
    {"qno": "Q192", "q": "Kis Indian fighter jet ne January 2026 mein apni 25th anniversary manai?",
     "opts": ["(a) Rafale", "(b) Jaguar", "(c) Tejas", "(d) Mirage"],
     "ans": "(c) Tejas", "detail": "LCA Tejas first flight: 4 Jan 2001. 25 years in 2026.", "diff": "EASY"},
    {"qno": "Q193", "q": "39th National Games ki mezbani kaun sa rajya karega?",
     "opts": ["(a) Uttarakhand", "(b) Meghalaya", "(c) Uttar Pradesh", "(d) Madhya Pradesh"],
     "ans": "(b) Meghalaya", "detail": "IOA allotted 39th National Games (2027) to Meghalaya.", "diff": "MODERATE"},
    {"qno": "Q194", "q": "G.P. Birla Memorial Award 2025 kisne praapt kiya?",
     "opts": ["(a) Jay Shah", "(b) Prabha Varma", "(c) Venu Srinivasan", "(d) V. Narayanan"],
     "ans": "(d) V. Narayanan", "detail": "ISRO scientist. Contributions to rocket propulsion.", "diff": "TOUGH"},
]


UK_GK = [
    {"qno": "Q89", "q": "Uttarakhand ke kitne jile apni seema kisi rajya/desh se share NAHI karte?",
     "opts": ["(a) 02", "(b) 03", "(c) 04", "(d) 05"],
     "ans": "(c) 04", "detail": "Almora, Bageshwar, Rudraprayag, Tehri Garhwal — fully interior.", "diff": "MODERATE", "cat": "Geography"},
    {"qno": "Q92", "q": "Match: Lampiya Dhura=?, Niti=?, Muling La=?, Mayali=?",
     "opts": ["(a) Pithoragarh, Chamoli, Uttarkashi, Tehri", "(b) Pithoragarh, Chamoli, Tehri, Uttarkashi", "(c) Chamoli, Pithoragarh, Uttarkashi, Tehri", "(d) Uttarkashi, Chamoli, Pithoragarh, Tehri"],
     "ans": "(a) Pithoragarh, Chamoli, Uttarkashi, Tehri", "detail": "Lampiya Dhura=Pithoragarh | Niti=Chamoli | Muling La=Uttarkashi | Mayali=Tehri Garhwal", "diff": "MODERATE", "cat": "Geography"},
    {"qno": "Q94", "q": "Match: Bagwal=?, Chaiti=?, Gabladeve=?, Mostamanu=?",
     "opts": ["(a) Darma, Kashipur, Devidhura, Pithoragarh", "(b) Devidhura, Kashipur, Darma Valley, Pithoragarh", "(c) Kashipur, Devidhura, Pithoragarh, Darma", "(d) Devidhura, Darma, Kashipur, Pithoragarh"],
     "ans": "(b) Devidhura, Kashipur, Darma Valley, Pithoragarh", "detail": "Bagwal (stone festival) = Devidhura. Chaiti = Kashipur. Gabladeve = Bhotia tribe, Darma.", "diff": "TOUGH", "cat": "Culture"},
    {"qno": "Q97", "q": "Kshetraphal mein Uttarakhand ka sabse bada Wildlife Sanctuary kaun sa hai?",
     "opts": ["(a) Govind", "(b) Binsar", "(c) Askot", "(d) Kedarnath"],
     "ans": "(d) Kedarnath", "detail": "975.20 sq km. Chamoli + Rudraprayag districts.", "diff": "EASY", "cat": "Geography"},
    {"qno": "Q100", "q": "Uttarakhand Budget 2026-27 ka kul budgetiya parivyay kitna hai?",
     "opts": ["(a) Rs 1,12,703.21 Cr", "(b) Rs 1,10,703.21 Cr", "(c) Rs 1,11,703.21 Cr", "(d) Rs 1,15,703.21 Cr"],
     "ans": "(c) Rs 1,11,703.21 Cr", "detail": "Presented in Gairsain Assembly. Yaad karo: 1-1-1-703.", "diff": "MODERATE", "cat": "Economy"},
    {"qno": "Q103", "q": "Uttarakhand ko 'Money Order Economy' kyun kaha jaata hai?",
     "opts": ["(a) A aur R dono sahi, R sahi vyakhya nahi", "(b) A galat, R sahi", "(c) A sahi, R galat", "(d) A aur R dono sahi, R sahi vyakhya hai"],
     "ans": "(d) Dono sahi, R sahi vyakhya hai", "detail": "Youth migrate for jobs, send money orders home. R explains A perfectly.", "diff": "EASY", "cat": "Economy"},
    {"qno": "Q105", "q": "UKPSC apni varshik report kise saunpti hai?",
     "opts": ["(a) Rajyapal ko", "(b) Mukhyamantri ko", "(c) Kendriya Grihamantri ko", "(d) Rashtrapati ko"],
     "ans": "(a) Rajyapal ko", "detail": "Article 323(2) — State PSC reports to Governor.", "diff": "EASY", "cat": "Polity"},
    {"qno": "Q108", "q": "UCC Uttarakhand 2024: Mahila vivah aayu=?, Purush=?, Vivah registration=?, Live-in=?",
     "opts": ["(a) II, III, IV, I", "(b) II, IV, I, III", "(c) III, II, IV, I", "(d) IV, III, I, II"],
     "ans": "(b) Women=18yr, Registration=60 days, Men=21yr, Live-in=1 month", "detail": "UCC: Women 18, Men 21, Marriage reg = 60 days, Live-in = 30 days mein register.", "diff": "TOUGH", "cat": "Polity"},
    {"qno": "Q112", "q": "Uttarakhand ke pehle Lokayukta kaun the?",
     "opts": ["(a) M.M. Ghildiyal", "(b) S.H.A. Raza", "(c) D.D. Joshi", "(d) Shivraj Patil"],
     "ans": "(b) S.H.A. Raza", "detail": "Justice Syed Haider Abbas Raza. Appointed 2002.", "diff": "TOUGH", "cat": "Polity"},
    {"qno": "Q113", "q": "Uttarakhand High Court ki pratham mahila Chief Justice kaun hain?",
     "opts": ["(a) Ranjana Desai", "(b) Sudipti Sharma", "(c) Ritu Bahri", "(d) Sukhvinder Kaur"],
     "ans": "(c) Justice Ritu Bahri", "detail": "Took oath February 2024. Nainital HC.", "diff": "MODERATE", "cat": "Polity"},
    {"qno": "Q72", "q": "Bharat mein pehla Mayor's Court kahan sthaapit kiya gaya?",
     "opts": ["(a) Madras", "(b) Bombay", "(c) Calcutta", "(d) Surat"],
     "ans": "(a) Madras", "detail": "1688 by East India Company. Charter of 1726 added Bombay + Calcutta.", "diff": "EASY", "cat": "History"},
    {"qno": "Q74", "q": "Bharat ka Federal Court kiske dwara sthaapit kiya gaya?",
     "opts": ["(a) GoI Act, 1935", "(b) GoI Act, 1919", "(c) Regulating Act, 1773", "(d) Indian HC Act, 1911"],
     "ans": "(a) Government of India Act, 1935", "detail": "Federal Court started Oct 1, 1937.", "diff": "EASY", "cat": "History"},
    {"qno": "Q76", "q": "'Historical and Statistical Memoirs of Dehra Doon' ke lekhak kaun the?",
     "opts": ["(a) G.R.C. Williams", "(b) Bhakt Darshan", "(c) H.G. Walton", "(d) E.T. Atkinson"],
     "ans": "(a) G.R.C. Williams", "detail": "Published 1874. British civil servant.", "diff": "TOUGH", "cat": "UK History"},
    {"qno": "Q77", "q": "Jahangirnama mein Kumaon ke kis Chand Raja ka varnan hai?",
     "opts": ["(a) Sansarchand", "(b) Harichand", "(c) Binachand", "(d) Laxmichand"],
     "ans": "(d) Laxmichand", "detail": "Raja Laxmi Chand (1597-1621) met Jahangir. Recorded in Tuzuk-e-Jahangiri.", "diff": "TOUGH", "cat": "UK History"},
    {"qno": "Q79", "q": "Gorkha Tax: Pungadi=?, Gheekar=?, Tandkar=?, Mijhari=?",
     "opts": ["(a) 1,2,3,4", "(b) 2,4,1,3", "(c) 4,1,2,3", "(d) 4,1,3,2"],
     "ans": "(c) Pungadi=Land, Gheekar=Cattle, Tandkar=Cloth/Loom, Mijhari=Artisans", "detail": "Pungadi=Bhoomi kar | Gheekar=Dudharu pashu | Tandkar=Kapda | Mijhari=Shilp-karmi", "diff": "TOUGH", "cat": "UK History"},
    {"qno": "Q81", "q": "Match: Guldasta Tawarikh-e-Koh=?, Sabhasar=?, Fateh Prakash=?, Garh Rajvansh Kavya=?",
     "opts": ["(a) 1,3,4,2", "(b) 2,4,1,3", "(c) 4,2,1,3", "(d) 2,1,4,3"],
     "ans": "(b) Miyan Prem Singh, Sudarshan Shah, Ratan Kavi, Molaram Tomar", "detail": "Sabhasar=Raja Sudarshan Shah | Garh Rajvansh Kavya=Molaram | Fateh Prakash=Ratan Kavi", "diff": "TOUGH", "cat": "UK Literature"},
    {"qno": "Q114", "q": "Kis Article ke tahat Uttarakhand mein High Court sthaapit hai?",
     "opts": ["(a) Article 214", "(b) Article 168", "(c) Article 217", "(d) Article 212"],
     "ans": "(a) Article 214", "detail": "Art 214: 'There shall be a HC for each State.' Nainital HC, est. 9 Nov 2000.", "diff": "EASY", "cat": "Polity"},
]


def build_question_slide(q_data, index, total, section_name):
    """Question slide — shows question + options, NO answer"""
    diff_colors = {"EASY": GREEN, "MODERATE": ORANGE, "TOUGH": RED}
    dc = diff_colors.get(q_data["diff"], ORANGE)
    s = ""
    # Top bar with question number and difficulty
    s += make_rect(emu(0.4), emu(0.3), emu(12.5), emu(0.7), STEEL, "TopBar")
    s += make_text(emu(0.6), emu(0.35), emu(4), emu(0.6),
        [(f"{q_data['qno']} | {index}/{total}", WHITE, True, 1400)], "l")
    s += make_text(emu(8.5), emu(0.35), emu(4.2), emu(0.6),
        [(q_data["diff"], dc, True, 1400)], "r")
    # Section badge
    cat = q_data.get("cat", section_name)
    s += make_rect(emu(0.4), emu(1.1), emu(3.0), emu(0.45), AMBER, "Cat")
    s += make_text(emu(0.5), emu(1.13), emu(2.8), emu(0.4),
        [(cat, NAVY, True, 1100)], "c")
    # Question text
    s += make_text(emu(0.5), emu(1.8), emu(12.3), emu(1.8),
        [(q_data["q"], WHITE, True, 2200)], "l")
    # Options (2x2 grid)
    opts = q_data["opts"]
    for i, opt in enumerate(opts):
        col = i % 2
        row = i // 2
        x = emu(0.5 + col * 6.3)
        y = emu(4.0 + row * 1.4)
        s += make_rect(x, y, emu(5.9), emu(1.1), STEEL, f"O{i}")
        s += make_text(int(x + emu(0.3)), int(y + emu(0.15)), emu(5.3), emu(0.8),
            [(opt, WHITE, False, 1500)], "l")
    # Bottom branding bar
    s += make_rect(emu(0.4), emu(6.8), emu(12.5), emu(0.5), NAVY, "Brand")
    s += make_text(emu(0.6), emu(6.83), emu(12), emu(0.45),
        [("UKPSC DECODED  |  PCS  |  Lower PCS  |  RO/ARO  |  UKSSSC", GREY, False, 1000)], "c")
    return slide_xml(NAVY, s)


def build_answer_slide(q_data, index, total):
    """Answer reveal slide — shows answer + detail/tip"""
    s = ""
    # Top bar
    s += make_rect(emu(0.4), emu(0.3), emu(12.5), emu(0.7), DARK_GREEN, "ATop")
    s += make_text(emu(0.6), emu(0.35), emu(6), emu(0.6),
        [(f"{q_data['qno']} — ANSWER REVEAL", WHITE, True, 1500)], "l")
    s += make_text(emu(8.5), emu(0.35), emu(4.2), emu(0.6),
        [(f"{index}/{total}", GREY, False, 1200)], "r")
    # Question recap (smaller)
    s += make_text(emu(0.5), emu(1.2), emu(12.3), emu(1.2),
        [(q_data["q"], GREY, False, 1500)], "l")
    # Answer highlight box
    s += make_rect(emu(0.5), emu(2.8), emu(12.3), emu(1.2), GREEN, "AnsBox")
    s += make_text(emu(0.8), emu(2.9), emu(11.7), emu(1.0),
        [(f"Answer: {q_data['ans']}", WHITE, True, 2400)], "l")
    # Detail/Explanation box
    s += make_rect(emu(0.5), emu(4.3), emu(12.3), emu(2.0), STEEL, "DetBox")
    s += make_text(emu(0.8), emu(4.45), emu(11.7), emu(1.7),
        [("Details:", AMBER, True, 1200),
         (q_data["detail"], WHITE, False, 1400)], "l")
    # Bottom branding
    s += make_rect(emu(0.4), emu(6.8), emu(12.5), emu(0.5), NAVY, "Brand2")
    s += make_text(emu(0.6), emu(6.83), emu(12), emu(0.45),
        [("UKPSC DECODED  |  Telegram: @UKPSCDECODED", GREY, False, 1000)], "c")
    return slide_xml(NAVY, s)


def build_intro_slide():
    """Slide 1: Title/Intro"""
    s = ""
    s += make_text(emu(0.8), emu(0.8), emu(12), emu(0.5),
        [("UKPSC DECODED PRESENTS", AMBER, True, 1400)], "c")
    s += make_text(emu(0.8), emu(1.6), emu(12), emu(1.5),
        [("UKPSC Latest Paper 2026", WHITE, True, 3600),
         ("Uttarakhand GK + Current Affairs", WHITE, True, 2800)], "c")
    s += make_text(emu(0.8), emu(3.5), emu(12), emu(0.6),
        [("HC ARO 19 July 2026 — Questions Jo AAPKE Exam Mein Repeat Honge", GREY, False, 1500)], "c")
    # Stats boxes
    s += make_rect(emu(1.0), emu(4.5), emu(3.5), emu(1.3), STEEL, "S1")
    s += make_text(emu(1.1), emu(4.6), emu(3.3), emu(1.1),
        [("34", AMBER, True, 3600), ("Questions", GREY, False, 1200)], "c")
    s += make_rect(emu(5.0), emu(4.5), emu(3.5), emu(1.3), STEEL, "S2")
    s += make_text(emu(5.1), emu(4.6), emu(3.3), emu(1.1),
        [("2", AMBER, True, 3600), ("Categories", GREY, False, 1200)], "c")
    s += make_rect(emu(9.0), emu(4.5), emu(3.5), emu(1.3), STEEL, "S3")
    s += make_text(emu(9.1), emu(4.6), emu(3.3), emu(1.1),
        [("100%", AMBER, True, 3200), ("Exam Relevant", GREY, False, 1200)], "c")
    # Instruction
    s += make_rect(emu(1.5), emu(6.2), emu(10.3), emu(0.8), AMBER, "Inst")
    s += make_text(emu(1.7), emu(6.3), emu(9.9), emu(0.6),
        [("Har question sochiye — phir answer dekhiye. Count karo kitne sahi aaye!", NAVY, True, 1400)], "c")
    return slide_xml(NAVY, s)

def build_section_divider(title, subtitle, count):
    """Section divider slide"""
    s = ""
    s += make_rect(emu(2.0), emu(2.5), emu(9.3), emu(2.5), STEEL, "Div")
    s += make_text(emu(2.2), emu(2.7), emu(8.9), emu(1.2),
        [(title, AMBER, True, 3200)], "c")
    s += make_text(emu(2.2), emu(3.9), emu(8.9), emu(0.8),
        [(f"{subtitle} — {count} Questions", WHITE, False, 1600)], "c")
    return slide_xml(NAVY, s)

def build_conclusion_slide():
    """Final slide"""
    s = ""
    s += make_text(emu(0.8), emu(0.8), emu(12), emu(1.0),
        [("Kitne Sahi Aaye?", WHITE, True, 3600)], "c")
    scores = [
        ("28+ Correct", "Prep STRONG hai!", GREEN),
        ("18-27 Correct", "Achhi hai, gaps fill karo", ORANGE),
        ("18 se kam", "Is video SAVE karo, dubara dekho", RED),
    ]
    for i, (score, msg, col) in enumerate(scores):
        y = emu(2.2 + i * 1.4)
        s += make_rect(emu(1.5), y, emu(10.3), emu(1.1), STEEL, f"Sc{i}")
        s += make_text(emu(1.8), int(y + emu(0.15)), emu(4.5), emu(0.8),
            [(score, col, True, 1800)], "l")
        s += make_text(emu(6.5), int(y + emu(0.15)), emu(5.0), emu(0.8),
            [(msg, WHITE, False, 1400)], "l")
    # CTA
    s += make_rect(emu(1.0), emu(5.8), emu(11.3), emu(1.2), AMBER, "CTA")
    s += make_text(emu(1.2), emu(5.9), emu(10.9), emu(1.0),
        [("SUBSCRIBE + Bell ON | Telegram: @UKPSCDECODED", NAVY, True, 1600),
         ("Next: Full Answer Key + Mains Strategy", NAVY, False, 1300)], "c")
    return slide_xml(NAVY, s)


# ============================================================
# PPTX PACKAGING
# ============================================================
def ct_xml(n):
    o = ""
    for i in range(1,n+1):
        o += f'<Override PartName="/ppt/slides/slide{i}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>'
    return (f'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            f'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
            f'<Default Extension="xml" ContentType="application/xml"/>'
            f'<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
            f'<Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>'
            f'<Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>'
            f'<Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/>'
            f'{o}</Types>')

def root_rels():
    return ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
            '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>'
            '</Relationships>')

def pres_xml(n):
    sl = "".join([f'<p:sldId id="{256+i}" r:id="rId{i}"/>' for i in range(1,n+1)])
    return (f'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            f'<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" '
            f'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" '
            f'xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">'
            f'<p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId{n+1}"/></p:sldMasterIdLst>'
            f'<p:sldIdLst>{sl}</p:sldIdLst>'
            f'<p:sldSz cx="{SLIDE_W}" cy="{SLIDE_H}"/>'
            f'<p:notesSz cx="{SLIDE_H}" cy="{SLIDE_W}"/></p:presentation>')

def pres_rels(n):
    r = "".join([f'<Relationship Id="rId{i}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide{i}.xml"/>' for i in range(1,n+1)])
    r += f'<Relationship Id="rId{n+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>'
    return f'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">{r}</Relationships>'

SM = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:bg><p:bgPr><a:solidFill><a:srgbClr val="FFFFFF"/></a:solidFill><a:effectLst/></p:bgPr></p:bg><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld><p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/><p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst></p:sldMaster>')
SM_RELS = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/></Relationships>'
SL = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:sldLayout xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" type="blank"><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld></p:sldLayout>'
SL_RELS = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="../slideMasters/slideMaster1.xml"/></Relationships>'
SRELS = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/></Relationships>'


# ============================================================
# MAIN
# ============================================================
def main():
    slides = []
    # Intro
    slides.append(build_intro_slide())
    # Section 1: Uttarakhand GK
    slides.append(build_section_divider("UTTARAKHAND GK", "Static + Current UK Knowledge", len(UK_GK)))
    total = len(UK_GK) + len(CURRENT_AFFAIRS)
    idx = 0
    for q in UK_GK:
        idx += 1
        slides.append(build_question_slide(q, idx, total, "UK GK"))
        slides.append(build_answer_slide(q, idx, total))
    # Section 2: Current Affairs
    slides.append(build_section_divider("CURRENT AFFAIRS", "National + International 2025-26", len(CURRENT_AFFAIRS)))
    for q in CURRENT_AFFAIRS:
        idx += 1
        slides.append(build_question_slide(q, idx, total, "Current Affairs"))
        slides.append(build_answer_slide(q, idx, total))
    # Conclusion
    slides.append(build_conclusion_slide())

    n = len(slides)
    out = "UKPSC_Quiz_UKGK_CA_2026.pptx"
    with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("[Content_Types].xml", ct_xml(n))
        zf.writestr("_rels/.rels", root_rels())
        zf.writestr("ppt/presentation.xml", pres_xml(n))
        zf.writestr("ppt/_rels/presentation.xml.rels", pres_rels(n))
        zf.writestr("ppt/slideMasters/slideMaster1.xml", SM)
        zf.writestr("ppt/slideMasters/_rels/slideMaster1.xml.rels", SM_RELS)
        zf.writestr("ppt/slideLayouts/slideLayout1.xml", SL)
        zf.writestr("ppt/slideLayouts/_rels/slideLayout1.xml.rels", SL_RELS)
        for i, content in enumerate(slides, 1):
            zf.writestr(f"ppt/slides/slide{i}.xml", content)
            zf.writestr(f"ppt/slides/_rels/slide{i}.xml.rels", SRELS)
    print(f"Generated: {out}")
    print(f"Total slides: {n}")
    print(f"  - Intro: 1")
    print(f"  - UK GK: {len(UK_GK)} questions x 2 slides = {len(UK_GK)*2}")
    print(f"  - Current Affairs: {len(CURRENT_AFFAIRS)} questions x 2 slides = {len(CURRENT_AFFAIRS)*2}")
    print(f"  - Section dividers: 2")
    print(f"  - Conclusion: 1")

if __name__ == "__main__":
    main()
