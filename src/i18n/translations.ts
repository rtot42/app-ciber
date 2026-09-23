import { Language } from '../types';

export interface Translations {
  common: {
    back: string;
    continue: string;
    start: string;
    skip: string;
    close: string;
    save: string;
    coins: string;
    xp: string;
    level: string;
    easy: string;
    medium: string;
    hard: string;
    ciberAdvice: string;
    understood: string;
    language: string;
    selectLanguage: string;
    spanish: string;
    french: string;
    english: string;
    badge: string;
    requiresLevel: string;
  };
  nav: {
    home: string;
    worlds: string;
    education: string;
    achievements: string;
    profile: string;
    parentPortal: string;
    childMode: string;
    dashboard: string;
    children: string;
    insights: string;
    settings: string;
  };
  onboarding: {
    skip: string;
    continue: string;
    startAdventure: string;
    slide1: {
      title: string;
      subtitle: string;
      desc: string;
    };
    slide2: {
      title: string;
      subtitle: string;
      desc: string;
    };
    slide3: {
      title: string;
      subtitle: string;
      desc: string;
    };
    slides: Array<{
      title: string;
      subtitle: string;
      description: string;
    }>;
    startBtn: string;
    nextBtn: string;
  };
  profileCreation: {
    title: string;
    subtitle: string;
    step: string;
    step1Avatar: string;
    step2Color: string;
    step3Nickname: string;
    step4Age: string;
    nicknameLabel: string;
    nicknameHint: string;
    nicknameTip: string;
    suggest: string;
    randomize: string;
    avatarLabel: string;
    shieldColorLabel: string;
    ageGroupLabel: string;
    ageGroupHint: string;
    startAdventure: string;
    saveAndEnter: string;
    defaultNick: string;
    years: string;
  };
  home: {
    greeting: string;
    guardianRank: string;
    xpLabel: string;
    streakTitle: string;
    streakSubtitle: string;
    recommendedMission: string;
    continueMission: string;
    minutes: string;
    exploreWorlds: string;
    worldsUnlockedCount: string;
    viewFullMap: string;
    parentModeTitle: string;
    parentModeDesc: string;
    ciberDailyTip: string;
    ciberDailyTipDesc: string;
  };
  worlds: {
    title: string;
    mapTitle: string;
    subtitle: string;
    detailTitle: string;
    exploreWorld: string;
    enterWorld: string;
    lockedDesc: string;
    locked: string;
    unlocked: string;
    active: string;
    status: {
      active: string;
      locked: string;
      unlocked: string;
    };
    completedMissions: string;
    finalChallenge: string;
    allWorlds: string;
  };
  worldDetail: {
    missionsCount: string;
    missionsTitle: string;
    worldMotto: string;
    worldProgress: string;
    learningPath: string;
    play: string;
    open: string;
    tapToPlay: string;
    locked: string;
    bossMission: string;
    bossBadge: string;
    backToMap: string;
    rewards: string;
  };
  missionIntro: {
    briefing: string;
    interactiveChallenge: string;
    objective: string;
    ciberAdvice: string;
    cyberTipTitle: string;
    cyberTipBody: string;
    objectives: string;
    obj1: string;
    obj2: string;
    obj3: string;
    startMission: string;
    rewardsTitle: string;
    startChallenge: string;
    timeEstimate: string;
  };
  missionResult: {
    successBadge: string;
    title: string;
    subtitle: string;
    rewardsTitle: string;
    badgeUnlocked: string;
    skillBoosted: string;
    continueBtn: string;
  };
  achievements: {
    gallery: string;
    title: string;
    unlockedOf: string;
    allCategory: string;
    privacyCategory: string;
    securityCategory: string;
    starterCategory: string;
    commonRarity: string;
    rareRarity: string;
    epicRarity: string;
    unlockedStatus: string;
    lockedStatus: string;
  };
  profile: {
    title: string;
    guardianTitle: string;
    missionsCountLabel: string;
    badgesCountLabel: string;
    skillsTitle: string;
    masteryLevel: string;
    languageSetting: string;
    parentModeTitle: string;
    parentModeDesc: string;
    editTooltip: string;
    skills: {
      privacidad: string;
      contrasenas: string;
      phishing: string;
      redesSociales: string;
      gamingSeguro: string;
      iaDeepfakes: string;
    };
  };
  parentGate: {
    tag: string;
    badge: string;
    back: string;
    backToGame: string;
    title: string;
    subtitle: string;
    desc: string;
    securityQuestion: string;
    questionLabel: string;
    question: string;
    mathQuestion: string;
    hint: string;
    mathFormula: string;
    error: string;
    errorIncorrect: string;
    bypassBtn: string;
    demoBypass: string;
    footerNotice: string;
    safeGuarantee: string;
  };
  parentDashboard: {
    title: string;
    subtitle: string;
    childModeBtn: string;
    lastActivity: string;
    lastActivityTime: string;
    generalProgress: string;
    progressDesc: string;
    strengths: string;
    needsPractice: string;
    strength1: string;
    strength2: string;
    practice1: string;
    practice2: string;
    conversationTitle: string;
    conversationQuote: string;
    conversationDesc: string;
    recentActivity: string;
    today: string;
    activity1Title: string;
    activity1Desc: string;
    activity2Title: string;
    activity2Desc: string;
    childrenTabTitle: string;
    addChildBtn: string;
    insightsTabTitle: string;
    insight1Title: string;
    insight1Desc: string;
    insight2Title: string;
    insight2Desc: string;
    settingsTabTitle: string;
    languageSelect: string;
    timeLimitLabel: string;
    timeLimitValue: string;
    notificationsLabel: string;
    notificationsValue: string;
    pinLabel: string;
    pinValue: string;
  };
  gameScreen: {
    back: string;
    allMechanics: string;
    hintTitle: string;
    hintText: string;
    understood: string;
    photoInstruction: string;
    photoSub: string;
    photoFoundCount: string;
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  es: {
    common: {
      back: 'Volver',
      continue: 'Continuar',
      start: 'Comenzar',
      skip: 'Saltar',
      close: 'Cerrar',
      save: 'Guardar',
      coins: 'Monedas',
      xp: 'XP',
      level: 'Nivel',
      easy: 'Fácil',
      medium: 'Media',
      hard: 'Difícil',
      ciberAdvice: 'Consejo de Ciber',
      understood: 'Entendido',
      language: 'Idioma',
      selectLanguage: 'Elegir Idioma',
      spanish: 'Español',
      french: 'Français',
      english: 'English',
      badge: 'Medalla',
      requiresLevel: 'Requiere Nivel',
    },
    nav: {
      home: 'Inicio',
      worlds: 'Juegos',
      education: 'Educación',
      achievements: 'Logros',
      profile: 'Perfil',
      parentPortal: 'Modo Padres',
      childMode: 'Modo Niño',
      dashboard: 'Panel',
      children: 'Hijos',
      insights: 'Consejos',
      settings: 'Ajustes',
    },
    onboarding: {
      skip: 'Saltar',
      continue: 'Continuar',
      startAdventure: '¡Empezar Aventura!',
      slide1: {
        title: 'CiberKids',
        subtitle: '¡Tu ciberaventura comienza aquí!',
        desc: 'Aprende a navegar con seguridad en Internet mientras juegas y resuelves misiones.',
      },
      slide2: {
        title: 'Explora 10 Mundos',
        subtitle: 'Descubre secretos y desbloquea medallas',
        desc: 'Supera retos de contraseñas, redes sociales, videojuegos y trampas de phishing.',
      },
      slide3: {
        title: 'Aprende Jugando',
        subtitle: 'Sin exámenes ni notas aburridas',
        desc: 'Cada decisión inteligente entrena tus habilidades para ser un guardián digital legendario.',
      },
      slides: [
        {
          title: 'CiberKids',
          subtitle: '¡Tu ciberaventura comienza aquí!',
          description: 'Aprende a navegar con seguridad en Internet mientras juegas y resuelves misiones.',
        },
        {
          title: 'Explora 10 Mundos',
          subtitle: 'Descubre secretos y desbloquea medallas',
          description: 'Supera retos de contraseñas, redes sociales, videojuegos y trampas de phishing.',
        },
        {
          title: 'Aprende Jugando',
          subtitle: 'Sin exámenes ni notas aburridas',
          description: 'Cada decisión inteligente entrena tus habilidades para ser un guardián digital legendario.',
        },
      ],
      startBtn: '¡Empezar Aventura!',
      nextBtn: 'Siguiente',
    },
    profileCreation: {
      title: 'Crea tu Identidad Digital',
      subtitle: '100% anónimo y seguro para protegerte',
      step: 'Paso 2 de 2 • ¡100% anónimo y seguro!',
      step1Avatar: '1. Elige tu Avatar Guardián',
      step2Color: '2. Color de tu Aura / Escudo',
      step3Nickname: '3. Tu Nickname Seguro',
      step4Age: '4. Tu Rango de Edad',
      nicknameLabel: 'Tu Nickname Seguro',
      nicknameHint: 'Nunca uses tu nombre real ni apellidos',
      nicknameTip: '💡 Consejo de Ciber: ¡Nunca uses tu nombre real ni tus apellidos en Internet!',
      suggest: 'Sugerir',
      randomize: 'Aleatorio',
      avatarLabel: 'Elige tu Avatar Guardián',
      shieldColorLabel: 'Color de tu Escudo',
      ageGroupLabel: 'Tu Rango de Edad',
      ageGroupHint: 'Para adaptar el lenguaje y dificultad de los retos',
      startAdventure: '¡Comenzar Mi Misión!',
      saveAndEnter: '¡Guardar e Ingresar a CiberKids!',
      defaultNick: 'CyberGamer',
      years: 'años',
    },
    home: {
      greeting: '¡Hola, {name}!',
      guardianRank: 'Guardián de Datos Novato',
      xpLabel: 'Experiencia (XP)',
      streakTitle: 'Racha Diaria: 4 Días Activo',
      streakSubtitle: '¡Vuelve mañana para ganar 30 monedas extra!',
      recommendedMission: 'Misión Recomendada',
      continueMission: 'Continuar Misión',
      minutes: 'min',
      exploreWorlds: 'Explora los 10 Mundos',
      worldsUnlockedCount: '3 de 10 Desbloqueados',
      viewFullMap: 'Ver Mapa Completo',
      parentModeTitle: 'Modo Familias & Padres',
      parentModeDesc: 'Informes de progreso y consejos para conversar en casa',
      ciberDailyTip: 'Consejo del Día de Ciber',
      ciberDailyTipDesc: '¡Las contraseñas son como un cepillo de dientes: no se comparten con nadie y conviene cambiarlas periódicamente!',
    },
    worlds: {
      title: 'Mapa de Mundos',
      mapTitle: 'Mapa de Mundos',
      subtitle: '10 Reinos de Ciberseguridad',
      detailTitle: 'Detalle del Reino',
      exploreWorld: 'Explorar Mundo',
      enterWorld: 'Entrar al Mundo',
      lockedDesc: 'Completa más misiones en los mundos anteriores para desbloquear este reino.',
      locked: 'Bloqueado',
      unlocked: 'Desbloqueado',
      active: 'En Curso',
      status: {
        active: 'En curso',
        locked: 'Bloqueado',
        unlocked: 'Desbloqueado',
      },
      completedMissions: 'misiones completadas',
      finalChallenge: 'Reto Final',
      allWorlds: 'Todos los Mundos',
    },
    worldDetail: {
      missionsCount: '{completed} de {total} Misiones',
      missionsTitle: 'Misiones del Reino',
      worldMotto: 'Lema del Mundo',
      worldProgress: 'Progreso del Mundo',
      learningPath: 'Ruta de Aprendizaje',
      play: 'Jugar',
      open: 'Abrir',
      tapToPlay: 'Toca una misión para jugar',
      locked: 'Bloqueada',
      bossMission: 'Misión Final Boss',
      bossBadge: '¡JEFE!',
      backToMap: 'Volver al Mapa',
      rewards: 'Recompensas',
    },
    missionIntro: {
      briefing: 'Briefing de Misión',
      interactiveChallenge: 'Reto Interactivo',
      objective: 'Objetivo de Aprendizaje',
      ciberAdvice: 'Consejo de Ciber:',
      cyberTipTitle: 'Consejo de Ciber:',
      cyberTipBody: 'Presta mucha atención a los detalles visuales. Si algo te parece sospechoso o demasiado bueno para ser verdad, ¡probablemente sea una trampa!',
      objectives: 'Objetivos de la misión',
      obj1: 'Identificar elementos o pistas de riesgo en pantalla',
      obj2: 'Tomar la decisión correcta antes de publicar o compartir',
      obj3: 'Ganar recompensas de XP, monedas y desbloquear tu medalla',
      startMission: '¡Comenzar Desafío!',
      rewardsTitle: 'Recompensas al Ganar',
      startChallenge: '¡Comenzar Desafío!',
      timeEstimate: 'Tiempo estimado',
    },
    missionResult: {
      successBadge: '¡Misión Completada con Éxito!',
      title: '¡Gran Trabajo de Seguridad!',
      subtitle: 'Protegiste la información digital como un verdadero ciberdetective.',
      rewardsTitle: 'Recompensas Ganadas',
      badgeUnlocked: '¡Nueva Medalla Desbloqueada!',
      skillBoosted: 'Habilidad Mejorada',
      continueBtn: '¡Genial, Continuar!',
    },
    achievements: {
      gallery: 'Galería de Trofeos',
      title: 'Tus Medallas',
      unlockedOf: '{unlocked} de {total}',
      allCategory: 'Todos',
      privacyCategory: 'Privacidad',
      securityCategory: 'Seguridad',
      starterCategory: 'Iniciación',
      commonRarity: 'Común',
      rareRarity: 'Raro',
      epicRarity: 'Épico',
      unlockedStatus: 'Desbloqueada con éxito',
      lockedStatus: 'Completa misiones de este mundo para desbloquear',
    },
    profile: {
      title: 'Perfil de Guardián',
      guardianTitle: 'Guardián Digital ({age} años)',
      missionsCountLabel: 'Misiones Logradas',
      badgesCountLabel: 'Medallas Ganadas',
      skillsTitle: 'Habilidades de Ciberseguridad',
      masteryLevel: 'Nivel de Maestría',
      languageSetting: 'Idioma de la App',
      parentModeTitle: 'Modo Padres & Educadores',
      parentModeDesc: 'Panel de progreso pedagógico, fortalezas y consejos familiares.',
      editTooltip: 'Editar avatar o nombre',
      skills: {
        privacidad: 'Privacidad & Identidad',
        contrasenas: 'Contraseñas & Cuentas',
        phishing: 'Phishing & Estafas',
        redesSociales: 'Redes Sociales',
        gamingSeguro: 'Gaming Seguro',
        iaDeepfakes: 'IA y Deepfakes',
      },
    },
    parentGate: {
      tag: 'Control Parental',
      badge: 'Control Parental',
      back: 'Volver',
      backToGame: 'Volver al juego',
      title: 'Zona para Familias & Adultos',
      subtitle: 'Por seguridad de los niños, resuelve este cálculo para ingresar:',
      desc: 'Resuelve este sencillo cálculo mental para acceder a los informes pedagógicos:',
      securityQuestion: 'Pregunta de seguridad:',
      questionLabel: 'Pregunta de verificación:',
      question: '¿Cuánto es seis multiplicado por cuatro?',
      mathQuestion: '¿Cuánto es seis multiplicado por cuatro?',
      hint: '(Escribe el número: 6 × 4 = 24)',
      mathFormula: '(Escribe el resultado: 6 × 4)',
      error: 'Respuesta incorrecta. Intenta nuevamente.',
      errorIncorrect: 'Resultado incorrecto. Intenta de nuevo.',
      bypassBtn: 'Acceso rápido de prueba (Saltar verificación)',
      demoBypass: 'Acceso directo de demostración',
      footerNotice: 'CiberKids garantiza un entorno seguro sin compras ni anuncios de terceros.',
      safeGuarantee: '🔒 CiberKids garantiza un entorno seguro sin compras ni anuncios de terceros.',
    },
    parentDashboard: {
      title: 'Portal para Familias',
      subtitle: 'Seguimiento pedagógico y seguridad',
      childModeBtn: 'Modo Niño',
      lastActivity: 'Última actividad',
      lastActivityTime: 'Hoy, hace 5 min',
      generalProgress: 'Progreso General de Aprendizaje',
      progressDesc: 'Tu hijo comprende muy bien los riesgos de geolocalización y fotos públicas, avanzando al ritmo ideal para su edad.',
      strengths: 'Fortalezas',
      needsPractice: 'Para practicar',
      strength1: 'Privacidad',
      strength2: 'Contraseñas',
      practice1: 'Phishing & Enlaces',
      practice2: 'Descargas web',
      conversationTitle: 'Consejo para conversar en familia',
      conversationQuote: '"Pregunta a tu hijo: ¿Qué información nunca compartirías con un desconocido, aunque prometa regalarte gemas o monedas en un juego?"',
      conversationDesc: 'Aprovecha la cena o el viaje en auto para hablar de forma abierta, sin regaños ni castigos, reforzando la confianza mutua.',
      recentActivity: 'Actividad reciente',
      today: 'Hoy',
      activity1Title: 'Completó la misión: ¿Qué compartirías?',
      activity1Desc: 'Detectó 4 riesgos en una fotografía sin equivocaciones.',
      activity2Title: 'Ganó 120 XP y 25 monedas',
      activity2Desc: 'Subió de nivel en habilidad de Privacidad (+8 puntos).',
      childrenTabTitle: 'Perfiles Infantiles Vinculados',
      addChildBtn: '+ Añadir otro hijo o estudiante',
      insightsTabTitle: 'Guías de Seguridad Digital',
      insight1Title: 'Cómo hablar sobre estafas en videojuegos',
      insight1Desc: 'Los ciberdelincuentes usan la promesa de skins o monedas gratis en Roblox o Fortnite. Explícales que ninguna empresa pide contraseñas por chat.',
      insight2Title: 'Reglas de oro para fotografías escolares',
      insight2Desc: 'Oculta nombres, escudos de uniformes y placas de vehículos antes de compartir recuerdos en redes sociales familiares.',
      settingsTabTitle: 'Configuración Parental',
      languageSelect: 'Idioma de la plataforma',
      timeLimitLabel: 'Límite de tiempo de juego diario',
      timeLimitValue: '30 minutos',
      notificationsLabel: 'Notificaciones de progreso semanal',
      notificationsValue: 'Activado',
      pinLabel: 'Código PIN de acceso a Modo Padres',
      pinValue: 'Modificar',
    },
    gameScreen: {
      back: 'Volver',
      allMechanics: '12 Mecánicas de Juego CiberKids',
      hintTitle: 'Consejo de Ciber:',
      hintText: 'Recuerda que en Internet tus datos privados son tu escudo. ¡Tómate tu tiempo y diviértete investigando!',
      understood: 'Entendido',
      photoInstruction: 'Riesgos de Privacidad',
      photoSub: 'Toca los datos que NO debes compartir en redes',
      photoFoundCount: 'Riesgos encontrados',
    },
  },
  fr: {
    common: {
      back: 'Retour',
      continue: 'Continuer',
      start: 'Commencer',
      skip: 'Passer',
      close: 'Fermer',
      save: 'Enregistrer',
      coins: 'Pièces',
      xp: 'XP',
      level: 'Niveau',
      easy: 'Facile',
      medium: 'Moyen',
      hard: 'Difficile',
      ciberAdvice: 'Conseil de Ciber',
      understood: 'Compris',
      language: 'Langue',
      selectLanguage: 'Choisir la Langue',
      spanish: 'Español',
      french: 'Français',
      english: 'English',
      badge: 'Badge',
      requiresLevel: 'Niveau requis',
    },
    nav: {
      home: 'Accueil',
      worlds: 'Jeux',
      education: 'Éducation',
      achievements: 'Succès',
      profile: 'Profil',
      parentPortal: 'Mode Parents',
      childMode: 'Mode Enfant',
      dashboard: 'Tableau',
      children: 'Enfants',
      insights: 'Conseils',
      settings: 'Paramètres',
    },
    onboarding: {
      skip: 'Passer',
      continue: 'Continuer',
      startAdventure: "Commencer l'Aventure !",
      slide1: {
        title: 'CiberKids',
        subtitle: 'Ton cyber-voyage commence ici !',
        desc: 'Apprends à naviguer en toute sécurité sur Internet tout en jouant et en réussissant des missions.',
      },
      slide2: {
        title: 'Explore 10 Mondes',
        subtitle: 'Découvre des secrets et débloque des médailles',
        desc: 'Surmonte des défis sur les mots de passe, réseaux sociaux, jeux vidéo et pièges de phishing.',
      },
      slide3: {
        title: 'Apprends en Jouant',
        subtitle: 'Sans examens ni devoirs ennuyeux',
        desc: 'Chaque décision intelligente renforce tes compétences pour devenir un gardien numérique légendaire.',
      },
      slides: [
        {
          title: 'CiberKids',
          subtitle: 'Ton cyber-voyage commence ici !',
          description: 'Apprends à naviguer en toute sécurité sur Internet tout en jouant et en réussissant des missions.',
        },
        {
          title: 'Explore 10 Mondes',
          subtitle: 'Découvre des secrets et débloque des médailles',
          description: 'Surmonte des défis sur les mots de passe, réseaux sociaux, jeux vidéo et pièges de phishing.',
        },
        {
          title: 'Apprends en Jouant',
          subtitle: 'Sans examens ni devoirs ennuyeux',
          description: 'Chaque décision intelligente renforce tes compétences pour devenir un gardien numérique légendaire.',
        },
      ],
      startBtn: "Commencer l'Aventure !",
      nextBtn: 'Suivant',
    },
    profileCreation: {
      title: 'Crée ton Identité Numérique',
      subtitle: '100% anonyme et sécurisé pour te protéger',
      step: 'Étape 2 sur 2 • 100% anonyme et sécurisé !',
      step1Avatar: '1. Choisis ton Avatar Gardien',
      step2Color: '2. Couleur de ton Aura / Bouclier',
      step3Nickname: '3. Ton Pseudo Sécurisé',
      step4Age: "4. Ta Tranche d'Âge",
      nicknameLabel: 'Ton Pseudo Sécurisé',
      nicknameHint: "N'utilise jamais ton vrai nom ni ton prénom",
      nicknameTip: "💡 Conseil de Ciber : N'utilise jamais ton vrai nom ni ton prénom sur Internet !",
      suggest: 'Suggérer',
      randomize: 'Aléatoire',
      avatarLabel: 'Choisis ton Avatar Gardien',
      shieldColorLabel: 'Couleur de ton Bouclier',
      ageGroupLabel: "Ta Tranche d'Âge",
      ageGroupHint: 'Pour adapter le vocabulaire et la difficulté des défis',
      startAdventure: 'Commencer Ma Mission !',
      saveAndEnter: 'Enregistrer et Entrer dans CiberKids !',
      defaultNick: 'CyberGamer',
      years: 'ans',
    },
    home: {
      greeting: 'Bonjour, {name} !',
      guardianRank: 'Gardien des Données Novice',
      xpLabel: 'Expérience (XP)',
      streakTitle: 'Série Quotidienne : 4 Jours Actifs',
      streakSubtitle: 'Reviens demain pour gagner 30 pièces bonus !',
      recommendedMission: 'Mission Recommandée',
      continueMission: 'Continuer la Mission',
      minutes: 'min',
      exploreWorlds: 'Explore les 10 Mondes',
      worldsUnlockedCount: '3 sur 10 Débloqués',
      viewFullMap: 'Voir la Carte Complète',
      parentModeTitle: 'Mode Familles & Parents',
      parentModeDesc: 'Rapports de progrès et sujets de discussion à la maison',
      ciberDailyTip: 'Conseil du Jour de Ciber',
      ciberDailyTipDesc: 'Les mots de passe sont comme une brosse à dents : on ne les partage jamais et on les change régulièrement !',
    },
    worlds: {
      title: 'Carte des Mondes',
      mapTitle: 'Carte des Mondes',
      subtitle: '10 Royaumes de Cybersécurité',
      detailTitle: 'Détail du Royaume',
      exploreWorld: 'Explorer le Monde',
      enterWorld: 'Entrer dans le Monde',
      lockedDesc: 'Termine plus de missions dans les mondes précédents pour débloquer ce royaume.',
      locked: 'Verrouillé',
      unlocked: 'Débloqué',
      active: 'En Cours',
      status: {
        active: 'En cours',
        locked: 'Verrouillé',
        unlocked: 'Débloqué',
      },
      completedMissions: 'missions terminées',
      finalChallenge: 'Défi Final',
      allWorlds: 'Tous les Mondes',
    },
    worldDetail: {
      missionsCount: '{completed} sur {total} Missions',
      missionsTitle: 'Missions du Royaume',
      worldMotto: 'Devise du Monde',
      worldProgress: 'Progression du Monde',
      learningPath: "Parcours d'Apprentissage",
      play: 'Jouer',
      open: 'Ouvrir',
      tapToPlay: 'Touche une mission pour jouer',
      locked: 'Verrouillée',
      bossMission: 'Mission Boss Final',
      bossBadge: 'BOSS !',
      backToMap: 'Retour à la Carte',
      rewards: 'Récompenses',
    },
    missionIntro: {
      briefing: 'Briefing de Mission',
      interactiveChallenge: 'Défi Interactif',
      objective: "Objectif d'Apprentissage",
      ciberAdvice: 'Conseil de Ciber :',
      cyberTipTitle: 'Conseil de Ciber :',
      cyberTipBody: "Fais bien attention aux détails visuels. Si quelque chose te semble suspect ou trop beau pour être vrai, c'est probablement un piège !",
      objectives: 'Objectifs de la mission',
      obj1: "Identifier les éléments ou indices de risque à l'écran",
      obj2: 'Prendre la bonne décision avant de publier ou partager',
      obj3: "Gagner des récompenses d'XP, des pièces et débloquer ton badge",
      startMission: 'Commencer le Défi !',
      rewardsTitle: 'Récompenses en cas de Victoire',
      startChallenge: 'Commencer le Défi !',
      timeEstimate: 'Temps estimé',
    },
    missionResult: {
      successBadge: 'Mission Réussie avec Succès !',
      title: 'Super Travail de Sécurité !',
      subtitle: 'Tu as protégé les données numériques comme un vrai cyber-détective.',
      rewardsTitle: 'Récompenses Gagnées',
      badgeUnlocked: 'Nouveau Badge Débloqué !',
      skillBoosted: 'Compétence Améliorée',
      continueBtn: 'Génial, Continuer !',
    },
    achievements: {
      gallery: 'Galerie des Trophées',
      title: 'Tes Badges',
      unlockedOf: '{unlocked} sur {total}',
      allCategory: 'Tous',
      privacyCategory: 'Confidentialité',
      securityCategory: 'Sécurité',
      starterCategory: 'Débutant',
      commonRarity: 'Commun',
      rareRarity: 'Rare',
      epicRarity: 'Épique',
      unlockedStatus: 'Débloqué avec succès',
      lockedStatus: 'Termine des missions dans ce monde pour débloquer',
    },
    profile: {
      title: 'Profil du Gardien',
      guardianTitle: 'Gardien Numérique ({age} ans)',
      missionsCountLabel: 'Missions Réussies',
      badgesCountLabel: 'Badges Remportés',
      skillsTitle: 'Compétences Cyber',
      masteryLevel: 'Niveau de Maîtrise',
      languageSetting: "Langue de l'Application",
      parentModeTitle: 'Mode Parents & Éducateurs',
      parentModeDesc: 'Suivi pédagogique, points forts et conseils pour échanger en famille.',
      editTooltip: "Modifier l'avatar ou le pseudo",
      skills: {
        privacidad: 'Confidentialité & Identité',
        contrasenas: 'Mots de Passe & Comptes',
        phishing: 'Phishing & Arnaques',
        redesSociales: 'Réseaux Sociaux',
        gamingSeguro: 'Jeux Vidéo Sécurisés',
        iaDeepfakes: 'IA & Deepfakes',
      },
    },
    parentGate: {
      tag: 'Contrôle Parental',
      badge: 'Contrôle Parental',
      back: 'Retour',
      backToGame: 'Retour au jeu',
      title: 'Zone Parents & Adultes',
      subtitle: 'Pour la sécurité des enfants, résous ce calcul pour entrer :',
      desc: 'Résous ce simple calcul mental pour accéder aux rapports pédagogiques :',
      securityQuestion: 'Question de sécurité :',
      questionLabel: 'Question de vérification :',
      question: 'Combien font six multiplié par quatre ?',
      mathQuestion: 'Combien font six multiplié par quatre ?',
      hint: '(Écris le résultat : 6 × 4 = 24)',
      mathFormula: '(Écris le résultat : 6 × 4)',
      error: 'Réponse incorrecte. Réessaie.',
      errorIncorrect: 'Résultat incorrect. Réessaie.',
      bypassBtn: 'Accès rapide de test (Passer la vérification)',
      demoBypass: 'Accès direct de démonstration',
      footerNotice: 'CiberKids garantit un environnement sécurisé sans achats intégrés ni publicités tierces.',
      safeGuarantee: '🔒 CiberKids garantit un environnement sécurisé sans achats intégrés ni publicités tierces.',
    },
    parentDashboard: {
      title: 'Portail Famille',
      subtitle: 'Suivi pédagogique et sécurité',
      childModeBtn: 'Mode Enfant',
      lastActivity: 'Dernière activité',
      lastActivityTime: "Aujourd'hui, il y a 5 min",
      generalProgress: "Progression Générale d'Apprentissage",
      progressDesc: 'Votre enfant comprend très bien les risques de géolocalisation et photos publiques, progressant au rythme idéal pour son âge.',
      strengths: 'Forces',
      needsPractice: 'À pratiquer',
      strength1: 'Confidentialité',
      strength2: 'Mots de passe',
      practice1: 'Phishing & Liens',
      practice2: 'Téléchargements web',
      conversationTitle: 'Sujet de discussion en famille',
      conversationQuote: '"Demandez à votre enfant : Quelle information ne partagerais-tu jamais avec un inconnu, même s\'il te promet des gemmes gratuites dans un jeu ?"',
      conversationDesc: 'Profitez du dîner pour aborder ces sujets sereinement, sans punition, en renforçant la confiance mutuelle.',
      recentActivity: 'Activité récente',
      today: "Aujourd'hui",
      activity1Title: 'A terminé la mission : Que partagerais-tu ?',
      activity1Desc: 'A identifié 4 risques dans une photo scolaire sans erreur.',
      activity2Title: 'A gagné 120 XP et 25 pièces',
      activity2Desc: 'A augmenté sa compétence en Confidentialité (+8 points).',
      childrenTabTitle: 'Profils Enfants Liés',
      addChildBtn: '+ Ajouter un autre enfant ou élève',
      insightsTabTitle: 'Guides de Sécurité Numérique',
      insight1Title: 'Comment parler des arnaques dans les jeux vidéo',
      insight1Desc: "Les cybercriminels promettent des skins ou monnaies gratuites dans Roblox ou Fortnite. Expliquez qu'aucune entreprise ne demande de mot de passe par chat.",
      insight2Title: "Règles d'or pour les photos d'école",
      insight2Desc: 'Masquez les prénoms, logos d\'école et plaques d\'immatriculation avant de partager des souvenirs sur les réseaux.',
      settingsTabTitle: 'Paramètres Parentaux',
      languageSelect: 'Langue de la plateforme',
      timeLimitLabel: 'Limite de temps de jeu quotidien',
      timeLimitValue: '30 minutes',
      notificationsLabel: 'Rapports de progrès hebdomadaires',
      notificationsValue: 'Activé',
      pinLabel: 'Code PIN d\'accès au Mode Parents',
      pinValue: 'Modifier',
    },
    gameScreen: {
      back: 'Retour',
      allMechanics: '12 Mécaniques de Jeu CiberKids',
      hintTitle: 'Conseil de Ciber :',
      hintText: 'Rappelle-toi que sur Internet tes données privées sont ton bouclier. Prends ton temps et amuse-toi à enquêter !',
      understood: 'Compris',
      photoInstruction: 'Risques de Confidentialité',
      photoSub: 'Touche les éléments que tu ne dois PAS partager en ligne',
      photoFoundCount: 'Risques trouvés',
    },
  },
  en: {
    common: {
      back: 'Back',
      continue: 'Continue',
      start: 'Start',
      skip: 'Skip',
      close: 'Close',
      save: 'Save',
      coins: 'Coins',
      xp: 'XP',
      level: 'Level',
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
      ciberAdvice: "Ciber's Advice",
      understood: 'Got it',
      language: 'Language',
      selectLanguage: 'Choose Language',
      spanish: 'Español',
      french: 'Français',
      english: 'English',
      badge: 'Badge',
      requiresLevel: 'Requires Level',
    },
    nav: {
      home: 'Home',
      worlds: 'Games',
      education: 'Education',
      achievements: 'Badges',
      profile: 'Profile',
      parentPortal: 'Parent Mode',
      childMode: 'Child Mode',
      dashboard: 'Dashboard',
      children: 'Children',
      insights: 'Insights',
      settings: 'Settings',
    },
    onboarding: {
      skip: 'Skip',
      continue: 'Continue',
      startAdventure: 'Start Adventure!',
      slide1: {
        title: 'CiberKids',
        subtitle: 'Your cyber journey starts here!',
        desc: 'Learn to browse the internet safely while playing and solving exciting missions.',
      },
      slide2: {
        title: 'Explore 10 Worlds',
        subtitle: 'Discover secrets and unlock collectible badges',
        desc: 'Master challenges on passwords, social media, online gaming, and phishing traps.',
      },
      slide3: {
        title: 'Learn by Playing',
        subtitle: 'No tests or boring homework',
        desc: 'Every smart decision boosts your skills to become a legendary digital guardian.',
      },
      slides: [
        {
          title: 'CiberKids',
          subtitle: 'Your cyber journey starts here!',
          description: 'Learn to browse the internet safely while playing and solving exciting missions.',
        },
        {
          title: 'Explore 10 Worlds',
          subtitle: 'Discover secrets and unlock collectible badges',
          description: 'Master challenges on passwords, social media, online gaming, and phishing traps.',
        },
        {
          title: 'Learn by Playing',
          subtitle: 'No tests or boring homework',
          description: 'Every smart decision boosts your skills to become a legendary digital guardian.',
        },
      ],
      startBtn: 'Start Adventure!',
      nextBtn: 'Next',
    },
    profileCreation: {
      title: 'Create Your Digital Identity',
      subtitle: '100% anonymous and safe to protect you',
      step: 'Step 2 of 2 • 100% anonymous and safe!',
      step1Avatar: '1. Choose Your Guardian Avatar',
      step2Color: '2. Your Aura / Shield Color',
      step3Nickname: '3. Your Safe Nickname',
      step4Age: '4. Your Age Group',
      nicknameLabel: 'Your Safe Nickname',
      nicknameHint: 'Never use your real full name or surname',
      nicknameTip: '💡 Ciber Tip: Never use your real first or last name on the Internet!',
      suggest: 'Suggest',
      randomize: 'Randomize',
      avatarLabel: 'Choose Your Guardian Avatar',
      shieldColorLabel: 'Shield Accent Color',
      ageGroupLabel: 'Your Age Group',
      ageGroupHint: 'To adapt language and challenge difficulty',
      startAdventure: 'Start My Mission!',
      saveAndEnter: 'Save and Enter CiberKids!',
      defaultNick: 'CyberGamer',
      years: 'years',
    },
    home: {
      greeting: 'Hello, {name}!',
      guardianRank: 'Novice Data Guardian',
      xpLabel: 'Experience (XP)',
      streakTitle: 'Daily Streak: 4 Active Days',
      streakSubtitle: 'Come back tomorrow to earn 30 bonus coins!',
      recommendedMission: 'Recommended Mission',
      continueMission: 'Continue Mission',
      minutes: 'min',
      exploreWorlds: 'Explore all 10 Worlds',
      worldsUnlockedCount: '3 of 10 Unlocked',
      viewFullMap: 'View Full Map',
      parentModeTitle: 'Families & Parents Mode',
      parentModeDesc: 'Progress reports and conversation starters for home',
      ciberDailyTip: "Ciber's Daily Security Tip",
      ciberDailyTipDesc: 'Passwords are like toothbrushes: never share them with anyone, and change them periodically!',
    },
    worlds: {
      title: 'World Map',
      mapTitle: 'World Map',
      subtitle: '10 Cybersecurity Realms',
      detailTitle: 'Realm Details',
      exploreWorld: 'Explore World',
      enterWorld: 'Enter World',
      lockedDesc: 'Complete more missions in previous worlds to unlock this realm.',
      locked: 'Locked',
      unlocked: 'Unlocked',
      active: 'In Progress',
      status: {
        active: 'In progress',
        locked: 'Locked',
        unlocked: 'Unlocked',
      },
      completedMissions: 'missions completed',
      finalChallenge: 'Final Challenge',
      allWorlds: 'All Worlds',
    },
    worldDetail: {
      missionsCount: '{completed} of {total} Missions',
      missionsTitle: 'Kingdom Missions',
      worldMotto: 'World Motto',
      worldProgress: 'World Progress',
      learningPath: 'Learning Journey',
      play: 'Play',
      open: 'Open',
      tapToPlay: 'Tap a mission to play',
      locked: 'Locked',
      bossMission: 'Final Boss Mission',
      bossBadge: 'BOSS!',
      backToMap: 'Back to Map',
      rewards: 'Rewards',
    },
    missionIntro: {
      briefing: 'Mission Briefing',
      interactiveChallenge: 'Interactive Challenge',
      objective: 'Learning Objective',
      ciberAdvice: "Ciber's Advice:",
      cyberTipTitle: "Ciber's Advice:",
      cyberTipBody: 'Pay close attention to visual details. If something seems suspicious or too good to be true, it is probably a trap!',
      objectives: 'Mission Objectives',
      obj1: 'Identify risk elements or clues on the screen',
      obj2: 'Make the right decision before publishing or sharing',
      obj3: 'Earn XP rewards, coins, and unlock your badge',
      startMission: 'Start Challenge!',
      rewardsTitle: 'Rewards on Victory',
      startChallenge: 'Start Challenge!',
      timeEstimate: 'Estimated time',
    },
    missionResult: {
      successBadge: 'Mission Successfully Completed!',
      title: 'Awesome Security Job!',
      subtitle: 'You protected digital data like a true cyber detective.',
      rewardsTitle: 'Earned Rewards',
      badgeUnlocked: 'New Badge Unlocked!',
      skillBoosted: 'Skill Upgraded',
      continueBtn: 'Awesome, Continue!',
    },
    achievements: {
      gallery: 'Trophy Gallery',
      title: 'Your Badges',
      unlockedOf: '{unlocked} of {total}',
      allCategory: 'All',
      privacyCategory: 'Privacy',
      securityCategory: 'Security',
      starterCategory: 'Starter',
      commonRarity: 'Common',
      rareRarity: 'Rare',
      epicRarity: 'Epic',
      unlockedStatus: 'Successfully unlocked',
      lockedStatus: 'Complete missions in this world to unlock',
    },
    profile: {
      title: 'Guardian Profile',
      guardianTitle: 'Digital Guardian ({age} yrs)',
      missionsCountLabel: 'Missions Completed',
      badgesCountLabel: 'Badges Won',
      skillsTitle: 'Cybersecurity Skills',
      masteryLevel: 'Mastery Level',
      languageSetting: 'App Language',
      parentModeTitle: 'Parents & Educators Mode',
      parentModeDesc: 'Pedagogical progress dashboard, strengths, and family conversation tips.',
      editTooltip: 'Edit avatar or nickname',
      skills: {
        privacidad: 'Privacy & Identity',
        contrasenas: 'Passwords & Accounts',
        phishing: 'Phishing & Scams',
        redesSociales: 'Social Networks',
        gamingSeguro: 'Safe Gaming',
        iaDeepfakes: 'AI & Deepfakes',
      },
    },
    parentGate: {
      tag: 'Parental Gate',
      badge: 'Parental Control',
      back: 'Back',
      backToGame: 'Back to game',
      title: 'Parents & Adults Area',
      subtitle: 'For child safety, solve this math problem to enter:',
      desc: 'Solve this simple mental math calculation to access educational reports:',
      securityQuestion: 'Security question:',
      questionLabel: 'Verification question:',
      question: 'What is six multiplied by four?',
      mathQuestion: 'What is six multiplied by four?',
      hint: '(Type the number: 6 × 4 = 24)',
      mathFormula: '(Type the result: 6 × 4)',
      error: 'Incorrect answer. Please try again.',
      errorIncorrect: 'Incorrect result. Please try again.',
      bypassBtn: 'Quick test bypass (Skip verification)',
      demoBypass: 'Quick demo bypass',
      footerNotice: 'CiberKids guarantees a safe environment with no in-app purchases or third-party ads.',
      safeGuarantee: '🔒 CiberKids guarantees a safe environment with no in-app purchases or third-party ads.',
    },
    parentDashboard: {
      title: 'Family Portal',
      subtitle: 'Pedagogical tracking & safety',
      childModeBtn: 'Child Mode',
      lastActivity: 'Last activity',
      lastActivityTime: 'Today, 5 min ago',
      generalProgress: 'Overall Learning Progress',
      progressDesc: 'Your child understands geolocation and public photo risks very well, advancing at the ideal pace for their age.',
      strengths: 'Strengths',
      needsPractice: 'Needs practice',
      strength1: 'Privacy',
      strength2: 'Passwords',
      practice1: 'Phishing & Links',
      practice2: 'Web Downloads',
      conversationTitle: 'Family conversation prompt',
      conversationQuote: '"Ask your child: What information would you never share with a stranger, even if they promise to give you free gems or coins in a game?"',
      conversationDesc: 'Use dinner or a car ride to talk openly without scolding or punishment, reinforcing mutual trust.',
      recentActivity: 'Recent activity',
      today: 'Today',
      activity1Title: 'Completed mission: What would you share?',
      activity1Desc: 'Detected 4 risks in a school photo without mistakes.',
      activity2Title: 'Earned 120 XP and 25 coins',
      activity2Desc: 'Leveled up Privacy skill (+8 points).',
      childrenTabTitle: 'Linked Children Profiles',
      addChildBtn: '+ Add another child or student',
      insightsTabTitle: 'Digital Safety Guides',
      insight1Title: 'How to talk about video game scams',
      insight1Desc: 'Cybercriminals promise free skins or coins in Roblox or Fortnite. Explain that no real company ever asks for passwords via chat.',
      insight2Title: 'Golden rules for school photos',
      insight2Desc: 'Hide names, school logos, and car license plates before sharing family memories on social media.',
      settingsTabTitle: 'Parental Settings',
      languageSelect: 'Platform Language',
      timeLimitLabel: 'Daily play time limit',
      timeLimitValue: '30 minutes',
      notificationsLabel: 'Weekly progress reports',
      notificationsValue: 'Enabled',
      pinLabel: 'Parent Mode access PIN code',
      pinValue: 'Modify',
    },
    gameScreen: {
      back: 'Back',
      allMechanics: '12 CiberKids Game Mechanics',
      hintTitle: "Ciber's Advice:",
      hintText: 'Remember that on the Internet your private data is your shield. Take your time and have fun investigating!',
      understood: 'Got it',
      photoInstruction: 'Privacy Risks',
      photoSub: 'Tap the data you should NOT share online',
      photoFoundCount: 'Risks found',
    },
  },
};
