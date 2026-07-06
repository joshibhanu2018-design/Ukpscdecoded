#!/usr/bin/env python3
"""
Generate UKPSC Decoded Video 2 PPTX — Note-Making Masterclass
"The Note-Making Architecture Toppers Hide"
Style: Authority Masterclass Dark-Mode (Carbon #171717, Gold #D4A373, Teal #7B9E89)
Output: UKPSC_Video2_Slides.pptx (Keynote-importable)
"""
import zipfile

# --- Constants ---
EMU = 914400  # 1 inch = 914400 EMU
SLIDE_W = int(13.333 * EMU)
SLIDE_H = int(7.5 * EMU)

# Authority Masterclass Palette
CARBON = "171717"       # Background
CARD_BG = "222222"      # Container boxes
CARD_BORDER = "333333"  # Box borders
GOLD = "D4A373"         # Accent: titles, numbers, tip borders
TEAL = "7B9E89"         # Secondary accent
BODY_TEXT = "E5E5E5"    # Body text
MUTED = "9CA3AF"        # Upper-case headers, secondary text
WHITE = "FFFFFF"
DARK = "111111"


def emu(inches):
    return int(inches * EMU)



def make_rect_xml(x, y, w, h, fill_color, border_color=None, name="Rect"):
    border = f'<a:ln w="12700"><a:solidFill><a:srgbClr val="{border_color}"/></a:solidFill></a:ln>' if border_color else '<a:ln><a:noFill/></a:ln>'
    return f'''<p:sp>
  <p:nvSpPr><p:cNvPr id="0" name="{name}"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr>
  <p:spPr>
    <a:xfrm><a:off x="{x}" y="{y}"/><a:ext cx="{w}" cy="{h}"/></a:xfrm>
    <a:prstGeom prst="roundRect"><a:avLst><a:gd name="adj" fmla="val 3000"/></a:avLst></a:prstGeom>
    <a:solidFill><a:srgbClr val="{fill_color}"/></a:solidFill>
    {border}
  </p:spPr>
  <p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:endParaRPr lang="en-US"/></a:p></p:txBody>
</p:sp>'''


def make_line_xml(x1, y1, x2, y2, color, width=12700):
    """Horizontal separator line"""
    return f'''<p:sp>
  <p:nvSpPr><p:cNvPr id="0" name="Line"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr>
  <p:spPr>
    <a:xfrm><a:off x="{x1}" y="{y1}"/><a:ext cx="{x2-x1}" cy="0"/></a:xfrm>
    <a:prstGeom prst="line"><a:avLst/></a:prstGeom>
    <a:ln w="{width}"><a:solidFill><a:srgbClr val="{color}"/></a:solidFill></a:ln>
  </p:spPr>
</p:sp>'''



def make_textbox(x, y, w, h, texts, font_size=1400, bold=False, color=BODY_TEXT, align="l", font="Inter"):
    """texts can be string or list of (text, color, bold, size) tuples"""
    if isinstance(texts, str):
        texts = [(texts, color, bold, font_size)]
    runs = ""
    for t in texts:
        txt, col, bld, sz = t if len(t) == 4 else (t[0], t[1] if len(t)>1 else color, t[2] if len(t)>2 else bold, t[3] if len(t)>3 else font_size)
        b_attr = ' b="1"' if bld else ''
        txt_escaped = txt.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        runs += f'<a:r><a:rPr lang="en-US" sz="{sz}"{b_attr} dirty="0"><a:solidFill><a:srgbClr val="{col}"/></a:solidFill><a:latin typeface="{font}"/></a:rPr><a:t>{txt_escaped}</a:t></a:r>'
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



def make_multiline_textbox(x, y, w, h, lines, font_size=1400, color=BODY_TEXT, align="l", font="Inter", line_spacing=None):
    """lines is list of (text, color, bold, size) tuples or strings"""
    paras = ""
    algn = {"l": "l", "c": "ctr", "r": "r"}.get(align, "l")
    spc_attr = f'<a:lnSpc><a:spcPts val="{line_spacing}"/></a:lnSpc>' if line_spacing else ''
    for line in lines:
        if isinstance(line, str):
            txt, col, bld, sz = line, color, False, font_size
        else:
            txt = line[0]
            col = line[1] if len(line) > 1 else color
            bld = line[2] if len(line) > 2 else False
            sz = line[3] if len(line) > 3 else font_size
        b_attr = ' b="1"' if bld else ''
        txt_escaped = txt.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        paras += f'<a:p><a:pPr algn="{algn}">{spc_attr}</a:pPr><a:r><a:rPr lang="en-US" sz="{sz}"{b_attr} dirty="0"><a:solidFill><a:srgbClr val="{col}"/></a:solidFill><a:latin typeface="{font}"/></a:rPr><a:t>{txt_escaped}</a:t></a:r></a:p>'
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



def slide_xml(shapes_xml):
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
       xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
       xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:bg><p:bgPr><a:solidFill><a:srgbClr val="{CARBON}"/></a:solidFill><a:effectLst/></p:bgPr></p:bg>
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


