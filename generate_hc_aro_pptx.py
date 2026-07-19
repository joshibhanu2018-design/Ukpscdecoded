#!/usr/bin/env python3
"""
UKPSC High Court ARO Prelims 2026 — Paper Analysis PPTX
Generates 10 slides covering all video sections.
No external dependencies — pure Python zipfile + XML.

Usage: python3 generate_hc_aro_pptx.py
Output: UKPSC_HC_ARO_2026_Analysis.pptx
"""
import zipfile
from xml.sax.saxutils import escape as xml_escape

# ============================================================
# CONSTANTS
# ============================================================
EMU = 914400
SLIDE_W = int(13.333 * EMU)
SLIDE_H = int(7.5 * EMU)

# Colors
NAVY = "16233A"
STEEL = "2E4057"
AMBER = "E0A458"
IVORY = "F7F5F1"
WHITE = "FFFFFF"
CHARCOAL = "2A2A2A"
GREY = "C7CFDB"
MUTED = "6B7280"
GREEN = "3F7D58"
RED = "DC3545"
ORANGE = "F59E0B"
CRIMSON = "8B0000"
GOLD = "FFD700"


def emu(inches):
    return int(inches * EMU)


def make_rect_xml(x, y, w, h, fill_color, name="Rect"):
    return f'''<p:sp>
  <p:nvSpPr><p:cNvPr id="0" name="{name}"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr>
  <p:spPr>
    <a:xfrm><a:off x="{x}" y="{y}"/><a:ext cx="{w}" cy="{h}"/></a:xfrm>
    <a:prstGeom prst="roundRect"><a:avLst><a:gd name="adj" fmla="val 5000"/></a:avLst></a:prstGeom>
    <a:solidFill><a:srgbClr val="{fill_color}"/></a:solidFill>
    <a:ln><a:noFill/></a:ln>
  </p:spPr>
  <p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:endParaRPr lang="en-US"/></a:p></p:txBody>
</p:sp>'''


def make_multiline_textbox(x, y, w, h, lines, align="l"):
    paras = ""
    algn = {"l": "l", "c": "ctr", "r": "r"}.get(align, "l")
    for line in lines:
        if isinstance(line, str):
            txt, col, bld, sz = line, WHITE, False, 1400
        else:
            txt = line[0]
            col = line[1] if len(line) > 1 else WHITE
            bld = line[2] if len(line) > 2 else False
            sz = line[3] if len(line) > 3 else 1400
        # Escape XML special characters in text content
        txt = xml_escape(txt)
        b_attr = ' b="1"' if bld else ''
        paras += (f'<a:p><a:pPr algn="{algn}"/><a:r>'
                  f'<a:rPr lang="en-US" sz="{sz}"{b_attr} dirty="0">'
                  f'<a:solidFill><a:srgbClr val="{col}"/></a:solidFill>'
                  f'<a:latin typeface="Calibri"/></a:rPr>'
                  f'<a:t>{txt}</a:t></a:r></a:p>')
    return f'''<p:sp>
  <p:nvSpPr><p:cNvPr id="0" name="TB"/><p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr>
  <p:spPr>
    <a:xfrm><a:off x="{x}" y="{y}"/><a:ext cx="{w}" cy="{h}"/></a:xfrm>
    <a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/>
  </p:spPr>
  <p:txBody><a:bodyPr wrap="square" rtlCol="0"/><a:lstStyle/>{paras}</p:txBody>
</p:sp>'''



def slide_xml(bg_color, shapes_xml, slide_num):
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
       xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
       xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:bg><p:bgPr><a:solidFill><a:srgbClr val="{bg_color}"/></a:solidFill><a:effectLst/></p:bgPr></p:bg>
    <p:spTree>
      <p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
      <p:grpSpPr>
        <a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm>
      </p:grpSpPr>
      {shapes_xml}
    </p:spTree>
  </p:cSld>
  <p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>
</p:sld>'''


def slide_rels_xml():
    return '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>
</Relationships>'''



# ============================================================
# SLIDE BUILDERS
# ============================================================

