#!/usr/bin/env python3
"""
Generate UKPSC RO/ARO Prelims 2026 Paper Analysis PPTX.
Uses only Python standard library (zipfile + xml). No external dependencies.

USAGE:
  Before exam (placeholder slides): python3 generate_roaro_pptx.py
  After exam (fill data): Edit the EXAM_DATA dict below, then re-run.

Output: UKPSC_ROARO_2026_Analysis_Slides.pptx
"""
import zipfile
import os

# ============================================================
# EXAM DATA — FILL THIS AFTER THE EXAM AT 12:00 PM
# ============================================================
EXAM_DATA = {
    "date": "19 July 2026",
    "overall_difficulty": "Moderate",  # Easy / Moderate / Tough / Surprisingly Tough
    "gs_difficulty": "Moderate",
    "aptitude_difficulty": "Moderate",
    # GS Subject-wise breakdown (out of 100 questions)
    "gs_history": "15-18",
    "gs_polity": "12-15",
    "gs_geography": "10-12",
    "gs_economy": "8-10",
    "gs_science": "8-10",
    "gs_current_affairs": "15-18",
    "gs_uttarakhand_gk": "20-25",
    # Aptitude breakdown (out of 50 questions)
    "aptitude_math": "20-25",
    "aptitude_reasoning": "25-30",

    # Toughest and easiest sections
    "toughest_section": "Statement-based History / Lengthy Math",
    "easiest_section": "Uttarakhand GK / Basic Reasoning",
    # Student feedback summary
    "student_feedback": "GS was lengthy, Current Affairs direct, Math time-consuming",
    # Good attempts
    "good_attempts_gs": "65-72",
    "good_attempts_aptitude": "32-38",
    "good_attempts_total": "97-110",
    # Expected cut-off (fill after analysis)
    "cutoff_general": "95-100",
    "cutoff_obc": "93-98",
    "cutoff_ews": "90-95",
    "cutoff_sc": "82-87",
    "cutoff_st": "84-89",
    "cutoff_women": "82-86",
    # Safe score
    "safe_score": "105+",
}

# ============================================================
# CONSTANTS
# ============================================================
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
RED = "DC3545"
ORANGE = "F59E0B"



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


def make_textbox(x, y, w, h, texts, font_size=1400, bold=False, color=WHITE, align="l", font="Calibri"):
    """texts can be string or list of (text, color, bold, size) tuples"""
    if isinstance(texts, str):
        texts = [(texts, color, bold, font_size)]

    runs = ""
    for t in texts:
        txt, col, bld, sz = (t if len(t) == 4
                             else (t[0], t[1] if len(t) > 1 else color,
                                   t[2] if len(t) > 2 else bold,
                                   t[3] if len(t) > 3 else font_size))
        b_attr = ' b="1"' if bld else ''
        runs += (f'<a:r><a:rPr lang="en-US" sz="{sz}"{b_attr} dirty="0">'
                 f'<a:solidFill><a:srgbClr val="{col}"/></a:solidFill>'
                 f'<a:latin typeface="{font}"/></a:rPr><a:t>{txt}</a:t></a:r>')

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
        paras += (f'<a:p><a:pPr algn="{algn}"/><a:r><a:rPr lang="en-US" sz="{sz}"{b_attr} dirty="0">'
                  f'<a:solidFill><a:srgbClr val="{col}"/></a:solidFill>'
                  f'<a:latin typeface="{font}"/></a:rPr><a:t>{txt}</a:t></a:r></a:p>')

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



# ============================================================
# SLIDE BUILDERS
# ============================================================

