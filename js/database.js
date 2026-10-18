const NAVI_DATA_BASE = "naviburgerDB";  // NOMBRE
const VERSION_BASE_DATOS = 4;           // VERSION

function obtenerFechaActual() {

    const fecha = new Date();

    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");

    return `${año}-${mes}-${dia}`;
}

let naviburgerDB;  // Variable universal

// ------------------------
// FUNCIÓN 'abrirBaseDatos'
// ------------------------

function abrirBaseDatos() {
    return new Promise((resolve, reject) => {
        const solicitud = indexedDB.open(
            NAVI_DATA_BASE,
            VERSION_BASE_DATOS
        );

        solicitud.onupgradeneeded = (evento) => {
            const db = evento.target.result;
            const transaccion = evento.target.transaction;
            const versionAnterior = evento.oldVersion;

            // Base de datos nueva: crear la estructura definitiva.
            if (versionAnterior === 0) {
                db.createObjectStore("pedidos", {
                    keyPath: "id"
                });

                db.createObjectStore("pedidosTerminados", {
                    keyPath: "id"
                });

                db.createObjectStore("historial", {
                    keyPath: "id"
                });

                return;
            }

            // Migrar el historial antiguo sin descartar sus registros.
            if (versionAnterior < 3) {
                if (db.objectStoreNames.contains("historial")) {
                    const historialAntiguo =
                        transaccion.objectStore("historial");

                    const lecturaHistorial = historialAntiguo.getAll();

                    lecturaHistorial.onsuccess = () => {
                        try {
                            const registros = lecturaHistorial.result;

                            db.deleteObjectStore("historial");

                            const historialNuevo = db.createObjectStore(
                                "historial",
                                { keyPath: "id" }
                            );

                            const idsHistorial = new Set();

                            for (const registro of registros) {
                                let id = registro.id;

                                if (!id || idsHistorial.has(id)) {
                                    id = crypto.randomUUID();
                                }

                                idsHistorial.add(id);

                                historialNuevo.add({
                                    ...registro,
                                    id
                                });
                            }
                        } catch (error) {
                            console.error(
                                "Error al migrar el historial:",
                                error
                            );
                            transaccion.abort();
                        }
                    };

                    lecturaHistorial.onerror = () => {
                        console.error(
                            "No se pudo leer el historial antiguo:",
                            lecturaHistorial.error
                        );
                        transaccion.abort();
                    };
                } else {
                    db.createObjectStore("historial", {
                        keyPath: "id"
                    });
                }
            }

            // Migrar pedidos a la estructura de la versión 4.
            if (versionAnterior < 4) {
                const almacenAntiguo =
                    transaccion.objectStore("pedidos");

                const lecturaPedidos = almacenAntiguo.getAll();

                lecturaPedidos.onsuccess = () => {
                    try {
                        const registros = lecturaPedidos.result;

                        db.deleteObjectStore("pedidos");

                        const pedidosNuevos = db.createObjectStore(
                            "pedidos",
                            { keyPath: "id" }
                        );

                        const pedidosTerminadosNuevos =
                            db.createObjectStore(
                                "pedidosTerminados",
                                { keyPath: "id" }
                            );

                        const idsPedidos = new Set();

                        for (const registro of registros) {
                            let id = registro.id;

                            if (!id || idsPedidos.has(id)) {
                                id = crypto.randomUUID();
                            }

                            idsPedidos.add(id);

                            const pedido = {
                                ...registro,
                                id,
                                fechaCreacion:
                                    registro.fechaCreacion ||
                                    obtenerFechaActual(),
                                estadoPago:
                                    registro.estadoPago || "por_cobrar",
                                pago: registro.pago ?? null,
                                fechaTerminacion:
                                    registro.fechaTerminacion ??
                                    (
                                        registro.estado === "terminado"
                                            ? obtenerFechaActual()
                                            : null
                                    )
                            };

                            if (pedido.estado === "terminado") {
                                pedidosTerminadosNuevos.add(pedido);
                            } else {
                                pedidosNuevos.add(pedido);
                            }
                        }
                    } catch (error) {
                        console.error(
                            "Error al migrar los pedidos:",
                            error
                        );
                        transaccion.abort();
                    }
                };

                lecturaPedidos.onerror = () => {
                    console.error(
                        "No se pudieron leer los pedidos antiguos:",
                        lecturaPedidos.error
                    );
                    transaccion.abort();
                };
            }
        };


        solicitud.onsuccess = () => {
            naviburgerDB = solicitud.result;

            naviburgerDB.onversionchange = () => {
                naviburgerDB.close();
            };

            console.log(
                "NAVI_DATA_BASE abierta correctamente. Versión:",
                naviburgerDB.version
            );

            resolve(naviburgerDB);
        };

        solicitud.onerror = () => {
            console.error(
                "Error al abrir NAVI_DATA_BASE:",
                solicitud.error
            );

            reject(solicitud.error);
        };

        solicitud.onblocked = () => {
            console.warn(
                "La actualización está bloqueada por otra conexión abierta."
            );
        };
    });
}