def slide_1_title():
    """Title: UKPSC HC ARO 2026 — Paper Analysis & Cut-Off"""
    s = ""
    s += make_multiline_textbox(emu(0.8), emu(0.8), emu(11.7), emu(0.5),
        [("UKPSC HIGH COURT ARO PRELIMS 2026", AMBER, True, 1500)], "l")
    s += make_multiline_textbox(emu(0.8), emu(1.5), emu(11.7), emu(2.0),
        [("Complete Paper Analysis", WHITE, True, 3800),
         ("& Expected Cut-Off", WHITE, True, 3200)], "l")
    s += make_multiline_textbox(emu(0.8), emu(3.6), emu(11), emu(0.5),
        [("19 July 2026 | HCA Series-A | 200 Marks | Only 15 Seats", GREY, False, 1500)], "l")
    # Three stat boxes
    s += make_rect_xml(emu(0.8), emu(4.8), emu(3.5), emu(1.4), STEEL, "B1")
    s += make_multiline_textbox(emu(0.9), emu(4.9), emu(3.3), emu(1.2),
        [("200", AMBER, True, 3600), ("Total Marks", GREY, False, 1200)], "c")
    s += make_rect_xml(emu(4.6), emu(4.8), emu(3.5), emu(1.4), STEEL, "B2")
    s += make_multiline_textbox(emu(4.7), emu(4.9), emu(3.3), emu(1.2),
        [("15", RED, True, 3600), ("Seats Only!", GREY, False, 1200)], "c")
    s += make_rect_xml(emu(8.4), emu(4.8), emu(3.5), emu(1.4), STEEL, "B3")
    s += make_multiline_textbox(emu(8.5), emu(4.9), emu(3.3), emu(1.2),
        [("0.25", AMBER, True, 3200), ("Negative/Wrong", GREY, False, 1200)], "c")
    # Warning banner
    s += make_rect_xml(emu(0.8), emu(6.5), emu(11.7), emu(0.6), RED, "Warn")
    s += make_multiline_textbox(emu(1.0), emu(6.55), emu(11.3), emu(0.5),
        [("EXTREME COMPETITION: 15 Seats = Every Single Mark Counts!", WHITE, True, 1400)], "c")
    return slide_xml(NAVY, s, 1)



def slide_2_paper_structure():
    """Paper Blueprint — HC ARO vs Secretariat comparison"""
    s = ""
    s += make_multiline_textbox(emu(0.7), emu(0.3), emu(12), emu(0.7),
        [("Paper Structure — What Makes HC ARO Different", NAVY, True, 2600)], "l")
    # Comparison table header
    s += make_rect_xml(emu(0.7), emu(1.2), emu(11.7), emu(0.55), NAVY, "TH")
    s += make_multiline_textbox(emu(0.9), emu(1.25), emu(3.5), emu(0.5),
        [("Factor", WHITE, True, 1200)], "l")
    s += make_multiline_textbox(emu(4.5), emu(1.25), emu(3.5), emu(0.5),
        [("Secretariat RO/ARO", WHITE, True, 1200)], "c")
    s += make_multiline_textbox(emu(8.5), emu(1.25), emu(3.5), emu(0.5),
        [("High Court ARO", AMBER, True, 1200)], "c")
    # Table rows
    rows = [
        ("Total Marks", "150", "200"),
        ("Questions", "150", "200"),
        ("Negative Marking", "1/4 (0.25)", "1/4 (0.25)"),
        ("Seats", "137+", "ONLY 15!"),
        ("Legal Section", "None", "20+ Questions!"),
        ("Duration", "2 Hours", "2 Hours"),
        ("Cut-off (Gen)", "~97-98 (65%)", "138-144 (70%)"),
    ]
    for i, (factor, sec, hc) in enumerate(rows):
        y = emu(1.85 + i * 0.6)
        bg = WHITE if i % 2 == 0 else IVORY
        s += make_rect_xml(emu(0.7), y, emu(11.7), emu(0.55), bg, f"R{i}")
        s += make_multiline_textbox(emu(0.9), int(y + emu(0.05)), emu(3.5), emu(0.45),
            [(factor, CHARCOAL, True, 1200)], "l")
        s += make_multiline_textbox(emu(4.5), int(y + emu(0.05)), emu(3.5), emu(0.45),
            [(sec, MUTED, False, 1200)], "c")
        col = RED if "15" in hc or "!" in hc else AMBER
        s += make_multiline_textbox(emu(8.5), int(y + emu(0.05)), emu(3.5), emu(0.45),
            [(hc, col, True, 1200)], "c")
    # Bottom insight
    s += make_rect_xml(emu(0.7), emu(6.2), emu(11.7), emu(0.8), NAVY, "Ins")
    s += make_multiline_textbox(emu(1.0), emu(6.3), emu(11.2), emu(0.6),
        [("Key Insight: 200 marks + 15 seats = 9x more competitive than Secretariat", WHITE, True, 1400)], "c")
    return slide_xml(IVORY, s, 2)



