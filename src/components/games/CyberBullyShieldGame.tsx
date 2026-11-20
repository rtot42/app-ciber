import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  HeartHandshake,
  ShieldCheck,
  MessageCircleHeart,
  Flag,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { ChildAgeGroup, GameResultStats } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { GameHud, GameVictorySummary } from './GameShell';
import { computeStars } from '../../utils/ageDifficulty';
import { playGameSound } from '../../utils/gameAudio';

interface CyberBullyShieldGameProps {
  onComplete: (stats?: GameResultStats) => void;
  ageGroup?: ChildAgeGroup;
}

interface ModerationAction {
  id: string;
  label: string;
  isBest: boolean;
  feedback: string;
  climateDelta: number;
}

interface ModerationCase {
  id: string;
  channel: string;
  author: string;
  message: string;
  actions: ModerationAction[];
}

export const CyberBullyShieldGame: React.FC<CyberBullyShieldGameProps> = ({
  onComplete,
  ageGroup = '8–10' as ChildAgeGroup,
}) => {
  const { language } = useLanguage();

  const copy = useMemo(() => {
    const casesByAge: Record<ChildAgeGroup, ModerationCase[]> = {
      '8–10': [
        {
          id: 'cb1',
          channel: language === 'fr' ? 'Chat Équipe Scolaire' : language === 'en' ? 'School Team Chat' : 'Chat Equipo Escolar',
          author: 'Leo_99',
          message:
            language === 'fr'
              ? '"Haha, regardez le dessin raté de Mateo, personne ne veut jouer avec lui !"'
              : language === 'en'
              ? '"Haha look at Mateo’s ugly drawing, nobody wants him on our team!"'
              : '"Jaja miren el dibujo feo de Mateo, ¡nadie quiere jugar con él!"',
          actions: [
            {
              id: 'a1',
              label:
                language === 'fr'
                  ? 'Soutenir Mateo, dire "Stop" gentiment et prévenir un adulte'
                  : language === 'en'
                  ? 'Support Mateo, say it is not cool, and tell a trusted adult'
                  : 'Apoyar a Mateo, frenar la burla y avisar a un adulto',
              isBest: true,
              climateDelta: 25,
              feedback:
                language === 'fr'
                  ? 'Bravo ! Être un témoin bienveillant brise la spirale des moqueries.'
                  : language === 'en'
                  ? 'Awesome! Being an upstander stops bullying right away.'
                  : '¡Excelente! Ser un testigo solidario frena las burlas y protege a tus compañeros.',
            },
            {
              id: 'a2',
              label:
                language === 'fr'
                  ? 'Rire avec des emojis pour ne pas être rejeté'
                  : language === 'en'
                  ? 'Send laughing emojis so they leave you alone'
                  : 'Mandar emojis de risa para quedar bien',
              isBest: false,
              climateDelta: -15,
              feedback:
                language === 'fr'
                  ? 'Rire encourage les moqueries et blesse encore plus Mateo.'
                  : language === 'en'
                  ? 'Laughing along makes bullying worse and hurts Mateo deeply.'
                  : 'Reírse de la burla la hace más grande y lastima mucho a Mateo.',
            },
          ],
        },
        {
          id: 'cb2',
          channel: language === 'fr' ? 'Salle de Jeu' : language === 'en' ? 'Game Lobby' : 'Sala de Juego',
          author: 'ProGamerX',
          message:
            language === 'fr'
              ? '"T’es nul, quitte le jeu pour toujours !"'
              : language === 'en'
              ? '"You are terrible, quit this game forever!"'
              : '"Eres malísimo, ¡salte del juego para siempre!"',
          actions: [
            {
              id: 'a1',
              label:
                language === 'fr'
                  ? 'Silencieux, bloquer le joueur et le signaler'
                  : language === 'en'
                  ? 'Do not argue: Mute, Block, and Report the player'
                  : 'No responder insultos: Silenciar, Bloquear y Reportar',
              isBest: true,
              climateDelta: 25,
              feedback:
                language === 'fr'
                  ? 'Parfait ! Bloquer et signaler protège ton plaisir de jouer.'
                  : language === 'en'
                  ? 'Perfect! Muting and reporting keeps gaming fun and respectful.'
                  : '¡Perfecto! Bloquear y reportar protege tu tranquilidad al jugar.',
            },
            {
              id: 'a2',
              label:
                language === 'fr'
                  ? 'L’insulter encore plus fort dans le chat'
                  : language === 'en'
                  ? 'Insult them back even louder in chat'
                  : 'Insultarlo más fuerte en el chat',
              isBest: false,
              climateDelta: -15,
              feedback:
                language === 'fr'
                  ? 'Répondre par des insultes peut te faire sanctionner aussi.'
                  : language === 'en'
                  ? 'Fighting back with insults can get your own account banned.'
                  : 'Responder con agresiones empeora el conflicto y pueden suspender tu cuenta.',
            },
          ],
        },
        {
          id: 'cb3',
          channel: language === 'fr' ? 'Groupe Classe' : language === 'en' ? 'Class Group' : 'Grupo del Salón',
          author: 'Sofia_Art',
          message:
            language === 'fr'
              ? '"Regardez cette photo gênante de Carla quand elle est tombée, partagez !"'
              : language === 'en'
              ? '"Look at this embarrassing photo of Carla falling down, share it!"'
              : '"Miren esta foto vergonzosa de Carla cuando se cayó, ¡compártanla!"',
          actions: [
            {
              id: 'a1',
              label:
                language === 'fr'
                  ? 'Ne pas partager, demander de supprimer et prévenir un professeur'
                  : language === 'en'
                  ? 'Refuse to share, ask to delete it, and notify a teacher/parent'
                  : 'No reenviarla, pedir que la borren y avisar a un adulto',
              isBest: true,
              climateDelta: 25,
              feedback:
                language === 'fr'
                  ? 'Exact ! Ne jamais diffuser une photo sans le consentement de la personne.'
                  : language === 'en'
                  ? 'Right! Never forward photos meant to humiliate someone.'
                  : '¡Exacto! Nunca reenvíes fotos que avergüencen a otra persona.',
            },
            {
              id: 'a2',
              label:
                language === 'fr'
                  ? 'La sauvegarder en secret pour plus tard'
                  : language === 'en'
                  ? 'Save it privately just in case'
                  : 'Guardarla en tu galería para reírte después',
              isBest: false,
              climateDelta: -10,
              feedback:
                language === 'fr'
                  ? 'Garder des images humiliantes contribue au problème.'
                  : language === 'en'
                  ? 'Keeping humiliating photos keeps the harm alive.'
                  : 'Guardar fotos humillantes también perpetúa el daño.',
            },
          ],
        },
      ],
      '11–12': [
        {
          id: 'cb1',
          channel: language === 'fr' ? 'Serveur Discord Classe' : language === 'en' ? 'Class Discord Server' : 'Grupo Escolar Discord',
          author: 'AnonTroll_7',
          message:
            language === 'fr'
              ? '"On crée un sondage pour élire la personne la plus bizarre de la classe ?"'
              : language === 'en'
              ? '"Let’s make a poll voting on the weirdest kid in our grade!"'
              : '"¿Hacemos una encuesta para votar por el más raro del grado?"',
          actions: [
            {
              id: 'a1',
              label:
                language === 'fr'
                  ? 'Prendre une capture d’écran, quitter/signaler et alerter parents/école'
                  : language === 'en'
                  ? 'Take a screenshot as evidence, speak up against it, and alert a trusted adult'
                  : 'Tomar captura como prueba, rechazar la encuesta y avisar a un adulto',
              isBest: true,
              climateDelta: 25,
              feedback:
                language === 'fr'
                  ? 'Excellent ! Garder des preuves sans participer protège toute la classe.'
                  : language === 'en'
                  ? 'Great! Saving evidence and stopping toxic polls protects everyone.'
                  : '¡Excelente! Guardar pruebas y frenar encuestas ofensivas protege a todo el curso.',
            },
            {
              id: 'a2',
              label:
                language === 'fr'
                  ? 'Voter pour quelqu’un que tu ne connais pas bien'
                  : language === 'en'
                  ? 'Vote silently so you stay out of trouble'
                  : 'Votar en silencio para no quedar fuera del grupo',
              isBest: false,
              climateDelta: -15,
              feedback:
                language === 'fr'
                  ? 'Participer même en silence valide le harcèlement.'
                  : language === 'en'
                  ? 'Even silent participation fuels cyberbullying.'
                  : 'Participar aunque sea en silencio valida y alimenta el ciberacoso.',
            },
          ],
        },
        {
          id: 'cb2',
          channel: language === 'fr' ? 'Commentaires Vidéo' : language === 'en' ? 'Video Comments' : 'Comentarios de Video',
          author: 'ShadowHater',
          message:
            language === 'fr'
              ? '"Je connais ton école, supprime ta vidéo sinon on va tous commenter dessus."'
              : language === 'en'
              ? '"I know your school, delete your post or we’ll spam hate everywhere."'
              : '"Sé a qué colegio vas, borra tu video o te llenamos de mensajes malos."',
          actions: [
            {
              id: 'a1',
              label:
                language === 'fr'
                  ? 'Capturer la menace, bloquer le compte, passer en privé et parler aux parents'
                  : language === 'en'
                  ? 'Screenshot the threat, block/report, lock privacy settings, and tell parents'
                  : 'Capturar la amenaza, bloquear/reportar, poner cuenta privada y avisar a padres',
              isBest: true,
              climateDelta: 25,
              feedback:
                language === 'fr'
                  ? 'Réaction pro ! Les menaces en ligne doivent toujours être signalées avec preuves.'
                  : language === 'en'
                  ? 'Pro response! Online threats must always be documented and reported to adults.'
                  : '¡Reacción profesional! Toda amenaza debe guardarse en captura y mostrarse a tus padres.',
            },
            {
              id: 'a2',
              label:
                language === 'fr'
                  ? 'Ignorer sans rien changer ni prévenir personne'
                  : language === 'en'
                  ? 'Ignore it and say nothing to your parents'
                  : 'Ocultárselo a tus padres por miedo a que te quiten el celular',
              isBest: false,
              climateDelta: -15,
              feedback:
                language === 'fr'
                  ? 'Tu ne seras pas puni pour avoir subi des menaces. Parle-en toujours !'
                  : language === 'en'
                  ? 'You are never in trouble for reporting threats. Parents are there to protect you.'
                  : 'No te castigarán por pedir ayuda ante una amenaza. ¡Habla siempre con confianza!',
            },
          ],
        },
        {
          id: 'cb3',
          channel: language === 'fr' ? 'Chat Privé' : language === 'en' ? 'Direct Message' : 'Mensaje Directo',
          author: 'Dani_9',
          message:
            language === 'fr'
              ? '"Hey, tout le monde m’exclut du groupe aujourd’hui, je me sens super triste..."'
              : language === 'en'
              ? '"Hey, everyone kicked me out of the group chat today, I feel awful..."'
              : '"Hola, hoy todos me sacaron del grupo de WhatsApp y me siento muy mal..."',
          actions: [
            {
              id: 'a1',
              label:
                language === 'fr'
                  ? 'Lui écrire avec bienveillance, l’écouter et l’aider à en parler à un adulte'
                  : language === 'en'
                  ? 'Reply kindly, check in on them, and encourage talking to a counselor/parent'
                  : 'Escucharle con empatía, acompañarle y animarle a hablar con un adulto',
              isBest: true,
              climateDelta: 25,
              feedback:
                language === 'fr'
                  ? 'L’empathie numérique fait toute la différence pour quelqu’un d’isolé !'
                  : language === 'en'
                  ? 'Digital empathy makes a huge difference when someone feels excluded!'
                  : '¡La empatía digital cambia el día por completo cuando alguien se siente excluido!',
            },
            {
              id: 'a2',
              label:
                language === 'fr'
                  ? 'Laisser en "vu" pour éviter les histoires'
                  : language === 'en'
                  ? 'Leave them on read so you don’t get involved'
                  : 'Dejarle en visto para no meterte en problemas',
              isBest: false,
              climateDelta: -10,
              feedback:
                language === 'fr'
                  ? 'Un simple message gentil peut rassurer énormément ton ami.'
                  : language === 'en'
                  ? 'Even one supportive message helps someone feel less alone.'
                  : 'Un simple mensaje de apoyo ayuda muchísimo a que no se sienta solo.',
            },
          ],
        },
      ],
      '13–14': [
        {
          id: 'cb1',
          channel: language === 'fr' ? 'Groupe Rumeurs' : language === 'en' ? 'Viral Rumor Feed' : 'Feed de Rumores',
          author: 'Gossip_Account_26',
          message:
            language === 'fr'
              ? '"Quelqu’un a fait un montage IA gênant d’une élève de 4e, partagez avant suppression !"'
              : language === 'en'
              ? '"Someone made an AI fake edit of a classmate, share before it gets deleted!"'
              : '"Alguien creó un meme falso con IA de una compañera, ¡compartan antes que lo borren!"',
          actions: [
            {
              id: 'a1',
              label:
                language === 'fr'
                  ? 'Signaler immédiatement le compte, ne pas rediffuser et alerter l’école'
                  : language === 'en'
                  ? 'Report the impersonation/harassment immediately, never share, and notify school/parents'
                  : 'Reportar el contenido de inmediato, cortar la cadena y alertar al colegio/padres',
              isBest: true,
              climateDelta: 25,
              feedback:
                language === 'fr'
                  ? 'Exact ! Diffuser un montage IA malveillant est une forme grave de cyberharcèlement.'
                  : language === 'en'
                  ? 'Right! Sharing malicious AI edits is serious cyberbullying and harms real people.'
                  : '¡Exacto! Difundir montajes con IA para dañar a alguien es ciberacoso grave.',
            },
            {
              id: 'a2',
              label:
                language === 'fr'
                  ? 'L’envoyer seulement à deux amis pour leur montrer'
                  : language === 'en'
                  ? 'Forward it privately to just 2 friends to ask if it’s real'
                  : 'Reenviarlo solo a 2 amigos en privado para preguntar si es real',
              isBest: false,
              climateDelta: -15,
              feedback:
                language === 'fr'
                  ? 'Même en message privé, tu amplifies la diffusion.'
                  : language === 'en'
                  ? 'Even private forwarding spreads the harmful image further.'
                  : 'Incluso en privado, reenviarlo multiplica el daño y la difusión.',
            },
          ],
        },
        {
          id: 'cb2',
          channel: language === 'fr' ? 'Conflit Écrit' : language === 'en' ? 'Heated Group Thread' : 'Debate Tenso en Chat',
          author: 'Alex_T',
          message:
            language === 'fr'
              ? '"TU AS TOUT GÂCHÉ DANS LE PROJET, NE ME PARLE PLUS JAMAIS."'
              : language === 'en'
              ? '"YOU RUINED THE ENTIRE PROJECT, DON’T TALK TO ME AGAIN."'
              : '"ARRUINASTE TODO EL PROYECTO, NO ME VUELVAS A HABLAR."',
          actions: [
            {
              id: 'a1',
              label:
                language === 'fr'
                  ? 'Proposer de faire une pause et d’en parler calmement en personne demain'
                  : language === 'en'
                  ? 'De-escalate calmly and suggest talking in person once everyone cools down'
                  : 'Desescalar con calma y proponer hablar en persona mañana con tranquilidad',
              isBest: true,
              climateDelta: 20,
              feedback:
                language === 'fr'
                  ? 'Excellent ! Les écrans amplifient la colère ; parler de vive voix apaise les tensions.'
                  : language === 'en'
                  ? 'Smart! Text lacks tone and escalates anger—stepping away cools conflict.'
                  : '¡Inteligente! El chat amplifica la rabia y no transmite tono; pausar evita peleas.',
            },
            {
              id: 'a2',
              label:
                language === 'fr'
                  ? 'Écrire un long message rageux en MAJUSCULES en public'
                  : language === 'en'
                  ? 'Send a long angry ALL-CAPS rant back in the group'
                  : 'Responder con un párrafo furioso en MAYÚSCULAS frente a todos',
              isBest: false,
              climateDelta: -15,
              feedback:
                language === 'fr'
                  ? 'Répondre à chaud crée des captures d’écran permanentes que tu regretteras.'
                  : language === 'en'
                  ? 'Escalating in group chat leaves permanent screenshots you may regret.'
                  : 'Pelear en un chat grupal deja capturas permanentes que luego pesan.',
            },
          ],
        },
        {
          id: 'cb3',
          channel: language === 'fr' ? 'Doxxing / Fuite de données' : language === 'en' ? 'Doxxing Alert' : 'Alerta de Doxxing',
          author: 'ToxicUser_44',
          message:
            language === 'fr'
              ? '"Voici le vrai numéro de téléphone et l’adresse de Lucas !"'
              : language === 'en'
              ? '"Here is Lucas’s real phone number and home address—spam him!"'
              : '"¡Aquí está el teléfono real y la dirección de Lucas para que le escriban!"',
          actions: [
            {
              id: 'a1',
              label:
                language === 'fr'
                  ? 'Capturer l’URL/le message, signaler pour doxxing et prévenir parents & plateforme'
                  : language === 'en'
                  ? 'Capture evidence, report immediately for doxxing, and alert adults/moderators'
                  : 'Guardar captura con fecha, reportar por doxxing y avisar a padres/moderadores',
              isBest: true,
              climateDelta: 25,
              feedback:
                language === 'fr'
                  ? 'Réponse indispensable ! Le doxxing est une atteinte grave à la sécurité physique.'
                  : language === 'en'
                  ? 'Crucial response! Doxxing violates platform rules and physical safety.'
                  : '¡Acción vital! Publicar datos privados de otros (doxxing) es una falta grave.',
            },
            {
              id: 'a2',
              label:
                language === 'fr'
                  ? 'Publier les infos du harceleur en vengeance'
                  : language === 'en'
                  ? 'Leak the bully’s personal info as payback'
                  : 'Publicar los datos del agresor como venganza',
              isBest: false,
              climateDelta: -20,
              feedback:
                language === 'fr'
                  ? 'Se venger par doxxing est aussi grave et illégal.'
                  : language === 'en'
                  ? 'Retaliating with doxxing puts you in the exact same wrong.'
                  : 'Responder con doxxing es igual de peligroso e inaceptable.',
            },
          ],
        },
      ],
    };

    const labels = {
      es: {
        title: 'Escudo Anti-Ciberacoso',
        subtitle: 'Protege la convivencia y frena agresiones digitales',
        climateLabel: 'Clima de Convivencia',
        nextBtn: 'Siguiente Caso',
        takeaway:
          'Frente al ciberacoso: nunca respondas con insultos, no reenvíes burlas, guarda capturas como prueba, bloquea/reporta y avisa siempre a un adulto de confianza.',
      },
      fr: {
        title: 'Bouclier Anti-Cyberharcèlement',
        subtitle: 'Protège le respect et agis en témoin solidaire',
        climateLabel: 'Climat du Groupe',
        nextBtn: 'Cas Suivant',
        takeaway:
          'Face au cyberharcèlement : ne réponds pas par la haine, ne relaie jamais de moqueries, garde des captures d’écran, bloque/signale et préviens un adulte.',
      },
      en: {
        title: 'Cyber-Respect Moderator',
        subtitle: 'Protect digital well-being and act as an upstander',
        climateLabel: 'Community Health',
        nextBtn: 'Next Case',
        takeaway:
          'When facing cyberbullying: never retaliate, never forward cruel content, save screenshot evidence, mute/block/report, and always loop in a trusted adult.',
      },
    }[language];

    return { cases: casesByAge[ageGroup], labels };
  }, [ageGroup, language]);

  const [idx, setIdx] = useState(0);
  const [selectedAction, setSelectedAction] = useState<ModerationAction | null>(null);
  const [climate, setClimate] = useState(60);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(1);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = copy.cases[idx];

  const handleAction = (act: ModerationAction) => {
    if (selectedAction) return;
    setSelectedAction(act);
    setClimate((c) => Math.max(10, Math.min(100, c + act.climateDelta)));

    if (act.isBest) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setMaxStreak((m) => Math.max(m, nextStreak));
      setCorrectCount((c) => c + 1);
      setScore((s) => s + 110 + nextStreak * 25);
      playGameSound(nextStreak > 1 ? 'combo' : 'correct');
    } else {
      setStreak(0);
      playGameSound('wrong');
    }
  };

  const handleNext = () => {
    if (idx < copy.cases.length - 1) {
      setIdx((i) => i + 1);
      setSelectedAction(null);
    } else {
      playGameSound('win');
      setFinished(true);
    }
  };

  const handleReplay = () => {
    setIdx(0);
    setSelectedAction(null);
    setClimate(60);
    setScore(0);
    setStreak(0);
    setMaxStreak(1);
    setCorrectCount(0);
    setFinished(false);
  };

  const answered = idx + (selectedAction ? 1 : 0);
  const accuracy = answered > 0 ? Math.round((correctCount / answered) * 100) : 100;

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

  return (
    <div className="flex-1 min-h-0 w-full flex flex-col p-4 sm:p-6 bg-slate-50 text-slate-800 overflow-y-auto overflow-x-hidden scrollbar-none space-y-4 pb-8">
      <GameHud
        title={copy.labels.title}
        subtitle={copy.labels.subtitle}
        icon={<HeartHandshake className="w-5 h-5" />}
        accentColor="indigo"
        ageGroup={ageGroup}
        currentStep={idx + 1}
        totalSteps={copy.cases.length}
        score={score}
        streak={streak}
        accuracy={answered > 0 ? accuracy : undefined}
      />

      {/* Community Health Meter */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-2xs space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-600 flex items-center gap-1.5">
            <MessageCircleHeart className="w-4 h-4 text-indigo-600" />
            <span>{copy.labels.climateLabel}</span>
          </span>
          <span className="font-black text-indigo-700 tabular-nums">{climate}%</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              climate >= 70 ? 'bg-emerald-500' : climate >= 45 ? 'bg-amber-500' : 'bg-rose-500'
            }`}
            style={{ width: `${climate}%` }}
          />
        </div>
      </div>

      {/* Live Feed Card */}
      <motion.div
        key={current.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span>{current.channel}</span>
          <span className="flex items-center gap-1 text-rose-600">
            <Flag className="w-3.5 h-3.5" />
            <span>{current.author}</span>
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 text-white text-sm sm:text-base font-bold leading-relaxed">
          {current.message}
        </div>

        <div className="space-y-2.5">
          {current.actions.map((act) => {
            const isChosen = selectedAction?.id === act.id;
            const showState = !!selectedAction;
            return (
              <button
                key={act.id}
                type="button"
                disabled={!!selectedAction}
                onClick={() => handleAction(act)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between gap-3 active:scale-[0.98] ${
                  showState
                    ? act.isBest
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                      : isChosen
                      ? 'bg-rose-50 border-rose-400 text-rose-950'
                      : 'bg-slate-50 border-slate-200 opacity-70'
                    : 'bg-slate-50 hover:bg-indigo-50/70 border-slate-200 hover:border-indigo-300 text-slate-800'
                }`}
              >
                <span className="text-xs sm:text-sm font-bold leading-snug">{act.label}</span>
                {showState && (isChosen || act.isBest) && (
                  <div className="shrink-0">
                    {act.isBest ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-600" />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {selectedAction && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-start gap-2.5 ${
              selectedAction.isBest
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}
          >
            <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="font-medium leading-relaxed">{selectedAction.feedback}</p>
          </motion.div>
        )}
      </motion.div>

      {selectedAction && (
        <button
          type="button"
          onClick={handleNext}
          className="w-full py-4 rounded-2xl font-black text-sm sm:text-base bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition"
        >
          <span>{copy.labels.nextBtn}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
