import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  Shield,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Footprints,
  KeyRound,
  Fish,
  Users,
  Wifi,
  Bot,
  Star,
  Check,
  Zap,
} from 'lucide-react';
import { CyberTipOfTheDay } from '../CyberTipOfTheDay';
import { CYBER_CONCEPTS_DATA, EducationConcept } from '../../data/cyberEducationData';
import { useLanguage } from '../../i18n/LanguageContext';
import { UserProfile } from '../../types';

interface EducationScreenProps {
  profile: UserProfile;
  onEarnXp?: (amount: number) => void;
}

export const EducationScreen: React.FC<EducationScreenProps> = ({
  profile,
  onEarnXp,
}) => {
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedConceptId, setExpandedConceptId] = useState<string | null>(
    CYBER_CONCEPTS_DATA[0].id
  );
  const [completedConceptIds, setCompletedConceptIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ciberkids_completed_lessons');
      return saved ? JSON.parse(saved) : ['concept-digital-footprint'];
    } catch {
      return ['concept-digital-footprint'];
    }
  });
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});

  const categories = [
    {
      id: 'all',
      label:
        language === 'fr'
          ? 'Tous les thèmes'
          : language === 'en'
          ? 'All Topics'
          : 'Todos los temas',
    },
    {
      id: 'privacidad',
      label:
        language === 'fr'
          ? 'Vie Privée'
          : language === 'en'
          ? 'Privacy'
          : 'Privacidad',
    },
    {
      id: 'contrasenas',
      label:
        language === 'fr'
          ? 'Mots de Passe'
          : language === 'en'
          ? 'Passwords'
          : 'Contraseñas',
    },
    {
      id: 'phishing',
      label:
        language === 'fr'
          ? 'Pièges & Faux Liens'
          : language === 'en'
          ? 'Phishing & Scams'
          : 'Engaños & Trampas',
    },
    {
      id: 'redes',
      label:
        language === 'fr'
          ? 'Amis & Jeux'
          : language === 'en'
          ? 'Friends & Games'
          : 'Amigos & Juegos',
    },
    {
      id: 'dispositivos',
      label:
        language === 'fr'
          ? 'Wi-Fi & Appareils'
          : language === 'en'
          ? 'Wi-Fi & Tech'
          : 'Wi-Fi & Equipos',
    },
    {
      id: 'ia',
      label:
        language === 'fr'
          ? 'IA & Deepfakes'
          : language === 'en'
          ? 'AI & Clones'
          : 'IA & Deepfakes',
    },
  ];

  const filteredConcepts =
    selectedCategory === 'all'
      ? CYBER_CONCEPTS_DATA
      : CYBER_CONCEPTS_DATA.filter((c) => c.category === selectedCategory);

  const handleSelectAnswer = (concept: EducationConcept, optionId: string) => {
    if (quizAnswers[concept.id]) return; // already answered

    setQuizAnswers((prev) => ({ ...prev, [concept.id]: optionId }));

    const chosenOption = concept.quickQuiz.options.find((o) => o.id === optionId);
    if (chosenOption && chosenOption.isCorrect) {
      if (!completedConceptIds.includes(concept.id)) {
        const updated = [...completedConceptIds, concept.id];
        setCompletedConceptIds(updated);
        try {
          localStorage.setItem(
            'ciberkids_completed_lessons',
            JSON.stringify(updated)
          );
        } catch {
          // safe fallback
        }
        if (onEarnXp) {
          onEarnXp(concept.xpReward);
        }
      }
    }
  };

  const getConceptIcon = (iconName: string) => {
    switch (iconName) {
      case 'Footprints':
        return <Footprints className="w-5 h-5 text-sky-500" />;
      case 'KeyRound':
        return <KeyRound className="w-5 h-5 text-purple-500" />;
      case 'FishSymbol':
        return <Fish className="w-5 h-5 text-amber-500" />;
      case 'Users':
        return <Users className="w-5 h-5 text-emerald-500" />;
      case 'Wifi':
        return <Wifi className="w-5 h-5 text-blue-500" />;
      case 'Bot':
        return <Bot className="w-5 h-5 text-indigo-500" />;
      default:
        return <Shield className="w-5 h-5 text-cyan-500" />;
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-50 text-slate-800 select-none overflow-y-auto scrollbar-none p-4 sm:p-5 space-y-4 pb-24">
      {/* Education Screen Header */}
      <div className="shrink-0 rounded-3xl p-4 sm:p-5 bg-gradient-to-br from-cyan-600 to-blue-700 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
        
        <div className="relative z-10 flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold text-white mb-2">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>
                {language === 'fr'
                  ? 'École de Cybersécurité'
                  : language === 'en'
                  ? 'Cybersecurity Academy'
                  : 'Escuela de Ciberseguridad'}
              </span>
            </div>

            <h1 className="text-lg sm:text-xl font-black tracking-tight text-white leading-tight">
              {language === 'fr'
                ? 'Apprends les Réflexes Futés'
                : language === 'en'
                ? 'Learn Smart Cyber Skills'
                : 'Aprende los Conceptos Clave'}
            </h1>
            <p className="text-xs text-cyan-100 mt-1 leading-relaxed max-w-xs">
              {language === 'fr'
                ? 'Comprends les secrets du web avec des exemples simples et amusants.'
                : language === 'en'
                ? 'Master simple internet safety concepts with fun, real-world rules.'
                : 'Conoce cómo funciona Internet de forma simple, sin enredos y con ejemplos reales.'}
            </p>
          </div>

          <div className="shrink-0 text-center bg-white/15 backdrop-blur-md rounded-2xl px-3 py-2 border border-white/20">
            <span className="block text-base font-black text-white">
              {completedConceptIds.length} / {CYBER_CONCEPTS_DATA.length}
            </span>
            <span className="text-[10px] text-cyan-100 font-bold uppercase tracking-wider">
              {language === 'fr' ? 'Complétés' : language === 'en' ? 'Learned' : 'Aprendidos'}
            </span>
          </div>
        </div>

        {/* Mini progress bar */}
        <div className="mt-3.5 pt-3 border-t border-white/15 flex items-center justify-between gap-3">
          <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${(completedConceptIds.length / CYBER_CONCEPTS_DATA.length) * 100}%`,
              }}
              className="h-full bg-amber-400 rounded-full"
            />
          </div>
          <span className="text-[11px] font-extrabold text-amber-300 flex items-center gap-1 shrink-0">
            <Sparkles className="w-3 h-3" />
            +{completedConceptIds.length * 15} XP
          </span>
        </div>
      </div>

      {/* Cyber Tip of the Day embedded seamlessly */}
      <div className="shrink-0">
        <div className="flex items-center gap-2 mb-2 px-1">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-700">
            {language === 'fr'
              ? 'Conseil Rapide du Jour'
              : language === 'en'
              ? 'Daily Cyber Tip'
              : 'Consejo Rápido del Día'}
          </h2>
        </div>
        <CyberTipOfTheDay />
      </div>

      {/* Topics / Categories Filter Pills */}
      <div className="shrink-0 space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-700">
            {language === 'fr'
              ? 'Leçons & Superpouvoirs'
              : language === 'en'
              ? 'Lessons & Superpowers'
              : 'Lecciones & Superpoderes'}
          </h2>
          <span className="text-[11px] font-bold text-slate-400">
            {filteredConcepts.length}{' '}
            {language === 'fr' ? 'guides' : language === 'en' ? 'guides' : 'guías'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none -mx-1 px-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-cyan-600 border-cyan-600 text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Educational Concepts Cards List */}
      <div className="shrink-0 space-y-3.5">
        {filteredConcepts.map((concept, index) => {
          const isExpanded = expandedConceptId === concept.id;
          const isCompleted = completedConceptIds.includes(concept.id);
          const userAnswer = quizAnswers[concept.id];

          return (
            <motion.div
              key={concept.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`rounded-3xl border transition-all overflow-hidden ${
                isCompleted
                  ? 'bg-white border-emerald-200/80 shadow-xs'
                  : 'bg-white border-slate-200/90 shadow-xs'
              }`}
            >
              {/* Card Header clickable to expand/collapse */}
              <div
                onClick={() =>
                  setExpandedConceptId(isExpanded ? null : concept.id)
                }
                className="p-4 sm:p-4.5 flex items-start justify-between gap-3 cursor-pointer hover:bg-slate-50/50 transition select-none"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs relative"
                    style={{
                      backgroundColor: `${concept.categoryColor}15`,
                      border: `1.5px solid ${concept.categoryColor}30`,
                    }}
                  >
                    {getConceptIcon(concept.icon)}
                    {isCompleted && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-2 ring-white text-[10px]">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${concept.categoryColor}15`,
                          color: concept.categoryColor,
                        }}
                      >
                        {concept.categoryLabel[language] ||
                          concept.categoryLabel.es}
                      </span>
                      {isCompleted && (
                        <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                          {language === 'fr'
                            ? 'Appris'
                            : language === 'en'
                            ? 'Mastered'
                            : 'Aprendido'}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-black text-slate-900 leading-snug">
                      {concept.title[language] || concept.title.es}
                    </h3>
                    <p className="text-xs text-slate-500 leading-normal line-clamp-1">
                      {concept.subtitle[language] || concept.subtitle.es}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 pt-1 text-slate-400">
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </div>

              {/* Kid-Friendly Metaphor Bubble (Always Visible for high memorability) */}
              <div className="px-4 pb-3.5 pt-0">
                <div className="rounded-2xl p-3 bg-amber-50/70 border border-amber-200/70 flex items-start gap-2.5 text-xs text-amber-950">
                  <span className="text-xl shrink-0 leading-none">
                    {concept.metaphor.emoji}
                  </span>
                  <div>
                    <span className="font-extrabold block text-amber-900 text-[11px] uppercase tracking-wide">
                      {language === 'fr'
                        ? 'La Métaphore Magique :'
                        : language === 'en'
                        ? 'The Memory Metaphor:'
                        : 'La Metáfora para Recordar:'}
                    </span>
                    <p className="font-medium text-slate-700 text-xs mt-0.5 leading-relaxed">
                      {concept.metaphor.analogy[language] ||
                        concept.metaphor.analogy.es}
                    </p>
                  </div>
                </div>
              </div>

              {/* Expanded Lesson Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="border-t border-slate-100 bg-slate-50/40 px-4 sm:px-5 py-4 space-y-4"
                  >
                    {/* Clear Concept Explanation */}
                    <div className="space-y-1">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-cyan-600" />
                        <span>
                          {language === 'fr'
                            ? 'Explication Simple'
                            : language === 'en'
                            ? 'Simple Explanation'
                            : '¿Qué significa esto de forma simple?'}
                        </span>
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white rounded-2xl p-3.5 border border-slate-200/80">
                        {concept.explanation[language] || concept.explanation.es}
                      </p>
                    </div>

                    {/* Golden Rule of the Guardian */}
                    <div className="rounded-2xl p-3.5 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/80 space-y-1">
                      <div className="flex items-center gap-1.5 text-amber-900 font-black text-xs">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span>
                          {language === 'fr'
                            ? 'Règle d’Or du Gardien'
                            : language === 'en'
                            ? 'The Guardian Golden Rule'
                            : 'Regla de Oro del Guardián'}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-800 leading-relaxed pl-5.5">
                        {concept.goldenRule[language] || concept.goldenRule.es}
                      </p>
                    </div>

                    {/* Real-World Scenario: What Happens & Smart Action */}
                    <div className="rounded-2xl bg-white border border-slate-200 p-3.5 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black uppercase tracking-wider text-cyan-700">
                          {concept.realWorldScenario.context[language] ||
                            concept.realWorldScenario.context.es}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          {language === 'fr'
                            ? 'Cas Réel'
                            : language === 'en'
                            ? 'Real Scenario'
                            : 'Caso de la Vida Real'}
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 space-y-1.5">
                        <p className="font-semibold text-slate-800">
                          👉{' '}
                          {concept.realWorldScenario.whatHappens[language] ||
                            concept.realWorldScenario.whatHappens.es}
                        </p>
                        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold text-xs">
                          🛡️{' '}
                          {concept.realWorldScenario.smartAction[language] ||
                            concept.realWorldScenario.smartAction.es}
                        </div>
                      </div>
                    </div>

                    {/* Mini Quick Quiz for Comprehension & XP */}
                    <div className="rounded-2xl bg-white border border-slate-200 p-3.5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-amber-500" />
                          <span className="text-xs font-black text-slate-900">
                            {language === 'fr'
                              ? 'Mini Quiz de Vérification'
                              : language === 'en'
                              ? 'Quick Check Quiz'
                              : 'Mini Reto de Comprobación'}
                          </span>
                        </div>
                        <span className="text-[10px] font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          +{concept.xpReward} XP
                        </span>
                      </div>

                      <p className="text-xs font-medium text-slate-700">
                        {concept.quickQuiz.question[language] ||
                          concept.quickQuiz.question.es}
                      </p>

                      <div className="space-y-2">
                        {concept.quickQuiz.options.map((option) => {
                          const isSelected = userAnswer === option.id;
                          const showResult = Boolean(userAnswer);

                          let buttonStyle =
                            'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';
                          if (showResult) {
                            if (option.isCorrect) {
                              buttonStyle =
                                'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold';
                            } else if (isSelected && !option.isCorrect) {
                              buttonStyle =
                                'bg-rose-50 border-rose-300 text-rose-900';
                            }
                          }

                          return (
                            <div key={option.id} className="space-y-1">
                              <button
                                disabled={Boolean(userAnswer)}
                                onClick={() =>
                                  handleSelectAnswer(concept, option.id)
                                }
                                className={`w-full text-left p-2.5 rounded-xl border text-xs font-medium transition cursor-pointer disabled:cursor-default flex items-start gap-2 ${buttonStyle}`}
                              >
                                <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                                  {isSelected ? '✓' : ''}
                                </span>
                                <span className="flex-1">
                                  {option.text[language] || option.text.es}
                                </span>
                              </button>

                              {isSelected && showResult && (
                                <p
                                  className={`text-[11px] px-2 font-semibold ${
                                    option.isCorrect
                                      ? 'text-emerald-700'
                                      : 'text-amber-700'
                                  }`}
                                >
                                  {option.feedback[language] ||
                                    option.feedback.es}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
