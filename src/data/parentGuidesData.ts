import { Language, ChildAgeGroup } from '../types';

export interface ParentGuide {
  id: string;
  category: 'gaming' | 'privacy' | 'phishing' | 'ai' | 'bullying' | 'passwords';
  icon: string;
  readTime: string;
  title: string;
  summary: string;
  realRisk: string;
  keyConcepts: string[];
  practicalSteps: string[];
  familyPrompt: string;
  goldenRule: string;
}

export interface ConversationTopic {
  id: string;
  category: string;
  icon: string;
  title: string;
  quote: string;
  context: string;
  idealMoment: string;
  whatToLookFor: string;
}

export interface AgePedagogyInfo {
  stageTitle: string;
  cognitiveTraits: string;
  keyChallenges: string[];
  recommendedAction: string;
  screenTimeRecommendation: string;
}

export interface DigitalAgreementItem {
  id: string;
  title: string;
  description: string;
  commitmentBy: 'both' | 'child' | 'parent';
  icon: string;
}

export const PARENT_GUIDES: Record<Language, ParentGuide[]> = {
  es: [
    {
      id: 'gaming-safety',
      category: 'gaming',
      icon: 'Gamepad2',
      readTime: '4 min',
      title: 'Roblox, Fortnite y Microtransacciones: Cómo Proteger a tus Hijos de Estafas',
      summary: 'Aprende cómo los ciberdelincuentes se aprovechan de la emoción del juego para engañar a menores con monedas virtuales y suscripciones trampa.',
      realRisk: 'Estafadores prometen "Robux o V-Bucks gratis" mediante sitios web falsos que roban cuentas completas, o manipulan a los niños por chat de voz para que gasten dinero real de las tarjetas familiares vinculadas.',
      keyConcepts: [
        'Dark Patterns: Diseños en juegos pensados para incentivar compras impulsivas.',
        'Ingeniería Social en Chats: Adultos que se ganan la confianza de menores regalando ítems virtuales.',
        'Robo de Cuentas: Enlaces en Discord o chats de juego que clonan páginas oficiales.',
      ],
      practicalSteps: [
        'Activa el PIN de Control Parental en la consola o app store para exigir contraseña en cada compra.',
        'Configura la privacidad de chat en "Solo amigos verificados" y desactiva el chat de voz con desconocidos.',
        'Desvincula tarjetas de crédito; si desean comprar, utiliza tarjetas prepago con saldo limitado.',
        'Establece la regla: "Cualquier persona que te pida tu contraseña o correo para regalarte algo es un estafador".',
      ],
      familyPrompt: '¿Qué harías si un amigo del juego te pide tus datos de acceso diciendo que te subirá de nivel gratis?',
      goldenRule: 'Nunca vincules una tarjeta de crédito sin autenticación biométrica o PIN obligatorio en cada transacción.',
    },
    {
      id: 'privacy-footprint',
      category: 'privacy',
      icon: 'Camera',
      readTime: '3 min',
      title: 'Huella Digital y Sharenting: Los Peligros de Compartir Fotos en Redes',
      summary: 'El impacto a largo plazo de las imágenes publicadas y cómo los metadatos ocultos en fotografías revelan la ubicación de tu hogar.',
      realRisk: 'Cada foto tomada con un smartphone puede almacenar coordenadas GPS exactas (metadatos EXIF). Además, insignias escolares, placas de vehículos y la fachada de casa permiten a extraños perfilar la rutina diaria del niño.',
      keyConcepts: [
        'Sharenting: Sobreexposición de la vida de los hijos en redes sociales por parte de padres o familiares.',
        'Metadatos EXIF: Información oculta en archivos de imagen que registra fecha, hora y ubicación GPS.',
        'Permanencia Digital: Lo que subes a internet deja copias en servidores y archivos web de forma indefinida.',
      ],
      practicalSteps: [
        'Desactiva el permiso de "Ubicación / GPS" en la aplicación de cámara de los teléfonos familiares.',
        'Aplica la regla de los 3 filtros: Sin uniforme escolar, sin geolocalización visible y con el perfil configurado en Privado.',
        'Pide permiso a tu hijo antes de publicar fotos suyas; esto le enseña a respetar el consentimiento y la privacidad ajena.',
        'Revisa semestralmente la lista de seguidores en redes familiares para depurar perfiles inactivos o desconocidos.',
      ],
      familyPrompt: '¿Quién crees que puede ver las fotos que se suben a internet y qué pasa con ellas dentro de 10 años?',
      goldenRule: 'Si no colgarías la fotografía en la cartelera de la plaza pública de tu ciudad, no la publiques en redes sociales.',
    },
    {
      id: 'modern-phishing',
      category: 'phishing',
      icon: 'FishSymbol',
      readTime: '4 min',
      title: 'Phishing Infantil: Cómo Detectar Enlaces Trampa y Falsos Premios',
      summary: 'Técnicas que engañan la curiosidad infantil mediante supuestos sorteos de influencers, skins de juegos y avisos urgentes de bloqueo.',
      realRisk: 'Mensajes a través de WhatsApp, TikTok o correo que imitan a soporte técnico o a creadores de contenido conocidos. Al hacer clic, instalan extensiones maliciosas o suscriben el móvil a servicios de cobro por SMS.',
      keyConcepts: [
        'Urgencia Artificial: Mensajes que dicen "¡Tienes 5 minutos para reclamar tu premio!" para evitar la reflexión.',
        'URLs Clonadas: Direcciones web con faltas sutiles de ortografía (ej. "r0bl0x-free.com" en vez del sitio real).',
        'Phishing Emocional: Mensajes alarmistas tipo "Tu cuenta será eliminada hoy si no confirmas tus datos".',
      ],
      practicalSteps: [
        'Enseña la técnica "Pausa y Pregunta": si un mensaje genera euforia o pánico urgente, pausa 30 segundos y consulta con mamá/papá.',
        'Verifica que el navegador muestre el candado y revisa letra por letra la dirección web.',
        'Nunca abras enlaces recibidos de remitentes desconocidos, ni descargues archivos con extensión .exe, .apk o .scr.',
        'Instala un bloqueador de anuncios y filtrado de contenido malicioso en el navegador familiar.',
      ],
      familyPrompt: 'Si recibes un mensaje diciendo que te ganaste la consola más nueva, ¿cuál es el primer paso antes de pulsar el enlace?',
      goldenRule: 'En internet, cuando algo parece demasiado bueno para ser verdad, con certeza es una trampa.',
    },
    {
      id: 'ai-deepfakes',
      category: 'ai',
      icon: 'Cpu',
      readTime: '5 min',
      title: 'Inteligencia Artificial, Deepfakes y la Palabra Clave Familiar Secreta',
      summary: 'Cómo las herramientas modernas clonan voces y rostros en segundos, y el método infalible para proteger a tu familia ante engaños.',
      realRisk: 'Ciberdelincuentes utilizan pequeños fragmentos de video o audios de redes sociales para clonar la voz de un hijo o pariente, fingiendo accidentes o emergencias telefónicas para exigir transferencias inmediatas.',
      keyConcepts: [
        'Clonación de Voz: Software de IA que replica entonación, timbre y pausas con solo 3 segundos de muestra.',
        'Deepfake: Videos manipulados digitalmente que hacen parecer que alguien dijo o hizo algo que jamás ocurrió.',
        'Palabra Clave Familiar (Safe Word): Una clave secreta acordada en casa que ningún software ni atacante conoce.',
      ],
      practicalSteps: [
        'Crea hoy mismo con tu familia una "Palabra Clave Secreta" (ej. "TortugaEspacial24"). Solo se utiliza en emergencias reales.',
        'Si alguien llama asegurando que un hijo o familiar está en problemas, pide la palabra clave antes de transferir dinero o alarmarte.',
        'Enseña a los niños a desconfiar de videos donde celebridades recomienden juegos o pidan dinero.',
        'Limita los videos públicos donde los niños hablen de forma clara mirando a la cámara en redes sociales abiertas.',
      ],
      familyPrompt: '¿Sabías que hoy en día una computadora puede imitar la voz de cualquiera? ¿Cuál será nuestra palabra secreta de seguridad?',
      goldenRule: 'Si una llamada de emergencia genera pánico y pide dinero urgente, cuelga de inmediato y llama al número directo del familiar.',
    },
    {
      id: 'cyberbullying-support',
      category: 'bullying',
      icon: 'HeartHandshake',
      readTime: '4 min',
      title: 'Ciberacoso y Grupos de Mensajería: Protocolo de Apoyo para Familias',
      summary: 'Cómo identificar señales de hostigamiento digital, apoyar emocionalmente a tu hijo y actuar sin empeorar la situación escolar.',
      realRisk: 'El 80% de los menores que sufren acoso digital callan por miedo a que los padres les quiten el teléfono como "solución". El hostigamiento en chats grupales daña gravemente la autoestima y el bienestar emocional.',
      keyConcepts: [
        'Acoso Silencioso: Exclusión premeditada de grupos de juego o chat escolar.',
        'Efecto Espectador: Quienes leen el acoso pero no dicen nada por miedo a convertirse en la siguiente víctima.',
        'Regla de No Represalia: Asegurar al niño que contar un problema jamás significará perder su dispositivo.',
      ],
      practicalSteps: [
        'Observa cambios de humor: si tu hijo apaga la pantalla rápidamente cuando entras a la habitación o luce ansioso al sonar notificaciones.',
        'Frente a un incidente: NO respondas a los agresores. Toma capturas de pantalla de los mensajes con fecha y hora visibles.',
        'Bloquea al agresor en la aplicación y reporta el comportamiento al centro educativo con las evidencias recopiladas.',
        'Reitera con frecuencia: "Pase lo que pase en internet, aquí siempre te vamos a escuchar con calma y sin castigos".',
      ],
      familyPrompt: '¿Cómo te sientes en los grupos de chat de la escuela? ¿Has visto alguna vez que molesten a alguien?',
      goldenRule: 'El primer antídoto contra el ciberacoso es la certeza de que en casa encontrará refugio y calma, no reproches.',
    },
    {
      id: 'passwords-management',
      category: 'passwords',
      icon: 'KeyRound',
      readTime: '3 min',
      title: 'Contraseñas Fuertes y Cuentas Blindadas: El Método de la "Frase Secreta"',
      summary: 'Por qué "Nombre + 123" se descifra en segundos y cómo crear contraseñas memorables y prácticamente imposibles de hackear.',
      realRisk: 'Los niños suelen usar la misma clave sencilla en juegos, correos y redes. Si una plataforma secundaria es vulnerada, los atacantes usan esa misma clave para apropiarse de todas sus cuentas vinculadas.',
      keyConcepts: [
        'Ataque de Fuerza Bruta: Computadoras que prueban millones de combinaciones por segundo buscando contraseñas comunes.',
        'Passphrase (Frase Contraseña): Combinación de 4 palabras sin relación que resulta fácil de recordar pero impenetrable para algoritmos.',
        'Autenticación en Dos Pasos (2FA): Verificación adicional en el móvil que impide el acceso incluso si conocen la clave.',
      ],
      practicalSteps: [
        'Ayuda a tu hijo a crear su primera Frase de Paso: por ejemplo "Gato!Salta!Luna!Rápido26".',
        'Nunca compartas contraseñas con amigos; explícales que es igual que darles la llave de su diario íntimo.',
        'Activa la verificación en dos pasos (2FA) en la cuenta de Google, Apple o consola de videojuegos.',
        'Utiliza un gestor de contraseñas familiar seguro para no tener que anotarlas en papeles accesibles.',
      ],
      familyPrompt: '¿Por qué compartir tu contraseña con tu mejor amigo puede poner en riesgo todas tus cosas del juego si a él le hackean la cuenta?',
      goldenRule: 'Una contraseña larga de 4 palabras es mil veces más segura que una corta llena de símbolos difíciles de memorizar.',
    },
  ],
  fr: [
    {
      id: 'gaming-safety',
      category: 'gaming',
      icon: 'Gamepad2',
      readTime: '4 min',
      title: 'Roblox, Fortnite et Microtransactions : Protéger ses Enfants des Arnaques',
      summary: 'Découvrez comment les cybercriminels profitent de l\'excitation des jeux vidéo pour piéger les mineurs avec des monnaies virtuelles.',
      realRisk: 'Des arnaqueurs promettent des "Robux ou V-Bucks gratuits" via de faux sites pour voler les comptes, ou manipulent les enfants sur le chat vocal pour déclencher des achats réels.',
      keyConcepts: [
        'Dark Patterns : Interfaces conçues pour inciter aux dépenses impulsives.',
        'Ingénierie Sociale : Adultes feignant d\'être des amis en offrant des objets virtuels.',
        'Vol de Comptes : Faux liens Discord menant vers des copies frauduleuses de sites officiels.',
      ],
      practicalSteps: [
        'Activez le code PIN parental sur la console ou le store pour exiger un mot de passe à chaque achat.',
        'Réglez le chat sur "Amis vérifiés uniquement" et coupez le chat vocal avec les inconnus.',
        'Ne liez pas de carte bancaire directe ; utilisez des cartes prépayées à solde fixe.',
        'Instaurez la règle : "Quiconque demande ton mot de passe ou email pour te faire un cadeau est un arnaqueur".',
      ],
      familyPrompt: 'Que ferais-tu si un joueur en ligne te demandait tes identifiants en promettant de booster ton niveau ?',
      goldenRule: 'N\'enregistrez jamais de moyen de paiement sans double confirmation biométrique ou code PIN obligatoire.',
    },
    {
      id: 'privacy-footprint',
      category: 'privacy',
      icon: 'Camera',
      readTime: '3 min',
      title: 'Empreinte Numérique et Sharenting : Les Risques du Partage de Photos',
      summary: 'L\'impact à long terme des photos publiées et la manière dont les métadonnées GPS cachées révèlent l\'adresse de votre domicile.',
      realRisk: 'Chaque photo prise au smartphone peut contenir des coordonnées GPS précises (métadonnées EXIF). Les logos d\'école et plaques d\'immatriculation permettent à des tiers de cartographier la routine de l\'enfant.',
      keyConcepts: [
        'Sharenting : Surexposition de la vie des enfants sur les réseaux sociaux par les proches.',
        'Métadonnées EXIF : Coordonnées GPS, date et heure invisibles incrustées dans les photos.',
        'Permanence Numérique : Tout ce qui est publié en ligne laisse des traces indélébiles.',
      ],
      practicalSteps: [
        'Désactivez l\'accès "Localisation / GPS" dans l\'application appareil photo des téléphones.',
        'Appliquez la règle des 3 filtres : pas d\'uniforme d\'école, pas de géolocalisation et compte privé.',
        'Demandez l\'accord de votre enfant avant de publier sa photo pour lui inculquer le respect de la vie privée.',
        'Vérifiez tous les 6 mois la liste de vos abonnés sur vos réseaux sociaux pour supprimer les comptes inconnus.',
      ],
      familyPrompt: 'Qui penses-tu peut voir les photos publiées sur Internet et où seront-elles dans 10 ans ?',
      goldenRule: 'Si vous n\'afficheriez pas cette photo sur le panneau d\'affichage de votre mairie, ne la mettez pas en ligne.',
    },
    {
      id: 'modern-phishing',
      category: 'phishing',
      icon: 'FishSymbol',
      readTime: '4 min',
      title: 'Phishing pour Enfants : Repérer les Liens Pièges et Faux Cadeaux',
      summary: 'Les méthodes qui exploitent la curiosité des jeunes à travers de faux concours d\'influenceurs ou des alertes alarmistes.',
      realRisk: 'Des messages reçus sur WhatsApp, TikTok ou par email usurpant le support technique. Un simple clic peut installer une extension malveillante ou abonner la ligne à des services surtaxés.',
      keyConcepts: [
        'Urgence Artificielle : Messages affirmant "Plus que 5 minutes pour réclamer ton lot !" pour empêcher la réflexion.',
        'Faux Noms de Domaine : Adresses web imitées avec de légères fautes de frappe.',
        'Phishing Émotionnel : Alertes anxiogènes affirmant "Ton compte sera banni ce soir si tu ne cliques pas".',
      ],
      practicalSteps: [
        'Enseignez la règle "Pause et Demande" : en cas d\'émotion vive ou d\'urgence, attendez 30 secondes et demandez à un parent.',
        'Vérifiez attentivement l\'adresse exacte du site dans la barre du navigateur.',
        'N\'ouvrez jamais de liens d\'expéditeurs inconnus et ne téléchargez aucun fichier suspect.',
        'Installez un bloqueur de publicités et filtre de sécurité sur le navigateur familial.',
      ],
      familyPrompt: 'Si tu reçois un message disant que tu as gagné la dernière console, que fais-tu avant de cliquer ?',
      goldenRule: 'Sur Internet, quand une offre semble trop belle pour être vraie, il s\'agit sans doute d\'un piège.',
    },
    {
      id: 'ai-deepfakes',
      category: 'ai',
      icon: 'Cpu',
      readTime: '5 min',
      title: 'Intelligence Artificielle, Deepfakes et Mot de Passe Familial Secret',
      summary: 'Comment les outils d\'IA clonent visages et voix en quelques secondes, et la solution infaillible pour protéger votre famille.',
      realRisk: 'Des cybercriminels utilisent quelques secondes d\'audio issues des réseaux pour cloner la voix d\'un proche et simuler une détresse financière urgente lors d\'un appel téléphonique.',
      keyConcepts: [
        'Clonage Vocal : Logiciels d\'IA reproduisant le timbre et les intonations en quelques secondes.',
        'Deepfake : Vidéos trafiquées faisant croire qu\'une personne a tenu des propos inventés.',
        'Mot de Passe Familial (Safe Word) : Un mot secret convenu à la maison, connu uniquement de la famille.',
      ],
      practicalSteps: [
        'Définissez dès aujourd\'hui un "Mot de Passe Familial Secret" à n\'utiliser qu\'en cas d\'urgence avérée.',
        'Si un appel affirme qu\'un enfant est en danger et réclame de l\'argent, exigez ce mot de passe avant toute chose.',
        'Apprenez aux enfants à douter des vidéos montrant des célébrités faisant la promotion de gains faciles.',
        'Évitez de diffuser publiquement des vidéos où vos enfants parlent distinctement face caméra.',
      ],
      familyPrompt: 'Savais-tu qu\'un ordinateur peut imiter la voix de n\'importe qui ? Quel sera notre mot secret de sécurité ?',
      goldenRule: 'Face à un appel angoissant exigeant de l\'argent d\'urgence, raccrochez et rappelez directement le numéro habituel.',
    },
    {
      id: 'cyberbullying-support',
      category: 'bullying',
      icon: 'HeartHandshake',
      readTime: '4 min',
      title: 'Cyberharcèlement et Groupes de Chat : Guide Pratique d\'Accompagnement',
      summary: 'Repérer les signes de souffrance numérique, soutenir son enfant avec bienveillance et réagir efficacement.',
      realRisk: 'La majorité des enfants victimes gardent le silence par peur qu\'on leur confisque leur smartphone. Le harcèlement dans les groupes de classe détruit la confiance en soi.',
      keyConcepts: [
        'Mise à l\'Écart Volontaire : Exclusion délibérée des salons de jeux ou groupes de discussion.',
        'Effet Témoin : Ne rien dire par peur de devenir la prochaine cible.',
        'Règle de Non-Punition : Garantir à l\'enfant qu\'en parlant, il ne sera jamais privé de son appareil.',
      ],
      practicalSteps: [
        'Soyez attentif aux changements d\'attitude : écran éteint précipitamment à votre arrivée, anxiété face aux notifications.',
        'En cas d\'incident : NE répondez PAS aux provocations. Prenez des captures d\'écran avec horodatage.',
        'Bloquez le profil et signalez la situation à l\'équipe pédagogique de l\'établissement scolaire.',
        'Répétez régulièrement : "Quoi qu\'il arrive en ligne, tu pourras toujours nous en parler sans crainte d\'être grondé".',
      ],
      familyPrompt: 'Comment se passent les échanges dans les groupes de ta classe ? As-tu déjà vu des moqueries répétées ?',
      goldenRule: 'La meilleure protection contre le cyberharcèlement est l\'assurance d\'une écoute calme et sans reproche à la maison.',
    },
    {
      id: 'passwords-management',
      category: 'passwords',
      icon: 'KeyRound',
      readTime: '3 min',
      title: 'Mots de Passe Robustes : La Méthode Facile de la "Phrase Secrète"',
      summary: 'Pourquoi les mots de passe simples se piratent en quelques millièmes de seconde et comment créer des phrases inviolables.',
      realRisk: 'Les enfants réutilisent souvent le même mot de passe facile partout. Si un petit jeu est piraté, les attaquants s\'emparent de tous leurs comptes associés.',
      keyConcepts: [
        'Attaque par Force Brute : Ordinateurs testant des millions de combinaisons par seconde.',
        'Passphrase (Phrase Secrète) : Suite de 4 mots sans lien, facile à retenir et inviolable.',
        'Double Authentification (2FA) : Confirmation sur mobile empêchant l\'accès même si le mot de passe est connu.',
      ],
      practicalSteps: [
        'Guidez votre enfant pour créer une phrase comme : "Tigre!Danse!Lune!Bleue88".',
        'Ne partagez jamais ses identifiants avec des camarades de classe.',
        'Activez la validation en deux étapes (2FA) sur ses comptes Google, Apple ou consoles de jeu.',
        'Utilisez un gestionnaire de mots de passe partagé pour centraliser les accès familiaux.',
      ],
      familyPrompt: 'Pourquoi donner son mot de passe à son meilleur ami peut mettre en danger son compte s\'il se fait pirater ?',
      goldenRule: 'Une phrase de passe de 4 mots simples est infiniment plus sûre qu\'un mot court truffé de chiffres compliqués.',
    },
  ],
  en: [
    {
      id: 'gaming-safety',
      category: 'gaming',
      icon: 'Gamepad2',
      readTime: '4 min',
      title: 'Roblox, Fortnite & In-Game Scams: Protecting Kids from Financial Traps',
      summary: 'Learn how cybercriminals leverage gaming excitement to scam young players with counterfeit virtual currencies and hidden fees.',
      realRisk: 'Scammers advertise "Free Robux or V-Bucks" via phishing sites designed to steal accounts, or groom children in voice chats to initiate unauthorized credit card purchases.',
      keyConcepts: [
        'Dark Patterns: Game interfaces intentionally designed to trigger impulse microtransactions.',
        'Social Engineering: Strangers pretending to be friendly by gifting virtual items to gain trust.',
        'Account Takeover: Discord links and chat messages that mimic official game verification pages.',
      ],
      practicalSteps: [
        'Enable a Parental PIN on the console or app store to mandate authentication on every purchase.',
        'Configure in-game chat to "Verified Friends Only" and disable random voice chats.',
        'Never link permanent credit cards; rely on prepaid gift cards with fixed balances.',
        'Establish the household rule: "Anyone asking for your password or email to give you free stuff is a scammer."',
      ],
      familyPrompt: 'What would you do if another player offered to boost your level for free if you shared your login details?',
      goldenRule: 'Never attach payment methods without biometric or PIN verification required on every single charge.',
    },
    {
      id: 'privacy-footprint',
      category: 'privacy',
      icon: 'Camera',
      readTime: '3 min',
      title: 'Digital Footprint & Sharenting: Hidden Risks in Photo Sharing',
      summary: 'The long-term permanence of shared images and how hidden photo metadata reveals your exact home address.',
      realRisk: 'Smartphones embed GPS coordinates (EXIF metadata) in pictures. School emblems, street signs, and vehicle plates enable bad actors to map out your child’s daily routines.',
      keyConcepts: [
        'Sharenting: Over-sharing details of children’s personal lives on public social channels.',
        'EXIF Metadata: Hidden geographic and timestamp coordinates stored inside photo files.',
        'Digital Permanence: Content uploaded to the web remains cached and archived indefinitely.',
      ],
      practicalSteps: [
        'Turn off "Location / GPS" permissions in your family phone camera applications.',
        'Follow the 3-Filter Rule: No school uniforms, no visible street landmarks, and strictly private accounts.',
        'Ask your child for permission before posting their photos to demonstrate mutual respect for privacy.',
        'Perform a bi-annual review of social followers to prune unknown or inactive accounts.',
      ],
      familyPrompt: 'Who do you think can see photos uploaded to social networks, and where will those images be in 10 years?',
      goldenRule: 'If you would not pin the photo to a public community bulletin board in town, do not post it online.',
    },
    {
      id: 'modern-phishing',
      category: 'phishing',
      icon: 'FishSymbol',
      readTime: '4 min',
      title: 'Youth Phishing: Recognizing Deceptive Links and Fake Giveaways',
      summary: 'Techniques that prey on children’s curiosity through fake influencer contests, free skins, and urgent account warnings.',
      realRisk: 'Messages across WhatsApp, TikTok, or email impersonating official moderators. Clicking links can install spyware or enroll phone numbers in high-cost recurring SMS subscriptions.',
      keyConcepts: [
        'Artificial Urgency: "Claim your prize in the next 5 minutes!" tricks players into skipping critical thinking.',
        'Typosquatting URLs: Web addresses with subtle spelling mistakes designed to look authentic.',
        'Fear-Based Phishing: Warnings stating "Your account will be deleted tonight unless you verify credentials."',
      ],
      practicalSteps: [
        'Teach the "Pause & Ask" habit: if a message evokes sudden excitement or panic, wait 30 seconds and ask mom or dad.',
        'Check the browser address bar carefully for odd domain extensions or spelling oddities.',
        'Never click links from unknown senders or download files ending in .exe, .apk, or .scr.',
        'Set up content filtering and ad-blockers on household browsers.',
      ],
      familyPrompt: 'If you get a message saying you won the newest gaming console, what is the first thing you should do before clicking?',
      goldenRule: 'Online, whenever an offer sounds too good to be true, it is guaranteed to be a scam.',
    },
    {
      id: 'ai-deepfakes',
      category: 'ai',
      icon: 'Cpu',
      readTime: '5 min',
      title: 'Artificial Intelligence, Deepfakes & The Family Secret Safe Word',
      summary: 'How modern AI models clone voices and faces in seconds, and the simple foolproof strategy to keep your family safe.',
      realRisk: 'Criminals use short audio snippets scraped from social posts to clone a relative’s voice, faking an emergency call to demand urgent money transfers.',
      keyConcepts: [
        'Voice Cloning: AI algorithms synthesizing a person’s vocal nuances from a 3-second sample.',
        'Deepfakes: Synthetically generated video clips making people appear to say or do things they never did.',
        'Family Safe Word: A private code word agreed upon at home that no algorithm or outsider can guess.',
      ],
      practicalSteps: [
        'Pick a unique Family Safe Word today (e.g., "NeonPenguin99") designated strictly for authentic emergencies.',
        'If a call claims a loved one is in trouble and requests immediate action, ask for the safe word first.',
        'Instruct kids to be skeptical of viral video endorsements claiming free money or gift cards.',
        'Limit public social video clips featuring high-clarity front-facing audio of your children.',
      ],
      familyPrompt: 'Did you know computers can clone anyone’s voice today? What should our family safety password be?',
      goldenRule: 'If an emergency call creates intense panic and demands wire transfers, hang up and call their direct number immediately.',
    },
    {
      id: 'cyberbullying-support',
      category: 'bullying',
      icon: 'HeartHandshake',
      readTime: '4 min',
      title: 'Cyberbullying & Group Chats: A Supportive Action Plan for Parents',
      summary: 'Recognizing emotional warning signs, providing unconditional support, and addressing issues without escalating school drama.',
      realRisk: 'Most targeted children suffer in silence fearing parents will confiscate their devices as a punishment. Harassment in class group chats severely impacts mental health.',
      keyConcepts: [
        'Social Exclusion: Deliberately kicking someone out of gaming lobbies or school chat groups.',
        'Bystander Effect: Reading cruel remarks without speaking up due to fear of retaliation.',
        'No-Retaliation Pledge: Reassuring children that seeking help will never result in having their phones taken away.',
      ],
      practicalSteps: [
        'Watch for subtle mood shifts: hiding screens abruptly or looking stressed when receiving message alerts.',
        'When an incident occurs: DO NOT engage with aggressors directly. Capture screenshots with dates and timestamps.',
        'Block offending accounts and share documented evidence calmly with school authorities.',
        'Reiterate consistently: "No matter what happens online, you can always talk to us with zero fear of getting in trouble."',
      ],
      familyPrompt: 'How do you feel in your class group chats? Have you ever noticed anyone getting picked on repeatedly?',
      goldenRule: 'Your child’s greatest shield against online cruelty is knowing home is a safe space of calm support, not punishment.',
    },
    {
      id: 'passwords-management',
      category: 'passwords',
      icon: 'KeyRound',
      readTime: '3 min',
      title: 'Fortified Passwords: The Foolproof "Secret Passphrase" Method',
      summary: 'Why simple passwords get breached in milliseconds and how to craft uncrackable, memorable four-word passphrases.',
      realRisk: 'Children often reuse identical passwords across games and school emails. If one gaming forum leaks data, attackers easily compromise all their other profiles.',
      keyConcepts: [
        'Brute-Force Attacks: High-speed automated programs guessing millions of common dictionary passwords per second.',
        'Passphrases: Strings of 4 unrelated words that are effortless for humans to recall but mathematically impossible for bots.',
        'Two-Factor Authentication (2FA): Secondary mobile verification that blocks intruders even if they possess the password.',
      ],
      practicalSteps: [
        'Help your child formulate their first memorable passphrase: like "Falcon!Jumps!Blue!Moon77".',
        'Teach them that sharing passwords with friends is like handing over the key to their private diary.',
        'Turn on 2FA across Google, Apple ID, and gaming platforms.',
        'Use a trusted family password manager to prevent sticky notes with passwords from lying around.',
      ],
      familyPrompt: 'Why could sharing your password with a friend put your whole game inventory at risk if their account gets hacked?',
      goldenRule: 'A 4-word passphrase is a thousand times more secure than a short password packed with hard-to-remember symbols.',
    },
  ],
};

