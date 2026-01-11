import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Language, AppMode, StatusMessage, HistoryItem, UserLocation } from './types';
import { ALL_LANGUAGES } from './constants';
import Header from './components/Header';
import LanguageSelector from './components/LanguageSelector';
import StatusArea from './components/StatusArea';
import Phrasebook from './components/Phrasebook';
import CameraTranslator from './components/CameraTranslator';
import ModeSelector from './components/ModeSelector';
import { translateText, speakText } from './services/geminiService';

const LOADING_MESSAGES = [
  "Connecting...",
  "Translating...",
  "Processing...",
  "Almost there..."
];

const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<AppMode>('text-only');
  const [fromLang, setFromLang] = useState<any>(ALL_LANGUAGES.find(l => l.code === 'en')!);
  const [toLang, setToLang] = useState<any>(ALL_LANGUAGES.find(l => l.code === 'sw')!);
  const [inputText, setInputText] = useState('');
  const [translationResult, setTranslationResult] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [status, setStatus] = useState<StatusMessage | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [msgIdx, setMsgIdx] = useState(0);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        (err) => console.debug("Loc-Refused", err)
      );
    }
  }, []);

  useEffect(() => {
    let interval: any;
    if (isTranslating) {
      setMsgIdx(0);
      interval = setInterval(() => {
        setMsgIdx(prev => (prev + 1) % LOADING_MESSAGES.length);
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isTranslating]);

  useEffect(() => {
    const saved = localStorage.getItem('global_trans_crystal_v5');
    if (saved) setHistory(JSON.parse(saved));

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        handleTranslate(transcript);
      };
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const showStatus = (text: string, type: 'info' | 'success' | 'error') => {
    setStatus({ text, type });
    setTimeout(() => setStatus(null), 3000);
  };

  const handleTranslate = useCallback(async (textToTranslate?: string) => {
    const text = textToTranslate || inputText;
    // Removed isTranslating check to allow retries if stuck
    if (!text.trim()) return;

    setIsTranslating(true);
    setTranslationResult(null);
    try {
      const result = await translateText(text, fromLang, toLang, location || undefined);
      setTranslationResult(result);
      
      if (result && !result.includes("Error") && !result.includes("failed")) {
          const newItem: HistoryItem = {
            id: Date.now().toString(),
            original: text,
            translated: result,
            fromLang: fromLang.code,
            toLang: toLang.code,
            timestamp: Date.now(),
          };
          setHistory(prev => {
            const updated = [newItem, ...prev].slice(0, 20);
            localStorage.setItem('global_trans_crystal_v5', JSON.stringify(updated));
            return updated;
          });
      }
    } catch (e: any) {
      showStatus("Connection error", "error");
      setTranslationResult("Error: Could not translate.");
    } finally {
      setIsTranslating(false);
    }
  }, [inputText, fromLang, toLang, location]);

  const toggleListen = () => {
    if (isListening) recognitionRef.current?.stop();
    else if (recognitionRef.current) {
      recognitionRef.current.lang = fromLang.sttCode;
      recognitionRef.current.start();
    } else {
        showStatus("Voice input not available", "info");
    }
  };

  const handleSpeak = () => {
    if (!translationResult || isSpeaking) return;
    setIsSpeaking(true);
    speakText(translationResult, toLang, () => {
        setIsSpeaking(false);
    });
  };

  return (
    <div className="app-container">
      <Header />

      <div className="px-6 py-2 shrink-0">
        <ModeSelector currentMode={currentMode} onModeChange={setCurrentMode} />
      </div>

      <main className="content-area px-6 flex-1 py-4 w-full overflow-x-hidden">
        {currentMode === 'text-only' && (
            <div className="flex flex-col space-y-6 animate-reveal">
                {/* Compact Language Bridge */}
                <div className="flex items-center space-x-2">
                    <LanguageSelector label="From" selectedLanguage={fromLang} onSelect={setFromLang} />
                    <button 
                      onClick={() => { setFromLang(toLang); setToLang(fromLang); }} 
                      className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-sky-500 shadow-sm active:scale-90"
                    >
                        <i className="fas fa-right-left text-[12px]"></i>
                    </button>
                    <LanguageSelector label="To" selectedLanguage={toLang} onSelect={setToLang} />
                </div>
                
                {/* Input Area */}
                <div className="crystal-card p-5 bg-white border border-slate-100">
                    <textarea 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="w-full h-24 bg-transparent text-slate-800 text-base font-bold placeholder-slate-200 outline-none resize-none leading-relaxed"
                        placeholder="Type phrase..."
                    />
                    <div className="flex justify-end pt-1">
                        {inputText && (
                            <button onClick={() => setInputText('')} className="text-slate-300 p-2">
                                <i className="fas fa-times-circle text-sm"></i>
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile-Friendly Actions */}
                <div className="flex space-x-3">
                    <button onClick={toggleListen} className={`flex-1 py-4 rounded-2xl font-black uppercase text-[9px] tracking-[0.2em] shadow-sm btn-squishy ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-white text-slate-600 border border-slate-100'}`}>
                        <i className={`fas ${isListening ? 'fa-stop' : 'fa-microphone'} mr-2`}></i> {isListening ? 'Stop' : 'Voice'}
                    </button>
                    <button onClick={() => handleTranslate()} className="flex-[1.4] py-4 bg-sky-600 text-white rounded-2xl font-black uppercase text-[9px] tracking-[0.2em] shadow-lg shadow-sky-100 btn-squishy hover:bg-sky-700">
                        Process
                    </button>
                </div>

                {/* Mobile Result Display */}
                <div className={`p-6 rounded-[2rem] min-h-[140px] relative transition-all duration-500 ${translationResult ? 'crystal-card' : 'glass-panel border-dashed border-2 border-slate-100 flex items-center justify-center'}`}>
                    {isTranslating ? (
                        <div className="flex flex-col items-center space-y-3">
                            <div className="w-8 h-8 border-3 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="font-bold uppercase text-[8px] tracking-widest text-sky-500 animate-pulse">{LOADING_MESSAGES[msgIdx]}</p>
                        </div>
                    ) : translationResult ? (
                        <div className="w-full animate-reveal">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[9px] uppercase font-black text-slate-300 tracking-[0.2em]">Translation</span>
                                <button 
                                  onClick={handleSpeak} 
                                  className={`w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center transition-all ${isSpeaking ? 'animate-pulse bg-sky-100' : ''}`}
                                >
                                    <i className={`fas ${isSpeaking ? 'fa-volume-high' : 'fa-volume-low'} text-base`}></i>
                                </button>
                            </div>
                            <p className="text-xl font-black text-slate-800 leading-snug">{translationResult}</p>
                        </div>
                    ) : (
                        <div className="text-center opacity-10">
                            <p className="font-black uppercase tracking-widest text-lg">Ready to Translate</p>
                        </div>
                    )}
                </div>
            </div>
        )}

        {currentMode === 'camera' && (
          <CameraTranslator
            fromLang={fromLang}
            toLang={toLang}
            onTranslate={(text) => {
              setTranslationResult(text);
              const newItem: HistoryItem = {
                id: Date.now().toString(),
                original: "[Image Scan]",
                translated: text,
                fromLang: fromLang.code,
                toLang: toLang.code,
                timestamp: Date.now(),
              };
              setHistory(prev => {
                const updated = [newItem, ...prev].slice(0, 20);
                localStorage.setItem('global_trans_crystal_v5', JSON.stringify(updated));
                return updated;
              });
              setCurrentMode('text-only');
            }}
            isTranslating={isTranslating}
            setIsTranslating={setIsTranslating}
            onError={(msg) => showStatus(msg, 'error')}
          />
        )}

        {currentMode === 'phrasebook' && (
          <Phrasebook 
            onSelectPhrase={(phrase) => {
              setInputText(phrase);
              setCurrentMode('text-only');
            }} 
          />
        )}

        {currentMode === 'conversational' && (
           <div className="space-y-4 pb-20 animate-reveal">
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-300 pl-2 mb-4">Translation Log</h3>
              {history.length === 0 ? (
                  <div className="text-center py-20 opacity-20">
                      <i className="fas fa-history text-4xl mb-4"></i>
                      <p className="font-black uppercase tracking-widest">No History</p>
                  </div>
              ) : (
                  history.map(item => (
                      <div key={item.id} className="p-5 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                              <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">{new Date(item.timestamp).toLocaleTimeString()}</span>
                              <div className="flex space-x-1">
                                  <span className="text-[8px] font-black uppercase bg-slate-100 text-slate-400 px-2 py-1 rounded-lg">{item.fromLang}</span>
                                  <i className="fas fa-arrow-right text-[8px] text-slate-200 self-center"></i>
                                  <span className="text-[8px] font-black uppercase bg-sky-50 text-sky-400 px-2 py-1 rounded-lg">{item.toLang}</span>
                              </div>
                          </div>
                          <p className="text-slate-500 font-bold text-sm mb-1">{item.original}</p>
                          <p className="text-slate-800 font-black text-lg">{item.translated}</p>
                      </div>
                  ))
              )}
           </div>
        )}
      </main>

      <div className="fixed bottom-6 left-6 right-6 z-50 pointer-events-none">
        <StatusArea message={status} />
      </div>
    </div>
  );
};

export default App;