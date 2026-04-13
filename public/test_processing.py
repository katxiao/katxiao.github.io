from PIL import Image
import numpy as np
import os

INPUT_DIR = "ceramics_originals"
filename = "spiral_mug.jpeg"
path = os.path.join(INPUT_DIR, filename)

with Image.open(path) as img:
    print(f"File: {filename}")
    print(f"Mode: {img.mode}")
    print(f"Size: {img.size}")
    print(f"ICC profile present: {bool(img.info.get('icc_profile'))}")

    rgb = img.convert("RGB")
    new_size = (1200, int(img.height * 1200 / img.width))

    # Step 1: bare minimum — open and re-save
    rgb.save("test_1_bare.jpeg", "JPEG", quality=95)

    # Step 2: with resize only (gamma space)
    rgb.resize(new_size, Image.LANCZOS).save("test_2_resize_gamma.jpeg", "JPEG", quality=95)

    # Step 3: with resize only (linear light)
    arr = np.array(rgb, dtype=np.float32) / 255.0
    arr = arr ** 2.2
    linear = Image.fromarray((arr * 255).astype("uint8"))
    linear = linear.resize(new_size, Image.LANCZOS)
    arr2 = np.array(linear, dtype=np.float32) / 255.0
    arr2 = arr2 ** (1 / 2.2)
    Image.fromarray((arr2 * 255).astype("uint8")).save("test_3_resize_linear.jpeg", "JPEG", quality=95)

print("Saved test_1_bare.jpeg, test_2_resize_gamma.jpeg, test_3_resize_linear.jpeg")
