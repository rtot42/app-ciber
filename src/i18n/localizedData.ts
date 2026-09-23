import { Language, World, AchievementBadge, GameHotspot } from '../types';
import { WORLDS_DATA, BADGES_DATA, PHOTO_HOTSPOTS } from '../data';

// Localized World & Mission overrides
interface LocalizedWorldText {
  name: string;
  title: string;
  subtitle: string;
  motto: string;
  biome: string;
  finalChallengeTitle: string;
  finalChallengeDesc: string;
  missions: Array<{
    title: string;
    subtitle: string;
    description: string;
  }>;
}

const WORLD_LOCALIZATIONS: Record<Language, Record<string, LocalizedWorldText>> = {
  es: {
    'world-1': {
      name: 'Isla Privacidad',
      title: 'Identidad & Privacidad',
      subtitle: 'Protege lo que te hace único en el mundo digital.',
      motto: 'Tus datos son tu tesoro',
      biome: 'Archipiélago paradisíaco con torres de vigilancia y radares de datos',
      finalChallengeTitle: 'El Investigador de Privacidad',
      finalChallengeDesc: 'Audita un perfil completo de red social y elimina 5 huellas de privacidad antes de que se haga público.',
      missions: [
        {
          title: '¿Qué compartirías?',
          subtitle: 'Examina una foto escolar antes de subirla.',
          description: 'Una foto parece inocente, pero contiene 4 detalles que revelan dónde vives y estudias.',
        },
        {
          title: 'El Cuadrante Privado',
          subtitle: 'Ajusta el dial de visibilidad de tu perfil.',
          description: 'Experimenta con los controles: Público, Amigos o Solo yo, y observa qué ve un extraño.',
        },
        {
          title: 'Detective de Datos',
          subtitle: 'Clasifica datos entre públicos y secretos.',
          description: 'Arrastra tarjetas a la zona Segura o Riesgosa según el tipo de información personal.',
        },
        {
          title: 'El Radar GPS Oculto',
          subtitle: 'Desactiva metadatos de ubicación en fotos.',
          description: 'Aprende cómo las fotos guardan coordenadas exactas y cómo apagarlas.',
        },
        {
          title: 'Parejas de Identidad',
          subtitle: 'Memoriza qué datos nunca van en un formulario público.',
          description: 'Empareja datos sensibles con sus escudos correspondientes.',
        },
        {
          title: 'El Búnker de Información',
          subtitle: 'Configura la privacidad de tu perfil en 60 segundos.',
          description: 'Pon cerrojos digitales a tus publicaciones.',
        },
        {
          title: 'El Amigo Curioso',
          subtitle: 'Simulador de chat: un compañero pide tu dirección.',
          description: 'Aprende respuestas amables pero firmes para cuidar tu hogar.',
        },
        {
          title: 'El Examen del Gran Guardián',
          subtitle: 'Misión Boss: Detecta 5 vulnerabilidades en tiempo récord.',
          description: 'Aplica todo lo aprendido para recibir el Sello de Oro de Privacidad.',
        },
      ],
    },
    'world-2': {
      name: 'Fortaleza Contraseñas',
      title: 'Cuentas & Llaves Maestras',
      subtitle: 'Forja combinaciones indestructibles y gestiona tus accesos.',
      motto: 'Una buena llave abre tu mundo y bloquea al intruso',
      biome: 'Castillo cibernético de granito y aleaciones de titanio con candados giratorios',
      finalChallengeTitle: 'El Cerrajero Supremo',
      finalChallengeDesc: 'Forja una contraseña maestra indestructible con letras, números y símbolos sin usar datos personales.',
      missions: [
        {
          title: 'La Fragua de Contraseñas',
          subtitle: 'Crea una contraseña legendaria.',
          description: 'Combina palabras secretas, símbolos y números para alcanzar 100% de fuerza.',
        },
        {
          title: 'El Ataque de la Fuerza Bruta',
          subtitle: 'Compara cuánto tarda una máquina en hackear contraseñas débiles.',
          description: 'Observa por qué "123456" cae en 0 segundos y una frase dura siglos.',
        },
        {
          title: 'El Bóveda de Preguntas Secretas',
          subtitle: 'Elige preguntas de seguridad ingeniosas.',
          description: 'Evita respuestas que cualquiera pueda averiguar mirando tus redes.',
        },
        {
          title: 'El Guardián del Doble Factor (2FA)',
          subtitle: 'Activa la segunda capa de protección.',
          description: 'Aprende cómo un código temporal en el móvil frena al 99% de atacantes.',
        },
        {
          title: 'El Llavero Mágico',
          subtitle: 'Aprende qué es y cómo usar un gestor de contraseñas.',
          description: '¡Solo necesitas recordar una contraseña maestra super fuerte!',
        },
        {
          title: 'El Desafío del WiFi Público',
          subtitle: '¿Deberías ingresar contraseñas en el WiFi de la plaza?',
          description: 'Identifica cuándo un canal de red es seguro o vulnerable.',
        },
        {
          title: 'La Contraseña Prestada',
          subtitle: 'Tu mejor amigo te pide tu cuenta para jugar.',
          description: 'Aprende a decir que no con empatía sin poner en riesgo tu cuenta.',
        },
        {
          title: 'El Candado Maestro Ancestral',
          subtitle: 'Misión Boss: Resuelve los 4 enigmas criptográficos de la fortaleza.',
          description: 'Combina autenticación en 2 pasos y frases de paso para sellar la bóveda.',
        },
      ],
    },
    'world-3': {
      name: 'Archipiélago Anti-Phishing',
      title: 'Detección de Engaños & Estafas',
      subtitle: 'Reconoce cebos, enlaces maliciosos y falsas promesas.',
      motto: 'No muerdas el anzuelo, mira antes de hacer clic',
      biome: 'Océano brumoso con faros centinela y bancos de peces holográficos engañosos',
      finalChallengeTitle: 'El Faro Despertador',
      finalChallengeDesc: 'Identifica 6 trampas de phishing en una bandeja de entrada repleta de ofertas falsas y correos urgentes.',
      missions: [
        {
          title: 'El Buzón Sospechoso',
          subtitle: 'Identifica 3 correos fraudulentos en la bandeja de entrada.',
          description: 'Aprende a mirar el remitente real, los errores ortográficos y los enlaces ocultos.',
        },
        {
          title: 'El Anzuelo de Monedas Gratis',
          subtitle: 'La trampa clásica en videojuegos online.',
          description: 'Descubre por qué nadie te regalará 50.000 Robux o V-Bucks por hacer clic.',
        },
        {
          title: 'El Enlace Disfrazado',
          subtitle: 'Pasa el ratón por encima sin hacer clic (Hovering).',
          description: 'Aprende a notar letras cambiadas como "arnazon.com" o "paypa1.com" antes de hacer clic.',
        },
        {
          title: 'Clasificador de Mensajes',
          subtitle: 'Separa correos legítimos de trampas.',
          description: 'Arrastra notificaciones al bote de basura o a la bandeja segura con agilidad.',
        },
        {
          title: 'La Falsa Urgencia',
          subtitle: '¡Tu cuenta será cerrada en 10 minutos!',
          description: 'Por qué los atacantes usan el miedo y la prisa para que no pienses antes de actuar.',
        },
        {
          title: 'El Premio Misterioso',
          subtitle: 'Has ganado la consola del año... ¿o no?',
          description: 'Toma decisiones paso a paso al recibir una notificación de premio sorpresa.',
        },
        {
          title: 'El Candado del Navegador',
          subtitle: 'Comprende el protocolo HTTPS y certificados.',
          description: 'Descubre qué significa el candado verde y cuándo un sitio aún puede ser engañoso.',
        },
        {
          title: 'La Gran Tormenta de Phishing',
          subtitle: 'Misión Boss: Inspecciona 6 ataques en tiempo récord.',
          description: 'Protege a toda la tripulación interceptando anzuelos cibernéticos.',
        },
      ],
    },
    'world-4': {
      name: 'Selva de Redes Sociales',
      title: 'Huella Digital & Convivencia',
      subtitle: 'Comprende el impacto de tus publicaciones y la permanencia de los datos.',
      motto: 'Lo que subes hoy florece o te persigue mañana',
      biome: 'Bosque frondoso con árboles milenarios que proyectan pantallas de recuerdos digitales',
      finalChallengeTitle: 'El Eco de la Red',
      finalChallengeDesc: 'Limpia un feed público de publicaciones comprometedoras para restaurar la armonía digital.',
      missions: [
        {
          title: 'La Huella que Queda',
          subtitle: 'El viaje eterno de una foto en internet.',
          description: 'Aunque borres una publicación, alguien pudo hacer captura de pantalla.',
        },
        {
          title: 'El Espejo de las Vistas',
          subtitle: 'Quién puede ver tus historias y reels.',
          description: 'Configura tus listas de "Mejores Amigos" y perfil privado en redes sociales.',
        },
        {
          title: 'Comentarios Amables',
          subtitle: 'Frena el ciberacoso antes de que comience.',
          description: 'Elige palabras constructivas y reporta conductas de odio.',
        },
        {
          title: 'El Reto Peligroso',
          subtitle: 'Distingue tendencias divertidas de retos dañinos.',
          description: 'Aprende a decir no a los desafíos virales que ponen en riesgo tu salud.',
        },
        {
          title: 'La Búsqueda de Likes',
          subtitle: 'Tu valor no se mide en corazones ni seguidores.',
          description: 'Desconéctate de la presión social y disfruta de tus pasatiempos reales.',
        },
        {
          title: 'Cuentas Clonadas',
          subtitle: 'Detecta si alguien está usando tus fotos para hacerse pasar por ti.',
          description: 'Procedimientos de denuncia y verificación en plataformas oficiales.',
        },
        {
          title: 'El Tiempo en Pantalla',
          subtitle: 'Equilibrio entre el mundo virtual y la vida real.',
          description: 'Configura alarmas de descanso y disfruta del aire libre.',
        },
        {
          title: 'El Árbol de la Sabiduría Digital',
          subtitle: 'Misión Boss: Resuelve el dilema ético de la comunidad.',
          description: 'Ayuda a un amigo a superar un mal momento en línea con empatía.',
        },
      ],
    },
    'world-5': {
      name: 'Arena Gaming Seguro',
      title: 'Videojuegos, Chats de Voz & Economía Virtual',
      subtitle: 'Juega en equipo, protege tu inventario y evita trampas en el multijugador.',
      motto: 'El mejor jugador es el que juega limpio y seguro',
      biome: 'Coliseo futurista de luces de neón con arenas de batalla pixeladas y portales de minijuegos',
      finalChallengeTitle: 'El Torneo del Fair Play',
      finalChallengeDesc: 'Gana la partida protegiendo el chat de voz y rechazando intercambios de ítems sospechosos.',
      missions: [
        {
          title: 'El Chat de Voz',
          subtitle: 'Cuándo silenciar y cómo reportar jugadores tóxicos.',
          description: 'No reveles datos personales mientras juegas con auriculares en partidas abiertas.',
        },
        {
          title: 'La Trampa de los Mods',
          subtitle: 'Archivos sospechosos que prometen skins gratis.',
          description: 'Aprende cómo los troyanos se ocultan dentro de supuestos hacks o trucos de juegos.',
        },
        {
          title: 'El Mercado Negro de Cuentas',
          subtitle: 'Por qué nunca debes comprar ni vender cuentas.',
          description: 'Las cuentas compradas son casi siempre robadas y terminan baneadas permanentemente.',
        },
        {
          title: 'Compras Integradas',
          subtitle: 'Comprende el valor del dinero real en los juegos.',
          description: 'Pide siempre permiso a tus padres antes de gastar en cofres o pases de batalla.',
        },
        {
          title: 'El Intercambio Justo',
          subtitle: 'Reglas de seguridad en sistemas de intercambio de ítems.',
          description: 'Evita ofertas donde te pidan entregar tus objetos primero en otra plataforma.',
        },
        {
          title: 'El Modo Seguro en Consolas',
          subtitle: 'Configura la privacidad en PlayStation, Xbox y Switch.',
          description: 'Ajusta quién puede invitarte a grupos y ver tu estado de conexión.',
        },
        {
          title: 'El Amigo de Partida',
          subtitle: 'Distingue entre un compañero de juego y un amigo íntimo.',
          description: 'Mantén la relación dentro del juego sin pasar a redes privadas o llamadas personales.',
        },
        {
          title: 'La Batalla por el Trofeo Dorado',
          subtitle: 'Misión Boss: Lidera un escuadrón seguro hacia la victoria.',
          description: 'Coordina jugadas limpias, silencia a los tramposos y asegura tu cuenta.',
        },
      ],
    },
    'world-6': {
      name: 'Ciudad de Amistades',
      title: 'Relaciones Digitales & Grooming',
      subtitle: 'Aprende a diferenciar amigos verdaderos de contactos desconocidos y manipuladores.',
      motto: 'Confía en tu intuición y en los adultos que te quieren',
      biome: 'Metrópolis luminosa con plazas públicas y puentes colgantes donde transitan avatares',
      finalChallengeTitle: 'El Guardián del Círculo Íntimo',
      finalChallengeDesc: 'Evalúa 5 solicitudes de amistad y filtra perfiles falsos con intenciones sospechosas.',
      missions: [
        {
          title: 'El Perfil Demasiado Bueno',
          subtitle: 'Detecta fotos de internet en perfiles que dicen ser niños.',
          description: 'Aprende cómo verificar que un nuevo contacto es realmente quien dice ser.',
        },
        {
          title: 'La Regla del Secreto',
          subtitle: 'Si alguien te pide no contarle a tus padres, ¡enciende la alarma!',
          description: 'Ningún amigo honesto te pedirá mantener secretos frente a tu familia.',
        },
        {
          title: 'La Cámara Apagada',
          subtitle: 'Nunca enciendas tu webcam con desconocidos.',
          description: 'Tu intimidad es sagrada; mantén el control de tus dispositivos en todo momento.',
        },
        {
          title: 'El Regalo Inesperado',
          subtitle: 'Cuando un desconocido te compra skins o regalos caros.',
          description: 'Aprende a rechazar regalos que buscan generar un compromiso o chantaje.',
        },
        {
          title: 'El Adulto de Confianza',
          subtitle: 'Identifica a 3 personas a las que siempre puedes acudir.',
          description: 'Mamá, papá, un profesor o un familiar: hablar a tiempo soluciona cualquier problema.',
        },
        {
          title: 'Mensajes Incómodos',
          subtitle: 'Qué hacer si una conversación te hace sentir mal o raro.',
          description: 'Guardar pruebas, bloquear al usuario y pedir ayuda de inmediato sin culpa.',
        },
        {
          title: 'El Salto a Otra App',
          subtitle: '¿Por qué te piden pasar de un juego público a un chat privado?',
          description: 'Los manipuladores buscan salir de plataformas vigiladas para aislarte.',
        },
        {
          title: 'El Escudo del Corazón Digital',
          subtitle: 'Misión Boss: Resuelve el caso del contacto insistente.',
          description: 'Demuestra serenidad y asertividad para proteger tu bienestar emocional.',
        },
      ],
    },
    'world-7': {
      name: 'Laboratorio de Dispositivos',
      title: 'Seguridad en Móviles, Tablets & Computadoras',
      subtitle: 'Permisos de apps, actualizaciones, malware y cámaras.',
      motto: 'Un dispositivo limpio es una fortaleza inexpugnable',
      biome: 'Complejo tecnológico con circuitos transparentes, microchips gigantes y estaciones de escaneo',
      finalChallengeTitle: 'La Cuarentena Cibernética',
      finalChallengeDesc: 'Escanea un teléfono infectado, revoca permisos abusivos y actualiza el sistema operativo.',
      missions: [
        {
          title: 'El Permiso Sospechoso',
          subtitle: '¿Por qué una app de linterna pide acceso a tus contactos?',
          description: 'Revisa y revoca permisos innecesarios de cámara, micrófono y ubicación.',
        },
        {
          title: 'El Escudo de las Actualizaciones',
          subtitle: 'No ignores el cartel de "Actualización pendiente".',
          description: 'Las actualizaciones corrigen fallos de seguridad que los piratas informáticos intentan explotar.',
        },
        {
          title: 'La Tienda Oficial',
          subtitle: 'Peligros de descargar archivos APK de sitios web dudosos.',
          description: 'Usa siempre Google Play o Apple App Store para evitar troyanos bancarios o espías.',
        },
        {
          title: 'El Bloqueo de Pantalla',
          subtitle: 'PIN, patrón o huella dactilar para tu tablet o móvil.',
          description: 'Evita que curiosos o desconocidos revisen tus fotos y mensajes si pierdes el teléfono.',
        },
        {
          title: 'El Malware Oculto',
          subtitle: 'Síntomas de un dispositivo infectado: lentitud y anuncios invasivos.',
          description: 'Aprende a ejecutar un escaneo de seguridad y limpiar la memoria caché.',
        },
        {
          title: 'La Tapa de la Cámara',
          subtitle: 'Un hábito físico para mayor tranquilidad mental.',
          description: 'Cubre la cámara web de tu ordenador cuando no estés en clase en línea.',
        },
        {
          title: 'La Copia de Seguridad',
          subtitle: 'Guarda tus fotos y proyectos escolares en la nube o disco externo.',
          description: 'Si tu dispositivo se estropea o se pierde, no perderás tus recuerdos valiosos.',
        },
        {
          title: 'El Diagnóstico Maestro',
          subtitle: 'Misión Boss: Purifica un sistema operativo en crisis total.',
          description: 'Elimina 4 virus y asegura la red doméstica con éxito.',
        },
      ],
    },
    'world-8': {
      name: 'Valle de la Convivencia',
      title: 'Prevención del Ciberacoso & Empatía',
      subtitle: 'Sé un defensor activo, no un espectador silencioso del maltrato.',
      motto: 'Tus palabras en la red pueden sanar o lastimar: elige ser luz',
      biome: 'Pradera serena con ríos de agua cristalina, flores luminiscentes y jardines zen',
      finalChallengeTitle: 'El Círculo de la Empatía',
      finalChallengeDesc: 'Intervén en un grupo escolar para apoyar a una compañera aislada y reportar a los agresores.',
      missions: [
        {
          title: 'El Espectador Valiente',
          subtitle: 'No te rías ni compartas burlas o memes hirientes.',
          description: 'Apoyar en privado a la víctima o avisar a un profesor cambia vidas.',
        },
        {
          title: 'Grupos de WhatsApp Tóxicos',
          subtitle: 'Cómo actuar cuando se crea un grupo para excluir o insultar a alguien.',
          description: 'Aprende a salirte con elegancia o exigir respeto colectivo.',
        },
        {
          title: 'El Botón de Reporte',
          subtitle: 'Reportar no es acusar: es cuidar la comunidad.',
          description: 'Conoce los canales anónimos de denuncia en redes sociales y juegos.',
        },
        {
          title: 'El Meme Peligroso',
          subtitle: 'La diferencia entre una broma inocente y una humillación pública.',
          description: 'Ponte en el lugar de la otra persona antes de enviar cualquier imagen.',
        },
        {
          title: 'La Captura Traicionera',
          subtitle: 'Difundir conversaciones privadas sin consentimiento es desleal e ilegal.',
          description: 'Aprende a respetar los secretos y la confianza de tus compañeros.',
        },
        {
          title: 'Palabras que Construyen',
          subtitle: 'Usa tus redes para inspirar, animar y compartir pasiones positivas.',
          description: 'Crea una ola de comentarios alentadores para iluminar tu entorno digital.',
        },
        {
          title: 'El Perdón Digital',
          subtitle: 'Si cometiste un error o heriste a alguien, pide disculpas sinceras.',
          description: 'Todos nos equivocamos alguna vez; corregir a tiempo te hace maduro y sabio.',
        },
        {
          title: 'El Concierto de la Armonía',
          subtitle: 'Misión Boss: Restaura la paz en el foro estudiantil.',
          description: 'Transforma un ambiente hostil en un espacio de colaboración y respeto.',
        },
      ],
    },
    'world-9': {
      name: 'Cumbre de la IA & Deepfakes',
      title: 'Pensamiento Crítico & Verificación Digital',
      subtitle: 'Aprende a detectar imágenes generadas por IA, audios clonados y noticias falsas.',
      motto: 'Ver ya no es creer: investiga antes de confiar',
      biome: 'Cordillera de cumbres nevadas con auroras boreales y telescopios de datos holográficos',
      finalChallengeTitle: 'El Tribunal de la Verdad',
      finalChallengeDesc: 'Analiza 5 videos y audios para distinguir creaciones sintéticas de fuentes auténticas.',
      missions: [
        {
          title: 'La Mano de Seis Dedos',
          subtitle: 'Pistas visuales para detectar imágenes creadas con Inteligencia Artificial.',
          description: 'Observa detalles en orejas, textos extraños, reflejos y sombras incompatibles.',
        },
        {
          title: 'La Voz Clonada',
          subtitle: 'Audios que imitan la voz de amigos o familiares con IA.',
          description: 'Establece una palabra clave secreta en familia para emergencias telefónicas.',
        },
        {
          title: 'La Noticia Sensacionalista',
          subtitle: 'Titulares exagerados para ganar clics y sembrar pánico.',
          description: 'Aprende a buscar la noticia en medios serios antes de asustarte o reenviarla.',
        },
        {
          title: 'El Deepfake de Famosos',
          subtitle: 'Videos manipulados donde artistas dicen cosas que nunca dijeron.',
          description: 'Presta atención al parpadeo de los ojos y la sincronización labial.',
        },
        {
          title: 'El Asistente de IA Ético',
          subtitle: 'Cómo usar ChatGPT o Gemini para aprender sin copiar ni hacer trampas.',
          description: 'La IA es un tutor para inspirarte, no para sustituir tu propia inteligencia y esfuerzo.',
        },
        {
          title: 'La Búsqueda Inversa de Imágenes',
          subtitle: 'Usa Google Lens para descubrir el origen real de una fotografía viral.',
          description: 'Comprueba cuándo y dónde se tomó realmente una imagen sospechosa.',
        },
        {
          title: 'Tu Propia Imagen y la IA',
          subtitle: 'Por qué no debes subir selfies a apps desconocidas que crean avatares.',
          description: 'Muchas aplicaciones almacenan tus rasgos biométricos para entrenar modelos sin tu permiso.',
        },
        {
          title: 'El Vórtice de la Información',
          subtitle: 'Misión Boss: Desmantela una red de bulos virales en la cumbre.',
          description: 'Publica el informe de verificación definitivo y devuelve la claridad al ciberespacio.',
        },
      ],
    },
    'world-10': {
      name: 'Ciudadela Guardián',
      title: 'Mando Supremo & Ciberseguridad Global',
      subtitle: 'El desafío final que une todas las habilidades aprendidas para coronarte Gran Guardián.',
      motto: 'Un Guardián protege su mundo y enseña a los demás con el ejemplo',
      biome: 'Ciudadela flotante de cristal dorado sobre una nube de datos cuánticos con la Llama Central',
      finalChallengeTitle: 'La Coronación del Gran Guardián',
      finalChallengeDesc: 'Supera la gran auditoría interactiva de 360 grados y recibe la Insignia Legendaria de CiberKids.',
      missions: [
        {
          title: 'La Gran Auditoría Personal',
          subtitle: 'Revisa tu propio dispositivo y perfil aplicando las 10 reglas de oro.',
          description: 'Verifica contraseñas, privacidad, permisos y copias de seguridad en un solo recorrido.',
        },
        {
          title: 'El Protocolo de Emergencia',
          subtitle: 'Qué hacer si eres víctima de un hackeo o estafa: paso a paso con calma.',
          description: 'Avisar a adultos, cambiar claves, denunciar y desconectar el equipo sin pánico.',
        },
        {
          title: 'El Guía de los Más Pequeños',
          subtitle: 'Enseña a un hermano menor o primo cómo jugar en internet con seguridad.',
          description: 'Compartir tu conocimiento es la forma más noble de ciberdefensa colectiva.',
        },
        {
          title: 'El Pacto Familiar de Pantallas',
          subtitle: 'Crea las reglas de convivencia digital en tu hogar junto a tus padres.',
          description: 'Horarios sin pantallas en la mesa y acuerdos de confianza mutua.',
        },
        {
          title: 'El Desafío Multijugador Cooperativo',
          subtitle: 'Defiende la Ciudadela junto a otros guardianes de la red.',
          description: 'Resuelve acertijos en equipo combinando habilidades de privacidad y criptografía.',
        },
        {
          title: 'El Testamento de la Llama Dorada',
          subtitle: 'Misión Boss Legendaria: La prueba final ante el Consejo de Ancianos Digitales.',
          description: 'Demuestra maestría total y desbloquea el avatar supremo del Guardián del Ciberespacio.',
        },
      ],
    },
  },
  fr: {
    'world-1': {
      name: 'Île Privacité',
      title: 'Identité & Vie Privée',
      subtitle: 'Protège ce qui te rend unique dans le monde numérique.',
      motto: 'Tes données sont ton trésor',
      biome: 'Archipel paradisiaque avec tours de vigie et radars de données',
      finalChallengeTitle: 'L’Enquêteur de la Vie Privée',
      finalChallengeDesc: 'Audite un profil de réseau social et supprime 5 traces privées avant publication.',
      missions: [
        {
          title: 'Que partagerais-tu ?',
          subtitle: 'Examine une photo scolaire avant de la publier.',
          description: 'Une photo semble innocente mais contient 4 détails révélant où tu habites et étudies.',
        },
        {
          title: 'Le Cadran Privé',
          subtitle: 'Ajuste le niveau de visibilité de ton profil.',
          description: 'Expérimente les réglages : Public, Amis ou Moi uniquement, et observe ce qu’un inconnu voit.',
        },
        {
          title: 'Détective des Données',
          subtitle: 'Trie les informations entre publiques et secrètes.',
          description: 'Déplace les cartes dans la zone Sûre ou Risquée selon le type de donnée personnelle.',
        },
        {
          title: 'Le Radar GPS Caché',
          subtitle: 'Désactive les coordonnées de localisation dans les photos.',
          description: 'Apprends comment les photos enregistrent des coordonnées exactes et comment les retirer.',
        },
        {
          title: 'Paires d’Identité',
          subtitle: 'Mémorise les données à ne jamais mettre sur un formulaire public.',
          description: 'Associe les données sensibles à leurs boucliers respectifs.',
        },
        {
          title: 'Le Bunker d’Informations',
          subtitle: 'Configure la confidentialité de ton profil en 60 secondes.',
          description: 'Verrouille tes publications pour garder le contrôle.',
        },
        {
          title: 'L’Ami Trop Curieux',
          subtitle: 'Simulateur de chat : un camarade demande ton adresse.',
          description: 'Apprends des réponses polies mais fermes pour protéger ta maison.',
        },
        {
          title: 'L’Examen du Grand Gardien',
          subtitle: 'Mission Boss : Détecte 5 vulnérabilités en un temps record.',
          description: 'Applique tout ce que tu as appris pour recevoir le Sceau d’Or.',
        },
      ],
    },
    'world-2': {
      name: 'Forteresse Mots de Passe',
      title: 'Comptes & Clés Maîtresses',
      subtitle: 'Forge des combinaisons incassables et gère tes accès.',
      motto: 'Une bonne clé ouvre ton monde et bloque l’intrus',
      biome: 'Château cybernétique en titane avec serrures rotatives holographiques',
      finalChallengeTitle: 'Le Serrurier Suprême',
      finalChallengeDesc: 'Forge un mot de passe indestructible avec majuscules, chiffres et symboles.',
      missions: [
        {
          title: 'La Forge de Mots de Passe',
          subtitle: 'Crée un mot de passe légendaire.',
          description: 'Combine mots secrets, symboles et chiffres pour atteindre 100% de résistance.',
        },
        {
          title: 'L’Attaque par Force Brute',
          subtitle: 'Compare le temps nécessaire à un robot pour pirater un mot de passe faible.',
          description: 'Découvre pourquoi "123456" tombe en 0 seconde alors qu’une phrase dure des siècles.',
        },
        {
          title: 'La Voûte des Questions Secrètes',
          subtitle: 'Choisis des questions de sécurité astucieuses.',
          description: 'Évite les réponses que n’importe qui pourrait deviner en regardant tes réseaux.',
        },
        {
          title: 'Le Gardien du Double Facteur (2FA)',
          subtitle: 'Active la deuxième barrière de protection.',
          description: 'Apprends comment un code éphémère stoppe 99% des attaques.',
        },
        {
          title: 'Le Porte-Clés Magique',
          subtitle: 'Découvre le fonctionnement d’un gestionnaire de mots de passe.',
          description: 'Tu n’as besoin de retenir qu’un seul mot de passe maître ultra robuste !',
        },
        {
          title: 'Le Défi du WiFi Public',
          subtitle: 'Faut-il entrer des identifiants sur le WiFi public d’un parc ?',
          description: 'Identifie quand un réseau est sécurisé ou vulnérable.',
        },
        {
          title: 'Le Mot de Passe Prêté',
          subtitle: 'Ton meilleur ami demande ton compte pour jouer.',
          description: 'Apprends à refuser gentiment sans mettre ton compte en péril.',
        },
        {
          title: 'Le Verrou Ancestral',
          subtitle: 'Mission Boss : Résous les 4 énigmes cryptographiques de la forteresse.',
          description: 'Combine double authentification et phrases secrètes pour sceller la voûte.',
        },
      ],
    },
    'world-3': {
      name: 'Archipel Anti-Phishing',
      title: 'Détection des Pièges & Arnaques',
      subtitle: 'Repère les faux appâts, liens douteux et promesses suspectes.',
      motto: 'Ne mords pas à l’hameçon, regarde avant de cliquer',
      biome: 'Océan brumeux avec phares sentinelles et bancs de poissons trompeurs',
      finalChallengeTitle: 'Le Phare Vigilant',
      finalChallengeDesc: 'Identifie 6 pièges de phishing dans une boîte de réception remplie de fausses offres.',
      missions: [
        {
          title: 'La Boîte Suspecte',
          subtitle: 'Identifie 3 courriels frauduleux dans ta boîte de réception.',
          description: 'Vérifie l’expéditeur réel, l’orthographe et les liens dissimulés.',
        },
        {
          title: 'L’Appât des Monnaies Gratuites',
          subtitle: 'Le piège classique des jeux vidéo en ligne.',
          description: 'Comprends pourquoi personne n’offre 50 000 Robux ou V-Bucks par simple clic.',
        },
        {
          title: 'Le Lien Déguisé',
          subtitle: 'Survole le lien avec le curseur sans cliquer.',
          description: 'Repère les lettres modifiées comme "arnazon.com" ou "paypa1.com".',
        },
        {
          title: 'Le Trieur de Messages',
          subtitle: 'Sépare les courriers officiels des tentatives d’arnaques.',
          description: 'Glisse rapidement les messages dans la corbeille ou la boîte sûre.',
        },
        {
          title: 'La Fausse Urgence',
          subtitle: 'Votre compte sera fermé dans 10 minutes !',
          description: 'Pourquoi les pirates utilisent la peur pour t’empêcher de réfléchir.',
        },
        {
          title: 'Le Cadeau Mystère',
          subtitle: 'Tu as gagné la dernière console... ou pas ?',
          description: 'Prends les bonnes décisions face à une annonce de lot surprise.',
        },
        {
          title: 'Le Cadenas du Navigateur',
          subtitle: 'Comprends le protocole HTTPS et les certificats.',
          description: 'Découvre ce que signifie le cadenas et quand un site peut quand même tromper.',
        },
        {
          title: 'La Grande Tempête de Phishing',
          subtitle: 'Mission Boss : Inspecte 6 attaques en un temps record.',
          description: 'Protège ton équipage en interceptant les hameçons numériques.',
        },
      ],
    },
    'world-4': {
      name: 'Jungle des Réseaux Sociaux',
      title: 'Empreinte Numérique & Bienveillance',
      subtitle: 'Comprends l’impact durable de tes publications.',
      motto: 'Ce que tu publies aujourd’hui reste gravé demain',
      biome: 'Forêt luxuriante d’arbres millénaires projetant des souvenirs numériques',
      finalChallengeTitle: 'L’Écho du Réseau',
      finalChallengeDesc: 'Nettoie un fil public de publications compromettantes.',
      missions: [
        {
          title: 'L’Empreinte qui Reste',
          subtitle: 'Le voyage éternel d’une photo sur Internet.',
          description: 'Même si tu effaces un post, quelqu’un a pu faire une capture d’écran.',
        },
        {
          title: 'Le Miroir des Vues',
          subtitle: 'Qui peut voir tes stories et vidéos ?',
          description: 'Configure ta liste d’amis proches et passe ton profil en privé.',
        },
        {
          title: 'Mots Bienveillants',
          subtitle: 'Freine le cyberharcèlement dès le début.',
          description: 'Choisis des encouragements et signale les propos haineux.',
        },
        {
          title: 'Le Défi Dangereux',
          subtitle: 'Distingue les modes amusantes des défis risqués.',
          description: 'Apprends à refuser les défis viraux qui menacent ta sécurité.',
        },
        {
          title: 'La Chasse aux Likes',
          subtitle: 'Ta valeur ne dépend pas du nombre de cœurs reçus.',
          description: 'Prends du recul face à la pression sociale et profite de tes vraies passions.',
        },
        {
          title: 'Comptes Clones',
          subtitle: 'Détecte si quelqu’un utilise tes photos pour se faire passer pour toi.',
          description: 'Étapes officielles de signalement et vérification.',
        },
        {
          title: 'Le Temps d’Écran',
          subtitle: 'Trouve l’équilibre entre le virtuel et la vraie vie.',
          description: 'Active des alertes de pause pour profiter du plein air.',
        },
        {
          title: 'L’Arbre de la Sagesse',
          subtitle: 'Mission Boss : Résous le dilemme éthique de la communauté.',
          description: 'Soutiens un ami en difficulté en ligne avec empathie.',
        },
      ],
    },
    'world-5': {
      name: 'Arène Gaming Sécurisé',
      title: 'Jeux Vidéo, Vocaux & Économie Virtuelle',
      subtitle: 'Joue en équipe, protège ton inventaire et évite les tricheurs.',
      motto: 'Le meilleur joueur est celui qui joue loyalement et en sécurité',
      biome: 'Colisée futuriste aux néons éclatants avec arènes de combat pixélisées',
      finalChallengeTitle: 'Le Tournoi du Fair-Play',
      finalChallengeDesc: 'Gagne la partie en sécurisant le chat vocal et les échanges d’objets.',
      missions: [
        {
          title: 'Le Chat Vocal',
          subtitle: 'Quand couper le micro et comment signaler les joueurs toxiques.',
          description: 'Ne révèle jamais d’informations personnelles dans un salon ouvert.',
        },
        {
          title: 'Le Piège des Mods',
          subtitle: 'Fichiers douteux promettant des skins gratuites.',
          description: 'Apprends comment des virus se cachent dans de faux codes de triche.',
        },
        {
          title: 'Le Marché Noir des Comptes',
          subtitle: 'Pourquoi il ne faut jamais acheter ou vendre de comptes.',
          description: 'Les comptes vendus sont souvent volés et finissent bannis définitivement.',
        },
        {
          title: 'Achats Intégrés',
          subtitle: 'Comprends la vraie valeur de l’argent dans les jeux.',
          description: 'Demande toujours l’accord de tes parents avant toute dépense.',
        },
        {
          title: 'L’Échange Loyal',
          subtitle: 'Règles de sécurité pour les trocs d’objets virtuels.',
          description: 'Refuse les demandes d’envoi d’items sur une autre plateforme.',
        },
        {
          title: 'Le Mode Sécurisé sur Console',
          subtitle: 'Configure la confidentialité sur Switch, PlayStation et Xbox.',
          description: 'Contrôle qui peut t’inviter en groupe et voir ton statut.',
        },
        {
          title: 'Le Coéquipier d’une Partie',
          subtitle: 'Distingue un camarade de jeu d’un ami intime.',
          description: 'Garde la relation dans le jeu sans passer aux messageries privées.',
        },
        {
          title: 'La Bataille du Trophée Doré',
          subtitle: 'Mission Boss : Mène ton escouade vers une victoire sans faille.',
          description: 'Coordonne ton équipe, coupe le micro aux tricheurs et protège ton profil.',
        },
      ],
    },
    'world-6': {
      name: 'Cité des Amitiés',
      title: 'Relations Numériques & Vigilance',
      subtitle: 'Distingue les vrais amis des inconnus aux intentions douteuses.',
      motto: 'Fais confiance à ton intuition et aux adultes qui t’aiment',
      biome: 'Métropole lumineuse avec passerelles suspendues où circulent les avatars',
      finalChallengeTitle: 'Le Gardien du Cercle Intime',
      finalChallengeDesc: 'Évalue 5 demandes d’amis et repère les profils falsifiés.',
      missions: [
        {
          title: 'Le Profil Trop Parfait',
          subtitle: 'Repère les fausses photos de profils prétendant être des enfants.',
          description: 'Vérifie si un nouveau contact est bien celui qu’il prétend être.',
        },
        {
          title: 'La Règle du Secret',
          subtitle: 'Si quelqu’un te demande de cacher des choses à tes parents, alerte !',
          description: 'Aucun véritable ami ne te demandera de mentir à ta famille.',
        },
        {
          title: 'La Caméra Éteinte',
          subtitle: 'N’allume jamais ta webcam avec un inconnu.',
          description: 'Ton intimité est précieuse ; garde le contrôle total de tes appareils.',
        },
        {
          title: 'Le Cadeau Inattendu',
          subtitle: 'Quand un inconnu t’offre des cadeaux virtuels coûteux.',
          description: 'Apprends à refuser les cadeaux qui visent à créer une obligation.',
        },
        {
          title: 'L’Adulte de Confiance',
          subtitle: 'Identifie 3 personnes vers qui te tourner à tout moment.',
          description: 'Parents, professeurs, proches : en parler règle tous les soucis.',
        },
        {
          title: 'Messages Gênants',
          subtitle: 'Que faire si une discussion te met mal à l’aise.',
          description: 'Fais des captures d’écran, bloque l’utilisateur et demande de l’aide sans culpabilité.',
        },
        {
          title: 'Le Changement d’Application',
          subtitle: 'Pourquoi veulent-ils quitter le jeu pour une messagerie privée ?',
          description: 'Les personnes malveillantes cherchent à t’isoler hors des zones surveillées.',
        },
        {
          title: 'Le Bouclier Numérique',
          subtitle: 'Mission Boss : Règle le cas d’un contact trop insistant.',
          description: 'Fais preuve de fermeté et de calme pour préserver ta tranquillité.',
        },
      ],
    },
    'world-7': {
      name: 'Laboratoire des Appareils',
      title: 'Sécurité Téléphones, Tablettes & PC',
      subtitle: 'Autorisations des applications, mises à jour et caméras.',
      motto: 'Un appareil entretenu est une forteresse inexpugnable',
      biome: 'Complexe technologique avec circuits imprimés géants et stations d’analyse',
      finalChallengeTitle: 'La Quarantaine Cybernétique',
      finalChallengeDesc: 'Scanne un téléphone infecté, supprime les autorisations abusives et mets à jour l’appareil.',
      missions: [
        {
          title: 'L’Autorisation Douteuse',
          subtitle: 'Pourquoi une lampe de poche demande-t-elle accès à tes contacts ?',
          description: 'Révoque les accès inutiles à la caméra, au micro et au GPS.',
        },
        {
          title: 'Le Bouclier des Mises à Jour',
          subtitle: 'N’ignore pas l’alerte de mise à jour système.',
          description: 'Les mises à jour corrigent les failles exploitées par les pirates.',
        },
        {
          title: 'Le Magasin Officiel',
          subtitle: 'Dangers des fichiers APK téléchargés sur des sites douteux.',
          description: 'Utilise toujours Google Play ou l’App Store pour éviter les logiciels espions.',
        },
        {
          title: 'Le Verrouillage d’Écran',
          subtitle: 'Code PIN, schéma ou empreinte pour ta tablette ou smartphone.',
          description: 'Empêche les curieux de fouiller dans tes photos si tu perds ton appareil.',
        },
        {
          title: 'Le Malware Masqué',
          subtitle: 'Signes d’infection : ralentissements et publicités intempestives.',
          description: 'Lance une analyse de sécurité et vide les caches corrompus.',
        },
        {
          title: 'Le Cache-Caméra',
          subtitle: 'Une habitude physique simple pour ta tranquillité.',
          description: 'Couvre l’objectif de ton ordinateur quand tu n’es pas en visioconférence.',
        },
        {
          title: 'La Sauvegarde Précieuse',
          subtitle: 'Enregistre tes photos et devoirs scolaires sur le cloud ou un disque.',
          description: 'Si ton appareil tombe en panne, tes souvenirs restent intacts.',
        },
        {
          title: 'Le Diagnostic Suprême',
          subtitle: 'Mission Boss : Purifie un système d’exploitation en panne générale.',
          description: 'Élimine 4 virus et sécurise le réseau de la maison.',
        },
      ],
    },
    'world-8': {
      name: 'Vallée de la Bienveillance',
      title: 'Prévention du Cyberharcèlement & Empathie',
      subtitle: 'Sois un défenseur actif et non un spectateur silencieux.',
      motto: 'Tes mots en ligne ont le pouvoir de réparer ou de blesser : choisis la lumière',
      biome: 'Prairie paisible avec cascades luminescentes et jardins zen',
      finalChallengeTitle: 'Le Cercle de l’Empathie',
      finalChallengeDesc: 'Interviens dans un groupe pour soutenir un camarade et signaler les comportements toxiques.',
      missions: [
        {
          title: 'Le Spectateur Courageux',
          subtitle: 'Ne ris pas et ne partage pas de moqueries blessantes.',
          description: 'Soutenir une personne isolée en privé peut tout changer.',
        },
        {
          title: 'Groupes de Chat Toxiques',
          subtitle: 'Que faire quand un groupe est créé pour humilier un élève.',
          description: 'Quitte le groupe ou rappelle calmement les règles du respect.',
        },
        {
          title: 'Le Bouton de Signalement',
          subtitle: 'Signaler n’est pas dénoncer : c’est protéger.',
          description: 'Utilise les outils de signalement confidentiels des plateformes.',
        },
        {
          title: 'Le Mème Dangereux',
          subtitle: 'La frontière entre une plaisanterie et une humiliation.',
          description: 'Mets-toi à la place de l’autre avant de partager une photo.',
        },
        {
          title: 'La Capture Traîtresse',
          subtitle: 'Diffuser une conversation privée sans accord est déloyal.',
          description: 'Respecte la confiance et les confidences de tes amis.',
        },
        {
          title: 'Des Paroles qui Construisent',
          subtitle: 'Utilise tes réseaux pour encourager et diffuser des projets positifs.',
          description: 'Crée une vague de bienveillance autour de toi.',
        },
        {
          title: 'Le Pardon Numérique',
          subtitle: 'Si tu as blessé quelqu’un par mégarde, excuse-toi sincèrement.',
          description: 'Reconnaître ses torts est une preuve de grande maturité.',
        },
        {
          title: 'Le Concert de l’Harmonie',
          subtitle: 'Mission Boss : Rétablis la paix dans le forum de l’école.',
          description: 'Transforme un espace houleux en lieu d’entraide respectueux.',
        },
      ],
    },
    'world-9': {
      name: 'Sommet de l’IA & Deepfakes',
      title: 'Esprit Critique & Vérification Numérique',
      subtitle: 'Apprends à démasquer les images générées par IA et les fausses informations.',
      motto: 'Voir ne suffit plus à croire : vérifie avant de propager',
      biome: 'Chaîne de sommets enneigés avec aurores boréales et télescopes de données',
      finalChallengeTitle: 'Le Tribunal de la Vérité',
      finalChallengeDesc: 'Analyse 5 vidéos et fichiers audio pour distinguer le vrai du faux généré par IA.',
      missions: [
        {
          title: 'La Main aux Six Doigts',
          subtitle: 'Indices visuels pour repérer des images créées par IA.',
          description: 'Observe les oreilles, les textes bizarres et les reflets incohérents.',
        },
        {
          title: 'La Voix Clonée',
          subtitle: 'Enregistrements imitant la voix de proches par IA.',
          description: 'Définissez un mot de passe secret en famille pour les urgences.',
        },
        {
          title: 'L’Article à Scandale',
          subtitle: 'Titres sensationnels pour récolter des clics et semer l’inquiétude.',
          description: 'Vérifie toujours l’information sur des médias fiables.',
        },
        {
          title: 'Le Deepfake de Célébrités',
          subtitle: 'Vidéos truquées où des vedettes disent des propos inventés.',
          description: 'Scrute le clignement des yeux et la synchronisation des lèvres.',
        },
        {
          title: 'L’Assistant IA Éthique',
          subtitle: 'Utiliser l’IA pour apprendre sans plagier ni tricher.',
          description: 'L’IA est un guide d’inspiration, pas un remplaçant de ta propre réflexion.',
        },
        {
          title: 'La Recherche Inversée d’Images',
          subtitle: 'Utilise Google Lens pour retrouver l’origine exacte d’une photo virale.',
          description: 'Découvre quand et où une image a été capturée pour la première fois.',
        },
        {
          title: 'Ton Image et les Outils d’IA',
          subtitle: 'Pourquoi éviter d’envoyer tes selfies à des applications inconnues d’avatars.',
          description: 'Certaines apps conservent tes traits biométriques sans ton consentement.',
        },
        {
          title: 'Le Vortex de la Vérité',
          subtitle: 'Mission Boss : Démantèle un réseau de fausses rumeurs virales.',
          description: 'Publie le rapport de vérification complet et ramène la clarté.',
        },
      ],
    },
    'world-10': {
      name: 'Citadelle du Gardien',
      title: 'Commandement Suprême & Cybersécurité',
      subtitle: 'Le défi final réunissant toutes les compétences pour devenir Grand Gardien.',
      motto: 'Un Gardien protège son monde et guide les autres par l’exemple',
      biome: 'Citadelle de cristal doré flottant au-dessus d’un nuage quantique',
      finalChallengeTitle: 'Le Couronnement du Grand Gardien',
      finalChallengeDesc: 'Réussis l’audit complet à 360° et décroche l’insigne légendaire de CiberKids.',
      missions: [
        {
          title: 'Le Grand Bilan Personnel',
          subtitle: 'Vérifie tes appareils et comptes en appliquant les 10 règles d’or.',
          description: 'Mots de passe, confidentialité, autorisations et sauvegardes en un seul parcours.',
        },
        {
          title: 'Le Protocole d’Urgence',
          subtitle: 'Que faire en cas de piratage ou d’arnaque : la méthode calme.',
          description: 'Prévenir les adultes, modifier ses mots de passe et déconnecter calmement.',
        },
        {
          title: 'Le Guide des Plus Jeunes',
          subtitle: 'Explique à un petit frère ou cousin comment jouer en ligne en sécurité.',
          description: 'Transmettre tes connaissances est la plus belle forme de protection.',
        },
        {
          title: 'Le Contrat Familial des Écrans',
          subtitle: 'Établis des règles d’utilisation sereine des écrans à la maison.',
          description: 'Des moments sans écran aux repas et un climat d’échange bienveillant.',
        },
        {
          title: 'Le Défi Coopératif Multijoueur',
          subtitle: 'Défends la Citadelle aux côtés d’autres gardiens du réseau.',
          description: 'Résolvez des énigmes en équipe combinant cryptographie et réflexes.',
        },
        {
          title: 'La Flamme Dorée',
          subtitle: 'Mission Boss Légendaire : L’épreuve finale devant le Conseil.',
          description: 'Fais preuve d’une maîtrise absolue et débloque l’avatar suprême du Gardien.',
        },
      ],
    },
  },
  en: {
    'world-1': {
      name: 'Privacy Island',
      title: 'Identity & Privacy',
      subtitle: 'Protect what makes you unique in the digital realm.',
      motto: 'Your data is your treasure',
      biome: 'Paradise archipelago with surveillance watchtowers and data radars',
      finalChallengeTitle: 'The Privacy Investigator',
      finalChallengeDesc: 'Audit a complete social media profile and remove 5 privacy footprints before publication.',
      missions: [
        {
          title: 'What Would You Share?',
          subtitle: 'Examine a school photo before uploading it.',
          description: 'A photo looks innocent, but it hides 4 details that reveal where you live and study.',
        },
        {
          title: 'The Privacy Dial',
          subtitle: 'Adjust the visibility dial on your profile.',
          description: 'Experiment with Public, Friends, or Only Me settings to see what strangers can view.',
        },
        {
          title: 'Data Detective',
          subtitle: 'Classify data between public and secret.',
          description: 'Drag cards into Safe or Risky zones based on personal information sensitivity.',
        },
        {
          title: 'Hidden GPS Radar',
          subtitle: 'Disable location metadata in digital photos.',
          description: 'Learn how photos record exact coordinates and how to easily turn them off.',
        },
        {
          title: 'Identity Pairs',
          subtitle: 'Memorize which information must never appear on public forms.',
          description: 'Pair sensitive data with their matching protective shields.',
        },
        {
          title: 'The Information Bunker',
          subtitle: 'Configure your profile privacy in 60 seconds.',
          description: 'Put digital locks on your posts to stay in complete control.',
        },
        {
          title: 'The Curious Friend',
          subtitle: 'Chat simulator: a peer asks for your home address.',
          description: 'Practice polite yet firm responses to protect your personal home safety.',
        },
        {
          title: 'Grand Guardian Exam',
          subtitle: 'Boss Mission: Spot 5 vulnerabilities in record time.',
          description: 'Apply all lessons learned to receive the Golden Seal of Privacy.',
        },
      ],
    },
    'world-2': {
      name: 'Password Fortress',
      title: 'Accounts & Master Keys',
      subtitle: 'Forge unbreakable combinations and manage your digital credentials.',
      motto: 'A strong key opens your world and locks out intruders',
      biome: 'Cybernetic titanium castle with rotating holographic combination locks',
      finalChallengeTitle: 'The Master Locksmith',
      finalChallengeDesc: 'Forge an unbreakable master password with mixed casing, numbers, and symbols.',
      missions: [
        {
          title: 'Password Forge',
          subtitle: 'Create a legendary combination.',
          description: 'Combine secret passphrases, symbols, and numbers to reach 100% strength.',
        },
        {
          title: 'Brute Force Attack',
          subtitle: 'Compare how long computers take to crack weak passwords.',
          description: 'See why "123456" falls in 0 seconds while a passphrase lasts centuries.',
        },
        {
          title: 'Secret Question Vault',
          subtitle: 'Choose clever security questions.',
          description: 'Avoid answers that anyone could find by searching your social networks.',
        },
        {
          title: 'Two-Factor Guardian (2FA)',
          subtitle: 'Activate the second layer of security.',
          description: 'Learn how a one-time code on your phone stops 99% of cyberattacks.',
        },
        {
          title: 'The Magic Keychain',
          subtitle: 'Learn how password managers keep accounts organized and secure.',
          description: 'You only ever need to remember one super-strong master password!',
        },
        {
          title: 'Public Wi-Fi Challenge',
          subtitle: 'Should you type passwords on public park Wi-Fi?',
          description: 'Identify when a wireless network is secured or open to snooping.',
        },
        {
          title: 'The Borrowed Password',
          subtitle: 'Your best friend asks for your account credentials to play.',
          description: 'Learn how to say no empathetically without jeopardizing your account.',
        },
        {
          title: 'Ancient Master Lock',
          subtitle: 'Boss Mission: Solve the 4 cryptographic puzzles of the fortress.',
          description: 'Combine 2-step verification and passphrases to seal the digital vault.',
        },
      ],
    },
    'world-3': {
      name: 'Anti-Phishing Archipelago',
      title: 'Scam & Deception Detection',
      subtitle: 'Spot fake baits, suspicious links, and urgent false promises.',
      motto: 'Don’t take the bait, look closely before you click',
      biome: 'Misty ocean with sentinel lighthouses and deceptive holographic fish shoals',
      finalChallengeTitle: 'The Awakening Lighthouse',
      finalChallengeDesc: 'Identify 6 phishing traps in an inbox filled with false offers and urgent threats.',
      missions: [
        {
          title: 'The Suspicious Inbox',
          subtitle: 'Spot 3 fraudulent emails in your message inbox.',
          description: 'Learn to inspect the true sender address, typos, and hidden link destinations.',
        },
        {
          title: 'Free Coins Bait',
          subtitle: 'The classic trap in online gaming communities.',
          description: 'Discover why nobody legitimately gives away 50,000 Robux or V-Bucks for a click.',
        },
        {
          title: 'The Disguised Link',
          subtitle: 'Hover over links before clicking on them.',
          description: 'Catch swapped letters such as "arnazon.com" or "paypa1.com" in the URL bar.',
        },
        {
          title: 'Message Classifier',
          subtitle: 'Sort genuine notices from dangerous phishing attempts.',
          description: 'Drag messages to the trash can or the safe inbox with agility.',
        },
        {
          title: 'False Urgency Trap',
          subtitle: 'Your account will be deleted in 10 minutes!',
          description: 'Why cybercriminals use panic and rushed deadlines to keep you from thinking.',
        },
        {
          title: 'The Mystery Prize',
          subtitle: 'You just won the console of the year... or did you?',
          description: 'Make step-by-step choices when an unexpected win notification pops up.',
        },
        {
          title: 'The Browser Padlock',
          subtitle: 'Understand HTTPS protocol and security certificates.',
          description: 'Learn what the padlock means and when a site can still be misleading.',
        },
        {
          title: 'The Great Phishing Storm',
          subtitle: 'Boss Mission: Inspect 6 cyberattacks in record time.',
          description: 'Protect your entire crew by intercepting deceptive hooks.',
        },
      ],
    },
    'world-4': {
      name: 'Social Jungle',
      title: 'Digital Footprint & Good Citizenship',
      subtitle: 'Understand the lasting impact of what you publish online.',
      motto: 'What you post today blooms or follows you tomorrow',
      biome: 'Ancient lush forest whose trees project digital memories on leaves',
      finalChallengeTitle: 'The Network Echo',
      finalChallengeDesc: 'Cleanse a public feed of compromising posts to restore digital balance.',
      missions: [
        {
          title: 'The Lasting Footprint',
          subtitle: 'The endless journey of a photo online.',
          description: 'Even if you delete a post, someone might have saved a screenshot.',
        },
        {
          title: 'Audience Mirror',
          subtitle: 'Who can actually see your stories and reels?',
          description: 'Configure Close Friends lists and switch your account to private.',
        },
        {
          title: 'Kind Comments',
          subtitle: 'Stop cyberbullying before it starts.',
          description: 'Choose supportive language and report hateful behavior.',
        },
        {
          title: 'The Dangerous Challenge',
          subtitle: 'Tell fun trends apart from harmful viral stunts.',
          description: 'Learn to say no to viral challenges that put your physical safety at risk.',
        },
        {
          title: 'The Chase for Likes',
          subtitle: 'Your personal worth is not measured in hearts or followers.',
          description: 'Unplug from social pressure and enjoy your real-world hobbies.',
        },
        {
          title: 'Cloned Accounts',
          subtitle: 'Detect if someone is using your photos to impersonate you.',
          description: 'Follow official reporting procedures on verified platforms.',
        },
        {
          title: 'Screen Time Balance',
          subtitle: 'Harmony between the virtual world and real life.',
          description: 'Set rest timers and spend quality time outdoors.',
        },
        {
          title: 'Tree of Digital Wisdom',
          subtitle: 'Boss Mission: Resolve the community’s ethical dilemma.',
          description: 'Help a friend navigate a difficult online moment with empathy.',
        },
      ],
    },
    'world-5': {
      name: 'Safe Gaming Arena',
      title: 'Video Games, Voice Chat & Virtual Economy',
      subtitle: 'Play as a team, protect your inventory, and avoid multiplayer traps.',
      motto: 'The best gamer is the one who plays fair and stays safe',
      biome: 'Futuristic neon colosseum with pixel battlefields and minigame portals',
      finalChallengeTitle: 'Fair Play Tournament',
      finalChallengeDesc: 'Win the match by securing voice comms and rejecting suspicious trade offers.',
      missions: [
        {
          title: 'Voice Chat Safety',
          subtitle: 'When to mute and how to report toxic players.',
          description: 'Never reveal personal details while wearing a headset in open lobbies.',
        },
        {
          title: 'The Mods Trap',
          subtitle: 'Suspicious files promising free skins or cheat codes.',
          description: 'Learn how trojans hide inside fake game hacks and software patches.',
        },
        {
          title: 'The Account Black Market',
          subtitle: 'Why you should never buy or sell player accounts.',
          description: 'Purchased accounts are almost always stolen and end up permanently banned.',
        },
        {
          title: 'In-Game Purchases',
          subtitle: 'Understand the value of real-world money in digital games.',
          description: 'Always ask your parents for permission before spending on loot boxes.',
        },
        {
          title: 'Fair Item Trading',
          subtitle: 'Safety rules for trading virtual items with others.',
          description: 'Avoid offers that ask you to trade your items first on an external site.',
        },
        {
          title: 'Console Safe Mode',
          subtitle: 'Configure privacy on Switch, PlayStation, and Xbox.',
          description: 'Control who can invite you to parties and view your online status.',
        },
        {
          title: 'The Lobby Teammate',
          subtitle: 'Differentiate between a game teammate and an intimate friend.',
          description: 'Keep the connection inside the game without switching to private calls.',
        },
        {
          title: 'Battle for the Golden Trophy',
          subtitle: 'Boss Mission: Lead a clean squad to decisive victory.',
          description: 'Coordinate fair plays, mute bad actors, and safeguard your account.',
        },
      ],
    },
    'world-6': {
      name: 'Friendship City',
      title: 'Digital Relationships & Grooming Awareness',
      subtitle: 'Distinguish real friends from unknown contacts and manipulators.',
      motto: 'Trust your gut and turn to the adults who care about you',
      biome: 'Luminous metropolis with public plazas and suspension bridges where avatars gather',
      finalChallengeTitle: 'Guardian of the Inner Circle',
      finalChallengeDesc: 'Evaluate 5 friend requests and screen out fake profiles with suspicious motives.',
      missions: [
        {
          title: 'The Too-Good Profile',
          subtitle: 'Spot stock photos on profiles claiming to be kids your age.',
          description: 'Learn how to verify whether a new contact is genuinely who they claim.',
        },
        {
          title: 'The Secret Rule',
          subtitle: 'If someone tells you not to tell your parents, raise the alarm!',
          description: 'No honest friend will ever ask you to hide things from your family.',
        },
        {
          title: 'Camera Off Policy',
          subtitle: 'Never turn on your webcam for strangers.',
          description: 'Your privacy is sacred; maintain complete control over your devices.',
        },
        {
          title: 'The Unexpected Gift',
          subtitle: 'When an online stranger buys you expensive in-game items or skins.',
          description: 'Learn how to decline gifts intended to build leverage or blackmail.',
        },
        {
          title: 'Your Trusted Adult',
          subtitle: 'Identify 3 people in your life you can always talk to.',
          description: 'Parents, teachers, or family members: speaking up early resolves any worry.',
        },
        {
          title: 'Uncomfortable Messages',
          subtitle: 'What to do if a conversation makes you feel uneasy or pressured.',
          description: 'Take screenshots, block the sender, and ask for support without guilt.',
        },
        {
          title: 'Switching to Another App',
          subtitle: 'Why do they urge you to move from a public game into private chat?',
          description: 'Manipulators want to move away from monitored servers to isolate you.',
        },
        {
          title: 'Shield of the Digital Heart',
          subtitle: 'Boss Mission: Handle the case of an overly persistent contact.',
          description: 'Show calm assertiveness to safeguard your emotional well-being.',
        },
      ],
    },
    'world-7': {
      name: 'Device Laboratory',
      title: 'Mobile, Tablet & Computer Security',
      subtitle: 'App permissions, system updates, malware prevention, and cameras.',
      motto: 'A clean device is an impenetrable fortress',
      biome: 'Hi-tech facility with giant transparent circuit boards and diagnostics docks',
      finalChallengeTitle: 'Cybernetic Quarantine',
      finalChallengeDesc: 'Scan an infected phone, revoke abusive permissions, and update the system.',
      missions: [
        {
          title: 'Suspicious Permission',
          subtitle: 'Why does a simple flashlight app need access to your contact book?',
          description: 'Inspect and revoke unnecessary access to camera, mic, and GPS.',
        },
        {
          title: 'The Update Shield',
          subtitle: 'Never dismiss that "Update pending" reminder.',
          description: 'Updates patch critical security bugs that cybercriminals try to exploit.',
        },
        {
          title: 'The Official Store',
          subtitle: 'Risks of downloading APK files from questionable websites.',
          description: 'Always stick to Google Play or Apple App Store to avoid spy Trojans.',
        },
        {
          title: 'Screen Lock Protection',
          subtitle: 'PIN, pattern, or fingerprint protection for your mobile devices.',
          description: 'Keep strangers from looking through your photos and messages if you misplace your device.',
        },
        {
          title: 'Hidden Malware',
          subtitle: 'Warning signs of an infected device: sluggishness and pop-up ads.',
          description: 'Learn how to run a security scan and clear suspicious app cache.',
        },
        {
          title: 'The Webcam Cover',
          subtitle: 'A simple physical habit for total peace of mind.',
          description: 'Cover your laptop camera lens whenever you are not in an active online class.',
        },
        {
          title: 'The Valuable Backup',
          subtitle: 'Save your photos and school projects on cloud storage or an external drive.',
          description: 'If your device breaks or gets lost, your precious memories stay safe.',
        },
        {
          title: 'Master Diagnostic',
          subtitle: 'Boss Mission: Purify an operating system in critical crash status.',
          description: 'Eradicate 4 viruses and secure the home network successfully.',
        },
      ],
    },
    'world-8': {
      name: 'Kindness Valley',
      title: 'Cyberbullying Prevention & Empathy',
      subtitle: 'Be an active upstander rather than a silent bystander.',
      motto: 'Your words online can heal or harm: choose to bring light',
      biome: 'Serene meadow with crystal streams, luminescent wildflowers, and Zen gardens',
      finalChallengeTitle: 'Circle of Empathy',
      finalChallengeDesc: 'Step into a school chat group to support an isolated classmate and report harassment.',
      missions: [
        {
          title: 'The Brave Upstander',
          subtitle: 'Never laugh along or forward hurtful gossip and memes.',
          description: 'Reaching out privately to support the target makes a world of difference.',
        },
        {
          title: 'Toxic Group Chats',
          subtitle: 'What to do when a chat is created just to exclude or insult someone.',
          description: 'Learn how to exit gracefully or urge everyone to treat others with respect.',
        },
        {
          title: 'The Report Button',
          subtitle: 'Reporting is not snitching: it is keeping the community safe.',
          description: 'Familiarize yourself with anonymous report channels across apps and games.',
        },
        {
          title: 'The Harmful Meme',
          subtitle: 'The clear line between an innocent joke and public humiliation.',
          description: 'Put yourself in the other person’s shoes before sending any image.',
        },
        {
          title: 'The Leaked Screenshot',
          subtitle: 'Sharing private conversations without consent breaks trust and rules.',
          description: 'Respect your classmates’ confidence and personal messages.',
        },
        {
          title: 'Words That Build Up',
          subtitle: 'Use your presence to encourage others and share inspiring projects.',
          description: 'Create a ripple of supportive comments across your online network.',
        },
        {
          title: 'Digital Forgiveness',
          subtitle: 'If you made a mistake or hurt someone online, apologize sincerely.',
          description: 'Everyone slips up at times; apologizing shows real maturity and courage.',
        },
        {
          title: 'Concert of Harmony',
          subtitle: 'Boss Mission: Restore peace in the school forum.',
          description: 'Turn a hostile argument into a collaborative and supportive space.',
        },
      ],
    },
    'world-9': {
      name: 'AI & Deepfake Summit',
      title: 'Critical Thinking & Digital Verification',
      subtitle: 'Learn to detect AI-generated imagery, voice clones, and fake news.',
      motto: 'Seeing is no longer believing: verify before you trust',
      biome: 'Snowy alpine peaks beneath northern lights with holographic data telescopes',
      finalChallengeTitle: 'Court of Truth',
      finalChallengeDesc: 'Analyze 5 videos and audio clips to separate synthetic generation from authentic sources.',
      missions: [
        {
          title: 'The Six-Fingered Hand',
          subtitle: 'Visual clues to spot images created with Artificial Intelligence.',
          description: 'Inspect earlobes, gibberish lettering, and mismatched lighting or reflections.',
        },
        {
          title: 'The Cloned Voice',
          subtitle: 'Audio clips that mimic friends or family members using AI synthesis.',
          description: 'Set up a secret family safe word for phone emergencies.',
        },
        {
          title: 'Sensational Headlines',
          subtitle: 'Over-the-top titles designed to gather clicks and provoke panic.',
          description: 'Cross-check the story across established news outlets before forwarding.',
        },
        {
          title: 'Celebrity Deepfakes',
          subtitle: 'Manipulated videos where famous figures say things they never said.',
          description: 'Watch for abnormal blinking, unnatural teeth, and misaligned lip sync.',
        },
        {
          title: 'The Ethical AI Assistant',
          subtitle: 'How to use ChatGPT or Gemini to learn without cheating or plagiarizing.',
          description: 'AI is an inspiring tutor, not a replacement for your own brain and creativity.',
        },
        {
          title: 'Reverse Image Search',
          subtitle: 'Use Google Lens to trace the true original source of a viral photo.',
          description: 'Check when and where a suspicious picture was actually taken.',
        },
        {
          title: 'Your Likeness and AI',
          subtitle: 'Why you should avoid uploading selfies to unknown avatar generator apps.',
          description: 'Many apps retain your biometric facial features to train models without permission.',
        },
        {
          title: 'Vortex of Truth',
          subtitle: 'Boss Mission: Dismantle a viral misinformation ring at the summit.',
          description: 'Publish the comprehensive fact-check report and restore clarity.',
        },
      ],
    },
    'world-10': {
      name: 'Guardian Citadel',
      title: 'Supreme Command & Global Defense',
      subtitle: 'The capstone challenge uniting all learned skills to crown you Grand Guardian.',
      motto: 'A Guardian protects their world and leads others by example',
      biome: 'Golden crystal floating citadel above a quantum data cloud with the Central Flame',
      finalChallengeTitle: 'Coronation of the Grand Guardian',
      finalChallengeDesc: 'Ace the comprehensive 360-degree security audit and claim CiberKids’ Legendary Badge.',
      missions: [
        {
          title: 'The Grand Personal Audit',
          subtitle: 'Audit your own device and account using the 10 golden rules.',
          description: 'Review passwords, privacy, permissions, and backups in a single unified journey.',
        },
        {
          title: 'Emergency Protocol',
          subtitle: 'What to do if you encounter a hack or scam: step-by-step with composure.',
          description: 'Notify adults, change passwords, report the issue, and disconnect without panic.',
        },
        {
          title: 'Mentor for Younger Kids',
          subtitle: 'Teach a younger sibling or cousin how to play safely online.',
          description: 'Sharing your knowledge is the greatest form of collective defense.',
        },
        {
          title: 'Family Device Agreement',
          subtitle: 'Establish healthy digital habits at home alongside your parents.',
          description: 'Device-free dinners and mutual agreements grounded in open communication.',
        },
        {
          title: 'Co-op Multiplayer Challenge',
          subtitle: 'Defend the Citadel alongside fellow digital guardians.',
          description: 'Solve cooperative puzzles combining cryptography and privacy reflexes.',
        },
        {
          title: 'Testament of the Golden Flame',
          subtitle: 'Legendary Boss Mission: The final trial before the Digital Council.',
          description: 'Demonstrate master-level cyber skills and unlock the supreme Guardian avatar.',
        },
      ],
    },
  },
};

