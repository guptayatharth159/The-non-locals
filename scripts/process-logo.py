from PIL import Image, ImageDraw
import os

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

# Save high-res master logos
cropped.save('public/images/logo.png', 'PNG')
cropped.save('public/logo.png', 'PNG')
print('Saved public/images/logo.png and public/logo.png (533x533 transparent)')

# Apple touch icons (180x180)
apple_180 = cropped.resize((180, 180), Image.Resampling.LANCZOS)
apple_180.save('public/apple-touch-icon.png', 'PNG')
apple_180.save('src/app/apple-icon.png', 'PNG')
print('Saved public/apple-touch-icon.png and src/app/apple-icon.png')

# High-res tab icon (192x192 and 32x32)
icon_192 = cropped.resize((192, 192), Image.Resampling.LANCZOS)
icon_192.save('public/icon.png', 'PNG')
icon_192.save('src/app/icon.png', 'PNG')
print('Saved public/icon.png and src/app/icon.png')

# Multi-resolution favicon.ico
icon_sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
cropped.save('public/favicon.ico', format='ICO', sizes=icon_sizes)
cropped.save('src/app/favicon.ico', format='ICO', sizes=icon_sizes)
print('Saved public/favicon.ico and src/app/favicon.ico with official logo')
