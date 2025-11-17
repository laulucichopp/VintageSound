// ==========================================================
// 1. Constantes y Variables Globales
// ==========================================================

const NOMBRE_TIENDA = "Vintage Sound 🎶";
const IVA_PORCENTAJE = 0.21;

// Variables globales
let CATALAGO_INSTRUMENTOS = []; // Se llenará asíncronamente
let carrito = JSON.parse(localStorage.getItem("carritoVintageSound")) || [];
let subtotalCompra = 0;

// Referencias del DOM
const contenedorProductos = document.getElementById("productos-grid");
const listaCarrito = document.getElementById("lista-carrito");
const formularioCheckout = document.getElementById("checkout-form");
const btnVaciar = document.getElementById("vaciar-carrito-btn");

// ==========================================================
// 2. Funciones Asíncronas (Carga de Datos Remotos)
// ==========================================================

/**
 * Carga el catálogo de instrumentos desde el archivo data.json (simulación remota).
 */
async function cargarCatalogo() {
  try {
    const response = await fetch("./data.json");
    if (!response.ok) {
      throw new Error(`Error al cargar los datos: ${response.statusText}`);
    }
    CATALAGO_INSTRUMENTOS = await response.json();

    // Una vez cargado, renderiza el catálogo y oculta el mensaje de carga
    document.getElementById("cargando-productos").style.display = "none";
    renderizarCatalogo();
  } catch (error) {
    // Usa SweetAlert2 para mostrar error
    Swal.fire({
      icon: "error",
      title: "Error de Conexión",
      text: "No se pudo cargar el catálogo de instrumentos. Intenta más tarde.",
    });
  }
}

// ==========================================================
// 3. Funciones de Lógica de Negocio y Almacenamiento
// ==========================================================

/**
 * Persiste el array 'carrito' en localStorage.
 */
function guardarCarritoEnLocalStorage() {
  localStorage.setItem("carritoVintageSound", JSON.stringify(carrito));
}

/**
 * Vacía el carrito global y actualiza la interfaz.
 */
