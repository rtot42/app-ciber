import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, ShieldCheck, AlertCircle, ArrowRight, UserX, Check } from 'lucide-react';
import { CiberMascot } from '../CiberMascot';
import { useLanguage } from '../../i18n/LanguageContext';
import { ChildAgeGroup } from '../../types';

interface ChatSimGameProps {
  onComplete: () => void;
  ageGroup?: ChildAgeGroup;
}

interface Message {
  sender: 'other' | 'me' | 'system';
  text: string;
  time: string;
}

export const ChatSimGame: React.FC<ChatSimGameProps> = ({ onComplete, ageGroup = '8–10' }) => {
  const { language } = useLanguage();
  const [step, setStep] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const getInitialMsg = () => {
    if (ageGroup === '13–14') {
      if (language === 'en') return 'Hey! We manage an eSports academy. We liked your tournament clips. Send us your full real name, school ID photo, and phone to coordinate an official test.';
      if (language === 'fr') return 'Salut ! On recrute pour une académie eSport. On a adoré tes clips. Envoie ton nom complet, ta carte d’étudiant et ton numéro pour planifier un test officiel.';
      return '¡Hola! Reclutamos para una academia de eSports. Nos gustaron tus clips de torneo. Pásanos tu nombre completo, foto de carnet estudiantil y teléfono para coordinar una prueba oficial.';
    }
    if (ageGroup === '11–12') {
      if (language === 'en') return 'Hey! Great squad game yesterday! Drop me your private WhatsApp or phone number so I can add you to our secret server where we trade battle passes.';
      if (language === 'fr') return 'Salut ! Super partie en escouade hier ! Donne-moi ton WhatsApp privé ou ton numéro pour que je t’ajoute à notre serveur secret de passes de combat.';
      return '¡Hola! Tremenda partida en escuadrón ayer. Pásame tu WhatsApp privado o tu teléfono para agregarte a nuestro grupo secreto donde regalamos pases de batalla.';
    }
    if (language === 'en') return 'Hey! We played together yesterday in Roblox. You are so good! How old are you and what school do you go to?';
    if (language === 'fr') return 'Salut ! On a joué ensemble sur Roblox hier. Tu gères trop ! Tu as quel âge et tu vas dans quelle école ?';
    return '¡Hola! Jugamos juntos ayer en Roblox. Eres muy bueno. ¿Cuántos años tienes y a qué colegio vas?';
  };

  const locData = {
    es: {
      tag: `Mecánica 5 • Nivel ${ageGroup} años`,
      title: 'Simulador de Conversación',
      stepText: (s: number) => `Paso ${Math.min(s + 1, 2)} de 2`,
      contactSub: ageGroup === '13–14' ? 'Contacto no verificado' : 'Desconocido en multijugador',
      blockBtn: 'Bloquear',
      prompt: '¿Qué responderías tú?',
      completeBtn: '¡Completar Simulación de Chat!',
      systemInit: 'Nuevo mensaje de chat privado de "GamerGhost99"',
      initialOtherMsg: getInitialMsg(),
      step0: [
        {
          text: 'Tengo 11 y voy al San Patricio en el centro.',
          isSafe: false,
          response: 'Dar tu edad y tu colegio a alguien que solo conoces de una partida es peligroso.',
          myReply: 'Tengo 11 y voy al San Patricio.',
          botFollowup: '¡Qué bien! Mándame una foto de tu uniforme y te agrego a mi grupo VIP.',
        },
        {
          text: 'Prefiero no compartir datos personales. Hablemos solo de trucos del juego.',
          isSafe: true,
          response: '¡Excelente respuesta! Mantienes el juego divertido sin regalar tu información personal.',
          myReply: 'Prefiero no compartir datos personales. Hablemos solo del juego.',
          botFollowup: 'Entendido. ¿Cuál es tu estrategia en el mapa de lava?',
        },
      ],
      step1: [
        {
          text: 'Bloquear y avisar a mamá o papá si insiste en pedir datos.',
          isSafe: true,
          response: '¡Perfecto! Tienes todo el control para bloquear a quien te incomode y contarlo sin miedo.',
          myReply: 'He decidido bloquearte por seguridad.',
        },
        {
          text: 'Seguir hablando y aceptar vernos en el parque el sábado.',
          isSafe: false,
          response: '¡Alerta roja! Nunca aceptes encontrarte en persona con nadie de Internet sin tus padres.',
          myReply: 'Está bien, nos vemos en el parque.',
        },
      ],
    },
    fr: {
      tag: 'Mécanique 5 / Chat Sûr',
      title: 'Simulateur de Conversation',
      stepText: (s: number) => `Étape ${Math.min(s + 1, 2)} sur 2`,
      contactSub: 'Inconnu en multijoueur',
      blockBtn: 'Bloquer',
      prompt: 'Que répondrais-tu ?',
      completeBtn: 'Terminer la Simulation de Chat !',
      systemInit: 'Nouveau message privé de "GamerGhost99"',
      initialOtherMsg: 'Salut ! On a joué ensemble sur Roblox hier. Tu gères trop ! Tu as quel âge et tu vas dans quelle école ?',
      step0: [
        {
          text: 'J’ai 11 ans et je vais au collège Saint-Patrick en centre-ville.',
          isSafe: false,
          response: 'Donner ton âge et ton école à un inconnu de jeu vidéo est très dangereux.',
          myReply: 'J’ai 11 ans et je vais à Saint-Patrick.',
          botFollowup: 'Super ! Envoie-moi une photo de ton uniforme et je t’invite dans mon groupe VIP.',
        },
        {
          text: 'Je préfère ne pas partager mes infos personnelles. Parlons juste d’astuces du jeu.',
          isSafe: true,
          response: 'Excellente réponse ! Tu profites du jeu sans dévoiler ta vie privée.',
          myReply: 'Je ne partage pas mes infos personnelles. Parlons du jeu.',
          botFollowup: 'D’accord. C’est quoi ta stratégie pour le monde de lave ?',
        },
      ],
      step1: [
        {
          text: 'Bloquer le contact et prévenir mes parents s’il insiste pour avoir des infos.',
          isSafe: true,
          response: 'Parfait ! Tu as le réflexe idéal : bloquer et en parler à un adulte de confiance.',
          myReply: 'Je te bloque pour ma sécurité.',
        },
        {
          text: 'Continuer à discuter et accepter de le voir au parc samedi.',
          isSafe: false,
          response: 'Alerte rouge ! Ne jamais accepter de rendez-vous réel avec un inconnu du web.',
          myReply: 'D’accord, on se retrouve au parc.',
        },
      ],
    },
    en: {
      tag: 'Mechanic 5 / Safe Chat',
      title: 'Conversation Simulator',
      stepText: (s: number) => `Step ${Math.min(s + 1, 2)} of 2`,
      contactSub: 'Stranger in multiplayer',
      blockBtn: 'Block',
      prompt: 'How would you respond?',
      completeBtn: 'Complete Chat Simulation!',
      systemInit: 'New private direct message from "GamerGhost99"',
      initialOtherMsg: 'Hey! We played Roblox together yesterday. You were awesome! How old are you and which school do you attend?',
      step0: [
        {
          text: 'I am 11 and I go to St. Patrick in downtown.',
          isSafe: false,
          response: 'Sharing your age and school name with someone you met in a match is risky.',
          myReply: 'I am 11 and I go to St. Patrick.',
          botFollowup: 'Nice! Send me a picture of your school jacket and I will add you to my VIP squad.',
        },
        {
          text: 'I prefer not to share personal details. Let us just chat about gaming tips.',
          isSafe: true,
          response: 'Excellent reply! Keep gameplay fun without giving away your real identity.',
          myReply: 'I do not share personal details. Let us stick to game tips.',
          botFollowup: 'Got it. What is your best strategy on the lava level?',
        },
      ],
      step1: [
        {
          text: 'Block the user and tell mom or dad if they keep insisting on personal details.',
          isSafe: true,
          response: 'Spot on! You have the power to block anyone making you uncomfortable and speak up.',
          myReply: 'I have decided to block you for security reasons.',
        },
        {
          text: 'Keep chatting and agree to meet up in person at the local park on Saturday.',
          isSafe: false,
          response: 'Red alert! Never ever meet anyone from the internet in person without parents.',
          myReply: 'Sure, see you at the park.',
        },
      ],
    },
  };

  const loc = locData[language] || locData.en || locData.es;

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'system',
      text: loc.systemInit,
      time: '14:20',
    },
    {
      sender: 'other',
      text: loc.initialOtherMsg,
      time: '14:21',
    },
  ]);

  const handleChoose = (choice: { text: string; isSafe: boolean; response: string; myReply: string; botFollowup?: string }) => {
    setFeedback(choice.response);
    setMessages((prev) => [
      ...prev,
      { sender: 'me', text: choice.myReply, time: '14:22' },
    ]);

    if (choice.botFollowup) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { sender: 'other', text: choice.botFollowup!, time: '14:23' },
        ]);
      }, 600);
    }

    setStep((prev) => prev + 1);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col p-5 sm:p-6 bg-slate-50 text-slate-800 select-none overflow-y-auto scrollbar-none space-y-6 sm:space-y-7 pb-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold text-cyan-600 tracking-wider">
              {loc.tag}
            </div>
            <h2 className="text-base font-black text-slate-900">{loc.title}</h2>
          </div>
        </div>
        <span className="text-xs font-bold text-slate-600">
          {loc.stepText(step)}
        </span>
      </div>

      {/* Simulated Smartphone Chat Screen */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex-1 flex flex-col justify-between min-h-[300px]">
        {/* Chat Contact Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-600">
              👻
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">GamerGhost99</div>
              <div className="text-[10px] text-slate-400">{loc.contactSub}</div>
            </div>
          </div>
          <button className="text-[10px] font-bold px-2 py-1 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 flex items-center gap-1">
            <UserX className="w-3 h-3" />
            <span>{loc.blockBtn}</span>
          </button>
        </div>

        {/* Message Stream */}
        <div className="space-y-2 py-3 overflow-y-auto">
          {messages.map((m, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${
                m.sender === 'system'
                  ? 'items-center'
                  : m.sender === 'me'
                  ? 'items-end'
                  : 'items-start'
              }`}
            >
              {m.sender === 'system' ? (
                <div className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-medium text-center">
                  {m.text}
                </div>
              ) : (
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'me'
                      ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-br-none shadow-sm'
                      : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200/60'
                  }`}
                >
                  <p>{m.text}</p>
                  <span className={`text-[9px] block text-right mt-1 ${m.sender === 'me' ? 'text-sky-100' : 'text-slate-400'}`}>
                    {m.time}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Ciber Feedback Notification */}
        {feedback && (
          <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-2xl text-xs text-cyan-950 flex items-center gap-2 mb-2">
            <CiberMascot size="sm" expression="happy" className="shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Interactive Response Options */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="text-[11px] font-bold text-slate-500">{loc.prompt}</div>
          {step === 0 && (
            <div className="space-y-2">
              {loc.step0.map((c, i) => (
                <button
                  key={i}
                  onClick={() => handleChoose(c)}
                  className="w-full text-left p-3 rounded-2xl bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-xs font-semibold text-slate-800 transition flex items-center justify-between cursor-pointer"
                >
                  <span>{c.text}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                </button>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-2">
              {loc.step1.map((c, i) => (
                <button
                  key={i}
                  onClick={() => handleChoose(c)}
                  className="w-full text-left p-3 rounded-2xl bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-xs font-semibold text-slate-800 transition flex items-center justify-between cursor-pointer"
                >
                  <span>{c.text}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                </button>
              ))}
            </div>
          )}

          {step >= 2 && (
            <button
              onClick={onComplete}
              className="w-full py-3.5 rounded-2xl font-black text-sm bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loc.completeBtn}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
