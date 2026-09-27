import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Info, CheckCircle2, AlertTriangle } from 'lucide-react';
import { GameHotspot, MascotExpression } from '../types';
import { CiberMascot } from './CiberMascot';
import { useLanguage } from '../i18n/LanguageContext';

interface InteractivePhotoProps {
  onAllRisksFound: () => void;
  onCiberReact: (expression: MascotExpression) => void;
}

export const InteractivePhoto: React.FC<InteractivePhotoProps> = ({
  onAllRisksFound,
  onCiberReact,
}) => {
  const { hotspots, t, language } = useLanguage();
  const [selectedHotspots, setSelectedHotspots] = useState<string[]>([]);
  const [activeFeedback, setActiveFeedback] = useState<GameHotspot | null>(null);

  const sensitiveHotspots = hotspots.filter((h) => h.isSensitiveRisk);
  const foundSensitiveCount = selectedHotspots.filter(
    (id) => hotspots.find((h) => h.id === id)?.isSensitiveRisk
  ).length;

  const allRisksDetected = foundSensitiveCount >= 4; // at least 4 key risks found

  const handleTapHotspot = (hotspot: GameHotspot) => {
    if (!selectedHotspots.includes(hotspot.id)) {
      setSelectedHotspots((prev) => [...prev, hotspot.id]);
    }
    setActiveFeedback(hotspot);
    onCiberReact(hotspot.ciberReaction);

    // If tapping completed the mission
    const newCount = hotspot.isSensitiveRisk && !selectedHotspots.includes(hotspot.id)
      ? foundSensitiveCount + 1
      : foundSensitiveCount;

    if (newCount >= 4) {
      setTimeout(() => {
        onCiberReact('celebrating');
      }, 500);
    }
  };

  const getInitialTip = () => {
    if (language === 'en') {
      return "Ciber's Mission: Examine the photo and tap the 4 items that expose private information.";
    }
    if (language === 'fr') {
      return "Mission de Ciber : Examine la photo et touche les 4 éléments qui révèlent des données privées.";
    }
    return "Misión de Ciber: Examina la foto y toca los 4 datos que revelan información privada en la imagen.";
  };

  const getCompleteBtnText = () => {
    if (language === 'en') {
      return 'Complete Mission & Claim Rewards!';
    }
    if (language === 'fr') {
      return 'Terminer la mission et recevoir la récompense !';
    }
    return '¡Completar Misión y Recibir Premio!';
  };

  const getFindRisksBtnText = () => {
    if (language === 'en') {
      return `Find at least 4 risks (${foundSensitiveCount}/4)`;
    }
    if (language === 'fr') {
      return `Trouve au moins 4 risques (${foundSensitiveCount}/4)`;
    }
    return `Encuentra al menos 4 riesgos (${foundSensitiveCount}/4)`;
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Top Game Instruction */}
      <div className="px-4 py-2.5 bg-white border-b border-slate-100 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-cyan-100 border border-cyan-200 flex items-center justify-center text-cyan-700 font-bold text-xs">
            {foundSensitiveCount}/4
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 tracking-wide">
              {t('gameScreen.photoInstruction')}
            </div>
            <div className="text-[10px] text-slate-500 font-medium">
              {t('gameScreen.photoSub')}
            </div>
          </div>
        </div>

        {allRisksDetected && (
          <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse">
            ✓ 4/4
          </span>
        )}
      </div>

      {/* Main Interactive Photo Illustration */}
      <div className="relative flex-1 min-h-[340px] max-h-[400px] w-full bg-gradient-to-b from-sky-400 via-sky-200 to-emerald-300 overflow-hidden select-none">
        {/* SVG Illustration of the photo scenario */}
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

          {/* Sky & Sun */}
          <rect width="400" height="280" fill="url(#skyGrad)" />
          <circle cx="340" cy="60" r="30" fill="#FDE047" opacity="0.9" />

          {/* School Gate / House background */}
          <rect x="20" y="90" width="180" height="150" fill="#E2E8F0" rx="4" />
          <polygon points="10,90 110,40 210,90" fill="#DC2626" />

          {/* School Banner (HOTSPOT 1) */}
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

          {/* Neighbor House & Street Number (HOTSPOT 2) */}
          <rect x="270" y="110" width="110" height="130" fill="#FED7AA" rx="4" />
          <polygon points="260,110 325,70 390,110" fill="#B45309" />
          {/* House Door */}
          <rect x="300" y="170" width="36" height="70" fill="#78350F" rx="3" />
          {/* Number Plaque */}
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
          <text
            x="318"
            y="150"
            textAnchor="middle"
            fill="#0F172A"
            fontSize="11"
            fontWeight="900"
          >
            Nº 42
          </text>
          <text
            x="318"
            y="155"
            textAnchor="middle"
            fill="#475569"
            fontSize="4.5"
            fontWeight="bold"
          >
            ROBLES
          </text>

          {/* Lawn */}
          <rect x="0" y="240" width="400" height="160" fill="url(#grassGrad)" />
          {/* Garden Path */}
          <path d="M120 400 L180 240 L220 240 L280 400 Z" fill="#CBD5E1" opacity="0.6" />

          {/* Backpack (HOTSPOT 4: Lucas M.) */}
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

          {/* Child Character in Center */}
          <g id="child-character">
            {/* Legs & soccer shorts */}
            <rect x="180" y="290" width="14" height="60" fill="#1E293B" rx="4" />
            <rect x="206" y="290" width="14" height="60" fill="#1E293B" rx="4" />
            {/* Shoes */}
            <ellipse cx="186" cy="352" rx="11" ry="6" fill="#F97316" />
            <ellipse cx="214" cy="352" rx="11" ry="6" fill="#F97316" />

            {/* School Uniform Jacket (HOTSPOT 3: School crest) */}
            <rect x="170" y="195" width="60" height="98" rx="10" fill="#1E3A8A" />
            {/* School Crest Badge on chest */}
            <g id="hs-school-badge-art">
              <circle cx="185" cy="225" r="9" fill="#F59E0B" stroke="#FDE047" strokeWidth="1.5" />
              <path d="M181 222 L185 220 L189 222 L185 228 Z" fill="#1E3A8A" />
              <text x="185" y="232" textAnchor="middle" fill="#FFFFFF" fontSize="4.5" fontWeight="bold">
                CSP
              </text>
            </g>

            {/* Arms & Hands */}
            <rect x="156" y="200" width="14" height="55" rx="7" fill="#1E3A8A" />
            <circle cx="163" cy="260" r="7" fill="#FBCFE8" />
            <rect x="230" y="200" width="14" height="55" rx="7" fill="#1E3A8A" />
            <circle cx="237" cy="260" r="7" fill="#FBCFE8" />

            {/* Head & Smiling Face */}
            <circle cx="200" cy="160" r="26" fill="#FBCFE8" />
            {/* Hair */}
            <path d="M174 155 Q200 130 226 155 Q215 142 200 142 Q185 142 174 155 Z" fill="#78350F" />
            <circle cx="200" cy="138" r="16" fill="#78350F" />
            {/* Eyes */}
            <circle cx="192" cy="160" r="3" fill="#1E293B" />
            <circle cx="208" cy="160" r="3" fill="#1E293B" />
            {/* Smile */}
            <path d="M194 170 Q200 176 206 170" stroke="#DC2626" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>

          {/* Soccer Ball (SAFE ELEMENT) */}
          <g id="hs-soccer-ball-art">
            <circle cx="170" cy="350" r="18" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
            <polygon points="170,344 176,348 174,354 166,354 164,348" fill="#0F172A" />
            <line x1="170" y1="344" x2="170" y2="334" stroke="#0F172A" strokeWidth="1.5" />
            <line x1="176" y1="348" x2="185" y2="344" stroke="#0F172A" strokeWidth="1.5" />
          </g>

          {/* Pet Dog (HOTSPOT 5: Collar with phone) */}
          <g id="hs-pet-art">
            {/* Dog body */}
            <ellipse cx="300" cy="330" rx="34" ry="24" fill="#D97706" />
            <circle cx="272" cy="310" r="18" fill="#D97706" />
            {/* Dog ears */}
            <ellipse cx="264" cy="300" rx="6" ry="12" fill="#92400E" />
            <ellipse cx="282" cy="300" rx="6" ry="12" fill="#92400E" />
            {/* Dog snout */}
            <circle cx="262" cy="315" r="5" fill="#0F172A" />
            {/* Collar Tag */}
            <rect x="270" y="322" width="16" height="5" fill="#DC2626" rx="2" />
            {/* Gold Tag with Phone */}
            <circle cx="278" cy="334" r="8" fill="#FDE047" stroke="#CA8A04" strokeWidth="1" />
            <text x="278" y="334" textAnchor="middle" fill="#0F172A" fontSize="4" fontWeight="bold">
              TEL:
            </text>
            <text x="278" y="339" textAnchor="middle" fill="#0F172A" fontSize="3.5" fontWeight="900">
              600-44-22
            </text>
            {/* Dog tail wagging */}
            <path d="M330 324 Q345 315 340 305" stroke="#D97706" strokeWidth="6" strokeLinecap="round" fill="none" />
          </g>
        </svg>

        {/* Clickable Overlay Hotspots */}
        {hotspots.map((hotspot) => {
          const isSelected = selectedHotspots.includes(hotspot.id);
          return (
            <button
              key={hotspot.id}
              onClick={() => handleTapHotspot(hotspot)}
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
                  : 'hover:bg-cyan-400/20 border-2 border-dashed border-cyan-400/60 animate-pulse'
              }`}
            >
              {isSelected ? (
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shadow-lg ${
                    hotspot.isSensitiveRisk
                      ? 'bg-emerald-500 text-white'
                      : 'bg-sky-500 text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-cyan-400/80 text-slate-950 flex items-center justify-center text-[10px] font-bold shadow-md">
                  ?
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Educational Feedback Panel */}
      <div className="p-4 bg-white border-t border-slate-100 flex flex-col gap-3 shrink-0 shadow-xs">
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
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    {activeFeedback.isSensitiveRisk ? (
                      <ShieldCheck className="w-4 h-4 text-rose-600" />
                    ) : (
                      <Info className="w-4 h-4 text-sky-600" />
                    )}
                    <span className={activeFeedback.isSensitiveRisk ? 'text-rose-900' : 'text-sky-900'}>
                      {activeFeedback.feedbackTitle}
                    </span>
                  </div>
                  <p className="text-xs mt-1 text-slate-700 leading-relaxed font-normal">
                    {activeFeedback.feedbackText}
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700 flex items-center gap-3">
              <CiberMascot size="sm" expression="thinking" className="shrink-0" />
              <div className="text-xs">
                {getInitialTip()}
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Completion Action */}
        <button
          onClick={onAllRisksFound}
          disabled={!allRisksDetected}
          className={`w-full py-3.5 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            allRisksDetected
              ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white shadow-lg shadow-emerald-500/25 active:scale-95'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200/60'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          {allRisksDetected ? getCompleteBtnText() : getFindRisksBtnText()}
        </button>
      </div>
    </div>
  );
};