// -----------------------
// FUNCIÓN 'guardarPedido'
// -----------------------

function guardarPedido(pedido) {
    return new Promise((resolve, reject) => {
        if (!naviburgerDB) {
            reject(new Error("La base de datos no está abierta."));
            return;
        }

        const transaccion = naviburgerDB.transaction(
            ["pedidos"],
            "readwrite"
        );

        const almacen = transaccion.objectStore("pedidos");

        almacen.put(pedido);

        transaccion.oncomplete = () => {
            console.log("Pedido guardado correctamente");
            resolve(pedido);
        };

        transaccion.onerror = () => {
            console.error(
                "Error al guardar el pedido:",
                transaccion.error
            );
            reject(transaccion.error);
        };

        transaccion.onabort = () => {
            reject(
                transaccion.error ??
                new Error("Se canceló el guardado del pedido.")
            );
        };
    });
}


function terminarYTrasladarPedido(idPedido) {
    return new Promise((resolve, reject) => {
        if (!naviburgerDB) {
            reject(new Error("La base de datos no está abierta."));
            return;
        }

        const transaccion = naviburgerDB.transaction(
            ["pedidos", "pedidosTerminados"],
            "readwrite"
        );

        const activos = transaccion.objectStore("pedidos");
        const terminados = transaccion.objectStore("pedidosTerminados");

        let pedidoActualizado = null;
        let errorOperacion = null;

        const solicitud = activos.get(idPedido);

        solicitud.onsuccess = () => {
            const pedido = solicitud.result;

            if (!pedido) {
                errorOperacion = new Error(
                    "No se encontró el pedido activo."
                );
                transaccion.abort();
                return;
            }

            if (pedido.estado === "terminado") {
                errorOperacion = new Error(
                    "Este pedido ya está terminado."
                );
                transaccion.abort();
                return;
            }

            pedidoActualizado = {
                ...pedido,
                estado: "terminado",
                fechaTerminacion: obtenerFechaActual()
            };

            // Ambas operaciones pertenecen a la misma transacción.
            // Si alguna falla, IndexedDB revierte los cambios.
            terminados.add(pedidoActualizado);
            activos.delete(idPedido);
        };

        solicitud.onerror = () => {
            errorOperacion = solicitud.error;
            transaccion.abort();
        };

        transaccion.oncomplete = () => {
            resolve(pedidoActualizado);
        };

        transaccion.onerror = () => {
            reject(
                errorOperacion ||
                transaccion.error ||
                new Error("No se pudo terminar el pedido.")
            );
        };

        transaccion.onabort = () => {
            reject(
                errorOperacion ||
                transaccion.error ||
                new Error("La operación fue cancelada.")
            );
        };
    });
}



