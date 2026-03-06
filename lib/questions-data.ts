import type { Question } from "./types";

// 39 preguntas del docx oficial "Juego Densell / Dental Medrano – 50 preguntas"
// Deduplicada: "Resin Temp C+B" (aparece 2 veces idéntica) → queda 1
// Corregida: "Resin Duo SE MDP" opción C cortada → completada
export const SEED_QUESTIONS: Question[] = [
  {
    id: "q01",
    text: "¿Qué propiedad permite que un ácido grabador no se desplace fácilmente?",
    options: ["Radiopacidad", "Tixotropía", "Elasticidad"],
    correctIndex: 1,
  },
  {
    id: "q02",
    text: "¿Qué concentración es más común en ácido grabador dental?",
    options: ["10%", "25%", "37%"],
    correctIndex: 2,
  },
  {
    id: "q03",
    text: "¿Qué material tiene mayor estabilidad dimensional?",
    options: [
      "Alginato",
      "Silicona por condensación",
      "Silicona por adición",
    ],
    correctIndex: 2,
  },
  {
    id: "q04",
    text: "¿Qué material se endurece por reacción química?",
    options: ["Resina dual", "Silicona por adición", "Yeso dental"],
    correctIndex: 2,
  },
  {
    id: "q05",
    text: "¿Qué material es rígido una vez fraguado?",
    options: ["Yeso dental", "Silicona", "Alginato"],
    correctIndex: 0,
  },
  {
    id: "q06",
    text: "¿Qué propiedad evita deformaciones?",
    options: ["Estabilidad dimensional", "Elasticidad", "Tixotropía"],
    correctIndex: 0,
  },
  {
    id: "q07",
    text: "¿Qué reduce la contracción de polimerización?",
    options: [
      "Incrementos pequeños",
      "Incrementos grandes",
      "Polimerización rápida",
    ],
    correctIndex: 0,
  },
  {
    id: "q08",
    text: "¿Qué propiedad mejora la resistencia?",
    options: [
      "Alto contenido de carga",
      "Bajo contenido de carga",
      "Alta translucidez",
    ],
    correctIndex: 0,
  },
  {
    id: "q09",
    text: "¿Qué tipo de composite es BRILLIANT EverGlow?",
    options: [
      "Micro híbrido",
      "Nanohíbrido universal",
      "Híbrido submicrónico",
    ],
    correctIndex: 2,
  },
  {
    id: "q10",
    text: "¿Cuál es una ventaja principal de BRILLIANT EverGlow?",
    options: [
      "Baja resistencia",
      "Excelente pulido y estética duradera",
      "Gran variedad de tonos",
    ],
    correctIndex: 1,
  },
  {
    id: "q11",
    text: "¿Qué permite lograr una estética natural con EverGlow?",
    options: [
      "Sistema Duo Shade de Coltene",
      "Gran variedad de tonos – Sistema Amplio",
      "Alta translucidez",
    ],
    correctIndex: 0,
  },
  {
    id: "q12",
    text: "¿Qué ventaja tiene el sistema Duo Shade?",
    options: [
      "Reduce el tiempo de selección de color",
      "Mayor variedad de tonos con menos jeringas",
      "Reduce la resistencia",
    ],
    correctIndex: 0,
  },
  {
    id: "q13",
    text: "¿Qué diferencia EverX Flow de otras flow?",
    options: [
      "Fibras cortas de refuerzo",
      "Alta carga de relleno",
      "Vidrios dentales",
    ],
    correctIndex: 0,
  },
  {
    id: "q14",
    text: "¿Cuál es el beneficio principal de EverX Flow?",
    options: ["Mayor refuerzo", "Menor contracción", "Uso fácil"],
    correctIndex: 0,
  },
  {
    id: "q15",
    text: "¿Dónde se utiliza EverX Flow?",
    options: [
      "Como base en restauraciones posteriores grandes",
      "Solo en restauraciones anteriores",
      "Solo provisionales",
    ],
    correctIndex: 0,
  },
  {
    id: "q16",
    text: "¿Qué característica facilita el esculpido?",
    options: ["Consistencia equilibrada", "Alta fluidez", "Fragilidad"],
    correctIndex: 0,
  },
  {
    id: "q17",
    text: "¿Qué ventaja tiene EverGlow en restauraciones anteriores?",
    options: [
      "Excelente estética y durabilidad",
      "Alto brillo",
      "Resistencia",
    ],
    correctIndex: 0,
  },
  {
    id: "q18",
    text: "¿Qué ventaja tiene EverGlow en posteriores?",
    options: [
      "Alta resistencia mecánica",
      "Alto brillo",
      "Mínimo desgaste",
    ],
    correctIndex: 0,
  },
  {
    id: "q19",
    text: "¿Qué tiene EverGlow que permite lograr restauraciones biomiméticas?",
    options: [
      "Sistema de color simplificado Duo Shade",
      "Un solo color universal",
      "Buena translucidez",
    ],
    correctIndex: 0,
  },
  {
    id: "q20",
    text: "¿Qué tipo de composite es EverX Flow?",
    options: [
      "Composite reforzado con fibras de vidrio",
      "Composite temporario",
      "Composite reforzado con fibras de polietileno",
    ],
    correctIndex: 0,
  },
  {
    id: "q21",
    text: "¿Qué mejora la estética final en una restauración de composite?",
    options: [
      "Buen pulido y acabado",
      "Técnica de estratificación",
      "Adhesión",
    ],
    correctIndex: 0,
  },
  {
    id: "q22",
    text: "¿Qué composite Coltene se usa para restauraciones universales?",
    options: ["BRILLIANT EverGlow", "EverX Flow", "ParaCore"],
    correctIndex: 0,
  },
  {
    id: "q23",
    text: "¿Qué tipo de silicona es President de Coltene?",
    options: [
      "Silicona por adición",
      "Silicona por condensación",
      "Material de impresión",
    ],
    correctIndex: 0,
  },
  {
    id: "q24",
    text: "¿Cuál es una ventaja principal de President?",
    options: [
      "Precisión",
      "Alta estabilidad dimensional",
      "Módulo elástico alto",
    ],
    correctIndex: 1,
  },
  {
    id: "q25",
    text: "¿Qué diferencia tiene FlexiDam con otras gomas?",
    options: [
      "Alta elasticidad y resistencia al desgarro",
      "De silicona y libre de látex",
      "Es violeta",
    ],
    correctIndex: 0,
  },
  {
    id: "q26",
    text: "¿Qué es HySolate?",
    options: [
      "Sistema de composite completo",
      "Sistema de aislamiento dental completo",
      "Sistema de silicona completo",
    ],
    correctIndex: 1,
  },
  {
    id: "q27",
    text: "¿Qué característica diferencial tienen los Clamps Fiesta?",
    options: [
      "Código de colores para fácil identificación",
      "Acabado mate",
      "Acero inoxidable de alta concentración",
    ],
    correctIndex: 0,
  },
  {
    id: "q28",
    text: "¿Qué mejora el uso de FlexiDam?",
    options: [
      "Control de humedad y adhesión",
      "Control del campo operatorio",
      "Mayor capacidad de aislamiento",
    ],
    correctIndex: 1,
  },
  {
    id: "q29",
    text: "¿Qué característica diferencia al Restaurador Temporario Densell de un material con eugenol?",
    options: [
      "No interfiere con la polimerización de resinas",
      "Libera flúor de forma sostenida",
      "Requiere grabado ácido previo",
    ],
    correctIndex: 0,
  },
  {
    id: "q30",
    text: "¿Por qué el Acondicionador para Ionómero Densell se aplica antes del ionómero?",
    options: [
      "Para aumentar la retención mecánica",
      "Para remover el smear layer superficial",
      "Para generar adhesión química inmediata",
    ],
    correctIndex: 1,
  },
  {
    id: "q31",
    text: "¿En qué situación clínica sería más adecuado usar Cemento Resin Duo Avio Densell?",
    options: [
      "Cementación de restauraciones indirectas cuando se requiere polimerización dual",
      "Base cavitaria bajo amalgama",
      "Sellado temporario de acceso endodóntico",
    ],
    correctIndex: 0,
  },
  {
    id: "q32",
    text: "¿Cuál es la función específica del Detector de Caries Densell?",
    options: [
      "Pigmentar esmalte desmineralizado",
      "Identificar dentina infectada para su remoción selectiva",
      "Evaluar microfiltración marginal",
    ],
    correctIndex: 1,
  },
  {
    id: "q33",
    text: "¿Por qué el uso de Eugenol Puro Densell debe evitarse antes de una restauración con resina?",
    options: [
      "Puede generar sensibilidad postoperatoria",
      "Inhibe la polimerización de materiales resinosos",
      "Disminuye la adhesión del ionómero",
    ],
    correctIndex: 1,
  },
  {
    id: "q34",
    text: "¿Qué tipo de resina es la resina Hybrilux Nano de Densell?",
    options: ["Submicrónica", "Nano híbrida", "Nano particulada"],
    correctIndex: 1,
  },
  {
    id: "q35",
    text: "El ácido grabador Densell tiene...",
    options: [
      "Dos viscosidades distintas",
      "Tres viscosidades distintas",
      "Una viscosidad y dos colores distintos",
    ],
    correctIndex: 1,
  },
  {
    id: "q36",
    text: "¿Qué tipo de producto es el Resin Temp C+B Densell?",
    options: ["Acrílico temporario", "Resina bisacrílica", "Composite"],
    correctIndex: 1,
  },
  {
    id: "q37",
    text: "¿Qué tipo de producto es el Resin Duo Core de Densell?",
    options: [
      "Cemento resinoso autoadhesivo",
      "Cemento y reconstructor resinoso dual",
      "Cemento resinoso fotopolimerizable",
    ],
    correctIndex: 1,
  },
  {
    id: "q38",
    text: "¿Qué tipo de producto es el Resin Duo SE MDP de Densell?",
    options: [
      "Cemento resinoso LC",
      "Cemento resinoso dual autograbante autoadhesivo",
      "Cemento resinoso autopolimerizable",
    ],
    correctIndex: 1,
  },
];