// Localized Badges
const BADGE_LOCALIZATIONS: Record<Language, Record<string, { title: string; description: string; category: string; rarity: 'Común' | 'Raro' | 'Épico' }>> = {
  es: {
    'badge-first-step': {
      title: 'Primer paso',
      description: 'Comenzaste tu entrenamiento como guardián del ciberespacio.',
      category: 'Iniciación',
      rarity: 'Común',
    },
    'badge-detective-digital': {
      title: 'Detective digital',
      description: 'Descubriste todos los datos sensibles ocultos en una foto pública.',
      category: 'Privacidad',
      rarity: 'Raro',
    },
    'badge-password-apprentice': {
      title: 'Maestro de contraseñas',
      description: 'Creaste una combinación blindada con mayúsculas, números y símbolos.',
      category: 'Seguridad',
      rarity: 'Raro',
    },
    'badge-anti-scam': {
      title: 'Escudo Antifraude',
      description: 'Ignoraste con éxito una falsa oferta de monedas gratis en un juego.',
      category: 'Phishing',
      rarity: 'Épico',
    },
    'badge-privacy-guardian': {
      title: 'Guardián de la privacidad',
      description: 'Supera 5 desafíos seguidos protegiendo información personal.',
      category: 'Privacidad',
      rarity: 'Épico',
    },
    'badge-deepfake-hunter': {
      title: 'Cazador de Deepfakes',
      description: 'Detectaste inconsistencias en un video manipulado con Inteligencia Artificial.',
      category: 'Seguridad',
      rarity: 'Épico',
    },
    'badge-safe-gamer': {
      title: 'Gamer Responsable',
      description: 'Completaste 5 misiones de multijugador seguro sin compartir datos.',
      category: 'Seguridad',
      rarity: 'Raro',
    },
    'badge-incident-hero': {
      title: 'Héroe de la Ciudadela',
      description: 'Resolviste una crisis digital manteniendo la calma y avisando a un adulto.',
      category: 'Seguridad',
      rarity: 'Épico',
    },
  },
  fr: {
    'badge-first-step': {
      title: 'Premier Pas',
      description: 'Tu as commencé ton entraînement de gardien du cyberespace.',
      category: 'Initiation',
      rarity: 'Común',
    },
    'badge-detective-digital': {
      title: 'Détective Numérique',
      description: 'Tu as débusqué toutes les données privées cachées sur une photo.',
      category: 'Privacité',
      rarity: 'Raro',
    },
    'badge-password-apprentice': {
      title: 'Maître des Mots de Passe',
      description: 'Tu as forgé un mot de passe blindé avec majuscules et symboles.',
      category: 'Sécurité',
      rarity: 'Raro',
    },
    'badge-anti-scam': {
      title: 'Bouclier Anti-Arnaque',
      description: 'Tu as ignoré une fausse offre de monnaies gratuites dans un jeu.',
      category: 'Sécurité',
      rarity: 'Épico',
    },
    'badge-privacy-guardian': {
      title: 'Gardien de la Vie Privée',
      description: 'Réussis 5 défis consécutifs en protégeant tes données personnelles.',
      category: 'Privacité',
      rarity: 'Épico',
    },
    'badge-deepfake-hunter': {
      title: 'Chasseur de Deepfakes',
      description: 'Tu as détecté les trucages d’une vidéo générée par Intelligence Artificielle.',
      category: 'Sécurité',
      rarity: 'Épico',
    },
    'badge-safe-gamer': {
      title: 'Gamer Responsable',
      description: 'Tu as complété 5 missions multijoueur sécurisées sans divulguer d’infos.',
      category: 'Sécurité',
      rarity: 'Raro',
    },
    'badge-incident-hero': {
      title: 'Héros de la Citadelle',
      description: 'Tu as géré une alerte en gardant ton calme et en prévenant un adulte.',
      category: 'Sécurité',
      rarity: 'Épico',
    },
  },
  en: {
    'badge-first-step': {
      title: 'First Step',
      description: 'You started your journey as a cyberspace guardian.',
      category: 'Starter',
      rarity: 'Común',
    },
    'badge-detective-digital': {
      title: 'Digital Detective',
      description: 'You uncovered all sensitive details hidden in a public photo.',
      category: 'Privacy',
      rarity: 'Raro',
    },
    'badge-password-apprentice': {
      title: 'Password Master',
      description: 'You forged an armored password with symbols, digits, and casing.',
      category: 'Security',
      rarity: 'Raro',
    },
    'badge-anti-scam': {
      title: 'Anti-Scam Shield',
      description: 'You successfully ignored a fake offer for free in-game currency.',
      category: 'Security',
      rarity: 'Épico',
    },
    'badge-privacy-guardian': {
      title: 'Privacy Guardian',
      description: 'Conquer 5 consecutive challenges protecting personal information.',
      category: 'Privacy',
      rarity: 'Épico',
    },
    'badge-deepfake-hunter': {
      title: 'Deepfake Hunter',
      description: 'You detected inconsistencies in video manipulated with Artificial Intelligence.',
      category: 'Security',
      rarity: 'Épico',
    },
    'badge-safe-gamer': {
      title: 'Responsible Gamer',
      description: 'Completed 5 safe multiplayer missions without leaking personal info.',
      category: 'Security',
      rarity: 'Raro',
    },
    'badge-incident-hero': {
      title: 'Citadel Hero',
      description: 'Handled a digital emergency by staying composed and alerting a trusted adult.',
      category: 'Security',
      rarity: 'Épico',
    },
  },
};

