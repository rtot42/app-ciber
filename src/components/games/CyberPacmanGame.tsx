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
  Sparkles,
} from 'lucide-react';
import { ChildAgeGroup, GameResultStats } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { GameHud, GameVictorySummary } from './GameShell';
import { computeStars, getAgeTierMeta } from '../../utils/ageDifficulty';
import { playGameSound } from '../../utils/gameAudio';
import {
  drawFloatingTextsVfx,
  drawGhostVirusSprite,
  drawParticlesVfx,
  FloatingTextVfx,
  ParticleVfx,
  setupHiDpiCanvas,
} from '../../utils/canvasSprites';

interface CyberPacmanGameProps {
  onComplete: (stats?: GameResultStats) => void;
  ageGroup?: ChildAgeGroup;
}

type Dir = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Phase = 'TITLE' | 'PLAYING' | 'GAME_OVER' | 'WON';

interface Ghost {
  id: string;
  x: number;
  y: number;
  dir: Dir;
  color: string;
  eatenTimer: number;
}

const MAZE_TEMPLATE: number[][] = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 0, 0, 0, 1, 0, 1, 0, 0, 0, 2, 1],
  [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 1, 3, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1, 3, 3, 3, 1, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
  [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const COLS = 13;
const ROWS = 11;
const CELL = 30;
const CANVAS_W = COLS * CELL;
const CANVAS_H = ROWS * CELL;

export const CyberPacmanGame: React.FC<CyberPacmanGameProps> = ({
  onComplete,
  ageGroup = '8–10' as ChildAgeGroup,
}) => {
  const { language } = useLanguage();
  const tierMeta = getAgeTierMeta(ageGroup, language);

  const config = useMemo(() => {
    const ghostCount = ageGroup === '13–14' ? 4 : ageGroup === '11–12' ? 3 : 2;
    const tickMs = ageGroup === '13–14' ? 155 : ageGroup === '11–12' ? 185 : 215;
    const powerDurationSec = ageGroup === '13–14' ? 4.5 : ageGroup === '11–12' ? 6 : 8;
    const maxHearts = ageGroup === '8–10' ? 4 : 3;
    return { ghostCount, tickMs, powerDurationSec, maxHearts };
  }, [ageGroup]);

  const copy = useMemo(() => {
    const title =
      language === 'fr'
        ? 'CiberPac : Labyrinthe Sûr'
        : language === 'en'
        ? 'CyberPac: Maze Shield'
        : 'CiberPac: Laberinto Seguro';

    const subtitle =
      language === 'fr'
        ? 'Collecte tous les orbes de sécurité et neutralise les virus'
        : language === 'en'
        ? 'Collect all security orbs & quarantine patrolling viruses'
        : 'Recoge todos los escudos del laberinto y evita los virus';

    const takeaway =
      language === 'fr'
        ? 'Un antivirus à jour transforme les menaces actives en cibles neutralisables et sécurise chaque recoin de ton réseau.'
        : language === 'en'
        ? 'Updated antivirus shields neutralize active malware threats while keeping every node of your network clean.'
        : 'Un antivirus actualizado debilita y pone en cuarentena a los virus mientras proteges cada nodo de tu red.';

    const labels = {
      es: {
        startTitle: 'Laberinto Cortafuegos 2D',
        startDesc:
          'Recoge todos los puntos dorados del laberinto. Toma los núcleos antivirus cian de las esquinas para volver azules a los virus y capturarlos.',
        playBtn: '¡Entrar al Laberinto!',
        gameOverTitle: '¡Virus en el Laberinto!',
        gameOverDesc: 'Los virus agotaron tus escudos, pero puedes reiniciar la ruta.',
        retryBtn: 'Reintentar Laberinto',
        shields: 'Escudos',
        orbs: 'Orbes',
        powerOn: 'ANTIVIRUS ACTIVO',
      },
      fr: {
        startTitle: 'Labyrinthe Pare-feu 2D',
        startDesc:
          'Ramasse tous les orbes dorés du labyrinthe. Prends les noyaux antivirus cyan dans les coins pour capturer les virus.',
        playBtn: 'Entrer dans le Labyrinthe !',
        gameOverTitle: 'Virus dans le Réseau !',
        gameOverDesc: 'Tes boucliers sont épuisés. Relance le parcours sécurisé !',
        retryBtn: 'Réessayer',
        shields: 'Boucliers',
        orbs: 'Orbes',
        powerOn: 'ANTIVIRUS ACTIF',
      },
      en: {
        startTitle: '2D Firewall Maze',
        startDesc:
          'Collect every gold orb in the maze. Grab cyan corner Antivirus Cores to stun viruses and quarantine them!',
        playBtn: 'Enter Maze!',
        gameOverTitle: 'Maze Breached!',
        gameOverDesc: 'Viruses drained your shields, but your clean backup is ready.',
        retryBtn: 'Retry Maze',
        shields: 'Shields',
        orbs: 'Orbs',
        powerOn: 'ANTIVIRUS ACTIVE',
      },
    }[language];

    return { title, subtitle, takeaway, labels };
  }, [language]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const swipeRef = useRef<{ x: number; y: number } | null>(null);

  const totalOrbsInit = useMemo(
    () => MAZE_TEMPLATE.flat().filter((c) => c === 0 || c === 2).length,
    []
  );

  const [phase, setPhase] = useState<Phase>('TITLE');
  const [hearts, setHearts] = useState<number>(config.maxHearts);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(1);
  const [orbsCollected, setOrbsCollected] = useState<number>(0);
  const [hitsTaken, setHitsTaken] = useState<number>(0);
  const [powerLeft, setPowerLeft] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(tierMeta.timeLimitSeconds);

  const simRef = useRef<{
    grid: number[][];
    px: number;
    py: number;
    dir: Dir;
    nextDir: Dir;
    ghosts: Ghost[];
    particles: ParticleVfx[];
    texts: FloatingTextVfx[];
    hearts: number;
    score: number;
    streak: number;
    maxStreak: number;
    collected: number;
    hits: number;
    powerTimer: number;
    invulnTimer: number;
    phase: Phase;
    timeLeft: number | null;
  } | null>(null);

  const initSim = useCallback(() => {
    const grid = MAZE_TEMPLATE.map((row) => [...row]);
    const ghostColors = ['#ef4444', '#a855f7', '#ec4899', '#f97316'];
    const spawns: Array<{ x: number; y: number; dir: Dir }> = [
      { x: 6, y: 5, dir: 'LEFT' },
      { x: 5, y: 5, dir: 'UP' },
      { x: 7, y: 5, dir: 'RIGHT' },
      { x: 6, y: 4, dir: 'UP' },
    ];
    const ghosts: Ghost[] = Array.from({ length: config.ghostCount }, (_, idx) => ({
      id: `g-${idx}`,
      x: spawns[idx].x,
      y: spawns[idx].y,
      dir: spawns[idx].dir,
      color: ghostColors[idx % ghostColors.length],
      eatenTimer: 0,
    }));

    simRef.current = {
      grid,
      px: 6,
      py: 7,
      dir: 'LEFT',
      nextDir: 'LEFT',
      ghosts,
      particles: [],
      texts: [],
      hearts: config.maxHearts,
      score: 0,
      streak: 0,
      maxStreak: 1,
      collected: 0,
      hits: 0,
      powerTimer: 0,
      invulnTimer: 0,
      phase: 'PLAYING',
      timeLeft: tierMeta.timeLimitSeconds,
    };
  }, [config.ghostCount, config.maxHearts, tierMeta.timeLimitSeconds]);

  const startGame = () => {
    playGameSound('tap');
    initSim();
    setHearts(config.maxHearts);
    setScore(0);
    setStreak(0);
    setMaxStreak(1);
    setOrbsCollected(0);
    setHitsTaken(0);
    setPowerLeft(0);
    setTimeLeft(tierMeta.timeLimitSeconds);
    setPhase('PLAYING');
  };

  const setDirection = useCallback((d: Dir) => {
    if (!simRef.current) return;
    simRef.current.nextDir = d;
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (simRef.current?.phase !== 'PLAYING') return;
      if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        setDirection('UP');
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        e.preventDefault();
        setDirection('DOWN');
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault();
        setDirection('LEFT');
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault();
        setDirection('RIGHT');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setDirection]);

  useEffect(() => {
    if (phase !== 'PLAYING' || tierMeta.timeLimitSeconds === null) return;
    const tId = window.setInterval(() => {
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
    return () => window.clearInterval(tId);
  }, [phase, tierMeta.timeLimitSeconds]);

  // Simulation step tick
  useEffect(() => {
    if (phase !== 'PLAYING') return;
    const canMove = (grid: number[][], x: number, y: number) =>
      y >= 0 && y < ROWS && x >= 0 && x < COLS && grid[y][x] !== 1;
    const stepPos = (x: number, y: number, d: Dir) =>
      d === 'UP'
        ? { x, y: y - 1 }
        : d === 'DOWN'
        ? { x, y: y + 1 }
        : d === 'LEFT'
        ? { x: x - 1, y }
        : { x: x + 1, y };

    const spawnBurst = (cx: number, cy: number, color: string) => {
      const sim = simRef.current;
      if (!sim) return;
      for (let i = 0; i < 10; i++) {
        const a = (Math.PI * 2 * i) / 10;
        sim.particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(a) * (45 + Math.random() * 65),
          vy: Math.sin(a) * (45 + Math.random() * 65),
          life: 0.45,
          maxLife: 0.45,
          size: 3,
          color,
        });
      }
    };

    const id = window.setInterval(() => {
      const sim = simRef.current;
      if (!sim || sim.phase !== 'PLAYING') return;

      const dtSec = config.tickMs / 1000;
      sim.powerTimer = Math.max(0, sim.powerTimer - dtSec);
      sim.invulnTimer = Math.max(0, sim.invulnTimer - dtSec);
      setPowerLeft(Math.ceil(sim.powerTimer));

      const tryNext = stepPos(sim.px, sim.py, sim.nextDir);
      if (canMove(sim.grid, tryNext.x, tryNext.y)) {
        sim.dir = sim.nextDir;
        sim.px = tryNext.x;
        sim.py = tryNext.y;
      } else {
        const tryCur = stepPos(sim.px, sim.py, sim.dir);
        if (canMove(sim.grid, tryCur.x, tryCur.y)) {
          sim.px = tryCur.x;
          sim.py = tryCur.y;
        }
      }

      const tile = sim.grid[sim.py][sim.px];
      if (tile === 0 || tile === 2) {
        sim.grid[sim.py][sim.px] = 3;
        sim.collected += 1;
        sim.streak += 1;
        sim.maxStreak = Math.max(sim.maxStreak, sim.streak);
        setOrbsCollected(sim.collected);
        setStreak(sim.streak);
        setMaxStreak(sim.maxStreak);

        const cx = sim.px * CELL + CELL / 2;
        const cy = sim.py * CELL + CELL / 2;
        if (tile === 2) {
          sim.powerTimer = config.powerDurationSec;
          sim.score += 75;
          setPowerLeft(Math.ceil(sim.powerTimer));
          spawnBurst(cx, cy, '#22d3ee');
          sim.texts.push({ x: cx, y: cy - 8, vy: -32, life: 0.75, text: '+75 2FA', color: '#67e8f9' });
          playGameSound('combo');
        } else {
          sim.score += 15;
          playGameSound('tap');
        }
        setScore(sim.score);

        if (sim.collected >= totalOrbsInit) {
          sim.score += sim.hearts * 60;
          setScore(sim.score);
          playGameSound('win');
          sim.phase = 'WON';
          setPhase('WON');
          return;
        }
      }

      const allDirs: Dir[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
      const opp: Record<Dir, Dir> = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };

      for (const g of sim.ghosts) {
        if (g.eatenTimer > 0) {
          g.eatenTimer = Math.max(0, g.eatenTimer - dtSec);
          if (g.eatenTimer === 0) {
            g.x = 6;
            g.y = 5;
          }
          continue;
        }

        const validDirs = allDirs.filter((d) => {
          const np = stepPos(g.x, g.y, d);
          return canMove(sim.grid, np.x, np.y);
        });
        const nonReverse = validDirs.filter((d) => d !== opp[g.dir]);
        const choices = nonReverse.length > 0 ? nonReverse : validDirs;

        if (choices.length > 0) {
          if (ageGroup === '13–14' && sim.powerTimer <= 0 && Math.random() < 0.65) {
            choices.sort((a, b) => {
              const pa = stepPos(g.x, g.y, a);
              const pb = stepPos(g.x, g.y, b);
              const da = Math.abs(pa.x - sim.px) + Math.abs(pa.y - sim.py);
              const db = Math.abs(pb.x - sim.px) + Math.abs(pb.y - sim.py);
              return da - db;
            });
            g.dir = choices[0];
          } else {
            g.dir = choices[Math.floor(Math.random() * choices.length)];
          }
          const np = stepPos(g.x, g.y, g.dir);
          g.x = np.x;
          g.y = np.y;
        }

        if (g.x === sim.px && g.y === sim.py) {
          if (sim.powerTimer > 0) {
            g.eatenTimer = 3.5;
            sim.score += 150;
            sim.streak += 2;
            sim.maxStreak = Math.max(sim.maxStreak, sim.streak);
            const gx = g.x * CELL + CELL / 2;
            const gy = g.y * CELL + CELL / 2;
            spawnBurst(gx, gy, '#60a5fa');
            sim.texts.push({ x: gx, y: gy - 8, vy: -35, life: 0.75, text: '+150', color: '#93c5fd' });
            setScore(sim.score);
            setStreak(sim.streak);
            setMaxStreak(sim.maxStreak);
            playGameSound('correct');
          } else if (sim.invulnTimer <= 0) {
            sim.hearts -= 1;
            sim.hits += 1;
            sim.streak = 0;
            sim.invulnTimer = 2.0;
            spawnBurst(sim.px * CELL + CELL / 2, sim.py * CELL + CELL / 2, '#f43f5e');
            sim.px = 6;
            sim.py = 7;
            setHearts(sim.hearts);
            setHitsTaken(sim.hits);
            setStreak(0);
            playGameSound('wrong');
            if (sim.hearts <= 0) {
              sim.phase = 'GAME_OVER';
              setPhase('GAME_OVER');
              return;
            }
          }
        }
      }
    }, config.tickMs);

    return () => window.clearInterval(id);
  }, [ageGroup, config.powerDurationSec, config.tickMs, phase, totalOrbsInit]);

  // Smooth 60fps HiDPI Renderer
  useEffect(() => {
    let rafId = 0;
    let last = performance.now();

    const render = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = setupHiDpiCanvas(canvas, CANVAS_W, CANVAS_H);
        if (ctx) {
          const sim = simRef.current;

          ctx.fillStyle = '#060b16';
          ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

          const grid = sim ? sim.grid : MAZE_TEMPLATE;
          const orbPulse = 1 + Math.sin(now / 150) * 0.14;

          for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
              const val = grid[r][c];
              const px = c * CELL;
              const py = r * CELL;

              if (val === 1) {
                const wallGrad = ctx.createLinearGradient(px, py, px + CELL, py + CELL);
                wallGrad.addColorStop(0, '#1e3a8a');
                wallGrad.addColorStop(1, '#172554');
                ctx.fillStyle = wallGrad;
                ctx.beginPath();
                ctx.roundRect(px + 1.5, py + 1.5, CELL - 3, CELL - 3, 6);
                ctx.fill();
                ctx.strokeStyle = '#38bdf8';
                ctx.lineWidth = 1.6;
                ctx.stroke();
              } else if (val === 0) {
                ctx.fillStyle = '#fbbf24';
                ctx.beginPath();
                ctx.arc(px + CELL / 2, py + CELL / 2, 3.4, 0, Math.PI * 2);
                ctx.fill();
              } else if (val === 2) {
                const cx = px + CELL / 2;
                const cy = py + CELL / 2;
                const glow = ctx.createRadialGradient(cx, cy, 2, cx, cy, 13 * orbPulse);
                glow.addColorStop(0, 'rgba(34, 211, 238, 0.85)');
                glow.addColorStop(1, 'rgba(34, 211, 238, 0)');
                ctx.fillStyle = glow;
                ctx.beginPath();
                ctx.arc(cx, cy, 13 * orbPulse, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#22d3ee';
                ctx.beginPath();
                ctx.arc(cx, cy, 7.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#cffafe';
                ctx.lineWidth = 1.6;
                ctx.stroke();
              }
            }
          }

          if (sim) {
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

            const blink = sim.invulnTimer > 0 && Math.floor(sim.invulnTimer * 8) % 2 === 0;
            if (!blink) {
              const cx = sim.px * CELL + CELL / 2;
              const cy = sim.py * CELL + CELL / 2;
              const mouth = 0.14 + Math.abs(Math.sin(now / 95)) * 0.34;
              let rot = 0;
              if (sim.dir === 'DOWN') rot = Math.PI / 2;
              if (sim.dir === 'LEFT') rot = Math.PI;
              if (sim.dir === 'UP') rot = -Math.PI / 2;

              const pacGrad = ctx.createRadialGradient(cx - 3, cy - 3, 2, cx, cy, CELL * 0.44);
              if (sim.powerTimer > 0) {
                pacGrad.addColorStop(0, '#cffafe');
                pacGrad.addColorStop(1, '#06b6d4');
              } else {
                pacGrad.addColorStop(0, '#fef08a');
                pacGrad.addColorStop(1, '#eab308');
              }
              ctx.fillStyle = pacGrad;
              ctx.beginPath();
              ctx.moveTo(cx, cy);
              ctx.arc(cx, cy, CELL * 0.42, rot + mouth, rot + Math.PI * 2 - mouth);
              ctx.closePath();
              ctx.fill();
            }

            for (const g of sim.ghosts) {
              if (g.eatenTimer > 0) continue;
              drawGhostVirusSprite(
                ctx,
                g.x * CELL + CELL / 2,
                g.y * CELL + CELL / 2,
                CELL * 0.44,
                g.color,
                sim.powerTimer > 0,
                now,
                g.dir
              );
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
  }, []);

  const accuracy = Math.max(
    55,
    Math.min(100, Math.round((orbsCollected / Math.max(1, orbsCollected + hitsTaken * 6)) * 100))
  );

  if (phase === 'WON') {
    const stats: GameResultStats = {
      stars: computeStars(accuracy, ageGroup),
      accuracy,
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
    <div className="flex-1 min-h-0 w-full flex flex-col p-2.5 sm:p-3.5 bg-slate-50 gap-2 overflow-y-auto overflow-x-hidden scrollbar-none pb-4">
      <GameHud
        title={copy.title}
        subtitle={copy.subtitle}
        icon={<Sparkles className="w-5 h-5" />}
        accentColor="indigo"
        ageGroup={ageGroup}
        currentStep={orbsCollected}
        totalSteps={totalOrbsInit}
        score={score}
        streak={streak}
        accuracy={orbsCollected > 0 ? accuracy : 100}
        timeLeftSeconds={timeLeft}
      />

      <div className="bg-white border border-slate-200 rounded-2xl px-3.5 py-2 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-bold shrink-0">
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

        {powerLeft > 0 && (
          <div className="flex items-center gap-1 text-cyan-700 text-xs font-semibold tabular-nums">
            <Shield className="w-4 h-4 text-cyan-600" />
            <span>
              {copy.labels.powerOn} ({powerLeft}s)
            </span>
          </div>
        )}

        <div className="tabular-nums text-amber-700">
          {copy.labels.orbs}: {orbsCollected}/{totalOrbsInit}
        </div>
      </div>

      <div
        className="flex-1 min-h-[210px] w-full flex items-center justify-center"
        style={{ containerType: 'size' }}
      >
        <div
          style={{
            width: `min(100cqw, calc(100cqh * ${CANVAS_W} / ${CANVAS_H}))`,
            height: `min(100cqh, calc(100cqw * ${CANVAS_H} / ${CANVAS_W}))`,
          }}
          className="relative rounded-3xl overflow-hidden border-2 border-slate-300 bg-slate-950 shadow-lg"
        >
          <canvas
            ref={canvasRef}
            onPointerDown={(e) => {
              swipeRef.current = { x: e.clientX, y: e.clientY };
            }}
            onPointerUp={(e) => {
              if (!swipeRef.current) return;
              const dx = e.clientX - swipeRef.current.x;
              const dy = e.clientY - swipeRef.current.y;
              swipeRef.current = null;
              if (Math.max(Math.abs(dx), Math.abs(dy)) < 16) return;
              if (Math.abs(dx) > Math.abs(dy)) setDirection(dx > 0 ? 'RIGHT' : 'LEFT');
              else setDirection(dy > 0 ? 'DOWN' : 'UP');
            }}
            className="w-full h-full block touch-none"
          />

        {phase === 'TITLE' && (
          <div className="absolute inset-0 bg-slate-950/88 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center text-white space-y-3">
            <div className="text-3xl">👻</div>
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold">{copy.labels.startTitle}</h3>
              <p className="text-xs sm:text-sm text-sky-100 leading-relaxed max-w-xs">
                {copy.labels.startDesc}
              </p>
            </div>
            <button
              type="button"
              onClick={startGame}
              className="px-5 py-2.5 min-h-[44px] rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold text-sm shadow-lg flex items-center gap-2 cursor-pointer active:scale-95 transition"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{copy.labels.playBtn}</span>
            </button>
          </div>
        )}

        {phase === 'GAME_OVER' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center text-white space-y-3">
            <div className="text-3xl">👾💥</div>
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-rose-300">{copy.labels.gameOverTitle}</h3>
              <p className="text-xs sm:text-sm text-slate-200 max-w-xs">{copy.labels.gameOverDesc}</p>
            </div>
            <button
              type="button"
              onClick={startGame}
              className="px-5 py-2.5 min-h-[44px] rounded-2xl bg-cyan-500 text-white font-bold text-sm flex items-center gap-2 cursor-pointer active:scale-95 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{copy.labels.retryBtn}</span>
            </button>
          </div>
        )}
        </div>
      </div>

      <div className="w-full max-w-xs mx-auto grid grid-cols-3 gap-2 shrink-0 select-none">
        <div />
        <button
          type="button"
          onPointerDown={() => setDirection('UP')}
          aria-label="Up"
          className="h-12 rounded-2xl bg-white border-2 border-slate-200 active:bg-cyan-50 active:border-cyan-400 text-slate-800 flex items-center justify-center shadow-sm cursor-pointer touch-none"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
        <div />
        <button
          type="button"
          onPointerDown={() => setDirection('LEFT')}
          aria-label="Left"
          className="h-12 rounded-2xl bg-white border-2 border-slate-200 active:bg-cyan-50 active:border-cyan-400 text-slate-800 flex items-center justify-center shadow-sm cursor-pointer touch-none"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <button
          type="button"
          onPointerDown={() => setDirection('DOWN')}
          aria-label="Down"
          className="h-12 rounded-2xl bg-white border-2 border-slate-200 active:bg-cyan-50 active:border-cyan-400 text-slate-800 flex items-center justify-center shadow-sm cursor-pointer touch-none"
        >
          <ArrowDown className="w-6 h-6" />
        </button>
        <button
          type="button"
          onPointerDown={() => setDirection('RIGHT')}
          aria-label="Right"
          className="h-12 rounded-2xl bg-white border-2 border-slate-200 active:bg-cyan-50 active:border-cyan-400 text-slate-800 flex items-center justify-center shadow-sm cursor-pointer touch-none"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
