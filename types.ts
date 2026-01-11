
export interface Language {
  code: string;
  name: string;
  sttCode: string;
}

export type AppMode = 'conversational' | 'text-only' | 'phrasebook' | 'camera';

export interface Phrase {
  en: string;
  sw: string;
}

export interface PhraseCategory {
  category: string;
  phrases: Phrase[];
}

export interface StatusMessage {
  text: string;
  type: 'info' | 'success' | 'error';
}

export interface HistoryItem {
  id: string;
  original: string;
  translated: string;
  fromLang: string;
  toLang: string;
  timestamp: number;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}
