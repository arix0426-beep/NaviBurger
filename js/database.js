const NAVI_DATA_BASE = "naviburgerDB";  // NOMBRE
const VERSION_BASE_DATOS = 2;           // VERSION

let naviburgerDB;  // Variable universal

// ------------------------
// FUNCIÓN 'abrirBaseDatos'
// ------------------------
function abrirBaseDatos() {

    // Estructura
    return new Promise((resolve, reject) => {

        // Crear solicitud para abrir la base de datos
        const solicitud = indexedDB.open(NAVI_DATA_BASE, VERSION_BASE_DATOS);
    
        // En caso de solicitud abierta correctamente
        solicitud.onsuccess = () => {

            naviburgerDB = solicitud.result;

            console.log("NAVI_DATA_BASE abierta correctamente");
            resolve(naviburgerDB);

        };

        // En caso de error al abrir la solicitud
        solicitud.onerror = () => {

            console.error("Error al abrir NAVI_DATA_BASE:", solicitud.error);

            reject(solicitud.error);

        };

        // En caso de necesitar actualización
        solicitud.onupgradeneeded = (evento) => {

            naviburgerDB = evento.target.result;

            // Version: 1
            if (evento.oldVersion < 1) {
                naviburgerDB.createObjectStore("pedidos", {
                    keyPath: "numero"
                });
            }

            // Version 2
            if (evento.oldVersion < 2) {
                naviburgerDB.createObjectStore("historial", {
                    keyPath: "fecha"
                });
            }

        };
    });
}

// -----------------------
// FUNCIÓN 'guardarPedido'
// -----------------------
function guardarPedido(pedido) {
    
    // VARIABLES----------------------------------------------------------- //

    const transaccion = naviburgerDB.transaction(["pedidos"], "readwrite");

    const almacen = transaccion.objectStore("pedidos");

    const solicitud = almacen.put(pedido);

    // -------------------------------------------------------------------- //

    // Sin problemas
    solicitud.onsuccess = () => {

        console.log("Pedido guardado correctamente");

    }

    // Error
    solicitud.onerror = () => {

        console.error("Error al guardar el pedido: ", solicitud.error);

    }
}

// -----------------------
// FUNCIÓN 'obtenerPedido'
// -----------------------
function obtenerPedidos() {

    // Estructura
    return new Promise((resolve, reject) => {

        // VARIABLES --------------------------------------------------------- //

        const transaccion = naviburgerDB.transaction(["pedidos"], "readonly");

        const almacen = transaccion.objectStore("pedidos");

        const solicitud = almacen.getAll();

        // ------------------------------------------------------------------- //

        // Sin problemas
        solicitud.onsuccess = () => {

            console.log("Pedidos obtenidos: ", solicitud.result);

            resolve(solicitud.result);

        }

        // Error
        solicitud.onerror = () => {

            console.log("Error al obtener los pedidos: ", solicitud.error);

            reject(solicitud.error);

        }

    });

}

// --------------------------
// FUNCIÓN 'guardarHistorial'
// --------------------------
function guardarHistorial(dia) {

    return new Promise((resolve, reject) => {

        const transaccion = naviburgerDB.transaction(
            ["historial"],
            "readwrite"
        );

        const almacen = transaccion.objectStore("historial");

        const solicitud = almacen.put(dia);

        solicitud.onsuccess = () => {
            console.log("Historial guardado correctamente");
            resolve();
        };

        solicitud.onerror = () => {
            console.error(
                "Error al guardar el historial:",
                solicitud.error
            );

            reject(solicitud.error);
        };

    });
}

function obtenerHistorial() {

    return new Promise((resolve, reject) => {

        const transaccion = naviburgerDB.transaction(
            ["historial"],
            "readonly"
        );

        const almacen = transaccion.objectStore("historial");

        const solicitud = almacen.getAll();

        solicitud.onsuccess = () => {
            console.log(
                "Historial obtenido:",
                solicitud.result
            );

            resolve(solicitud.result);
        };

        solicitud.onerror = () => {
            console.error(
                "Error al obtener el historial:",
                solicitud.error
            );

            reject(solicitud.error);
        };

    });
}

function calcularResumenDelDia() {

    const pedidosTerminados = pedidos.filter(
        (pedido) => pedido.estado === "terminado"
    );

    const productosVendidos = {};
    let ganancias = 0;

    pedidosTerminados.forEach((pedido) => {

        pedido.productos.forEach((producto) => {

            const subtotal = producto.precio * producto.cantidad;

            ganancias += subtotal;

            if (productosVendidos[producto.nombre]) {
                productosVendidos[producto.nombre] += producto.cantidad;
            } else {
                productosVendidos[producto.nombre] = producto.cantidad;
            }

        });

    });

    return {
        pedidos: pedidosTerminados,
        productosVendidos: productosVendidos,
        ganancias: ganancias
    };
}

function cerrarDia(fecha) {

    const pedidosPendientes = pedidos.some(
        (pedido) => pedido.estado === "pendiente"
    );

    if (pedidosPendientes) {
        alert("No puedes cerrar el día mientras haya pedidos pendientes.");
        return;
    }

    const resumen = calcularResumenDelDia();

    const dia = {
        fecha: fecha,
        pedidos: resumen.pedidos,
        productosVendidos: resumen.productosVendidos,
        ganancias: resumen.ganancias
    };

    guardarHistorial(dia)
        .then(() => {
            return borrarTodosLosPedidos();
        })
        .then(() => {
            pedidos.length = 0;
            siguienteNumeroPedido = 1;

            renderizarPedidos();
            actualizarVentas();

            console.log("Día cerrado correctamente");
        })
        .catch((error) => {
            console.error("Error al cerrar el día:", error);
        });
}

function borrarTodosLosPedidos() {

    return new Promise((resolve, reject) => {

        const transaccion = naviburgerDB.transaction(
            ["pedidos"],
            "readwrite"
        );

        const almacen = transaccion.objectStore("pedidos");

        const solicitud = almacen.clear();

        solicitud.onsuccess = () => {
            console.log("Pedidos actuales eliminados correctamente");
            resolve();
        };

        solicitud.onerror = () => {
            console.error(
                "Error al eliminar los pedidos:",
                solicitud.error
            );

            reject(solicitud.error);
        };

    });
}

