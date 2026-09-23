import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  Sparkles,
  Dices,
  UserCheck,
  Check,
  ArrowRight,
  ArrowLeft,
  Star,
  Zap,
  Lock,
  AlertTriangle,
  Award,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { AVATAR_OPTIONS } from '../../data';
import { ChildAgeGroup, UserProfile, MascotExpression } from '../../types';
import { CiberMascot } from '../CiberMascot';
import { useLanguage } from '../../i18n/LanguageContext';

interface ProfileCreationScreenProps {
  initialProfile: UserProfile;
  onSaveProfile: (profile: Partial<UserProfile>) => void;
  onComplete: () => void;
}

// Rich data for each guardian avatar
const GUARDIAN_DETAILS: Record<
  string,
  { role: string; description: string; tag: string; superpower: string }
> = {
  'bot-blue': {
    role: 'Especialista en Algoritmos',
    description: 'Analiza código y bloquea trampas antes de que lleguen a tu pantalla.',
    tag: 'Defensa Cuántica',
    superpower: '🛡️ Escudo Algorítmico',
  },
  'cat-cyber': {
    role: 'Cazadora Ágil de Enlaces',
    description: 'Reflejos felinos para esquivar links falsos y descargas sospechosas.',
    tag: 'Sigilo & Velocidad',
    superpower: '⚡ Reflejo Anti-Phishing',
  },
  'fox-cyber': {
    role: 'Rastreador de Trampas',
    description: 'Astuto olfateador de trampas en chats de videojuegos y grupos públicos.',
    tag: 'Astucia Digital',
    superpower: '🦊 Radar de Engaños',
  },
  'owl-shield': {
    role: 'Vigía de Contraseñas',
    description: 'Sabiduría y memoria fotográfica para forjar contraseñas impenetrables.',
    tag: 'Sabiduría & Cifrado',
    superpower: '🔑 Llave Maestra Cripto',
  },
  'bear-guardian': {
    role: 'Muralla de Cortafuegos',
    description: 'Fuerza titánica para repeler ataques y proteger tu red Wi-Fi de intrusos.',
    tag: 'Fuerza Titánica',
    superpower: '🧱 Muro Cortafuegos',
  },
  'hero-space': {
    role: 'Explorador del Ciberespacio',
    description: 'Viajero audaz que descubre nuevos mundos enseñando respeto y amistad online.',
    tag: 'Exploración & Valor',
    superpower: '🚀 Salto de Conectividad',
  },
};

// Rich aura palettes
const AURA_PALETTES = [
  {
    id: 'cyan',
    name: 'Cian Cuántico',
    hex: '#06b6d4',
    glow: 'rgba(6, 182, 212, 0.45)',
    power: 'Escudo Cuántico',
    desc: 'Claridad mental y máxima velocidad para esquivar trampas.',
  },
  {
    id: 'purple',
    name: 'Púrpura Cósmico',
    hex: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.45)',
    power: 'Velo de Sigilo',
    desc: 'Invisibilidad total ante rastreadores y anunciantes indiscretos.',
  },
  {
    id: 'emerald',
    name: 'Esmeralda Ciber',
    hex: '#10b981',
    glow: 'rgba(16, 185, 129, 0.45)',
    power: 'Bio-Firewall',
    desc: 'Regeneración activa de defensas para navegar tranquilo.',
  },
  {
    id: 'orange',
    name: 'Naranja Fuego',
    hex: '#f97316',
    glow: 'rgba(249, 115, 22, 0.45)',
    power: 'Alerta Rápida',
    desc: 'Sensor de peligro instantáneo ante mensajes sospechosos.',
  },
  {
    id: 'pink',
    name: 'Rosa Pulsar',
    hex: '#ec4899',
    glow: 'rgba(236, 72, 153, 0.45)',
    power: 'Onda de Resonancia',
    desc: 'Empatía y respeto para desactivar el ciberacoso y malos rollos.',
  },
  {
    id: 'blue',
    name: 'Azul Titán',
    hex: '#2563eb',
    glow: 'rgba(37, 99, 235, 0.45)',
    power: 'Blindaje Titán',
    desc: 'Seguridad robusta para bloquear cualquier intento de acceso.',
  },
  {
    id: 'amber',
    name: 'Dorado Solar',
    hex: '#eab308',
    glow: 'rgba(234, 179, 8, 0.45)',
    power: 'Luz de Sabiduría',
    desc: 'Distingue con facilidad entre fotos reales y contenidos falsos con IA.',
  },
];

