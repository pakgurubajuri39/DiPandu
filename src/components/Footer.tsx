import React from 'react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { settings } = useApp();

  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">DiPandu</span>
            <span aria-hidden="true">·</span>
            <span>Digital Pendampingan & Edukasi Supervisi Guru SMA</span>
            <span aria-hidden="true">·</span>
            <span>{settings.institutionName}</span>
          </div>
          
          {/* Mandatory Footer Text */}
          <div className="text-slate-500 font-medium tracking-wide">
            {settings.copyright || '@copyright by. Pak GuruAI'}
          </div>
        </div>
      </div>
    </footer>
  );
};
