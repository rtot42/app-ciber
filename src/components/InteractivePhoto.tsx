import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Info,
  CheckCircle2,
  MapPinOff,
  Camera,
  ScanEye,
  AlertTriangle,
} from 'lucide-react';
import { ChildAgeGroup, GameHotspot, GameResultStats, MascotExpression } from '../types';
import { CiberMascot } from './CiberMascot';
import { useLanguage } from '../i18n/LanguageContext';
import { GameHud, GameVictorySummary } from './games/GameShell';
import { computeStars } from '../utils/ageDifficulty';
import { playGameSound } from '../utils/gameAudio';

interface InteractivePhotoProps {
  onAllRisksFound: (stats?: GameResultStats) => void;
  onCiberReact: (expression: MascotExpression) => void;
  ageGroup?: ChildAgeGroup;
}

export const InteractivePhoto: React.FC<InteractivePhotoProps> = ({
  onAllRisksFound,
  onCiberReact,
  ageGroup = '8–10' as ChildAgeGroup,
}) => {
  const { hotspots, language } = useLanguage();
  const [selectedHotspots, setSelectedHotspots] = useState<string[]>([]);
  const [activeFeedback, setActiveFeedback] = useState<GameHotspot | null>(null);
  const [wrongTaps, setWrongTaps] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(1);
  const [score, setScore] = useState(0);
  const [exifCleared, setExifCleared] = useState(ageGroup !== '13–14');
  const [finished, setFinished] = useState(false);

  const sensitiveHotspots = useMemo(
    () => hotspots.filter((h) => h.isSensitiveRisk),
    [hotspots]
  );

  // Scale required risks & stage count by age tier
  const targetRisks = useMemo(() => {
    if (ageGroup === '8–10') return Math.min(4, sensitiveHotspots.length);
    return sensitiveHotspots.length; // 5 for 11-12 and 13-14
  }, [ageGroup, sensitiveHotspots.length]);

  const foundSensitiveCount = selectedHotspots.filter(
    (id) => hotspots.find((h) => h.id === id)?.isSensitiveRisk
  ).length;

  const extraExifStep = ageGroup === '13–14' ? 1 : 0;
  const totalSteps = targetRisks + extraExifStep;
  const completedSteps =
    Math.min(foundSensitiveCount, targetRisks) + (ageGroup === '13–14' && exifCleared ? 1 : 0);
  const allRisksDetected = foundSensitiveCount >= targetRisks && exifCleared;

  const copy = useMemo(() => {
    if (language === 'fr') {
      return {
        title: 'Chasse aux Risques Photo',
        subtitle:
          ageGroup === '13–14'
            ? 'Mode Pro : sans indices visuels + purge EXIF GPS'
            : ageGroup === '11–12'
            ? 'Repère tous les détails privés cachés'
            : 'Touche les zones qui révèlent tes données',
        initialTip:
          ageGroup === '13–14'
            ? `Mode Stratège : repère les ${targetRisks} fuites de données sans surbrillance puis nettoie les métadonnées GPS.`
            : `Mission : examine la photo et touche les ${targetRisks} éléments qui révèlent des données privées.`,
        completeBtn: 'Voir le Résumé & Récompenses',
        findMoreBtn: (curr: number, total: number) =>
          `Trouve les données privées (${curr}/${total})`,
        exifTitle: 'Métadonnées EXIF détectées avant publication',
        exifCoords: 'GPS : 40.4168° N, 3.7038° W · Modèle : Phone 15 Pro',
        exifAction: 'Supprimer GPS & EXIF',
        exifDone: 'Métadonnées EXIF purgées',
        takeaway:
          'Avant de publier une photo, vérifie les logos d’école, numéros de rue, étiquettes de sac, colliers d’animaux et supprime la géolocalisation EXIF.',
        skyMiss: 'Zone neutre ! Cherche des indices écrits, logos, numéros ou tags visibles.',
      };
    }
    if (language === 'en') {
      return {
        title: 'Photo Risk Forensics',
        subtitle:
          ageGroup === '13–14'
            ? 'Pro Mode: zero outline hints + EXIF GPS scrub'
            : ageGroup === '11–12'
            ? 'Spot every hidden personal detail'
            : 'Tap items that reveal private info',
        initialTip:
          ageGroup === '13–14'
            ? `Pro Strategist: find all ${targetRisks} data leaks with hints disabled, then strip hidden GPS metadata.`
            : `Mission: inspect the photo carefully and tap the ${targetRisks} clues that expose private details.`,
        completeBtn: 'View Debrief & Claim Rewards',
        findMoreBtn: (curr: number, total: number) =>
          `Find remaining privacy risks (${curr}/${total})`,
        exifTitle: 'Hidden EXIF Metadata Detected',
        exifCoords: 'GPS: 40.4168° N, 3.7038° W · Camera: Phone 15 Pro',
        exifAction: 'Strip GPS & EXIF Tags',
        exifDone: 'EXIF Location Stripped',
        takeaway:
          'Always scan photos for school crests, house numbers, name tags, phone numbers, and hidden GPS EXIF tags before posting online.',
        skyMiss: 'Clean spot! Look closer for readable text, crests, numbers, or tags.',
      };
    }
    return {
      title: 'Detector de Riesgos en Fotos',
      subtitle:
        ageGroup === '13–14'
          ? 'Modo Pro: sin guías visuales + limpieza EXIF GPS'
          : ageGroup === '11–12'
          ? 'Detecta cada detalle privado oculto'
          : 'Toca los datos privados visibles en la foto',
      initialTip:
        ageGroup === '13–14'
          ? `Estratega Pro: encuentra las ${targetRisks} fugas sin guías y luego borra la ubicación GPS oculta (EXIF).`
          : `Misión: examina la imagen y toca los ${targetRisks} elementos que exponen datos privados.`,
      completeBtn: 'Ver Resumen y Reclamar Premio',
      findMoreBtn: (curr: number, total: number) =>
        `Encuentra los riesgos privados (${curr}/${total})`,
      exifTitle: 'Metadatos EXIF ocultos detectados',
      exifCoords: 'GPS: 40.4168° N, 3.7038° W · Cámara: Phone 15 Pro',
      exifAction: 'Limpiar GPS y EXIF',
      exifDone: 'Ubicación EXIF eliminada',
      takeaway:
        'Antes de subir una foto, revisa escudos escolares, números de calle, etiquetas con nombres, collares con teléfono y elimina los metadatos GPS (EXIF).',
      skyMiss: '¡Zona segura! Busca letras, escudos, números de casa o etiquetas visibles.',
    };
  }, [language, ageGroup, targetRisks]);

  const handleTapHotspot = (hotspot: GameHotspot) => {
    const alreadyPicked = selectedHotspots.includes(hotspot.id);
    if (!alreadyPicked) {
      setSelectedHotspots((prev) => [...prev, hotspot.id]);
      if (hotspot.isSensitiveRisk) {
        const nextStreak = streak + 1;
        setStreak(nextStreak);
        setMaxStreak((m) => Math.max(m, nextStreak));
        setScore((s) => s + 120 + nextStreak * 25);
        playGameSound(nextStreak > 1 ? 'combo' : 'correct');
      } else {
        setWrongTaps((w) => w + 1);
        setStreak(0);
        playGameSound('tap');
      }
    } else {
      playGameSound('tap');
    }

    setActiveFeedback(hotspot);
    onCiberReact(hotspot.ciberReaction);
  };

  const handleMissTap = () => {
    setWrongTaps((w) => w + 1);
    setStreak(0);
    playGameSound('wrong');
    onCiberReact('thinking');
  };

  const handleStripExif = () => {
    if (exifCleared) return;
    setExifCleared(true);
    const nextStreak = streak + 1;
    setStreak(nextStreak);
    setMaxStreak((m) => Math.max(m, nextStreak));
    setScore((s) => s + 150);
    playGameSound('combo');
    onCiberReact('celebrating');
  };

  const totalAttempts = foundSensitiveCount + (ageGroup === '13–14' && exifCleared ? 1 : 0) + wrongTaps;
  const accuracy =
    totalAttempts > 0
      ? Math.max(40, Math.round(((totalSteps - Math.min(wrongTaps, totalSteps - 1)) / totalSteps) * 100))
      : 100;

  const finalAccuracy = Math.max(
    45,
    Math.min(100, Math.round((totalSteps / Math.max(totalSteps, totalSteps + wrongTaps)) * 100))
  );

  const handleFinish = () => {
    playGameSound('win');
    onCiberReact('celebrating');
    setFinished(true);
  };

  const handleReplay = () => {
    setSelectedHotspots([]);
    setActiveFeedback(null);
    setWrongTaps(0);
    setStreak(0);
    setMaxStreak(1);
    setScore(0);
    setExifCleared(ageGroup !== '13–14');
    setFinished(false);
    onCiberReact('happy');
  };

  if (finished) {
    const stats: GameResultStats = {
      stars: computeStars(finalAccuracy, ageGroup),
      accuracy: finalAccuracy,
      score,
      streakMax: maxStreak,
      ageGroup,
    };
    return (
      <div className="flex-1 min-h-0 w-full flex flex-col p-4 sm:p-6 bg-slate-50 overflow-y-auto scrollbar-none">
        <GameVictorySummary
          title={copy.title}
          takeaway={copy.takeaway}
          stats={stats}
          ageGroup={ageGroup}
          onReplay={handleReplay}
          onContinue={onAllRisksFound}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 w-full max-w-full flex flex-col bg-slate-50 overflow-y-auto overflow-x-hidden scrollbar-none p-3 sm:p-4 space-y-3 pb-6">
      <GameHud
        title={copy.title}
        subtitle={copy.subtitle}
        icon={<Camera className="w-5 h-5" />}
        accentColor="cyan"
        ageGroup={ageGroup}
        currentStep={completedSteps}
        totalSteps={totalSteps}
        score={score}
        streak={streak}
        accuracy={wrongTaps > 0 || completedSteps > 0 ? accuracy : undefined}
      />

      {/* Main Interactive Photo Illustration */}
      <div className="relative min-h-[300px] sm:min-h-[340px] w-full rounded-3xl bg-gradient-to-b from-sky-400 via-sky-200 to-emerald-300 overflow-hidden select-none border border-slate-200 shadow-sm">
        {/* Background tap catch for misses on Pro / Intermediate */}
        <div onClick={handleMissTap} className="w-full h-full">
          <svg viewBox="0 0 400 400" className="w-full h-full object-cover">
            <defs>
              <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="70%" stopColor="#BAE6FD" />
                <stop offset="100%" stopColor="#E0F2FE" />
              </linearGradient>
              <linearGradient id="grassGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4ADE80" />
                <stop offset="100%" stopColor="#16A34A" />
              </linearGradient>
            </defs>

            <rect width="400" height="280" fill="url(#skyGrad)" />
            <circle cx="340" cy="60" r="30" fill="#FDE047" opacity="0.9" />

            {/* School Gate */}
            <rect x="20" y="90" width="180" height="150" fill="#E2E8F0" rx="4" />
            <polygon points="10,90 110,40 210,90" fill="#DC2626" />

            {/* School Banner */}
            <g id="hs-school-name-art">
              <rect
                x="30"
                y="105"
                width="140"
                height="38"
                rx="6"
                fill="#1E293B"
                stroke="#F59E0B"
                strokeWidth="2"
              />
              <text
                x="100"
                y="122"
                textAnchor="middle"
                fill="#FDE047"
                fontSize="10"
                fontWeight="bold"
                letterSpacing="0.5"
              >
                COLEGIO
              </text>
              <text
                x="100"
                y="134"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="9"
                fontWeight="bold"
              >
                SAN PATRICIO
              </text>
            </g>

            {/* House & Street Number */}
            <rect x="270" y="110" width="110" height="130" fill="#FED7AA" rx="4" />
            <polygon points="260,110 325,70 390,110" fill="#B45309" />
            <rect x="300" y="170" width="36" height="70" fill="#78350F" rx="3" />
            <rect
              x="302"
              y="135"
              width="32"
              height="22"
              fill="#FFFFFF"
              stroke="#0284C7"
              strokeWidth="1.5"
              rx="3"
            />
            <text x="318" y="150" textAnchor="middle" fill="#0F172A" fontSize="11" fontWeight="900">
              Nº 42
            </text>
            <text x="318" y="155" textAnchor="middle" fill="#475569" fontSize="4.5" fontWeight="bold">
              ROBLES
            </text>

            {/* Lawn */}
            <rect x="0" y="240" width="400" height="160" fill="url(#grassGrad)" />
            <path d="M120 400 L180 240 L220 240 L280 400 Z" fill="#CBD5E1" opacity="0.6" />

            {/* Backpack */}
            <g id="hs-backpack-art">
              <rect x="60" y="280" width="65" height="75" rx="14" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
              <rect x="75" y="270" width="35" height="14" rx="4" fill="#1D4ED8" />
              <rect x="68" y="315" width="48" height="24" rx="4" fill="#FFFFFF" stroke="#000" strokeWidth="1" />
              <text x="92" y="327" textAnchor="middle" fill="#0F172A" fontSize="7" fontWeight="bold">
                ALUMNO:
              </text>
              <text x="92" y="335" textAnchor="middle" fill="#DC2626" fontSize="8" fontWeight="bold">
                LUCAS M.
              </text>
            </g>

            {/* Child Character */}
            <g id="child-character">
              <rect x="180" y="290" width="14" height="60" fill="#1E293B" rx="4" />
              <rect x="206" y="290" width="14" height="60" fill="#1E293B" rx="4" />
              <ellipse cx="186" cy="352" rx="11" ry="6" fill="#F97316" />
              <ellipse cx="214" cy="352" rx="11" ry="6" fill="#F97316" />

              <rect x="170" y="195" width="60" height="98" rx="10" fill="#1E3A8A" />
              <g id="hs-school-badge-art">
                <circle cx="185" cy="225" r="9" fill="#F59E0B" stroke="#FDE047" strokeWidth="1.5" />
                <path d="M181 222 L185 220 L189 222 L185 228 Z" fill="#1E3A8A" />
                <text x="185" y="232" textAnchor="middle" fill="#FFFFFF" fontSize="4.5" fontWeight="bold">
                  CSP
                </text>
              </g>

              <rect x="156" y="200" width="14" height="55" rx="7" fill="#1E3A8A" />
              <circle cx="163" cy="260" r="7" fill="#FBCFE8" />
              <rect x="230" y="200" width="14" height="55" rx="7" fill="#1E3A8A" />
              <circle cx="237" cy="260" r="7" fill="#FBCFE8" />

              <circle cx="200" cy="160" r="26" fill="#FBCFE8" />
              <path d="M174 155 Q200 130 226 155 Q215 142 200 142 Q185 142 174 155 Z" fill="#78350F" />
              <circle cx="200" cy="138" r="16" fill="#78350F" />
              <circle cx="192" cy="160" r="3" fill="#1E293B" />
              <circle cx="208" cy="160" r="3" fill="#1E293B" />
              <path d="M194 170 Q200 176 206 170" stroke="#DC2626" strokeWidth="2" fill="none" strokeLinecap="round" />
            </g>

            {/* Soccer Ball */}
            <g id="hs-soccer-ball-art">
              <circle cx="170" cy="350" r="18" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
              <polygon points="170,344 176,348 174,354 166,354 164,348" fill="#0F172A" />
              <line x1="170" y1="344" x2="170" y2="334" stroke="#0F172A" strokeWidth="1.5" />
              <line x1="176" y1="348" x2="185" y2="344" stroke="#0F172A" strokeWidth="1.5" />
            </g>

            {/* Pet Dog */}
            <g id="hs-pet-art">
              <ellipse cx="300" cy="330" rx="34" ry="24" fill="#D97706" />
              <circle cx="272" cy="310" r="18" fill="#D97706" />
              <ellipse cx="264" cy="300" rx="6" ry="12" fill="#92400E" />
              <ellipse cx="282" cy="300" rx="6" ry="12" fill="#92400E" />
              <circle cx="262" cy="315" r="5" fill="#0F172A" />
              <rect x="270" y="322" width="16" height="5" fill="#DC2626" rx="2" />
              <circle cx="278" cy="334" r="8" fill="#FDE047" stroke="#CA8A04" strokeWidth="1" />
              <text x="278" y="334" textAnchor="middle" fill="#0F172A" fontSize="4" fontWeight="bold">
                TEL:
              </text>
              <text x="278" y="339" textAnchor="middle" fill="#0F172A" fontSize="3.5" fontWeight="900">
                600-44-22
              </text>
              <path d="M330 324 Q345 315 340 305" stroke="#D97706" strokeWidth="6" strokeLinecap="round" fill="none" />
            </g>
          </svg>
        </div>

        {/* Age-Adaptive Overlay Hotspots */}
        {hotspots.map((hotspot) => {
          const isSelected = selectedHotspots.includes(hotspot.id);
          const unpickedStyle =
            ageGroup === '13–14'
              ? 'bg-transparent hover:bg-white/10'
              : ageGroup === '11–12'
              ? 'border border-dashed border-white/40 hover:bg-cyan-400/20'
              : 'hover:bg-cyan-400/20 border-2 border-dashed border-cyan-400/75 animate-pulse';

          return (
            <button
              key={hotspot.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleTapHotspot(hotspot);
              }}
              style={{
                left: `${hotspot.rect.x}%`,
                top: `${hotspot.rect.y}%`,
                width: `${hotspot.rect.width}%`,
                height: `${hotspot.rect.height}%`,
              }}
              className={`absolute rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                isSelected
                  ? hotspot.isSensitiveRisk
                    ? 'ring-2 ring-emerald-400 bg-emerald-500/30'
                    : 'ring-2 ring-sky-400 bg-sky-500/20'
                  : unpickedStyle
              }`}
            >
              {isSelected ? (
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shadow-lg ${
                    hotspot.isSensitiveRisk
                      ? 'bg-emerald-500 text-white'
                      : 'bg-sky-500 text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              ) : ageGroup === '8–10' ? (
                <div className="w-5 h-5 rounded-full bg-cyan-400/90 text-slate-950 flex items-center justify-center text-[10px] font-bold shadow-md">
                  ?
                </div>
              ) : ageGroup === '11–12' ? (
                <ScanEye className="w-4 h-4 text-white/70 drop-shadow" />
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Pro Tier EXIF Metadata Strip Challenge (13–14) */}
      {ageGroup === '13–14' && (
        <div
          className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
            exifCleared
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-amber-50 border-amber-300 text-amber-950'
          }`}
        >
          <div className="min-w-0">
            <div className="text-xs font-black flex items-center gap-1.5">
              {exifCleared ? (
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              )}
              <span>{exifCleared ? copy.exifDone : copy.exifTitle}</span>
            </div>
            <div className="text-[11px] font-mono text-slate-600 truncate mt-0.5">
              {exifCleared ? 'GPS: [REDACTED] · EXIF: Stripped' : copy.exifCoords}
            </div>
          </div>
          {!exifCleared && (
            <button
              type="button"
              onClick={handleStripExif}
              className="px-3.5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-95 transition"
            >
              <MapPinOff className="w-4 h-4" />
              <span>{copy.exifAction}</span>
            </button>
          )}
        </div>
      )}

      {/* Educational Feedback Panel */}
      <div className="p-4 bg-white border border-slate-200/80 rounded-3xl flex flex-col gap-3 shrink-0 shadow-xs">
        <AnimatePresence mode="wait">
          {activeFeedback ? (
            <motion.div
              key={activeFeedback.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className={`p-3.5 rounded-2xl border ${
                activeFeedback.isSensitiveRisk
                  ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                  : 'bg-sky-50/70 border-sky-200 text-sky-950'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <CiberMascot
                  size="sm"
                  expression={activeFeedback.ciberReaction}
                  className="shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm">
                    {activeFeedback.isSensitiveRisk ? (
                      <ShieldCheck className="w-4 h-4 text-rose-600" />
                    ) : (
                      <Info className="w-4 h-4 text-sky-600" />
                    )}
                    <span className={activeFeedback.isSensitiveRisk ? 'text-rose-900' : 'text-sky-900'}>
                      {activeFeedback.feedbackTitle}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm mt-1 text-slate-700 leading-relaxed font-normal">
                    {activeFeedback.feedbackText}
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700 flex items-center gap-3">
              <CiberMascot size="sm" expression="thinking" className="shrink-0" />
              <div className="text-xs sm:text-sm font-medium leading-relaxed">
                {wrongTaps > 0 ? copy.skyMiss : copy.initialTip}
              </div>
            </div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={handleFinish}
          disabled={!allRisksDetected}
          className={`w-full py-4 rounded-2xl font-black text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer ${
            allRisksDetected
              ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white shadow-lg shadow-emerald-500/25 active:scale-[0.98]'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200/60'
          }`}
        >
          <ShieldCheck className="w-5 h-5" />
          <span>
            {allRisksDetected
              ? copy.completeBtn
              : copy.findMoreBtn(foundSensitiveCount, targetRisks)}
          </span>
        </button>
      </div>
    </div>
  );
};