// Age groups and pedagogical descriptions
const AGE_GROUPS_CONFIG: Array<{
  id: ChildAgeGroup;
  title: string;
  rankBadge: string;
  subtitle: string;
  desc: string;
  icon: string;
  accent: string;
  borderAccent: string;
  badgeBg: string;
  points: string[];
}> = [
  {
    id: '8–10',
    title: '8–10 años',
    rankBadge: 'Cadete Digital 🌟',
    subtitle: 'Primeros Pasos Seguros',
    desc: 'Aventuras ilustradas con conceptos claros. Aprende a divertirte sin compartir fotos privadas y pedir ayuda a un adulto.',
    icon: '🧭',
    accent: 'text-amber-600',
    borderAccent: 'border-amber-400',
    badgeBg: 'bg-amber-100 text-amber-800',
    points: ['Privacidad básica', 'Contraseñas con emojis', 'Juegos sin trampas'],
  },
  {
    id: '11–12',
    title: '11–12 años',
    rankBadge: 'Guardián Ciber 🛡️',
    subtitle: 'Videojuegos & Redes Sociales',
    desc: 'Detecta estafas en Roblox y Fortnite, crea contraseñas invulnerables y aprende a filtrar mensajes de desconocidos.',
    icon: '🎮',
    accent: 'text-cyan-600',
    borderAccent: 'border-cyan-500',
    badgeBg: 'bg-cyan-100 text-cyan-800',
    points: ['Anti-phishing gamer', 'Cuentas seguras', 'Amigos de verdad online'],
  },
  {
    id: '13–14',
    title: '13–14 años',
    rankBadge: 'Estratega Ciber ⚡',
    subtitle: 'Mundo Conectado & Pensamiento Crítico',
    desc: 'Controla tu huella digital permanente, detecta deepfakes y contenidos manipulados por IA, y frena el ciberacoso.',
    icon: '🤖',
    accent: 'text-purple-600',
    borderAccent: 'border-purple-500',
    badgeBg: 'bg-purple-100 text-purple-800',
    points: ['Huella digital permanente', 'Detector de IA y Deepfakes', 'Ciudadanía digital'],
  },
];

const SAFE_NICKNAMES_POOL = [
  'AstraShield',
  'PixelNova',
  'CyberLeo',
  'ByteGuardian',
  'EchoRunner',
  'ShadowDef',
  'QuantumFox',
  'VortexKid',
  'SolarFalcon',
  'GlitchZero',
  'NovaGuardian',
  'CyberPanda',
  'HyperTitan',
  'MegaByte',
  'ChronoWolf',
  'SkySentinel',
  'RadarGhost',
  'NeonSpark',
];

const STEP_INFO = [
  { step: 1, label: 'Guardián', icon: '🤖' },
  { step: 2, label: 'Aura', icon: '✨' },
  { step: 3, label: 'Edad', icon: '🎂' },
  { step: 4, label: 'Nickname', icon: '🛡️' },
];

