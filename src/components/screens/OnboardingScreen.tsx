import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles, Compass, Shield } from 'lucide-react';
import { CiberMascot } from '../CiberMascot';
import { MascotExpression } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { LanguageSelector } from '../LanguageSelector';

interface OnboardingScreenProps {
  onFinish: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onFinish }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useLanguage();

  const slides: {
    title: string;
    subtitle: string;
    description: string;
    expression: MascotExpression;
    badgeIcon: any;
    badgeColor: string;
  }[] = [
    {
      title: t('onboarding.slide1.title'),
      subtitle: t('onboarding.slide1.subtitle'),
      description: t('onboarding.slide1.desc'),
      expression: 'happy',
      badgeIcon: Sparkles,
      badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    },
    {
      title: t('onboarding.slide2.title'),
      subtitle: t('onboarding.slide2.subtitle'),
      description: t('onboarding.slide2.desc'),
      expression: 'excited',
      badgeIcon: Compass,
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      title: t('onboarding.slide3.title'),
      subtitle: t('onboarding.slide3.subtitle'),
      description: t('onboarding.slide3.desc'),
      expression: 'celebrating',
      badgeIcon: Shield,
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onFinish();
    }
  };

  const current = slides[currentSlide];

  return (
    <div
      className="flex-1 min-h-0 w-full max-w-full flex flex-col justify-between px-4 sm:px-6 pt-3 bg-white text-slate-900 relative select-none overflow-y-auto overflow-x-hidden"
      style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom, 0px))' }}
    >
      {/* Top Header with Brand & Language picker & Skip */}
      <div className="flex items-center justify-between gap-2 z-20 w-full shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-sm text-white shadow-sm shadow-cyan-500/20 shrink-0">
            CK
          </div>
          <span className="font-bold text-lg sm:text-xl tracking-tight text-slate-900 truncate">
            Ciber<span className="text-cyan-600">Kids</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <LanguageSelector variant="dropdown" />

          {currentSlide < slides.length - 1 ? (
            <button
              onClick={onFinish}
              className="min-h-[40px] text-sm font-bold text-slate-500 hover:text-slate-800 transition px-2.5 py-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              {t('onboarding.skip')}
            </button>
          ) : null}
        </div>
      </div>

      {/* Mascot & Visual Core */}
      <div className="my-auto flex flex-col items-center justify-center text-center py-3 z-10 w-full max-w-md mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex flex-col items-center w-full"
          >
            {/* Mascot Pedestal */}
            <div className="relative mb-3 sm:mb-4">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-b from-sky-50 via-cyan-50/50 to-white border-2 border-slate-100 flex items-center justify-center shadow-md shadow-cyan-500/10 relative overflow-hidden">
                <CiberMascot
                  size="md"
                  expression={current.expression}
                  showSpeech={false}
                />
              </div>
            </div>

            {/* Badge */}
            <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-xs sm:text-sm font-bold mb-2.5 shadow-2xs ${current.badgeColor}`}>
              <current.badgeIcon className="w-4 h-4 shrink-0" />
              <span>{current.subtitle}</span>
            </div>

            {/* Slide Title */}
            <h1 className="text-[clamp(1.375rem,5vw,1.875rem)] font-bold tracking-tight text-slate-900 mb-2 leading-tight px-1">
              {current.title}
            </h1>

            {/* Slide Description */}
            <p className="text-slate-600 text-sm sm:text-base font-medium max-w-sm leading-relaxed px-2">
              {current.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Controls */}
      <div className="flex flex-col gap-3.5 z-20 pt-2 w-full max-w-md mx-auto shrink-0">
        {/* Step Indicator dots */}
        <div className="flex items-center justify-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentSlide
                  ? 'w-9 bg-cyan-500 shadow-xs'
                  : 'w-2.5 bg-slate-200 hover:bg-slate-300'
              }`}
            />
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={handleNext}
          className="w-full min-h-[50px] py-3.5 px-5 rounded-2xl font-bold text-base tracking-wide bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 group cursor-pointer active:scale-[0.98]"
        >
          <span>
            {currentSlide === slides.length - 1
              ? t('onboarding.startAdventure')
              : t('onboarding.continue')}
          </span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform stroke-[2.4]" />
        </button>
      </div>
    </div>
  );
};
