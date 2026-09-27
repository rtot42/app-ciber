import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { Language } from '../types';

interface LanguageSelectorProps {
  variant?: 'pills' | 'dropdown' | 'cards' | 'minimal';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'pills',
  className = '',
}) => {
  const { language, setLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentMeta = languages.find((l) => l.id === language) || languages[0];

  if (variant === 'cards') {
    return (
      <div className={`grid grid-cols-3 gap-2.5 ${className}`}>
        {languages.map((l) => {
          const isSelected = l.id === language;
          return (
            <button
              key={l.id}
              type="button"
              onClick={() => setLanguage(l.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition cursor-pointer relative ${
                isSelected
                  ? 'bg-cyan-50 border-cyan-400 text-cyan-900 ring-2 ring-cyan-400/20 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-cyan-500 text-white flex items-center justify-center text-[9px]">
                  <Check className="w-2.5 h-2.5" />
                </div>
              )}
              <span className="text-2xl mb-1">{l.flag}</span>
              <span className="text-xs font-black tracking-tight">{l.label}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">{l.short}</span>
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer"
        >
          <span className="text-sm leading-none">{currentMeta.flag}</span>
          <span className="text-[11px] uppercase tracking-wider">{currentMeta.short}</span>
          <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -4 }}
                className="absolute right-0 top-full mt-1.5 w-36 bg-white rounded-2xl shadow-xl border border-slate-100 p-1.5 z-50 overflow-hidden"
              >
                {languages.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => {
                      setLanguage(l.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      l.id === language
                        ? 'bg-cyan-50 text-cyan-800'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base leading-none">{l.flag}</span>
                      <span>{l.label}</span>
                    </div>
                    {l.id === language && <Check className="w-3.5 h-3.5 text-cyan-600" />}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={`inline-flex items-center bg-slate-100/90 p-0.5 rounded-full border border-slate-200/80 ${className}`}>
        {languages.map((l) => {
          const isSelected = l.id === language;
          return (
            <button
              key={l.id}
              type="button"
              onClick={() => setLanguage(l.id)}
              className={`px-2 py-0.5 rounded-full text-[10px] font-black transition flex items-center gap-1 cursor-pointer ${
                isSelected
                  ? 'bg-white text-cyan-700 shadow-xs ring-1 ring-black/5'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>{l.flag}</span>
              <span>{l.short}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Default 'pills' segmented control
  return (
    <div className={`inline-flex items-center bg-white/90 p-1 rounded-2xl border border-slate-200 shadow-xs ${className}`}>
      {languages.map((l) => {
        const isSelected = l.id === language;
        return (
          <button
            key={l.id}
            type="button"
            onClick={() => setLanguage(l.id)}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              isSelected
                ? 'bg-cyan-500 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <span className="text-sm leading-none">{l.flag}</span>
            <span className="text-[11px] font-extrabold">{l.short}</span>
          </button>
        );
      })}
    </div>
  );
};
