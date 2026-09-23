import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Unlock, ShieldCheck, Key, Check } from 'lucide-react';
import { CiberMascot } from '../CiberMascot';
import { useLanguage } from '../../i18n/LanguageContext';
import { ChildAgeGroup } from '../../types';

interface PuzzleVaultGameProps {
  onComplete: () => void;
  ageGroup?: ChildAgeGroup;
}

export const PuzzleVaultGame: React.FC<PuzzleVaultGameProps> = ({ onComplete, ageGroup = '8–10' }) => {
  const { language } = useLanguage();

  const loc = {
    es: {
      tag: 'Mecánica 10 / Bóveda',
      title: 'La Bóveda de Enigmas',
      statusUnlocked: '¡Bóveda Abierta!',
      statusLocked: 'Cerrada',
      mascot: 'Ciber dice: "Resuelve las 3 pistas de ciberseguridad girando los cilindros para abrir la cerradura maestra."',
      vaultUnlocked: '¡Combinación de Seguridad Correcta!',
      vaultLocked: 'Alinea los 3 cilindros para desbloquear',
      clue1: 'Pista 1: Longitud recomendada de contraseña:',
      clue2: 'Pista 2: Protocolo web seguro con candado:',
      clue3: 'Pista 3: ¿Qué tipo de verificación protege tu cuenta?',
      options1: ['6', '8', '10', '16'],
      options2: ['HTTP', 'FTP', 'HTTPS', 'DNS'],
      options3: ['1 Paso', 'Doble Factor (2FA)', '3 Claves', 'Sin Clave'],
      completeBtn: '¡Abrir Bóveda & Recoger Premio!',
      lockedBtn: 'Resuelve las 3 pistas de la bóveda',
    },
    fr: {
      tag: 'Mécanique 10 / Coffre-fort',
      title: 'Le Coffre aux Énigmes',
      statusUnlocked: 'Coffre Déverrouillé !',
      statusLocked: 'Verrouillé',
      mascot: 'Ciber dit : "Résous les 3 énigmes de cybersécurité en tournant les cylindres pour ouvrir la serrure maîtresse."',
      vaultUnlocked: 'Combinaison de Sécurité Validée !',
      vaultLocked: 'Aligne les 3 cylindres pour déverrouiller',
      clue1: 'Indice 1 : Longueur recommandée d’un mot de passe :',
      clue2: 'Indice 2 : Protocole web sécurisé avec cadenas vert :',
      clue3: 'Indice 3 : Quel type de validation protège ton compte ?',
      options1: ['6', '8', '10', '16'],
      options2: ['HTTP', 'FTP', 'HTTPS', 'DNS'],
      options3: ['1 Étape', 'Double Facteur (2FA)', '3 Codes', 'Sans Code'],
      completeBtn: 'Ouvrir le Coffre & Prendre la Récompense !',
      lockedBtn: 'Résous les 3 énigmes du coffre',
    },
    en: {
      tag: 'Mechanic 10 / Vault',
      title: 'The Enigma Vault',
      statusUnlocked: 'Vault Opened!',
      statusLocked: 'Locked',
      mascot: 'Ciber says: "Solve the 3 cybersecurity clues by rotating the tumblers to crack the master lock."',
      vaultUnlocked: 'Security Combination Validated!',
      vaultLocked: 'Align all 3 tumblers to unlock',
      clue1: 'Clue 1: Recommended password minimum length:',
      clue2: 'Clue 2: Secure web protocol indicated by green padlock:',
      clue3: 'Clue 3: Which verification safeguard locks down your account?',
      options1: ['6', '8', '10', '16'],
      options2: ['HTTP', 'FTP', 'HTTPS', 'DNS'],
      options3: ['1 Step', 'Two-Factor (2FA)', '3 Passwords', 'No Password'],
      completeBtn: 'Open Vault & Collect Reward!',
      lockedBtn: 'Solve the 3 vault clues',
    },
  }[language] || {
    tag: 'Mecánica 10 / Bóveda',
    title: 'La Bóveda de Enigmas',
    statusUnlocked: '¡Bóveda Abierta!',
    statusLocked: 'Cerrada',
    mascot: 'Ciber dice: "Resuelve las 3 pistas de ciberseguridad girando los cilindros para abrir la cerradura maestra."',
    vaultUnlocked: '¡Combinación de Seguridad Correcta!',
    vaultLocked: 'Alinea los 3 cilindros para desbloquear',
    clue1: 'Pista 1: Longitud recomendada de contraseña:',
    clue2: 'Pista 2: Protocolo web seguro con candado:',
    clue3: 'Pista 3: ¿Qué tipo de verificación protege tu cuenta?',
    options1: ['6', '8', '10', '16'],
    options2: ['HTTP', 'FTP', 'HTTPS', 'DNS'],
    options3: ['1 Paso', 'Doble Factor (2FA)', '3 Claves', 'Sin Clave'],
    completeBtn: '¡Abrir Bóveda & Recoger Premio!',
    lockedBtn: 'Resuelve las 3 pistas de la bóveda',
  };

  // 3 dials
  const [dial1, setDial1] = useState(0); // Clue 1: 10
  const [dial2, setDial2] = useState(0); // Clue 2: HTTPS
  const [dial3, setDial3] = useState(0); // Clue 3: 2FA

  const isUnlocked = dial1 === 2 && dial2 === 2 && dial3 === 1;

  return (
    <div className="flex-1 flex flex-col p-4 bg-slate-50 text-slate-800 select-none overflow-y-auto space-y-3">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-extrabold text-amber-600 tracking-wider">
              {loc.tag}
            </div>
            <h2 className="text-sm font-black text-slate-900">{loc.title}</h2>
          </div>
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${isUnlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
          {isUnlocked ? loc.statusUnlocked : loc.statusLocked}
        </span>
      </div>

      {/* Mascot advice */}
      <div className="flex items-center gap-3 p-3 bg-amber-50/80 rounded-2xl border border-amber-100">
        <CiberMascot size="sm" expression={isUnlocked ? 'celebrating' : 'thinking'} />
        <div className="text-xs text-amber-950 leading-snug">
          {loc.mascot}
        </div>
      </div>

      {/* Vault Door Graphic */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col items-center justify-center py-6 relative">
        <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all ${
          isUnlocked ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-slate-300 bg-slate-100 text-slate-500'
        }`}>
          {isUnlocked ? <Unlock className="w-12 h-12" /> : <Lock className="w-12 h-12" />}
        </div>
        <div className="text-xs font-bold text-slate-600 mt-3">
          {isUnlocked ? loc.vaultUnlocked : loc.vaultLocked}
        </div>
      </div>

      {/* Dial Controls */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 space-y-3">
        {/* Dial 1 */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-slate-600">{loc.clue1}</span>
          <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-2xl">
            {loc.options1.map((opt, i) => (
              <button
                key={opt}
                onClick={() => setDial1(i)}
                className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  dial1 === i ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Dial 2 */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-slate-600">{loc.clue2}</span>
          <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-2xl">
            {loc.options2.map((opt, i) => (
              <button
                key={opt}
                onClick={() => setDial2(i)}
                className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  dial2 === i ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Dial 3 */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-slate-600">{loc.clue3}</span>
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-2xl">
            {loc.options3.map((opt, i) => (
              <button
                key={opt}
                onClick={() => setDial3(i)}
                className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  dial3 === i ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <button
        onClick={onComplete}
        disabled={!isUnlocked}
        className={`w-full py-3.5 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
          isUnlocked
            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20 active:scale-95'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
        }`}
      >
        <ShieldCheck className="w-4 h-4" />
        <span>{isUnlocked ? loc.completeBtn : loc.lockedBtn}</span>
      </button>
    </div>
  );
};