function registrarPagoPedido(idPedido, recibido) {
    return new Promise((resolve, reject) => {
        if (!naviburgerDB) {
            reject(new Error("La base de datos no está abierta."));
            return;
        }

        if (!Number.isFinite(recibido) || recibido < 0) {
            reject(new Error("La cantidad recibida no es válida."));
            return;
        }

        const transaccion = naviburgerDB.transaction(
            ["pedidos", "pedidosTerminados"],
            "readwrite"
        );

        const activos = transaccion.objectStore("pedidos");
        const terminados = transaccion.objectStore("pedidosTerminados");

        let pedidoActualizado = null;
        let errorOperacion = null;

        function cancelarOperacion(mensaje) {
            errorOperacion = new Error(mensaje);
            transaccion.abort();
        }

        function procesarPedido(pedido, almacen) {
            if (!pedido) {
                cancelarOperacion("No se encontró el pedido.");
                return;
            }

            if (pedido.estadoPago === "pagado") {
                cancelarOperacion("Este pedido ya está pagado.");
                return;
            }

            const total = Math.round(
                pedido.productos.reduce(
                    (suma, producto) =>
                        suma + producto.precio * producto.cantidad,
                    0
                ) * 100
            ) / 100;

            if (recibido < total) {
                cancelarOperacion(
                    `Pago insuficiente. El total es $${total.toFixed(2)}.`
                );
                return;
            }

            const cambio = Math.round(
                (recibido - total) * 100
            ) / 100;

            pedidoActualizado = {
                ...pedido,
                estadoPago: "pagado",
                pago: {
                    recibido,
                    cambio,
                    fecha: obtenerFechaActual()
                }
            };

            const solicitudGuardar = almacen.put(pedidoActualizado);

            solicitudGuardar.onerror = () => {
                errorOperacion =
                    solicitudGuardar.error ||
                    new Error("No se pudo guardar el pago.");
                transaccion.abort();
            };
        }

        const solicitudActivo = activos.get(idPedido);

        solicitudActivo.onsuccess = () => {
            if (solicitudActivo.result) {
                procesarPedido(solicitudActivo.result, activos);
                return;
            }

            const solicitudTerminado = terminados.get(idPedido);

            solicitudTerminado.onsuccess = () => {
                procesarPedido(solicitudTerminado.result, terminados);
            };

            solicitudTerminado.onerror = () => {
                errorOperacion = solicitudTerminado.error;
                transaccion.abort();
            };
        };

        solicitudActivo.onerror = () => {
            errorOperacion = solicitudActivo.error;
            transaccion.abort();
        };

        transaccion.oncomplete = () => {
            resolve(pedidoActualizado);
        };

        transaccion.onabort = () => {
            reject(
                errorOperacion ||
                transaccion.error ||
                new Error("No se pudo registrar el pago.")
            );
        };
    });
}



// -----------------------
// FUNCIÓN 'obtenerPedido'
// -----------------------
function obtenerPedidos() {
    return new Promise((resolve, reject) => {
        if (!naviburgerDB) {
            reject(new Error("La base de datos no está abierta."));
            return;
        }

        const transaccion = naviburgerDB.transaction(
            ["pedidos"],
            "readonly"
        );

        const solicitud = transaccion
            .objectStore("pedidos")
            .getAll();

        solicitud.onsuccess = () => {
            resolve(solicitud.result);
        };

        solicitud.onerror = () => {
            reject(solicitud.error);
        };
    });
}


function obtenerPedidosTerminados() {
    return new Promise((resolve, reject) => {
        if (!naviburgerDB) {
            reject(new Error("La base de datos no está abierta."));
            return;
        }
        const transaccion = naviburgerDB.transaction(
            ["pedidosTerminados"],
            "readonly"
        );

        const solicitud = transaccion
            .objectStore("pedidosTerminados")
            .getAll();

        solicitud.onsuccess = () => resolve(solicitud.result);
        solicitud.onerror = () => reject(solicitud.error);
    });
}

