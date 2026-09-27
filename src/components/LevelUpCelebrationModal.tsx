import React, { useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Coins,
  Shield,
  Award,
  ArrowRight,
  X,
  Volume2,
  CheckCircle2,
  Crown,
  Zap,
} from 'lucide-react';
import { CiberMascot } from './CiberMascot';
import { useLanguage } from '../i18n/LanguageContext';
import {
  getLevelTitle,
  getRewardsForLevel,
  playCelebratoryFanfare,
} from '../utils/levelSystem';

interface LevelUpCelebrationModalProps {
  isOpen: boolean;
  oldLevel: number;
  newLevel: number;
  bonusCoins: number;
  nickname: string;
  onClose: () => void;
}

// Generate static deterministic particles for CSS animations
const FLOATING_PARTICLES = [
  { id: 1, left: '15%', top: '25%', dur: '2.4s', delay: '0s', drift: '-14px', rot: '45deg', size: 'w-3 h-3', color: 'bg-amber-400' },
  { id: 2, left: '80%', top: '20%', dur: '2.1s', delay: '0.2s', drift: '18px', rot: '-30deg', size: 'w-2.5 h-2.5', color: 'bg-cyan-400' },
  { id: 3, left: '25%', top: '65%', dur: '2.7s', delay: '0.5s', drift: '12px', rot: '60deg', size: 'w-3.5 h-3.5', color: 'bg-yellow-300' },
  { id: 4, left: '72%', top: '68%', dur: '2.3s', delay: '0.3s', drift: '-16px', rot: '-45deg', size: 'w-2 h-2', color: 'bg-sky-300' },
  { id: 5, left: '50%', top: '15%', dur: '2.6s', delay: '0.7s', drift: '8px', rot: '90deg', size: 'w-3 h-3', color: 'bg-amber-300' },
  { id: 6, left: '10%', top: '50%', dur: '2.0s', delay: '0.4s', drift: '15px', rot: '-60deg', size: 'w-2.5 h-2.5', color: 'bg-purple-400' },
  { id: 7, left: '88%', top: '48%', dur: '2.5s', delay: '0.6s', drift: '-10px', rot: '30deg', size: 'w-3 h-3', color: 'bg-emerald-400' },
  { id: 8, left: '38%', top: '80%', dur: '2.2s', delay: '0.8s', drift: '-12px', rot: '75deg', size: 'w-2 h-2', color: 'bg-pink-400' },
];

const CSS_CONFETTI_PIECES = [
  { id: 'c1', tx: '-75px', ty: '140px', rot: '280deg', dur: '1.6s', delay: '0.05s', color: '#f59e0b', w: 8, h: 14 },
  { id: 'c2', tx: '85px', ty: '155px', rot: '-320deg', dur: '1.7s', delay: '0.08s', color: '#0ea5e9', w: 10, h: 10 },
  { id: 'c3', tx: '-120px', ty: '95px', rot: '210deg', dur: '1.5s', delay: '0.12s', color: '#10b981', w: 7, h: 12 },
  { id: 'c4', tx: '115px', ty: '110px', rot: '-240deg', dur: '1.8s', delay: '0.15s', color: '#a855f7', w: 9, h: 15 },
  { id: 'c5', tx: '-45px', ty: '185px', rot: '360deg', dur: '1.9s', delay: '0.18s', color: '#ec4899', w: 11, h: 8 },
  { id: 'c6', tx: '50px', ty: '190px', rot: '-380deg', dur: '1.65s', delay: '0.2s', color: '#fbbf24', w: 8, h: 13 },
  { id: 'c7', tx: '-95px', ty: '210px', rot: '420deg', dur: '2.0s', delay: '0.22s', color: '#38bdf8', w: 10, h: 10 },
  { id: 'c8', tx: '100px', ty: '200px', rot: '-410deg', dur: '1.85s', delay: '0.25s', color: '#34d399', w: 7, h: 14 },
];

