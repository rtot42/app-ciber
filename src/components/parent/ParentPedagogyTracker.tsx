import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Brain,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { AGE_PEDAGOGY_MAP } from '../../data/parentGuidesData';

interface ParentPedagogyTrackerProps {
  profile: UserProfile;
  onExploreWorld?: () => void;
}

export const ParentPedagogyTracker: React.FC<ParentPedagogyTrackerProps> = ({
  profile,
  onExploreWorld,
}) => {
  const { language } = useLanguage();
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);

  const ageData = AGE_PEDAGOGY_MAP[language]?.[profile.ageGroup] || AGE_PEDAGOGY_MAP.es['11–12'];

  const competencies = [
    {
      id: 'privacidad',
      name: language === 'fr' ? 'Confidentialité & Données' : language === 'en' ? 'Privacy & Personal Data' : 'Privacidad & Datos Personales',
      score: profile.skills.privacidad || 82,
      icon: '🔒',
      advice: language === 'fr'
        ? 'Excellente maîtrise. Comprend bien qu\'il ne faut pas révéler l\'adresse ni l\'école en ligne.'
        : language === 'en'
        ? 'Excellent mastery. Accurately identifies why home addresses and school names should stay private.'
        : 'Excelente dominio. Comprende muy bien por qué no debe revelar dirección ni escuela en línea.',
      nextStep: language === 'fr' ? 'Analyser les métadonnées cachées dans les photos' : language === 'en' ? 'Review hidden metadata in photo files' : 'Analizar metadatos ocultos en fotografías',
    },
    {
      id: 'contrasenas',
      name: language === 'fr' ? 'Mots de Passe & Comptes' : language === 'en' ? 'Passwords & Accounts' : 'Contraseñas & Cuentas',
      score: profile.skills.contrasenas || 65,
      icon: '🔑',
      advice: language === 'fr'
        ? 'Bonne compréhension des mots de passe longs. Renforcer l\'importance de ne jamais les prêter.'
        : language === 'en'
        ? 'Good grasp of passphrase length. Reinforce never loaning passwords to close friends.'
        : 'Buen entendimiento de contraseñas largas. Reforzar el no prestar claves a amigos cercanos.',
      nextStep: language === 'fr' ? 'Pratiquer la méthode de la Phrase Secrète de 4 mots' : language === 'en' ? 'Practice the 4-word Passphrase method' : 'Practicar el método de la Frase Secreta de 4 palabras',
    },
    {
      id: 'phishing',
      name: language === 'fr' ? 'Détection de Phishing & Pièges' : language === 'en' ? 'Phishing & Scam Detection' : 'Detección de Phishing & Estafas',
      score: profile.skills.phishing || 48,
      icon: '🎣',
      advice: language === 'fr'
        ? 'En cours d\'acquisition. A tendance à cliquer trop vite sur les récompenses et concours virtuels.'
        : language === 'en'
        ? 'In progress. Needs coaching on pausing before clicking flashy reward announcements.'
        : 'En desarrollo. Tiende a dejarse llevar por la emoción de premios y concursos de juegos.',
      nextStep: language === 'fr' ? 'Appliquer la règle "Pause et Demande" avant de cliquer' : language === 'en' ? 'Enforce the "Pause & Ask" habit before opening links' : 'Aplicar la regla "Pausa y Pregunta" antes de pulsar enlaces',
    },
    {
      id: 'redesSociales',
      name: language === 'fr' ? 'Réseaux Sociaux & Image' : language === 'en' ? 'Social Media & Reputation' : 'Redes Sociales & Reputación',
      score: profile.skills.redesSociales || 55,
      icon: '📱',
      advice: language === 'fr'
        ? 'Comprend l\'importance du mode privé. Continuer à sensibiliser aux faux profils.'
        : language === 'en'
        ? 'Understands private profile value. Keep discussing how easily profiles can be faked.'
        : 'Entiende la importancia del modo privado. Continuar dialogando sobre perfiles falsificados.',
      nextStep: language === 'fr' ? 'Régler ensemble les filtres de confidentialité' : language === 'en' ? 'Audit follower lists and private settings together' : 'Revisar juntos los ajustes de privacidad',
    },
    {
      id: 'gamingSeguro',
      name: language === 'fr' ? 'Jeux Vidéo & Microtransactions' : language === 'en' ? 'Safe Gaming & Purchases' : 'Videojuegos & Compras Seguras',
      score: profile.skills.gamingSeguro || 40,
      icon: '🎮',
      advice: language === 'fr'
        ? 'Zone d\'attention. Vulnérable aux promesses de skins et gemmes gratuites dans Roblox/Fortnite.'
        : language === 'en'
        ? 'Focus area. Vulnerable to promises of free in-game currency or skin swaps in multiplayer lobbies.'
        : 'Área de atención. Vulnerable ante promesas de skins y monedas gratis en Roblox o Fortnite.',
      nextStep: language === 'fr' ? 'Activer le contrôle parental des achats avec code' : language === 'en' ? 'Mandate biometric or PIN authentication on all console store transactions' : 'Activar autenticación con PIN en compras de consolas y tiendas',
    },
    {
      id: 'iaDeepfakes',
      name: language === 'fr' ? 'IA & Contenus Synthétiques' : language === 'en' ? 'AI & Synthetic Content' : 'IA & Contenido Falso',
      score: profile.skills.iaDeepfakes || 25,
      icon: '🤖',
      advice: language === 'fr'
        ? 'Nouveau domaine. Doit apprendre que les voix et vidéos peuvent être générées par ordinateur.'
        : language === 'en'
        ? 'Emerging domain. Needs guidance understanding that voices and videos can be synthesized by AI.'
        : 'Dominio emergente. Requiere aprender que las voces y videos pueden ser fabricados por IA.',
      nextStep: language === 'fr' ? 'Définir le mot de passe secret familial d\'urgence' : language === 'en' ? 'Establish your household emergency secret Safe Word' : 'Establecer la Palabra Clave Familiar Secreta',
    },
  ];

  const overallAvg = Math.round(
    competencies.reduce((acc, c) => acc + c.score, 0) / competencies.length
  );

  return (
    <div className="space-y-4">
      {/* Age Group Cognitive Diagnostic */}
      <div className="p-4 rounded-3xl bg-linear-to-br from-indigo-50/90 via-sky-50/70 to-white border border-indigo-100 shadow-sm space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600">
                {language === 'fr' ? 'Diagnostic Pédagogique' : language === 'en' ? 'Pedagogical Diagnostic' : 'Diagnóstico Pedagógico'}
              </span>
              <h3 className="text-sm font-black text-slate-900 leading-tight">
                {ageData.stageTitle}
              </h3>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-white/90 border border-indigo-200/60 text-[10px] font-bold text-indigo-700 shadow-2xs">
            {profile.ageGroup} {language === 'fr' ? 'ans' : language === 'en' ? 'yrs' : 'años'}
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          {ageData.cognitiveTraits}
        </p>

        <div className="p-3 rounded-2xl bg-white/80 border border-indigo-100/80 space-y-1.5">
          <div className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-indigo-600" />
            <span>{language === 'fr' ? 'Priorités d\'apprentissage à cet âge :' : language === 'en' ? 'Key development challenges for this age:' : 'Prioridades formativas a esta edad:'}</span>
          </div>
          <ul className="text-[11px] text-slate-600 space-y-1 pl-1">
            {ageData.keyChallenges.map((ch, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-indigo-500 font-bold">•</span>
                <span>{ch}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-indigo-100/60">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>{ageData.screenTimeRecommendation}</span>
          </span>
        </div>
      </div>

      {/* Competencies Matrix */}
      <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              {language === 'fr' ? 'Matrice des 6 Compétences Clés' : language === 'en' ? 'Key 6 Cybersecurity Competencies' : 'Matriz de las 6 Competencias Clave'}
            </h3>
            <p className="text-[10px] text-slate-500">
              {language === 'fr' ? 'Évaluation continue basée sur ses choix dans les défis' : language === 'en' ? 'Real-time assessment derived from in-game decision making' : 'Evaluación continua basada en sus elecciones durante las misiones'}
            </p>
          </div>
          <div className="text-right">
            <span className="text-base font-black text-slate-900">{overallAvg}%</span>
            <span className="text-[9px] text-slate-400 block uppercase font-bold">
              {language === 'fr' ? 'Moyenne' : language === 'en' ? 'Overall' : 'Promedio'}
            </span>
          </div>
        </div>

        <div className="space-y-2.5">
          {competencies.map((comp) => {
            const isExpanded = expandedSkill === comp.id;
            const isMastered = comp.score >= 70;
            const isProgress = comp.score >= 40 && comp.score < 70;
            const statusColor = isMastered
              ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
              : isProgress
              ? 'text-amber-700 bg-amber-50 border-amber-200'
              : 'text-rose-700 bg-rose-50 border-rose-200';

            const barColor = isMastered
              ? 'bg-emerald-500'
              : isProgress
              ? 'bg-amber-500'
              : 'bg-rose-500';

            const statusLabel = isMastered
              ? (language === 'fr' ? 'Maîtrisé' : language === 'en' ? 'Mastered' : 'Dominado')
              : isProgress
              ? (language === 'fr' ? 'En progrès' : language === 'en' ? 'In Progress' : 'En proceso')
              : (language === 'fr' ? 'À renforcer' : language === 'en' ? 'Needs Practice' : 'Reforzar en casa');

            return (
              <div
                key={comp.id}
                className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60 transition"
              >
                <button
                  type="button"
                  onClick={() => setExpandedSkill(isExpanded ? null : comp.id)}
                  className="w-full text-left flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 flex-1 pr-2">
                    <span className="text-base">{comp.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-800">
                          {comp.name}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-black border ${statusColor}`}>
                            {statusLabel}
                          </span>
                          <span className="text-xs font-black text-slate-700">
                            {comp.score}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                          style={{ width: `${comp.score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-slate-400 pl-1">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200/70 space-y-2 text-xs">
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {comp.advice}
                    </p>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-cyan-800 block">
                          {language === 'fr' ? 'Action recommandée à la maison :' : language === 'en' ? 'Recommended family action:' : 'Acción recomendada en el hogar:'}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-800">
                          {comp.nextStep}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Suggested Joint Mission */}
      <div className="p-4 rounded-3xl bg-amber-50/80 border border-amber-200/70 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-black text-xl shrink-0 shadow-2xs">
            ⭐
          </div>
          <div>
            <span className="text-[9px] font-black uppercase tracking-wider text-amber-800 block">
              {language === 'fr' ? 'Mission Familiale Recommandée' : language === 'en' ? 'Recommended Joint Mission' : 'Misión Familiar Recomendada'}
            </span>
            <div className="text-xs font-black text-slate-900">
              {language === 'fr'
                ? 'Mundo 1: ¿Qué compartirías en redes?'
                : language === 'en'
                ? 'World 1: What would you share online?'
                : 'Mundo 1: ¿Qué compartirías en redes?'}
            </div>
            <p className="text-[10px] text-slate-600">
              {language === 'fr'
                ? 'Idéale pour repérer ensemble les indices cachés sur une photo scolaire'
                : language === 'en'
                ? 'Ideal for spotting subtle clues in a school photo together'
                : 'Ideal para resolver juntos y debatir los riesgos de geolocalización'}
            </p>
          </div>
        </div>

        {onExploreWorld && (
          <button
            onClick={onExploreWorld}
            className="p-2.5 rounded-2xl bg-white hover:bg-amber-100 text-amber-800 border border-amber-200 transition shadow-2xs cursor-pointer shrink-0"
            title="Ir a misiones"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
