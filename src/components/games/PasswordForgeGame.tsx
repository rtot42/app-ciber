import React, { useState } from 'react';
import { motion } from 'motion/react';
import { KeyRound, ShieldCheck, Sparkles, RefreshCw, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import { CiberMascot } from '../CiberMascot';
import { useLanguage } from '../../i18n/LanguageContext';
import { ChildAgeGroup } from '../../types';

interface PasswordForgeGameProps {
  onComplete: () => void;
  ageGroup?: ChildAgeGroup;
}

export const PasswordForgeGame: React.FC<PasswordForgeGameProps> = ({ onComplete, ageGroup = '8–10' }) => {
  const { language } = useLanguage();
  const [password, setPassword] = useState('Super@Sol92!');
  const [showPassword, setShowPassword] = useState(true);

  const getAgeMascotText = () => {
    if (ageGroup === '13–14') {
      if (language === 'en') return 'Ciber says: "Maximize digital entropy! Passphrases over 12 chars with mixed symbols resist brute-force dictionaries."';
      if (language === 'fr') return 'Ciber dit : "Maximise l’entropie numérique ! Les phrases de passe de 12+ caractères résistent aux attaques par dictionnaire."';
      return 'Ciber dice: "Maximiza la entropía digital. Las frases de contraseña de 12+ caracteres con símbolos son inmunes a ataques de fuerza bruta."';
    }
    if (ageGroup === '11–12') {
      if (language === 'en') return 'Ciber says: "Create a legendary gaming passphrase! Combine 3 or 4 unexpected words with numbers and symbols."';
      if (language === 'fr') return 'Ciber dit : "Crée une phrase de passe pour tes jeux ! Combine 3 ou 4 mots inattendus avec des chiffres et symboles."';
      return 'Ciber dice: "¡Crea una frase de paso para tus juegos! Combina 3 o 4 palabras inesperadas con números y símbolos secretos."';
    }
    if (language === 'en') return 'Ciber says: "The best passwords are funny 3-word stories you remember easily, but a robot could never guess!"';
    if (language === 'fr') return 'Ciber dit : "Les meilleurs mots de passe sont comme des histoires rigolotes de 3 mots faciles à retenir mais impossibles pour un robot !"';
    return 'Ciber dice: "Las mejores contraseñas son como frases locas de 3 palabras que tú recuerdas fácil, ¡pero un robot nunca adivinaría!"';
  };

  const getAgeWords = () => {
    if (ageGroup === '13–14') {
      if (language === 'en') return ['Cipher', 'Quantum', 'Nebula', 'Shield', 'Kernel', 'Shadow'];
      if (language === 'fr') return ['Chiffre', 'Quantique', 'Nebuleuse', 'Bouclier', 'Kernel', 'Ombre'];
      return ['Cifrado', 'Cuantico', 'Nebulosa', 'Blindaje', 'Nucleo', 'Sombra'];
    }
    if (ageGroup === '11–12') {
      if (language === 'en') return ['Titan', 'Vortex', 'Cyber', 'Fortress', 'Cosmos', 'Gamer'];
      if (language === 'fr') return ['Titan', 'Vortex', 'Cyber', 'Forteresse', 'Cosmos', 'Gamer'];
      return ['Titan', 'Vortex', 'Cyber', 'Fortaleza', 'Cosmos', 'Gamer'];
    }
    if (language === 'en') return ['Robot', 'Galaxy', 'Dragon', 'Dolphin', 'Pixel', 'Thunder'];
    if (language === 'fr') return ['Robot', 'Galaxie', 'Dragon', 'Dauphin', 'Pixel', 'Tonnerre'];
    return ['Robot', 'Galaxia', 'Dragon', 'Delfin', 'Pixel', 'Trueno'];
  };

  const loc = {
    es: {
      mechanicTag: `Mecánica 6 • Nivel ${ageGroup} años`,
      title: 'La Forja de Contraseñas',
      combineBtn: 'Combinar',
      mascotText: getAgeMascotText(),
      digitalLock: 'Tu cerradura digital',
      placeholder: 'Escribe tu contraseña...',
      armorLevel: 'Nivel de blindaje:',
      timeToBreak: 'Tiempo para romperla:',
      ingredientsTitle: 'Ingredientes de una contraseña legendaria:',
      reqLength: ageGroup === '13–14' ? '12+ letras' : '10+ letras',
      reqUpperLower: 'Mayúsculas & minúsculas',
      reqNumber: 'Al menos un número (0-9)',
      reqSymbol: 'Símbolo secreto (@, #, !)',
      quickAddTitle: 'Toca para añadir bloques seguros:',
      forgeBtn: '¡Forjar Contraseña & Guardar Llave!',
      needMoreBtn: 'Cumple al menos 4 requisitos para continuar',
      weak: 'Débil',
      regular: 'Regular',
      strong: 'Fuerte',
      legendary: '¡Legendaria!',
      timeWeak: '3 segundos',
      timeRegular: '4 horas',
      timeStrong: '3 años',
      timeLegendary: '¡8.000 siglos!',
      words: getAgeWords(),
    },
    fr: {
      mechanicTag: `Mécanique 6 • Niveau ${ageGroup} ans`,
      title: 'La Forge de Mots de Passe',
      combineBtn: 'Combiner',
      mascotText: getAgeMascotText(),
      digitalLock: 'Ton cadenas numérique',
      placeholder: 'Écris ton mot de passe...',
      armorLevel: 'Niveau de blindage :',
      timeToBreak: 'Temps pour le déchiffrer :',
      ingredientsTitle: 'Ingrédients d’un mot de passe légendaire :',
      reqLength: ageGroup === '13–14' ? '12+ lettres' : '10+ lettres',
      reqUpperLower: 'Majuscules & minuscules',
      reqNumber: 'Au moins un chiffre (0-9)',
      reqSymbol: 'Symbole secret (@, #, !)',
      quickAddTitle: 'Appuie pour ajouter des briques sûres :',
      forgeBtn: 'Forger le mot de passe & garder la clé !',
      needMoreBtn: 'Remplis au moins 4 critères pour continuer',
      weak: 'Faible',
      regular: 'Moyen',
      strong: 'Fort',
      legendary: 'Légendaire !',
      timeWeak: '3 secondes',
      timeRegular: '4 heures',
      timeStrong: '3 ans',
      timeLegendary: '8 000 siècles !',
      words: getAgeWords(),
    },
    en: {
      mechanicTag: `Mechanic 6 • Level ${ageGroup} yrs`,
      title: 'The Password Forge',
      combineBtn: 'Shuffle',
      mascotText: getAgeMascotText(),
      digitalLock: 'Your digital lock',
      placeholder: 'Type your password...',
      armorLevel: 'Shielding level:',
      timeToBreak: 'Time to crack:',
      ingredientsTitle: 'Ingredients of a legendary password:',
      reqLength: ageGroup === '13–14' ? '12+ letters' : '10+ letters',
      reqUpperLower: 'Upper & lower case',
      reqNumber: 'At least one number (0-9)',
      reqSymbol: 'Secret symbol (@, #, !)',
      quickAddTitle: 'Tap to add secure building blocks:',
      forgeBtn: 'Forge Password & Secure Key!',
      needMoreBtn: 'Meet at least 4 requirements to continue',
      weak: 'Weak',
      regular: 'Moderate',
      strong: 'Strong',
      legendary: 'Legendary!',
      timeWeak: '3 seconds',
      timeRegular: '4 hours',
      timeStrong: '3 years',
      timeLegendary: '8,000 centuries!',
      words: getAgeWords(),
    },
  }[language] || {
    mechanicTag: `Mecánica 6 • Nivel ${ageGroup} años`,
    title: 'La Forja de Contraseñas',
    combineBtn: 'Combinar',
    mascotText: getAgeMascotText(),
    digitalLock: 'Tu cerradura digital',
    placeholder: 'Escribe tu contraseña...',
    armorLevel: 'Nivel de blindaje:',
    timeToBreak: 'Tiempo para romperla:',
    ingredientsTitle: 'Ingredientes de una contraseña legendaria:',
    reqLength: ageGroup === '13–14' ? '12+ letras' : '10+ letras',
    reqUpperLower: 'Mayúsculas & minúsculas',
    reqNumber: 'Al menos un número (0-9)',
    reqSymbol: 'Símbolo secreto (@, #, !)',
    quickAddTitle: 'Toca para añadir bloques seguros:',
    forgeBtn: '¡Forjar Contraseña & Guardar Llave!',
    needMoreBtn: 'Cumple al menos 4 requisitos para continuar',
    weak: 'Débil',
    regular: 'Regular',
    strong: 'Fuerte',
    legendary: '¡Legendaria!',
    timeWeak: '3 segundos',
    timeRegular: '4 horas',
    timeStrong: '3 años',
    timeLegendary: '¡8.000 siglos!',
    words: getAgeWords(),
  };

  // Criteria calculations
  const minRequiredLength = ageGroup === '13–14' ? 12 : 10;
  const hasLength = password.length >= minRequiredLength;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  const passedCount = [hasLength, hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;

  let strengthLabel = loc.weak;
  let strengthColor = 'bg-rose-500';
  let crackTime = loc.timeWeak;
  let meterPercent = 20;

  if (passedCount === 3) {
    strengthLabel = loc.regular;
    strengthColor = 'bg-amber-500';
    crackTime = loc.timeRegular;
    meterPercent = 50;
  } else if (passedCount === 4) {
    strengthLabel = loc.strong;
    strengthColor = 'bg-sky-500';
    crackTime = loc.timeStrong;
    meterPercent = 75;
  } else if (passedCount === 5) {
    strengthLabel = loc.legendary;
    strengthColor = 'bg-emerald-500';
    crackTime = loc.timeLegendary;
    meterPercent = 100;
  }

  const sampleSymbols = ['#', '$', '!', '&', '?', '*'];

  const addSnippet = (snippet: string) => {
    setPassword((prev) => prev + snippet);
  };

  const handleGenerateMagic = () => {
    const w1 = loc.words[Math.floor(Math.random() * loc.words.length)];
    const sym = sampleSymbols[Math.floor(Math.random() * sampleSymbols.length)];
    const num = Math.floor(10 + Math.random() * 90);
    const w2 = loc.words[Math.floor(Math.random() * loc.words.length)];
    setPassword(`${w1}${sym}${num}${w2}`);
  };

  return (
    <div className="flex-1 flex flex-col p-4 bg-slate-50 text-slate-800 select-none overflow-y-auto space-y-4">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-extrabold text-purple-600 tracking-wider">
              {loc.mechanicTag}
            </div>
            <h2 className="text-sm font-black text-slate-900">{loc.title}</h2>
          </div>
        </div>
        <button
          onClick={handleGenerateMagic}
          className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 hover:bg-purple-100 transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{loc.combineBtn}</span>
        </button>
      </div>

      {/* Mascot advice */}
      <div className="flex items-center gap-3 p-3 bg-purple-50/80 rounded-2xl border border-purple-100">
        <CiberMascot size="sm" expression={passedCount >= 4 ? 'celebrating' : 'thinking'} />
        <div className="text-xs text-purple-900 leading-snug">
          {loc.mascotText}
        </div>
      </div>

      {/* Interactive Password Display Box */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500">{loc.digitalLock}</span>
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={loc.placeholder}
            className="w-full text-lg sm:text-xl font-mono font-bold tracking-wider py-3 px-4 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-purple-500 focus:bg-white text-slate-900 outline-none transition"
          />
        </div>

        {/* Live Strength Meter */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-600 flex items-center gap-1.5">
              <span>{loc.armorLevel}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black text-white ${strengthColor}`}>
                {strengthLabel}
              </span>
            </span>
            <span className="text-slate-500 text-[11px]">
              {loc.timeToBreak} <strong className="text-slate-800">{crackTime}</strong>
            </span>
          </div>

          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${meterPercent}%` }}
              className={`h-full rounded-full ${strengthColor} transition-all duration-500`}
            />
          </div>
        </div>
      </div>

      {/* Criteria Checklist */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 space-y-2">
        <h3 className="text-xs font-bold text-slate-700">{loc.ingredientsTitle}</h3>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className={`flex items-center gap-2 p-2 rounded-xl border ${hasLength ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
            <div className={`w-4 h-4 rounded-full flex items-center justify-center text-white ${hasLength ? 'bg-emerald-500' : 'bg-slate-300'}`}>
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </div>
            <span>{loc.reqLength} ({password.length})</span>
          </div>

          <div className={`flex items-center gap-2 p-2 rounded-xl border ${hasUpper && hasLower ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
            <div className={`w-4 h-4 rounded-full flex items-center justify-center text-white ${hasUpper && hasLower ? 'bg-emerald-500' : 'bg-slate-300'}`}>
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </div>
            <span>{loc.reqUpperLower}</span>
          </div>

          <div className={`flex items-center gap-2 p-2 rounded-xl border ${hasNumber ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
            <div className={`w-4 h-4 rounded-full flex items-center justify-center text-white ${hasNumber ? 'bg-emerald-500' : 'bg-slate-300'}`}>
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </div>
            <span>{loc.reqNumber}</span>
          </div>

          <div className={`flex items-center gap-2 p-2 rounded-xl border ${hasSymbol ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
            <div className={`w-4 h-4 rounded-full flex items-center justify-center text-white ${hasSymbol ? 'bg-emerald-500' : 'bg-slate-300'}`}>
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </div>
            <span>{loc.reqSymbol}</span>
          </div>
        </div>
      </div>

      {/* Quick Add Building Blocks */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 space-y-2">
        <div className="text-xs font-bold text-slate-700">{loc.quickAddTitle}</div>
        <div className="flex flex-wrap gap-1.5">
          {loc.words.map((word) => (
            <button
              key={word}
              onClick={() => addSnippet(word)}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 text-slate-700 hover:bg-purple-100 hover:text-purple-700 transition cursor-pointer"
            >
              +{word}
            </button>
          ))}
          {sampleSymbols.map((sym) => (
            <button
              key={sym}
              onClick={() => addSnippet(sym)}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-200 transition cursor-pointer"
            >
              +{sym}
            </button>
          ))}
        </div>
      </div>

      {/* Complete Button */}
      <button
        onClick={onComplete}
        disabled={passedCount < 4}
        className={`w-full py-3.5 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
          passedCount >= 4
            ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/25 hover:from-purple-400 hover:to-indigo-500 active:scale-95'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
        }`}
      >
        <Sparkles className="w-4 h-4" />
        <span>{passedCount >= 4 ? loc.forgeBtn : loc.needMoreBtn}</span>
      </button>
    </div>
  );
};