export const LevelUpCelebrationModal: React.FC<LevelUpCelebrationModalProps> = ({
  isOpen,
  oldLevel,
  newLevel,
  bonusCoins,
  nickname,
  onClose,
}) => {
  const { language } = useLanguage();

  // Play fanfare and trigger confetti burst on open
  useEffect(() => {
    if (!isOpen) return;

    playCelebratoryFanfare();

    try {
      confetti({
        particleCount: 85,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#0284c7', '#38bdf8', '#f59e0b', '#fbbf24', '#10b981', '#a855f7'],
        disableForReducedMotion: true,
      });
    } catch {
      // safe fallback
    }

    // Handle Escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const newTitle = useMemo(() => getLevelTitle(newLevel, language), [newLevel, language]);
  const rewards = useMemo(
    () => getRewardsForLevel(newLevel, bonusCoins, language),
    [newLevel, bonusCoins, language]
  );

  if (!isOpen) return null;

  const loc = {
    es: {
      banner: '¡SUBISTE DE NIVEL!',
      subtitle: `¡Felicitaciones, ${nickname}! Tu ciberseguridad ha alcanzado un nuevo rango.`,
      levelBadge: 'NIVEL',
      oldToNew: `Del Nivel ${oldLevel} al Nivel ${newLevel}`,
      unlockedTitle: 'Recompensas Desbloqueadas',
      claimBtn: '¡Reclamar y Continuar!',
      soundTooltip: 'Repetir Fanfarria Sonora',
      closeAria: 'Cerrar celebración',
    },
    en: {
      banner: 'LEVEL UP!',
      subtitle: `Awesome job, ${nickname}! Your cyber shield just unlocked a brand new tier.`,
      levelBadge: 'LEVEL',
      oldToNew: `From Level ${oldLevel} to Level ${newLevel}`,
      unlockedTitle: 'Unlocked Rewards',
      claimBtn: 'Claim & Continue Adventure!',
      soundTooltip: 'Replay Victory Chime',
      closeAria: 'Close celebration',
    },
    fr: {
      banner: 'NIVEAU SUPÉRIEUR !',
      subtitle: `Bravo ${nickname} ! Ton bouclier de cybersécurité vient de passer un cap.`,
      levelBadge: 'NIVEAU',
      oldToNew: `Du Niveau ${oldLevel} au Niveau ${newLevel}`,
      unlockedTitle: 'Récompenses Débloquées',
      claimBtn: 'Réclamer & Continuer !',
      soundTooltip: 'Rejouer la fanfare',
      closeAria: 'Fermer la célébration',
    },
  }[language] || {
    banner: '¡SUBISTE DE NIVEL!',
    subtitle: `¡Felicitaciones, ${nickname}!`,
    levelBadge: 'NIVEL',
    oldToNew: `Del Nivel ${oldLevel} al Nivel ${newLevel}`,
    unlockedTitle: 'Recompensas Desbloqueadas',
    claimBtn: '¡Reclamar y Continuar!',
    soundTooltip: 'Repetir Fanfarria Sonora',
    closeAria: 'Cerrar celebración',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={loc.banner}
      className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-modal-backdrop select-none overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Sunburst Rays Background (CSS Animation) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-35 sm:opacity-40">
        <div className="w-[520px] h-[520px] sm:w-[650px] sm:h-[650px] rounded-full animate-sunburst bg-[radial-gradient(circle,rgba(245,158,11,0.45)_0%,rgba(14,165,233,0.35)_40%,transparent_75%)]" />
      </div>

      {/* Floating CSS Particle Sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {FLOATING_PARTICLES.map((p) => (
          <div
            key={p.id}
            className={`absolute rounded-full ${p.color} ${p.size} animate-particle opacity-80 shadow-xs`}
            style={
              {
                left: p.left,
                top: p.top,
                '--dur': p.dur,
                '--delay': p.delay,
                '--drift': p.drift,
                '--rot': p.rot,
              } as React.CSSProperties
            }
          />
        ))}

        {/* Bursting CSS Confetti */}
        {CSS_CONFETTI_PIECES.map((c) => (
          <div
            key={c.id}
            className="absolute top-1/2 left-1/2 rounded-xs animate-confetti pointer-events-none"
            style={
              {
                backgroundColor: c.color,
                width: `${c.w}px`,
                height: `${c.h}px`,
                '--tx': c.tx,
                '--ty': c.ty,
                '--rot': c.rot,
                '--dur': c.dur,
                '--delay': c.delay,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* Main Celebratory Modal Card (CSS Keyframe Entrance) */}
      <div className="relative w-full max-w-[390px] rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/98 to-slate-950 border-2 border-amber-400/50 shadow-2xl p-5 sm:p-6 text-white overflow-hidden animate-level-up-card z-10">
        {/* Top Decorative Amber Glow Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-cyan-400 shadow-sm" />

        {/* Close Button & Replay Chime Sound */}
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={playCelebratoryFanfare}
            title={loc.soundTooltip}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-xs text-amber-300 transition cursor-pointer border border-amber-400/20"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold">Audio</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label={loc.closeAria}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 active:scale-90 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Celebratory Banner Ribbon (CSS Sway Animation) */}
        <div className="text-center pt-1 animate-ribbon">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/60 text-amber-300 text-xs font-black tracking-wider uppercase mb-1.5 shadow-xs">
            <Crown className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-twinkle" />
            <span>{loc.banner}</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed px-1 mt-1">
            {loc.subtitle}
          </p>
        </div>

        {/* Central Celebratory Emblem: Mascot + Pulsing Glow + Level Badge */}
        <div className="relative flex flex-col items-center justify-center my-4 py-1">
          {/* Radial Glow Aura (CSS Pulse Animation) */}
          <div className="absolute w-36 h-36 rounded-full bg-gradient-to-tr from-amber-500/40 via-yellow-400/30 to-cyan-400/35 blur-xl animate-pulse-glow pointer-events-none" />

          {/* Central 3D Shield Badge with Shine Sweep */}
          <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 p-1 shadow-xl border-2 border-yellow-200/90 flex items-center justify-center overflow-hidden">
            {/* Diagonal Light Sweep (CSS Keyframe Sweep) */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none animate-badge-shine" />

            {/* Inner Dark Badge Face */}
            <div className="w-full h-full rounded-[22px] bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col items-center justify-center relative p-2 text-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-300/90">
                {loc.levelBadge}
              </span>

              {/* Bouncing Level Number (CSS Keyframe Bounce) */}
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-amber-300 to-yellow-500 tracking-tight leading-none my-0.5 animate-level-number drop-shadow-md">
                {newLevel}
              </div>

              <div className="flex items-center gap-1 text-[10px] font-bold text-cyan-300">
                <Zap className="w-3 h-3 fill-cyan-400 text-cyan-400" />
                <span>UPGRADED</span>
              </div>
            </div>
          </div>

          {/* Cheering Mascot Floating Next to Badge */}
          <div className="absolute -bottom-2 -right-2 sm:-right-4 drop-shadow-lg">
            <CiberMascot size="sm" expression="celebrating" />
          </div>

          {/* Level Transition Pill */}
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-xs font-bold text-slate-300 shadow-2xs">
            <span className="text-slate-400 font-medium">Nvl {oldLevel}</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-amber-300 font-extrabold">Nvl {newLevel}</span>
          </div>

          {/* New Honorary Title */}
          <h2 className="text-base sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-cyan-200 mt-2 text-center tracking-tight">
            "{newTitle}"
          </h2>
        </div>

        {/* Unlocked Rewards List (Staggered Slide Up) */}
        <div className="mt-2 pt-3 border-t border-slate-800/90 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-1 mb-1">
            <span className="uppercase tracking-wider text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {loc.unlockedTitle}
            </span>
            <span>+{bonusCoins} XP Valor</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {rewards.map((reward, idx) => (
              <div
                key={reward.id}
                className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-amber-400/40 transition animate-reward-item"
                style={{ animationDelay: `${0.15 + idx * 0.1}s` }}
              >
                <div className="w-8 h-8 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center shrink-0 text-amber-300">
                  {reward.icon === 'coins' ? (
                    <Coins className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ) : reward.icon === 'title' ? (
                    <Award className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <Shield className="w-4 h-4 text-emerald-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-black text-white truncate">
                    {reward.title}
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight truncate">
                    {reward.desc}
                  </div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action Button with Pulse Animation */}
        <button
          type="button"
          onClick={onClose}
          className="w-full mt-4 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-cyan-500 to-blue-600 hover:from-amber-400 hover:to-blue-500 active:scale-98 text-white font-black text-sm tracking-wide shadow-lg transition cursor-pointer flex items-center justify-center gap-2 animate-celebrate-btn"
        >
          <span>{loc.claimBtn}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
