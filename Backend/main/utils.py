import os
from django.conf import settings
from django.utils import timezone
from django.core.files import File
from PIL import Image, ImageDraw, ImageFont
from io import BytesIO


def generate_certificate(student_name, course_name, issued_at=None, certificate_id=None):
    """
    Generate a certificate as a Django File object.
    Ensures font fallbacks and memory-safe operation.
    """
    try:
        issued_at = issued_at or timezone.now()
        certificate_id = certificate_id or f"CERT-{issued_at.strftime('%Y%m%d%H%M%S')}"

        # Paths for template and fonts
        template_path = os.path.join(settings.MEDIA_ROOT, 'certificates', 'templates', 'certificate_template.png')
        font_arial_path = os.path.join(settings.MEDIA_ROOT, 'certificates', 'fonts', 'arial.ttf')
        font_script_path = os.path.join(settings.MEDIA_ROOT, 'certificates', 'fonts', 'DancingScript-Regular.ttf')

        if not os.path.exists(template_path):
            raise FileNotFoundError(f"Certificate template not found at {template_path}")

        # Open template image
        img = Image.open(template_path).convert("RGB")
        draw = ImageDraw.Draw(img)

        # Load fonts with fallbacks
        if os.path.exists(font_script_path):
            font_large = ImageFont.truetype(font_script_path, 80)  # student name
        else:
            font_large = ImageFont.load_default()

        if os.path.exists(font_arial_path):
            font_medium = ImageFont.truetype(font_arial_path, 50)  # course name
            font_small = ImageFont.truetype(font_arial_path, 40)   # ID and date
        else:
            font_medium = font_small = ImageFont.load_default()

        # Draw text on the certificate (coordinates preserved)
        draw.text((180, 240), f"Certificate ID: {certificate_id}", font=font_small, fill=(0, 0, 0))
        draw.text((170, 700), student_name, font=font_large, fill=(0, 0, 0))
        draw.text((170, 910), course_name, font=font_medium, fill=(0, 0, 0))
        draw.text((170, 1000), f"Issued at: {issued_at.strftime('%Y-%m-%d')}", font=font_small, fill=(0, 0, 0))

        # Save image to memory buffer
        buffer = BytesIO()
        img.save(buffer, format="PNG")
        buffer.seek(0)

        # Return Django File object
        file_name = f"cert_{certificate_id}.png"
        return File(buffer, name=file_name)

    except Exception as e:
        raise ValueError(f"Certificate generation failed: {str(e)}")
