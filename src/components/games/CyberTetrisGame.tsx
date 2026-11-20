import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ChevronsDown,
  Layers,
  Play,
  RotateCcw,
  RotateCw,
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

interface CyberTetrisGameProps {
  onComplete: (stats?: GameResultStats) => void;
  ageGroup?: ChildAgeGroup;
}

type Phase = 'TITLE' | 'PLAYING' | 'GAME_OVER' | 'WON';

interface PieceShape {
  matrix: number[][];
  color: string;
  hi: string;
  lo: string;
  label: string;
}

const COLS = 10;
const ROWS = 16;
const CELL = 26;
const CANVAS_W = COLS * CELL;
const CANVAS_H = ROWS * CELL;

const PIECES: PieceShape[] = [
  { matrix: [[1, 1, 1, 1]], color: '#06b6d4', hi: '#67e8f9', lo: '#0e7490', label: 'HTTPS' },
  { matrix: [[1, 1], [1, 1]], color: '#10b981', hi: '#6ee7b7', lo: '#047857', label: '2FA' },
  { matrix: [[0, 1, 0], [1, 1, 1]], color: '#8b5cf6', hi: '#c4b5fd', lo: '#5b21b6', label: 'PATCH' },
  { matrix: [[1, 0, 0], [1, 1, 1]], color: '#f59e0b', hi: '#fde68a', lo: '#b45309', label: 'BACKUP' },
  { matrix: [[0, 0, 1], [1, 1, 1]], color: '#3b82f6', hi: '#93c5fd', lo: '#1d4ed8', label: 'VPN' },
  { matrix: [[0, 1, 1], [1, 1, 0]], color: '#ec4899', hi: '#f9a8d4', lo: '#9d174d', label: 'AUDIT' },
  { matrix: [[1, 1, 0], [0, 1, 1]], color: '#ef4444', hi: '#fca5a5', lo: '#991b1b', label: 'FILTER' },
];

const STONE_SHADE = { color: '#64748b', hi: '#94a3b8', lo: '#334155' };

const getShadeForColor = (color: string) => {
  const found = PIECES.find((p) => p.color === color);
  return found ? { color: found.color, hi: found.hi, lo: found.lo } : STONE_SHADE;
};

const drawJewelCell = (
  ctx: CanvasRenderingContext2D,
  col: number,
  row: number,
  color: string
) => {
  const shade = getShadeForColor(color);
  const x = col * CELL + 1.5;
  const y = row * CELL + 1.5;
  const s = CELL - 3;

  ctx.save();
  // Base rounded body
  const bodyGrad = ctx.createLinearGradient(x, y, x + s, y + s);
  bodyGrad.addColorStop(0, shade.hi);
  bodyGrad.addColorStop(0.5, shade.color);
  bodyGrad.addColorStop(1, shade.lo);

  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.roundRect(x, y, s, s, 5);
  ctx.fill();

  // Top-left bright bevel highlight
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(x + 3, y + s - 4);
  ctx.lineTo(x + 3, y + 3);
  ctx.lineTo(x + s - 4, y + 3);
  ctx.stroke();

  // Bottom-right dark bevel shadow
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.45)';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(x + s - 3, y + 4);
  ctx.lineTo(x + s - 3, y + s - 3);
  ctx.lineTo(x + 4, y + s - 3);
  ctx.stroke();

  // Inner faceted jewel core
  ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.beginPath();
  ctx.roundRect(x + 6, y + 6, s - 12, s - 12, 3);
  ctx.fill();

  ctx.restore();
};

