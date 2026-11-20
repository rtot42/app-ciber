import React, { useState, useMemo } from 'react';
import { Lock, Unlock, ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { ChildAgeGroup, GameResultStats } from '../../types';
import { GameHud, GameVictorySummary } from './GameShell';
import { computeStars } from '../../utils/ageDifficulty';
import { playGameSound } from '../../utils/gameAudio';

interface PuzzleVaultGameProps {
  onComplete: (stats?: GameResultStats) => void;
  ageGroup?: ChildAgeGroup;
}

interface CryptexClue {
  id: string;
  prompt: string;
  options: string[];
  correctIdx: number;
}

export const PuzzleVaultGame: React.FC<PuzzleVaultGameProps> = ({
  onComplete,
  ageGroup = '8–10' as ChildAgeGroup,
}) => {
  const { language } = useLanguage();

  const copy = useMemo(() => {
    const esClues: CryptexClue[] = [
      {
        id: 'c1',
        prompt: 'Cilindro 1 · Longitud mínima segura para una contraseña:',
        options: ['4', '6', '12+', '8'],
        correctIdx: 2,
      },
      {
        id: 'c2',
        prompt: 'Cilindro 2 · Protocolo web cifrado con candado:',
        options: ['HTTP', 'FTP', 'HTTPS', 'RAW'],
        correctIdx: 2,
      },
      {
        id: 'c3',
        prompt: 'Cilindro 3 · Escudo extra además de tu contraseña:',
        options: ['1 Paso', '2FA', 'Sin Clave', 'Auto-Login'],
        correctIdx: 1,
      },
      {
        id: 'c4',
        prompt: 'Cilindro 4 · Dónde hacer copias contra ransomware:',
        options: ['Nube Cifrada', 'Chat Público', 'Papelera', 'USB Ajeno'],
        correctIdx: 0,
      },
      {
        id: 'c5',
        prompt: 'Cilindro 5 · Qué parte de la URL indica el dueño real:',
        options: ['Emoji', 'Color', 'Dominio Raíz', 'Ruta /end'],
        correctIdx: 2,
      },
    ];

    const frClues: CryptexClue[] = [
      {
        id: 'c1',
        prompt: 'Cylindre 1 · Longueur sûre d’une phrase secrète :',
        options: ['4', '6', '12+', '8'],
        correctIdx: 2,
      },
      {
        id: 'c2',
        prompt: 'Cylindre 2 · Protocole web chiffré avec cadenas :',
        options: ['HTTP', 'FTP', 'HTTPS', 'RAW'],
        correctIdx: 2,
      },
      {
        id: 'c3',
        prompt: 'Cylindre 3 · Bouclier en plus du mot de passe :',
        options: ['1 Étape', '2FA', 'Sans Code', 'Auto-Login'],
        correctIdx: 1,
      },
      {
        id: 'c4',
        prompt: 'Cylindre 4 · Où sauvegarder contre les rançongiciels :',
        options: ['Cloud Chiffré', 'Chat Public', 'Corbeille', 'Clé Inconnue'],
        correctIdx: 0,
      },
      {
        id: 'c5',
        prompt: 'Cylindre 5 · Partie de l’URL montrant le vrai propriétaire :',
        options: ['Émoji', 'Couleur', 'Domaine Racine', 'Chemin /fin'],
        correctIdx: 2,
      },
    ];

    const enClues: CryptexClue[] = [
      {
        id: 'c1',
        prompt: 'Tumbler 1 · Recommended passphrase length:',
        options: ['4', '6', '12+', '8'],
        correctIdx: 2,
      },
      {
        id: 'c2',
        prompt: 'Tumbler 2 · Encrypted web protocol with padlock:',
        options: ['HTTP', 'FTP', 'HTTPS', 'RAW'],
        correctIdx: 2,
      },
      {
        id: 'c3',
        prompt: 'Tumbler 3 · Extra login defense beyond passwords:',
        options: ['1 Step', '2FA', 'No Key', 'Auto-Login'],
        correctIdx: 1,
      },
      {
        id: 'c4',
        prompt: 'Tumbler 4 · Safest backup against ransomware:',
        options: ['Encrypted Cloud', 'Public Chat', 'Trash Bin', 'Found USB'],
        correctIdx: 0,
      },
      {
        id: 'c5',
        prompt: 'Tumbler 5 · Part of a URL proving real ownership:',
        options: ['Emoji', 'Color', 'Root Domain', 'End Path'],
        correctIdx: 2,
      },
    ];

    const pool = language === 'fr' ? frClues : language === 'en' ? enClues : esClues;
    const count = ageGroup === '13–14' ? 5 : ageGroup === '11–12' ? 4 : 3;
    const clues = pool.slice(0, count);

    const labels = {
      es: {
        title: 'La Bóveda de Enigmas',
        subtitle: `Alinea ${count} cilindros criptográficos para abrirla`,
        vaultUnlocked: '¡Combinación Maestra Verificada!',
        vaultLocked: (n: number, tot: number) => `${n} de ${tot} cilindros alineados`,
        unlockBtn: 'Probar Combinación y Abrir Bóveda',
        wrongMsg:
          'Alguno de los cilindros no coincide con las reglas de ciberseguridad. ¡Revisa cada pista!',
        takeaway:
          'Recordar los fundamentos —contraseñas de 12+ caracteres, HTTPS, 2FA, copias cifradas y verificar el dominio raíz— mantiene tu bóveda digital impenetrable.',
      },
      fr: {
        title: 'Le Coffre aux Énigmes',
        subtitle: `Aligne ${count} cylindres pour déverrouiller`,
        vaultUnlocked: 'Combinaison Maîtresse Validée !',
        vaultLocked: (n: number, tot: number) => `${n} cylindre(s) sur ${tot} validés`,
        unlockBtn: 'Tester la Combinaison & Ouvrir',
        wrongMsg:
          'Au moins un cylindre ne respecte pas les règles de sécurité. Vérifie chaque indice !',
        takeaway:
          'Les piliers cyber — 12+ caractères, HTTPS, 2FA, sauvegarde chiffrée et domaine racine — gardent ton coffre verrouillé face aux pirates.',
      },
      en: {
        title: 'The Enigma Cryptex Vault',
        subtitle: `Align all ${count} security tumblers to unlock`,
        vaultUnlocked: 'Master Combination Verified!',
        vaultLocked: (n: number, tot: number) => `${n} of ${tot} tumblers aligned`,
        unlockBtn: 'Test Combination & Unlock Vault',
        wrongMsg:
          'One or more tumblers do not match cybersecurity best practices. Re-check each clue!',
        takeaway:
          'Core security habits — 12+ char passphrases, HTTPS encryption, 2FA, encrypted backups, and verifying root domains — keep your vault unbreakable.',
      },
    }[language];

    return { clues, labels };
  }, [ageGroup, language]);

  const [dials, setDials] = useState<number[]>(() => copy.clues.map(() => 0));
  const [attempts, setAttempts] = useState(0);
  const [errorHint, setErrorHint] = useState(false);
  const [finished, setFinished] = useState(false);

  const alignedCount = copy.clues.filter((c, i) => dials[i] === c.correctIdx).length;
  const isUnlocked = alignedCount === copy.clues.length;

  const setDial = (index: number, optIdx: number) => {
    playGameSound('tap');
    setErrorHint(false);
    setDials((prev) => {
      const next = [...prev];
      next[index] = optIdx;
      return next;
    });
  };

  const handleAttemptUnlock = () => {
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    if (!isUnlocked) {
      playGameSound('wrong');
      setErrorHint(true);
      return;
    }
    playGameSound('win');
    setFinished(true);
  };

  const handleReplay = () => {
    setDials(copy.clues.map(() => 0));
    setAttempts(0);
    setErrorHint(false);
    setFinished(false);
  };

  if (finished) {
    const accuracy = Math.max(60, Math.round((1 / Math.max(1, attempts)) * 100));
    const score = copy.clues.length * 110 + (attempts === 1 ? 150 : 50);
    const stats: GameResultStats = {
      stars: computeStars(accuracy, ageGroup),
      accuracy,
      score,
      streakMax: alignedCount,
      ageGroup,
    };
    return (
      <div className="flex-1 min-h-0 w-full flex flex-col p-4 sm:p-6 bg-slate-50 overflow-y-auto scrollbar-none">
        <GameVictorySummary
          title={copy.labels.title}
          takeaway={copy.labels.takeaway}
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
        title={copy.labels.title}
        subtitle={copy.labels.subtitle}
        icon={<Lock className="w-5 h-5" />}
        accentColor="amber"
        ageGroup={ageGroup}
        currentStep={alignedCount}
        totalSteps={copy.clues.length}
        score={alignedCount * 110}
        streak={alignedCount}
      />

      {/* Cryptex Lock Core Graphic */}
      <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all shrink-0 ${
              isUnlocked
                ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                : 'border-amber-300 bg-amber-50 text-amber-600'
            }`}
          >
            {isUnlocked ? <Unlock className="w-7 h-7" /> : <Lock className="w-7 h-7" />}
          </div>
          <div>
            <div className="text-sm font-black text-slate-900">
              {isUnlocked ? copy.labels.vaultUnlocked : copy.labels.vaultLocked(alignedCount, copy.clues.length)}
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              {copy.clues.map((c, idx) => (
                <span
                  key={c.id}
                  className={`w-6 h-2 rounded-full transition-colors ${
                    dials[idx] === c.correctIdx ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        {isUnlocked && <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />}
      </div>

      {/* Rotating Tumblers */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-200/80 space-y-4">
        {copy.clues.map((clue, cIdx) => (
          <div key={clue.id} className="space-y-1.5">
            <div className="text-xs font-bold text-slate-700">{clue.prompt}</div>
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-2xl">
              {clue.options.map((opt, oIdx) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setDial(cIdx, oIdx)}
                  className={`py-2.5 px-1 rounded-xl text-[11px] sm:text-xs font-black transition cursor-pointer truncate ${
                    dials[cIdx] === oIdx
                      ? 'bg-white text-slate-900 shadow-xs ring-1 ring-amber-300'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {errorHint && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-xs sm:text-sm font-bold text-amber-950 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>{copy.labels.wrongMsg}</span>
        </div>
      )}

      <button
        type="button"
        onClick={handleAttemptUnlock}
        className={`w-full py-4 rounded-2xl font-black text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] ${
          isUnlocked
            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20'
            : 'bg-slate-800 text-white hover:bg-slate-900'
        }`}
      >
        <ShieldCheck className="w-5 h-5" />
        <span>{copy.labels.unlockBtn}</span>
      </button>
    </div>
  );
};
