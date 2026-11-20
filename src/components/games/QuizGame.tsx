import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { HelpCircle, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { ChildAgeGroup, GameResultStats } from '../../types';
import { GameHud, GameVictorySummary } from './GameShell';
import { computeStars } from '../../utils/ageDifficulty';
import { playGameSound } from '../../utils/gameAudio';

interface QuizGameProps {
  onComplete: (stats?: GameResultStats) => void;
  ageGroup?: ChildAgeGroup;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: { text: string; isCorrect: boolean; feedback: string }[];
}

export const QuizGame: React.FC<QuizGameProps> = ({
  onComplete,
  ageGroup = '8–10' as ChildAgeGroup,
}) => {
  const { language } = useLanguage();

  const copy = useMemo(() => {
    const esPool: QuizQuestion[] = [
      {
        id: 'q1',
        question: '¿Por qué nunca debes compartir tu ubicación en tiempo real en historias públicas?',
        options: [
          {
            text: 'Porque cualquiera puede saber exactamente dónde estás en ese instante.',
            isCorrect: true,
            feedback: '¡Exacto! Publica recuerdos cuando ya estés a salvo en casa.',
          },
          {
            text: 'Porque solo gasta batería del teléfono.',
            isCorrect: false,
            feedback: 'El riesgo principal es tu seguridad física al revelar rutinas.',
          },
          {
            text: 'Porque solo la ven tus amigos de clase.',
            isCorrect: false,
            feedback: 'Las cuentas públicas son visibles para cualquier desconocido en red.',
          },
        ],
      },
      {
        id: 'q2',
        question: 'Tu mejor amigo te pide tu contraseña del juego "solo por hoy" para pasarse un nivel. ¿Qué haces?',
        options: [
          {
            text: 'No compartirla: las contraseñas son personales incluso entre amigos.',
            isCorrect: true,
            feedback: '¡Correcto! Si alguien entra con tu clave o pierde su móvil, tu cuenta queda expuesta.',
          },
          {
            text: 'Dársela igual porque confío en él.',
            isCorrect: false,
            feedback: 'Incluso un buen amigo puede olvidar cerrar sesión o reenviarla por error.',
          },
        ],
      },
      {
        id: 'q3',
        question: '¿Qué debes revisar primero en un enlace antes de hacer clic?',
        options: [
          {
            text: 'El dominio raíz exacto justo antes de la primera barra ("/").',
            isCorrect: true,
            feedback: '¡Bien! Ahí ves quién controla realmente el sitio web.',
          },
          {
            text: 'Si la página tiene colores bonitos y emojis de regalo.',
            isCorrect: false,
            feedback: 'Los estafadores imitan logos y colores reales para engañarte.',
          },
        ],
      },
      {
        id: 'q4',
        question: 'Una app de linterna te pide permiso a "Contactos, Cámara y Micrófono". ¿Qué significa?',
        options: [
          {
            text: 'Permisos excesivos sospechosos: una linterna no necesita oír ni ver tus contactos.',
            isCorrect: true,
            feedback: '¡Excelente ojo! Rechaza y busca una app que respete tus permisos.',
          },
          {
            text: 'Es totalmente normal en cualquier app moderna.',
            isCorrect: false,
            feedback: '¡No! Pedir acceso sin relación con la función indica recolección abusiva de datos.',
          },
        ],
      },
      {
        id: 'q5',
        question: 'Un sitio dice "https://" con candado verde. ¿Significa automáticamente que no es phishing?',
        options: [
          {
            text: 'No: HTTPS solo cifra el viaje de datos, los sitios falsos también pueden tener candado.',
            isCorrect: true,
            feedback: '¡Nivel Pro! El candado protege el túnel, pero debes verificar el dominio real.',
          },
          {
            text: 'Sí, el candado garantiza que el sitio es 100% oficial y honesto.',
            isCorrect: false,
            feedback: 'Mito común: muchos clones de phishing usan certificados HTTPS gratuitos.',
          },
        ],
      },
    ];

    const frPool: QuizQuestion[] = [
      {
        id: 'q1',
        question: 'Pourquoi ne jamais partager ta localisation en direct dans des stories publiques ?',
        options: [
          {
            text: 'Parce que n’importe qui peut savoir exactement où tu te trouves à cet instant.',
            isCorrect: true,
            feedback: 'Exact ! Poste tes souvenirs uniquement une fois rentré en sécurité.',
          },
          {
            text: 'Uniquement parce que ça vide la batterie.',
            isCorrect: false,
            feedback: 'Le danger majeur est ta sécurité physique et celle de ta famille.',
          },
          {
            text: 'Aucun souci, seuls mes camarades peuvent voir.',
            isCorrect: false,
            feedback: 'En mode public, tout inconnu sur Internet peut consulter tes stories.',
          },
        ],
      },
      {
        id: 'q2',
        question: 'Ton meilleur ami te demande ton mot de passe « juste pour ce soir » afin de débloquer un niveau. Que fais-tu ?',
        options: [
          {
            text: 'Refuser poliment : un mot de passe reste strictement personnel.',
            isCorrect: true,
            feedback: 'Bravo ! Un mot de passe partagé n’est plus secret même entre amis.',
          },
          {
            text: 'Le lui donner car c’est mon ami d’école.',
            isCorrect: false,
            feedback: 'Même par erreur, un appareil partagé ou piraté exposerait ton compte.',
          },
        ],
      },
      {
        id: 'q3',
        question: 'Que dois-tu vérifier en priorité dans une URL avant de cliquer ?',
        options: [
          {
            text: 'Le domaine racine exact juste avant le premier « / ».',
            isCorrect: true,
            feedback: 'Bien vu ! C’est lui qui révèle le véritable propriétaire du site.',
          },
          {
            text: 'Si le lien promet une belle récompense avec des émojis.',
            isCorrect: false,
            feedback: 'Les arnaques copient les logos officiels pour inspirer confiance.',
          },
        ],
      },
      {
        id: 'q4',
        question: 'Une appli lampe-torche réclame l’accès « Contacts, Micro et Caméra ». Que décides-tu ?',
        options: [
          {
            text: 'Refuser : une lampe-torche n’a besoin ni du micro ni de tes contacts.',
            isCorrect: true,
            feedback: 'Excellent réflexe ! Des permissions inutiles signalent une collecte abusive.',
          },
          {
            text: 'Tout accepter pour aller plus vite.',
            isCorrect: false,
            feedback: 'Toujours vérifier pourquoi une appli demande chaque permission.',
          },
        ],
      },
      {
        id: 'q5',
        question: 'Un site affiche « https:// » avec un cadenas. Est-ce forcément un site officiel sûr ?',
        options: [
          {
            text: 'Non : HTTPS chiffre la connexion, mais un site pirate peut aussi avoir un cadenas.',
            isCorrect: true,
            feedback: 'Niveau Pro ! Il faut aussi contrôler attentivement le nom de domaine.',
          },
          {
            text: 'Oui, le cadenas certifie que l’entreprise est honnête.',
            isCorrect: false,
            feedback: 'Idée reçue : de nombreux faux sites utilisent des certificats HTTPS gratuits.',
          },
        ],
      },
    ];

    const enPool: QuizQuestion[] = [
      {
        id: 'q1',
        question: 'Why should you never broadcast real-time location in public stories?',
        options: [
          {
            text: 'Anyone online can see exactly where you are at that very moment.',
            isCorrect: true,
            feedback: 'Exactly! Share cool photos only after you are safely home.',
          },
          {
            text: 'Because it only drains phone battery.',
            isCorrect: false,
            feedback: 'The main risk is physical privacy and exposing your daily routines.',
          },
          {
            text: 'Only classmates can view public stories anyway.',
            isCorrect: false,
            feedback: 'Public stories can be viewed by complete strangers anywhere.',
          },
        ],
      },
      {
        id: 'q2',
        question: 'Your close friend asks for your game password "just tonight" to pass a level. What should you do?',
        options: [
          {
            text: 'Keep it private — passwords belong only to you and your parents.',
            isCorrect: true,
            feedback: 'Spot on! Once shared, a password is no longer under your control.',
          },
          {
            text: 'Share it since we hang out every day.',
            isCorrect: false,
            feedback: 'Even trusted friends might accidentally leave accounts logged in or get hacked.',
          },
        ],
      },
      {
        id: 'q3',
        question: 'What part of a link should you inspect first before clicking?',
        options: [
          {
            text: 'The exact root domain right before the first "/".',
            isCorrect: true,
            feedback: 'Sharp! The root domain tells you who actually owns the page.',
          },
          {
            text: 'Whether the button glows bright green.',
            isCorrect: false,
            feedback: 'Scam pages copy official logos and colors to look trustworthy.',
          },
        ],
      },
      {
        id: 'q4',
        question: 'A simple flashlight app asks for Contacts, Microphone, and Camera permissions. What does this tell you?',
        options: [
          {
            text: 'Red flag: unnecessary access to personal data unrelated to a flashlight.',
            isCorrect: true,
            feedback: 'Awesome catch! Deny excessive permissions and uninstall.',
          },
          {
            text: 'Every modern app requires full sensor access.',
            isCorrect: false,
            feedback: 'Apps should only request permissions essential for their core job.',
          },
        ],
      },
      {
        id: 'q5',
        question: 'A login page shows "https://" with a padlock icon. Does that guarantee it is not phishing?',
        options: [
          {
            text: 'No — HTTPS encrypts traffic, but fake scam sites can also use HTTPS padlocks.',
            isCorrect: true,
            feedback: 'Pro answer! Always inspect the domain spelling even when HTTPS is shown.',
          },
          {
            text: 'Yes, the padlock proves the site is the real brand.',
            isCorrect: false,
            feedback: 'Common myth! Attackers regularly install free HTTPS certificates on phishing domains.',
          },
        ],
      },
    ];

    const pool = language === 'fr' ? frPool : language === 'en' ? enPool : esPool;
    const count = ageGroup === '13–14' ? 5 : ageGroup === '11–12' ? 4 : 3;
    const questions = pool.slice(0, count);

    const labels = {
      es: {
        title: 'Trivia Táctica de Ciberdefensa',
        subtitle: `Supera ${count} decisiones clave sin caer en trampas`,
        nextBtn: 'Siguiente Pregunta',
        takeaway:
          'Piensa como un guardián: cuida tu ubicación en vivo, no prestes contraseñas, audita permisos de apps y recuerda que HTTPS no sustituye verificar el dominio real.',
      },
      fr: {
        title: 'Quiz Tactique de Cyberdéfense',
        subtitle: `Réussis ${count} décisions clés de sécurité`,
        nextBtn: 'Question Suivante',
        takeaway:
          'Pense comme un gardien : protège ta position en direct, garde tes mots de passe secrets, surveille les permissions et vérifie le vrai nom de domaine.',
      },
      en: {
        title: 'Tactical Cyber Defense Quiz',
        subtitle: `Master ${count} key digital safety decisions`,
        nextBtn: 'Next Question',
        takeaway:
          'Think like a guardian: avoid live location sharing, never lend passwords, reject greedy app permissions, and inspect root domains even over HTTPS.',
      },
    }[language];

    return { questions, labels };
  }, [ageGroup, language]);

  const [idx, setIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(1);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = copy.questions[idx];
  const chosenOption = selectedIdx !== null ? current.options[selectedIdx] : null;

  const handleSelect = (optIdx: number) => {
    if (selectedIdx !== null) return;
    setSelectedIdx(optIdx);
    const opt = current.options[optIdx];
    if (opt.isCorrect) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setMaxStreak((m) => Math.max(m, nextStreak));
      setCorrectCount((c) => c + 1);
      setScore((s) => s + 120 + nextStreak * 20);
      playGameSound(nextStreak > 1 ? 'combo' : 'correct');
    } else {
      setStreak(0);
      playGameSound('wrong');
    }
  };

  const handleNext = () => {
    if (idx < copy.questions.length - 1) {
      setIdx((i) => i + 1);
      setSelectedIdx(null);
    } else {
      playGameSound('win');
      setFinished(true);
    }
  };

  const handleReplay = () => {
    setIdx(0);
    setSelectedIdx(null);
    setScore(0);
    setStreak(0);
    setMaxStreak(1);
    setCorrectCount(0);
    setFinished(false);
  };

  const answered = idx + (selectedIdx !== null ? 1 : 0);
  const accuracy = answered > 0 ? Math.round((correctCount / answered) * 100) : 100;

  if (finished) {
    const finalAcc = Math.round((correctCount / copy.questions.length) * 100);
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
        subtitle={copy.labels.subtitle}
        icon={<HelpCircle className="w-5 h-5" />}
        accentColor="blue"
        ageGroup={ageGroup}
        currentStep={idx + 1}
        totalSteps={copy.questions.length}
        score={score}
        streak={streak}
        accuracy={answered > 0 ? accuracy : undefined}
      />

      <motion.div
        key={current.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex-1 min-h-0 bg-white rounded-3xl p-4 sm:p-6 shadow-xs border border-slate-200/80 flex flex-col justify-center gap-4"
      >
        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
          {current.question}
        </h3>

        <div className="space-y-2.5">
          {current.options.map((opt, oIdx) => {
            const isPicked = selectedIdx === oIdx;
            return (
              <button
                key={oIdx}
                type="button"
                disabled={selectedIdx !== null}
                onClick={() => handleSelect(oIdx)}
                className={`w-full text-left p-3.5 sm:p-4 min-h-[52px] rounded-2xl border-2 text-xs sm:text-sm font-semibold transition flex items-center justify-between gap-2 cursor-pointer ${
                  selectedIdx !== null
                    ? opt.isCorrect
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                      : isPicked
                      ? 'bg-rose-50 border-rose-400 text-rose-950'
                      : 'bg-slate-50 border-slate-200 text-slate-500 opacity-70'
                    : 'bg-slate-50 hover:bg-sky-50 border-slate-200 hover:border-sky-300 text-slate-800'
                }`}
              >
                <span className="leading-snug">{opt.text}</span>
                {selectedIdx !== null && opt.isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {selectedIdx !== null && isPicked && !opt.isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {chosenOption && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-medium leading-relaxed ${
              chosenOption.isCorrect
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}
          >
            {chosenOption.feedback}
          </motion.div>
        )}
      </motion.div>

      {chosenOption && (
        <button
          type="button"
          onClick={handleNext}
          className="w-full py-3.5 min-h-[48px] shrink-0 rounded-2xl font-bold text-sm sm:text-base bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition"
        >
          <span>{copy.labels.nextBtn}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
