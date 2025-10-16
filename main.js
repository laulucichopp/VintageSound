// ==========================================================
// 1. Declaración de Variables, Constantes y Arrays
// ==========================================================

// Constantes
const NOMBRE_TIENDA = "Vintage Sound 🎶";
const IVA_PORCENTAJE = 0.21; // 21% de IVA

// Array de Objetos 
const CATALAGO_INSTRUMENTOS = [
  { id: 1, nombre: "Guitarra Eléctrica Fender Squier Strat", precio: 350 },
  { id: 2, nombre: "Bajo Eléctrico Ibanez SR300", precio: 480 },
  { id: 3, nombre: "Batería Acústica Pearl Roadshow", precio: 720 },
  { id: 4, nombre: "Guitarra Clásica Yamaha C40", precio: 150 },
  { id: 5, nombre: "Pedal Distorsión Boss DS-1", precio: 85 },
];

// Variables
// Carga el carrito desde localStorage. Si no existe, inicializa como array vacío.
let carrito = JSON.parse(localStorage.getItem('carritoVintageSound')) || []; 
let subtotalCompra = 0;

// ==========================================================
// 2. Funciones de Almacenamiento (localStorage)
// ==========================================================

/**
 * Guarda el array 'carrito' en localStorage.
 */
function guardarCarritoEnLocalStorage() {
    localStorage.setItem('carritoVintageSound', JSON.stringify(carrito));
}

/**
 * Vacía el carrito, lo actualiza en Storage y en el DOM.
 */
function vaciarCarrito() {
    carrito = []; 
    guardarCarritoEnLocalStorage();
    actualizarCarritoDOM();
    mostrarResumenCompra();
    console.log("Carrito vaciado por el usuario.");
}

// ==========================================================
// 3. Funciones de Interacción con el DOM (Catálogo)
// ==========================================================

function renderizarCatalogo() {
    const contenedorProductos = document.getElementById('productos-grid');
    contenedorProductos.innerHTML = ''; 
    CATALAGO_INSTRUMENTOS.forEach(producto => {
        const card = document.createElement('div');
        card.className = 'producto-card';

        card.innerHTML = `
            <h4>${producto.nombre}</h4>
            <p>Precio: $${producto.precio.toFixed(2)}</p>
            <button class="agregar-btn" data-id="${producto.id}">🛒 Agregar</button>
        `;

        contenedorProductos.appendChild(card);
    });

    // Asignar Evento 'click' a cada botón "Agregar al Carrito"
    document.querySelectorAll('.agregar-btn').forEach(button => {
        button.addEventListener('click', agregarAlCarrito);
    });
}

/**
 * Event Handler para el botón "Agregar al Carrito".
 * @param {Event} e - El evento click.
 */
function agregarAlCarrito(e) {
    // 1. Entrada: Obtenemos el ID del producto desde el atributo data-id
    const idProducto = parseInt(e.target.getAttribute('data-id'));
    const productoAgregado = CATALAGO_INSTRUMENTOS.find(p => p.id === idProducto);

    if (productoAgregado) {
        // 2. Procesamiento: Agregamos el producto al array del carrito
        carrito.push(productoAgregado); 
        
        // 3. Almacenamiento y Salida: 
        guardarCarritoEnLocalStorage(); // Persistencia
        actualizarCarritoDOM(); // Actualiza la lista de ítems
        mostrarResumenCompra(); // Actualiza los totales
        
        console.log(`Agregado al carrito: ${productoAgregado.nombre}.`);
    } else {
        console.error(`Error: No se encontró el producto con ID ${idProducto}`);
    }
}

// ==========================================================
// 4. Funciones de Interacción con el DOM (Carrito y Resumen)
// ==========================================================


function actualizarCarritoDOM() {
    const listaCarrito = document.getElementById('lista-carrito');
    listaCarrito.innerHTML = ''; // Limpiar lista anterior

    if (carrito.length === 0) {
        listaCarrito.innerHTML = '<li>El carrito está vacío. ¡Agrega un instrumento!</li>';
        return;
    }

    // Usamos el array 'carrito' (cargado desde localStorage) para dibujar cada ítem
    carrito.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.nombre} - $${item.precio.toFixed(2)}`;
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
    document.getElementById('subtotal').textContent = subtotalCompra.toFixed(2);
    document.getElementById('iva-monto').textContent = ivaMonto.toFixed(2);
    document.getElementById('total-final').textContent = totalFinal.toFixed(2);
}

/**
 * Maneja el proceso final de la compra.
 */
function finalizarCompra() {
    if (carrito.length === 0) {
        // En lugar de alert, podrías usar una modal o mensaje en el DOM.
        alert("Tu carrito está vacío. Agrega productos para finalizar."); 
        return;
    }

    // Cálculo del Total con IVA
    const ivaMonto = subtotalCompra * IVA_PORCENTAJE;
    const totalFinal = subtotalCompra + ivaMonto;
    
    // Simulación de finalización (usamos un alert simple solo para la confirmación final, 
    // pero idealmente sería una página de checkout o modal).
    alert(`🎉 ¡Gracias por tu compra en ${NOMBRE_TIENDA}! 🎉\n\nTotal pagado (simulado): $${totalFinal.toFixed(2)}`);
    
    // Vaciar carrito y resetear la vista/storage
    vaciarCarrito(); 
    console.log("Compra finalizada con éxito.");
}

// ==========================================================
// 5. Inicialización de la Aplicación
// ==========================================================

// 1. Renderiza el catálogo al cargar la página
renderizarCatalogo(); 

// 2. Carga y muestra los datos del carrito guardados en localStorage
actualizarCarritoDOM();
mostrarResumenCompra();

// 3. Asigna Event Listeners a los botones principales del resumen
document.getElementById('finalizar-compra-btn').addEventListener('click', finalizarCompra);
document.getElementById('vaciar-carrito-btn').addEventListener('click', vaciarCarrito);

console.log(`---SIMULADOR ${NOMBRE_TIENDA} INICIADO ---`);