// ==============================
// DATOS DEL MENÚ
// ==============================

const productos = [
    {
        nombre: "Naviburger",
        precio: 50,
        cantidad: 0
    },
    {
        nombre: "Naviburger con papas",
        precio: 70,
        cantidad: 0
    },
    {
        nombre: "Hawanovi",
        precio: 60,
        cantidad: 0
    },
    {
        nombre: "Hawanovi con papas",
        precio: 80,
        cantidad: 0
    },
    {
        nombre: "Yayi Burger Especial",
        precio: 70,
        cantidad: 0
    },
    {
        nombre: "Yayi Burger Especial con papas",
        precio: 90,
        cantidad: 0
    },
    {
        nombre: "Yayidog",
        precio: 30,
        cantidad: 0
    },
    {
        nombre: "Yayidog con papas",
        precio: 50,
        cantidad: 0
    },
    {
        nombre: "Yayidog Especial",
        precio: 35,
        cantidad: 0
    },
    {
        nombre: "Yayidog Especial con papas",
        precio: 55,
        cantidad: 0
    },
    {
        nombre: "Danidog",
        precio: 25,
        cantidad: 0
    },
    {
        nombre: "Danidog con papas",
        precio: 45,
        cantidad: 0
    },
    {
        nombre: "Sincronavi",
        precio: 30,
        cantidad: 0
    },
    {
        nombre: "Sincronavi con papas",
        precio: 50,
        cantidad: 0
    },
    {
        nombre: "Sincronavi Especial",
        precio: 40,
        cantidad: 0
    },
    {
        nombre: "Sincronavi Especial con papas",
        precio: 60,
        cantidad: 0
    },
    {
        nombre: "Orden de papas sola",
        precio: 30,
        cantidad: 0
    },
];

const pedidos = [];



abrirBaseDatos()
    .then(async () => {
        const [pedidosGuardados, terminadosGuardados] =
            await Promise.all([
                obtenerPedidos(),
                obtenerPedidosTerminados()
            ]);

        pedidos.length = 0;
        pedidos.push(...pedidosGuardados);

        // Evitar reutilizar números de pedido de hoy.
        siguienteNumeroPedido =
            await obtenerSiguienteNumeroPedido();

        renderizarPedidos();
        actualizarPedido();
        actualizarVentas();
        renderizarHistorial();
        renderizarPedidosTerminados();

        console.log(
            "Naviburger inicializado correctamente.",
            {
                pedidosActivos: pedidosGuardados.length,
                pedidosTerminados: terminadosGuardados.length
            }
        );
    })
    .catch((error) => {
        console.error(
            "No se pudo inicializar Naviburger:",
            error
        );

        alert(
            "No se pudieron cargar los datos de Naviburger. " +
            "Revisa la consola para conocer el error."
        );
    });


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
const botonNuevoDia = document.getElementById("nuevo-dia");

// ==============================
// ACTUALIZAR PEDIDO
// ==============================