def slide_3_legal_maxims():
    """Legal Maxims — The Game Changer Section"""
    s = ""
    s += make_multiline_textbox(emu(0.7), emu(0.3), emu(12), emu(0.6),
        [("Legal Maxims — The FILTER Section", WHITE, True, 2600)], "l")
    s += make_multiline_textbox(emu(0.7), emu(0.85), emu(12), emu(0.4),
        [("Q35-Q54: 20+ Questions from Legal Terminology", GREY, False, 1300)], "l")
    # Maxims list
    maxims = [
        ("Res Judicata", "Matter already decided by court"),
        ("Audi Alteram Partem", "Hear the other side (Natural Justice)"),
        ("Ubi Jus Ibi Remedium", "Where there is a right, there is a remedy"),
        ("Res Ipsa Loquitur", "The thing speaks for itself"),
        ("Volenti Non Fit Injuria", "Consent = No injury claim"),
        ("Mandamus", "We Command (Constitutional Writ)"),
        ("De Jure", "By law / Legally recognized"),
        ("Inter Alia", "Among other things"),
    ]
    for i, (term, meaning) in enumerate(maxims):
        col_idx = i % 2
        row_idx = i // 2
        x = emu(0.7 + col_idx * 6.2)
        y = emu(1.5 + row_idx * 1.25)
        s += make_rect_xml(x, y, emu(5.9), emu(1.1), STEEL, f"M{i}")
        s += make_multiline_textbox(int(x + emu(0.2)), int(y + emu(0.1)), emu(5.5), emu(0.9),
            [(term, AMBER, True, 1400),
             (meaning, GREY, False, 1100)], "l")
    # Filter effect box
    s += make_rect_xml(emu(0.7), emu(6.0), emu(5.5), emu(1.0), GREEN, "Law")
    s += make_multiline_textbox(emu(0.9), emu(6.1), emu(5.1), emu(0.8),
        [("Law Student: 8-9/10 Correct", WHITE, True, 1400),
         ("= FREE MARKS", WHITE, False, 1100)], "c")
    s += make_rect_xml(emu(6.5), emu(6.0), emu(5.9), emu(1.0), RED, "Gen")
    s += make_multiline_textbox(emu(6.7), emu(6.1), emu(5.5), emu(0.8),
        [("General Aspirant: 4-5/10 Correct", WHITE, True, 1400),
         ("= 4-5 MARKS GAP from 1 section!", WHITE, False, 1100)], "c")
    return slide_xml(NAVY, s, 3)



def slide_4_uk_gk_value():
    """UK GK & Current Affairs — VALUE for all aspirants"""
    s = ""
    s += make_multiline_textbox(emu(0.7), emu(0.3), emu(12), emu(0.6),
        [("Questions Jo AAPKE Exam Mein Bhi Aayenge!", NAVY, True, 2500)], "l")
    s += make_multiline_textbox(emu(0.7), emu(0.85), emu(12), emu(0.4),
        [("Secretariat RO/ARO | Lower PCS | UKSSSC — Sab ke liye relevant", MUTED, False, 1300)], "l")
    # Key facts cards
    facts = [
        ("UK Budget 2026-27", "Rs. 1,11,703.21 Crore", "GUARANTEED aayega!"),
        ("UCC Act 2024 — Women Age", "18 Years", "Marriage minimum"),
        ("UCC Act 2024 — Men Age", "21 Years", "Marriage minimum"),
        ("Live-in Registration", "60 Days ke andar", "Mandatory!"),
        ("39th National Games", "UTTARAKHAND", "100% pucha jayega"),
        ("Nobel Peace 2025", "Nihon Hidankyo (Japan)", "Fresh current affairs"),
    ]
    for i, (title, value, note) in enumerate(facts):
        col = i % 3
        row = i // 3
        x = emu(0.7 + col * 4.1)
        y = emu(1.5 + row * 2.5)
        s += make_rect_xml(x, y, emu(3.8), emu(2.2), WHITE, f"F{i}")
        s += make_multiline_textbox(int(x + emu(0.2)), int(y + emu(0.15)), emu(3.4), emu(1.9),
            [(title, MUTED, False, 1100),
             (value, NAVY, True, 1800),
             ("", NAVY, False, 400),
             (note, GREEN, False, 1000)], "c")
    # Bottom banner
    s += make_rect_xml(emu(0.7), emu(6.3), emu(11.7), emu(0.7), NAVY, "Bot")
    s += make_multiline_textbox(emu(1.0), emu(6.4), emu(11.2), emu(0.5),
        [("NOTE KARO: Ye sab upcoming UKPSC exams mein repeat honge!", AMBER, True, 1400)], "c")
    return slide_xml(IVORY, s, 4)



