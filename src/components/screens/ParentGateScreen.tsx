import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, ArrowLeft, KeyRound, Lock, Check, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface ParentGateScreenProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const ParentGateScreen: React.FC<ParentGateScreenProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { t } = useLanguage();
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // The gate question in words: 6 x 4 = 24
  const targetAnswer = '24';

  const handleKeyPress = (digit: string) => {
    if (pin.length < 2) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setErrorMsg('');
      if (nextPin === targetAnswer) {
        setTimeout(() => {
          onSuccess();
        }, 300);
      } else if (nextPin.length === 2) {
        setErrorMsg(t('parentGate.error'));
        setTimeout(() => setPin(''), 1000);
      }
    }
  };

  const handleClear = () => {
    setPin('');
    setErrorMsg('');
  };

  return (
    <div className="flex-1 min-h-0 w-full max-w-full flex flex-col justify-between p-4 sm:p-6 bg-slate-50 text-slate-800 select-none overflow-y-auto overflow-x-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between shrink-0">
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition cursor-pointer text-xs sm:text-sm font-bold shadow-xs active:scale-95"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
          <span>{t('parentGate.back')}</span>
        </button>

        <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-800">
          {t('parentGate.tag')}
        </span>
      </div>

      {/* Main Verification Card */}
      <div className="my-auto flex flex-col items-center text-center space-y-4 max-w-sm mx-auto w-full py-4">
        <div className="w-18 h-18 rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-sm">
          <Lock className="w-9 h-9" />
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {t('parentGate.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
            {t('parentGate.subtitle')}
          </p>
        </div>

        {/* Math Challenge in Words */}
        <div className="w-full p-4 sm:p-5 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-2">
          <span className="text-xs sm:text-sm text-slate-400 font-semibold block">
            {t('parentGate.questionLabel')}
          </span>
          <div className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            {t('parentGate.question')}
          </div>
          <div className="text-xs text-slate-400 font-mono">
            {t('parentGate.hint')}
          </div>

          {/* Answer Display */}
          <div className="mt-3 flex items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-2xl font-mono font-bold text-slate-900 shadow-inner">
              {pin[0] || '—'}
            </div>
            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-2xl font-mono font-bold text-slate-900 shadow-inner">
              {pin[1] || '—'}
            </div>
          </div>

          {errorMsg && (
            <p className="text-xs font-bold text-rose-500 mt-2 flex items-center justify-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              {errorMsg}
            </p>
          )}
        </div>

        {/* Quick 0-9 Keypad */}
        <div className="grid grid-cols-3 gap-2.5 w-full pt-1">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '✓'].map((key) => {
            const isClear = key === 'C';
            const isSubmit = key === '✓';

            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  if (isClear) handleClear();
                  else if (isSubmit) {
                    if (pin === targetAnswer) onSuccess();
                    else setErrorMsg(t('parentGate.error'));
                  } else {
                    handleKeyPress(key);
                  }
                }}
                className={`py-3.5 sm:py-4 rounded-2xl font-bold text-base transition cursor-pointer active:scale-95 border ${
                  isSubmit
                    ? 'bg-amber-500 text-white font-black border-amber-500 shadow-sm'
                    : isClear
                    ? 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-xs'
                }`}
              >
                {key}
              </button>
            );
          })}
        </div>

        {/* Quick Demo Bypass */}
        <button
          onClick={onSuccess}
          className="text-[11px] text-cyan-600 hover:text-cyan-700 transition underline underline-offset-4 cursor-pointer pt-1 font-semibold"
        >
          {t('parentGate.demoBypass')}
        </button>
      </div>

      <div className="text-center text-[11px] text-slate-400 pb-2">
        {t('parentGate.safeGuarantee')}
      </div>
    </div>
  );
};
