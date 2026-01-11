import React, { useState, useEffect } from 'react';

const Header: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className="w-full relative flex flex-col items-center justify-center py-6 px-6 shrink-0">
      {/* Centered S Signature Logo */}
      <div className="relative group mb-2">
        <div className="absolute inset-0 bg-gold/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
        <div className="w-14 h-14 bg-white/90 backdrop-blur-md border border-slate-100 shadow-xl rounded-2xl flex items-center justify-center relative z-10 overflow-hidden">
          <span className="text-4xl shining-s select-none">S</span>
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/30 to-transparent"></div>
        </div>
      </div>

      {/* Centered Title Section */}
      <div className="flex flex-col items-center">
        <h1 className="text-xl font-black tracking-tight text-slate-800 uppercase text-center">
          Global <span className="text-sky-600 italic font-extrabold">Translator</span>
        </h1>
        <div className="flex items-center space-x-2 mt-1 opacity-70">
          <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-rose-500'} shadow-sm`}></div>
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
            {isOnline ? 'System Link Active' : 'Offline Protocol'}
          </span>
        </div>
      </div>

      {/* Subtle Divider */}
      <div className="w-1/3 h-[1px] bg-gradient-to-r from-transparent via-slate-200/50 to-transparent mt-4"></div>
    </header>
  );
};

export default Header;