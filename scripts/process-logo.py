from PIL import Image, ImageDraw

# Load original
img = Image.open('public/images/logo.jpg').convert('RGBA')

# Center and radius determined
cx = 511.5
cy = 381.5
r = 262.5 # slight margin to capture full dark green circle border cleanly

# Create a square bounding box around the circle
box_size = int(r * 2 + 8) # 533x533
crop_left = int(cx - box_size / 2)
crop_top = int(cy - box_size / 2)
crop_right = crop_left + box_size
crop_bottom = crop_top + box_size

cropped = img.crop((crop_left, crop_top, crop_right, crop_bottom))

# Create smooth antialiased circular mask using 4x supersampling
supersample = 4
mask_size = (box_size * supersample, box_size * supersample)
mask = Image.new('L', mask_size, 0)
draw = ImageDraw.Draw(mask)

mask_cx = mask_size[0] / 2
mask_cy = mask_size[1] / 2
mask_r = (r - 0.5) * supersample

draw.ellipse([mask_cx - mask_r, mask_cy - mask_r, mask_cx + mask_r, mask_cy + mask_r], fill=255)
mask = mask.resize((box_size, box_size), Image.Resampling.LANCZOS)

# Apply mask to cropped image
cropped.putalpha(mask)

# Save as public/images/logo.png and public/logo.png
cropped.save('public/images/logo.png', 'PNG')
cropped.save('public/logo.png', 'PNG')
print('Saved public/images/logo.png and public/logo.png (533x533 transparent)')

# Save high-res 256x256, 128x128, 64x64, 32x32 for favicon
icon_sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
cropped.resize((180, 180), Image.Resampling.LANCZOS).save('public/apple-touch-icon.png', 'PNG')
cropped.resize((32, 32), Image.Resampling.LANCZOS).save('public/favicon.ico', format='ICO', sizes=icon_sizes)
print('Saved apple-touch-icon.png and favicon.ico')

