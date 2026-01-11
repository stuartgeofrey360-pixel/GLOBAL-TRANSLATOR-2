import { Language, UserLocation } from "../types";

// Declaration for Tesseract loaded via CDN
declare const Tesseract: any;

/**
 * Translates text using the Google Translate 'gtx' endpoint.
 * This is a completely free, undocumented API used by many extensions.
 * It is extremely reliable, fast, and works without API keys.
 */
export async function translateText(
  text: string,
  fromLang: Language,
  toLang: Language,
  location?: UserLocation
): Promise<string> {
  // Use a random number to prevent caching issues
  const cacheBuster = Math.floor(Math.random() * 100000);
  
  // Construct the URL for the free Google Translate endpoint
  // sl = source language, tl = target language, dt=t returns the translated text
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromLang.code}&tl=${toLang.code}&dt=t&q=${encodeURIComponent(text)}&cb=${cacheBuster}`;
  
  try {
    // Add a timeout to the fetch to prevent infinite loading state
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(url, { 
        method: 'GET',
        signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
        throw new Error(`Service returned ${response.status}`);
    }
    
    const data = await response.json();
    
    // The API returns a nested array structure. 
    // data[0] contains the translation segments.
    // Each segment is [translatedText, originalText, ...]
    // We map over data[0] and join the first element of each segment.
    if (data && data[0]) {
        return data[0].map((segment: any) => segment[0]).join('');
    }
    
    return "Translation returned empty.";

  } catch (error: any) {
    console.error("Translation Error:", error);
    if (error.name === 'AbortError') {
        return "Request timed out. Check connection.";
    }
    return "Connection failed. Try again.";
  }
}

/**
 * Recognizes text from an image using Tesseract.js (Client-side OCR)
 * and then translates it.
 */
export async function translateImage(
  base64Image: string,
  fromLang: Language,
  toLang: Language
): Promise<string> {
  try {
    const imageUrl = `data:image/jpeg;base64,${base64Image}`;
    
    // Check if Tesseract is loaded
    if (typeof Tesseract === 'undefined') {
        return "OCR Library loading... check internet.";
    }

    // Perform OCR in the browser
    // Using 'eng' as a base model is usually safest for general text detection 
    // unless we download specific language packs which takes data/time.
    const { data: { text } } = await Tesseract.recognize(imageUrl, 'eng', {
      // logger: (m: any) => console.log(m) // Disable logging for perf
    });

    if (!text || text.trim().length === 0) {
      return "No text detected in image.";
    }

    // Translate the extracted text
    return await translateText(text, fromLang, toLang);
  } catch (error) {
    console.error("OCR Error:", error);
    return "Could not read image text.";
  }
}

/**
 * Native Speech Synthesis Logic (Offline Fallback)
 * Carefully tuned to sound as human as possible using system voices.
 */
function speakNative(text: string, lang: Language, onEnd: () => void): void {
  if (!window.speechSynthesis) {
    console.error("Native TTS not supported");
    onEnd();
    return;
  }

  window.speechSynthesis.cancel();

  const attemptSpeak = () => {
    const voices = window.speechSynthesis.getVoices();
    const utterance = new SpeechSynthesisUtterance(text);
    const langCode = lang.sttCode || lang.code; 

    utterance.lang = langCode;

    if (voices.length > 0) {
      // Filter for voices that match the language
      let candidates = voices.filter(v => v.lang.replace('_', '-') === langCode.replace('_', '-'));
      if (candidates.length === 0) {
        const baseLang = langCode.split('-')[0];
        candidates = voices.filter(v => v.lang.startsWith(baseLang));
      }

      if (candidates.length > 0) {
        // Priority: Network/Google > Enhanced > Default
        const bestVoice = 
          candidates.find(v => v.name.includes("Google") && v.name.includes("Network")) ||
          candidates.find(v => v.name.includes("Google") && !v.name.includes("Network")) ||
          candidates.find(v => v.name.includes("Natural")) ||
          candidates.find(v => v.name.includes("Premium")) ||
          candidates.find(v => v.name.includes("Enhanced")) ||
          candidates.find(v => v.name.includes("Siri")) ||
          candidates.find(v => v.default) ||
          candidates[0];

        if (bestVoice) {
          utterance.voice = bestVoice;
        }
      }
    }

    // Rate 0.85 makes it sound more deliberate and less robotic
    utterance.rate = 0.85; 
    utterance.pitch = 1.0; 
    utterance.volume = 1.0;

    utterance.onend = () => onEnd();
    utterance.onerror = (e) => {
      console.error("Native TTS Error", e);
      onEnd();
    };

    window.speechSynthesis.speak(utterance);
  };

  // Ensure voices are loaded (Chrome quirk)
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      attemptSpeak();
      window.speechSynthesis.onvoiceschanged = null;
    };
    setTimeout(() => {
        if (!window.speechSynthesis.speaking) attemptSpeak();
    }, 500);
  } else {
    attemptSpeak();
  }
}

/**
 * Main Speak Function - Hybrid Strategy
 * 1. Tries to fetch "Dictionary Grade" audio from Google servers (Human accent).
 * 2. Falls back to System Voice (Robot accent) if offline or error.
 */
export function speakText(
  text: string,
  lang: Language,
  onEnd: () => void
): void {
  if (!text.trim()) {
    onEnd();
    return;
  }

  // FORCE ONLINE TTS FOR SWAHILI to fix the accent issue.
  // Native Swahili voices are often missing or poor quality on many devices.
  // Google's online TTS ('tw-ob') is the gold standard for free Swahili pronunciation.
  const useOnlineTTS = (lang.code === 'sw' || lang.code === 'sw-KE');

  // We limit online TTS to reasonable lengths to avoid latency/errors.
  if (useOnlineTTS && navigator.onLine && text.length < 200) {
    const audio = new Audio();
    // Use the official Google Translate TTS endpoint
    // tl = target language
    // client = tw-ob (Translate Web - On Board) -> Returns standard MP3
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang.code}&client=tw-ob`;
    
    audio.src = url;
    audio.crossOrigin = "anonymous";
    
    audio.onended = () => onEnd();
    
    audio.onerror = (e) => {
        console.warn("Online TTS failed, switching to native fallback...", e);
        speakNative(text, lang, onEnd);
    };
    
    // Attempt to play. Browsers require user interaction (click) to play audio, 
    // which this function is usually called within.
    audio.play().catch((e) => {
        console.warn("Audio Playback Blocked/Failed", e);
        speakNative(text, lang, onEnd);
    });
    
    return;
  }

  // Default to native for other languages or if offline
  speakNative(text, lang, onEnd);
}

// Deprecated: Kept signature for interface compatibility if needed
export async function generateSpeech(text: string, toLang: Language): Promise<any> {
    return null;
}