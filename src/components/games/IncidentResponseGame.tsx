import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { LifeBuoy, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { ChildAgeGroup, GameResultStats } from '../../types';
import { GameHud, GameVictorySummary } from './GameShell';
import { computeStars } from '../../utils/ageDifficulty';
import { playGameSound } from '../../utils/gameAudio';

interface IncidentResponseGameProps {
  onComplete: (stats?: GameResultStats) => void;
  ageGroup?: ChildAgeGroup;
}

interface IncidentStep {
  id: string;
  title: string;
  scenario: string;
  question: string;
  options: { text: string; isBest: boolean; feedback: string }[];
}

export const IncidentResponseGame: React.FC<IncidentResponseGameProps> = ({
  onComplete,
  ageGroup = '8–10' as ChildAgeGroup,
}) => {
  const { language } = useLanguage();

  const copy = useMemo(() => {
    const esSteps: IncidentStep[] = [
      {
        id: 's1',
        title: 'Protocolo Fase 1 · Contención',
        scenario:
          'Hiciste clic por error en un enlace de "gemas gratis" y la pantalla empezó a mostrar ventanas raras pidiendo tu clave.',
        question: '¿Qué haces en los primeros 10 segundos?',
        options: [
          {
            text: 'Cerrar la pestaña, desconectar Wi-Fi si persiste y avisar con calma a un adulto.',
            isBest: true,
            feedback: '¡Correcto! Cortar la conexión y pedir ayuda frena el incidente de inmediato.',
          },
          {
            text: 'Ocultarlo y bajar una app desconocida que promete "limpiar virus gratis".',
            isBest: false,
            feedback: '¡Error! Ocultarlo da tiempo al malware y bajar apps dudosas agrava el daño.',
          },
          {
            text: 'Ingresar tu contraseña para ver si tu cuenta sigue activa.',
            isBest: false,
            feedback: '¡Peligro! Escribir tu clave en una ventana clonada entrega el control total.',
          },
        ],
      },
      {
        id: 's2',
        title: 'Protocolo Fase 2 · Recuperación',
        scenario:
          'Con un adulto al lado ya cerraron la ventana sospechosa. Toca blindar la cuenta afectada.',
        question: '¿Cuál es el paso de recuperación más efectivo?',
        options: [
          {
            text: 'Cambiar la contraseña desde la app oficial y activar 2FA.',
            isBest: true,
            feedback: '¡Magistral! Nueva clave única + 2FA expulsa cualquier sesión robada.',
          },
          {
            text: 'Dejar la misma contraseña porque "solo fue un segundo".',
            isBest: false,
            feedback: 'Si el script capturó datos, dejar la misma clave mantiene la puerta abierta.',
          },
        ],
      },
      {
        id: 's3',
        title: 'Protocolo Fase 3 · Aviso al Escuadrón',
        scenario:
          'Antes de recuperar la cuenta, notas que el atacante envió el mismo enlace trampa a 3 amigos desde tu chat.',
        question: '¿Cómo frenas la propagación?',
        options: [
          {
            text: 'Avisar rápido a tus amigos por otro canal que no abran el enlace y revocar sesiones activas.',
            isBest: true,
            feedback: '¡Excelente liderazgo digital! Avisar a tiempo evita que tus amigos caigan en cadena.',
          },
          {
            text: 'No decir nada por vergüenza y esperar a mañana.',
            isBest: false,
            feedback: 'El silencio permite que tus amigos confíen en el mensaje enviado desde tu cuenta.',
          },
        ],
      },
      {
        id: 's4',
        title: 'Protocolo Fase 4 · Auditoría de Accesos OAuth',
        scenario:
          'El atacante pudo haber vinculado una app externa ("Login with Google/Discord") para volver a entrar.',
        question: '¿Qué revisión final cierra cualquier puerta trasera?',
        options: [
          {
            text: 'Revisar "Apps conectadas / Permisos" en ajustes de cuenta y revocar tokens desconocidos.',
            isBest: true,
            feedback: '¡Nivel Estratega Pro! Revocar sesiones y permisos OAuth cierra accesos ocultos.',
          },
          {
            text: 'Solo cambiar el fondo de pantalla y reiniciar el navegador.',
            isBest: false,
            feedback: 'Reiniciar no elimina permisos de aplicaciones externas ya autorizadas.',
          },
        ],
      },
    ];

    const frSteps: IncidentStep[] = [
      {
        id: 's1',
        title: 'Protocole Phase 1 · Confinement',
        scenario:
          'Tu as cliqué par erreur sur un lien de « gemmes gratuites » et des fenêtres suspectes réclament ton mot de passe.',
        question: 'Que fais-tu dans les 10 premières secondes ?',
        options: [
          {
            text: 'Fermer l’onglet, couper le Wi-Fi si besoin et prévenir calmement un parent.',
            isBest: true,
            feedback: 'Parfait ! Couper l’accès et alerter un adulte stoppe l’incident tout de suite.',
          },
          {
            text: 'Cacher l’erreur et installer un faux logiciel « nettoyeur de virus gratuit ».',
            isBest: false,
            feedback: 'Risqué ! Télécharger un faux utilitaire aggrave souvent l’infection.',
          },
          {
            text: 'Entrer ton mot de passe pour tester si ton compte fonctionne encore.',
            isBest: false,
            feedback: 'Danger ! Taper ton code sur une fausse fenêtre le livre aux pirates.',
          },
        ],
      },
      {
        id: 's2',
        title: 'Protocole Phase 2 · Sécurisation',
        scenario:
          'Avec un adulte, la fenêtre est fermée. Il faut maintenant re-sécuriser ton compte.',
        question: 'Quelle action garantit la meilleure protection ?',
        options: [
          {
            text: 'Changer le mot de passe via l’appli officielle et activer le 2FA.',
            isBest: true,
            feedback: 'Bravo ! Un nouveau mot de passe unique + 2FA bloque tout intrus.',
          },
          {
            text: 'Garder l’ancien mot de passe car « ça n’a duré qu’une seconde ».',
            isBest: false,
            feedback: 'Une seconde suffit pour voler une session : change toujours ton mot de passe.',
          },
        ],
      },
      {
        id: 's3',
        title: 'Protocole Phase 3 · Alerter les Amis',
        scenario:
          'Tu vois que le pirate a envoyé le même lien piégé à 3 amis depuis ton compte avant blocage.',
        question: 'Comment stopper la propagation ?',
        options: [
          {
            text: 'Prévenir tes amis par un autre moyen de ne pas cliquer et déconnecter toutes les sessions.',
            isBest: true,
            feedback: 'Excellent réflexe ! Prévenir vite empêche tes amis d’être piégés à leur tour.',
          },
          {
            text: 'Ne rien dire par gêne et attendre demain.',
            isBest: false,
            feedback: 'Tes amis pourraient cliquer en pensant que le message vient vraiment de toi.',
          },
        ],
      },
      {
        id: 's4',
        title: 'Protocole Phase 4 · Audit OAuth',
        scenario:
          'Une appli externe (« Connexion avec Google/Discord ») a peut-être été liée à ton insu.',
        question: 'Quelle ultime vérification ferme toute porte dérobée ?',
        options: [
          {
            text: 'Vérifier « Applications tierces / Connexions autorisées » et révoquer les accès inconnus.',
            isBest: true,
            feedback: 'Niveau Stratège Pro ! Révoquer les jetons OAuth supprime les accès cachés.',
          },
          {
            text: 'Juste changer de fond d’écran et redémarrer.',
            isBest: false,
            feedback: 'Redémarrer ne supprime pas les autorisations accordées à des applis tierces.',
          },
        ],
      },
    ];

    const enSteps: IncidentStep[] = [
      {
        id: 's1',
        title: 'Protocol Phase 1 · Containment',
        scenario:
          'You accidentally clicked a "free gems" pop-up and strange windows start demanding your account login.',
        question: 'What is your immediate first move?',
        options: [
          {
            text: 'Close the tab, disconnect Wi-Fi if needed, and calmly tell a parent or guardian.',
            isBest: true,
            feedback: 'Spot on! Cutting contact and looping in a trusted adult halts escalation fast.',
          },
          {
            text: 'Hide it and install a random tool claiming to "fix viruses for free."',
            isBest: false,
            feedback: 'Mistake! Sketchy cleaners almost always worsen device infections.',
          },
          {
            text: 'Type your password in to check whether your account still works.',
            isBest: false,
            feedback: 'Never! Typing credentials into a spoofed popup hands over your keys.',
          },
        ],
      },
      {
        id: 's2',
        title: 'Protocol Phase 2 · Account Recovery',
        scenario:
          'With an adult helping, you closed the bad page. Now it is time to lock down the account.',
        question: 'Which recovery move gives the strongest protection?',
        options: [
          {
            text: 'Reset to a unique password inside the official app and turn on 2FA.',
            isBest: true,
            feedback: 'Masterful! A fresh password plus 2FA locks out attackers.',
          },
          {
            text: 'Keep the same password since "it only stayed open a second."',
            isBest: false,
            feedback: 'Automated scripts steal tokens in milliseconds—always rotate your password.',
          },
        ],
      },
      {
        id: 's3',
        title: 'Protocol Phase 3 · Squad Alert',
        scenario:
          'Before you regained control, the hijacker sent that same scam link to 3 friends from your profile.',
        question: 'How do you stop a chain-reaction scam?',
        options: [
          {
            text: 'Warn friends on a separate channel not to click and sign out all active sessions.',
            isBest: true,
            feedback: 'Awesome leadership! Fast warning keeps your teammates safe.',
          },
          {
            text: 'Stay quiet out of embarrassment and wait until tomorrow.',
            isBest: false,
            feedback: 'Staying quiet lets friends trust the fake link thinking it is really you.',
          },
        ],
      },
      {
        id: 's4',
        title: 'Protocol Phase 4 · OAuth & App Token Audit',
        scenario:
          'An attacker might have linked a third-party app ("Sign in with Google/Discord") as a backdoor.',
        question: 'What final audit closes hidden persistent access?',
        options: [
          {
            text: 'Inspect "Connected Apps & Sessions" in security settings and revoke unknown access.',
            isBest: true,
            feedback: 'Pro Strategist move! Revoking rogue OAuth tokens shuts down silent backdoors.',
          },
          {
            text: 'Simply reboot the browser and clear your wallpaper.',
            isBest: false,
            feedback: 'Rebooting does not remove linked third-party OAuth tokens on your account.',
          },
        ],
      },
    ];

    const pool = language === 'fr' ? frSteps : language === 'en' ? enSteps : esSteps;
    const count = ageGroup === '13–14' ? 4 : ageGroup === '11–12' ? 3 : 2;
    const scenarios = pool.slice(0, count);

    const labels = {
      es: {
        title: 'Respuesta ante Incidentes',
        subtitle: `Comando de emergencia en ${count} fases`,
        nextBtn: 'Siguiente Fase',
        takeaway:
          'Ante un clic riesgoso: 1) desconecta/cierra y pide ayuda sin miedo, 2) cambia tu clave + activa 2FA, 3) avisa a amigos y revoca apps conectadas.',
      },
      fr: {
        title: 'Réaction face aux Incidents',
        subtitle: `Protocole d’urgence en ${count} phases`,
        nextBtn: 'Phase Suivante',
        takeaway:
          'En cas de faux clic : 1) coupe la page et préviens un adulte sans crainte, 2) change ton mot de passe + 2FA, 3) avertis tes amis et révoque les applis tierces.',
      },
      en: {
        title: 'Incident Response Protocol',
        subtitle: `${count}-phase emergency response drill`,
        nextBtn: 'Next Phase',
        takeaway:
          'When something goes wrong: 1) close/disconnect and tell an adult right away, 2) reset password + 2FA, 3) warn friends and revoke unknown connected apps.',
      },
    }[language];

    return { scenarios, labels };
  }, [ageGroup, language]);

  const [step, setStep] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(1);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = copy.scenarios[step];
  const chosenOption = selectedIdx !== null ? current.options[selectedIdx] : null;

  const handleSelect = (optIdx: number) => {
    if (selectedIdx !== null) return;
    setSelectedIdx(optIdx);
    const opt = current.options[optIdx];
    if (opt.isBest) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setMaxStreak((m) => Math.max(m, nextStreak));
      setCorrectCount((c) => c + 1);
      setScore((s) => s + 130 + nextStreak * 25);
      playGameSound(nextStreak > 1 ? 'combo' : 'correct');
    } else {
      setStreak(0);
      playGameSound('wrong');
    }
  };

  const handleNext = () => {
    if (step < copy.scenarios.length - 1) {
      setStep((s) => s + 1);
      setSelectedIdx(null);
    } else {
      playGameSound('win');
      setFinished(true);
    }
  };

  const handleReplay = () => {
    setStep(0);
    setSelectedIdx(null);
    setScore(0);
    setStreak(0);
    setMaxStreak(1);
    setCorrectCount(0);
    setFinished(false);
  };

  const answered = step + (selectedIdx !== null ? 1 : 0);
  const accuracy = answered > 0 ? Math.round((correctCount / answered) * 100) : 100;

  if (finished) {
    const finalAcc = Math.round((correctCount / copy.scenarios.length) * 100);
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
        icon={<LifeBuoy className="w-5 h-5" />}
        accentColor="rose"
        ageGroup={ageGroup}
        currentStep={step + 1}
        totalSteps={copy.scenarios.length}
        score={score}
        streak={streak}
        accuracy={answered > 0 ? accuracy : undefined}
      />

      <motion.div
        key={current.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex-1 min-h-0 bg-white rounded-3xl p-4 sm:p-6 shadow-xs border border-slate-200/80 flex flex-col justify-center gap-3.5"
      >
        <div className="text-xs font-semibold uppercase tracking-wider text-rose-600">
          {current.title}
        </div>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100 font-medium">
          {current.scenario}
        </p>

        <h3 className="text-sm sm:text-base font-bold text-slate-900">{current.question}</h3>

        <div className="space-y-2.5">
          {current.options.map((opt, idx) => {
            const isPicked = selectedIdx === idx;
            return (
              <button
                key={idx}
                type="button"
                disabled={selectedIdx !== null}
                onClick={() => handleSelect(idx)}
                className={`w-full text-left p-3.5 min-h-[50px] rounded-2xl border-2 text-xs sm:text-sm font-semibold transition flex items-center justify-between gap-2 cursor-pointer ${
                  selectedIdx !== null
                    ? opt.isBest
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                      : isPicked
                      ? 'bg-rose-50 border-rose-400 text-rose-950'
                      : 'bg-slate-50 border-slate-200 text-slate-500 opacity-70'
                    : 'bg-slate-50 hover:bg-sky-50 border-slate-200 hover:border-sky-300 text-slate-800'
                }`}
              >
                <span className="leading-snug">{opt.text}</span>
                {selectedIdx !== null && opt.isBest && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {selectedIdx !== null && isPicked && !opt.isBest && (
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
            className={`p-3 rounded-2xl border text-xs sm:text-sm font-medium leading-relaxed ${
              chosenOption.isBest
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
          className="w-full py-3.5 min-h-[48px] shrink-0 rounded-2xl font-bold text-sm sm:text-base bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition"
        >
          <span>{copy.labels.nextBtn}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
