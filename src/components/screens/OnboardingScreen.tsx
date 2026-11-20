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
    <div className="flex-1 min-h-0 w-full max-w-full flex flex-col justify-between p-5 sm:p-7 bg-white text-slate-900 relative select-none overflow-y-auto overflow-x-hidden">
      {/* Top Header with Brand & Language picker & Skip */}
      <div className="flex items-center justify-between z-20 w-full shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-black text-base text-white shadow-md shadow-cyan-500/20">
            CK
          </div>
          <span className="font-black text-xl sm:text-2xl tracking-tight text-slate-900">
            Ciber<span className="text-cyan-600">Kids</span>
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <LanguageSelector variant="dropdown" />

          {currentSlide < slides.length - 1 ? (
            <button
              onClick={onFinish}
              className="text-sm sm:text-base font-black text-slate-400 hover:text-slate-700 transition px-3 py-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              {t('onboarding.skip')}
            </button>
          ) : null}
        </div>
      </div>

      {/* Mascot & Visual Core in white card */}
      <div className="my-auto flex flex-col items-center justify-center text-center py-4 z-10 w-full max-w-md mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -12 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex flex-col items-center w-full"
          >
            {/* Mascot Pedestal with soft shadow */}
            <div className="relative mb-6">
              <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-3xl bg-gradient-to-b from-sky-50 via-cyan-50/50 to-white border-2 border-slate-100 flex items-center justify-center shadow-lg shadow-cyan-500/10 relative overflow-hidden">
                <CiberMascot
                  size="xl"
                  expression={current.expression}
                  showSpeech={false}
                />
              </div>
            </div>

            {/* Badge */}
            <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full border text-sm sm:text-base font-black mb-3 shadow-xs ${current.badgeColor}`}>
              <current.badgeIcon className="w-5 h-5" />
              <span>{current.subtitle}</span>
            </div>

            {/* Slide Title */}
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-2.5 leading-tight">
              {current.title}
            </h1>

            {/* Slide Description */}
            <p className="text-slate-600 text-sm sm:text-base font-medium max-w-sm leading-relaxed">
              {current.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Controls */}
      <div className="flex flex-col gap-4.5 z-20 pb-2 w-full max-w-md mx-auto shrink-0">
        {/* Step Indicator dots */}
        <div className="flex items-center justify-center gap-2.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentSlide
                  ? 'w-10 bg-cyan-500 shadow-xs'
                  : 'w-2.5 bg-slate-200 hover:bg-slate-300'
              }`}
            />
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={handleNext}
          className="w-full py-4.5 sm:py-5 rounded-2xl font-black text-base sm:text-lg tracking-wide bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-xl shadow-cyan-500/30 transition-all flex items-center justify-center gap-2.5 group cursor-pointer active:scale-[0.98]"
        >
          <span>
            {currentSlide === slides.length - 1
              ? t('onboarding.startAdventure')
              : t('onboarding.continue')}
          </span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
