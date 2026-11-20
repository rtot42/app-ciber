import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Smartphone,
  ShieldCheck,
  ShieldAlert,
  Camera,
  Mic,
  MapPin,
  Users,
  MessageSquare,
  HardDrive,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sliders,
} from 'lucide-react';
import { ChildAgeGroup, GameResultStats } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { GameHud, GameVictorySummary } from './GameShell';
import { computeStars } from '../../utils/ageDifficulty';
import { playGameSound } from '../../utils/gameAudio';

interface AppPermissionsGameProps {
  onComplete: (stats?: GameResultStats) => void;
  ageGroup?: ChildAgeGroup;
}

interface PermissionItem {
  id: string;
  icon: 'camera' | 'mic' | 'gps' | 'contacts' | 'sms' | 'storage';
  label: string;
  needed: boolean;
  reason: string;
}

interface AppAuditCase {
  id: string;
  appName: string;
  category: string;
  emoji: string;
  verifiedPublisher: boolean;
  permissions: PermissionItem[];
}

export const AppPermissionsGame: React.FC<AppPermissionsGameProps> = ({
  onComplete,
  ageGroup = '8–10' as ChildAgeGroup,
}) => {
  const { language } = useLanguage();

  const copy = useMemo(() => {
    const casesByAge: Record<ChildAgeGroup, AppAuditCase[]> = {
      '8–10': [
        {
          id: 'app-flashlight',
          appName: language === 'fr' ? 'Lampe Torche Nuit' : language === 'en' ? 'Night Flashlight' : 'Linterna Nocturna',
          category: language === 'fr' ? 'Utilitaire' : language === 'en' ? 'Utility' : 'Utilidad',
          emoji: '🔦',
          verifiedPublisher: true,
          permissions: [
            {
              id: 'p1',
              icon: 'camera',
              label: language === 'fr' ? 'Flash / Caméra' : language === 'en' ? 'Flashlight / Camera' : 'Flash / Cámara',
              needed: true,
              reason: language === 'fr' ? 'Pour allumer la lumière LED.' : language === 'en' ? 'Needed to turn on the LED light.' : 'Necesario para encender la luz LED.',
            },
            {
              id: 'p2',
              icon: 'contacts',
              label: language === 'fr' ? 'Liste de Contacts' : language === 'en' ? 'Contacts List' : 'Lista de Contactos',
              needed: false,
              reason: language === 'fr' ? 'Une lampe n’a pas besoin des numéros de ta famille.' : language === 'en' ? 'A flashlight never needs your family phone numbers.' : 'Una linterna nunca necesita los teléfonos de tu familia.',
            },
            {
              id: 'p3',
              icon: 'gps',
              label: language === 'fr' ? 'Localisation Exacte GPS' : language === 'en' ? 'Exact GPS Location' : 'Ubicación GPS Exacta',
              needed: false,
              reason: language === 'fr' ? 'La lampe fonctionne sans savoir où tu habites.' : language === 'en' ? 'A flashlight works without tracking where you live.' : 'La linterna funciona sin saber dónde vives.',
            },
          ],
        },
        {
          id: 'app-paint',
          appName: language === 'fr' ? 'Atelier Dessin Magique' : language === 'en' ? 'Magic Paint Studio' : 'Estudio de Dibujo',
          category: language === 'fr' ? 'Créativité' : language === 'en' ? 'Creativity' : 'Creatividad',
          emoji: '🎨',
          verifiedPublisher: true,
          permissions: [
            {
              id: 'p1',
              icon: 'storage',
              label: language === 'fr' ? 'Enregistrer Dessins' : language === 'en' ? 'Save Artwork' : 'Guardar Dibujos',
              needed: true,
              reason: language === 'fr' ? 'Utile pour sauvegarder tes dessins sur la tablette.' : language === 'en' ? 'Needed to save your drawings to your device.' : 'Necesario para guardar tus dibujos en el equipo.',
            },
            {
              id: 'p2',
              icon: 'mic',
              label: language === 'fr' ? 'Microphone en Continu' : language === 'en' ? 'Always-On Microphone' : 'Micrófono Continuo',
              needed: false,
              reason: language === 'fr' ? 'Dessiner ne nécessite pas d’écouter ta maison.' : language === 'en' ? 'Drawing does not require listening to your room.' : 'Para dibujar no hace falta escuchar lo que hablas en casa.',
            },
            {
              id: 'p3',
              icon: 'sms',
              label: language === 'fr' ? 'Lire les SMS' : language === 'en' ? 'Read Text Messages' : 'Leer Mensajes SMS',
              needed: false,
              reason: language === 'fr' ? 'Aucune appli de dessin ne doit lire tes messages.' : language === 'en' ? 'No art app should ever read private messages.' : 'Ninguna app de dibujo debe leer tus mensajes.',
            },
          ],
        },
        {
          id: 'app-puzzle',
          appName: language === 'fr' ? 'Puzzle Animaux' : language === 'en' ? 'Animal Puzzle' : 'Puzzle Animales',
          category: language === 'fr' ? 'Jeux' : language === 'en' ? 'Games' : 'Juegos',
          emoji: '🧩',
          verifiedPublisher: true,
          permissions: [
            {
              id: 'p1',
              icon: 'storage',
              label: language === 'fr' ? 'Sauvegarde locale' : language === 'en' ? 'Local Game Progress' : 'Progreso Local',
              needed: true,
              reason: language === 'fr' ? 'Pour garder ton score.' : language === 'en' ? 'To keep your puzzle score.' : 'Para guardar tu puntuación.',
            },
            {
              id: 'p2',
              icon: 'camera',
              label: language === 'fr' ? 'Caméra secrète' : language === 'en' ? 'Background Camera' : 'Cámara en segundo plano',
              needed: false,
              reason: language === 'fr' ? 'Un puzzle classique n’utilise pas ta caméra.' : language === 'en' ? 'A puzzle game does not need your camera.' : 'Un puzzle clásico no necesita usar tu cámara.',
            },
            {
              id: 'p3',
              icon: 'gps',
              label: language === 'fr' ? 'Position du domicile' : language === 'en' ? 'Home Location' : 'Ubicación de tu casa',
              needed: false,
              reason: language === 'fr' ? 'Garde ta maison confidentielle.' : language === 'en' ? 'Keep your home address private.' : 'Mantén en secreto dónde vives.',
            },
          ],
        },
      ],
      '11–12': [
        {
          id: 'app-camera-filter',
          appName: language === 'fr' ? 'Filtres Neon Cam' : language === 'en' ? 'Neon Cam Filters' : 'Filtros Neon Cam',
          category: language === 'fr' ? 'Photo' : language === 'en' ? 'Photo' : 'Foto',
          emoji: '📸',
          verifiedPublisher: true,
          permissions: [
            {
              id: 'p1',
              icon: 'camera',
              label: language === 'fr' ? 'Caméra (en cours d’usage)' : language === 'en' ? 'Camera (While Using)' : 'Cámara (Al usar la app)',
              needed: true,
              reason: language === 'fr' ? 'Indispensable pour appliquer les filtres photo.' : language === 'en' ? 'Required to preview photo filters.' : 'Necesaria para aplicar filtros en tiempo real.',
            },
            {
              id: 'p2',
              icon: 'storage',
              label: language === 'fr' ? 'Galerie (Photos choisies)' : language === 'en' ? 'Selected Photos Only' : 'Solo Fotos Seleccionadas',
              needed: true,
              reason: language === 'fr' ? 'Permet d’éditer uniquement les images que tu choisis.' : language === 'en' ? 'Lets you edit only the pictures you pick.' : 'Permite editar solo las fotos que tú elijas.',
            },
            {
              id: 'p3',
              icon: 'contacts',
              label: language === 'fr' ? 'Carnet d’adresses complet' : language === 'en' ? 'Full Address Book' : 'Agenda Completa de Contactos',
              needed: false,
              reason: language === 'fr' ? 'Les éditeurs photo vendent parfois tes contacts aux publicitaires.' : language === 'en' ? 'Filter apps do not need to harvest your friends’ contacts.' : 'Una app de filtros no debe copiar los contactos de tus amigos.',
            },
            {
              id: 'p4',
              icon: 'gps',
              label: language === 'fr' ? 'GPS même appli fermée' : language === 'en' ? 'Always-On Background GPS' : 'GPS siempre activo en segundo plano',
              needed: false,
              reason: language === 'fr' ? 'Désactive le suivi permanent de tes déplacements.' : language === 'en' ? 'Never let a filter app track you 24/7.' : 'Nunca dejes que una app de filtros te rastree 24/7.',
            },
          ],
        },
        {
          id: 'app-voice-changer',
          appName: language === 'fr' ? 'Modificateur Voix Pro' : language === 'en' ? 'Gamer Voice Changer' : 'Cambiador de Voz Gamer',
          category: language === 'fr' ? 'Audio' : language === 'en' ? 'Audio' : 'Audio',
          emoji: '🎙️',
          verifiedPublisher: true,
          permissions: [
            {
              id: 'p1',
              icon: 'mic',
              label: language === 'fr' ? 'Microphone (en usage)' : language === 'en' ? 'Microphone (While Active)' : 'Micrófono (Solo al grabar)',
              needed: true,
              reason: language === 'fr' ? 'Nécessaire pour enregistrer et transformer ta voix.' : language === 'en' ? 'Needed to record and alter voice effects.' : 'Necesario para grabar y transformar tu voz.',
            },
            {
              id: 'p2',
              icon: 'sms',
              label: language === 'fr' ? 'Lire les codes SMS (2FA)' : language === 'en' ? 'Read SMS Codes' : 'Leer SMS y códigos 2FA',
              needed: false,
              reason: language === 'fr' ? 'Dangereux ! Une appli pourrait intercepter tes codes de sécurité.' : language === 'en' ? 'Dangerous! Malicious apps steal 2FA SMS codes.' : '¡Peligroso! Podría robar tus códigos de verificación.',
            },
            {
              id: 'p3',
              icon: 'camera',
              label: language === 'fr' ? 'Caméra frontale' : language === 'en' ? 'Front Camera' : 'Cámara frontal',
              needed: false,
              reason: language === 'fr' ? 'Un outil audio n’a pas besoin de te filmer.' : language === 'en' ? 'An audio tool has no reason to use your camera.' : 'Una herramienta de audio no necesita grabarte en video.',
            },
            {
              id: 'p4',
              icon: 'storage',
              label: language === 'fr' ? 'Exporter fichier audio' : language === 'en' ? 'Save Audio Clips' : 'Guardar Clips de Audio',
              needed: true,
              reason: language === 'fr' ? 'Utile pour enregistrer tes effets.' : language === 'en' ? 'Needed to save your exported audio clips.' : 'Necesario para guardar tus audios creados.',
            },
          ],
        },
        {
          id: 'app-walk-tracker',
          appName: language === 'fr' ? 'Podomètre Aventure' : language === 'en' ? 'Step Quest Tracker' : 'Reto Pasos Diarios',
          category: language === 'fr' ? 'Santé' : language === 'en' ? 'Fitness' : 'Deporte',
          emoji: '👟',
          verifiedPublisher: true,
          permissions: [
            {
              id: 'p1',
              icon: 'gps',
              label: language === 'fr' ? 'Capteur d’activité / Parcours' : language === 'en' ? 'Activity / Route Tracking' : 'Actividad y Ruta (Al entrenar)',
              needed: true,
              reason: language === 'fr' ? 'Sert à compter tes pas et ta distance.' : language === 'en' ? 'Used to measure your steps and running distance.' : 'Sirve para medir tus pasos y distancia al correr.',
            },
            {
              id: 'p2',
              icon: 'contacts',
              label: language === 'fr' ? 'Lire appels et contacts' : language === 'en' ? 'Read Calls & Contacts' : 'Leer Llamadas y Contactos',
              needed: false,
              reason: language === 'fr' ? 'Inutile pour compter tes pas.' : language === 'en' ? 'Unnecessary for counting daily steps.' : 'Innecesario para contar tus pasos diarios.',
            },
            {
              id: 'p3',
              icon: 'mic',
              label: language === 'fr' ? 'Enregistrer l’audio ambiant' : language === 'en' ? 'Ambient Audio Recording' : 'Grabar Audio Ambiental',
              needed: false,
              reason: language === 'fr' ? 'Un podomètre ne doit jamais écouter tes conversations.' : language === 'en' ? 'A step tracker should never record conversations.' : 'Un podómetro nunca debe grabar tus conversaciones.',
            },
            {
              id: 'p4',
              icon: 'storage',
              label: language === 'fr' ? 'Historique local' : language === 'en' ? 'Local Workout Stats' : 'Estadísticas Locales',
              needed: true,
              reason: language === 'fr' ? 'Pour afficher tes progrès de la semaine.' : language === 'en' ? 'Shows your weekly workout progress.' : 'Muestra tu progreso semanal.',
            },
          ],
        },
        {
          id: 'app-free-gems',
          appName: language === 'fr' ? 'Générateur Gemmes APK' : language === 'en' ? 'Unlimited Gems Mod' : 'Generador Gemas Gratis',
          category: language === 'fr' ? 'Source inconnue' : language === 'en' ? 'Unverified APK' : 'App No Oficial',
          emoji: '💎',
          verifiedPublisher: false,
          permissions: [
            {
              id: 'p1',
              icon: 'sms',
              label: language === 'fr' ? 'Contrôle total SMS' : language === 'en' ? 'Full SMS Control' : 'Control Total de SMS',
              needed: false,
              reason: language === 'fr' ? 'Piège ! Vole tes codes et abonne à des services payants.' : language === 'en' ? 'Trap! Steals codes and subscribes to paid services.' : '¡Trampa! Roba códigos y suscribe a servicios pagos.',
            },
            {
              id: 'p2',
              icon: 'contacts',
              label: language === 'fr' ? 'Envoyer messages aux contacts' : language === 'en' ? 'Message All Contacts' : 'Escribir a tus Contactos',
              needed: false,
              reason: language === 'fr' ? 'Propage le virus à tous tes amis.' : language === 'en' ? 'Spreads scam links to all your friends.' : 'Envía enlaces falsos a todos tus amigos.',
            },
            {
              id: 'p3',
              icon: 'storage',
              label: language === 'fr' ? 'Accès complet aux fichiers' : language === 'en' ? 'Full Device File Access' : 'Acceso Total a Archivos',
              needed: false,
              reason: language === 'fr' ? 'Aucun générateur de gemmes gratuites n’est légitime.' : language === 'en' ? 'Free gem generators are always fake malware traps.' : 'Los generadores de gemas gratis son siempre malware.',
            },
            {
              id: 'p4',
              icon: 'gps',
              label: language === 'fr' ? 'Localisation précise 24/7' : language === 'en' ? 'Precise 24/7 Location' : 'Ubicación Exacta 24/7',
              needed: false,
              reason: language === 'fr' ? 'Bloque cette application immédiatement.' : language === 'en' ? 'Deny everything and never install unverified mods.' : 'Niega todo y jamás instales mods de fuentes desconocidas.',
            },
          ],
        },
      ],
      '13–14': [
        {
          id: 'app-qr',
          appName: language === 'fr' ? 'Scanner QR Rapide' : language === 'en' ? 'Fast QR Scanner' : 'Escáner QR Rápido',
          category: language === 'fr' ? 'Outil' : language === 'en' ? 'Utility' : 'Herramienta',
          emoji: '📱',
          verifiedPublisher: true,
          permissions: [
            {
              id: 'p1',
              icon: 'camera',
              label: language === 'fr' ? 'Caméra uniquement à l’ouverture' : language === 'en' ? 'Camera (Only When Open)' : 'Cámara (Solo con app abierta)',
              needed: true,
              reason: language === 'fr' ? 'Indispensable pour lire le code QR.' : language === 'en' ? 'Required to scan QR codes.' : 'Imprescindible para leer códigos QR.',
            },
            {
              id: 'p2',
              icon: 'gps',
              label: language === 'fr' ? 'Géolocalisation précise' : language === 'en' ? 'Precise Location' : 'Ubicación Precisa',
              needed: false,
              reason: language === 'fr' ? 'Un lecteur QR sert souvent à revendre des profils de localisation.' : language === 'en' ? 'Many free QR apps monetize by selling precise GPS history.' : 'Muchas apps QR gratuitas venden tu historial de ubicación.',
            },
            {
              id: 'p3',
              icon: 'contacts',
              label: language === 'fr' ? 'Synchroniser Contacts' : language === 'en' ? 'Sync Contacts' : 'Sincronizar Contactos',
              needed: false,
              reason: language === 'fr' ? 'Violations du principe du moindre privilège.' : language === 'en' ? 'Violates the principle of least privilege.' : 'Viola el principio de mínimo privilegio.',
            },
            {
              id: 'p4',
              icon: 'sms',
              label: language === 'fr' ? 'Accès aux notifications OTP' : language === 'en' ? 'Read OTP Notifications' : 'Leer Notificaciones OTP',
              needed: false,
              reason: language === 'fr' ? 'Vecteur critique de vol de sessions.' : language === 'en' ? 'Critical session-hijacking vector.' : 'Vector crítico para robar códigos de doble factor.',
            },
          ],
        },
        {
          id: 'app-study-ai',
          appName: language === 'fr' ? 'Assistant Notes IA' : language === 'en' ? 'Study Notes AI' : 'Notas de Estudio IA',
          category: language === 'fr' ? 'Éducation' : language === 'en' ? 'Education' : 'Educación',
          emoji: '📚',
          verifiedPublisher: true,
          permissions: [
            {
              id: 'p1',
              icon: 'storage',
              label: language === 'fr' ? 'Fichiers PDF sélectionnés' : language === 'en' ? 'Selected Study PDFs' : 'Archivos PDF Seleccionados',
              needed: true,
              reason: language === 'fr' ? 'Accès ciblé uniquement aux documents choisis.' : language === 'en' ? 'Scoped access only to documents you import.' : 'Acceso limitado solo a los apuntes que importes.',
            },
            {
              id: 'p2',
              icon: 'mic',
              label: language === 'fr' ? 'Micro (pendant dictée vocale)' : language === 'en' ? 'Mic (During Voice Notes)' : 'Micrófono (Solo al dictar)',
              needed: true,
              reason: language === 'fr' ? 'Justifié uniquement lors de l’enregistrement actif.' : language === 'en' ? 'Justified strictly while actively dictating.' : 'Justificado únicamente mientras dictas notas.',
            },
            {
              id: 'p3',
              icon: 'camera',
              label: language === 'fr' ? 'Caméra en arrière-plan' : language === 'en' ? 'Background Camera' : 'Cámara en Segundo Plano',
              needed: false,
              reason: language === 'fr' ? 'Aucune appli légitime n’active la caméra en arrière-plan.' : language === 'en' ? 'No legitimate study app needs background camera.' : 'Ninguna app legítima necesita cámara en segundo plano.',
            },
            {
              id: 'p4',
              icon: 'contacts',
              label: language === 'fr' ? 'Graph social & Contacts' : language === 'en' ? 'Social Graph & Contacts' : 'Red de Contactos',
              needed: false,
              reason: language === 'fr' ? 'Collecte de données superflue.' : language === 'en' ? 'Unnecessary data harvesting.' : 'Recolección innecesaria de datos de terceros.',
            },
          ],
        },
        {
          id: 'app-vpn-free',
          appName: language === 'fr' ? 'Super VPN Gratuit X' : language === 'en' ? 'Ultra Free VPN X' : 'Súper VPN Gratis X',
          category: language === 'fr' ? 'Éditeur anonyme' : language === 'en' ? 'Unknown Dev' : 'Editor Anónimo',
          emoji: '🕵️',
          verifiedPublisher: false,
          permissions: [
            {
              id: 'p1',
              icon: 'storage',
              label: language === 'fr' ? 'Installer profil certificat racine' : language === 'en' ? 'Install Root CA Certificate' : 'Instalar Certificado Raíz',
              needed: false,
              reason: language === 'fr' ? 'Permet d’inspecter tout ton trafic chiffré !' : language === 'en' ? 'Allows intercepting all your encrypted HTTPS traffic!' : '¡Permite espiar todo tu tráfico cifrado HTTPS!',
            },
            {
              id: 'p2',
              icon: 'sms',
              label: language === 'fr' ? 'Lire SMS & Journaux d’appels' : language === 'en' ? 'Read SMS & Call Logs' : 'Leer SMS y Llamadas',
              needed: false,
              reason: language === 'fr' ? 'Un VPN n’a jamais besoin de tes SMS.' : language === 'en' ? 'A VPN never needs access to your texts or calls.' : 'Un VPN jamás necesita leer tus mensajes ni llamadas.',
            },
            {
              id: 'p3',
              icon: 'gps',
              label: language === 'fr' ? 'Position GPS précise' : language === 'en' ? 'Precise GPS Location' : 'Ubicación GPS Precisa',
              needed: false,
              reason: language === 'fr' ? 'Contradictoire avec la confidentialité.' : language === 'en' ? 'Contradicts privacy protection.' : 'Contradice el propósito de privacidad.',
            },
            {
              id: 'p4',
              icon: 'contacts',
              label: language === 'fr' ? 'Identité & Comptes du téléphone' : language === 'en' ? 'Device Accounts & Identity' : 'Cuentas e Identidad del Equipo',
              needed: false,
              reason: language === 'fr' ? 'Les VPN gratuits douteux revendent les données.' : language === 'en' ? 'Shady free VPNs monetize user identity and browsing logs.' : 'Los VPN gratuitos dudosos venden tu identidad y navegación.',
            },
          ],
        },
        {
          id: 'app-social-clip',
          appName: language === 'fr' ? 'ClipStream Social' : language === 'en' ? 'ClipStream Social' : 'ClipStream Social',
          category: language === 'fr' ? 'Réseaux' : language === 'en' ? 'Social' : 'Redes Sociales',
          emoji: '🎬',
          verifiedPublisher: true,
          permissions: [
            {
              id: 'p1',
              icon: 'camera',
              label: language === 'fr' ? 'Caméra (pendant tournage)' : language === 'en' ? 'Camera (While Recording)' : 'Cámara (Al grabar video)',
              needed: true,
              reason: language === 'fr' ? 'Nécessaire pour filmer des vidéos.' : language === 'en' ? 'Required when shooting clips.' : 'Necesaria para grabar tus videos.',
            },
            {
              id: 'p2',
              icon: 'mic',
              label: language === 'fr' ? 'Micro (pendant tournage)' : language === 'en' ? 'Mic (While Recording)' : 'Micrófono (Al grabar video)',
              needed: true,
              reason: language === 'fr' ? 'Nécessaire pour le son des vidéos.' : language === 'en' ? 'Required for video audio.' : 'Necesario para el audio de tus clips.',
            },
            {
              id: 'p3',
              icon: 'gps',
              label: language === 'fr' ? 'Géolocalisation précise des vidéos' : language === 'en' ? 'Exact GPS Tagging' : 'Etiqueta GPS Exacta en Videos',
              needed: false,
              reason: language === 'fr' ? 'Expose les lieux que tu fréquentes publiquement.' : language === 'en' ? 'Exposes your daily routine and exact hangout spots.' : 'Expone tu rutina diaria y lugares exactos que frecuentas.',
            },
            {
              id: 'p4',
              icon: 'sms',
              label: language === 'fr' ? 'Lire les SMS reçus' : language === 'en' ? 'Read Incoming SMS' : 'Leer SMS Entrantes',
              needed: false,
              reason: language === 'fr' ? 'Toujours refuser la lecture des SMS par les réseaux sociaux.' : language === 'en' ? 'Never grant SMS read access to social media apps.' : 'Nunca concedas acceso a SMS a una red social.',
            },
          ],
        },
        {
          id: 'app-authenticator',
          appName: language === 'fr' ? 'Bouclier 2FA Auth' : language === 'en' ? 'Shield 2FA Authenticator' : 'Autenticador 2FA Escudo',
          category: language === 'fr' ? 'Sécurité' : language === 'en' ? 'Security' : 'Seguridad',
          emoji: '🔐',
          verifiedPublisher: true,
          permissions: [
            {
              id: 'p1',
              icon: 'camera',
              label: language === 'fr' ? 'Caméra (scan QR 2FA)' : language === 'en' ? 'Camera (Scan 2FA QR)' : 'Cámara (Escanear QR 2FA)',
              needed: true,
              reason: language === 'fr' ? 'Sert à scanner le QR d’activation de double facteur.' : language === 'en' ? 'Used to scan TOTP setup QR codes.' : 'Sirve para escanear el código QR al vincular tu 2FA.',
            },
            {
              id: 'p2',
              icon: 'gps',
              label: language === 'fr' ? 'Position GPS continue' : language === 'en' ? 'Continuous GPS' : 'GPS Continuo',
              needed: false,
              reason: language === 'fr' ? 'Les codes TOTP fonctionnent hors-ligne sans GPS.' : language === 'en' ? 'TOTP codes work offline without any location data.' : 'Los códigos TOTP funcionan sin internet ni GPS.',
            },
            {
              id: 'p3',
              icon: 'mic',
              label: language === 'fr' ? 'Microphone' : language === 'en' ? 'Microphone' : 'Micrófono',
              needed: false,
              reason: language === 'fr' ? 'Inutile pour générer des codes à 6 chiffres.' : language === 'en' ? 'Unneeded for generating 6-digit security codes.' : 'Innecesario para generar códigos de 6 dígitos.',
            },
            {
              id: 'p4',
              icon: 'contacts',
              label: language === 'fr' ? 'Lire les contacts' : language === 'en' ? 'Read Contacts' : 'Leer Contactos',
              needed: false,
              reason: language === 'fr' ? 'L’authentification est personnelle.' : language === 'en' ? '2FA authentication does not require contacts.' : 'La autenticación es personal y no usa tus contactos.',
            },
          ],
        },
      ],
    };

    const labels = {
      es: {
        title: 'Auditor de Permisos Móviles',
        subtitle: 'Activa solo permisos necesarios (Mínimo Privilegio)',
        verified: 'Editor Verificado',
        unverified: 'Fuente No Verificada',
        allow: 'Permitir',
        deny: 'Denegar',
        verifyBtn: 'Aplicar Configuración y Auditar',
        nextBtn: 'Siguiente App',
        perfectMsg: '¡Auditoría impecable! Aplicaste el principio de mínimo privilegio.',
        partialMsg: (ok: number, total: number) =>
          `Detectaste ${ok} de ${total} permisos correctamente. Revisa los detalles marcados en rojo.`,
        takeaway:
          'Una app solo debe recibir los permisos estrictamente necesarios para funcionar. Nunca entregues SMS, Contactos o GPS continuo a herramientas que no los necesitan.',
      },
      fr: {
        title: 'Auditeur de Permissions',
        subtitle: 'Active uniquement le strict nécessaire (Moindre Privilège)',
        verified: 'Éditeur Vérifié',
        unverified: 'Source Non Vérifiée',
        allow: 'Autoriser',
        deny: 'Refuser',
        verifyBtn: 'Valider les Permissions',
        nextBtn: 'Application Suivante',
        perfectMsg: 'Audit parfait ! Principe du moindre privilège respecté.',
        partialMsg: (ok: number, total: number) =>
          `${ok} sur ${total} permissions bien réglées. Vérifie les explications ci-dessous.`,
        takeaway:
          'N’accorde à une application que les autorisations indispensables à sa fonction. Refuse toujours l’accès aux SMS, contacts ou GPS permanent sans raison.',
      },
      en: {
        title: 'Mobile Permission Auditor',
        subtitle: 'Grant only strictly needed access (Least Privilege)',
        verified: 'Verified Publisher',
        unverified: 'Unverified Source',
        allow: 'Allow',
        deny: 'Deny',
        verifyBtn: 'Apply & Audit Permissions',
        nextBtn: 'Next App',
        perfectMsg: 'Spotless audit! You applied the principle of least privilege.',
        partialMsg: (ok: number, total: number) =>
          `Got ${ok} of ${total} permissions right. Review the highlighted reasons below.`,
        takeaway:
          'Only grant permissions directly required for an app’s core function. Never allow SMS, Contacts, or 24/7 GPS to apps that have no reason to use them.',
      },
    }[language];

    return { cases: casesByAge[ageGroup], labels };
  }, [ageGroup, language]);

  const [caseIdx, setCaseIdx] = useState(0);
  const [decisions, setDecisions] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(1);
  const [correctChecks, setCorrectChecks] = useState(0);
  const [totalChecks, setTotalChecks] = useState(0);
  const [finished, setFinished] = useState(false);

  const currentCase = copy.cases[caseIdx];

  const renderPermIcon = (icon: PermissionItem['icon']) => {
    switch (icon) {
      case 'camera':
        return <Camera className="w-5 h-5" />;
      case 'mic':
        return <Mic className="w-5 h-5" />;
      case 'gps':
        return <MapPin className="w-5 h-5" />;
      case 'contacts':
        return <Users className="w-5 h-5" />;
      case 'sms':
        return <MessageSquare className="w-5 h-5" />;
      case 'storage':
        return <HardDrive className="w-5 h-5" />;
    }
  };

  const togglePerm = (permId: string, val: boolean) => {
    if (submitted) return;
    playGameSound('tap');
    setDecisions((prev) => ({ ...prev, [permId]: val }));
  };

  const handleAudit = () => {
    let okCount = 0;
    currentCase.permissions.forEach((p) => {
      const userVal = decisions[p.id] ?? false;
      if (userVal === p.needed) okCount += 1;
    });

    const total = currentCase.permissions.length;
    const isPerfect = okCount === total;
    const nextCorrect = correctChecks + okCount;
    const nextTotal = totalChecks + total;

    setCorrectChecks(nextCorrect);
    setTotalChecks(nextTotal);
    setScore((prev) => prev + okCount * 35 + (isPerfect ? 40 : 0));

    if (isPerfect) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setMaxStreak((m) => Math.max(m, nextStreak));
      playGameSound(nextStreak > 1 ? 'combo' : 'correct');
    } else {
      setStreak(0);
      playGameSound('wrong');
    }

    setSubmitted(true);
  };

  const handleNext = () => {
    if (caseIdx < copy.cases.length - 1) {
      setCaseIdx((i) => i + 1);
      setDecisions({});
      setSubmitted(false);
    } else {
      playGameSound('win');
      setFinished(true);
    }
  };

  const handleReplay = () => {
    setCaseIdx(0);
    setDecisions({});
    setSubmitted(false);
    setScore(0);
    setStreak(0);
    setMaxStreak(1);
    setCorrectChecks(0);
    setTotalChecks(0);
    setFinished(false);
  };

  const accuracy = totalChecks > 0 ? Math.round((correctChecks / totalChecks) * 100) : 100;

  if (finished) {
    const stats: GameResultStats = {
      stars: computeStars(accuracy, ageGroup),
      accuracy,
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
        icon={<Smartphone className="w-5 h-5" />}
        accentColor="blue"
        ageGroup={ageGroup}
        currentStep={caseIdx + 1}
        totalSteps={copy.cases.length}
        score={score}
        streak={streak}
        accuracy={totalChecks > 0 ? accuracy : undefined}
      />

      {/* App Card */}
      <motion.div
        key={currentCase.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex-1 min-h-0 bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col justify-center gap-3.5"
      >
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl shrink-0">
              {currentCase.emoji}
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-slate-900 leading-snug break-words">
                {currentCase.appName}
              </h3>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs font-semibold mt-0.5">
                <span className="text-slate-500">{currentCase.category}</span>
                <span aria-hidden="true">·</span>
                {currentCase.verifiedPublisher ? (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    {copy.labels.verified}
                  </span>
                ) : (
                  <span className="text-rose-600 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                    {copy.labels.unverified}
                  </span>
                )}
              </div>
            </div>
          </div>
          <Sliders className="w-5 h-5 text-slate-300 shrink-0" />
        </div>

        {/* Permissions List */}
        <div className="space-y-2.5">
          {currentCase.permissions.map((perm) => {
            const val = decisions[perm.id] ?? false;
            const isCorrect = submitted && val === perm.needed;
            const isWrong = submitted && val !== perm.needed;

            return (
              <div
                key={perm.id}
                className={`p-3 rounded-2xl border transition-colors ${
                  isCorrect
                    ? 'bg-emerald-50/70 border-emerald-200'
                    : isWrong
                    ? 'bg-rose-50/70 border-rose-200'
                    : 'bg-slate-50 border-slate-200/80'
                }`}
              >
                <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                      {renderPermIcon(perm.icon)}
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug break-words">
                      {perm.label}
                    </span>
                  </div>

                  {/* Segmented Allow / Deny Switch */}
                  <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl shrink-0 ml-auto">
                    <button
                      type="button"
                      disabled={submitted}
                      onClick={() => togglePerm(perm.id, false)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer min-h-[38px] ${
                        !val
                          ? 'bg-rose-600 text-white shadow-2xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {copy.labels.deny}
                    </button>
                    <button
                      type="button"
                      disabled={submitted}
                      onClick={() => togglePerm(perm.id, true)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer min-h-[38px] ${
                        val
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {copy.labels.allow}
                    </button>
                  </div>
                </div>

                {submitted && (
                  <div className="mt-2 pt-2 border-t border-slate-200/70 flex items-start gap-2 text-xs font-medium">
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <span className={isCorrect ? 'text-emerald-900' : 'text-rose-900'}>
                      {perm.reason}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary Feedback */}
        {submitted && (
          <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 text-xs sm:text-sm font-semibold text-sky-950">
            {currentCase.permissions.every((p) => (decisions[p.id] ?? false) === p.needed)
              ? copy.labels.perfectMsg
              : copy.labels.partialMsg(
                  currentCase.permissions.filter((p) => (decisions[p.id] ?? false) === p.needed).length,
                  currentCase.permissions.length
                )}
          </div>
        )}
      </motion.div>

      {/* Primary Action */}
      {!submitted ? (
        <button
          type="button"
          onClick={handleAudit}
          className="w-full py-3.5 min-h-[48px] shrink-0 rounded-2xl font-bold text-sm sm:text-base bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition"
        >
          <ShieldCheck className="w-5 h-5" />
          <span>{copy.labels.verifyBtn}</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={handleNext}
          className="w-full py-3.5 min-h-[48px] shrink-0 rounded-2xl font-bold text-sm sm:text-base bg-gradient-to-r from-emerald-500 to-cyan-600 text-white shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition"
        >
          <span>{copy.labels.nextBtn}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
