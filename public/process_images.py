from PIL import Image, ImageDraw, ImageFont
import os
import sys

# Usage: python process_images.py ceramics
#        python process_images.py crochet

if len(sys.argv) < 2 or sys.argv[1] not in ("ceramics", "crochet"):
    print("Usage: python process_images.py [ceramics|crochet]")
    sys.exit(1)

MODE = sys.argv[1]

# — CONFIG —

INPUT_DIR  = f"{MODE}_originals"
OUTPUT_DIR = MODE
WATERMARK_TEXT = "© Katharine Xiao"
MAX_WIDTH = 800               # max width in pixels (height scales automatically)
JPEG_QUALITY = 75             # ceramics only; 75 is good for web
FONT_SIZE_RATIO = 0.04        # watermark text size as fraction of image width
OPACITY = 120                 # 0 (invisible) to 255 (fully opaque)

# –––––––

os.makedirs(OUTPUT_DIR, exist_ok=True)

for filename in os.listdir(INPUT_DIR):
    if not filename.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
        continue

    input_path = os.path.join(INPUT_DIR, filename)

    # Crochet outputs PNG to preserve transparency; ceramics outputs JPEG
    if MODE == "crochet":
        base = os.path.splitext(filename)[0]
        output_path = os.path.join(OUTPUT_DIR, f"{base}.png")
    else:
        output_path = os.path.join(OUTPUT_DIR, filename)

    with Image.open(input_path) as img:
        img = img.convert("RGBA")

        # --- Resize ---
        if img.width > MAX_WIDTH:
            ratio = MAX_WIDTH / img.width
            new_size = (MAX_WIDTH, int(img.height * ratio))
            img = img.resize(new_size, Image.LANCZOS)

        # --- Watermark (ceramics only) ---
        if MODE == "ceramics":
            overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
            draw = ImageDraw.Draw(overlay)

            font_size = max(12, int(img.width * FONT_SIZE_RATIO))
            try:
                font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", font_size)
            except:
                font = ImageFont.load_default()

            # Position: bottom-right corner with padding
            bbox = draw.textbbox((0, 0), WATERMARK_TEXT, font=font)
            text_w = bbox[2] - bbox[0]
            text_h = bbox[3] - bbox[1]
            padding = int(img.width * 0.02)
            x = img.width - text_w - padding
            y = img.height - text_h - padding

            draw.text((x + 1, y + 1), WATERMARK_TEXT, font=font, fill=(0, 0, 0, OPACITY))
            draw.text((x, y), WATERMARK_TEXT, font=font, fill=(255, 255, 255, OPACITY))

            img = Image.alpha_composite(img, overlay)

        # --- Save ---
        if MODE == "crochet":
            # Keep transparency — save as PNG
            img.save(output_path, "PNG", optimize=True)
        else:
            # Flatten onto white — save as JPEG
            background = Image.new("RGB", img.size, (255, 255, 255))
            background.paste(img.convert("RGBA"), mask=img.split()[3])
            background.save(output_path, "JPEG", quality=JPEG_QUALITY, optimize=True)

        print(f"Saved: {output_path}")

print("Done!")
