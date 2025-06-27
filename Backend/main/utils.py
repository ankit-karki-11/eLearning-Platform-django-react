import os
from django.conf import settings
from django.utils import timezone
from PIL import Image, ImageDraw, ImageFont


def generate_certificate(student_name, course_name, issued_at=None, certificate_id=None):
    try:
        # Handle default values
        issued_at = issued_at or timezone.now()
        certificate_id = certificate_id or f"cert{issued_at.strftime('%Y%m%d%H%M%S')}"
        course_name = course_name or 'Course'

        # File paths
        template_path = os.path.join(settings.MEDIA_ROOT, 'certificates', 'templates', 'certificate_template.png')
        output_dir = os.path.join(settings.MEDIA_ROOT, 'certificates', issued_at.strftime('%Y/%m/%d'))
        font_regular_path = os.path.join(settings.MEDIA_ROOT, 'certificates', 'fonts', 'arial.ttf')
        font_bold_path = os.path.join(settings.MEDIA_ROOT, 'certificates', 'fonts', 'arialbd.ttf')
        font_name_path = os.path.join(settings.MEDIA_ROOT, 'certificates', 'fonts', 'DancingScript-Regular.ttf')  # Script for name

        # Validate template image exists
        if not os.path.exists(template_path):
            raise FileNotFoundError(f"Certificate template not found at: {template_path}")

        # Ensure output directory exists
        os.makedirs(output_dir, exist_ok=True)

        # Load image
        img = Image.open(template_path)
        draw = ImageDraw.Draw(img)

        # Load fonts with fallback
        def load_font(path, size):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                return ImageFont.load_default()

        font_name = load_font(font_name_path, 80)           
        font_course = load_font(font_bold_path, 40)      
        font_id = load_font(font_regular_path, 30)       
        font_date = load_font(font_regular_path, 34)   

        # Draw certificate coordinates based on template
        draw.text((170, 210), f"Certificate ID: {certificate_id}", font=font_id, fill=(0, 0, 0))
        draw.text((170, 700), student_name, font=font_name, fill=(0, 0, 0))
        draw.text((170, 940), course_name, font=font_course, fill=(0, 0, 0))
        draw.text((170, 1040), f"Issued on: {issued_at.strftime('%Y-%m-%d')}", font=font_date, fill=(0, 0, 0))

        # Save certificate image
        filename = f"{student_name.split()[0]}_{certificate_id}.png"
        file_path = os.path.join(output_dir, filename)
        img.save(file_path, 'PNG')

        # Return relative media path
        return os.path.relpath(file_path, settings.MEDIA_ROOT).replace("\\", "/")

    except Exception as e:
        raise ValueError(f"Certificate generation failed: {str(e)}")