def insider_tip_box(x, y, w, h, tip_text):
    """The golden-bordered 'Insider Tip' box component"""
    shapes = ""
    shapes += make_rect_xml(x, y, w, h, CARBON, border_color=GOLD, name="TipBox")
    shapes += make_textbox(int(x + emu(0.25)), int(y + emu(0.15)), int(w - emu(0.5)), int(h - emu(0.3)),
        [("★ ", GOLD, False, 1400), ("Insider Tip  ", GOLD, True, 1400), (tip_text, BODY_TEXT, False, 1400)])
    return shapes



# ============================================================
# SLIDE 1: TITLE
# ============================================================
def build_slide_01_title():
    s = ""
    # Upper-case header
    s += make_textbox(emu(0.8), emu(1.0), emu(7), emu(0.5),
        "M A S T E R C L A S S", font_size=1200, bold=True, color=MUTED, font="Inter")
    # Main serif title
    s += make_textbox(emu(0.8), emu(1.8), emu(7), emu(2.0),
        [("The Note-Making", BODY_TEXT, True, 4800)], font="Garamond")
    s += make_textbox(emu(0.8), emu(2.8), emu(7), emu(1.5),
        [("Architecture Toppers Hide", BODY_TEXT, True, 4800)], font="Garamond")
    # Gold separator
    s += make_line_xml(emu(0.8), emu(4.2), emu(3.5), emu(4.2), GOLD)
    # Subtitle
    s += make_textbox(emu(0.8), emu(4.5), emu(7), emu(0.5),
        "The 5-Layer System Behind 800+ Mains Scores", font_size=1600, color=BODY_TEXT)
    # Three pill boxes
    pills = [("5 Layers", 0.8), ("4 Secrets", 3.2), ("1 Page Rule", 5.6)]
    for label, px in pills:
        s += make_rect_xml(emu(px), emu(5.3), emu(2.0), emu(0.5), CARBON, border_color=GOLD, name="Pill")
        s += make_textbox(emu(px), emu(5.35), emu(2.0), emu(0.45),
            [(label, GOLD, False, 1200)], align="c")
    return slide_xml(s)



# ============================================================
# SLIDE 2: THE DIAGNOSIS — Summary ≠ Notes
# ============================================================
def build_slide_02_diagnosis():
    s = ""
    s += make_textbox(emu(0.8), emu(0.5), emu(7), emu(0.4),
        "T H E  D I A G N O S I S", font_size=1200, bold=True, color=MUTED)
    s += make_textbox(emu(0.8), emu(1.0), emu(7), emu(1.2),
        [("Summary ≠ Notes", BODY_TEXT, True, 4400)], font="Garamond")
    s += make_line_xml(emu(0.8), emu(2.0), emu(3.5), emu(2.0), GOLD)
    # Quote
    s += make_textbox(emu(0.8), emu(2.3), emu(7), emu(0.8),
        [("\"If your notes are a smaller version of the book, you haven't made notes.\"", GOLD, False, 1500)],
        font="Garamond")
    # Two comparison boxes
    # LEFT — Wrong approach
    s += make_rect_xml(emu(0.8), emu(3.4), emu(3.3), emu(2.8), CARD_BG, border_color=CARD_BORDER, name="WrongBox")
    s += make_multiline_textbox(emu(1.0), emu(3.6), emu(3.0), emu(2.5),
        [("THE SUMMARY TRAP", MUTED, True, 1100),
         ("", BODY_TEXT, False, 600),
         ("1. Read chapter 3 times", BODY_TEXT, False, 1300),
         ("2. Condense to 10 pages", BODY_TEXT, False, 1300),
         ("3. Re-read like a book", BODY_TEXT, False, 1300),
         ("4. Same recall lag", BODY_TEXT, False, 1300),
         ("", BODY_TEXT, False, 600),
         ("Result: Page count changed.", MUTED, False, 1200),
         ("Processing speed didn't.", MUTED, False, 1200)])
    # RIGHT — Correct approach
    s += make_rect_xml(emu(4.4), emu(3.4), emu(3.3), emu(2.8), CARD_BG, border_color=TEAL, name="RightBox")
    s += make_multiline_textbox(emu(4.6), emu(3.6), emu(3.0), emu(2.5),
        [("THE SYSTEM", TEAL, True, 1100),
         ("", BODY_TEXT, False, 600),
         ("1. Demand-deconstruct PYQs", BODY_TEXT, False, 1300),
         ("2. Remove overlap", BODY_TEXT, False, 1300),
         ("3. Structure by dimension", BODY_TEXT, False, 1300),
         ("4. Instant retrieval", BODY_TEXT, False, 1300),
         ("", BODY_TEXT, False, 600),
         ("Result: Recall is instant.", TEAL, False, 1200),
         ("Structure = muscle memory.", TEAL, False, 1200)])
    # Tip
    s += insider_tip_box(emu(0.8), emu(6.5), emu(7.0), emu(0.6),
        "Compression without a framework doesn't create recall pathways.")
    return slide_xml(s)