def slide_5_current_affairs():
    """Current Affairs — Quick Answer Key"""
    s = ""
    s += make_multiline_textbox(emu(0.7), emu(0.3), emu(12), emu(0.6),
        [("Current Affairs — Answer Key Highlights", WHITE, True, 2500)], "l")
    s += make_multiline_textbox(emu(0.7), emu(0.8), emu(12), emu(0.4),
        [("Q177-Q195: National & International Current Affairs", GREY, False, 1300)], "l")
    # Answer table
    items = [
        ("Q178", "WEF Davos 2026 Theme", "Cooperation in a Fragmented World"),
        ("Q179", "EU Council President", "Antonio Costa"),
        ("Q181", "Nobel Peace Prize 2025", "Nihon Hidankyo"),
        ("Q183", "IOAA 2026 Host", "Mumbai, India"),
        ("Q184", "Sri Lanka PM", "Harini Amarasuriya"),
        ("Q186", "IWD 2026 Theme", "Rights, Justice & Action"),
        ("Q189", "1971 War Film (Jan 2026)", "Ikkees (Arun Khetarpal)"),
        ("Q192", "Indian Fighter Jet 25th Anniv.", "Tejas"),
        ("Q193", "39th National Games", "Uttarakhand"),
    ]
    # Table header
    s += make_rect_xml(emu(0.7), emu(1.3), emu(11.7), emu(0.5), STEEL, "CH")
    s += make_multiline_textbox(emu(0.9), emu(1.33), emu(1.5), emu(0.45),
        [("Q#", WHITE, True, 1100)], "l")
    s += make_multiline_textbox(emu(2.5), emu(1.33), emu(5.0), emu(0.45),
        [("Topic", WHITE, True, 1100)], "l")
    s += make_multiline_textbox(emu(8.0), emu(1.33), emu(4.2), emu(0.45),
        [("Answer", AMBER, True, 1100)], "l")
    for i, (qn, topic, ans) in enumerate(items):
        y = emu(1.9 + i * 0.52)
        bg = NAVY if i % 2 == 0 else STEEL
        s += make_rect_xml(emu(0.7), y, emu(11.7), emu(0.48), bg, f"CA{i}")
        s += make_multiline_textbox(emu(0.9), int(y + emu(0.03)), emu(1.5), emu(0.42),
            [(qn, GREY, False, 1100)], "l")
        s += make_multiline_textbox(emu(2.5), int(y + emu(0.03)), emu(5.0), emu(0.42),
            [(topic, WHITE, False, 1100)], "l")
        s += make_multiline_textbox(emu(8.0), int(y + emu(0.03)), emu(4.2), emu(0.42),
            [(ans, AMBER, True, 1100)], "l")
    # Bottom note
    s += make_multiline_textbox(emu(0.7), emu(6.7), emu(11.7), emu(0.4),
        [("Ye sab recent 6 months ke facts hain — Lower PCS mein bhi expect karo!", GREEN, False, 1200)], "c")
    return slide_xml(NAVY, s, 5)



