/**
 * OpenAI Text-to-Speech Service
 * Alternative to Web Speech API with better voice quality
 */

/**
 * Speak text using OpenAI TTS API
 * Requires VITE_OPENAI_API_KEY in .env
 */
export async function speakWithOpenAI(text: string): Promise<void> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    console.error('OpenAI API key not configured');
    throw new Error('OpenAI API key required for TTS');
  }

  try {
    console.log('🔊 Using OpenAI TTS...');

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1', // or 'tts-1-hd' for higher quality
        voice: 'alloy', // options: alloy, echo, fable, onyx, nova, shimmer
        input: text,
        speed: 1.0, // 0.25 to 4.0
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI TTS API error: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
    const audioUrl = URL.createObjectURL(blob);

    const audio = new Audio(audioUrl);

    return new Promise((resolve, reject) => {
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        console.log('✅ OpenAI TTS finished');
        resolve();
      };

      audio.onerror = (error) => {
        URL.revokeObjectURL(audioUrl);
        console.error('❌ OpenAI TTS playback error:', error);
        reject(error);
      };

      audio.play().catch(reject);
    });
  } catch (error) {
    console.error('❌ OpenAI TTS error:', error);
    throw error;
  }
}

/**
 * Available OpenAI TTS voices
 */
export const OPENAI_VOICES = {
  alloy: 'Alloy (neutral)',
  echo: 'Echo (male)',
  fable: 'Fable (expressive)',
  onyx: 'Onyx (deep male)',
  nova: 'Nova (female)',
  shimmer: 'Shimmer (soft female)',
} as const;

export type OpenAIVoice = keyof typeof OPENAI_VOICES;