# ============================================================
# SLIDE 3: LAYER 1 — Content Sourcing
# ============================================================
def build_slide_03_layer1():
    s = ""
    s += make_textbox(emu(0.8), emu(0.5), emu(7), emu(0.4),
        "L A Y E R  1", font_size=1200, bold=True, color=TEAL)
    s += make_textbox(emu(0.8), emu(1.0), emu(7), emu(1.0),
        [("Content Sourcing", BODY_TEXT, True, 4000)], font="Garamond")
    s += make_line_xml(emu(0.8), emu(1.9), emu(3.5), emu(1.9), GOLD)
    s += make_textbox(emu(0.8), emu(2.2), emu(7), emu(0.5),
        "Three sources. One system. Everything else is noise.", font_size=1500, color=MUTED)
    # Three source circles (boxes styled as circles)
    sources = [
        ("Syllabus", "The skeleton. Every note\nmust trace back to a\nsyllabus line."),
        ("PYQs", "The demand map. What\nUPSC/UKPSC actually\nasks — not what you\nassume they ask."),
        ("Current Affairs", "The living layer. Folded\ninto structure, never\nstored separately."),
    ]
    for i, (title, desc) in enumerate(sources):
        x = emu(0.8 + i * 2.5)
        s += make_rect_xml(x, emu(3.0), emu(2.2), emu(2.8), CARD_BG, border_color=CARD_BORDER, name=f"Src{i}")
        s += make_textbox(x, emu(3.2), emu(2.2), emu(0.5),
            [(title, GOLD, True, 1500)], align="c")
        s += make_multiline_textbox(int(x + emu(0.15)), emu(3.8), emu(1.9), emu(1.8),
            [(line, BODY_TEXT, False, 1100) for line in desc.split("\n")], align="c")
    # Tip
    s += insider_tip_box(emu(0.8), emu(6.3), emu(7.0), emu(0.6),
        "Never build notes from a raw book alone. Build from demands.")
    return slide_xml(s)



# ============================================================
# SLIDE 4: LAYER 2 — Micro-Thematic Structuring (Demand Deconstruction)
# ============================================================
def build_slide_04_layer2():
    s = ""
    s += make_textbox(emu(0.8), emu(0.5), emu(7), emu(0.4),
        "L A Y E R  2", font_size=1200, bold=True, color=TEAL)
    s += make_textbox(emu(0.8), emu(1.0), emu(7), emu(1.0),
        [("Micro-Thematic Structuring", BODY_TEXT, True, 3600)], font="Garamond")
    s += make_line_xml(emu(0.8), emu(1.85), emu(3.5), emu(1.85), GOLD)
    s += make_textbox(emu(0.8), emu(2.1), emu(7), emu(0.5),
        "Don't build notes topic-by-topic. Build them demand-by-demand.", font_size=1500, color=GOLD, font="Garamond")
    # Before/After flow
    # Before box
    s += make_rect_xml(emu(0.8), emu(2.9), emu(3.0), emu(2.5), CARD_BG, border_color=CARD_BORDER, name="Before")
    s += make_multiline_textbox(emu(1.0), emu(3.0), emu(2.6), emu(2.3),
        [("BEFORE", MUTED, True, 1100),
         ("", BODY_TEXT, False, 500),
         ("22 PYQs on Globalisation", BODY_TEXT, False, 1200),
         ("Impact on women", BODY_TEXT, False, 1100),
         ("Impact on elderly", BODY_TEXT, False, 1100),
         ("Cultural identity", BODY_TEXT, False, 1100),
         ("Technology effects", BODY_TEXT, False, 1100),
         ("Trade dynamics", BODY_TEXT, False, 1100),
         ("...and 17 more overlaps", MUTED, False, 1100)])
    # Arrow
    s += make_textbox(emu(4.0), emu(3.8), emu(0.8), emu(0.6),
        [("-->", GOLD, True, 2400)], align="c")
    # After box
    s += make_rect_xml(emu(4.8), emu(2.9), emu(3.0), emu(2.5), CARD_BG, border_color=TEAL, name="After")
    s += make_multiline_textbox(emu(5.0), emu(3.0), emu(2.6), emu(2.3),
        [("AFTER", TEAL, True, 1100),
         ("", BODY_TEXT, False, 500),
         ("9 Real Dimensions", GOLD, True, 1500),
         ("", BODY_TEXT, False, 400),
         ("Redundancy removed", BODY_TEXT, False, 1200),
         ("Same content coverage", BODY_TEXT, False, 1200),
         ("1/3 the pages", BODY_TEXT, False, 1200),
         ("3x retrieval speed", BODY_TEXT, False, 1200)])
    # Tip
    s += insider_tip_box(emu(0.8), emu(6.0), emu(7.0), emu(0.7),
        "UPSC rotates the same 3-4 dimensions in different costumes. Find the costume, ignore the noise.")
    return slide_xml(s)



