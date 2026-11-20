import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Heart,
  Play,
  RotateCcw,
  Shield,
  ShieldAlert,
  Sparkles,
  Trash2,
  Zap,
} from 'lucide-react';
import { ChildAgeGroup, GameResultStats } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { GameHud, GameVictorySummary } from './GameShell';
import { computeStars, getAgeTierMeta } from '../../utils/ageDifficulty';
import { playGameSound } from '../../utils/gameAudio';

interface CyberPvzGameProps {
  onComplete: (stats?: GameResultStats) => void;
  ageGroup?: ChildAgeGroup;
}

type DefenseKind = 'generator' | 'antivirus' | 'firewall' | 'freezer';
type Phase = 'TITLE' | 'PLAYING' | 'GAME_OVER' | 'WON';

interface PlacedDefense {
  id: string;
  row: number;
  col: number;
  kind: DefenseKind;
  hp: number;
  maxHp: number;
  cooldown: number;
}

interface VirusEnemy {
  id: string;
  row: number;
  x: number; // 0..6 (column space)
  hp: number;
  maxHp: number;
  speed: number;
  slowTimer: number;
  kind: 'worm' | 'trojan' | 'sprinter';
}

interface LaserBolt {
  id: string;
  row: number;
  x: number;
  damage: number;
  slow: boolean;
}

const COLS = 6;

const UNIT_COST: Record<DefenseKind, number> = {
  generator: 50,
  firewall: 50,
  antivirus: 100,
  freezer: 125,
};

