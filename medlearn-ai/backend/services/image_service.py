import urllib.parse


def generate_image_url(description: str) -> str:
    """
    Generate image URL using Pollinations.ai
    
    This is a FREE service that requires NO API key!
    It generates images on-the-fly based on the prompt.
    """
    # Create a detailed medical image prompt
    prompt = f"medical educational illustration, {description}, clean professional diagram, labeled anatomy, textbook style, white background, high quality, detailed, scientific accuracy"

    # URL encode the prompt for use in URL
    encoded_prompt = urllib.parse.quote(prompt)

    # Pollinations.ai generates images directly from URL
    # Parameters: width, height, nologo (removes watermark)
    image_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=800&height=500&nologo=true"

    return image_url


def get_placeholder_image(title: str) -> str:
    """
    Get a placeholder image if generation fails.
    Uses placeholder.com service.
    """
    encoded_title = urllib.parse.quote(title[:30])  # Limit title length
    return f"https://via.placeholder.com/800x500/4F46E5/FFFFFF?text={encoded_title}"