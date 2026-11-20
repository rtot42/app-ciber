import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Sparkles, CheckCircle2, XCircle, ArrowRight, ScanSearch } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { ChildAgeGroup, GameResultStats } from '../../types';
import { GameHud, GameVictorySummary } from './GameShell';
import { computeStars } from '../../utils/ageDifficulty';
import { playGameSound } from '../../utils/gameAudio';

interface AiDetectorGameProps {
  onComplete: (stats?: GameResultStats) => void;
  ageGroup?: ChildAgeGroup;
}

interface ForensicRound {
  id: string;
  prompt: string;
  aiSide: 'a' | 'b';
  cardA: { label: string; artKind: 'astronaut-real' | 'avatar-real' | 'voice-real' | 'qr-real' };
  cardB: { label: string; artKind: 'astronaut-ai' | 'avatar-ai' | 'voice-ai' | 'qr-ai' };
  artifactExplanation: string;
}

export const AiDetectorGame: React.FC<AiDetectorGameProps> = ({
  onComplete,
  ageGroup = '8–10' as ChildAgeGroup,
}) => {
  const { language } = useLanguage();

  const copy = useMemo(() => {
    const esRounds: ForensicRound[] = [
      {
        id: 'r1',
        prompt: 'Inspecciona las manos, el casco y el letrero del fondo. ¿Cuál fue generada por IA?',
        aiSide: 'b',
        cardA: { label: 'Captura A · Misión Orbital', artKind: 'astronaut-real' },
        cardB: { label: 'Captura B · Misión Orbital', artKind: 'astronaut-ai' },
        artifactExplanation:
          'La Captura B tiene un guante con 6 dedos asimétricos y letras deformes ("N4S4#") en el fondo, fallo típico de modelos de imagen.',
      },
      {
        id: 'r2',
        prompt: 'Observa el avatar del perfil gamer: lentes, reflejos y placa trasera.',
        aiSide: 'b',
        cardA: { label: 'Perfil A · Jugador Torneo', artKind: 'avatar-real' },
        cardB: { label: 'Perfil B · Jugador Torneo', artKind: 'avatar-ai' },
        artifactExplanation:
          'El Perfil B muestra patillas de gafas que desaparecen en el pelo, pupilas irregulares y un texto ilegible en el trofeo.',
      },
      {
        id: 'r3',
        prompt: 'Audio urgente de "un familiar" pidiendo dinero: analiza la onda y el contexto.',
        aiSide: 'b',
        cardA: { label: 'Nota A · Llamada Verificada', artKind: 'voice-real' },
        cardB: { label: 'Nota B · Voz Clonada IA', artKind: 'voice-ai' },
        artifactExplanation:
          'Los clones de voz IA suelen sonar sin respiración natural, con cortes metálicos entre sílabas y exigen urgencia secreta.',
      },
      {
        id: 'r4',
        prompt: 'Comprobante de premio digital: inspecciona los detalles del ticket y código QR.',
        aiSide: 'b',
        cardA: { label: 'Ticket A · Tienda Oficial', artKind: 'qr-real' },
        cardB: { label: 'Ticket B · Sorteo Viral', artKind: 'qr-ai' },
        artifactExplanation:
          'El Ticket B contiene bordes borrosos alrededor del QR y números mezclados incoherentes típicos de documentos sintéticos.',
      },
    ];

    const frRounds: ForensicRound[] = [
      {
        id: 'r1',
        prompt: 'Observe bien les mains, la visière et le panneau au fond. Quelle image vient d’une IA ?',
        aiSide: 'b',
        cardA: { label: 'Capture A · Mission Orbitale', artKind: 'astronaut-real' },
        cardB: { label: 'Capture B · Mission Orbitale', artKind: 'astronaut-ai' },
        artifactExplanation:
          'La Capture B montre un gant à 6 doigts et des lettres déformées ("N4S4#") à l’arrière-plan.',
      },
      {
        id: 'r2',
        prompt: 'Examine cet avatar de profil : lunettes, reflets et trophée derrière.',
        aiSide: 'b',
        cardA: { label: 'Profil A · Joueur Tournoi', artKind: 'avatar-real' },
        cardB: { label: 'Profil B · Joueur Tournoi', artKind: 'avatar-ai' },
        artifactExplanation:
          'Sur le Profil B, les branches des lunettes fusionnent avec les oreilles et le texte du trophée est illisible.',
      },
      {
        id: 'r3',
        prompt: 'Message vocal urgent d’un « proche » demandant de l’argent : analyse l’onde sonore.',
        aiSide: 'b',
        cardA: { label: 'Audio A · Appel Vérifié', artKind: 'voice-real' },
        cardB: { label: 'Audio B · Voix Clonée IA', artKind: 'voice-ai' },
        artifactExplanation:
          'Les clones vocaux IA manquent de respiration naturelle, présentent des coupures métalliques et imposent l’urgence.',
      },
      {
        id: 'r4',
        prompt: 'Reçu de gain numérique : vérifie la précision du QR code et des chiffres.',
        aiSide: 'b',
        cardA: { label: 'Reçu A · Boutique Officielle', artKind: 'qr-real' },
        cardB: { label: 'Reçu B · Concours Viral', artKind: 'qr-ai' },
        artifactExplanation:
          'Le Reçu B a un QR code fondu aux bords flous et des caractères incohérents générés synthétiquement.',
      },
    ];

    const enRounds: ForensicRound[] = [
      {
        id: 'r1',
        prompt: 'Inspect the hands, visor reflection, and background sign. Which image is AI-generated?',
        aiSide: 'b',
        cardA: { label: 'Frame A · Orbital Mission', artKind: 'astronaut-real' },
        cardB: { label: 'Frame B · Orbital Mission', artKind: 'astronaut-ai' },
        artifactExplanation:
          'Frame B reveals a 6-fingered glove and warped gibberish letters ("N4S4#") on the background badge.',
      },
      {
        id: 'r2',
        prompt: 'Inspect this gaming profile avatar: glasses symmetry, pupils, and shelf sign.',
        aiSide: 'b',
        cardA: { label: 'Profile A · Tournament Player', artKind: 'avatar-real' },
        cardB: { label: 'Profile B · Tournament Player', artKind: 'avatar-ai' },
        artifactExplanation:
          'Profile B shows asymmetrical glasses melting into the temple, mismatched eyes, and garbled trophy text.',
      },
      {
        id: 'r3',
        prompt: 'Urgent voice note from a "relative" asking for money: analyze the audio signal.',
        aiSide: 'b',
        cardA: { label: 'Clip A · Verified Call', artKind: 'voice-real' },
        cardB: { label: 'Clip B · AI Voice Clone', artKind: 'voice-ai' },
        artifactExplanation:
          'AI voice clones flatten breathing pauses, introduce metallic waveform glitches, and pressure immediate secrecy.',
      },
      {
        id: 'r4',
        prompt: 'Prize receipt audit: inspect the QR code geometry and printed digits.',
        aiSide: 'b',
        cardA: { label: 'Receipt A · Official Store', artKind: 'qr-real' },
        cardB: { label: 'Receipt B · Viral Giveaway', artKind: 'qr-ai' },
        artifactExplanation:
          'Receipt B has a blurred asymmetrical QR matrix and scrambled numbers typical of synthetic receipts.',
      },
    ];

    const pool = language === 'fr' ? frRounds : language === 'en' ? enRounds : esRounds;
    const count = ageGroup === '13–14' ? 4 : ageGroup === '11–12' ? 3 : 2;
    const rounds = pool.slice(0, count);

    const labels = {
      es: {
        title: 'Laboratorio Detector de IA',
        subtitle: `Desenmascara ${count} medios sintéticos y deepfakes`,
        correctTitle: '¡Artefacto IA detectado!',
        wrongTitle: '¡Esta era la imagen sintética!',
        nextBtn: 'Siguiente Caso',
        takeaway:
          'Para detectar contenido generado por IA, inspecciona dedos, reflejos en gafas, texto de fondo, audio sin pausas naturales y siempre confirma la fuente por otro canal.',
      },
      fr: {
        title: 'Laboratoire Détecteur IA',
        subtitle: `Démasque ${count} médias synthétiques & deepfakes`,
        correctTitle: 'Artefact IA repéré !',
        wrongTitle: 'Voici les indices synthétiques :',
        nextBtn: 'Cas Suivant',
        takeaway:
          'Pour repérer une IA ou un deepfake, vérifie les mains, les reflets de lunettes, les textes du décor, le souffle de la voix et confirme toujours par un autre moyen.',
      },
      en: {
        title: 'AI & Deepfake Forensics Lab',
        subtitle: `Spot ${count} synthetic media & deepfake clues`,
        correctTitle: 'Synthetic artifact caught!',
        wrongTitle: 'Here is what gave the AI away:',
        nextBtn: 'Next Case',
        takeaway:
          'To spot AI fakes, inspect hands, glasses symmetry, background typography, unnatural audio cadence, and always confirm urgent requests on a separate trusted channel.',
      },
    }[language];

    return { rounds, labels };
  }, [ageGroup, language]);

  const [idx, setIdx] = useState(0);
  // Deterministic visual swap on odd rounds so answer isn't always right card!
  const swapped = idx % 2 === 1;
  const [pickedSide, setPickedSide] = useState<'a' | 'b' | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(1);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = copy.rounds[idx];
  const leftCard = swapped ? current.cardB : current.cardA;
  const rightCard = swapped ? current.cardA : current.cardB;
  const effectiveAiSide: 'a' | 'b' = swapped
    ? current.aiSide === 'b'
      ? 'a'
      : 'b'
    : current.aiSide;

  const renderIllustration = (kind: ForensicRound['cardA']['artKind'] | ForensicRound['cardB']['artKind']) => {
    if (kind === 'astronaut-real' || kind === 'astronaut-ai') {
      const isAi = kind === 'astronaut-ai';
      return (
        <svg viewBox="0 0 160 110" className="w-full h-28 rounded-xl bg-slate-900">
          <rect x="8" y="8" width="44" height="16" rx="3" fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />
          <text x="30" y="19" textAnchor="middle" fill="#7DD3FC" fontSize="8" fontFamily="monospace" fontWeight="bold">
            {isAi ? 'N4$4#' : 'NASA'}
          </text>
          {/* Helmet */}
          <circle cx="88" cy="48" r="24" fill="#E2E8F0" />
          <ellipse cx="88" cy="48" rx="16" ry="13" fill={isAi ? '#7C3AED' : '#0EA5E9'} />
          {/* Visor glitch */}
          {isAi ? (
            <path d="M76 42 Q88 55 100 40" stroke="#F472B6" strokeWidth="2.5" fill="none" />
          ) : (
            <path d="M78 42 Q84 38 92 41" stroke="#BAE6FD" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          )}
          {/* Hand fingers */}
          <rect x="26" y="72" width="22" height="22" rx="6" fill="#CBD5E1" />
          {(isAi ? [25, 29.5, 34, 38.5, 43, 47] : [27, 32, 37, 42, 46]).map((x, i) => (
            <rect key={i} x={x} y={60} width="3.5" height="14" rx="1.5" fill="#F8FAFC" />
          ))}
        </svg>
      );
    }

    if (kind === 'avatar-real' || kind === 'avatar-ai') {
      const isAi = kind === 'avatar-ai';
      return (
        <svg viewBox="0 0 160 110" className="w-full h-28 rounded-xl bg-indigo-950">
          <rect x="108" y="14" width="42" height="18" rx="3" fill="#312E81" />
          <text x="129" y="26" textAnchor="middle" fill="#FDE047" fontSize="8" fontFamily="monospace" fontWeight="bold">
            {isAi ? 'W1N#?' : 'MVP 1'}
          </text>
          <circle cx="65" cy="56" r="24" fill="#FDBA74" />
          {/* Glasses */}
          <rect x="44" y="48" width="16" height="11" rx="2" fill="none" stroke="#1E293B" strokeWidth="2.5" />
          <rect
            x="68"
            y={isAi ? '45' : '48'}
            width={isAi ? '20' : '16'}
            height={isAi ? '14' : '11'}
            rx={isAi ? '5' : '2'}
            fill="none"
            stroke="#1E293B"
            strokeWidth="2.5"
          />
          <line x1="60" y1="52" x2="68" y2="52" stroke="#1E293B" strokeWidth="2" />
        </svg>
      );
    }

    if (kind === 'voice-real' || kind === 'voice-ai') {
      const isAi = kind === 'voice-ai';
      const bars = isAi
        ? [28, 28, 28, 29, 28, 4, 29, 28, 28, 28]
        : [10, 22, 16, 28, 12, 6, 24, 18, 11, 20];
      return (
        <svg viewBox="0 0 160 110" className="w-full h-28 rounded-xl bg-slate-900">
          <text x="80" y="22" textAnchor="middle" fill={isAi ? '#FDA4AF' : '#6EE7B7'} fontSize="8" fontFamily="monospace">
            {isAi ? 'PITCH CLIP · 0 PAUSE' : 'NATURAL BREATH · 44kHz'}
          </text>
          {bars.map((h, i) => (
            <rect
              key={i}
              x={22 + i * 12}
              y={60 - h / 2}
              width="6"
              height={h}
              rx="2"
              fill={isAi ? '#F43F5E' : '#10B981'}
            />
          ))}
        </svg>
      );
    }

    const isAi = kind === 'qr-ai';
    return (
      <svg viewBox="0 0 160 110" className="w-full h-28 rounded-xl bg-slate-100">
        <rect x="20" y="14" width="120" height="82" rx="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
        <text x="80" y="34" textAnchor="middle" fill="#0F172A" fontSize="9" fontFamily="monospace" fontWeight="bold">
          {isAi ? 'ID #9X?0-A!' : 'ID #4820-OK'}
        </text>
        <rect x="60" y="44" width="40" height="40" rx={isAi ? '8' : '2'} fill="#0F172A" opacity={isAi ? '0.65' : '1'} />
        <rect x="66" y="50" width="10" height="10" fill="#FFFFFF" />
        <rect x="84" y={isAi ? '53' : '50'} width={isAi ? '13' : '10'} height="10" fill="#FFFFFF" />
        <rect x="66" y="68" width="10" height="10" fill="#FFFFFF" />
      </svg>
    );
  };

  const handleSelect = (side: 'a' | 'b') => {
    if (pickedSide) return;
    setPickedSide(side);
    const isCorrect = side === effectiveAiSide;
    if (isCorrect) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setMaxStreak((m) => Math.max(m, nextStreak));
      setCorrectCount((c) => c + 1);
      setScore((s) => s + 130 + nextStreak * 25);
      playGameSound(nextStreak > 1 ? 'combo' : 'correct');
    } else {
      setStreak(0);
      playGameSound('wrong');
    }
  };

  const handleNext = () => {
    if (idx < copy.rounds.length - 1) {
      setIdx((i) => i + 1);
      setPickedSide(null);
    } else {
      playGameSound('win');
      setFinished(true);
    }
  };

  const handleReplay = () => {
    setIdx(0);
    setPickedSide(null);
    setScore(0);
    setStreak(0);
    setMaxStreak(1);
    setCorrectCount(0);
    setFinished(false);
  };

  const answered = idx + (pickedSide ? 1 : 0);
  const accuracy = answered > 0 ? Math.round((correctCount / answered) * 100) : 100;

  if (finished) {
    const finalAcc = Math.round((correctCount / copy.rounds.length) * 100);
    const stats: GameResultStats = {
      stars: computeStars(finalAcc, ageGroup),
      accuracy: finalAcc,
      score,
      streakMax: maxStreak,
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

  const isRight = pickedSide === effectiveAiSide;

  return (
    <div className="flex-1 min-h-0 w-full max-w-full flex flex-col p-3.5 sm:p-5 bg-slate-50 text-slate-800 select-none overflow-y-auto overflow-x-hidden scrollbar-none space-y-4 pb-8">
      <GameHud
        title={copy.labels.title}
        subtitle={copy.labels.subtitle}
        icon={<Sparkles className="w-5 h-5" />}
        accentColor="purple"
        ageGroup={ageGroup}
        currentStep={idx + 1}
        totalSteps={copy.rounds.length}
        score={score}
        streak={streak}
        accuracy={answered > 0 ? accuracy : undefined}
      />

      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-200/80 space-y-4">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-slate-800">
          <ScanSearch className="w-4 h-4 text-purple-600 shrink-0" />
          <span>{current.prompt}</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {(['a', 'b'] as const).map((side) => {
            const card = side === 'a' ? leftCard : rightCard;
            const label = side === 'a' ? current.cardA.label : current.cardB.label;
            const isAiCard = side === effectiveAiSide;
            const isPicked = pickedSide === side;

            return (
              <button
                key={side}
                type="button"
                disabled={!!pickedSide}
                onClick={() => handleSelect(side)}
                className={`rounded-2xl border-2 p-2.5 text-left transition flex flex-col justify-between cursor-pointer active:scale-[0.98] ${
                  pickedSide
                    ? isAiCard
                      ? 'border-emerald-500 bg-emerald-50/70'
                      : isPicked
                      ? 'border-rose-400 bg-rose-50/70'
                      : 'border-slate-200 bg-white opacity-75'
                    : 'border-slate-200 bg-white hover:border-purple-400'
                }`}
              >
                {renderIllustration(card.artKind)}
                <div className="pt-2 text-xs font-black text-slate-900 leading-tight">{label}</div>
              </button>
            );
          })}
        </div>

        {pickedSide && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3.5 rounded-2xl border text-xs sm:text-sm space-y-1 ${
              isRight
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}
          >
            <div className="font-black flex items-center gap-1.5">
              {isRight ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <XCircle className="w-4 h-4 text-amber-600" />
              )}
              <span>{isRight ? copy.labels.correctTitle : copy.labels.wrongTitle}</span>
            </div>
            <p className="font-medium leading-relaxed">{current.artifactExplanation}</p>
          </motion.div>
        )}
      </div>

      {pickedSide && (
        <button
          type="button"
          onClick={handleNext}
          className="w-full py-4 rounded-2xl font-black text-sm sm:text-base bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition"
        >
          <span>{copy.labels.nextBtn}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