function vaciarCarrito() {
  if (carrito.length === 0) {
    Swal.fire({
      icon: "info",
      title: "Carrito Vacío",
      text: "No hay productos que vaciar.",
    });
    return;
  }

  // Usa SweetAlert2 para reemplazar el Confirm
  Swal.fire({
    title: "¿Estás seguro?",
    text: "¡Tu carrito se vaciará por completo!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#C0392B",
    cancelButtonColor: "#505050",
    confirmButtonText: "Sí, ¡Vaciar!",
    cancelButtonText: "No, Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      carrito = [];
      guardarCarritoEnLocalStorage();
      actualizarInterfaz();
      Swal.fire({
        title: "Carrito Vaciado",
        text: "Se han eliminado todos los productos.",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  });
}

// ==========================================================
// 4. Funciones de Interacción y Renderizado del DOM
// ==========================================================

/**
 * Genera el HTML del catálogo de forma dinámica.
 */
function renderizarCatalogo() {
  contenedorProductos.innerHTML = "";

  CATALAGO_INSTRUMENTOS.forEach((producto) => {
    const card = document.createElement("div");
    card.className = "producto-card";

card.innerHTML = `
    <img src="img/${producto.imagen}" alt="${
  producto.nombre
}" class="producto-img">

    <h4>${producto.nombre}</h4>
    <p class="categoria">Categoría: ${producto.categoria}</p>
    <p>Precio: $<span class="precio">${producto.precio.toFixed(2)}</span></p>

    <button class="agregar-btn" data-id="${producto.id}">🛒 Agregar</button>
`;


    contenedorProductos.appendChild(card);
  });
}

/**
 * Dibuja la lista actual de productos en el carrito.
 */
function actualizarCarritoDOM() {
  listaCarrito.innerHTML = "";

  if (carrito.length === 0) {
    listaCarrito.innerHTML =
      '<li class="carrito-vacio">El carrito está vacío. ¡Agrega un instrumento!</li>';
    return;
  }

  // Se usa un objeto para contar la cantidad de cada producto
  const carritoContador = carrito.reduce((acc, item) => {
    acc[item.id] = acc[item.id] ? acc[item.id] + 1 : 1;
    return acc;
  }, {});

  // Se dibujan los ítems únicos con su cantidad
  Object.keys(carritoContador).forEach((id) => {
    const producto = CATALAGO_INSTRUMENTOS.find((p) => p.id === parseInt(id));
    const cantidad = carritoContador[id];

    const li = document.createElement("li");
    li.innerHTML = `
            ${cantidad}x - ${producto.nombre} 
            <strong>($${(producto.precio * cantidad).toFixed(2)})</strong>
        `;
    listaCarrito.appendChild(li);
  });
}

/**
 * Calcula y muestra el subtotal, IVA y Total en la interfaz web.
 */
function mostrarResumenCompra() {
  // 1. Procesamiento: Recalcular el subtotal
  subtotalCompra = carrito.reduce((acc, item) => acc + item.precio, 0);

  // 2. Cálculo del Total con IVA
  const ivaMonto = subtotalCompra * IVA_PORCENTAJE;
  const totalFinal = subtotalCompra + ivaMonto;

  // 3. Salida: Actualizar los elementos del DOM
  document.getElementById("subtotal").textContent = subtotalCompra.toFixed(2);
  document.getElementById("iva-monto").textContent = ivaMonto.toFixed(2);
  document.getElementById("total-final").textContent = totalFinal.toFixed(2);
}

/**
 * Función central para actualizar el estado visual de la app.
 */
function actualizarInterfaz() {
  actualizarCarritoDOM();
  mostrarResumenCompra();
}

// ==========================================================
// 5. Event Handlers (Manejadores de Eventos)
// ==========================================================

/**
 * Agrega un producto al carrito al hacer click en el botón.
 */
function agregarAlCarrito(e) {
  if (!e.target.classList.contains("agregar-btn")) return;

  const idProducto = parseInt(e.target.getAttribute("data-id"));
  const productoAgregado = CATALAGO_INSTRUMENTOS.find(
    (p) => p.id === idProducto
  );

  if (productoAgregado) {
    carrito.push(productoAgregado);
    guardarCarritoEnLocalStorage();
    actualizarInterfaz();

    // Notificación de éxito con SweetAlert2
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: `¡${productoAgregado.nombre} agregado!`,
      showConfirmButton: false,
      timer: 1200,
    });
  }
}

/**
 * Maneja el proceso final de la compra al enviar el formulario.
 */
function finalizarCompra(e) {
  e.preventDefault(); // Evita el envío tradicional del formulario

  if (carrito.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "Carrito Vacío",
      text: "Debes agregar productos antes de finalizar la compra.",
    });
    return;
  }

  const nombre = document.getElementById("nombre-cliente").value;
  const totalFinal = (subtotalCompra * (1 + IVA_PORCENTAJE)).toFixed(2);

  // Simulación de Proceso de Pago
  Swal.fire({
    title: "Procesando Pago...",
    html: `Total a pagar: <strong>$${totalFinal}</strong>`,
    timer: 2000,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading();
    },
  }).then((result) => {
    if (result.dismiss === Swal.DismissReason.timer || result.isConfirmed) {
      // Éxito:
      vaciarCarrito(); // Vaciar el carrito después del pago
      Swal.fire({
        title: `¡Compra Exitosa, ${nombre}!`,
        html: `Tu pedido por $${totalFinal} ha sido confirmado. <br> ¡Gracias por elegir ${NOMBRE_TIENDA}!`,
        icon: "success",
        confirmButtonColor: "#C0392B",
      });
    }
  });
}

// ==========================================================
// 6. Inicialización de la Aplicación
// ==========================================================

document.addEventListener("DOMContentLoaded", () => {
  // 1. Carga Asíncrona de datos
  cargarCatalogo();

  // 2. Carga Inicial de la Interfaz (para mostrar carrito persistido)
  actualizarInterfaz();

  // 3. Asigna Event Listeners Globales
  contenedorProductos.addEventListener("click", agregarAlCarrito);
  btnVaciar.addEventListener("click", vaciarCarrito);
  formularioCheckout.addEventListener("submit", finalizarCompra);
});
