import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, AlertTriangle, ShieldCheck, CheckCircle2, ChevronRight, ExternalLink, Flag, Info, Search } from 'lucide-react';
import { CiberMascot } from '../CiberMascot';
import { useLanguage } from '../../i18n/LanguageContext';
import { ChildAgeGroup } from '../../types';

interface EmailItem {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  preview: string;
  date: string;
  isPhishing: boolean;
  clues: string[];
  explanation: string;
  fullBody: string;
}

interface PhishingInboxGameProps {
  onComplete: () => void;
  ageGroup?: ChildAgeGroup;
}

export const PhishingInboxGame: React.FC<PhishingInboxGameProps> = ({ onComplete, ageGroup = '8–10' }) => {
  const { language } = useLanguage();

  const loc = {
    es: {
      tag: 'Mecánica 4 / Mundo 3',
      title: 'Bandeja de Entrada Phishing',
      reviewedBadge: (count: number) => `${count}/5 revisados`,
      mascot: 'Ciber dice: "Revisa siempre la dirección de correo exacta, las faltas de ortografía y las promesas de premios imposibles."',
      selectPrompt: 'Selecciona un correo para investigarlo:',
      safeBadge: 'Seguro',
      trapBadge: 'Trampa',
      fromLabel: 'De:',
      cluesTitle: 'Pistas del detective:',
      safeBtn: 'Es Correo Seguro',
      phishBtn: '¡Es Phishing / Trampa!',
      correctPrefix: '¡Acertaste!',
      wrongPrefix: '¡Ojo! Observa con más calma:',
      completeBtn: '¡Completar Inspección de Phishing!',
      needMoreBtn: (count: number) => `Analiza al menos 3 correos (${count}/3)`,
      emails: [
        {
          id: 'em-1',
          senderName: 'Soporte Roblox Oficial',
          senderEmail: 'soporte@robl0x-premios-gratis.net',
          subject: '¡URGENTE! Has ganado 50,000 Robux gratis',
          preview: 'Reclama tus monedas antes de que expiren en 15 minutos...',
          date: '10:42 AM',
          isPhishing: true,
          clues: [
            'Remitente falso: robl0x con un "cero" en lugar de letra "o"',
            'Falsa urgencia: "expiran en 15 minutos"',
            'Nadie regala 50,000 Robux sin motivo',
          ],
          explanation: 'Las plataformas oficiales nunca usan dominios como "robl0x-premios-gratis.net" ni regalan monedas por sorpresa.',
          fullBody: '¡Felicidades jugador! Has sido seleccionado al azar para recibir 50,000 Robux. Haz clic en el siguiente enlace e ingresa tu usuario y contraseña de inmediato para desbloquear el premio.',
        },
        {
          id: 'em-2',
          senderName: 'Colegio San Patricio',
          senderEmail: 'notificaciones@colegiosanpatricio.edu',
          subject: 'Circular escolar: Horarios de exámenes de mayo',
          preview: 'Estimados alumnos y familias, adjuntamos el calendario oficial...',
          date: 'Ayer',
          isPhishing: false,
          clues: ['Dominio oficial .edu', 'Tono formal sin pedidos de claves', 'No contiene enlaces urgentes ni premios'],
          explanation: 'Este es un correo escolar genuino. El dominio es oficial y no te solicita contraseñas ni datos personales.',
          fullBody: 'Estimados alumnos: les recordamos que el calendario de evaluaciones trimestrales se encuentra disponible en la cartelera del colegio y en el portal estudiantil.',
        },
        {
          id: 'em-3',
          senderName: 'Equipo de Seguridad Fortnite',
          senderEmail: 'security-epicgames@alerta-cuentas-bloqueo.com',
          subject: '¡Tu cuenta será BORRADA en 2 horas por actividad sospechosa!',
          preview: 'Haz clic aquí para verificar tu identidad o perderás todas tus skins...',
          date: 'Lunes',
          isPhishing: true,
          clues: [
            'Amenaza de borrado de cuenta en tiempo límite',
            'Dirección de correo falsa ("alerta-cuentas-bloqueo.com")',
            'Usa el miedo para que actúes sin pensar',
          ],
          explanation: 'Los atacantes usan amenazas para que te asustes y pongas tu clave sin verificar el remitente.',
          fullBody: 'ADVERTENCIA CRÍTICA: Hemos detectado inicio de sesión sospechoso. Tienes 120 minutos para ingresar tu correo y contraseña o tu inventario será permanentemente eliminado.',
        },
        {
          id: 'em-4',
          senderName: 'Biblioteca Municipal',
          senderEmail: 'prestamos@bibliotecaciudad.org',
          subject: 'Recordatorio de devolución: El Principito',
          preview: 'Hola Lucas, tu préstamo vence el próximo viernes 20...',
          date: '28 Abr',
          isPhishing: false,
          clues: ['Remitente institucional .org', 'No solicita contraseñas', 'Información coherente'],
          explanation: 'Es un simple recordatorio de biblioteca sin enlaces fraudulentos.',
          fullBody: 'Hola Lucas: te recordamos que tienes prestado el libro "El Principito". Puedes devolverlo en mesa de entrada antes del viernes 20 de mayo.',
        },
        {
          id: 'em-5',
          senderName: 'Nintendo Rewards',
          senderEmail: 'premios@switch-sorteo-ganadores.xyz',
          subject: '¡Ganaste una Nintendo Switch OLED en el sorteo veraniego!',
          preview: 'Ingresa tu dirección y número de tarjeta para pagar solo el envío de $2...',
          date: '25 Abr',
          isPhishing: true,
          clues: [
            'Extensión sospechosa ".xyz"',
            'Piden pagar "solo el envío con tarjeta de crédito"',
            'No participaste en ningún sorteo',
          ],
          explanation: 'Los falsos sorteos piden datos de tarjetas de crédito prometiendo regalos costosos.',
          fullBody: '¡Ganador confirmado! Tu boleto digital resultó premiado con una consola Nintendo Switch. Para recibirla en tu puerta, solo debes cubrir $2 de gastos de envío ingresando una tarjeta de crédito.',
        },
      ],
    },
    fr: {
      tag: 'Mécanique 4 / Monde 3',
      title: 'Boîte de Réception Hameçonnage',
      reviewedBadge: (count: number) => `${count}/5 vérifiés`,
      mascot: 'Ciber dit : "Vérifie toujours l’adresse exacte de l’expéditeur, l’orthographe et les promesses de cadeaux impossibles."',
      selectPrompt: 'Choisis un e-mail pour l’inspecter :',
      safeBadge: 'Sûr',
      trapBadge: 'Piège',
      fromLabel: 'De :',
      cluesTitle: 'Indices du détective :',
      safeBtn: 'E-mail Sûr',
      phishBtn: 'C’est du Phishing / Piège !',
      correctPrefix: 'Bien vu !',
      wrongPrefix: 'Attention ! Regarde de plus près :',
      completeBtn: 'Terminer l’inspection Phishing !',
      needMoreBtn: (count: number) => `Analyse au moins 3 e-mails (${count}/3)`,
      emails: [
        {
          id: 'em-1',
          senderName: 'Support Roblox Officiel',
          senderEmail: 'support@robl0x-cadeaux-gratuits.net',
          subject: 'URGENT ! Tu as gagné 50 000 Robux gratuits',
          preview: 'Récupère tes pièces avant expiration dans 15 minutes...',
          date: '10:42',
          isPhishing: true,
          clues: [
            'Faux expéditeur : robl0x avec un "zéro" au lieu de la lettre "o"',
            'Fausse urgence : "expire dans 15 minutes"',
            'Personne n’offre 50 000 Robux sans raison',
          ],
          explanation: 'Les plateformes officielles n’utilisent jamais de domaines bizarres et n’offrent pas de pièces par surprise.',
          fullBody: 'Félicitations joueur ! Tu as été tiré au sort pour recevoir 50 000 Robux. Clique sur le lien ci-dessous et entre ton mot de passe immédiatement.',
        },
        {
          id: 'em-2',
          senderName: 'Collège Saint-Patrick',
          senderEmail: 'notifications@collegesaintpatrick.edu',
          subject: 'Circulaire scolaire : Horaires des examens de mai',
          preview: 'Chers élèves et familles, voici le calendrier officiel...',
          date: 'Hier',
          isPhishing: false,
          clues: ['Domaine officiel .edu', 'Ton courtois sans demande de mot de passe', 'Aucun lien louche'],
          explanation: 'E-mail scolaire authentique. Le domaine est officiel et ne te demande jamais tes identifiants.',
          fullBody: 'Chers élèves : nous vous rappelons que le calendrier des épreuves trimestrielles est disponible sur le panneau d’affichage et l’ENT.',
        },
        {
          id: 'em-3',
          senderName: 'Sécurité Fortnite',
          senderEmail: 'security-epicgames@alerte-blocage-comptes.com',
          subject: 'Ton compte sera SUPPRIMÉ dans 2 heures !',
          preview: 'Clique ici pour vérifier ton identité ou perds tes skins...',
          date: 'Lundi',
          isPhishing: true,
          clues: [
            'Menace de suppression avec compte à rebours',
            'Adresse fausse ("alerte-blocage-comptes.com")',
            'Joue sur la panique pour faire cliquer sans réfléchir',
          ],
          explanation: 'Les pirates créent la panique pour que tu donnes tes accès sans contrôler l’expéditeur.',
          fullBody: 'AVERTISSEMENT CRITIQUE : Connexion suspecte détectée. Tu as 120 minutes pour renseigner ton mot de passe sinon tout ton inventaire sera effacé.',
        },
        {
          id: 'em-4',
          senderName: 'Médiathèque Municipale',
          senderEmail: 'prets@mediatheque-ville.org',
          subject: 'Rappel de retour : Le Petit Prince',
          preview: 'Bonjour Lucas, ton prêt se termine le vendredi 20...',
          date: '28 Avr',
          isPhishing: false,
          clues: ['Expéditeur en .org', 'Ne demande aucun mot de passe', 'Message cohérent'],
          explanation: 'Simple rappel de bibliothèque scolaire, tout à fait sûr et normal.',
          fullBody: 'Bonjour Lucas : nous te rappelons que tu as emprunté le livre "Le Petit Prince". Merci de le rapporter à l’accueil avant le 20 mai.',
        },
        {
          id: 'em-5',
          senderName: 'Nintendo Rewards',
          senderEmail: 'gagnants@switch-tirage-ete.xyz',
          subject: 'Tu as gagné une Nintendo Switch OLED !',
          preview: 'Renseigne ton adresse et carte bancaire pour les 2€ de port...',
          date: '25 Avr',
          isPhishing: true,
          clues: [
            'Extension suspecte ".xyz"',
            'Demande de carte bancaire pour payer les frais',
            'Tu n’as participé à aucun tirage au sort',
          ],
          explanation: 'Les faux concours réclament des coordonnées bancaires sous prétexte de livrer un faux cadeau.',
          fullBody: 'Gagnant confirmé ! Ton ticket a remporté une console Switch. Pour la recevoir, règle simplement 2€ de frais d’expédition en saisissant ta carte.',
        },
      ],
    },
    en: {
      tag: 'Mechanic 4 / World 3',
      title: 'Phishing Inbox Inspector',
      reviewedBadge: (count: number) => `${count}/5 reviewed`,
      mascot: 'Ciber says: "Always inspect the sender address character-by-character, spot spelling flaws, and question impossible prizes."',
      selectPrompt: 'Select an email to inspect it:',
      safeBadge: 'Safe',
      trapBadge: 'Trap',
      fromLabel: 'From:',
      cluesTitle: 'Detective clues:',
      safeBtn: 'This is Safe Email',
      phishBtn: 'It’s Phishing / Scam!',
      correctPrefix: 'Spot on!',
      wrongPrefix: 'Look closer:',
      completeBtn: 'Complete Phishing Inspection!',
      needMoreBtn: (count: number) => `Analyze at least 3 emails (${count}/3)`,
      emails: [
        {
          id: 'em-1',
          senderName: 'Roblox Official Support',
          senderEmail: 'support@robl0x-free-prizes.net',
          subject: 'URGENT! You won 50,000 free Robux',
          preview: 'Claim your coins before they expire in 15 minutes...',
          date: '10:42 AM',
          isPhishing: true,
          clues: [
            'Misspelled sender: robl0x with a zero "0" instead of "o"',
            'Fake urgency: "expires in 15 minutes"',
            'Nobody hands out 50,000 Robux for free',
          ],
          explanation: 'Official platforms never use domains like "robl0x-free-prizes.net" or give out free currency out of nowhere.',
          fullBody: 'Congratulations gamer! You were randomly picked for 50,000 Robux. Click the link below and enter your password right away to unlock the prize.',
        },
        {
          id: 'em-2',
          senderName: 'St. Patrick School',
          senderEmail: 'notifications@stpatrickschool.edu',
          subject: 'School notice: May exam timetable',
          preview: 'Dear students and families, please find the schedule attached...',
          date: 'Yesterday',
          isPhishing: false,
          clues: ['Official .edu domain', 'Formal polite tone without password prompts', 'No urgent suspicious links'],
          explanation: 'This is a genuine school message. The domain is official and never asks for your credentials.',
          fullBody: 'Dear students: please note the term evaluation timetable is posted on the school board and student portal.',
        },
        {
          id: 'em-3',
          senderName: 'Fortnite Security Team',
          senderEmail: 'security-epicgames@alert-account-suspension.com',
          subject: 'Your account will be DELETED in 2 hours for suspicious activity!',
          preview: 'Click here to verify identity or lose all your skins...',
          date: 'Monday',
          isPhishing: true,
          clues: [
            'Countdown threat to delete your account',
            'Fake email address ("alert-account-suspension.com")',
            'Uses fear so you panic and don’t check the source',
          ],
          explanation: 'Attackers create panic so you type in your login credentials without checking the sender.',
          fullBody: 'CRITICAL ALERT: Suspicious login detected. You have 120 minutes to sign in or your inventory will be wiped forever.',
        },
        {
          id: 'em-4',
          senderName: 'City Public Library',
          senderEmail: 'loans@citylibrary.org',
          subject: 'Return reminder: The Little Prince',
          preview: 'Hi Lucas, your book loan is due on Friday 20th...',
          date: 'Apr 28',
          isPhishing: false,
          clues: ['Official .org domain', 'Does not request any passwords', 'Consistent everyday information'],
          explanation: 'A normal library reminder with no malicious links.',
          fullBody: 'Hi Lucas: please remember to return "The Little Prince" before Friday May 20th at the front desk.',
        },
        {
          id: 'em-5',
          senderName: 'Nintendo Rewards',
          senderEmail: 'prizes@switch-summer-sweepstakes.xyz',
          subject: 'You won a Nintendo Switch OLED in our summer draw!',
          preview: 'Enter your address and card details to pay $2 shipping...',
          date: 'Apr 25',
          isPhishing: true,
          clues: [
            'Suspicious ".xyz" top-level domain',
            'Asks for credit card details for "small shipping fee"',
            'You never signed up for any raffle',
          ],
          explanation: 'Fake sweepstakes ask for credit cards by promising high-value gaming consoles.',
          fullBody: 'Confirmed winner! Your ticket was drawn for a Nintendo Switch. To receive it, cover $2 shipping fees by entering your credit card.',
        },
      ],
    },
  }[language] || {
    tag: 'Mecánica 4 / Mundo 3',
    title: 'Bandeja de Entrada Phishing',
    reviewedBadge: (count: number) => `${count}/5 revisados`,
    mascot: 'Ciber dice: "Revisa siempre la dirección de correo exacta, las faltas de ortografía y las promesas de premios imposibles."',
    selectPrompt: 'Selecciona un correo para investigarlo:',
    safeBadge: 'Seguro',
    trapBadge: 'Trampa',
    fromLabel: 'De:',
    cluesTitle: 'Pistas del detective:',
    safeBtn: 'Es Correo Seguro',
    phishBtn: '¡Es Phishing / Trampa!',
    correctPrefix: '¡Acertaste!',
    wrongPrefix: '¡Ojo! Observa con más calma:',
    completeBtn: '¡Completar Inspección de Phishing!',
    needMoreBtn: (count: number) => `Analiza al menos 3 correos (${count}/3)`,
    emails: [
      {
        id: 'em-1',
        senderName: 'Soporte Roblox Oficial',
        senderEmail: 'soporte@robl0x-premios-gratis.net',
        subject: '¡URGENTE! Has ganado 50,000 Robux gratis',
        preview: 'Reclama tus monedas antes de que expiren en 15 minutos...',
        date: '10:42 AM',
        isPhishing: true,
        clues: [
          'Remitente falso: robl0x con un "cero" en lugar de letra "o"',
          'Falsa urgencia: "expiran en 15 minutos"',
          'Nadie regala 50,000 Robux sin motivo',
        ],
        explanation: 'Las plataformas oficiales nunca usan dominios como "robl0x-premios-gratis.net" ni regalan monedas por sorpresa.',
        fullBody: '¡Felicidades jugador! Has sido seleccionado al azar para recibir 50,000 Robux. Haz clic en el siguiente enlace e ingresa tu usuario y contraseña de inmediato para desbloquear el premio.',
      },
      {
        id: 'em-2',
        senderName: 'Colegio San Patricio',
        senderEmail: 'notificaciones@colegiosanpatricio.edu',
        subject: 'Circular escolar: Horarios de exámenes de mayo',
        preview: 'Estimados alumnos y familias, adjuntamos el calendario oficial...',
        date: 'Ayer',
        isPhishing: false,
        clues: ['Dominio oficial .edu', 'Tono formal sin pedidos de claves', 'No contiene enlaces urgentes ni premios'],
        explanation: 'Este es un correo escolar genuino. El dominio es oficial y no te solicita contraseñas ni datos personales.',
        fullBody: 'Estimados alumnos: les recordamos que el calendario de evaluaciones trimestrales se encuentra disponible en la cartelera del colegio y en el portal estudiantil.',
      },
      {
        id: 'em-3',
        senderName: 'Equipo de Seguridad Fortnite',
        senderEmail: 'security-epicgames@alerta-cuentas-bloqueo.com',
        subject: '¡Tu cuenta será BORRADA en 2 horas por actividad sospechosa!',
        preview: 'Haz clic aquí para verificar tu identidad o perderás todas tus skins...',
        date: 'Lunes',
        isPhishing: true,
        clues: [
          'Amenaza de borrado de cuenta en tiempo límite',
          'Dirección de correo falsa ("alerta-cuentas-bloqueo.com")',
          'Usa el miedo para que actúes sin pensar',
        ],
        explanation: 'Los atacantes usan amenazas para que te asustes y pongas tu clave sin verificar el remitente.',
        fullBody: 'ADVERTENCIA CRÍTICA: Hemos detectado inicio de sesión sospechoso. Tienes 120 minutos para ingresar tu correo y contraseña o tu inventario será permanentemente eliminado.',
      },
      {
        id: 'em-4',
        senderName: 'Biblioteca Municipal',
        senderEmail: 'prestamos@bibliotecaciudad.org',
        subject: 'Recordatorio de devolución: El Principito',
        preview: 'Hola Lucas, tu préstamo vence el próximo viernes 20...',
        date: '28 Abr',
        isPhishing: false,
        clues: ['Remitente institucional .org', 'No solicita contraseñas', 'Información coherente'],
        explanation: 'Es un simple recordatorio de biblioteca sin enlaces fraudulentos.',
        fullBody: 'Hola Lucas: te recordamos que tienes prestado el libro "El Principito". Puedes devolverlo en mesa de entrada antes del viernes 20 de mayo.',
      },
      {
        id: 'em-5',
        senderName: 'Nintendo Rewards',
        senderEmail: 'premios@switch-sorteo-ganadores.xyz',
        subject: '¡Ganaste una Nintendo Switch OLED en el sorteo veraniego!',
        preview: 'Ingresa tu dirección y número de tarjeta para pagar solo el envío de $2...',
        date: '25 Abr',
        isPhishing: true,
        clues: [
          'Extensión sospechosa ".xyz"',
          'Piden pagar "solo el envío con tarjeta de crédito"',
          'No participaste en ningún sorteo',
        ],
        explanation: 'Los falsos sorteos piden datos de tarjetas de crédito prometiendo regalos costosos.',
        fullBody: '¡Ganador confirmado! Tu boleto digital resultó premiado con una consola Nintendo Switch. Para recibirla en tu puerta, solo debes cubrir $2 de gastos de envío ingresando una tarjeta de crédito.',
      },
    ],
  };

  const [selectedEmail, setSelectedEmail] = useState<EmailItem>(loc.emails[0]);
  const [analyzedEmails, setAnalyzedEmails] = useState<Record<string, 'safe' | 'phishing'>>({});
  const [feedback, setFeedback] = useState<string | null>(null);

  // Keep selected email synced if language changes
  const activeEmail = loc.emails.find((e) => e.id === selectedEmail.id) || loc.emails[0];

  const handleVote = (verdict: 'safe' | 'phishing') => {
    const isCorrect = (verdict === 'phishing' && activeEmail.isPhishing) || (verdict === 'safe' && !activeEmail.isPhishing);

    setAnalyzedEmails((prev) => ({ ...prev, [activeEmail.id]: verdict }));
    setFeedback(
      isCorrect
        ? `${loc.correctPrefix} ${activeEmail.explanation}`
        : `${loc.wrongPrefix} ${activeEmail.explanation}`
    );
  };

  const completedCount = Object.keys(analyzedEmails).length;
  const allReviewed = completedCount >= 3;

  return (
    <div className="flex-1 flex flex-col p-4 bg-slate-50 text-slate-800 select-none overflow-y-auto space-y-4">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-extrabold text-amber-600 tracking-wider">
              {loc.tag}
            </div>
            <h2 className="text-sm font-black text-slate-900">{loc.title}</h2>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-amber-50 text-amber-700">
          <Search className="w-3.5 h-3.5" />
          <span>{loc.reviewedBadge(completedCount)}</span>
        </div>
      </div>

      {/* Mascot Advice */}
      <div className="flex items-center gap-3 p-3 bg-amber-50/80 rounded-2xl border border-amber-100">
        <CiberMascot size="sm" expression="thinking" />
        <div className="text-xs text-amber-900 leading-snug">
          {loc.mascot}
        </div>
      </div>

      {/* Email Selector Carousel / List */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-500">{loc.selectPrompt}</div>
        <div className="grid grid-cols-1 gap-2">
          {loc.emails.map((email) => {
            const status = analyzedEmails[email.id];
            const isSelected = activeEmail.id === email.id;

            return (
              <button
                key={email.id}
                onClick={() => {
                  setSelectedEmail(email);
                  setFeedback(null);
                }}
                className={`p-3 rounded-2xl text-left border transition cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-amber-50/60 border-amber-400 ring-2 ring-amber-300'
                    : 'bg-white border-slate-100 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      status === 'phishing'
                        ? 'bg-rose-100 text-rose-600'
                        : status === 'safe'
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {email.senderName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {email.date}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 truncate">{email.subject}</div>
                  </div>
                </div>

                {status && (
                  <span
                    className={`shrink-0 ml-2 px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      status === 'phishing'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {status === 'phishing' ? loc.trapBadge : loc.safeBadge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Email Detailed Inspector */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 space-y-3">
        <div className="border-b border-slate-100 pb-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">{activeEmail.senderName}</span>
            <span className="text-[10px] text-slate-400 font-mono">{activeEmail.date}</span>
          </div>
          {/* Detailed sender address */}
          <div className="text-[11px] font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded-lg mt-1 break-all">
            {loc.fromLabel} <strong className="text-slate-800">{activeEmail.senderEmail}</strong>
          </div>
          <h3 className="text-sm font-black text-slate-900 mt-2">{activeEmail.subject}</h3>
        </div>

        {/* Body content */}
        <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
          {activeEmail.fullBody}
        </p>

        {/* Detective Clues */}
        <div className="space-y-1.5 pt-1">
          <div className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
            <Search className="w-3.5 h-3.5 text-amber-500" />
            <span>{loc.cluesTitle}</span>
          </div>
          <ul className="space-y-1">
            {activeEmail.clues.map((clue, idx) => (
              <li key={idx} className="text-[11px] text-slate-600 flex items-start gap-1.5">
                <span className="text-amber-500 font-bold">•</span>
                <span>{clue}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Feedback block */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-sky-50 border border-sky-200 rounded-2xl text-xs text-sky-900 flex items-start gap-2"
            >
              <CiberMascot size="sm" expression="excited" className="shrink-0" />
              <div className="leading-snug">{feedback}</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Choice Buttons for this email */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => handleVote('safe')}
            className="py-2.5 px-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{loc.safeBtn}</span>
          </button>
          <button
            onClick={() => handleVote('phishing')}
            className="py-2.5 px-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs border border-rose-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>{loc.phishBtn}</span>
          </button>
        </div>
      </div>

      {/* Completion CTA */}
      <button
        onClick={onComplete}
        disabled={!allReviewed}
        className={`w-full py-3.5 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
          allReviewed
            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-orange-400 active:scale-95'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
        }`}
      >
        <ShieldCheck className="w-4 h-4" />
        <span>{allReviewed ? loc.completeBtn : loc.needMoreBtn(completedCount)}</span>
      </button>
    </div>
  );
};
