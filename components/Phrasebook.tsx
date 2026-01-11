import React, { useState } from 'react';
import { PHRASEBOOK_DATA } from '../constants';

interface PhrasebookProps { onSelectPhrase: (phrase: string) => void; }

const Phrasebook: React.FC<PhrasebookProps> = ({ onSelectPhrase }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const startDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
    }, 2500);
  };

  return (
    <div className="space-y-10 h-full">
      <div className="flex items-center justify-between mb-8 px-1">
         <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                <i className="fas fa-vault text-blue-500 text-sm"></i>
            </div>
            <div className="flex flex-col">
                <h2 className="text-[12px] font-black uppercase tracking-widest text-blue-950">Travel Vault</h2>
                <span className="text-[8px] font-bold text-blue-400 uppercase tracking-tighter">Stored locally</span>
            </div>
         </div>
         <button 
            onClick={startDownload}
            disabled={downloading || downloaded}
            className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all duration-500 shadow-sm ${
                downloaded ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 
                downloading ? 'bg-gray-50 border-gray-200 text-gray-400' : 
                'bg-white border-blue-500 text-blue-600 hover:bg-blue-600 hover:text-white btn-squishy'
            }`}
         >
            {downloading ? <i className="fas fa-sync fa-spin mr-2"></i> : null}
            {downloading ? 'Syncing...' : downloaded ? 'Vault Ready' : 'Download Pack'}
         </button>
      </div>

      <div className="p-6 glass-panel bg-white/40 border-l-4 border-l-blue-400 mb-10 shadow-inner">
          <p className="text-[12px] font-bold text-blue-900/50 leading-relaxed italic">
              "Your offline sanctuary. These verified translations remain accessible even in the heart of the wilderness."
          </p>
      </div>

      <div className="space-y-12 pb-24">
        {PHRASEBOOK_DATA.map((category) => (
          <div key={category.category} className="animate-reveal">
            <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-blue-400 mb-6 border-b border-blue-50 pb-3 pl-1">
              {category.category}
            </h4>
            <div className="space-y-4">
              {category.phrases.map((phrase, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectPhrase(phrase.en)}
                  className="w-full text-left p-6 bg-white border border-blue-50 rounded-[2.5rem] hover:border-blue-200 active:bg-blue-50 transition-all duration-300 flex items-center group shadow-sm hover:shadow-xl"
                >
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mr-6 group-hover:bg-blue-600 transition-colors">
                      <i className="fas fa-bookmark text-blue-300 group-hover:text-white"></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-black uppercase tracking-widest text-blue-900/30 mb-1">{phrase.en}</p>
                    <p className="text-xl font-black text-[#03045E] group-hover:text-blue-600 transition-colors leading-tight">{phrase.sw}</p>
                  </div>
                  <i className="fas fa-chevron-right text-blue-100 group-hover:translate-x-1 group-hover:text-blue-300 transition-all"></i>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Phrasebook;