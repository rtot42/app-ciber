import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Heart,
  KeyRound,
  Play,
  RotateCcw,
  Shield,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { ChildAgeGroup, GameResultStats } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { GameHud, GameVictorySummary } from './GameShell';
import { computeStars, getAgeTierMeta } from '../../utils/ageDifficulty';
import { playGameSound } from '../../utils/gameAudio';
import {
  drawCyberHeroSprite,
  drawFirewallBlock,
  drawFloatingTextsVfx,
  drawMalwareBotSprite,
  drawParticlesVfx,
  drawSecurityKeyToken,
  FloatingTextVfx,
  ParticleVfx,
  setupHiDpiCanvas,
} from '../../utils/canvasSprites';

interface CyberRunnerGameProps {
  onComplete: (stats?: GameResultStats) => void;
  ageGroup?: ChildAgeGroup;
}

interface Platform {
  x: number;
  y: number;
  w: number;
  h: number;
  kind: 'ground' | 'brick' | 'pipe' | 'cloud';
}

interface QuestionBlock {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  used: boolean;
  questionIdx: number;
  bounceOffset: number;
}

interface TokenCoin {
  id: string;
  x: number;
  y: number;
  collected: boolean;
}

interface MalwareEnemy {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minX: number;
  maxX: number;
  vx: number;
  kind: 'phish' | 'trojan' | 'glitch';
  defeated: boolean;
  squishTimer: number;
}

interface CyberGateQuestion {
  prompt: string;
  options: [string, string];
  correctIdx: 0 | 1;
  explanation: string;
}

type RunnerPhase = 'TITLE' | 'PLAYING' | 'GATE' | 'GAME_OVER' | 'WON';

const CANVAS_W = 640;
const CANVAS_H = 340;
const GROUND_Y = 286;
const PLAYER_W = 30;
const PLAYER_H = 38;

