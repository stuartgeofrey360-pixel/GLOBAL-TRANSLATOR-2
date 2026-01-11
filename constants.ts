import { Language, PhraseCategory } from './types';

export const ALL_LANGUAGES: (Language & { flag: string })[] = [
  { code: 'en', name: 'English', sttCode: 'en-US', flag: '🇺🇸' },
  { code: 'sw', name: 'Kiswahili (Swahili)', sttCode: 'sw-KE', flag: '🇹🇿' },
  { code: 'es', name: 'Español (Spanish)', sttCode: 'es-ES', flag: '🇪🇸' },
  { code: 'fr', name: 'Français (French)', sttCode: 'fr-FR', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch (German)', sttCode: 'de-DE', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano (Italian)', sttCode: 'it-IT', flag: '🇮🇹' },
  { code: 'nl', name: 'Nederlands (Dutch)', sttCode: 'nl-NL', flag: '🇳🇱' },
  { code: 'zh', name: '中文 (Mandarin)', sttCode: 'zh-CN', flag: '🇨🇳' },
  { code: 'pt', name: 'Português (Portuguese)', sttCode: 'pt-PT', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский (Russian)', sttCode: 'ru-RU', flag: '🇷🇺' },
  { code: 'ja', name: '日本語 (Japanese)', sttCode: 'ja-JP', flag: '🇯🇵' },
  { code: 'ar', name: 'العربية (Arabic)', sttCode: 'ar-SA', flag: '🇸🇦' },
  { code: 'ko', name: '한국어 (Korean)', sttCode: 'ko-KR', flag: '🇰🇷' },
  { code: 'hi', name: 'हिन्दी (Hindi)', sttCode: 'hi-IN', flag: '🇮🇳' },
  { code: 'th', name: 'ไทย (Thai)', sttCode: 'th-TH', flag: '🇹🇭' },
  { code: 'tr', name: 'Türkçe (Turkish)', sttCode: 'tr-TR', flag: '🇹🇷' },
  { code: 'vi', name: 'Tiếng Việt (Vietnamese)', sttCode: 'vi-VN', flag: '🇻🇳' },
  { code: 'am', name: 'Amharic', sttCode: 'am-ET', flag: '🇪🇹' },
  { code: 'ha', name: 'Hausa', sttCode: 'ha-NG', flag: '🇳🇬' },
  { code: 'yo', name: 'Yoruba', sttCode: 'yo-NG', flag: '🇳🇬' },
];

export const PHRASEBOOK_DATA: PhraseCategory[] = [
  {
    category: "Greetings & Politeness",
    phrases: [
      { en: "Hello, how are you?", sw: "Hujambo / Habari? (Response: Nzuri)" },
      { en: "Thank you very much.", sw: "Asante sana." },
      { en: "Excuse me / Sorry.", sw: "Samahani." },
      { en: "Yes / No.", sw: "Ndio / Hapana." }
    ]
  },
  {
    category: "Safari & Travel",
    phrases: [
      { en: "What animals can we see today?", sw: "Tunaweza kuona wanyama gani leo?" },
      { en: "Where is the nearest lodge?", sw: "Loji iliyo karibu iko wapi?" },
      { en: "It is beautiful!", sw: "Ni nzuri sana!" },
      { en: "Please stop here for a picture.", sw: "Tafadhali simama hapa kwa picha." }
    ]
  },
  {
    category: "Shopping & Market",
    phrases: [
      { en: "How much does this cost?", sw: "Hii inagharimu kiasi gani?" },
      { en: "I would like to buy this.", sw: "Ningependa kununua hii." },
      { en: "Do you have change?", sw: "Una chenji?" },
      { en: "I am just looking, thank you.", sw: "Ninatazama tu, asante." }
    ]
  }
];