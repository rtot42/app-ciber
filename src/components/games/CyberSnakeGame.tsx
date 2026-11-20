import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Heart,
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
  drawFloatingTextsVfx,
  drawParticlesVfx,
  FloatingTextVfx,
  ParticleVfx,
  setupHiDpiCanvas,
} from '../../utils/canvasSprites';

interface CyberSnakeGameProps {
  onComplete: (stats?: GameResultStats) => void;
  ageGroup?: ChildAgeGroup;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type SnakePhase = 'TITLE' | 'PLAYING' | 'GAME_OVER' | 'WON';

interface GridPos {
  x: number;
  y: number;
}

interface SafeItem extends GridPos {
  kind: 'https' | '2fa' | 'patch' | 'backup';
  label: string;
  tip: string;
}

interface ThreatItem extends GridPos {
  kind: 'phish' | 'trojan' | 'exe';
  label: string;
}

interface BonusShield extends GridPos {
  ttl: number;
}

const CANVAS_SIZE = 374;

export const CyberSnakeGame: React.FC<CyberSnakeGameProps> = ({
  onComplete,
  ageGroup = '8–10' as ChildAgeGroup,
}) => {
  const { language } = useLanguage();
  const tierMeta = getAgeTierMeta(ageGroup, language);

  const config = useMemo(() => {
    const gridSize = ageGroup === '13–14' ? 17 : ageGroup === '11–12' ? 15 : 13;
    const stepMs = ageGroup === '13–14' ? 112 : ageGroup === '11–12' ? 145 : 185;
    const targetPackets = ageGroup === '13–14' ? 12 : ageGroup === '11–12' ? 10 : 8;
    const maxHearts = ageGroup === '8–10' ? 4 : 3;
    const threatCount = ageGroup === '13–14' ? 5 : ageGroup === '11–12' ? 3 : 2;
    const wrapWalls = ageGroup === '8–10';
    const obstacleCount = ageGroup === '13–14' ? 4 : 0;

    return { gridSize, stepMs, targetPackets, maxHearts, threatCount, wrapWalls, obstacleCount };
  }, [ageGroup]);

  const copy = useMemo(() => {
    const title =
      language === 'fr'
        ? 'CiberSnake : Patrouille Réseau'
        : language === 'en'
        ? 'CyberSnake: Network Patrol'
        : 'CiberSnake: Patrulla de Red';

    const subtitle =
      language === 'fr'
        ? 'Collecte les paquets sûrs et évite les pièges malware'
        : language === 'en'
        ? 'Collect safe data packets & dodge malware hazards'
        : 'Recoge paquetes seguros y esquiva trampas de malware';

    const takeaway =
      language === 'fr'
        ? 'Un réseau sain bloque les logiciels malveillants (.exe inconnus, liens de phishing) tout en privilégiant HTTPS, les mises à jour et les sauvegardes.'
        : language === 'en'
        ? 'A healthy network collects trusted updates, HTTPS, 2FA, and backups while steering clear of unknown .exe files and phishing links.'
        : 'Una red segura recoge actualizaciones, HTTPS, 2FA y copias de seguridad, evitando archivos .exe desconocidos y enlaces de phishing.';

    const safeTemplates: Omit<SafeItem, 'x' | 'y'>[] =
      language === 'fr'
        ? [
            { kind: 'https', label: 'HTTPS', tip: 'Connexion chiffrée vérifiée !' },
            { kind: '2fa', label: '2FA', tip: 'Double verrou activé sur le compte.' },
            { kind: 'patch', label: 'PATCH', tip: 'Faille de sécurité corrigée !' },
            { kind: 'backup', label: 'SAVE', tip: 'Tes fichiers sont à l’abri.' },
          ]
        : language === 'en'
        ? [
            { kind: 'https', label: 'HTTPS', tip: 'Encrypted connection verified!' },
            { kind: '2fa', label: '2FA', tip: 'Second login lock enabled.' },
            { kind: 'patch', label: 'PATCH', tip: 'Security vulnerability patched!' },
            { kind: 'backup', label: 'SAVE', tip: 'Clean data backup stored.' },
          ]
        : [
            { kind: 'https', label: 'HTTPS', tip: '¡Conexión cifrada verificada!' },
            { kind: '2fa', label: '2FA', tip: 'Segundo candado activado.' },
            { kind: 'patch', label: 'PARCHE', tip: '¡Fallo de seguridad cerrado!' },
            { kind: 'backup', label: 'BACKUP', tip: 'Copia de seguridad a salvo.' },
          ];

    const threatTemplates: Omit<ThreatItem, 'x' | 'y'>[] = [
      { kind: 'phish', label: 'PHISH' },
      { kind: 'trojan', label: 'VIRUS' },
      { kind: 'exe', label: '.EXE' },
    ];

    const labels = {
      es: {
        startTitle: 'Patrulla la Red 2D',
        startDesc: config.wrapWalls
          ? 'Guía la serpiente cortafuegos hacia los nodos verdes seguros (HTTPS, 2FA, PARCHE) y evita las minas rojas (.EXE, VIRUS). En Cadete cruzas los bordes.'
          : 'Recoge nodos verdes seguros, evita las minas rojas y no choques contra los bordes rojos ni tu propia cola.',
        playBtn: '¡Iniciar Patrulla!',
        gameOverTitle: '¡Red Comprometida!',
        gameOverDesc: 'Los paquetes maliciosos agotaron tus escudos. ¡Inténtalo de nuevo!',
        retryBtn: 'Reiniciar Red',
        shields: 'Escudos',
        packets: 'Paquetes',
        targetPrefix: 'Objetivo:',
        hitThreat: '¡Impactaste una mina de malware! Esquiva las cruces rojas.',
        hitWall: '¡Chocaste con el límite del firewall o tu cola!',
        shieldBonus: '¡Escudo Antivirus activado! Amenazas limpiadas.',
      },
      fr: {
        startTitle: 'Patrouille Réseau 2D',
        startDesc: config.wrapWalls
          ? 'Guide le serpent pare-feu vers les nœuds verts sûrs et évite les mines rouges (.EXE, VIRUS). En Cadet, les bords sont traversables.'
          : 'Collecte les nœuds verts sûrs, évite les mines rouges sans toucher les murs ni ta queue.',
        playBtn: 'Lancer la Patrouille !',
        gameOverTitle: 'Réseau Compromis !',
        gameOverDesc: 'Les menaces ont épuisé tes boucliers. Prêt pour une autre tentative ?',
        retryBtn: 'Redémarrer',
        shields: 'Boucliers',
        packets: 'Paquets',
        targetPrefix: 'Cible :',
        hitThreat: 'Mine malveillante touchée ! Évite les croix rouges.',
        hitWall: 'Collision avec le mur ou ta queue !',
        shieldBonus: 'Bouclier Antivirus activé ! Menaces nettoyées.',
      },
      en: {
        startTitle: '2D Network Patrol',
        startDesc: config.wrapWalls
          ? 'Steer the firewall snake to green safe nodes (HTTPS, 2FA, PATCH) and avoid red mines (.EXE, VIRUS). Cadet mode wraps safely.'
          : 'Collect green safe nodes, dodge red malware mines, and avoid hitting walls or your tail.',
        playBtn: 'Start Patrol!',
        gameOverTitle: 'Network Breached!',
        gameOverDesc: 'Malware traps drained your shields. Ready to patch and retry?',
        retryBtn: 'Restart Grid',
        shields: 'Shields',
        packets: 'Packets',
        targetPrefix: 'Target:',
        hitThreat: 'Hit a malware mine! Steer clear of red hazard nodes.',
        hitWall: 'Crashed into firewall wall or tail!',
        shieldBonus: 'Antivirus Shield activated! Threats cleared.',
      },
    }[language];

    return { title, subtitle, takeaway, safeTemplates, threatTemplates, labels };
  }, [config.wrapWalls, language]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);

  const [phase, setPhase] = useState<SnakePhase>('TITLE');
  const [hearts, setHearts] = useState<number>(config.maxHearts);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(1);
  const [collectedCount, setCollectedCount] = useState<number>(0);
  const [mistakes, setMistakes] = useState<number>(0);
  const [statusBanner, setStatusBanner] = useState<string>(copy.safeTemplates[0].tip);
  const [statusTone, setStatusTone] = useState<'info' | 'good' | 'warn'>('info');
  const [activeSafeLabel, setActiveSafeLabel] = useState<string>(copy.safeTemplates[0].label);
  const [timeLeft, setTimeLeft] = useState<number | null>(tierMeta.timeLimitSeconds);

  const simRef = useRef<{
    snake: GridPos[];
    dir: Direction;
    dirQueue: Direction[];
    safeItem: SafeItem;
    threats: ThreatItem[];
    obstacles: GridPos[];
    bonusShield: BonusShield | null;
    particles: ParticleVfx[];
    texts: FloatingTextVfx[];
    hearts: number;
    score: number;
    streak: number;
    maxStreak: number;
    collected: number;
    mistakes: number;
    phase: SnakePhase;
    timeLeft: number | null;
  } | null>(null);

  const isOpposite = (a: Direction, b: Direction) =>
    (a === 'UP' && b === 'DOWN') ||
    (a === 'DOWN' && b === 'UP') ||
    (a === 'LEFT' && b === 'RIGHT') ||
    (a === 'RIGHT' && b === 'LEFT');

  const randomFreeCell = useCallback(
    (occupied: GridPos[], avoidNearHead?: GridPos): GridPos => {
      const { gridSize } = config;
      for (let attempt = 0; attempt < 200; attempt++) {
        const x = Math.floor(Math.random() * gridSize);
        const y = Math.floor(Math.random() * gridSize);
        const taken = occupied.some((o) => o.x === x && o.y === y);
        const tooCloseToHead =
          avoidNearHead && Math.abs(x - avoidNearHead.x) + Math.abs(y - avoidNearHead.y) <= 2;
        if (!taken && !tooCloseToHead) return { x, y };
      }
      return { x: 0, y: 0 };
    },
    [config]
  );

  const spawnRoundObjects = useCallback(
    (
      snake: GridPos[],
      obstacles: GridPos[],
      itemIndex: number
    ): { safeItem: SafeItem; threats: ThreatItem[] } => {
      const head = snake[0];
      const occupied = [...snake, ...obstacles];
      const safePos = randomFreeCell(occupied, head);
      const safeTpl = copy.safeTemplates[itemIndex % copy.safeTemplates.length];
      const safeItem: SafeItem = { ...safeTpl, x: safePos.x, y: safePos.y };

      const threats: ThreatItem[] = [];
      for (let i = 0; i < config.threatCount; i++) {
        const tPos = randomFreeCell([...occupied, safeItem, ...threats], head);
        const tTpl = copy.threatTemplates[i % copy.threatTemplates.length];
        threats.push({ ...tTpl, x: tPos.x, y: tPos.y });
      }

      return { safeItem, threats };
    },
    [config.threatCount, copy.safeTemplates, copy.threatTemplates, randomFreeCell]
  );

  const startGame = useCallback(() => {
    playGameSound('tap');
    const mid = Math.floor(config.gridSize / 2);
    const initialSnake: GridPos[] = [
      { x: mid, y: mid },
      { x: mid - 1, y: mid },
      { x: mid - 2, y: mid },
    ];

    const obstacles: GridPos[] = [];
    for (let i = 0; i < config.obstacleCount; i++) {
      const pos = randomFreeCell([...initialSnake, ...obstacles], initialSnake[0]);
      if (Math.abs(pos.x - mid) > 2 || Math.abs(pos.y - mid) > 1) {
        obstacles.push(pos);
      }
    }

    const { safeItem, threats } = spawnRoundObjects(initialSnake, obstacles, 0);

    simRef.current = {
      snake: initialSnake,
      dir: 'RIGHT',
      dirQueue: [],
      safeItem,
      threats,
      obstacles,
      bonusShield: null,
      particles: [],
      texts: [],
      hearts: config.maxHearts,
      score: 0,
      streak: 0,
      maxStreak: 1,
      collected: 0,
      mistakes: 0,
      phase: 'PLAYING',
      timeLeft: tierMeta.timeLimitSeconds,
    };

    setHearts(config.maxHearts);
    setScore(0);
    setStreak(0);
    setMaxStreak(1);
    setCollectedCount(0);
    setMistakes(0);
    setActiveSafeLabel(safeItem.label);
    setStatusBanner(safeItem.tip);
    setStatusTone('info');
    setTimeLeft(tierMeta.timeLimitSeconds);
    setPhase('PLAYING');
  }, [config.gridSize, config.maxHearts, config.obstacleCount, randomFreeCell, spawnRoundObjects, tierMeta.timeLimitSeconds]);

  const queueDirection = useCallback((nextDir: Direction) => {
    const sim = simRef.current;
    if (!sim || sim.phase !== 'PLAYING') return;
    const lastPlanned =
      sim.dirQueue.length > 0 ? sim.dirQueue[sim.dirQueue.length - 1] : sim.dir;
    if (nextDir !== lastPlanned && !isOpposite(nextDir, lastPlanned) && sim.dirQueue.length < 2) {
      sim.dirQueue.push(nextDir);
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (simRef.current?.phase !== 'PLAYING') return;
      if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        queueDirection('UP');
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        e.preventDefault();
        queueDirection('DOWN');
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault();
        queueDirection('LEFT');
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault();
        queueDirection('RIGHT');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [queueDirection]);

  useEffect(() => {
    if (phase !== 'PLAYING' || tierMeta.timeLimitSeconds === null) return;
    const timerId = window.setInterval(() => {
      const sim = simRef.current;
      if (!sim || sim.phase !== 'PLAYING' || sim.timeLeft === null) return;
      sim.timeLeft = Math.max(0, sim.timeLeft - 1);
      setTimeLeft(sim.timeLeft);
      if (sim.timeLeft === 0) {
        playGameSound('wrong');
        sim.phase = 'GAME_OVER';
        setPhase('GAME_OVER');
      }
    }, 1000);
    return () => window.clearInterval(timerId);
  }, [phase, tierMeta.timeLimitSeconds]);

  // Game tick logic
  useEffect(() => {
    if (phase !== 'PLAYING') return;

    const spawnBurst = (cx: number, cy: number, color: string) => {
      const sim = simRef.current;
      if (!sim) return;
      for (let i = 0; i < 12; i++) {
        const a = (Math.PI * 2 * i) / 12;
        const spd = 45 + Math.random() * 85;
        sim.particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(a) * spd,
          vy: Math.sin(a) * spd,
          life: 0.45,
          maxLife: 0.45,
          size: 3,
          color,
        });
      }
    };

    const intervalId = window.setInterval(() => {
      const sim = simRef.current;
      if (!sim || sim.phase !== 'PLAYING') return;

      if (sim.dirQueue.length > 0) sim.dir = sim.dirQueue.shift()!;

      const cell = CANVAS_SIZE / config.gridSize;
      const head = sim.snake[0];
      let nx = head.x + (sim.dir === 'RIGHT' ? 1 : sim.dir === 'LEFT' ? -1 : 0);
      let ny = head.y + (sim.dir === 'DOWN' ? 1 : sim.dir === 'UP' ? -1 : 0);

      let hitBorder = false;
      if (config.wrapWalls) {
        nx = (nx + config.gridSize) % config.gridSize;
        ny = (ny + config.gridSize) % config.gridSize;
      } else if (nx < 0 || ny < 0 || nx >= config.gridSize || ny >= config.gridSize) {
        hitBorder = true;
      }

      const nextHead = { x: nx, y: ny };
      const hitSelf =
        !hitBorder &&
        sim.snake.slice(0, sim.snake.length - 1).some((s) => s.x === nx && s.y === ny);
      const hitObstacle =
        !hitBorder && sim.obstacles.some((o) => o.x === nx && o.y === ny);
      const hitThreat =
        !hitBorder && sim.threats.find((t) => t.x === nx && t.y === ny);

      if (hitBorder || hitSelf || hitObstacle || hitThreat) {
        playGameSound('wrong');
        sim.hearts -= 1;
        sim.streak = 0;
        sim.mistakes += 1;
        spawnBurst(head.x * cell + cell / 2, head.y * cell + cell / 2, '#f43f5e');
        setHearts(sim.hearts);
        setStreak(0);
        setMistakes(sim.mistakes);
        setStatusTone('warn');
        setStatusBanner(hitThreat ? copy.labels.hitThreat : copy.labels.hitWall);

        if (sim.hearts <= 0) {
          sim.phase = 'GAME_OVER';
          setPhase('GAME_OVER');
          return;
        }

        const mid = Math.floor(config.gridSize / 2);
        const keepLen = Math.min(sim.snake.length, 3);
        sim.snake = Array.from({ length: keepLen }, (_, idx) => ({
          x: Math.max(0, mid - idx),
          y: mid,
        }));
        sim.dir = 'RIGHT';
        sim.dirQueue = [];
        const refreshed = spawnRoundObjects(sim.snake, sim.obstacles, sim.collected);
        sim.safeItem = refreshed.safeItem;
        sim.threats = refreshed.threats;
        setActiveSafeLabel(refreshed.safeItem.label);
        return;
      }

      const newSnake = [nextHead, ...sim.snake];
      const ateSafe = nextHead.x === sim.safeItem.x && nextHead.y === sim.safeItem.y;
      const ateBonus =
        sim.bonusShield && nextHead.x === sim.bonusShield.x && nextHead.y === sim.bonusShield.y;

      if (ateBonus) {
        playGameSound('combo');
        sim.score += 150;
        sim.bonusShield = null;
        sim.threats = [];
        const bx = nextHead.x * cell + cell / 2;
        const by = nextHead.y * cell + cell / 2;
        spawnBurst(bx, by, '#fbbf24');
        sim.texts.push({ x: bx, y: by - 8, vy: -35, life: 0.75, text: '+150 SHIELD', color: '#fde047' });
        setScore(sim.score);
        setStatusTone('good');
        setStatusBanner(copy.labels.shieldBonus);
      }

      if (ateSafe) {
        sim.collected += 1;
        sim.streak += 1;
        sim.maxStreak = Math.max(sim.maxStreak, sim.streak);
        const pts = 100 + sim.streak * 15;
        sim.score += pts;
        playGameSound(sim.streak >= 3 ? 'combo' : 'correct');

        const sx = nextHead.x * cell + cell / 2;
        const sy = nextHead.y * cell + cell / 2;
        spawnBurst(sx, sy, '#34d399');
        sim.texts.push({ x: sx, y: sy - 8, vy: -35, life: 0.75, text: `+${pts}`, color: '#6ee7b7' });

        setCollectedCount(sim.collected);
        setStreak(sim.streak);
        setMaxStreak(sim.maxStreak);
        setScore(sim.score);
        setStatusTone('good');
        setStatusBanner(sim.safeItem.tip);

        if (sim.collected >= config.targetPackets) {
          sim.snake = newSnake;
          sim.score += sim.hearts * 45;
          setScore(sim.score);
          playGameSound('win');
          sim.phase = 'WON';
          setPhase('WON');
          return;
        }

        const nextObjects = spawnRoundObjects(newSnake, sim.obstacles, sim.collected);
        sim.safeItem = nextObjects.safeItem;
        sim.threats = nextObjects.threats;
        setActiveSafeLabel(nextObjects.safeItem.label);

        if (!sim.bonusShield && sim.collected % 4 === 0) {
          const bPos = randomFreeCell(
            [...newSnake, ...sim.obstacles, sim.safeItem, ...sim.threats],
            nextHead
          );
          sim.bonusShield = { ...bPos, ttl: 28 };
        }
      } else {
        newSnake.pop();
        if (sim.bonusShield) {
          sim.bonusShield.ttl -= 1;
          if (sim.bonusShield.ttl <= 0) sim.bonusShield = null;
        }
      }

      sim.snake = newSnake;
    }, config.stepMs);

    return () => window.clearInterval(intervalId);
  }, [config, copy.labels, phase, randomFreeCell, spawnRoundObjects]);

  // Smooth 60fps Canvas Renderer for glowing circuits, pulses & particles
  useEffect(() => {
    let rafId = 0;
    let last = performance.now();

    const render = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = setupHiDpiCanvas(canvas, CANVAS_SIZE, CANVAS_SIZE);
        if (ctx) {
          const { gridSize } = config;
          const cell = CANVAS_SIZE / gridSize;
          const sim = simRef.current;

          // Deep cyber-circuit board backdrop
          const bg = ctx.createRadialGradient(
            CANVAS_SIZE / 2,
            CANVAS_SIZE / 2,
            20,
            CANVAS_SIZE / 2,
            CANVAS_SIZE / 2,
            CANVAS_SIZE * 0.72
          );
          bg.addColorStop(0, '#0f172a');
          bg.addColorStop(1, '#020617');
          ctx.fillStyle = bg;
          ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

          // Circuit checkerboard tiles + trace intersections
          for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
              if ((r + c) % 2 === 0) {
                ctx.fillStyle = 'rgba(30, 41, 59, 0.36)';
                ctx.fillRect(c * cell, r * cell, cell, cell);
              }
            }
          }

          if (!config.wrapWalls) {
            ctx.strokeStyle = 'rgba(244, 63, 94, 0.85)';
            ctx.lineWidth = 3.5;
            ctx.strokeRect(2, 2, CANVAS_SIZE - 4, CANVAS_SIZE - 4);
          }

          if (sim) {
            // Update particles & floating texts smoothly at 60fps
            sim.particles = sim.particles
              .map((p) => ({
                ...p,
                x: p.x + p.vx * dt,
                y: p.y + p.vy * dt,
                life: p.life - dt,
              }))
              .filter((p) => p.life > 0);
            sim.texts = sim.texts
              .map((t) => ({ ...t, y: t.y + t.vy * dt, life: t.life - dt }))
              .filter((t) => t.life > 0);

            // Obstacles (Armored steel firewall cubes)
            for (const obs of sim.obstacles) {
              const ox = obs.x * cell + 2;
              const oy = obs.y * cell + 2;
              const s = cell - 4;
              ctx.fillStyle = '#475569';
              ctx.beginPath();
              ctx.roundRect(ox, oy, s, s, 4);
              ctx.fill();
              ctx.strokeStyle = '#94a3b8';
              ctx.lineWidth = 1.5;
              ctx.stroke();
              ctx.beginPath();
              ctx.moveTo(ox + 3, oy + 3);
              ctx.lineTo(ox + s - 3, oy + s - 3);
              ctx.moveTo(ox + s - 3, oy + 3);
              ctx.lineTo(ox + 3, oy + s - 3);
              ctx.stroke();
            }

            // Red Vector Threat Mines (rotating jagged crimson nodes)
            const spin = now / 360;
            for (const t of sim.threats) {
              const cx = t.x * cell + cell / 2;
              const cy = t.y * cell + cell / 2;
              const r = cell * 0.38;

              ctx.save();
              ctx.translate(cx, cy);
              ctx.rotate(spin);
              ctx.fillStyle = '#e11d48';
              ctx.beginPath();
              for (let i = 0; i < 8; i++) {
                const a = (Math.PI * 2 * i) / 8;
                const rad = i % 2 === 0 ? r * 1.05 : r * 0.58;
                if (i === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
                else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
              }
              ctx.closePath();
              ctx.fill();
              ctx.strokeStyle = '#fda4af';
              ctx.lineWidth = 1.4;
              ctx.stroke();
              ctx.restore();

              ctx.fillStyle = '#ffffff';
              ctx.font = `700 ${Math.max(8, Math.round(cell * 0.25))}px Nunito, system-ui, sans-serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText('!', cx, cy + 0.5);
            }

            // Bonus Golden Antivirus Shield
            if (sim.bonusShield) {
              const bx = sim.bonusShield.x * cell + cell / 2;
              const by = sim.bonusShield.y * cell + cell / 2;
              const glow = ctx.createRadialGradient(bx, by, 2, bx, by, cell * 0.6);
              glow.addColorStop(0, 'rgba(251, 191, 36, 0.7)');
              glow.addColorStop(1, 'rgba(251, 191, 36, 0)');
              ctx.fillStyle = glow;
              ctx.beginPath();
              ctx.arc(bx, by, cell * 0.6, 0, Math.PI * 2);
              ctx.fill();

              ctx.fillStyle = '#f59e0b';
              ctx.beginPath();
              ctx.arc(bx, by, cell * 0.36, 0, Math.PI * 2);
              ctx.fill();
              ctx.strokeStyle = '#fef08a';
              ctx.lineWidth = 2;
              ctx.stroke();
            }

            // Safe Emerald Data Node (Glowing diamond badge)
            const sx = sim.safeItem.x * cell + cell / 2;
            const sy = sim.safeItem.y * cell + cell / 2;
            const pulse = 1 + Math.sin(now / 160) * 0.09;
            const sglow = ctx.createRadialGradient(sx, sy, 2, sx, sy, cell * 0.62 * pulse);
            sglow.addColorStop(0, 'rgba(16, 185, 129, 0.65)');
            sglow.addColorStop(1, 'rgba(16, 185, 129, 0)');
            ctx.fillStyle = sglow;
            ctx.beginPath();
            ctx.arc(sx, sy, cell * 0.62 * pulse, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#10b981';
            ctx.beginPath();
            ctx.arc(sx, sy, cell * 0.38, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#a7f3d0';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.font = `700 ${Math.max(7, Math.round(cell * 0.24))}px Nunito, system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('✓', sx, sy + 0.5);

            // Glossy Serpent Body (Tail to Head)
            for (let i = sim.snake.length - 1; i >= 0; i--) {
              const seg = sim.snake[i];
              const isHead = i === 0;
              const px = seg.x * cell + 2;
              const py = seg.y * cell + 2;
              const size = cell - 4;

              const segGrad = ctx.createLinearGradient(px, py, px + size, py + size);
              if (isHead) {
                segGrad.addColorStop(0, '#67e8f9');
                segGrad.addColorStop(1, '#0891b2');
              } else {
                segGrad.addColorStop(0, i % 2 === 0 ? '#38bdf8' : '#0ea5e9');
                segGrad.addColorStop(1, '#0369a1');
              }
              ctx.fillStyle = segGrad;
              ctx.beginPath();
              ctx.roundRect(px, py, size, size, isHead ? 8 : 6);
              ctx.fill();

              // Specular top bevel
              ctx.strokeStyle = isHead ? '#cffafe' : 'rgba(186, 230, 253, 0.45)';
              ctx.lineWidth = 1.4;
              ctx.stroke();

              if (isHead) {
                ctx.fillStyle = '#0f172a';
                const eyeSize = Math.max(3, cell * 0.16);
                if (sim.dir === 'RIGHT' || sim.dir === 'LEFT') {
                  const ex = sim.dir === 'RIGHT' ? px + size - eyeSize * 1.7 : px + eyeSize * 0.7;
                  ctx.fillRect(ex, py + size * 0.22, eyeSize, eyeSize);
                  ctx.fillRect(ex, py + size * 0.62, eyeSize, eyeSize);
                } else {
                  const ey = sim.dir === 'DOWN' ? py + size - eyeSize * 1.7 : py + eyeSize * 0.7;
                  ctx.fillRect(px + size * 0.22, ey, eyeSize, eyeSize);
                  ctx.fillRect(px + size * 0.62, ey, eyeSize, eyeSize);
                }
              }
            }

            drawParticlesVfx(ctx, sim.particles);
            drawFloatingTextsVfx(ctx, sim.texts);
          }
        }
      }
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, [config]);

  const totalInteractions = Math.max(1, collectedCount + mistakes);
  const accuracy = Math.round((collectedCount / totalInteractions) * 100);

  if (phase === 'WON') {
    const finalAcc = Math.round((collectedCount / Math.max(1, collectedCount + mistakes)) * 100);
    const stats: GameResultStats = {
      stars: computeStars(finalAcc, ageGroup),
      accuracy: finalAcc,
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
          onReplay={startGame}
          onContinue={onComplete}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 w-full flex flex-col p-2.5 sm:p-3.5 bg-slate-50 gap-2 overflow-y-auto overflow-x-hidden scrollbar-none">
      <GameHud
        title={copy.title}
        subtitle={copy.subtitle}
        icon={<Sparkles className="w-5 h-5" />}
        accentColor="blue"
        ageGroup={ageGroup}
        currentStep={collectedCount}
        totalSteps={config.targetPackets}
        score={score}
        streak={streak}
        accuracy={collectedCount + mistakes > 0 ? accuracy : 100}
        timeLeftSeconds={timeLeft}
      />

      <div className="bg-white border border-slate-200 rounded-2xl px-3.5 py-2 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-bold shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 font-semibold text-xs">{copy.labels.shields}:</span>
          {Array.from({ length: config.maxHearts }).map((_, idx) => (
            <Heart
              key={idx}
              className={`w-4 h-4 ${
                idx < hearts ? 'fill-rose-500 text-rose-500' : 'fill-slate-100 text-slate-300'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-emerald-700">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span className="text-slate-500 font-semibold text-xs">{copy.labels.targetPrefix}</span>
          <span>{activeSafeLabel}</span>
        </div>

        <div className="tabular-nums text-cyan-700">
          {copy.labels.packets}: {collectedCount}/{config.targetPackets}
        </div>
      </div>

      <div
        className={`rounded-xl px-3.5 py-2 text-xs font-semibold border flex items-center gap-2 shrink-0 ${
          statusTone === 'good'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : statusTone === 'warn'
            ? 'bg-rose-50 border-rose-200 text-rose-800'
            : 'bg-sky-50 border-sky-200 text-sky-900'
        }`}
      >
        <ShieldAlert className="w-4 h-4 shrink-0" />
        <span className="leading-snug">{statusBanner}</span>
      </div>

      <div
        className="flex-1 min-h-[210px] w-full flex items-center justify-center"
        style={{ containerType: 'size' }}
      >
        <div
          style={{
            width: 'min(100cqw, 100cqh)',
            height: 'min(100cqw, 100cqh)',
          }}
          className="relative rounded-3xl overflow-hidden border-2 border-slate-300 bg-slate-900 shadow-lg"
        >
          <canvas
          ref={canvasRef}
          onPointerDown={(e) => {
            swipeStartRef.current = { x: e.clientX, y: e.clientY };
          }}
          onPointerUp={(e) => {
            if (!swipeStartRef.current) return;
            const dx = e.clientX - swipeStartRef.current.x;
            const dy = e.clientY - swipeStartRef.current.y;
            swipeStartRef.current = null;
            if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) return;
            if (Math.abs(dx) > Math.abs(dy)) queueDirection(dx > 0 ? 'RIGHT' : 'LEFT');
            else queueDirection(dy > 0 ? 'DOWN' : 'UP');
          }}
          className="w-full h-full block touch-none"
        />

        {phase === 'TITLE' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center text-white space-y-3">
            <div className="w-13 h-13 rounded-3xl bg-emerald-500/20 border border-emerald-300/40 flex items-center justify-center text-3xl">
              🐍
            </div>
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold">{copy.labels.startTitle}</h3>
              <p className="text-xs sm:text-sm text-sky-100 font-normal leading-relaxed max-w-xs">
                {copy.labels.startDesc}
              </p>
            </div>
            <button
              type="button"
              onClick={startGame}
              className="min-h-[44px] px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-bold text-sm sm:text-base shadow-lg flex items-center gap-2 cursor-pointer active:scale-95 transition"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>{copy.labels.playBtn}</span>
            </button>
          </div>
        )}

        {phase === 'GAME_OVER' && (
          <div className="absolute inset-0 bg-slate-950/88 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center text-white space-y-3">
            <div className="text-4xl">🦠💥</div>
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-rose-300">
                {copy.labels.gameOverTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 font-normal max-w-xs">{copy.labels.gameOverDesc}</p>
            </div>
            <button
              type="button"
              onClick={startGame}
              className="min-h-[44px] px-6 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-sm flex items-center gap-2 cursor-pointer active:scale-95 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{copy.labels.retryBtn}</span>
            </button>
          </div>
        )}
        </div>
      </div>

      <div className="w-full max-w-xs mx-auto grid grid-cols-3 gap-2 pt-0.5 shrink-0 select-none">
        <div />
        <button
          type="button"
          onPointerDown={() => queueDirection('UP')}
          aria-label="Move up"
          className="h-12 rounded-2xl bg-white border-2 border-slate-200 active:bg-cyan-50 active:border-cyan-400 text-slate-800 flex items-center justify-center shadow-sm cursor-pointer touch-none"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
        <div />
        <button
          type="button"
          onPointerDown={() => queueDirection('LEFT')}
          aria-label="Move left"
          className="h-12 rounded-2xl bg-white border-2 border-slate-200 active:bg-cyan-50 active:border-cyan-400 text-slate-800 flex items-center justify-center shadow-sm cursor-pointer touch-none"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <button
          type="button"
          onPointerDown={() => queueDirection('DOWN')}
          aria-label="Move down"
          className="h-12 rounded-2xl bg-white border-2 border-slate-200 active:bg-cyan-50 active:border-cyan-400 text-slate-800 flex items-center justify-center shadow-sm cursor-pointer touch-none"
        >
          <ArrowDown className="w-6 h-6" />
        </button>
        <button
          type="button"
          onPointerDown={() => queueDirection('RIGHT')}
          aria-label="Move right"
          className="h-12 rounded-2xl bg-white border-2 border-slate-200 active:bg-cyan-50 active:border-cyan-400 text-slate-800 flex items-center justify-center shadow-sm cursor-pointer touch-none"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
