import type { Dict } from "./index";

/** Spanish. */
export const es: Dict = {
  nav: {
    platform: "Plataforma",
    solutions: "Soluciones",
    tactics: "Tácticas",
    proof: "Evidencia",
    marketplace: "Mercado",
  },
  header: {
    athletes: "Atletas",
    signIn: "Iniciar sesión",
    bookDemo: "Reservar una demo",
  },
  lang: {
    label: "Idioma",
  },
  footer: {
    tagline:
      "Inteligencia de disponibilidad con validación para el fútbol — una puntuación diaria por atleta, siempre explicable y gobernada por consentimiento. Construido por Healthmetryx.",
    product: "Producto",
    getStarted: "Empezar",
    trust: "Confianza y legal",
    pilot: "Programa piloto",
    guest: "Continuar como invitado",
    demo: "Reservar una demo",
    changelog: "Registro de cambios",
    privacy: "Privacidad",
    terms: "Términos",
    pilotCta: "Únete al piloto",
    chip: "Demo sintética",
    disclaimer: "Solo apoyo a decisiones · no es un dispositivo médico",
    copyright: "© 2026 Healthmetryx · Sportmetryx Football",
  },
  home: {
    hero: {
      eyebrow: "Apoyo a decisiones para el cuerpo técnico de fútbol",
      h1a: "Convierte los datos diarios de tus atletas en",
      h1b: "decisiones que puedes defender.",
      ledeStrong: "Sportmetryx Football",
      ledeRest:
        "convierte los datos que tu cuerpo técnico ya recopila — GPS, carga de sesiones, bienestar, entorno — en una puntuación diaria de disponibilidad por atleta: primero verificada, construida sobre líneas base personales y siempre explicable.",
      btnDemo: "Reservar una demo",
      btnGuest: "Continuar como invitado",
      btnPlatform: "Ver la plataforma",
      guestNote: "El modo invitado muestra todas las pantallas con datos sintéticos etiquetados — sin necesidad de cuenta.",
    },
    proofLabels: [
      "deportes en el procesamiento",
      "observaciones de dispositivos procesadas",
      "sesiones modeladas de extremo a extremo",
      "despliegues en vivo",
    ],
    solutions: {
      eyebrow: "Soluciones",
      h2: "Cuatro puestos en la mesa. Un modelo de datos.",
      explore: "Explorar solución →",
      cards: [
        {
          title: "Disponibilidad y rendimiento",
          body: "Sabe quién puede entrenar — y con qué intensidad — antes de la sesión, en un tablero en el que todo el equipo confía.",
        },
        {
          title: "Medicina y rehabilitación",
          body: "Detecta señales COMPROMISED a tiempo, mantén los datos WITHHELD fuera del cuadro y documenta el retorno con una trilha de auditoría.",
        },
        {
          title: "Coaching y desarrollo",
          body: "Selecciona, rota y descansa con contexto — comparaciones de plantilla y tendencias de 14 días en lugar de solo instinto.",
        },
        {
          title: "Productos de datos e investigación",
          body: "Empaqueta y licencia conjuntos de datos con consentimiento a través del mercado integrado — un canal de ingresos sobre datos que ya produces.",
        },
      ],
    },
    what: {
      eyebrow: "Qué es",
      h2: "Una capa de inteligencia de disponibilidad — no otro panel.",
      p1: "Sportmetryx unifica las exportaciones dispersas que una organización de fútbol ya produce — archivos de sensores, formularios de bienestar, informes de carga — en un único **registro combinado atleta-día**: una fila por atleta y día, y una puntuación de disponibilidad derivada de él.",
      p2: "Cada puntuación está **validada** (las entradas defectuosas o ausentes se marcan, nunca se puntúan en silencio), **explicable** (siempre puedes ver qué impulsores movieron la cifra) y **gobernada por consentimiento** (los datos del atleta son visibles solo bajo los controles de acceso que cada atleta acepta).",
      p3: "El resultado es una imagen compartida y auditable en la que todo el equipo puede actuar antes de cada sesión.",
      glanceTitle: "De un vistazo",
      glance: [
        { label: "Dominio", value: "Rendimiento en fútbol (soccer)" },
        { label: "Construido por", value: "Healthmetryx" },
        { label: "Puntuaciones", value: "Validadas y explicables" },
        { label: "Líneas base", value: "Personales, por atleta" },
        { label: "Datos", value: "Demo sintética — no son atletas reales" },
        { label: "Estado", value: "Prototipo · investigación y demostración" },
      ],
    },
    who: {
      eyebrow: "Para quién",
      h2: "Una plataforma, cada rol en el ciclo.",
      cards: [
        { title: "Cuerpo técnico", line: "Define la imagen diaria de entrenamiento desde una pantalla." },
        { title: "Medicina y rehabilitación", line: "Detecta señales COMPROMISED a tiempo y valida el retorno." },
        { title: "Entrenadores", line: "Elige la plantilla con contexto de disponibilidad, no solo instinto." },
        { title: "Analistas e investigadores", line: "Trabaja con conjuntos de datos validados y con consentimiento." },
      ],
    },
    usecases: {
      eyebrow: "Casos de uso",
      h2: "Para qué se usa",
      cards: [
        {
          title: "Decisiones diarias de disponibilidad",
          body: "Quién está READY, MONITOR o COMPROMISED antes de la sesión — con los impulsores detrás de cada banda, no una caja negra.",
        },
        {
          title: "Carga y entorno",
          body: "Sigue la carga diaria, los viajes y el calor frente a la línea base de cada atleta, sin perder nunca el contexto.",
        },
        {
          title: "Planificación de plantilla y rotaciones",
          body: "Compara la disponibilidad de toda la plantilla para planificar minutos, rotaciones y descansos con confianza.",
        },
        {
          title: "Productos de datos e investigación",
          body: "Empaqueta y licencia conjuntos derivados en el mercado — solo demo, sin pagos reales.",
        },
      ],
    },
    watch: {
      eyebrow: "Mira",
      h2: "Mira el recorrido del producto",
      lede: "Una portada y cinco capítulos — resumen, tablero de atletas, Player 360, mercado, gobernanza. Pulsa play o salta a cualquier capítulo. Coloca una grabación real en **public/demo.mp4** y este reproductor la usará.",
    },
    tour: {
      eyebrow: "Cómo funciona",
      h2: "Importa. Valida. Decide.",
      sub: "Recorre el flujo — o déjalo reproducir.",
    },
    sports: [
      "Fútbol",
      "Fútbol americano",
      "Baloncesto",
      "Béisbol",
      "Ciclismo",
      "Rugby",
      "Atletismo",
      "Voleibol",
    ],
    data: {
      eyebrow: "Los datos",
      h2: "Explora el conjunto de datos de la demo",
      lede: "Los datos exactos con los que funciona esta demo — 50 atletas sintéticos, medias diarias de sensores, carga, entorno, consentimiento, líneas base y puntuaciones.",
      download: "Descargar CSV completo",
      stats: ["Filas atleta-día", "Atletas", "Equipos", "Días cubiertos"],
      distTitle: "Distribución de disponibilidad (días puntuados)",
      range: "Rango",
      teams: "Equipos",
      headers: ["Atleta", "Fecha", "Equipo", "Posición", "Puntuación", "Banda"],
      note: "Vista previa de las primeras 6 filas. El archivo completo contiene todas las medias de sensores, contribuciones de impulsores y verificaciones de validez — datos sintéticos claramente etiquetados, no atletas reales.",
    },
    tactics: {
      eyebrow: "Nuevo · inteligencia táctica",
      h2: "Formaciones, fases y sistemas de juego en un tablero 3D.",
      lede: "La disponibilidad responde quién puede jugar — la táctica responde cómo jugamos. Cambia de formación, mira cómo se dibujan los pases y ejecuta el ejercicio de coaching.",
      btn: "Explorar tácticas →",
    },
    cta: {
      h2: "Míralo funcionar con tus preguntas.",
      lede: "Treinta minutos, producto en vivo, sin diapositivas — las cinco pantallas, tus preguntas de datos y cómo es una temporada piloto.",
      btnProof: "Ver la evidencia",
    },
  },
  nf: {
    eyebrow: "404 · Fuera de cancha",
    h1: "Página no encontrada.",
    lede: "El enlace está roto o la página se movió. Todos los atletas están donde deben — este no.",
    btnHome: "Volver al inicio",
    btnMarket: "Abrir el mercado",
    btnGuest: "Continuar como invitado",
    note: "Solo apoyo a decisiones. No es un dispositivo médico. © Sportmetryx",
  },
};