// Localized Hotspots for Photo Detection Game
const HOTSPOT_LOCALIZATIONS: Record<Language, Record<string, { label: string; feedbackTitle: string; feedbackText: string }>> = {
  es: {
    'hs-uniform': {
      label: 'Escudo del Colegio',
      feedbackTitle: '¡Peligro de Ubicación!',
      feedbackText: 'El escudo y nombre del colegio permiten a desconocidos saber dónde estudias y tus horarios.',
    },
    'hs-badge': {
      label: 'Gafete con Nombre',
      feedbackTitle: '¡Nombre y Apellido Visible!',
      feedbackText: 'Nunca muestres tu nombre completo en internet: pueden usarlo para ganarse tu confianza fingiendo conocerte.',
    },
    'hs-street': {
      label: 'Cartel de Calle y Número',
      feedbackTitle: '¡Dirección Revelada!',
      feedbackText: 'La placa de la calle y el número de portal muestran tu dirección exacta. ¡Oculta siempre los carteles de fondo!',
    },
    'hs-calendar': {
      label: 'Mochila con Llavero GPS',
      feedbackTitle: '¡Rastreador Visible!',
      feedbackText: 'Muestra información sobre tus pertenencias y rutinas diarias. Es mejor no publicar objetos con identificadores.',
    },
    'hs-safe-tree': {
      label: 'Árbol del Parque',
      feedbackTitle: '¡Elemento seguro!',
      feedbackText: 'Un árbol o paisaje genérico no compromete tu seguridad ni revela tu identidad.',
    },
    'hs-safe-ball': {
      label: 'Balón de Fútbol',
      feedbackTitle: '¡Elemento seguro!',
      feedbackText: '¡Compartir tu pasión por el deporte es genial y seguro! No revela tu ubicación ni datos personales.',
    },
  },
  fr: {
    'hs-uniform': {
      label: 'Logo de l’École',
      feedbackTitle: 'Danger de Localisation !',
      feedbackText: 'Le blason et le nom de l’école permettent à des inconnus de savoir où tu étudies et tes horaires.',
    },
    'hs-badge': {
      label: 'Badge avec Prénom',
      feedbackTitle: 'Nom Complet Visible !',
      feedbackText: 'Ne montre jamais ton nom de famille complet : des inconnus pourraient l’utiliser pour prétendre te connaître.',
    },
    'hs-street': {
      label: 'Plaque de Rue et Numéro',
      feedbackTitle: 'Adresse Dévoilée !',
      feedbackText: 'La plaque de rue indique ton adresse exacte. Masque toujours les panneaux en arrière-plan !',
    },
    'hs-calendar': {
      label: 'Sac avec Porte-Clé GPS',
      feedbackTitle: 'Traqueur Visible !',
      feedbackText: 'Donne des indices sur tes trajets réguliers. Il vaut mieux masquer les identifiants d’objets.',
    },
    'hs-safe-tree': {
      label: 'Arbre du Parc',
      feedbackTitle: 'Élément Sûr !',
      feedbackText: 'Un arbre ou un paysage générique ne compromet pas ta sécurité et ne révèle rien de privé.',
    },
    'hs-safe-ball': {
      label: 'Ballon de Sport',
      feedbackTitle: 'Élément Sûr !',
      feedbackText: 'Partager ta passion pour le sport est super et sans danger ! Aucune info personnelle n’est visible.',
    },
  },
  en: {
    'hs-uniform': {
      label: 'School Logo / Crest',
      feedbackTitle: 'Location Risk!',
      feedbackText: 'The school crest and name let strangers find out where you study and your daily timetable.',
    },
    'hs-badge': {
      label: 'ID Badge with Full Name',
      feedbackTitle: 'Full Name Exposed!',
      feedbackText: 'Never display your full name online: strangers could use it to pretend they know you or your family.',
    },
    'hs-street': {
      label: 'Street Sign & House Number',
      feedbackTitle: 'Exact Address Exposed!',
      feedbackText: 'The street sign reveals your exact home location. Always blur or crop out background street numbers!',
    },
    'hs-calendar': {
      label: 'Backpack with GPS Tag',
      feedbackTitle: 'Tracker Tag Exposed!',
      feedbackText: 'Shows information about your daily commute and belongings. Avoid photographing personal identifiers.',
    },
    'hs-safe-tree': {
      label: 'Park Tree',
      feedbackTitle: 'Safe Element!',
      feedbackText: 'A generic tree or park background does not jeopardize your security or expose your identity.',
    },
    'hs-safe-ball': {
      label: 'Soccer Ball',
      feedbackTitle: 'Safe Element!',
      feedbackText: 'Sharing your love for sports is fun and safe! It does not leak your location or private records.',
    },
  },
};

