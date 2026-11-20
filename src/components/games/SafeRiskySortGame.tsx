import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layers,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { ChildAgeGroup, GameResultStats } from '../../types';
import { GameHud, GameVictorySummary } from './GameShell';
import { computeStars } from '../../utils/ageDifficulty';
import { playGameSound } from '../../utils/gameAudio';

interface CardItem {
  id: string;
  text: string;
  category: string;
  isSafe: boolean;
  explanation: string;
}

interface SafeRiskySortGameProps {
  onComplete: (stats?: GameResultStats) => void;
  ageGroup?: ChildAgeGroup;
}

export const SafeRiskySortGame: React.FC<SafeRiskySortGameProps> = ({
  onComplete,
  ageGroup = '8–10' as ChildAgeGroup,
}) => {
  const { language } = useLanguage();

  const copy = useMemo(() => {
    const esCards: CardItem[] = [
      {
        id: 'c1',
        text: 'Publicar una foto de tu dibujo favorito usando solo tu apodo gamer.',
        category: 'Creatividad',
        isSafe: true,
        explanation: '¡Seguro! Compartir tus pasatiempos sin mostrar colegio, casa ni nombre real es excelente.',
      },
      {
        id: 'c2',
        text: 'Subir una foto frente a tu casa donde se ve el nombre de la calle y el número.',
        category: 'Ubicación',
        isSafe: false,
        explanation: '¡Riesgoso! Mostrar el letrero de la calle y número permite ubicar tu vivienda.',
      },
      {
        id: 'c3',
        text: 'Usar una contraseña distinta para tu correo y para tus videojuegos.',
        category: 'Contraseñas',
        isSafe: true,
        explanation: '¡Seguro! Si se filtra un juego, tu correo y demás cuentas siguen protegidas.',
      },
      {
        id: 'c4',
        text: 'Un jugador desconocido pide tu WhatsApp para "pasarte gemas gratis".',
        category: 'Desconocidos',
        isSafe: false,
        explanation: '¡Riesgoso! Sacar la charla a chats privados con excusa de premios es un engaño clásico.',
      },
      {
        id: 'c5',
        text: 'Activar la verificación en dos pasos (2FA) con ayuda de tus padres.',
        category: 'Defensa 2FA',
        isSafe: true,
        explanation: '¡Seguro! Aunque alguien consiga tu clave, no podrá entrar sin el segundo código.',
      },
      {
        id: 'c6',
        text: 'Descargar un "mod gratis" de un enlace acortado enviado por alguien en un servidor.',
        category: 'Descargas',
        isSafe: false,
        explanation: '¡Riesgoso! Los archivos fuera de tiendas oficiales suelen ocultar malware o robacuentas.',
      },
      {
        id: 'c7',
        text: 'Revisar los permisos de micrófono de una app de filtros antes de instalarla.',
        category: 'Permisos',
        isSafe: true,
        explanation: '¡Seguro! Auditar permisos innecesarios protege tus datos antes de dar acceso.',
      },
      {
        id: 'c8',
        text: 'Conectarte al Wi-Fi abierto del aeropuerto sin contraseña para entrar a tu cuenta bancaria o correo.',
        category: 'Redes Wi-Fi',
        isSafe: false,
        explanation: '¡Riesgoso! En redes públicas abiertas terceros pueden interceptar sesiones sensibles.',
      },
    ];

    const frCards: CardItem[] = [
      {
        id: 'c1',
        text: 'Publier la photo de ton dessin préféré avec uniquement ton pseudo de jeu.',
        category: 'Créativité',
        isSafe: true,
        explanation: 'Sûr ! Partager tes créations sans école ni vrai nom protège ta vie privée.',
      },
      {
        id: 'c2',
        text: 'Poster une photo devant ta maison montrant le numéro et le nom de la rue.',
        category: 'Localisation',
        isSafe: false,
        explanation: 'Risqué ! Une plaque de rue et un numéro révèlent exactement où tu habites.',
      },
      {
        id: 'c3',
        text: 'Utiliser un mot de passe différent pour ta messagerie et pour tes jeux vidéo.',
        category: 'Mots de passe',
        isSafe: true,
        explanation: 'Sûr ! Si un jeu subit une fuite, ta boîte mail reste protégée.',
      },
      {
        id: 'c4',
        text: 'Un inconnu en ligne demande ton WhatsApp pour t’envoyer des gemmes gratuites.',
        category: 'Inconnus',
        isSafe: false,
        explanation: 'Risqué ! Basculer sur un chat personnel contre de faux cadeaux est un piège classique.',
      },
      {
        id: 'c5',
        text: 'Activer la double authentification (2FA) avec l’aide de tes parents.',
        category: 'Défense 2FA',
        isSafe: true,
        explanation: 'Sûr ! Même avec ton mot de passe, personne ne peut entrer sans le 2e code.',
      },
      {
        id: 'c6',
        text: 'Télécharger un « mod gratuit » depuis un lien raccourci partagé sur un serveur.',
        category: 'Téléchargements',
        isSafe: false,
        explanation: 'Risqué ! Les fichiers hors boutiques officielles cachent souvent des virus ou voleurs de compte.',
      },
      {
        id: 'c7',
        text: 'Vérifier les permissions micro et contacts d’une appli avant de l’installer.',
        category: 'Permissions',
        isSafe: true,
        explanation: 'Sûr ! Limiter les permissions abusives protège ton téléphone dès le départ.',
      },
      {
        id: 'c8',
        text: 'Utiliser un Wi-Fi public ouvert sans mot de passe pour accéder à ta messagerie principale.',
        category: 'Réseaux Wi-Fi',
        isSafe: false,
        explanation: 'Risqué ! Les réseaux ouverts permettent à d’autres d’intercepter les échanges sensibles.',
      },
    ];

    const enCards: CardItem[] = [
      {
        id: 'c1',
        text: 'Posting a picture of your drawing using only a creative gamer nickname.',
        category: 'Creativity',
        isSafe: true,
        explanation: 'Safe! Sharing hobbies without school names or addresses keeps your identity protected.',
      },
      {
        id: 'c2',
        text: 'Uploading a selfie outside your front door showing the house number and street sign.',
        category: 'Location',
        isSafe: false,
        explanation: 'Risky! Street signs and house numbers pinpoint your real address.',
      },
      {
        id: 'c3',
        text: 'Using a completely different password for your email than for your games.',
        category: 'Passwords',
        isSafe: true,
        explanation: 'Safe! If one game gets breached, your primary email stays safe.',
      },
      {
        id: 'c4',
        text: 'A stranger in a game asks for your WhatsApp number to "send free coins."',
        category: 'Strangers',
        isSafe: false,
        explanation: 'Risky! Moving off-platform for promised rewards is a classic social engineering trick.',
      },
      {
        id: 'c5',
        text: 'Turning on Two-Factor Authentication (2FA) together with a parent.',
        category: '2FA Defense',
        isSafe: true,
        explanation: 'Safe! Even if someone guesses your password, they are blocked without the second code.',
      },
      {
        id: 'c6',
        text: 'Installing a "free mod" from a shortened link dropped in a public server chat.',
        category: 'Downloads',
        isSafe: false,
        explanation: 'Risky! Files outside official stores frequently contain info-stealers or malware.',
      },
      {
        id: 'c7',
        text: 'Checking whether a filter app demands microphone and contact access before installing.',
        category: 'Permissions',
        isSafe: true,
        explanation: 'Safe! Auditing unnecessary permissions limits data harvesting before it starts.',
      },
      {
        id: 'c8',
        text: 'Logging into your main email over an open unencrypted airport Wi-Fi hotspot.',
        category: 'Public Wi-Fi',
        isSafe: false,
        explanation: 'Risky! Sensitive sessions on open Wi-Fi can be snooped by attackers on the same network.',
      },
    ];

    const pool = language === 'fr' ? frCards : language === 'en' ? enCards : esCards;
    const count = ageGroup === '13–14' ? 8 : ageGroup === '11–12' ? 7 : 5;
    const cards = pool.slice(0, count);

    const labels = {
      es: {
        title: 'Seguro o Riesgoso',
        subtitle: `Clasifica ${count} situaciones reales`,
        safeBtn: 'Zona Segura',
        riskyBtn: 'Zona de Riesgo',
        nextBtn: 'Siguiente Tarjeta',
        correctLabel: '¡Clasificación correcta!',
        wrongLabel: '¡Atención a esta lección!',
        takeaway:
          'Antes de publicar, descargar o responder a extraños, pregúntate si revela tu ubicación, cuentas o permisos innecesarios.',
      },
      fr: {
        title: 'Sûr ou Risqué',
        subtitle: `Classe ${count} situations numériques`,
        safeBtn: 'Zone Sûre',
        riskyBtn: 'Zone à Risque',
        nextBtn: 'Carte Suivante',
        correctLabel: 'Bien classé !',
        wrongLabel: 'Retiens bien ce conseil :',
        takeaway:
          'Avant de publier, télécharger ou répondre à un inconnu, demande-toi si cela expose ta position, tes comptes ou des accès inutiles.',
      },
      en: {
        title: 'Safe or Risky',
        subtitle: `Classify ${count} real digital habits`,
        safeBtn: 'Safe Zone',
        riskyBtn: 'Risk Zone',
        nextBtn: 'Next Card',
        correctLabel: 'Nailed it!',
        wrongLabel: 'Key takeaway:',
        takeaway:
          'Before posting, downloading, or replying, pause and check whether an action exposes your address, accounts, or extra device access.',
      },
    }[language];

    return { cards, labels };
  }, [ageGroup, language]);

  const [idx, setIdx] = useState(0);
  const [choiceMade, setChoiceMade] = useState<'safe' | 'risky' | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(1);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = copy.cards[idx];

  const handleSort = (choice: 'safe' | 'risky') => {
    if (choiceMade) return;
    const isRight =
      (choice === 'safe' && current.isSafe) || (choice === 'risky' && !current.isSafe);

    setChoiceMade(choice);
    if (isRight) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setMaxStreak((m) => Math.max(m, nextStreak));
      setCorrectCount((c) => c + 1);
      setScore((s) => s + 110 + nextStreak * 20);
      playGameSound(nextStreak > 1 ? 'combo' : 'correct');
    } else {
      setStreak(0);
      playGameSound('wrong');
    }
  };

  const handleNext = () => {
    if (idx < copy.cards.length - 1) {
      setIdx((i) => i + 1);
      setChoiceMade(null);
    } else {
      playGameSound('win');
      setFinished(true);
    }
  };

  const handleReplay = () => {
    setIdx(0);
    setChoiceMade(null);
    setScore(0);
    setStreak(0);
    setMaxStreak(1);
    setCorrectCount(0);
    setFinished(false);
  };

  const answered = idx + (choiceMade ? 1 : 0);
  const accuracy = answered > 0 ? Math.round((correctCount / answered) * 100) : 100;

  if (finished) {
    const finalAcc = Math.round((correctCount / copy.cards.length) * 100);
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

  const isAnswerCorrect =
    choiceMade !== null &&
    ((choiceMade === 'safe' && current.isSafe) ||
      (choiceMade === 'risky' && !current.isSafe));

  return (
    <div className="flex-1 min-h-0 w-full max-w-full flex flex-col p-3.5 sm:p-5 bg-slate-50 text-slate-800 select-none overflow-y-auto overflow-x-hidden scrollbar-none space-y-4 pb-8">
      <GameHud
        title={copy.labels.title}
        subtitle={copy.labels.subtitle}
        icon={<Layers className="w-5 h-5" />}
        accentColor="emerald"
        ageGroup={ageGroup}
        currentStep={idx + 1}
        totalSteps={copy.cards.length}
        score={score}
        streak={streak}
        accuracy={answered > 0 ? accuracy : undefined}
      />

      {/* Situation Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-200/80 space-y-4 flex-1 flex flex-col justify-between min-h-[210px]"
        >
          <div className="space-y-2.5">
            <div className="text-xs font-black uppercase tracking-wider text-emerald-700">
              {current.category}
            </div>
            <p className="text-base sm:text-lg font-black text-slate-900 leading-snug">
              "{current.text}"
            </p>
          </div>

          {choiceMade && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3.5 rounded-2xl border text-xs sm:text-sm space-y-1 ${
                isAnswerCorrect
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-amber-50 border-amber-200 text-amber-950'
              }`}
            >
              <div className="font-black flex items-center gap-1.5">
                {isAnswerCorrect ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-amber-600" />
                )}
                <span>
                  {isAnswerCorrect ? copy.labels.correctLabel : copy.labels.wrongLabel}
                </span>
              </div>
              <p className="font-medium leading-relaxed">{current.explanation}</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Action Buttons */}
      {!choiceMade ? (
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleSort('safe')}
            className="py-4 px-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300 text-emerald-800 font-black text-sm sm:text-base flex flex-col items-center justify-center gap-1.5 transition cursor-pointer active:scale-[0.97]"
          >
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <span>{copy.labels.safeBtn}</span>
          </button>

          <button
            type="button"
            onClick={() => handleSort('risky')}
            className="py-4 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 border-2 border-rose-300 text-rose-800 font-black text-sm sm:text-base flex flex-col items-center justify-center gap-1.5 transition cursor-pointer active:scale-[0.97]"
          >
            <AlertTriangle className="w-6 h-6 text-rose-600" />
            <span>{copy.labels.riskyBtn}</span>
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleNext}
          className="w-full py-4 rounded-2xl font-black text-sm sm:text-base bg-gradient-to-r from-emerald-500 to-cyan-600 text-white shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition"
        >
          <span>{copy.labels.nextBtn}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
