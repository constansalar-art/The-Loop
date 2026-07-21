import type { AreaCode } from "./areas";

/**
 * Páginas de carrera — contenido SEO evergreen.
 *
 * Cada carrera apunta a keywords como "qué estudiar si te gusta X",
 * "salida laboral de X" y "dónde estudiar X en Argentina". El texto es
 * orientativo; la disponibilidad concreta de cada carrera por universidad
 * conviene chequearla antes de publicar (los planes cambian).
 */

export interface Faq {
  q: string;
  a: string;
}

export interface Career {
  slug: string;
  name: string;
  areaCode: AreaCode;
  /** Título para <h1> y metadata. */
  seoTitle: string;
  seoDescription: string;
  /** Gancho corto arriba de todo. */
  intro: string;
  /** Duración típica de la carrera de grado en Argentina. */
  duration: string;
  /** De qué se trata (párrafo largo). */
  about: string;
  /** Materias / temas centrales. */
  topics: string[];
  /** "Es para vos si…" */
  forYouIf: string[];
  /** Dónde estudiarla en Argentina. */
  whereToStudy: string[];
  /** Salida laboral (párrafo). */
  jobOutlook: string;
  /** Roles / puestos concretos. */
  jobRoles: string[];
  faqs: Faq[];
}

export const CAREERS: Career[] = [
  {
    slug: "ingenieria-en-sistemas",
    name: "Ingeniería en Sistemas / Informática",
    areaCode: "TEC",
    seoTitle: "Ingeniería en Sistemas en Argentina: de qué se trata, dónde estudiar y salida laboral",
    seoDescription:
      "Todo sobre Ingeniería en Sistemas / Informática en Argentina: qué vas a estudiar, cuánto dura, en qué universidades cursarla y cómo es la salida laboral.",
    intro:
      "Si te gusta entender cómo funcionan las cosas y armar soluciones con la compu, esta es una de las carreras con mejor salida laboral del país.",
    duration: "5 años (grado). Muchas facultades permiten trabajar desde el 2º o 3er año.",
    about:
      "La Ingeniería en Sistemas (también llamada Ingeniería Informática o en Computación según la universidad) forma profesionales capaces de diseñar, construir y mantener software y sistemas complejos. No es solo 'programar': aprendés a pensar problemas, modelar datos, entender redes, bases de datos, arquitectura de sistemas y a gestionar proyectos tecnológicos. Combina una base fuerte de matemática y lógica con materias muy prácticas de desarrollo. Es una carrera exigente en los primeros años (análisis, álgebra, física) que después se vuelve cada vez más aplicada y cercana a lo que vas a hacer en un trabajo real.",
    topics: [
      "Programación y estructuras de datos",
      "Bases de datos",
      "Algoritmos y matemática discreta",
      "Redes y sistemas operativos",
      "Ingeniería de software y gestión de proyectos",
    ],
    forYouIf: [
      "Te gusta resolver problemas y armar cosas que funcionen",
      "Tenés paciencia para debuggear y buscarle la vuelta",
      "No te asusta la matemática de los primeros años",
    ],
    whereToStudy: ["UTN", "UBA (FIUBA / Exactas)", "ITBA", "UADE", "Universidad Austral"],
    jobOutlook:
      "Es probablemente la carrera con mejor y más rápida salida laboral en Argentina. La demanda de programadores y perfiles técnicos supera a la oferta, muchas empresas contratan estudiantes avanzados y una parte importante trabaja para el exterior cobrando en dólares. Podés emplearte en producto, banca, consultoras, startups o freelancear. Los sueldos arrancan por encima del promedio y crecen rápido con experiencia.",
    jobRoles: [
      "Desarrollador/a (backend, frontend, full-stack, mobile)",
      "Ingeniero/a de datos o DevOps",
      "Líder técnico / arquitecto de software",
      "Emprendedor/a tech (startup propia)",
    ],
    faqs: [
      {
        q: "¿Necesito saber programar antes de empezar?",
        a: "No. La mayoría arranca sin saber nada y aprende en la carrera. Ayuda tener afinidad con la lógica y la matemática, pero se enseña desde cero.",
      },
      {
        q: "¿Es muy difícil?",
        a: "Los primeros dos años son los más duros por las materias de matemática y física. Si los pasás, el resto se vuelve más práctico y motivante.",
      },
    ],
  },
  {
    slug: "ciencia-de-datos",
    name: "Ciencia de Datos",
    areaCode: "TEC",
    seoTitle: "Ciencia de Datos en Argentina: qué es, dónde estudiar y salida laboral",
    seoDescription:
      "Ciencia de Datos en Argentina: de qué se trata, qué vas a aprender (Python, estadística, machine learning), dónde estudiarla y cómo es la salida laboral.",
    intro:
      "La carrera que combina programación, estadística y ganas de encontrarle sentido a los números. Una de las más demandadas del momento.",
    duration: "Licenciatura de ~5 años. También hay tecnicaturas y diplomaturas más cortas.",
    about:
      "La Ciencia de Datos se dedica a extraer conocimiento de grandes volúmenes de información. Vas a aprender a programar (sobre todo Python), estadística y probabilidad, machine learning y cómo comunicar hallazgos para que sirvan a decisiones reales. Es un cruce entre la tecnología, la matemática y el negocio: no alcanza con hacer un modelo, hay que entender el problema y explicar los resultados. Es una carrera joven, muy conectada con la industria y con proyectos prácticos desde temprano.",
    topics: [
      "Python y manejo de datos",
      "Estadística y probabilidad",
      "Machine learning",
      "Visualización de datos",
      "Bases de datos y big data",
    ],
    forYouIf: [
      "Te copan los números pero también contar historias con ellos",
      "Querés algo técnico con impacto directo en decisiones",
      "Te interesa la inteligencia artificial",
    ],
    whereToStudy: ["UBA", "UTDT (Di Tella)", "Universidad Austral", "UADE", "ITBA"],
    jobOutlook:
      "La demanda de perfiles de datos crece año a año en bancos, empresas de tecnología, consultoras, salud y gobierno. Es un campo con muy buenos sueldos, posibilidad de trabajo remoto para el exterior y una curva de crecimiento rápida. Al ser un área nueva, hay más puestos que gente formada.",
    jobRoles: [
      "Data Scientist / Analista de datos",
      "Ingeniero/a de Machine Learning",
      "Ingeniero/a de datos",
      "Analista de Business Intelligence",
    ],
    faqs: [
      {
        q: "¿Es lo mismo que Ingeniería en Sistemas?",
        a: "No. Comparten la programación, pero Ciencia de Datos pone el foco en estadística, modelos y análisis, mientras que Sistemas se enfoca en construir software y sistemas.",
      },
      {
        q: "¿Sirve si soy más de números que de programar?",
        a: "Sí, es ideal para ese perfil: usa mucha estadística y matemática aplicada, con la programación como herramienta.",
      },
    ],
  },
  {
    slug: "ingenieria-industrial",
    name: "Ingeniería Industrial",
    areaCode: "TEC",
    seoTitle: "Ingeniería Industrial en Argentina: de qué se trata, dónde estudiar y salida laboral",
    seoDescription:
      "Ingeniería Industrial en Argentina: qué vas a estudiar, cuánto dura, dónde cursarla y cuál es la salida laboral de una de las ingenierías más versátiles.",
    intro:
      "La ingeniería más 'de gestión': optimiza procesos, personas y recursos. Una carrera puente entre lo técnico y los negocios.",
    duration: "5 años (grado).",
    about:
      "La Ingeniería Industrial se ocupa de diseñar, mejorar y gestionar sistemas de producción y servicios. Aprendés a optimizar procesos, reducir costos, coordinar equipos y tomar decisiones con datos. Tiene base técnica (matemática, física, estadística) pero también materias de economía, gestión y logística. Es la ingeniería más versátil: sus egresados terminan tanto en fábricas como en consultoras, bancos o startups, porque la mirada de 'hacer las cosas más eficientes' sirve en cualquier industria.",
    topics: [
      "Investigación operativa y optimización",
      "Gestión de la producción y logística",
      "Economía y finanzas",
      "Estadística y calidad",
      "Gestión de proyectos",
    ],
    forYouIf: [
      "Te gustan los números pero también liderar y organizar",
      "Querés algo técnico sin encerrarte en un solo tema",
      "Te ves gestionando equipos o tu propio negocio",
    ],
    whereToStudy: ["UBA", "UTN", "ITBA", "Universidad Austral", "UADE"],
    jobOutlook:
      "Es una de las carreras con salida laboral más amplia y estable. Sus egresados son muy buscados para roles de gestión, operaciones, logística, consultoría y finanzas. La versatilidad hace que rara vez falte trabajo, y muchos terminan en puestos de liderazgo o emprendiendo.",
    jobRoles: [
      "Analista / jefe de operaciones o logística",
      "Consultor/a de gestión",
      "Project manager",
      "Roles de management y dirección",
    ],
    faqs: [
      {
        q: "¿Tiene mucha matemática?",
        a: "Sí, comparte la base de ingeniería (análisis, álgebra, física), pero se equilibra con materias de gestión y economía.",
      },
      {
        q: "¿Sirve para trabajar en cualquier industria?",
        a: "Es una de sus grandes ventajas: la formación aplica a manufactura, servicios, tecnología, banca y más.",
      },
    ],
  },
  {
    slug: "administracion-de-empresas",
    name: "Administración de Empresas",
    areaCode: "NEG",
    seoTitle: "Administración de Empresas en Argentina: de qué se trata, dónde estudiar y salida laboral",
    seoDescription:
      "Licenciatura en Administración en Argentina: qué vas a estudiar, dónde cursarla y cuál es la salida laboral. La carrera clásica para el mundo de los negocios.",
    intro:
      "La carrera para quien quiere manejar (o armar) una empresa. Amplia, flexible y con salida a casi cualquier industria.",
    duration: "4 a 5 años (Licenciatura).",
    about:
      "La Licenciatura en Administración forma profesionales capaces de planificar, organizar y dirigir organizaciones de cualquier tipo. Vas a ver finanzas, marketing, recursos humanos, operaciones, estrategia y contabilidad. Es una carrera generalista pensada para que entiendas cómo funciona un negocio de punta a punta y puedas tomar decisiones. Ideal si todavía no sabés a qué área específica dedicarte, porque después te podés especializar en la parte que más te guste.",
    topics: [
      "Estrategia y management",
      "Finanzas y contabilidad",
      "Marketing",
      "Recursos humanos",
      "Operaciones y economía",
    ],
    forYouIf: [
      "Te gusta organizar, liderar y ver el panorama completo",
      "Soñás con tener tu propia empresa",
      "Querés una carrera versátil y con salida amplia",
    ],
    whereToStudy: ["UdeSA (San Andrés)", "Universidad Austral", "UBA", "UCA", "UADE", "UTDT (Di Tella)"],
    jobOutlook:
      "Tiene una de las salidas más amplias: podés trabajar en empresas de cualquier rubro, consultoras, bancos, multinacionales o emprender lo tuyo. Los primeros años suelen ser en roles de analista y la carrera crece hacia posiciones de management. La red de contactos y la universidad elegida pesan bastante en las oportunidades.",
    jobRoles: [
      "Analista / jefe de área (finanzas, marketing, RRHH)",
      "Consultor/a de negocios",
      "Gerente / director",
      "Emprendedor/a",
    ],
    faqs: [
      {
        q: "¿Es lo mismo que Contador?",
        a: "No. Contador se enfoca en lo contable, impositivo y de auditoría. Administración es más general y estratégica, orientada a dirigir el negocio completo.",
      },
      {
        q: "¿Sirve para emprender?",
        a: "Sí, te da herramientas de finanzas, marketing y gestión muy útiles, aunque emprender también se aprende haciendo.",
      },
    ],
  },
  {
    slug: "economia",
    name: "Economía",
    areaCode: "NEG",
    seoTitle: "Economía en Argentina: de qué se trata, dónde estudiar y salida laboral",
    seoDescription:
      "Licenciatura en Economía en Argentina: qué vas a estudiar, dónde cursarla y cómo es la salida laboral. Para quienes quieren entender cómo funciona el mundo con números.",
    intro:
      "Para los que quieren entender por qué pasa lo que pasa con la plata, los precios y los países. Analítica y con mucha demanda.",
    duration: "4 a 5 años (Licenciatura).",
    about:
      "La Economía estudia cómo las personas, empresas y países toman decisiones frente a recursos limitados. Tiene una base fuerte de matemática, estadística y modelos, combinada con materias de micro y macroeconomía, finanzas e historia económica. Es más analítica y teórica que Administración: te forma para analizar datos, entender políticas y anticipar tendencias. En un país como Argentina, donde la economía está siempre en el centro de la conversación, es una carrera con mucho peso.",
    topics: [
      "Microeconomía y macroeconomía",
      "Econometría y estadística",
      "Finanzas",
      "Matemática aplicada",
      "Historia y política económica",
    ],
    forYouIf: [
      "Te gusta la matemática y pensar de forma analítica",
      "Te interesa entender la actualidad y la política económica",
      "Disfrutás de los datos y los modelos",
    ],
    whereToStudy: ["UdeSA (San Andrés)", "UTDT (Di Tella)", "UBA", "Universidad Austral", "UCA"],
    jobOutlook:
      "Los economistas trabajan en consultoras, bancos, fondos de inversión, organismos públicos, think tanks y empresas. Es una carrera muy valorada para roles de análisis, finanzas y research, con buenos sueldos y opciones de posgrado en el exterior. También abre puertas en la función pública y en medios.",
    jobRoles: [
      "Analista económico / financiero",
      "Consultor/a",
      "Research en bancos o fondos",
      "Economista en el sector público u ONGs",
    ],
    faqs: [
      {
        q: "¿Tiene mucha matemática?",
        a: "Sí, bastante. Es una carrera analítica con econometría, estadística y modelos. Si te llevás bien con los números, es una ventaja.",
      },
      {
        q: "¿Conviene más que Administración?",
        a: "Depende de tu perfil: Economía es más teórica y analítica; Administración, más práctica y orientada a gestionar. Ninguna es 'mejor', son distintas.",
      },
    ],
  },
  {
    slug: "marketing",
    name: "Marketing",
    areaCode: "NEG",
    seoTitle: "Marketing en Argentina: de qué se trata, dónde estudiar y salida laboral",
    seoDescription:
      "Marketing en Argentina: qué vas a estudiar, dónde cursarlo y cuál es la salida laboral. La carrera para quienes cruzan creatividad y negocios.",
    intro:
      "El cruce perfecto entre creatividad y negocios: entender a la gente y conectar productos con personas.",
    duration: "4 años (Licenciatura). También hay tecnicaturas más cortas.",
    about:
      "El Marketing estudia cómo entender a los consumidores y construir marcas, productos y campañas que conecten con ellos. Vas a ver investigación de mercado, comportamiento del consumidor, comunicación, marketing digital, branding y analítica. Es una carrera que combina la parte creativa (ideas, contenidos, campañas) con la parte estratégica y de datos (métricas, embudos, performance). Con el auge de las redes y el e-commerce, el marketing digital se volvió una de las áreas con más demanda.",
    topics: [
      "Marketing digital y redes",
      "Investigación de mercado",
      "Branding y comunicación",
      "Analítica y métricas",
      "Comportamiento del consumidor",
    ],
    forYouIf: [
      "Te gusta la creatividad pero también los resultados medibles",
      "Vivís atento a las tendencias y las redes",
      "Te interesa entender por qué la gente compra lo que compra",
    ],
    whereToStudy: ["UADE", "UP (Palermo)", "Universidad Austral", "UCA", "UdeSA"],
    jobOutlook:
      "Hay mucha demanda de perfiles de marketing digital, performance y contenidos. Podés trabajar en empresas, agencias, startups o de forma freelance, y es un área que permite crecer rápido y hasta trabajar para el exterior. La combinación de creatividad y datos es cada vez más valorada.",
    jobRoles: [
      "Community / social media manager",
      "Especialista en marketing digital o performance",
      "Brand manager",
      "Analista de marketing / growth",
    ],
    faqs: [
      {
        q: "¿Necesito ser creativo o más analítico?",
        a: "El marketing moderno necesita las dos cosas. Podés especializarte en la parte creativa (contenido, branding) o en la analítica (performance, datos).",
      },
      {
        q: "¿Se puede trabajar freelance?",
        a: "Sí, es una de las áreas con más oportunidades freelance, sobre todo en redes, contenidos y marketing digital.",
      },
    ],
  },
  {
    slug: "medicina",
    name: "Medicina",
    areaCode: "SAL",
    seoTitle: "Medicina en Argentina: de qué se trata, cuánto dura, dónde estudiar y salida laboral",
    seoDescription:
      "Medicina en Argentina: qué vas a estudiar, cuántos años dura, dónde cursarla y cómo es la salida laboral. Todo sobre la carrera para quienes quieren curar y ayudar.",
    intro:
      "La carrera vocacional por excelencia: larga y exigente, pero de las que dejan huella de verdad.",
    duration: "6 años de grado + años de residencia para especializarte.",
    about:
      "Medicina forma profesionales para prevenir, diagnosticar y tratar enfermedades. Es una carrera larga y demandante: los primeros años son muy teóricos (anatomía, fisiología, bioquímica) y después llega la parte clínica, con práctica en hospitales. Al recibirte solés hacer una residencia de varios años para especializarte (clínica, pediatría, cirugía, etc.). Requiere vocación, constancia y estómago para situaciones difíciles, pero es de las carreras con mayor sentido y reconocimiento social.",
    topics: [
      "Anatomía y fisiología",
      "Bioquímica y farmacología",
      "Clínica médica",
      "Prácticas hospitalarias",
      "Especialidades (residencia)",
    ],
    forYouIf: [
      "Te importa de verdad ayudar y cuidar a la gente",
      "Tenés constancia para una carrera larga",
      "No te asusta el estudio intenso ni las situaciones difíciles",
    ],
    whereToStudy: ["UBA", "Universidad Austral", "UCA", "Universidad Favaloro", "Universidad Maimónides"],
    jobOutlook:
      "El sistema de salud siempre necesita médicos, así que la salida laboral es estable, aunque los primeros años (residencia) son de mucho trabajo y sueldos modestos. Con la especialización, las condiciones mejoran. Podés trabajar en hospitales públicos, clínicas privadas, consultorio propio, investigación o docencia.",
    jobRoles: [
      "Médico/a clínico o especialista",
      "Médico/a en hospital o clínica",
      "Investigador/a o docente",
      "Consultorio particular",
    ],
    faqs: [
      {
        q: "¿Cuántos años dura en total?",
        a: "El grado son unos 6 años, y para especializarte sumás una residencia de entre 3 y 5 años según la especialidad.",
      },
      {
        q: "¿Hay examen de ingreso?",
        a: "Depende de la universidad. La UBA tiene el CBC; las privadas suelen tener su propio ingreso o examen. Conviene chequear cada caso.",
      },
    ],
  },
  {
    slug: "psicologia",
    name: "Psicología",
    areaCode: "SAL",
    seoTitle: "Psicología en Argentina: de qué se trata, dónde estudiar y salida laboral",
    seoDescription:
      "Psicología en Argentina: qué vas a estudiar, dónde cursarla y cómo es la salida laboral. Para quienes quieren entender y acompañar a las personas.",
    intro:
      "Para los que quieren entender cómo pensamos, sentimos y actuamos, y acompañar a otros en el proceso.",
    duration: "5 años (Licenciatura).",
    about:
      "La Psicología estudia el comportamiento y los procesos mentales de las personas. Vas a ver distintas corrientes teóricas (psicoanálisis, cognitivo-conductual, etc.), desarrollo humano, psicología clínica, social y educacional, más metodología de investigación. En Argentina tiene una fuerte tradición, sobre todo psicoanalítica. Es una carrera para quienes se interesan genuinamente por las personas y tienen capacidad de escucha, empatía y análisis. Podés orientarte a lo clínico, lo laboral, lo educativo o la investigación.",
    topics: [
      "Corrientes psicológicas",
      "Psicología clínica",
      "Desarrollo y aprendizaje",
      "Psicología social y laboral",
      "Metodología de investigación",
    ],
    forYouIf: [
      "Te interesan las personas y tenés capacidad de escucha",
      "Te gusta analizar el porqué de las conductas",
      "Buscás una carrera con impacto humano",
    ],
    whereToStudy: ["UBA", "UCA", "USAL", "UP (Palermo)", "Universidad Favaloro"],
    jobOutlook:
      "La salida más conocida es el consultorio (clínica), pero hay campo en empresas (recursos humanos, selección), educación, salud pública, deporte y research. Armar clientela clínica lleva tiempo, así que muchos combinan varias áreas. Es una profesión con demanda creciente por la mayor atención a la salud mental.",
    jobRoles: [
      "Psicólogo/a clínico (consultorio)",
      "Selección y desarrollo en RRHH",
      "Psicólogo/a educacional",
      "Investigador/a o docente",
    ],
    faqs: [
      {
        q: "¿Solo se puede trabajar en consultorio?",
        a: "No. Además de la clínica, hay salida en empresas (RRHH), educación, salud pública, deporte y forense.",
      },
      {
        q: "¿Es una carrera de Salud o Social?",
        a: "Está a caballo entre ambas. Es una profesión de la salud, pero comparte mucho con las ciencias sociales.",
      },
    ],
  },
  {
    slug: "nutricion",
    name: "Nutrición",
    areaCode: "SAL",
    seoTitle: "Nutrición en Argentina: de qué se trata, dónde estudiar y salida laboral",
    seoDescription:
      "Licenciatura en Nutrición en Argentina: qué vas a estudiar, dónde cursarla y cómo es la salida laboral. Salud, ciencia y alimentación en una sola carrera.",
    intro:
      "Ciencia aplicada a la alimentación y la salud. Una carrera del área salud con salida cada vez más amplia.",
    duration: "5 años (Licenciatura).",
    about:
      "La Nutrición estudia la relación entre la alimentación y la salud. Vas a ver bioquímica, fisiología, ciencia de los alimentos, dietoterapia y nutrición clínica, además de salud pública. Es más corta y menos demandante que Medicina, pero comparte la base científica del área salud. Podés orientarte a la atención clínica de pacientes, a la nutrición deportiva, a la industria alimentaria, a la salud pública o a la comunicación (cada vez hay más nutricionistas divulgando en redes).",
    topics: [
      "Bioquímica y fisiología",
      "Ciencia de los alimentos",
      "Dietoterapia y nutrición clínica",
      "Nutrición deportiva",
      "Salud pública",
    ],
    forYouIf: [
      "Te interesan la salud y las ciencias de la vida",
      "Querés ayudar a la gente sin una carrera tan larga como Medicina",
      "Te copa el mundo de la alimentación y el deporte",
    ],
    whereToStudy: ["UBA", "UCA", "ISALUD", "Universidad Favaloro", "Universidad Maimónides"],
    jobOutlook:
      "Hay salida en consultorio, clubes y gimnasios (nutrición deportiva), hospitales, industria alimentaria, salud pública y comunicación. El auge del bienestar y la vida saludable amplió mucho la demanda, y las redes se volvieron una vidriera profesional para muchos nutricionistas.",
    jobRoles: [
      "Nutricionista clínico (consultorio)",
      "Nutrición deportiva",
      "Industria alimentaria",
      "Salud pública / comunicación",
    ],
    faqs: [
      {
        q: "¿Es más corta que Medicina?",
        a: "Sí, dura unos 5 años y no requiere residencia, aunque comparte la base científica del área salud.",
      },
      {
        q: "¿Se puede trabajar en deporte?",
        a: "Sí, la nutrición deportiva es una de las salidas que más creció, en clubes, gimnasios y con deportistas particulares.",
      },
    ],
  },
  {
    slug: "comunicacion-periodismo",
    name: "Comunicación / Periodismo",
    areaCode: "SOC",
    seoTitle: "Comunicación y Periodismo en Argentina: de qué se trata, dónde estudiar y salida laboral",
    seoDescription:
      "Comunicación Social y Periodismo en Argentina: qué vas a estudiar, dónde cursarlo y cuál es la salida laboral. Para quienes quieren contar, conectar y crear contenido.",
    intro:
      "Para los que saben leer el mundo y contarlo. Una carrera que hoy va mucho más allá de los medios tradicionales.",
    duration: "4 a 5 años (Licenciatura).",
    about:
      "La Comunicación Social estudia cómo circula la información y el sentido en la sociedad: medios, discursos, cultura y opinión pública. El Periodismo es una de sus ramas, más enfocada en producir noticias e investigar. Vas a ver teoría de la comunicación, redacción, producción audiovisual, comunicación institucional y digital. Hoy la carrera excede a los diarios y la TV: los egresados trabajan en marcas, redes, contenidos, prensa, ONGs y hasta como creadores independientes.",
    topics: [
      "Teoría de la comunicación",
      "Redacción y producción periodística",
      "Producción audiovisual",
      "Comunicación institucional y digital",
      "Opinión pública y cultura",
    ],
    forYouIf: [
      "Te gusta escribir, contar y estar al tanto de todo",
      "Tenés facilidad para conectar con la gente y las ideas",
      "Te interesan los medios, las redes y la cultura",
    ],
    whereToStudy: ["UBA", "Universidad Austral", "UP (Palermo)", "UCA", "USAL"],
    jobOutlook:
      "El campo se diversificó mucho: además de medios, hay salida en comunicación de empresas, marketing de contenidos, prensa, producción, redes y creación propia. Es un área competitiva donde el portfolio y la red de contactos pesan tanto como el título, pero con lugar para quien produce y se mueve.",
    jobRoles: [
      "Periodista / redactor",
      "Community / content manager",
      "Comunicación institucional y prensa",
      "Productor/a de contenidos",
    ],
    faqs: [
      {
        q: "¿Periodismo tiene futuro con la crisis de los medios?",
        a: "Los medios tradicionales cambiaron, pero la necesidad de comunicar creció. Hoy la salida está muy repartida entre medios, marcas, redes y contenidos.",
      },
      {
        q: "¿Comunicación y Periodismo son lo mismo?",
        a: "Periodismo suele ser una orientación dentro de Comunicación Social, más enfocada en producir noticias e investigación.",
      },
    ],
  },
  {
    slug: "relaciones-internacionales",
    name: "Relaciones Internacionales",
    areaCode: "SOC",
    seoTitle: "Relaciones Internacionales en Argentina: de qué se trata, dónde estudiar y salida laboral",
    seoDescription:
      "Relaciones Internacionales en Argentina: qué vas a estudiar, dónde cursarla y cómo es la salida laboral. Política, diplomacia y el mundo global en una carrera.",
    intro:
      "Para los que miran el mundo entero: política global, diplomacia, comercio y cómo se relacionan los países.",
    duration: "4 a 5 años (Licenciatura).",
    about:
      "Las Relaciones Internacionales estudian cómo interactúan los países, los organismos internacionales y los actores globales. Vas a ver política internacional, historia, derecho internacional, economía, comercio exterior e idiomas. Es una carrera interdisciplinaria, ideal para quienes se interesan por la actualidad mundial, la diplomacia y los procesos globales. Suele requerir un buen dominio de idiomas (inglés como mínimo) y abre puertas a experiencias en el exterior.",
    topics: [
      "Política y teoría internacional",
      "Derecho internacional",
      "Economía y comercio exterior",
      "Historia mundial",
      "Idiomas",
    ],
    forYouIf: [
      "Te interesa la política mundial y la actualidad",
      "Se te dan (o te gustan) los idiomas",
      "Soñás con trabajar en organismos o empresas globales",
    ],
    whereToStudy: ["UBA", "UCA", "USAL", "UdeSA", "Universidad Austral"],
    jobOutlook:
      "La salida incluye diplomacia (cancillería), organismos internacionales, ONGs, comercio exterior en empresas, consultoría y análisis político. Es un campo competitivo donde los idiomas, los posgrados y las pasantías internacionales hacen mucha diferencia. Muchos combinan sector público, privado y tercer sector.",
    jobRoles: [
      "Analista de política internacional",
      "Comercio exterior en empresas",
      "Organismos internacionales / ONGs",
      "Diplomacia (con concurso)",
    ],
    faqs: [
      {
        q: "¿Necesito saber idiomas?",
        a: "Sí, el inglés es prácticamente obligatorio y un segundo idioma suma mucho. Es una carrera muy orientada a lo global.",
      },
      {
        q: "¿Solo se puede ser diplomático?",
        a: "Para nada. La diplomacia es una salida, pero hay campo en empresas (comercio exterior), ONGs, consultoría y análisis.",
      },
    ],
  },
  {
    slug: "ciencia-politica",
    name: "Ciencia Política",
    areaCode: "SOC",
    seoTitle: "Ciencia Política en Argentina: de qué se trata, dónde estudiar y salida laboral",
    seoDescription:
      "Ciencia Política en Argentina: qué vas a estudiar, dónde cursarla y cómo es la salida laboral. Para quienes quieren entender el poder, el Estado y las decisiones públicas.",
    intro:
      "Para los que quieren entender cómo se toman las decisiones que nos afectan a todos: el poder, el Estado y la política.",
    duration: "4 a 5 años (Licenciatura).",
    about:
      "La Ciencia Política estudia el poder, las instituciones, los gobiernos y los procesos políticos. Vas a ver teoría política, sistemas de gobierno, políticas públicas, opinión pública, estadística y metodología. No es 'hacer política partidaria': es analizarla con rigor. Es una carrera para quienes se interesan por la actualidad, el Estado y cómo se diseñan y evalúan las decisiones públicas. Se cruza mucho con la comunicación, la economía y las relaciones internacionales.",
    topics: [
      "Teoría política",
      "Políticas públicas",
      "Sistemas de gobierno",
      "Opinión pública y análisis electoral",
      "Metodología y estadística",
    ],
    forYouIf: [
      "Te apasiona la actualidad y el debate político",
      "Te gusta analizar más que militar",
      "Te interesan el Estado y las políticas públicas",
    ],
    whereToStudy: ["UBA", "UCA", "UdeSA", "UTDT (Di Tella)", "USAL"],
    jobOutlook:
      "La salida incluye la gestión pública, consultoría política, análisis electoral y de opinión, ONGs, organismos internacionales, docencia e investigación. También hay demanda en comunicación política y asuntos públicos dentro de empresas. Es un campo donde la formación cuantitativa (datos, encuestas) suma mucho.",
    jobRoles: [
      "Analista político / de políticas públicas",
      "Consultor/a político y de opinión",
      "Gestión pública",
      "Asuntos públicos en empresas u ONGs",
    ],
    faqs: [
      {
        q: "¿Sirve si no quiero dedicarme a la política partidaria?",
        a: "Sí. La carrera es analítica, no partidaria. Muchos egresados trabajan en consultoría, datos, gestión o investigación.",
      },
      {
        q: "¿Se parece a Relaciones Internacionales?",
        a: "Comparten materias, pero Ciencia Política se enfoca en la política interna y el Estado, y RRII en lo global entre países.",
      },
    ],
  },
  {
    slug: "abogacia",
    name: "Abogacía",
    areaCode: "DER",
    seoTitle: "Abogacía en Argentina: de qué se trata, dónde estudiar y salida laboral",
    seoDescription:
      "Abogacía en Argentina: qué vas a estudiar, cuánto dura, dónde cursarla y cómo es la salida laboral. La carrera clásica para quienes tienen lógica y palabra.",
    intro:
      "Para los que tienen lógica, palabra y no aflojan en una discusión. Una de las carreras más tradicionales y con salida más amplia.",
    duration: "5 a 6 años (grado).",
    about:
      "La Abogacía forma profesionales del derecho: aprendés a interpretar y aplicar las leyes, redactar documentos legales, argumentar y representar intereses. Vas a ver derecho civil, penal, comercial, laboral, constitucional y procesal, entre muchas ramas. Es una carrera con mucha lectura y memoria, pero también con lógica y capacidad argumentativa. Es una de las más versátiles: podés litigar, asesorar empresas, trabajar en el Estado, en la Justicia o especializarte en un área puntual.",
    topics: [
      "Derecho civil y comercial",
      "Derecho penal",
      "Derecho laboral",
      "Derecho constitucional",
      "Derecho procesal",
    ],
    forYouIf: [
      "Tenés facilidad de palabra y te gusta argumentar",
      "No te asusta leer y estudiar mucho",
      "Te interesan la justicia, las reglas y los derechos",
    ],
    whereToStudy: ["UBA", "UCA", "Universidad Austral", "UdeSA", "UTDT", "UP (Palermo)"],
    jobOutlook:
      "La salida es muy amplia: estudios jurídicos, departamentos legales de empresas, el Poder Judicial, el Estado, escribanías o el ejercicio independiente. Los primeros años suelen ser en estudios o como pasante en tribunales, con sueldos que crecen mucho al especializarte (corporativo, tributario, etc.). Es una profesión con techo alto para quien se destaca.",
    jobRoles: [
      "Abogado/a litigante",
      "Asesor legal de empresas (in-house)",
      "Poder Judicial / función pública",
      "Especialista (tributario, laboral, corporativo)",
    ],
    faqs: [
      {
        q: "¿Hay que tener mucha memoria?",
        a: "Hay bastante lectura y memoria, sí, pero también es clave la lógica y la capacidad de argumentar y relacionar temas.",
      },
      {
        q: "¿Solo se puede litigar?",
        a: "No. Además de tribunales, hay mucha salida en empresas (legal in-house), el Estado, escribanía y áreas especializadas.",
      },
    ],
  },
  {
    slug: "escribania",
    name: "Escribanía / Notariado",
    areaCode: "DER",
    seoTitle: "Escribanía y Notariado en Argentina: de qué se trata, dónde estudiar y salida laboral",
    seoDescription:
      "Escribanía / Notariado en Argentina: qué vas a estudiar, dónde cursarla y cómo es la salida laboral. La rama del derecho especializada en dar fe pública.",
    intro:
      "La rama del derecho que da fe pública: escrituras, contratos y actos que necesitan seguridad jurídica.",
    duration: "5 años aprox. (a veces como orientación/posgrado del derecho).",
    about:
      "El escribano o notario es el profesional que da fe pública de actos jurídicos: compraventa de inmuebles, constitución de sociedades, testamentos, poderes y más. La formación comparte mucho con Abogacía (derecho civil, comercial, registral) y suma materias específicas de notariado. Es una salida más acotada y previsible que la abogacía general, con un fuerte componente de responsabilidad y precisión: cada documento que autoriza el escribano tiene valor legal pleno.",
    topics: [
      "Derecho civil y registral",
      "Derecho notarial",
      "Contratos y sociedades",
      "Derecho sucesorio",
      "Práctica notarial",
    ],
    forYouIf: [
      "Sos detallista y prolijo con los documentos",
      "Te gusta el derecho pero preferís algo más previsible que litigar",
      "Valorás la responsabilidad y la precisión",
    ],
    whereToStudy: ["UBA", "UCA", "Universidad Notarial Argentina", "USAL"],
    jobOutlook:
      "El escribano suele trabajar en registro propio o asociado a una escribanía. El acceso a un registro puede requerir concurso o disponibilidad según la jurisdicción, por lo que es una salida más regulada. A cambio, es una profesión estable y bien remunerada, muy ligada al mercado inmobiliario y societario.",
    jobRoles: [
      "Escribano/a titular o adscripto",
      "Asesoría notarial en estudios",
      "Área legal-registral en empresas",
    ],
    faqs: [
      {
        q: "¿Es lo mismo que Abogacía?",
        a: "Comparten base, pero el notariado se especializa en dar fe pública. En algunas universidades es una carrera propia y en otras una orientación o posgrado.",
      },
      {
        q: "¿Es fácil conseguir un registro?",
        a: "Depende de la jurisdicción: suele haber concursos o disponibilidad limitada, por eso conviene informarse en el colegio de escribanos de tu provincia.",
      },
    ],
  },
  {
    slug: "diseno-grafico",
    name: "Diseño Gráfico",
    areaCode: "ART",
    seoTitle: "Diseño Gráfico en Argentina: de qué se trata, dónde estudiar y salida laboral",
    seoDescription:
      "Diseño Gráfico en Argentina: qué vas a estudiar, dónde cursarlo y cómo es la salida laboral. Para mentes creativas que quieren vivir de crear.",
    intro:
      "Para los que no paran de crear: identidad visual, marcas, piezas y todo lo que comunica con imágenes.",
    duration: "4 a 5 años (Licenciatura). También tecnicaturas más cortas.",
    about:
      "El Diseño Gráfico se dedica a comunicar visualmente: logos, identidad de marca, tipografía, editorial, packaging y piezas digitales. Vas a desarrollar el ojo, aprender teoría del color y la forma, manejar herramientas (Illustrator, Photoshop, Figma) y sobre todo a resolver problemas de comunicación con creatividad. Es una carrera muy práctica, con mucho taller y proyectos. Con lo digital, el diseño gráfico se cruza cada vez más con el diseño de interfaces (UX/UI) y el contenido para redes.",
    topics: [
      "Identidad visual y branding",
      "Tipografía",
      "Diseño editorial y packaging",
      "Herramientas digitales (Illustrator, Figma)",
      "Comunicación visual",
    ],
    forYouIf: [
      "Tenés ojo para lo visual y no parás de crear",
      "Querés que lo que imaginás se vuelva real",
      "Te gusta resolver problemas con creatividad",
    ],
    whereToStudy: ["UBA (FADU)", "UP (Palermo)", "UADE", "UCA"],
    jobOutlook:
      "Podés trabajar en agencias, estudios de diseño, empresas (in-house), o de forma freelance e independiente. El diseño digital, la creación de contenidos y el UX/UI ampliaron mucho las oportunidades. El portfolio pesa tanto o más que el título: mostrar buenos trabajos abre puertas rápido.",
    jobRoles: [
      "Diseñador/a gráfico o de marca",
      "Diseñador/a digital / de contenidos",
      "Director/a de arte",
      "Freelance / estudio propio",
    ],
    faqs: [
      {
        q: "¿Necesito saber dibujar?",
        a: "Ayuda, pero no es excluyente. El diseño es más sobre resolver comunicación visual que sobre dibujar a mano.",
      },
      {
        q: "¿Se puede vivir del diseño freelance?",
        a: "Sí, muchos lo hacen. Requiere armar portfolio, clientes y una marca personal, pero es una de las áreas creativas con más salida.",
      },
    ],
  },
  {
    slug: "arquitectura",
    name: "Arquitectura",
    areaCode: "ART",
    seoTitle: "Arquitectura en Argentina: de qué se trata, cuánto dura, dónde estudiar y salida laboral",
    seoDescription:
      "Arquitectura en Argentina: qué vas a estudiar, cuántos años dura, dónde cursarla y cómo es la salida laboral. Creatividad, técnica y espacio en una sola carrera.",
    intro:
      "El cruce entre arte y técnica: diseñar los espacios donde vive, trabaja y se mueve la gente.",
    duration: "5 a 6 años (grado). Es una carrera larga y con mucha carga de taller.",
    about:
      "La Arquitectura combina creatividad, técnica y sensibilidad para diseñar edificios y espacios. Vas a ver diseño (el taller es el corazón de la carrera), estructuras, materiales, historia de la arquitectura, urbanismo y representación. Es una carrera exigente en tiempo: los proyectos de taller demandan muchas horas. Une la parte artística (imaginar y proyectar) con la técnica (que lo que diseñás se pueda construir y se sostenga). Es ideal para mentes creativas que también disfrutan lo concreto.",
    topics: [
      "Diseño arquitectónico (taller)",
      "Estructuras y construcción",
      "Materiales y tecnología",
      "Urbanismo",
      "Historia y representación",
    ],
    forYouIf: [
      "Te gusta crear pero también lo técnico y concreto",
      "Tenés visión espacial y paciencia para los proyectos",
      "Te interesan las ciudades y los espacios",
    ],
    whereToStudy: ["UBA (FADU)", "UP (Palermo)", "UCA", "Universidad de Belgrano"],
    jobOutlook:
      "Podés trabajar en estudios de arquitectura, en obra, en desarrollo inmobiliario, en el diseño de interiores o de forma independiente. Los primeros años suelen ser en estudios o en obra, y la salida depende bastante del mercado de la construcción. Muchos combinan la arquitectura con el diseño, el 3D o el urbanismo.",
    jobRoles: [
      "Arquitecto/a de proyecto o de obra",
      "Diseño de interiores",
      "Desarrollo inmobiliario",
      "Estudio propio / freelance",
    ],
    faqs: [
      {
        q: "¿Es verdad que lleva mucho tiempo?",
        a: "Sí. Los talleres de proyecto demandan muchas horas y es una carrera larga (5-6 años). Requiere organización y aguante.",
      },
      {
        q: "¿Es más artística o más técnica?",
        a: "Las dos cosas. Une el diseño creativo con la técnica constructiva; por eso está a caballo entre el arte y la ingeniería.",
      },
    ],
  },
  {
    slug: "diseno-ux-ui",
    name: "Diseño UX/UI",
    areaCode: "ART",
    seoTitle: "Diseño UX/UI en Argentina: de qué se trata, dónde estudiar y salida laboral",
    seoDescription:
      "Diseño UX/UI en Argentina: qué es, qué vas a aprender, dónde estudiarlo y cómo es la salida laboral. La carrera creativa con una de las mejores demandas digitales.",
    intro:
      "Diseñar cómo se ven y se usan las apps y webs. El área creativa con más demanda del mundo digital.",
    duration: "Tecnicaturas y carreras de 2 a 4 años; también cursos y bootcamps.",
    about:
      "El Diseño UX/UI se ocupa de la experiencia (UX) y la interfaz (UI) de productos digitales: apps, webs y sistemas. UX es investigar y diseñar cómo funciona algo para que sea fácil y agradable de usar; UI es cómo se ve. Vas a aprender investigación de usuarios, arquitectura de información, prototipado, herramientas como Figma y fundamentos visuales. Es un cruce entre diseño, tecnología y psicología del usuario. Al ser un campo muy digital, tiene fuerte demanda y muchas oportunidades de trabajo remoto.",
    topics: [
      "Investigación de usuarios (UX)",
      "Arquitectura de información",
      "Diseño de interfaces (UI)",
      "Prototipado y Figma",
      "Testing de usabilidad",
    ],
    forYouIf: [
      "Te gusta el diseño pero también la tecnología",
      "Te interesa cómo la gente usa las apps",
      "Querés un área creativa con salida y sueldos altos",
    ],
    whereToStudy: ["UP (Palermo)", "UADE", "UBA (FADU, orientaciones)", "Coderhouse / EducaciónIT (cursos)"],
    jobOutlook:
      "Es una de las áreas creativas con mejor salida: empresas de tecnología, agencias, startups y bancos buscan diseñadores UX/UI, muchas veces con opción de trabajo remoto para el exterior y sueldos por encima del promedio del diseño tradicional. El portfolio y los casos reales son claves para entrar.",
    jobRoles: [
      "Diseñador/a UX/UI",
      "UX researcher",
      "Product designer",
      "Freelance para clientes del exterior",
    ],
    faqs: [
      {
        q: "¿Necesito una carrera larga o alcanza con cursos?",
        a: "Se puede entrar por carreras cortas, tecnicaturas o bootcamps. Lo que más pesa a la hora de trabajar es el portfolio.",
      },
      {
        q: "¿UX y UI son lo mismo?",
        a: "No exactamente: UX es cómo funciona y se siente el producto; UI es cómo se ve. Suelen trabajarse juntos y muchos perfiles hacen las dos cosas.",
      },
    ],
  },
];

export function getCareer(slug: string): Career | undefined {
  return CAREERS.find((c) => c.slug === slug);
}

export function careersByArea(areaCode: AreaCode): Career[] {
  return CAREERS.filter((c) => c.areaCode === areaCode);
}
