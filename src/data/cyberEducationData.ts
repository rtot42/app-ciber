import { Language } from '../types';

export interface EducationConcept {
  id: string;
  category: 'privacidad' | 'contrasenas' | 'phishing' | 'redes' | 'dispositivos' | 'ia';
  categoryLabel: Record<Language, string>;
  categoryColor: string;
  icon: string;
  title: Record<Language, string>;
  subtitle: Record<Language, string>;
  metaphor: {
    emoji: string;
    concept: Record<Language, string>;
    analogy: Record<Language, string>;
  };
  explanation: Record<Language, string>;
  goldenRule: Record<Language, string>;
  realWorldScenario: {
    context: Record<Language, string>;
    whatHappens: Record<Language, string>;
    smartAction: Record<Language, string>;
  };
  quickQuiz: {
    question: Record<Language, string>;
    options: Array<{
      id: string;
      text: Record<Language, string>;
      isCorrect: boolean;
      feedback: Record<Language, string>;
    }>;
  };
  xpReward: number;
}

export const CYBER_CONCEPTS_DATA: EducationConcept[] = [
  {
    id: 'concept-digital-footprint',
    category: 'privacidad',
    categoryLabel: {
      es: 'Privacidad & Identidad',
      fr: 'Vie Privée & Identité',
      en: 'Privacy & Identity',
    },
    categoryColor: '#0ea5e9',
    icon: 'Footprints',
    title: {
      es: 'La Huella Digital',
      fr: "L'Empreinte Numérique",
      en: 'The Digital Footprint',
    },
    subtitle: {
      es: 'El rastro invisible que dejas al navegar por Internet',
      fr: 'La trace invisible que tu laisses sur Internet',
      en: 'The invisible trail you leave while browsing the web',
    },
    metaphor: {
      emoji: '👣',
      concept: {
        es: 'Caminar sobre arena mojada o nieve fresca',
        fr: 'Marcher sur du sable mouillé ou de la neige fraîche',
        en: 'Walking on wet sand or fresh snow',
      },
      analogy: {
        es: 'Cada foto que subes, video que comentas o búsqueda que haces deja una marca visible. Aunque borres una publicación, alguien pudo haberle tomado captura o guardado una copia.',
        fr: 'Chaque photo, commentaire ou recherche laisse une trace. Même si tu supprimes un message, quelqu’un a pu en faire une capture.',
        en: 'Every photo you post, comment you leave, or search you make leaves a mark. Even if you delete it, someone might have screenshotted it.',
      },
    },
    explanation: {
      es: 'Tu huella digital es tu reputación en línea. Las cosas buenas que compartes (como un dibujo o un proyecto) suman puntos positivos, pero fotos privadas o insultos pueden quedarse para siempre en servidores de Internet.',
      fr: "Ton empreinte numérique est ta réputation en ligne. Les choses positives créent une belle image, mais les erreurs ou infos privées peuvent rester en ligne pour toujours.",
      en: 'Your digital footprint is your online reputation. Positive creations build your future, while private details or hurtful words can remain on web servers indefinitely.',
    },
    goldenRule: {
      es: 'La prueba de la abuela: Antes de publicar o enviar una foto o mensaje, pregúntate si te daría orgullo que tu abuela o tu maestro de escuela lo leyeran.',
      fr: 'Le test de la grand-mère : Avant de publier, demande-toi si tu serais fier si ta grand-mère ou ton enseignant le voyait demain.',
      en: "The Grandma Test: Before posting, ask yourself if you'd be proud if your grandma or teacher saw it on a billboard.",
    },
    realWorldScenario: {
      context: {
        es: 'En TikTok o Instagram con tus amigos',
        fr: 'Sur TikTok ou Instagram avec des amis',
        en: 'On TikTok or Instagram with friends',
      },
      whatHappens: {
        es: 'Quieres grabar un baile gracioso afuera de tu casa mostrando el cartel con el nombre de tu calle y tu uniforme del colegio.',
        fr: 'Tu veux filmer une danse devant chez toi montrant le nom de ta rue et le logo de ton école.',
        en: 'You want to film a dance outside your house showing your street name sign and school uniform crest.',
      },
      smartAction: {
        es: '¡Alto guardián! Graba adentro o con un fondo neutro sin señales de tu dirección ni escudo escolar para proteger tu ubicación real.',
        fr: 'Stop cyber-gardien ! Filme avec un fond neutre sans panneau de rue ni uniforme pour protéger ton adresse réelle.',
        en: 'Cyber Guard halt! Record against a neutral wall without street signs or school logos to keep your location private.',
      },
    },
    quickQuiz: {
      question: {
        es: '¿Qué pasa cuando borras una foto o mensaje que subiste a una red social pública?',
        fr: 'Que se passe-t-il quand tu supprimes une photo d’un réseau public ?',
        en: 'What happens when you delete a photo from a public social network?',
      },
      options: [
        {
          id: 'opt-1',
          text: {
            es: 'Desaparece para siempre del universo en 1 segundo.',
            fr: 'Elle disparaît pour toujours de l’univers en 1 seconde.',
            en: 'It vanishes forever from the universe in 1 second.',
          },
          isCorrect: false,
          feedback: {
            es: '¡Cuidado! Otras personas o los servidores pudieron guardar copias o capturas antes de borrarla.',
            fr: 'Attention ! Quelqu’un a pu faire une capture ou le serveur a pu garder une copie.',
            en: 'Careful! Others or servers may have saved screenshots or cached copies before deletion.',
          },
        },
        {
          id: 'opt-2',
          text: {
            es: 'Puede seguir existiendo si alguien tomó captura de pantalla o la descargó.',
            fr: 'Elle peut encore exister si quelqu’un l’a capturée ou téléchargée.',
            en: 'It may still exist if someone took a screenshot or downloaded it.',
          },
          isCorrect: true,
          feedback: {
            es: '¡Exacto! Por eso siempre debemos pensar dos veces antes de subir algo.',
            fr: 'Exactement ! Voilà pourquoi il faut toujours réfléchir avant de publier.',
            en: 'Spot on! That is why we must always think twice before publishing.',
          },
        },
      ],
    },
    xpReward: 15,
  },
  {
    id: 'concept-fortress-passwords',
    category: 'contrasenas',
    categoryLabel: {
      es: 'Contraseñas & Seguridad',
      fr: 'Mots de Passe & Sécurité',
      en: 'Passwords & Security',
    },
    categoryColor: '#a855f7',
    icon: 'KeyRound',
    title: {
      es: 'Contraseñas Fortaleza',
      fr: 'Mots de Passe Forteresse',
      en: 'Fortress Passwords',
    },
    subtitle: {
      es: 'Cómo blindar tus cuentas de juego y correo como una caja fuerte',
      fr: 'Comment blinder tes comptes de jeu comme un coffre-fort',
      en: 'How to lock your gaming and email accounts like an armored vault',
    },
    metaphor: {
      emoji: '🪥',
      concept: {
        es: 'Tu contraseña es como tu cepillo de dientes',
        fr: 'Ton mot de passe est comme ta brosse à dents',
        en: 'Your password is like your toothbrush',
      },
      analogy: {
        es: '1. Eliges uno bueno. 2. ¡NO lo compartes con tus amigos ni compañeros! 3. Lo cambias de vez en cuando para mantenerte protegido.',
        fr: '1. Tu en choisis un bon. 2. Tu ne le prêtes JAMAIS aux copains. 3. Tu le changes régulièrement.',
        en: '1. Choose a good one. 2. NEVER share it with friends or classmates! 3. Change it from time to time.',
      },
    },
    explanation: {
      es: 'Los programas maliciosos pueden adivinar contraseñas como "123456" o "messi2026" en medio segundo. El truco maestro de los expertos es usar una "Frase Secreta" combinando 3 palabras divertidas con números y símbolos.',
      fr: 'Les pirates peuvent deviner un mot de passe simple en 1 seconde. L’astuce des pros est d’utiliser une "Phrase secrète" de 3 mots loufoques avec chiffres et symboles.',
      en: 'Robots can crack basic passwords like "123456" in less than a second. The cyber pro trick is creating a passphrase: 3 fun unrelated words with numbers and symbols.',
    },
    goldenRule: {
      es: 'Fórmula Fortaleza: 3 palabras que solo tú recuerdes + un número + un símbolo (Ejemplo: Galleta!NinjaVolador#42). ¡Irrompible!',
      fr: 'Formule Forteresse : 3 mots insolites + un chiffre + un symbole (Ex: Pizza!NinjaBleu#88). Inviolable !',
      en: 'Vault Formula: 3 quirky words + a number + a symbol (e.g., Flying!CookieTaco#99). Unbreakable!',
    },
    realWorldScenario: {
      context: {
        es: 'En Roblox o Minecraft jugando con un amigo',
        fr: 'Sur Roblox ou Minecraft avec un ami',
        en: 'In Roblox or Minecraft playing with a friend',
      },
      whatHappens: {
        es: 'Un compañero te dice: "Pásame tu contraseña para meterte una skin épica que tengo en mi cuenta".',
        fr: 'Un copain te dit : "Donne-moi ton passe pour que je t’ajoute un skin rare !"',
        en: 'A friend asks: "Give me your password so I can log in and gift you a rare skin!"',
      },
      smartAction: {
        es: '¡Nunca compartas tu clave! Si su cuenta se hackea, perderán las dos. Ofrécele hacer intercambio por el sistema oficial del juego.',
        fr: 'Ne donne jamais ton mot de passe ! S’il se fait pirater, vos deux comptes seront perdus.',
        en: 'Never give your password! If his device gets infected, both accounts are compromised.',
      },
    },
    quickQuiz: {
      question: {
        es: '¿Cuál de estas contraseñas es la más segura y difícil de hackear?',
        fr: 'Lequel de ces mots de passe est le plus sécurisé et difficile à pirater ?',
        en: 'Which of these passwords is the strongest and hardest to crack?',
      },
      options: [
        {
          id: 'opt-1',
          text: {
            es: 'MiNombre2026',
            fr: 'MonPrenom2026',
            en: 'MyName2026',
          },
          isCorrect: false,
          feedback: {
            es: 'Muy fácil: los piratas prueban nombres y años primero.',
            fr: 'Trop simple : les robots testent les prénoms et années en premier.',
            en: 'Too easy: attackers guess personal names and years first.',
          },
        },
        {
          id: 'opt-2',
          text: {
            es: 'Cohete!SandiaAzul#77',
            fr: 'Fusee!PastequeVerte#77',
            en: 'Rocket!BlueMelon#77',
          },
          isCorrect: true,
          feedback: {
            es: '¡Excelente! Larga, impredecible y con símbolos especiales.',
            fr: 'Bravo ! Long, imprévisible et avec des symboles spéciaux.',
            en: 'Awesome! Long, unpredictable, and mixed with special characters.',
          },
        },
      ],
    },
    xpReward: 15,
  },
  {
    id: 'concept-phishing-traps',
    category: 'phishing',
    categoryLabel: {
      es: 'Detección de Engaños',
      fr: 'Détection des Pièges',
      en: 'Phishing Defense',
    },
    categoryColor: '#f59e0b',
    icon: 'FishSymbol',
    title: {
      es: 'El Anzuelo del Phishing',
      fr: "L'Hameçonnage (Phishing)",
      en: 'The Phishing Hook',
    },
    subtitle: {
      es: 'Cómo desenmascarar mensajes falsos que buscan engañarte',
      fr: 'Comment démasquer les faux messages qui veulent te piéger',
      en: 'How to unmask fake messages designed to trick you',
    },
    metaphor: {
      emoji: '🎣',
      concept: {
        es: 'El cebo brillante de un pescador en el lago',
        fr: "L'appât brillant d'un pêcheur dans le lac",
        en: 'The shiny bait of a fisherman in a lake',
      },
      analogy: {
        es: 'El pez ve algo brillante y muerde sin pensar. Los ciberdelincuentes usan "cebos" como regalos gratis, monedas de juego o alertas falsas de emergencia para que hagas clic en su trampa.',
        fr: 'Le poisson mord à l’hameçon brillant. Les pirates font pareil avec des cadeaux gratuits ou des fausses urgences pour que tu cliques.',
        en: 'A fish bites shiny bait without thinking. Cyber scammers do the same with free gifts, game currencies, or urgent panic alerts.',
      },
    },
    explanation: {
      es: 'El phishing es cuando alguien finge ser una empresa conocida (como Google, Roblox, PlayStation o tu banco) para que escribas tu usuario y contraseña en una página falsa idéntica a la real.',
      fr: "Le phishing est quand quelqu'un imite un service connu (Roblox, Google, YouTube) pour te faire entrer tes identifiants sur une fausse page.",
      en: 'Phishing happens when scammers pretend to be a brand you trust (like YouTube, Roblox, or Epic Games) to trick you into entering credentials on a clone page.',
    },
    goldenRule: {
      es: 'La regla de los 3 segundos: Desconfía de la URGENCIA ("¡Hazlo ya o pierdes tu cuenta!") y de los REGALOS MÁGICOS ("¡5000 monedas gratis aquí!").',
      fr: 'Règle des 3 secondes : Méfie-toi de l’URGENCE ("Fais-le vite ou compte bloqué !") et des CADEAUX MAGIQUES.',
      en: 'The 3-Second Rule: Distrust extreme URGENCY ("Act now or lose your account!") and MAGICAL GIFTS ("Free V-Bucks here!").',
    },
    realWorldScenario: {
      context: {
        es: 'En un chat de Discord o mensaje privado de juego',
        fr: 'Dans un message privé Discord ou chat de jeu',
        en: 'In a Discord DM or in-game chat',
      },
      whatHappens: {
        es: 'Te llega un mensaje con un enlace que dice "robl0x-free-robux-gift.com" y te pide iniciar sesión con tu cuenta para reclamar tu premio.',
        fr: 'Tu reçois un lien "robl0x-free-robux-gift.com" te demandant tes identifiants pour recevoir des gemmes gratuites.',
        en: 'You receive a link "robl0x-free-robux-gift.com" asking you to log in to claim a $50 gift card.',
      },
      smartAction: {
        es: '¡Mira las letras! Dice "robl0x" con un cero, no es el sitio oficial. Nunca entres tus datos en enlaces recibidos por mensaje.',
        fr: 'Regarde l’adresse ! Il y a un zéro à la place du "o". C’est un faux site, ne clique jamais.',
        en: 'Notice the spelling! It has a zero instead of an "o". It is an imitation site. Never enter logins from random links.',
      },
    },
    quickQuiz: {
      question: {
        es: 'Si un mensaje te dice "¡Tu cuenta será cerrada en 5 minutos si no haces clic aquí!", ¿qué debes hacer?',
        fr: 'Si un message dit "Ton compte sera supprimé dans 5 min si tu ne cliques pas ici !", que fais-tu ?',
        en: 'If a message says "Your account will be deleted in 5 minutes unless you click here!", what should you do?',
      },
      options: [
        {
          id: 'opt-1',
          text: {
            es: 'Hacer clic rapidísimo para no perder mis cosas.',
            fr: 'Cliquer super vite pour ne pas perdre mes données.',
            en: 'Click immediately in panic so I do not lose my items.',
          },
          isCorrect: false,
          feedback: {
            es: '¡Eso es lo que quiere el atacante! El pánico te hace cometer errores.',
            fr: 'C’est le piège ! La panique te fait cliquer sur le danger.',
            en: 'That is the trap! Panic makes you overlook danger.',
          },
        },
        {
          id: 'opt-2',
          text: {
            es: 'Cerrar el mensaje, no tocar el enlace y consultar con un adulto.',
            fr: 'Fermer le message, ne rien toucher et demander à un adulte.',
            en: 'Close the message, do not touch the link, and show an adult.',
          },
          isCorrect: true,
          feedback: {
            es: '¡Excelente ciberdefensa! Las empresas serias no amenazan con borrarte la cuenta en minutos.',
            fr: 'Bravo ! Les vrais services ne menacent jamais de fermer ton compte en quelques minutes.',
            en: 'Outstanding cyber defense! Real services never threaten sudden account deletion in minutes.',
          },
        },
      ],
    },
    xpReward: 15,
  },
  {
    id: 'concept-online-strangers',
    category: 'redes',
    categoryLabel: {
      es: 'Amistades & Redes',
      fr: 'Amis & Réseaux',
      en: 'Online Friends & Chats',
    },
    categoryColor: '#10b981',
    icon: 'Users',
    title: {
      es: 'Amigos Virtuales vs Reales',
      fr: 'Amis Virtuels vs Réels',
      en: 'Online Friends vs Real Friends',
    },
    subtitle: {
      es: 'La máscara digital y cómo interactuar seguro en multijugador',
      fr: 'Le masque numérique et les bons réflexes en multijoueur',
      en: 'The digital mask and smart multiplayer safety rules',
    },
    metaphor: {
      emoji: '🎭',
      concept: {
        es: 'Una fiesta de disfraces donde todos usan máscara',
        fr: 'Une fête costumée où tout le monde porte un masque',
        en: 'A costume party where everyone wears a full mask',
      },
      analogy: {
        es: 'En internet, cualquiera puede ponerse el disfraz que quiera: una foto de niño simpático, un nombre tierno o decir que tiene tu misma edad. Por eso tratamos a los contactos de juegos con respeto pero con prudencia.',
        fr: 'En ligne, n’importe qui peut prétendre avoir ton âge. On peut jouer ensemble, mais sans jamais révéler sa vraie vie.',
        en: 'Online, anyone can wear any mask: a cartoon picture, a friendly tone, or claim to be a 10-year-old. Play as a team, but keep personal life secret.',
      },
    },
    explanation: {
      es: 'Jugar en equipo o competir online es súper divertido. La regla de oro es mantener la amistad dentro del juego y nunca trasladarla a llamadas privadas, redes personales o encuentros físicos.',
      fr: 'Jouer en ligne est génial ! Mais l’amitié doit rester dans le jeu : pas d’appels vidéo privés, pas de numéros de téléphone et jamais de rendez-vous.',
      en: 'Multiplayer games are great fun! The golden boundary is keeping gaming friends inside the game—never sharing private phone numbers or agreeing to meet in person.',
    },
    goldenRule: {
      es: 'Información Escudo: Tus 4 datos sagrados que NUNCA das en un juego son: Nombre completo, Colegio, Dirección y Teléfono.',
      fr: 'Les 4 Trésors Sacrés à ne JAMAIS donner en jeu : Nom de famille, École, Adresse et Numéro de téléphone.',
      en: 'The 4 Sacred Shields you NEVER share in games: Full real name, School name, Home address, and Phone number.',
    },
    realWorldScenario: {
      context: {
        es: 'En una partida multijugador con chat de voz o texto',
        fr: 'Dans une partie en ligne avec chat vocal ou texte',
        en: 'In an online match with voice or text chat',
      },
      whatHappens: {
        es: 'Un jugador con el que has jugado varias partidas te dice: "Eres muy bueno, pásame tu número de WhatsApp para llamarte cuando juegue".',
        fr: 'Un joueur sympa te dit : "Donne-moi ton WhatsApp pour qu’on s’appelle en direct".',
        en: 'A fellow player says: "You are great, give me your private WhatsApp so I can call you anytime".',
      },
      smartAction: {
        es: 'Dile amablemente: "Prefiero chatear solo por aquí en el juego". Si insiste o se pone pesado, usa la opción Silenciar/Bloquear.',
        fr: 'Réponds gentiment : "Je préfère jouer et discuter uniquement ici dans le jeu". S’il insiste, bloque-le.',
        en: 'Politely decline: "I only chat inside the game platform". If they insist or get pushy, mute or block them.',
      },
    },
    quickQuiz: {
      question: {
        es: '¿Cuáles datos puedes compartir libremente con un nuevo amigo en un juego online?',
        fr: 'Quelles infos peux-tu partager avec un ami rencontré dans un jeu ?',
        en: 'Which information is safe to share with a new friend inside an online game?',
      },
      options: [
        {
          id: 'opt-1',
          text: {
            es: 'Tu apodo de jugador (nickname), tus tácticas y qué personaje te gusta.',
            fr: 'Ton pseudo de jeu, tes stratégies et tes personnages favoris.',
            en: 'Your gaming nickname, match tactics, and favorite character class.',
          },
          isCorrect: true,
          feedback: {
            es: '¡Perfecto! Eso te permite divertirte sin poner en riesgo tu seguridad ni la de tu familia.',
            fr: 'Parfait ! Tu t’amuses en équipe sans compromettre ta sécurité.',
            en: 'Perfect! You enjoy teamwork without putting your physical safety at risk.',
          },
        },
        {
          id: 'opt-2',
          text: {
            es: 'El nombre de tu escuela y la calle donde vives.',
            fr: 'Le nom de ton école et ta rue pour qu’il voie où tu habites.',
            en: 'Your school name and street address so they know where you live.',
          },
          isCorrect: false,
          feedback: {
            es: '¡Peligro! Esos son datos privados que nadie desconocido debe saber.',
            fr: 'Danger ! Ces informations privées ne doivent jamais être partagées avec des inconnus.',
            en: 'Danger! Those are private physical location details that strangers must never know.',
          },
        },
      ],
    },
    xpReward: 15,
  },
  {
    id: 'concept-public-wifi',
    category: 'dispositivos',
    categoryLabel: {
      es: 'Dispositivos & Redes',
      fr: 'Appareils & Réseaux',
      en: 'Devices & Wi-Fi',
    },
    categoryColor: '#0284c7',
    icon: 'Wifi',
    title: {
      es: 'Peligros del Wi-Fi Público',
      fr: 'Les Dangers du Wi-Fi Public',
      en: 'Public Wi-Fi Traps',
    },
    subtitle: {
      es: 'Por qué no debes conectarte a redes abiertas sin contraseña',
      fr: 'Pourquoi éviter les réseaux sans mot de passe dans les lieux publics',
      en: 'Why open networks without passwords carry hidden risks',
    },
    metaphor: {
      emoji: '📢',
      concept: {
        es: 'Hablar con un megáfono en una plaza llena de gente',
        fr: 'Parler dans un mégaphone sur une place bondée',
        en: 'Speaking through a megaphone in a crowded city square',
      },
      analogy: {
        es: 'Cuando te conectas a un Wi-Fi abierto de una cafetería o parque sin clave, lo que envías viaja por el aire sin candado. Una persona con malas intenciones en el mismo lugar podría "escuchar" lo que pasa.',
        fr: 'Sur un Wi-Fi public sans mot de passe, tes données voyagent à l’air libre. N’importe qui sur le même réseau peut potentiellement observer le trafic.',
        en: 'On open Wi-Fi with no encryption password, your data travels unprotected. A malicious eavesdropper on the same network can intercept unencrypted data.',
      },
    },
    explanation: {
      es: 'Los ciberdelincuentes a veces crean redes falsas con nombres como "WiFi_Gratis_Plaza" para que la gente se conecte e intentar robar contraseñas o meter virus en sus teléfonos.',
      fr: 'Les pirates créent parfois de faux réseaux comme "WiFi_Gratuit" pour inciter les gens à se connecter et voler leurs données.',
      en: 'Attackers sometimes set up rogue hotspots named "Free_Mall_WiFi" to bait people into connecting and harvesting credentials.',
    },
    goldenRule: {
      es: 'Si estás fuera de casa: Es mejor usar los datos móviles de tu familia o esperar a llegar a tu hogar antes de meter contraseñas sensibles.',
      fr: 'En dehors de la maison : utilise le forfait mobile familial ou attends d’être chez toi pour te connecter à des comptes importants.',
      en: 'Outside home: rely on family cellular data or wait until you are back on your trusted home Wi-Fi before logging into sensitive accounts.',
    },
    realWorldScenario: {
      context: {
        es: 'En un centro comercial o aeropuerto',
        fr: 'Dans un centre commercial ou une gare',
        en: 'In a shopping mall or train station',
      },
      whatHappens: {
        es: 'Ves una red sin clave llamada "INTERNET_LIBRE_AQUI" y quieres comprar monedas de juego con la tarjeta de tu mamá.',
        fr: 'Tu vois un réseau ouvert "INTERNET_LIBRE" et veux acheter un pass de jeu avec la carte bancaire familiale.',
        en: 'You see an open network named "FREE_SUPER_INTERNET" and want to buy game items using a family payment card.',
      },
      smartAction: {
        es: '¡Alto guardián! Jamás hagas pagos ni metas contraseñas en redes abiertas. Espera a estar en tu red de casa segura.',
        fr: 'Attention ! Ne saisis jamais d’informations de paiement sur un réseau public inconnu.',
        en: 'Hold up! Never enter payment cards or passwords on untrusted public Wi-Fi.',
      },
    },
    quickQuiz: {
      question: {
        es: '¿Para qué es seguro usar un Wi-Fi público de un café o parque?',
        fr: 'Quelle action est sans danger sur un Wi-Fi public ?',
        en: 'What activity is generally safe to do on a public open Wi-Fi network?',
      },
      options: [
        {
          id: 'opt-1',
          text: {
            es: 'Buscar información para una tarea escolar o leer un artículo de noticias.',
            fr: 'Chercher des informations scolaires ou lire un article d’actualité.',
            en: 'Reading a public Wikipedia article or checking the weather forecast.',
          },
          isCorrect: true,
          feedback: {
            es: '¡Correcto! Leer información pública no compromete tus contraseñas privadas.',
            fr: 'Exact ! Consulter du contenu public ne met pas en danger tes comptes.',
            en: 'Correct! Browsing public info does not risk your private credentials.',
          },
        },
        {
          id: 'opt-2',
          text: {
            es: 'Cambiar la contraseña de tu correo y comprar un juego nuevo.',
            fr: 'Changer le mot de passe de ton e-mail et faire un achat.',
            en: 'Changing your primary email password and making an online purchase.',
          },
          isCorrect: false,
          feedback: {
            es: '¡Nunca! Las contraseñas y pagos deben hacerse solo en redes privadas protegidas.',
            fr: 'Jamais ! Les opérations sensibles se font uniquement sur un réseau privé de confiance.',
            en: 'Never! Passwords and payments must only be handled on trusted, encrypted home networks.',
          },
        },
      ],
    },
    xpReward: 15,
  },
  {
    id: 'concept-ai-deepfakes',
    category: 'ia',
    categoryLabel: {
      es: 'Inteligencia Artificial',
      fr: 'Intelligence Artificielle',
      en: 'AI & Deepfakes',
    },
    categoryColor: '#6366f1',
    icon: 'Bot',
    title: {
      es: 'Inteligencia Artificial y Deepfakes',
      fr: 'Intelligence Artificielle & Deepfakes',
      en: 'AI & Deepfakes',
    },
    subtitle: {
      es: 'Cómo distinguir lo que es real de lo creado por una computadora',
      fr: 'Comment distinguer le vrai du faux généré par ordinateur',
      en: 'How to separate genuine reality from computer-generated media',
    },
    metaphor: {
      emoji: '🤖',
      concept: {
        es: 'El clon o doble robótico de las películas de superhéroes',
        fr: 'Le clone ou sosie robotique des films de super-héros',
        en: 'The robot clone disguise from superhero movies',
      },
      analogy: {
        es: 'Hoy los programas de IA pueden imitar la voz de una persona o pegar la cara de un actor en el cuerpo de otra persona con un realismo impresionante.',
        fr: 'Aujourd’hui, les logiciels d’IA peuvent cloner la voix de quelqu’un ou coller un visage sur un autre corps de façon très réaliste.',
        en: 'Today AI tools can clone real human voices or swap faces onto other video footage with surprising realism.',
      },
    },
    explanation: {
      es: 'Los "Deepfakes" son videos, fotos o audios falsos creados con inteligencia artificial. Aunque se usan para efectos de cine o filtros divertidos, también pueden usarse para inventar noticias falsas o hacer bromas pesadas.',
      fr: 'Les "Deepfakes" sont des médias truqués par IA. Utilisés pour le cinéma ou les filtres, ils peuvent aussi servir à créer des rumeurs ou tromper les gens.',
      en: 'Deepfakes are synthetic videos, photos, or voice clips generated by AI. While fun for movies and filters, they can be weaponized to spread rumors or scam people.',
    },
    goldenRule: {
      es: 'Mira los detalles: Los deepfakes suelen fallar en los dedos de las manos, el parpadeo de los ojos, bordes borrosos en el cabello o dientes que se ven extraños.',
      fr: 'Observe les détails : Les deepfakes ont souvent du mal avec les doigts des mains, le clignement des yeux et les contours flous des cheveux.',
      en: 'Inspect the micro-details: AI visuals often struggle with extra fingers, unnatural blinking, warped backgrounds, or blurry hairline edges.',
    },
    realWorldScenario: {
      context: {
        es: 'En TikTok o YouTube Shorts',
        fr: 'Sur TikTok ou YouTube Shorts',
        en: 'On TikTok or YouTube Shorts',
      },
      whatHappens: {
        es: 'Ves un video donde tu influencer favorito o un actor famoso supuestamente dice que regalará iPhones a quien deposite 10 dólares en un enlace.',
        fr: 'Tu vois une vidéo où ton créateur préféré semble promettre des consoles gratuites contre 10 €.',
        en: 'You see a video where a famous creator appears to announce free gaming consoles if you transfer $10 to a website link.',
      },
      smartAction: {
        es: '¡Es una voz clonada por IA! Los famosos no piden dinero para dar regalos. Busca en su canal oficial y verás que no existe tal concurso.',
        fr: 'C’est un deepfake ! Les célébrités ne demandent jamais d’argent pour faire des cadeaux.',
        en: 'It is an AI voice clone! Legitimate creators never ask for upfront payments to claim giveaways.',
      },
    },
    quickQuiz: {
      question: {
        es: 'Si ves un video en internet que parece real pero dice algo súper escandaloso o pide dinero, ¿qué debes hacer?',
        fr: 'Si une vidéo spectaculaire demande de l’argent ou diffuse une folle rumeur, que fais-tu ?',
        en: 'If an online video seems real but makes an outrageous claim or demands money, what is your reaction?',
      },
      options: [
        {
          id: 'opt-1',
          text: {
            es: 'Creerlo al 100% porque si sale en video es imposible que sea falso.',
            fr: 'Y croire à 100% car la vidéo ne peut pas mentir.',
            en: 'Believe it 100% because if it is in video format it cannot be fake.',
          },
          isCorrect: false,
          feedback: {
            es: '¡Cuidado! Hoy en día crear videos y audios falsos con IA es muy fácil.',
            fr: 'Attention ! Les outils d’IA peuvent aujourd’hui créer des vidéos très trompeuses.',
            en: 'Watch out! Modern AI can synthesize deceptive videos and voice tracks with ease.',
          },
        },
        {
          id: 'opt-2',
          text: {
            es: 'Dudar, revisar fuentes oficiales confiables y preguntar a un adulto.',
            fr: 'Douter, vérifier sur des sources officielles et demander à un adulte.',
            en: 'Stay skeptical, cross-check official news sources, and ask a trusted adult.',
          },
          isCorrect: true,
          feedback: {
            es: '¡Excelente mente crítica! Esa es la mejor arma de un CiberGuardián.',
            fr: 'Super esprit critique ! C’est la meilleure arme d’un cyber-gardien.',
            en: 'Brilliant critical thinking! That is the ultimate shield of a digital guardian.',
          },
        },
      ],
    },
    xpReward: 15,
  },
];
