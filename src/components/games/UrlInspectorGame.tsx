import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Globe,
  Lock,
  Unlock,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Search,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { ChildAgeGroup, GameResultStats } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { GameHud, GameVictorySummary } from './GameShell';
import { computeStars } from '../../utils/ageDifficulty';
import { playGameSound } from '../../utils/gameAudio';

interface UrlInspectorGameProps {
  onComplete: (stats?: GameResultStats) => void;
  ageGroup?: ChildAgeGroup;
}

interface UrlCase {
  id: string;
  context: string;
  protocol: 'https://' | 'http://';
  subdomain?: string;
  domain: string;
  path: string;
  isPhishing: boolean;
  suspiciousSegment?: 'protocol' | 'subdomain' | 'domain' | 'path';
  explanation: string;
}

export const UrlInspectorGame: React.FC<UrlInspectorGameProps> = ({
  onComplete,
  ageGroup = '8–10' as ChildAgeGroup,
}) => {
  const { language } = useLanguage();

  const copy = useMemo(() => {
    const casesByAge: Record<ChildAgeGroup, UrlCase[]> = {
      '8–10': [
        {
          id: 'u1',
          context: language === 'fr' ? 'Lien pour jouer sur Roblox' : language === 'en' ? 'Link to log into Roblox' : 'Enlace para entrar a Roblox',
          protocol: 'http://',
          domain: 'r0blox-regalos.xyz',
          path: '/free-robux',
          isPhishing: true,
          suspiciousSegment: 'domain',
          explanation:
            language === 'fr'
              ? 'Piège ! "r0blox" utilise un zéro et ".xyz" avec des cadeaux gratuits est un faux site.'
              : language === 'en'
              ? 'Trap! "r0blox" uses a zero instead of "o", and ".xyz" promising free prizes is fake.'
              : '¡Trampa! "r0blox" usa un cero en vez de "o" y el dominio ".xyz" prometiendo premios es falso.',
        },
        {
          id: 'u2',
          context: language === 'fr' ? 'Portail officiel de ton école' : language === 'en' ? 'Official school learning portal' : 'Portal oficial de tareas del colegio',
          protocol: 'https://',
          subdomain: 'aula.',
          domain: 'colegio-central.edu',
          path: '/tareas',
          isPhishing: false,
          explanation:
            language === 'fr'
              ? 'Site sûr ! Protocole HTTPS avec le vrai domaine .edu de l’école.'
              : language === 'en'
              ? 'Safe site! Uses HTTPS and the verified .edu school domain.'
              : '¡Sitio seguro! Usa HTTPS y el dominio oficial .edu del colegio.',
        },
        {
          id: 'u3',
          context: language === 'fr' ? 'Message disant : "Gagne une console ici"' : language === 'en' ? 'Pop-up: "Win a free console here"' : 'Mensaje: "¡Gana una consola gratis aquí!"',
          protocol: 'http://',
          domain: 'premios-sorpresa-ya.net',
          path: '/tarjeta-papa',
          isPhishing: true,
          suspiciousSegment: 'domain',
          explanation:
            language === 'fr'
              ? 'Danger ! HTTP sans cadenas et un domaine inconnu demandant une carte.'
              : language === 'en'
              ? 'Danger! Unencrypted HTTP and a sketchy domain asking for personal details.'
              : '¡Peligro! Sin candado HTTPS y un dominio falso pidiendo datos de tarjeta.',
        },
      ],
      '11–12': [
        {
          id: 'u1',
          context: language === 'fr' ? 'Message Discord : "Nitro Gratuit"' : language === 'en' ? 'Discord DM: "Claim Free Nitro"' : 'Mensaje Discord: "Reclama Nitro Gratis"',
          protocol: 'https://',
          domain: 'dlscord-gift.com',
          path: '/claim-now',
          isPhishing: true,
          suspiciousSegment: 'domain',
          explanation:
            language === 'fr'
              ? 'Typosquatting ! "dlscord" remplace le "i" par un "l" minuscule.'
              : language === 'en'
              ? 'Typosquatting! "dlscord" swaps the letter "i" for an "l" to trick your eyes.'
              : '¡Typosquatting! "dlscord" cambia la "i" por una "l" para engañar a la vista.',
        },
        {
          id: 'u2',
          context: language === 'fr' ? 'Connexion à YouTube Kids' : language === 'en' ? 'Signing into YouTube' : 'Entrar a YouTube oficial',
          protocol: 'https://',
          subdomain: 'accounts.',
          domain: 'google.com',
          path: '/signin',
          isPhishing: false,
          explanation:
            language === 'fr'
              ? 'Légitime ! Le domaine principal avant le "/" est bien google.com.'
              : language === 'en'
              ? 'Legitimate! The main root domain right before "/" is google.com.'
              : '¡Legítimo! El dominio raíz justo antes de la "/" es google.com.',
        },
        {
          id: 'u3',
          context: language === 'fr' ? 'Alerte de compte Minecraft' : language === 'en' ? 'Minecraft account suspension alert' : 'Alerta de suspensión de cuenta Minecraft',
          protocol: 'https://',
          subdomain: 'minecraft.net.',
          domain: 'verify-account-id.com',
          path: '/login',
          isPhishing: true,
          suspiciousSegment: 'domain',
          explanation:
            language === 'fr'
              ? 'Astuce du sous-domaine ! Le vrai propriétaire est "verify-account-id.com", pas minecraft.net.'
              : language === 'en'
              ? 'Subdomain trick! The real owner is "verify-account-id.com", not minecraft.net.'
              : '¡Truco de subdominio! El dueño real es "verify-account-id.com", no minecraft.net.',
        },
        {
          id: 'u4',
          context: language === 'fr' ? 'Boutique officielle de jeux' : language === 'en' ? 'Official Nintendo store page' : 'Tienda oficial de videojuegos',
          protocol: 'https://',
          subdomain: 'store.',
          domain: 'nintendo.com',
          path: '/games',
          isPhishing: false,
          explanation:
            language === 'fr'
              ? 'Sûr ! Sous-domaine "store" appartenant au vrai domaine nintendo.com.'
              : language === 'en'
              ? 'Safe! "store" is a valid subdomain of the real nintendo.com.'
              : '¡Seguro! "store" es un subdominio legítimo de nintendo.com.',
        },
      ],
      '13–14': [
        {
          id: 'u1',
          context: language === 'fr' ? 'Mail : "Activité suspecte sur Google"' : language === 'en' ? 'Email: "Unusual Google sign-in"' : 'Correo: "Inicio de sesión inusual en Google"',
          protocol: 'https://',
          subdomain: 'accounts.google.com.',
          domain: 'security-check-auth.co',
          path: '/oauth/token',
          isPhishing: true,
          suspiciousSegment: 'domain',
          explanation:
            language === 'fr'
              ? 'Même avec HTTPS, le vrai domaine racine est "security-check-auth.co" ! Le cadenas ne prouve pas l’authenticité.'
              : language === 'en'
              ? 'Even with HTTPS, the actual root domain is "security-check-auth.co"! A padlock only means encryption, not trust.'
              : '¡Incluso con HTTPS, el dominio raíz real es "security-check-auth.co"! El candado cifra la conexión, pero no garantiza legitimidad.',
        },
        {
          id: 'u2',
          context: language === 'fr' ? 'Alerte de paiement PayPal' : language === 'en' ? 'PayPal billing verification' : 'Verificación de cobro PayPal',
          protocol: 'https://',
          domain: 'paypa1-support.com',
          path: '/resolve-case',
          isPhishing: true,
          suspiciousSegment: 'domain',
          explanation:
            language === 'fr'
              ? 'Usurpation homoglyphe : "paypa1" avec le chiffre 1 au lieu du "l".'
              : language === 'en'
              ? 'Lookalike spoofing: "paypa1" uses the digit 1 instead of the letter "l".'
              : 'Suplantación visual: "paypa1" usa el número 1 en lugar de la letra "l".',
        },
        {
          id: 'u3',
          context: language === 'fr' ? 'Paramètres de sécurité GitHub' : language === 'en' ? 'GitHub 2FA settings link' : 'Configuración oficial de seguridad GitHub',
          protocol: 'https://',
          domain: 'github.com',
          path: '/settings/security',
          isPhishing: false,
          explanation:
            language === 'fr'
              ? 'Authentique ! Domaine exact github.com avec HTTPS.'
              : language === 'en'
              ? 'Authentic! Exact root domain github.com over HTTPS.'
              : '¡Auténtico! Dominio raíz exacto github.com con HTTPS.',
        },
        {
          id: 'u4',
          context: language === 'fr' ? 'Lien raccourci de tournoi inconnu' : language === 'en' ? 'Urgent tournament prize link' : 'Enlace urgente de premio de torneo',
          protocol: 'http://',
          subdomain: 'prize.',
          domain: 'esports-claim.ru',
          path: '/verify-steam-id',
          isPhishing: true,
          suspiciousSegment: 'protocol',
          explanation:
            language === 'fr'
              ? 'Connexion HTTP non chiffrée vers un domaine suspect pour voler tes identifiants Steam.'
              : language === 'en'
              ? 'Unencrypted HTTP connection to an untrusted foreign domain harvesting Steam logins.'
              : 'Conexión HTTP sin cifrado hacia un dominio externo sospechoso para robar tu cuenta.',
        },
        {
          id: 'u5',
          context: language === 'fr' ? 'Aide officielle Apple ID' : language === 'en' ? 'Official Apple Support article' : 'Soporte oficial de Apple ID',
          protocol: 'https://',
          subdomain: 'support.',
          domain: 'apple.com',
          path: '/en-us/102660',
          isPhishing: false,
          explanation:
            language === 'fr'
              ? 'Sûr ! "support" précède bien le domaine officiel apple.com.'
              : language === 'en'
              ? 'Safe! "support" is directly attached to the official apple.com domain.'
              : '¡Seguro! "support" pertenece directamente al dominio oficial apple.com.',
        },
      ],
    };

    const labels = {
      es: {
        title: 'Escáner de Enlaces y Dominios',
        subtitle: 'Inspecciona el dominio real antes de hacer clic',
        browserTitle: 'Inspector de Barra de Direcciones',
        segmentPrompt: 'Analiza las partes de la URL y decide:',
        protocolTag: 'Protocolo',
        subdomainTag: 'Subdominio',
        rootDomainTag: 'Dominio Raíz',
        pathTag: 'Ruta',
        safeBtn: 'Enlace Seguro',
        phishBtn: '¡Enlace Falso / Trampa!',
        nextBtn: 'Siguiente URL',
        correctLabel: '¡Detección exacta!',
        wrongLabel: '¡Cuidado con este detalle!',
        takeaway:
          'Lee siempre el dominio raíz justo antes de la primera barra ("/"). Los estafadores ponen nombres famosos en el subdominio o cambian letras por números ("0", "1", "l").',
      },
      fr: {
        title: 'Inspecteur d’URL & Domaines',
        subtitle: 'Repère le vrai nom de domaine avant de cliquer',
        browserTitle: 'Analyseur de Barre d’Adresse',
        segmentPrompt: 'Examine les parties du lien puis décide :',
        protocolTag: 'Protocole',
        subdomainTag: 'Sous-domaine',
        rootDomainTag: 'Domaine Principal',
        pathTag: 'Chemin',
        safeBtn: 'Lien Authentique',
        phishBtn: 'Piège / Faux Domaine !',
        nextBtn: 'URL Suivante',
        correctLabel: 'Bien vu !',
        wrongLabel: 'Attention au détail :',
        takeaway:
          'Lis toujours le domaine principal juste avant le premier "/". Même avec un cadenas HTTPS, un faux domaine ou une lettre remplacée ("1" pour "l") trahit l’arnaque.',
      },
      en: {
        title: 'URL & Domain Inspector',
        subtitle: 'Verify the true root domain before clicking',
        browserTitle: 'Address Bar Forensics',
        segmentPrompt: 'Inspect each part of the URL and decide:',
        protocolTag: 'Protocol',
        subdomainTag: 'Subdomain',
        rootDomainTag: 'Root Domain',
        pathTag: 'Path',
        safeBtn: 'Legitimate Link',
        phishBtn: 'Phishing / Fake URL!',
        nextBtn: 'Next URL',
        correctLabel: 'Sharp catch!',
        wrongLabel: 'Watch out for this clue:',
        takeaway:
          'Always inspect the root domain immediately before the first "/". Attackers spoof subdomains or swap letters ("0" for "o", "1" for "l")—and even fake sites can have HTTPS.',
      },
    }[language];

    return { cases: casesByAge[ageGroup], labels };
  }, [ageGroup, language]);

  const [idx, setIdx] = useState(0);
  const [verdict, setVerdict] = useState<'safe' | 'phishing' | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(1);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = copy.cases[idx];

  const handleDecision = (choice: 'safe' | 'phishing') => {
    if (verdict) return;
    const isRight =
      (choice === 'phishing' && current.isPhishing) ||
      (choice === 'safe' && !current.isPhishing);

    setVerdict(choice);
    if (isRight) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setMaxStreak((m) => Math.max(m, nextStreak));
      setCorrectCount((c) => c + 1);
      setScore((s) => s + 100 + nextStreak * 20);
      playGameSound(nextStreak > 1 ? 'combo' : 'correct');
    } else {
      setStreak(0);
      playGameSound('wrong');
    }
  };

  const handleNext = () => {
    if (idx < copy.cases.length - 1) {
      setIdx((i) => i + 1);
      setVerdict(null);
    } else {
      playGameSound('win');
      setFinished(true);
    }
  };

  const handleReplay = () => {
    setIdx(0);
    setVerdict(null);
    setScore(0);
    setStreak(0);
    setMaxStreak(1);
    setCorrectCount(0);
    setFinished(false);
  };

  const answeredCount = idx + (verdict ? 1 : 0);
  const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 100;

  if (finished) {
    const finalAcc = Math.round((correctCount / copy.cases.length) * 100);
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
    <div className="flex-1 min-h-0 w-full flex flex-col p-2.5 sm:p-4 bg-slate-50 text-slate-800 overflow-y-auto overflow-x-hidden scrollbar-none gap-2.5 sm:gap-3 pb-4">
      <GameHud
        title={copy.labels.title}
        subtitle={copy.labels.subtitle}
        icon={<Globe className="w-5 h-5" />}
        accentColor="amber"
        ageGroup={ageGroup}
        currentStep={idx + 1}
        totalSteps={copy.cases.length}
        score={score}
        streak={streak}
        accuracy={answeredCount > 0 ? accuracy : undefined}
      />

      {/* Simulated Browser Inspector */}
      <motion.div
        key={current.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex-1 min-h-0 bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs flex flex-col justify-center gap-4"
      >
        {/* Browser Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-slate-500">
          <span className="flex items-center gap-1.5">
            <Search className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{copy.labels.browserTitle}</span>
          </span>
          <span className="text-slate-400">{current.context}</span>
        </div>

        {/* Realistic Address Bar */}
        <div className="rounded-2xl bg-slate-900 p-3.5 sm:p-4 text-white space-y-3">
          <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 font-mono text-xs sm:text-sm overflow-x-auto">
            {current.protocol === 'https://' ? (
              <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <Unlock className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <div className="flex items-center flex-wrap gap-y-1 break-all">
              <span
                className={
                  current.protocol === 'http://' ? 'text-rose-300 font-bold' : 'text-emerald-300'
                }
              >
                {current.protocol}
              </span>
              {current.subdomain && (
                <span className="text-slate-300">{current.subdomain}</span>
              )}
              <span className="text-amber-300 font-bold underline decoration-amber-400/60 underline-offset-4">
                {current.domain}
              </span>
              <span className="text-slate-400">{current.path}</span>
            </div>
          </div>

          {/* URL Anatomy Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div className="bg-slate-800/80 rounded-xl p-2 border border-slate-700/70">
              <div className="text-slate-400 font-semibold">{copy.labels.protocolTag}</div>
              <div className="font-mono font-bold text-white break-all leading-tight mt-0.5">{current.protocol}</div>
            </div>
            <div className="bg-slate-800/80 rounded-xl p-2 border border-slate-700/70">
              <div className="text-slate-400 font-semibold">{copy.labels.subdomainTag}</div>
              <div className="font-mono font-bold text-slate-200 break-all leading-tight mt-0.5">
                {current.subdomain || '—'}
              </div>
            </div>
            <div className="bg-slate-800/80 rounded-xl p-2 border border-amber-500/40">
              <div className="text-amber-300 font-semibold">{copy.labels.rootDomainTag}</div>
              <div className="font-mono font-bold text-amber-200 break-all leading-tight mt-0.5">{current.domain}</div>
            </div>
            <div className="bg-slate-800/80 rounded-xl p-2 border border-slate-700/70">
              <div className="text-slate-400 font-semibold">{copy.labels.pathTag}</div>
              <div className="font-mono font-bold text-slate-300 break-all leading-tight mt-0.5">{current.path}</div>
            </div>
          </div>
        </div>

        <div className="text-xs sm:text-sm font-semibold text-slate-600 text-center">
          {copy.labels.segmentPrompt}
        </div>

        {/* Choice Buttons */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          <button
            type="button"
            disabled={!!verdict}
            onClick={() => handleDecision('safe')}
            className={`py-3.5 min-h-[60px] px-3 rounded-2xl border-2 font-bold text-xs sm:text-sm flex flex-col items-center justify-center gap-1.5 transition cursor-pointer active:scale-[0.97] ${
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
            onClick={() => handleDecision('phishing')}
            className={`py-3.5 min-h-[60px] px-3 rounded-2xl border-2 font-bold text-xs sm:text-sm flex flex-col items-center justify-center gap-1.5 transition cursor-pointer active:scale-[0.97] ${
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

        {/* Verdict Explanation */}
        {verdict && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3.5 rounded-2xl border text-xs sm:text-sm space-y-1 ${
              isAnswerCorrect
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}
          >
            <div className="font-bold flex items-center gap-1.5">
              {isAnswerCorrect ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-amber-600 shrink-0" />
              )}
              <span>{isAnswerCorrect ? copy.labels.correctLabel : copy.labels.wrongLabel}</span>
            </div>
            <p className="leading-relaxed font-medium">{current.explanation}</p>
          </motion.div>
        )}
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
