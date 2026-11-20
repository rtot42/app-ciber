import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Crosshair,
  Heart,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { ChildAgeGroup, GameResultStats } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { GameHud, GameVictorySummary } from './GameShell';
import { computeStars, getAgeTierMeta } from '../../utils/ageDifficulty';
import { playGameSound } from '../../utils/gameAudio';
import {
  drawFloatingTextsVfx,
  drawLaserShipSprite,
  drawParticlesVfx,
  drawSpaceInvaderSprite,
  FloatingTextVfx,
  ParticleVfx,
  setupHiDpiCanvas,
} from '../../utils/canvasSprites';

interface CyberInvadersGameProps {
  onComplete: (stats?: GameResultStats) => void;
  ageGroup?: ChildAgeGroup;
}

type Phase = 'TITLE' | 'PLAYING' | 'GAME_OVER' | 'WON';

interface Invader {
  id: string;
  row: number;
  x: number;
  y: number;
  w: number;
  h: number;
  alive: boolean;
}

interface Bullet {
  x: number;
  y: number;
  vy: number;
  fromPlayer: boolean;
}

interface Bunker {
  x: number;
  y: number;
  w: number;
  h: number;
  hp: number;
}

const CANVAS_W = 420;
const CANVAS_H = 340;
const SHIP_W = 38;
const SHIP_H = 24;