export const CONVERSATION_TOPICS: Record<Language, ConversationTopic[]> = {
  es: [
    {
      id: 'topic-gaming',
      category: 'Videojuegos & Dinero',
      icon: 'Gamepad2',
      title: 'Cuentas compartidas y monedas virtuales',
      quote: '¿Qué harías si un amigo del colegio te pide tu cuenta para probar un personaje exclusivo o te promete regalarte gemas?',
      context: 'Los niños suelen prestar cuentas por amabilidad o presión de grupo, sin entender que pueden perder años de progreso.',
      idealMoment: 'Durante la merienda o camino al colegio.',
      whatToLookFor: 'Asegúrate de que comprenda que las cuentas son personales y que decir "no" cuida su esfuerzo.',
    },
    {
      id: 'topic-photos',
      category: 'Privacidad & Redes',
      icon: 'Camera',
      title: 'Fotos escolares y detalles de la casa',
      quote: '¿Por qué crees que mamá y papá tapamos el nombre de tu colegio o la placa del auto antes de subir una foto a internet?',
      context: 'Ayuda a desarrollar el pensamiento crítico sobre cómo los detalles de fondo revelan ubicaciones físicas.',
      idealMoment: 'Mientras miran fotos familiares en el salón.',
      whatToLookFor: 'Pregúntale qué detalles de la imagen podrían decirle a un extraño dónde vive o estudia.',
    },
    {
      id: 'topic-safe-word',
      category: 'Seguridad & IA',
      icon: 'Cpu',
      title: 'Nuestra Palabra Clave Familiar',
      quote: 'Si recibes una llamada de un número raro donde alguien dice con la voz de mamá o papá que necesita dinero urgente, ¿qué harías?',
      context: 'Prepara al menor contra estafas de ingeniería social y audios manipulados mediante un código familiar único.',
      idealMoment: 'Durante la cena familiar en un ambiente relajado.',
      whatToLookFor: 'Elegir juntos una palabra divertida que solo conozcan quienes viven en casa.',
    },
    {
      id: 'topic-bullying',
      category: 'Empatía & Chats',
      icon: 'HeartHandshake',
      title: 'Burlas en grupos de WhatsApp o Discord',
      quote: 'Si en un grupo de compañeros empiezan a compartir memes crueles sobre alguien de clase, ¿cómo te sientes y qué sueles hacer?',
      context: 'Combate el efecto espectador y abre la puerta para que hable si alguna vez se siente atacado.',
      idealMoment: 'En un paseo o momento a solas sin interrupciones.',
      whatToLookFor: 'Validar sus emociones y enseñarle que no reírse o salir del grupo ya es una postura valiente.',
    },
    {
      id: 'topic-mistakes',
      category: 'Confianza Familiar',
      icon: 'ShieldAlert',
      title: 'La regla de Cero Castigos ante errores',
      quote: 'Si alguna vez pulsas un enlace raro por curiosidad o ves algo que te asuste en internet, ¿qué es lo primero que harías?',
      context: 'El mayor temor de los niños es que los adultos se enfaden y les confisquen el móvil o la consola.',
      idealMoment: 'Al entregar o cargar el dispositivo al final del día.',
      whatToLookFor: 'Reiterar con calidez que su seguridad siempre está por encima de cualquier error técnico.',
    },
  ],
  fr: [
    {
      id: 'topic-gaming',
      category: 'Jeux Vidéo & Argent',
      icon: 'Gamepad2',
      title: 'Comptes partagés et monnaies virtuelles',
      quote: 'Que ferais-tu si un ami d\'école te demandait tes identifiants pour tester un skin ou en promettant des gemmes gratuites ?',
      context: 'Les enfants prêtent souvent leurs comptes par gentillesse sans mesurer le risque de perdre tout leur inventaire.',
      idealMoment: 'Pendant le goûter ou sur le chemin de l\'école.',
      whatToLookFor: 'Assurez-vous qu\'il comprenne qu\'un compte est strictement personnel et que savoir dire non est une force.',
    },
    {
      id: 'topic-photos',
      category: 'Vie Privée & Réseaux',
      icon: 'Camera',
      title: 'Photos scolaires et vie à la maison',
      quote: 'Pourquoi penses-tu que nous masquons le logo de ton école ou les plaques de voiture avant de partager une photo ?',
      context: 'Développe l\'esprit critique sur les détails en arrière-plan qui trahissent les lieux fréquentés.',
      idealMoment: 'En regardant ensemble des photos de famille.',
      whatToLookFor: 'Demandez-lui d\'analyser l\'image pour repérer ce qui pourrait renseigner un inconnu sur sa routine.',
    },
    {
      id: 'topic-safe-word',
      category: 'Sécurité & IA',
      icon: 'Cpu',
      title: 'Notre Mot de Passe Familial Secret',
      quote: 'Si tu reçois un appel avec la voix de papa ou maman demandant de l\'argent d\'urgence, quelle est ta réaction ?',
      context: 'Prémunit contre les tentatives d\'arnaques vocales par IA grâce à un code secret partagé.',
      idealMoment: 'Pendant le dîner dans une atmosphère détendue.',
      whatToLookFor: 'Choisir ensemble un mot rigolo que seule votre famille connaît.',
    },
    {
      id: 'topic-bullying',
      category: 'Empathie & Chats',
      icon: 'HeartHandshake',
      title: 'Moqueries dans les groupes de classe',
      quote: 'Si des camarades commencent à partager des moqueries sur quelqu\'un dans un groupe, comment te sens-tu ?',
      context: 'Lutter contre l\'effet témoin et libérer la parole si l\'enfant est lui-même touché.',
      idealMoment: 'Lors d\'une promenade calme en tête-à-tête.',
      whatToLookFor: 'Valider ses émotions et lui rappeler que refuser de relayer une moquerie est un acte de courage.',
    },
    {
      id: 'topic-mistakes',
      category: 'Confiance & Bienveillance',
      icon: 'ShieldAlert',
      title: 'La promesse de Zéro Punition en cas d\'erreur',
      quote: 'Si un jour tu cliques sur un lien bizarre par curiosité ou vois quelque chose d\'étrange, que fais-tu en premier ?',
      context: 'La première peur des enfants est d\'être punis ou privés d\'écrans s\'ils avouent une bêtise.',
      idealMoment: 'Au moment de poser le téléphone pour la nuit.',
      whatToLookFor: 'Répéter avec tendresse que sa sécurité passe toujours avant toute faute commise.',
    },
  ],
  en: [
    {
      id: 'topic-gaming',
      category: 'Gaming & Spending',
      icon: 'Gamepad2',
      title: 'Shared accounts and virtual currencies',
      quote: 'What would you do if a school friend asked for your login info to try out a skin or promised to add free gems?',
      context: 'Kids often share passwords out of peer pressure without realizing they could lose years of game progress.',
      idealMoment: 'During an afternoon snack or driving to activities.',
      whatToLookFor: 'Ensure they understand accounts are private property and saying "no" protects their hard work.',
    },
    {
      id: 'topic-photos',
      category: 'Privacy & Sharing',
      icon: 'Camera',
      title: 'School photos and landmarks',
      quote: 'Why do you think we blur out school crests and car license plates before sharing pictures online?',
      context: 'Teaches situational awareness about how small background cues betray physical locations.',
      idealMoment: 'While looking over vacation photos together.',
      whatToLookFor: 'Ask them to spot details that could tell a stranger where they study or hang out.',
    },
    {
      id: 'topic-safe-word',
      category: 'AI & Emergency Codes',
      icon: 'Cpu',
      title: 'Our Family Safety Secret Word',
      quote: 'If you ever got a call sounding like mom or dad frantically asking for urgent help or money, what would you do?',
      context: 'Prepares the child against emerging AI voice scams with a concrete, reliable household protocol.',
      idealMoment: 'At the family dinner table in a calm setting.',
      whatToLookFor: 'Pick a memorable, fun secret code word known only to your immediate family.',
    },
    {
      id: 'topic-bullying',
      category: 'Kindness & Group Chats',
      icon: 'HeartHandshake',
      title: 'Mean jokes in class group chats',
      quote: 'If people in a class WhatsApp or Discord group start making mean memes about a classmate, how do you feel?',
      context: 'Addresses bystander guilt and makes it safe for them to report if they are feeling targeted.',
      idealMoment: 'During quiet one-on-one time together.',
      whatToLookFor: 'Remind them that not laughing along or choosing to leave the chat is an admirable act of courage.',
    },
    {
      id: 'topic-mistakes',
      category: 'Mutual Trust',
      icon: 'ShieldAlert',
      title: 'The Zero-Punishment Safe Harbor Promise',
      quote: 'If you accidentally click a sketchy link out of curiosity or encounter something unsettling online, what will you do?',
      context: 'Fear of losing screen privileges is the #1 reason kids hide digital emergencies from their parents.',
      idealMoment: 'When docking devices at night.',
      whatToLookFor: 'Confirm warmly that their well-being will always matter a thousand times more than any technical mistake.',
    },
  ],
};

