import React, { useState } from 'react';
import { Language } from '../types';
import { ALL_LANGUAGES } from '../constants';

interface LanguageSelectorProps {
  label: string;
  selectedLanguage: Language & { flag: string };
  onSelect: (lang: any) => void;
  themeColor?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ label, selectedLanguage, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredLanguages = ALL_LANGUAGES.filter((lang) =>
    lang.name.toLowerCase().includes(search.toLowerCase()) || 
    lang.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1">
      <label className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-900/30 mb-2 block pl-1">{label}</label>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-white border border-blue-50 p-4 flex items-center justify-between rounded-3xl btn-squishy shadow-sm hover:bg-blue-50/50 transition-all duration-300 hover:shadow-md"
      >
        <div className="flex items-center space-x-3 overflow-hidden">
            <span className="text-2xl drop-shadow-sm">{selectedLanguage.flag}</span>
            <span className="text-sm font-black text-blue-950 truncate uppercase tracking-tight">{selectedLanguage.name}</span>
        </div>
        <i className="fas fa-angle-down text-xs text-blue-200"></i>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[5000] bg-white flex flex-col p-8 animate-fade">
          {/* Decorative background for the full-screen modal */}
          <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
              <i className="fas fa-map-marked-alt text-[200px]"></i>
          </div>

          <div className="flex justify-between items-center mb-10 relative z-10">
             <div>
                <h2 className="text-3xl font-black uppercase text-blue-600 tracking-tighter">Dialect Hub</h2>
                <p className="text-[11px] font-black uppercase tracking-[0.5em] text-blue-900/30">Global Intelligence Select</p>
             </div>
             <button onClick={() => setIsOpen(false)} className="w-14 h-14 flex items-center justify-center bg-blue-50 rounded-[1.5rem] text-blue-900 text-2xl shadow-sm hover:bg-red-50 hover:text-red-500 transition-colors">&times;</button>
          </div>
          
          <div className="relative mb-10 z-10">
              <i className="fas fa-search absolute left-6 top-1/2 -translate-y-1/2 text-blue-300"></i>
              <input 
                type="text" 
                placeholder="Find a world language..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-50 border-2 border-gray-100 p-6 pl-16 rounded-[2rem] text-blue-900 outline-none focus:border-blue-500 focus:bg-white transition-all font-bold placeholder-blue-900/20 shadow-inner"
              />
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pb-12 relative z-10">
            {filteredLanguages.map(lang => (
              <button 
                key={lang.code}
                onClick={() => { onSelect(lang); setIsOpen(false); }}
                className={`w-full text-left p-6 rounded-[2.5rem] flex items-center justify-between transition-all group border ${lang.code === selectedLanguage.code ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl border-blue-600' : 'bg-white border-gray-100 text-blue-950 hover:border-blue-200 hover:shadow-md'}`}
              >
                <div className="flex items-center space-x-6">
                    <span className="text-4xl group-hover:scale-110 transition-transform duration-500">{lang.flag}</span>
                    <div className="flex flex-col">
                        <span className="font-black text-xl tracking-tight">{lang.name}</span>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${lang.code === selectedLanguage.code ? 'text-white/40' : 'text-blue-900/20'}`}>{lang.sttCode}</span>
                    </div>
                </div>
                {lang.code === selectedLanguage.code && <i className="fas fa-check-double text-white text-xl animate-reveal"></i>}
              </button>
            ))}
            {filteredLanguages.length === 0 && (
                <div className="text-center py-20 opacity-20">
                    <i className="fas fa-search-minus text-5xl mb-4"></i>
                    <p className="font-black uppercase tracking-widest">No matching dialect</p>
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;