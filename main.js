// ==========================================================
// 1. Declaración de Variables, Constantes y Arrays
// ==========================================================

// Constantes
const NOMBRE_TIENDA = "Vintage Sound 🎶";
const IVA_PORCENTAJE = 0.21; // 21% de IVA
const SALTO_LINEA = "\n"; // Constante para saltos de línea en Alerts/Prompts

// Array de Objetos (Simulación del catálogo de instrumentos)
const CATALAGO_INSTRUMENTOS = [
  { id: 1, nombre: "Guitarra Eléctrica Fender Squier Strat", precio: 350 },
  { id: 2, nombre: "Bajo Eléctrico Ibanez SR300", precio: 480 },
  { id: 3, nombre: "Batería Acústica Pearl Roadshow", precio: 720 },
  { id: 4, nombre: "Guitarra Clásica Yamaha C40", precio: 150 },
  { id: 5, nombre: "Pedal Distorsión Boss DS-1", precio: 85 },
];

// Variables
let carrito = []; // Array para almacenar los IDs de los productos seleccionados
let subtotalCompra = 0;
let nombreUsuario = "";

// ==========================================================
// 2. Funciones (Entrada, Procesamiento y Salida)
// ==========================================================

/**
 * FUNCIÓN 1: Entrada de datos (Solicitar nombre y saludar)
 */
function solicitarNombre() {
  console.log("--- INICIO DE SIMULACIÓN ---");
  // Uso de Prompt para entrada de datos
  nombreUsuario = prompt(
    `¡Bienvenido a ${NOMBRE_TIENDA}!\nLa tienda de instrumentos usados con el mejor sonido.\n\nPor favor, ingresa tu nombre para comenzar:`
  );

  if (nombreUsuario && nombreUsuario.trim() !== "") {
    nombreUsuario = nombreUsuario.trim();
    // Uso de Alert y concatenación
    alert(
      `¡Hola, ${nombreUsuario}!\nEstás a punto de simular una compra.\nRecuerda revisar la Consola (F12) para ver el catálogo.`
    );
    console.log(`Usuario: ${nombreUsuario} ha iniciado la simulación.`);
  } else {
    nombreUsuario = "Invitado";
    alert(
      `¡Hola, ${nombreUsuario}!\nEstás a punto de simular una compra.\nRecuerda revisar la Consola (F12) para ver el catálogo.`
    );
    console.log(
      `Usuario: ${nombreUsuario} (Anónimo) ha iniciado la simulación.`
    );
  }
}

/**
 * FUNCIÓN 2: Procesamiento de datos (Mostrar catálogo y agregar al carrito)
 * Utiliza ciclos de iteración y condicionales.
 */
