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
  profile: _profile,
  onEarnXp,
}) => {
  const { language } = useLanguage();
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

  const getText = <T extends Record<string, string>>(obj: T): string => {
    return obj[language] || obj.en || obj.es || '';
  };

  const categories = [
    {
      id: 'all',
      label:
        language === 'fr'
          ? 'Tous les thèmes'
          : language === 'es'
          ? 'Todos los temas'
          : 'All Topics',
    },
    {
      id: 'privacidad',
      label:
        language === 'fr'
          ? 'Vie Privée'
          : language === 'es'
          ? 'Privacidad'
          : 'Privacy',
    },
    {
      id: 'contrasenas',
      label:
        language === 'fr'
          ? 'Mots de Passe'
          : language === 'es'
          ? 'Contraseñas'
          : 'Passwords',
    },
    {
      id: 'phishing',
      label:
        language === 'fr'
          ? 'Pièges & Faux Liens'
          : language === 'es'
          ? 'Engaños & Trampas'
          : 'Phishing & Scams',
    },
    {
      id: 'redes',
      label:
        language === 'fr'
          ? 'Amis & Jeux'
          : language === 'es'
          ? 'Amigos & Juegos'
          : 'Friends & Games',
    },
    {
      id: 'dispositivos',
      label:
        language === 'fr'
          ? 'Wi-Fi & Appareils'
          : language === 'es'
          ? 'Wi-Fi & Equipos'
          : 'Wi-Fi & Tech',
    },
    {
      id: 'ia',
      label:
        language === 'fr'
          ? 'IA & Deepfakes'
          : language === 'es'
          ? 'IA & Deepfakes'
          : 'AI & Clones',
    },
  ];

  const filteredConcepts =
    selectedCategory === 'all'
      ? CYBER_CONCEPTS_DATA
      : CYBER_CONCEPTS_DATA.filter((c) => c.category === selectedCategory);

  const handleSelectAnswer = (concept: EducationConcept, optionId: string) => {
    if (quizAnswers[concept.id]) return;

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
    <div className="flex-1 min-h-0 flex flex-col bg-slate-50 text-slate-800 select-none overflow-y-auto scrollbar-none p-5 sm:p-6 space-y-6 sm:space-y-7 pb-28">
      {/* Education Screen Header Card */}
      <section className="shrink-0 rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-cyan-600 via-sky-600 to-blue-700 text-white shadow-sm relative overflow-hidden space-y-4">
        <div className="absolute top-0 right-0 w-44 h-44 bg-white/10 rounded-full blur-2xl -mr-12 -mt-12 pointer-events-none" />

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white">
              <GraduationCap className="w-4 h-4" />
              <span>
                {language === 'fr'
                  ? 'Académie de Cybersécurité'
                  : language === 'es'
                  ? 'Academia de Ciberseguridad'
                  : 'Cybersecurity Academy'}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
              {language === 'fr'
                ? 'Apprends les Réflexes Futés'
                : language === 'es'
                ? 'Aprende los Conceptos Clave'
                : 'Learn Smart Cyber Skills'}
            </h1>
            <p className="text-xs sm:text-sm text-cyan-100 leading-relaxed max-w-sm">
              {language === 'fr'
                ? 'Comprends les rouages d’Internet avec des métaphores simples et des règles claires.'
                : language === 'es'
                ? 'Conoce cómo funciona Internet de forma simple, sin enredos y con ejemplos reales.'
                : 'Master everyday internet safety rules through intuitive metaphors and clear guidelines.'}
            </p>
          </div>

          <div className="shrink-0 text-center bg-white/15 backdrop-blur-md rounded-2xl px-3.5 py-2.5 border border-white/20">
            <span className="block text-lg font-black text-white">
              {completedConceptIds.length} / {CYBER_CONCEPTS_DATA.length}
            </span>
            <span className="text-[10px] text-cyan-100 font-extrabold uppercase tracking-wider">
              {language === 'fr' ? 'Appris' : language === 'es' ? 'Aprendidos' : 'Mastered'}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="pt-2 border-t border-white/20 flex items-center justify-between gap-4">
          <div className="flex-1 h-2.5 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${(completedConceptIds.length / CYBER_CONCEPTS_DATA.length) * 100}%`,
              }}
              className="h-full bg-amber-400 rounded-full"
            />
          </div>
          <span className="text-xs font-black text-amber-300 flex items-center gap-1.5 shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
            +{completedConceptIds.length * 15} XP
          </span>
        </div>
      </section>

      {/* Cyber Tip of the Day */}
      <section className="shrink-0 space-y-2">
        <div className="flex items-center gap-2 px-1">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-700">
            {language === 'fr'
              ? 'Conseil Rapide du Jour'
              : language === 'es'
              ? 'Consejo Rápido del Día'
              : 'Daily Cyber Tip'}
          </h2>
        </div>
        <CyberTipOfTheDay />
      </section>

      {/* Topics Filter Category Row */}
      <section className="shrink-0 space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-700">
            {language === 'fr'
              ? 'Leçons & Superpouvoirs'
              : language === 'es'
              ? 'Lecciones & Superpoderes'
              : 'Lessons & Superpowers'}
          </h2>
          <span className="text-xs font-semibold text-slate-400">
            {filteredConcepts.length} {language === 'fr' ? 'sujets' : language === 'es' ? 'temas' : 'topics'}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${
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
      </section>

      {/* Educational Concepts Cards List */}
      <div className="shrink-0 space-y-5">
        {filteredConcepts.map((concept, index) => {
          const isExpanded = expandedConceptId === concept.id;
          const isCompleted = completedConceptIds.includes(concept.id);
          const userAnswer = quizAnswers[concept.id];

          return (
            <motion.div
              key={concept.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className={`rounded-3xl border transition-all overflow-hidden ${
                isCompleted
                  ? 'bg-white border-emerald-200/90 shadow-sm'
                  : 'bg-white border-slate-200/90 shadow-sm'
              }`}
            >
              {/* Card Header clickable to expand/collapse */}
              <div
                onClick={() =>
                  setExpandedConceptId(isExpanded ? null : concept.id)
                }
                className="p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition select-none"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs relative"
                    style={{
                      backgroundColor: `${concept.categoryColor}15`,
                      border: `1.5px solid ${concept.categoryColor}30`,
                    }}
                  >
                    {getConceptIcon(concept.icon)}
                    {isCompleted && (
                      <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-2 ring-white text-[10px]">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[11px] font-extrabold uppercase tracking-wider"
                        style={{ color: concept.categoryColor }}
                      >
                        {getText(concept.categoryLabel)}
                      </span>
                      {isCompleted && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {language === 'fr'
                              ? 'Appris'
                              : language === 'es'
                              ? 'Aprendido'
                              : 'Mastered'}
                          </span>
                        </>
                      )}
                    </div>

                    <h3 className="text-base font-black text-slate-900 leading-snug">
                      {getText(concept.title)}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                      {getText(concept.subtitle)}
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

              {/* Kid-Friendly Metaphor Highlight */}
              <div className="px-5 pb-5 pt-0">
                <div className="rounded-2xl p-4 bg-amber-50/70 border border-amber-200/70 flex items-start gap-3 text-xs text-amber-950">
                  <span className="text-2xl shrink-0 leading-none">
                    {concept.metaphor.emoji}
                  </span>
                  <div className="space-y-1">
                    <span className="font-black block text-amber-900 text-xs uppercase tracking-wide">
                      {language === 'fr'
                        ? 'La Métaphore Magique :'
                        : language === 'es'
                        ? 'La Metáfora para Recordar:'
                        : 'The Memory Metaphor:'}
                    </span>
                    <p className="font-medium text-slate-700 text-xs sm:text-sm leading-relaxed">
                      {getText(concept.metaphor.analogy)}
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
                    className="border-t border-slate-100 bg-slate-50/50 p-5 sm:p-6 space-y-5"
                  >
                    {/* Clear Concept Explanation */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-cyan-600" />
                        <span>
                          {language === 'fr'
                            ? 'Explication Simple'
                            : language === 'es'
                            ? '¿Qué significa esto de forma simple?'
                            : 'Simple Explanation'}
                        </span>
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white rounded-2xl p-4 border border-slate-200/80">
                        {getText(concept.explanation)}
                      </p>
                    </div>

                    {/* Golden Rule of the Guardian */}
                    <div className="rounded-2xl p-4 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/80 space-y-1.5">
                      <div className="flex items-center gap-2 text-amber-900 font-black text-xs uppercase tracking-wider">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span>
                          {language === 'fr'
                            ? 'Règle d’Or du Gardien'
                            : language === 'es'
                            ? 'Regla de Oro del Guardián'
                            : 'Guardian Golden Rule'}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed pl-6">
                        {getText(concept.goldenRule)}
                      </p>
                    </div>

                    {/* Real-World Scenario */}
                    <div className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider text-cyan-700">
                          {getText(concept.realWorldScenario.context)}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          {language === 'fr'
                            ? 'Cas Réel'
                            : language === 'es'
                            ? 'Caso Real'
                            : 'Real Scenario'}
                        </span>
                      </div>

                      <div className="text-xs sm:text-sm text-slate-600 space-y-2">
                        <p className="font-semibold text-slate-800 leading-relaxed">
                          👉 {getText(concept.realWorldScenario.whatHappens)}
                        </p>

                        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold text-xs sm:text-sm leading-relaxed">
                          🛡️ {getText(concept.realWorldScenario.smartAction)}
                        </div>
                      </div>
                    </div>

                    {/* Mini Quick Quiz for Comprehension */}
                    <div className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-amber-500" />
                          <span className="text-xs sm:text-sm font-black text-slate-900">
                            {language === 'fr'
                              ? 'Mini Quiz de Vérification'
                              : language === 'es'
                              ? 'Mini Reto de Comprobación'
                              : 'Quick Check Quiz'}
                          </span>
                        </div>
                        <span className="text-xs font-black text-amber-700">
                          +{concept.xpReward} XP
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed">
                        {getText(concept.quickQuiz.question)}
                      </p>

                      <div className="space-y-2.5">
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
                            <div key={option.id} className="space-y-1.5">
                              <button
                                disabled={Boolean(userAnswer)}
                                onClick={() =>
                                  handleSelectAnswer(concept, option.id)
                                }
                                className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm font-medium transition cursor-pointer disabled:cursor-default flex items-start gap-2.5 ${buttonStyle}`}
                              >
                                <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                                  {isSelected ? '✓' : ''}
                                </span>
                                <span className="flex-1 leading-snug">
                                  {getText(option.text)}
                                </span>
                              </button>

                              {isSelected && showResult && (
                                <p
                                  className={`text-xs px-2 font-bold leading-relaxed ${
                                    option.isCorrect
                                      ? 'text-emerald-700'
                                      : 'text-amber-700'
                                  }`}
                                >
                                  {getText(option.feedback)}
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
