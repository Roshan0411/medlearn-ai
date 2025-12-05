import edge_tts
import os

# Directory for storing audio files
AUDIO_DIR = "static/audio"


async def generate_audio(text: str, filename: str) -> str:
    """
    Generate audio narration using Microsoft Edge TTS.
    
    This is FREE and requires NO API key!
    Uses Microsoft's high-quality neural voices.
    
    Args:
        text: The text to convert to speech
        filename: Output filename (e.g., "session123_0.mp3")
    
    Returns:
        URL path to the audio file (e.g., "/static/audio/session123_0.mp3")
    """
    # Ensure the audio directory exists
    os.makedirs(AUDIO_DIR, exist_ok=True)

    output_path = os.path.join(AUDIO_DIR, filename)

    # Available voices (all high quality):
    # - en-US-AriaNeural (Female, conversational)
    # - en-US-GuyNeural (Male, friendly)
    # - en-US-JennyNeural (Female, professional)
    # - en-GB-SoniaNeural (Female, British)
    voice = "en-US-AriaNeural"

    try:
        # Create the TTS communication object
        communicate = edge_tts.Communicate(text, voice)
        
        # Save the audio to file
        await communicate.save(output_path)
        
        print(f"    🔊 Audio saved: {filename}")
        return f"/static/audio/{filename}"

    except Exception as e:
        print(f"    ⚠️ Audio generation failed: {e}")
        return None


async def list_available_voices():
    """
    List all available Edge TTS voices.
    Useful for finding the right voice for your needs.
    """
    voices = await edge_tts.list_voices()
    english_voices = [v for v in voices if v["Locale"].startswith("en-")]
    
    for voice in english_voices:
        print(f"Voice: {voice['ShortName']}")
        print(f"  Gender: {voice['Gender']}")
        print(f"  Locale: {voice['Locale']}")
        print()
    
    return english_voices