function simularCompra() {
  let seguirComprando = true;

  // Condicional inicial para verificar que el catálogo no esté vacío
  if (CATALAGO_INSTRUMENTOS.length === 0) {
    alert("Lo sentimos, no hay instrumentos disponibles en este momento.");
    console.warn("Catálogo vacío. Fin de la simulación.");
    return;
  }

  // Muestra el catálogo en la consola
  console.log("==========================================");
  console.log(`Catálogo de Instrumentos Usados de ${NOMBRE_TIENDA}`);
  console.log("==========================================");

  // Ciclo de iteración (for...of) para mostrar productos en consola
  for (const producto of CATALAGO_INSTRUMENTOS) {
    console.log(
      `ID: ${producto.id} | Nombre: ${producto.nombre} | Precio: $${producto.precio}`
    );
  }
  console.log("==========================================");

  // Ciclo de iteración (while) para la interacción de compra
  while (seguirComprando) {
    let mensajePrompt = `CATÁLOGO DISPONIBLE (Ingresa el ID del producto):\n${SALTO_LINEA}`;

    // Construcción dinámica del mensaje del Prompt
    for (const producto of CATALAGO_INSTRUMENTOS) {
      mensajePrompt += `[ID ${producto.id}] ${producto.nombre} - $${producto.precio}${SALTO_LINEA}`;
    }
    mensajePrompt += `${SALTO_LINEA}Ingresa 'FIN' para terminar la compra.`;

    let inputUsuario = prompt(mensajePrompt);

    // Condicional para verificar si el usuario quiere terminar
    if (inputUsuario === null || inputUsuario.toUpperCase() === "FIN") {
      seguirComprando = false;
      break;
    }

    // Conversión a número
    let idSeleccionado = parseInt(inputUsuario);

    // Condicional para validar la entrada (número válido y existente)
    const productoEncontrado = CATALAGO_INSTRUMENTOS.find(
      (p) => p.id === idSeleccionado
    );

    if (productoEncontrado) {
      carrito.push(idSeleccionado); // Almacena el ID
      subtotalCompra += productoEncontrado.precio; // Suma al subtotal

      // Uso de Alert con concatenación
      alert(
        `✅ ¡Producto agregado! ${productoEncontrado.nombre} ($${productoEncontrado.precio}).${SALTO_LINEA}Subtotal actual: $${subtotalCompra}`
      );
      console.log(
        `Agregado al carrito: ID ${idSeleccionado} (${productoEncontrado.nombre}).`
      );
    } else {
      // Condicional para ID inválido
      alert(
        "❌ ID de producto no válido. Por favor, ingresa un número de ID de la lista o 'FIN'."
      );
      console.warn(`Intento de ID inválido: ${inputUsuario}`);
    }
  }
}

/**
 * FUNCIÓN 3: Salida de datos (Mostrar resumen y calcular total)
 * Calcula y muestra el resumen final, usa condicional y Confirm.
 */
function mostrarResumen() {
  console.log("--- RESUMEN DE LA COMPRA ---");

  // Condicional para verificar si se agregó algo al carrito
  if (carrito.length === 0) {
    // Uso de Alert
    alert(`Gracias por tu visita, ${nombreUsuario}. ¡Esperamos verte pronto!`);
    console.log("Carrito vacío. Simulación terminada.");
    return;
  }

  // Cálculo del Total con IVA
  const ivaMonto = subtotalCompra * IVA_PORCENTAJE;
  const totalFinal = subtotalCompra + ivaMonto;

  // Uso de Confirm
  const confirmaFin = confirm(
    `👋 ${nombreUsuario}, ¿deseas finalizar tu compra de ${carrito.length} artículos?`
  );

  if (confirmaFin) {
    // Formato para el resumen final (uso de Alert, concatenación y saltos de línea)
    let resumen = `🎉 ¡Gracias por tu compra en ${NOMBRE_TIENDA}, ${nombreUsuario}! 🎉${SALTO_LINEA}${SALTO_LINEA}`;
    resumen += `📝 Detalle de tu Pedido: ${carrito.length} artículos.${SALTO_LINEA}`;
    resumen += `--------------------------------------${SALTO_LINEA}`;
    resumen += `SUBTOTAL: $${subtotalCompra.toFixed(2)}${SALTO_LINEA}`;
    resumen += `IVA (${IVA_PORCENTAJE * 100}%): $${ivaMonto.toFixed(
      2
    )}${SALTO_LINEA}`;
    resumen += `--------------------------------------${SALTO_LINEA}`;
    resumen += `TOTAL FINAL: $${totalFinal.toFixed(
      2
    )}${SALTO_LINEA}${SALTO_LINEA}`;
    resumen += `*Simulación de pago realizada con éxito.*`;

    alert(resumen);
    console.log(`Compra finalizada. Total: $${totalFinal.toFixed(2)}`);
  } else {
    alert("Compra cancelada. ¡Vuelve pronto!");
    console.log("Compra cancelada por el usuario.");
  }

  console.log("--- FIN DE SIMULACIÓN ---");
}

// ==========================================================
// 4. Invocación de las Funciones (Llamadas al algoritmo)
// ==========================================================

solicitarNombre(); // 1. Entrada de datos
simularCompra(); // 2. Procesamiento de datos
mostrarResumen(); // 3. Salida de datos