# ============================================================
# SLIDE 5: LAYER 3 — Cross-Paper Consolidation
# ============================================================
def build_slide_05_layer3():
    s = ""
    s += make_textbox(emu(0.8), emu(0.5), emu(7), emu(0.4),
        "L A Y E R  3", font_size=1200, bold=True, color=TEAL)
    s += make_textbox(emu(0.8), emu(1.0), emu(7), emu(1.0),
        [("Cross-Paper Consolidation", BODY_TEXT, True, 3600)], font="Garamond")
    s += make_line_xml(emu(0.8), emu(1.85), emu(3.5), emu(1.85), GOLD)
    s += make_textbox(emu(0.8), emu(2.1), emu(7), emu(0.5),
        "One fact. Multiple papers. Maximum marks per unit of knowledge.", font_size=1400, color=MUTED)
    # Center example: "Women" theme across papers
    s += make_textbox(emu(2.5), emu(2.8), emu(3.0), emu(0.5),
        [("THEME: Women", GOLD, True, 1600)], align="c")
    # Four GS boxes
    papers = [
        ("GS1", "Society: Status,\neducation, workforce"),
        ("GS2", "Governance: SHGs,\npolicies, rights"),
        ("GS3", "Economy: Labour\nparticipation, MUDRA"),
        ("GS4", "Ethics: Feminist\nethics, case studies"),
    ]
    for i, (gs, desc) in enumerate(papers):
        x = emu(0.8 + i * 1.85)
        s += make_rect_xml(x, emu(3.5), emu(1.7), emu(2.0), CARD_BG, border_color=CARD_BORDER, name=f"GS{i}")
        s += make_textbox(x, emu(3.6), emu(1.7), emu(0.4),
            [(gs, TEAL, True, 1400)], align="c")
        lines_list = desc.split("\n")
        s += make_multiline_textbox(int(x + emu(0.1)), emu(4.1), emu(1.5), emu(1.2),
            [(l, BODY_TEXT, False, 1050) for l in lines_list], align="c")
    # Bottom principle
    s += make_rect_xml(emu(0.8), emu(5.8), emu(7.0), emu(0.7), CARD_BG, border_color=CARD_BORDER, name="Principle")
    s += make_textbox(emu(1.0), emu(5.9), emu(6.6), emu(0.5),
        [("Principle: ", GOLD, True, 1400), ("Content is limited; application is unlimited.", BODY_TEXT, False, 1400)])
    # Tip
    s += insider_tip_box(emu(0.8), emu(6.7), emu(7.0), emu(0.55),
        "Ask for every fact: 'Where else could this live?' — one habit that shrinks total load.")
    return slide_xml(s)



# ============================================================
# SLIDE 6: LAYER 4 — Periodic Enrichment
# ============================================================
def build_slide_06_layer4():
    s = ""
    s += make_textbox(emu(0.8), emu(0.5), emu(7), emu(0.4),
        "L A Y E R  4", font_size=1200, bold=True, color=TEAL)
    s += make_textbox(emu(0.8), emu(1.0), emu(7), emu(1.0),
        [("Periodic Enrichment", BODY_TEXT, True, 4000)], font="Garamond")
    s += make_line_xml(emu(0.8), emu(1.9), emu(3.5), emu(1.9), GOLD)
    s += make_textbox(emu(0.8), emu(2.2), emu(7), emu(0.5),
        "Fold new content into existing structure. Never start a separate pile.", font_size=1400, color=MUTED)
    # Timeline arrow concept — 3 stages
    stages = [
        ("Month 1-3", "Build base structure\nfrom syllabus + PYQs"),
        ("Month 4-8", "Fold current affairs\ninto existing themes"),
        ("Month 9-12", "Final enrichment +\nrevision-ready polish"),
    ]
    for i, (period, desc) in enumerate(stages):
        x = emu(0.8 + i * 2.5)
        s += make_rect_xml(x, emu(3.0), emu(2.2), emu(2.2), CARD_BG, border_color=CARD_BORDER, name=f"Stage{i}")
        s += make_textbox(x, emu(3.15), emu(2.2), emu(0.4),
            [(period, GOLD, True, 1400)], align="c")
        lines_list = desc.split("\n")
        s += make_multiline_textbox(int(x + emu(0.15)), emu(3.7), emu(1.9), emu(1.2),
            [(l, BODY_TEXT, False, 1200) for l in lines_list], align="c")
    # Arrows between stages
    s += make_textbox(emu(3.1), emu(3.9), emu(0.5), emu(0.4),
        [("-->", GOLD, True, 1600)], align="c")
    s += make_textbox(emu(5.6), emu(3.9), emu(0.5), emu(0.4),
        [("-->", GOLD, True, 1600)], align="c")
    # Key rule box
    s += make_rect_xml(emu(0.8), emu(5.5), emu(7.0), emu(0.7), CARD_BG, border_color=GOLD, name="Rule")
    s += make_textbox(emu(1.0), emu(5.6), emu(6.6), emu(0.5),
        [("Rule: ", GOLD, True, 1400), ("New information has an obvious home the moment you find it.", BODY_TEXT, False, 1400)])
    # Tip
    s += insider_tip_box(emu(0.8), emu(6.5), emu(7.0), emu(0.6),
        "Structure-first, content-second. The app doesn't save you if the folder logic is chaotic.")
    return slide_xml(s)