export const CyberRunnerGame: React.FC<CyberRunnerGameProps> = ({
  onComplete,
  ageGroup = '8–10' as ChildAgeGroup,
}) => {
  const { language } = useLanguage();
  const tierMeta = getAgeTierMeta(ageGroup, language);

  const copy = useMemo(() => {
    const title =
      language === 'fr'
        ? 'CiberMario : Royaume Pare-feu'
        : language === 'en'
        ? 'CyberMario: Firewall Kingdom'
        : 'CiberMario: Reino Cortafuegos';

    const subtitle =
      language === 'fr'
        ? 'Saute sur les virus, active les blocs [?] et atteins la forteresse'
        : language === 'en'
        ? 'Stomp malware, hit [?] security blocks & reach the fortress flag'
        : 'Salta sobre virus, golpea bloques [?] y llega a la fortaleza';

    const takeaway =
      language === 'fr'
        ? 'Comme dans un jeu de plateforme, chaque bloc suspect mérite une vérification : ne télécharge jamais de faux mods, garde tes données privées et active la 2FA.'
        : language === 'en'
        ? 'Just like dodging traps in a platformer, verify links before clicking, avoid suspicious game mods, and lock accounts with 2FA.'
        : 'Igual que esquivas trampas saltando, verifica enlaces antes de abrirlos, evita mods sospechosos y protege tus cuentas con 2FA.';

    const allQuestions: Record<ChildAgeGroup, CyberGateQuestion[]> = {
      '8–10': [
        {
          prompt:
            language === 'fr'
              ? 'Un inconnu dans le jeu demande ton adresse pour t’envoyer un cadeau. Que fais-tu ?'
              : language === 'en'
              ? 'A stranger in a game asks for your home address to send a prize. What do you do?'
              : 'Un desconocido en un juego te pide tu dirección para enviarte un premio. ¿Qué haces?',
          options:
            language === 'fr'
              ? ['Refuser et prévenir un adulte', 'Donner juste le nom de ma rue']
              : language === 'en'
              ? ['Refuse & tell a trusted adult', 'Share just my street name']
              : ['Rechazar y avisar a un adulto', 'Dar solo el nombre de mi calle'],
          correctIdx: 0,
          explanation:
            language === 'fr'
              ? 'Ne partage jamais ton adresse réelle ni de détails personnels en ligne.'
              : language === 'en'
              ? 'Never share your real address or personal details online.'
              : 'Nunca compartas tu dirección real ni datos personales en línea.',
        },
        {
          prompt:
            language === 'fr'
              ? 'Quel mot de passe protège le mieux ton château numérique ?'
              : language === 'en'
              ? 'Which password protects your digital castle best?'
              : '¿Qué contraseña protege mejor tu castillo digital?',
          options:
            language === 'fr'
              ? ['123456lucas', 'Tigre!Bleu#29']
              : language === 'en'
              ? ['123456lucas', 'Tiger!Blue#29']
              : ['123456lucas', 'Tigre!Azul#29'],
          correctIdx: 1,
          explanation:
            language === 'fr'
              ? 'Mélanger majuscules, chiffres et symboles bloque les devinettes.'
              : language === 'en'
              ? 'Mixing uppercase, numbers, and symbols stops easy guessing.'
              : 'Combinar mayúsculas, números y símbolos frena los ataques.',
        },
      ],
      '11–12': [
        {
          prompt:
            language === 'fr'
              ? 'Un site promet 10 000 gemmes gratuites si tu télécharges "SuperMod.exe".'
              : language === 'en'
              ? 'A website offers 10,000 free gems if you install "SuperCheatMod.exe".'
              : 'Una web promete 10.000 gemas gratis si descargas "SuperTruco.exe".',
          options:
            language === 'fr'
              ? ['Le fermer : probable logiciel malveillant', 'L’exécuter vite avant qu’il expire']
              : language === 'en'
              ? ['Close it: likely malware trap', 'Install it fast before it expires']
              : ['Cerrarla: es trampa con malware', 'Instalarlo rápido antes que expire'],
          correctIdx: 0,
          explanation:
            language === 'fr'
              ? 'Les faux générateurs de gemmes cachent souvent des virus qui volent le compte.'
              : language === 'en'
              ? 'Fake gem generators often hide trojans that steal your account.'
              : 'Los falsos generadores esconden troyanos para robar cuentas.',
        },
        {
          prompt:
            language === 'fr'
              ? 'Tu reçois un e-mail de "soporte@r0blox-prize.com" demandant ton mot de passe.'
              : language === 'en'
              ? 'An email from "support@r0blox-prize.com" asks you to confirm your password.'
              : 'Un correo de "soporte@r0blox-premio.com" pide confirmar tu contraseña.',
          options:
            language === 'fr'
              ? ['Répondre avec mon mot de passe', 'Signaler comme phishing (faux domaine)']
              : language === 'en'
              ? ['Reply with my password', 'Report phishing (fake lookalike domain)']
              : ['Responder con mi contraseña', 'Reportar phishing (dominio falso)'],
          correctIdx: 1,
          explanation:
            language === 'fr'
              ? 'Remplacer "o" par "0" est une ruse classique d’hameçonnage.'
              : language === 'en'
              ? 'Swapping "o" for "0" is a classic phishing trick—and real support never asks for passwords.'
              : 'Cambiar la "o" por "0" es un truco clásico de phishing; soporte real nunca pide contraseñas.',
        },
        {
          prompt:
            language === 'fr'
              ? 'Comment renforcer encore plus la porte de ton compte ?'
              : language === 'en'
              ? 'What adds an extra lock even if someone learns your password?'
              : '¿Qué añade un candado extra aunque alguien descubra tu contraseña?',
          options:
            language === 'fr'
              ? ['Activer la double authentification (2FA)', 'Utiliser le même mot de passe partout']
              : language === 'en'
              ? ['Enable Two-Factor Auth (2FA)', 'Reuse the same password everywhere']
              : ['Activar verificación en 2 pasos (2FA)', 'Usar la misma clave en todo'],
          correctIdx: 0,
          explanation:
            language === 'fr'
              ? 'La 2FA demande un second code unique sur ton appareil.'
              : language === 'en'
              ? '2FA requires a second time-limited code only you have.'
              : 'El 2FA exige un segundo código temporal que solo tú tienes.',
        },
      ],
      '13–14': [
        {
          prompt:
            language === 'fr'
              ? 'En Wi-Fi public au café, quelle URL est chiffrée et sûre pour se connecter ?'
              : language === 'en'
              ? 'On cafe public Wi-Fi, which connection keeps traffic encrypted?'
              : 'En el Wi-Fi público de una cafetería, ¿qué conexión cifra tus datos?',
          options:
            language === 'fr'
              ? ['http://login-portal-free.net', 'https:// + VPN activé']
              : language === 'en'
              ? ['http://login-portal-free.net', 'https:// + active VPN']
              : ['http://login-portal-free.net', 'https:// + VPN activada'],
          correctIdx: 1,
          explanation:
            language === 'fr'
              ? 'HTTPS chiffre le site et le VPN protège tout le tunnel sur les réseaux ouverts.'
              : language === 'en'
              ? 'HTTPS encrypts web sessions and a VPN shields your entire tunnel on public Wi-Fi.'
              : 'HTTPS cifra la web y la VPN protege todo tu tráfico en redes públicas.',
        },
        {
          prompt:
            language === 'fr'
              ? 'Avant de poster une photo prise à la maison, que faut-il vérifier ?'
              : language === 'en'
              ? 'Before posting a photo taken at home, what hidden data can leak your location?'
              : 'Antes de subir una foto tomada en casa, ¿qué dato oculto puede revelar tu ubicación?',
          options:
            language === 'fr'
              ? ['Les métadonnées EXIF GPS', 'Seulement la luminosité de l’image']
              : language === 'en'
              ? ['Embedded GPS EXIF metadata', 'Only screen brightness']
              : ['Metadatos EXIF con GPS', 'Solo el brillo de la imagen'],
          correctIdx: 0,
          explanation:
            language === 'fr'
              ? 'Les fichiers photo peuvent stocker les coordonnées GPS exactes (EXIF).'
              : language === 'en'
              ? 'Raw photo files can carry exact GPS coordinates unless stripped.'
              : 'Los archivos de foto pueden guardar coordenadas GPS exactas si no se limpian.',
        },
        {
          prompt:
            language === 'fr'
              ? 'Un message dit : "COMPTE SUSPENDU DANS 5 MIN, CLIQUE ICI !" C’est quel piège ?'
              : language === 'en'
              ? 'A DM says: "ACCOUNT BANNED IN 5 MIN, CLICK NOW!" What tactic is this?'
              : 'Un mensaje dice: "¡CUENTA SUSPENDIDA EN 5 MIN, HAZ CLIC YA!". ¿Qué táctica es?',
          options:
            language === 'fr'
              ? ['Ingénierie sociale par urgence', 'Maintenance officielle normale']
              : language === 'en'
              ? ['Urgency social engineering', 'Standard official maintenance']
              : ['Ingeniería social por urgencia', 'Mantenimiento oficial normal'],
          correctIdx: 0,
          explanation:
            language === 'fr'
              ? 'La fausse urgence pousse à agir vite sans vérifier l’expéditeur.'
              : language === 'en'
              ? 'Fake urgency pressures you to click before inspecting the sender.'
              : 'La urgencia falsa busca que hagas clic sin verificar el remitente.',
        },
        {
          prompt:
            language === 'fr'
              ? 'Une appli de lampe torche réclame l’accès à tes Contacts et SMS.'
              : language === 'en'
              ? 'A flashlight app demands permission to read Contacts & SMS.'
              : 'Una app de linterna exige permiso para leer Contactos y SMS.',
          options:
            language === 'fr'
              ? ['Tout autoriser pour continuer', 'Refuser : principe du moindre privilège']
              : language === 'en'
              ? ['Allow all to finish quickly', 'Deny: violates least privilege']
              : ['Permitir todo para seguir', 'Denegar: viola el mínimo privilegio'],
          correctIdx: 1,
          explanation:
            language === 'fr'
              ? 'Une appli ne doit avoir accès qu’aux permissions strictement nécessaires.'
              : language === 'en'
              ? 'Apps should only get permissions essential to their core feature.'
              : 'Las apps solo deben pedir permisos estrictamente necesarios.',
        },
      ],
    };

    const labels = {
      es: {
        startTitle: 'Misión 2D: ¡Salta el Malware!',
        startDesc:
          'Corre, salta sobre los virus para eliminarlos, golpea los bloques [?] para responder retos de ciberseguridad y alcanza la bandera de la Fortaleza.',
        controlsHint: 'Usa las flechas / A-D + Espacio o los botones táctiles abajo',
        playBtn: '¡Empezar Misión!',
        gateTitle: 'Bloque Cortafuegos [?]',
        gameOverTitle: '¡Firewall Sobrecargado!',
        gameOverDesc: 'Los virus rompieron tu escudo, pero tu respaldo está listo.',
        retryBtn: 'Reintentar Nivel',
        hearts: 'Escudos',
        tokens: 'Llaves',
        gates: 'Bloques',
        jump: 'SALTAR',
        shieldActive: 'ESCUDO 2FA ACTIVO',
      },
      fr: {
        startTitle: 'Mission 2D : Saute les Virus !',
        startDesc:
          'Cours, saute sur les logiciels malveillants pour les neutraliser, frappe les blocs [?] et atteins le drapeau de la Forteresse.',
        controlsHint: 'Utilise les flèches / A-D + Espace ou les boutons tactiles',
        playBtn: 'Lancer la Mission !',
        gateTitle: 'Bloc Pare-feu [?]',
        gameOverTitle: 'Pare-feu Surchargé !',
        gameOverDesc: 'Les virus ont brisé ton bouclier, mais ta sauvegarde est prête.',
        retryBtn: 'Réessayer',
        hearts: 'Boucliers',
        tokens: 'Clés',
        gates: 'Blocs',
        jump: 'SAUTER',
        shieldActive: 'BOUCLIER 2FA ACTIF',
      },
      en: {
        startTitle: '2D Mission: Stomp the Malware!',
        startDesc:
          'Run, stomp malware bots from above, bump [?] blocks to clear security checks, and reach the Fortress Flag.',
        controlsHint: 'Use Arrow keys / A-D + Space or the touch controls below',
        playBtn: 'Start Mission!',
        gateTitle: 'Firewall Block [?]',
        gameOverTitle: 'Firewall Breached!',
        gameOverDesc: 'Malware broke your shields, but your clean backup is ready.',
        retryBtn: 'Retry Stage',
        hearts: 'Shields',
        tokens: 'Keys',
        gates: 'Blocks',
        jump: 'JUMP',
        shieldActive: '2FA SHIELD ACTIVE',
      },
    }[language];

    return {
      title,
      subtitle,
      takeaway,
      questions: allQuestions[ageGroup],
      labels,
    };
  }, [ageGroup, language]);

  const totalGates = copy.questions.length;
  const maxHearts = ageGroup === '8–10' ? 4 : 3;
  const worldWidth = ageGroup === '8–10' ? 1900 : ageGroup === '11–12' ? 2350 : 2750;
  const goalX = worldWidth - 150;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [phase, setPhase] = useState<RunnerPhase>('TITLE');
  const [hearts, setHearts] = useState<number>(maxHearts);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(1);
  const [tokensCollected, setTokensCollected] = useState<number>(0);
  const [gatesCleared, setGatesCleared] = useState<number>(0);
  const [gateAttempts, setGateAttempts] = useState<number>(0);
  const [gateCorrect, setGateCorrect] = useState<number>(0);
  const [activeGateBlockId, setActiveGateBlockId] = useState<string | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<CyberGateQuestion | null>(null);
  const [gateFeedback, setGateFeedback] = useState<{ correct: boolean; text: string } | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(tierMeta.timeLimitSeconds);
  const [shieldActive, setShieldActive] = useState(false);

  const simRef = useRef<{
    player: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      onGround: boolean;
      facing: 1 | -1;
      invulnTimer: number;
      shieldTimer: number;
      coyoteTimer: number;
      walkPhase: number;
      safeX: number;
      safeY: number;
    };
    cameraX: number;
    platforms: Platform[];
    blocks: QuestionBlock[];
    coins: TokenCoin[];
    enemies: MalwareEnemy[];
    particles: ParticleVfx[];
    texts: FloatingTextVfx[];
    keys: { left: boolean; right: boolean; jump: boolean; jumpPressed: boolean };
    hearts: number;
    score: number;
    streak: number;
    maxStreak: number;
    tokens: number;
    gatesCleared: number;
    phase: RunnerPhase;
    timeLeft: number | null;
    secondAccum: number;
  } | null>(null);

  const buildLevel = () => {
    const enemySpeed = ageGroup === '13–14' ? 92 : ageGroup === '11–12' ? 72 : 52;
    const platforms: Platform[] = [];
    const blocks: QuestionBlock[] = [];
    const coins: TokenCoin[] = [];
    const enemies: MalwareEnemy[] = [];

    if (ageGroup === '8–10') {
      platforms.push(
        { x: 0, y: GROUND_Y, w: 560, h: 60, kind: 'ground' },
        { x: 640, y: GROUND_Y, w: 520, h: 60, kind: 'ground' },
        { x: 1240, y: GROUND_Y, w: 660, h: 60, kind: 'ground' },
        { x: 230, y: 210, w: 120, h: 22, kind: 'brick' },
        { x: 460, y: 236, w: 46, h: 50, kind: 'pipe' },
        { x: 750, y: 205, w: 140, h: 22, kind: 'brick' },
        { x: 1050, y: 236, w: 46, h: 50, kind: 'pipe' },
        { x: 1360, y: 200, w: 150, h: 22, kind: 'brick' }
      );
      blocks.push(
        { id: 'b1', x: 274, y: 140, w: 34, h: 34, used: false, questionIdx: 0, bounceOffset: 0 },
        { id: 'b2', x: 1418, y: 128, w: 34, h: 34, used: false, questionIdx: 1, bounceOffset: 0 }
      );
      enemies.push(
        { id: 'e1', x: 350, y: GROUND_Y - 28, w: 28, h: 28, minX: 250, maxX: 430, vx: enemySpeed, kind: 'phish', defeated: false, squishTimer: 0 },
        { id: 'e2', x: 850, y: GROUND_Y - 28, w: 28, h: 28, minX: 690, maxX: 1010, vx: -enemySpeed, kind: 'trojan', defeated: false, squishTimer: 0 },
        { id: 'e3', x: 1520, y: GROUND_Y - 28, w: 28, h: 28, minX: 1340, maxX: 1640, vx: enemySpeed, kind: 'phish', defeated: false, squishTimer: 0 }
      );
    } else if (ageGroup === '11–12') {
      platforms.push(
        { x: 0, y: GROUND_Y, w: 480, h: 60, kind: 'ground' },
        { x: 570, y: GROUND_Y, w: 440, h: 60, kind: 'ground' },
        { x: 1110, y: GROUND_Y, w: 480, h: 60, kind: 'ground' },
        { x: 1690, y: GROUND_Y, w: 660, h: 60, kind: 'ground' },
        { x: 220, y: 212, w: 110, h: 22, kind: 'brick' },
        { x: 410, y: 234, w: 46, h: 52, kind: 'pipe' },
        { x: 680, y: 196, w: 130, h: 22, kind: 'brick' },
        { x: 930, y: 226, w: 46, h: 60, kind: 'pipe' },
        { x: 1240, y: 198, w: 140, h: 22, kind: 'brick' },
        { x: 1580, y: 220, w: 80, h: 20, kind: 'cloud' },
        { x: 1840, y: 196, w: 130, h: 22, kind: 'brick' }
      );
      blocks.push(
        { id: 'b1', x: 258, y: 138, w: 34, h: 34, used: false, questionIdx: 0, bounceOffset: 0 },
        { id: 'b2', x: 728, y: 124, w: 34, h: 34, used: false, questionIdx: 1, bounceOffset: 0 },
        { id: 'b3', x: 1888, y: 124, w: 34, h: 34, used: false, questionIdx: 2, bounceOffset: 0 }
      );
      enemies.push(
        { id: 'e1', x: 320, y: GROUND_Y - 28, w: 28, h: 28, minX: 210, maxX: 390, vx: enemySpeed, kind: 'phish', defeated: false, squishTimer: 0 },
        { id: 'e2', x: 760, y: GROUND_Y - 28, w: 28, h: 28, minX: 600, maxX: 900, vx: -enemySpeed, kind: 'trojan', defeated: false, squishTimer: 0 },
        { id: 'e3', x: 1280, y: GROUND_Y - 28, w: 28, h: 28, minX: 1140, maxX: 1510, vx: enemySpeed, kind: 'glitch', defeated: false, squishTimer: 0 },
        { id: 'e4', x: 1950, y: GROUND_Y - 28, w: 28, h: 28, minX: 1740, maxX: 2110, vx: -enemySpeed, kind: 'trojan', defeated: false, squishTimer: 0 }
      );
    } else {
      platforms.push(
        { x: 0, y: GROUND_Y, w: 420, h: 60, kind: 'ground' },
        { x: 520, y: GROUND_Y, w: 370, h: 60, kind: 'ground' },
        { x: 990, y: GROUND_Y, w: 380, h: 60, kind: 'ground' },
        { x: 1470, y: GROUND_Y, w: 430, h: 60, kind: 'ground' },
        { x: 2000, y: GROUND_Y, w: 750, h: 60, kind: 'ground' },
        { x: 200, y: 208, w: 110, h: 22, kind: 'brick' },
        { x: 435, y: 228, w: 70, h: 18, kind: 'cloud' },
        { x: 630, y: 192, w: 120, h: 22, kind: 'brick' },
        { x: 895, y: 218, w: 80, h: 18, kind: 'cloud' },
        { x: 1110, y: 192, w: 130, h: 22, kind: 'brick' },
        { x: 1375, y: 224, w: 75, h: 18, kind: 'cloud' },
        { x: 1620, y: 194, w: 130, h: 22, kind: 'brick' },
        { x: 1910, y: 222, w: 70, h: 18, kind: 'cloud' },
        { x: 2160, y: 192, w: 130, h: 22, kind: 'brick' }
      );
      blocks.push(
        { id: 'b1', x: 238, y: 134, w: 34, h: 34, used: false, questionIdx: 0, bounceOffset: 0 },
        { id: 'b2', x: 672, y: 120, w: 34, h: 34, used: false, questionIdx: 1, bounceOffset: 0 },
        { id: 'b3', x: 1158, y: 120, w: 34, h: 34, used: false, questionIdx: 2, bounceOffset: 0 },
        { id: 'b4', x: 2208, y: 120, w: 34, h: 34, used: false, questionIdx: 3, bounceOffset: 0 }
      );
      enemies.push(
        { id: 'e1', x: 290, y: GROUND_Y - 28, w: 28, h: 28, minX: 190, maxX: 390, vx: enemySpeed, kind: 'phish', defeated: false, squishTimer: 0 },
        { id: 'e2', x: 660, y: GROUND_Y - 28, w: 28, h: 28, minX: 540, maxX: 860, vx: -enemySpeed, kind: 'glitch', defeated: false, squishTimer: 0 },
        { id: 'e3', x: 1150, y: GROUND_Y - 28, w: 28, h: 28, minX: 1010, maxX: 1340, vx: enemySpeed, kind: 'trojan', defeated: false, squishTimer: 0 },
        { id: 'e4', x: 1640, y: GROUND_Y - 28, w: 28, h: 28, minX: 1490, maxX: 1870, vx: -enemySpeed * 1.1, kind: 'glitch', defeated: false, squishTimer: 0 },
        { id: 'e5', x: 2240, y: GROUND_Y - 28, w: 28, h: 28, minX: 2040, maxX: 2450, vx: enemySpeed, kind: 'trojan', defeated: false, squishTimer: 0 }
      );
    }

    platforms
      .filter((p) => p.kind === 'brick' || p.kind === 'cloud')
      .forEach((p, idx) => {
        coins.push(
          { id: `c-${idx}-1`, x: p.x + p.w * 0.25, y: p.y - 26, collected: false },
          { id: `c-${idx}-2`, x: p.x + p.w * 0.75, y: p.y - 26, collected: false }
        );
      });
    for (let x = 150; x < goalX - 180; x += 290) {
      coins.push({ id: `cg-${x}`, x, y: GROUND_Y - 34, collected: false });
    }

    simRef.current = {
      player: {
        x: 60,
        y: GROUND_Y - PLAYER_H,
        vx: 0,
        vy: 0,
        onGround: true,
        facing: 1,
        invulnTimer: 0,
        shieldTimer: 0,
        coyoteTimer: 0,
        walkPhase: 0,
        safeX: 60,
        safeY: GROUND_Y - PLAYER_H,
      },
      cameraX: 0,
      platforms,
      blocks,
      coins,
      enemies,
      particles: [],
      texts: [],
      keys: { left: false, right: false, jump: false, jumpPressed: false },
      hearts: maxHearts,
      score: 0,
      streak: 0,
      maxStreak: 1,
      tokens: 0,
      gatesCleared: 0,
      phase: 'PLAYING',
      timeLeft: tierMeta.timeLimitSeconds,
      secondAccum: 0,
    };
  };

  const startGame = () => {
    playGameSound('tap');
    buildLevel();
    setHearts(maxHearts);
    setScore(0);
    setStreak(0);
    setMaxStreak(1);
    setTokensCollected(0);
    setGatesCleared(0);
    setGateAttempts(0);
    setGateCorrect(0);
    setActiveGateBlockId(null);
    setActiveQuestion(null);
    setGateFeedback(null);
    setShieldActive(false);
    setTimeLeft(tierMeta.timeLimitSeconds);
    setPhase('PLAYING');
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const sim = simRef.current;
      if (!sim) return;
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') sim.keys.left = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') sim.keys.right = true;
      if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') {
        if (sim.phase === 'PLAYING') e.preventDefault();
        if (!sim.keys.jump) sim.keys.jumpPressed = true;
        sim.keys.jump = true;
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const sim = simRef.current;
      if (!sim) return;
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') sim.keys.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') sim.keys.right = false;
      if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') sim.keys.jump = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  useEffect(() => {
    let rafId = 0;
    let lastTime = performance.now();

    const spawnSparks = (x: number, y: number, color: string, count = 10) => {
      const sim = simRef.current;
      if (!sim) return;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
        const speed = 70 + Math.random() * 110;
        sim.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 45,
          life: 0.48,
          maxLife: 0.48,
          size: 3 + Math.random() * 2.5,
          color,
        });
      }
    };

    const spawnPopup = (x: number, y: number, text: string, color: string) => {
      const sim = simRef.current;
      if (!sim) return;
      sim.texts.push({ x, y, vy: -42, life: 0.75, text, color });
    };

    const damagePlayer = (sim: NonNullable<typeof simRef.current>) => {
      if (sim.player.invulnTimer > 0 || sim.player.shieldTimer > 0) return;
      sim.hearts -= 1;
      sim.streak = 0;
      sim.player.invulnTimer = 1.4;
      playGameSound('wrong');
      setHearts(sim.hearts);
      setStreak(0);
      spawnSparks(sim.player.x + PLAYER_W / 2, sim.player.y + PLAYER_H / 2, '#f43f5e', 12);
      if (sim.hearts <= 0) {
        sim.phase = 'GAME_OVER';
        setPhase('GAME_OVER');
      }
    };

    const stepSimulation = (dt: number) => {
      const sim = simRef.current;
      if (!sim || sim.phase !== 'PLAYING') return;

      if (sim.timeLeft !== null) {
        sim.secondAccum += dt;
        if (sim.secondAccum >= 1) {
          sim.secondAccum -= 1;
          sim.timeLeft = Math.max(0, sim.timeLeft - 1);
          setTimeLeft(sim.timeLeft);
          if (sim.timeLeft === 0) {
            playGameSound('wrong');
            sim.phase = 'GAME_OVER';
            setPhase('GAME_OVER');
            return;
          }
        }
      }

      const p = sim.player;
      p.invulnTimer = Math.max(0, p.invulnTimer - dt);
      if (p.shieldTimer > 0) {
        p.shieldTimer = Math.max(0, p.shieldTimer - dt);
        if (p.shieldTimer === 0) setShieldActive(false);
      }

      const moveSpeed = 240;
      if (sim.keys.left && !sim.keys.right) {
        p.vx = -moveSpeed;
        p.facing = -1;
        p.walkPhase += dt * 15;
      } else if (sim.keys.right && !sim.keys.left) {
        p.vx = moveSpeed;
        p.facing = 1;
        p.walkPhase += dt * 15;
      } else {
        p.vx *= 0.74;
        if (Math.abs(p.vx) < 8) p.vx = 0;
      }

      p.coyoteTimer = p.onGround ? 0.11 : Math.max(0, p.coyoteTimer - dt);
      if (sim.keys.jumpPressed && p.coyoteTimer > 0) {
        p.vy = -520;
        p.onGround = false;
        p.coyoteTimer = 0;
        spawnSparks(p.x + PLAYER_W / 2, p.y + PLAYER_H, '#e2e8f0', 5);
        playGameSound('tap');
      }
      sim.keys.jumpPressed = false;

      p.vy = Math.min(720, p.vy + 1320 * dt);
      p.x = Math.max(0, Math.min(worldWidth - PLAYER_W, p.x + p.vx * dt));

      for (const plat of sim.platforms) {
        if (
          p.x + PLAYER_W > plat.x &&
          p.x < plat.x + plat.w &&
          p.y + PLAYER_H > plat.y + 4 &&
          p.y < plat.y + plat.h
        ) {
          if (p.vx > 0) p.x = plat.x - PLAYER_W;
          else if (p.vx < 0) p.x = plat.x + plat.w;
        }
      }

      const prevBottom = p.y + PLAYER_H;
      p.y += p.vy * dt;
      p.onGround = false;

      for (const plat of sim.platforms) {
        const horizOverlap = p.x + PLAYER_W > plat.x + 2 && p.x < plat.x + plat.w - 2;
        if (!horizOverlap) continue;

        if (p.vy >= 0 && prevBottom <= plat.y + 10 && p.y + PLAYER_H >= plat.y) {
          p.y = plat.y - PLAYER_H;
          p.vy = 0;
          p.onGround = true;
          if (plat.kind === 'ground') {
            p.safeX = Math.max(40, Math.min(p.x, plat.x + plat.w - 60));
            p.safeY = plat.y - PLAYER_H;
          }
        } else if (
          plat.kind === 'brick' &&
          p.vy < 0 &&
          p.y <= plat.y + plat.h &&
          p.y + PLAYER_H > plat.y + plat.h
        ) {
          p.y = plat.y + plat.h;
          p.vy = 40;
        }
      }

      for (const b of sim.blocks) {
        b.bounceOffset = Math.max(0, b.bounceOffset - dt * 45);
        const horizOverlap = p.x + PLAYER_W > b.x && p.x < b.x + b.w;
        if (!horizOverlap) continue;

        if (p.vy >= 0 && prevBottom <= b.y + 10 && p.y + PLAYER_H >= b.y) {
          p.y = b.y - PLAYER_H;
          p.vy = 0;
          p.onGround = true;
        } else if (
          p.vy < 0 &&
          p.y <= b.y + b.h &&
          p.y + PLAYER_H > b.y + b.h
        ) {
          p.y = b.y + b.h;
          p.vy = 60;
          b.bounceOffset = 10;
          if (!b.used) {
            playGameSound('tap');
            sim.phase = 'GATE';
            setPhase('GATE');
            setActiveGateBlockId(b.id);
            setActiveQuestion(copy.questions[b.questionIdx % copy.questions.length]);
            setGateFeedback(null);
            return;
          }
        }
      }

      if (p.y > CANVAS_H + 40) {
        damagePlayer(sim);
        if (sim.hearts > 0) {
          p.x = p.safeX;
          p.y = p.safeY - 12;
          p.vx = 0;
          p.vy = 0;
        }
      }

      for (const c of sim.coins) {
        if (c.collected) continue;
        const dx = p.x + PLAYER_W / 2 - c.x;
        const dy = p.y + PLAYER_H / 2 - c.y;
        if (dx * dx + dy * dy < 24 * 24) {
          c.collected = true;
          sim.tokens += 1;
          sim.score += 25;
          playGameSound('tap');
          setTokensCollected(sim.tokens);
          setScore(sim.score);
          spawnSparks(c.x, c.y, '#fbbf24', 8);
          spawnPopup(c.x, c.y - 10, '+25', '#fde047');
        }
      }

      for (const e of sim.enemies) {
        if (e.defeated) {
          e.squishTimer = Math.max(0, e.squishTimer - dt);
          continue;
        }
        e.x += e.vx * dt;
        if (e.x <= e.minX) {
          e.x = e.minX;
          e.vx = Math.abs(e.vx);
        } else if (e.x >= e.maxX) {
          e.x = e.maxX;
          e.vx = -Math.abs(e.vx);
        }

        const hitX = p.x + PLAYER_W > e.x + 3 && p.x < e.x + e.w - 3;
        const hitY = p.y + PLAYER_H > e.y + 2 && p.y < e.y + e.h;
        if (hitX && hitY) {
          const isStomping = p.vy > 0 && prevBottom <= e.y + 14;
          if (isStomping) {
            e.defeated = true;
            e.squishTimer = 0.45;
            p.vy = -380;
            sim.streak += 1;
            sim.maxStreak = Math.max(sim.maxStreak, sim.streak);
            const pts = 80 + sim.streak * 10;
            sim.score += pts;
            playGameSound('correct');
            setStreak(sim.streak);
            setMaxStreak(sim.maxStreak);
            setScore(sim.score);
            spawnSparks(e.x + e.w / 2, e.y + e.h / 2, '#34d399', 12);
            spawnPopup(e.x + e.w / 2, e.y - 6, `+${pts}`, '#6ee7b7');
          } else if (p.shieldTimer > 0) {
            e.defeated = true;
            e.squishTimer = 0.4;
            sim.score += 60;
            setScore(sim.score);
            playGameSound('correct');
            spawnSparks(e.x + e.w / 2, e.y + e.h / 2, '#22d3ee', 12);
            spawnPopup(e.x + e.w / 2, e.y - 6, '+60', '#67e8f9');
          } else {
            damagePlayer(sim);
          }
        }
      }

      sim.particles = sim.particles
        .map((pt) => ({
          ...pt,
          x: pt.x + pt.vx * dt,
          y: pt.y + pt.vy * dt,
          vy: pt.vy + 290 * dt,
          life: pt.life - dt,
        }))
        .filter((pt) => pt.life > 0);

      sim.texts = sim.texts
        .map((ft) => ({ ...ft, y: ft.y + ft.vy * dt, life: ft.life - dt }))
        .filter((ft) => ft.life > 0);

      const targetCam = Math.max(0, Math.min(worldWidth - CANVAS_W, p.x - CANVAS_W * 0.36));
      sim.cameraX += (targetCam - sim.cameraX) * Math.min(1, dt * 8);

      if (p.x + PLAYER_W >= goalX) {
        sim.score += 200 + sim.hearts * 40;
        setScore(sim.score);
        playGameSound('win');
        sim.phase = 'WON';
        setPhase('WON');
      }
    };

    const renderScene = (now: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = setupHiDpiCanvas(canvas, CANVAS_W, CANVAS_H);
      if (!ctx) return;

      const sim = simRef.current;
      const cam = sim ? sim.cameraX : 0;

      // Multi-stop radiant sky gradient
      const sky = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
      sky.addColorStop(0, '#0284c7');
      sky.addColorStop(0.55, '#38bdf8');
      sky.addColorStop(1, '#e0f2fe');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Sun glow
      const sunGrad = ctx.createRadialGradient(540, 58, 6, 540, 58, 68);
      sunGrad.addColorStop(0, '#fef08a');
      sunGrad.addColorStop(0.4, 'rgba(253, 224, 71, 0.45)');
      sunGrad.addColorStop(1, 'rgba(253, 224, 71, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(540, 58, 68, 0, Math.PI * 2);
      ctx.fill();

      // Parallax distant mountains
      ctx.fillStyle = 'rgba(14, 116, 144, 0.25)';
      for (let i = 0; i < 6; i++) {
        const mx = ((i * 220 - cam * 0.22) % (CANVAS_W + 260)) - 120;
        ctx.beginPath();
        ctx.moveTo(mx, GROUND_Y);
        ctx.lineTo(mx + 95, GROUND_Y - 125);
        ctx.lineTo(mx + 190, GROUND_Y);
        ctx.closePath();
        ctx.fill();
      }

      // Soft layered clouds
      for (let i = 0; i < 6; i++) {
        const cx = ((i * 260 - cam * 0.35) % (CANVAS_W + 220)) - 60;
        const cy = 48 + (i % 2) * 34;
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.beginPath();
        ctx.arc(cx, cy, 18, 0, Math.PI * 2);
        ctx.arc(cx + 20, cy - 8, 22, 0, Math.PI * 2);
        ctx.arc(cx + 42, cy, 17, 0, Math.PI * 2);
        ctx.fill();
      }

      // Lush foreground cyber hills
      for (let i = 0; i < 5; i++) {
        const hx = ((i * 340 - cam * 0.5) % (CANVAS_W + 320)) - 120;
        const hillGrad = ctx.createLinearGradient(0, GROUND_Y - 90, 0, GROUND_Y);
        hillGrad.addColorStop(0, '#38bdf8');
        hillGrad.addColorStop(1, '#0284c7');
        ctx.fillStyle = hillGrad;
        ctx.beginPath();
        ctx.arc(hx + 85, GROUND_Y, 88, Math.PI, 0);
        ctx.fill();
      }

      if (!sim) return;

      ctx.save();
      ctx.translate(-cam, 0);

      // Textured platforms
      for (const plat of sim.platforms) {
        if (plat.x + plat.w < cam - 40 || plat.x > cam + CANVAS_W + 40) continue;

        if (plat.kind === 'ground') {
          const soilGrad = ctx.createLinearGradient(0, plat.y + 12, 0, plat.y + plat.h);
          soilGrad.addColorStop(0, '#92400e');
          soilGrad.addColorStop(1, '#451a03');
          ctx.fillStyle = soilGrad;
          ctx.fillRect(plat.x, plat.y + 10, plat.w, plat.h - 10);

          const turfGrad = ctx.createLinearGradient(0, plat.y, 0, plat.y + 12);
          turfGrad.addColorStop(0, '#34d399');
          turfGrad.addColorStop(1, '#059669');
          ctx.fillStyle = turfGrad;
          ctx.fillRect(plat.x, plat.y, plat.w, 12);
          ctx.fillStyle = '#a7f3d0';
          ctx.fillRect(plat.x, plat.y, plat.w, 2.5);
        } else if (plat.kind === 'brick') {
          const brkGrad = ctx.createLinearGradient(0, plat.y, 0, plat.y + plat.h);
          brkGrad.addColorStop(0, '#fb923c');
          brkGrad.addColorStop(1, '#c2410c');
          ctx.fillStyle = brkGrad;
          ctx.beginPath();
          ctx.roundRect(plat.x, plat.y, plat.w, plat.h, 4);
          ctx.fill();
          ctx.strokeStyle = '#7c2d12';
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.strokeStyle = 'rgba(255,237,213,0.45)';
          ctx.beginPath();
          ctx.moveTo(plat.x + 3, plat.y + 2);
          ctx.lineTo(plat.x + plat.w - 3, plat.y + 2);
          ctx.stroke();
        } else if (plat.kind === 'pipe') {
          const pipeGrad = ctx.createLinearGradient(plat.x, 0, plat.x + plat.w, 0);
          pipeGrad.addColorStop(0, '#15803d');
          pipeGrad.addColorStop(0.35, '#4ade80');
          pipeGrad.addColorStop(1, '#14532d');
          ctx.fillStyle = pipeGrad;
          ctx.fillRect(plat.x + 4, plat.y + 14, plat.w - 8, plat.h - 14);
          ctx.beginPath();
          ctx.roundRect(plat.x, plat.y, plat.w, 15, 3);
          ctx.fill();
          ctx.strokeStyle = '#052e16';
          ctx.lineWidth = 2;
          ctx.strokeRect(plat.x + 4, plat.y + 14, plat.w - 8, plat.h - 14);
          ctx.strokeRect(plat.x, plat.y, plat.w, 15);
        } else {
          const cldGrad = ctx.createLinearGradient(0, plat.y, 0, plat.y + plat.h);
          cldGrad.addColorStop(0, '#e0f2fe');
          cldGrad.addColorStop(1, '#0284c7');
          ctx.fillStyle = cldGrad;
          ctx.beginPath();
          ctx.roundRect(plat.x, plat.y, plat.w, plat.h, 8);
          ctx.fill();
          ctx.strokeStyle = '#bae6fd';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      // [?] Firewall Blocks
      for (const b of sim.blocks) {
        drawFirewallBlock(ctx, b.x, b.y - b.bounceOffset, b.w, b.h, b.used, now);
      }

      // Collectible Security Keys
      const bob = Math.sin(now / 180) * 3;
      for (const c of sim.coins) {
        if (!c.collected) drawSecurityKeyToken(ctx, c.x, c.y + bob, 10, now);
      }

      // Malware Bots
      for (const e of sim.enemies) {
        if (e.defeated && e.squishTimer <= 0) continue;
        drawMalwareBotSprite(ctx, e.x, e.y, e.w, e.h, e.kind, now, e.defeated);
      }

      // Shield Fortress Flagpole & Castle
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(goalX + 8, GROUND_Y - 145, 7, 145);
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(goalX + 11.5, GROUND_Y - 148, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.moveTo(goalX + 15, GROUND_Y - 140);
      ctx.lineTo(goalX + 68, GROUND_Y - 122 + Math.sin(now / 150) * 2);
      ctx.lineTo(goalX + 15, GROUND_Y - 104);
      ctx.closePath();
      ctx.fill();

      // Fortress Castle
      const castleGrad = ctx.createLinearGradient(goalX + 55, GROUND_Y - 84, goalX + 125, GROUND_Y);
      castleGrad.addColorStop(0, '#475569');
      castleGrad.addColorStop(1, '#1e293b');
      ctx.fillStyle = castleGrad;
      ctx.fillRect(goalX + 55, GROUND_Y - 76, 70, 76);
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(goalX + 77, GROUND_Y - 40, 26, 40, [12, 12, 0, 0]);
      ctx.fill();
      ctx.fillStyle = '#22d3ee';
      ctx.fillRect(goalX + 53, GROUND_Y - 84, 15, 10);
      ctx.fillRect(goalX + 82, GROUND_Y - 84, 15, 10);
      ctx.fillRect(goalX + 112, GROUND_Y - 84, 15, 10);

      // Player Character
      const p = sim.player;
      const blinkSkip = p.invulnTimer > 0 && Math.floor(p.invulnTimer * 14) % 2 === 0;
      if (!blinkSkip) {
        drawCyberHeroSprite(
          ctx,
          p.x,
          p.y,
          PLAYER_W,
          PLAYER_H,
          p.facing,
          p.walkPhase,
          p.shieldTimer > 0,
          p.onGround,
          now
        );
      }

      drawParticlesVfx(ctx, sim.particles);
      drawFloatingTextsVfx(ctx, sim.texts);

      ctx.restore();
    };

    const tick = (now: number) => {
      const dt = Math.min(0.04, (now - lastTime) / 1000);
      lastTime = now;
      stepSimulation(dt);
      renderScene(now);
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [ageGroup, copy.questions, goalX, worldWidth]);

  const handleAnswerGate = (optIdx: 0 | 1) => {
    if (!activeQuestion || gateFeedback || !simRef.current) return;
    const isCorrect = optIdx === activeQuestion.correctIdx;
    const sim = simRef.current;

    setGateAttempts((a) => a + 1);
    if (isCorrect) {
      setGateCorrect((c) => c + 1);
      sim.score += 120;
      sim.streak += 1;
      sim.maxStreak = Math.max(sim.maxStreak, sim.streak);
      sim.gatesCleared += 1;
      sim.player.shieldTimer = 6;
      setShieldActive(true);
      setScore(sim.score);
      setStreak(sim.streak);
      setMaxStreak(sim.maxStreak);
      setGatesCleared(sim.gatesCleared);
      playGameSound('correct');
      setGateFeedback({ correct: true, text: activeQuestion.explanation });
    } else {
      sim.streak = 0;
      sim.gatesCleared += 1;
      setStreak(0);
      setGatesCleared(sim.gatesCleared);
      playGameSound('wrong');
      setGateFeedback({ correct: false, text: activeQuestion.explanation });
    }

    const block = sim.blocks.find((b) => b.id === activeGateBlockId);
    if (block) block.used = true;
  };

  const handleResumeAfterGate = () => {
    if (!simRef.current) return;
    simRef.current.phase = 'PLAYING';
    setActiveQuestion(null);
    setActiveGateBlockId(null);
    setGateFeedback(null);
    setPhase('PLAYING');
  };

  const setTouchKey = (key: 'left' | 'right' | 'jump', pressed: boolean) => {
    const sim = simRef.current;
    if (!sim) return;
    if (key === 'jump' && pressed && !sim.keys.jump) sim.keys.jumpPressed = true;
    sim.keys[key] = pressed;
  };

  const accuracy =
    gateAttempts > 0
      ? Math.round((gateCorrect / gateAttempts) * 100)
      : phase === 'WON'
      ? Math.max(80, Math.round((hearts / maxHearts) * 100))
      : 100;

  if (phase === 'WON') {
    const finalAcc =
      gateAttempts > 0
        ? Math.round((gateCorrect / gateAttempts) * 100)
        : Math.max(85, Math.round((hearts / maxHearts) * 100));
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
          title={copy.title}
          takeaway={copy.takeaway}
          stats={stats}
          ageGroup={ageGroup}
          onReplay={startGame}
          onContinue={onComplete}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 w-full flex flex-col p-3 sm:p-5 bg-slate-50 space-y-3 overflow-y-auto scrollbar-none">
      <GameHud
        title={copy.title}
        subtitle={copy.subtitle}
        icon={<Sparkles className="w-5 h-5" />}
        accentColor="emerald"
        ageGroup={ageGroup}
        currentStep={gatesCleared + (phase === 'WON' ? 1 : 0)}
        totalSteps={totalGates + 1}
        score={score}
        streak={streak}
        accuracy={accuracy}
        timeLeftSeconds={timeLeft}
      />

      <div className="bg-white border border-slate-200 rounded-2xl px-3.5 py-2 flex items-center justify-between gap-2 text-xs sm:text-sm font-black shrink-0">
        <div className="flex items-center gap-1.5 text-rose-600">
          <span className="text-slate-500 text-xs">{copy.labels.hearts}:</span>
          {Array.from({ length: maxHearts }).map((_, idx) => (
            <Heart
              key={idx}
              className={`w-4 h-4 ${
                idx < hearts ? 'fill-rose-500 text-rose-500' : 'fill-slate-100 text-slate-300'
              }`}
            />
          ))}
        </div>

        {shieldActive && (
          <div className="flex items-center gap-1 text-cyan-700 font-black text-xs">
            <Shield className="w-4 h-4 text-cyan-600" />
            <span>{copy.labels.shieldActive}</span>
          </div>
        )}

        <div className="flex items-center gap-3 tabular-nums text-slate-700">
          <span className="flex items-center gap-1 text-amber-700">
            <KeyRound className="w-4 h-4 text-amber-500" />
            <span>{tokensCollected}</span>
          </span>
          <span className="text-emerald-700">
            {copy.labels.gates}: {gatesCleared}/{totalGates}
          </span>
        </div>
      </div>

      <div className="relative w-full max-w-2xl mx-auto rounded-3xl overflow-hidden border-2 border-slate-200 bg-sky-200 shadow-lg shrink-0">
        <canvas
          ref={canvasRef}
          style={{ aspectRatio: `${CANVAS_W} / ${CANVAS_H}` }}
          className="w-full h-auto block touch-none"
        />

        {phase === 'TITLE' && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-center p-5 text-center text-white space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-cyan-500/20 border border-cyan-300/40 flex items-center justify-center text-4xl">
              🕹️
            </div>
            <div className="space-y-1 max-w-sm">
              <h3 className="text-lg sm:text-xl font-black">{copy.labels.startTitle}</h3>
              <p className="text-xs sm:text-sm text-sky-100 leading-relaxed">{copy.labels.startDesc}</p>
            </div>
            <p className="text-[11px] text-amber-200 font-bold">{copy.labels.controlsHint}</p>
            <button
              type="button"
              onClick={startGame}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-black text-sm sm:text-base shadow-lg flex items-center gap-2 cursor-pointer active:scale-95 transition"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>{copy.labels.playBtn}</span>
            </button>
          </div>
        )}

        {phase === 'GATE' && activeQuestion && (
          <div className="absolute inset-0 bg-slate-900/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 z-20">
            <div className="w-full max-w-md bg-white text-slate-900 rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xl">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-700">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>{copy.labels.gateTitle}</span>
              </div>
              <p className="text-sm sm:text-base font-black text-slate-900 leading-snug">
                {activeQuestion.prompt}
              </p>

              <div className="space-y-2">
                {activeQuestion.options.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={!!gateFeedback}
                    onClick={() => handleAnswerGate(idx as 0 | 1)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition cursor-pointer ${
                      gateFeedback
                        ? idx === activeQuestion.correctIdx
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                        : 'bg-slate-50 hover:bg-cyan-50 border-slate-200 hover:border-cyan-300 text-slate-800'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {gateFeedback && (
                <div className="space-y-2 pt-1">
                  <div
                    className={`p-2.5 rounded-xl text-xs font-bold leading-relaxed ${
                      gateFeedback.correct
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-900 border border-amber-200'
                    }`}
                  >
                    {gateFeedback.text}
                  </div>
                  <button
                    type="button"
                    onClick={handleResumeAfterGate}
                    className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs sm:text-sm cursor-pointer active:scale-95 transition"
                  >
                    {language === 'fr' ? 'Continuer' : language === 'en' ? 'Continue' : 'Continuar'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {phase === 'GAME_OVER' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-5 text-center text-white space-y-4">
            <div className="text-4xl">🛡️💥</div>
            <div className="space-y-1 max-w-sm">
              <h3 className="text-lg sm:text-xl font-black text-rose-300">
                {copy.labels.gameOverTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-200">{copy.labels.gameOverDesc}</p>
            </div>
            <button
              type="button"
              onClick={startGame}
              className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-white font-black text-sm flex items-center gap-2 cursor-pointer active:scale-95 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{copy.labels.retryBtn}</span>
            </button>
          </div>
        )}
      </div>

      <div className="w-full max-w-2xl mx-auto flex items-center justify-between gap-3 pt-1 shrink-0 select-none">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onPointerDown={() => setTouchKey('left', true)}
            onPointerUp={() => setTouchKey('left', false)}
            onPointerLeave={() => setTouchKey('left', false)}
            onPointerCancel={() => setTouchKey('left', false)}
            aria-label="Move left"
            className="w-16 h-14 rounded-2xl bg-white border-2 border-slate-200 active:bg-cyan-50 active:border-cyan-400 text-slate-800 flex items-center justify-center shadow-sm cursor-pointer touch-none"
          >
            <ArrowLeft className="w-7 h-7" />
          </button>
          <button
            type="button"
            onPointerDown={() => setTouchKey('right', true)}
            onPointerUp={() => setTouchKey('right', false)}
            onPointerLeave={() => setTouchKey('right', false)}
            onPointerCancel={() => setTouchKey('right', false)}
            aria-label="Move right"
            className="w-16 h-14 rounded-2xl bg-white border-2 border-slate-200 active:bg-cyan-50 active:border-cyan-400 text-slate-800 flex items-center justify-center shadow-sm cursor-pointer touch-none"
          >
            <ArrowRight className="w-7 h-7" />
          </button>
        </div>

        <button
          type="button"
          onPointerDown={() => setTouchKey('jump', true)}
          onPointerUp={() => setTouchKey('jump', false)}
          onPointerLeave={() => setTouchKey('jump', false)}
          onPointerCancel={() => setTouchKey('jump', false)}
          className="px-7 h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-600 active:scale-95 text-white font-black text-sm sm:text-base flex items-center gap-2 shadow-md cursor-pointer touch-none"
        >
          <ArrowUp className="w-6 h-6 stroke-[2.75]" />
          <span>{copy.labels.jump}</span>
        </button>
      </div>
    </div>
  );
};
