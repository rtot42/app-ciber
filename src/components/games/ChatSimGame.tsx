import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  MessageSquare,
  ArrowRight,
  UserX,
  CheckCircle2,
  XCircle,
  ShieldAlert,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { ChildAgeGroup, GameResultStats } from '../../types';
import { GameHud, GameVictorySummary } from './GameShell';
import { computeStars } from '../../utils/ageDifficulty';
import { playGameSound } from '../../utils/gameAudio';

interface ChatSimGameProps {
  onComplete: (stats?: GameResultStats) => void;
  ageGroup?: ChildAgeGroup;
}

interface ChatChoice {
  text: string;
  isSafe: boolean;
  response: string;
  myReply: string;
  botFollowup?: string;
}

interface ChatStep {
  choices: ChatChoice[];
}

interface Message {
  sender: 'other' | 'me' | 'system';
  text: string;
  time: string;
}

export const ChatSimGame: React.FC<ChatSimGameProps> = ({
  onComplete,
  ageGroup = '8–10' as ChildAgeGroup,
}) => {
  const { language } = useLanguage();

  const scenario = useMemo(() => {
    const langKey = language;
    if (ageGroup === '13–14') {
      const data = {
        es: {
          title: 'Simulador de Chat Seguro',
          subtitle: 'Modo Pro: reclutamiento falso y coerción social',
          contactName: 'ProScout_Esports',
          contactSub: 'Cuenta externa no verificada',
          systemInit: 'Solicitud de mensaje directo recibida',
          initialMsg:
            '¡Hola! Vimos tus jugadas y queremos invitarte a nuestra academia Pro eSports. ¿Nos pasas tu nombre real, teléfono y foto de carnet escolar para registrarte?',
          blockBtn: 'Bloquear',
          blockedBanner: 'Has bloqueado y reportado a ProScout_Esports antes de ceder tus datos.',
          steps: [
            {
              choices: [
                {
                  text: 'Prefiero no enviar datos personales por DM. ¿Cuál es el sitio oficial de la liga para que lo revisen mis padres?',
                  isSafe: true,
                  response: '¡Respuesta táctica! Pides verificación oficial sin exponer identidad.',
                  myReply: 'No paso datos por DM. ¿Cuál es la web oficial para verla con mis padres?',
                  botFollowup:
                    'No se lo cuentes a tus padres todavía o perderás el cupo. Mejor entra solo a este link y pon tu clave de Discord.',
                },
                {
                  text: '¡Genial! Me llamo Lucas, tengo 13 y mi número es 555-3910.',
                  isSafe: false,
                  response: 'Dar teléfono y nombre real a un perfil no verificado abre la puerta al engaño.',
                  myReply: 'Me llamo Lucas y mi teléfono es 555-3910.',
                  botFollowup:
                    'Perfecto. Ahora no se lo digas a tus padres para que sea sorpresa y entra en este link con tu Discord.',
                },
              ],
            },
            {
              choices: [
                {
                  text: 'Pedir secretos a un menor y enlaces externos es manipulación. Corto contacto ahora.',
                  isSafe: true,
                  response: '¡Exacto! Detectar el secretismo forzado es clave contra el grooming.',
                  myReply: 'Cualquier propuesta que pida ocultarlo a mis padres es una alerta roja.',
                  botFollowup: 'Vamos, todos los pros firman rápido sin preguntar...',
                },
                {
                  text: 'Está bien, entro rápido al enlace sin avisar en casa.',
                  isSafe: false,
                  response: '¡Peligro! Un reclutador real siempre trata directamente con tutores legales.',
                  myReply: 'Ok, voy a entrar al enlace.',
                  botFollowup: 'Excelente, inicia sesión ahí ahora.',
                },
              ],
            },
            {
              choices: [
                {
                  text: 'Bloquear, guardar captura como evidencia y contárselo a un adulto de confianza.',
                  isSafe: true,
                  response: 'Protocolo completado: evidencia guardada, usuario bloqueado y adulto informado.',
                  myReply: 'Cuenta bloqueada y reportada a moderación.',
                },
                {
                  text: 'Solo silenciarlo por hoy pero dejarlo en mi lista de amigos.',
                  isSafe: false,
                  response: 'Dejar al usuario en tu lista le permite seguir escribiéndote o viendo tu estado.',
                  myReply: 'Lo dejo silenciado por ahora.',
                },
              ],
            },
          ] as ChatStep[],
          takeaway:
            'Cualquier persona que te pida guardar secretos frente a tus padres, cambiar de plataforma o iniciar sesión en enlaces externos es una alerta máxima. Bloquea, guarda captura y avisa.',
        },
        fr: {
          title: 'Simulateur de Chat Sûr',
          subtitle: 'Mode Pro : faux recruteur et manipulation',
          contactName: 'ProScout_Esports',
          contactSub: 'Compte externe non vérifié',
          systemInit: 'Demande de message privé reçue',
          initialMsg:
            'Salut ! On adore ton niveau. Envoie ton vrai nom, ton numéro de téléphone et une photo de ta carte scolaire pour rejoindre notre académie eSport.',
          blockBtn: 'Bloquer',
          blockedBanner: 'Tu as bloqué et signalé ProScout_Esports sans rien révéler.',
          steps: [
            {
              choices: [
                {
                  text: 'Je ne partage pas d’infos privées en DM. Quel est le site officiel pour que mes parents vérifient ?',
                  isSafe: true,
                  response: 'Excellente réaction ! Tu exiges une source officielle sans livrer d’identité.',
                  myReply: 'Pas d’infos en DM. Donne le site officiel pour mes parents.',
                  botFollowup:
                    'N’en parle surtout pas à tes parents sinon tu perds ta place ! Connecte-toi vite avec Discord sur ce lien.',
                },
                {
                  text: 'Super ! Je m’appelle Lucas, 13 ans, et voici mon numéro.',
                  isSafe: false,
                  response: 'Donner nom et numéro à un inconnu expose à l’usurpation et aux pressions.',
                  myReply: 'Je m’appelle Lucas et mon 06 est...',
                  botFollowup:
                    'Parfait. Garde ça secret face à tes parents et connecte ton Discord sur ce lien.',
                },
              ],
            },
            {
              choices: [
                {
                  text: 'Demander de garder un secret face aux parents est un signal d’alarme critique.',
                  isSafe: true,
                  response: 'Bravo ! Le secret imposé est un indice majeur de manipulation en ligne.',
                  myReply: 'Si je dois le cacher à mes parents, c’est suspect.',
                  botFollowup: 'Allez, tous les joueurs pros signent vite...',
                },
                {
                  text: 'D’accord, j’ouvre le lien discrètement sans rien dire.',
                  isSafe: false,
                  response: 'Danger ! Une vraie organisation contacte toujours les responsables légaux.',
                  myReply: 'Ok j’ouvre le lien.',
                  botFollowup: 'Super, entre tes identifiants.',
                },
              ],
            },
            {
              choices: [
                {
                  text: 'Bloquer, faire une capture d’écran et prévenir un adulte de confiance.',
                  isSafe: true,
                  response: 'Réflexe parfait : preuve conservée, compte bloqué et adulte prévenu.',
                  myReply: 'Compte bloqué et signalé.',
                },
                {
                  text: 'Juste ignorer le message sans bloquer ni prévenir personne.',
                  isSafe: false,
                  response: 'Ne pas bloquer lui laisse l’accès à ton profil et à d’autres joueurs.',
                  myReply: 'Je vais juste fermer la fenêtre.',
                },
              ],
            },
          ] as ChatStep[],
          takeaway:
            'Quiconque te demande de garder un secret vis-à-vis de tes parents ou de cliquer sur un lien externe est suspect. Bloque, garde une capture et parle à un adulte.',
        },
        en: {
          title: 'Safe Chat Simulator',
          subtitle: 'Pro Mode: fake eSports scout & secrecy traps',
          contactName: 'ProScout_Esports',
          contactSub: 'Unverified external profile',
          systemInit: 'New direct message request received',
          initialMsg:
            'Hey! We loved your tournament clips and want you in our Pro eSports academy. Send your full real name, phone number, and school ID photo to register!',
          blockBtn: 'Block',
          blockedBanner: 'You blocked & reported ProScout_Esports without giving up any info.',
          steps: [
            {
              choices: [
                {
                  text: 'I don’t share personal details in DMs. What is your official website for my parents to verify?',
                  isSafe: true,
                  response: 'Smart defense! Asking for parent-verifiable channels shuts down fake scouts.',
                  myReply: 'No personal info over DM. Send the official site for my parents.',
                  botFollowup:
                    'Don’t tell your parents yet or you’ll lose the spot! Just log into Discord using this quick link.',
                },
                {
                  text: 'Awesome! My name is Lucas, I’m 13, and my cell is 555-3910.',
                  isSafe: false,
                  response: 'Giving your phone and full name to an unverified stranger risks real harm.',
                  myReply: 'I’m Lucas and my number is 555-3910.',
                  botFollowup:
                    'Great. Keep it secret from your parents so it stays a surprise, and log into this link.',
                },
              ],
            },
            {
              choices: [
                {
                  text: 'Telling a minor to hide things from parents is a huge red flag. Stopping here.',
                  isSafe: true,
                  response: 'Spot on! Forced secrecy is a primary tactic of online manipulation.',
                  myReply: 'Asking me to keep secrets from my parents is a red flag.',
                  botFollowup: 'Come on, every pro signs without asking...',
                },
                {
                  text: 'Okay, I’ll open the link quickly without telling anyone at home.',
                  isSafe: false,
                  response: 'Dangerous! Real academies always involve parents or legal guardians.',
                  myReply: 'Okay, clicking the link now.',
                  botFollowup: 'Cool, enter your password.',
                },
              ],
            },
            {
              choices: [
                {
                  text: 'Block, take a screenshot as proof, and tell a trusted adult.',
                  isSafe: true,
                  response: 'Perfect protocol: proof saved, account blocked, and adult alerted.',
                  myReply: 'Blocked and reported for suspicious conduct.',
                },
                {
                  text: 'Just mute them for now and keep them on my friend list.',
                  isSafe: false,
                  response: 'Keeping them added lets them keep monitoring your activity or messaging others.',
                  myReply: 'I will just mute the chat.',
                },
              ],
            },
          ] as ChatStep[],
          takeaway:
            'Anyone asking you to hide conversations from parents, switch to private chats, or enter logins on external links is unsafe. Block, screenshot, and speak up.',
        },
      };
      return data[langKey];
    }

    if (ageGroup === '11–12') {
      const data = {
        es: {
          title: 'Simulador de Chat Seguro',
          subtitle: 'Nivel Táctico: presión de grupo y enlace de regalo',
          contactName: 'ShadowTrade77',
          contactSub: 'Conocido de escuadrón',
          systemInit: 'Mensaje directo de ShadowTrade77',
          initialMsg:
            '¡Buena partida! Dame tu WhatsApp privado para pasarte el servidor secreto donde regalamos pases de batalla.',
          blockBtn: 'Bloquear',
          blockedBanner: 'Has bloqueado a ShadowTrade77 y protegido tu número.',
          steps: [
            {
              choices: [
                {
                  text: 'No doy mi WhatsApp ni salgo del chat del juego. Juguemos solo por aquí.',
                  isSafe: true,
                  response: '¡Bien hecho! El chat del juego tiene moderación; los externos no.',
                  myReply: 'Prefiero seguir solo en el chat del juego.',
                  botFollowup:
                    'Vamos, mándame al menos una foto tuya con tu uniforme para saber que no eres un bot.',
                },
                {
                  text: '¡Claro! Apunta mi número +34 600...',
                  isSafe: false,
                  response: 'Pasar tu teléfono a gente de videojuegos te expone fuera de la plataforma.',
                  myReply: 'Aquí tienes mi número...',
                  botFollowup:
                    'Mándame también una selfie tuya ahora para validar tu pase gratis.',
                },
              ],
            },
            {
              choices: [
                {
                  text: 'Rechazar enviar fotos y bloquear o avisar a mamá o papá si insiste.',
                  isSafe: true,
                  response: '¡Excelente! Nunca envíes fotos personales por promesas de premios.',
                  myReply: 'No comparto fotos personales. Fin de la charla.',
                },
                {
                  text: 'Mandar una selfie rápida para que me dé el pase.',
                  isSafe: false,
                  response: '¡Alerta! Una selfie puede usarse para chantaje o suplantación.',
                  myReply: 'Te envío la foto ya.',
                },
              ],
            },
          ] as ChatStep[],
          takeaway:
            'Mantén las conversaciones dentro del chat moderado del juego y jamás envíes tu teléfono ni fotos personales a cambio de pases o gemas.',
        },
        fr: {
          title: 'Simulateur de Chat Sûr',
          subtitle: 'Niveau Tactique : WhatsApp privé & fausses récompenses',
          contactName: 'ShadowTrade77',
          contactSub: 'Joueur croisé en escouade',
          systemInit: 'Message privé de ShadowTrade77',
          initialMsg:
            'Super partie ! Passe-moi ton WhatsApp privé pour rejoindre notre groupe secret de passes de combat gratuits.',
          blockBtn: 'Bloquer',
          blockedBanner: 'Tu as bloqué ShadowTrade77 et gardé ton numéro secret.',
          steps: [
            {
              choices: [
                {
                  text: 'Je reste dans le chat du jeu, je ne donne pas mon numéro.',
                  isSafe: true,
                  response: 'Très bien ! Le chat du jeu est modéré contrairement aux applis externes.',
                  myReply: 'Je préfère rester sur le chat du jeu.',
                  botFollowup: 'Allez, envoie au moins un selfie pour prouver que tu n’es pas un bot !',
                },
                {
                  text: 'D’accord, voici mon numéro WhatsApp...',
                  isSafe: false,
                  response: 'Donner son téléphone fait sortir la discussion hors de toute protection.',
                  myReply: 'Voilà mon numéro...',
                  botFollowup: 'Envoie-moi aussi un selfie maintenant pour débloquer ton passe.',
                },
              ],
            },
            {
              choices: [
                {
                  text: 'Refuser la photo, bloquer et prévenir un parent.',
                  isSafe: true,
                  response: 'Parfait ! Jamais de photo personnelle contre des cadeaux virtuels.',
                  myReply: 'Pas de photo. Au revoir.',
                },
                {
                  text: 'Envoyer un selfie rapide pour recevoir le passe.',
                  isSafe: false,
                  response: 'Danger ! Une photo peut être détournée ou utilisée contre toi.',
                  myReply: 'Voici ma photo.',
                },
              ],
            },
          ] as ChatStep[],
          takeaway:
            'Reste toujours dans le chat du jeu et n’envoie jamais ton numéro ou ta photo pour obtenir un passe gratuit.',
        },
        en: {
          title: 'Safe Chat Simulator',
          subtitle: 'Tactical Tier: off-platform chat & selfie pressure',
          contactName: 'ShadowTrade77',
          contactSub: 'Matchmaking teammate',
          systemInit: 'Direct message from ShadowTrade77',
          initialMsg:
            'Awesome match! Drop me your personal WhatsApp number so I can add you to our secret free battle-pass group.',
          blockBtn: 'Block',
          blockedBanner: 'You blocked ShadowTrade77 and kept your phone private.',
          steps: [
            {
              choices: [
                {
                  text: 'I don’t share my phone number. Let’s keep chatting inside the game only.',
                  isSafe: true,
                  response: 'Smart move! Game chats have safety filters; external chats do not.',
                  myReply: 'I only chat inside the game.',
                  botFollowup: 'Come on, send a quick selfie so I know you aren’t a bot!',
                },
                {
                  text: 'Sure! Here is my WhatsApp number...',
                  isSafe: false,
                  response: 'Moving to private messaging removes platform safety protections.',
                  myReply: 'Here is my number...',
                  botFollowup: 'Also send a selfie right now to unlock your free pass.',
                },
              ],
            },
            {
              choices: [
                {
                  text: 'Refuse sending photos, block them, and tell a parent.',
                  isSafe: true,
                  response: 'Spot on! Never trade personal photos for game rewards.',
                  myReply: 'No photos. Goodbye.',
                },
                {
                  text: 'Send one fast selfie to get the free battle pass.',
                  isSafe: false,
                  response: 'Red alert! Personal photos can be misused or shared without consent.',
                  myReply: 'Sending a selfie now.',
                },
              ],
            },
          ] as ChatStep[],
          takeaway:
            'Keep gaming chats inside the moderated game and never share your phone number or photos for promised rewards.',
        },
      };
      return data[langKey];
    }

    // 8-10 guided tier
    const data = {
      es: {
        title: 'Simulador de Conversación',
        subtitle: 'Nivel Cadete: protege tu edad y colegio',
        contactName: 'GamerGhost99',
        contactSub: 'Desconocido en multijugador',
        systemInit: 'Nuevo chat privado de GamerGhost99',
        initialMsg:
          '¡Hola! Jugamos juntos ayer en Roblox. Eres genial. ¿Cuántos años tienes y a qué colegio vas?',
        blockBtn: 'Bloquear',
        blockedBanner: 'Has bloqueado a GamerGhost99 para cuidar tu privacidad.',
        steps: [
          {
            choices: [
              {
                text: 'Prefiero no decir mi edad ni mi colegio. Hablemos solo de trucos del juego.',
                isSafe: true,
                response: '¡Excelente! Disfrutas el juego sin regalar datos reales.',
                myReply: 'Prefiero no dar datos personales. Hablemos solo del juego.',
                botFollowup: '¿Y si nos vemos en el parque cerca de tu casa el sábado?',
              },
              {
                text: 'Tengo 9 años y voy al Colegio San Patricio.',
                isSafe: false,
                response: 'Contar tu edad y colegio a alguien de Internet es peligroso.',
                myReply: 'Tengo 9 y voy al San Patricio.',
                botFollowup: '¡Genial! ¿Nos vemos en el parque cerca de ahí el sábado?',
              },
            ],
          },
          {
            choices: [
              {
                text: 'Decir que no, bloquear al usuario y avisar a mamá o papá.',
                isSafe: true,
                response: '¡Perfecto! Nunca te reúnas con desconocidos de Internet.',
                myReply: 'No acepto encuentros. Te bloqueo ahora.',
              },
              {
                text: 'Aceptar ir al parque el sábado a jugar.',
                isSafe: false,
                response: '¡Alerta roja! Jamás quedes en persona con alguien de Internet sin tus padres.',
                myReply: 'Bueno, nos vemos el sábado.',
              },
            ],
          },
        ] as ChatStep[],
        takeaway:
          'Nunca reveles tu edad, tu colegio o dónde vives a desconocidos en juegos, y jamás aceptes encuentros en persona.',
      },
      fr: {
        title: 'Simulateur de Conversation',
        subtitle: 'Niveau Cadet : protège ton âge et ton école',
        contactName: 'GamerGhost99',
        contactSub: 'Inconnu en multijoueur',
        systemInit: 'Nouveau message de GamerGhost99',
        initialMsg:
          'Salut ! On a joué ensemble sur Roblox hier. Tu as quel âge et tu vas dans quelle école ?',
        blockBtn: 'Bloquer',
        blockedBanner: 'Tu as bloqué GamerGhost99 pour protéger ta vie privée.',
        steps: [
          {
            choices: [
              {
                text: 'Je ne donne pas mon âge ni mon école. Parlons juste du jeu.',
                isSafe: true,
                response: 'Super réponse ! Tu gardes tes informations privées secrètes.',
                myReply: 'Je ne partage pas mes infos. Parlons du jeu.',
                botFollowup: 'Et si on se voyait au parc près de chez toi samedi ?',
              },
              {
                text: 'J’ai 9 ans et je vais à l’école Saint-Patrick.',
                isSafe: false,
                response: 'Donner ton âge et ton école à un inconnu est risqué.',
                myReply: 'J’ai 9 ans et je vais à Saint-Patrick.',
                botFollowup: 'Cool ! On se retrouve au parc à côté samedi ?',
              },
            ],
          },
          {
            choices: [
              {
                text: 'Refuser, bloquer le joueur et prévenir maman ou papa.',
                isSafe: true,
                response: 'Parfait ! Ne jamais rencontrer quelqu’un d’Internet.',
                myReply: 'Non merci, je te bloque.',
              },
              {
                text: 'Accepter d’aller au parc samedi.',
                isSafe: false,
                response: 'Alerte rouge ! Ne va jamais à un rendez-vous avec un inconnu du web.',
                myReply: 'D’accord pour samedi.',
              },
            ],
          },
        ] as ChatStep[],
        takeaway:
          'Ne dis jamais ton âge ni le nom de ton école dans un jeu en ligne et n’accepte jamais de rendez-vous réel.',
      },
      en: {
        title: 'Safe Chat Simulator',
        subtitle: 'Explorer Tier: protect your age and school',
        contactName: 'GamerGhost99',
        contactSub: 'Multiplayer stranger',
        systemInit: 'New direct message from GamerGhost99',
        initialMsg:
          'Hey! We played Roblox together yesterday! How old are you and what school do you go to?',
        blockBtn: 'Block',
        blockedBanner: 'You blocked GamerGhost99 to protect your privacy.',
        steps: [
          {
            choices: [
              {
                text: 'I prefer not to share my age or school. Let’s just talk about game tips.',
                isSafe: true,
                response: 'Awesome reply! You keep gameplay fun while protecting your identity.',
                myReply: 'I don’t share personal info. Let’s talk about the game.',
                botFollowup: 'Want to meet up at the park near your place on Saturday?',
              },
              {
                text: 'I’m 9 and I go to St. Patrick School.',
                isSafe: false,
                response: 'Sharing your age and school name with someone online is unsafe.',
                myReply: 'I’m 9 and go to St. Patrick.',
                botFollowup: 'Cool! Want to meet at the park nearby on Saturday?',
              },
            ],
          },
          {
            choices: [
              {
                text: 'Say no, block the user, and tell mom or dad.',
                isSafe: true,
                response: 'Spot on! Never meet anyone from the internet in real life.',
                myReply: 'No thanks, blocking you now.',
              },
              {
                text: 'Agree to meet at the park on Saturday.',
                isSafe: false,
                response: 'Red alert! Never meet online strangers in person without parents.',
                myReply: 'Okay, see you Saturday.',
              },
            ],
          },
        ] as ChatStep[],
        takeaway:
          'Never tell online strangers your age, school, or address, and never agree to meet in person.',
      },
    };
    return data[langKey];
  }, [ageGroup, language]);

  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'system', text: scenario.systemInit, time: '14:20' },
    { sender: 'other', text: scenario.initialMsg, time: '14:21' },
  ]);
  const [lastFeedback, setLastFeedback] = useState<{ text: string; isSafe: boolean } | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(1);
  const [correctCount, setCorrectCount] = useState(0);
  const [blockedEarly, setBlockedEarly] = useState(false);
  const [finished, setFinished] = useState(false);

  const totalSteps = scenario.steps.length;

  const handleChoose = (choice: ChatChoice) => {
    playGameSound(choice.isSafe ? (streak >= 1 ? 'combo' : 'correct') : 'wrong');
    setLastFeedback({ text: choice.response, isSafe: choice.isSafe });

    if (choice.isSafe) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setMaxStreak((m) => Math.max(m, nextStreak));
      setCorrectCount((c) => c + 1);
      setScore((s) => s + 130 + nextStreak * 20);
    } else {
      setStreak(0);
    }

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
      }, 450);
    }

    const nextStep = step + 1;
    setStep(nextStep);
    if (nextStep >= totalSteps) {
      setTimeout(() => {
        playGameSound('win');
        setFinished(true);
      }, 950);
    }
  };

  const handleEmergencyBlock = () => {
    if (blockedEarly || finished) return;
    setBlockedEarly(true);
    const remaining = totalSteps - step;
    setCorrectCount((c) => c + remaining);
    setScore((s) => s + 160 + remaining * 90);
    setMaxStreak((m) => Math.max(m, streak + remaining));
    setMessages((prev) => [
      ...prev,
      { sender: 'system', text: scenario.blockedBanner, time: '14:24' },
    ]);
    playGameSound('win');
    setTimeout(() => setFinished(true), 800);
  };

  const handleReplay = () => {
    setStep(0);
    setMessages([
      { sender: 'system', text: scenario.systemInit, time: '14:20' },
      { sender: 'other', text: scenario.initialMsg, time: '14:21' },
    ]);
    setLastFeedback(null);
    setScore(0);
    setStreak(0);
    setMaxStreak(1);
    setCorrectCount(0);
    setBlockedEarly(false);
    setFinished(false);
  };

  const answered = Math.min(step, totalSteps);
  const accuracy = answered > 0 ? Math.round((correctCount / answered) * 100) : 100;

  if (finished) {
    const finalAcc = Math.min(100, Math.round((correctCount / totalSteps) * 100));
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
          title={scenario.title}
          takeaway={scenario.takeaway}
          stats={stats}
          ageGroup={ageGroup}
          onReplay={handleReplay}
          onContinue={onComplete}
        />
      </div>
    );
  }

  const currentChoices = scenario.steps[step]?.choices || [];

  return (
    <div className="flex-1 min-h-0 w-full max-w-full flex flex-col p-2.5 sm:p-4 bg-slate-50 text-slate-800 select-none overflow-y-auto overflow-x-hidden scrollbar-none gap-2.5 sm:gap-3 pb-4">
      <GameHud
        title={scenario.title}
        subtitle={scenario.subtitle}
        icon={<MessageSquare className="w-5 h-5" />}
        accentColor="cyan"
        ageGroup={ageGroup}
        currentStep={Math.min(step + 1, totalSteps)}
        totalSteps={totalSteps}
        score={score}
        streak={streak}
        accuracy={answered > 0 ? accuracy : undefined}
      />

      {/* Simulated Chat Thread */}
      <div className="bg-white rounded-3xl p-3.5 sm:p-5 shadow-xs border border-slate-200/80 flex-1 min-h-[280px] flex flex-col justify-between gap-3">
        {/* Contact Header */}
        <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 text-slate-500" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold text-slate-900 truncate">{scenario.contactName}</div>
              <div className="text-xs text-slate-500 truncate">{scenario.contactSub}</div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleEmergencyBlock}
            disabled={blockedEarly}
            className="text-xs font-bold px-3 py-2 min-h-[38px] rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1.5 cursor-pointer active:scale-95 transition shrink-0"
          >
            <UserX className="w-4 h-4" />
            <span>{scenario.blockBtn}</span>
          </button>
        </div>

        {/* Message Bubbles */}
        <div className="space-y-2.5 py-2 overflow-y-auto flex-1">
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
                <div className="px-3 py-1 rounded-xl bg-slate-100 text-slate-600 text-[11px] font-semibold text-center">
                  {m.text}
                </div>
              ) : (
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    m.sender === 'me'
                      ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-br-none shadow-xs'
                      : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200/70'
                  }`}
                >
                  <p className="font-medium">{m.text}</p>
                  <span
                    className={`text-[10px] block text-right mt-1 tabular-nums ${
                      m.sender === 'me' ? 'text-sky-100' : 'text-slate-400'
                    }`}
                  >
                    {m.time}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Step Feedback */}
        {lastFeedback && (
          <div
            className={`p-3 rounded-2xl border text-xs sm:text-sm font-medium flex items-start gap-2 ${
              lastFeedback.isSafe
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}
          >
            {lastFeedback.isSafe ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            )}
            <span>{lastFeedback.text}</span>
          </div>
        )}

        {/* Decision Choices */}
        {!blockedEarly && currentChoices.length > 0 && (
          <div className="pt-2 border-t border-slate-100 space-y-2">
            {currentChoices.map((c, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleChoose(c)}
                className="w-full text-left p-3.5 min-h-[48px] rounded-2xl bg-slate-50 hover:bg-sky-50 border-2 border-slate-200 hover:border-sky-300 text-xs sm:text-sm font-semibold text-slate-800 transition flex items-center justify-between gap-2 cursor-pointer active:scale-[0.98]"
              >
                <span className="leading-snug">{c.text}</span>
                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
