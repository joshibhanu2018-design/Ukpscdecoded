"""
Generate UKPSC Decoded - YouTube CTA End Card (1920x1080 Landscape)
Brand Colors: Navy #16233A, Amber #E0A458, Ivory #F7F5F1
"""

from PIL import Image, ImageDraw, ImageFont
import math
import os

# Canvas dimensions (YouTube standard landscape)
WIDTH = 1920
HEIGHT = 1080

# Brand Colors
NAVY = (22, 35, 58)
NAVY_DARK = (13, 21, 32)
AMBER = (224, 164, 88)
AMBER_LIGHT = (240, 190, 120)
IVORY = (247, 245, 241)
WHITE = (255, 255, 255)
DARK_OVERLAY = (10, 16, 26)

def create_gradient(draw, width, height, color_start, color_end):
    """Create vertical gradient background."""
    for y in range(height):
        ratio = y / height
        r = int(color_start[0] + (color_end[0] - color_start[0]) * ratio)
        g = int(color_start[1] + (color_end[1] - color_start[1]) * ratio)
        b = int(color_start[2] + (color_end[2] - color_start[2]) * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))

def draw_rounded_rect(draw, bbox, radius, fill=None, outline=None, width=1):
    """Draw a rounded rectangle."""
    x1, y1, x2, y2 = bbox
    if fill:
        # Draw filled rounded rectangle
        draw.rounded_rectangle(bbox, radius=radius, fill=fill, outline=outline, width=width)
    elif outline:
        draw.rounded_rectangle(bbox, radius=radius, fill=None, outline=outline, width=width)

def draw_circle(draw, center, radius, fill=None, outline=None, width=1):
    """Draw a circle."""
    x, y = center
    bbox = [x - radius, y - radius, x + radius, y + radius]
    draw.ellipse(bbox, fill=fill, outline=outline, width=width)

def draw_star(draw, center, size, color):
    """Draw a 4-pointed star/compass."""
    cx, cy = center
    # Vertical line
    draw.line([(cx, cy - size), (cx, cy + size)], fill=color, width=2)
    # Horizontal line
    draw.line([(cx - size, cy), (cx + size, cy)], fill=color, width=2)
    # Diagonal lines (smaller)
    s = int(size * 0.6)
    draw.line([(cx - s, cy - s), (cx + s, cy + s)], fill=color, width=1)
    draw.line([(cx + s, cy - s), (cx - s, cy + s)], fill=color, width=1)

def draw_mountain_silhouette(draw, width, height):
    """Draw subtle mountain shapes at the bottom."""
    # Mountain range 1 (background, subtle)
    points1 = [
        (0, height),
        (0, height - 80),
        (200, height - 140),
        (400, height - 90),
        (600, height - 160),
        (800, height - 100),
        (1000, height - 180),
        (1200, height - 120),
        (1400, height - 150),
        (1600, height - 95),
        (1800, height - 130),
        (width, height - 70),
        (width, height),
    ]
    draw.polygon(points1, fill=(18, 28, 45))

    # Mountain range 2 (foreground, darker)
    points2 = [
        (0, height),
        (0, height - 40),
        (300, height - 80),
        (500, height - 50),
        (700, height - 100),
        (900, height - 60),
        (1100, height - 90),
        (1300, height - 55),
        (1500, height - 75),
        (1700, height - 45),
        (width, height - 60),
        (width, height),
    ]
    draw.polygon(points2, fill=(14, 22, 36))

def get_font(size, bold=False):
    """Get a font - fallback to default if system fonts not available."""
    font_paths = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/dejavu-sans-fonts/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/dejavu-sans-fonts/DejaVuSans.ttf",
        "/usr/share/fonts/google-noto/NotoSans-Bold.ttf",
        "/usr/share/fonts/google-noto/NotoSans-Regular.ttf",
    ]
    
    if bold:
        bold_paths = [p for p in font_paths if "Bold" in p]
        for path in bold_paths:
            if os.path.exists(path):
                return ImageFont.truetype(path, size)
    
    for path in font_paths:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    
    # Fallback
    try:
        return ImageFont.truetype("/usr/share/fonts/dejavu-sans-fonts/DejaVuSans.ttf", size)
    except:
        return ImageFont.load_default()

