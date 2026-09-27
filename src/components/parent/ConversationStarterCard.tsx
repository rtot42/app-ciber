import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, RefreshCw, Sparkles, Clock, Compass, ShieldQuestion } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { CONVERSATION_TOPICS } from '../../data/parentGuidesData';

export const ConversationStarterCard: React.FC = () => {
  const { language } = useLanguage();
  const topics = CONVERSATION_TOPICS[language] || CONVERSATION_TOPICS.es;
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentTopic = topics[currentIndex] || topics[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % topics.length);
  };

  return (
    <div className="p-4 rounded-3xl bg-linear-to-br from-sky-50/90 via-cyan-50/60 to-white border border-sky-100 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-black text-sky-900">
          <div className="w-7 h-7 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-2xs">
            <MessageCircle className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-xs font-black">
              {language === 'fr'
                ? 'Sujet de Discussion en Famille'
                : language === 'en'
                ? 'Family Conversation Prompt'
                : 'Tema para Conversar en Familia'}
            </span>
            <span className="text-[10px] text-sky-700 font-medium">
              {language === 'fr'
                ? `Thème ${currentIndex + 1} sur ${topics.length} • ${currentTopic.category}`
                : language === 'en'
                ? `Topic ${currentIndex + 1} of ${topics.length} • ${currentTopic.category}`
                : `Tema ${currentIndex + 1} de ${topics.length} • ${currentTopic.category}`}
            </span>
          </div>
        </div>

        <button
          onClick={handleNext}
          className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white hover:bg-sky-100 text-sky-700 border border-sky-200/80 text-[11px] font-bold transition shadow-2xs cursor-pointer"
          title="Siguiente tema"
        >
          <RefreshCw className="w-3 h-3" />
          <span>
            {language === 'fr' ? 'Autre' : language === 'en' ? 'Next' : 'Rotar'}
          </span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentTopic.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="space-y-2.5"
        >
          <div className="p-3.5 rounded-2xl bg-white border border-sky-200/70 shadow-2xs space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-sky-600 block">
              {language === 'fr' ? 'La question à poser :' : language === 'en' ? 'Suggested question to ask:' : 'Pregunta sugerida para iniciar la charla:'}
            </span>
            <blockquote className="text-xs text-slate-800 font-bold italic leading-relaxed">
              "{currentTopic.quote}"
            </blockquote>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="p-2.5 rounded-xl bg-white/70 border border-sky-100 space-y-0.5">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <Clock className="w-3 h-3 text-sky-600" />
                {language === 'fr' ? 'Moment propice :' : language === 'en' ? 'Ideal setting:' : 'Momento ideal:'}
              </span>
              <p className="text-slate-500 leading-snug">{currentTopic.idealMoment}</p>
            </div>

            <div className="p-2.5 rounded-xl bg-white/70 border border-sky-100 space-y-0.5">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <ShieldQuestion className="w-3 h-3 text-sky-600" />
                {language === 'fr' ? 'Ce qu\'on cherche :' : language === 'en' ? 'What to foster:' : 'Qué queremos lograr:'}
              </span>
              <p className="text-slate-500 leading-snug">{currentTopic.whatToLookFor}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
