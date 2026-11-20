import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Heart,
  Play,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Trophy,
  Zap,
} from 'lucide-react';
import { ChildAgeGroup, GameResultStats } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { GameHud, GameVictorySummary } from './GameShell';
import { computeStars } from '../../utils/ageDifficulty';
import { playGameSound } from '../../utils/gameAudio';
import {
  drawCyberDinoSprite,
  drawFloatingTextsVfx,
  drawParticlesVfx,
  drawSecurityKeyToken,
  FloatingTextVfx,
  ParticleVfx,
  setupHiDpiCanvas,
} from '../../utils/canvasSprites';

interface CyberDinoGameProps {
  onComplete: (stats?: GameResultStats) => void;
  ageGroup?: ChildAgeGroup;
}

type Phase = 'TITLE' | 'PLAYING' | 'GAME_OVER' | 'WON';

interface Obstacle {
  x: number;
  y: number;
  w: number;
  h: number;
  kind: 'cactus-malware' | 'flying-spam';
  hit: boolean;
}

interface KeyCoin {
  x: number;
  y: number;
  collected: boolean;
}

const CANVAS_W = 480;
const CANVAS_H = 250;
const GROUND_Y = 204;
const DINO_X = 62;
const DINO_W = 30;
const DINO_STAND_H = 38;
const DINO_DUCK_H = 22;

const HIGH_SCORE_STORAGE_KEY = 'ciberkids_dino_best_m';

const drawMalwareCactusSprite = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  timeMs: number
) => {
  ctx.save();
  const cx = x + w / 2;

  // Main spiky crimson malware body
  const grad = ctx.createLinearGradient(x, y, x, y + h);
  grad.addColorStop(0, '#fb7185');
  grad.addColorStop(0.5, '#e11d48');
  grad.addColorStop(1, '#881337');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(x + 4, y + 3, w - 8, h - 3, 6);
  ctx.fill();
  ctx.strokeStyle = '#fecdd3';
  ctx.lineWidth = 1.4;
  ctx.stroke();

  // Side arms / digital spikes
  ctx.fillStyle = '#e11d48';
  ctx.beginPath();
  ctx.roundRect(x - 2, y + h * 0.35, 8, 6, 3);
  ctx.roundRect(x + w - 6, y + h * 0.25, 8, 6, 3);
  ctx.fill();

  // Top spike crown
  ctx.fillStyle = '#fda4af';
  ctx.beginPath();
  ctx.moveTo(cx - 4, y + 4);
  ctx.lineTo(cx, y - 3);
  ctx.lineTo(cx + 4, y + 4);
  ctx.closePath();
  ctx.fill();

  // Glowing angry core eye
  const pulse = 0.75 + Math.sin(timeMs / 140) * 0.25;
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(cx - 7, y + 8, 14, 7, 3);
  ctx.fill();
  ctx.fillStyle = `rgba(253, 224, 71, ${pulse})`;
  ctx.beginPath();
  ctx.arc(cx - 3, y + 11.5, 1.8, 0, Math.PI * 2);
  ctx.arc(cx + 3, y + 11.5, 1.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};

const drawSpamDroneSprite = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  timeMs: number
) => {
  ctx.save();
  const cx = x + w / 2;
  const cy = y + h / 2;
  const flap = Math.sin(timeMs / 65) * 5;

  // Swept cyber wings
  ctx.fillStyle = '#991b1b';
  ctx.beginPath();
  ctx.moveTo(cx - 4, cy);
  ctx.lineTo(cx - 12, y - 4 + flap);
  ctx.lineTo(cx + 6, cy - 3);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(cx - 4, cy);
  ctx.lineTo(cx - 10, y + h + 3 - flap * 0.6);
  ctx.lineTo(cx + 6, cy + 3);
  ctx.closePath();
  ctx.fill();

  // Metallic crimson chassis with mail-trap emblem
  const grad = ctx.createLinearGradient(x, y, x, y + h);
  grad.addColorStop(0, '#f87171');
  grad.addColorStop(1, '#991b1b');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(x + 2, y + 2, w - 4, h - 4, 6);
  ctx.fill();
  ctx.strokeStyle = '#fecaca';
  ctx.lineWidth = 1.4;
  ctx.stroke();

  // Envelope V-flap
  ctx.strokeStyle = '#fef2f2';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x + 6, y + 6);
  ctx.lineTo(cx, cy + 2);
  ctx.lineTo(x + w - 6, y + 6);
  ctx.stroke();

  // Blinking warning LED
  ctx.fillStyle = Math.floor(timeMs / 160) % 2 === 0 ? '#fde047' : '#fb7185';
  ctx.beginPath();
  ctx.arc(x + 7, cy + 3, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};