export const CyberTetrisGame: React.FC<CyberTetrisGameProps> = ({
  onComplete,
  ageGroup = '8–10' as ChildAgeGroup,
}) => {
  const { language } = useLanguage();
  const tierMeta = getAgeTierMeta(ageGroup, language);

  const config = useMemo(() => {
    const dropMs = ageGroup === '13–14' ? 350 : ageGroup === '11–12' ? 500 : 680;
    const targetLines = ageGroup === '13–14' ? 8 : ageGroup === '11–12' ? 6 : 4;
    const preSeedRows = ageGroup === '13–14' ? 2 : 0;
    return { dropMs, targetLines, preSeedRows };
  }, [ageGroup]);

  const copy = useMemo(() => {
    const title =
      language === 'fr'
        ? 'Tetris Pare-feu'
        : language === 'en'
        ? 'Firewall Tetris'
        : 'Tetris Cortafuegos';

    const subtitle =
      language === 'fr'
        ? 'Aligne les blocs de sécurité pour fermer chaque ligne de défense'
        : language === 'en'
        ? 'Align security blocks to seal full firewall defense rows'
        : 'Ordena bloques de seguridad para completar líneas y superar niveles';

    const takeaway =
      language === 'fr'
        ? 'Assembler 2FA, mises à jour, HTTPS et sauvegardes sans laisser de brèches construit une défense numérique sans faille.'
        : language === 'en'
        ? 'Combining 2FA, patches, HTTPS, and backups without leaving gaps creates a solid firewall defense.'
        : 'Combinar 2FA, parches, HTTPS y copias de seguridad sin dejar huecos construye una defensa sólida.';

    const labels = {
      es: {
        startTitle: 'Bloques de Seguridad 2D',
        startDesc:
          'Gira y encaja las piezas de protección (HTTPS, 2FA, Parche, Backup) para completar líneas horizontales sin dejar huecos.',
        playBtn: '¡Construir Defensa!',
        gameOverTitle: '¡Torre Saturada!',
        gameOverDesc: 'Los bloques llegaron arriba. ¡Organiza una nueva barrera!',
        retryBtn: 'Reintentar Tablero',
        lines: 'Líneas',
        next: 'Siguiente',
        drop: 'CAER',
      },
      fr: {
        startTitle: 'Blocs de Sécurité 2D',
        startDesc:
          'Pivote et place les modules (HTTPS, 2FA, Patch, Backup) pour compléter des lignes horizontales complètes.',
        playBtn: 'Construire !',
        gameOverTitle: 'Pile Saturée !',
        gameOverDesc: 'Les blocs ont atteint le sommet. Relance la grille !',
        retryBtn: 'Réessayer',
        lines: 'Lignes',
        next: 'Suivant',
        drop: 'POSER',
      },
      en: {
        startTitle: '2D Security Blocks',
        startDesc:
          'Rotate and fit defense modules (HTTPS, 2FA, Patch, Backup) to clear complete horizontal rows without gaps.',
        playBtn: 'Build Firewall!',
        gameOverTitle: 'Stack Overflowed!',
        gameOverDesc: 'Blocks reached the top. Clear the grid and try again!',
        retryBtn: 'Retry Board',
        lines: 'Lines',
        next: 'Next',
        drop: 'DROP',
      },
    }[language];

    return { title, subtitle, takeaway, labels };
  }, [language]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [phase, setPhase] = useState<Phase>('TITLE');
  const [linesCleared, setLinesCleared] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(1);
  const [nextPiece, setNextPiece] = useState<PieceShape>(PIECES[0]);
  const [timeLeft, setTimeLeft] = useState<number | null>(tierMeta.timeLimitSeconds);

  const simRef = useRef<{
    board: (string | null)[][];
    piece: { matrix: number[][]; color: string; label: string; x: number; y: number };
    nextPiece: PieceShape;
    flashRows: Array<{ y: number; life: number }>;
    particles: ParticleVfx[];
    texts: FloatingTextVfx[];
    lines: number;
    score: number;
    streak: number;
    maxStreak: number;
    piecesLocked: number;
    phase: Phase;
    timeLeft: number | null;
  } | null>(null);

  const randomPiece = (): PieceShape => PIECES[Math.floor(Math.random() * PIECES.length)];

  const collides = (
    board: (string | null)[][],
    matrix: number[][],
    px: number,
    py: number
  ): boolean => {
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        if (!matrix[r][c]) continue;
        const bx = px + c;
        const by = py + r;
        if (bx < 0 || bx >= COLS || by >= ROWS) return true;
        if (by >= 0 && board[by][bx] !== null) return true;
      }
    }
    return false;
  };

  const rotateMatrix = (m: number[][]): number[][] =>
    m[0].map((_, c) => m.map((row) => row[c]).reverse());

  const spawnPiece = useCallback(
    (shape: PieceShape) => ({
      matrix: shape.matrix.map((r) => [...r]),
      color: shape.color,
      label: shape.label,
      x: Math.floor((COLS - shape.matrix[0].length) / 2),
      y: 0,
    }),
    []
  );

  // 60fps decoupled render & VFX loop
  useEffect(() => {
    let rafId = 0;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(0.04, (now - last) / 1000);
      last = now;

      const sim = simRef.current;
      if (sim) {
        for (const fr of sim.flashRows) fr.life -= dt;
        sim.flashRows = sim.flashRows.filter((fr) => fr.life > 0);

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
      }

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = setupHiDpiCanvas(canvas, CANVAS_W, CANVAS_H);
        if (ctx) {
          // Deep cyber board gradient
          const bgGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
          bgGrad.addColorStop(0, '#020617');
          bgGrad.addColorStop(1, '#0f172a');
          ctx.fillStyle = bgGrad;
          ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

          // Top radial ambient glow
          const glow = ctx.createRadialGradient(
            CANVAS_W / 2,
            0,
            10,
            CANVAS_W / 2,
            0,
            CANVAS_W * 0.85
          );
          glow.addColorStop(0, 'rgba(56, 189, 248, 0.14)');
          glow.addColorStop(1, 'rgba(56, 189, 248, 0)');
          ctx.fillStyle = glow;
          ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

          // Tech hairline grid
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.09)';
          ctx.lineWidth = 1;
          for (let r = 0; r <= ROWS; r++) {
            ctx.beginPath();
            ctx.moveTo(0, r * CELL);
            ctx.lineTo(CANVAS_W, r * CELL);
            ctx.stroke();
          }
          for (let c = 0; c <= COLS; c++) {
            ctx.beginPath();
            ctx.moveTo(c * CELL, 0);
            ctx.lineTo(c * CELL, CANVAS_H);
            ctx.stroke();
          }

          if (sim) {
            // Locked jewel cells
            for (let r = 0; r < ROWS; r++) {
              for (let c = 0; c < COLS; c++) {
                const col = sim.board[r][c];
                if (col) drawJewelCell(ctx, c, r, col);
              }
            }

            // Crisp dashed ghost drop outline
            let ghostY = sim.piece.y;
            while (!collides(sim.board, sim.piece.matrix, sim.piece.x, ghostY + 1)) {
              ghostY += 1;
            }
            ctx.save();
            for (let r = 0; r < sim.piece.matrix.length; r++) {
              for (let c = 0; c < sim.piece.matrix[r].length; c++) {
                if (!sim.piece.matrix[r][c]) continue;
                const gx = (sim.piece.x + c) * CELL + 2.5;
                const gy = (ghostY + r) * CELL + 2.5;
                const gs = CELL - 5;
                ctx.fillStyle = `${sim.piece.color}22`;
                ctx.beginPath();
                ctx.roundRect(gx, gy, gs, gs, 4);
                ctx.fill();
                ctx.strokeStyle = `${sim.piece.color}aa`;
                ctx.lineWidth = 1.5;
                ctx.setLineDash([4, 3]);
                ctx.stroke();
              }
            }
            ctx.restore();

            // Active jewel piece
            for (let r = 0; r < sim.piece.matrix.length; r++) {
              for (let c = 0; c < sim.piece.matrix[r].length; c++) {
                if (sim.piece.matrix[r][c]) {
                  drawJewelCell(ctx, sim.piece.x + c, sim.piece.y + r, sim.piece.color);
                }
              }
            }

            // Row clear laser sweep flash
            for (const fr of sim.flashRows) {
              const alpha = Math.max(0, Math.min(1, fr.life / 0.25));
              ctx.save();
              ctx.globalAlpha = alpha * 0.85;
              const fGrad = ctx.createLinearGradient(0, fr.y, CANVAS_W, fr.y);
              fGrad.addColorStop(0, '#22d3ee');
              fGrad.addColorStop(0.5, '#ffffff');
              fGrad.addColorStop(1, '#a855f7');
              ctx.fillStyle = fGrad;
              ctx.fillRect(0, fr.y, CANVAS_W, CELL);
              ctx.restore();
            }

            drawParticlesVfx(ctx, sim.particles);
            drawFloatingTextsVfx(ctx, sim.texts);
          }
        }
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const lockAndAdvance = useCallback(() => {
    const sim = simRef.current;
    if (!sim || sim.phase !== 'PLAYING') return;

    sim.piecesLocked += 1;
    for (let r = 0; r < sim.piece.matrix.length; r++) {
      for (let c = 0; c < sim.piece.matrix[r].length; c++) {
        if (!sim.piece.matrix[r][c]) continue;
        const by = sim.piece.y + r;
        const bx = sim.piece.x + c;
        if (by >= 0 && by < ROWS && bx >= 0 && bx < COLS) {
          sim.board[by][bx] = sim.piece.color;
        }
      }
    }

    // Clear full rows + trigger laser flash & particle burst
    let clearedNow = 0;
    const clearedRowIndices: number[] = [];
    const remaining: (string | null)[][] = [];
    for (let r = 0; r < ROWS; r++) {
      if (sim.board[r].every((cell) => cell !== null)) {
        clearedNow += 1;
        clearedRowIndices.push(r);
      } else {
        remaining.push(sim.board[r]);
      }
    }
    while (remaining.length < ROWS) {
      remaining.unshift(Array(COLS).fill(null));
    }
    sim.board = remaining;

    if (clearedNow > 0) {
      for (const rIdx of clearedRowIndices) {
        const py = rIdx * CELL;
        sim.flashRows.push({ y: py, life: 0.25 });
        for (let i = 0; i < 14; i++) {
          sim.particles.push({
            x: Math.random() * CANVAS_W,
            y: py + CELL / 2,
            vx: (Math.random() - 0.5) * 140,
            vy: -30 - Math.random() * 80,
            life: 0.55,
            maxLife: 0.55,
            size: 2.8,
            color: i % 2 === 0 ? '#38bdf8' : '#fef08a',
          });
        }
      }

      const pts = clearedNow * 140 + (clearedNow > 1 ? 80 : 0);
      sim.lines += clearedNow;
      sim.streak += clearedNow;
      sim.maxStreak = Math.max(sim.maxStreak, sim.streak);
      sim.score += pts;

      const midRow = clearedRowIndices[0] ?? 8;
      sim.texts.push({
        x: CANVAS_W / 2,
        y: midRow * CELL,
        vy: -35,
        life: 0.85,
        text: clearedNow > 1 ? `COMBO +${pts}` : `+${pts}`,
        color: '#67e8f9',
      });

      setLinesCleared(sim.lines);
      setStreak(sim.streak);
      setMaxStreak(sim.maxStreak);
      setScore(sim.score);
      playGameSound(clearedNow >= 2 ? 'combo' : 'correct');

      if (sim.lines >= config.targetLines) {
        playGameSound('win');
        sim.phase = 'WON';
        setPhase('WON');
        return;
      }
    } else {
      sim.score += 15;
      setScore(sim.score);
      playGameSound('tap');
    }

    const spawned = spawnPiece(sim.nextPiece);
    const upcoming = randomPiece();
    sim.piece = spawned;
    sim.nextPiece = upcoming;
    setNextPiece(upcoming);

    if (collides(sim.board, spawned.matrix, spawned.x, spawned.y)) {
      playGameSound('wrong');
      sim.phase = 'GAME_OVER';
      setPhase('GAME_OVER');
    }
  }, [config.targetLines, spawnPiece]);

  const moveHorizontal = useCallback((dx: -1 | 1) => {
    const sim = simRef.current;
    if (!sim || sim.phase !== 'PLAYING') return;
    if (!collides(sim.board, sim.piece.matrix, sim.piece.x + dx, sim.piece.y)) {
      sim.piece.x += dx;
    }
  }, []);

  const rotateActive = useCallback(() => {
    const sim = simRef.current;
    if (!sim || sim.phase !== 'PLAYING') return;
    const rotated = rotateMatrix(sim.piece.matrix);
    if (!collides(sim.board, rotated, sim.piece.x, sim.piece.y)) {
      sim.piece.matrix = rotated;
      playGameSound('tap');
    } else if (!collides(sim.board, rotated, sim.piece.x - 1, sim.piece.y)) {
      sim.piece.matrix = rotated;
      sim.piece.x -= 1;
      playGameSound('tap');
    } else if (!collides(sim.board, rotated, sim.piece.x + 1, sim.piece.y)) {
      sim.piece.matrix = rotated;
      sim.piece.x += 1;
      playGameSound('tap');
    }
  }, []);

  const stepDown = useCallback(() => {
    const sim = simRef.current;
    if (!sim || sim.phase !== 'PLAYING') return;
    if (!collides(sim.board, sim.piece.matrix, sim.piece.x, sim.piece.y + 1)) {
      sim.piece.y += 1;
    } else {
      lockAndAdvance();
    }
  }, [lockAndAdvance]);

  const hardDrop = useCallback(() => {
    const sim = simRef.current;
    if (!sim || sim.phase !== 'PLAYING') return;
    while (!collides(sim.board, sim.piece.matrix, sim.piece.x, sim.piece.y + 1)) {
      sim.piece.y += 1;
    }
    lockAndAdvance();
  }, [lockAndAdvance]);

  const startGame = () => {
    playGameSound('tap');
    const board: (string | null)[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    for (let i = 0; i < config.preSeedRows; i++) {
      const r = ROWS - 1 - i;
      const hole = (i * 3 + 2) % COLS;
      for (let c = 0; c < COLS; c++) {
        if (c !== hole && c !== (hole + 1) % COLS) {
          board[r][c] = '#64748b';
        }
      }
    }

    const first = randomPiece();
    const second = randomPiece();

    simRef.current = {
      board,
      piece: spawnPiece(first),
      nextPiece: second,
      flashRows: [],
      particles: [],
      texts: [],
      lines: 0,
      score: 0,
      streak: 0,
      maxStreak: 1,
      piecesLocked: 0,
      phase: 'PLAYING',
      timeLeft: tierMeta.timeLimitSeconds,
    };

    setLinesCleared(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(1);
    setNextPiece(second);
    setTimeLeft(tierMeta.timeLimitSeconds);
    setPhase('PLAYING');
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (simRef.current?.phase !== 'PLAYING') return;
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault();
        moveHorizontal(-1);
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault();
        moveHorizontal(1);
      } else if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        rotateActive();
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        e.preventDefault();
        stepDown();
      } else if (e.code === 'Space') {
        e.preventDefault();
        hardDrop();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [hardDrop, moveHorizontal, rotateActive, stepDown]);

  useEffect(() => {
    if (phase !== 'PLAYING') return;
    const id = window.setInterval(stepDown, config.dropMs);
    return () => window.clearInterval(id);
  }, [config.dropMs, phase, stepDown]);

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

  const accuracy = Math.max(70, Math.min(100, 75 + linesCleared * 4));

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
        accentColor="purple"
        ageGroup={ageGroup}
        currentStep={linesCleared}
        totalSteps={config.targetLines}
        score={score}
        streak={streak}
        accuracy={accuracy}
        timeLeftSeconds={timeLeft}
      />

      {/* Lines counter + Visual Next-Piece Preview */}
      <div className="bg-white border border-slate-200 rounded-2xl px-3.5 py-2 flex items-center justify-between text-xs sm:text-sm font-bold shrink-0">
        <span className="text-purple-700 tabular-nums">
          {copy.labels.lines}: {linesCleared}/{config.targetLines}
        </span>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-semibold text-xs">{copy.labels.next}:</span>
          <div className="flex items-center gap-2 bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-700">
            <div className="flex flex-col gap-[2px]">
              {nextPiece.matrix.map((row, rIdx) => (
                <div key={rIdx} className="flex gap-[2px]">
                  {row.map((cell, cIdx) => (
                    <span
                      key={cIdx}
                      className="w-2.5 h-2.5 rounded-[2px]"
                      style={{
                        backgroundColor: cell ? nextPiece.color : 'transparent',
                        boxShadow: cell ? `inset 1px 1px 0 ${nextPiece.hi}` : 'none',
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
            <span
              className="text-[11px] font-bold tracking-wide"
              style={{ color: nextPiece.hi }}
            >
              {nextPiece.label}
            </span>
          </div>
        </div>
      </div>

      <div
        className="flex-1 min-h-[220px] w-full flex items-center justify-center"
        style={{ containerType: 'size' }}
      >
        <div
          style={{
            width: `min(100cqw, calc(100cqh * ${CANVAS_W} / ${CANVAS_H}))`,
            height: `min(100cqh, calc(100cqw * ${CANVAS_H} / ${CANVAS_W}))`,
          }}
          className="relative rounded-2xl overflow-hidden border-2 border-slate-400 bg-slate-950 shadow-xl"
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full block"
          />

        {phase === 'TITLE' && (
          <div className="absolute inset-0 bg-slate-950/88 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center text-white space-y-3">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 border-2 border-purple-200 shadow-lg flex items-center justify-center">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-base font-bold">{copy.labels.startTitle}</h3>
            <p className="text-xs text-sky-100 font-normal leading-relaxed">{copy.labels.startDesc}</p>
            <button
              type="button"
              onClick={startGame}
              className="min-h-[42px] px-5 py-2 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-bold text-xs sm:text-sm shadow-lg flex items-center gap-1.5 cursor-pointer active:scale-95 transition"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{copy.labels.playBtn}</span>
            </button>
          </div>
        )}

        {phase === 'GAME_OVER' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center text-white space-y-3">
            <div className="w-13 h-13 rounded-2xl bg-rose-500/20 border-2 border-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-rose-400" />
            </div>
            <h3 className="text-base font-bold text-rose-300">{copy.labels.gameOverTitle}</h3>
            <p className="text-xs text-slate-200 font-normal">{copy.labels.gameOverDesc}</p>
            <button
              type="button"
              onClick={startGame}
              className="min-h-[42px] px-5 py-2 rounded-2xl bg-cyan-500 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer active:scale-95 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{copy.labels.retryBtn}</span>
            </button>
          </div>
        )}
        </div>
      </div>

      {/* Touch Arcade Controls */}
      <div className="w-full max-w-md mx-auto grid grid-cols-5 gap-2 shrink-0 select-none">
        <button
          type="button"
          onPointerDown={() => moveHorizontal(-1)}
          aria-label="Left"
          className="h-12 rounded-2xl bg-white border-2 border-slate-200 active:bg-cyan-50 text-slate-800 flex items-center justify-center shadow-xs cursor-pointer touch-none"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onPointerDown={rotateActive}
          aria-label="Rotate"
          className="h-12 rounded-2xl bg-purple-50 border-2 border-purple-200 active:bg-purple-100 text-purple-800 flex items-center justify-center shadow-xs cursor-pointer touch-none"
        >
          <RotateCw className="w-5 h-5" />
        </button>
        <button
          type="button"
          onPointerDown={stepDown}
          aria-label="Down"
          className="h-12 rounded-2xl bg-white border-2 border-slate-200 active:bg-cyan-50 text-slate-800 flex items-center justify-center shadow-xs cursor-pointer touch-none"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
        <button
          type="button"
          onPointerDown={() => moveHorizontal(1)}
          aria-label="Right"
          className="h-12 rounded-2xl bg-white border-2 border-slate-200 active:bg-cyan-50 text-slate-800 flex items-center justify-center shadow-xs cursor-pointer touch-none"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        <button
          type="button"
          onPointerDown={hardDrop}
          className="h-12 rounded-2xl bg-cyan-600 active:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs cursor-pointer touch-none"
        >
          <ChevronsDown className="w-4 h-4" />
          <span>{copy.labels.drop}</span>
        </button>
      </div>
    </div>
  );
};