def build_slide_1_title():
    """Slide 1: Title Slide — Navy background"""
    d = EXAM_DATA
    shapes = ""
    # Pre-title badge
    shapes += make_textbox(emu(0.8), emu(1.0), emu(11.7), emu(0.5),
        "UKPSC RO/ARO PRELIMS 2026", font_size=1500, bold=True, color=AMBER, align="l")
    # Main title
    shapes += make_textbox(emu(0.8), emu(1.7), emu(11.7), emu(1.5),
        [("Complete Paper Analysis", WHITE, True, 3800)], align="l")
    shapes += make_textbox(emu(0.8), emu(2.7), emu(11.7), emu(1.0),
        [("& Expected Cut-Off Prediction", WHITE, True, 3200)], align="l")
    # Subtitle
    shapes += make_textbox(emu(0.8), emu(3.8), emu(11), emu(0.5),
        f"Exam Date: {d['date']} | Section-wise Difficulty | Good Attempts | Safe Score",
        font_size=1500, color=GREY, align="l")
    # Three stat boxes at bottom
    shapes += make_rect_xml(emu(0.8), emu(5.0), emu(3.5), emu(1.2), STEEL, "Box1")
    shapes += make_multiline_textbox(emu(0.9), emu(5.1), emu(3.3), emu(1.0),
        [("150", AMBER, True, 3400), ("Total Marks", GREY, False, 1200)], align="c")

    shapes += make_rect_xml(emu(4.6), emu(5.0), emu(3.5), emu(1.2), STEEL, "Box2")
    shapes += make_multiline_textbox(emu(4.7), emu(5.1), emu(3.3), emu(1.0),
        [("2 Hours", AMBER, True, 3000), ("Duration", GREY, False, 1200)], align="c")

    shapes += make_rect_xml(emu(8.4), emu(5.0), emu(3.5), emu(1.2), STEEL, "Box3")
    shapes += make_multiline_textbox(emu(8.5), emu(5.1), emu(3.3), emu(1.0),
        [("0.25", AMBER, True, 3000), ("Negative Marking", GREY, False, 1200)], align="c")

    return slide_xml(NAVY, shapes, 1)



def build_slide_2_exam_blueprint():
    """Slide 2: Exam Blueprint Recap — Ivory background"""
    shapes = ""
    shapes += make_textbox(emu(0.7), emu(0.4), emu(11.9), emu(0.7),
        [("Exam Blueprint", NAVY, True, 3000)])
    shapes += make_textbox(emu(0.7), emu(1.0), emu(11.9), emu(0.4),
        "UKPSC RO/ARO Prelims 2026 — Paper Structure",
        font_size=1400, color=MUTED)

    # Section 1 card
    shapes += make_rect_xml(emu(0.7), emu(1.7), emu(5.5), emu(3.0), WHITE, "GS_Card")
    shapes += make_multiline_textbox(emu(1.0), emu(1.9), emu(5.0), emu(2.6),
        [("SECTION 1", AMBER, True, 1200),
         ("General Studies", NAVY, True, 2400),
         ("", NAVY, False, 800),
         ("Questions: 100", CHARCOAL, False, 1500),
         ("Marks: 100", CHARCOAL, False, 1500),
         ("Topics: History, Polity, Geography,", MUTED, False, 1300),
         ("Economy, Science, Current Affairs, UK GK", MUTED, False, 1300)], align="c")

    # Section 2 card
    shapes += make_rect_xml(emu(6.5), emu(1.7), emu(5.5), emu(3.0), WHITE, "Apt_Card")
    shapes += make_multiline_textbox(emu(6.8), emu(1.9), emu(5.0), emu(2.6),
        [("SECTION 2", AMBER, True, 1200),
         ("General Aptitude & Intelligence", NAVY, True, 2200),
         ("", NAVY, False, 800),
         ("Questions: 50", CHARCOAL, False, 1500),
         ("Marks: 50", CHARCOAL, False, 1500),
         ("Topics: Maths, Reasoning,", MUTED, False, 1300),
         ("Mental Ability, Data Interpretation", MUTED, False, 1300)], align="c")

    # Bottom bar with key info
    shapes += make_rect_xml(emu(0.7), emu(5.1), emu(11.7), emu(1.5), NAVY, "InfoBar")
    shapes += make_multiline_textbox(emu(1.0), emu(5.3), emu(11.2), emu(1.1),
        [("Total: 150 Questions | 150 Marks | 2 Hours | Negative Marking: 1/4 (0.25 per wrong answer)", WHITE, True, 1500),
         ("4 wrong answers = 1 mark deducted. Accuracy matters more than attempts!", GREY, False, 1300)], align="c")

    return slide_xml(IVORY, shapes, 2)