export const CyberInvadersGame: React.FC<CyberInvadersGameProps> = ({
  onComplete,
  ageGroup = '8–10' as ChildAgeGroup,
}) => {
  const { language } = useLanguage();
  const tierMeta = getAgeTierMeta(ageGroup, language);

  const config = useMemo(() => {
    const totalWaves = ageGroup === '13–14' ? 3 : 2;
    const rows = ageGroup === '8–10' ? 3 : 4;
    const cols = ageGroup === '13–14' ? 7 : ageGroup === '11–12' ? 6 : 5;
    const enemySpeed = ageGroup === '13–14' ? 78 : ageGroup === '11–12' ? 56 : 40;
    const maxHearts = ageGroup === '8–10' ? 4 : 3;
    const fireRateMs = ageGroup === '8–10' ? 240 : 290;
    const enemyShootChance = ageGroup === '13–14' ? 0.025 : ageGroup === '11–12' ? 0.015 : 0.008;
    return { totalWaves, rows, cols, enemySpeed, maxHearts, fireRateMs, enemyShootChance };
  }, [ageGroup]);

  const copy = useMemo(() => {
    const title =
      language === 'fr'
        ? 'Envahisseurs Malware'
        : language === 'en'
        ? 'Malware Space Invaders'
        : 'Invasores Malware';

    const subtitle =
      language === 'fr'
        ? 'Abats les vagues de virus avant qu’elles ne percent les boucliers'
        : language === 'en'
        ? 'Blast waves of viruses before they breach your firewall'
        : 'Dispara contra oleadas de virus y amenazas digitales';

    const takeaway =
      language === 'fr'
        ? 'Un pare-feu actif intercepte les virus et logiciels espions entrants avant qu’ils n’atteignent ton système.'
        : language === 'en'
        ? 'An active firewall intercepts incoming spyware, worms, and trojans before they reach your core device.'
        : 'Un cortafuegos activo intercepta gusanos, troyanos y espías antes de que lleguen a tu dispositivo.';

    const labels = {
      es: {
        startTitle: 'Defensa Espacial Cortafuegos',
        startDesc:
          'Mueve tu nave antivirus, protégete tras los búnkeres y dispara láseres contra las oleadas de phishing y troyanos.',
        playBtn: '¡Despegar Nave!',
        gameOverTitle: '¡Cortafuegos Roto!',
        gameOverDesc: 'Los virus superaron tu defensa. ¡Recarga los escudos e inténtalo!',
        retryBtn: 'Reintentar Misión',
        shields: 'Escudos',
        wave: 'Oleada',
        fire: 'DISPARAR',
      },
      fr: {
        startTitle: 'Défense Spatiale Pare-feu',
        startDesc:
          'Pilote ton vaisseau antivirus, utilise les bunkers et détruis les vagues de virus avant l’impact.',
        playBtn: 'Décoller !',
        gameOverTitle: 'Pare-feu Percé !',
        gameOverDesc: 'Les virus ont franchi la ligne. Relance le bouclier !',
        retryBtn: 'Réessayer',
        shields: 'Boucliers',
        wave: 'Vague',
        fire: 'TIRER',
      },
      en: {
        startTitle: 'Firewall Space Defense',
        startDesc:
          'Pilot your antivirus starship, take cover behind firewall bunkers, and blast incoming malware waves.',
        playBtn: 'Launch Defense!',
        gameOverTitle: 'Firewall Breached!',
        gameOverDesc: 'Malware broke past your defenses. Recharge shields and retry!',
        retryBtn: 'Retry Defense',
        shields: 'Shields',
        wave: 'Wave',
        fire: 'FIRE',
      },
    }[language];

    return { title, subtitle, takeaway, labels };
  }, [language]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [phase, setPhase] = useState<Phase>('TITLE');
  const [hearts, setHearts] = useState<number>(config.maxHearts);
  const [wave, setWave] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(1);
  const [shotsFired, setShotsFired] = useState<number>(0);
  const [shotsHit, setShotsHit] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(tierMeta.timeLimitSeconds);

  const simRef = useRef<{
    shipX: number;
    keys: { left: boolean; right: boolean; fire: boolean };
    invaders: Invader[];
    invaderDir: 1 | -1;
    bullets: Bullet[];
    bunkers: Bunker[];
    particles: ParticleVfx[];
    texts: FloatingTextVfx[];
    hearts: number;
    wave: number;
    score: number;
    streak: number;
    maxStreak: number;
    shotsFired: number;
    shotsHit: number;
    lastFireAt: number;
    phase: Phase;
    timeLeft: number | null;
    secondAcc: number;
  } | null>(null);

  const spawnWaveInvaders = useCallback(
    (waveNum: number): Invader[] => {
      const list: Invader[] = [];
      const startX = 34;
      const gapX = Math.floor((CANVAS_W - 68) / config.cols);
      const startY = 30 + (waveNum - 1) * 6;
      for (let r = 0; r < config.rows; r++) {
        for (let c = 0; c < config.cols; c++) {
          list.push({
            id: `w${waveNum}-${r}-${c}`,
            row: r,
            x: startX + c * gapX,
            y: startY + r * 34,
            w: 28,
            h: 24,
            alive: true,
          });
        }
      }
      return list;
    },
    [config.cols, config.rows]
  );

  const startGame = () => {
    playGameSound('tap');
    simRef.current = {
      shipX: CANVAS_W / 2 - SHIP_W / 2,
      keys: { left: false, right: false, fire: false },
      invaders: spawnWaveInvaders(1),
      invaderDir: 1,
      bullets: [],
      bunkers: [
        { x: 56, y: 254, w: 62, h: 18, hp: 5 },
        { x: 179, y: 254, w: 62, h: 18, hp: 5 },
        { x: 302, y: 254, w: 62, h: 18, hp: 5 },
      ],
      particles: [],
      texts: [],
      hearts: config.maxHearts,
      wave: 1,
      score: 0,
      streak: 0,
      maxStreak: 1,
      shotsFired: 0,
      shotsHit: 0,
      lastFireAt: 0,
      phase: 'PLAYING',
      timeLeft: tierMeta.timeLimitSeconds,
      secondAcc: 0,
    };
    setHearts(config.maxHearts);
    setWave(1);
    setScore(0);
    setStreak(0);
    setMaxStreak(1);
    setShotsFired(0);
    setShotsHit(0);
    setTimeLeft(tierMeta.timeLimitSeconds);
    setPhase('PLAYING');
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const sim = simRef.current;
      if (!sim || sim.phase !== 'PLAYING') return;
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') sim.keys.left = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') sim.keys.right = true;
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        sim.keys.fire = true;
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const sim = simRef.current;
      if (!sim) return;
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') sim.keys.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') sim.keys.right = false;
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') sim.keys.fire = false;
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
    let last = performance.now();

    const spawnBurst = (x: number, y: number, color: string) => {
      const sim = simRef.current;
      if (!sim) return;
      for (let i = 0; i < 10; i++) {
        const a = (Math.PI * 2 * i) / 10;
        sim.particles.push({
          x,
          y,
          vx: Math.cos(a) * (55 + Math.random() * 80),
          vy: Math.sin(a) * (55 + Math.random() * 80),
          life: 0.42,
          maxLife: 0.42,
          size: 3,
          color,
        });
      }
    };

    const step = (dt: number, now: number) => {
      const sim = simRef.current;
      if (!sim || sim.phase !== 'PLAYING') return;

      if (sim.timeLeft !== null) {
        sim.secondAcc += dt;
        if (sim.secondAcc >= 1) {
          sim.secondAcc -= 1;
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

      if (sim.keys.left && !sim.keys.right) sim.shipX -= 228 * dt;
      if (sim.keys.right && !sim.keys.left) sim.shipX += 228 * dt;
      sim.shipX = Math.max(10, Math.min(CANVAS_W - SHIP_W - 10, sim.shipX));

      if (sim.keys.fire && now - sim.lastFireAt >= config.fireRateMs) {
        sim.lastFireAt = now;
        sim.shotsFired += 1;
        setShotsFired(sim.shotsFired);
        sim.bullets.push({
          x: sim.shipX + SHIP_W / 2,
          y: CANVAS_H - 42,
          vy: -360,
          fromPlayer: true,
        });
        playGameSound('tap');
      }

      const speedMult = 1 + (sim.wave - 1) * 0.25;
      let hitEdge = false;
      for (const inv of sim.invaders) {
        if (!inv.alive) continue;
        inv.x += sim.invaderDir * config.enemySpeed * speedMult * dt;
        if (inv.x <= 10 || inv.x + inv.w >= CANVAS_W - 10) hitEdge = true;
      }
      if (hitEdge) {
        sim.invaderDir = (sim.invaderDir * -1) as 1 | -1;
        for (const inv of sim.invaders) {
          if (!inv.alive) continue;
          inv.y += 14;
          if (inv.y + inv.h >= 285) {
            playGameSound('wrong');
            sim.phase = 'GAME_OVER';
            setPhase('GAME_OVER');
            return;
          }
        }
      }

      const aliveInvaders = sim.invaders.filter((i) => i.alive);
      if (aliveInvaders.length > 0 && Math.random() < config.enemyShootChance) {
        const shooter = aliveInvaders[Math.floor(Math.random() * aliveInvaders.length)];
        sim.bullets.push({
          x: shooter.x + shooter.w / 2,
          y: shooter.y + shooter.h,
          vy: 185 + sim.wave * 20,
          fromPlayer: false,
        });
      }

      const nextBullets: Bullet[] = [];
      for (const b of sim.bullets) {
        b.y += b.vy * dt;
        if (b.y < 0 || b.y > CANVAS_H) continue;

        let consumed = false;
        for (const bk of sim.bunkers) {
          if (bk.hp > 0 && b.x >= bk.x && b.x <= bk.x + bk.w && b.y >= bk.y && b.y <= bk.y + bk.h) {
            bk.hp -= 1;
            consumed = true;
            spawnBurst(b.x, b.y, '#10b981');
            break;
          }
        }
        if (consumed) continue;

        if (b.fromPlayer) {
          for (const inv of sim.invaders) {
            if (inv.alive && b.x >= inv.x && b.x <= inv.x + inv.w && b.y >= inv.y && b.y <= inv.y + inv.h) {
              inv.alive = false;
              consumed = true;
              sim.shotsHit += 1;
              sim.streak += 1;
              sim.maxStreak = Math.max(sim.maxStreak, sim.streak);
              const pts = 50 + sim.streak * 5;
              sim.score += pts;
              spawnBurst(inv.x + inv.w / 2, inv.y + inv.h / 2, '#f472b6');
              sim.texts.push({ x: inv.x + inv.w / 2, y: inv.y, vy: -30, life: 0.65, text: `+${pts}`, color: '#67e8f9' });
              setShotsHit(sim.shotsHit);
              setStreak(sim.streak);
              setMaxStreak(sim.maxStreak);
              setScore(sim.score);
              playGameSound('correct');
              break;
            }
          }
        } else {
          const shipY = CANVAS_H - 36;
          if (b.x >= sim.shipX && b.x <= sim.shipX + SHIP_W && b.y >= shipY && b.y <= shipY + SHIP_H) {
            consumed = true;
            sim.hearts -= 1;
            sim.streak = 0;
            spawnBurst(sim.shipX + SHIP_W / 2, shipY + SHIP_H / 2, '#f43f5e');
            setHearts(sim.hearts);
            setStreak(0);
            playGameSound('wrong');
            if (sim.hearts <= 0) {
              sim.phase = 'GAME_OVER';
              setPhase('GAME_OVER');
              return;
            }
          }
        }

        if (!consumed) nextBullets.push(b);
      }
      sim.bullets = nextBullets;

      sim.particles = sim.particles
        .map((p) => ({ ...p, x: p.x + p.vx * dt, y: p.y + p.vy * dt, life: p.life - dt }))
        .filter((p) => p.life > 0);
      sim.texts = sim.texts
        .map((t) => ({ ...t, y: t.y + t.vy * dt, life: t.life - dt }))
        .filter((t) => t.life > 0);

      if (sim.invaders.every((i) => !i.alive)) {
        if (sim.wave < config.totalWaves) {
          sim.wave += 1;
          sim.invaders = spawnWaveInvaders(sim.wave);
          sim.bullets = [];
          setWave(sim.wave);
          playGameSound('combo');
        } else {
          sim.score += sim.hearts * 60;
          setScore(sim.score);
          playGameSound('win');
          sim.phase = 'WON';
          setPhase('WON');
        }
      }
    };

    const draw = (now: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = setupHiDpiCanvas(canvas, CANVAS_W, CANVAS_H);
      if (!ctx) return;

      const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
      grad.addColorStop(0, '#020617');
      grad.addColorStop(0.6, '#0f172a');
      grad.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Animated twinkling starfield
      for (let i = 0; i < 36; i++) {
        const sy = ((i * 47 + now * 0.018 * (1 + (i % 3) * 0.4)) % (CANVAS_H - 40));
        ctx.fillStyle = i % 3 === 0 ? 'rgba(103, 232, 249, 0.7)' : 'rgba(226, 232, 240, 0.5)';
        ctx.fillRect((i * 73) % CANVAS_W, sy, i % 4 === 0 ? 2.5 : 1.5, i % 4 === 0 ? 2.5 : 1.5);
      }

      const sim = simRef.current;
      if (!sim) return;

      // Beveled Firewall Bunkers
      for (const bk of sim.bunkers) {
        if (bk.hp <= 0) continue;
        const bGrad = ctx.createLinearGradient(bk.x, bk.y, bk.x, bk.y + bk.h);
        if (bk.hp >= 4) {
          bGrad.addColorStop(0, '#34d399');
          bGrad.addColorStop(1, '#047857');
        } else if (bk.hp >= 2) {
          bGrad.addColorStop(0, '#fbbf24');
          bGrad.addColorStop(1, '#b45309');
        } else {
          bGrad.addColorStop(0, '#f87171');
          bGrad.addColorStop(1, '#991b1b');
        }
        ctx.fillStyle = bGrad;
        ctx.beginPath();
        ctx.roundRect(bk.x, bk.y, bk.w, bk.h, [7, 7, 2, 2]);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Vector Malware Invaders
      for (const inv of sim.invaders) {
        if (inv.alive) {
          drawSpaceInvaderSprite(ctx, inv.x, inv.y, inv.w, inv.h, inv.row, now);
        }
      }

      // Cyber Starfighter
      drawLaserShipSprite(ctx, sim.shipX, CANVAS_H - 36, SHIP_W, SHIP_H, now);

      // Glowing plasma bolts
      for (const b of sim.bullets) {
        ctx.save();
        ctx.fillStyle = b.fromPlayer ? '#22d3ee' : '#fb7185';
        ctx.shadowColor = b.fromPlayer ? '#06b6d4' : '#f43f5e';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.roundRect(b.x - 2.5, b.y - 7, 5, 14, 2.5);
        ctx.fill();
        ctx.restore();
      }

      drawParticlesVfx(ctx, sim.particles);
      drawFloatingTextsVfx(ctx, sim.texts);
    };

    const loop = (now: number) => {
      const dt = Math.min(0.04, (now - last) / 1000);
      last = now;
      step(dt, now);
      draw(now);
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [config.enemyShootChance, config.enemySpeed, config.fireRateMs, config.totalWaves, spawnWaveInvaders]);

  const setKey = (k: 'left' | 'right' | 'fire', v: boolean) => {
    if (simRef.current) simRef.current.keys[k] = v;
  };

  const accuracy =
    shotsFired > 0 ? Math.min(100, Math.round((shotsHit / shotsFired) * 100)) : 100;

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
        accentColor="cyan"
        ageGroup={ageGroup}
        currentStep={wave}
        totalSteps={config.totalWaves}
        score={score}
        streak={streak}
        accuracy={accuracy}
        timeLeftSeconds={timeLeft}
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
        <div className="text-cyan-700 tabular-nums">
          {copy.labels.wave}: {wave}/{config.totalWaves}
        </div>
      </div>

      <div className="relative w-full max-w-[420px] mx-auto rounded-3xl overflow-hidden border-2 border-slate-300 bg-slate-950 shadow-lg shrink-0">
        <canvas
          ref={canvasRef}
          style={{ aspectRatio: `${CANVAS_W} / ${CANVAS_H}` }}
          className="w-full h-auto block"
        />

        {phase === 'TITLE' && (
          <div className="absolute inset-0 bg-slate-950/88 backdrop-blur-xs flex flex-col items-center justify-center p-5 text-center text-white space-y-3.5">
            <div className="text-4xl">🚀</div>
            <div className="space-y-1">
              <h3 className="text-lg font-black">{copy.labels.startTitle}</h3>
              <p className="text-xs sm:text-sm text-sky-100 leading-relaxed max-w-xs">
                {copy.labels.startDesc}
              </p>
            </div>
            <button
              type="button"
              onClick={startGame}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-sm shadow-lg flex items-center gap-2 cursor-pointer active:scale-95 transition"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>{copy.labels.playBtn}</span>
            </button>
          </div>
        )}

        {phase === 'GAME_OVER' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xs flex flex-col items-center justify-center p-5 text-center text-white space-y-3.5">
            <div className="text-4xl">🚀💥</div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-rose-300">{copy.labels.gameOverTitle}</h3>
              <p className="text-xs sm:text-sm text-slate-200 max-w-xs">{copy.labels.gameOverDesc}</p>
            </div>
            <button
              type="button"
              onClick={startGame}
              className="px-6 py-3 rounded-2xl bg-cyan-500 text-white font-black text-sm flex items-center gap-2 cursor-pointer active:scale-95 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{copy.labels.retryBtn}</span>
            </button>
          </div>
        )}
      </div>

      <div className="w-full max-w-[420px] mx-auto flex items-center justify-between gap-3 shrink-0 select-none">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onPointerDown={() => setKey('left', true)}
            onPointerUp={() => setKey('left', false)}
            onPointerLeave={() => setKey('left', false)}
            onPointerCancel={() => setKey('left', false)}
            aria-label="Move left"
            className="w-16 h-14 rounded-2xl bg-white border-2 border-slate-200 active:bg-cyan-50 active:border-cyan-400 text-slate-800 flex items-center justify-center shadow-sm cursor-pointer touch-none"
          >
            <ArrowLeft className="w-7 h-7" />
          </button>
          <button
            type="button"
            onPointerDown={() => setKey('right', true)}
            onPointerUp={() => setKey('right', false)}
            onPointerLeave={() => setKey('right', false)}
            onPointerCancel={() => setKey('right', false)}
            aria-label="Move right"
            className="w-16 h-14 rounded-2xl bg-white border-2 border-slate-200 active:bg-cyan-50 active:border-cyan-400 text-slate-800 flex items-center justify-center shadow-sm cursor-pointer touch-none"
          >
            <ArrowRight className="w-7 h-7" />
          </button>
        </div>

        <button
          type="button"
          onPointerDown={() => setKey('fire', true)}
          onPointerUp={() => setKey('fire', false)}
          onPointerLeave={() => setKey('fire', false)}
          onPointerCancel={() => setKey('fire', false)}
          className="px-6 h-14 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 active:scale-95 text-white font-black text-sm flex items-center gap-2 shadow-md cursor-pointer touch-none"
        >
          <Crosshair className="w-5 h-5" />
          <span>{copy.labels.fire}</span>
        </button>
      </div>
    </div>
  );
};