const DefenseSpriteSvg: React.FC<{ kind: DefenseKind; className?: string }> = ({
  kind,
  className = 'w-8 h-8',
}) => {
  if (kind === 'generator') {
    return (
      <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
        <defs>
          <radialGradient id="pvzGenOrb" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fef9c3" />
            <stop offset="55%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </radialGradient>
        </defs>
        <path
          d="M20 3 L24 11 L33 8 L29 16 L37 20 L29 24 L33 32 L24 29 L20 37 L16 29 L7 32 L11 24 L3 20 L11 16 L7 8 L16 11 Z"
          fill="#fbbf24"
          stroke="#fef08a"
          strokeWidth="1.2"
        />
        <circle cx="20" cy="20" r="9.5" fill="url(#pvzGenOrb)" stroke="#78350f" strokeWidth="1.5" />
        <path d="M21 13 L15 21 H20 L18.5 27 L25 19 H20 Z" fill="#ffffff" />
      </svg>
    );
  }
  if (kind === 'antivirus') {
    return (
      <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
        <rect x="6" y="25" width="22" height="9" rx="4" fill="#0e7490" stroke="#67e8f9" strokeWidth="1.4" />
        <circle cx="17" cy="19" r="9" fill="#06b6d4" stroke="#cffafe" strokeWidth="1.5" />
        <rect x="22" y="13" width="14" height="5" rx="2.5" fill="#22d3ee" stroke="#083344" strokeWidth="1.2" />
        <rect x="22" y="20" width="12" height="4" rx="2" fill="#38bdf8" stroke="#083344" strokeWidth="1.2" />
        <circle cx="16" cy="18" r="3.5" fill="#0f172a" />
        <circle cx="17" cy="17.5" r="1.4" fill="#fef08a" />
      </svg>
    );
  }
  if (kind === 'firewall') {
    return (
      <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
        <path
          d="M8 9 L20 4 L32 9 V21 C32 29 26 34 20 37 C14 34 8 29 8 21 Z"
          fill="#ea580c"
          stroke="#fed7aa"
          strokeWidth="1.8"
        />
        <path
          d="M12 12 L20 8.5 L28 12 V20 C28 26 24 30 20 32.5 C16 30 12 26 12 20 Z"
          fill="#f97316"
        />
        <rect x="15.5" y="18" width="9" height="8" rx="2" fill="#fff7ed" />
        <path
          d="M17.2 18 V15.5 A2.8 2.8 0 0 1 22.8 15.5 V18"
          fill="none"
          stroke="#fff7ed"
          strokeWidth="2"
        />
        <circle cx="20" cy="22" r="1.3" fill="#9a3412" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <polygon
        points="20,4 32,12 32,28 20,36 8,28 8,12"
        fill="#2563eb"
        stroke="#bae6fd"
        strokeWidth="1.6"
      />
      <rect x="24" y="16" width="13" height="7" rx="3" fill="#7dd3fc" stroke="#1e3a8a" strokeWidth="1.2" />
      <path
        d="M18 11 V29 M11 15 L25 25 M25 15 L11 25"
        stroke="#e0f2fe"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="18" cy="20" r="3" fill="#ffffff" />
    </svg>
  );
};

const VirusSpriteSvg: React.FC<{ kind: VirusEnemy['kind']; chilled: boolean }> = ({
  kind,
  chilled,
}) => {
  if (kind === 'trojan') {
    return (
      <svg
        viewBox="0 0 40 40"
        className={`w-9 h-9 drop-shadow-md ${chilled ? 'brightness-125 saturate-150' : ''}`}
        aria-hidden="true"
      >
        <path d="M9 12 L5 4 L14 9 Z" fill="#fbbf24" />
        <path d="M31 12 L35 4 L26 9 Z" fill="#fbbf24" />
        <rect
          x="7"
          y="9"
          width="26"
          height="24"
          rx="7"
          fill={chilled ? '#3b82f6' : '#dc2626'}
          stroke={chilled ? '#bae6fd' : '#fecaca'}
          strokeWidth="1.6"
        />
        <rect x="11" y="16" width="18" height="7" rx="3" fill="#0f172a" />
        <circle cx="15" cy="19.5" r="2" fill="#fde047" />
        <circle cx="25" cy="19.5" r="2" fill="#fde047" />
        <path d="M13 28 L17 26 L20 28 L23 26 L27 28" stroke="#ffffff" strokeWidth="1.6" fill="none" />
      </svg>
    );
  }
  if (kind === 'sprinter') {
    return (
      <svg
        viewBox="0 0 40 40"
        className={`w-8 h-8 drop-shadow-md ${chilled ? 'brightness-125' : ''}`}
        aria-hidden="true"
      >
        <path
          d="M5 20 L17 7 L34 14 L26 20 L34 26 L17 33 Z"
          fill={chilled ? '#38bdf8' : '#a855f7'}
          stroke="#f5d0fe"
          strokeWidth="1.5"
        />
        <rect x="11" y="17" width="11" height="5" rx="2.5" fill="#0f172a" />
        <circle cx="14" cy="19.5" r="1.8" fill="#22d3ee" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 40 40"
      className={`w-8 h-8 drop-shadow-md ${chilled ? 'brightness-125' : ''}`}
      aria-hidden="true"
    >
      <circle cx="27" cy="23" r="6" fill={chilled ? '#0ea5e9' : '#e11d48'} />
      <circle cx="21" cy="21" r="7.5" fill={chilled ? '#38bdf8' : '#f43f5e'} />
      <circle
        cx="14"
        cy="19"
        r="9"
        fill={chilled ? '#7dd3fc' : '#fb7185'}
        stroke={chilled ? '#e0f2fe' : '#ffe4e6'}
        strokeWidth="1.5"
      />
      <line x1="11" y1="10" x2="8" y2="5" stroke="#fecdd3" strokeWidth="2" strokeLinecap="round" />
      <line x1="17" y1="10" x2="20" y2="5" stroke="#fecdd3" strokeWidth="2" strokeLinecap="round" />
      <circle cx="11" cy="18" r="2.2" fill="#0f172a" />
      <circle cx="16" cy="18" r="2.2" fill="#0f172a" />
      <circle cx="10.5" cy="17.5" r="0.8" fill="#fef08a" />
      <circle cx="15.5" cy="17.5" r="0.8" fill="#fef08a" />
    </svg>
  );
};

export const CyberPvzGame: React.FC<CyberPvzGameProps> = ({
  onComplete,
  ageGroup = '8–10' as ChildAgeGroup,
}) => {
  const { language } = useLanguage();
  const tierMeta = getAgeTierMeta(ageGroup, language);

  const config = useMemo(() => {
    const lanes = ageGroup === '8–10' ? 3 : 4;
    const totalViruses = ageGroup === '13–14' ? 20 : ageGroup === '11–12' ? 15 : 10;
    const startEnergy = ageGroup === '8–10' ? 175 : ageGroup === '11–12' ? 150 : 125;
    const maxHearts = ageGroup === '8–10' ? 4 : 3;
    const spawnEverySec = ageGroup === '13–14' ? 2.6 : ageGroup === '11–12' ? 3.3 : 4.2;
    return { lanes, totalViruses, startEnergy, maxHearts, spawnEverySec };
  }, [ageGroup]);

  const copy = useMemo(() => {
    const title =
      language === 'fr'
        ? 'Défense Cyber par Voies'
        : language === 'en'
        ? 'Cyber Defense Lanes'
        : 'Defensa Cyber por Carriles';

    const subtitle =
      language === 'fr'
        ? 'Place des pare-feu et antivirus sur les voies pour protéger l’ordinateur'
        : language === 'en'
        ? 'Deploy firewalls, antivirus & generators across lanes to guard your PC'
        : 'Coloca firewalls y antivirus en los carriles para proteger tu PC';

    const takeaway =
      language === 'fr'
        ? 'Une défense multicouche combine énergie (surveillance), murs pare-feu, antivirus actif et ralentisseurs 2FA.'
        : language === 'en'
        ? 'Layered cyber defense pairs resource generators, tough firewall walls, active antivirus blasters, and 2FA slowdowns.'
        : 'Una defensa estratégica combina muros Firewall resistentes, Antivirus activos, ralentizadores 2FA y buena gestión de energía.';

    const units: Array<{ kind: DefenseKind; name: string; desc: string }> =
      language === 'fr'
        ? [
            { kind: 'generator', name: 'Énergie', desc: '+25 auto' },
            { kind: 'antivirus', name: 'Antivirus', desc: 'Tire laser' },
            { kind: 'firewall', name: 'Pare-feu', desc: 'Bloque fort' },
            { kind: 'freezer', name: 'Gel 2FA', desc: 'Ralentit 50%' },
          ]
        : language === 'en'
        ? [
            { kind: 'generator', name: 'Energy', desc: '+25 gen' },
            { kind: 'antivirus', name: 'Antivirus', desc: 'Fires bolts' },
            { kind: 'firewall', name: 'Firewall', desc: 'Heavy block' },
            { kind: 'freezer', name: '2FA Slow', desc: 'Slows 50%' },
          ]
        : [
            { kind: 'generator', name: 'Generador', desc: '+25 extra' },
            { kind: 'antivirus', name: 'Antivirus', desc: 'Dispara láser' },
            { kind: 'firewall', name: 'Firewall', desc: 'Muro tanque' },
            { kind: 'freezer', name: 'Hielo 2FA', desc: 'Ralentiza 50%' },
          ];

    const labels = {
      es: {
        startTitle: 'Estrategia: Protege el Computador',
        startDesc:
          'Selecciona una defensa abajo y toca una casilla para colocarla. ¡Detén los gusanos y troyanos antes de que lleguen a la izquierda!',
        playBtn: '¡Defender la Red!',
        gameOverTitle: '¡Computador Infectado!',
        gameOverDesc: 'Los virus cruzaron tus carriles. Ajusta tu estrategia y reintenta.',
        retryBtn: 'Reintentar Defensa',
        shields: 'PC Escudos',
        energy: 'Energía',
        defeated: 'Virus',
        recycle: 'Quitar',
        threatFlow: 'Avance de Malware',
      },
      fr: {
        startTitle: 'Stratégie : Protège le PC',
        startDesc:
          'Choisis une défense puis touche une case. Bloque les vers et chevaux de Troie avant le bord gauche !',
        playBtn: 'Défendre le Réseau !',
        gameOverTitle: 'PC Infecté !',
        gameOverDesc: 'Les virus ont franchi la ligne. Ajuste ta stratégie !',
        retryBtn: 'Réessayer',
        shields: 'PC Boucliers',
        energy: 'Énergie',
        defeated: 'Virus',
        recycle: 'Retirer',
        threatFlow: 'Vagues de Malware',
      },
      en: {
        startTitle: 'Lane Strategy: Guard the PC',
        startDesc:
          'Pick a cyber unit below and tap any open tile to deploy it. Stop worms and trojans before they reach the left edge!',
        playBtn: 'Start Defense!',
        gameOverTitle: 'Computer Infected!',
        gameOverDesc: 'Viruses breached your lanes. Adjust your placement and retry!',
        retryBtn: 'Retry Defense',
        shields: 'PC Shields',
        energy: 'Energy',
        defeated: 'Viruses',
        recycle: 'Remove',
        threatFlow: 'Malware Inbound',
      },
    }[language];

    return { title, subtitle, takeaway, units, labels };
  }, [language]);

  const [phase, setPhase] = useState<Phase>('TITLE');
  const [selectedTool, setSelectedTool] = useState<DefenseKind | 'remove'>('antivirus');
  const [energy, setEnergy] = useState<number>(config.startEnergy);
  const [hearts, setHearts] = useState<number>(config.maxHearts);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(1);
  const [defeatedCount, setDefeatedCount] = useState<number>(0);
  const [defenses, setDefenses] = useState<PlacedDefense[]>([]);
  const [enemies, setEnemies] = useState<VirusEnemy[]>([]);
  const [bolts, setBolts] = useState<LaserBolt[]>([]);
  const [timeLeft, setTimeLeft] = useState<number | null>(tierMeta.timeLimitSeconds);

  const simRef = useRef<{
    defenses: PlacedDefense[];
    enemies: VirusEnemy[];
    bolts: LaserBolt[];
    energy: number;
    hearts: number;
    score: number;
    streak: number;
    maxStreak: number;
    spawned: number;
    defeated: number;
    spawnTimer: number;
    passiveEnergyTimer: number;
    idSeq: number;
    phase: Phase;
    timeLeft: number | null;
    secAcc: number;
  } | null>(null);

  const startGame = () => {
    playGameSound('tap');
    simRef.current = {
      defenses: [],
      enemies: [],
      bolts: [],
      energy: config.startEnergy,
      hearts: config.maxHearts,
      score: 0,
      streak: 0,
      maxStreak: 1,
      spawned: 0,
      defeated: 0,
      spawnTimer: 1.5,
      passiveEnergyTimer: 0,
      idSeq: 1,
      phase: 'PLAYING',
      timeLeft: tierMeta.timeLimitSeconds,
      secAcc: 0,
    };
    setSelectedTool('antivirus');
    setEnergy(config.startEnergy);
    setHearts(config.maxHearts);
    setScore(0);
    setStreak(0);
    setMaxStreak(1);
    setDefeatedCount(0);
    setDefenses([]);
    setEnemies([]);
    setBolts([]);
    setTimeLeft(tierMeta.timeLimitSeconds);
    setPhase('PLAYING');
  };

  const handleTileClick = (row: number, col: number) => {
    const sim = simRef.current;
    if (!sim || sim.phase !== 'PLAYING') return;

    const existingIdx = sim.defenses.findIndex((d) => d.row === row && d.col === col);
    if (selectedTool === 'remove') {
      if (existingIdx >= 0) {
        sim.defenses.splice(existingIdx, 1);
        sim.energy += 25;
        setEnergy(sim.energy);
        setDefenses([...sim.defenses]);
        playGameSound('tap');
      }
      return;
    }

    if (existingIdx >= 0) return;
    const cost = UNIT_COST[selectedTool];
    if (sim.energy < cost) {
      playGameSound('wrong');
      return;
    }

    sim.energy -= cost;
    const hpMap: Record<DefenseKind, number> = {
      generator: 60,
      antivirus: 70,
      freezer: 70,
      firewall: 240,
    };
    sim.defenses.push({
      id: `d-${sim.idSeq++}`,
      row,
      col,
      kind: selectedTool,
      hp: hpMap[selectedTool],
      maxHp: hpMap[selectedTool],
      cooldown: selectedTool === 'generator' ? 3.5 : 0.6,
    });
    setEnergy(sim.energy);
    setDefenses([...sim.defenses]);
    playGameSound('correct');
  };

  useEffect(() => {
    if (phase !== 'PLAYING') return;
    const dt = 0.08;
    const id = window.setInterval(() => {
      const sim = simRef.current;
      if (!sim || sim.phase !== 'PLAYING') return;

      if (sim.timeLeft !== null) {
        sim.secAcc += dt;
        if (sim.secAcc >= 1) {
          sim.secAcc -= 1;
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

      // Passive solar energy drop
      sim.passiveEnergyTimer += dt;
      if (sim.passiveEnergyTimer >= 3.2) {
        sim.passiveEnergyTimer = 0;
        sim.energy += 25;
      }

      // Spawn virus waves
      sim.spawnTimer -= dt;
      if (sim.spawnTimer <= 0 && sim.spawned < config.totalViruses) {
        sim.spawnTimer = config.spawnEverySec;
        sim.spawned += 1;
        const row = Math.floor(Math.random() * config.lanes);
        const roll = Math.random();
        const kind: VirusEnemy['kind'] =
          ageGroup !== '8–10' && roll > 0.72
            ? 'trojan'
            : ageGroup === '13–14' && roll < 0.28
            ? 'sprinter'
            : 'worm';
        const hp = kind === 'trojan' ? 160 : kind === 'sprinter' ? 65 : 90;
        const speed = kind === 'sprinter' ? 0.56 : kind === 'trojan' ? 0.28 : 0.36;

        sim.enemies.push({
          id: `v-${sim.idSeq++}`,
          row,
          x: COLS - 0.15,
          hp,
          maxHp: hp,
          speed,
          slowTimer: 0,
          kind,
        });
      }

      // Defenses act
      for (const def of sim.defenses) {
        def.cooldown -= dt;
        if (def.kind === 'generator' && def.cooldown <= 0) {
          def.cooldown = 4.6;
          sim.energy += 25;
        } else if (
          (def.kind === 'antivirus' || def.kind === 'freezer') &&
          def.cooldown <= 0
        ) {
          const hasThreatInLane = sim.enemies.some(
            (e) => e.row === def.row && e.x >= def.col
          );
          if (hasThreatInLane) {
            def.cooldown = def.kind === 'freezer' ? 1.55 : 1.2;
            sim.bolts.push({
              id: `b-${sim.idSeq++}`,
              row: def.row,
              x: def.col + 0.55,
              damage: def.kind === 'freezer' ? 24 : 30,
              slow: def.kind === 'freezer',
            });
          }
        }
      }

      // Advance bolts
      const nextBolts: LaserBolt[] = [];
      for (const b of sim.bolts) {
        b.x += 4.2 * dt;
        if (b.x > COLS) continue;

        const target = sim.enemies.find(
          (e) => e.row === b.row && Math.abs(e.x - b.x) < 0.35 && e.hp > 0
        );
        if (target) {
          target.hp -= b.damage;
          if (b.slow) target.slowTimer = 3.0;
          if (target.hp <= 0) {
            sim.defeated += 1;
            sim.streak += 1;
            sim.maxStreak = Math.max(sim.maxStreak, sim.streak);
            sim.score += target.kind === 'trojan' ? 120 : 80;
            sim.energy += 15;
            playGameSound('correct');
          }
        } else {
          nextBolts.push(b);
        }
      }
      sim.bolts = nextBolts;
      sim.enemies = sim.enemies.filter((e) => e.hp > 0);

      // Advance enemies or chew defense
      const survivingEnemies: VirusEnemy[] = [];
      for (const e of sim.enemies) {
        e.slowTimer = Math.max(0, e.slowTimer - dt);
        const blocking = sim.defenses.find(
          (d) => d.row === e.row && Math.abs(e.x - (d.col + 0.45)) < 0.35
        );
        if (blocking) {
          blocking.hp -= 28 * dt;
        } else {
          const spd = e.slowTimer > 0 ? e.speed * 0.5 : e.speed;
          e.x -= spd * dt;
        }

        if (e.x <= -0.1) {
          sim.hearts -= 1;
          sim.streak = 0;
          sim.defeated += 1;
          playGameSound('wrong');
          if (sim.hearts <= 0) {
            sim.phase = 'GAME_OVER';
            setPhase('GAME_OVER');
            setHearts(0);
            return;
          }
        } else {
          survivingEnemies.push(e);
        }
      }
      sim.enemies = survivingEnemies;
      sim.defenses = sim.defenses.filter((d) => d.hp > 0);

      if (sim.spawned >= config.totalViruses && sim.enemies.length === 0) {
        sim.score += sim.hearts * 75;
        playGameSound('win');
        sim.phase = 'WON';
        setPhase('WON');
      }

      setEnergy(sim.energy);
      setHearts(sim.hearts);
      setScore(sim.score);
      setStreak(sim.streak);
      setMaxStreak(sim.maxStreak);
      setDefeatedCount(sim.defeated);
      setDefenses([...sim.defenses]);
      setEnemies([...sim.enemies]);
      setBolts([...sim.bolts]);
    }, dt * 1000);

    return () => window.clearInterval(id);
  }, [ageGroup, config.lanes, config.spawnEverySec, config.totalViruses, phase]);

  const accuracy = Math.max(60, Math.round((hearts / config.maxHearts) * 100));

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
        accentColor="emerald"
        ageGroup={ageGroup}
        currentStep={defeatedCount}
        totalSteps={config.totalViruses}
        score={score}
        streak={streak}
        accuracy={accuracy}
        timeLeftSeconds={timeLeft}
      />

      {/* Energy & Computer Shield Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl px-3.5 py-2 flex items-center justify-between text-xs sm:text-sm font-bold shrink-0">
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
        <div className="flex items-center gap-1 text-amber-700 tabular-nums">
          <Zap className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span>{energy}</span>
        </div>
        <div className="text-emerald-700 tabular-nums">
          {copy.labels.defeated}: {defeatedCount}/{config.totalViruses}
        </div>
      </div>

      {/* Tactical Unit Palette with Vector SVGs */}
      <div className="grid grid-cols-5 gap-1.5 shrink-0">
        {copy.units.map((u) => {
          const cost = UNIT_COST[u.kind];
          const affordable = energy >= cost;
          const active = selectedTool === u.kind;
          return (
            <button
              key={u.kind}
              type="button"
              onClick={() => setSelectedTool(u.kind)}
              className={`min-h-[64px] p-1.5 rounded-xl border-2 text-center transition cursor-pointer flex flex-col items-center justify-center ${
                active
                  ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200 shadow-xs'
                  : affordable
                  ? 'bg-white border-slate-200 hover:border-cyan-300'
                  : 'bg-slate-100 border-slate-200 opacity-55'
              }`}
            >
              <DefenseSpriteSvg kind={u.kind} className="w-7 h-7 sm:w-8 sm:h-8" />
              <span className="text-[10px] font-bold text-slate-800 truncate w-full mt-0.5">
                {u.name}
              </span>
              <span className="text-[10px] font-semibold text-amber-700 tabular-nums flex items-center gap-0.5">
                {cost}
                <Zap className="w-2.5 h-2.5 text-amber-500 fill-amber-400" />
              </span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => setSelectedTool('remove')}
          className={`min-h-[64px] p-1.5 rounded-xl border-2 text-center transition cursor-pointer flex flex-col items-center justify-center ${
            selectedTool === 'remove'
              ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-200'
              : 'bg-white border-slate-200 hover:border-rose-300'
          }`}
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-rose-100 flex items-center justify-center">
            <Trash2 className="w-4 h-4 text-rose-600" />
          </div>
          <span className="text-[10px] font-bold text-slate-800 mt-0.5">
            {copy.labels.recycle}
          </span>
          <span className="text-[10px] font-semibold text-emerald-700 tabular-nums">+25</span>
        </button>
      </div>

      {/* Cyber-Garden Tactical Lane Battlefield */}
      <div className="relative flex-1 min-h-[240px] flex flex-col justify-between bg-gradient-to-b from-slate-900 to-emerald-950 rounded-3xl border-2 border-emerald-700/80 p-2.5 shadow-xl overflow-hidden">
        <div className="flex-1 min-h-0 flex gap-1.5">
          {/* Protected PC Core Firewall Edge */}
          <div className="w-3 sm:w-4 rounded-xl bg-gradient-to-b from-cyan-500/40 via-emerald-400/50 to-cyan-500/40 border border-cyan-300/60 flex items-center justify-center shrink-0">
            <div className="w-1 h-4/5 rounded-full bg-cyan-300/80 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          </div>

          <div className="flex-1 min-h-0 flex flex-col gap-1.5">
            {Array.from({ length: config.lanes }).map((_, r) => {
              const laneEnemies = enemies.filter((e) => e.row === r);
              const laneBolts = bolts.filter((b) => b.row === r);

              return (
                <div
                  key={r}
                  className="relative flex-1 min-h-[52px] grid grid-cols-6 gap-1 bg-emerald-950/60 rounded-xl p-1 border border-emerald-700/60 overflow-hidden"
                >
                  {/* Subtle glowing lane circuit trace */}
                  <div className="pointer-events-none absolute inset-x-2 top-1/2 h-[2px] -translate-y-1/2 bg-emerald-500/15" />

                  {Array.from({ length: COLS }).map((__, c) => {
                    const placed = defenses.find((d) => d.row === r && d.col === c);
                    const isEven = (r + c) % 2 === 0;

                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => handleTileClick(r, c)}
                        className={`rounded-lg border flex flex-col items-center justify-center relative transition cursor-pointer ${
                          placed
                            ? 'bg-emerald-800/85 border-cyan-400/70 shadow-inner'
                            : isEven
                            ? 'bg-emerald-900/55 hover:bg-emerald-800/60 border-emerald-700/45'
                            : 'bg-emerald-950/65 hover:bg-emerald-800/60 border-emerald-800/50'
                        }`}
                      >
                        {placed && (
                          <>
                            <DefenseSpriteSvg
                              kind={placed.kind}
                              className="w-8 h-8 sm:w-9 sm:h-9 drop-shadow"
                            />
                            <div className="w-4/5 h-1.5 bg-slate-950 rounded-full mt-0.5 overflow-hidden border border-slate-700/70">
                              <div
                                className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all"
                                style={{
                                  width: `${Math.max(0, (placed.hp / placed.maxHp) * 100)}%`,
                                }}
                              />
                            </div>
                          </>
                        )}
                      </button>
                    );
                  })}

                  {/* Advancing Vector Virus Sprites */}
                  {laneEnemies.map((e) => (
                    <div
                      key={e.id}
                      style={{ left: `${Math.min(94, Math.max(0, (e.x / COLS) * 100))}%` }}
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center z-10"
                    >
                      <VirusSpriteSvg kind={e.kind} chilled={e.slowTimer > 0} />
                      <div className="w-8 h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-700">
                        <div
                          className={`h-full ${
                            e.slowTimer > 0 ? 'bg-sky-400' : 'bg-rose-500'
                          }`}
                          style={{ width: `${Math.max(0, (e.hp / e.maxHp) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}

                  {/* Glowing Plasma & Cryo Laser Bolts */}
                  {laneBolts.map((b) => (
                    <div
                      key={b.id}
                      style={{ left: `${(b.x / COLS) * 100}%` }}
                      className={`absolute top-1/2 -translate-y-1/2 w-5 h-2 rounded-full pointer-events-none z-10 flex items-center justify-end pr-0.5 ${
                        b.slow
                          ? 'bg-gradient-to-r from-blue-500/40 to-sky-300 shadow-[0_0_8px_rgba(125,211,252,0.9)]'
                          : 'bg-gradient-to-r from-cyan-500/40 to-cyan-200 shadow-[0_0_8px_rgba(34,211,238,0.95)]'
                      }`}
                    >
                      <span className="w-2 h-1.5 rounded-full bg-white" />
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Left Protected Core Indicator */}
        <div className="mt-2 flex items-center justify-between text-[11px] font-semibold text-emerald-200 px-1">
          <span className="flex items-center gap-1 text-cyan-300">
            <Shield className="w-3.5 h-3.5" /> PC CORE
          </span>
          <span className="text-rose-300 tracking-wide">&larr; {copy.labels.threatFlow}</span>
        </div>

        {phase === 'TITLE' && (
          <div className="absolute inset-0 bg-slate-950/88 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center text-white space-y-3 z-20">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-600 border-2 border-emerald-200 shadow-lg flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
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
              className="min-h-[44px] px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-sm shadow-lg flex items-center gap-2 cursor-pointer active:scale-95 transition"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>{copy.labels.playBtn}</span>
            </button>
          </div>
        )}

        {phase === 'GAME_OVER' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center text-white space-y-3 z-20">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border-2 border-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-7 h-7 text-rose-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-rose-300">{copy.labels.gameOverTitle}</h3>
              <p className="text-xs sm:text-sm text-slate-200 font-normal max-w-xs">{copy.labels.gameOverDesc}</p>
            </div>
            <button
              type="button"
              onClick={startGame}
              className="min-h-[44px] px-6 py-2.5 rounded-2xl bg-cyan-500 text-white font-bold text-sm flex items-center gap-2 cursor-pointer active:scale-95 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{copy.labels.retryBtn}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
