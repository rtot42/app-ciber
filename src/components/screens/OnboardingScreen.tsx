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
    <div className="flex-1 flex flex-col justify-between p-6 bg-white text-slate-900 relative select-none">
      {/* Top Header with Brand & Language picker & Skip */}
      <div className="flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-black text-xs text-white shadow-sm">
            CK
          </div>
          <span className="font-extrabold text-base tracking-tight text-slate-900">
            Ciber<span className="text-cyan-600">Kids</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSelector variant="dropdown" />

          {currentSlide < slides.length - 1 ? (
            <button
              onClick={onFinish}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 transition px-2 py-1 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              {t('onboarding.skip')}
            </button>
          ) : null}
        </div>
      </div>

      {/* Mascot & Visual Core in white card */}
      <div className="my-auto flex flex-col items-center justify-center text-center py-4 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -12 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            {/* Mascot Pedestal with soft shadow */}
            <div className="relative mb-6">
              <div className="w-48 h-48 rounded-3xl bg-gradient-to-b from-sky-50 via-cyan-50/50 to-white border border-slate-100 flex items-center justify-center shadow-md relative">
                <CiberMascot
                  size="xl"
                  expression={current.expression}
                  showSpeech={false}
                />
              </div>
            </div>

            {/* Badge */}
            <div className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border text-xs font-bold mb-3 ${current.badgeColor}`}>
              <current.badgeIcon className="w-3.5 h-3.5" />
              <span>{current.subtitle}</span>
            </div>

            {/* Slide Title */}
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mb-2">
              {current.title}
            </h1>

            {/* Slide Description */}
            <p className="text-slate-500 text-sm max-w-[280px] leading-relaxed">
              {current.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Controls */}
      <div className="flex flex-col gap-4 z-20 pb-2">
        {/* Step Indicator dots */}
        <div className="flex items-center justify-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentSlide
                  ? 'w-8 bg-cyan-500'
                  : 'w-2 bg-slate-200 hover:bg-slate-300'
              }`}
            />
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-2xl font-black text-sm tracking-wide bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 group cursor-pointer active:scale-[0.98]"
        >
          <span>
            {currentSlide === slides.length - 1
              ? t('onboarding.startAdventure')
              : t('onboarding.continue')}
          </span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