# ============================================================
# SLIDE 7: LAYER 5 — Reflection in Answer
# ============================================================
def build_slide_07_layer5():
    s = ""
    s += make_textbox(emu(0.8), emu(0.5), emu(7), emu(0.4),
        "L A Y E R  5", font_size=1200, bold=True, color=TEAL)
    s += make_textbox(emu(0.8), emu(1.0), emu(7), emu(1.0),
        [("Reflection in Answer", BODY_TEXT, True, 4000)], font="Garamond")
    s += make_line_xml(emu(0.8), emu(1.9), emu(3.5), emu(1.9), GOLD)
    s += make_textbox(emu(0.8), emu(2.2), emu(7), emu(0.5),
        "Your copy is a mirror of your notes — nothing more, nothing less.", font_size=1500, color=GOLD, font="Garamond")
    # Split-screen mockup: Note phrase -> Answer sentence
    s += make_rect_xml(emu(0.8), emu(3.0), emu(3.2), emu(2.5), CARD_BG, border_color=CARD_BORDER, name="NoteCol")
    s += make_multiline_textbox(emu(1.0), emu(3.1), emu(2.9), emu(2.3),
        [("YOUR NOTE", MUTED, True, 1100),
         ("", BODY_TEXT, False, 500),
         ("GHI: 107 (2023)", BODY_TEXT, False, 1200),
         ("India rank: 111/125", BODY_TEXT, False, 1200),
         ("Child wasting: 18.7%", BODY_TEXT, False, 1200),
         ("ICDS + PM Poshan link", BODY_TEXT, False, 1200),
         ("", BODY_TEXT, False, 400),
         ("Keyword: nutritional", GOLD, False, 1100),
         ("sovereignty", GOLD, False, 1100)])
    # Arrow
    s += make_textbox(emu(4.1), emu(4.0), emu(0.6), emu(0.5),
        [("-->", GOLD, True, 2000)], align="c")
    # Answer column
    s += make_rect_xml(emu(4.7), emu(3.0), emu(3.2), emu(2.5), CARD_BG, border_color=TEAL, name="AnsCol")
    s += make_multiline_textbox(emu(4.9), emu(3.1), emu(2.9), emu(2.3),
        [("YOUR ANSWER", TEAL, True, 1100),
         ("", BODY_TEXT, False, 500),
         ("India's GHI score of 107", BODY_TEXT, False, 1200),
         ("(rank 111/125) reveals a", BODY_TEXT, False, 1200),
         ("systemic crisis in nutritional", BODY_TEXT, False, 1200),
         ("sovereignty. With child", BODY_TEXT, False, 1200),
         ("wasting at 18.7%, convergence", BODY_TEXT, False, 1200),
         ("of ICDS and PM Poshan", BODY_TEXT, False, 1200),
         ("remains critical...", BODY_TEXT, False, 1200)])
    # Tip
    s += insider_tip_box(emu(0.8), emu(6.2), emu(7.0), emu(0.7),
        "Model answers are already in exam-language. Build from them to skip the translation lag.")
    return slide_xml(s)



# ============================================================
# SLIDE 8: THE ONE-PAGE RULE
# ============================================================
def build_slide_08_one_page():
    s = ""
    s += make_textbox(emu(0.8), emu(0.5), emu(7), emu(0.4),
        "S T A T I C  R U L E", font_size=1200, bold=True, color=MUTED)
    s += make_textbox(emu(0.8), emu(1.0), emu(7), emu(1.0),
        [("The One-Page Rule", BODY_TEXT, True, 4400)], font="Garamond")
    s += make_line_xml(emu(0.8), emu(1.9), emu(3.5), emu(1.9), GOLD)
    # Big "1" visual
    s += make_textbox(emu(2.5), emu(2.3), emu(3.0), emu(2.5),
        [("1", GOLD, True, 14400)], align="c", font="Garamond")
    # Rule text below
    s += make_rect_xml(emu(0.8), emu(4.8), emu(7.0), emu(1.2), CARD_BG, border_color=CARD_BORDER, name="RuleBox")
    s += make_multiline_textbox(emu(1.0), emu(4.9), emu(6.6), emu(1.0),
        [("If it doesn't fit on one page, it isn't a note yet.", GOLD, True, 1600),
         ("It's still raw material.", MUTED, False, 1400),
         ("", BODY_TEXT, False, 400),
         ("One page forces demand-deconstruction. You can't cheat your", BODY_TEXT, False, 1200),
         ("way to one page by writing smaller — only by removing overlap.", BODY_TEXT, False, 1200)])
    # Tip
    s += insider_tip_box(emu(0.8), emu(6.3), emu(7.0), emu(0.6),
        "The one-page constraint is a forcing function, not an arbitrary limit.")
    return slide_xml(s)



