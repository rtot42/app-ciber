import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Search,
  Clock,
  ChevronRight,
  X,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  FileText,
  Key,
  Gamepad2,
  Camera,
  Cpu,
  HeartHandshake,
  KeyRound,
  FishSymbol,
  Check,
  Share2,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  PARENT_GUIDES,
  DIGITAL_AGREEMENT_ITEMS,
  ParentGuide,
  DigitalAgreementItem,
} from '../../data/parentGuidesData';

export const ParentStudyHub: React.FC = () => {
  const { language } = useLanguage();
  const guides = PARENT_GUIDES[language] || PARENT_GUIDES.es;
  const agreementItems = DIGITAL_AGREEMENT_ITEMS[language] || DIGITAL_AGREEMENT_ITEMS.es;

  const [activeSubTab, setActiveSubTab] = useState<'guides' | 'agreement'>('guides');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuide, setSelectedGuide] = useState<ParentGuide | null>(null);
  const [signedAgreements, setSignedAgreements] = useState<Record<string, boolean>>({
    'safe-harbor': true,
    'private-credentials': true,
    'pause-and-think': true,
  });

  const categories = [
    { id: 'all', label: language === 'fr' ? 'Toutes' : language === 'en' ? 'All' : 'Todas' },
    { id: 'gaming', label: language === 'fr' ? 'Jeux Vidéo' : language === 'en' ? 'Gaming' : 'Videojuegos' },
    { id: 'privacy', label: language === 'fr' ? 'Vie Privée' : language === 'en' ? 'Privacy' : 'Privacidad' },
    { id: 'phishing', label: language === 'fr' ? 'Arnaques' : language === 'en' ? 'Scams' : 'Phishing' },
    { id: 'ai', label: language === 'fr' ? 'IA & Voix' : language === 'en' ? 'AI & Voice' : 'IA & Voz' },
    { id: 'bullying', label: language === 'fr' ? 'Harcèlement' : language === 'en' ? 'Anti-Bullying' : 'Ciberacoso' },
    { id: 'passwords', label: language === 'fr' ? 'Mots de Passe' : language === 'en' ? 'Passwords' : 'Contraseñas' },
  ];

  const filteredGuides = guides.filter((g) => {
    const matchesCat = selectedCategory === 'all' || g.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.realRisk.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleAgreement = (id: string) => {
    setSignedAgreements((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const agreementCount = Object.values(signedAgreements).filter(Boolean).length;

  const getIconComponent = (cat: string) => {
    switch (cat) {
      case 'gaming':
        return <Gamepad2 className="w-5 h-5 text-purple-600" />;
      case 'privacy':
        return <Camera className="w-5 h-5 text-sky-600" />;
      case 'phishing':
        return <FishSymbol className="w-5 h-5 text-amber-600" />;
      case 'ai':
        return <Cpu className="w-5 h-5 text-cyan-600" />;
      case 'bullying':
        return <HeartHandshake className="w-5 h-5 text-rose-600" />;
      case 'passwords':
        return <KeyRound className="w-5 h-5 text-emerald-600" />;
      default:
        return <BookOpen className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-3.5">
      {/* Sub-tab Navigation */}
      <div className="p-1 rounded-2xl bg-slate-200/70 flex items-center text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('guides')}
          className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'guides'
              ? 'bg-white text-slate-900 shadow-xs font-black'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-cyan-600" />
          <span>
            {language === 'fr'
              ? 'Guides Pédagogiques'
              : language === 'en'
              ? 'Parent Study Guides'
              : 'Guías de Estudio'}
          </span>
          <span className="px-1.5 py-0.2 rounded-full bg-cyan-100 text-cyan-800 text-[10px]">
            {guides.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('agreement')}
          className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'agreement'
              ? 'bg-white text-slate-900 shadow-xs font-black'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-emerald-600" />
          <span>
            {language === 'fr'
              ? 'Pacte Numérique Familial'
              : language === 'en'
              ? 'Family Digital Pact'
              : 'Pacto Familiar Digital'}
          </span>
          <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px]">
            {agreementCount}/{agreementItems.length}
          </span>
        </button>
      </div>

      {activeSubTab === 'guides' ? (
        <div className="space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'fr'
                  ? 'Rechercher un sujet (Roblox, mot de passe, IA)...'
                  : language === 'en'
                  ? 'Search guide (Roblox, password, deepfake)...'
                  : 'Buscar guía (Robux, contraseña, deepfake, fotos)...'
              }
              className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-cyan-500 shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition cursor-pointer border ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Guides List */}
          <div className="space-y-3">
            {filteredGuides.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-3xl border border-slate-100 space-y-2">
                <p className="text-xs text-slate-500 font-medium">
                  {language === 'fr'
                    ? 'Aucun guide ne correspond à votre recherche.'
                    : language === 'en'
                    ? 'No guides match your search criteria.'
                    : 'No se encontraron guías con esos términos.'}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="text-xs font-bold text-cyan-600 underline cursor-pointer"
                >
                  {language === 'fr' ? 'Réinitialiser les filtres' : language === 'en' ? 'Reset filters' : 'Restablecer filtros'}
                </button>
              </div>
            ) : (
              filteredGuides.map((guide) => (
                <div
                  key={guide.id}
                  onClick={() => setSelectedGuide(guide)}
                  className="p-4 rounded-3xl bg-white border border-slate-100 hover:border-slate-300 transition shadow-xs space-y-2.5 cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition">
                        {getIconComponent(guide.category)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-100">
                            {guide.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {guide.readTime}
                          </span>
                        </div>
                        <h3 className="text-xs font-black text-slate-900 group-hover:text-cyan-700 transition leading-snug">
                          {guide.title}
                        </h3>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-1 group-hover:translate-x-0.5 transition" />
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                    {guide.summary}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px]">
                    <span className="text-slate-400 italic">
                      ⭐ {guide.goldenRule.slice(0, 45)}...
                    </span>
                    <span className="font-black text-cyan-600 flex items-center gap-0.5">
                      {language === 'fr' ? 'Lire la fiche' : language === 'en' ? 'Read full guide' : 'Leer guía completa'}
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* Family Digital Agreement Tab */
        <div className="space-y-3.5">
          <div className="p-4 rounded-3xl bg-linear-to-br from-emerald-50/90 via-teal-50/50 to-white border border-emerald-100 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-2xs font-bold">
                  🤝
                </div>
                <div>
                  <h3 className="text-xs font-black text-emerald-950">
                    {language === 'fr'
                      ? 'Pacte Familial de Sécurité Numérique'
                      : language === 'en'
                      ? 'Family Digital Safety Pact'
                      : 'Pacto Familiar de Internet Seguro'}
                  </h3>
                  <span className="text-[10px] text-emerald-700 font-medium">
                    {language === 'fr'
                      ? 'Des engagements réciproques parents-enfants'
                      : language === 'en'
                      ? 'Mutual commitments for parents and kids'
                      : 'Compromisos mutuos para cuidar la confianza'}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-black text-emerald-800">
                  {agreementCount}/{agreementItems.length}
                </span>
                <span className="text-[9px] text-emerald-600 block">
                  {language === 'fr' ? 'validés' : language === 'en' ? 'signed' : 'acordados'}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed">
              {language === 'fr'
                ? 'Ce pacte repose sur la confiance et l\'écoute mutuelle, loin des interdictions strictes. Cochez ensemble les règles adoptées dans votre foyer.'
                : language === 'en'
                ? 'This agreement establishes healthy screen boundaries rooted in trust, not arbitrary punishment. Review and check each pledge together.'
                : 'Este pacto fomenta límites sanos basados en la empatía y la confianza, no en castigos arbitrarios. Marquen juntos los compromisos de su hogar.'}
            </p>
          </div>

          <div className="space-y-2.5">
            {agreementItems.map((item) => {
              const isChecked = !!signedAgreements[item.id];
              const badgeLabel =
                item.commitmentBy === 'parent'
                  ? (language === 'fr' ? 'Pour les Parents' : language === 'en' ? 'Parent Commitment' : 'Compromiso Adultos')
                  : item.commitmentBy === 'child'
                  ? (language === 'fr' ? 'Pour les Enfants' : language === 'en' ? 'Kids Commitment' : 'Compromiso Niños')
                  : (language === 'fr' ? 'Pour Tous' : language === 'en' ? 'Shared Commitment' : 'Compromiso Mutuo');

              return (
                <div
                  key={item.id}
                  onClick={() => toggleAgreement(item.id)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start gap-3 select-none ${
                    isChecked
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border transition ${
                      isChecked
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">
                        {item.title}
                      </span>
                      <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md">
                        {badgeLabel}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Guide Details Modal */}
      <AnimatePresence>
        {selectedGuide && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200"
            >
              {/* Modal Header */}
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-start justify-between shrink-0">
                <div className="flex items-start gap-3 flex-1 pr-2">
                  <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                    {getIconComponent(selectedGuide.category)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-black uppercase text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-200">
                        {selectedGuide.category}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" />
                        {selectedGuide.readTime}
                      </span>
                    </div>
                    <h2 className="text-sm font-black text-slate-900 leading-tight">
                      {selectedGuide.title}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedGuide(null)}
                  className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Scrollable Body */}
              <div className="p-4 overflow-y-auto space-y-4 text-xs scrollbar-none">
                {/* Real Risk Section */}
                <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-100 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-rose-800 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>
                      {language === 'fr'
                        ? 'Le Risque Réel pour l\'Enfant'
                        : language === 'en'
                        ? 'The Real Risk for Children'
                        : 'El Riesgo Real para los Niños'}
                    </span>
                  </div>
                  <p className="text-[11px] text-rose-950 leading-relaxed font-medium">
                    {selectedGuide.realRisk}
                  </p>
                </div>

                {/* Key Concepts */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span>
                      {language === 'fr'
                        ? 'Concepts Clés Expliqués Simplement'
                        : language === 'en'
                        ? 'Key Concepts Simplified'
                        : 'Conceptos Clave Explicados Fácil'}
                    </span>
                  </h4>
                  <div className="space-y-1.5">
                    {selectedGuide.keyConcepts.map((kc, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] text-slate-700 font-medium leading-relaxed"
                      >
                        {kc}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Practical Steps / Checklist */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-cyan-600" />
                    <span>
                      {language === 'fr'
                        ? 'Plan d\'Action Pratique pour les Parents'
                        : language === 'en'
                        ? 'Step-by-Step Action Plan'
                        : 'Plan de Acción Práctico para Padres'}
                    </span>
                  </h4>
                  <div className="space-y-1.5">
                    {selectedGuide.practicalSteps.map((step, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-cyan-50/50 border border-cyan-100 flex items-start gap-2.5 text-[11px] text-slate-800 leading-relaxed"
                      >
                        <span className="w-4 h-4 rounded-full bg-cyan-600 text-white flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Conversation Starter */}
                <div className="p-3.5 rounded-2xl bg-sky-50/80 border border-sky-200 space-y-1">
                  <span className="text-[10px] font-black uppercase text-sky-800 block">
                    {language === 'fr'
                      ? 'Question à Poser à la Maison :'
                      : language === 'en'
                      ? 'Dinner Conversation Starter:'
                      : 'Pregunta para Iniciar la Charla en Familia:'}
                  </span>
                  <p className="text-xs text-sky-950 font-bold italic leading-relaxed">
                    "{selectedGuide.familyPrompt}"
                  </p>
                </div>

                {/* Golden Rule */}
                <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-black uppercase text-amber-800 block">
                      {language === 'fr'
                        ? 'La Règle d\'Or'
                        : language === 'en'
                        ? 'The Golden Rule'
                        : 'La Regla de Oro'}
                    </span>
                    <p className="text-xs text-amber-950 font-black leading-snug">
                      {selectedGuide.goldenRule}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
                <button
                  onClick={() => setSelectedGuide(null)}
                  className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer text-center"
                >
                  {language === 'fr' ? 'Fermer la fiche' : language === 'en' ? 'Close guide' : 'Entendido, Cerrar Guía'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
