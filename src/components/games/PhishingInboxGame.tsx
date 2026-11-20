import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail,
  AlertTriangle,
  ShieldCheck,
  Search,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Eye,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { ChildAgeGroup, GameResultStats } from '../../types';
import { GameHud, GameVictorySummary } from './GameShell';
import { computeStars } from '../../utils/ageDifficulty';
import { playGameSound } from '../../utils/gameAudio';

interface EmailItem {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  date: string;
  isPhishing: boolean;
  clues: string[];
  explanation: string;
  fullBody: string;
}

interface PhishingInboxGameProps {
  onComplete: (stats?: GameResultStats) => void;
  ageGroup?: ChildAgeGroup;
}

export const PhishingInboxGame: React.FC<PhishingInboxGameProps> = ({
  onComplete,
  ageGroup = '8–10' as ChildAgeGroup,
}) => {
  const { language } = useLanguage();

  const copy = useMemo(() => {
    const esEmails: EmailItem[] = [
      {
        id: 'em-1',
        senderName: 'Soporte Roblox Oficial',
        senderEmail: 'soporte@robl0x-premios-gratis.net',
        subject: '¡URGENTE! Has ganado 50,000 Robux gratis',
        date: '10:42 AM',
        isPhishing: true,
        clues: [
          'Remitente falso: "robl0x" usa un cero en vez de "o"',
          'Falsa urgencia: "expiran en 15 minutos"',
        ],
        explanation:
          'Las plataformas oficiales jamás usan dominios con faltas ("robl0x") ni regalan 50,000 monedas por sorpresa.',
        fullBody:
          '¡Felicidades jugador! Has sido seleccionado al azar para recibir 50,000 Robux. Haz clic e ingresa tu usuario y contraseña de inmediato antes de que expire.',
      },
      {
        id: 'em-2',
        senderName: 'Colegio San Patricio',
        senderEmail: 'notificaciones@colegiosanpatricio.edu',
        subject: 'Circular escolar: Horarios de exámenes de mayo',
        date: 'Ayer',
        isPhishing: false,
        clues: ['Dominio oficial .edu del colegio', 'No solicita contraseñas ni clics urgentes'],
        explanation:
          'Correo escolar legítimo: dominio verificado .edu y sin pedir datos sensibles ni claves.',
        fullBody:
          'Estimados alumnos: el calendario de evaluaciones trimestrales ya está disponible en la cartelera del colegio y en el portal estudiantil.',
      },
      {
        id: 'em-3',
        senderName: 'Nintendo Rewards',
        senderEmail: 'premios@switch-sorteo-ganadores.xyz',
        subject: '¡Ganaste una Nintendo Switch OLED!',
        date: '25 Abr',
        isPhishing: true,
        clues: ['Dominio ".xyz" sospechoso', 'Pide tarjeta para pagar "$2 de envío"'],
        explanation:
          'Los sorteos falsos prometen consolas gratis para robar tarjetas de crédito bajo excusa de envío.',
        fullBody:
          '¡Ganador confirmado! Tu boleto digital ganó una consola Nintendo Switch OLED. Cubre $2 de envío ingresando tu tarjeta bancaria.',
      },
      {
        id: 'em-4',
        senderName: 'Discord Gift Drops',
        senderEmail: 'promo@dlscord-nitro-free.com',
        subject: 'Alguien te regaló 1 año de Nitro — Reclámalo hoy',
        date: 'Hace 2h',
        isPhishing: true,
        clues: [
          'Typosquatting: "dlscord" usa una L en vez de I',
          'Solicita iniciar sesión fuera de discord.com',
        ],
        explanation:
          'Cambiar "i" por "l" ("dlscord") es un truco visual clásico para robar tokens y cuentas.',
        fullBody:
          'Un amigo del servidor te envió Nitro por 12 meses. Inicia sesión en nuestro portal externo para activar tu regalo.',
      },
      {
        id: 'em-5',
        senderName: 'Google Security Alerts',
        senderEmail: 'no-reply@accounts.google.com.verify-token.co',
        subject: 'Alerta crítica: 3 inicios de sesión bloqueados',
        date: '09:15 AM',
        isPhishing: true,
        clues: [
          'El dominio raíz real es "verify-token.co", no google.com',
          'Ingeniería social usando pánico de robo de cuenta',
        ],
        explanation:
          'Aunque diga "accounts.google.com" al principio, el dominio real antes de la barra es "verify-token.co".',
        fullBody:
          'Detectamos accesos desde otro país. Confirma tu código 2FA y contraseña ahora mismo en el enlace de verificación o tu cuenta será suspendida.',
      },
      {
        id: 'em-6',
        senderName: 'Biblioteca Municipal',
        senderEmail: 'prestamos@bibliotecaciudad.org',
        subject: 'Recordatorio de devolución: El Principito',
        date: '28 Abr',
        isPhishing: false,
        clues: ['Dominio institucional .org', 'Información rutinaria sin pedir claves'],
        explanation:
          'Recordatorio real de la biblioteca: sin enlaces extraños ni solicitud de datos personales.',
        fullBody:
          'Hola Lucas: te recordamos que el préstamo de "El Principito" vence este viernes. Puedes entregarlo en recepción.',
      },
    ];

    const frEmails: EmailItem[] = [
      {
        id: 'em-1',
        senderName: 'Support Roblox Officiel',
        senderEmail: 'support@robl0x-cadeaux-gratuits.net',
        subject: 'URGENT ! Tu as gagné 50 000 Robux gratuits',
        date: '10:42',
        isPhishing: true,
        clues: ['Faux domaine : "robl0x" avec un zéro', 'Fausse urgence : 15 minutes'],
        explanation:
          'Les plateformes officielles n’utilisent jamais "robl0x" et n’offrent pas 50 000 pièces par surprise.',
        fullBody:
          'Félicitations joueur ! Tu as été tiré au sort pour 50 000 Robux. Connecte-toi vite avec ton mot de passe avant expiration.',
      },
      {
        id: 'em-2',
        senderName: 'Collège Saint-Patrick',
        senderEmail: 'notifications@collegesaintpatrick.edu',
        subject: 'Circulaire scolaire : Horaires des examens',
        date: 'Hier',
        isPhishing: false,
        clues: ['Domaine officiel .edu', 'Ne demande aucun mot de passe'],
        explanation:
          'E-mail scolaire légitime avec un domaine .edu officiel et aucune demande suspecte.',
        fullBody:
          'Chers élèves : le calendrier des évaluations est affiché au secrétariat et disponible sur votre espace élève.',
      },
      {
        id: 'em-3',
        senderName: 'Nintendo Rewards',
        senderEmail: 'gagnants@switch-tirage-ete.xyz',
        subject: 'Tu as gagné une Nintendo Switch OLED !',
        date: '25 Avr',
        isPhishing: true,
        clues: ['Extension douteuse ".xyz"', 'Demande une carte bancaire pour 2€ de port'],
        explanation:
          'Les faux concours demandent une carte bancaire sous prétexte de livrer un faux cadeau.',
        fullBody:
          'Gagnant confirmé ! Règle simplement 2€ de frais de port avec ta carte pour recevoir ta console.',
      },
      {
        id: 'em-4',
        senderName: 'Discord Gift Drops',
        senderEmail: 'promo@dlscord-nitro-free.com',
        subject: '1 an de Nitro offert — Réclame-le vite',
        date: 'Il y a 2h',
        isPhishing: true,
        clues: ['Typosquatting : "dlscord" avec un "l"', 'Lien hors de discord.com'],
        explanation:
          'Remplacer le "i" par un "l" ("dlscord") est un piège classique pour voler des comptes.',
        fullBody:
          'Un membre du serveur t’a offert 12 mois de Nitro. Connecte-toi via ce portail partenaire pour l’activer.',
      },
      {
        id: 'em-5',
        senderName: 'Google Security Alerts',
        senderEmail: 'no-reply@accounts.google.com.verify-token.co',
        subject: 'Alerte critique : 3 connexions bloquées',
        date: '09:15',
        isPhishing: true,
        clues: ['Le vrai domaine racine est "verify-token.co"', 'Fausse panique sécuritaire'],
        explanation:
          'Même avec "accounts.google.com" au début, le véritable propriétaire du domaine est "verify-token.co".',
        fullBody:
          'Connexion inhabituelle détectée. Valide ton code 2FA et ton mot de passe ici sous peine de blocage.',
      },
      {
        id: 'em-6',
        senderName: 'Médiathèque Municipale',
        senderEmail: 'prets@mediatheque-ville.org',
        subject: 'Rappel de retour : Le Petit Prince',
        date: '28 Avr',
        isPhishing: false,
        clues: ['Expéditeur institutionnel .org', 'Aucune demande d’identifiants'],
        explanation: 'Simple rappel de bibliothèque authentique, sans lien malveillant.',
        fullBody:
          'Bonjour Lucas : n’oublie pas de rapporter "Le Petit Prince" avant vendredi à l’accueil.',
      },
    ];

    const enEmails: EmailItem[] = [
      {
        id: 'em-1',
        senderName: 'Roblox Official Support',
        senderEmail: 'support@robl0x-free-prizes.net',
        subject: 'URGENT! You won 50,000 free Robux',
        date: '10:42 AM',
        isPhishing: true,
        clues: ['Fake domain: "robl0x" uses a zero', 'Fake urgency: expires in 15 mins'],
        explanation:
          'Official platforms never use misspelled domains like "robl0x" or give away 50,000 coins.',
        fullBody:
          'Congrats gamer! You were picked for 50,000 Robux. Sign in with your username and password right away before time runs out.',
      },
      {
        id: 'em-2',
        senderName: 'St. Patrick School',
        senderEmail: 'notifications@stpatrickschool.edu',
        subject: 'School notice: May exam timetable',
        date: 'Yesterday',
        isPhishing: false,
        clues: ['Verified .edu domain', 'Never asks for passwords'],
        explanation: 'Genuine school message with an official .edu address and no credential requests.',
        fullBody:
          'Dear students: the term evaluation schedule is now posted on the school board and student portal.',
      },
      {
        id: 'em-3',
        senderName: 'Nintendo Rewards',
        senderEmail: 'prizes@switch-summer-sweepstakes.xyz',
        subject: 'You won a Nintendo Switch OLED!',
        date: 'Apr 25',
        isPhishing: true,
        clues: ['Suspicious ".xyz" domain', 'Asks for a credit card for $2 shipping'],
        explanation:
          'Fake raffles ask for card details claiming a tiny shipping fee for a big prize.',
        fullBody:
          'Confirmed winner! Enter your card to cover $2 shipping so we can dispatch your Switch OLED.',
      },
      {
        id: 'em-4',
        senderName: 'Discord Gift Drops',
        senderEmail: 'promo@dlscord-nitro-free.com',
        subject: 'Someone gifted you 1 year of Nitro — Claim now',
        date: '2h ago',
        isPhishing: true,
        clues: ['Typosquatting: "dlscord" swaps "i" for "l"', 'Asks to log in off discord.com'],
        explanation:
          'Swapping "i" with "l" ("dlscord") tricks fast readers into typing their login credentials.',
        fullBody:
          'A server friend sent you 12 months of Nitro. Sign in via our external claim portal now.',
      },
      {
        id: 'em-5',
        senderName: 'Google Security Alerts',
        senderEmail: 'no-reply@accounts.google.com.verify-token.co',
        subject: 'Critical alert: 3 blocked sign-in attempts',
        date: '09:15 AM',
        isPhishing: true,
        clues: ['Real root domain is "verify-token.co"', 'Urgent fear tactic targeting 2FA'],
        explanation:
          'Even though "accounts.google.com" appears first, the actual root domain is "verify-token.co".',
        fullBody:
          'Unusual sign-in detected. Confirm your password and 2FA backup code immediately or lose access.',
      },
      {
        id: 'em-6',
        senderName: 'City Public Library',
        senderEmail: 'loans@citylibrary.org',
        subject: 'Return reminder: The Little Prince',
        date: 'Apr 28',
        isPhishing: false,
        clues: ['Institutional .org domain', 'No password or card requests'],
        explanation: 'Normal library return notice with no phishing links.',
        fullBody: 'Hi Lucas: please return "The Little Prince" at the front desk by Friday.',
      },
    ];

    const pool = language === 'fr' ? frEmails : language === 'en' ? enEmails : esEmails;
    const deck =
      ageGroup === '8–10'
        ? [pool[0], pool[1], pool[2]]
        : ageGroup === '11–12'
        ? [pool[3], pool[1], pool[0], pool[5]]
        : [pool[4], pool[3], pool[1], pool[2], pool[5]];

    const labels = {
      es: {
        title: 'Bandeja de Entrada Phishing',
        subtitle:
          ageGroup === '13–14'
            ? 'Modo Pro: detecta subdominios falsos y homóglifos'
            : ageGroup === '11–12'
            ? 'Inspecciona remitentes y enlaces trampa'
            : 'Distingue correos reales de trampas',
        fromLabel: 'De:',
        inspectHeadersBtn: 'Inspeccionar Remitente',
        clueHint: 'Revisa letra por letra el dominio después de la "@".',
        safeBtn: 'Correo Seguro',
        phishBtn: '¡Es Phishing!',
        nextBtn: 'Siguiente Correo',
        correctPrefix: '¡Ojo de halcón!',
        wrongPrefix: '¡Casi caemos en la trampa!',
        cluesTitle: 'Evidencia forense:',
        takeaway:
          'Mira siempre el dominio completo después de la "@" antes de hacer clic: busca letras cambiadas ("0", "l") y desconfía de premios o bloqueos urgentes.',
      },
      fr: {
        title: 'Boîte de Réception Hameçonnage',
        subtitle:
          ageGroup === '13–14'
            ? 'Mode Pro : repère les faux sous-domaines'
            : ageGroup === '11–12'
            ? 'Inspecte les expéditeurs et pièges'
            : 'Repère les vrais mails et les pièges',
        fromLabel: 'De :',
        inspectHeadersBtn: 'Inspecter l’adresse',
        clueHint: 'Vérifie chaque lettre du domaine après le "@".',
        safeBtn: 'E-mail Sûr',
        phishBtn: 'C’est du Phishing !',
        nextBtn: 'E-mail Suivant',
        correctPrefix: 'Bien joué !',
        wrongPrefix: 'Attention au piège :',
        cluesTitle: 'Indices repérés :',
        takeaway:
          'Inspecte toujours l’adresse complète après le "@" (attention aux "0" ou "l") et méfie-toi des urgences ou cadeaux impossibles.',
      },
      en: {
        title: 'Phishing Inbox Inspector',
        subtitle:
          ageGroup === '13–14'
            ? 'Pro Mode: catch spoofed subdomains & homoglyphs'
            : ageGroup === '11–12'
            ? 'Verify sender addresses and urgency traps'
            : 'Separate real emails from scams',
        fromLabel: 'From:',
        inspectHeadersBtn: 'Inspect Sender Address',
        clueHint: 'Check the exact domain after the "@" character-by-character.',
        safeBtn: 'Legitimate Email',
        phishBtn: 'It’s Phishing!',
        nextBtn: 'Next Email',
        correctPrefix: 'Sharp catch!',
        wrongPrefix: 'Careful! Watch this detail:',
        cluesTitle: 'Forensic evidence:',
        takeaway:
          'Always verify the exact domain after "@", spot lookalike characters ("0", "1", "l"), and never rush when threatened with account deletion.',
      },
    }[language];

    return { deck, labels };
  }, [ageGroup, language]);

  const [idx, setIdx] = useState(0);
  const [headerHighlighted, setHeaderHighlighted] = useState(ageGroup === '8–10');
  const [verdict, setVerdict] = useState<'safe' | 'phishing' | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(1);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = copy.deck[idx];

  const handleVote = (choice: 'safe' | 'phishing') => {
    if (verdict) return;
    const isCorrect =
      (choice === 'phishing' && current.isPhishing) ||
      (choice === 'safe' && !current.isPhishing);

    setVerdict(choice);
    if (isCorrect) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setMaxStreak((m) => Math.max(m, nextStreak));
      setCorrectCount((c) => c + 1);
      setScore((s) => s + 120 + nextStreak * 25);
      playGameSound(nextStreak > 1 ? 'combo' : 'correct');
    } else {
      setStreak(0);
      playGameSound('wrong');
    }
  };

  const handleNext = () => {
    if (idx < copy.deck.length - 1) {
      setIdx((i) => i + 1);
      setVerdict(null);
      setHeaderHighlighted(ageGroup === '8–10');
    } else {
      playGameSound('win');
      setFinished(true);
    }
  };

  const handleReplay = () => {
    setIdx(0);
    setVerdict(null);
    setHeaderHighlighted(ageGroup === '8–10');
    setScore(0);
    setStreak(0);
    setMaxStreak(1);
    setCorrectCount(0);
    setFinished(false);
  };

  const answeredCount = idx + (verdict ? 1 : 0);
  const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 100;

  if (finished) {
    const finalAcc = Math.round((correctCount / copy.deck.length) * 100);
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

  const isAnswerCorrect =
    verdict !== null &&
    ((verdict === 'phishing' && current.isPhishing) ||
      (verdict === 'safe' && !current.isPhishing));

  return (
    <div className="flex-1 min-h-0 w-full max-w-full flex flex-col p-2.5 sm:p-4 bg-slate-50 text-slate-800 select-none overflow-y-auto overflow-x-hidden scrollbar-none gap-2.5 sm:gap-3 pb-4">
      <GameHud
        title={copy.labels.title}
        subtitle={copy.labels.subtitle}
        icon={<Mail className="w-5 h-5" />}
        accentColor="amber"
        ageGroup={ageGroup}
        currentStep={idx + 1}
        totalSteps={copy.deck.length}
        score={score}
        streak={streak}
        accuracy={answeredCount > 0 ? accuracy : undefined}
      />

      {/* Active Email Client Card */}
      <motion.div
        key={current.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex-1 min-h-0 bg-white rounded-3xl p-4 sm:p-6 shadow-xs border border-slate-200/80 flex flex-col justify-between gap-3.5"
      >
        <div className="space-y-3">
          <div className="border-b border-slate-100 pb-3 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-bold text-slate-900">{current.senderName}</span>
              <span className="text-xs text-slate-400 font-medium tabular-nums shrink-0">{current.date}</span>
            </div>

            <div
              className={`text-xs font-mono px-3 py-2 rounded-xl border break-all flex flex-wrap items-center justify-between gap-2 ${
                headerHighlighted
                  ? 'bg-amber-50 border-amber-300 text-amber-950'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <div>
                <span className="text-slate-400">{copy.labels.fromLabel} </span>
                <strong className="font-bold text-slate-900">{current.senderEmail}</strong>
              </div>
              {!headerHighlighted && !verdict && (
                <button
                  type="button"
                  onClick={() => {
                    playGameSound('tap');
                    setHeaderHighlighted(true);
                  }}
                  className="font-sans shrink-0 px-2.5 py-1.5 rounded-lg bg-amber-100 text-amber-800 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{copy.labels.inspectHeadersBtn}</span>
                </button>
              )}
            </div>

            <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">{current.subject}</h3>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
            {current.fullBody}
          </p>

          {!verdict && headerHighlighted && (
            <div className="text-xs text-amber-800 bg-amber-50/70 border border-amber-200 rounded-xl px-3 py-2 flex items-center gap-2 font-medium">
              <Search className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{copy.labels.clueHint}</span>
            </div>
          )}

          {/* Reveal forensic clues ONLY AFTER voting */}
          <AnimatePresence>
            {verdict && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3.5 rounded-2xl border space-y-2 ${
                  isAnswerCorrect
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50 border-amber-200 text-amber-950'
                }`}
              >
                <div className="font-bold text-sm flex items-center gap-1.5">
                  {isAnswerCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  )}
                  <span>
                    {isAnswerCorrect ? copy.labels.correctPrefix : copy.labels.wrongPrefix}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-medium leading-relaxed">
                  {current.explanation}
                </p>
                <div className="pt-1 border-t border-black/10 space-y-1">
                  <div className="text-[11px] font-semibold uppercase tracking-wider opacity-75">
                    {copy.labels.cluesTitle}
                  </div>
                  {current.clues.map((clue, i) => (
                    <div key={i} className="text-xs flex items-start gap-1.5 font-medium">
                      <span>•</span>
                      <span>{clue}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Verdict Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 pt-1">
          <button
            type="button"
            disabled={!!verdict}
            onClick={() => handleVote('safe')}
            className={`py-3.5 min-h-[52px] px-3 rounded-2xl border-2 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer active:scale-[0.98] ${
              verdict === 'safe'
                ? !current.isPhishing
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                  : 'bg-rose-50 border-rose-500 text-rose-800'
                : 'bg-emerald-50/70 hover:bg-emerald-100 border-emerald-200 text-emerald-800'
            }`}
          >
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{copy.labels.safeBtn}</span>
          </button>

          <button
            type="button"
            disabled={!!verdict}
            onClick={() => handleVote('phishing')}
            className={`py-3.5 min-h-[52px] px-3 rounded-2xl border-2 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer active:scale-[0.98] ${
              verdict === 'phishing'
                ? current.isPhishing
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                  : 'bg-rose-50 border-rose-500 text-rose-800'
                : 'bg-rose-50/70 hover:bg-rose-100 border-rose-200 text-rose-800'
            }`}
          >
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{copy.labels.phishBtn}</span>
          </button>
        </div>
      </motion.div>

      {verdict && (
        <button
          type="button"
          onClick={handleNext}
          className="w-full py-3.5 min-h-[48px] shrink-0 rounded-2xl font-bold text-sm sm:text-base bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition"
        >
          <span>{copy.labels.nextBtn}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