def build_slide_3_gs_breakdown():
    """Slide 3: General Studies Breakup & Difficulty"""
    d = EXAM_DATA
    shapes = ""
    shapes += make_textbox(emu(0.7), emu(0.3), emu(11.9), emu(0.6),
        [("General Studies — Section Breakdown", NAVY, True, 2700)])
    shapes += make_textbox(emu(0.7), emu(0.85), emu(11.9), emu(0.4),
        f"Overall GS Difficulty: {d['gs_difficulty']}",
        font_size=1400, color=MUTED)

    # Subject-wise cards (2 rows x 4 cols)
    subjects = [
        ("History", d["gs_history"], "Qs"),
        ("Polity", d["gs_polity"], "Qs"),
        ("Geography", d["gs_geography"], "Qs"),
        ("Economy", d["gs_economy"], "Qs"),
        ("Science", d["gs_science"], "Qs"),
        ("Current Affairs", d["gs_current_affairs"], "Qs"),
        ("Uttarakhand GK", d["gs_uttarakhand_gk"], "Qs"),
    ]
    for i, (subj, count, label) in enumerate(subjects):
        col = i % 4
        row = i // 4
        x = emu(0.7 + col * 3.1)
        y = emu(1.5 + row * 2.3)
        shapes += make_rect_xml(x, y, emu(2.8), emu(2.0), WHITE, f"GS_{subj}")
        shapes += make_multiline_textbox(int(x + emu(0.1)), int(y + emu(0.2)), emu(2.6), emu(1.6),
            [(subj, NAVY, True, 1300),
             (str(count), AMBER, True, 2800),
             (label, MUTED, False, 1100)], align="c")

    # Bottom insight bar
    shapes += make_rect_xml(emu(0.7), emu(5.5), emu(11.7), emu(1.2), NAVY, "GSInsight")
    shapes += make_multiline_textbox(emu(1.0), emu(5.6), emu(11.2), emu(1.0),
        [(f"Toughest: {d['toughest_section']}", RED, True, 1500),
         (f"Easiest: {d['easiest_section']}", GREEN, True, 1500)], align="c")

    return slide_xml(IVORY, shapes, 3)



def build_slide_4_aptitude():
    """Slide 4: General Aptitude & Mental Ability Review"""
    d = EXAM_DATA
    shapes = ""
    shapes += make_textbox(emu(0.7), emu(0.3), emu(11.9), emu(0.6),
        [("General Aptitude & Reasoning — 50 Questions", NAVY, True, 2700)])
    shapes += make_textbox(emu(0.7), emu(0.85), emu(11.9), emu(0.4),
        f"Overall Aptitude Difficulty: {d['aptitude_difficulty']}",
        font_size=1400, color=MUTED)

    # Two large cards: Math vs Reasoning
    shapes += make_rect_xml(emu(0.7), emu(1.5), emu(5.7), emu(3.2), WHITE, "MathCard")
    shapes += make_multiline_textbox(emu(1.0), emu(1.7), emu(5.2), emu(2.8),
        [("MATHEMATICS", AMBER, True, 1400),
         ("", NAVY, False, 600),
         (f"{d['aptitude_math']} Questions", NAVY, True, 2600),
         ("", NAVY, False, 600),
         ("Topics: Simplification, Percentage,", MUTED, False, 1300),
         ("Profit-Loss, Time-Work-Speed,", MUTED, False, 1300),
         ("Number Series, Data Interpretation", MUTED, False, 1300)], align="c")

    shapes += make_rect_xml(emu(6.7), emu(1.5), emu(5.7), emu(3.2), WHITE, "ReasonCard")
    shapes += make_multiline_textbox(emu(7.0), emu(1.7), emu(5.2), emu(2.8),
        [("REASONING", AMBER, True, 1400),
         ("", NAVY, False, 600),
         (f"{d['aptitude_reasoning']} Questions", NAVY, True, 2600),
         ("", NAVY, False, 600),
         ("Topics: Coding-Decoding, Analogy,", MUTED, False, 1300),
         ("Syllogism, Blood Relations,", MUTED, False, 1300),
         ("Direction Test, Series", MUTED, False, 1300)], align="c")

    # Feedback bar
    shapes += make_rect_xml(emu(0.7), emu(5.1), emu(11.7), emu(1.5), NAVY, "AptBar")
    shapes += make_multiline_textbox(emu(1.0), emu(5.3), emu(11.2), emu(1.1),
        [(f"Student Feedback: {d['student_feedback']}", WHITE, False, 1500),
         ("Math = Time-consuming | Reasoning = Relatively easier for most", GREY, False, 1300)], align="c")

    return slide_xml(IVORY, shapes, 4)



