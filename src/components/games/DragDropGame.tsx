import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Package, ShieldCheck, Plus, X, AlertTriangle, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { ChildAgeGroup, GameResultStats } from '../../types';
import { GameHud, GameVictorySummary } from './GameShell';
import { computeStars } from '../../utils/ageDifficulty';
import { playGameSound } from '../../utils/gameAudio';

interface DragDropGameProps {
  onComplete: (stats?: GameResultStats) => void;
  ageGroup?: ChildAgeGroup;
}

interface Block {
  id: string;
  label: string;
  isSafe: boolean;
  reason: string;
}

interface Wave {
  id: string;
  title: string;
  prompt: string;
  needed: number;
  blocks: Block[];
}

export const DragDropGame: React.FC<DragDropGameProps> = ({
  onComplete,
  ageGroup = '8–10' as ChildAgeGroup,
}) => {
  const { language } = useLanguage();

  const copy = useMemo(() => {
    const buildWaves = (): Wave[] => {
      if (language === 'fr') {
        const w1: Wave = {
          id: 'w1',
          title: 'Vague 1 · Briques de Mot de Passe',
          prompt: 'Ajoute 3 blocs solides pour verrouiller ton coffre.',
          needed: 3,
          blocks: [
            { id: 'b1', label: 'ChateauBleu', isSafe: true, reason: 'Mot secret fort !' },
            { id: 'b2', label: '123456', isSafe: false, reason: '"123456" est cassé en moins d’une seconde.' },
            { id: 'b3', label: '#99!Pixel', isSafe: true, reason: 'Combinaison de symboles solide.' },
            { id: 'b4', label: 'password', isSafe: false, reason: 'Mot du dictionnaire ultra courant.' },
            { id: 'b5', label: 'DragonFeu', isSafe: true, reason: 'Mot unique facile à retenir.' },
            { id: 'b6', label: 'Lucas2026', isSafe: false, reason: 'Prénom + année = devinette facile.' },
          ],
        };
        const w2: Wave = {
          id: 'w2',
          title: 'Vague 2 · Couches de Protection',
          prompt: 'Sélectionne 3 défenses fiables pour ton appareil.',
          needed: 3,
          blocks: [
            { id: 'n1', label: 'Code 2FA', isSafe: true, reason: 'La double authentification bloque les intrus.' },
            { id: 'n2', label: 'APK Craqué', isSafe: false, reason: 'Les applis piratées cachent souvent des virus.' },
            { id: 'n3', label: 'Mises à jour Auto', isSafe: true, reason: 'Corrige les failles dès leur découverte.' },
            { id: 'n4', label: 'Wi-Fi Ouvert', isSafe: false, reason: 'Un Wi-Fi public sans mot de passe expose tes données.' },
            { id: 'n5', label: 'Sauvegarde Chiffrée', isSafe: true, reason: 'Protège tes photos contre les rançongiciels.' },
          ],
        };
        const w3: Wave = {
          id: 'w3',
          title: 'Vague 3 · Pare-feu Pro',
          prompt: 'Active 3 modules authentiques de sécurité réseau.',
          needed: 3,
          blocks: [
            { id: 'p1', label: 'Filtre DNS Sûr', isSafe: true, reason: 'Bloque les domaines malveillants connus.' },
            { id: 'p2', label: 'Lien Nitro Gratuit', isSafe: false, reason: 'Piège d’hameçonnage très courant.' },
            { id: 'p3', label: 'Gestionnaire de Clés', isSafe: true, reason: 'Garde un mot de passe unique par site.' },
            { id: 'p4', label: 'Clé USB Trouvée', isSafe: false, reason: 'Une clé inconnue peut exécuter un logiciel malveillant.' },
            { id: 'p5', label: 'Contrôle des Accès', isSafe: true, reason: 'Limite les permissions des applications.' },
          ],
        };
        return ageGroup === '13–14' ? [w1, w2, w3] : ageGroup === '11–12' ? [w1, w2] : [w1];
      }

      if (language === 'en') {
        const w1: Wave = {
          id: 'w1',
          title: 'Wave 1 · Passphrase Vault Blocks',
          prompt: 'Add 3 strong blocks to seal your secret vault.',
          needed: 3,
          blocks: [
            { id: 'b1', label: 'BlueCastle', isSafe: true, reason: 'Great memorable secret word!' },
            { id: 'b2', label: '123456', isSafe: false, reason: '"123456" is cracked in under a second.' },
            { id: 'b3', label: '#99!Pixel', isSafe: true, reason: 'Strong symbol & digit mix.' },
            { id: 'b4', label: 'password', isSafe: false, reason: 'Top dictionary password hackers try first.' },
            { id: 'b5', label: 'FireDragon', isSafe: true, reason: 'Strong uncommon word block.' },
            { id: 'b6', label: 'Lucas2026', isSafe: false, reason: 'Your name + current year is easy to guess.' },
          ],
        };
        const w2: Wave = {
          id: 'w2',
          title: 'Wave 2 · Device Defense Stack',
          prompt: 'Pick 3 real security layers for your tablet or PC.',
          needed: 3,
          blocks: [
            { id: 'n1', label: '2FA Authenticator', isSafe: true, reason: 'Second login factor stops stolen passwords.' },
            { id: 'n2', label: 'Cracked Game APK', isSafe: false, reason: 'Pirated installers often bundle hidden malware.' },
            { id: 'n3', label: 'Auto Security Updates', isSafe: true, reason: 'Patches known software flaws right away.' },
            { id: 'n4', label: 'Public Open Wi-Fi', isSafe: false, reason: 'Unencrypted hotspots leave traffic exposed.' },
            { id: 'n5', label: 'Encrypted Backup', isSafe: true, reason: 'Keeps your files safe from ransomware.' },
          ],
        };
        const w3: Wave = {
          id: 'w3',
          title: 'Wave 3 · Pro Firewall Rules',
          prompt: 'Equip 3 authentic pro network defenses.',
          needed: 3,
          blocks: [
            { id: 'p1', label: 'Safe DNS Filter', isSafe: true, reason: 'Blocks known phishing & malware domains.' },
            { id: 'p2', label: 'Free Nitro Promo Link', isSafe: false, reason: 'Common account-stealing bait.' },
            { id: 'p3', label: 'Password Manager', isSafe: true, reason: 'Generates a unique key for every account.' },
            { id: 'p4', label: 'Random Found USB', isSafe: false, reason: 'Unknown USB drives can auto-load malware.' },
            { id: 'p5', label: 'App Permission Audit', isSafe: true, reason: 'Prevents silent camera/GPS tracking.' },
          ],
        };
        return ageGroup === '13–14' ? [w1, w2, w3] : ageGroup === '11–12' ? [w1, w2] : [w1];
      }

      // Spanish
      const w1: Wave = {
        id: 'w1',
        title: 'Oleada 1 · Bloques de Contraseña',
        prompt: 'Deposita 3 bloques seguros en tu bóveda.',
        needed: 3,
        blocks: [
          { id: 'b1', label: 'CastilloAzul', isSafe: true, reason: '¡Palabra secreta difícil de adivinar!' },
          { id: 'b2', label: '123456', isSafe: false, reason: '"123456" se descifra en menos de un segundo.' },
          { id: 'b3', label: '#99!Pixel', isSafe: true, reason: 'Excelente mezcla de símbolos y números.' },
          { id: 'b4', label: 'password', isSafe: false, reason: 'Primera palabra que prueban todos los robots.' },
          { id: 'b5', label: 'DragonFuego', isSafe: true, reason: 'Gran bloque único para tu frase clave.' },
          { id: 'b6', label: 'Lucas2026', isSafe: false, reason: 'Tu nombre + año actual es demasiado obvio.' },
        ],
      };
      const w2: Wave = {
        id: 'w2',
        title: 'Oleada 2 · Escudos del Dispositivo',
        prompt: 'Elige 3 defensas reales para blindar tu equipo.',
        needed: 3,
        blocks: [
          { id: 'n1', label: 'Código 2FA', isSafe: true, reason: 'La doble verificación frena accesos robados.' },
          { id: 'n2', label: 'APK Pirata Gratis', isSafe: false, reason: 'Las descargas modificadas suelen traer virus.' },
          { id: 'n3', label: 'Parches Automáticos', isSafe: true, reason: 'Cierran fallos de seguridad al instante.' },
          { id: 'n4', label: 'Wi-Fi Abierto Sin Clave', isSafe: false, reason: 'Cualquiera en la red puede espiar sesiones.' },
          { id: 'n5', label: 'Copia Cifrada', isSafe: true, reason: 'Salva tus archivos ante fallos o secuestros.' },
        ],
      };
      const w3: Wave = {
        id: 'w3',
        title: 'Oleada 3 · Módulos de Cortafuegos Pro',
        prompt: 'Instala 3 defensas avanzadas de red y privacidad.',
        needed: 3,
        blocks: [
          { id: 'p1', label: 'Filtro DNS Seguro', isSafe: true, reason: 'Bloquea dominios de phishing y malware.' },
          { id: 'p2', label: 'Link Nitro Gratis', isSafe: false, reason: 'Trampa clásica para robar tu sesión.' },
          { id: 'p3', label: 'Gestor de Claves', isSafe: true, reason: 'Permite usar una clave distinta por cada sitio.' },
          { id: 'p4', label: 'USB Encontrado', isSafe: false, reason: 'Un pendrive desconocido puede ejecutar código malicioso.' },
          { id: 'p5', label: 'Auditoría de Permisos', isSafe: true, reason: 'Frena accesos ocultos a micrófono o GPS.' },
        ],
      };
      return ageGroup === '13–14' ? [w1, w2, w3] : ageGroup === '11–12' ? [w1, w2] : [w1];
    };

    const waves = buildWaves();
    const labels = {
      es: {
        title: 'Constructor de Bóveda y Cortafuegos',
        vaultEmpty: 'Toca los 3 bloques seguros de abajo para ensamblar esta capa',
        availableTitle: 'Bloques disponibles:',
        nextWave: 'Siguiente Capa',
        finishWave: 'Finalizar Ensamblaje',
        takeaway:
          'Una defensa digital real combina bloques fuertes (palabras únicas + símbolos), parches automáticos, 2FA y cero descargas piratas.',
      },
      fr: {
        title: 'Assembleur Coffre & Pare-feu',
        vaultEmpty: 'Touche les 3 blocs sûrs ci-dessous pour assembler cette couche',
        availableTitle: 'Blocs disponibles :',
        nextWave: 'Couche Suivante',
        finishWave: 'Terminer l’Assemblage',
        takeaway:
          'Une vraie défense numérique réunit des mots de passe solides, des mises à jour automatiques, la 2FA et zéro téléchargement piraté.',
      },
      en: {
        title: 'Vault & Firewall Builder',
        vaultEmpty: 'Tap the 3 secure blocks below to assemble this defense layer',
        availableTitle: 'Available modules:',
        nextWave: 'Next Layer',
        finishWave: 'Finish Assembly',
        takeaway:
          'Strong cyber defense layers unique passphrase blocks, auto-updates, 2FA, and strict avoidance of pirated files or mystery USBs.',
      },
    }[language];

    return { waves, labels };
  }, [ageGroup, language]);

  const [waveIdx, setWaveIdx] = useState(0);
  const [vaultBlocks, setVaultBlocks] = useState<Block[]>([]);
  const [warning, setWarning] = useState<string | null>(null);
  const [wrongPicks, setWrongPicks] = useState(0);
  const [totalSafePicked, setTotalSafePicked] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(1);
  const [finished, setFinished] = useState(false);

  const currentWave = copy.waves[waveIdx];
  const availableBlocks = currentWave.blocks.filter(
    (b) => !vaultBlocks.some((v) => v.id === b.id)
  );
  const isWaveComplete = vaultBlocks.length >= currentWave.needed;

  const addBlock = (block: Block) => {
    if (isWaveComplete) return;
    if (!block.isSafe) {
      setWrongPicks((w) => w + 1);
      setStreak(0);
      setWarning(block.reason);
      playGameSound('wrong');
      return;
    }

    const nextStreak = streak + 1;
    setWarning(null);
    setVaultBlocks((prev) => [...prev, block]);
    setTotalSafePicked((t) => t + 1);
    setStreak(nextStreak);
    setMaxStreak((m) => Math.max(m, nextStreak));
    setScore((s) => s + 100 + nextStreak * 15);
    playGameSound(nextStreak > 1 ? 'combo' : 'correct');
  };

  const removeBlock = (block: Block) => {
    playGameSound('tap');
    setVaultBlocks((prev) => prev.filter((b) => b.id !== block.id));
  };

  const handleAdvanceWave = () => {
    if (!isWaveComplete) return;
    if (waveIdx < copy.waves.length - 1) {
      playGameSound('tap');
      setWaveIdx((w) => w + 1);
      setVaultBlocks([]);
      setWarning(null);
    } else {
      playGameSound('win');
      setFinished(true);
    }
  };

  const handleReplay = () => {
    setWaveIdx(0);
    setVaultBlocks([]);
    setWarning(null);
    setWrongPicks(0);
    setTotalSafePicked(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(1);
    setFinished(false);
  };

  const totalNeeded = copy.waves.reduce((acc, w) => acc + w.needed, 0);
  const accuracy =
    totalSafePicked + wrongPicks > 0
      ? Math.round((totalSafePicked / (totalSafePicked + wrongPicks)) * 100)
      : 100;

  if (finished) {
    const finalAcc = Math.max(
      40,
      Math.round((totalNeeded / (totalNeeded + wrongPicks)) * 100)
    );
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
    <div className="flex-1 min-h-0 w-full max-w-full flex flex-col p-2.5 sm:p-4 bg-slate-50 text-slate-800 select-none overflow-y-auto overflow-x-hidden scrollbar-none gap-2.5 sm:gap-3 pb-4">
      <GameHud
        title={copy.labels.title}
        subtitle={currentWave.title}
        icon={<Package className="w-5 h-5" />}
        accentColor="indigo"
        ageGroup={ageGroup}
        currentStep={waveIdx + 1}
        totalSteps={copy.waves.length}
        score={score}
        streak={streak}
        accuracy={totalSafePicked + wrongPicks > 0 ? accuracy : undefined}
      />

      {warning && (
        <div className="p-3 bg-amber-50 border border-amber-300 rounded-2xl text-xs sm:text-sm font-semibold text-amber-950 flex items-start gap-2 shrink-0">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>{warning}</span>
        </div>
      )}

      {/* Vault Assembly Drop Zone */}
      <div className="flex-1 min-h-[140px] bg-white rounded-3xl p-4 sm:p-5 shadow-xs border-2 border-dashed border-indigo-300 gap-3 flex flex-col justify-center">
        <div className="text-xs sm:text-sm font-semibold text-indigo-700 text-center tabular-nums">
          {currentWave.prompt} ({vaultBlocks.length}/{currentWave.needed})
        </div>

        {vaultBlocks.length === 0 ? (
          <div className="text-center text-xs sm:text-sm text-slate-400 py-3">
            {copy.labels.vaultEmpty}
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-2">
            {vaultBlocks.map((b) => (
              <motion.div
                key={b.id}
                initial={{ scale: 0.85 }}
                animate={{ scale: 1 }}
                className="px-3.5 py-2 rounded-2xl bg-indigo-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs"
              >
                <span>{b.label}</span>
                <button
                  type="button"
                  onClick={() => removeBlock(b)}
                  className="w-5 h-5 rounded-full bg-indigo-700 hover:bg-indigo-800 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Candidate Modules Pool */}
      <div className="flex-1 min-h-[130px] bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-200/80 flex flex-col justify-center gap-3">
        <div className="text-xs sm:text-sm font-semibold text-slate-600">{copy.labels.availableTitle}</div>
        <div className="flex flex-wrap gap-2">
          {availableBlocks.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => addBlock(b)}
              disabled={isWaveComplete}
              className="px-3.5 py-2.5 min-h-[44px] rounded-2xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 text-slate-800 text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Plus className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>{b.label}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleAdvanceWave}
        disabled={!isWaveComplete}
        className={`w-full py-3.5 min-h-[48px] shrink-0 rounded-2xl font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer ${
          isWaveComplete
            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-400 hover:to-purple-500 active:scale-[0.98]'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
        }`}
      >
        <ShieldCheck className="w-5 h-5" />
        <span>
          {waveIdx < copy.waves.length - 1 ? copy.labels.nextWave : copy.labels.finishWave}
        </span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};
