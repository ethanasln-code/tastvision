/* =========================================================================
   MangoIA — Base de datos de RECETAS COMPLETAS
   Este archivo es compartido por scanner.html (modal "Ver receta completa")
   y por receta.html (página que abre el código QR desde el celular).

   Para añadir o editar una receta, solo modifiquen el objeto correspondiente
   dentro de RECETAS_DB. Cada receta necesita un "id" único (la llave del
   objeto) que es el mismo que usa RIPENESS_INFO.recetaIds en script.js.
   ========================================================================= */

window.RECETAS_DB = {

  /* ================= MANGO VERDE — sabor ácido ================= */
  v1: {
    id: "v1",
    categoria: "verde",
    colorCategoria: "#4CAF50",
    tipoIlustracion: "botana",
    emoji: "🥭🍋",
    titulo: "Ceviche de mango verde con cebolla morada y limón",
    descripcion: "Un antojito fresco y ácido, ideal para un día caluroso. El mango verde aporta firmeza y acidez natural, similar a la del limón.",
    tiempo: "15 min",
    porciones: 4,
    dificultad: "Fácil",
    ingredientes: [
      { cantidad: "2", unidad: "unidades", nombre: "Mangos verdes, pelados y en cubos pequeños" },
      { cantidad: "1/2", unidad: "unidad", nombre: "Cebolla morada, en juliana fina" },
      { cantidad: "4", unidad: "unidades", nombre: "Limones (el jugo)" },
      { cantidad: "1", unidad: "unidad", nombre: "Chile picante fresco, picado (opcional)" },
      { cantidad: "2", unidad: "cdas", nombre: "Cilantro fresco picado" },
      { cantidad: "1/2", unidad: "cdta", nombre: "Sal" },
      { cantidad: "1", unidad: "pizca", nombre: "Pimienta negra" }
    ],
    utensilios: ["Cuchillo", "Tabla de cortar", "Bol grande", "Exprimidor de limones", "Cuchara para mezclar"],
    pasos: [
      "Lavar y pelar los mangos verdes; cortarlos en cubos pequeños y uniformes.",
      "Cortar la cebolla morada en juliana muy fina para que suelte su sabor rápido.",
      "Exprimir los limones directamente sobre el mango en un bol grande.",
      "Añadir la cebolla, el chile picado y el cilantro.",
      "Sazonar con sal y pimienta, mezclar bien con la cuchara.",
      "Dejar reposar en refrigeración 10 minutos para que se integren los sabores antes de servir."
    ],
    notas: "Se puede acompañar con totopos o galletas saladas."
  },

  v2: {
    id: "v2",
    categoria: "verde",
    colorCategoria: "#4CAF50",
    tipoIlustracion: "ensalada",
    emoji: "🥗",
    titulo: "Ensalada thai de mango verde rallado",
    descripcion: "Inspirada en la clásica 'som tam' tailandesa, combina el mango verde rallado con sabores dulces, salados y picantes.",
    tiempo: "20 min",
    porciones: 3,
    dificultad: "Media",
    ingredientes: [
      { cantidad: "2", unidad: "unidades", nombre: "Mangos verdes, pelados y rallados en tiras finas" },
      { cantidad: "1", unidad: "unidad", nombre: "Zanahoria, rallada" },
      { cantidad: "2", unidad: "cdas", nombre: "Maní tostado, picado" },
      { cantidad: "2", unidad: "cdas", nombre: "Salsa de pescado (o salsa de soya)" },
      { cantidad: "1", unidad: "cda", nombre: "Azúcar morena" },
      { cantidad: "2", unidad: "unidades", nombre: "Limones (el jugo)" },
      { cantidad: "1", unidad: "unidad", nombre: "Chile picante, picado finamente" },
      { cantidad: "2", unidad: "cdas", nombre: "Cilantro fresco picado" }
    ],
    utensilios: ["Rallador o mandolina", "Bol grande", "Tabla de cortar", "Cuchillo", "Mortero (opcional)"],
    pasos: [
      "Rallar el mango verde y la zanahoria en tiras finas y colocarlos en un bol grande.",
      "En un recipiente aparte, mezclar la salsa de pescado, el azúcar morena y el jugo de limón hasta disolver el azúcar.",
      "Verter el aderezo sobre el mango y la zanahoria, y mezclar bien.",
      "Añadir el chile picado y una parte del maní, integrando con las manos o una cuchara.",
      "Servir en un plato y decorar con el cilantro y el maní restante."
    ],
    notas: "Si se prefiere sin picante, se puede omitir el chile o reducir la cantidad."
  },

  v3: {
    id: "v3",
    categoria: "verde",
    colorCategoria: "#4CAF50",
    tipoIlustracion: "conserva",
    emoji: "🫙",
    titulo: "Mango verde encurtido con sal y chile",
    descripcion: "Una preparación tradicional para conservar el mango verde y disfrutarlo como botana ácida y picante.",
    tiempo: "10 min de preparación + 24 h de reposo",
    porciones: 6,
    dificultad: "Fácil",
    ingredientes: [
      { cantidad: "3", unidad: "unidades", nombre: "Mangos verdes, pelados y en tiras o cubos" },
      { cantidad: "2", unidad: "cdas", nombre: "Sal" },
      { cantidad: "1", unidad: "cdta", nombre: "Chile en polvo" },
      { cantidad: "1", unidad: "unidad", nombre: "Limón (el jugo)" },
      { cantidad: "1", unidad: "taza", nombre: "Agua" }
    ],
    utensilios: ["Cuchillo", "Tabla de cortar", "Frasco de vidrio con tapa", "Cuchara"],
    pasos: [
      "Cortar el mango verde en tiras o cubos y colocarlo dentro del frasco de vidrio.",
      "Disolver la sal en el agua y verterla sobre el mango hasta cubrirlo.",
      "Añadir el chile en polvo y el jugo de limón.",
      "Cerrar el frasco y refrigerar durante 24 horas antes de consumir, agitando ocasionalmente.",
      "Servir bien frío como botana o acompañamiento."
    ],
    notas: "Se conserva en refrigeración hasta por una semana."
  },

  /* ================= MANGO MADURO — sabor agridulce ================= */
  m1: {
    id: "m1",
    categoria: "maduro",
    colorCategoria: "#FFC727",
    tipoIlustracion: "ensalada",
    emoji: "🧀",
    titulo: "Ensalada de mango maduro con queso fresco",
    descripcion: "El equilibrio entre el dulzor del mango maduro y lo salado del queso fresco la convierte en una entrada refrescante.",
    tiempo: "12 min",
    porciones: 4,
    dificultad: "Fácil",
    ingredientes: [
      { cantidad: "2", unidad: "unidades", nombre: "Mangos maduros, pelados y en cubos" },
      { cantidad: "150", unidad: "g", nombre: "Queso fresco, en cubos" },
      { cantidad: "1", unidad: "puñado", nombre: "Hojas de lechuga o rúcula" },
      { cantidad: "2", unidad: "cdas", nombre: "Aceite de oliva" },
      { cantidad: "1", unidad: "unidad", nombre: "Limón (el jugo)" },
      { cantidad: "1", unidad: "pizca", nombre: "Sal" }
    ],
    utensilios: ["Cuchillo", "Tabla de cortar", "Bol grande", "Plato para servir"],
    pasos: [
      "Colocar las hojas de lechuga o rúcula como base en un plato grande.",
      "Distribuir encima los cubos de mango maduro y el queso fresco.",
      "Mezclar el aceite de oliva con el jugo de limón y una pizca de sal para el aderezo.",
      "Rociar el aderezo sobre la ensalada justo antes de servir."
    ],
    notas: "Se le puede añadir nueces o almendras tostadas para más textura."
  },

  m2: {
    id: "m2",
    categoria: "maduro",
    colorCategoria: "#FFC727",
    tipoIlustracion: "bebida",
    emoji: "🥤",
    titulo: "Smoothie de mango y yogur natural",
    descripcion: "Una bebida cremosa y nutritiva, perfecta para el desayuno o como refrigerio de media tarde.",
    tiempo: "8 min",
    porciones: 2,
    dificultad: "Fácil",
    ingredientes: [
      { cantidad: "2", unidad: "unidades", nombre: "Mangos maduros, pelados y troceados" },
      { cantidad: "1", unidad: "taza", nombre: "Yogur natural" },
      { cantidad: "1/2", unidad: "taza", nombre: "Leche (o bebida vegetal)" },
      { cantidad: "1", unidad: "cda", nombre: "Miel (opcional)" },
      { cantidad: "4", unidad: "unidades", nombre: "Cubos de hielo" }
    ],
    utensilios: ["Licuadora", "Cuchillo", "Tabla de cortar", "Vasos para servir"],
    pasos: [
      "Colocar el mango troceado, el yogur y la leche en la licuadora.",
      "Añadir la miel si se desea un sabor más dulce.",
      "Agregar el hielo y licuar hasta obtener una mezcla homogénea y cremosa.",
      "Servir de inmediato en vasos fríos."
    ],
    notas: "Se puede sustituir el yogur por leche de coco para una versión sin lácteos."
  },

  m3: {
    id: "m3",
    categoria: "maduro",
    colorCategoria: "#FFC727",
    tipoIlustracion: "botana",
    emoji: "🌶️",
    titulo: "Mango maduro con chile en polvo y limón",
    descripcion: "Una botana clásica y sencilla que resalta el contraste entre el dulce del mango y el picor del chile.",
    tiempo: "5 min",
    porciones: 2,
    dificultad: "Fácil",
    ingredientes: [
      { cantidad: "2", unidad: "unidades", nombre: "Mangos maduros, pelados y en rodajas o cubos" },
      { cantidad: "1", unidad: "cdta", nombre: "Chile en polvo o chile-limón en polvo" },
      { cantidad: "1", unidad: "unidad", nombre: "Limón (el jugo)" },
      { cantidad: "1", unidad: "pizca", nombre: "Sal" }
    ],
    utensilios: ["Cuchillo", "Tabla de cortar", "Plato para servir"],
    pasos: [
      "Pelar y cortar el mango maduro en rodajas o cubos.",
      "Acomodar las piezas de mango en un plato.",
      "Rociar el jugo de limón por encima.",
      "Espolvorear el chile en polvo y una pizca de sal antes de servir."
    ],
    notas: "Ideal para servir bien frío en un día caluroso."
  },

  /* ================= MANGO SOBREMADURO — sabor dulce ================= */
  s1: {
    id: "s1",
    categoria: "sobremaduro",
    colorCategoria: "#FF8A3D",
    tipoIlustracion: "bebida",
    emoji: "🧉",
    titulo: "Batido dulce de mango sobremaduro",
    descripcion: "Aprovecha al máximo la pulpa suave y muy dulce del mango sobremaduro en un batido espeso y reconfortante.",
    tiempo: "8 min",
    porciones: 2,
    dificultad: "Fácil",
    ingredientes: [
      { cantidad: "2", unidad: "unidades", nombre: "Mangos sobremaduros, pelados y sin semilla" },
      { cantidad: "1", unidad: "taza", nombre: "Leche fría (o bebida vegetal)" },
      { cantidad: "1", unidad: "cda", nombre: "Azúcar (opcional, al gusto)" },
      { cantidad: "4", unidad: "unidades", nombre: "Cubos de hielo" }
    ],
    utensilios: ["Licuadora", "Cuchillo", "Vasos para servir"],
    pasos: [
      "Retirar la pulpa del mango sobremaduro con una cuchara, ya que se separa fácilmente de la cáscara.",
      "Colocar la pulpa en la licuadora junto con la leche.",
      "Probar y añadir azúcar solo si se desea más dulzor (el mango sobremaduro ya es muy dulce).",
      "Agregar el hielo y licuar hasta que quede espumoso.",
      "Servir de inmediato."
    ],
    notas: "Perfecto para aprovechar mangos que ya están demasiado blandos para comer en trozos."
  },

  s2: {
    id: "s2",
    categoria: "sobremaduro",
    colorCategoria: "#FF8A3D",
    tipoIlustracion: "conserva",
    emoji: "🍯",
    titulo: "Mermelada artesanal de mango",
    descripcion: "Una forma deliciosa de conservar el mango sobremaduro por más tiempo, ideal para untar en pan o mezclar con yogur.",
    tiempo: "40 min",
    porciones: 8,
    dificultad: "Media",
    ingredientes: [
      { cantidad: "4", unidad: "unidades", nombre: "Mangos sobremaduros, pelados y en trozos" },
      { cantidad: "1/2", unidad: "taza", nombre: "Azúcar" },
      { cantidad: "2", unidad: "cdas", nombre: "Jugo de limón" },
      { cantidad: "1/4", unidad: "taza", nombre: "Agua" }
    ],
    utensilios: ["Olla mediana", "Cuchara de madera", "Licuadora o prensapurés", "Frasco de vidrio esterilizado"],
    pasos: [
      "Colocar los trozos de mango, el azúcar, el jugo de limón y el agua en una olla mediana.",
      "Cocinar a fuego medio, revolviendo con frecuencia, hasta que el mango se ablande por completo (unos 20 minutos).",
      "Triturar la mezcla con una licuadora o prensapurés hasta lograr una consistencia uniforme.",
      "Volver a cocinar a fuego bajo durante 10-15 minutos más, revolviendo, hasta que espese.",
      "Verter caliente en el frasco de vidrio esterilizado y dejar enfriar antes de refrigerar."
    ],
    notas: "Se conserva refrigerada hasta por 3 semanas en un frasco bien cerrado."
  },

  s3: {
    id: "s3",
    categoria: "sobremaduro",
    colorCategoria: "#FF8A3D",
    tipoIlustracion: "postre",
    emoji: "🍨",
    titulo: "Helado casero de mango",
    descripcion: "Un postre cremoso y refrescante que aprovecha el dulzor natural del mango sobremaduro, sin necesidad de máquina de helados.",
    tiempo: "15 min de preparación + 6 h de congelación",
    porciones: 4,
    dificultad: "Media",
    ingredientes: [
      { cantidad: "3", unidad: "unidades", nombre: "Mangos sobremaduros, pelados y sin semilla" },
      { cantidad: "1", unidad: "taza", nombre: "Crema para batir (o crema de coco)" },
      { cantidad: "3", unidad: "cdas", nombre: "Leche condensada" },
      { cantidad: "1", unidad: "cdta", nombre: "Jugo de limón" }
    ],
    utensilios: ["Licuadora", "Batidor de mano o batidora eléctrica", "Bol grande", "Recipiente apto para congelador con tapa"],
    pasos: [
      "Licuar la pulpa del mango sobremaduro con el jugo de limón hasta obtener un puré liso.",
      "Batir la crema para batir en un bol aparte hasta que forme picos suaves.",
      "Incorporar la leche condensada y el puré de mango a la crema batida, mezclando con movimientos envolventes.",
      "Verter la mezcla en el recipiente apto para congelador.",
      "Congelar al menos 6 horas, o hasta que esté firme, antes de servir."
    ],
    notas: "Para una textura más suave, remover la mezcla cada 1-2 horas durante las primeras horas de congelación."
  }

};
