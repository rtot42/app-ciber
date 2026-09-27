import React from 'react';
import { motion } from 'motion/react';
import { MascotExpression } from '../types';

interface CiberMascotProps {
  expression?: MascotExpression;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSpeech?: boolean;
  speechText?: string;
  className?: string;
}

export const CiberMascot: React.FC<CiberMascotProps> = ({
  expression = 'happy',
  size = 'md',
  showSpeech = false,
  speechText,
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
    xl: 'w-36 h-36',
  };

  // Eyes render based on expression
  const renderEyes = () => {
    switch (expression) {
      case 'excited':
        return (
          <g>
            {/* Star-like excited eyes */}
            <path
              d="M36 44 L40 40 L44 44 L40 48 Z"
              fill="#00F0FF"
              className="animate-pulse"
            />
            <path
              d="M56 44 L60 40 L64 44 L60 48 Z"
              fill="#00F0FF"
              className="animate-pulse"
            />
            {/* Happy open digital smile */}
            <path
              d="M44 54 Q50 60 56 54"
              stroke="#00F0FF"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Rosy blush */}
            <circle cx="34" cy="52" r="3.5" fill="#F472B6" opacity="0.6" />
            <circle cx="66" cy="52" r="3.5" fill="#F472B6" opacity="0.6" />
          </g>
        );
      case 'thinking':
        return (
          <g>
            {/* One eye curious, one raised */}
            <ellipse cx="40" cy="43" rx="4.5" ry="5.5" fill="#00F0FF" />
            <ellipse cx="60" cy="40" rx="4.5" ry="3.5" fill="#00F0FF" />
            {/* Thoughtful curved mouth */}
            <path
              d="M47 54 Q51 53 55 55"
              stroke="#00F0FF"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Thinking gear/sparkle near head */}
            <circle cx="74" cy="24" r="2.5" fill="#A855F7" className="animate-ping" />
          </g>
        );
      case 'surprised':
        return (
          <g>
            {/* Wide surprised circular eyes */}
            <circle cx="40" cy="44" r="6" fill="#00F0FF" />
            <circle cx="40" cy="44" r="2.5" fill="#0B132B" />
            <circle cx="60" cy="44" r="6" fill="#00F0FF" />
            <circle cx="60" cy="44" r="2.5" fill="#0B132B" />
            {/* Small 'o' mouth */}
            <ellipse cx="50" cy="55" rx="3" ry="4" fill="#00F0FF" />
          </g>
        );
      case 'concerned':
        return (
          <g>
            {/* Soft, concerned angled eyes */}
            <path
              d="M36 43 Q41 40 45 44"
              stroke="#00F0FF"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M55 44 Q59 40 64 43"
              stroke="#00F0FF"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Caring slight wobble mouth */}
            <path
              d="M45 55 Q50 52 55 55"
              stroke="#00F0FF"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        );
      case 'celebrating':
        return (
          <g>
            {/* Joyful upside-down curves */}
            <path
              d="M35 46 Q40 38 45 46"
              stroke="#FDE047"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M55 46 Q60 38 65 46"
              stroke="#FDE047"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Big celebratory grin */}
            <path
              d="M42 52 Q50 62 58 52"
              stroke="#FDE047"
              strokeWidth="3"
              strokeLinecap="round"
              fill="#FDE047"
              opacity="0.3"
            />
            {/* Confetti sparkle marks */}
            <polygon points="26,22 28,17 33,19 28,21" fill="#F43F5E" />
            <polygon points="72,20 77,18 75,23 79,24" fill="#10B981" />
            <polygon points="50,12 52,8 55,11 51,13" fill="#FBBF24" />
          </g>
        );
      case 'happy':
      default:
        return (
          <g>
            {/* Friendly cheerful crescent eyes */}
            <path
              d="M36 45 Q40 39 44 45"
              stroke="#00F0FF"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M56 45 Q60 39 64 45"
              stroke="#00F0FF"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Gentle smile */}
            <path
              d="M44 53 Q50 58 56 53"
              stroke="#00F0FF"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Soft digital glow cheek */}
            <circle cx="34" cy="51" r="3" fill="#38BDF8" opacity="0.4" />
            <circle cx="66" cy="51" r="3" fill="#38BDF8" opacity="0.4" />
          </g>
        );
    }
  };

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      {/* Optional Speech Bubble */}
      {showSpeech && speechText && (
        <motion.div
          initial={{ opacity: 0, y: 6, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="mb-2 max-w-[240px] px-3.5 py-2 bg-slate-900/90 backdrop-blur-md border border-cyan-500/30 rounded-2xl text-xs sm:text-sm text-cyan-100 shadow-lg shadow-cyan-950/40 relative font-medium leading-snug"
        >
          {speechText}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 border-r border-b border-cyan-500/30 rotate-45" />
        </motion.div>
      )}

      {/* Mascot Animated Body */}
      <motion.div
        animate={{
          y: expression === 'celebrating' ? [-4, -12, -4] : [-2, -6, -2],
          rotate: expression === 'thinking' ? [-2, 3, -2] : [0, 1, 0, -1, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: expression === 'celebrating' ? 1.4 : 3,
          ease: 'easeInOut',
        }}
        className={`${sizeMap[size]} relative filter drop-shadow-[0_8px_16px_rgba(0,240,255,0.25)]`}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          <defs>
            {/* Body gradient */}
            <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="60%" stopColor="#1E3A8A" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>

            {/* Visor gradient */}
            <linearGradient id="visorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#050C1A" />
              <stop offset="100%" stopColor="#0B1E38" />
            </linearGradient>

            {/* Neon Cyan Glow */}
            <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Floating Cyber Shadow */}
          <ellipse
            cx="50"
            cy="92"
            rx={expression === 'celebrating' ? 18 : 22}
            ry="4"
            fill="#000"
            opacity="0.35"
          />

          {/* Cyber Antenna */}
          <g>
            <path
              d="M50 24 L50 14"
              stroke="#38BDF8"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Pulsing beacon orb */}
            <circle
              cx="50"
              cy="12"
              r="4.5"
              fill="#00F0FF"
              filter="url(#cyanGlow)"
              className="animate-pulse"
            />
            <circle cx="50" cy="12" r="2" fill="#FFFFFF" />
          </g>

          {/* Left Ear / Audio Sensor */}
          <rect
            x="17"
            y="39"
            width="6"
            height="16"
            rx="3"
            fill="#8B5CF6"
            stroke="#C084FC"
            strokeWidth="1.5"
          />
          {/* Right Ear / Audio Sensor */}
          <rect
            x="77"
            y="39"
            width="6"
            height="16"
            rx="3"
            fill="#8B5CF6"
            stroke="#C084FC"
            strokeWidth="1.5"
          />

          {/* Main Bot Head / Helmet */}
          <rect
            x="22"
            y="22"
            width="56"
            height="50"
            rx="22"
            fill="url(#bodyGrad)"
            stroke="#38BDF8"
            strokeWidth="2"
          />

          {/* Visor Screen */}
          <rect
            x="27"
            y="32"
            width="46"
            height="32"
            rx="14"
            fill="url(#visorGrad)"
            stroke="#1E40AF"
            strokeWidth="1.5"
          />

          {/* Visor Glare Accent */}
          <path
            d="M32 35 Q40 34 48 35"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.25"
          />

          {/* Expressive Visor Eyes & Mouth */}
          {renderEyes()}

          {/* Little Floating Cyber Hands / Thrusters */}
          <motion.ellipse
            cx={expression === 'celebrating' ? 17 : 20}
            cy={expression === 'celebrating' ? 44 : 64}
            rx="4.5"
            ry="6"
            fill="#38BDF8"
            stroke="#0284C7"
            strokeWidth="1.5"
            animate={{
              y: expression === 'celebrating' ? [-2, -6, -2] : [0, 2, 0],
            }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          />
          <motion.ellipse
            cx={expression === 'celebrating' ? 83 : 80}
            cy={expression === 'celebrating' ? 44 : 64}
            rx="4.5"
            ry="6"
            fill="#38BDF8"
            stroke="#0284C7"
            strokeWidth="1.5"
            animate={{
              y: expression === 'celebrating' ? [-2, -6, -2] : [0, 2, 0],
            }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut', delay: 0.1 }}
          />

          {/* Tiny Body Badge / Shield Symbol */}
          <polygon
            points="50,75 44,79 46,84 50,86 54,84 56,79"
            fill="#10B981"
            stroke="#34D399"
            strokeWidth="1"
          />
        </svg>
      </motion.div>
    </div>
  );
};