def slide_6_uk_facts():
    """Uttarakhand GK — Important Facts from Paper"""
    s = ""
    s += make_multiline_textbox(emu(0.7), emu(0.3), emu(12), emu(0.6),
        [("Uttarakhand GK — Key Facts (Note Karo!)", NAVY, True, 2500)], "l")
    facts = [
        "Kedarnath = UK ka sabse bada Wildlife Sanctuary (area)",
        "Edward Gardner = British Kumaon First Commissioner (1815)",
        "Article 214 = HC ki sthapna ka Constitutional basis",
        "Kisau Dam = Tons | Lakhwar = Yamuna | Tehri = Bhagirathi | Kalagadh = Ramganga",
        "Lampiya Dhura = Pithoragarh | Neeti = Chamoli | Muling La = Uttarkashi",
        "Bagwal Mela = Devi Dhura (stone-throwing festival)",
        "Talaun Bhoomi = Best irrigated land in UK hills",
        "5 UK districts share NO border with other states/countries",
        "2011 Census: 8 towns in UK with 1 lakh+ population",
        "Bachendri Pal=Mountaineering | C.P. Bhatt=Environment | Kapoor=Politics | Katariya=Sports",
    ]
    for i, fact in enumerate(facts):
        y = emu(1.1 + i * 0.6)
        num_bg = AMBER if i < 5 else GREEN
        s += make_rect_xml(emu(0.7), y, emu(0.5), emu(0.5), num_bg, f"N{i}")
        s += make_multiline_textbox(emu(0.75), int(y + emu(0.02)), emu(0.4), emu(0.45),
            [(str(i+1), NAVY, True, 1200)], "c")
        s += make_multiline_textbox(emu(1.4), int(y + emu(0.05)), emu(11.0), emu(0.45),
            [(fact, CHARCOAL, False, 1250)], "l")
    # Bottom
    s += make_rect_xml(emu(0.7), emu(7.0), emu(11.7), emu(0.0), IVORY, "X")
    return slide_xml(IVORY, s, 6)



def slide_7_difficulty():
    """Section-wise Difficulty Level"""
    s = ""
    s += make_multiline_textbox(emu(0.7), emu(0.3), emu(12), emu(0.6),
        [("Section-wise Difficulty Analysis", WHITE, True, 2600)], "l")
    sections = [
        ("Legal Maxims (Q35-54)", "Moderate-Tough", "20+", RED),
        ("Legal History (Q59-68)", "Moderate", "~15", ORANGE),
        ("Indian Polity (Q110-117)", "Easy-Moderate", "~15", GREEN),
        ("UK History & Culture (Q72-96)", "Tough", "~40", RED),
        ("UK Current & Schemes (Q97-109)", "Moderate", "~15", ORANGE),
        ("National Current Affairs (Q177-195)", "Easy-Moderate", "~20", GREEN),
        ("Science & Computer", "Moderate", "~15", ORANGE),
        ("Maths & Reasoning", "Moderate", "~20", ORANGE),
    ]
    # Table header
    s += make_rect_xml(emu(0.7), emu(1.1), emu(11.7), emu(0.55), STEEL, "DH")
    s += make_multiline_textbox(emu(0.9), emu(1.15), emu(5.0), emu(0.45),
        [("Section", WHITE, True, 1200)], "l")
    s += make_multiline_textbox(emu(6.5), emu(1.15), emu(2.5), emu(0.45),
        [("Difficulty", WHITE, True, 1200)], "c")
    s += make_multiline_textbox(emu(9.5), emu(1.15), emu(2.5), emu(0.45),
        [("Approx Qs", WHITE, True, 1200)], "c")
    for i, (section, diff, qs, color) in enumerate(sections):
        y = emu(1.75 + i * 0.62)
        bg = NAVY if i % 2 == 0 else STEEL
        s += make_rect_xml(emu(0.7), y, emu(11.7), emu(0.57), bg, f"D{i}")
        s += make_multiline_textbox(emu(0.9), int(y + emu(0.05)), emu(5.3), emu(0.47),
            [(section, WHITE, False, 1200)], "l")
        s += make_multiline_textbox(emu(6.5), int(y + emu(0.05)), emu(2.5), emu(0.47),
            [(diff, color, True, 1200)], "c")
        s += make_multiline_textbox(emu(9.5), int(y + emu(0.05)), emu(2.5), emu(0.47),
            [(qs, GREY, False, 1200)], "c")
    # Overall verdict
    s += make_rect_xml(emu(0.7), emu(6.6), emu(11.7), emu(0.6), AMBER, "OV")
    s += make_multiline_textbox(emu(1.0), emu(6.65), emu(11.2), emu(0.5),
        [("Overall Paper Level: MODERATE (with TOUGH Legal + UK History sections)", NAVY, True, 1400)], "c")
    return slide_xml(NAVY, s, 7)



