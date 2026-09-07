// ==============================
// DATOS DEL MENÚ
// ==============================

const productos = [
    {
        nombre: "Hamburguesa simple",
        precio: 50,
        cantidad: 0
    },
    {
        nombre: "Hamburguesa doble",
        precio: 70,
        cantidad: 0
    },
    {
        nombre: "Papas",
        precio: 30,
        cantidad: 0
    },
    {
        nombre: "Refresco",
        precio: 20,
        cantidad: 0
    }
];

const pedidos = [];

let siguienteNumeroPedido = 1;


// ==============================
// ELEMENTOS DEL HTML
// ==============================

const elementosProducto = document.querySelectorAll(".producto");
const listaPedido = document.querySelector("#lista-pedido");
const totalElemento = document.querySelector("#total");
const crearPedidoBoton = document.querySelector("#crear-pedido");
const listaPedidosPendientes = document.querySelector("#lista-pedidos-pendientes");
const ventasPedidos = document.querySelector("#ventas-pedidos");
const ventasProductos = document.querySelector("#ventas-productos");
const ventasTotal = document.querySelector("#ventas-total");

// ==============================
// ACTUALIZAR PEDIDO
// ==============================

function actualizarPedido() {

    // Limpiamos la lista actual
    listaPedido.innerHTML = "";

    let total = 0;
    let hayProductos = false;

    productos.forEach((producto) => {

        if (producto.cantidad > 0) {

            hayProductos = true;

            const subtotal = producto.precio * producto.cantidad;

            total += subtotal;

            const elemento = document.createElement("p");

            elemento.textContent =
                `${producto.cantidad}x ${producto.nombre} - $${subtotal}`;

            listaPedido.appendChild(elemento);
        }

    });

    if (!hayProductos) {
        listaPedido.innerHTML = "<p>No hay productos seleccionados.</p>";
    }

    totalElemento.textContent = total;
}

// ==============================
// BOTONES + Y -
// ==============================

elementosProducto.forEach((elemento, indice) => {

    const botonMenos = elemento.querySelector("button:first-child");
    const botonMas = elemento.querySelector("button:last-child");
    const cantidad = elemento.querySelector("span");

    botonMas.addEventListener("click", () => {
        productos[indice].cantidad++;
        cantidad.textContent = productos[indice].cantidad;

        actualizarPedido();
    });

    botonMenos.addEventListener("click", () => {

        if (productos[indice].cantidad > 0) {
            productos[indice].cantidad--;
            cantidad.textContent = productos[indice].cantidad;

            actualizarPedido();
        }

    });

});

// ==============================
// NAVEGACIÓN ENTRE PESTAÑAS
// ==============================

const botonesPestana = document.querySelectorAll("[data-pestana]");
const pestanas = document.querySelectorAll(".pestana");


function cambiarPestana(nombrePestana) {

    pestanas.forEach((pestana) => {
        pestana.classList.remove("activa");
    });

    const pestanaSeleccionada = document.querySelector(`#${nombrePestana}`);

    pestanaSeleccionada.classList.add("activa");
}


botonesPestana.forEach((boton) => {

    boton.addEventListener("click", () => {

        const nombrePestana = boton.dataset.pestana;

        cambiarPestana(nombrePestana);

    });

});



cambiarPestana("nuevo-pedido");


// ==============================
// CREAR PEDIDO
// ==============================
function crearPedido() {

    const productosSeleccionados = productos.filter(
        (producto) => producto.cantidad > 0
    );

    if (productosSeleccionados.length === 0) {
        alert("El pedido está vacío.");
        return;
    }

    const nuevoPedido = {
        numero: siguienteNumeroPedido,
        productos: productosSeleccionados.map((producto) => ({
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: producto.cantidad
        })),
        estado: "pendiente"
    };

    pedidos.push(nuevoPedido);

    siguienteNumeroPedido++;

    renderizarPedidos();

    // Limpiar cantidades
    productos.forEach((producto, indice) => {
        producto.cantidad = 0;

        const cantidad = elementosProducto[indice].querySelector("span");
        cantidad.textContent = "0";
    });

    // Actualizar la pantalla
    actualizarPedido();

}

crearPedidoBoton.addEventListener("click", crearPedido);

// ====================
// RENDERIZAR PEDIDOS
// ====================
function renderizarPedidos() {

    listaPedidosPendientes.innerHTML = "";

    const pedidosPendientes = pedidos.filter(
        (pedido) => pedido.estado === "pendiente"
    );

    if (pedidosPendientes.length === 0) {
        listaPedidosPendientes.innerHTML =
            "<p>No hay pedidos pendientes.</p>";

        return;
    }

    pedidosPendientes.forEach((pedido) => {

        const elementoPedido = document.createElement("div");

        elementoPedido.classList.add("pedido");

        let contenido = `<h3>Pedido #${pedido.numero}</h3>`;

        let total = 0;

        pedido.productos.forEach((producto) => {

            const subtotal = producto.precio * producto.cantidad;

            total += subtotal;

            contenido += `
                <p>
                    ${producto.cantidad}x ${producto.nombre}
                    - $${subtotal}
                </p>
            `;
        });

        contenido += `<p><strong>Total: $${total}</strong></p>`;

        contenido += `
            <button class="terminar-pedido">
                Terminar pedido
            </button>
        `;

        elementoPedido.innerHTML = contenido;

        elementoPedido
            .querySelector(".terminar-pedido")
            .addEventListener("click", () => {
                terminarPedido(pedido.numero);
            });

        listaPedidosPendientes.appendChild(elementoPedido);
    });
}

// ==================
// TERMINAR PEDIDO
// ==================
function terminarPedido(numeroPedido) {

    const pedido = pedidos.find(
        (pedido) => pedido.numero === numeroPedido
    );

    if (pedido) {
        pedido.estado = "terminado";
    }

    renderizarPedidos();
    actualizarVentas();
}

// ======================
// ACTUALIZAR VENTAS
// ======================
function actualizarVentas() {

    const pedidosTerminados = pedidos.filter(
        (pedido) => pedido.estado === "terminado"
    );

    let cantidadProductos = 0;
    let totalVentas = 0;

    pedidosTerminados.forEach((pedido) => {

        pedido.productos.forEach((producto) => {

            cantidadProductos += producto.cantidad;

            totalVentas += producto.precio * producto.cantidad;

        });

    });

    ventasPedidos.textContent = pedidosTerminados.length;
    ventasProductos.textContent = cantidadProductos;
    ventasTotal.textContent = totalVentas;
}