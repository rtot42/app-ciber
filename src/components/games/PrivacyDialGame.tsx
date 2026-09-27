import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sliders, Globe, Users, Lock, ShieldCheck, Eye, EyeOff, Check } from 'lucide-react';
import { CiberMascot } from '../CiberMascot';
import { useLanguage } from '../../i18n/LanguageContext';
import { ChildAgeGroup } from '../../types';

interface PrivacyDialGameProps {
  onComplete: () => void;
  ageGroup?: ChildAgeGroup;
}

export const PrivacyDialGame: React.FC<PrivacyDialGameProps> = ({ onComplete, ageGroup = '8–10' }) => {
  const { language } = useLanguage();

  // Settings
  const [photoSetting, setPhotoSetting] = useState<'public' | 'friends' | 'private'>('public');
  const [locationSetting, setLocationSetting] = useState<'public' | 'friends' | 'private'>('public');
  const [messagesSetting, setMessagesSetting] = useState<'public' | 'friends' | 'private'>('public');

  const isSafeEnough = photoSetting !== 'public' && locationSetting === 'private' && messagesSetting !== 'public';

  const getAgeMascotText = () => {
    if (ageGroup === '13–14') {
      if (language === 'en') return 'Ciber says: "Disable background GPS tagging and restrict direct messaging to trusted contacts to curb your digital footprint."';
      if (language === 'fr') return 'Ciber dit : "Désactive la géolocalisation GPS en arrière-plan et limite les messages privés aux contacts vérifiés."';
      return 'Ciber dice: "Desactiva la geolocalización GPS en publicaciones y restringe mensajes privados a contactos reales para blindar tu huella digital."';
    }
    if (ageGroup === '11–12') {
      if (language === 'en') return 'Ciber says: "On TikTok, gaming profiles, and Discord, keep your location completely off and DMs limited to trusted friends."';
      if (language === 'fr') return 'Ciber dit : "Sur TikTok et Discord, garde ta position désactivée et tes messages réservés à tes vrais amis."';
      return 'Ciber dice: "En TikTok, perfiles de juegos y Discord, mantén tu ubicación apagada y tus mensajes solo para amigos conocidos."';
    }
    if (language === 'en') return 'Ciber says: "Turn the dials so strangers cannot see your house or send you unsolicited messages!"';
    if (language === 'fr') return 'Ciber dit : "Tourne les curseurs pour que les inconnus ne puissent pas voir où tu es ni t’écrire en privé !"';
    return 'Ciber dice: "Mueve los diales para que un desconocido en Internet no pueda ver dónde estás ni mandarte mensajes privados."';
  };

  const locData = {
    es: {
      tag: `Mecánica 7 • Nivel ${ageGroup} años`,
      title: 'El Dial de Privacidad',
      shieldedStatus: 'Perfil Blindado',
      exposedStatus: 'Datos Expuestos',
      mascot: getAgeMascotText(),
      dial1Label: 'Ubicación GPS en publicaciones',
      dial2Label: '¿Quién ve mis fotos y videos?',
      dial3Label: '¿Quién puede enviarme mensajes directos?',
      levels: {
        public: 'Público',
        friends: 'Amigos',
        private: 'Solo yo',
      },
      messageLevels: {
        public: 'Cualquiera',
        friends: 'Solo Amigos',
        private: 'Nadie',
      },
      previewTitle: 'Vista de un desconocido en Internet:',
      q1: '¿Puede ver dónde vives / estudias?',
      q1Yes: '⚠️ Sí (Visible)',
      q1No: '🔒 Oculto',
      q2: '¿Puede ver tus fotos privadas?',
      q2Yes: '⚠️ Sí (Cualquiera)',
      q2No: '🔒 Solo Amigos',
      q3: '¿Puede escribirte un mensaje directo?',
      q3Yes: '⚠️ Sí (Abierto)',
      q3No: '🔒 Bloqueado a extraños',
      saveBtn: '¡Guardar Configuración Segura!',
      needAdjustBtn: 'Ajusta la ubicación y mensajes a modo seguro',
    },
    fr: {
      tag: 'Mécanique 7 / Confidentialité',
      title: 'Le Cadran de Confidentialité',
      shieldedStatus: 'Profil Blindé',
      exposedStatus: 'Données Exposées',
      mascot: 'Ciber dit : "Ajuste les curseurs pour qu’un inconnu sur le web ne sache pas où tu es et ne puisse pas t’écrire en privé."',
      dial1Label: 'Position GPS sur les publications',
      dial2Label: 'Qui peut voir mes photos et vidéos ?',
      dial3Label: 'Qui peut m’envoyer des messages privés ?',
      levels: {
        public: 'Public',
        friends: 'Amis',
        private: 'Moi seul',
      },
      messageLevels: {
        public: 'Tout le monde',
        friends: 'Amis seuls',
        private: 'Personne',
      },
      previewTitle: 'Ce que voit un inconnu en ligne :',
      q1: 'Peut-il voir où tu habites / étudies ?',
      q1Yes: '⚠️ Oui (Visible)',
      q1No: '🔒 Masqué',
      q2: 'Peut-il voir tes photos personnelles ?',
      q2Yes: '⚠️ Oui (Tout le monde)',
      q2No: '🔒 Amis seulement',
      q3: 'Peut-il t’envoyer un message direct ?',
      q3Yes: '⚠️ Oui (Ouvert)',
      q3No: '🔒 Inconnus bloqués',
      saveBtn: 'Enregistrer le Profil Sécurisé !',
      needAdjustBtn: 'Règle la localisation et les messages en mode sûr',
    },
    en: {
      tag: 'Mechanic 7 / Privacy',
      title: 'The Privacy Dial',
      shieldedStatus: 'Armored Profile',
      exposedStatus: 'Exposed Data',
      mascot: 'Ciber says: "Adjust the dials so an internet stranger cannot track where you are or slide into your DMs."',
      dial1Label: 'GPS location on posts',
      dial2Label: 'Who can view my photos and videos?',
      dial3Label: 'Who can send me direct messages?',
      levels: {
        public: 'Public',
        friends: 'Friends',
        private: 'Only Me',
      },
      messageLevels: {
        public: 'Anyone',
        friends: 'Friends Only',
        private: 'Nobody',
      },
      previewTitle: 'What a random stranger online sees:',
      q1: 'Can they see where you live / attend school?',
      q1Yes: '⚠️ Yes (Visible)',
      q1No: '🔒 Hidden',
      q2: 'Can they view your private photos?',
      q2Yes: '⚠️ Yes (Anyone)',
      q2No: '🔒 Friends Only',
      q3: 'Can they send you direct messages?',
      q3Yes: '⚠️ Yes (Open)',
      q3No: '🔒 Strangers blocked',
      saveBtn: 'Save Safe Privacy Settings!',
      needAdjustBtn: 'Set location & direct messages to a safe level',
    },
  };

  const loc = locData[language] || locData.en || locData.es;

  return (
    <div className="flex-1 min-h-0 flex flex-col p-5 sm:p-6 bg-slate-50 text-slate-800 select-none overflow-y-auto scrollbar-none space-y-6 sm:space-y-7 pb-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold text-cyan-600 tracking-wider">
              {loc.tag}
            </div>
            <h2 className="text-base font-black text-slate-900">{loc.title}</h2>
          </div>
        </div>
        <span className={`text-xs font-bold ${isSafeEnough ? 'text-emerald-700' : 'text-amber-700'}`}>
          {isSafeEnough ? loc.shieldedStatus : loc.exposedStatus}
        </span>
      </div>

      {/* Mascot advice */}
      <div className="flex items-center gap-3 p-3 bg-cyan-50/80 rounded-2xl border border-cyan-100">
        <CiberMascot size="sm" expression={isSafeEnough ? 'celebrating' : 'thinking'} />
        <div className="text-xs text-cyan-950 leading-snug">
          {loc.mascot}
        </div>
      </div>

      {/* 3 Privacy Dials */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 space-y-4">
        {/* Dial 1: Ubicación en vivo */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>{loc.dial1Label}</span>
            <span className="text-[10px] uppercase text-cyan-600 font-extrabold">{loc.levels[locationSetting]}</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl">
            {(['public', 'friends', 'private'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setLocationSetting(level)}
                className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                  locationSetting === level
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {level === 'public' && <Globe className="w-3.5 h-3.5" />}
                {level === 'friends' && <Users className="w-3.5 h-3.5" />}
                {level === 'private' && <Lock className="w-3.5 h-3.5" />}
                <span>{loc.levels[level]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dial 2: Fotos & Álbumes */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>{loc.dial2Label}</span>
            <span className="text-[10px] uppercase text-cyan-600 font-extrabold">{loc.levels[photoSetting]}</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl">
            {(['public', 'friends', 'private'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setPhotoSetting(level)}
                className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                  photoSetting === level
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {level === 'public' && <Globe className="w-3.5 h-3.5" />}
                {level === 'friends' && <Users className="w-3.5 h-3.5" />}
                {level === 'private' && <Lock className="w-3.5 h-3.5" />}
                <span>{loc.levels[level]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dial 3: Mensajes Directos */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>{loc.dial3Label}</span>
            <span className="text-[10px] uppercase text-cyan-600 font-extrabold">{loc.messageLevels[messagesSetting]}</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl">
            {(['public', 'friends', 'private'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setMessagesSetting(level)}
                className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                  messagesSetting === level
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {level === 'public' && <Globe className="w-3.5 h-3.5" />}
                {level === 'friends' && <Users className="w-3.5 h-3.5" />}
                {level === 'private' && <Lock className="w-3.5 h-3.5" />}
                <span>{loc.messageLevels[level]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Preview: What a stranger sees */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-sky-500" />
            <span>{loc.previewTitle}</span>
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">{loc.q1}</span>
            <span className={`font-bold ${locationSetting === 'public' ? 'text-rose-600' : 'text-emerald-600'}`}>
              {locationSetting === 'public' ? loc.q1Yes : loc.q1No}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">{loc.q2}</span>
            <span className={`font-bold ${photoSetting === 'public' ? 'text-rose-600' : 'text-emerald-600'}`}>
              {photoSetting === 'public' ? loc.q2Yes : loc.q2No}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">{loc.q3}</span>
            <span className={`font-bold ${messagesSetting === 'public' ? 'text-rose-600' : 'text-emerald-600'}`}>
              {messagesSetting === 'public' ? loc.q3Yes : loc.q3No}
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onComplete}
        disabled={!isSafeEnough}
        className={`w-full py-3.5 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
          isSafeEnough
            ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-500/20 hover:from-sky-400 hover:to-cyan-400 active:scale-95'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
        }`}
      >
        <ShieldCheck className="w-4 h-4" />
        <span>{isSafeEnough ? loc.saveBtn : loc.needAdjustBtn}</span>
      </button>
    </div>
  );
};
