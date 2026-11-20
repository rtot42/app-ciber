import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  KeyRound,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Eye,
  EyeOff,
  Check,
  AlertTriangle,
  Smartphone,
  Cpu,
} from 'lucide-react';
import { CiberMascot } from '../CiberMascot';
import { useLanguage } from '../../i18n/LanguageContext';
import { ChildAgeGroup, GameResultStats } from '../../types';
import { GameHud, GameVictorySummary } from './GameShell';
import { computeStars } from '../../utils/ageDifficulty';
import { playGameSound } from '../../utils/gameAudio';

interface PasswordForgeGameProps {
  onComplete: (stats?: GameResultStats) => void;
  ageGroup?: ChildAgeGroup;
}

const WEAK_PATTERNS = [
  '1234',
  'qwerty',
  'password',
  'contraseña',
  'admin',
  'roblox',
  'fortnite',
  'lucas',
  'p@ssw0rd',
  '2025',
  '2026',
];

export const PasswordForgeGame: React.FC<PasswordForgeGameProps> = ({
  onComplete,
  ageGroup = '8–10' as ChildAgeGroup,
}) => {
  const { language } = useLanguage();

  const totalStages = ageGroup === '8–10' ? 1 : 2;
  const minLength = ageGroup === '13–14' ? 14 : ageGroup === '11–12' ? 11 : 9;

  const [stage, setStage] = useState(0);
  const [password, setPassword] = useState(ageGroup === '8–10' ? 'Sol2026' : '');
  const [firstForged, setFirstForged] = useState<string>('');
  const [showPassword, setShowPassword] = useState(true);
  const [twoFaEnabled, setTwoFaEnabled] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(1);
  const [finished, setFinished] = useState(false);

  const copy = useMemo(() => {
    const wordsByAge = {
      '8–10':
        language === 'fr'
          ? ['Dragon', 'Nuage', 'Fusée', 'Dauphin', 'Étoile', 'Pixel']
          : language === 'en'
          ? ['Dragon', 'Cloud', 'Rocket', 'Dolphin', 'Comet', 'Pixel']
          : ['Dragón', 'Nube', 'Cohete', 'Delfín', 'Cometa', 'Pixel'],
      '11–12':
        language === 'fr'
          ? ['Titan', 'Vortex', 'Forteresse', 'Cosmos', 'Aurore', 'Glacier']
          : language === 'en'
          ? ['Titan', 'Vortex', 'Fortress', 'Cosmos', 'Aurora', 'Glacier']
          : ['Titán', 'Vórtice', 'Fortaleza', 'Cosmos', 'Aurora', 'Glaciar'],
      '13–14':
        language === 'fr'
          ? ['Quantique', 'Nébuleuse', 'Bouclier', 'Horloge', 'Éclipse', 'Prisme']
          : language === 'en'
          ? ['Quantum', 'Nebula', 'Bastion', 'Cipher', 'Eclipse', 'Prism']
          : ['Cuántico', 'Nebulosa', 'Bastión', 'Cifrado', 'Eclipse', 'Prisma'],
    };

    const stageTargets = {
      es: [
        ageGroup === '8–10' ? 'Bóveda Principal de Juegos' : 'Cuenta de Videojuegos',
        'Correo Personal y Nube (Clave Única)',
      ],
      fr: [
        ageGroup === '8–10' ? 'Coffre Principal de Jeux' : 'Compte Jeux Vidéo',
        'Messagerie & Cloud (Clé Unique)',
      ],
      en: [
        ageGroup === '8–10' ? 'Main Gaming Vault' : 'Gaming Account',
        'Personal Email & Cloud (Unique Key)',
      ],
    }[language];

    const labels = {
      es: {
        title: 'La Forja de Contraseñas',
        subtitle:
          ageGroup === '13–14'
            ? `2 claves únicas de ${minLength}+ caracteres + 2FA`
            : ageGroup === '11–12'
            ? `2 cuentas con claves únicas de ${minLength}+ caracteres`
            : `Crea una frase secreta de ${minLength}+ caracteres`,
        combineBtn: 'Mezclar',
        digitalLock: 'Forjando llave para:',
        placeholder: 'Escribe o combina bloques...',
        armorLevel: 'Blindaje:',
        timeToBreak: 'Fuerza bruta:',
        entropyLabel: 'Entropía:',
        weakWarning: 'Contiene patrón predecible ("1234", "2026", "password"...) fácil de romper.',
        reuseWarning: '¡Nunca reutilices la misma clave que en la cuenta anterior!',
        twoFaTitle: 'Autenticación en 2 Pasos (2FA)',
        twoFaDesc: 'Activa el segundo código antes de sellar el correo.',
        reqLength: `${minLength}+ caracteres`,
        reqUpperLower: 'Mayúsculas y minúsculas',
        reqNumber: 'Números (0-9)',
        reqSymbol: 'Símbolos (@, #, !, $)',
        quickAddTitle: 'Toca bloques para construir tu frase secreta:',
        forgeNextBtn: 'Guardar Clave 1 y Pasar a Cuenta 2',
        forgeFinalBtn: '¡Forjar y Sellar Bóveda!',
        needMoreBtn: 'Completa todos los requisitos para sellar',
        weak: 'Débil',
        regular: 'Media',
        strong: 'Fuerte',
        legendary: '¡Blindada!',
        timeWeak: '2 segundos',
        timeRegular: '6 horas',
        timeStrong: '14 años',
        timeLegendary: '120.000 años',
        takeaway:
          'Usa frases largas de 3 palabras inesperadas con símbolos y números, jamás repitas contraseñas entre cuentas y activa siempre 2FA.',
      },
      fr: {
        title: 'La Forge de Mots de Passe',
        subtitle:
          ageGroup === '13–14'
            ? `2 clés uniques de ${minLength}+ car. + 2FA obligatoire`
            : ageGroup === '11–12'
            ? `2 comptes avec clés uniques (${minLength}+ car.)`
            : `Crée une phrase secrète de ${minLength}+ caractères`,
        combineBtn: 'Générer',
        digitalLock: 'Clé en cours pour :',
        placeholder: 'Écris ou ajoute des blocs...',
        armorLevel: 'Blindage :',
        timeToBreak: 'Force brute :',
        entropyLabel: 'Entropie :',
        weakWarning: 'Contient un motif courant ("1234", "2026", "password"...) trop facile à casser.',
        reuseWarning: 'Ne réutilise jamais le même mot de passe d’un compte à l’autre !',
        twoFaTitle: 'Double Authentification (2FA)',
        twoFaDesc: 'Active la vérification en 2 étapes avant de verrouiller.',
        reqLength: `${minLength}+ caractères`,
        reqUpperLower: 'Majuscules & minuscules',
        reqNumber: 'Chiffres (0-9)',
        reqSymbol: 'Symboles (@, #, !, $)',
        quickAddTitle: 'Touche les blocs pour assembler ta phrase :',
        forgeNextBtn: 'Valider Clé 1 → Compte 2',
        forgeFinalBtn: 'Forger & Verrouiller !',
        needMoreBtn: 'Remplis tous les critères de sécurité',
        weak: 'Faible',
        regular: 'Moyen',
        strong: 'Fort',
        legendary: 'Blindé !',
        timeWeak: '2 secondes',
        timeRegular: '6 heures',
        timeStrong: '14 ans',
        timeLegendary: '120 000 ans',
        takeaway:
          'Choisis des phrases longues de 3 mots uniques avec chiffres et symboles, n’utilise jamais le même mot de passe deux fois et active la 2FA.',
      },
      en: {
        title: 'The Password Forge',
        subtitle:
          ageGroup === '13–14'
            ? `2 unique ${minLength}+ char passphrases + 2FA`
            : ageGroup === '11–12'
            ? `2 separate accounts · ${minLength}+ chars each`
            : `Forge a ${minLength}+ char secret passphrase`,
        combineBtn: 'Mix',
        digitalLock: 'Forging key for:',
        placeholder: 'Type or tap blocks below...',
        armorLevel: 'Armor:',
        timeToBreak: 'Crack time:',
        entropyLabel: 'Entropy:',
        weakWarning: 'Contains a predictable pattern ("1234", "2026", "password"...) attackers try first.',
        reuseWarning: 'Never reuse your previous password across different accounts!',
        twoFaTitle: 'Two-Factor Authentication (2FA)',
        twoFaDesc: 'Turn on the second verification step before sealing.',
        reqLength: `${minLength}+ characters`,
        reqUpperLower: 'Upper & lower case',
        reqNumber: 'Numbers (0-9)',
        reqSymbol: 'Symbols (@, #, !, $)',
        quickAddTitle: 'Tap blocks to build your passphrase:',
        forgeNextBtn: 'Lock Key 1 → Next Account',
        forgeFinalBtn: 'Forge & Seal Vault!',
        needMoreBtn: 'Complete every security check above',
        weak: 'Weak',
        regular: 'Moderate',
        strong: 'Strong',
        legendary: 'Unbreakable!',
        timeWeak: '2 seconds',
        timeRegular: '6 hours',
        timeStrong: '14 years',
        timeLegendary: '120,000 years',
        takeaway:
          'Use unique multi-word passphrases with symbols and numbers, never reuse a password between your games and email, and turn on 2FA.',
      },
    }[language];

    return { words: wordsByAge[ageGroup], stageTargets, labels };
  }, [ageGroup, language, minLength]);

  const normalized = password.toLowerCase();
  const hasWeakPattern = WEAK_PATTERNS.some((pat) => normalized.includes(pat));
  const isReused =
    stage === 1 &&
    firstForged.length > 0 &&
    password.trim().toLowerCase() === firstForged.trim().toLowerCase();

  const hasLength = password.length >= minLength;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  const checks = [hasLength, hasUpper && hasLower, hasNumber, hasSymbol];
  const basePassed = checks.filter(Boolean).length;
  const needsTwoFa = ageGroup === '13–14' && stage === 1;
  const isStageValid =
    basePassed === 4 && !hasWeakPattern && !isReused && (!needsTwoFa || twoFaEnabled);

  // Simulated entropy bits
  const charsetSize =
    (hasLower ? 26 : 0) + (hasUpper ? 26 : 0) + (hasNumber ? 10 : 0) + (hasSymbol ? 32 : 0);
  const entropyBits =
    password.length > 0 && charsetSize > 0
      ? Math.max(8, Math.round(password.length * Math.log2(charsetSize)) - (hasWeakPattern ? 28 : 0))
      : 0;

  let strengthLabel = copy.labels.weak;
  let strengthColor = 'bg-rose-500';
  let crackTime = copy.labels.timeWeak;
  let meterPercent = password.length === 0 ? 5 : 22;

  if (hasWeakPattern || isReused) {
    strengthLabel = copy.labels.weak;
    strengthColor = 'bg-rose-500';
    crackTime = copy.labels.timeWeak;
    meterPercent = 25;
  } else if (basePassed === 2) {
    strengthLabel = copy.labels.regular;
    strengthColor = 'bg-amber-500';
    crackTime = copy.labels.timeRegular;
    meterPercent = 50;
  } else if (basePassed === 3) {
    strengthLabel = copy.labels.strong;
    strengthColor = 'bg-sky-500';
    crackTime = copy.labels.timeStrong;
    meterPercent = 78;
  } else if (basePassed === 4) {
    strengthLabel = copy.labels.legendary;
    strengthColor = 'bg-emerald-500';
    crackTime = copy.labels.timeLegendary;
    meterPercent = 100;
  }

  const sampleSymbols = ['#', '$', '!', '&', '?'];

  const addSnippet = (snippet: string) => {
    playGameSound('tap');
    setPassword((prev) => prev + snippet);
  };

  const handleGenerateMagic = () => {
    playGameSound('tap');
    const w1 = copy.words[Math.floor(Math.random() * copy.words.length)];
    let w2 = copy.words[Math.floor(Math.random() * copy.words.length)];
    if (w2 === w1) w2 = copy.words[(copy.words.indexOf(w1) + 1) % copy.words.length];
    const sym = sampleSymbols[Math.floor(Math.random() * sampleSymbols.length)];
    const num = Math.floor(31 + Math.random() * 68);
    let candidate = `${w1}${sym}${num}${w2}`;
    while (candidate.length < minLength) {
      candidate += `${sym}7`;
    }
    setPassword(candidate);
  };

  const handleSubmitStage = () => {
    setAttempts((a) => a + 1);
    if (!isStageValid) {
      setStreak(0);
      playGameSound('wrong');
      return;
    }

    const nextStreak = streak + 1;
    setStreak(nextStreak);
    setMaxStreak((m) => Math.max(m, nextStreak));
    setScore((s) => s + 180 + Math.min(80, entropyBits));

    if (stage < totalStages - 1) {
      playGameSound('correct');
      setFirstForged(password);
      setPassword('');
      setStage((s) => s + 1);
    } else {
      playGameSound('win');
      setFinished(true);
    }
  };

  const handleReplay = () => {
    setStage(0);
    setPassword(ageGroup === '8–10' ? 'Sol2026' : '');
    setFirstForged('');
    setTwoFaEnabled(false);
    setAttempts(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(1);
    setFinished(false);
  };

  if (finished) {
    const cleanAccuracy = Math.max(
      70,
      Math.round((totalStages / Math.max(totalStages, attempts)) * 100)
    );
    const stats: GameResultStats = {
      stars: computeStars(cleanAccuracy, ageGroup),
      accuracy: cleanAccuracy,
      score,
      streakMax: maxStreak,
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
        icon={<KeyRound className="w-5 h-5" />}
        accentColor="purple"
        ageGroup={ageGroup}
        currentStep={stage + 1}
        totalSteps={totalStages}
        score={score}
        streak={streak}
      />

      {/* Interactive Password Display Box */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {copy.labels.digitalLock}
            </div>
            <div className="text-sm font-black text-purple-800">
              {copy.stageTargets[stage]}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleGenerateMagic}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{copy.labels.combineBtn}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-500 hover:text-slate-700 cursor-pointer p-2 rounded-xl bg-slate-100"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={copy.labels.placeholder}
          className="w-full text-base sm:text-lg font-mono font-bold tracking-wider py-3 px-4 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-purple-500 focus:bg-white text-slate-900 outline-none transition"
        />

        {(hasWeakPattern || isReused) && (
          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{isReused ? copy.labels.reuseWarning : copy.labels.weakWarning}</span>
          </div>
        )}

        {/* Live Crack Time & Entropy */}
        <div className="space-y-1.5 pt-1">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold tabular-nums">
            <span className="text-slate-600 flex items-center gap-1.5">
              <span>{copy.labels.armorLevel}</span>
              <span
                className={
                  hasWeakPattern || isReused || basePassed < 2
                    ? 'text-rose-600 font-black'
                    : basePassed < 4
                    ? 'text-amber-600 font-black'
                    : 'text-emerald-600 font-black'
                }
              >
                {strengthLabel}
              </span>
            </span>
            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              {ageGroup !== '8–10' && (
                <span className="flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-purple-600" />
                  {copy.labels.entropyLabel} <strong className="text-slate-800">{entropyBits} bits</strong>
                </span>
              )}
              <span>
                {copy.labels.timeToBreak} <strong className="text-slate-800">{crackTime}</strong>
              </span>
            </div>
          </div>

          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${meterPercent}%` }}
              className={`h-full rounded-full ${strengthColor} transition-all duration-300`}
            />
          </div>
        </div>
      </div>

      {/* Criteria Checklist */}
      <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80 grid grid-cols-2 gap-2 text-xs">
        {[
          { ok: hasLength && !hasWeakPattern, label: `${copy.labels.reqLength} (${password.length})` },
          { ok: hasUpper && hasLower, label: copy.labels.reqUpperLower },
          { ok: hasNumber, label: copy.labels.reqNumber },
          { ok: hasSymbol, label: copy.labels.reqSymbol },
        ].map((item, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-2 p-2.5 rounded-xl border font-bold ${
              item.ok
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-slate-50 text-slate-500 border-slate-200'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center text-white shrink-0 ${
                item.ok ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            >
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </div>
            <span className="truncate">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Pro Stage 2FA Toggle (13-14) */}
      {needsTwoFa && (
        <button
          type="button"
          onClick={() => {
            playGameSound('tap');
            setTwoFaEnabled((v) => !v);
          }}
          className={`w-full p-4 rounded-2xl border-2 text-left flex items-center justify-between gap-3 transition cursor-pointer ${
            twoFaEnabled
              ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
              : 'bg-amber-50 border-amber-300 text-amber-950 hover:bg-amber-100/70'
          }`}
        >
          <div className="flex items-center gap-3">
            <Smartphone className="w-6 h-6 text-purple-600 shrink-0" />
            <div>
              <div className="text-xs sm:text-sm font-black">{copy.labels.twoFaTitle}</div>
              <div className="text-[11px] text-slate-600">{copy.labels.twoFaDesc}</div>
            </div>
          </div>
          <span
            className={`px-3 py-1.5 rounded-xl text-xs font-black ${
              twoFaEnabled ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border border-slate-300'
            }`}
          >
            {twoFaEnabled ? 'ON' : 'OFF'}
          </span>
        </button>
      )}

      {/* Quick Add Building Blocks */}
      <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80 space-y-2">
        <div className="text-xs font-bold text-slate-700">{copy.labels.quickAddTitle}</div>
        <div className="flex flex-wrap gap-1.5">
          {copy.words.map((word) => (
            <button
              key={word}
              type="button"
              onClick={() => addSnippet(word)}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 text-slate-700 hover:bg-purple-100 hover:text-purple-700 transition cursor-pointer active:scale-95"
            >
              +{word}
            </button>
          ))}
          {sampleSymbols.map((sym) => (
            <button
              key={sym}
              type="button"
              onClick={() => addSnippet(sym)}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-200 transition cursor-pointer active:scale-95"
            >
              +{sym}
            </button>
          ))}
          <button
            type="button"
            onClick={() => addSnippet(String(Math.floor(42 + Math.random() * 55)))}
            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-cyan-50 text-cyan-800 hover:bg-cyan-100 transition cursor-pointer active:scale-95"
          >
            +42
          </button>
        </div>
      </div>

      {/* Mascot + Action CTA */}
      <div className="flex items-center gap-3 p-3.5 bg-purple-50/70 rounded-2xl border border-purple-100">
        <CiberMascot size="sm" expression={isStageValid ? 'celebrating' : 'thinking'} className="shrink-0" />
        <p className="text-xs font-medium text-purple-950 leading-snug">
          {isStageValid
            ? stage < totalStages - 1
              ? copy.labels.forgeNextBtn
              : copy.labels.forgeFinalBtn
            : copy.labels.needMoreBtn}
        </p>
      </div>

      <button
        type="button"
        onClick={handleSubmitStage}
        disabled={!isStageValid}
        className={`w-full py-4 rounded-2xl font-black text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer ${
          isStageValid
            ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/25 hover:from-purple-400 hover:to-indigo-500 active:scale-[0.98]'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
        }`}
      >
        <Sparkles className="w-5 h-5" />
        <span>
          {isStageValid
            ? stage < totalStages - 1
              ? copy.labels.forgeNextBtn
              : copy.labels.forgeFinalBtn
            : copy.labels.needMoreBtn}
        </span>
      </button>
    </div>
  );
};
