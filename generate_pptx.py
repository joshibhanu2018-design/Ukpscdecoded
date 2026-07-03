#!/usr/bin/env python3
"""
Generate UKPSC Decoded Video 1 PPTX presentation.
Uses only Python standard library (zipfile + xml).
Output: UKPSC_Video1_Slides.pptx (Keynote-importable)
"""
import zipfile
import os
from io import BytesIO

# --- Constants ---
EMU = 914400  # 1 inch = 914400 EMU
SLIDE_W = int(13.333 * EMU)
SLIDE_H = int(7.5 * EMU)

# Colors (without #)
NAVY = "16233A"
STEEL = "2E4057"
AMBER = "E0A458"
IVORY = "F7F5F1"
WHITE = "FFFFFF"
CHARCOAL = "2A2A2A"
GREY = "C7CFDB"
MUTED = "6B7280"
GREEN = "3F7D58"
RED_ALERT = "DC3545"



def emu(inches):
    return int(inches * EMU)

def rgb_to_srgb(hex_color):
    return hex_color.upper()

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

def make_textbox(x, y, w, h, texts, font_size=1400, bold=False, color=WHITE, align="l", font="Calibri"):
    """texts can be string or list of (text, color, bold, size) tuples"""
    if isinstance(texts, str):
        texts = [(texts, color, bold, font_size)]
    
    runs = ""
    for t in texts:
        txt, col, bld, sz = t if len(t) == 4 else (t[0], t[1] if len(t)>1 else color, t[2] if len(t)>2 else bold, t[3] if len(t)>3 else font_size)
        b_attr = ' b="1"' if bld else ''
        runs += f'<a:r><a:rPr lang="en-US" sz="{sz}"{b_attr} dirty="0"><a:solidFill><a:srgbClr val="{col}"/></a:solidFill><a:latin typeface="{font}"/></a:rPr><a:t>{txt}</a:t></a:r>'
    
    algn = {"l": "l", "c": "ctr", "r": "r"}.get(align, "l")
    return f'''<p:sp>
  <p:nvSpPr><p:cNvPr id="0" name="TextBox"/><p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr>
  <p:spPr>
    <a:xfrm><a:off x="{x}" y="{y}"/><a:ext cx="{w}" cy="{h}"/></a:xfrm>
    <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
    <a:noFill/>
  </p:spPr>
  <p:txBody>
    <a:bodyPr wrap="square" rtlCol="0"/>
    <a:lstStyle/>
    <a:p><a:pPr algn="{algn}"/>{runs}</a:p>
  </p:txBody>
</p:sp>'''



