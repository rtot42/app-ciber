export interface CyberTip {
  id: string;
  category: 'passwords' | 'phishing' | 'privacy' | 'gaming' | 'ai' | 'downloads' | 'kindness' | 'wifi' | 'sharing';
  categoryLabel: { es: string; en: string; fr: string };
  categoryIcon: string;
  badgeColor: string;
  title: { es: string; en: string; fr: string };
  advice: { es: string; en: string; fr: string };
  goldenRule: { es: string; en: string; fr: string };
}

export const CYBER_TIPS_DATA: CyberTip[] = [
  {
    id: 'tip-phishing-rewards',
    category: 'phishing',
    categoryLabel: {
      es: 'Anti-Phishing',
      en: 'Anti-Phishing',
      fr: 'Anti-Hameçonnage',
    },
    categoryIcon: '🎣',
    badgeColor: '#0284c7', // sky-600
    title: {
      es: 'La trampa de las monedas y premios gratis',
      en: 'The Free Coins and Rewards Trap',
      fr: 'Le piège des pièces et récompenses gratuites',
    },
    advice: {
      es: 'Nadie regala Robux, V-Bucks o gemas por hacer clic en un enlace o llenar un formulario. Si te piden tu usuario o contraseña para darte un premio, ¡es un engaño para robar tu cuenta!',
      en: 'Nobody gives away free Robux, V-Bucks, or gems for clicking a link or filling out a form. If they ask for your username or password to claim a reward, it is a scam to steal your account!',
      fr: 'Personne ne donne de Robux, V-Bucks ou gemmes gratuits pour cliquer sur un lien. Si on vous demande vos identifiants pour un cadeau, c’est une arnaque pour voler votre compte !',
    },
    goldenRule: {
      es: 'Regla de Oro: Si parece demasiado bueno para ser verdad, ¡es una trampa!',
      en: 'Golden Rule: If it sounds too good to be true, it is a trap!',
      fr: 'Règle d’or : Si cela semble trop beau pour être vrai, c’est un piège !',
    },
  },
  {
    id: 'tip-passwords-passphrase',
    category: 'passwords',
    categoryLabel: {
      es: 'Contraseñas Fuertes',
      en: 'Strong Passwords',
      fr: 'Mots de passe forts',
    },
    categoryIcon: '🔑',
    badgeColor: '#8b5cf6', // purple-600
    title: {
      es: 'Frases locas en vez de una sola palabra',
      en: 'Crazy Phrases Instead of Single Words',
      fr: 'Des phrases folles plutôt qu’un seul mot',
    },
    advice: {
      es: 'Una contraseña como "123456" o tu nombre se hackea en 1 segundo. En su lugar, une 3 o 4 palabras divertidas con números y símbolos, como: "MiPerroBaila33!". ¡Será imposible de adivinar y fácil de recordar!',
      en: 'A password like "123456" or your name can be cracked in 1 second. Instead, join 3 or 4 fun words with numbers and symbols, like: "MyDogDances33!". It will be impossible to guess and easy to remember!',
      fr: 'Un mot de passe comme "123456" est piraté en 1 seconde. Assemblez plutôt 3 ou 4 mots amusants avec des chiffres et symboles : "MonChienDanse33!". Impossible à deviner et facile à retenir !',
    },
    goldenRule: {
      es: 'Regla de Oro: Tu contraseña es como tu cepillo de dientes: ¡no la compartas con nadie!',
      en: 'Golden Rule: Your password is like your toothbrush: never share it with anyone!',
      fr: 'Règle d’or : Votre mot de passe est comme votre brosse à dents : ne le partagez jamais !',
    },
  },
  {
    id: 'tip-privacy-personal-data',
    category: 'privacy',
    categoryLabel: {
      es: 'Privacidad Digital',
      en: 'Digital Privacy',
      fr: 'Confidentialité numérique',
    },
    categoryIcon: '🛡️',
    badgeColor: '#059669', // emerald-600
    title: {
      es: 'Tu escuela y tu casa son secretos de Estado',
      en: 'Your School and Home are State Secrets',
      fr: 'Votre école et votre maison sont des secrets d’État',
    },
    advice: {
      es: 'Nunca publiques fotos donde se vea el escudo de tu colegio, la placa de la calle donde vives o el número de tu casa. Las personas con malas intenciones pueden usar esos detalles para saber dónde encontrarte.',
      en: 'Never share photos showing your school logo, your street sign, or your house number. Strangers with bad intentions could use those clues to figure out where you are.',
      fr: 'Ne publiez jamais de photos montrant le logo de votre école ou le panneau de votre rue. Des personnes mal intentionnées pourraient les utiliser pour vous localiser.',
    },
    goldenRule: {
      es: 'Regla de Oro: Antes de subir una foto, revisa qué cosas personales se ven en el fondo.',
      en: 'Golden Rule: Before uploading a photo, check what personal details show in the background.',
      fr: 'Règle d’or : Avant de poster une photo, vérifiez les détails visibles en arrière-plan.',
    },
  },
  {
    id: 'tip-gaming-chat-safety',
    category: 'gaming',
    categoryLabel: {
      es: 'Gaming Seguro',
      en: 'Safe Gaming',
      fr: 'Jeu vidéo sécurisé',
    },
    categoryIcon: '🎮',
    badgeColor: '#f59e0b', // amber-600
    title: {
      es: 'Amigos del juego no son amigos de la vida real',
      en: 'Game Friends Aren’t Real Life Friends',
      fr: 'Les amis de jeu ne sont pas des amis réels',
    },
    advice: {
      es: 'Alguien que conoces en una partida online puede mentir sobre su edad, su nombre o sus intenciones. Si te pide tu número de WhatsApp, tu Instagram o fotos tuyas, di "No, mis padres no me lo permiten" y bloquea.',
      en: 'Someone you meet in an online game can easily lie about their age or intentions. If they ask for your WhatsApp, Instagram, or photos, say "No, my parents do not allow that" and block them.',
      fr: 'Une personne rencontrée en ligne peut mentir sur son âge ou ses intentions. Si elle demande votre numéro personnel ou des photos, refusez et bloquez-la immédiatement.',
    },
    goldenRule: {
      es: 'Regla de Oro: Mantén las charlas dentro del juego y nunca pases a redes privadas.',
      en: 'Golden Rule: Keep game chats inside the game and never switch to private apps.',
      fr: 'Règle d’or : Gardez les échanges dans le jeu et ne basculez jamais sur des réseaux privés.',
    },
  },
  {
    id: 'tip-ai-deepfakes',
    category: 'ai',
    categoryLabel: {
      es: 'Inteligencia Artificial',
      en: 'Artificial Intelligence',
      fr: 'Intelligence Artificielle',
    },
    categoryIcon: '🤖',
    badgeColor: '#6366f1', // indigo-600
    title: {
      es: 'No todo lo que ves o escuchas es real',
      en: 'Not Everything You See or Hear is Real',
      fr: 'Tout ce que vous voyez ou entendez n’est pas réel',
    },
    advice: {
      es: 'Hoy en día existen programas de Inteligencia Artificial capaces de clonar la voz de tus amigos o crear videos falsos (deepfakes). Si recibes un audio pidiendo dinero o favores extraños, llama a esa persona para confirmar.',
      en: 'AI tools today can clone voices and generate convincing fake videos (deepfakes). If you receive an unusual audio asking for money or secrets, talk to that person directly to verify.',
      fr: 'L’IA peut aujourd’hui cloner des voix et créer de fausses vidéos (deepfakes). Si un message audio vous semble inhabituel ou réclame de l’argent, vérifiez auprès de la personne.',
    },
    goldenRule: {
      es: 'Regla de Oro: Acuerden una "Palabra Clave Secreta" familiar para emergencias reales.',
      en: 'Golden Rule: Agree on a secret family codeword for real emergency situations.',
      fr: 'Règle d’or : Définissez un "Mot de Passe Secret" familial pour les urgences réelles.',
    },
  },
  {
    id: 'tip-downloads-unofficial-mods',
    category: 'downloads',
    categoryLabel: {
      es: 'Descargas & Malware',
      en: 'Downloads & Malware',
      fr: 'Téléchargements & Virus',
    },
    categoryIcon: '💾',
    badgeColor: '#ef4444', // red-600
    title: {
      es: 'Cuidado con los mods y trucos piratas',
      en: 'Watch Out for Pirated Mods and Cheats',
      fr: 'Attention aux mods et triches piratés',
    },
    advice: {
      es: 'Ese archivo que promete "desbloquear todos los skins" o "trucos invencibles" suele contener troyanos o spyware que graban lo que escribes y espían tu cámara. Descarga solo desde tiendas o sitios oficiales.',
      en: 'That file promising "unlock all skins" or "invincibility cheats" often hides trojans or spyware designed to log your keystrokes or camera. Only download from official app stores.',
      fr: 'Ce fichier promettant des skins gratuits cache souvent des chevaux de Troie ou logiciels espions. Ne téléchargez que depuis les boutiques officielles vérifiées.',
    },
    goldenRule: {
      es: 'Regla de Oro: Antes de instalar cualquier archivo .exe, .apk o .zip, pide permiso a un adulto.',
      en: 'Golden Rule: Before opening any .exe, .apk, or .zip download, always ask an adult first.',
      fr: 'Règle d’or : Avant d’installer un fichier exécutable, demandez toujours l’accord d’un adulte.',
    },
  },
  {
    id: 'tip-public-wifi',
    category: 'wifi',
    categoryLabel: {
      es: 'Redes Wi-Fi',
      en: 'Wi-Fi Networks',
      fr: 'Réseaux Wi-Fi',
    },
    categoryIcon: '📶',
    badgeColor: '#0d9488', // teal-600
    title: {
      es: 'El peligro del Wi-Fi público sin contraseña',
      en: 'The Danger of Public Free Wi-Fi',
      fr: 'Le danger du Wi-Fi public sans mot de passe',
    },
    advice: {
      es: 'Las redes abiertas en centros comerciales, plazas o cafeterías pueden ser interceptadas por hackers para espiar lo que envías. Si te conectas a una red pública, nunca inicies sesión en cuentas importantes ni compres nada.',
      en: 'Open networks in shopping malls or cafes can be tapped by hackers to inspect your traffic. If you use public Wi-Fi, never log into sensitive accounts or make purchases.',
      fr: 'Les réseaux Wi-Fi ouverts peuvent être interceptés pour espionner vos communications. Sur un réseau public, évitez de vous connecter à vos comptes sensibles.',
    },
    goldenRule: {
      es: 'Regla de Oro: Desactiva "Conectar automáticamente a redes Wi-Fi abiertas" en tu móvil.',
      en: 'Golden Rule: Turn off "Auto-connect to open Wi-Fi" on your smartphone or tablet.',
      fr: 'Règle d’or : Désactivez la connexion automatique aux réseaux ouverts sur votre appareil.',
    },
  },
  {
    id: 'tip-kindness-digital-citizenship',
    category: 'kindness',
    categoryLabel: {
      es: 'Convivencia Digital',
      en: 'Digital Kindness',
      fr: 'Bienveillance numérique',
    },
    categoryIcon: '🤝',
    badgeColor: '#ec4899', // pink-600
    title: {
      es: 'No alimentes el ciberacoso en los grupos',
      en: 'Do Not Feed Cyberbullying in Groups',
      fr: 'Ne nourrissez pas le cyberharcèlement',
    },
    advice: {
      es: 'Si en un grupo de WhatsApp o Discord se burlan de alguien con memes crueles o lo expulsan a propósito, no te unas ni le des "me gusta". Tu silencio o una palabra de apoyo pueden salvar el día de esa persona.',
      en: 'If a group chat starts making cruel memes about someone or excludes them, don’t join in or hit like. Your support or a kind private message can make all the difference.',
      fr: 'Si des camarades se moquent de quelqu’un dans un groupe, ne participez pas et ne likez pas. Votre soutien ou un message bienveillant peut tout changer.',
    },
    goldenRule: {
      es: 'Regla de Oro: Si no lo dirías cara a cara con una sonrisa, no lo escribas en un chat.',
      en: 'Golden Rule: If you wouldn’t say it face-to-face with a smile, don’t send it in a chat.',
      fr: 'Règle d’or : Si vous ne le diriez pas en face avec bienveillance, ne l’écrivez pas.',
    },
  },
  {
    id: 'tip-digital-footprint',
    category: 'sharing',
    categoryLabel: {
      es: 'Huella Digital',
      en: 'Digital Footprint',
      fr: 'Empreinte numérique',
    },
    categoryIcon: '👣',
    badgeColor: '#84cc16', // lime-600
    title: {
      es: 'Internet tiene memoria de elefante',
      en: 'The Internet Has an Elephant’s Memory',
      fr: 'Internet a une mémoire d’éléphant',
    },
    advice: {
      es: 'Aunque borres una publicación o una historia temporal, cualquiera puede haber tomado una captura de pantalla en un segundo. Lo que subes hoy puede seguir en la red cuando tengas 25 años y busques trabajo.',
      en: 'Even if you delete a post or a 24h story, anyone could take a screenshot in half a second. What you post today might still live online years from now.',
      fr: 'Même si vous supprimez un message, quelqu’un a pu faire une capture d’écran. Ce que vous publiez aujourd’hui peut rester accessible pendant des années.',
    },
    goldenRule: {
      es: 'Regla de Oro: Aplica el test de la abuela: ¿te daría orgullo mostráselo a tu familia?',
      en: 'Golden Rule: Apply the grandma test: would you feel proud showing it to your grandparents?',
      fr: 'Règle d’or : Posez-vous la question : seriez-vous fier de le montrer à votre famille ?',
    },
  },
  {
    id: 'tip-two-factor-auth',
    category: 'passwords',
    categoryLabel: {
      es: 'Doble Seguridad',
      en: 'Two-Factor Security',
      fr: 'Double Sécurité',
    },
    categoryIcon: '🔐',
    badgeColor: '#10b981', // emerald-500
    title: {
      es: 'El escudo de la Verificación en 2 Pasos (2FA)',
      en: 'The 2-Step Verification Shield (2FA)',
      fr: 'Le bouclier de la double authentification',
    },
    advice: {
      es: 'Activar la verificación en 2 pasos es como ponerle dos candados diferentes a tu casillero: aunque alguien adivine tu contraseña, necesitará un código temporal en el teléfono de tus padres para entrar.',
      en: 'Enabling 2-Step Verification is like putting two locks on your locker: even if someone guesses your password, they cannot log in without a security code sent to your parent’s phone.',
      fr: 'Activer la double authentification, c’est mettre deux verrous sur votre porte : même avec votre mot de passe, un intrus ne peut pas entrer sans le code de sécurité.',
    },
    goldenRule: {
      es: 'Regla de Oro: Activa el 2FA en tu cuenta de Google, Roblox, PlayStation o Epic Games.',
      en: 'Golden Rule: Enable 2FA on your Google, Roblox, PlayStation, or Epic Games account.',
      fr: 'Règle d’or : Activez le 2FA sur vos comptes de jeux et de messagerie.',
    },
  },
];