export const CyberDinoGame: React.FC<CyberDinoGameProps> = ({
  onComplete,
  ageGroup = '8–10' as ChildAgeGroup,
}) => {
  const { language } = useLanguage();

  const config = useMemo(() => {
    const goalMeters = ageGroup === '13–14' ? 1100 : ageGroup === '11–12' ? 800 : 500;
    const baseSpeed = ageGroup === '13–14' ? 230 : ageGroup === '11–12' ? 195 : 165;
    const maxHearts = ageGroup === '8–10' ? 4 : 3;
    const allowAerial = ageGroup !== '8–10';
    return { goalMeters, baseSpeed, maxHearts, allowAerial };
  }, [ageGroup]);

  const copy = useMemo(() => {
    const title =
      language === 'fr'
        ? 'CiberDino : Course Sans Fin'
        : language === 'en'
        ? 'CyberDino: Chrome Runner'
        : 'CiberDino: Corredor Chrome';

    const subtitle =
      language === 'fr'
        ? 'Saute les virus au sol, esquive le spam aérien et bats le record'
        : language === 'en'
        ? 'Jump malware traps, duck flying spam & beat your distance record'
        : 'Salta obstáculos malware, agáchate ante spam y supera el récord';

    const takeaway =
      language === 'fr'
        ? 'Réagir vite face aux pop-ups, publicités pièges et spams te permet d’avancer loin sans compromettre ta sécurité.'
        : language === 'en'
        ? 'Quick reflexes against pop-up traps and flying spam let you speed through the web safely.'
        : 'Reaccionar rápido ante ventanas falsas y spam aéreo te permite recorrer la web a toda velocidad sin caer en trampas.';

    const labels = {
      es: {
        startTitle: 'Corre y Esquiva Amenazas',
        startDesc: config.allowAerial
          ? 'Salta los malware con Espacio/↑ y agáchate con ↓ bajo los drones de spam mientras recoges llaves doradas.'
          : 'Salta los malware con Espacio/↑ o tocando el botón SALTAR y recoge llaves doradas hasta la meta.',
        playBtn: '¡Empezar Carrera!',
        gameOverTitle: '¡Tropezón en la Red!',
        gameOverDesc: 'Los obstáculos agotaron tus escudos. ¡Intenta superar tu récord!',
        retryBtn: 'Correr de Nuevo',
        shields: 'Escudos',
        best: 'Récord',
        jump: 'SALTAR',
        duck: 'AGACHARSE',
      },
      fr: {
        startTitle: 'Cours & Évite les Pièges',
        startDesc: config.allowAerial
          ? 'Saute les virus avec Espace/↑ et baisse-toi avec ↓ sous les drones spam tout en ramassant des clés.'
          : 'Saute les virus avec Espace/↑ ou le bouton SAUTER et atteins la ligne d’arrivée.',
        playBtn: 'Courir !',
        gameOverTitle: 'Collision Réseau !',
        gameOverDesc: 'Tes boucliers sont épuisés. Bats ton record au prochain essai !',
        retryBtn: 'Rejouer',
        shields: 'Boucliers',
        best: 'Record',
        jump: 'SAUTER',
        duck: 'BAISSER',
      },
      en: {
        startTitle: 'Sprint & Dodge Malware',
        startDesc: config.allowAerial
          ? 'Jump over ground malware with Space/↑ and duck under flying spam drones with ↓ while grabbing gold keys.'
          : 'Jump ground malware traps with Space/↑ or tap JUMP and collect gold keys to reach the goal.',
        playBtn: 'Start Sprint!',
        gameOverTitle: 'Network Wipeout!',
        gameOverDesc: 'Obstacles drained your shields. Try to beat your best distance!',
        retryBtn: 'Sprint Again',
        shields: 'Shields',
        best: 'Best',
        jump: 'JUMP',
        duck: 'DUCK',
      },
    }[language];

    return { title, subtitle, takeaway, labels };
  }, [config.allowAerial, language]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [phase, setPhase] = useState<Phase>('TITLE');
  const [hearts, setHearts] = useState<number>(config.maxHearts);
  const [distance, setDistance] = useState<number>(0);
  const [bestDistance, setBestDistance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(HIGH_SCORE_STORAGE_KEY);
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(1);
  const [hits, setHits] = useState<number>(0);

  const simRef = useRef<{
    dinoY: number;
    dinoVy: number;
    ducking: boolean;
    onGround: boolean;
    obstacles: Obstacle[];
    coins: KeyCoin[];
    particles: ParticleVfx[];
    texts: FloatingTextVfx[];
    spawnTimer: number;
    distance: number;
    hearts: number;
    score: number;
    streak: number;
    maxStreak: number;
    hits: number;
    invuln: number;
    legPhase: number;
    phase: Phase;
  } | null>(null);

  const saveBest = useCallback((dist: number) => {
    setBestDistance((prev) => {
      const next = Math.max(prev, Math.floor(dist));
      try {
        localStorage.setItem(HIGH_SCORE_STORAGE_KEY, String(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  }, []);

  const spawnDust = (list: ParticleVfx[], x: number, y: number, color: string, count = 6) => {
    for (let i = 0; i < count; i++) {
      list.push({
        x,
        y,
        vx: -40 - Math.random() * 65,
        vy: -20 - Math.random() * 55,
        life: 0.38,
        maxLife: 0.38,
        size: 2.4 + Math.random() * 1.8,
        color,
      });
    }
  };

  const startGame = () => {
    playGameSound('tap');
    simRef.current = {
      dinoY: GROUND_Y - DINO_STAND_H,
      dinoVy: 0,
      ducking: false,
      onGround: true,
      obstacles: [],
      coins: [],
      particles: [],
      texts: [],
      spawnTimer: 1.0,
      distance: 0,
      hearts: config.maxHearts,
      score: 0,
      streak: 0,
      maxStreak: 1,
      hits: 0,
      invuln: 0,
      legPhase: 0,
      phase: 'PLAYING',
    };
    setHearts(config.maxHearts);
    setDistance(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(1);
    setHits(0);
    setPhase('PLAYING');
  };

  const triggerJump = useCallback(() => {
    const sim = simRef.current;
    if (!sim || sim.phase !== 'PLAYING' || !sim.onGround) return;
    sim.dinoVy = -460;
    sim.onGround = false;
    sim.ducking = false;
    spawnDust(sim.particles, DINO_X + 10, GROUND_Y - 2, '#6ee7b7', 6);
    playGameSound('tap');
  }, []);

  const setDuck = useCallback((ducking: boolean) => {
    const sim = simRef.current;
    if (!sim || sim.phase !== 'PLAYING') return;
    sim.ducking = ducking;
    if (ducking && !sim.onGround) {
      sim.dinoVy = Math.max(sim.dinoVy, 260);
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (simRef.current?.phase !== 'PLAYING') return;
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        triggerJump();
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        e.preventDefault();
        setDuck(true);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        setDuck(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [setDuck, triggerJump]);

  useEffect(() => {
    let rafId = 0;
    let last = performance.now();

    const step = (dt: number) => {
      const sim = simRef.current;
      if (!sim) return;

      for (const p of sim.particles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt;
      }
      sim.particles = sim.particles.filter((p) => p.life > 0);

      for (const t of sim.texts) {
        t.y += t.vy * dt;
        t.life -= dt;
      }
      sim.texts = sim.texts.filter((t) => t.life > 0);

      if (sim.phase !== 'PLAYING') return;

      sim.invuln = Math.max(0, sim.invuln - dt);
      const speed = config.baseSpeed + Math.min(130, sim.distance * 0.08);
      sim.distance += (speed * dt) / 14;
      sim.legPhase += dt * 16;
      setDistance(Math.floor(sim.distance));

      const wasAir = !sim.onGround;
      const curH = sim.ducking && sim.onGround ? DINO_DUCK_H : DINO_STAND_H;
      sim.dinoVy += 1380 * dt;
      sim.dinoY += sim.dinoVy * dt;
      if (sim.dinoY >= GROUND_Y - curH) {
        sim.dinoY = GROUND_Y - curH;
        sim.dinoVy = 0;
        sim.onGround = true;
        if (wasAir) {
          spawnDust(sim.particles, DINO_X + 12, GROUND_Y - 2, '#94a3b8', 5);
        }
      }

      sim.spawnTimer -= dt;
      if (sim.spawnTimer <= 0) {
        sim.spawnTimer = 1.05 + Math.random() * 0.75;
        const isAerial = config.allowAerial && Math.random() > 0.68;
        if (isAerial) {
          sim.obstacles.push({
            x: CANVAS_W + 20,
            y: GROUND_Y - 56,
            w: 34,
            h: 22,
            kind: 'flying-spam',
            hit: false,
          });
          sim.coins.push({ x: CANVAS_W + 36, y: GROUND_Y - 18, collected: false });
        } else {
          const h = 28 + Math.floor(Math.random() * 14);
          sim.obstacles.push({
            x: CANVAS_W + 20,
            y: GROUND_Y - h,
            w: 26,
            h,
            kind: 'cactus-malware',
            hit: false,
          });
          if (Math.random() > 0.35) {
            sim.coins.push({ x: CANVAS_W + 34, y: GROUND_Y - h - 38, collected: false });
          }
        }
      }

      for (const o of sim.obstacles) {
        o.x -= speed * dt;
        const hitBoxOverlap =
          DINO_X + DINO_W - 5 > o.x &&
          DINO_X + 4 < o.x + o.w &&
          sim.dinoY + curH - 4 > o.y &&
          sim.dinoY + 3 < o.y + o.h;
        if (hitBoxOverlap && !o.hit && sim.invuln <= 0) {
          o.hit = true;
          sim.hearts -= 1;
          sim.hits += 1;
          sim.streak = 0;
          sim.invuln = 1.25;
          spawnDust(sim.particles, DINO_X + 14, sim.dinoY + 14, '#fb7185', 10);
          sim.texts.push({
            x: DINO_X + 14,
            y: sim.dinoY - 10,
            vy: -32,
            life: 0.75,
            text: '-1 SHIELD',
            color: '#fda4af',
          });
          setHearts(sim.hearts);
          setHits(sim.hits);
          setStreak(0);
          playGameSound('wrong');
          if (sim.hearts <= 0) {
            saveBest(sim.distance);
            sim.phase = 'GAME_OVER';
            setPhase('GAME_OVER');
            return;
          }
        }
      }
      sim.obstacles = sim.obstacles.filter((o) => o.x + o.w > -24);

      for (const c of sim.coins) {
        c.x -= speed * dt;
        if (
          !c.collected &&
          Math.abs(DINO_X + DINO_W / 2 - c.x) < 22 &&
          Math.abs(sim.dinoY + curH / 2 - c.y) < 24
        ) {
          c.collected = true;
          sim.streak += 1;
          sim.maxStreak = Math.max(sim.maxStreak, sim.streak);
          const pts = 50 + sim.streak * 10;
          sim.score += pts;
          spawnDust(sim.particles, c.x, c.y, '#facc15', 8);
          sim.texts.push({
            x: c.x,
            y: c.y - 10,
            vy: -36,
            life: 0.75,
            text: `+${pts}`,
            color: '#fef08a',
          });
          setStreak(sim.streak);
          setMaxStreak(sim.maxStreak);
          setScore(sim.score);
          playGameSound('correct');
        }
      }
      sim.coins = sim.coins.filter((c) => c.x > -24);

      if (sim.distance >= config.goalMeters) {
        saveBest(sim.distance);
        sim.score += 200 + sim.hearts * 50;
        setScore(sim.score);
        playGameSound('win');
        sim.phase = 'WON';
        setPhase('WON');
      }
    };

    const draw = (now: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = setupHiDpiCanvas(canvas, CANVAS_W, CANVAS_H);
      if (!ctx) return;

      const sim = simRef.current;
      const dist = sim ? sim.distance * 14 : now * 0.04;

      // Cyber twilight sunset gradient
      const sky = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
      sky.addColorStop(0, '#0f172a');
      sky.addColorStop(0.55, '#1e293b');
      sky.addColorStop(1, '#0f766e');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, CANVAS_W, GROUND_Y);

      // Glowing cyber sun disc on horizon
      const sunGrad = ctx.createRadialGradient(380, GROUND_Y - 46, 8, 380, GROUND_Y - 46, 62);
      sunGrad.addColorStop(0, 'rgba(253, 224, 71, 0.85)');
      sunGrad.addColorStop(0.45, 'rgba(245, 158, 11, 0.3)');
      sunGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(380, GROUND_Y - 46, 62, 0, Math.PI * 2);
      ctx.fill();

      // Parallax wireframe mountains
      const mScroll = (dist * 0.14) % 160;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.28)';
      ctx.lineWidth = 1.2;
      for (let mx = -mScroll; mx < CANVAS_W + 160; mx += 160) {
        ctx.beginPath();
        ctx.moveTo(mx, GROUND_Y);
        ctx.lineTo(mx + 60, GROUND_Y - 58);
        ctx.lineTo(mx + 120, GROUND_Y - 22);
        ctx.lineTo(mx + 160, GROUND_Y - 44);
        ctx.lineTo(mx + 200, GROUND_Y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      // Parallax clouds
      ctx.fillStyle = 'rgba(186, 230, 253, 0.16)';
      for (let i = 0; i < 4; i++) {
        const cx = ((i * 150 - dist * 0.09) % (CANVAS_W + 80) + CANVAS_W + 80) % (CANVAS_W + 80) - 40;
        const cy = 36 + (i % 2) * 26;
        ctx.beginPath();
        ctx.arc(cx, cy, 12, 0, Math.PI * 2);
        ctx.arc(cx + 12, cy - 4, 15, 0, Math.PI * 2);
        ctx.arc(cx + 25, cy, 11, 0, Math.PI * 2);
        ctx.fill();
      }

      // Cyber circuit ground floor
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, GROUND_Y, CANVAS_W, CANVAS_H - GROUND_Y);

      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y);
      ctx.lineTo(CANVAS_W, GROUND_Y);
      ctx.stroke();

      // Scrolling ground data ticks
      const offset = dist % 80;
      ctx.fillStyle = '#1e293b';
      for (let gx = -offset; gx < CANVAS_W; gx += 80) {
        ctx.fillStyle = '#0d9488';
        ctx.fillRect(gx, GROUND_Y + 9, 18, 3);
        ctx.fillStyle = '#334155';
        ctx.fillRect(gx + 36, GROUND_Y + 19, 10, 2.5);
        ctx.fillRect(gx + 58, GROUND_Y + 12, 6, 2.5);
      }

      if (!sim) return;

      // Collectible Gold Keys
      for (const c of sim.coins) {
        if (!c.collected) {
          drawSecurityKeyToken(ctx, c.x, c.y, 11, now);
        }
      }

      // Vector Malware Cacti & Winged Spam Drones
      for (const o of sim.obstacles) {
        if (o.kind === 'flying-spam') {
          drawSpamDroneSprite(ctx, o.x, o.y, o.w, o.h, now);
        } else {
          drawMalwareCactusSprite(ctx, o.x, o.y, o.w, o.h, now);
        }
      }

      // Vector CyberDino
      const curH = sim.ducking && sim.onGround ? DINO_DUCK_H : DINO_STAND_H;
      const blink = sim.invuln > 0 && Math.floor(sim.invuln * 10) % 2 === 0;
      if (!blink) {
        drawCyberDinoSprite(
          ctx,
          DINO_X,
          sim.dinoY,
          DINO_W,
          curH,
          sim.ducking,
          sim.legPhase,
          sim.onGround
        );
      }

      drawParticlesVfx(ctx, sim.particles);
      drawFloatingTextsVfx(ctx, sim.texts);
    };

    const loop = (now: number) => {
      const dt = Math.min(0.04, (now - last) / 1000);
      last = now;
      step(dt);
      draw(now);
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [config.allowAerial, config.baseSpeed, config.goalMeters, saveBest]);

  const accuracy = Math.max(60, Math.round(((config.maxHearts - hits) / config.maxHearts) * 100));

  if (phase === 'WON') {
    const stats: GameResultStats = {
      stars: computeStars(accuracy, ageGroup),
      accuracy,
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
    <div className="flex-1 min-h-0 w-full flex flex-col p-3 sm:p-5 bg-slate-50 space-y-2.5 overflow-y-auto scrollbar-none">
      <GameHud
        title={copy.title}
        subtitle={copy.subtitle}
        icon={<Sparkles className="w-5 h-5" />}
        accentColor="emerald"
        ageGroup={ageGroup}
        currentStep={Math.min(config.goalMeters, distance)}
        totalSteps={config.goalMeters}
        score={score}
        streak={streak}
        accuracy={accuracy}
      />

      <div className="bg-white border border-slate-200 rounded-2xl px-3.5 py-2 flex items-center justify-between text-xs sm:text-sm font-black shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 text-xs">{copy.labels.shields}:</span>
          {Array.from({ length: config.maxHearts }).map((_, idx) => (
            <Heart
              key={idx}
              className={`w-4 h-4 ${
                idx < hearts ? 'fill-rose-500 text-rose-500' : 'fill-slate-100 text-slate-300'
              }`}
            />
          ))}
        </div>
        <div className="text-emerald-700 tabular-nums">
          {distance}m / {config.goalMeters}m
        </div>
        <div className="flex items-center gap-1 text-amber-700 tabular-nums">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>{bestDistance}m</span>
        </div>
      </div>

      <div className="relative w-full max-w-[480px] mx-auto rounded-3xl overflow-hidden border-2 border-slate-300 bg-slate-900 shadow-lg shrink-0">
        <canvas
          ref={canvasRef}
          onPointerDown={triggerJump}
          style={{ aspectRatio: `${CANVAS_W} / ${CANVAS_H}` }}
          className="w-full h-auto block touch-none cursor-pointer"
        />

        {phase === 'TITLE' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center text-white space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 border-2 border-emerald-200 shadow-lg flex items-center justify-center">
              <Zap className="w-7 h-7 text-white fill-white" />
            </div>
            <h3 className="text-lg font-black">{copy.labels.startTitle}</h3>
            <p className="text-xs sm:text-sm text-sky-100 max-w-sm leading-relaxed">
              {copy.labels.startDesc}
            </p>
            <button
              type="button"
              onClick={startGame}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-black text-sm shadow-lg flex items-center gap-2 cursor-pointer active:scale-95 transition"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{copy.labels.playBtn}</span>
            </button>
          </div>
        )}

        {phase === 'GAME_OVER' && (
          <div className="absolute inset-0 bg-slate-950/88 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center text-white space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border-2 border-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-7 h-7 text-rose-400" />
            </div>
            <h3 className="text-lg font-black text-rose-300">{copy.labels.gameOverTitle}</h3>
            <p className="text-xs sm:text-sm text-slate-200 max-w-xs">{copy.labels.gameOverDesc}</p>
            <button
              type="button"
              onClick={startGame}
              className="px-6 py-2.5 rounded-2xl bg-cyan-500 text-white font-black text-sm flex items-center gap-2 cursor-pointer active:scale-95 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{copy.labels.retryBtn}</span>
            </button>
          </div>
        )}
      </div>

      {/* Large Jump & Duck Controls */}
      <div className="w-full max-w-[480px] mx-auto grid grid-cols-2 gap-3 shrink-0 select-none">
        {config.allowAerial ? (
          <button
            type="button"
            onPointerDown={() => setDuck(true)}
            onPointerUp={() => setDuck(false)}
            onPointerLeave={() => setDuck(false)}
            onPointerCancel={() => setDuck(false)}
            className="h-14 rounded-2xl bg-white border-2 border-slate-200 active:bg-slate-100 text-slate-800 font-black text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer touch-none"
          >
            <ArrowDown className="w-5 h-5" />
            <span>{copy.labels.duck}</span>
          </button>
        ) : (
          <div className="h-14 rounded-2xl bg-slate-100 border border-slate-200 text-slate-500 text-xs font-bold flex items-center justify-center">
            {copy.labels.best}: {bestDistance}m
          </div>
        )}

        <button
          type="button"
          onPointerDown={triggerJump}
          className="h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-600 active:scale-[0.98] text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-md cursor-pointer touch-none"
        >
          <ArrowUp className="w-6 h-6 stroke-[2.75]" />
          <span>{copy.labels.jump}</span>
        </button>
      </div>
    </div>
  );
};
