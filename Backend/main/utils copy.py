import os
from django.conf import settings
from django.utils import timezone
from PIL import Image, ImageDraw, ImageFont

def generate_certificate(student_name, course_name, issued_at, certificate_id):
    try:
        issued_at = issued_at or timezone.now()
        template_path = os.path.join(settings.MEDIA_ROOT, 'certificates', 'templates', 'certificate_template.png')
        output_dir = os.path.join(settings.MEDIA_ROOT, 'certificates', issued_at.strftime('%Y/%m/%d'))
        font_path = os.path.join(settings.MEDIA_ROOT, 'certificates', 'fonts', 'arial.ttf')

        if not os.path.exists(template_path):
            raise FileNotFoundError(f"Template not found at {template_path}")

        os.makedirs(output_dir, exist_ok=True)

        img = Image.open(template_path)
        draw = ImageDraw.Draw(img)
        
        # Load fonts (with fallbacks)
        font_large = ImageFont.truetype(font_path, 110) if os.path.exists(font_path) else ImageFont.load_default()
        font_medium = ImageFont.truetype(font_path, 60) if os.path.exists(font_path) else ImageFont.load_default()
        font_small = ImageFont.truetype(font_path, 40) if os.path.exists(font_path) else ImageFont.load_default()
        font_tiny = ImageFont.truetype(font_path, 20) if os.path.exists(font_path) else ImageFont.load_default()

        # Draw elements with consistent styling
        draw.text((380, 340), f"Certificate ID: {certificate_id}", font=font_small, fill=(0, 0, 0))  # ID at top
        draw.text((380, 370), student_name, font=font_large, fill=(0, 0, 0))  # Student name
        draw.text((330, 480), course_name, font=font_medium, fill=(0, 0, 0))  # Course name
        draw.text((410, 540), issued_at.strftime('%Y-%m-%d'), font=font_small, fill=(0, 0, 0))  # Date

        # Generate filename (simplified)
        filename = f"cert_{certificate_id}.png"
        file_path = os.path.join(output_dir, filename)
        img.save(file_path, 'PNG')

        return os.path.relpath(file_path, settings.MEDIA_ROOT)
    except Exception as e:
        raise ValueError(f"Certificate generation failed: {str(e)}")