def build_slide_5_good_attempts():
    """Slide 5: Overall Good Attempts — Dark dramatic slide"""
    d = EXAM_DATA
    shapes = ""
    shapes += make_textbox(emu(0.7), emu(0.4), emu(11.9), emu(0.7),
        [("Good Attempts & Safe Score", WHITE, True, 3000)])
    shapes += make_textbox(emu(0.7), emu(1.0), emu(11.9), emu(0.4),
        "Based on student feedback and difficulty analysis",
        font_size=1300, color=GREY)

    # Three columns: GS | Aptitude | Total
    shapes += make_rect_xml(emu(0.8), emu(1.7), emu(3.6), emu(2.5), STEEL, "GA_GS")
    shapes += make_multiline_textbox(emu(0.9), emu(1.9), emu(3.4), emu(2.1),
        [("General Studies", GREY, False, 1200),
         ("Good Attempts", WHITE, True, 1500),
         ("", WHITE, False, 600),
         (d["good_attempts_gs"], AMBER, True, 3600),
         ("out of 100", GREY, False, 1100)], align="c")

    shapes += make_rect_xml(emu(4.7), emu(1.7), emu(3.6), emu(2.5), STEEL, "GA_Apt")
    shapes += make_multiline_textbox(emu(4.8), emu(1.9), emu(3.4), emu(2.1),
        [("Aptitude", GREY, False, 1200),
         ("Good Attempts", WHITE, True, 1500),
         ("", WHITE, False, 600),
         (d["good_attempts_aptitude"], AMBER, True, 3600),
         ("out of 50", GREY, False, 1100)], align="c")

    shapes += make_rect_xml(emu(8.6), emu(1.7), emu(3.6), emu(2.5), AMBER, "GA_Total")
    shapes += make_multiline_textbox(emu(8.7), emu(1.9), emu(3.4), emu(2.1),
        [("TOTAL", NAVY, False, 1200),
         ("Good Attempts", NAVY, True, 1500),
         ("", NAVY, False, 600),
         (d["good_attempts_total"], NAVY, True, 3600),
         ("out of 150", NAVY, False, 1100)], align="c")

    # Safe score banner
    shapes += make_rect_xml(emu(2.5), emu(4.6), emu(8.3), emu(1.2), GREEN, "SafeBar")
    shapes += make_multiline_textbox(emu(2.7), emu(4.7), emu(7.9), emu(1.0),
        [(f"SAFE SCORE: {d['safe_score']} Marks", WHITE, True, 2200),
         ("Agar itne marks aa rahe hain — Mains prep shuru karo!", WHITE, False, 1400)], align="c")

    # Note at bottom
    shapes += make_textbox(emu(0.8), emu(6.2), emu(11.7), emu(0.5),
        "* Based on student reactions & historical trends. Official key may shift these by 2-3 marks.",
        font_size=1100, color=GREY, align="c")

    return slide_xml(NAVY, shapes, 5)



def build_slide_6_cutoff_comparison():
    """Slide 6: Historical Cut-Off vs Expected Cut-Off"""
    d = EXAM_DATA
    shapes = ""
    shapes += make_textbox(emu(0.7), emu(0.3), emu(11.9), emu(0.6),
        [("Cut-Off Comparison: Previous vs Expected 2026", NAVY, True, 2500)])
    shapes += make_textbox(emu(0.7), emu(0.85), emu(11.9), emu(0.4),
        "Official Previous Year Data vs Today's Prediction",
        font_size=1300, color=MUTED)

    # Table header
    shapes += make_rect_xml(emu(0.7), emu(1.4), emu(11.7), emu(0.6), NAVY, "TblHeader")
    shapes += make_textbox(emu(0.9), emu(1.45), emu(3.0), emu(0.5),
        [("Category", WHITE, True, 1300)], align="l")
    shapes += make_textbox(emu(4.0), emu(1.45), emu(3.0), emu(0.5),
        [("Previous (RO Sectt.)", WHITE, True, 1200)], align="c")
    shapes += make_textbox(emu(7.0), emu(1.45), emu(2.5), emu(0.5),
        [("Previous (RO UKPSC)", WHITE, True, 1200)], align="c")
    shapes += make_textbox(emu(9.7), emu(1.45), emu(2.5), emu(0.5),
        [("Expected 2026", AMBER, True, 1300)], align="c")

    # Table rows
    rows = [
        ("General (UR)", "98.00", "97.00", d["cutoff_general"]),
        ("OBC", "97.75", "96.25", d["cutoff_obc"]),
        ("EWS", "~94.50", "~94.50", d["cutoff_ews"]),
        ("SC", "87.00", "85.75", d["cutoff_sc"]),
        ("ST", "88.50", "—", d["cutoff_st"]),
        ("UK Women", "~85-88", "~85-88", d["cutoff_women"]),
    ]
    for i, (cat, prev1, prev2, exp) in enumerate(rows):
        y = emu(2.1 + i * 0.6)
        bg = WHITE if i % 2 == 0 else IVORY
        shapes += make_rect_xml(emu(0.7), y, emu(11.7), emu(0.55), bg, f"Row{i}")
        shapes += make_textbox(emu(0.9), int(y + emu(0.05)), emu(3.0), emu(0.45),
            [(cat, CHARCOAL, True, 1300)], align="l")
        shapes += make_textbox(emu(4.0), int(y + emu(0.05)), emu(3.0), emu(0.45),
            [(prev1, CHARCOAL, False, 1300)], align="c")
        shapes += make_textbox(emu(7.0), int(y + emu(0.05)), emu(2.5), emu(0.45),
            [(prev2, CHARCOAL, False, 1300)], align="c")
        shapes += make_textbox(emu(9.7), int(y + emu(0.05)), emu(2.5), emu(0.45),
            [(exp, AMBER, True, 1400)], align="c")

    # Bottom note
    shapes += make_rect_xml(emu(0.7), emu(5.8), emu(11.7), emu(1.0), NAVY, "NoteBar")
    shapes += make_multiline_textbox(emu(1.0), emu(5.9), emu(11.2), emu(0.8),
        [(f"Today's Paper: {d['overall_difficulty']} | Historical General Cut-off: ~60-65% range", WHITE, True, 1400),
         ("Cut-off shifts based on paper difficulty, competition, and vacancies", GREY, False, 1200)], align="c")

    return slide_xml(IVORY, shapes, 6)