export function getLocalizedWorlds(lang: Language): World[] {
  const langOverrides = WORLD_LOCALIZATIONS[lang] || WORLD_LOCALIZATIONS.es;

  return WORLDS_DATA.map((world) => {
    const override = langOverrides[world.id];
    if (!override) return world;

    const localizedMissions = world.missions.map((m, idx) => {
      const missionOverride = override.missions[idx];
      if (!missionOverride) return m;

      return {
        ...m,
        title: missionOverride.title,
        subtitle: missionOverride.subtitle,
        description: missionOverride.description,
      };
    });

    return {
      ...world,
      name: override.name,
      title: override.title,
      subtitle: override.subtitle,
      motto: override.motto,
      biome: override.biome,
      finalChallengeTitle: override.finalChallengeTitle,
      finalChallengeDesc: override.finalChallengeDesc,
      missions: localizedMissions,
    };
  });
}

export function getLocalizedBadges(lang: Language): AchievementBadge[] {
  const langOverrides = BADGE_LOCALIZATIONS[lang] || BADGE_LOCALIZATIONS.es;

  return BADGES_DATA.map((badge) => {
    const override = langOverrides[badge.id];
    if (!override) return badge;

    return {
      ...badge,
      title: override.title,
      description: override.description,
      category: override.category,
      rarity: override.rarity,
    };
  });
}

export function getLocalizedHotspots(lang: Language): GameHotspot[] {
  const langOverrides = HOTSPOT_LOCALIZATIONS[lang] || HOTSPOT_LOCALIZATIONS.es;

  return PHOTO_HOTSPOTS.map((hs) => {
    const override = langOverrides[hs.id];
    if (!override) return hs;

    return {
      ...hs,
      label: override.label,
      feedbackTitle: override.feedbackTitle,
      feedbackText: override.feedbackText,
    };
  });
}
