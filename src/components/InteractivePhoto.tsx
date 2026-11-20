import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Info,
  CheckCircle2,
  MapPinOff,
  Camera,
  AlertTriangle,
  Eye,
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
    return sensitiveHotspots.length;
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
            ? 'Mode Pro : sans indices + purge EXIF GPS'
            : ageGroup === '11–12'
            ? 'Repère tous les détails privés cachés'
            : 'Touche les zones qui révèlent tes données',
        postAuthor: '@Lucas_M',
        postMeta: 'Brouillon avant publication',
        risksCounter: (curr: number, total: number) => `${curr}/${total} trouvés`,
        initialTip:
          ageGroup === '13–14'
            ? `Mode Stratège : repère les ${targetRisks} fuites de données sans repères puis nettoie les métadonnées GPS.`
            : `Examine la photo ci-dessus et touche les ${targetRisks} éléments qui révèlent des données privées.`,
        completeBtn: 'Voir le Résumé & Récompenses',
        findMoreBtn: (curr: number, total: number) =>
          `Trouve les données privées (${curr}/${total})`,
        exifTitle: 'Métadonnées EXIF détectées',
        exifCoords: 'GPS : 40.4168° N, 3.7038° W · Phone 15 Pro',
        exifAction: 'Purger GPS & EXIF',
        exifDone: 'Métadonnées EXIF purgées',
        takeaway:
          'Avant de publier une photo, vérifie les logos d’école, numéros de rue, étiquettes de sac, colliers d’animaux et supprime la géolocalisation EXIF.',
        skyMiss: 'Zone neutre ! Observe bien les pancartes, plaques, écussons et étiquettes.',
      };
    }
    if (language === 'en') {
      return {
        title: 'Photo Risk Forensics',
        subtitle:
          ageGroup === '13–14'
            ? 'Pro Mode: zero hints + EXIF GPS scrub'
            : ageGroup === '11–12'
            ? 'Spot every hidden personal detail'
            : 'Tap items that reveal private info',
        postAuthor: '@Lucas_M',
        postMeta: 'Pre-upload draft check',
        risksCounter: (curr: number, total: number) => `${curr}/${total} found`,
        initialTip:
          ageGroup === '13–14'
            ? `Pro Strategist: find all ${targetRisks} data leaks with hints disabled, then strip hidden GPS metadata.`
            : `Inspect the photo above carefully and tap the ${targetRisks} clues that expose private details.`,
        completeBtn: 'View Debrief & Claim Rewards',
        findMoreBtn: (curr: number, total: number) =>
          `Find remaining privacy risks (${curr}/${total})`,
        exifTitle: 'Hidden EXIF Metadata Detected',
        exifCoords: 'GPS: 40.4168° N, 3.7038° W · Phone 15 Pro',
        exifAction: 'Strip GPS & EXIF',
        exifDone: 'EXIF Location Stripped',
        takeaway:
          'Always scan photos for school crests, house numbers, name tags, phone numbers, and hidden GPS EXIF tags before posting online.',
        skyMiss: 'Clean spot! Look closer at signs, house plaques, uniform crests, and tags.',
      };
    }
    return {
      title: 'Detector de Riesgos en Fotos',
      subtitle:
        ageGroup === '13–14'
          ? 'Modo Pro: sin guías + limpieza EXIF GPS'
          : ageGroup === '11–12'
          ? 'Detecta cada detalle privado oculto'
          : 'Toca los datos privados visibles en la foto',
      postAuthor: '@Lucas_M',
      postMeta: 'Vista previa antes de publicar',
      risksCounter: (curr: number, total: number) => `${curr}/${total} hallados`,
      initialTip:
        ageGroup === '13–14'
          ? `Estratega Pro: encuentra las ${targetRisks} fugas sin guías y luego borra la ubicación GPS oculta (EXIF).`
          : `Examina la foto con atención y toca los ${targetRisks} elementos que exponen datos privados.`,
      completeBtn: 'Ver Resumen y Reclamar Premio',
      findMoreBtn: (curr: number, total: number) =>
        `Encuentra los riesgos privados (${curr}/${total})`,
      exifTitle: 'Metadatos EXIF ocultos detectados',
      exifCoords: 'GPS: 40.4168° N, 3.7038° W · Phone 15 Pro',
      exifAction: 'Limpiar GPS y EXIF',
      exifDone: 'Ubicación EXIF eliminada',
      takeaway:
        'Antes de subir una foto, revisa escudos escolares, números de calle, etiquetas con nombres, collares con teléfono y elimina los metadatos GPS (EXIF).',
      skyMiss: '¡Zona segura! Fíjate bien en carteles, placas, escudos y etiquetas escritas.',
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

  const totalAttempts =
    foundSensitiveCount + (ageGroup === '13–14' && exifCleared ? 1 : 0) + wrongTaps;
  const accuracy =
    totalAttempts > 0
      ? Math.max(
          40,
          Math.round(((totalSteps - Math.min(wrongTaps, totalSteps - 1)) / totalSteps) * 100)
        )
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
      <div className="flex-1 min-h-0 w-full flex flex-col p-3.5 sm:p-5 bg-slate-50 overflow-y-auto overflow-x-hidden scrollbar-none">
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
    <div className="flex-1 min-h-0 w-full max-w-full flex flex-col bg-slate-50 overflow-y-auto overflow-x-hidden scrollbar-none p-2.5 sm:p-3.5 gap-2.5 pb-5">
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

      {/* Social Post Forensic Inspector Frame — fills available height & width cleanly */}
      <div className="flex-1 min-h-[260px] w-full bg-white rounded-3xl border border-slate-200/90 shadow-sm flex flex-col overflow-hidden">
        {/* Clean Unboxed Post Header */}
        <div className="px-3.5 py-2 border-b border-slate-100 flex items-center justify-between gap-2 shrink-0 bg-white">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-sky-500 to-cyan-400 text-white text-xs font-bold flex items-center justify-center shrink-0">
              LM
            </div>
            <div className="flex items-center gap-1.5 text-xs min-w-0 truncate">
              <span className="font-bold text-slate-900">{copy.postAuthor}</span>
              <span className="text-slate-300" aria-hidden="true">
                ·
              </span>
              <span className="text-slate-500 font-medium truncate">{copy.postMeta}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-700 shrink-0 tabular-nums">
            <Eye className="w-3.5 h-3.5 text-cyan-600" />
            <span>{copy.risksCounter(foundSensitiveCount, targetRisks)}</span>
          </div>
        </div>

        {/* Locked-Aspect Forensic Photo Stage (expands cleanly up to container bounds) */}
        <div
          className="flex-1 min-h-0 w-full bg-slate-900/95 flex items-center justify-center p-2 sm:p-3 relative overflow-hidden"
          style={{ containerType: 'size' }}
        >
          <div
            onClick={handleMissTap}
            style={{
              width: 'min(100cqw, 100cqh)',
              height: 'min(100cqw, 100cqh)',
            }}
            className="relative rounded-2xl overflow-hidden shadow-xl ring-1 ring-white/15 select-none cursor-crosshair"
          >
            {/* Designer-Grade Editorial Vector Scene (1:1 aligned to PHOTO_HOTSPOTS percentages) */}
            <svg
              viewBox="0 0 400 400"
              className="w-full h-full block"
              style={{ fontFamily: 'Nunito, system-ui, sans-serif' }}
            >
              <defs>
                {/* Golden Afternoon Sky */}
                <linearGradient id="ipSkyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38BDF8" />
                  <stop offset="50%" stopColor="#BAE6FD" />
                  <stop offset="85%" stopColor="#E0F2FE" />
                  <stop offset="100%" stopColor="#FEF3C7" />
                </linearGradient>

                {/* Sun Warm Glow */}
                <radialGradient id="ipSunGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FEF08A" stopOpacity="1" />
                  <stop offset="45%" stopColor="#FDE047" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#FDE047" stopOpacity="0" />
                </radialGradient>

                {/* Lush Lawn & Sunlight */}
                <linearGradient id="ipGrassGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4ADE80" />
                  <stop offset="45%" stopColor="#22C55E" />
                  <stop offset="100%" stopColor="#15803D" />
                </linearGradient>

                {/* Stone Pathway */}
                <linearGradient id="ipPathGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F1F5F9" />
                  <stop offset="100%" stopColor="#CBD5E1" />
                </linearGradient>

                {/* School Building Facade */}
                <linearGradient id="ipSchoolWall" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F8FAFC" />
                  <stop offset="100%" stopColor="#E2E8F0" />
                </linearGradient>

                {/* Terracotta Roof */}
                <linearGradient id="ipSchoolRoof" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EF4444" />
                  <stop offset="100%" stopColor="#B91C1C" />
                </linearGradient>

                {/* House Stucco */}
                <linearGradient id="ipHouseWall" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFF7ED" />
                  <stop offset="100%" stopColor="#FED7AA" />
                </linearGradient>

                {/* Child Blazer */}
                <linearGradient id="ipBlazerGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1D4ED8" />
                  <stop offset="100%" stopColor="#1E3A8A" />
                </linearGradient>

                {/* Backpack Gradient */}
                <linearGradient id="ipBagGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#38BDF8" />
                  <stop offset="55%" stopColor="#2563EB" />
                  <stop offset="100%" stopColor="#1E40AF" />
                </linearGradient>

                {/* Puppy Fur Gradient */}
                <linearGradient id="ipFurGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FBBF24" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>

                <filter id="ipSoftShadow" x="-15%" y="-15%" width="130%" height="130%">
                  <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#0F172A" floodOpacity="0.18" />
                </filter>
              </defs>

              {/* Sky Backdrop */}
              <rect width="400" height="260" fill="url(#ipSkyGrad)" />

              {/* Soft Sun + Halo */}
              <circle cx="342" cy="54" r="56" fill="url(#ipSunGlow)" />
              <circle cx="342" cy="54" r="22" fill="#FEF08A" />

              {/* Layered Soft Clouds */}
              <g fill="#FFFFFF" opacity="0.88">
                <path d="M52 46 C52 38 62 34 70 38 C74 30 88 30 93 39 C101 38 106 45 103 52 L54 52 C50 52 48 48 52 46 Z" />
                <path d="M225 68 C225 60 236 56 244 60 C249 52 264 52 269 61 C277 60 282 67 279 74 L228 74 C223 74 221 70 225 68 Z" />
              </g>

              {/* Distant Rolling Hills */}
              <path
                d="M0 245 Q90 200 185 225 T360 212 L400 220 L400 255 L0 255 Z"
                fill="#86EFAC"
                opacity="0.7"
              />
              <path
                d="M0 248 Q120 215 240 232 T400 226 L400 260 L0 260 Z"
                fill="#4ADE80"
                opacity="0.65"
              />

              {/* Background Trees */}
              <g>
                <rect x="226" y="198" width="10" height="44" fill="#92400E" rx="3" />
                <circle cx="231" cy="186" r="22" fill="#16A34A" />
                <circle cx="218" cy="192" r="15" fill="#22C55E" />
                <circle cx="244" cy="192" r="16" fill="#15803D" />
              </g>

              {/* === SCHOOL BUILDING (Left, aligned to hs-school-name: x=8..42%, y=14..32%) === */}
              <g id="school-building">
                {/* Main Wall & Subtle Side Shadow */}
                <rect x="18" y="88" width="164" height="154" fill="url(#ipSchoolWall)" rx="4" />
                <rect x="164" y="88" width="18" height="154" fill="#CBD5E1" opacity="0.55" />
                {/* Masonry base band */}
                <rect x="18" y="214" width="164" height="28" fill="#CBD5E1" />
                {/* Windows */}
                <rect x="36" y="150" width="28" height="36" rx="4" fill="#7DD3FC" stroke="#475569" strokeWidth="2" />
                <line x1="50" y1="150" x2="50" y2="186" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8" />
                <line x1="36" y1="168" x2="64" y2="168" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8" />

                <rect x="136" y="150" width="28" height="36" rx="4" fill="#7DD3FC" stroke="#475569" strokeWidth="2" />
                <line x1="150" y1="150" x2="150" y2="186" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8" />
                <line x1="136" y1="168" x2="164" y2="168" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8" />

                {/* Central Arch Entrance */}
                <path d="M82 242 L82 178 A18 18 0 0 1 118 178 L118 242 Z" fill="#78350F" stroke="#451A03" strokeWidth="2" />
                <circle cx="111" cy="212" r="2.2" fill="#FDE047" />

                {/* Pitched Roof & Clock Gable */}
                <polygon points="8,90 100,36 192,90" fill="url(#ipSchoolRoof)" />
                <polygon points="10,90 100,42 190,90" fill="none" stroke="#FCA5A5" strokeWidth="1.5" opacity="0.5" />
                {/* Little School Clock */}
                <circle cx="100" cy="68" r="10" fill="#FFFFFF" stroke="#B91C1C" strokeWidth="2" />
                <line x1="100" y1="68" x2="100" y2="62" stroke="#0F172A" strokeWidth="1.6" strokeLinecap="round" />
                <line x1="100" y1="68" x2="105" y2="70" stroke="#0F172A" strokeWidth="1.6" strokeLinecap="round" />

                {/* School Banner Plaque (inside x: 32..168, y: 56..128) */}
                <g id="hs-school-name-art" filter="url(#ipSoftShadow)">
                  <rect
                    x="34"
                    y="82"
                    width="132"
                    height="40"
                    rx="7"
                    fill="#0F172A"
                    stroke="#F59E0B"
                    strokeWidth="2.2"
                  />
                  <rect x="38" y="86" width="124" height="32" rx="4" fill="none" stroke="#FDE047" strokeWidth="0.7" opacity="0.45" />
                  <text
                    x="100"
                    y="99"
                    textAnchor="middle"
                    fill="#FDE047"
                    fontSize="9.5"
                    fontWeight="700"
                    letterSpacing="0.8"
                  >
                    COLEGIO
                  </text>
                  <text
                    x="100"
                    y="113"
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="10.5"
                    fontWeight="700"
                    letterSpacing="0.3"
                  >
                    SAN PATRICIO
                  </text>
                </g>
              </g>

              {/* === HOME FACADE (Right, aligned to hs-house-number: x=74..92%, y=22..40%) === */}
              <g id="neighbor-house">
                <rect x="272" y="106" width="114" height="136" fill="url(#ipHouseWall)" rx="4" />
                <rect x="368" y="106" width="18" height="136" fill="#FDBA74" opacity="0.55" />
                <polygon points="262,108 329,64 396,108" fill="#C2410C" />
                <polygon points="268,108 329,69 390,108" fill="#EA580C" />

                {/* Warm Door & Step */}
                <rect x="284" y="170" width="34" height="72" fill="#9A3412" rx="4" />
                <rect x="289" y="176" width="24" height="26" fill="#7C2D12" rx="2" />
                <circle cx="312" cy="208" r="2.2" fill="#FDE047" />
                <rect x="280" y="238" width="42" height="6" fill="#CBD5E1" rx="2" />

                {/* Window with Flower Box */}
                <rect x="334" y="168" width="32" height="32" rx="4" fill="#BAE6FD" stroke="#7C2D12" strokeWidth="2" />
                <line x1="350" y1="168" x2="350" y2="200" stroke="#FFFFFF" strokeWidth="1.5" />
                <rect x="330" y="200" width="40" height="8" rx="2" fill="#B45309" />
                <circle cx="338" cy="199" r="4" fill="#F43F5E" />
                <circle cx="350" cy="198" r="4.5" fill="#FBBF24" />
                <circle cx="362" cy="199" r="4" fill="#EC4899" />

                {/* Ceramic House Number Plaque (inside x: 296..368, y: 88..160) */}
                <g id="hs-house-number-art" filter="url(#ipSoftShadow)">
                  <rect
                    x="306"
                    y="114"
                    width="52"
                    height="36"
                    rx="6"
                    fill="#FFFFFF"
                    stroke="#0284C7"
                    strokeWidth="2.2"
                  />
                  <rect x="310" y="118" width="44" height="28" rx="3" fill="none" stroke="#BAE6FD" strokeWidth="1" />
                  <text
                    x="332"
                    y="133"
                    textAnchor="middle"
                    fill="#0F172A"
                    fontSize="12"
                    fontWeight="700"
                  >
                    Nº 42
                  </text>
                  <text
                    x="332"
                    y="143"
                    textAnchor="middle"
                    fill="#0369A1"
                    fontSize="6.5"
                    fontWeight="700"
                    letterSpacing="0.5"
                  >
                    ROBLES
                  </text>
                </g>
              </g>

              {/* Garden Bushes along house & school */}
              <g fill="#16A34A">
                <circle cx="24" cy="242" r="14" />
                <circle cx="42" cy="245" r="11" fill="#22C55E" />
                <circle cx="256" cy="243" r="12" />
                <circle cx="384" cy="242" r="15" fill="#15803D" />
              </g>

              {/* === SUNLIT LAWN & STONE PATH === */}
              <rect x="0" y="240" width="400" height="160" fill="url(#ipGrassGrad)" />
              {/* Curved Front Walkway */}
              <path
                d="M110 400 C138 335 162 280 182 240 L226 240 C248 282 272 336 300 400 Z"
                fill="url(#ipPathGrad)"
              />
              {/* Subtle walkway paving lines */}
              <line x1="158" y1="305" x2="250" y2="305" stroke="#94A3B8" strokeWidth="1" opacity="0.45" />
              <line x1="138" y1="348" x2="268" y2="348" stroke="#94A3B8" strokeWidth="1" opacity="0.45" />

              {/* Ground Contact Shadows */}
              <ellipse cx="96" cy="348" rx="32" ry="7" fill="#14532D" opacity="0.32" />
              <ellipse cx="204" cy="344" rx="34" ry="8" fill="#64748B" opacity="0.32" />
              <ellipse cx="200" cy="368" rx="18" ry="5" fill="#64748B" opacity="0.35" />
              <ellipse cx="298" cy="350" rx="38" ry="8" fill="#14532D" opacity="0.32" />

              {/* === BACKPACK WITH NAME TAG (Left foreground, aligned to hs-backpack-name: x=16..36%, y=64..86%) === */}
              <g id="hs-backpack-art" filter="url(#ipSoftShadow)">
                {/* Top Carry Loop */}
                <path d="M84 268 C84 256 108 256 108 268" stroke="#1E3A8A" strokeWidth="5" strokeLinecap="round" fill="none" />
                {/* Side Pocket */}
                <rect x="122" y="294" width="10" height="32" rx="5" fill="#1D4ED8" />
                {/* Main Bag Body */}
                <rect x="64" y="266" width="64" height="78" rx="18" fill="url(#ipBagGrad)" stroke="#1E3A8A" strokeWidth="2" />
                {/* Front Pocket */}
                <rect x="72" y="298" width="48" height="38" rx="10" fill="#1D4ED8" opacity="0.65" />
                {/* Zipper Trim */}
                <line x1="76" y1="296" x2="116" y2="296" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
                <circle cx="96" cy="296" r="2.5" fill="#FDE047" />
                {/* Woven Name Tag Patch (inside x: 64..144, y: 256..344) */}
                <rect x="69" y="305" width="54" height="27" rx="5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.4" />
                <text x="96" y="316" textAnchor="middle" fill="#475569" fontSize="6.5" fontWeight="700">
                  ALUMNO:
                </text>
                <text x="96" y="327" textAnchor="middle" fill="#DC2626" fontSize="8" fontWeight="700">
                  LUCAS M.
                </text>
              </g>

              {/* === CHILD CHARACTER (Center, school badge aligned to hs-school-badge: x=38..52%, y=46..62%) === */}
              <g id="child-character" filter="url(#ipSoftShadow)">
                {/* Denim Trousers & Legs */}
                <rect x="180" y="274" width="17" height="58" fill="#1E293B" rx="5" />
                <rect x="207" y="274" width="17" height="58" fill="#1E293B" rx="5" />
                {/* Sneakers */}
                <path d="M175 335 C175 328 198 328 198 335 L199 342 L173 342 Z" fill="#F97316" />
                <rect x="173" y="340" width="26" height="4" rx="2" fill="#FFFFFF" />
                <path d="M206 335 C206 328 229 328 229 335 L230 342 L205 342 Z" fill="#F97316" />
                <rect x="205" y="340" width="25" height="4" rx="2" fill="#FFFFFF" />

                {/* Left & Right Arms */}
                <rect x="155" y="192" width="15" height="58" rx="7.5" fill="url(#ipBlazerGrad)" transform="rotate(8 162 195)" />
                <circle cx="159" cy="252" r="7.5" fill="#FED7AA" />
                <rect x="234" y="192" width="15" height="58" rx="7.5" fill="url(#ipBlazerGrad)" transform="rotate(-12 241 195)" />
                <circle cx="246" cy="250" r="7.5" fill="#FED7AA" />

                {/* Navy School Blazer / Sweater Torso */}
                <rect x="169" y="186" width="66" height="94" rx="14" fill="url(#ipBlazerGrad)" />
                {/* Crisp White Polo Collar */}
                <polygon points="186,186 202,204 218,186" fill="#FFFFFF" />
                <polygon points="196,194 202,210 208,194" fill="#0284C7" />

                {/* Embroidered School Crest (inside x: 152..208, y: 184..248) */}
                <g id="hs-school-badge-art">
                  <path
                    d="M174 208 L194 208 L194 222 C194 230 184 235 184 235 C184 235 174 230 174 222 Z"
                    fill="#F59E0B"
                    stroke="#FEF08A"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M178 212 L190 212 L190 221 C190 226 184 229 184 229 C184 229 178 226 178 221 Z"
                    fill="#1E3A8A"
                  />
                  <text x="184" y="223" textAnchor="middle" fill="#FEF08A" fontSize="5.5" fontWeight="700">
                    CSP
                  </text>
                </g>

                {/* Neck & Expressive Head */}
                <rect x="195" y="174" width="14" height="14" rx="4" fill="#FDBA74" />
                {/* Ears */}
                <circle cx="174" cy="153" r="6" fill="#FDBA74" />
                <circle cx="230" cy="153" r="6" fill="#FDBA74" />
                {/* Face */}
                <circle cx="202" cy="152" r="28" fill="#FED7AA" />
                {/* Stylish Layered Hair */}
                <path
                  d="M173 148 C173 122 231 122 231 148 C225 138 214 134 202 136 C190 134 179 139 173 148 Z"
                  fill="#78350F"
                />
                <path
                  d="M182 132 Q204 118 223 136 Q208 130 190 134 Z"
                  fill="#92400E"
                />
                {/* Eyes, Rosy Cheeks & Happy Smile */}
                <circle cx="192" cy="152" r="3.2" fill="#0F172A" />
                <circle cx="193" cy="151" r="1" fill="#FFFFFF" />
                <circle cx="212" cy="152" r="3.2" fill="#0F172A" />
                <circle cx="213" cy="151" r="1" fill="#FFFFFF" />
                <ellipse cx="184" cy="159" rx="4.5" ry="2.5" fill="#FB7185" opacity="0.45" />
                <ellipse cx="220" cy="159" rx="4.5" ry="2.5" fill="#FB7185" opacity="0.45" />
                <path
                  d="M194 163 Q202 171 210 163"
                  stroke="#9A3412"
                  strokeWidth="2.4"
                  fill="none"
                  strokeLinecap="round"
                />
              </g>

              {/* === SOCCER BALL (Foreground center, aligned to hs-soccer-ball: x=42..58%, y=78..96%) === */}
              <g id="hs-soccer-ball-art" filter="url(#ipSoftShadow)">
                <circle cx="200" cy="350" r="19" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
                <path d="M185 361 A19 19 0 0 0 215 361" fill="#E2E8F0" opacity="0.65" />
                <polygon points="200,342 207,347 204,355 196,355 193,347" fill="#0F172A" />
                <line x1="200" y1="342" x2="200" y2="331" stroke="#334155" strokeWidth="1.5" />
                <line x1="207" y1="347" x2="218" y2="344" stroke="#334155" strokeWidth="1.5" />
                <line x1="193" y1="347" x2="182" y2="344" stroke="#334155" strokeWidth="1.5" />
                <line x1="204" y1="355" x2="211" y2="365" stroke="#334155" strokeWidth="1.5" />
                <line x1="196" y1="355" x2="189" y2="365" stroke="#334155" strokeWidth="1.5" />
              </g>

              {/* === GOLDEN PUPPY WITH COLLAR PHONE TAG (Right foreground, aligned to hs-pet-tag: x=62..84%, y=68..90%) === */}
              <g id="hs-pet-art" filter="url(#ipSoftShadow)">
                {/* Wagging Tail */}
                <path
                  d="M324 328 Q344 316 338 298"
                  stroke="#D97706"
                  strokeWidth="8"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Sitting Body */}
                <ellipse cx="300" cy="328" rx="30" ry="23" fill="url(#ipFurGrad)" />
                {/* Cute Cream Chest Patch */}
                <ellipse cx="285" cy="332" rx="12" ry="14" fill="#FEF3C7" opacity="0.85" />
                {/* Front Paws */}
                <ellipse cx="277" cy="348" rx="8" ry="5" fill="#F59E0B" />
                <ellipse cx="297" cy="349" rx="8" ry="5" fill="#F59E0B" />
                {/* Head & Floppy Ears */}
                <ellipse cx="261" cy="306" rx="7" ry="15" fill="#92400E" transform="rotate(14 261 306)" />
                <ellipse cx="292" cy="306" rx="7" ry="15" fill="#92400E" transform="rotate(-14 292 306)" />
                <circle cx="276" cy="303" r="19" fill="#FBBF24" />
                {/* Muzzle, Nose & Happy Eyes */}
                <ellipse cx="274" cy="309" rx="10" ry="7" fill="#FEF3C7" />
                <ellipse cx="274" cy="306" rx="4.2" ry="3" fill="#0F172A" />
                <circle cx="268" cy="297" r="2.6" fill="#0F172A" />
                <circle cx="283" cy="297" r="2.6" fill="#0F172A" />
                <circle cx="269" cy="296" r="0.9" fill="#FFFFFF" />
                <circle cx="284" cy="296" r="0.9" fill="#FFFFFF" />
                {/* Crimson Collar */}
                <rect x="264" y="319" width="24" height="6" rx="3" fill="#DC2626" />
                {/* Gleaming Brass Phone Tag (inside x: 248..336, y: 272..360) */}
                <circle cx="276" cy="335" r="12" fill="#FDE047" stroke="#B45309" strokeWidth="1.5" />
                <circle cx="276" cy="326" r="1.5" fill="#B45309" />
                <text x="276" y="334" textAnchor="middle" fill="#0F172A" fontSize="4.6" fontWeight="700">
                  TEL:
                </text>
                <text x="276" y="340" textAnchor="middle" fill="#0F172A" fontSize="4.3" fontWeight="700">
                  600-44-22
                </text>
              </g>
            </svg>

            {/* Tasteful Camera Viewfinder Corner Brackets */}
            <div className="pointer-events-none absolute inset-2.5 border border-white/20 rounded-xl" />

            {/* Clean Designer Hotspot Overlays (Zero Ugly Pulsing Dashed Boxes) */}
            {hotspots.map((hotspot) => {
              const isSelected = selectedHotspots.includes(hotspot.id);

              return (
                <button
                  key={hotspot.id}
                  type="button"
                  aria-label={hotspot.label}
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
                  className={`absolute rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center group ${
                    isSelected
                      ? hotspot.isSensitiveRisk
                        ? 'ring-2 ring-emerald-400 bg-emerald-400/15 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.45)]'
                        : 'ring-2 ring-sky-400 bg-sky-400/15 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.45)]'
                      : ageGroup === '13–14'
                      ? 'bg-transparent hover:bg-white/10'
                      : ageGroup === '11–12'
                      ? 'hover:ring-1 hover:ring-white/60 hover:bg-white/10'
                      : 'hover:bg-cyan-300/15'
                  }`}
                >
                  {isSelected ? (
                    <motion.div
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md ring-2 ring-white ${
                        hotspot.isSensitiveRisk
                          ? 'bg-emerald-500 text-white'
                          : 'bg-sky-500 text-white'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </motion.div>
                  ) : ageGroup === '8–10' ? (
                    <div className="w-5 h-5 rounded-full bg-white/85 backdrop-blur-xs border-2 border-cyan-500/80 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-600" />
                    </div>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pro Tier EXIF Metadata Strip Challenge (13–14) */}
      {ageGroup === '13–14' && (
        <div
          className={`px-3.5 py-2.5 rounded-2xl border flex items-center justify-between gap-3 shrink-0 ${
            exifCleared
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-amber-50 border-amber-300 text-amber-950'
          }`}
        >
          <div className="min-w-0">
            <div className="text-xs font-bold flex items-center gap-1.5">
              {exifCleared ? (
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              )}
              <span>{exifCleared ? copy.exifDone : copy.exifTitle}</span>
            </div>
            <div className="text-[11px] tabular-nums text-slate-600 break-words mt-0.5">
              {exifCleared ? 'GPS: [REDACTED] · EXIF: Stripped' : copy.exifCoords}
            </div>
          </div>
          {!exifCleared && (
            <button
              type="button"
              onClick={handleStripExif}
              className="min-h-[40px] px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-95 transition"
            >
              <MapPinOff className="w-4 h-4" />
              <span>{copy.exifAction}</span>
            </button>
          )}
        </div>
      )}

      {/* Educational Feedback & Bottom Action Bar */}
      <div className="p-3 sm:p-3.5 bg-white border border-slate-200/80 rounded-3xl flex flex-col gap-2.5 shrink-0 shadow-xs">
        <AnimatePresence mode="wait">
          {activeFeedback ? (
            <motion.div
              key={activeFeedback.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className={`p-3 rounded-2xl border ${
                activeFeedback.isSensitiveRisk
                  ? 'bg-rose-50/75 border-rose-200 text-rose-950'
                  : 'bg-sky-50/75 border-sky-200 text-sky-950'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <CiberMascot
                  size="sm"
                  expression={activeFeedback.ciberReaction}
                  className="shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm">
                    {activeFeedback.isSensitiveRisk ? (
                      <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0" />
                    ) : (
                      <Info className="w-4 h-4 text-sky-600 shrink-0" />
                    )}
                    <span className={activeFeedback.isSensitiveRisk ? 'text-rose-900' : 'text-sky-900'}>
                      {activeFeedback.feedbackTitle}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm mt-0.5 text-slate-700 leading-relaxed font-normal">
                    {activeFeedback.feedbackText}
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700 flex items-center gap-2.5">
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
          className={`w-full min-h-[46px] py-3 rounded-2xl font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer ${
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
