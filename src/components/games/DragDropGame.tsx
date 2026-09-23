import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Package, ShieldCheck, Plus, X, Sparkles } from 'lucide-react';
import { CiberMascot } from '../CiberMascot';
import { useLanguage } from '../../i18n/LanguageContext';
import { ChildAgeGroup } from '../../types';

interface DragDropGameProps {
  onComplete: () => void;
  ageGroup?: ChildAgeGroup;
}

interface Block {
  id: string;
  label: string;
  isSafe: boolean;
  type: 'word' | 'symbol' | 'weak';
}

export const DragDropGame: React.FC<DragDropGameProps> = ({ onComplete, ageGroup = '8–10' }) => {
  const { language } = useLanguage();

  const getAgeBlocks = (): Block[] => {
    if (ageGroup === '13–14') {
      return [
        { id: 'b1', label: 'QuantumShield', isSafe: true, type: 'word' },
        { id: 'b2', label: 'qwertyuiop', isSafe: false, type: 'weak' },
        { id: 'b3', label: '#99!Entropy', isSafe: true, type: 'symbol' },
        { id: 'b4', label: 'Admin@2026', isSafe: false, type: 'weak' },
        { id: 'b5', label: 'NebulaVortex', isSafe: true, type: 'word' },
        { id: 'b6', label: '$77*Root', isSafe: true, type: 'symbol' },
        { id: 'b7', label: 'Password123!', isSafe: false, type: 'weak' },
      ];
    }
    if (ageGroup === '11–12') {
      return [
        { id: 'b1', label: 'TitanVortex', isSafe: true, type: 'word' },
        { id: 'b2', label: 'gamer1234', isSafe: false, type: 'weak' },
        { id: 'b3', label: '#889!', isSafe: true, type: 'symbol' },
        { id: 'b4', label: 'roblox2026', isSafe: false, type: 'weak' },
        { id: 'b5', label: 'CyberNinja', isSafe: true, type: 'word' },
        { id: 'b6', label: '$55*', isSafe: true, type: 'symbol' },
        { id: 'b7', label: 'fortnitepro', isSafe: false, type: 'weak' },
      ];
    }
    return [
      { id: 'b1', label: 'CastilloAzul', isSafe: true, type: 'word' },
      { id: 'b2', label: '123456', isSafe: false, type: 'weak' },
      { id: 'b3', label: '#99!', isSafe: true, type: 'symbol' },
      { id: 'b4', label: 'password', isSafe: false, type: 'weak' },
      { id: 'b5', label: 'DragonFuego', isSafe: true, type: 'word' },
      { id: 'b6', label: '$77*', isSafe: true, type: 'symbol' },
      { id: 'b7', label: 'Lucas2026', isSafe: false, type: 'weak' },
    ];
  };

  const loc = {
    es: {
      tag: `Mecánica 3 • Nivel ${ageGroup} años`,
      title: 'Armador de Bloques Seguros',
      blocksBadge: (n: number) => `${n} / 3 bloques`,
      mascot: 'Ciber dice: "Toca bloques fuertes (palabras secretas y símbolos) para depositarlos en tu bóveda. ¡Evita las claves obvias!"',
      warningWeak: (label: string) => `¡Cuidado! "${label}" es una contraseña típica muy fácil de adivinar para un robot.`,
      vaultTitle: 'Tu Bóveda Acorazada (Toca bloques para agregarlos):',
      vaultEmpty: '(Bóveda vacía. Selecciona bloques seguros abajo)',
      availableTitle: 'Bloques de datos disponibles:',
      completeBtn: '¡Cerrar Bóveda & Continuar!',
      needMoreBtn: 'Deposita al menos 3 bloques seguros',
      blocks: getAgeBlocks(),
    },
    fr: {
      tag: 'Mécanique 3 / Constructeur',
      title: 'Assembleur de Blocs Sécurisés',
      blocksBadge: (n: number) => `${n} / 3 blocs`,
      mascot: 'Ciber dit : "Touche des blocs solides (mots magiques et symboles) pour remplir ton coffre-fort secret. Évite les codes trop évidents !"',
      warningWeak: (label: string) => `Attention ! "${label}" est un mot de passe classique beaucoup trop facile à deviner.`,
      vaultTitle: 'Ton Coffre Blindé (Touche les blocs pour les ajouter) :',
      vaultEmpty: '(Coffre vide. Choisis des blocs sûrs ci-dessous)',
      availableTitle: 'Blocs de données disponibles :',
      completeBtn: 'Verrouiller le Coffre & Continuer !',
      needMoreBtn: 'Dépose au moins 3 blocs sûrs',
      blocks: [
        { id: 'b1', label: 'ChateauBleu', isSafe: true, type: 'word' as const },
        { id: 'b2', label: '123456', isSafe: false, type: 'weak' as const },
        { id: 'b3', label: '#99!', isSafe: true, type: 'symbol' as const },
        { id: 'b4', label: 'password', isSafe: false, type: 'weak' as const },
        { id: 'b5', label: 'DragonFeu', isSafe: true, type: 'word' as const },
        { id: 'b6', label: '$77*', isSafe: true, type: 'symbol' as const },
        { id: 'b7', label: 'Lucas2026', isSafe: false, type: 'weak' as const },
      ],
    },
    en: {
      tag: 'Mechanic 3 / Builder',
      title: 'Safe Block Vault Builder',
      blocksBadge: (n: number) => `${n} / 3 blocks`,
      mascot: 'Ciber says: "Tap strong blocks (magic words and symbols) to assemble in your secret vault. Avoid obvious passwords!"',
      warningWeak: (label: string) => `Caution! "${label}" is a predictable password that hackers easily crack.`,
      vaultTitle: 'Your Armored Vault (Tap blocks to add):',
      vaultEmpty: '(Empty vault. Select secure blocks below)',
      availableTitle: 'Available data blocks:',
      completeBtn: 'Seal Vault & Continue!',
      needMoreBtn: 'Deposit at least 3 secure blocks',
      blocks: [
        { id: 'b1', label: 'BlueCastle', isSafe: true, type: 'word' as const },
        { id: 'b2', label: '123456', isSafe: false, type: 'weak' as const },
        { id: 'b3', label: '#99!', isSafe: true, type: 'symbol' as const },
        { id: 'b4', label: 'password', isSafe: false, type: 'weak' as const },
        { id: 'b5', label: 'FireDragon', isSafe: true, type: 'word' as const },
        { id: 'b6', label: '$77*', isSafe: true, type: 'symbol' as const },
        { id: 'b7', label: 'Lucas2026', isSafe: false, type: 'weak' as const },
      ],
    },
  }[language] || {
    tag: 'Mecánica 3 / Constructor',
    title: 'Armador de Bloques Seguros',
    blocksBadge: (n: number) => `${n} / 3 bloques`,
    mascot: 'Ciber dice: "Toca bloques fuertes (palabras mágicas y símbolos) para depositarlos en tu bóveda secreta. ¡Evita las claves obvias!"',
    warningWeak: (label: string) => `¡Cuidado! "${label}" es una contraseña típica muy fácil de adivinar.`,
    vaultTitle: 'Tu Bóveda Acorazada (Toca bloques para agregarlos):',
    vaultEmpty: '(Bóveda vacía. Selecciona bloques seguros abajo)',
    availableTitle: 'Bloques de datos disponibles:',
    completeBtn: '¡Cerrar Bóveda & Continuar!',
    needMoreBtn: 'Deposita al menos 3 bloques seguros',
    blocks: [
      { id: 'b1', label: 'CastilloAzul', isSafe: true, type: 'word' as const },
      { id: 'b2', label: '123456', isSafe: false, type: 'weak' as const },
      { id: 'b3', label: '#99!', isSafe: true, type: 'symbol' as const },
      { id: 'b4', label: 'password', isSafe: false, type: 'weak' as const },
      { id: 'b5', label: 'DragonFuego', isSafe: true, type: 'word' as const },
      { id: 'b6', label: '$77*', isSafe: true, type: 'symbol' as const },
      { id: 'b7', label: 'Lucas2026', isSafe: false, type: 'weak' as const },
    ],
  };

  const [vaultBlocks, setVaultBlocks] = useState<Block[]>([]);
  const [available, setAvailable] = useState<Block[]>(loc.blocks);
  const [feedback, setFeedback] = useState<string | null>(null);

  const addBlockToVault = (block: Block) => {
    if (!block.isSafe) {
      setFeedback(loc.warningWeak(block.label));
      return;
    }
    setFeedback(null);
    setVaultBlocks((prev) => [...prev, block]);
    setAvailable((prev) => prev.filter((b) => b.id !== block.id));
  };

  const removeBlockFromVault = (block: Block) => {
    setVaultBlocks((prev) => prev.filter((b) => b.id !== block.id));
    setAvailable((prev) => [...prev, block]);
  };

  const isVaultReady = vaultBlocks.length >= 3;

  return (
    <div className="flex-1 flex flex-col p-4 bg-slate-50 text-slate-800 select-none overflow-y-auto space-y-3">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-extrabold text-indigo-600 tracking-wider">
              {loc.tag}
            </div>
            <h2 className="text-sm font-black text-slate-900">{loc.title}</h2>
          </div>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-600">
          {loc.blocksBadge(vaultBlocks.length)}
        </span>
      </div>

      {/* Mascot hint */}
      <div className="flex items-center gap-3 p-3 bg-indigo-50/80 rounded-2xl border border-indigo-100">
        <CiberMascot size="sm" expression={isVaultReady ? 'celebrating' : 'thinking'} />
        <div className="text-xs text-indigo-950 leading-snug">
          {loc.mascot}
        </div>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900">
          {feedback}
        </div>
      )}

      {/* The Vault Drop Zone */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border-2 border-dashed border-indigo-300 space-y-3 min-h-[140px] flex flex-col justify-center">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
          {loc.vaultTitle}
        </div>

        {vaultBlocks.length === 0 ? (
          <div className="text-center text-xs text-slate-400 py-4">
            {loc.vaultEmpty}
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-2">
            {vaultBlocks.map((b) => (
              <motion.div
                key={b.id}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="px-3.5 py-2 rounded-2xl bg-indigo-600 text-white font-mono font-bold text-xs flex items-center gap-2 shadow-sm"
              >
                <span>{b.label}</span>
                <button
                  onClick={() => removeBlockFromVault(b)}
                  className="w-4 h-4 rounded-full bg-indigo-700 hover:bg-indigo-800 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Available Blocks Pool */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 space-y-2">
        <div className="text-xs font-bold text-slate-700">{loc.availableTitle}</div>
        <div className="flex flex-wrap gap-2">
          {available.map((b) => (
            <button
              key={b.id}
              onClick={() => addBlockToVault(b)}
              className={`px-3 py-2 rounded-2xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                b.isSafe
                  ? 'bg-slate-50 hover:bg-indigo-50 border-slate-200 hover:border-indigo-300 text-slate-800'
                  : 'bg-rose-50/50 hover:bg-rose-100/70 border-rose-200 text-rose-800'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{b.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Complete CTA */}
      <button
        onClick={onComplete}
        disabled={!isVaultReady}
        className={`w-full py-3.5 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
          isVaultReady
            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-400 hover:to-purple-500 active:scale-95'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
        }`}
      >
        <ShieldCheck className="w-4 h-4" />
        <span>{isVaultReady ? loc.completeBtn : loc.needMoreBtn}</span>
      </button>
    </div>
  );
};
