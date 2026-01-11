import React from 'react';
import { StatusMessage } from '../types';

interface StatusAreaProps { message: StatusMessage | null; }

const StatusArea: React.FC<StatusAreaProps> = ({ message }) => {
  if (!message) return null;

  const colorClasses = {
    info: 'bg-blue-50 text-blue-700 border border-blue-100',
    success: 'bg-green-50 text-green-700 border border-green-100',
    error: 'bg-red-50 text-red-700 border border-red-100',
  };

  return (
    <div className={`p-4 rounded-3xl text-[11px] font-black uppercase tracking-widest text-center shadow-lg animate-in slide-in-from-bottom-5 duration-300 ${colorClasses[message.type]}`}>
      {message.text}
    </div>
  );
};

export default StatusArea;