export const ProfileCreationScreen: React.FC<ProfileCreationScreenProps> = ({
  initialProfile,
  onSaveProfile,
  onComplete,
}) => {
  const { t } = useLanguage();

  // Wizard Step (1: Guardian, 2: Aura, 3: Age, 4: Nickname)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [direction, setDirection] = useState<number>(1);
  const [isFinishing, setIsFinishing] = useState<boolean>(false);
  const [isSpinningDice, setIsSpinningDice] = useState<boolean>(false);

  // Form State
  const [selectedAvatar, setSelectedAvatar] = useState(initialProfile.avatarId || 'bot-blue');
  const [selectedColor, setSelectedColor] = useState(initialProfile.avatarColor || '#06b6d4');
  const [selectedAge, setSelectedAge] = useState<ChildAgeGroup>(initialProfile.ageGroup || '11–12');
  const [nickname, setNickname] = useState(initialProfile.nickname || 'CyberGamer');

  // Selected Data
  const currentAvatarData =
    AVATAR_OPTIONS.find((a) => a.id === selectedAvatar) || AVATAR_OPTIONS[0];
  const currentGuardianDetail =
    GUARDIAN_DETAILS[selectedAvatar] || GUARDIAN_DETAILS['bot-blue'];
  const currentAura =
    AURA_PALETTES.find((a) => a.hex === selectedColor) || AURA_PALETTES[0];
  const currentAgeConfig =
    AGE_GROUPS_CONFIG.find((a) => a.id === selectedAge) || AGE_GROUPS_CONFIG[1];

  // Random nickname generator with spin animation
  const handleRandomizeNick = () => {
    setIsSpinningDice(true);
    setTimeout(() => setIsSpinningDice(false), 600);
    const filtered = SAFE_NICKNAMES_POOL.filter((n) => n !== nickname);
    const random = filtered[Math.floor(Math.random() * filtered.length)];
    setNickname(random);
  };

  // Nickname privacy validation check
  const checkNicknamePrivacyWarning = (name: string): string | null => {
    const trimmed = name.trim().toLowerCase();
    if (!trimmed) return null;
    const realNames = [
      'juan',
      'maria',
      'pedro',
      'pablo',
      'lucas',
      'sofia',
      'mateo',
      'valen',
      'gonzalez',
      'perez',
      'garcia',
      'lopez',
      'colegio',
      'escuela',
      'madrid',
      'bogota',
      'mexico',
      'lima',
      'santiago',
    ];
    for (const forbidden of realNames) {
      if (trimmed.includes(forbidden)) {
        return '⚠️ ¡Alerta de privacidad! No uses tu nombre real, apellidos o colegio.';
      }
    }
    const birthYearMatch = trimmed.match(/20(0[5-9]|1[0-9]|2[0-5])/);
    if (birthYearMatch) {
      return '⚠️ ¡Cuidado! Parece que incluiste tu año de nacimiento. Usa números de fantasía.';
    }
    return null;
  };

  const privacyWarning = checkNicknamePrivacyWarning(nickname);

  // Navigation handlers
  const goToNextStep = () => {
    if (currentStep < 4) {
      setDirection(1);
      setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
    }
  };

  const jumpToStep = (targetStep: 1 | 2 | 3 | 4) => {
    if (targetStep === currentStep) return;
    setDirection(targetStep > currentStep ? 1 : -1);
    setCurrentStep(targetStep);
  };

  // Final submission
  const handleFinalSubmit = () => {
    setIsFinishing(true);
    onSaveProfile({
      nickname: nickname.trim() || 'Guardián',
      avatarId: selectedAvatar,
      avatarColor: selectedColor,
      ageGroup: selectedAge,
    });
    setTimeout(() => {
      onComplete();
    }, 600);
  };

  // Mascot dynamic expression based on step
  const getMascotExpression = (): MascotExpression => {
    switch (currentStep) {
      case 1:
        return 'excited';
      case 2:
        return 'happy';
      case 3:
        return 'thinking';
      case 4:
        return isFinishing ? 'celebrating' : 'proud' as MascotExpression;
      default:
        return 'happy';
    }
  };

  // Step transition variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.28,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -50 : 50,
      opacity: 0,
      scale: 0.98,
      transition: {
        duration: 0.18,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 text-slate-900 select-none overflow-hidden">
      {/* Top Header & Interactive Stepper */}
      <header className="px-5 pt-4 pb-2 bg-white/80 backdrop-blur-md border-b border-slate-100 flex-shrink-0 z-20">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-white shadow-sm transition-colors duration-300"
              style={{ backgroundColor: selectedColor }}
            >
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800">
                  Paso {currentStep} de 4
                </span>
                <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                  • Registro CiberKids
                </span>
              </div>
              <h1 className="text-sm font-black text-slate-900 tracking-tight leading-tight">
                {currentStep === 1 && '1. Elige tu Guardián'}
                {currentStep === 2 && '2. Color de tu Aura'}
                {currentStep === 3 && '3. Rango de Edad'}
                {currentStep === 4 && '4. Tu Nickname Seguro'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CiberMascot size="sm" expression={getMascotExpression()} />
          </div>
        </div>

        {/* Progress Bar & Step Dots */}
        <div className="relative mb-1">
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${(currentStep / 4) * 100}%`,
                background: `linear-gradient(90deg, #06b6d4, ${selectedColor})`,
              }}
              layout
            />
          </div>
        </div>

        {/* Clickable Step Pills */}
        <div className="flex items-center justify-between pt-1">
          {STEP_INFO.map((item) => {
            const isCompleted = item.step < currentStep;
            const isCurrent = item.step === currentStep;
            return (
              <button
                key={item.step}
                type="button"
                onClick={() => jumpToStep(item.step as 1 | 2 | 3 | 4)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-slate-900 text-white shadow-xs'
                    : isCompleted
                    ? 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <span>{item.icon}</span>
                <span className="hidden sm:inline text-[11px]">{item.label}</span>
                {isCompleted && <Check className="w-3 h-3 text-cyan-600 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Animated Views Container */}
      <main className="flex-1 overflow-y-auto px-4 py-3 flex flex-col items-center justify-between relative scrollbar-none">
        <AnimatePresence mode="wait" custom={direction}>
          {/* ================= STEP 1: ELIGE TU GUARDIÁN ================= */}
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-lg flex flex-col gap-3.5 my-auto"
            >
              {/* Header description */}
              <div className="text-center px-2">
                <span className="text-[11px] font-bold text-cyan-600 uppercase tracking-wider">
                  ¡Compañero Digital de Aventura!
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                  Selecciona tu Guardián Cibernético
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cada guardián tiene habilidades especiales para proteger tus datos en la red.
                </p>
              </div>

              {/* Hero Spotlight of Selected Guardian */}
              <motion.div
                key={selectedAvatar}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex items-center gap-4 relative overflow-hidden"
              >
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl relative shadow-inner flex-shrink-0 transition-transform duration-300"
                  style={{
                    backgroundColor: `${selectedColor}18`,
                    border: `2px solid ${selectedColor}`,
                  }}
                >
                  <motion.span
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                  >
                    {currentAvatarData.icon}
                  </motion.span>
                  <div
                    className="absolute -bottom-2 px-2 py-0.5 rounded-full text-[9px] font-black text-white shadow-xs"
                    style={{ backgroundColor: selectedColor }}
                  >
                    NIVEL 1
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap mb-1">
                    <h3 className="text-base font-black text-slate-900">
                      {currentAvatarData.name}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {currentGuardianDetail.tag}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-cyan-700 mb-1">
                    {currentGuardianDetail.role}
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {currentGuardianDetail.description}
                  </p>
                </div>
              </motion.div>

              {/* Grid of 6 Avatar Options */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                {AVATAR_OPTIONS.map((avatar) => {
                  const isSelected = avatar.id === selectedAvatar;
                  return (
                    <motion.button
                      key={avatar.id}
                      type="button"
                      whileHover={{ scale: 1.04, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedAvatar(avatar.id)}
                      className={`p-2.5 rounded-2xl flex flex-col items-center gap-1.5 transition-all cursor-pointer border relative text-center ${
                        isSelected
                          ? 'bg-cyan-50 border-cyan-500 shadow-md ring-2 ring-cyan-400/40'
                          : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50 shadow-xs'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-cyan-500 text-white rounded-full flex items-center justify-center shadow-xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                      <span className="text-3xl sm:text-2xl">{avatar.icon}</span>
                      <span
                        className={`text-[11px] font-black truncate max-w-full ${
                          isSelected ? 'text-cyan-900' : 'text-slate-700'
                        }`}
                      >
                        {avatar.name}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Safe Tip Card */}
              <div className="bg-cyan-50/70 border border-cyan-100 rounded-2xl p-3 flex items-center gap-2.5 text-cyan-900 text-xs">
                <Sparkles className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                <span>
                  <strong>Tip de Ciber:</strong> No te preocupes, ¡podrás desbloquear nuevos trajes y accesorios para tu guardián con tus monedas!
                </span>
              </div>
            </motion.div>
          )}

          {/* ================= STEP 2: COLOR DE TU AURA ================= */}
          {currentStep === 2 && (
            <motion.div
              key="step-2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-lg flex flex-col gap-3.5 my-auto"
            >
              {/* Step Header */}
              <div className="text-center px-2">
                <span className="text-[11px] font-bold text-cyan-600 uppercase tracking-wider">
                  Campo de Fuerza Digital
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                  Sintoniza el Color de tu Aura
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tu aura genera un escudo energético que blindará tu identidad.
                </p>
              </div>

              {/* Interactive Aura Chamber */}
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col items-center relative overflow-hidden">
                {/* Background decorative glow */}
                <div
                  className="absolute w-44 h-44 rounded-full blur-2xl opacity-35 transition-colors duration-500 pointer-events-none"
                  style={{ backgroundColor: selectedColor }}
                />

                {/* Concentric pulsing aura waves */}
                <div className="relative w-32 h-32 flex items-center justify-center my-2">
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.35, 0.05, 0.35] }}
                    transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
                    className="absolute inset-0 rounded-full"
                    style={{ border: `3px solid ${selectedColor}` }}
                  />
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.15, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2.4, delay: 0.4, ease: 'easeInOut' }}
                    className="absolute inset-2 rounded-full"
                    style={{ border: `2.5px solid ${selectedColor}` }}
                  />

                  {/* Guardian Center */}
                  <motion.div
                    key={selectedColor}
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl z-10 shadow-lg relative"
                    style={{
                      backgroundColor: `${selectedColor}25`,
                      border: `3px solid ${selectedColor}`,
                      boxShadow: `0 0 25px ${currentAura.glow}`,
                    }}
                  >
                    <span>{currentAvatarData.icon}</span>
                    <Sparkles
                      className="w-4 h-4 absolute -top-1.5 -right-1.5 animate-bounce"
                      style={{ color: selectedColor }}
                    />
                  </motion.div>
                </div>

                {/* Aura Power Description */}
                <div className="text-center mt-2 z-10">
                  <div
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black text-white shadow-xs mb-1"
                    style={{ backgroundColor: selectedColor }}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{currentAura.power}</span>
                  </div>
                  <p className="text-xs font-medium text-slate-600 max-w-xs mx-auto">
                    {currentAura.desc}
                  </p>
                </div>
              </div>

              {/* Color Orbs Palette */}
              <div className="bg-white rounded-3xl p-3.5 shadow-sm border border-slate-100">
                <label className="block text-center text-xs font-bold text-slate-700 mb-2.5">
                  Elige tu frecuencia de color favorita:
                </label>
                <div className="flex items-center justify-center gap-2.5 sm:gap-3.5 flex-wrap">
                  {AURA_PALETTES.map((palette) => {
                    const isSelected = selectedColor === palette.hex;
                    return (
                      <motion.button
                        key={palette.hex}
                        type="button"
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedColor(palette.hex)}
                        style={{
                          backgroundColor: palette.hex,
                          boxShadow: isSelected ? `0 0 16px ${palette.glow}` : 'none',
                        }}
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer relative ${
                          isSelected
                            ? 'ring-4 ring-slate-900/20 scale-110 shadow-md'
                            : 'opacity-85 hover:opacity-100'
                        }`}
                        title={palette.name}
                      >
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 500 }}
                          >
                            <Check className="w-5 h-5 text-white stroke-[3] drop-shadow-sm" />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
                <p className="text-center text-[11px] font-bold text-slate-500 mt-2">
                  {currentAura.name}
                </p>
              </div>
            </motion.div>
          )}

          {/* ================= STEP 3: RANGO DE EDAD ================= */}
          {currentStep === 3 && (
            <motion.div
              key="step-3"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-lg flex flex-col gap-3 my-auto"
            >
              {/* Step Header */}
              <div className="text-center px-2">
                <span className="text-[11px] font-bold text-cyan-600 uppercase tracking-wider">
                  Aventura a tu Medida
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                  ¿Cuál es tu Rango de Edad?
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Adaptamos la dificultad de las misiones y explicaciones a tu nivel.
                </p>
              </div>

              {/* Age Selection Cards */}
              <div className="flex flex-col gap-2.5">
                {AGE_GROUPS_CONFIG.map((group) => {
                  const isSelected = selectedAge === group.id;
                  return (
                    <motion.button
                      key={group.id}
                      type="button"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedAge(group.id)}
                      className={`p-3.5 rounded-3xl text-left transition-all cursor-pointer border relative flex items-start gap-3.5 ${
                        isSelected
                          ? `bg-white ${group.borderAccent} shadow-md ring-2 ring-cyan-500/30`
                          : 'bg-white/90 border-slate-100 hover:border-slate-200 hover:bg-white shadow-xs'
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-inner ${
                          isSelected ? 'bg-cyan-50 border border-cyan-200' : 'bg-slate-50'
                        }`}
                      >
                        {group.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-slate-900">
                              {group.title}
                            </span>
                            <span
                              className={`text-[10px] font-black px-2 py-0.5 rounded-full ${group.badgeBg}`}
                            >
                              {group.rankBadge}
                            </span>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-cyan-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </div>

                        <p className="text-[11px] font-bold text-slate-700 mb-1">
                          {group.subtitle}
                        </p>
                        <p className="text-[11px] text-slate-500 leading-relaxed mb-2">
                          {group.desc}
                        </p>

                        <div className="flex items-center gap-1.5 flex-wrap">
                          {group.points.map((pt, idx) => (
                            <span
                              key={idx}
                              className="text-[9px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                            >
                              ✓ {pt}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ================= STEP 4: NICKNAME SEGURO ================= */}
          {currentStep === 4 && (
            <motion.div
              key="step-4"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-lg flex flex-col gap-3 my-auto"
            >
              {/* Step Header */}
              <div className="text-center px-2">
                <span className="text-[11px] font-bold text-cyan-600 uppercase tracking-wider">
                  Identidad Secreta & Anónima
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                  Tu Nickname Seguro de Guardián
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Regla de oro: En Internet, tu verdadero nombre debe ser tu mayor secreto.
                </p>
              </div>

              {/* Holographic Guardian ID Card Preview */}
              <motion.div
                layout
                className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-3xl p-4 shadow-xl border border-slate-700/60 relative overflow-hidden"
              >
                {/* Aura border glow */}
                <div
                  className="absolute top-0 right-0 w-36 h-36 rounded-full blur-2xl opacity-30 pointer-events-none"
                  style={{ backgroundColor: selectedColor }}
                />

                <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-[10px] font-black tracking-widest uppercase text-cyan-300">
                      CIBERKIDS • LICENCIA DE GUARDIÁN
                    </span>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                    NIVEL 1 RECLUTA
                  </span>
                </div>

                <div className="flex items-center gap-3.5">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl relative shadow-md flex-shrink-0"
                    style={{
                      backgroundColor: `${selectedColor}30`,
                      border: `2px solid ${selectedColor}`,
                    }}
                  >
                    <span>{currentAvatarData.icon}</span>
                    <div
                      className="w-3 h-3 rounded-full absolute -top-1 -right-1 ring-2 ring-slate-900"
                      style={{ backgroundColor: selectedColor }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                      NOMBRE CLAVE:
                    </div>
                    <div className="text-lg font-black text-white tracking-tight truncate flex items-center gap-2">
                      <span>{nickname.trim() || 'GuardiánSecreto'}</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/10 text-cyan-300">
                        {currentAgeConfig.rankBadge}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Aura: {currentAura.name}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Interactive Nickname Input Form */}
              <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Escribe o Genera tu Nickname:</span>
                  </label>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={handleRandomizeNick}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-700 text-xs font-black cursor-pointer shadow-xs transition"
                  >
                    <motion.div
                      animate={isSpinningDice ? { rotate: [0, 360] } : {}}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                    >
                      <Dices className="w-3.5 h-3.5" />
                    </motion.div>
                    <span>Sugerir Nombre</span>
                  </motion.button>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    maxLength={15}
                    placeholder="Ej. GuardiánPixel"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:border-cyan-500 focus:bg-white text-slate-900 text-sm font-bold outline-none transition pr-14"
                  />
                  <span className="absolute right-3.5 top-3.5 text-[11px] text-slate-400 font-mono font-bold">
                    {nickname.length}/15
                  </span>
                </div>

                {/* Real-time privacy alert or validation */}
                {privacyWarning ? (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2"
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>{privacyWarning}</span>
                  </motion.div>
                ) : (
                  <div className="mt-2 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      Nickname 100% Anónimo y Seguro
                    </span>
                    <span className="text-slate-400">Protege tu privacidad</span>
                  </div>
                )}
              </div>

              {/* Golden safety reminder */}
              <div className="bg-slate-100/80 rounded-2xl p-3 flex items-center gap-2.5 text-slate-600 text-xs">
                <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>
                  <strong>¡Misión cumplida!</strong> Tu identidad está blindada. Los malos cibernéticos no podrán rastrear tu verdadera persona.
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation Control Bar */}
      <footer className="p-4 bg-white/95 backdrop-blur-md border-t border-slate-100 flex-shrink-0 z-20">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          {/* Back Button */}
          {currentStep > 1 && (
            <button
              type="button"
              onClick={goToPrevStep}
              className="px-4 py-3.5 rounded-2xl font-bold text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Atrás</span>
            </button>
          )}

          {/* Forward / Save Button */}
          {currentStep < 4 ? (
            <button
              type="button"
              onClick={goToNextStep}
              className="flex-1 py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm tracking-wide text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              style={{
                background: `linear-gradient(135deg, #06b6d4, ${selectedColor})`,
                boxShadow: `0 8px 20px -4px ${selectedColor}60`,
              }}
            >
              <span>
                {currentStep === 1 && 'Siguiente: Color de tu Aura'}
                {currentStep === 2 && 'Siguiente: Rango de Edad'}
                {currentStep === 3 && 'Siguiente: Tu Nickname Seguro'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={isFinishing || !nickname.trim()}
              className="flex-1 py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm tracking-wide text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #059669, #0284c7)',
                boxShadow: '0 8px 20px -4px rgba(2, 132, 199, 0.5)',
              }}
            >
              <UserCheck className="w-4 h-4" />
              <span>
                {isFinishing ? '¡Preparando Tu Misión...' : '¡Guardar y Comenzar Mi Aventura! 🚀'}
              </span>
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};

