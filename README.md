# 🍔 Naviburger

Aplicación web para gestionar los pedidos y las ventas de **Naviburger**.

## 📌 Versión actual

**v0.5**

Esta versión incorpora un rediseño de la sección de pedidos, con tarjetas visuales para los productos y una barra inferior fija para consultar el total y crear pedidos fácilmente.

## ✨ Funciones

- Crear pedidos.
- Administrar pedidos pendientes.
- Terminar pedidos.
- Registrar ventas.
- Guardar pedidos de forma persistente.
- Recuperar pedidos al volver a abrir la aplicación.
- Generar un resumen diario.
- Guardar el historial de días.
- Cerrar el día desde la interfaz.
- Reiniciar el contador de pedidos al comenzar un nuevo día.
- Acceder al historial desde la interfaz.
- Mostrar los productos del menú mediante tarjetas con ilustraciones.
- Aumentar y disminuir las cantidades de cada producto.
- Mostrar el precio total del pedido en tiempo real.
- Mostrar la cantidad total de artículos seleccionados.
- Crear pedidos desde una barra inferior fija.
- Adaptar la interfaz a pantallas pequeñas y evitar que la barra inferior cubra los productos.

## 💾 Almacenamiento

La aplicación utiliza una base de datos local llamada `naviburgerDB`.

Actualmente contiene dos almacenes:

- `pedidos` — pedidos correspondientes al día actual.
- `historial` — información de días cerrados.

Los datos se almacenan localmente en el navegador mediante **IndexedDB**.

## 🗂️ Estructura

```text
Naviburger/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   └── database.js
└── images/
    └── imágenes de los productos
```

## 🚀 Roadmap

- **v0.1** — Sistema funcional básico.
- **v0.2** — Menú completo real.
- **v0.3** — Integración de base de datos, persistencia, historial y cierre de día.
- **v0.3.1** — Historial en la interfaz.
- **v0.3.2** — Correcciones en el manejo de fechas y prevención de reemplazos accidentales.
- **v0.3.3** — Correcciones adicionales y estado inicial de las pestañas de ventas.
- **v0.4** — Estilización y mejoras visuales generales.
- **v0.5** — Rediseño de la sección de pedidos, tarjetas con ilustraciones y barra inferior fija con resumen del pedido.

## 🧪 Snapshots

- **Snapshot-1** — Pruebas de persistencia y almacenamiento.
- **Snapshot-2** — Pruebas del cierre de día mediante la interfaz.
- **Snapshot-3** — Pruebas para la corrección de fechas.

## ⚠️ Notas

- Los datos se almacenan localmente en el navegador. No se sincronizan automáticamente entre dispositivos o navegadores.
- Se recomienda realizar pruebas antes de utilizar la aplicación para gestionar ventas reales.
- Las correcciones relacionadas con el manejo de fechas se documentaron en las versiones v0.3.2 y v0.3.3.