def make_multiline_textbox(x, y, w, h, lines, font_size=1400, color=WHITE, align="l", font="Calibri"):
    """lines is list of (text, color, bold, size) or just strings"""
    paras = ""
    algn = {"l": "l", "c": "ctr", "r": "r"}.get(align, "l")
    for line in lines:
        if isinstance(line, str):
            txt, col, bld, sz = line, color, False, font_size
        else:
            txt = line[0]
            col = line[1] if len(line) > 1 else color
            bld = line[2] if len(line) > 2 else False
            sz = line[3] if len(line) > 3 else font_size
        b_attr = ' b="1"' if bld else ''
        paras += f'<a:p><a:pPr algn="{algn}"/><a:r><a:rPr lang="en-US" sz="{sz}"{b_attr} dirty="0"><a:solidFill><a:srgbClr val="{col}"/></a:solidFill><a:latin typeface="{font}"/></a:rPr><a:t>{txt}</a:t></a:r></a:p>'
    
    return f'''<p:sp>
  <p:nvSpPr><p:cNvPr id="0" name="TextBox"/><p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr>
  <p:spPr>
    <a:xfrm><a:off x="{x}" y="{y}"/><a:ext cx="{w}" cy="{h}"/></a:xfrm>
    <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
    <a:noFill/>
  </p:spPr>
  <p:txBody>
    <a:bodyPr wrap="square" rtlCol="0"/>
    <a:lstStyle/>
    {paras}
  </p:txBody>
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



# ============ BUILD SLIDES ============

def build_slide_1_title():
    """Title slide - navy bg"""
    shapes = ""
    # Pre-title
    shapes += make_textbox(emu(0.8), emu(1.2), emu(11.7), emu(0.5),
        "UKPSC GS1 — PYQ DEEP ANALYSIS", font_size=1500, bold=True, color=AMBER, align="l")
    # Main title
    shapes += make_textbox(emu(0.8), emu(1.8), emu(11.7), emu(1.5),
        [("450+ Questions. 4 Papers. Asli Pattern.", WHITE, True, 4000)], align="l")
    # Subtitle
    shapes += make_textbox(emu(0.8), emu(3.3), emu(11), emu(0.5),
        "2016 · 2021 · 2024 · 2025 — Question-by-Question, Cluster-by-Cluster", 
        font_size=1700, color=GREY, align="l")
    # Three stat boxes
    shapes += make_rect_xml(emu(0.8), emu(4.5), emu(3.5), emu(1.2), STEEL, "Box1")
    shapes += make_multiline_textbox(emu(0.9), emu(4.6), emu(3.3), emu(1.0),
        [("600", AMBER, True, 3400), ("Questions Tagged", GREY, False, 1200)], align="c")
    
    shapes += make_rect_xml(emu(4.5), emu(4.5), emu(3.5), emu(1.2), STEEL, "Box2")
    shapes += make_multiline_textbox(emu(4.6), emu(4.6), emu(3.3), emu(1.0),
        [("14", AMBER, True, 3400), ("Repeat-Topic Clusters", GREY, False, 1200)], align="c")
    
    shapes += make_rect_xml(emu(8.2), emu(4.5), emu(3.5), emu(1.2), STEEL, "Box3")
    shapes += make_multiline_textbox(emu(8.3), emu(4.6), emu(3.3), emu(1.0),
        [("8", AMBER, True, 3400), ("Confirmed Cross-Year Repeats", GREY, False, 1200)], align="c")
    
    return slide_xml(NAVY, shapes, 1)



def build_slide_2_data():
    """What I Analysed - ivory bg"""
    shapes = ""
    shapes += make_textbox(emu(0.7), emu(0.5), emu(11.9), emu(0.8),
        [("What I Analysed", NAVY, True, 3200)], font="Calibri")
    shapes += make_textbox(emu(0.7), emu(1.2), emu(11.9), emu(0.5),
        "4 Official Papers. Every Question Hand-Tagged. Subject + Unit + Repeat Status.",
        font_size=1500, color=MUTED)
    
    # 4 paper cards
    for i, (yr, qs) in enumerate([("2016","150 Qs"),("2021","150 Qs"),("2024","150 Qs"),("2025","150 Qs")]):
        x = emu(0.7 + i * 3.1)
        shapes += make_rect_xml(x, emu(2.1), emu(2.8), emu(2.2), WHITE, f"Card{yr}")
        shapes += make_multiline_textbox(x, emu(2.3), emu(2.8), emu(1.8),
            [("UKPCS", MUTED, False, 1100), (yr, NAVY, True, 4000), (qs, AMBER, True, 1400)], align="c")
    
    # Bottom bar
    shapes += make_rect_xml(emu(0.7), emu(4.8), emu(11.9), emu(1.5), NAVY, "BottomBar")
    shapes += make_multiline_textbox(emu(1.0), emu(5.0), emu(11.3), emu(1.1),
        [("Every question tagged:", WHITE, True, 1600),
         ("Subject · Syllabus Unit · Cross-year repeat check", GREY, False, 1500)], align="l")
    
    return slide_xml(IVORY, shapes, 2)



def build_slide_3_maiti():
    """Maiti Movement - confirmed repeat"""
    shapes = ""
    shapes += make_textbox(emu(0.7), emu(0.4), emu(11.9), emu(0.6),
        [("CONFIRMED REPEAT: Maiti Movement", NAVY, True, 2700)], font="Calibri")
    shapes += make_textbox(emu(0.7), emu(0.95), emu(11.9), emu(0.4),
        "Same topic. 3 year gap. Different option order. Same answer.",
        font_size=1400, color=MUTED)
    
    # Left card - 2021
    shapes += make_rect_xml(emu(0.7), emu(1.6), emu(5.7), emu(2.8), WHITE, "Q2021")
    shapes += make_rect_xml(emu(0.9), emu(1.8), emu(1.8), emu(0.4), AMBER, "Badge2021")
    shapes += make_textbox(emu(0.9), emu(1.8), emu(1.8), emu(0.4),
        [("UKPCS 2021", NAVY, True, 1100)], align="c")
    shapes += make_textbox(emu(3.0), emu(1.8), emu(3.2), emu(0.4),
        [("Q.99", STEEL, True, 1600)], align="r")
    shapes += make_multiline_textbox(emu(0.9), emu(2.4), emu(5.3), emu(1.8),
        [("Who initiated the 'Maiti Movement'", CHARCOAL, True, 1400),
         ("in Uttarakhand?", CHARCOAL, True, 1400),
         ("", CHARCOAL, False, 800),
         ("A) Sundar Lal Bahuguna", MUTED, False, 1200),
         ("B) Chandi Prasad Bhatt", MUTED, False, 1200),
         ("C) Kalyan Singh Rawat  ✓", GREEN, True, 1200),
         ("D) Medha Patkar", MUTED, False, 1200)])
    
    # Right card - 2024
    shapes += make_rect_xml(emu(6.7), emu(1.6), emu(5.7), emu(2.8), WHITE, "Q2024")
    shapes += make_rect_xml(emu(6.9), emu(1.8), emu(1.8), emu(0.4), AMBER, "Badge2024")
    shapes += make_textbox(emu(6.9), emu(1.8), emu(1.8), emu(0.4),
        [("UKPCS 2024", NAVY, True, 1100)], align="c")
    shapes += make_textbox(emu(9.0), emu(1.8), emu(3.2), emu(0.4),
        [("Q.24", STEEL, True, 1600)], align="r")
    shapes += make_multiline_textbox(emu(6.9), emu(2.4), emu(5.3), emu(1.8),
        [("Who started the 'Maiti Movement'", CHARCOAL, True, 1400),
         ("for plantation?", CHARCOAL, True, 1400),
         ("", CHARCOAL, False, 800),
         ("A) Bhagat Singh Rawat", MUTED, False, 1200),
         ("B) Kalyan Singh Rawat  ✓", GREEN, True, 1200),
         ("C) Sundar Lal Bahuguna", MUTED, False, 1200),
         ("D) Mohan Singh Negi", MUTED, False, 1200)])
    
    # Bottom insight bar
    shapes += make_rect_xml(emu(0.7), emu(4.7), emu(11.7), emu(1.8), NAVY, "InsightBar")
    shapes += make_multiline_textbox(emu(1.0), emu(4.9), emu(11.2), emu(1.4),
        [("Answer both times: Kalyan Singh Rawat", AMBER, True, 1600),
         ("Options reordered. Wording changed. Core fact: identical.", GREY, False, 1400),
         ("Pattern: Movement-Founder recall questions repeat.", GREY, False, 1400)])
    
    return slide_xml(IVORY, shapes, 3)



def build_slide_4_wildlife():
    """Wildlife cluster - 6 questions"""
    shapes = ""
    shapes += make_textbox(emu(0.7), emu(0.3), emu(11.9), emu(0.6),
        [("Wildlife Sanctuaries & National Parks", NAVY, True, 2500)], font="Calibri")
    shapes += make_textbox(emu(0.7), emu(0.85), emu(11.9), emu(0.4),
        "Every single paper. Format: Match / Arrange / Identify. Most reliable cluster.",
        font_size=1300, color=MUTED)
    
    # 6 question cards (2x3 grid)
    cards = [
        ("2024", "Q.86", "Match Sanctuary → Year:\nGovind WLS-1955\nValley of Flowers-1982\nKedarnath-1972"),
        ("2024", "Q.87", "Match Sanctuary → District:\nSona Nadi-Pauri\nAskote-Pithoragarh\nGovind-Uttarkashi"),
        ("2021", "Q.23", "Govind National Park\nincludes source of\nwhich river? (Tons ✓)"),
        ("2025", "Q.19", "Match Wildlife Sanctuary\nwith Location:\nAskot, Binsar, Govind,\nNandhaur"),
        ("2025", "Q.22", "National Parks — Year:\nGovind-1989, Rajaji-1983\nCorbett-1936, Gangotri-1989"),
        ("2024", "Q.102", "Kedarnath WLS for\nconservation of which\nanimal? (Musk Deer ✓)"),
    ]
    for i, (yr, qno, txt) in enumerate(cards):
        col = i % 3
        row = i // 3
        x = emu(0.7 + col * 4.1)
        y = emu(1.5 + row * 2.7)
        shapes += make_rect_xml(x, y, emu(3.8), emu(2.4), WHITE, f"WCard{i}")
        shapes += make_rect_xml(int(x + emu(0.15)), int(y + emu(0.15)), emu(1.4), emu(0.35), AMBER, f"WBadge{i}")
        shapes += make_textbox(int(x + emu(0.15)), int(y + emu(0.15)), emu(1.4), emu(0.35),
            [(yr, NAVY, True, 1000)], align="c")
        shapes += make_textbox(int(x + emu(2.2)), int(y + emu(0.15)), emu(1.4), emu(0.35),
            [(qno, STEEL, True, 1200)], align="r")
        shapes += make_textbox(int(x + emu(0.15)), int(y + emu(0.6)), emu(3.5), emu(1.6),
            txt, font_size=1150, color=CHARCOAL)
    
    return slide_xml(IVORY, shapes, 4)



def build_slide_5_govind_trap():
    """The Govind Trap - dark dramatic slide"""
    shapes = ""
    shapes += make_textbox(emu(0.7), emu(0.4), emu(11.9), emu(0.7),
        [("WARNING: Most Common Student Mistake", WHITE, True, 2500)])
    
    # Left card - Sanctuary
    shapes += make_rect_xml(emu(0.7), emu(1.4), emu(5.7), emu(3.0), STEEL, "GovindLeft")
    shapes += make_multiline_textbox(emu(1.0), emu(1.6), emu(5.2), emu(2.6),
        [("Govind Wildlife SANCTUARY", AMBER, True, 1600),
         ("Paper: 2024, Q.86", GREY, False, 1200),
         ("", WHITE, False, 800),
         ("Established: 1955", WHITE, True, 3000),
         ("", WHITE, False, 800),
         ("Status: Wildlife Sanctuary", GREY, False, 1300),
         ("Uttarkashi District", GREY, False, 1300)])
    
    # Right card - National Park
    shapes += make_rect_xml(emu(6.7), emu(1.4), emu(5.7), emu(3.0), STEEL, "GovindRight")
    shapes += make_multiline_textbox(emu(7.0), emu(1.6), emu(5.2), emu(2.6),
        [("Govind NATIONAL PARK", AMBER, True, 1600),
         ("Paper: 2025, Q.22", GREY, False, 1200),
         ("", WHITE, False, 800),
         ("Established: 1989", WHITE, True, 3000),
         ("", WHITE, False, 800),
         ("Status: National Park (carved out)", GREY, False, 1300),
         ("Separate legal entity", GREY, False, 1300)])
    
    # Bottom amber warning bar
    shapes += make_rect_xml(emu(0.7), emu(4.8), emu(11.7), emu(1.6), AMBER, "WarnBar")
    shapes += make_multiline_textbox(emu(1.0), emu(5.0), emu(11.2), emu(1.2),
        [("Sanctuary ≠ National Park", NAVY, True, 1800),
         ("Same name. Different entity. Different year. UKPSC's favourite trap.", NAVY, False, 1500)], align="c")
    
    return slide_xml(NAVY, shapes, 5)



def build_slide_6_institutes():
    """Central Institutes cluster"""
    shapes = ""
    shapes += make_textbox(emu(0.7), emu(0.3), emu(11.9), emu(0.6),
        [("Central Govt Institutes in Uttarakhand", NAVY, True, 2500)])
    shapes += make_textbox(emu(0.7), emu(0.85), emu(11.9), emu(0.4),
        "Same 12 institutes. Every paper. Format: Which is / Which is NOT / Match with city.",
        font_size=1300, color=MUTED)
    
    cards = [
        ("2024", "Q.115", "HQ in Dehradun — which?\nASI / Survey of India /\nBSI / GSI"),
        ("2021", "Q.74", "Which is NOT in UK?\nCBRI / ONGC /\nHAL / BHEL"),
        ("2025", "Q.111", "Incorrect match:\nASI-Dehradun /\nHydrology-Roorkee /\nFRI-Dehradun /\nFisheries-Haldwani"),
    ]
    for i, (yr, qno, txt) in enumerate(cards):
        x = emu(0.7 + i * 4.1)
        shapes += make_rect_xml(x, emu(1.5), emu(3.8), emu(2.8), WHITE, f"ICard{i}")
        shapes += make_rect_xml(int(x + emu(0.15)), int(emu(1.5) + emu(0.15)), emu(1.4), emu(0.35), AMBER, f"IBadge{i}")
        shapes += make_textbox(int(x + emu(0.15)), int(emu(1.5) + emu(0.15)), emu(1.4), emu(0.35),
            [(yr, NAVY, True, 1000)], align="c")
        shapes += make_textbox(int(x + emu(2.2)), int(emu(1.5) + emu(0.15)), emu(1.4), emu(0.35),
            [(qno, STEEL, True, 1200)], align="r")
        shapes += make_textbox(int(x + emu(0.15)), int(emu(1.5) + emu(0.7)), emu(3.5), emu(1.8),
            txt, font_size=1200, color=CHARCOAL)
    
    # Action bar
    shapes += make_rect_xml(emu(0.7), emu(4.7), emu(11.7), emu(1.6), NAVY, "ActionBar")
    shapes += make_multiline_textbox(emu(1.0), emu(4.9), emu(11.2), emu(1.2),
        [("Action: Make a list of 12 institutes × City × Function", AMBER, True, 1600),
         ("15 minutes. Guaranteed 1-2 marks every paper.", GREY, False, 1400)])
    
    return slide_xml(IVORY, shapes, 6)



def build_slide_7_takeaways():
    """Takeaways / Action Items"""
    shapes = ""
    shapes += make_textbox(emu(0.7), emu(0.4), emu(11.9), emu(0.8),
        [("Action Items — Karna Kya Hai", WHITE, True, 3200)])
    
    actions = [
        ("1", "Wildlife Master Table", "20 Protected Areas × Name / Year / District / Species / Legal Status"),
        ("2", "Movement-Founder List", "15-20 UK Movements × Founder × Year × Type"),
        ("3", "Central Institutes List", "12 Institutes × City × Function"),
    ]
    for i, (num, title, detail) in enumerate(actions):
        y_base = emu(1.5 + i * 1.7)
        shapes += make_rect_xml(emu(0.8), y_base, emu(0.65), emu(0.65), AMBER, f"Num{i}")
        shapes += make_textbox(emu(0.8), y_base, emu(0.65), emu(0.65),
            [(num, NAVY, True, 2400)], align="c")
        shapes += make_textbox(emu(1.7), int(y_base - emu(0.05)), emu(10.5), emu(0.5),
            [(title, WHITE, True, 1800)])
        shapes += make_textbox(emu(1.7), int(y_base + emu(0.5)), emu(10.5), emu(0.5),
            [(detail, GREY, False, 1400)])
    
    # Bottom summary
    shapes += make_rect_xml(emu(0.7), emu(6.0), emu(11.7), emu(0.8), STEEL, "SumBar")
    shapes += make_textbox(emu(1.0), emu(6.1), emu(11.2), emu(0.6),
        [("3 lists. 2 hours. 8-10 guaranteed marks.", AMBER, True, 1700)], align="c")
    
    return slide_xml(NAVY, shapes, 7)



def build_slide_8_cta():
    """End card / CTA"""
    shapes = ""
    # Pre-title
    shapes += make_textbox(emu(0.8), emu(1.5), emu(11.7), emu(0.5),
        [("Next Video...", AMBER, True, 1600)])
    # Main text
    shapes += make_textbox(emu(0.8), emu(2.2), emu(11.7), emu(1.5),
        [("Dynasty Cluster — 12 Questions in ONE Paper", WHITE, True, 3200)])
    shapes += make_textbox(emu(0.8), emu(3.5), emu(11.7), emu(0.5),
        [("The densest pattern nobody warns you about.", GREY, False, 1700)])
    # CTA
    shapes += make_rect_xml(emu(2.5), emu(4.8), emu(8.3), emu(1.2), AMBER, "CTABox")
    shapes += make_multiline_textbox(emu(2.7), emu(4.9), emu(7.9), emu(1.0),
        [("FREE PYQ Tracker — Telegram Link in Description", NAVY, True, 1700),
         ("Comment 'TRACKER' — Link milega | Subscribe + Bell", NAVY, False, 1400)], align="c")
    # Bottom
    shapes += make_textbox(emu(0.8), emu(6.5), emu(11.7), emu(0.5),
        [("UKPSC DECODED — Prepare Smarter, Not Longer", GREY, False, 1300)], align="c")
    
    return slide_xml(NAVY, shapes, 8)



# ============ PPTX ASSEMBLY ============

def content_types_xml(num_slides):
    overrides = ""
    for i in range(1, num_slides + 1):
        overrides += f'  <Override PartName="/ppt/slides/slide{i}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>\n'
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="xml" ContentType="application/xml"/>
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
  <Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>
  <Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/>
{overrides}</Types>'''

