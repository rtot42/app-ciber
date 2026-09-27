import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layers, ShieldCheck, AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { CiberMascot } from '../CiberMascot';
import { useLanguage } from '../../i18n/LanguageContext';
import { ChildAgeGroup } from '../../types';

interface CardItem {
  id: string;
  text: string;
  category: string;
  isSafe: boolean;
  explanation: string;
}

interface SafeRiskySortGameProps {
  onComplete: () => void;
  ageGroup?: ChildAgeGroup;
}

export const SafeRiskySortGame: React.FC<SafeRiskySortGameProps> = ({ onComplete, ageGroup = '8–10' }) => {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [results, setResults] = useState<{ id: string; correct: boolean }[]>([]);

  const locData = {
    es: {
      tag: 'Mecánica 8 / Clasificación',
      title: 'Seguro o Riesgoso',
      mascot: 'Ciber dice: "Analiza la situación y decide si es una práctica segura o si expone tus datos a un peligro."',
      safeBtn: 'Zona Segura',
      riskyBtn: 'Zona de Riesgo',
      finishedTitle: '¡Todas las cartas clasificadas!',
      finishedDesc: 'Demostraste un gran instinto para distinguir conductas protectoras de descuidos digitales.',
      claimBtn: '¡Recoger Recompensas!',
      cards: [
        {
          id: 'c1',
          text: 'Publicar una foto de tu dibujo favorito con tu apodo gamer',
          category: 'Creatividad',
          isSafe: true,
          explanation: '¡Totalmente seguro! Compartir arte o pasatiempos sin datos de tu escuela o casa es genial.',
        },
        {
          id: 'c2',
          text: 'Subir una foto mostrando el frente de tu casa con el cartel de la calle',
          category: 'Ubicación',
          isSafe: false,
          explanation: '¡Riesgoso! La fachada con número y calle indica exactamente dónde vives.',
        },
        {
          id: 'c3',
          text: 'Usar una contraseña diferente para tu correo y para tus videojuegos',
          category: 'Contraseñas',
          isSafe: true,
          explanation: '¡Excelente práctica! Si filtran la clave de un juego, tu correo sigue 100% blindado.',
        },
        {
          id: 'c4',
          text: 'Un desconocido en Roblox te pide tu número de WhatsApp para "darte gemas"',
          category: 'Desconocidos',
          isSafe: false,
          explanation: '¡Riesgoso! Sacar la charla fuera del juego a chats personales es un engaño clásico.',
        },
        {
          id: 'c5',
          text: 'Activar la verificación en dos pasos (2FA) con ayuda de tus padres',
          category: 'Seguridad',
          isSafe: true,
          explanation: '¡La mejor defensa! Aunque alguien adivine tu contraseña, no podrá entrar sin el segundo código.',
        },
      ],
    },
    fr: {
      tag: 'Mécanique 8 / Tri',
      title: 'Sûr ou Risqué',
      mascot: 'Ciber dit : "Analyse chaque situation et décide si c’est une habitude protectrice ou un risque pour tes données."',
      safeBtn: 'Zone Sûre',
      riskyBtn: 'Zone à Risque',
      finishedTitle: 'Toutes les cartes sont triées !',
      finishedDesc: 'Tu as fait preuve d’un excellent flair pour repérer les bonnes pratiques numériques.',
      claimBtn: 'Récupérer les Récompenses !',
      cards: [
        {
          id: 'c1',
          text: 'Publier la photo de ton dessin préféré avec ton pseudo de jeu',
          category: 'Créativité',
          isSafe: true,
          explanation: 'Parfaitement sûr ! Partager ses créations sans adresse ni nom d’école est une super idée.',
        },
        {
          id: 'c2',
          text: 'Poster une photo montrant la façade de ta maison avec la plaque de rue',
          category: 'Localisation',
          isSafe: false,
          explanation: 'Très risqué ! Le nom de la rue et le numéro révèlent exactement ton lieu d’habitation.',
        },
        {
          id: 'c3',
          text: 'Avoir un mot de passe différent pour ta boîte mail et pour tes jeux vidéo',
          category: 'Mots de passe',
          isSafe: true,
          explanation: 'Excellente habitude ! Même si un jeu a une faille, ta messagerie reste protégée.',
        },
        {
          id: 'c4',
          text: 'Un inconnu sur Roblox demande ton numéro WhatsApp pour t’offrir des gemmes',
          category: 'Inconnus',
          isSafe: false,
          explanation: 'Très risqué ! Basculer sur un chat privé externe est le piège classique des arnaqueurs.',
        },
        {
          id: 'c5',
          text: 'Activer la double authentification (2FA) avec l’aide de tes parents',
          category: 'Sécurité',
          isSafe: true,
          explanation: 'La meilleure défense ! Même avec ton mot de passe, personne ne peut entrer sans le 2e code.',
        },
      ],
    },
    en: {
      tag: 'Mechanic 8 / Sorting',
      title: 'Safe or Risky',
      mascot: 'Ciber says: "Examine the situation and decide whether it protects privacy or risks your digital identity."',
      safeBtn: 'Safe Zone',
      riskyBtn: 'Risk Zone',
      finishedTitle: 'All cards sorted!',
      finishedDesc: 'You showed sharp instincts identifying safe practices versus risky online oversights.',
      claimBtn: 'Claim Rewards!',
      cards: [
        {
          id: 'c1',
          text: 'Posting a picture of your favorite drawing using only your gamer nickname',
          category: 'Creativity',
          isSafe: true,
          explanation: 'Completely safe! Sharing hobbies without school names or home addresses is great.',
        },
        {
          id: 'c2',
          text: 'Uploading a photo of the front of your house showing the street sign',
          category: 'Location',
          isSafe: false,
          explanation: 'Risky! A home exterior with street names reveals exactly where you live.',
        },
        {
          id: 'c3',
          text: 'Using a different password for your email than for gaming accounts',
          category: 'Passwords',
          isSafe: true,
          explanation: 'Excellent practice! If a game gets breached, your email stays secure.',
        },
        {
          id: 'c4',
          text: 'A stranger in Roblox asks for your WhatsApp phone number to "give you free gems"',
          category: 'Strangers',
          isSafe: false,
          explanation: 'Risky! Moving off-platform to personal chats is a classic social engineering trick.',
        },
        {
          id: 'c5',
          text: 'Enabling two-factor authentication (2FA) together with your parents',
          category: 'Security',
          isSafe: true,
          explanation: 'The best defense! Even if someone knows your password, they cannot log in without the second code.',
        },
      ],
    },
  };

  const loc = locData[language] || locData.en || locData.es;

  const cards = loc.cards;
  const currentCard = cards[currentIndex];
  const isFinished = currentIndex >= cards.length;

  const handleSort = (choice: 'safe' | 'risky') => {
    const isCorrect = (choice === 'safe' && currentCard.isSafe) || (choice === 'risky' && !currentCard.isSafe);

    setResults((prev) => [...prev, { id: currentCard.id, correct: isCorrect }]);
    setFeedback(currentCard.explanation);

    setTimeout(() => {
      setFeedback(null);
      setCurrentIndex((prev) => prev + 1);
    }, 1500);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col p-5 sm:p-6 bg-slate-50 text-slate-800 select-none overflow-y-auto scrollbar-none space-y-6 sm:space-y-7 pb-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold text-emerald-600 tracking-wider">
              {loc.tag}
            </div>
            <h2 className="text-base font-black text-slate-900">{loc.title}</h2>
          </div>
        </div>
        <span className="text-xs font-bold text-slate-600">
          {Math.min(currentIndex + 1, cards.length)} / {cards.length}
        </span>
      </div>

      {/* Mascot hint */}
      <div className="flex items-center gap-3.5 p-4 bg-emerald-50/80 rounded-3xl border border-emerald-100">
        <CiberMascot size="sm" expression={feedback ? 'celebrating' : 'thinking'} />
        <div className="text-xs sm:text-sm text-emerald-950 leading-relaxed">
          {loc.mascot}
        </div>
      </div>

      {/* Main Sortable Card Area */}
      {!isFinished ? (
        <div className="flex-1 flex flex-col justify-between py-2 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCard.id}
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -15 }}
              className="bg-white rounded-3xl p-6 shadow-md border-2 border-slate-100 min-h-[190px] flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wider">
                  {currentCard.category}
                </span>
                <p className="text-sm sm:text-base font-bold text-slate-900 mt-3 leading-snug">
                  "{currentCard.text}"
                </p>
              </div>

              {/* Feedback toast */}
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 p-2.5 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-900 font-medium"
                >
                  {feedback}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* 2 Big Decision Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => handleSort('safe')}
              disabled={!!feedback}
              className="py-4 px-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300 text-emerald-800 font-black text-sm flex flex-col items-center justify-center gap-1 transition cursor-pointer active:scale-95 shadow-sm"
            >
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              <span>{loc.safeBtn}</span>
            </button>

            <button
              onClick={() => handleSort('risky')}
              disabled={!!feedback}
              className="py-4 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 border-2 border-rose-300 text-rose-800 font-black text-sm flex flex-col items-center justify-center gap-1 transition cursor-pointer active:scale-95 shadow-sm"
            >
              <AlertTriangle className="w-6 h-6 text-rose-600" />
              <span>{loc.riskyBtn}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Finished summary */
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 text-center space-y-4 my-auto">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-slate-900">{loc.finishedTitle}</h3>
          <p className="text-xs text-slate-600 max-w-xs mx-auto">
            {loc.finishedDesc}
          </p>
          <button
            onClick={onComplete}
            className="w-full py-3.5 rounded-2xl font-black text-sm bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            {loc.claimBtn}
          </button>
        </div>
      )}
    </div>
  );
};