# ============================================================
# SLIDE 9: DIGITAL vs PHYSICAL — When to Use Which
# ============================================================
def build_slide_09_digital_vs_physical():
    s = ""
    s += make_textbox(emu(0.8), emu(0.5), emu(7), emu(0.4),
        "T O O L  S T R A T E G Y", font_size=1200, bold=True, color=MUTED)
    s += make_textbox(emu(0.8), emu(1.0), emu(7), emu(1.0),
        [("Digital vs Physical", BODY_TEXT, True, 4000)], font="Garamond")
    s += make_line_xml(emu(0.8), emu(1.9), emu(3.5), emu(1.9), GOLD)
    s += make_textbox(emu(0.8), emu(2.2), emu(7), emu(0.4),
        "Different content types need different tools.", font_size=1400, color=MUTED)
    # Two columns
    # LEFT — Handwritten
    s += make_rect_xml(emu(0.8), emu(2.9), emu(3.3), emu(3.0), CARD_BG, border_color=GOLD, name="Physical")
    s += make_multiline_textbox(emu(1.0), emu(3.0), emu(3.0), emu(2.8),
        [("HANDWRITTEN", GOLD, True, 1300),
         ("Static Subjects", MUTED, False, 1100),
         ("", BODY_TEXT, False, 500),
         ("1. History maps + timelines", BODY_TEXT, False, 1200),
         ("2. Polity fundamentals", BODY_TEXT, False, 1200),
         ("3. Geography one-pagers", BODY_TEXT, False, 1200),
         ("4. Ethics case templates", BODY_TEXT, False, 1200),
         ("", BODY_TEXT, False, 400),
         ("Why: Forces pre-processing", TEAL, False, 1100),
         ("that typing skips entirely.", TEAL, False, 1100)])
    # RIGHT — Digital
    s += make_rect_xml(emu(4.4), emu(2.9), emu(3.3), emu(3.0), CARD_BG, border_color=TEAL, name="Digital")
    s += make_multiline_textbox(emu(4.6), emu(3.0), emu(3.0), emu(2.8),
        [("DIGITAL", TEAL, True, 1300),
         ("Current Affairs", MUTED, False, 1100),
         ("", BODY_TEXT, False, 500),
         ("1. Screenshot key data", BODY_TEXT, False, 1200),
         ("2. Tag by GS paper + theme", BODY_TEXT, False, 1200),
         ("3. Update as events evolve", BODY_TEXT, False, 1200),
         ("4. Search instantly", BODY_TEXT, False, 1200),
         ("", BODY_TEXT, False, 400),
         ("Why: Fastest-decaying content", GOLD, False, 1100),
         ("needs fastest tool.", GOLD, False, 1100)])
    # Tip
    s += insider_tip_box(emu(0.8), emu(6.3), emu(7.0), emu(0.6),
        "Hand-copying current affairs = using your slowest tool on your fastest-decaying content.")
    return slide_xml(s)



# ============================================================
# SLIDE 10: AI's Two Jobs
# ============================================================
def build_slide_10_ai():
    s = ""
    s += make_textbox(emu(0.8), emu(0.5), emu(7), emu(0.4),
        "T H E  A I  E D G E", font_size=1200, bold=True, color=MUTED)
    s += make_textbox(emu(0.8), emu(1.0), emu(7), emu(1.0),
        [("AI's Two Jobs", BODY_TEXT, True, 4000)], font="Garamond")
    s += make_line_xml(emu(0.8), emu(1.9), emu(3.5), emu(1.9), GOLD)
    s += make_textbox(emu(0.8), emu(2.2), emu(7), emu(0.4),
        "Velocity on pattern-recognition. Not a replacement for judgment.", font_size=1400, color=MUTED)
    # Two job cards
    # Job 1
    s += make_rect_xml(emu(0.8), emu(3.0), emu(3.3), emu(2.5), CARD_BG, border_color=CARD_BORDER, name="AI1")
    s += make_textbox(emu(0.8), emu(3.1), emu(3.3), emu(0.5),
        [("1", GOLD, True, 3200)], align="c", font="Garamond")
    s += make_multiline_textbox(emu(1.0), emu(3.8), emu(3.0), emu(1.5),
        [("Cluster PYQs Into Themes", GOLD, True, 1400),
         ("", BODY_TEXT, False, 400),
         ("Feed it a decade of PYQs.", BODY_TEXT, False, 1200),
         ("It finds recurring patterns", BODY_TEXT, False, 1200),
         ("in minutes that would take", BODY_TEXT, False, 1200),
         ("a weekend of manual work.", BODY_TEXT, False, 1200)], align="c")
    # Job 2
    s += make_rect_xml(emu(4.4), emu(3.0), emu(3.3), emu(2.5), CARD_BG, border_color=CARD_BORDER, name="AI2")
    s += make_textbox(emu(4.4), emu(3.1), emu(3.3), emu(0.5),
        [("2", GOLD, True, 3200)], align="c", font="Garamond")
    s += make_multiline_textbox(emu(4.6), emu(3.8), emu(3.0), emu(1.5),
        [("Draft Practice Case Studies", GOLD, True, 1400),
         ("", BODY_TEXT, False, 400),
         ("Generate ethics dilemmas", BODY_TEXT, False, 1200),
         ("around a keyword. Select", BODY_TEXT, False, 1200),
         ("and refine the 5-6 that", BODY_TEXT, False, 1200),
         ("fit your answer templates.", BODY_TEXT, False, 1200)], align="c")
    # Warning
    s += make_rect_xml(emu(0.8), emu(5.8), emu(7.0), emu(0.5), CARD_BG, border_color=CARD_BORDER, name="Warn")
    s += make_textbox(emu(1.0), emu(5.85), emu(6.6), emu(0.4),
        [("AI removes the tedious first pass. Your judgment decides what stays.", BODY_TEXT, False, 1300)], align="c")
    # Tip
    s += insider_tip_box(emu(0.8), emu(6.5), emu(7.0), emu(0.55),
        "Human-in-the-loop always. AI accelerates — it does not replace thinking.")
    return slide_xml(s)