export const AGE_PEDAGOGY_MAP: Record<Language, Record<ChildAgeGroup, AgePedagogyInfo>> = {
  es: {
    '8–10': {
      stageTitle: 'Etapa de Exploración Inicial (8 a 10 años)',
      cognitiveTraits: 'Pensamiento concreto. Alta credulidad; les cuesta distinguir intenciones maliciosas o identificar publicidad encubierta.',
      keyChallenges: [
        'Dificultad para reconocer trampas en anuncios coloridos.',
        'Tendencia a compartir fotos sin medir la repercusión.',
        'Incapacidad de gestionar el tiempo frente a juegos con recompensas continuas.',
      ],
      recommendedAction: 'Acompañamiento cercano. Jueguen juntos las misiones de CiberKids y supervisen directamente las descargas de aplicaciones.',
      screenTimeRecommendation: 'Máximo 45 minutos al día en ocio digital, con pausas cada 20 minutos.',
    },
    '11–12': {
      stageTitle: 'Etapa de Socialización y Autonomía (11 a 12 años)',
      cognitiveTraits: 'Búsqueda de pertenencia grupal. Muy activos en chats y videojuegos multijugador; alta susceptibilidad a la presión de amigos.',
      keyChallenges: [
        'Estafas de intercambio de cuentas y compras en Roblox/Fortnite.',
        'Primeros roces y exclusiones en grupos escolares de mensajería.',
        'Deseo de tener cuentas en redes sociales antes de la edad permitida (13+).',
      ],
      recommendedAction: 'Supervisión dialógica. Acordar reglas claras en vez de imponer prohibiciones totales. Revisar juntos los ajustes de privacidad.',
      screenTimeRecommendation: 'Máximo 60 minutos al día en días lectivos, reservando horarios sagrados libres de pantallas (comidas y noche).',
    },
    '13–14': {
      stageTitle: 'Etapa de Identidad Digital y Redes Sociales (13 a 14 años)',
      cognitiveTraits: 'Desarrollo del pensamiento crítico y consolidación de la imagen pública. Necesidad de privacidad respecto a los adultos.',
      keyChallenges: [
        'Huella digital y consecuencias a futuro de publicaciones impulsivas.',
        'Contacto con perfiles desconocidos en redes sociales abiertas.',
        'Contenido desinformativo y deepfakes generados por IA.',
      ],
      recommendedAction: 'Rol de asesor de confianza. Mantener canales de diálogo abiertos para que acudan ante dudas o problemas sin temor a reprimendas.',
      screenTimeRecommendation: 'Hasta 90 minutos gestionados con autonomía responsable, con apagado de pantallas 45 min antes de dormir.',
    },
  },
  fr: {
    '8–10': {
      stageTitle: 'Stade de Découverte Initiale (8 à 10 ans)',
      cognitiveTraits: 'Pensée concrète et grande crédulité ; difficulté à déceler les intentions cachées ou les publicités déguisées.',
      keyChallenges: [
        'Sensibilité extrême aux bannières colorées et concours trompeurs.',
        'Tendance à diffuser des images sans mesurer l\'impact.',
        'Difficulté à s\'arrêter face aux mécaniques de récompenses continues.',
      ],
      recommendedAction: 'Accompagnement bienveillant. Jouez ensemble aux missions CiberKids et supervisez chaque installation d\'application.',
      screenTimeRecommendation: '45 minutes par jour maximum pour les loisirs, avec une pause toutes les 20 minutes.',
    },
    '11–12': {
      stageTitle: 'Stade de Socialisation et d\'Autonomie (11 à 12 ans)',
      cognitiveTraits: 'Besoin d\'appartenance aux groupes de pairs. Forte présence dans les jeux en ligne et susceptibilité à la pression des camarades.',
      keyChallenges: [
        'Arnaques liées aux échanges de comptes ou monnaies virtuelles.',
        'Tensions et exclusions dans les groupes de messagerie de classe.',
        'Tentative d\'inscription précoce sur des réseaux sociaux réservés aux plus de 13 ans.',
      ],
      recommendedAction: 'Supervision par le dialogue. Établissez des règles communes plutôt que des interdictions unilatérales.',
      screenTimeRecommendation: '60 minutes par jour en période scolaire, avec des sanctuaires sans écran (repas et nuit).',
    },
    '13–14': {
      stageTitle: 'Stade d\'Identité Numérique et Réseaux Sociaux (13 à 14 ans)',
      cognitiveTraits: 'Affirmation de la personnalité et de la réputation en ligne. Besoin d\'intimité vis-à-vis des parents.',
      keyChallenges: [
        'Empreinte numérique et conséquences futures des publications impulsives.',
        'Contacts avec des comptes inconnus sur les plateformes publiques.',
        'Désinformation et vidéos synthétiques créées par l\'IA.',
      ],
      recommendedAction: 'Posture de conseiller de confiance. Maintenez le lien pour qu\'il vienne vers vous sans crainte d\'être jugé.',
      screenTimeRecommendation: 'Jusqu\'à 90 minutes gérées de manière responsable, avec extinction des écrans 45 min avant le sommeil.',
    },
  },
  en: {
    '8–10': {
      stageTitle: 'Early Exploration Stage (Ages 8–10)',
      cognitiveTraits: 'Concrete thinkers with high credulity; difficulty discerning subtle deceptive intentions or disguised advertisements.',
      keyChallenges: [
        'High vulnerability to flashing ads and fake reward pop-ups.',
        'Tendency to share personal photos without understanding consequences.',
        'Difficulty disengaging from games with persistent positive feedback loops.',
      ],
      recommendedAction: 'Co-viewing and guided discovery. Solve CiberKids challenges side-by-side and curate apps together.',
      screenTimeRecommendation: 'Up to 45 minutes of recreational screen time per day, with screen breaks every 20 minutes.',
    },
    '11–12': {
      stageTitle: 'Socialization & Emerging Autonomy (Ages 11–12)',
      cognitiveTraits: 'Strong desire for peer validation. Active in gaming communities and vulnerable to peer pressure in school chat groups.',
      keyChallenges: [
        'Account trading scams and microtransaction traps in Roblox/Fortnite.',
        'Early social friction and group exclusion in class messaging chats.',
        'Curiosity to join underage social media platforms before age 13.',
      ],
      recommendedAction: 'Collaborative boundary setting. Discuss the reasoning behind digital ground rules rather than strict blanket bans.',
      screenTimeRecommendation: 'Up to 60 minutes daily on school days, keeping meal times and bedrooms screen-free zones.',
    },
    '13–14': {
      stageTitle: 'Digital Identity & Social Footprint (Ages 13–14)',
      cognitiveTraits: 'Abstract reasoning and focus on digital reputation. Emerging demand for personal privacy from parents.',
      keyChallenges: [
        'Permanent digital footprint and long-term ramifications of impulsive posts.',
        'Interactions with strangers across open public platforms.',
        'Synthetically generated disinformation and AI deepfakes.',
      ],
      recommendedAction: 'Trusted advisor approach. Keep open channels of communication so they reach out during crises without fear of punishment.',
      screenTimeRecommendation: 'Up to 90 minutes managed with responsible self-regulation, turning off screens 45 min prior to sleep.',
    },
  },
};

