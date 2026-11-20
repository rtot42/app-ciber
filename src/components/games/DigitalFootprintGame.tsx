import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Footprints,
  EyeOff,
  Eye,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { ChildAgeGroup, GameResultStats } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { GameHud, GameVictorySummary } from './GameShell';
import { computeStars } from '../../utils/ageDifficulty';
import { playGameSound } from '../../utils/gameAudio';

interface DigitalFootprintGameProps {
  onComplete: (stats?: GameResultStats) => void;
  ageGroup?: ChildAgeGroup;
}

interface ProfileElement {
  id: string;
  field: string;
  value: string;
  isRisk: boolean; // true = should hide/redact; false = safe to keep public
  reason: string;
}

export const DigitalFootprintGame: React.FC<DigitalFootprintGameProps> = ({
  onComplete,
  ageGroup = '8–10' as ChildAgeGroup,
}) => {
  const { language } = useLanguage();

  const copy = useMemo(() => {
    const itemsByAge: Record<ChildAgeGroup, ProfileElement[]> = {
      '8–10': [
        {
          id: 'df1',
          field: language === 'fr' ? 'Pseudo' : language === 'en' ? 'Nickname' : 'Apodo',
          value: 'AstroPanda_77',
          isRisk: false,
          reason: language === 'fr' ? 'Un pseudo créatif sans vrai nom est sûr !' : language === 'en' ? 'A creative nickname without your real name is safe!' : '¡Un apodo creativo sin tu nombre real es seguro!',
        },
        {
          id: 'df2',
          field: language === 'fr' ? 'Bio : École' : language === 'en' ? 'Bio: School' : 'Bio: Colegio',
          value: language === 'fr' ? 'École Saint-Jean · Classe 4B' : language === 'en' ? 'Oakwood Elementary · Grade 4' : 'Colegio San Patricio · 4º B',
          isRisk: true,
          reason: language === 'fr' ? 'Cache toujours le nom de ton école en public.' : language === 'en' ? 'Always hide your school name on public profiles.' : 'Oculta siempre el nombre de tu colegio en perfiles públicos.',
        },
        {
          id: 'df3',
          field: language === 'fr' ? 'Passe-temps' : language === 'en' ? 'Hobby' : 'Pasatiempo',
          value: language === 'fr' ? 'J’adore dessiner des dragons 🎨' : language === 'en' ? 'Love drawing dragons & football ⚽' : 'Me encanta dibujar dragones y el fútbol ⚽',
          isRisk: false,
          reason: language === 'fr' ? 'Partager tes passions ne révèle aucune donnée privée.' : language === 'en' ? 'Sharing hobbies reveals zero private details.' : 'Compartir tus gustos no expone datos personales.',
        },
        {
          id: 'df4',
          field: language === 'fr' ? 'Adresse / Rue' : language === 'en' ? 'Home Street' : 'Calle de Casa',
          value: 'Av. Los Robles 42',
          isRisk: true,
          reason: language === 'fr' ? 'Ne publie jamais ton adresse postale.' : language === 'en' ? 'Never publish your street address online.' : 'Jamás publiques la dirección de tu casa en Internet.',
        },
      ],
      '11–12': [
        {
          id: 'df1',
          field: language === 'fr' ? 'Bio' : language === 'en' ? 'Bio' : 'Biografía',
          value: 'Gamer & Pixel Art · CyberLeo',
          isRisk: false,
          reason: language === 'fr' ? 'Sûr ! Aucune donnée sensible.' : language === 'en' ? 'Safe! No personal identifiers.' : '¡Seguro! Sin datos personales.',
        },
        {
          id: 'df2',
          field: language === 'fr' ? 'Date de naissance' : language === 'en' ? 'Full Birthday' : 'Cumpleaños Exacto',
          value: '14/05/2014',
          isRisk: true,
          reason: language === 'fr' ? 'La date de naissance aide à deviner tes mots de passe.' : language === 'en' ? 'Your exact birth date helps strangers guess passwords & age.' : 'Tu fecha de nacimiento exacta sirve para adivinar claves y edad.',
        },
        {
          id: 'df3',
          field: language === 'fr' ? 'Tag Photo du Parc' : language === 'en' ? 'Photo Geotag' : 'Ubicación en Foto',
          value: 'GPS: Parque Central (Hace 5 min)',
          isRisk: true,
          reason: language === 'fr' ? 'Le GPS en direct montre exactement où tu te trouves.' : language === 'en' ? 'Live GPS tags broadcast your exact current spot.' : 'El GPS en tiempo real muestra dónde estás en este mismo instante.',
        },
        {
          id: 'df4',
          field: language === 'fr' ? 'Numéro WhatsApp' : language === 'en' ? 'Phone in Bio' : 'Teléfono en Bio',
          value: '+34 612 555 890',
          isRisk: true,
          reason: language === 'fr' ? 'Ton numéro est privé ; ne le laisse pas en public.' : language === 'en' ? 'Keep your phone number hidden from public profiles.' : 'Tu número telefónico debe ser privado, nunca público.',
        },
        {
          id: 'df5',
          field: language === 'fr' ? 'Post Créatif' : language === 'en' ? 'Creative Post' : 'Publicación Creativa',
          value: language === 'fr' ? 'Mon nouveau robot en Lego ! 🤖' : language === 'en' ? 'My new Lego robot build! 🤖' : '¡Mi nuevo robot armado con bloques! 🤖',
          isRisk: false,
          reason: language === 'fr' ? 'Super publication sécurisée !' : language === 'en' ? 'Great safe post to share!' : '¡Publicación divertida y 100% segura!',
        },
      ],
      '13–14': [
        {
          id: 'df1',
          field: language === 'fr' ? 'Pseudo Public' : language === 'en' ? 'Public Handle' : 'Alias Público',
          value: '@QuantumVortex_Dev',
          isRisk: false,
          reason: language === 'fr' ? 'Alias anonyme bien pensé.' : language === 'en' ? 'Well-crafted pseudonymous handle.' : 'Alias anónimo bien diseñado.',
        },
        {
          id: 'df2',
          field: language === 'fr' ? 'Photo d’uniforme + Badge' : language === 'en' ? 'School ID Badge Photo' : 'Foto con Carnet Escolar',
          value: 'ID #88219 · Instituto Norte',
          isRisk: true,
          reason: language === 'fr' ? 'Risque OSINT : révèle identité complète, école et numéro d’élève.' : language === 'en' ? 'OSINT risk: exposes full name, school, and student ID.' : 'Riesgo OSINT: revela nombre completo, colegio y matrícula.',
        },
        {
          id: 'df3',
          field: language === 'fr' ? 'Email de Récupération' : language === 'en' ? 'Recovery Email Visible' : 'Correo Personal Visible',
          value: 'mateo.rodriguez2012@mail.com',
          isRisk: true,
          reason: language === 'fr' ? 'Contient nom complet, année de naissance et facilite le phishing.' : language === 'en' ? 'Exposes full name, birth year, and invites targeted phishing.' : 'Expone nombre real, año de nacimiento y atrae phishing.',
        },
        {
          id: 'df4',
          field: language === 'fr' ? 'Routine Quotidienne' : language === 'en' ? 'Daily Routine Post' : 'Rutina Semanal Pública',
          value: language === 'fr' ? '"Je rentre toujours seul à pied à 17h30"' : language === 'en' ? '"Walking home alone every Tue/Thu at 5:30 PM"' : '"Todos los martes vuelvo solo por la plaza a las 17:30"',
          isRisk: true,
          reason: language === 'fr' ? 'Ne publie jamais tes trajets réguliers et horaires.' : language === 'en' ? 'Never publish predictable solo travel schedules.' : 'Nunca publiques horarios ni rutas en las que caminas solo.',
        },
        {
          id: 'df5',
          field: language === 'fr' ? 'Projet Scolaire' : language === 'en' ? 'Portfolio Project' : 'Proyecto de Ciencias',
          value: language === 'fr' ? 'Simulation système solaire en JS' : language === 'en' ? 'Solar system coding project demo' : 'Maqueta digital del sistema solar',
          isRisk: false,
          reason: language === 'fr' ? 'Empreinte numérique positive qui valorise tes talents !' : language === 'en' ? 'Positive digital footprint showcasing your skills!' : '¡Huella digital positiva que muestra tus talentos con seguridad!',
        },
        {
          id: 'df6',
          field: language === 'fr' ? 'Billet Concert / QR Code' : language === 'en' ? 'Ticket Barcode Story' : 'Foto de Entrada con Código QR',
          value: 'QR #AX-9012-VALID',
          isRisk: true,
          reason: language === 'fr' ? 'Un pirate peut cloner le code-barres de ton billet !' : language === 'en' ? 'Anyone can scan and steal a visible ticket QR/barcode!' : '¡Cualquiera puede clonar el código QR de tu entrada!',
        },
      ],
    };

    const labels = {
      es: {
        title: 'Auditor de Huella Digital',
        subtitle: 'Oculta los datos riesgosos y deja visible lo seguro',
        hideBtn: 'Ocultar',
        keepBtn: 'Dejar Visible',
        auditBtn: 'Publicar Perfil Auditado',
        takeaway:
          'Todo lo que publicas forma tu huella digital permanente. Oculta datos de ubicación, colegio, teléfonos, fechas y códigos QR antes de compartir.',
      },
      fr: {
        title: 'Auditeur d’Empreinte Numérique',
        subtitle: 'Masque les données risquées et garde ce qui est sûr',
        hideBtn: 'Masquer',
        keepBtn: 'Garder Public',
        auditBtn: 'Valider le Profil Nettoyé',
        takeaway:
          'Tout ce que tu publies laisse une trace durable. Masque école, adresse, numéro, routines et codes-barres avant de publier.',
      },
      en: {
        title: 'Digital Footprint Auditor',
        subtitle: 'Redact risky details and keep safe creative content public',
        hideBtn: 'Hide / Redact',
        keepBtn: 'Keep Public',
        auditBtn: 'Publish Audited Profile',
        takeaway:
          'Everything posted online builds your permanent digital footprint. Redact schools, locations, phone numbers, routines, and ticket barcodes before posting.',
      },
    }[language];

    return { items: itemsByAge[ageGroup], labels };
  }, [ageGroup, language]);

  // true = marked hidden/redacted, false = kept public
  const [redactedMap, setRedactedMap] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [finished, setFinished] = useState(false);

  const toggleItem = (id: string, hide: boolean) => {
    if (submitted) return;
    playGameSound('tap');
    setRedactedMap((prev) => ({ ...prev, [id]: hide }));
  };

  const correctCount = copy.items.filter(
    (item) => (redactedMap[item.id] ?? false) === item.isRisk
  ).length;
  const accuracy = Math.round((correctCount / copy.items.length) * 100);
  const score = correctCount * 60 + (accuracy === 100 ? 80 : 0);

  const handleSubmit = () => {
    setSubmitted(true);
    playGameSound(accuracy >= 80 ? 'correct' : 'wrong');
  };

  const handleFinish = () => {
    playGameSound('win');
    setFinished(true);
  };

  const handleReplay = () => {
    setRedactedMap({});
    setSubmitted(false);
    setFinished(false);
  };

  if (finished) {
    const stats: GameResultStats = {
      stars: computeStars(accuracy, ageGroup),
      accuracy,
      score,
      streakMax: correctCount,
      ageGroup,
    };
    return (
      <div className="flex-1 min-h-0 w-full flex flex-col p-3.5 sm:p-5 bg-slate-50 overflow-y-auto overflow-x-hidden scrollbar-none">
        <GameVictorySummary
          title={copy.labels.title}
          takeaway={copy.labels.takeaway}
          stats={stats}
          ageGroup={ageGroup}
          onReplay={handleReplay}
          onContinue={onComplete}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 w-full flex flex-col p-2.5 sm:p-4 bg-slate-50 text-slate-800 overflow-y-auto overflow-x-hidden scrollbar-none gap-2.5 sm:gap-3 pb-4">
      <GameHud
        title={copy.labels.title}
        subtitle={copy.labels.subtitle}
        icon={<Footprints className="w-5 h-5" />}
        accentColor="purple"
        ageGroup={ageGroup}
        currentStep={submitted ? copy.items.length : Object.keys(redactedMap).length}
        totalSteps={copy.items.length}
        score={submitted ? score : Object.keys(redactedMap).length * 25}
        accuracy={submitted ? accuracy : undefined}
      />

      {/* Social Profile Audit Board */}
      <div className="flex-1 min-h-0 bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col justify-center gap-2.5 sm:gap-3">
        {copy.items.map((item) => {
          const isHidden = redactedMap[item.id] ?? false;
          const isCorrect = submitted && isHidden === item.isRisk;
          const isWrong = submitted && isHidden !== item.isRisk;

          return (
            <motion.div
              key={item.id}
              layout
              className={`p-3 rounded-2xl border transition ${
                isCorrect
                  ? 'bg-emerald-50/80 border-emerald-200'
                  : isWrong
                  ? 'bg-rose-50/80 border-rose-200'
                  : isHidden
                  ? 'bg-slate-100 border-slate-300'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex flex-wrap sm:flex-nowrap items-start sm:items-center justify-between gap-2.5">
                <div className="min-w-0 space-y-0.5 flex-1">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    {item.field}
                  </div>
                  <div
                    className={`text-sm font-bold leading-snug break-words ${
                      isHidden ? 'line-through text-slate-400' : 'text-slate-900'
                    }`}
                  >
                    {item.value}
                  </div>
                </div>

                {/* Toggle Hide vs Keep */}
                <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl shrink-0 ml-auto">
                  <button
                    type="button"
                    disabled={submitted}
                    onClick={() => toggleItem(item.id, false)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer min-h-[38px] ${
                      !isHidden
                        ? 'bg-cyan-600 text-white'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden sm:inline">{copy.labels.keepBtn}</span>
                  </button>
                  <button
                    type="button"
                    disabled={submitted}
                    onClick={() => toggleItem(item.id, true)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer min-h-[38px] ${
                      isHidden
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <EyeOff className="w-3.5 h-3.5 shrink-0" />
                    <span>{copy.labels.hideBtn}</span>
                  </button>
                </div>
              </div>

              {submitted && (
                <div className="mt-2 pt-2 border-t border-slate-200/70 flex items-start gap-2 text-xs font-medium">
                  {isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <span className={isCorrect ? 'text-emerald-900' : 'text-rose-900'}>
                    {item.reason}
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {!submitted ? (
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full py-3.5 min-h-[48px] shrink-0 rounded-2xl font-bold text-sm sm:text-base bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition"
        >
          <ShieldCheck className="w-5 h-5" />
          <span>{copy.labels.auditBtn}</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={handleFinish}
          className="w-full py-3.5 min-h-[48px] shrink-0 rounded-2xl font-bold text-sm sm:text-base bg-gradient-to-r from-emerald-500 to-cyan-600 text-white shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition"
        >
          <span>
            {language === 'fr'
              ? 'Voir le Résultat Final'
              : language === 'en'
              ? 'View Final Score'
              : 'Ver Resultado Final'}
          </span>
          <ArrowRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
