import React from 'react';
import { AppMode } from '../types';

interface ModeSelectorProps { currentMode: AppMode; onModeChange: (mode: AppMode) => void; }

const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onModeChange }) => {
  const modes: { id: AppMode; label: string; icon: string }[] = [
    { id: 'text-only', label: 'Write', icon: 'fa-pen-nib' },
    { id: 'camera', label: 'Vision', icon: 'fa-camera' },
    { id: 'conversational', label: 'Logs', icon: 'fa-receipt' },
    { id: 'phrasebook', label: 'Pack', icon: 'fa-briefcase' },
  ];

  return (
    <div className="flex justify-center w-full px-2">
      <div className="bg-slate-100/60 backdrop-blur-xl inline-flex rounded-[2rem] p-1 border border-white/50 shadow-sm w-full max-w-sm relative">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`flex-1 py-3 px-1 rounded-[1.6rem] transition-all duration-300 flex flex-col items-center justify-center space-y-1 relative z-10 ${
              currentMode === mode.id
                ? 'text-white font-black'
                : 'text-slate-400 hover:text-slate-500 font-bold'
            }`}
          >
            {/* Active Indicator Background */}
            {currentMode === mode.id && (
                <div className="absolute inset-0 bg-slate-800 rounded-[1.6rem] shadow-md z-[-1] animate-in zoom-in-95 duration-200"></div>
            )}
            
            <i className={`fas ${mode.icon} text-[12px] ${currentMode === mode.id ? 'opacity-100' : 'opacity-40'}`}></i>
            <span className="uppercase text-[8px] font-black tracking-[0.1em]">{mode.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ModeSelector;