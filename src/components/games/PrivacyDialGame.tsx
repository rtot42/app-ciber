import React, { useState, useMemo } from 'react';
import {
  Sliders,
  Globe,
  Users,
  Lock,
  ShieldCheck,
  Eye,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { ChildAgeGroup, GameResultStats } from '../../types';
import { GameHud, GameVictorySummary } from './GameShell';
import { computeStars } from '../../utils/ageDifficulty';
import { playGameSound } from '../../utils/gameAudio';

interface PrivacyDialGameProps {
  onComplete: (stats?: GameResultStats) => void;
  ageGroup?: ChildAgeGroup;
}

type DialValue = 'public' | 'friends' | 'private';

interface DialConfig {
  id: string;
  label: string;
  requiredSafe: DialValue[]; // allowed safe choices
  strangerRiskLabel: string;
  strangerSafeLabel: string;
  questionLabel: string;
  useMessageLabels?: boolean;
}

export const PrivacyDialGame: React.FC<PrivacyDialGameProps> = ({
  onComplete,
  ageGroup = '8–10' as ChildAgeGroup,
}) => {
  const { language } = useLanguage();

  const copy = useMemo(() => {
    const allDials: Record<string, DialConfig[]> = {
      es: [
        {
          id: 'location',
          label: 'Ubicación GPS en publicaciones',
          requiredSafe: ['private'],
          questionLabel: '¿Ve dónde vives / estudias?',
          strangerRiskLabel: 'Visible en el mapa',
          strangerSafeLabel: 'Oculto (Solo tú)',
        },
        {
          id: 'photos',
          label: '¿Quién ve mis fotos y videos?',
          requiredSafe: ['friends', 'private'],
          questionLabel: '¿Ve tus álbumes?',
          strangerRiskLabel: 'Abierto a cualquiera',
          strangerSafeLabel: 'Solo amigos reales',
        },
        {
          id: 'messages',
          label: '¿Quién puede enviarme mensajes directos?',
          requiredSafe: ['friends', 'private'],
          questionLabel: '¿Puede enviarte DMs?',
          strangerRiskLabel: 'Bandeja abierta',
          strangerSafeLabel: 'Extraños bloqueados',
          useMessageLabels: true,
        },
        {
          id: 'voice',
          label: 'Chat de voz y solicitudes de juego',
          requiredSafe: ['friends', 'private'],
          questionLabel: '¿Puede oír tu micrófono?',
          strangerRiskLabel: 'Cualquier sala pública',
          strangerSafeLabel: 'Solo escuadrón amigo',
          useMessageLabels: true,
        },
        {
          id: 'tracking',
          label: 'Compartir actividad con apps externas',
          requiredSafe: ['private'],
          questionLabel: '¿Rastrea tus otras apps?',
          strangerRiskLabel: 'Rastreo activo',
          strangerSafeLabel: 'Bloqueado (Desactivado)',
        },
      ],
      fr: [
        {
          id: 'location',
          label: 'Position GPS sur les publications',
          requiredSafe: ['private'],
          questionLabel: 'Voit-il où tu habites ?',
          strangerRiskLabel: 'Visible sur la carte',
          strangerSafeLabel: 'Masqué (Moi seul)',
        },
        {
          id: 'photos',
          label: 'Qui peut voir mes photos et vidéos ?',
          requiredSafe: ['friends', 'private'],
          questionLabel: 'Voit-il tes albums ?',
          strangerRiskLabel: 'Ouvert à tous',
          strangerSafeLabel: 'Amis vérifiés',
        },
        {
          id: 'messages',
          label: 'Qui peut m’envoyer des messages privés ?',
          requiredSafe: ['friends', 'private'],
          questionLabel: 'Peut-il t’écrire en DM ?',
          strangerRiskLabel: 'Boîte ouverte à tous',
          strangerSafeLabel: 'Inconnus bloqués',
          useMessageLabels: true,
        },
        {
          id: 'voice',
          label: 'Chat vocal et demandes d’amis en jeu',
          requiredSafe: ['friends', 'private'],
          questionLabel: 'Entend-il ton micro ?',
          strangerRiskLabel: 'Salon public ouvert',
          strangerSafeLabel: 'Escouade d’amis',
          useMessageLabels: true,
        },
        {
          id: 'tracking',
          label: 'Partage d’activité avec des applis tierces',
          requiredSafe: ['private'],
          questionLabel: 'Suit-il tes autres applis ?',
          strangerRiskLabel: 'Suivi public actif',
          strangerSafeLabel: 'Désactivé',
        },
      ],
      en: [
        {
          id: 'location',
          label: 'GPS location on posts',
          requiredSafe: ['private'],
          questionLabel: 'Can strangers see where you are?',
          strangerRiskLabel: 'Visible on map',
          strangerSafeLabel: 'Hidden (Only Me)',
        },
        {
          id: 'photos',
          label: 'Who can view my photos & videos?',
          requiredSafe: ['friends', 'private'],
          questionLabel: 'Can they browse your albums?',
          strangerRiskLabel: 'Public to everyone',
          strangerSafeLabel: 'Trusted friends only',
        },
        {
          id: 'messages',
          label: 'Who can send direct messages?',
          requiredSafe: ['friends', 'private'],
          questionLabel: 'Can strangers DM you?',
          strangerRiskLabel: 'Inbox wide open',
          strangerSafeLabel: 'Strangers blocked',
          useMessageLabels: true,
        },
        {
          id: 'voice',
          label: 'Voice chat & multiplayer invites',
          requiredSafe: ['friends', 'private'],
          questionLabel: 'Can random players voice-chat?',
          strangerRiskLabel: 'Open public lobby',
          strangerSafeLabel: 'Squad friends only',
          useMessageLabels: true,
        },
        {
          id: 'tracking',
          label: 'Cross-app activity & data sharing',
          requiredSafe: ['private'],
          questionLabel: 'Is third-party tracking on?',
          strangerRiskLabel: 'Sharing enabled',
          strangerSafeLabel: 'Blocked (Only Me)',
        },
      ],
    };

    const dialCount = ageGroup === '13–14' ? 5 : ageGroup === '11–12' ? 4 : 3;
    const dials = allDials[language].slice(0, dialCount);

    const labels = {
      es: {
        title: 'El Dial de Privacidad',
        subtitle:
          ageGroup === '13–14'
            ? 'Blinda 5 controles incluyendo rastreo externo y GPS'
            : ageGroup === '11–12'
            ? 'Configura 4 escudos de perfil y chat de voz'
            : 'Ajusta los 3 diales para ocultar tus datos',
        levels: { public: 'Público', friends: 'Amigos', private: 'Solo yo' },
        msgLevels: { public: 'Todos', friends: 'Amigos', private: 'Nadie' },
        previewTitle: 'Vista previa de un desconocido:',
        auditBtn: 'Verificar y Sellar Perfil',
        errorFeedback:
          'Aún quedan puertas abiertas para desconocidos: el GPS y el rastreo deben estar en "Solo yo" y ningún ajuste debe quedar en "Público".',
        takeaway:
          'Revisa siempre tus ajustes de privacidad al crear una cuenta: apaga la ubicación GPS pública, limita mensajes y voz a amigos reales y bloquea el rastreo entre apps.',
      },
      fr: {
        title: 'Le Cadran de Confidentialité',
        subtitle:
          ageGroup === '13–14'
            ? 'Verrouille 5 réglages dont le pistage tiers et le GPS'
            : ageGroup === '11–12'
            ? 'Configure 4 boucliers de profil et chat vocal'
            : 'Règle les 3 curseurs pour masquer tes données',
        levels: { public: 'Public', friends: 'Amis', private: 'Moi seul' },
        msgLevels: { public: 'Tous', friends: 'Amis', private: 'Personne' },
        previewTitle: 'Ce que voit un inconnu en ligne :',
        auditBtn: 'Auditer & Verrouiller le Profil',
        errorFeedback:
          'Il reste des failles visibles pour les inconnus : la position GPS et le suivi doivent être sur "Moi seul", et rien ne doit rester "Public".',
        takeaway:
          'Vérifie toujours les paramètres dès l’inscription : coupe le GPS public, limite messages et micro aux vrais amis et refuse le pistage tiers.',
      },
      en: {
        title: 'The Privacy Dial',
        subtitle:
          ageGroup === '13–14'
            ? 'Lock down 5 controls including cross-app tracking & GPS'
            : ageGroup === '11–12'
            ? 'Secure 4 profile & voice-lobby privacy dials'
            : 'Adjust all 3 dials to shield your personal info',
        levels: { public: 'Public', friends: 'Friends', private: 'Only Me' },
        msgLevels: { public: 'Anyone', friends: 'Friends', private: 'Nobody' },
        previewTitle: 'Live stranger view preview:',
        auditBtn: 'Verify & Lock Privacy Shield',
        errorFeedback:
          'A stranger can still reach exposed data: set GPS location and cross-app tracking to "Only Me", and keep zero dials on "Public".',
        takeaway:
          'Check privacy controls on every new app: turn off public GPS location, restrict DMs and voice lobbies to real friends, and block cross-app tracking.',
      },
    }[language];

    return { dials, labels };
  }, [ageGroup, language]);

  const [values, setValues] = useState<Record<string, DialValue>>({
    location: 'public',
    photos: 'public',
    messages: 'public',
    voice: 'public',
    tracking: 'public',
  });
  const [auditAttempts, setAuditAttempts] = useState(0);
  const [showError, setShowError] = useState(false);
  const [finished, setFinished] = useState(false);

  const safeCount = copy.dials.filter((d) => d.requiredSafe.includes(values[d.id])).length;
  const allSafe = safeCount === copy.dials.length;

  const handleSetDial = (id: string, val: DialValue) => {
    playGameSound('tap');
    setShowError(false);
    setValues((prev) => ({ ...prev, [id]: val }));
  };

  const handleVerify = () => {
    const nextAttempts = auditAttempts + 1;
    setAuditAttempts(nextAttempts);
    if (!allSafe) {
      playGameSound('wrong');
      setShowError(true);
      return;
    }
    playGameSound('win');
    setFinished(true);
  };

  const handleReplay = () => {
    setValues({
      location: 'public',
      photos: 'public',
      messages: 'public',
      voice: 'public',
      tracking: 'public',
    });
    setAuditAttempts(0);
    setShowError(false);
    setFinished(false);
  };

  if (finished) {
    const accuracy = Math.max(65, Math.round((1 / Math.max(1, auditAttempts)) * 100));
    const score = copy.dials.length * 100 + (auditAttempts === 1 ? 150 : 50);
    const stats: GameResultStats = {
      stars: computeStars(accuracy, ageGroup),
      accuracy,
      score,
      streakMax: safeCount,
      ageGroup,
    };
    return (
      <div className="flex-1 min-h-0 w-full flex flex-col p-4 sm:p-6 bg-slate-50 overflow-y-auto scrollbar-none">
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
    <div className="flex-1 min-h-0 w-full max-w-full flex flex-col p-3.5 sm:p-5 bg-slate-50 text-slate-800 select-none overflow-y-auto overflow-x-hidden scrollbar-none space-y-4 pb-8">
      <GameHud
        title={copy.labels.title}
        subtitle={copy.labels.subtitle}
        icon={<Sliders className="w-5 h-5" />}
        accentColor="cyan"
        ageGroup={ageGroup}
        currentStep={safeCount}
        totalSteps={copy.dials.length}
        score={safeCount * 100}
        streak={safeCount}
      />

      {/* Interactive Dials */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-200/80 space-y-4">
        {copy.dials.map((dial) => {
          const curr = values[dial.id];
          const isDialSafe = dial.requiredSafe.includes(curr);
          const labelsMap = dial.useMessageLabels ? copy.labels.msgLevels : copy.labels.levels;

          return (
            <div key={dial.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 gap-2">
                <span className="flex items-center gap-1.5">
                  {isDialSafe ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  )}
                  <span>{dial.label}</span>
                </span>
                <span
                  className={`text-[11px] uppercase font-black shrink-0 ${
                    isDialSafe ? 'text-emerald-700' : 'text-rose-600'
                  }`}
                >
                  {labelsMap[curr]}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl">
                {(['public', 'friends', 'private'] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => handleSetDial(dial.id, level)}
                    className={`py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                      curr === level
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {level === 'public' && <Globe className="w-3.5 h-3.5" />}
                    {level === 'friends' && <Users className="w-3.5 h-3.5" />}
                    {level === 'private' && <Lock className="w-3.5 h-3.5" />}
                    <span>{labelsMap[level]}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Stranger Preview */}
      <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80 space-y-2.5">
        <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
          <Eye className="w-4 h-4 text-sky-600" />
          <span>{copy.labels.previewTitle}</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs space-y-2">
          {copy.dials.map((dial) => {
            const isDialSafe = dial.requiredSafe.includes(values[dial.id]);
            return (
              <div key={dial.id} className="flex items-center justify-between gap-2">
                <span className="text-slate-600">{dial.questionLabel}</span>
                <span className={`font-black shrink-0 ${isDialSafe ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {isDialSafe ? dial.strangerSafeLabel : dial.strangerRiskLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {showError && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-xs sm:text-sm font-bold text-amber-950 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>{copy.labels.errorFeedback}</span>
        </div>
      )}

      <button
        type="button"
        onClick={handleVerify}
        className={`w-full py-4 rounded-2xl font-black text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] ${
          allSafe
            ? 'bg-gradient-to-r from-sky-500 to-cyan-600 text-white shadow-lg shadow-sky-500/20 hover:from-sky-400 hover:to-cyan-500'
            : 'bg-slate-800 text-white hover:bg-slate-900'
        }`}
      >
        <ShieldCheck className="w-5 h-5" />
        <span>{copy.labels.auditBtn}</span>
      </button>
    </div>
  );
};
