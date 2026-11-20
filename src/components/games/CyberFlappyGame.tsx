import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUp, Feather, Heart, Play, RotateCcw, ShieldAlert, Sparkles } from 'lucide-react';
import { ChildAgeGroup, GameResultStats } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { GameHud, GameVictorySummary } from './GameShell';
import { computeStars, getAgeTierMeta } from '../../utils/ageDifficulty';
import { playGameSound } from '../../utils/gameAudio';
import {
  drawCyberBirdSprite,
  drawFloatingTextsVfx,
  drawParticlesVfx,
  drawSecurityKeyToken,
  FloatingTextVfx,
  ParticleVfx,
  setupHiDpiCanvas,
} from '../../utils/canvasSprites';

interface CyberFlappyGameProps {
  onComplete: (stats?: GameResultStats) => void;
  ageGroup?: ChildAgeGroup;
}

type Phase = 'TITLE' | 'PLAYING' | 'GAME_OVER' | 'WON';

interface LinkGate {
  x: number;
  gapTop: number;
  gapHeight: number;
  passed: boolean;
  label: string;
  coinCollected: boolean;
}

const CANVAS_W = 420;
const CANVAS_H = 350;
const GROUND_H = 22;
const PIPE_W = 52;
const BIRD_X = 96;
const BIRD_R = 14;

const FAKE_LINKS = [
  'r0blox.ru',
  'bit.ly/win',
  'hack.exe',
  'bank.xyz',
  'free-gems',
  'gift.tk',
];

const SKYLINE_BUILDINGS = [
  { x: 12, w: 36, h: 72 },
  { x: 54, w: 28, h: 105 },
  { x: 90, w: 44, h: 64 },
  { x: 142, w: 34, h: 120 },
  { x: 184, w: 48, h: 86 },
  { x: 240, w: 32, h: 98 },
  { x: 280, w: 42, h: 68 },
  { x: 330, w: 36, h: 112 },
  { x: 374, w: 40, h: 80 },
];