export const DIGITAL_AGREEMENT_ITEMS: Record<Language, DigitalAgreementItem[]> = {
  es: [
    {
      id: 'safe-harbor',
      title: 'Compromiso Cero Castigos ante Errores',
      description: 'Si veo algo extraño, hago clic en un enlace equivocado o cometo un error, puedo contarlo de inmediato sin temor a perder mis dispositivos.',
      commitmentBy: 'parent',
      icon: 'ShieldCheck',
    },
    {
      id: 'private-credentials',
      title: 'Contraseñas Sagradas y Personales',
      description: 'Nunca comparto mis claves con amigos ni desconocidos en juegos, pero mamá o papá tienen una copia de respaldo para emergencias.',
      commitmentBy: 'child',
      icon: 'Key',
    },
    {
      id: 'pause-and-think',
      title: 'La Regla de la Pausa de 3 Segundos',
      description: 'Antes de enviar una foto, mensaje o comentario impulsivo, me pregunto: ¿me gustaría que mi familia o profesor lo vieran?',
      commitmentBy: 'child',
      icon: 'Clock',
    },
    {
      id: 'screen-free-moments',
      title: 'Zonas Libres de Pantallas para Todos',
      description: 'Durante la comida familiar y 30 minutos antes de dormir, tanto adultos como niños dejamos los dispositivos en la estación de carga.',
      commitmentBy: 'both',
      icon: 'Coffee',
    },
    {
      id: 'respectful-chat',
      title: 'Cero Complacencia con el Ciberacoso',
      description: 'No participo en burlas grupales en chats y aviso a un adulto si veo que alguien del colegio está siendo hostigado.',
      commitmentBy: 'child',
      icon: 'Heart',
    },
    {
      id: 'permission-sharing',
      title: 'Consentimiento para Fotos Familiares',
      description: 'Los adultos siempre pedimos permiso a nuestros hijos antes de publicar una foto suya en redes sociales.',
      commitmentBy: 'parent',
      icon: 'Camera',
    },
  ],
  fr: [
    {
      id: 'safe-harbor',
      title: 'Pacte Zéro Punition en cas d\'Erreur',
      description: 'Si je vois quelque chose de bizarre ou si je clique sur un mauvais lien, je peux en parler immédiatement sans crainte de perdre mes écrans.',
      commitmentBy: 'parent',
      icon: 'ShieldCheck',
    },
    {
      id: 'private-credentials',
      title: 'Mots de Passe Secrets et Personnels',
      description: 'Je ne partage jamais mes mots de passe avec mes amis, mais mes parents gardent un double sécurisé pour les urgences.',
      commitmentBy: 'child',
      icon: 'Key',
    },
    {
      id: 'pause-and-think',
      title: 'La Règle des 3 Secondes de Réflexion',
      description: 'Avant d\'envoyer une photo ou un message sous le coup de l\'émotion, je me demande : aimerais-je que ma famille le lise ?',
      commitmentBy: 'child',
      icon: 'Clock',
    },
    {
      id: 'screen-free-moments',
      title: 'Espaces Sans Écrans pour Tous',
      description: 'Pendant les repas en famille et avant de dormir, adultes comme enfants posent leurs téléphones sur la station de charge.',
      commitmentBy: 'both',
      icon: 'Coffee',
    },
    {
      id: 'respectful-chat',
      title: 'Tolérance Zéro face au Cyberharcèlement',
      description: 'Je ne participe jamais à des moqueries en ligne et je préviens un adulte si un camarade est pris pour cible.',
      commitmentBy: 'child',
      icon: 'Heart',
    },
    {
      id: 'permission-sharing',
      title: 'Consentement pour les Photos Publiées',
      description: 'Les parents demandent toujours l\'accord de leurs enfants avant de partager leurs photos sur les réseaux sociaux.',
      commitmentBy: 'parent',
      icon: 'Camera',
    },
  ],
  en: [
    {
      id: 'safe-harbor',
      title: 'Zero-Punishment Safe Harbor Pledge',
      description: 'If I encounter something scary, tap a suspicious link, or make a mistake, I can report it immediately without fear of losing my devices.',
      commitmentBy: 'parent',
      icon: 'ShieldCheck',
    },
    {
      id: 'private-credentials',
      title: 'Sacred & Private Credentials',
      description: 'I never share my passwords with friends or strangers in games, but mom or dad hold a secure emergency backup copy.',
      commitmentBy: 'child',
      icon: 'Key',
    },
    {
      id: 'pause-and-think',
      title: 'The 3-Second Reflection Rule',
      description: 'Before posting a photo or sending an emotional message, I ask myself: would I be proud if my family or teacher read this?',
      commitmentBy: 'child',
      icon: 'Clock',
    },
    {
      id: 'screen-free-moments',
      title: 'Screen-Free Zones for Everyone',
      description: 'During family meals and 30 minutes before sleep, both parents and children dock their devices at the central charging station.',
      commitmentBy: 'both',
      icon: 'Coffee',
    },
    {
      id: 'respectful-chat',
      title: 'Zero Complicity with Cyberbullying',
      description: 'I never participate in group chat mockery and alert a trusted adult whenever a peer is being targeted.',
      commitmentBy: 'child',
      icon: 'Heart',
    },
    {
      id: 'permission-sharing',
      title: 'Consent for Family Photos',
      description: 'Parents always ask for their child’s consent before posting their pictures or milestones on social networks.',
      commitmentBy: 'parent',
      icon: 'Camera',
    },
  ],
};
