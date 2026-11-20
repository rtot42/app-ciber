import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, KeyRound, Cloud, Wifi, EyeOff, Cpu, MailWarning } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { ChildAgeGroup, GameResultStats } from '../../types';
import { GameHud, GameVictorySummary } from './GameShell';
import { computeStars } from '../../utils/ageDifficulty';
import { playGameSound } from '../../utils/gameAudio';

interface PairDef {
  pairId: string;
  label: string;
  kind: 'tool' | 'counter';
  iconKey: string;
}

interface MemoryCard {
  id: number;
  pairId: string;
  label: string;
  iconKey: string;
}

interface MemoryMatchGameProps {
  onComplete: (stats?: GameResultStats) => void;
  ageGroup?: ChildAgeGroup;
}

export const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({
  onComplete,
  ageGroup = '8–10' as ChildAgeGroup,
}) => {
  const { language } = useLanguage();

  const pairCount = ageGroup === '13–14' ? 8 : ageGroup === '11–12' ? 6 : 4;

  const copy = useMemo(() => {
    const labelsByLang: Record<string, { id: string; a: string; b: string; iconKey: string }[]> = {
      es: [
        { id: '2fa', a: 'Código 2FA', b: 'Bloquea robos de clave', iconKey: 'key' },
        { id: 'phish', a: 'Anti-Phishing', b: 'Detecta enlaces falsos', iconKey: 'mail' },
        { id: 'lock', a: 'Candado HTTPS', b: 'Cifra tu conexión', iconKey: 'lock' },
        { id: 'cloud', a: 'Copia en Nube', b: 'Salva tus archivos', iconKey: 'cloud' },
        { id: 'shield', a: 'Antivirus', b: 'Detiene malware', iconKey: 'shield' },
        { id: 'priv', a: 'Modo Privado', b: 'Oculta ubicación GPS', iconKey: 'eye' },
        { id: 'wifi', a: 'Red Segura', b: 'Evita Wi-Fi sin clave', iconKey: 'wifi' },
        { id: 'patch', a: 'Actualización', b: 'Cierra fallos técnicos', iconKey: 'cpu' },
      ],
      fr: [
        { id: '2fa', a: 'Code 2FA', b: 'Bloque le vol de clé', iconKey: 'key' },
        { id: 'phish', a: 'Anti-Phishing', b: 'Repère les faux liens', iconKey: 'mail' },
        { id: 'lock', a: 'Cadenas HTTPS', b: 'Chiffre les échanges', iconKey: 'lock' },
        { id: 'cloud', a: 'Sauvegarde Cloud', b: 'Protège tes fichiers', iconKey: 'cloud' },
        { id: 'shield', a: 'Antivirus', b: 'Bloque les malwares', iconKey: 'shield' },
        { id: 'priv', a: 'Mode Privé', b: 'Masque le GPS', iconKey: 'eye' },
        { id: 'wifi', a: 'Réseau Sûr', b: 'Évite le Wi-Fi ouvert', iconKey: 'wifi' },
        { id: 'patch', a: 'Mise à jour', b: 'Corrige les failles', iconKey: 'cpu' },
      ],
      en: [
        { id: '2fa', a: '2FA Code', b: 'Stops stolen logins', iconKey: 'key' },
        { id: 'phish', a: 'Anti-Phishing', b: 'Catches fake links', iconKey: 'mail' },
        { id: 'lock', a: 'HTTPS Padlock', b: 'Encrypts web traffic', iconKey: 'lock' },
        { id: 'cloud', a: 'Cloud Backup', b: 'Saves your data', iconKey: 'cloud' },
        { id: 'shield', a: 'Antivirus', b: 'Blocks malware', iconKey: 'shield' },
        { id: 'priv', a: 'Privacy Mode', b: 'Hides GPS location', iconKey: 'eye' },
        { id: 'wifi', a: 'Trusted Wi-Fi', b: 'Skips open hotspots', iconKey: 'wifi' },
        { id: 'patch', a: 'System Update', b: 'Patches security bugs', iconKey: 'cpu' },
      ],
    };

    const selected = labelsByLang[language].slice(0, pairCount);
    const ui = {
      es: {
        title: 'Memoria de Defensas Digitales',
        subtitle:
          ageGroup === '13–14'
            ? 'Empareja 8 herramientas con su función defensiva'
            : ageGroup === '11–12'
            ? 'Empareja 6 herramientas y escudos'
            : 'Encuentra las 4 parejas de ciberseguridad',
        movesLabel: 'Intentos:',
        takeaway:
          'Cada defensa digital cumple un rol clave: 2FA frena intrusos, HTTPS cifra datos, las copias salvan archivos y las actualizaciones cierran fallos.',
      },
      fr: {
        title: 'Mémoire des Outils Cyber',
        subtitle:
          ageGroup === '13–14'
            ? 'Associe 8 outils à leur rôle défensif'
            : ageGroup === '11–12'
            ? 'Trouve les 6 paires de protection'
            : 'Trouve les 4 paires de cybersécurité',
        movesLabel: 'Essais :',
        takeaway:
          'Chaque outil a un rôle précis : la 2FA bloque les intrus, HTTPS chiffre la connexion, la sauvegarde protège tes fichiers et les mises à jour bouchent les failles.',
      },
      en: {
        title: 'Cyber Defense Memory Match',
        subtitle:
          ageGroup === '13–14'
            ? 'Match 8 cyber tools with what they protect'
            : ageGroup === '11–12'
            ? 'Uncover all 6 defense pairs'
            : 'Match all 4 cybersecurity pairs',
        movesLabel: 'Moves:',
        takeaway:
          'Every security habit has a clear job: 2FA stops stolen passwords, HTTPS encrypts traffic, backups save files, and updates patch security holes.',
      },
    }[language];

    return { selected, ui };
  }, [ageGroup, language, pairCount]);

  const [seed, setSeed] = useState(0);

  const deck = useMemo<MemoryCard[]>(() => {
    const cards: MemoryCard[] = [];
    copy.selected.forEach((p, idx) => {
      cards.push({ id: idx * 2, pairId: p.id, label: p.a, iconKey: p.iconKey });
      cards.push({
        id: idx * 2 + 1,
        pairId: p.id,
        label: ageGroup === '8–10' ? p.a : p.b,
        iconKey: p.iconKey,
      });
    });
    // deterministic-friendly shuffle keyed by seed
    return cards.sort((a, b) => {
      const ha = ((a.id + 3) * (seed + 7) * 2654435761) % 97;
      const hb = ((b.id + 5) * (seed + 11) * 2654435761) % 97;
      return ha - hb;
    });
  }, [copy.selected, ageGroup, seed]);

  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(1);
  const [finished, setFinished] = useState(false);

  const renderIcon = (key: string) => {
    const cls = 'w-6 h-6 text-rose-600';
    switch (key) {
      case 'key':
        return <KeyRound className={cls} />;
      case 'mail':
        return <MailWarning className={cls} />;
      case 'lock':
        return <Lock className={cls} />;
      case 'cloud':
        return <Cloud className={cls} />;
      case 'eye':
        return <EyeOff className={cls} />;
      case 'wifi':
        return <Wifi className={cls} />;
      case 'cpu':
        return <Cpu className={cls} />;
      default:
        return <Shield className={cls} />;
    }
  };

  const handleCardClick = (card: MemoryCard) => {
    if (flipped.length === 2 || flipped.includes(card.id) || matched.includes(card.pairId)) {
      return;
    }

    playGameSound('tap');
    const nextFlipped = [...flipped, card.id];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      const nextMoves = moves + 1;
      setMoves(nextMoves);
      const first = deck.find((c) => c.id === nextFlipped[0])!;
      const second = deck.find((c) => c.id === nextFlipped[1])!;

      if (first.pairId === second.pairId) {
        const nextMatched = [...matched, first.pairId];
        const nextStreak = streak + 1;
        setMatched(nextMatched);
        setStreak(nextStreak);
        setMaxStreak((m) => Math.max(m, nextStreak));
        setScore((s) => s + 110 + nextStreak * 20);
        setFlipped([]);
        playGameSound(nextStreak > 1 ? 'combo' : 'correct');

        if (nextMatched.length === pairCount) {
          setTimeout(() => {
            playGameSound('win');
            setFinished(true);
          }, 550);
        }
      } else {
        setStreak(0);
        setTimeout(() => {
          playGameSound('wrong');
          setFlipped([]);
        }, 850);
      }
    }
  };

  const handleReplay = () => {
    setSeed((s) => s + 1);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(1);
    setFinished(false);
  };

  const efficiency =
    moves > 0
      ? Math.min(100, Math.max(45, Math.round((pairCount / Math.max(pairCount, moves)) * 115)))
      : 100;

  if (finished) {
    const finalAcc = Math.min(
      100,
      Math.max(50, Math.round((pairCount / Math.max(pairCount, moves - 1)) * 100))
    );
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
          title={copy.ui.title}
          takeaway={copy.ui.takeaway}
          stats={stats}
          ageGroup={ageGroup}
          onReplay={handleReplay}
          onContinue={onComplete}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 w-full max-w-full flex flex-col p-3.5 sm:p-5 bg-slate-50 text-slate-800 select-none overflow-y-auto overflow-x-hidden scrollbar-none space-y-4 pb-8">
      <GameHud
        title={copy.ui.title}
        subtitle={copy.ui.subtitle}
        icon={<Shield className="w-5 h-5" />}
        accentColor="rose"
        ageGroup={ageGroup}
        currentStep={matched.length}
        totalSteps={pairCount}
        score={score}
        streak={streak}
        accuracy={moves > 0 ? efficiency : undefined}
      />

      <div className="text-xs font-bold text-slate-500 text-right tabular-nums px-1">
        {copy.ui.movesLabel} <strong className="text-slate-800">{moves}</strong>
      </div>

      {/* Adaptive Card Grid */}
      <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
        {deck.map((card) => {
          const isRevealed = flipped.includes(card.id) || matched.includes(card.pairId);
          const isSolved = matched.includes(card.pairId);

          return (
            <motion.button
              key={card.id}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCardClick(card)}
              className={`min-h-[86px] sm:min-h-[96px] rounded-2xl border-2 transition-all flex flex-col items-center justify-center p-1.5 cursor-pointer shadow-xs text-center ${
                isSolved
                  ? 'bg-emerald-50 border-emerald-400'
                  : isRevealed
                  ? 'bg-white border-rose-400'
                  : 'bg-gradient-to-br from-rose-500 to-pink-600 border-rose-600 text-white hover:brightness-105'
              }`}
            >
              {isRevealed ? (
                <div className="flex flex-col items-center gap-1">
                  {renderIcon(card.iconKey)}
                  <span className="text-[10px] sm:text-[11px] font-black text-slate-800 leading-tight line-clamp-2">
                    {card.label}
                  </span>
                </div>
              ) : (
                <span className="text-sm sm:text-base font-black opacity-75">CK</span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
