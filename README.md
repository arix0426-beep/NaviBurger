# 🍔 Naviburger

Aplicación web para gestionar los pedidos y ventas de **Naviburger**.

## 📌 Versión actual

**v0.3.2**

Esta versión incorpora persistencia de datos mediante **IndexedDB**, permitiendo conservar los pedidos, almacenar y acceder a el historial de los días de operación.

## ✨ Funciones

* Crear pedidos.
* Administrar pedidos pendientes.
* Terminar pedidos.
* Registrar ventas.
* Guardar pedidos de forma persistente.
* Recuperar pedidos al volver a abrir la aplicación.
* Generar un resumen diario.
* Guardar el historial de días.
* Cerrar el día desde la interfaz.
* Reiniciar el contador de pedidos al comenzar un nuevo día.
* Acceder al historial desde la interfaz.

## 💾 Almacenamiento

La aplicación utiliza una base de datos local llamada `naviburgerDB`.

Actualmente contiene dos almacenes:

* `pedidos` — pedidos correspondientes al día actual.
* `historial` — información de días cerrados.

Los datos se almacenan localmente en el navegador mediante IndexedDB.

## 🗂️ Estructura

```text
Naviburger/
├── index.html
├── css/
    └── style.css
└── js/
    ├── app.js
    └── database.js
```

## 🚧 Roadmap

* **v0.1** — Sistema funcional básico.
* **v0.2** — Menú completo real.
* **v0.3** — Integración de base de datos, persistencia, historial y cierre de día.
* **v0.3.1** — Historial en la interfaz.
* **v0.3.2** — Correción del manejo de fechas y prevención de reemplazos accidentales.
* **v0.3.3** — Corrección de fechas.
* **v0.4+** — Estilización y mejoras visuales.

## 🧪 Snapshots

* **Snapshot-1** — Pruebas de persistencia y almacenamiento.
* **Snapshot-2** — Pruebas del cierre de día mediante la interfaz.
* **Snapshot-3** — Pruebas para la corrección de fechas

## ⚠️ Nota

Actualmente, guardar nuevamente un registro utilizando una fecha que ya existe puede reemplazar el registro anterior. Este comportamiento está previsto para ser corregido en **v0.3.2**.
**Arreglado**