def slide_8_cutoff():
    """Expected Cut-Off — THE MONEY SLIDE"""
    s = ""
    s += make_multiline_textbox(emu(0.7), emu(0.3), emu(12), emu(0.7),
        [("EXPECTED CUT-OFF — HC ARO 2026 (Out of 200)", WHITE, True, 2800)], "l")
    s += make_multiline_textbox(emu(0.7), emu(0.95), emu(12), emu(0.4),
        [("Based on: Paper Difficulty + 15 Seats + Legal Filter + Historical Trends", GREY, False, 1200)], "l")
    # Cut-off table
    categories = [
        ("General / Unreserved", "138 - 144", "69% - 72%", AMBER),
        ("OBC", "133 - 138", "66.5% - 69%", AMBER),
        ("EWS", "130 - 135", "65% - 67.5%", AMBER),
        ("Scheduled Caste (SC)", "120 - 125", "60% - 62.5%", AMBER),
        ("Scheduled Tribe (ST)", "115 - 120", "57.5% - 60%", AMBER),
    ]
    s += make_rect_xml(emu(0.7), emu(1.6), emu(11.7), emu(0.55), STEEL, "CTH")
    s += make_multiline_textbox(emu(0.9), emu(1.65), emu(4.0), emu(0.45),
        [("Category", WHITE, True, 1300)], "l")
    s += make_multiline_textbox(emu(5.5), emu(1.65), emu(3.0), emu(0.45),
        [("Expected Marks", WHITE, True, 1300)], "c")
    s += make_multiline_textbox(emu(9.0), emu(1.65), emu(3.0), emu(0.45),
        [("% Equivalent", WHITE, True, 1300)], "c")
    for i, (cat, marks, pct, color) in enumerate(categories):
        y = emu(2.25 + i * 0.7)
        bg = NAVY if i % 2 == 0 else STEEL
        s += make_rect_xml(emu(0.7), y, emu(11.7), emu(0.65), bg, f"CT{i}")
        s += make_multiline_textbox(emu(0.9), int(y + emu(0.08)), emu(4.0), emu(0.5),
            [(cat, WHITE, True, 1400)], "l")
        s += make_multiline_textbox(emu(5.5), int(y + emu(0.08)), emu(3.0), emu(0.5),
            [(marks, color, True, 1800)], "c")
        s += make_multiline_textbox(emu(9.0), int(y + emu(0.08)), emu(3.0), emu(0.5),
            [(pct, GREY, False, 1300)], "c")
    # Safe score banner
    s += make_rect_xml(emu(1.5), emu(5.9), emu(10.0), emu(1.2), GREEN, "Safe")
    s += make_multiline_textbox(emu(1.7), emu(6.0), emu(9.6), emu(1.0),
        [("SAFE SCORE: 145+ Marks = Definitely Safe (General)", WHITE, True, 2200),
         ("133-144 = Competitive Zone | 125-132 = Borderline", WHITE, False, 1300)], "c")
    return slide_xml(NAVY, s, 8)