def rels_xml():
    return '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>'''



def presentation_xml(num_slides):
    slide_list = ""
    for i in range(1, num_slides + 1):
        slide_list += f'    <p:sldId id="{255+i}" r:id="rId{i}"/>\n'
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
  xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:sldMasterIdLst>
    <p:sldMasterId id="2147483648" r:id="rId{num_slides+1}"/>
  </p:sldMasterIdLst>
  <p:sldIdLst>
{slide_list}  </p:sldIdLst>
  <p:sldSz cx="{SLIDE_W}" cy="{SLIDE_H}"/>
  <p:notesSz cx="{SLIDE_H}" cy="{SLIDE_W}"/>
</p:presentation>'''

def presentation_rels_xml(num_slides):
    rels = ""
    for i in range(1, num_slides + 1):
        rels += f'  <Relationship Id="rId{i}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide{i}.xml"/>\n'
    rels += f'  <Relationship Id="rId{num_slides+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>\n'
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
{rels}</Relationships>'''



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



def main():
    out_path = "/projects/sandbox/Ukpscdecoded/UKPSC_Video1_Slides.pptx"
    
    slides = [
        build_slide_1_title(),
        build_slide_2_data(),
        build_slide_3_maiti(),
        build_slide_4_wildlife(),
        build_slide_5_govind_trap(),
        build_slide_6_institutes(),
        build_slide_7_takeaways(),
        build_slide_8_cta(),
    ]
    num = len(slides)
    
    with zipfile.ZipFile(out_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("[Content_Types].xml", content_types_xml(num))
        zf.writestr("_rels/.rels", rels_xml())
        zf.writestr("ppt/presentation.xml", presentation_xml(num))
        zf.writestr("ppt/_rels/presentation.xml.rels", presentation_rels_xml(num))
        zf.writestr("ppt/slideMasters/slideMaster1.xml", slide_master_xml())
        zf.writestr("ppt/slideMasters/_rels/slideMaster1.xml.rels", slide_master_rels_xml())
        zf.writestr("ppt/slideLayouts/slideLayout1.xml", slide_layout_xml())
        zf.writestr("ppt/slideLayouts/_rels/slideLayout1.xml.rels", slide_layout_rels_xml())
        
        for i, slide_content in enumerate(slides, 1):
            zf.writestr(f"ppt/slides/slide{i}.xml", slide_content)
            zf.writestr(f"ppt/slides/_rels/slide{i}.xml.rels", slide_rels_xml())
    
    print(f"Generated: {out_path}")
    print(f"Slides: {num}")
    print("Ready for Keynote import!")

if __name__ == "__main__":
    main()