export const CyberFlappyGame: React.FC<CyberFlappyGameProps> = ({
  onComplete,
  ageGroup = '8–10' as ChildAgeGroup,
}) => {
  const { language } = useLanguage();
  const tierMeta = getAgeTierMeta(ageGroup, language);

  const config = useMemo(() => {
    const gapHeight = ageGroup === '13–14' ? 94 : ageGroup === '11–12' ? 110 : 130;
    const speed = ageGroup === '13–14' ? 168 : ageGroup === '11–12' ? 140 : 114;
    const targetGates = ageGroup === '13–14' ? 15 : ageGroup === '11–12' ? 12 : 8;
    const maxHearts = ageGroup === '8–10' ? 4 : 3;
    return { gapHeight, speed, targetGates, maxHearts };
  }, [ageGroup]);

  const copy = useMemo(() => {
    const title =
      language === 'fr'
        ? 'Flappy Pare-feu'
        : language === 'en'
        ? 'Flappy Firewall'
        : 'Flappy Cortafuegos';

    const subtitle =
      language === 'fr'
        ? 'Vole entre les barrières de faux liens et attrape les clés sûres'
        : language === 'en'
        ? 'Fly past fraudulent link barriers & collect safe keys'
        : 'Esquiva enlaces fraudulentos volando y recoge llaves seguras';

    const takeaway =
      language === 'fr'
        ? 'Esquive les liens suspects raccourcis ou mal orthographiés avant de cliquer : chaque obstacle évité protège ton compte.'
        : language === 'en'
        ? 'Steer clear of shortened or misspelled phishing URLs—avoiding suspicious barriers keeps your account safe.'
        : 'Esquiva URLs acortadas o mal escritas antes de hacer clic: cada barrera fraudulenta superada protege tus cuentas.';

    const labels = {
      es: {
        startTitle: 'Vuela sobre los Enlaces Falsos',
        startDesc:
          'Toca la pantalla o presiona Espacio para impulsar al CiberPájaro entre las barreras de phishing sin tocarlas.',
        playBtn: '¡Empezar Vuelo!',
        gameOverTitle: '¡Atrapado por Phishing!',
        gameOverDesc: 'Los enlaces falsos agotaron tus escudos. ¡Vuelve a despegar!',
        retryBtn: 'Reintentar Vuelo',
        shields: 'Escudos',
        gates: 'Enlaces Esquivados',
        flap: 'IMPULSAR (TAP / ESPACIO)',
      },
      fr: {
        startTitle: 'Évite les Liens Frauduleux',
        startDesc:
          'Touche l’écran ou appuie sur Espace pour faire voler CiberOiseau entre les pièges de phishing.',
        playBtn: 'Décoller !',
        gameOverTitle: 'Piégé par le Phishing !',
        gameOverDesc: 'Tes boucliers sont tombés à zéro. Reprends ton envol !',
        retryBtn: 'Réessayer',
        shields: 'Boucliers',
        gates: 'Pièges Évités',
        flap: 'VOLER (TAP / ESPACE)',
      },
      en: {
        startTitle: 'Dodge Fraudulent Links',
        startDesc:
          'Tap the screen or press Space to fly CyberBird safely through phishing link gaps without crashing.',
        playBtn: 'Start Flight!',
        gameOverTitle: 'Caught by Phishing!',
        gameOverDesc: 'Fraudulent barriers drained your shields. Ready to fly again?',
        retryBtn: 'Retry Flight',
        shields: 'Shields',
        gates: 'Links Dodged',
        flap: 'FLAP (TAP / SPACE)',
      },
    }[language];

    return { title, subtitle, takeaway, labels };
  }, [language]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [phase, setPhase] = useState<Phase>('TITLE');
  const [hearts, setHearts] = useState<number>(config.maxHearts);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(1);
  const [gatesPassed, setGatesPassed] = useState<number>(0);
  const [hits, setHits] = useState<number>(0);

  const simRef = useRef<{
    birdY: number;
    birdVy: number;
    gates: LinkGate[];
    particles: ParticleVfx[];
    texts: FloatingTextVfx[];
    scrollX: number;
    hearts: number;
    score: number;
    streak: number;
    maxStreak: number;
    passed: number;
    hits: number;
    invuln: number;
    phase: Phase;
  } | null>(null);

  const createGate = useCallback(
    (x: number, idx: number): LinkGate => {
      const margin = 44;
      const maxTop = CANVAS_H - GROUND_H - config.gapHeight - margin;
      const gapTop = margin + Math.floor(Math.random() * Math.max(20, maxTop - margin));
      return {
        x,
        gapTop,
        gapHeight: config.gapHeight,
        passed: false,
        label: FAKE_LINKS[idx % FAKE_LINKS.length],
        coinCollected: false,
      };
    },
    [config.gapHeight]
  );

  const spawnParticles = (
    list: ParticleVfx[],
    x: number,
    y: number,
    color: string,
    count = 8
  ) => {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const spd = 45 + Math.random() * 90;
      list.push({
        x,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        life: 0.45,
        maxLife: 0.45,
        size: 2.2 + Math.random() * 2.2,
        color,
      });
    }
  };

  const startGame = () => {
    playGameSound('tap');
    simRef.current = {
      birdY: (CANVAS_H - GROUND_H) / 2 - 14,
      birdVy: -120,
      gates: [createGate(380, 0), createGate(600, 1), createGate(820, 2)],
      particles: [],
      texts: [],
      scrollX: 0,
      hearts: config.maxHearts,
      score: 0,
      streak: 0,
      maxStreak: 1,
      passed: 0,
      hits: 0,
      invuln: 0,
      phase: 'PLAYING',
    };
    setHearts(config.maxHearts);
    setScore(0);
    setStreak(0);
    setMaxStreak(1);
    setGatesPassed(0);
    setHits(0);
    setPhase('PLAYING');
  };

  const flap = useCallback(() => {
    const sim = simRef.current;
    if (!sim || sim.phase !== 'PLAYING') return;
    sim.birdVy = -268;
    for (let i = 0; i < 4; i++) {
      sim.particles.push({
        x: BIRD_X - 10,
        y: sim.birdY + 6,
        vx: -40 - Math.random() * 45,
        vy: 30 + Math.random() * 40,
        life: 0.35,
        maxLife: 0.35,
        size: 2.6,
        color: i % 2 === 0 ? '#bae6fd' : '#fde047',
      });
    }
    playGameSound('tap');
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (simRef.current?.phase !== 'PLAYING') return;
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        flap();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [flap]);

  useEffect(() => {
    let rafId = 0;
    let last = performance.now();
    let gateCounter = 3;

    const step = (dt: number) => {
      const sim = simRef.current;
      if (!sim) return;

      // Update VFX
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

      sim.scrollX += config.speed * dt;
      sim.invuln = Math.max(0, sim.invuln - dt);
      sim.birdVy = Math.min(420, sim.birdVy + 760 * dt);
      sim.birdY += sim.birdVy * dt;

      if (sim.birdY < BIRD_R + 4) {
        sim.birdY = BIRD_R + 4;
        sim.birdVy = 0;
      }

      const hitFloor = sim.birdY > CANVAS_H - GROUND_H - BIRD_R;
      if (hitFloor) {
        sim.birdY = (CANVAS_H - GROUND_H) / 2 - 16;
        sim.birdVy = -180;
        if (sim.invuln <= 0) {
          sim.hearts -= 1;
          sim.hits += 1;
          sim.streak = 0;
          sim.invuln = 1.4;
          spawnParticles(sim.particles, BIRD_X, CANVAS_H - GROUND_H - 10, '#f43f5e', 10);
          setHearts(sim.hearts);
          setHits(sim.hits);
          setStreak(0);
          playGameSound('wrong');
          if (sim.hearts <= 0) {
            sim.phase = 'GAME_OVER';
            setPhase('GAME_OVER');
            return;
          }
        }
      }

      for (const g of sim.gates) {
        g.x -= config.speed * dt;

        // Rotating security key inside gap
        const gapCenterY = g.gapTop + g.gapHeight / 2;
        if (
          !g.coinCollected &&
          Math.abs(BIRD_X - (g.x + PIPE_W / 2)) < 24 &&
          Math.abs(sim.birdY - gapCenterY) < 28
        ) {
          g.coinCollected = true;
          sim.score += 40;
          spawnParticles(sim.particles, g.x + PIPE_W / 2, gapCenterY, '#facc15', 9);
          sim.texts.push({
            x: g.x + PIPE_W / 2,
            y: gapCenterY - 12,
            vy: -36,
            life: 0.75,
            text: '+40',
            color: '#fef08a',
          });
          setScore(sim.score);
          playGameSound('tap');
        }

        // Barrier collision
        const inPipeX = BIRD_X + BIRD_R - 4 > g.x && BIRD_X - BIRD_R + 4 < g.x + PIPE_W;
        const hitBarrier =
          inPipeX &&
          (sim.birdY - BIRD_R + 2 < g.gapTop || sim.birdY + BIRD_R - 2 > g.gapTop + g.gapHeight);
        if (hitBarrier && sim.invuln <= 0) {
          sim.hearts -= 1;
          sim.hits += 1;
          sim.streak = 0;
          sim.invuln = 1.4;
          spawnParticles(sim.particles, BIRD_X + 6, sim.birdY, '#ef4444', 12);
          sim.texts.push({
            x: BIRD_X,
            y: sim.birdY - 18,
            vy: -32,
            life: 0.75,
            text: 'PHISH!',
            color: '#fda4af',
          });
          setHearts(sim.hearts);
          setHits(sim.hits);
          setStreak(0);
          playGameSound('wrong');
          if (sim.hearts <= 0) {
            sim.phase = 'GAME_OVER';
            setPhase('GAME_OVER');
            return;
          }
        }

        if (!g.passed && g.x + PIPE_W < BIRD_X) {
          g.passed = true;
          sim.passed += 1;
          sim.streak += 1;
          sim.maxStreak = Math.max(sim.maxStreak, sim.streak);
          sim.score += 80;
          spawnParticles(sim.particles, BIRD_X, sim.birdY - 16, '#34d399', 6);
          sim.texts.push({
            x: BIRD_X + 10,
            y: sim.birdY - 22,
            vy: -34,
            life: 0.75,
            text: '+80',
            color: '#6ee7b7',
          });
          setGatesPassed(sim.passed);
          setStreak(sim.streak);
          setMaxStreak(sim.maxStreak);
          setScore(sim.score);
          playGameSound('correct');

          if (sim.passed >= config.targetGates) {
            sim.score += sim.hearts * 50;
            setScore(sim.score);
            playGameSound('win');
            sim.phase = 'WON';
            setPhase('WON');
            return;
          }
        }
      }

      if (sim.gates[0] && sim.gates[0].x < -70) {
        const lastX = sim.gates[sim.gates.length - 1].x;
        sim.gates.shift();
        sim.gates.push(createGate(lastX + 220, gateCounter++));
      }
    };

    const drawPipeBody = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      w: number,
      h: number,
      collarAtBottom: boolean,
      urlLabel: string
    ) => {
      if (h <= 0) return;

      // Cylindrical crimson metallic pipe gradient
      const pipeGrad = ctx.createLinearGradient(x, 0, x + w, 0);
      pipeGrad.addColorStop(0, '#7f1d1d');
      pipeGrad.addColorStop(0.22, '#ef4444');
      pipeGrad.addColorStop(0.38, '#fca5a5');
      pipeGrad.addColorStop(0.68, '#dc2626');
      pipeGrad.addColorStop(1, '#450a0a');

      ctx.fillStyle = pipeGrad;
      ctx.fillRect(x, y, w, h);

      ctx.strokeStyle = '#450a0a';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, w, h);

      // End collar cap
      const collarH = 18;
      const collarY = collarAtBottom ? y + h - collarH : y;
      const collarGrad = ctx.createLinearGradient(x - 4, 0, x + w + 4, 0);
      collarGrad.addColorStop(0, '#991b1b');
      collarGrad.addColorStop(0.25, '#f87171');
      collarGrad.addColorStop(0.45, '#fecaca');
      collarGrad.addColorStop(0.75, '#dc2626');
      collarGrad.addColorStop(1, '#7f1d1d');

      ctx.fillStyle = collarGrad;
      ctx.beginPath();
      ctx.roundRect(x - 4, collarY, w + 8, collarH, 5);
      ctx.fill();
      ctx.strokeStyle = '#450a0a';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Rivets on collar
      ctx.fillStyle = '#fecaca';
      ctx.beginPath();
      ctx.arc(x + 2, collarY + collarH / 2, 1.8, 0, Math.PI * 2);
      ctx.arc(x + w - 2, collarY + collarH / 2, 1.8, 0, Math.PI * 2);
      ctx.fill();

      // URL warning plate on upper pipe
      if (collarAtBottom && h >= 44) {
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.roundRect(x + 3, collarY - 19, w - 6, 15, 4);
        ctx.fill();
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#fde047';
        ctx.font = '900 8px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(urlLabel.slice(0, 9), x + w / 2, collarY - 11.5);
      }
    };

    const draw = (now: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = setupHiDpiCanvas(canvas, CANVAS_W, CANVAS_H);
      if (!ctx) return;

      const sim = simRef.current;
      const scroll = sim ? sim.scrollX : now * 0.03;

      // Sky gradient
      const sky = ctx.createLinearGradient(0, 0, 0, CANVAS_H - GROUND_H);
      sky.addColorStop(0, '#0c4a6e');
      sky.addColorStop(0.48, '#0284c7');
      sky.addColorStop(1, '#bae6fd');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Sun radial halo
      const sunGrad = ctx.createRadialGradient(345, 58, 6, 345, 58, 72);
      sunGrad.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
      sunGrad.addColorStop(0.35, 'rgba(253, 224, 71, 0.35)');
      sunGrad.addColorStop(1, 'rgba(253, 224, 71, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(345, 58, 72, 0, Math.PI * 2);
      ctx.fill();

      // Parallax clouds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.68)';
      for (let i = 0; i < 4; i++) {
        const cx = ((i * 135 - scroll * 0.16) % (CANVAS_W + 90) + CANVAS_W + 90) % (CANVAS_W + 90) - 45;
        const cy = 54 + (i % 2) * 32;
        ctx.beginPath();
        ctx.arc(cx, cy, 16, 0, Math.PI * 2);
        ctx.arc(cx + 15, cy - 5, 20, 0, Math.PI * 2);
        ctx.arc(cx + 32, cy, 15, 0, Math.PI * 2);
        ctx.fill();
      }

      // Parallax cyber skyline
      const skyScroll = (scroll * 0.25) % 420;
      for (let rep = 0; rep < 2; rep++) {
        for (const b of SKYLINE_BUILDINGS) {
          const bx = b.x - skyScroll + rep * 420;
          const by = CANVAS_H - GROUND_H - b.h;
          ctx.fillStyle = 'rgba(12, 74, 110, 0.42)';
          ctx.fillRect(bx, by, b.w, b.h);
          ctx.fillStyle = 'rgba(56, 189, 248, 0.28)';
          for (let wy = by + 8; wy < CANVAS_H - GROUND_H - 12; wy += 14) {
            for (let wx = bx + 6; wx < bx + b.w - 8; wx += 10) {
              ctx.fillRect(wx, wy, 4, 6);
            }
          }
        }
      }

      // Phishing barriers & tokens
      if (sim) {
        for (const g of sim.gates) {
          drawPipeBody(ctx, g.x, 0, PIPE_W, g.gapTop, true, g.label);
          const bottomY = g.gapTop + g.gapHeight;
          const bottomH = CANVAS_H - GROUND_H - bottomY;
          drawPipeBody(ctx, g.x, bottomY, PIPE_W, bottomH, false, g.label);

          if (!g.coinCollected) {
            const floatY = g.gapTop + g.gapHeight / 2 + Math.sin(now / 220 + g.x) * 4;
            drawSecurityKeyToken(ctx, g.x + PIPE_W / 2, floatY, 11, now);
          }
        }
      }

      // Crisp striped cyber turf ground
      const groundY = CANVAS_H - GROUND_H;
      ctx.fillStyle = '#065f46';
      ctx.fillRect(0, groundY, CANVAS_W, GROUND_H);

      ctx.fillStyle = '#10b981';
      ctx.fillRect(0, groundY, CANVAS_W, 7);

      const stripeOffset = scroll % 28;
      ctx.fillStyle = '#34d399';
      for (let gx = -stripeOffset; gx < CANVAS_W + 28; gx += 28) {
        ctx.beginPath();
        ctx.moveTo(gx, groundY + 7);
        ctx.lineTo(gx + 14, groundY + 7);
        ctx.lineTo(gx + 8, groundY);
        ctx.lineTo(gx - 6, groundY);
        ctx.closePath();
        ctx.fill();
      }
      ctx.strokeStyle = '#022c22';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(CANVAS_W, groundY);
      ctx.stroke();

      // CyberBird & VFX
      if (sim) {
        const blink = sim.invuln > 0 && Math.floor(sim.invuln * 10) % 2 === 0;
        if (!blink) {
          drawCyberBirdSprite(ctx, BIRD_X, sim.birdY, BIRD_R, sim.birdVy, now);
        }
        drawParticlesVfx(ctx, sim.particles);
        drawFloatingTextsVfx(ctx, sim.texts);
      }
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
  }, [config.speed, config.targetGates, createGate]);

  const accuracy = Math.max(
    55,
    Math.min(100, Math.round((gatesPassed / Math.max(1, gatesPassed + hits)) * 100))
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
        accentColor="amber"
        ageGroup={ageGroup}
        currentStep={gatesPassed}
        totalSteps={config.targetGates}
        score={score}
        streak={streak}
        accuracy={gatesPassed > 0 ? accuracy : 100}
        timeLeftSeconds={tierMeta.timeLimitSeconds}
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
        <div className="text-amber-700 tabular-nums">
          {copy.labels.gates}: {gatesPassed}/{config.targetGates}
        </div>
      </div>

      <div className="relative w-full max-w-[420px] mx-auto rounded-3xl overflow-hidden border-2 border-slate-300 bg-sky-900 shadow-lg shrink-0">
        <canvas
          ref={canvasRef}
          onPointerDown={flap}
          style={{ aspectRatio: `${CANVAS_W} / ${CANVAS_H}` }}
          className="w-full h-auto block touch-none cursor-pointer"
        />

        {phase === 'TITLE' && (
          <div className="absolute inset-0 bg-slate-950/82 backdrop-blur-xs flex flex-col items-center justify-center p-5 text-center text-white space-y-3.5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-amber-200 shadow-lg flex items-center justify-center">
              <Feather className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black">{copy.labels.startTitle}</h3>
              <p className="text-xs sm:text-sm text-sky-100 leading-relaxed max-w-xs">
                {copy.labels.startDesc}
              </p>
            </div>
            <button
              type="button"
              onClick={startGame}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-sm shadow-lg flex items-center gap-2 cursor-pointer active:scale-95 transition"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>{copy.labels.playBtn}</span>
            </button>
          </div>
        )}

        {phase === 'GAME_OVER' && (
          <div className="absolute inset-0 bg-slate-950/88 backdrop-blur-xs flex flex-col items-center justify-center p-5 text-center text-white space-y-3.5">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border-2 border-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-8 h-8 text-rose-400" />
            </div>
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

      <button
        type="button"
        onPointerDown={flap}
        className="w-full max-w-[420px] mx-auto h-14 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 active:scale-[0.98] text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-md cursor-pointer touch-none shrink-0"
      >
        <ArrowUp className="w-6 h-6 stroke-[2.75]" />
        <span>{copy.labels.flap}</span>
      </button>
    </div>
  );
};
