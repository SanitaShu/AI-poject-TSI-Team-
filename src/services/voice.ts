/**
 * Voice Service for Speech Recognition and Text-to-Speech
 * Uses Web Speech API (built into modern browsers)
 */

// Speech Recognition types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

/**
 * Check if Speech Recognition is supported
 */
export function isSpeechRecognitionSupported(): boolean {
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}

/**
 * Check if Text-to-Speech is supported
 */
export function isTextToSpeechSupported(): boolean {
  return 'speechSynthesis' in window;
}

/**
 * Speech Recognition Service
 */
export class VoiceRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private isListening = false;

  constructor() {
    if (isSpeechRecognitionSupported()) {
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionAPI();

      // Settings for LONG speech handling
      this.recognition.continuous = true; // ✅ Keeps listening continuously
      this.recognition.interimResults = true; // ✅ Shows real-time results
      this.recognition.lang = 'en-US';
      this.recognition.maxAlternatives = 1;

      console.log('✅ Speech Recognition initialized (continuous mode for long speech)');
    } else {
      console.error('❌ Speech Recognition not supported in this browser');
    }
  }

  /**
   * Start listening for voice input
   */
  startListening(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError?: (error: string) => void,
    onEnd?: () => void
  ): void {
    if (!this.recognition) {
      onError?.('Speech recognition not supported in this browser');
      return;
    }

    if (this.isListening) {
      console.warn('Already listening');
      return;
    }

    this.recognition.onstart = () => {
      this.isListening = true;
      console.log('Voice recognition started');
    };

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const results = event.results;
      const lastResult = results[results.length - 1];
      const transcript = lastResult[0].transcript;
      const isFinal = lastResult.isFinal;

      onResult(transcript, isFinal);
    };

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;
      onError?.(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      console.log('Voice recognition ended');
      onEnd?.();
    };

    try {
      this.recognition.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
      this.isListening = false;
      onError?.('Failed to start voice recognition');
    }
  }

  /**
   * Stop listening
   */
  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  /**
   * Check if currently listening
   */
  getIsListening(): boolean {
    return this.isListening;
  }
}

/**
 * Text-to-Speech Service (using Web Speech API)
 */
export class TextToSpeechService {
  private synthesis: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking = false;

  constructor() {
    if (isTextToSpeechSupported()) {
      this.synthesis = window.speechSynthesis;
      console.log('✅ Text-to-Speech initialized');
    } else {
      console.error('❌ Text-to-Speech not supported in this browser');
    }
  }

  /**
   * Speak text out loud
   */
  speak(
    text: string,
    options?: {
      rate?: number; // 0.1 to 10 (default: 1)
      pitch?: number; // 0 to 2 (default: 1)
      volume?: number; // 0 to 1 (default: 1)
      lang?: string; // default: 'en-US'
      voice?: SpeechSynthesisVoice;
    },
    onEnd?: () => void,
    onError?: (error: string) => void
  ): void {
    if (!this.synthesis) {
      onError?.('Text-to-speech not supported in this browser');
      return;
    }

    // Stop any ongoing speech
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);

    // Set options
    utterance.rate = options?.rate ?? 1;
    utterance.pitch = options?.pitch ?? 1;
    utterance.volume = options?.volume ?? 1;
    utterance.lang = options?.lang ?? 'en-US';

    if (options?.voice) {
      utterance.voice = options.voice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      console.log('Started speaking');
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      console.log('Finished speaking');
      onEnd?.();
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      this.isSpeaking = false;
      this.currentUtterance = null;
      onError?.('Failed to speak text');
    };

    this.currentUtterance = utterance;
    this.synthesis.speak(utterance);
  }

  /**
   * Stop speaking
   */
  stop(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.isSpeaking = false;
      this.currentUtterance = null;
    }
  }

  /**
   * Pause speaking
   */
  pause(): void {
    if (this.synthesis && this.isSpeaking) {
      this.synthesis.pause();
    }
  }

  /**
   * Resume speaking
   */
  resume(): void {
    if (this.synthesis && this.isSpeaking) {
      this.synthesis.resume();
    }
  }

  /**
   * Check if currently speaking
   */
  getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  /**
   * Get available voices
   */
  getVoices(): SpeechSynthesisVoice[] {
    if (!this.synthesis) return [];
    return this.synthesis.getVoices();
  }

  /**
   * Get English voices
   */
  getEnglishVoices(): SpeechSynthesisVoice[] {
    return this.getVoices().filter(voice => voice.lang.startsWith('en'));
  }
}

// Singleton instances
export const voiceRecognition = new VoiceRecognitionService();
export const textToSpeech = new TextToSpeechService();