# ============================================================
# SLIDE 11: MAINS vs PRELIMS — Tactical Split
# ============================================================
def build_slide_11_mains_prelims():
    s = ""
    s += make_textbox(emu(0.8), emu(0.5), emu(7), emu(0.4),
        "T A C T I C A L  S P L I T", font_size=1200, bold=True, color=MUTED)
    s += make_textbox(emu(0.8), emu(1.0), emu(7), emu(1.0),
        [("Mains vs Prelims", BODY_TEXT, True, 4000)], font="Garamond")
    s += make_line_xml(emu(0.8), emu(1.9), emu(3.5), emu(1.9), GOLD)
    s += make_textbox(emu(0.8), emu(2.15), emu(7), emu(0.4),
        "Same notes. Two different deployment modes.", font_size=1400, color=MUTED)
    # Two columns
    # MAINS
    s += make_rect_xml(emu(0.8), emu(2.8), emu(3.3), emu(3.2), CARD_BG, border_color=GOLD, name="Mains")
    s += make_multiline_textbox(emu(1.0), emu(2.9), emu(3.0), emu(3.0),
        [("MAINS", GOLD, True, 1500),
         ("Argument Synthesis", MUTED, False, 1100),
         ("", BODY_TEXT, False, 500),
         ("1. 250-word ceiling constraint", BODY_TEXT, False, 1200),
         ("2. Sub-150 words per dimension", BODY_TEXT, False, 1200),
         ("3. Intro-Body-Conclusion pre-built", BODY_TEXT, False, 1200),
         ("4. Skeleton reusable across topics", BODY_TEXT, False, 1200),
         ("", BODY_TEXT, False, 400),
         ("Goal: Reproduce structured", TEAL, False, 1100),
         ("argument from one-page note", TEAL, False, 1100),
         ("in under 7 minutes.", TEAL, False, 1100)])
    # PRELIMS
    s += make_rect_xml(emu(4.4), emu(2.8), emu(3.3), emu(3.2), CARD_BG, border_color=TEAL, name="Prelims")
    s += make_multiline_textbox(emu(4.6), emu(2.9), emu(3.0), emu(3.0),
        [("PRELIMS", TEAL, True, 1500),
         ("Fact Recall + Clarity", MUTED, False, 1100),
         ("", BODY_TEXT, False, 500),
         ("1. Pure fact-retention", BODY_TEXT, False, 1200),
         ("2. Conceptual clarity", BODY_TEXT, False, 1200),
         ("3. Recognition speed", BODY_TEXT, False, 1200),
         ("4. Same map, dual payoff", BODY_TEXT, False, 1200),
         ("", BODY_TEXT, False, 400),
         ("Goal: Recognise correct option", GOLD, False, 1100),
         ("in under 60 seconds using", GOLD, False, 1100),
         ("the same integrated map.", GOLD, False, 1100)])
    # Tip
    s += insider_tip_box(emu(0.8), emu(6.3), emu(7.0), emu(0.6),
        "Integrated notes = one build, two payoffs. Don't maintain separate systems.")
    return slide_xml(s)



# ============================================================
# SLIDE 12: UKPSC-UPSC OVERLAP
# ============================================================
def build_slide_12_ukpsc_overlap():
    s = ""
    s += make_textbox(emu(0.8), emu(0.5), emu(7), emu(0.4),
        "U K P S C  S T R A T E G Y", font_size=1200, bold=True, color=MUTED)
    s += make_textbox(emu(0.8), emu(1.0), emu(7), emu(1.0),
        [("The UKPSC-UPSC Overlap", BODY_TEXT, True, 3800)], font="Garamond")
    s += make_line_xml(emu(0.8), emu(1.85), emu(3.5), emu(1.85), GOLD)
    s += make_textbox(emu(0.8), emu(2.15), emu(7), emu(0.4),
        "Your efficiency multiplier if preparing for both exams.", font_size=1400, color=MUTED)
    # Center: Shared core
    s += make_rect_xml(emu(2.0), emu(2.8), emu(4.0), emu(1.8), CARD_BG, border_color=GOLD, name="Core")
    s += make_multiline_textbox(emu(2.2), emu(2.9), emu(3.6), emu(1.6),
        [("SHARED STATIC CORE", GOLD, True, 1400),
         ("", BODY_TEXT, False, 400),
         ("History | Geography | Polity", BODY_TEXT, False, 1300),
         ("", BODY_TEXT, False, 300),
         ("Build ONE integrated map.", BODY_TEXT, False, 1200),
         ("Barely diverges between exams.", BODY_TEXT, False, 1200)], align="c")
    # Left branch: UKPSC-specific
    s += make_rect_xml(emu(0.8), emu(5.0), emu(3.3), emu(1.5), CARD_BG, border_color=TEAL, name="UKLayer")
    s += make_multiline_textbox(emu(1.0), emu(5.1), emu(3.0), emu(1.3),
        [("+ UKPSC LAYER", TEAL, True, 1200),
         ("", BODY_TEXT, False, 300),
         ("State-specific current affairs", BODY_TEXT, False, 1150),
         ("Uttarakhand schemes", BODY_TEXT, False, 1150),
         ("State geography + movements", BODY_TEXT, False, 1150)], align="c")
    # Right branch: UPSC-specific
    s += make_rect_xml(emu(4.4), emu(5.0), emu(3.3), emu(1.5), CARD_BG, border_color=GOLD, name="UPSCLayer")
    s += make_multiline_textbox(emu(4.6), emu(5.1), emu(3.0), emu(1.3),
        [("+ UPSC LAYER", GOLD, True, 1200),
         ("", BODY_TEXT, False, 300),
         ("National current affairs", BODY_TEXT, False, 1150),
         ("International relations", BODY_TEXT, False, 1150),
         ("Advanced governance topics", BODY_TEXT, False, 1150)], align="c")
    # Tip
    s += insider_tip_box(emu(0.8), emu(6.7), emu(7.0), emu(0.55),
        "Don't build two separate systems. Layer state-specific on top of a shared foundation.")
    return slide_xml(s)