def build_slide_7_next_steps():
    """Slide 7: What's Next — Mains Strategy"""
    shapes = ""
    shapes += make_textbox(emu(0.7), emu(0.4), emu(11.9), emu(0.7),
        [("What's Next? — Mains Strategy Starts TODAY", WHITE, True, 2800)])

    # Action items
    actions = [
        ("1", "Don't Wait for Result", "Start Mains prep immediately. Smart candidates don't waste 2-3 months waiting."),
        ("2", "Focus: GS Mains + Hindi + Essay", "RO/ARO Mains = Descriptive. Writing practice > Reading. Start daily answer writing."),
        ("3", "Join Telegram for Answer Key", "Official Answer Key challenge + detailed solutions coming soon on our channel."),
        ("4", "Subscribe for Mains Strategy", "Complete Mains roadmap series launching this week. Don't miss it."),
    ]
    for i, (num, title, detail) in enumerate(actions):
        y_base = emu(1.4 + i * 1.3)
        shapes += make_rect_xml(emu(0.8), y_base, emu(0.6), emu(0.6), AMBER, f"Num{i}")
        shapes += make_textbox(emu(0.8), y_base, emu(0.6), emu(0.6),
            [(num, NAVY, True, 2200)], align="c")
        shapes += make_textbox(emu(1.6), int(y_base - emu(0.02)), emu(10.8), emu(0.45),
            [(title, WHITE, True, 1700)])
        shapes += make_textbox(emu(1.6), int(y_base + emu(0.45)), emu(10.8), emu(0.45),
            [(detail, GREY, False, 1300)])

    # CTA bar
    shapes += make_rect_xml(emu(2.0), emu(6.0), emu(9.3), emu(1.0), AMBER, "CTABar")
    shapes += make_multiline_textbox(emu(2.2), emu(6.1), emu(8.9), emu(0.8),
        [("SUBSCRIBE + Bell | Telegram: Link in Description", NAVY, True, 1600),
         ("Answer Key Challenge + Mains Roadmap Coming Soon!", NAVY, False, 1300)], align="c")

    return slide_xml(NAVY, shapes, 7)



# ============================================================
# PPTX ASSEMBLY (same structure as Video 1)
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
    out_path = "/projects/sandbox/Ukpscdecoded/UKPSC_ROARO_2026_Analysis_Slides.pptx"

    slides = [
        build_slide_1_title(),
        build_slide_2_exam_blueprint(),
        build_slide_3_gs_breakdown(),
        build_slide_4_aptitude(),
        build_slide_5_good_attempts(),
        build_slide_6_cutoff_comparison(),
        build_slide_7_next_steps(),
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

    print(f"{'='*60}")
    print(f"  UKPSC RO/ARO 2026 Analysis Slides Generated!")
    print(f"{'='*60}")
    print(f"  Output: {out_path}")
    print(f"  Slides: {num}")
    print(f"  Paper Difficulty: {EXAM_DATA['overall_difficulty']}")
    print(f"  Expected General Cut-off: {EXAM_DATA['cutoff_general']}")
    print(f"  Safe Score: {EXAM_DATA['safe_score']}")
    print(f"{'='*60}")
    print(f"\n  HOW TO USE:")
    print(f"  1. Before exam: Run as-is for placeholder slides")
    print(f"  2. After exam: Edit EXAM_DATA dict at top of file")
    print(f"  3. Re-run: python3 generate_roaro_pptx.py")
    print(f"  4. Open the .pptx in Keynote/PowerPoint")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