def slide_9_good_attempts():
    """Good Attempts breakdown"""
    s = ""
    s += make_multiline_textbox(emu(0.7), emu(0.3), emu(12), emu(0.6),
        [("Good Attempts — Section-wise Breakdown", WHITE, True, 2600)], "l")
    sections = [
        ("Legal Maxims", "~10", "6-8", "Skip unknown Latin terms"),
        ("Legal History", "~15", "10-12", "Mix of easy + tough"),
        ("UK GK (History+Geo)", "~45", "30-35", "Some very specific — skip uncertain"),
        ("Current Affairs", "~20", "15-17", "Mostly direct factual"),
        ("Indian Polity", "~15", "12-14", "Standard constitutional"),
        ("Science/Computer", "~15", "10-12", "Technical but doable"),
        ("Maths/Reasoning", "~20", "15-18", "Time-dependent"),
    ]
    s += make_rect_xml(emu(0.7), emu(1.1), emu(11.7), emu(0.5), STEEL, "GH")
    s += make_multiline_textbox(emu(0.9), emu(1.13), emu(3.5), emu(0.44),
        [("Section", WHITE, True, 1100)], "l")
    s += make_multiline_textbox(emu(4.5), emu(1.13), emu(1.5), emu(0.44),
        [("Total", WHITE, True, 1100)], "c")
    s += make_multiline_textbox(emu(6.2), emu(1.13), emu(2.0), emu(0.44),
        [("Good Attempts", AMBER, True, 1100)], "c")
    s += make_multiline_textbox(emu(8.5), emu(1.13), emu(3.7), emu(0.44),
        [("Strategy", WHITE, True, 1100)], "l")
    for i, (sec, total, good, strat) in enumerate(sections):
        y = emu(1.7 + i * 0.6)
        bg = NAVY if i % 2 == 0 else STEEL
        s += make_rect_xml(emu(0.7), y, emu(11.7), emu(0.55), bg, f"G{i}")
        s += make_multiline_textbox(emu(0.9), int(y + emu(0.05)), emu(3.5), emu(0.45),
            [(sec, WHITE, False, 1100)], "l")
        s += make_multiline_textbox(emu(4.5), int(y + emu(0.05)), emu(1.5), emu(0.45),
            [(total, GREY, False, 1100)], "c")
        s += make_multiline_textbox(emu(6.2), int(y + emu(0.05)), emu(2.0), emu(0.45),
            [(good, AMBER, True, 1200)], "c")
        s += make_multiline_textbox(emu(8.5), int(y + emu(0.05)), emu(3.7), emu(0.45),
            [(strat, GREY, False, 1000)], "l")
    # Total bar
    s += make_rect_xml(emu(0.7), emu(5.9), emu(11.7), emu(0.7), AMBER, "Tot")
    s += make_multiline_textbox(emu(1.0), emu(5.95), emu(11.2), emu(0.6),
        [("TOTAL: 200 Questions | Good Attempts: 150-165 | With 75-80% accuracy = CUT-OFF CLEAR", NAVY, True, 1400)], "c")
    # Tip
    s += make_multiline_textbox(emu(0.7), emu(6.8), emu(11.7), emu(0.5),
        [("TIP: 35-50 uncertain questions CHHODO — negative marking se bachna > zyada attempt karna", WHITE, False, 1200)], "c")
    return slide_xml(NAVY, s, 9)



def slide_10_takeaways():
    """Final Takeaways + CTA for all aspirants"""
    s = ""
    s += make_multiline_textbox(emu(0.7), emu(0.3), emu(12), emu(0.7),
        [("4 Takeaways — Har UKPSC Aspirant Ke Liye", WHITE, True, 2800)], "l")
    takeaways = [
        ("1", "Legal Maxims = New UKPSC Trend",
         "25 common legal terms ki list bana lo. PCS Mains, Ethics, future RO/ARO — sab mein help karega."),
        ("2", "UCC Act 2024 — RATT LO!",
         "Women: 18 | Men: 21 | Registration: Mandatory | Live-in: 60 days. Har exam mein aayega."),
        ("3", "UK Budget 2026-27 = 1,11,703.21 Cr",
         "Ek line. Lower PCS, Secretariat, UKSSSC — next 6 months mein guaranteed question."),
        ("4", "39th National Games = Uttarakhand",
         "Simple fact. 100% upcoming exams mein pucha jayega. Free mark."),
    ]
    for i, (num, title, detail) in enumerate(takeaways):
        y = emu(1.3 + i * 1.4)
        s += make_rect_xml(emu(0.8), y, emu(0.7), emu(0.7), AMBER, f"Tn{i}")
        s += make_multiline_textbox(emu(0.85), int(y + emu(0.05)), emu(0.6), emu(0.6),
            [(num, NAVY, True, 2400)], "c")
        s += make_multiline_textbox(emu(1.7), int(y - emu(0.02)), emu(10.5), emu(0.5),
            [(title, WHITE, True, 1700)], "l")
        s += make_multiline_textbox(emu(1.7), int(y + emu(0.5)), emu(10.5), emu(0.6),
            [(detail, GREY, False, 1200)], "l")
    # CTA banner
    s += make_rect_xml(emu(1.5), emu(6.2), emu(10.3), emu(1.0), AMBER, "CTA")
    s += make_multiline_textbox(emu(1.7), emu(6.3), emu(9.9), emu(0.8),
        [("SUBSCRIBE + Bell | Answer Key Video Coming Soon!", NAVY, True, 1600),
         ("Telegram: @UKPSCDECODED | Full Answer Key PDF + Mains Roadmap", NAVY, False, 1200)], "c")
    return slide_xml(NAVY, s, 10)



