import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  Sparkles,
  Dices,
  Check,
  ArrowRight,
  ArrowLeft,
  Lock,
  Award,
  Zap,
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

interface GuardianDetail {
  role: string;
  description: string;
  tag: string;
  superpower: string;
}

interface AuraPalette {
  id: string;
  name: string;
  hex: string;
  glow: string;
  power: string;
  desc: string;
}

interface AgeGroupConfig {
  id: ChildAgeGroup;
  title: string;
  rankBadge: string;
  subtitle: string;
  desc: string;
  icon: string;
  accent: string;
  borderAccent: string;
  points: string[];
}

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

export const ProfileCreationScreen: React.FC<ProfileCreationScreenProps> = ({
  initialProfile,
  onSaveProfile,
  onComplete,
}) => {
  const { language } = useLanguage();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [direction, setDirection] = useState<number>(1);
  const [isFinishing, setIsFinishing] = useState<boolean>(false);
  const [isSpinningDice, setIsSpinningDice] = useState<boolean>(false);

  const [selectedAvatar, setSelectedAvatar] = useState(initialProfile.avatarId || 'bot-blue');
  const [selectedColor, setSelectedColor] = useState(initialProfile.avatarColor || '#06b6d4');
  const [selectedAge, setSelectedAge] = useState<ChildAgeGroup>(initialProfile.ageGroup || '11–12');
  const [nickname, setNickname] = useState(initialProfile.nickname || 'CyberGamer');

  // Multi-language text dictionaries
  const loc = useMemo(() => {
    if (language === 'es') {
      return {
        stepLabel: (step: number) => `Paso ${step} de 4`,
        regTitle: 'Registro CiberKids',
        step1Header: '1. Elige tu Guardián',
        step2Header: '2. Color de tu Aura',
        step3Header: '3. Rango de Edad',
        step4Header: '4. Tu Nickname Seguro',
        step1SubTag: '¡Compañero Digital de Aventura!',
        step1Title: 'Selecciona tu Guardián Cibernético',
        step1Desc: 'Cada guardián tiene habilidades especiales para proteger tus datos en la red.',
        step2SubTag: 'Paleta de Energía',
        step2Title: 'Selecciona tu Color de Aura',
        step2Desc: 'Elige el color que rodeará y potenciará los escudos de tu guardián.',
        step3SubTag: 'Configuración de Retos',
        step3Title: 'Selecciona tu Edad',
        step3Desc: 'Adaptaremos las misiones, el vocabulario y los simuladores a tu etapa.',
        step4SubTag: 'Identidad Segura',
        step4Title: 'Elige tu Nickname Seguro',
        step4Desc: 'Tu apodo en el juego. Nunca uses tu nombre real, apellidos o colegio.',
        level1Badge: 'NIVEL 1',
        specialPowerLabel: 'SUPERPODER DIGITAL',
        selectedBadge: 'Seleccionado',
        inputPlaceholder: 'Escribe tu apodo secreto...',
        randomBtn: 'Generar apodo seguro',
        rulesTitle: 'Reglas de oro para tu apodo:',
        rule1: 'Sin nombres reales ni apellidos familiares.',
        rule2: 'Sin tu fecha ni año exacto de nacimiento.',
        rule3: 'Sin datos de tu colegio, ciudad o barrio.',
        backBtn: 'Atrás',
        nextBtn: 'Continuar',
        finishBtn: '¡Guardar y Comenzar Aventura!',
        savingBtn: 'Creando Perfil...',
        realNameWarning: '⚠️ ¡Alerta de privacidad! No uses tu nombre real, apellidos o colegio.',
        birthYearWarning: '⚠️ ¡Cuidado! Parece que incluiste tu año de nacimiento. Usa números de fantasía.',
        stepItems: [
          { step: 1, label: 'Guardián', icon: '🤖' },
          { step: 2, label: 'Aura', icon: '✨' },
          { step: 3, label: 'Edad', icon: '🎂' },
          { step: 4, label: 'Nickname', icon: '🛡️' },
        ],
        guardians: {
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
        } as Record<string, GuardianDetail>,
        auras: [
          { id: 'cyan', name: 'Cian Cuántico', hex: '#06b6d4', glow: 'rgba(6, 182, 212, 0.45)', power: 'Escudo Cuántico', desc: 'Claridad mental y máxima velocidad para esquivar trampas.' },
          { id: 'purple', name: 'Púrpura Cósmico', hex: '#a855f7', glow: 'rgba(168, 85, 247, 0.45)', power: 'Velo de Sigilo', desc: 'Invisibilidad total ante rastreadores y anunciantes indiscretos.' },
          { id: 'emerald', name: 'Esmeralda Ciber', hex: '#10b981', glow: 'rgba(168, 185, 129, 0.45)', power: 'Bio-Firewall', desc: 'Regeneración activa de defensas para navegar tranquilo.' },
          { id: 'orange', name: 'Naranja Fuego', hex: '#f97316', glow: 'rgba(249, 115, 22, 0.45)', power: 'Alerta Rápida', desc: 'Sensor de peligro instantáneo ante mensajes sospechosos.' },
          { id: 'pink', name: 'Rosa Pulsar', hex: '#ec4899', glow: 'rgba(236, 72, 153, 0.45)', power: 'Onda de Resonancia', desc: 'Empatía y respeto para desactivar el ciberacoso y malos rollos.' },
          { id: 'blue', name: 'Azul Titán', hex: '#2563eb', glow: 'rgba(37, 99, 235, 0.45)', power: 'Blindaje Titán', desc: 'Seguridad robusta para bloquear cualquier intento de acceso.' },
          { id: 'amber', name: 'Dorado Solar', hex: '#eab308', glow: 'rgba(234, 179, 8, 0.45)', power: 'Luz de Sabiduría', desc: 'Distingue con facilidad entre fotos reales y contenidos falsos con IA.' },
        ] as AuraPalette[],
        ageGroups: [
          {
            id: '8–10' as ChildAgeGroup,
            title: '8–10 años',
            rankBadge: 'Cadete Digital 🌟',
            subtitle: 'Primeros Pasos Seguros',
            desc: 'Aventuras ilustradas con conceptos claros. Aprende a divertirte sin compartir fotos privadas y pedir ayuda a un adulto.',
            icon: '🧭',
            accent: 'text-amber-600',
            borderAccent: 'border-amber-400',
            points: ['Privacidad básica', 'Contraseñas con emojis', 'Juegos sin trampas'],
          },
          {
            id: '11–12' as ChildAgeGroup,
            title: '11–12 años',
            rankBadge: 'Guardián Ciber 🛡️',
            subtitle: 'Videojuegos & Redes Sociales',
            desc: 'Detecta estafas en Roblox y Fortnite, crea contraseñas invulnerables y aprende a filtrar mensajes de desconocidos.',
            icon: '🎮',
            accent: 'text-cyan-600',
            borderAccent: 'border-cyan-500',
            points: ['Anti-phishing gamer', 'Cuentas seguras', 'Amigos de verdad online'],
          },
          {
            id: '13–14' as ChildAgeGroup,
            title: '13–14 años',
            rankBadge: 'Estratega Ciber ⚡',
            subtitle: 'Mundo Conectado & Pensamiento Crítico',
            desc: 'Controla tu huella digital permanente, detecta deepfakes y contenidos manipulados por IA, y frena el ciberacoso.',
            icon: '🤖',
            accent: 'text-purple-600',
            borderAccent: 'border-purple-500',
            points: ['Huella digital permanente', 'Detector de IA y Deepfakes', 'Ciudadanía digital'],
          },
        ] as AgeGroupConfig[],
      };
    }

    if (language === 'fr') {
      return {
        stepLabel: (step: number) => `Étape ${step} sur 4`,
        regTitle: 'Inscription CiberKids',
        step1Header: '1. Choisis ton Gardien',
        step2Header: '2. Couleur de ton Aura',
        step3Header: '3. Tranche d’Âge',
        step4Header: '4. Ton Pseudo Sécurisé',
        step1SubTag: 'Compagnon Digital d’Aventure !',
        step1Title: 'Sélectionne ton Gardien Numérique',
        step1Desc: 'Chaque gardien dispose de capacités uniques pour protéger tes données en ligne.',
        step2SubTag: 'Palette d’Énergie',
        step2Title: 'Sélectionne ta Couleur d’Aura',
        step2Desc: 'Choisis la couleur qui illuminera et renforcera les boucliers de ton gardien.',
        step3SubTag: 'Configuration des Défis',
        step3Title: 'Sélectionne ton Âge',
        step3Desc: 'Nous calibrons les quêtes, le vocabulaire et les simulateurs selon ton niveau.',
        step4SubTag: 'Identité Secrète',
        step4Title: 'Choisis ton Pseudo Sécurisé',
        step4Desc: 'Ton identifiant public. Ne partage jamais ton vrai nom, ton école ou ta ville.',
        level1Badge: 'NIVEAU 1',
        specialPowerLabel: 'SUPER-POUVOIR DIGITAL',
        selectedBadge: 'Sélectionné',
        inputPlaceholder: 'Tape ton pseudo secret...',
        randomBtn: 'Générer un pseudo aléatoire',
        rulesTitle: 'Règles d’or pour ton pseudo :',
        rule1: 'Pas de vrai prénom ni de nom de famille.',
        rule2: 'Pas d’année ou date exacte de naissance.',
        rule3: 'Pas de mention de ton école ou de ta ville.',
        backBtn: 'Retour',
        nextBtn: 'Continuer',
        finishBtn: 'Enregistrer & Commencer l’Aventure !',
        savingBtn: 'Création du profil...',
        realNameWarning: '⚠️ Alerte confidentialité ! N’utilise pas ton vrai nom ou ton école.',
        birthYearWarning: '⚠️ Attention ! Tu sembles avoir inclus ton année de naissance.',
        stepItems: [
          { step: 1, label: 'Gardien', icon: '🤖' },
          { step: 2, label: 'Aura', icon: '✨' },
          { step: 3, label: 'Âge', icon: '🎂' },
          { step: 4, label: 'Pseudo', icon: '🛡️' },
        ],
        guardians: {
          'bot-blue': {
            role: 'Spécialiste des Algorithmes',
            description: 'Analyse le code et neutralise les pièges avant qu’ils n’atteignent ton écran.',
            tag: 'Défense Quantique',
            superpower: '🛡️ Bouclier Algorithmique',
          },
          'cat-cyber': {
            role: 'Chasseuse Agile de Liens',
            description: 'Réflexes félins pour esquiver les liens douteux et téléchargements suspects.',
            tag: 'Vitesse & Furtivité',
            superpower: '⚡ Réflexe Anti-Hameçonnage',
          },
          'fox-cyber': {
            role: 'Traqueur de Pièges',
            description: 'Flair affûté pour repérer les arnaques dans les chats de jeu vidéo et forums.',
            tag: 'Ruse Digitale',
            superpower: '🦊 Radar d’Escroqueries',
          },
          'owl-shield': {
            role: 'Sentinelle des Mots de Passe',
            description: 'Mémoire infaillible pour forger des phrases de passe impénétrables.',
            tag: 'Chiffrement & Sagesse',
            superpower: '🔑 Clé Maîtresse Crypto',
          },
          'bear-guardian': {
            role: 'Rempart Pare-Feu',
            description: 'Force herculéenne pour bloquer les attaques et sécuriser ton Wi-Fi.',
            tag: 'Force Titanesque',
            superpower: '🧱 Mur Pare-Feu',
          },
          'hero-space': {
            role: 'Explorateur du Cyberespace',
            description: 'Voyageur audacieux découvrant de nouveaux mondes avec bienveillance et respect.',
            tag: 'Courage & Exploration',
            superpower: '🚀 Saut de Connectivité',
          },
        } as Record<string, GuardianDetail>,
        auras: [
          { id: 'cyan', name: 'Cyan Quantique', hex: '#06b6d4', glow: 'rgba(6, 182, 212, 0.45)', power: 'Bouclier Quantique', desc: 'Clarté d’esprit et vitesse maximale pour esquiver les pièges.' },
          { id: 'purple', name: 'Pourpre Cosmique', hex: '#a855f7', glow: 'rgba(168, 85, 247, 0.45)', power: 'Voile Furtif', desc: 'Invisibilité complète face aux traqueurs et publicités intrusives.' },
          { id: 'emerald', name: 'Émeraude Cyber', hex: '#10b981', glow: 'rgba(16, 185, 129, 0.45)', power: 'Bio-Pare-Feu', desc: 'Régénération active des défenses pour surfer en toute sérénité.' },
          { id: 'orange', name: 'Orange Flamboyant', hex: '#f97316', glow: 'rgba(249, 115, 22, 0.45)', power: 'Alerte Rapide', desc: 'Radar de danger immédiat face aux messages douteux.' },
          { id: 'pink', name: 'Rose Pulsar', hex: '#ec4899', glow: 'rgba(236, 72, 153, 0.45)', power: 'Onde de Résonance', desc: 'Empathie et respect pour désamorcer les tensions et le cyberharcèlement.' },
          { id: 'blue', name: 'Bleu Titan', hex: '#2563eb', glow: 'rgba(37, 99, 235, 0.45)', power: 'Blindage Titan', desc: 'Protection renforcée bloquant toute tentative d’accès non autorisé.' },
          { id: 'amber', name: 'Or Solaire', hex: '#eab308', glow: 'rgba(234, 179, 8, 0.45)', power: 'Lumière de Sagesse', desc: 'Distingue avec aisance les images réelles des contenus IA synthétiques.' },
        ] as AuraPalette[],
        ageGroups: [
          {
            id: '8–10' as ChildAgeGroup,
            title: '8–10 ans',
            rankBadge: 'Cadet Digital 🌟',
            subtitle: 'Premiers Pas Sécurisés',
            desc: 'Quêtes illustrées avec des notions claires. Apprends à jouer sans partager de photos privées et à demander l’aide d’un adulte.',
            icon: '🧭',
            accent: 'text-amber-600',
            borderAccent: 'border-amber-400',
            points: ['Confidentialité simple', 'Mots de passe à émojis', 'Jeux sans pièges'],
          },
          {
            id: '11–12' as ChildAgeGroup,
            title: '11–12 ans',
            rankBadge: 'Gardien Cyber 🛡️',
            subtitle: 'Jeux Vidéo & Réseaux Sociaux',
            desc: 'Déjoue les arnaques sur Roblox et Fortnite, crée des phrases de passe robustes et filtre les messages d’inconnus.',
            icon: '🎮',
            accent: 'text-cyan-600',
            borderAccent: 'border-cyan-500',
            points: ['Anti-hameçonnage gamer', 'Comptes protégés', 'Vrais amis en ligne'],
          },
          {
            id: '13–14' as ChildAgeGroup,
            title: '13–14 ans',
            rankBadge: 'Stratège Cyber ⚡',
            subtitle: 'Monde Connecté & Esprit Critique',
            desc: 'Maîtrise ton empreinte numérique, détecte les hypertrucages IA et freine le cyberharcèlement.',
            icon: '🤖',
            accent: 'text-purple-600',
            borderAccent: 'border-purple-500',
            points: ['Empreinte permanente', 'Détecteur IA & Deepfakes', 'Citoyenneté numérique'],
          },
        ] as AgeGroupConfig[],
      };
    }

    // Default: English (Primary language per user instructions)
    return {
      stepLabel: (step: number) => `Step ${step} of 4`,
      regTitle: 'CiberKids Onboarding',
      step1Header: '1. Choose Your Guardian',
      step2Header: '2. Your Aura Color',
      step3Header: '3. Age Group',
      step4Header: '4. Safe Nickname',
      step1SubTag: 'Digital Adventure Companion!',
      step1Title: 'Select Your Cyber Guardian',
      step1Desc: 'Each guardian possesses special skills to safeguard your personal data across the web.',
      step2SubTag: 'Energy Palette',
      step2Title: 'Choose Your Aura Glow',
      step2Desc: 'Select the protective aura that surrounds and empowers your guardian companion.',
      step3SubTag: 'Quest Calibration',
      step3Title: 'Select Your Age Tier',
      step3Desc: 'We calibrate mission difficulty, vocabulary, and games to match your experience.',
      step4SubTag: 'Secret Identity',
      step4Title: 'Choose a Safe Nickname',
      step4Desc: 'Your public gamer handle. Never use your real name, surname, school, or town.',
      level1Badge: 'LEVEL 1',
      specialPowerLabel: 'DIGITAL SUPERPOWER',
      selectedBadge: 'Selected',
      inputPlaceholder: 'Enter your secret nickname...',
      randomBtn: 'Generate safe nickname',
      rulesTitle: 'Golden safety rules for your nickname:',
      rule1: 'No real first or last names.',
      rule2: 'No exact birth year or birthday numbers.',
      rule3: 'No mention of your school, neighborhood, or city.',
      backBtn: 'Back',
      nextBtn: 'Continue',
      finishBtn: 'Save & Start Adventure!',
      savingBtn: 'Creating Profile...',
      realNameWarning: '⚠️ Privacy alert! Do not use your real name, surname, or school name.',
      birthYearWarning: '⚠️ Be careful! It looks like you included your birth year. Use fantasy numbers instead.',
      stepItems: [
        { step: 1, label: 'Guardian', icon: '🤖' },
        { step: 2, label: 'Aura', icon: '✨' },
        { step: 3, label: 'Age', icon: '🎂' },
        { step: 4, label: 'Nickname', icon: '🛡️' },
      ],
      guardians: {
        'bot-blue': {
          role: 'Algorithm Specialist',
          description: 'Scans code and neutralizes digital traps before they ever reach your screen.',
          tag: 'Quantum Defense',
          superpower: '🛡️ Algorithmic Shield',
        },
        'cat-cyber': {
          role: 'Agile Link Stalker',
          description: 'Feline reflexes dodging deceptive phishing links and suspicious downloads.',
          tag: 'Stealth & Speed',
          superpower: '⚡ Anti-Phishing Reflex',
        },
        'fox-cyber': {
          role: 'Scam Tracker',
          description: 'Sharp senses detecting traps in gaming chats, trades, and public multiplayer lobbies.',
          tag: 'Digital Cunning',
          superpower: '🦊 Deception Radar',
        },
        'owl-shield': {
          role: 'Password Sentinel',
          description: 'Wisdom and photographic memory forging unbreakable cipher passphrases.',
          tag: 'Cipher & Wisdom',
          superpower: '🔑 Crypto Masterkey',
        },
        'bear-guardian': {
          role: 'Firewall Rampart',
          description: 'Titanic strength repelling brute attacks and keeping Wi-Fi intruders out.',
          tag: 'Titanic Force',
          superpower: '🧱 Firewall Fortress',
        },
        'hero-space': {
          role: 'Cyberspace Explorer',
          description: 'Daring voyager discovering new digital frontiers with empathy, ethics, and respect.',
          tag: 'Exploration & Courage',
          superpower: '🚀 Connectivity Leap',
        },
      } as Record<string, GuardianDetail>,
      auras: [
        { id: 'cyan', name: 'Quantum Cyan', hex: '#06b6d4', glow: 'rgba(6, 182, 212, 0.45)', power: 'Quantum Shield', desc: 'Mental clarity and maximum speed dodging digital traps.' },
        { id: 'purple', name: 'Cosmic Purple', hex: '#a855f7', glow: 'rgba(168, 85, 247, 0.45)', power: 'Stealth Cloak', desc: 'Complete invisibility from online trackers and intrusive advertisers.' },
        { id: 'emerald', name: 'Cyber Emerald', hex: '#10b981', glow: 'rgba(16, 185, 129, 0.45)', power: 'Bio-Firewall', desc: 'Active defense regeneration for peaceful, safe browsing.' },
        { id: 'orange', name: 'Solar Blaze', hex: '#f97316', glow: 'rgba(249, 115, 22, 0.45)', power: 'Rapid Alert', desc: 'Instant hazard detection when receiving suspicious messages.' },
        { id: 'pink', name: 'Pulsar Pink', hex: '#ec4899', glow: 'rgba(236, 72, 153, 0.45)', power: 'Resonance Wave', desc: 'Empathy and kindness neutralizing cyberbullying and negativity.' },
        { id: 'blue', name: 'Titan Blue', hex: '#2563eb', glow: 'rgba(37, 99, 235, 0.45)', power: 'Titan Armor', desc: 'Heavy-duty security blocking unauthorized login attempts.' },
        { id: 'amber', name: 'Solar Gold', hex: '#eab308', glow: 'rgba(234, 179, 8, 0.45)', power: 'Wisdom Glow', desc: 'Effortlessly discerns between real photos and manipulated AI synthetic media.' },
      ] as AuraPalette[],
      ageGroups: [
        {
          id: '8–10' as ChildAgeGroup,
          title: 'Ages 8–10',
          rankBadge: 'Digital Cadet 🌟',
          subtitle: 'Safe First Steps',
          desc: 'Illustrated quests with clear concepts. Learn safe fun without sharing private photos and how to ask trusted adults for help.',
          icon: '🧭',
          accent: 'text-amber-600',
          borderAccent: 'border-amber-400',
          points: ['Basic privacy', 'Emoji passphrases', 'Fair games'],
        },
        {
          id: '11–12' as ChildAgeGroup,
          title: 'Ages 11–12',
          rankBadge: 'Cyber Guardian 🛡️',
          subtitle: 'Video Games & Social Media',
          desc: 'Spot scams in Roblox & Fortnite, create invincible passphrases, and filter stranger messages in public lobbies.',
          icon: '🎮',
          accent: 'text-cyan-600',
          borderAccent: 'border-cyan-500',
          points: ['Gamer anti-phishing', 'Secure accounts', 'Real friends online'],
        },
        {
          id: '13–14' as ChildAgeGroup,
          title: 'Ages 13–14',
          rankBadge: 'Cyber Strategist ⚡',
          subtitle: 'Connected World & Critical Thinking',
          desc: 'Control your permanent digital footprint, detect AI deepfakes and manipulated content, and stop cyberbullying.',
          icon: '🤖',
          accent: 'text-purple-600',
          borderAccent: 'border-purple-500',
          points: ['Permanent footprint', 'AI & Deepfake detector', 'Digital citizenship'],
        },
      ] as AgeGroupConfig[],
    };
  }, [language]);

  const currentAvatarData =
    AVATAR_OPTIONS.find((a) => a.id === selectedAvatar) || AVATAR_OPTIONS[0];
  const currentGuardianDetail =
    loc.guardians[selectedAvatar] || loc.guardians['bot-blue'];
  const currentAura =
    loc.auras.find((a) => a.hex === selectedColor) || loc.auras[0];
  const currentAgeConfig =
    loc.ageGroups.find((a) => a.id === selectedAge) || loc.ageGroups[1];

  const handleRandomizeNick = () => {
    setIsSpinningDice(true);
    setTimeout(() => setIsSpinningDice(false), 500);
    const filtered = SAFE_NICKNAMES_POOL.filter((n) => n !== nickname);
    const random = filtered[Math.floor(Math.random() * filtered.length)];
    setNickname(random);
  };

  const checkNicknamePrivacyWarning = (name: string): string | null => {
    const trimmed = name.trim().toLowerCase();
    if (!trimmed) return null;
    const realNames = [
      'juan', 'maria', 'pedro', 'pablo', 'lucas', 'sofia', 'mateo', 'valen',
      'gonzalez', 'perez', 'garcia', 'lopez', 'colegio', 'escuela', 'john',
      'smith', 'david', 'emma', 'olivia', 'liam', 'noah', 'school',
    ];
    for (const forbidden of realNames) {
      if (trimmed.includes(forbidden)) {
        return loc.realNameWarning;
      }
    }
    const birthYearMatch = trimmed.match(/20(0[5-9]|1[0-9]|2[0-5])/);
    if (birthYearMatch) {
      return loc.birthYearWarning;
    }
    return null;
  };

  const privacyWarning = checkNicknamePrivacyWarning(nickname);

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

  const handleFinalSubmit = () => {
    setIsFinishing(true);
    onSaveProfile({
      nickname: nickname.trim() || 'AstraShield',
      avatarId: selectedAvatar,
      avatarColor: selectedColor,
      ageGroup: selectedAge,
    });
    setTimeout(() => {
      onComplete();
    }, 600);
  };

  const getMascotExpression = (): MascotExpression => {
    switch (currentStep) {
      case 1:
        return 'excited';
      case 2:
        return 'happy';
      case 3:
        return 'thinking';
      case 4:
        return isFinishing ? 'celebrating' : 'proud';
      default:
        return 'happy';
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.25, ease: 'easeOut' },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -40 : 40,
      opacity: 0,
      transition: { duration: 0.18, ease: 'easeIn' },
    }),
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 text-slate-900 select-none overflow-hidden">
      {/* Top Header & Interactive Stepper */}
      <header className="px-5 pt-4 pb-3 bg-white/90 backdrop-blur-md border-b border-slate-100 shrink-0 z-20 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white shadow-xs transition-colors duration-300"
              style={{ backgroundColor: selectedColor }}
            >
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-cyan-700">
                  {loc.stepLabel(currentStep)}
                </span>
                <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                  • {loc.regTitle}
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-tight mt-0.5">
                {currentStep === 1 && loc.step1Header}
                {currentStep === 2 && loc.step2Header}
                {currentStep === 3 && loc.step3Header}
                {currentStep === 4 && loc.step4Header}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CiberMascot size="sm" expression={getMascotExpression()} />
          </div>
        </div>

        {/* Progress Bar */}
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

        {/* Navigation Step Indicators */}
        <div className="flex items-center justify-between pt-0.5">
          {loc.stepItems.map((item) => {
            const isCompleted = item.step < currentStep;
            const isCurrent = item.step === currentStep;
            return (
              <button
                key={item.step}
                type="button"
                onClick={() => jumpToStep(item.step as 1 | 2 | 3 | 4)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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

      {/* Main Spacious Scrollable Viewport */}
      <main className="flex-1 overflow-y-auto px-5 sm:px-6 py-6 scrollbar-none">
        <div className="w-full max-w-lg mx-auto pb-24">
          <AnimatePresence mode="wait" custom={direction}>
            {/* STEP 1: GUARDIAN */}
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-6"
              >
                {/* Header with generous spacing */}
                <div className="text-center space-y-1.5 px-2">
                  <span className="text-xs font-black text-cyan-600 uppercase tracking-wider block">
                    {loc.step1SubTag}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                    {loc.step1Title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
                    {loc.step1Desc}
                  </p>
                </div>

                {/* Hero Spotlight of Selected Guardian */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 flex items-center gap-4 sm:gap-5 relative overflow-hidden">
                  <div
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-4xl sm:text-5xl relative shadow-inner shrink-0 transition-transform duration-300"
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
                      className="absolute -bottom-2 px-2.5 py-0.5 rounded-full text-[9px] font-black text-white shadow-xs"
                      style={{ backgroundColor: selectedColor }}
                    >
                      {loc.level1Badge}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-slate-900 truncate">
                        {currentAvatarData.name}
                      </h3>
                      <span className="text-[10px] font-black text-cyan-700 uppercase tracking-wider">
                        • {currentGuardianDetail.tag}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-cyan-600">
                      {currentGuardianDetail.role}
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {currentGuardianDetail.description}
                    </p>
                  </div>
                </div>

                {/* Superpower Showcase Box */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-50 to-sky-50 border border-cyan-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-cyan-600 shrink-0" />
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-cyan-800 block">
                        {loc.specialPowerLabel}
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {currentGuardianDetail.superpower}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-cyan-700">
                    {loc.selectedBadge}
                  </span>
                </div>

                {/* Grid of Guardian Options */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-1">
                  {AVATAR_OPTIONS.map((avatar) => {
                    const isSelected = avatar.id === selectedAvatar;
                    const detail = loc.guardians[avatar.id];

                    return (
                      <button
                        key={avatar.id}
                        type="button"
                        onClick={() => setSelectedAvatar(avatar.id)}
                        className={`p-3.5 sm:p-4 rounded-2xl text-center transition-all cursor-pointer flex flex-col items-center gap-2 ${
                          isSelected
                            ? 'bg-white shadow-md ring-2 ring-cyan-500 border border-transparent scale-102'
                            : 'bg-white/80 hover:bg-white border border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all"
                          style={{
                            backgroundColor: isSelected ? `${selectedColor}22` : '#f1f5f9',
                          }}
                        >
                          <span>{avatar.icon}</span>
                        </div>
                        <span className="text-xs font-black text-slate-900 truncate w-full">
                          {avatar.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold line-clamp-1">
                          {detail?.role}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 2: AURA COLOR */}
            {currentStep === 2 && (
              <motion.div
                key="step-2"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-6"
              >
                {/* Header */}
                <div className="text-center space-y-1.5 px-2">
                  <span className="text-xs font-black text-cyan-600 uppercase tracking-wider block">
                    {loc.step2SubTag}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                    {loc.step2Title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
                    {loc.step2Desc}
                  </p>
                </div>

                {/* Aura Preview Guardian Spotlight */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center relative overflow-hidden space-y-3">
                  <div
                    className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl relative transition-all duration-300"
                    style={{
                      backgroundColor: `${selectedColor}18`,
                      border: `3px solid ${selectedColor}`,
                      boxShadow: `0 0 25px ${currentAura.glow}`,
                    }}
                  >
                    <span>{currentAvatarData.icon}</span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-black text-slate-900">
                      {currentAura.name}
                    </h3>
                    <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                      {currentAura.desc}
                    </p>
                  </div>
                </div>

                {/* Aura Swatches List */}
                <div className="space-y-2.5">
                  {loc.auras.map((aura) => {
                    const isSelected = aura.hex === selectedColor;

                    return (
                      <button
                        key={aura.id}
                        type="button"
                        onClick={() => setSelectedColor(aura.hex)}
                        className={`w-full p-3.5 sm:p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white border-slate-900 shadow-sm ring-1 ring-slate-900'
                            : 'bg-white hover:bg-slate-50 border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div
                            className="w-8 h-8 rounded-xl shrink-0 shadow-xs flex items-center justify-center text-white"
                            style={{ backgroundColor: aura.hex }}
                          >
                            {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                          </div>
                          <div>
                            <span className="text-xs font-black text-slate-900 block">
                              {aura.name}
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">
                              {aura.power}
                            </span>
                          </div>
                        </div>

                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: aura.hex }}
                        />
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 3: AGE GROUP */}
            {currentStep === 3 && (
              <motion.div
                key="step-3"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-6"
              >
                {/* Header */}
                <div className="text-center space-y-1.5 px-2">
                  <span className="text-xs font-black text-cyan-600 uppercase tracking-wider block">
                    {loc.step3SubTag}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                    {loc.step3Title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
                    {loc.step3Desc}
                  </p>
                </div>

                {/* Age Cards with Generous Spacing */}
                <div className="space-y-4">
                  {loc.ageGroups.map((ageGroup) => {
                    const isSelected = ageGroup.id === selectedAge;

                    return (
                      <button
                        key={ageGroup.id}
                        type="button"
                        onClick={() => setSelectedAge(ageGroup.id)}
                        className={`w-full p-5 sm:p-6 rounded-3xl border text-left transition-all cursor-pointer relative overflow-hidden space-y-3 ${
                          isSelected
                            ? 'bg-white shadow-md ring-2 ring-cyan-500 border-transparent'
                            : 'bg-white hover:bg-slate-50 border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{ageGroup.icon}</span>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-base font-black text-slate-900">
                                  {ageGroup.title}
                                </h3>
                                <span className={`text-[11px] font-black ${ageGroup.accent}`}>
                                  • {ageGroup.rankBadge}
                                </span>
                              </div>
                              <span className="text-xs font-bold text-slate-500 block mt-0.5">
                                {ageGroup.subtitle}
                              </span>
                            </div>
                          </div>

                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                              isSelected
                                ? 'bg-cyan-500 border-cyan-500 text-white'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {ageGroup.desc}
                        </p>

                        {/* Distinct feature points without pill clusters */}
                        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-semibold text-slate-500">
                          {ageGroup.points.map((pt, pIdx) => (
                            <span key={pIdx} className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                              {pt}
                            </span>
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 4: SAFE NICKNAME */}
            {currentStep === 4 && (
              <motion.div
                key="step-4"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-6"
              >
                {/* Header */}
                <div className="text-center space-y-1.5 px-2">
                  <span className="text-xs font-black text-cyan-600 uppercase tracking-wider block">
                    {loc.step4SubTag}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                    {loc.step4Title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
                    {loc.step4Desc}
                  </p>
                </div>

                {/* Nickname Input & Randomizer Card */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                    <span>{loc.step4Header}</span>
                    <button
                      type="button"
                      onClick={handleRandomizeNick}
                      className="flex items-center gap-1.5 text-cyan-600 hover:text-cyan-700 cursor-pointer font-bold active:scale-95 transition"
                    >
                      <motion.div
                        animate={isSpinningDice ? { rotate: 360 } : { rotate: 0 }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                      >
                        <Dices className="w-4 h-4 text-cyan-500" />
                      </motion.div>
                      <span>{loc.randomBtn}</span>
                    </button>
                  </div>

                  {/* Input field */}
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={18}
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder={loc.inputPlaceholder}
                      className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-cyan-500 focus:bg-white text-base font-black text-slate-900 outline-none transition"
                    />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono">
                      {nickname.length}/18
                    </div>
                  </div>

                  {/* Privacy warning banner */}
                  {privacyWarning && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 leading-relaxed"
                    >
                      {privacyWarning}
                    </motion.div>
                  )}
                </div>

                {/* Rules of Safe Nickname Card */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700">
                    <Lock className="w-4 h-4 text-cyan-600" />
                    <span>{loc.rulesTitle}</span>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>{loc.rule1}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>{loc.rule2}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>{loc.rule3}</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom Sticky Action Controls with Ample Padding */}
      <footer className="px-5 py-4 bg-white/95 backdrop-blur-md border-t border-slate-100 shrink-0 z-20">
        <div className="w-full max-w-lg mx-auto flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={goToPrevStep}
              className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer active:scale-95 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{loc.backBtn}</span>
            </button>
          ) : (
            <div className="w-20" />
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={goToNextStep}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-black tracking-wide shadow-md shadow-cyan-500/20 transition cursor-pointer active:scale-95 flex items-center gap-1.5"
            >
              <span>{loc.nextBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isFinishing || !nickname.trim()}
              onClick={handleFinalSubmit}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-white text-xs font-black tracking-wide shadow-md shadow-emerald-500/20 transition cursor-pointer active:scale-95 flex items-center gap-1.5"
            >
              <span>{isFinishing ? loc.savingBtn : loc.finishBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};