# ============================================================
# SLIDE 13: THE 4 TOPPER SECRETS (Recap)
# ============================================================
def build_slide_13_secrets():
    s = ""
    s += make_textbox(emu(0.8), emu(0.5), emu(7), emu(0.4),
        "T O P P E R  S E C R E T S", font_size=1200, bold=True, color=MUTED)
    s += make_textbox(emu(0.8), emu(1.0), emu(7), emu(1.0),
        [("The 4 Non-Obvious Truths", BODY_TEXT, True, 3800)], font="Garamond")
    s += make_line_xml(emu(0.8), emu(1.85), emu(3.5), emu(1.85), GOLD)
    # 4 numbered secrets
    secrets = [
        ("1", "Demand Deconstruction", "Build notes by demand, not by chapter. 22 PYQ variations collapse into 8 real dimensions."),
        ("2", "Model Answers Over Books", "Build from exam-language sources. Skip the book-to-answer translation lag."),
        ("3", "Skip What You Know", "Notes = record of what you'd forget + phrases that differentiate you from others."),
        ("4", "Cross-Paper Transfer", "Every fact should earn marks in multiple papers. Ask: where else could this live?"),
    ]
    for i, (num, title, desc) in enumerate(secrets):
        y = emu(2.2 + i * 1.1)
        # Number circle
        s += make_rect_xml(emu(0.8), y, emu(0.5), emu(0.5), GOLD, name=f"Num{i}")
        s += make_textbox(emu(0.8), y, emu(0.5), emu(0.5),
            [(num, CARBON, True, 1600)], align="c")
        # Title + desc
        s += make_textbox(emu(1.5), y, emu(6.3), emu(0.4),
            [(title, BODY_TEXT, True, 1500)])
        s += make_textbox(emu(1.5), int(y + emu(0.4)), emu(6.3), emu(0.5),
            [(desc, MUTED, False, 1150)])
    # Tip
    s += insider_tip_box(emu(0.8), emu(6.5), emu(7.0), emu(0.6),
        "These secrets compound. Each layer makes the next one exponentially more effective.")
    return slide_xml(s)



# ============================================================
# SLIDE 14: CLOSING — Sign-Off
# ============================================================
def build_slide_14_closing():
    s = ""
    # Centered, minimal — large quote
    s += make_textbox(emu(0.8), emu(1.5), emu(7), emu(0.4),
        "T H E  S I N G L E  T A K E A W A Y", font_size=1200, bold=True, color=MUTED, align="c")
    s += make_textbox(emu(0.8), emu(2.5), emu(7), emu(2.0),
        [("Build the demand map", BODY_TEXT, True, 3600)], font="Garamond", align="c")
    s += make_textbox(emu(0.8), emu(3.3), emu(7), emu(1.5),
        [("before you build the note.", BODY_TEXT, True, 3600)], font="Garamond", align="c")
    # Gold separator
    s += make_line_xml(emu(3.0), emu(4.5), emu(5.0), emu(4.5), GOLD)
    # Sub-text
    s += make_textbox(emu(0.8), emu(4.8), emu(7), emu(0.8),
        [("That's the whole secret.", MUTED, False, 1600)], align="c")
    # Brand
    s += make_textbox(emu(0.8), emu(6.2), emu(7), emu(0.5),
        [("UKPSC DECODED", GOLD, True, 1400)], align="c")
    s += make_textbox(emu(0.8), emu(6.6), emu(7), emu(0.4),
        [("Prepare Smarter. Not Longer.", MUTED, False, 1200)], align="c")
    return slide_xml(s)



# ============================================================
# PPTX ASSEMBLY
# ============================================================

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

def slide_rels_xml():
    return '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>
</Relationships>'''

def slide_master_xml():
    return '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
  xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld><p:bg><p:bgPr><a:solidFill><a:srgbClr val="171717"/></a:solidFill><a:effectLst/></p:bgPr></p:bg><p:spTree>
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
    out_path = "/projects/sandbox/Ukpscdecoded/UKPSC_Video2_NoteMaking_Slides.pptx"

    slides = [
        build_slide_01_title(),
        build_slide_02_diagnosis(),
        build_slide_03_layer1(),
        build_slide_04_layer2(),
        build_slide_05_layer3(),
        build_slide_06_layer4(),
        build_slide_07_layer5(),
        build_slide_08_one_page(),
        build_slide_09_digital_vs_physical(),
        build_slide_10_ai(),
        build_slide_11_mains_prelims(),
        build_slide_12_ukpsc_overlap(),
        build_slide_13_secrets(),
        build_slide_14_closing(),
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
    print(f"Total slides: {num}")
    print("Ready for Keynote import!")


if __name__ == "__main__":
    main()