function actualizarPedido() {

    // Limpiamos la lista actual
    listaPedido.innerHTML = "";

    let total = 0;
    let cantidadArticulos = 0;
    let hayProductos = false;

    productos.forEach((producto) => {

        if (producto.cantidad > 0) {

            hayProductos = true;

            cantidadArticulos += producto.cantidad;

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

    document.getElementById("cantidad-articulos").textContent = cantidadArticulos;
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

const subpestanasVentas = document.querySelectorAll(
    "[data-ventas]"
);

const vistaVentasHoy = document.getElementById("ventas-hoy");
const vistaVentasHistorial = document.getElementById(
    "ventas-historial"
);
const vistaPedidosTerminados = document.querySelector(
    "#ventas-pedidos-terminados"
);

function cambiarPestana(nombrePestana) {

    pestanas.forEach((pestana) => {
        pestana.classList.remove("activa");
    });

    const pestanaSeleccionada = document.querySelector(`#${nombrePestana}`);

    pestanaSeleccionada.classList.add("activa");

    const botonesPestana = document.querySelectorAll(".boton-pestana");

    botonesPestana.forEach((boton) => {
        boton.classList.remove("activa");
    });

    const botonActivo = document.querySelector(
        `[data-pestana="${nombrePestana}"]`
    );

    botonActivo.classList.add("activa");
}


function cambiarSubpestanaVentas(pestana) {
    vistaVentasHoy.style.display = "none";
    vistaVentasHistorial.style.display = "none";
    vistaPedidosTerminados.style.display = "none";

    if (pestana === "Hoy") {
        vistaVentasHoy.style.display = "block";
        actualizarVentas();
    }

    if (pestana === "Historial") {
        vistaVentasHistorial.style.display = "block";
        renderizarHistorial();
    }

    if (pestana === "Pedidos") {
        vistaPedidosTerminados.style.display = "block";
        renderizarPedidosTerminados();
    }
}


function renderizarHistorial() {

    obtenerHistorial()
        .then((historial) => {

            vistaVentasHistorial.innerHTML = "";

            if (historial.length === 0) {

                vistaVentasHistorial.innerHTML =
                    "<p>No hay días registrados todavía.</p>";

                return;
            }

            const historialPorFecha = {};

            historial.forEach((dia) => {

                if (!historialPorFecha[dia.fecha]) {
                    historialPorFecha[dia.fecha] = [];
                }

                historialPorFecha[dia.fecha].push(dia);

            });

            Object.values(historialPorFecha).forEach((cierresDelDia) => {

                const fecha = cierresDelDia[0].fecha;

                let pedidos = 0;
                let productosVendidos = 0;
                let ganancias = 0;

                cierresDelDia.forEach((dia) => {

                    pedidos += dia.pedidos.length;

                    productosVendidos += Object.values(
                        dia.productosVendidos
                    ).reduce(
                        (total, cantidad) => total + cantidad,
                        0
                    );

                    ganancias += dia.ganancias;

                });

                const elementoDia = document.createElement("div");

                elementoDia.innerHTML = `
                    <h3>${fecha}</h3>
                    <p>Pedidos: ${pedidos}</p>
                    <p>Productos vendidos: ${productosVendidos}</p>
                    <p>Ganancias: $${ganancias}</p>
                `;

                vistaVentasHistorial.appendChild(elementoDia);

            });

        })
        .catch((error) => {

            console.error(
                "Error al cargar el historial:",
                error
            );

        });

}


async function renderizarPedidosTerminados() {
    vistaPedidosTerminados.innerHTML = "";

    try {
        const pedidosTerminados = await obtenerPedidosTerminados();

        if (pedidosTerminados.length === 0) {
            vistaPedidosTerminados.textContent =
                "Todavía no hay pedidos terminados.";
            return;
        }

        // Mostrar primero los pedidos terminados más recientemente.
        pedidosTerminados.sort((a, b) => {
            const fechaA = a.fechaTerminacion || "";
            const fechaB = b.fechaTerminacion || "";

            if (fechaA !== fechaB) {
                return fechaB.localeCompare(fechaA);
            }

            return (b.numero || 0) - (a.numero || 0);
        });

        pedidosTerminados.forEach((pedido) => {
            const tarjeta = document.createElement("div");
            tarjeta.classList.add("pedido", "pedido-terminado");

            const titulo = document.createElement("h3");
            titulo.textContent = `Pedido #${pedido.numero}`;

            const fechaCreacion = document.createElement("p");
            fechaCreacion.textContent =
                `Creado: ${pedido.fechaCreacion || "No registrada"}`;

            const fechaTerminacion = document.createElement("p");
            fechaTerminacion.textContent =
                `Terminado: ${pedido.fechaTerminacion || "No registrada"}`;

            const listaProductos = document.createElement("div");
            let total = 0;

            (pedido.productos || []).forEach((producto) => {
                const subtotal = producto.precio * producto.cantidad;
                total += subtotal;

                const detalle = document.createElement("p");
                detalle.textContent =
                    `${producto.cantidad}x ${producto.nombre} - $${subtotal}`;

                listaProductos.appendChild(detalle);
            });

            const totalElemento = document.createElement("p");
            totalElemento.textContent = `Total: $${total}`;

            const estadoPago = document.createElement("p");

            if (pedido.estadoPago === "pagado") {
                estadoPago.textContent = "Pago: Pagado";

                const pago = pedido.pago || {};

                const recibido = document.createElement("p");
                recibido.textContent =
                    `Recibido: $${pago.recibido ?? "No registrado"}`;

                const cambio = document.createElement("p");
                cambio.textContent =
                    `Cambio: $${pago.cambio ?? "No registrado"}`;

                const fechaPago = document.createElement("p");
                fechaPago.textContent =
                    `Fecha de pago: ${pago.fecha || "No registrada"}`;

                tarjeta.append(
                    titulo,
                    fechaCreacion,
                    fechaTerminacion,
                    listaProductos,
                    totalElemento,
                    estadoPago,
                    recibido,
                    cambio,
                    fechaPago
                );
            } else {
                estadoPago.textContent = "Pago: Por cobrar";

                tarjeta.append(
                    titulo,
                    fechaCreacion,
                    fechaTerminacion,
                    listaProductos,
                    totalElemento,
                    estadoPago
                );
            }

            vistaPedidosTerminados.appendChild(tarjeta);
        });
    } catch (error) {
        console.error(
            "Error al cargar los pedidos terminados:",
            error
        );

        vistaPedidosTerminados.textContent =
            "No se pudo cargar el historial de pedidos terminados.";
    }
}


botonesPestana.forEach((boton) => {

    boton.addEventListener("click", () => {

        const nombrePestana = boton.dataset.pestana;

        cambiarPestana(nombrePestana);

    });

});

subpestanasVentas.forEach((boton) => {

    boton.addEventListener("click", () => {

        cambiarSubpestanaVentas(
            boton.dataset.ventas
        );

    });

});

cambiarSubpestanaVentas("Hoy");

botonNuevoDia.addEventListener("click", () => {

    const confirmar = confirm(
        "¿Estás seguro de que quieres cerrar el día y comenzar uno nuevo?"
    );

    if (!confirmar) {
        return;
    }

    cerrarDia(obtenerFechaActual());
});

cambiarPestana("nuevo-pedido");


// ==============================
// CREAR PEDIDO
// ==============================

async function crearPedido() {
    const productosSeleccionados = productos.filter(
        (producto) => producto.cantidad > 0
    );

    if (productosSeleccionados.length === 0) {
        alert("El pedido está vacío.");
        return;
    }

    crearPedidoBoton.disabled = true;

    try {
        const fechaCreacion = obtenerFechaActual();
        const numero = await obtenerSiguienteNumeroPedido(fechaCreacion);

        const nuevoPedido = {
            id: crypto.randomUUID(),
            numero,
            fechaCreacion,
            fechaTerminacion: null,
            productos: productosSeleccionados.map((producto) => ({
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad: producto.cantidad
            })),
            estado: "pendiente",
            estadoPago: "por_cobrar",
            pago: null
        };

        await guardarPedido(nuevoPedido);

        pedidos.push(nuevoPedido);

        siguienteNumeroPedido = numero + 1;

        productos.forEach((producto, indice) => {
            producto.cantidad = 0;

            const cantidad =
                elementosProducto[indice].querySelector("span");

            cantidad.textContent = "0";
        });

        renderizarPedidos();
        actualizarPedido();
        actualizarVentas();
    } catch (error) {
        console.error("Error al crear el pedido:", error);
        alert("No se pudo guardar el pedido. Inténtalo de nuevo.");
    } finally {
        crearPedidoBoton.disabled = false;
    }
}


crearPedidoBoton.addEventListener("click", crearPedido);

// ====================
// RENDERIZAR PEDIDOS
// ====================

function renderizarPedidos() {
    listaPedidosPendientes.innerHTML = "";

    const pedidosPendientes = pedidos.filter(
        pedido => pedido.estado === "pendiente"
    );

    if (pedidosPendientes.length === 0) {
        listaPedidosPendientes.textContent =
            "No hay pedidos pendientes.";
        return;
    }

    pedidosPendientes.forEach(pedido => {
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("pedido");

        const titulo = document.createElement("h3");
        titulo.textContent = `Pedido #${pedido.numero}`;

        const detalles = document.createElement("div");
        let total = 0;

        pedido.productos.forEach(producto => {
            const subtotal = producto.precio * producto.cantidad;
            total += subtotal;

            const detalle = document.createElement("p");
            detalle.textContent =
                `${producto.cantidad}x ${producto.nombre} - $${subtotal.toFixed(2)}`;

            detalles.appendChild(detalle);
        });

        const totalElemento = document.createElement("p");
        totalElemento.textContent = `Total: $${total.toFixed(2)}`;

        const estadoPago = document.createElement("p");
        estadoPago.textContent =
            pedido.estadoPago === "pagado"
                ? "Pago: Pagado"
                : "Pago: Por cobrar";

        const botonPagar = document.createElement("button");
        botonPagar.textContent =
            pedido.estadoPago === "pagado" ? "Ya pagado" : "Pagar";
        botonPagar.disabled = pedido.estadoPago === "pagado";

        botonPagar.addEventListener("click", () => {
            pagarPedido(pedido.id);
        });

        const botonTerminar = document.createElement("button");
        botonTerminar.textContent = "Terminar pedido";

        botonTerminar.addEventListener("click", () => {
            terminarPedido(pedido.id);
        });

        tarjeta.append(
            titulo,
            detalles,
            totalElemento,
            estadoPago,
            botonPagar,
            botonTerminar
        );

        listaPedidosPendientes.appendChild(tarjeta);
    });
}


// ==================
// TERMINAR PEDIDO
// ==================

async function terminarPedido(idPedido) {
  const pedido = pedidos.find(
    (pedido) => pedido.id === idPedido
  );

  if (!pedido) {
    alert("No se encontró el pedido.");
    return;
  }

  if (pedido.estado !== "pendiente") {
    alert("Este pedido ya no está pendiente.");
    return;
  }

  try {
    const pedidoTerminado =
      await terminarYTrasladarPedido(idPedido);

    pedidos = pedidos.filter(
      (pedido) => pedido.id !== idPedido
    );

    renderizarPedidos();
    actualizarPedido();
    actualizarVentas();

    // El historial individual se actualizará por separado.
    console.log(
      "Pedido terminado:",
      pedidoTerminado
    );
  } catch (error) {
    console.error("Error al terminar el pedido:", error);
    alert(
      "No se pudo terminar el pedido. No se confirmó ningún cambio."
    );
  }
}


async function pagarPedido(idPedido) {
    const pedido = pedidos.find(p => p.id === idPedido);

    if (!pedido) {
        alert("No se encontró el pedido.");
        return;
    }

    if (pedido.estadoPago === "pagado") {
        alert("Este pedido ya está pagado.");
        return;
    }

    const total = Math.round(
        pedido.productos.reduce(
            (suma, producto) =>
                suma + producto.precio * producto.cantidad,
            0
        ) * 100
    ) / 100;

    const respuesta = prompt(
        `Total del pedido #${pedido.numero}: $${total}\n` +
        "¿Cuánto dinero recibió el negocio?"
    );

    if (respuesta === null || respuesta.trim() === "") {
        return;
    }

    const recibido = Number(respuesta);

    if (!Number.isFinite(recibido) || recibido < 0) {
        alert("Introduce una cantidad válida.");
        return;
    }

    try {
        const pedidoActualizado = await registrarPagoPedido(
            idPedido,
            recibido
        );

        const indice = pedidos.findIndex(p => p.id === idPedido);

        if (indice !== -1) {
            pedidos[indice] = pedidoActualizado;
        }

        const cambio = pedidoActualizado.pago.cambio;

        alert(
            `¡Pago registrado!\n` +
            `Total: $${total}\n` +
            `Recibido: $${recibido.toFixed(2)}\n` +
            `Cambio: $${cambio.toFixed(2)}\n\n` +
            "El pedido sigue en preparación."
        );

        renderizarPedidos();
        actualizarPedido();
        actualizarVentas();
    } catch (error) {
        console.error("Error al registrar el pago:", error);
        alert(error.message || "No se pudo registrar el pago.");
    }
}


// ======================
// ACTUALIZAR VENTAS
// ======================

async function actualizarVentas() {
    try {
        const fechaHoy = obtenerFechaActual();

        const [activos, terminados] = await Promise.all([
            obtenerPedidos(),
            obtenerPedidosTerminados()
        ]);

        const pedidosPagadosHoy = [...activos, ...terminados].filter(
            (pedido) =>
                pedido.estadoPago === "pagado" &&
                pedido.pago?.fecha === fechaHoy
        );

        let cantidadProductos = 0;
        let totalVentas = 0;

        pedidosPagadosHoy.forEach((pedido) => {
            pedido.productos.forEach((producto) => {
                cantidadProductos += producto.cantidad;
                totalVentas += producto.precio * producto.cantidad;
            });
        });

        ventasPedidos.textContent = pedidosPagadosHoy.length;
        ventasProductos.textContent = cantidadProductos;
        ventasTotal.textContent = totalVentas;
    } catch (error) {
        console.error("Error al actualizar las ventas:", error);
    }
}