def create_cta_card():
    # Create image
    img = Image.new('RGB', (WIDTH, HEIGHT), NAVY)
    draw = ImageDraw.Draw(img)
    
    # 1. Background gradient
    create_gradient(draw, WIDTH, HEIGHT, NAVY, NAVY_DARK)
    
    # 2. Subtle mountain silhouettes at bottom
    draw_mountain_silhouette(draw, WIDTH, HEIGHT)
    
    # 3. Decorative elements - subtle amber accent lines
    # Top thin amber line
    draw.line([(WIDTH//2 - 300, 60), (WIDTH//2 + 300, 60)], fill=(*AMBER, ), width=1)
    # Small star at top center
    draw_star(draw, (WIDTH//2, 60), 12, AMBER)
    
    # 4. Logo circle (center-top area)
    logo_center = (WIDTH // 2, 220)
    logo_radius = 85
    # Outer glow ring
    draw_circle(draw, logo_center, logo_radius + 8, fill=None, outline=(*AMBER,), width=2)
    # Main circle background
    draw_circle(draw, logo_center, logo_radius, fill=NAVY, outline=AMBER, width=3)
    
    # Logo text "UD"
    font_logo = get_font(72, bold=True)
    # Draw "U" in white
    u_bbox = draw.textbbox((0, 0), "U", font=font_logo)
    d_bbox = draw.textbbox((0, 0), "D", font=font_logo)
    total_w = (u_bbox[2] - u_bbox[0]) + (d_bbox[2] - d_bbox[0]) + 4
    start_x = logo_center[0] - total_w // 2
    u_y = logo_center[1] - (u_bbox[3] - u_bbox[1]) // 2
    draw.text((start_x, u_y), "U", fill=IVORY, font=font_logo)
    d_x = start_x + (u_bbox[2] - u_bbox[0]) + 4
    draw.text((d_x, u_y), "D", fill=AMBER, font=font_logo)
    
    # 5. Channel name below logo
    font_channel = get_font(22, bold=True)
    channel_text = "UKPSC DECODED"
    ch_bbox = draw.textbbox((0, 0), channel_text, font=font_channel)
    ch_x = WIDTH // 2 - (ch_bbox[2] - ch_bbox[0]) // 2
    draw.text((ch_x, 320), channel_text, fill=IVORY, font=font_channel)
    
    # Subtitle
    font_sub = get_font(14, bold=False)
    sub_text = "STRATEGY  |  PYQ ANALYSIS  |  MAINS  |  INTERVIEW"
    sub_bbox = draw.textbbox((0, 0), sub_text, font=font_sub)
    sub_x = WIDTH // 2 - (sub_bbox[2] - sub_bbox[0]) // 2
    draw.text((sub_x, 350), sub_text, fill=(*AMBER,), font=font_sub)
    
    # 6. Divider line
    draw.line([(WIDTH//2 - 80, 385), (WIDTH//2 + 80, 385)], fill=AMBER, width=2)
    draw_star(draw, (WIDTH//2, 385), 8, AMBER)
    
    # 7. CTA Icons Row
    icon_y = 440
    icon_spacing = 220
    icons_start_x = WIDTH // 2 - icon_spacing
    
    font_icon = get_font(28, bold=True)
    font_icon_label = get_font(15, bold=True)
    
    cta_items = [
        ("LIKE", "thumbs up"),
        ("COMMENT", "speech"),
        ("SHARE", "arrow"),
    ]
    
    for i, (label, icon_type) in enumerate(cta_items):
        cx = icons_start_x + i * icon_spacing
        cy = icon_y
        
        # Circle border
        draw_circle(draw, (cx, cy), 32, fill=(22, 35, 58), outline=AMBER, width=2)
        
        # Icon symbols (using text approximation)
        if icon_type == "thumbs up":
            symbol = "\u25B2"  # triangle up as like
            draw.text((cx - 8, cy - 14), symbol, fill=AMBER, font=get_font(22, bold=True))
        elif icon_type == "speech":
            # Draw a small speech bubble shape
            draw_rounded_rect(draw, (cx-12, cy-10, cx+12, cy+8), radius=4, fill=None, outline=AMBER, width=2)
            draw.polygon([(cx-4, cy+8), (cx+4, cy+8), (cx, cy+14)], fill=AMBER)
        elif icon_type == "arrow":
            # Arrow pointing up-right
            draw.line([(cx-8, cy+8), (cx+8, cy-8)], fill=AMBER, width=2)
            draw.line([(cx+8, cy-8), (cx, cy-8)], fill=AMBER, width=2)
            draw.line([(cx+8, cy-8), (cx+8, cy)], fill=AMBER, width=2)
        
        # Label below
        lbl_bbox = draw.textbbox((0, 0), label, font=font_icon_label)
        lbl_x = cx - (lbl_bbox[2] - lbl_bbox[0]) // 2
        draw.text((lbl_x, cy + 42), label, fill=IVORY, font=font_icon_label)
    
    # 8. SUBSCRIBE Button
    btn_y = 540
    btn_w = 380
    btn_h = 56
    btn_x1 = WIDTH // 2 - btn_w // 2
    btn_y1 = btn_y
    btn_x2 = btn_x1 + btn_w
    btn_y2 = btn_y1 + btn_h
    
    draw_rounded_rect(draw, (btn_x1, btn_y1, btn_x2, btn_y2), radius=10, fill=AMBER)
    
    font_btn = get_font(24, bold=True)
    btn_text = "SUBSCRIBE"
    btn_bbox = draw.textbbox((0, 0), btn_text, font=font_btn)
    btn_tx = WIDTH // 2 - (btn_bbox[2] - btn_bbox[0]) // 2
    btn_ty = btn_y1 + (btn_h - (btn_bbox[3] - btn_bbox[1])) // 2
    draw.text((btn_tx, btn_ty), btn_text, fill=NAVY_DARK, font=font_btn)
    
    # Bell icon (text approximation)
    bell_x = btn_tx + (btn_bbox[2] - btn_bbox[0]) + 15
    draw.text((bell_x, btn_ty), "\u266A", fill=NAVY_DARK, font=get_font(22, bold=True))
    
    # 9. Tagline
    font_tagline = get_font(20, bold=False)
    tagline = 'Prepare Smarter, Not Longer'
    tag_bbox = draw.textbbox((0, 0), tagline, font=font_tagline)
    tag_x = WIDTH // 2 - (tag_bbox[2] - tag_bbox[0]) // 2
    draw.text((tag_x, 620), tagline, fill=(200, 198, 194), font=font_tagline)
    
    # Highlight "Smarter" in amber (approximate position)
    pre_text = "Prepare "
    pre_bbox = draw.textbbox((0, 0), pre_text, font=font_tagline)
    smarter_x = tag_x + (pre_bbox[2] - pre_bbox[0])
    draw.text((smarter_x, 620), "Smarter", fill=AMBER, font=get_font(20, bold=True))
    
    # 10. Lower Third Box (Editable template area)
    box_margin = 200
    box_y1 = 700
    box_y2 = 810
    box_x1 = box_margin
    box_x2 = WIDTH - box_margin
    
    # Box background (semi-transparent effect via darker color)
    draw_rounded_rect(draw, (box_x1, box_y1, box_x2, box_y2), radius=14, 
                      fill=(12, 18, 28), outline=AMBER, width=2)
    
    # Pin icon
    font_pin = get_font(28, bold=True)
    draw.text((box_x1 + 30, box_y1 + 30), "\u25C6", fill=AMBER, font=font_pin)  # Diamond as pin
    
    # Placeholder text
    font_placeholder = get_font(24, bold=False)
    placeholder_text = "Write here with Apple Pencil in FCP..."
    draw.text((box_x1 + 75, box_y1 + 35), placeholder_text, fill=(150, 148, 144), font=font_placeholder)
    
    # Right side label
    font_hint = get_font(12, bold=True)
    hint_text = "LIVE DRAWING ZONE"
    hint_bbox = draw.textbbox((0, 0), hint_text, font=font_hint)
    draw.text((box_x2 - (hint_bbox[2] - hint_bbox[0]) - 30, box_y1 + 40), 
              hint_text, fill=(180, 140, 70), font=font_hint)
    
    # Pencil icon hint
    draw.text((box_x2 - (hint_bbox[2] - hint_bbox[0]) - 50, box_y1 + 38), 
              "/", fill=(180, 140, 70), font=get_font(16, bold=True))
    
    # 11. Bottom decorative line
    draw.line([(box_margin, 850), (WIDTH - box_margin, 850)], fill=(30, 42, 60), width=1)
    
    # 12. Motivational footer text
    font_footer = get_font(16, bold=False)
    footer_text = '"Things will get sorted from here. Keep going."'
    ft_bbox = draw.textbbox((0, 0), footer_text, font=font_footer)
    ft_x = WIDTH // 2 - (ft_bbox[2] - ft_bbox[0]) // 2
    draw.text((ft_x, 870), footer_text, fill=(160, 158, 154), font=font_footer)
    
    # 13. Bottom-right watermark
    font_wm = get_font(12, bold=True)
    wm_text = "UKPSC DECODED"
    wm_bbox = draw.textbbox((0, 0), wm_text, font=font_wm)
    draw.text((WIDTH - (wm_bbox[2] - wm_bbox[0]) - 40, HEIGHT - 35), 
              wm_text, fill=(100, 98, 94), font=font_wm)
    
    # 14. Corner accent marks (subtle branding)
    # Top-left corner L
    draw.line([(40, 40), (40, 80)], fill=AMBER, width=2)
    draw.line([(40, 40), (80, 40)], fill=AMBER, width=2)
    # Top-right corner L
    draw.line([(WIDTH-40, 40), (WIDTH-40, 80)], fill=AMBER, width=2)
    draw.line([(WIDTH-40, 40), (WIDTH-80, 40)], fill=AMBER, width=2)
    # Bottom-left corner L
    draw.line([(40, HEIGHT-40), (40, HEIGHT-80)], fill=AMBER, width=2)
    draw.line([(40, HEIGHT-40), (80, HEIGHT-40)], fill=AMBER, width=2)
    # Bottom-right corner L
    draw.line([(WIDTH-40, HEIGHT-40), (WIDTH-40, HEIGHT-80)], fill=AMBER, width=2)
    draw.line([(WIDTH-40, HEIGHT-40), (WIDTH-80, HEIGHT-40)], fill=AMBER, width=2)
    
    # 15. Side decorative dots (subtle)
    for i in range(5):
        y_pos = 400 + i * 60
        draw_circle(draw, (60, y_pos), 3, fill=(40, 55, 78))
        draw_circle(draw, (WIDTH - 60, y_pos), 3, fill=(40, 55, 78))
    
    # Save
    output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 
                               "UKPSC_Decoded_CTA_EndCard.png")
    img.save(output_path, "PNG", quality=95)
    print(f"✅ CTA End Card saved: {output_path}")
    print(f"   Dimensions: {WIDTH}x{HEIGHT} (YouTube Landscape)")
    print(f"   File size: {os.path.getsize(output_path) / 1024:.1f} KB")
    return output_path

if __name__ == "__main__":
    create_cta_card()
