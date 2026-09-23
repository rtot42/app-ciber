import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LifeBuoy, AlertTriangle, ShieldCheck, Check, ArrowRight } from 'lucide-react';
import { CiberMascot } from '../CiberMascot';
import { useLanguage } from '../../i18n/LanguageContext';
import { ChildAgeGroup } from '../../types';

interface IncidentResponseGameProps {
  onComplete: () => void;
  ageGroup?: ChildAgeGroup;
}

export const IncidentResponseGame: React.FC<IncidentResponseGameProps> = ({ onComplete, ageGroup = '8–10' }) => {
  const { language } = useLanguage();
  const [step, setStep] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loc = {
    es: {
      tag: 'Mecánica 12 / Respuesta',
      title: 'Respuesta ante Incidentes',
      stepBadge: (curr: number, total: number) => `Paso ${curr} de ${total}`,
      mascot: 'Ciber dice: "Los errores pasan y no tienen nada de malo. Lo importante es no tener miedo de hablar con un adulto."',
      nextBtn: 'Siguiente Situación',
      completeBtn: '¡Completar Protocolo de Emergencia!',
      scenarios: [
        {
          title: 'Situación de Alerta 1',
          scenario: 'Hiciste clic por error en un enlace que prometía "Robux gratis". De repente, tu pantalla empieza a parpadear con alertas raras.',
          question: '¿Qué es lo primero y más importante que debes hacer?',
          options: [
            {
              text: 'Cerrar la pestaña, desconectar internet si es posible y avisar con calma a tus padres.',
              isBest: true,
              feedback: '¡Excelente decisión! Mantener la calma y pedir ayuda a un adulto resuelve cualquier problema sin empeorarlo.',
            },
            {
              text: 'Intentar ocultarlo y descargar un archivo misterioso que promete "arreglarlo".',
              isBest: false,
              feedback: '¡Cuidado! Descargar más cosas suele empeorar la infección del dispositivo.',
            },
            {
              text: 'Ingresar tu usuario y contraseña para ver si la cuenta sigue funcionando.',
              isBest: false,
              feedback: '¡No! Si la página es falsa, regalarías tus datos a los estafadores.',
            },
          ],
        },
        {
          title: 'Situación de Alerta 2',
          scenario: 'Junto con tus padres, cerraron la página. Ahora quieren asegurarse de que tu cuenta de juego esté a salvo.',
          question: '¿Cuál es el siguiente paso correcto?',
          options: [
            {
              text: 'Cambiar la contraseña desde la app oficial y activar la verificación en dos pasos (2FA).',
              isBest: true,
              feedback: '¡Magistral! Cambiar la clave y blindar con 2FA expulsa a cualquier intruso de tu cuenta.',
            },
            {
              text: 'Dejar la misma clave porque "seguro no pasó nada".',
              isBest: false,
              feedback: 'Es mejor prevenir: cambiar la clave solo toma 2 minutos y te da total tranquilidad.',
            },
          ],
        },
      ],
    },
    fr: {
      tag: 'Mécanique 12 / Réaction',
      title: 'Réaction face aux Incidents',
      stepBadge: (curr: number, total: number) => `Étape ${curr} sur ${total}`,
      mascot: 'Ciber dit : "Les erreurs arrivent à tout le monde. L’important est de ne pas paniquer et d’en parler à un adulte."',
      nextBtn: 'Situation Suivante',
      completeBtn: 'Valider le Protocole d’Urgence !',
      scenarios: [
        {
          title: 'Situation d’Alerte 1',
          scenario: 'Tu as cliqué par erreur sur un lien promettant des "Robux gratuits". Soudain, des popups bizarres clignotent sur ton écran.',
          question: 'Quel est le premier réflexe indispensable ?',
          options: [
            {
              text: 'Fermer l’onglet, couper le wifi si possible et prévenir calmement tes parents.',
              isBest: true,
              feedback: 'Excellente décision ! Garder son calme et avertir un adulte règle le souci sans l’aggraver.',
            },
            {
              text: 'Cacher le problème et télécharger un fichier inconnu censé "réparer le bug".',
              isBest: false,
              feedback: 'Attention ! Télécharger d’autres logiciels inconnus risque d’empirer l’infection.',
            },
            {
              text: 'Taper ton mot de passe pour vérifier si ton compte fonctionne encore.',
              isBest: false,
              feedback: 'Surtout pas ! Si le site est un clone pirate, tu leur offres tes identifiants.',
            },
          ],
        },
        {
          title: 'Situation d’Alerte 2',
          scenario: 'Avec tes parents, vous avez fermé la page suspecte. Maintenant, vous voulez sécuriser ton compte de jeu.',
          question: 'Quelle est la prochaine étape recommandée ?',
          options: [
            {
              text: 'Changer le mot de passe depuis l’application officielle et activer la double authentification (2FA).',
              isBest: true,
              feedback: 'Parfait ! Changer de mot de passe et activer le 2FA bloque immédiatement les pirates.',
            },
            {
              text: 'Garder le même mot de passe en se disant que tout va bien.',
              isBest: false,
              feedback: 'Mieux vaut prévenir : renouveler un mot de passe prend 2 minutes et apporte une vraie sérénité.',
            },
          ],
        },
      ],
    },
    en: {
      tag: 'Mechanic 12 / Response',
      title: 'Incident Response Protocol',
      stepBadge: (curr: number, total: number) => `Step ${curr} of ${total}`,
      mascot: 'Ciber says: "Mistakes happen to everyone. What matters most is staying calm and reaching out to an adult."',
      nextBtn: 'Next Scenario',
      completeBtn: 'Complete Emergency Protocol!',
      scenarios: [
        {
          title: 'Alert Scenario 1',
          scenario: 'You accidentally clicked a link promising "Free Robux". Suddenly, bizarre warning popups start flashing on screen.',
          question: 'What is the very first and most critical action you should take?',
          options: [
            {
              text: 'Close the browser tab, disconnect Wi-Fi if possible, and calmly tell your parents.',
              isBest: true,
              feedback: 'Excellent choice! Staying calm and asking an adult for help resolves issues safely.',
            },
            {
              text: 'Try to hide it and download a mysterious tool promising to "fix viruses".',
              isBest: false,
              feedback: 'Watch out! Downloading untrusted tools usually makes malware worse.',
            },
            {
              text: 'Type in your username and password to test if your account still works.',
              isBest: false,
              feedback: 'Never! If the site is malicious, you would be handing over your login keys.',
            },
          ],
        },
        {
          title: 'Alert Scenario 2',
          scenario: 'Together with your parents, you closed the suspicious page. Now you want to ensure your gaming account remains protected.',
          question: 'What is the correct next step?',
          options: [
            {
              text: 'Update your password from the official app and turn on two-factor authentication (2FA).',
              isBest: true,
              feedback: 'Masterful! Changing the password and locking it with 2FA kicks intruders out immediately.',
            },
            {
              text: 'Keep the same password assuming nothing bad happened.',
              isBest: false,
              feedback: 'Prevention is best: changing the password takes 2 minutes and gives total peace of mind.',
            },
          ],
        },
      ],
    },
  }[language] || {
    tag: 'Mecánica 12 / Respuesta',
    title: 'Respuesta ante Incidentes',
    stepBadge: (curr: number, total: number) => `Paso ${curr} de ${total}`,
    mascot: 'Ciber dice: "Los errores pasan y no tienen nada de malo. Lo importante es no tener miedo de hablar con un adulto."',
    nextBtn: 'Siguiente Situación',
    completeBtn: '¡Completar Protocolo de Emergencia!',
    scenarios: [
      {
        title: 'Situación de Alerta 1',
        scenario: 'Hiciste clic por error en un enlace que prometía "Robux gratis". De repente, tu pantalla empieza a parpadear con alertas raras.',
        question: '¿Qué es lo primero y más importante que debes hacer?',
        options: [
          {
            text: 'Cerrar la pestaña, desconectar internet si es posible y avisar con calma a tus padres.',
            isBest: true,
            feedback: '¡Excelente decisión! Mantener la calma y pedir ayuda a un adulto resuelve cualquier problema sin empeorarlo.',
          },
          {
            text: 'Intentar ocultarlo y descargar un archivo misterioso que promete "arreglarlo".',
            isBest: false,
            feedback: '¡Cuidado! Descargar más cosas suele empeorar la infección del dispositivo.',
          },
          {
            text: 'Ingresar tu usuario y contraseña para ver si la cuenta sigue funcionando.',
            isBest: false,
            feedback: '¡No! Si la página es falsa, regalarías tus datos a los estafadores.',
          },
        ],
      },
      {
        title: 'Situación de Alerta 2',
        scenario: 'Junto con tus padres, cerraron la página. Ahora quieren asegurarse de que tu cuenta de juego esté a salvo.',
        question: '¿Cuál es el siguiente paso correcto?',
        options: [
          {
            text: 'Cambiar la contraseña desde la app oficial y activar la verificación en dos pasos (2FA).',
            isBest: true,
            feedback: '¡Magistral! Cambiar la clave y blindar con 2FA expulsa a cualquier intruso de tu cuenta.',
          },
          {
            text: 'Dejar la misma clave porque "seguro no pasó nada".',
            isBest: false,
            feedback: 'Es mejor prevenir: cambiar la clave solo toma 2 minutos y te da total tranquilidad.',
          },
        ],
      },
    ],
  };

  const scenarioSteps = loc.scenarios;
  const current = scenarioSteps[step];

  const handleSelect = (option: { text: string; isBest: boolean; feedback: string }) => {
    setFeedback(option.feedback);
  };

  const handleNext = () => {
    setFeedback(null);
    if (step < scenarioSteps.length - 1) {
      setStep((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 bg-slate-50 text-slate-800 select-none overflow-y-auto space-y-3">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
            <LifeBuoy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-extrabold text-rose-600 tracking-wider">
              {loc.tag}
            </div>
            <h2 className="text-sm font-black text-slate-900">{loc.title}</h2>
          </div>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-600">
          {loc.stepBadge(step + 1, scenarioSteps.length)}
        </span>
      </div>

      {/* Mascot advice */}
      <div className="flex items-center gap-3 p-3 bg-rose-50/80 rounded-2xl border border-rose-100">
        <CiberMascot size="sm" expression={feedback ? 'celebrating' : 'thinking'} />
        <div className="text-xs text-rose-950 leading-snug">
          {loc.mascot}
        </div>
      </div>

      {/* Scenario Card */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3">
        <span className="text-[10px] font-black uppercase tracking-wider text-rose-600">
          {current.title}
        </span>
        <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
          {current.scenario}
        </p>

        <h3 className="text-xs font-bold text-slate-900 pt-1">{current.question}</h3>

        <div className="space-y-2">
          {current.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(opt)}
              className="w-full text-left p-3 rounded-2xl bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-xs font-medium text-slate-800 transition cursor-pointer flex items-center justify-between"
            >
              <span>{opt.text}</span>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
            </button>
          ))}
        </div>

        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950 font-medium"
          >
            {feedback}
          </motion.div>
        )}
      </div>

      {/* Action CTA */}
      <button
        onClick={handleNext}
        disabled={!feedback}
        className={`w-full py-3.5 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
          feedback
            ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-lg shadow-rose-500/20 active:scale-95'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
        }`}
      >
        <ShieldCheck className="w-4 h-4" />
        <span>{step < scenarioSteps.length - 1 ? loc.nextBtn : loc.completeBtn}</span>
      </button>
    </div>
  );
};
