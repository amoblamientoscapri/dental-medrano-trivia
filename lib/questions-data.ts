import type { Question } from "./types";

// 38 preguntas únicas del docx (deduplicada "Resin Temp C+B", corregida "Resin Duo SE MDP")
export const SEED_QUESTIONS: Question[] = [
  {
    id: "q01",
    text: "¿Cuál es la principal ventaja de BRILLIANT EverGlow de Coltene?",
    options: [
      "Es el composite más económico del mercado",
      "Ofrece un brillo duradero y una estética superior con un solo tono submicro híbrido universal",
      "Solo se usa en dientes posteriores",
    ],
    correctIndex: 1,
  },
  {
    id: "q02",
    text: "¿Qué tipo de composite es BRILLIANT EverGlow?",
    options: [
      "Composite de macropartículas",
      "Submicro híbrido universal",
      "Composite fluido de baja viscosidad",
    ],
    correctIndex: 1,
  },
  {
    id: "q03",
    text: "¿Qué tecnología utiliza BRILLIANT EverGlow para lograr su brillo?",
    options: [
      "Tecnología de microrelleno convencional",
      "Tecnología de partículas submicro híbridas que reflejan la luz de manera uniforme",
      "Solo pigmentos especiales",
    ],
    correctIndex: 1,
  },
  {
    id: "q04",
    text: "¿Para qué tipo de restauraciones se recomienda BRILLIANT EverGlow?",
    options: [
      "Solo restauraciones temporales",
      "Restauraciones anteriores y posteriores directas",
      "Solo carillas de porcelana",
    ],
    correctIndex: 1,
  },
  {
    id: "q05",
    text: "¿Cuál es el relleno principal de BRILLIANT EverGlow?",
    options: [
      "Vidrio de bario y sílice pirogénica",
      "Solo resina acrílica",
      "Cemento de ionómero de vidrio",
    ],
    correctIndex: 0,
  },
  {
    id: "q06",
    text: "¿Cuál es una característica clave de ONE COAT 7 UNIVERSAL de Coltene?",
    options: [
      "Es un adhesivo que solo funciona con técnica de grabado total",
      "Es un adhesivo universal compatible con técnicas de grabado total, autograbado y grabado selectivo",
      "Solo se usa con composites de Coltene",
    ],
    correctIndex: 1,
  },
  {
    id: "q07",
    text: "¿Qué significa que ONE COAT 7 UNIVERSAL sea un adhesivo de 'séptima generación'?",
    options: [
      "Que es un adhesivo antiguo y obsoleto",
      "Que combina múltiples pasos en un solo frasco, simplificando la aplicación",
      "Que requiere 7 pasos para su aplicación",
    ],
    correctIndex: 1,
  },
  {
    id: "q08",
    text: "¿Con qué materiales es compatible ONE COAT 7 UNIVERSAL?",
    options: [
      "Solo con composites",
      "Con composites, cerámica, metales y zirconia",
      "Solo con amalgama",
    ],
    correctIndex: 1,
  },
  {
    id: "q09",
    text: "¿Cuál es la ventaja de la aplicación en una sola capa de ONE COAT 7 UNIVERSAL?",
    options: [
      "Aumenta el tiempo de trabajo",
      "Reduce el tiempo clínico y simplifica el procedimiento",
      "Requiere múltiples capas para ser efectivo",
    ],
    correctIndex: 1,
  },
  {
    id: "q10",
    text: "¿Qué tipo de silicona de impresión es AFFINIS de Coltene?",
    options: [
      "Silicona de condensación",
      "Silicona de adición (polivinilsiloxano)",
      "Alginato de alta precisión",
    ],
    correctIndex: 1,
  },
  {
    id: "q11",
    text: "¿Cuál es una de las principales ventajas de AFFINIS?",
    options: [
      "Es la silicona más barata del mercado",
      "Alta precisión y estabilidad dimensional",
      "Solo se usa en prótesis removibles",
    ],
    correctIndex: 1,
  },
  {
    id: "q12",
    text: "¿Qué tipo de presentación tiene AFFINIS para facilitar su uso?",
    options: [
      "Solo en potes de mezcla manual",
      "Cartuchos automezclables que aseguran una mezcla homogénea",
      "Solo en cápsulas predosificadas",
    ],
    correctIndex: 1,
  },
  {
    id: "q13",
    text: "¿Cuál es la característica principal de AFFINIS en cuanto a su tiempo de trabajo?",
    options: [
      "Tiene un tiempo de trabajo muy largo sin control",
      "Ofrece un tiempo de trabajo adecuado con un fraguado rápido y predecible",
      "Requiere más de 10 minutos de fraguado",
    ],
    correctIndex: 1,
  },
  {
    id: "q14",
    text: "¿Para qué se recomienda el uso de AFFINIS en odontología?",
    options: [
      "Solo para impresiones de ortodoncia",
      "Para impresiones de alta precisión en prótesis fija, implantes y rehabilitaciones",
      "Solo para registros de mordida simples",
    ],
    correctIndex: 1,
  },
  {
    id: "q15",
    text: "¿Qué es ParaCore de Coltene?",
    options: [
      "Un composite para restauraciones estéticas anteriores",
      "Un material de reconstrucción de muñones (core build-up) dual",
      "Un cemento temporal",
    ],
    correctIndex: 1,
  },
  {
    id: "q16",
    text: "¿Cuál es la principal ventaja del sistema de mezcla de ParaCore?",
    options: [
      "Requiere mezcla manual con espátula",
      "Tiene un sistema de automezclado que garantiza una proporción exacta y elimina burbujas",
      "Se mezcla a mano con un pincel",
    ],
    correctIndex: 1,
  },
  {
    id: "q17",
    text: "¿Para qué casos clínicos se indica ParaCore?",
    options: [
      "Solo para restauraciones temporales",
      "Para reconstrucción de muñones sobre dientes vitales y no vitales, y con postes",
      "Solo para sellado de fisuras",
    ],
    correctIndex: 1,
  },
  {
    id: "q18",
    text: "¿Cuál es una característica clave de la resistencia de ParaCore?",
    options: [
      "Es un material débil y flexible",
      "Ofrece alta resistencia a la compresión y flexión, similar a la dentina",
      "Solo resiste cargas en dientes anteriores",
    ],
    correctIndex: 1,
  },
  {
    id: "q19",
    text: "¿Qué es el componente DENSELL Core dentro de los composites de Densell?",
    options: [
      "Un composite para muñones de baja resistencia",
      "Un composite de reconstrucción de muñones de alta resistencia con curado dual",
      "Un material de impresión",
    ],
    correctIndex: 1,
  },
  {
    id: "q20",
    text: "¿Cuál es la principal característica del composite DENSELL Esthetic Fill?",
    options: [
      "Es un composite solo para dientes posteriores",
      "Es un composite de nanopartículas para restauraciones estéticas de alta resistencia",
      "Es un material temporal",
    ],
    correctIndex: 1,
  },
  {
    id: "q21",
    text: "¿Qué diferencia al DENSELL Flow del resto de los composites Densell?",
    options: [
      "Tiene mayor viscosidad",
      "Es un composite fluido de baja viscosidad ideal para áreas de difícil acceso",
      "No es fotopolimerizable",
    ],
    correctIndex: 1,
  },
  {
    id: "q22",
    text: "¿Cuál es la ventaja principal de DENSELL HDC (High Density Composite)?",
    options: [
      "Es de baja resistencia al desgaste",
      "Es un composite de alta densidad ideal para restauraciones posteriores sometidas a altas cargas oclusales",
      "Solo se usa para dientes anteriores",
    ],
    correctIndex: 1,
  },
  {
    id: "q23",
    text: "¿Cuál es la particularidad del adhesivo DENSELL SE Bond?",
    options: [
      "Requiere grabado ácido previo obligatorio",
      "Es un adhesivo autograbante que simplifica los pasos clínicos",
      "Solo se puede usar con composites Densell",
    ],
    correctIndex: 1,
  },
  {
    id: "q24",
    text: "¿Para qué se utiliza DENSELL Pit & Fissure Sealant?",
    options: [
      "Para restauraciones de cavidades profundas",
      "Para el sellado de fosas y fisuras como medida preventiva contra caries",
      "Para cementar prótesis fija",
    ],
    correctIndex: 1,
  },
  {
    id: "q25",
    text: "¿Cuál es la principal aplicación de Resin Temp C+B de Densell?",
    options: [
      "Restauraciones permanentes de alta estética",
      "Elaboración de coronas y puentes provisionales",
      "Cementación de brackets de ortodoncia",
    ],
    correctIndex: 1,
  },
  {
    id: "q26",
    text: "¿Qué tipo de curado tiene Resin Temp C+B?",
    options: [
      "Solo fotopolimerizable",
      "Autopolimerizable (curado químico)",
      "Solo curado por calor",
    ],
    correctIndex: 1,
  },
  {
    id: "q27",
    text: "¿Qué es DENSELL Glass Ionomer Cement?",
    options: [
      "Un composite estético de nanopartículas",
      "Un cemento de ionómero de vidrio para cementación y restauraciones",
      "Un material de impresión",
    ],
    correctIndex: 1,
  },
  {
    id: "q28",
    text: "¿Cuál es una ventaja del ionómero de vidrio DENSELL?",
    options: [
      "No libera flúor",
      "Libera flúor, contribuyendo a la protección contra caries",
      "Solo se usa en odontopediatría",
    ],
    correctIndex: 1,
  },
  {
    id: "q29",
    text: "¿Cuál es la función de DENSELL Etch Gel?",
    options: [
      "Cementar restauraciones indirectas",
      "Grabado ácido del esmalte y/o dentina para mejorar la adhesión",
      "Blanqueamiento dental",
    ],
    correctIndex: 1,
  },
  {
    id: "q30",
    text: "¿Qué concentración de ácido fosfórico tiene DENSELL Etch Gel?",
    options: [
      "10%",
      "37%",
      "50%",
    ],
    correctIndex: 1,
  },
  {
    id: "q31",
    text: "¿Qué función cumple el Densell Desensitizer?",
    options: [
      "Blanqueamiento dental",
      "Reducir la sensibilidad dentinaria post-operatoria",
      "Grabar el esmalte dental",
    ],
    correctIndex: 1,
  },
  {
    id: "q32",
    text: "¿Para qué se utiliza Resin Duo SE MDP de Densell?",
    options: [
      "Para restauraciones temporales",
      "Es un cemento resinoso dual con MDP para cementar restauraciones indirectas de cerámica, metal y zirconia",
      "Cemento resinoso autopolimerizable",
    ],
    correctIndex: 1,
  },
  {
    id: "q33",
    text: "¿Cuál es una ventaja de BRILLIANT Crios de Coltene?",
    options: [
      "Es un bloque cerámico puro para CAD/CAM",
      "Es un bloque de composite reforzado con cerámica submicro híbrida, ideal para CAD/CAM con alta resistencia y estética",
      "Solo se usa para carillas",
    ],
    correctIndex: 1,
  },
  {
    id: "q34",
    text: "¿Cuál es la ventaja de CanalPro Jel de Coltene?",
    options: [
      "Es un irrigante a base de hipoclorito de sodio",
      "Es un quelante a base de EDTA que facilita la preparación del conducto radicular",
      "Es un material de obturación endodóntica",
    ],
    correctIndex: 1,
  },
  {
    id: "q35",
    text: "¿Qué producto de Coltene se usa como solución irrigadora para el conducto radicular?",
    options: [
      "CanalPro Jel",
      "CanalPro NaOCl (hipoclorito de sodio)",
      "ParaCore",
    ],
    correctIndex: 1,
  },
  {
    id: "q36",
    text: "¿Cuál es la indicación principal de los postes de fibra de vidrio DENSELL?",
    options: [
      "Restauraciones temporales",
      "Retención intrarradicular en dientes endodónticamente tratados",
      "Ferulización de dientes móviles",
    ],
    correctIndex: 1,
  },
  {
    id: "q37",
    text: "¿Qué tipo de curado tiene el cemento resinoso DENSELL Resin Duo?",
    options: [
      "Solo fotopolimerizable",
      "Curado dual (foto + autopolimerizable)",
      "Solo autocurado",
    ],
    correctIndex: 1,
  },
  {
    id: "q38",
    text: "¿Cuál es la ventaja de utilizar composites nanohíbridos como DENSELL Esthetic Fill?",
    options: [
      "Menor resistencia al desgaste",
      "Excelente pulido, alta resistencia y resultado estético superior",
      "Solo están disponibles en un color",
    ],
    correctIndex: 1,
  },
];
