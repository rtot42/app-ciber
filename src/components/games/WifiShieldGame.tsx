import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Wifi,
  WifiOff,
  Lock,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { ChildAgeGroup, GameResultStats } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { GameHud, GameVictorySummary } from './GameShell';
import { computeStars } from '../../utils/ageDifficulty';
import { playGameSound } from '../../utils/gameAudio';

interface WifiShieldGameProps {
  onComplete: (stats?: GameResultStats) => void;
  ageGroup?: ChildAgeGroup;
}

interface NetworkOption {
  id: string;
  ssid: string;
  security: 'WPA3' | 'WPA2' | 'OPEN' | 'WEP';
  signal: 1 | 2 | 3;
  note: string;
  isSafe: boolean;
  reason: string;
}

interface WifiScenario {
  id: string;
  location: string;
  prompt: string;
  networks: NetworkOption[];
}

export const WifiShieldGame: React.FC<WifiShieldGameProps> = ({
  onComplete,
  ageGroup = '8–10' as ChildAgeGroup,
}) => {
  const { language } = useLanguage();

  const copy = useMemo(() => {
    const scenariosByAge: Record<ChildAgeGroup, WifiScenario[]> = {
      '8–10': [
        {
          id: 'w1',
          location: language === 'fr' ? 'À la maison' : language === 'en' ? 'At Home' : 'En Casa',
          prompt:
            language === 'fr'
              ? 'Tu veux jouer en ligne sur ta tablette. Quel Wi-Fi choisir ?'
              : language === 'en'
              ? 'You want to play on your tablet. Which Wi-Fi should you pick?'
              : 'Quieres jugar en tu tablet. ¿A qué red Wi-Fi debes conectarte?',
          networks: [
            {
              id: 'n1',
              ssid: 'Casa_Familia_5G',
              security: 'WPA2',
              signal: 3,
              note: language === 'fr' ? 'Avec mot de passe des parents' : language === 'en' ? 'Protected with family password' : 'Protegida con clave familiar',
              isSafe: true,
              reason: language === 'fr' ? 'Le Wi-Fi familial protégé par mot de passe est sûr !' : language === 'en' ? 'Your password-protected home Wi-Fi keeps your data encrypted!' : '¡El Wi-Fi de casa con contraseña cifra tus datos de forma segura!',
            },
            {
              id: 'n2',
              ssid: 'WIFI_GRATIS_VECINO',
              security: 'OPEN',
              signal: 2,
              note: language === 'fr' ? 'Sans mot de passe' : language === 'en' ? 'No password needed' : 'Abierta sin contraseña',
              isSafe: false,
              reason: language === 'fr' ? 'Un réseau ouvert sans mot de passe permet aux inconnus d’espionner.' : language === 'en' ? 'Open networks without passwords let strangers see what you send.' : 'Una red abierta sin clave permite que otros vean lo que envías.',
            },
          ],
        },
        {
          id: 'w2',
          location: language === 'fr' ? 'Au parc / centre commercial' : language === 'en' ? 'At the Mall' : 'En el Centro Comercial',
          prompt:
            language === 'fr'
              ? 'Tu reçois une demande Bluetooth AirDrop d’un inconnu pour envoyer une photo.'
              : language === 'en'
              ? 'A stranger tries to send a photo via open Bluetooth/AirDrop.'
              : 'Alguien desconocido intenta enviarte una foto por Bluetooth abierto.',
          networks: [
            {
              id: 'n1',
              ssid: language === 'fr' ? 'Refuser & Mettre sur "Contacts Uniquement"' : language === 'en' ? 'Decline & Switch to "Contacts Only"' : 'Rechazar y poner en "Solo Contactos"',
              security: 'WPA3',
              signal: 3,
              note: language === 'fr' ? 'Bloque les fichiers d’inconnus' : language === 'en' ? 'Blocks files from strangers' : 'Bloquea envíos de desconocidos',
              isSafe: true,
              reason: language === 'fr' ? 'Parfait ! Ne reçois jamais de fichiers de personnes inconnues.' : language === 'en' ? 'Great! Never accept files from unknown people nearby.' : '¡Perfecto! Nunca aceptes archivos de extraños cercanos.',
            },
            {
              id: 'n2',
              ssid: language === 'fr' ? 'Accepter pour voir ce que c’est' : language === 'en' ? 'Accept just to see what it is' : 'Aceptar por curiosidad',
              security: 'OPEN',
              signal: 3,
              note: language === 'fr' ? 'Fichier inconnu' : language === 'en' ? 'Unknown file' : 'Archivo desconocido',
              isSafe: false,
              reason: language === 'fr' ? 'Les fichiers d’inconnus peuvent contenir des images choc ou virus.' : language === 'en' ? 'Unknown files can contain viruses or inappropriate content.' : 'Los archivos de extraños pueden contener virus o contenido dañino.',
            },
          ],
        },
        {
          id: 'w3',
          location: language === 'fr' ? 'Dans un café' : language === 'en' ? 'At a Café' : 'En una Cafetería',
          prompt:
            language === 'fr'
              ? 'Si tu es sur un Wi-Fi public, que dois-tu éviter de faire ?'
              : language === 'en'
              ? 'If you ever use public Wi-Fi, which choice protects your account?'
              : 'Si estás cerca de un Wi-Fi público abierto, ¿qué es lo más seguro?',
          networks: [
            {
              id: 'n1',
              ssid: language === 'fr' ? 'Demander le partage de connexion des parents' : language === 'en' ? 'Use parents’ mobile hotspot instead' : 'Pedir datos compartidos a mamá o papá',
              security: 'WPA3',
              signal: 3,
              note: language === 'fr' ? 'Connexion privée chiffrée' : language === 'en' ? 'Private encrypted connection' : 'Conexión privada cifrada',
              isSafe: true,
              reason: language === 'fr' ? 'Excellent réflexe ! Un partage mobile sécurisé évite le Wi-Fi public.' : language === 'en' ? 'Smart move! A protected family hotspot is much safer than public Wi-Fi.' : '¡Excelente! Compartir datos con contraseña evita redes públicas inseguras.',
            },
            {
              id: 'n2',
              ssid: 'Free_Cafe_Public',
              security: 'OPEN',
              signal: 3,
              note: language === 'fr' ? 'Saisir ton mot de passe de jeu' : language === 'en' ? 'Type your game password here' : 'Entrar e iniciar sesión con clave',
              isSafe: false,
              reason: language === 'fr' ? 'Ne tape jamais de mots de passe sur un Wi-Fi public ouvert.' : language === 'en' ? 'Never enter passwords on an unencrypted public Wi-Fi.' : 'Nunca ingreses contraseñas en una red Wi-Fi pública abierta.',
            },
          ],
        },
      ],
      '11–12': [
        {
          id: 'w1',
          location: language === 'fr' ? 'Aéroport' : language === 'en' ? 'Airport Terminal' : 'Aeropuerto',
          prompt:
            language === 'fr'
              ? 'Deux réseaux portent presque le même nom. Lequel est un piège "Evil Twin" ?'
              : language === 'en'
              ? 'Two networks look similar. Pick the truly secure connection option:'
              : 'Ves dos redes parecidas. Elige la opción realmente segura:',
          networks: [
            {
              id: 'n1',
              ssid: 'FREE_AIRPORT_VIP_FAST',
              security: 'OPEN',
              signal: 3,
              note: language === 'fr' ? 'Demande ton email + mot de passe pour surfer' : language === 'en' ? 'Asks for your email & password' : 'Pide tu correo y contraseña para entrar',
              isSafe: false,
              reason: language === 'fr' ? 'Faux point d’accès ! Les pirates créent des Wi-Fi "VIP" gratuits pour voler tes comptes.' : language === 'en' ? 'Evil Twin trap! Attackers create fake "VIP" hotspots to steal logins.' : '¡Red trampa "Evil Twin"! Los atacantes crean Wi-Fi gratis para robar tus claves.',
            },
            {
              id: 'n2',
              ssid: 'Family_Hotspot_5G',
              security: 'WPA3',
              signal: 2,
              note: language === 'fr' ? 'Chiffrement WPA3 personnel' : language === 'en' ? 'Personal WPA3 encryption' : 'Cifrado WPA3 personal',
              isSafe: true,
              reason: language === 'fr' ? 'WPA3 chiffre tout le trafic entre ton appareil et le point d’accès.' : language === 'en' ? 'WPA3 provides strong modern encryption with zero stranger interference.' : 'WPA3 ofrece cifrado moderno y evita interceptaciones.',
            },
            {
              id: 'n3',
              ssid: 'Airport_Guest_Old',
              security: 'WEP',
              signal: 1,
              note: language === 'fr' ? 'Ancien protocole cassable en 2 minutes' : language === 'en' ? 'Outdated weak WEP encryption' : 'Protocolo antiguo WEP vulnerable',
              isSafe: false,
              reason: language === 'fr' ? 'Le protocole WEP est obsolète et se déchiffre facilement.' : language === 'en' ? 'WEP is outdated and can be cracked in minutes.' : 'El protocolo WEP es antiguo y se puede romper en minutos.',
            },
          ],
        },
        {
          id: 'w2',
          location: language === 'fr' ? 'Paramètres Tablette' : language === 'en' ? 'Device Settings' : 'Ajustes del Dispositivo',
          prompt:
            language === 'fr'
              ? 'Quelle option empêche ton téléphone de se connecter tout seul à des pièges ?'
              : language === 'en'
              ? 'Which setting prevents your phone from auto-joining fake hotspots?'
              : '¿Qué ajuste evita que tu celular se conecte solo a redes falsas?',
          networks: [
            {
              id: 'n1',
              ssid: language === 'fr' ? 'Désactiver "Connexion Auto Wi-Fi Public"' : language === 'en' ? 'Disable "Auto-Join Public Wi-Fi"' : 'Desactivar "Unirse automáticamente"',
              security: 'WPA3',
              signal: 3,
              note: language === 'fr' ? 'Tu décides manuellement chaque réseau' : language === 'en' ? 'You approve every network manually' : 'Tú apruebas cada red manualmente',
              isSafe: true,
              reason: language === 'fr' ? 'Exact ! Empêche un pirate de cloner le nom d’un café pour te piéger.' : language === 'en' ? 'Exactly! Stops attackers from spoofing a saved café name.' : '¡Exacto! Impide que un atacante clone el nombre de un café para conectarte sin permiso.',
            },
            {
              id: 'n2',
              ssid: language === 'fr' ? 'Laisser Connexion Automatique Active' : language === 'en' ? 'Keep Auto-Join Always On' : 'Dejar Conexión Automática Activa',
              security: 'OPEN',
              signal: 3,
              note: language === 'fr' ? 'Se connecte partout sans demander' : language === 'en' ? 'Joins any familiar name silently' : 'Se conecta en silencio a nombres conocidos',
              isSafe: false,
              reason: language === 'fr' ? 'Ton appareil peut se connecter automatiquement à un faux routeur.' : language === 'en' ? 'Your device could silently connect to a spoofed attacker hotspot.' : 'Tu equipo podría conectarse automáticamente a un router falso.',
            },
          ],
        },
        {
          id: 'w3',
          location: language === 'fr' ? 'Routeur Maison' : language === 'en' ? 'Home Router' : 'Router de Casa',
          prompt:
            language === 'fr'
              ? 'Un ami vient jouer. Comment partager le Wi-Fi de la maison en sécurité ?'
              : language === 'en'
              ? 'Friends visit to play games. What is the safest Wi-Fi setup?'
              : 'Vienen amigos a jugar. ¿Cuál es la mejor práctica para tu router?',
          networks: [
            {
              id: 'n1',
              ssid: 'Invitados_Casa (Red Aislada)',
              security: 'WPA2',
              signal: 3,
              note: language === 'fr' ? 'Réseau Invité séparé avec clé dédiée' : language === 'en' ? 'Separate Guest Network with unique password' : 'Red de Invitados aislada con clave distinta',
              isSafe: true,
              reason: language === 'fr' ? 'Génial ! Le réseau invité protège les ordinateurs et fichiers familiaux.' : language === 'en' ? 'Awesome! A guest network isolates visitors from family computers.' : '¡Genial! La red de invitados protege los equipos principales de tu casa.',
            },
            {
              id: 'n2',
              ssid: 'Router_Default_Admin',
              security: 'OPEN',
              signal: 3,
              note: language === 'fr' ? 'Mot de passe imprimé "admin1234"' : language === 'en' ? 'Default factory password "admin"' : 'Clave de fábrica por defecto',
              isSafe: false,
              reason: language === 'fr' ? 'Les mots de passe d’usine sont connus de tous les pirates.' : language === 'en' ? 'Default router passwords are publicly listed online.' : 'Las contraseñas de fábrica están publicadas en Internet.',
            },
          ],
        },
      ],
      '13–14': [
        {
          id: 'w1',
          location: language === 'fr' ? 'Bibliothèque Publique' : language === 'en' ? 'Public Library' : 'Biblioteca Pública',
          prompt:
            language === 'fr'
              ? 'Tu dois consulter tes notes sur un réseau public. Quelle configuration est requise ?'
              : language === 'en'
              ? 'You must access study notes on public Wi-Fi. Choose the secure configuration:'
              : 'Debes consultar apuntes en una red pública. Elige la configuración segura:',
          networks: [
            {
              id: 'n1',
              ssid: 'Library_WiFi + VPN Activo + HTTPS',
              security: 'WPA2',
              signal: 3,
              note: language === 'fr' ? 'Tunnel chiffré de bout en bout' : language === 'en' ? 'End-to-end encrypted VPN tunnel' : 'Túnel cifrado VPN + sitios HTTPS',
              isSafe: true,
              reason: language === 'fr' ? 'Un VPN fiable + HTTPS empêche toute interception sur le réseau local.' : language === 'en' ? 'A trusted VPN + HTTPS stops packet sniffing on shared Wi-Fi.' : 'Una VPN confiable + HTTPS bloquea el espionaje de paquetes en redes compartidas.',
            },
            {
              id: 'n2',
              ssid: 'Library_Free_NoAuth',
              security: 'OPEN',
              signal: 3,
              note: language === 'fr' ? 'Sans VPN, connexion HTTP' : language === 'en' ? 'No VPN, plain HTTP login' : 'Sin VPN y entrando en HTTP',
              isSafe: false,
              reason: language === 'fr' ? 'Trafic vulnérable aux attaques Man-in-the-Middle (MitM).' : language === 'en' ? 'Wide open to Man-in-the-Middle (MitM) packet interception.' : 'Totalmente vulnerable a ataques Man-in-the-Middle (MitM).',
            },
            {
              id: 'n3',
              ssid: 'Library_WiFi_Update_Flash',
              security: 'OPEN',
              signal: 2,
              note: language === 'fr' ? 'Portail demandant d’installer un .exe' : language === 'en' ? 'Captive portal asks to install .exe update' : 'Portal cautivo pide descargar un .exe',
              isSafe: false,
              reason: language === 'fr' ? 'Un vrai portail Wi-Fi ne demande jamais de télécharger un exécutable !' : language === 'en' ? 'Legitimate Wi-Fi portals never ask you to download an installer!' : '¡Un portal Wi-Fi legítimo jamás pide descargar programas instaladores!',
            },
          ],
        },
        {
          id: 'w2',
          location: language === 'fr' ? 'Audit Routeur Domestique' : language === 'en' ? 'Home Router Audit' : 'Auditoría Router Doméstico',
          prompt:
            language === 'fr'
              ? 'Sélectionne la configuration la plus résistante aux attaques réseau :'
              : language === 'en'
              ? 'Select the most resilient router security configuration:'
              : 'Selecciona la configuración de router más resistente a intrusiones:',
          networks: [
            {
              id: 'n1',
              ssid: 'WPA3-Personal + WPS Desactivado',
              security: 'WPA3',
              signal: 3,
              note: language === 'fr' ? 'Chiffrement SAE, mot de passe 16+ car.' : language === 'en' ? 'SAE encryption, 16+ char passphrase, WPS off' : 'Cifrado SAE, clave 16+ chars y WPS apagado',
              isSafe: true,
              reason: language === 'fr' ? 'Configuration experte ! Désactiver WPS ferme une faille par code PIN.' : language === 'en' ? 'Expert setup! Disabling WPS closes common 8-digit PIN brute-force attacks.' : '¡Configuración experta! Apagar WPS cierra la puerta a ataques de PIN.',
            },
            {
              id: 'n2',
              ssid: 'WPA-TKIP + WPS Pin Activo',
              security: 'WEP',
              signal: 3,
              note: language === 'fr' ? 'Ancien chiffrement avec WPS activé' : language === 'en' ? 'Legacy TKIP with WPS enabled' : 'Cifrado antiguo con PIN WPS activo',
              isSafe: false,
              reason: language === 'fr' ? 'TKIP et WPS sont vulnérables aux outils d’audit automatisés.' : language === 'en' ? 'TKIP and WPS are easily exploited by automated cracking tools.' : 'TKIP y WPS son vulnerables a herramientas automatizadas.',
            },
          ],
        },
        {
          id: 'w3',
          location: language === 'fr' ? 'Café & Partage Bluetooth' : language === 'en' ? 'Coffee Shop Surface' : 'Superficie de Ataque en Café',
          prompt:
            language === 'fr'
              ? 'Quel comportement réduit ta surface d’attaque en déplacement ?'
              : language === 'en'
              ? 'Which habit best reduces your wireless attack surface outdoors?'
              : '¿Qué hábito reduce mejor tu superficie de ataque inalámbrica fuera de casa?',
          networks: [
            {
              id: 'n1',
              ssid: language === 'fr' ? 'Couper Wi-Fi/Bluetooth quand inutilisés' : language === 'en' ? 'Disable Wi-Fi & Bluetooth when unused + Forget public networks' : 'Apagar Wi-Fi/Bluetooth sin uso y olvidar redes públicas',
              security: 'WPA3',
              signal: 3,
              note: language === 'fr' ? 'Zéro balise MAC diffusée inutilement' : language === 'en' ? 'Stops probe requests & evil twin pairing' : 'Evita rastreo y emparejamiento automático',
              isSafe: true,
              reason: language === 'fr' ? 'Parfait ! Tu évites le pistage et les connexions automatiques piégées.' : language === 'en' ? 'Spot-on! Stops silent probe requests and evil-twin spoofing.' : '¡Exacto! Evita el rastreo silencioso y los puntos de acceso falsos.',
            },
            {
              id: 'n2',
              ssid: language === 'fr' ? 'Tout laisser ouvert pour plus de confort' : language === 'en' ? 'Keep Wi-Fi, Bluetooth & Hotspot open 24/7' : 'Dejar Wi-Fi, Bluetooth y Zona Wi-Fi abiertos 24/7',
              security: 'OPEN',
              signal: 3,
              note: language === 'fr' ? 'Exposition continue' : language === 'en' ? 'Continuous wireless exposure' : 'Exposición inalámbrica continua',
              isSafe: false,
              reason: language === 'fr' ? 'Laisser tes interfaces ouvertes facilite le pistage et les attaques locales.' : language === 'en' ? 'Leaving wireless radios open invites local probing and spoofing.' : 'Dejar radios inalámbricas abiertas facilita el rastreo y ataques locales.',
            },
          ],
        },
      ],
    };

    const labels = {
      es: {
        title: 'Radar Wi-Fi & Red Segura',
        subtitle: 'Elige la conexión cifrada y evita redes trampa',
        nextBtn: 'Siguiente Escenario',
        safePick: '¡Conexión blindada!',
        riskyPick: '¡Cuidado, red vulnerable!',
        takeaway:
          'Prefiere siempre redes privadas WPA2/WPA3, desactiva la conexión automática y nunca ingreses contraseñas en Wi-Fi públicos abiertos sin VPN.',
      },
      fr: {
        title: 'Radar Wi-Fi & Réseau Sûr',
        subtitle: 'Choisis les réseaux chiffrés et évite les pièges',
        nextBtn: 'Scénario Suivant',
        safePick: 'Connexion sécurisée !',
        riskyPick: 'Attention, réseau risqué !',
        takeaway:
          'Privilégie le WPA2/WPA3 privé, coupe la connexion automatique publique et n’entre jamais de mots de passe sur un Wi-Fi ouvert sans VPN.',
      },
      en: {
        title: 'Wi-Fi Shield & Network Radar',
        subtitle: 'Select encrypted networks and dodge Evil Twin traps',
        nextBtn: 'Next Scenario',
        safePick: 'Connection secured!',
        riskyPick: 'Watch out, vulnerable connection!',
        takeaway:
          'Always prefer WPA2/WPA3 private networks, disable public auto-join, and never type passwords on open public Wi-Fi without a trusted VPN.',
      },
    }[language];

    return { scenarios: scenariosByAge[ageGroup], labels };
  }, [ageGroup, language]);

  const [idx, setIdx] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(1);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = copy.scenarios[idx];
  const chosenNet = current.networks.find((n) => n.id === selectedId);

  const handleSelect = (net: NetworkOption) => {
    if (selectedId) return;
    setSelectedId(net.id);
    if (net.isSafe) {
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
    if (idx < copy.scenarios.length - 1) {
      setIdx((i) => i + 1);
      setSelectedId(null);
    } else {
      playGameSound('win');
      setFinished(true);
    }
  };

  const handleReplay = () => {
    setIdx(0);
    setSelectedId(null);
    setScore(0);
    setStreak(0);
    setMaxStreak(1);
    setCorrectCount(0);
    setFinished(false);
  };

  const answered = idx + (selectedId ? 1 : 0);
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
    <div className="flex-1 min-h-0 w-full flex flex-col p-2.5 sm:p-4 bg-slate-50 text-slate-800 overflow-y-auto overflow-x-hidden scrollbar-none gap-2.5 sm:gap-3 pb-4">
      <GameHud
        title={copy.labels.title}
        subtitle={copy.labels.subtitle}
        icon={<Wifi className="w-5 h-5" />}
        accentColor="cyan"
        ageGroup={ageGroup}
        currentStep={idx + 1}
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
        className="flex-1 min-h-0 bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs flex flex-col justify-center gap-4"
      >
        <div className="space-y-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-cyan-700">
            {current.location}
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {current.prompt}
          </h3>
        </div>

        <div className="space-y-2.5">
          {current.networks.map((net) => {
            const isPicked = selectedId === net.id;
            const showState = !!selectedId;

            return (
              <button
                key={net.id}
                type="button"
                disabled={!!selectedId}
                onClick={() => handleSelect(net)}
                className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between gap-3 active:scale-[0.98] ${
                  showState
                    ? net.isSafe
                      ? 'bg-emerald-50 border-emerald-400'
                      : isPicked
                      ? 'bg-rose-50 border-rose-400'
                      : 'bg-slate-50 border-slate-200 opacity-75'
                    : 'bg-slate-50 hover:bg-cyan-50/60 border-slate-200 hover:border-cyan-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      net.security === 'OPEN' || net.security === 'WEP'
                        ? 'bg-rose-100 text-rose-600'
                        : 'bg-cyan-100 text-cyan-700'
                    }`}
                  >
                    {net.security === 'OPEN' ? (
                      <WifiOff className="w-5 h-5" />
                    ) : (
                      <Wifi className="w-5 h-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-900 leading-snug break-words">
                      {net.ssid}
                    </div>
                    <div className="text-xs font-medium text-slate-500 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 mt-0.5">
                      {net.security === 'OPEN' || net.security === 'WEP' ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      )}
                      <span className="font-semibold text-slate-700">{net.security}</span>
                      <span aria-hidden="true">·</span>
                      <span className="leading-snug">{net.note}</span>
                    </div>
                  </div>
                </div>

                {showState && (isPicked || net.isSafe) && (
                  <div className="shrink-0">
                    {net.isSafe ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-rose-600" />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {chosenNet && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3.5 rounded-2xl border text-xs sm:text-sm space-y-1 ${
              chosenNet.isSafe
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}
          >
            <div className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{chosenNet.isSafe ? copy.labels.safePick : copy.labels.riskyPick}</span>
            </div>
            <p className="font-medium leading-relaxed">{chosenNet.reason}</p>
          </motion.div>
        )}
      </motion.div>

      {selectedId && (
        <button
          type="button"
          onClick={handleNext}
          className="w-full py-3.5 min-h-[48px] shrink-0 rounded-2xl font-bold text-sm sm:text-base bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition"
        >
          <span>{copy.labels.nextBtn}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