# ============================================================
# PPTX INFRASTRUCTURE
# ============================================================

def content_types_xml(n):
    ov = ""
    for i in range(1, n+1):
        ov += f'  <Override PartName="/ppt/slides/slide{i}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>\n'
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="xml" ContentType="application/xml"/>
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
  <Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>
  <Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/>
{ov}</Types>'''

def rels_xml():
    return '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>'''

def presentation_xml(n):
    sl = ""
    for i in range(1, n+1):
        sl += f'    <p:sldId id="{255+i}" r:id="rId{i}"/>\n'
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
  xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId{n+1}"/></p:sldMasterIdLst>
  <p:sldIdLst>\n{sl}  </p:sldIdLst>
  <p:sldSz cx="{SLIDE_W}" cy="{SLIDE_H}"/>
  <p:notesSz cx="{SLIDE_H}" cy="{SLIDE_W}"/>
</p:presentation>'''

def presentation_rels_xml(n):
    r = ""
    for i in range(1, n+1):
        r += f'  <Relationship Id="rId{i}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide{i}.xml"/>\n'
    r += f'  <Relationship Id="rId{n+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>\n'
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
{r}</Relationships>'''



def slide_master_xml():
    return '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
  xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld><p:bg><p:bgPr><a:solidFill><a:srgbClr val="FFFFFF"/></a:solidFill><a:effectLst/></p:bgPr></p:bg><p:spTree>
    <p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
    <p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>
  </p:spTree></p:cSld>
  <p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/>
  <p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst>
</p:sldMaster>'''

def slide_master_rels_xml():
    return '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>
</Relationships>'''

def slide_layout_xml():
    return '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldLayout xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
  xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" type="blank">
  <p:cSld><p:spTree>
    <p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
    <p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>
  </p:spTree></p:cSld>
</p:sldLayout>'''

def slide_layout_rels_xml():
    return '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="../slideMasters/slideMaster1.xml"/>
</Relationships>'''



# ============================================================
# MAIN
# ============================================================

def main():
    out_path = "UKPSC_HC_ARO_2026_Analysis.pptx"
    slides = [
        slide_1_title(),
        slide_2_paper_structure(),
        slide_3_legal_maxims(),
        slide_4_uk_gk_value(),
        slide_5_current_affairs(),
        slide_6_uk_facts(),
        slide_7_difficulty(),
        slide_8_cutoff(),
        slide_9_good_attempts(),
        slide_10_takeaways(),
    ]
    n = len(slides)
    with zipfile.ZipFile(out_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("[Content_Types].xml", content_types_xml(n))
        zf.writestr("_rels/.rels", rels_xml())
        zf.writestr("ppt/presentation.xml", presentation_xml(n))
        zf.writestr("ppt/_rels/presentation.xml.rels", presentation_rels_xml(n))
        zf.writestr("ppt/slideMasters/slideMaster1.xml", slide_master_xml())
        zf.writestr("ppt/slideMasters/_rels/slideMaster1.xml.rels", slide_master_rels_xml())
        zf.writestr("ppt/slideLayouts/slideLayout1.xml", slide_layout_xml())
        zf.writestr("ppt/slideLayouts/_rels/slideLayout1.xml.rels", slide_layout_rels_xml())
        for i, content in enumerate(slides, 1):
            zf.writestr(f"ppt/slides/slide{i}.xml", content)
            zf.writestr(f"ppt/slides/_rels/slide{i}.xml.rels", slide_rels_xml())
    print(f"{'='*60}")
    print(f"  UKPSC HC ARO 2026 Analysis Slides Generated!")
    print(f"{'='*60}")
    print(f"  Output: {out_path}")
    print(f"  Slides: {n}")
    print(f"  1. Title (200 Marks | 15 Seats)")
    print(f"  2. Paper Structure Comparison")
    print(f"  3. Legal Maxims — Filter Section")
    print(f"  4. UK GK Value (Budget, UCC, Games)")
    print(f"  5. Current Affairs Answer Key")
    print(f"  6. UK Facts List (10 points)")
    print(f"  7. Section-wise Difficulty")
    print(f"  8. Expected Cut-Off Table")
    print(f"  9. Good Attempts Breakdown")
    print(f" 10. Takeaways + CTA")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