function obtenerSiguienteNumeroPedido(fecha = obtenerFechaActual()) {
    return Promise.all([
        obtenerPedidos(),
        obtenerPedidosTerminados()
    ]).then(([activos, terminados]) => {
        const pedidosDelDia = [...activos, ...terminados].filter(
            (pedido) =>
                pedido.fechaCreacion === fecha
        );

        return Math.max(
            0,
            ...pedidosDelDia.map((pedido) => pedido.numero)
        ) + 1;
    });
}


// --------------------------
// FUNCIÓN 'guardarHistorial'
// --------------------------

function guardarHistorial(dia) {
    return new Promise((resolve, reject) => {
        if (!naviburgerDB) {
            reject(new Error("La base de datos no está abierta."));
            return;
        }

        const transaccion = naviburgerDB.transaction(
            ["historial"],
            "readwrite"
        );

        const almacen = transaccion.objectStore("historial");
        let errorOperacion = null;

        const solicitud = almacen.getAll();

        solicitud.onsuccess = () => {
            const yaExiste = solicitud.result.some(
                registro => registro.fecha === dia.fecha
            );

            if (yaExiste) {
                errorOperacion = new Error(
                    `Ya existe un cierre diario para ${dia.fecha}.`
                );
                transaccion.abort();
                return;
            }

            almacen.add(dia);
        };

        solicitud.onerror = () => {
            errorOperacion = solicitud.error;
            transaccion.abort();
        };

        transaccion.oncomplete = () => {
            resolve(dia);
        };

        transaccion.onerror = () => {
            reject(
                errorOperacion ||
                transaccion.error ||
                new Error("No se pudo guardar el cierre diario.")
            );
        };

        transaccion.onabort = () => {
            reject(
                errorOperacion ||
                transaccion.error ||
                new Error("Se canceló el cierre diario.")
            );
        };
    });
}


function obtenerHistorial() {

    return new Promise((resolve, reject) => {

        if (!naviburgerDB) {
            reject(new Error("La base de datos no está abierta."));
            return;
        }

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


async function calcularResumenDelDia(fecha = obtenerFechaActual()) {
    const [activos, terminados] = await Promise.all([
        obtenerPedidos(),
        obtenerPedidosTerminados()
    ]);

    const pedidosPagados = [...activos, ...terminados].filter(
        (pedido) =>
            pedido.estadoPago === "pagado" &&
            pedido.pago?.fecha === fecha
    );

    const productosVendidos = {};
    let ganancias = 0;

    pedidosPagados.forEach((pedido) => {
        pedido.productos.forEach((producto) => {
            const subtotal = producto.precio * producto.cantidad;

            ganancias += subtotal;

            productosVendidos[producto.nombre] =
                (productosVendidos[producto.nombre] || 0) +
                producto.cantidad;
        });
    });

    return {
        pedidos: pedidosPagados,
        productosVendidos,
        ganancias
    };
}


async function cerrarDia(fecha = obtenerFechaActual()) {
    const confirmar = confirm(
        `¿Quieres cerrar el día ${fecha}?\n\n` +
        "Se guardará el resumen de los pedidos cobrados. " +
        "Los pedidos pendientes y terminados se conservarán."
    );

    if (!confirmar) {
        return;
    }

    try {
        const resumen = await calcularResumenDelDia(fecha);

        const dia = {
            id: crypto.randomUUID(),
            fecha,
            pedidos: resumen.pedidos,
            productosVendidos: resumen.productosVendidos,
            ganancias: resumen.ganancias
        };

        await guardarHistorial(dia);

        alert(`Cierre diario de ${fecha} guardado correctamente.`);

        renderizarHistorial();
        actualizarVentas();
    } catch (error) {
        console.error("Error al cerrar el día:", error);

        alert(
            error.message ||
            "No se pudo guardar el cierre diario."
        );
    }
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
