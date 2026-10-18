# 🍔 Naviburger

Aplicación web para gestionar los pedidos, los cobros y las ventas de **Naviburger**. Permite administrar los pedidos del día, registrar pagos, consultar el historial y generar cierres diarios mediante una interfaz adaptable a computadoras y dispositivos móviles.

## 📌 Versión actual

**v1.0.0 — Primera versión estable**

Esta versión reúne las funciones principales de gestión de pedidos y ventas, junto con mejoras visuales y de navegación. Incorpora el registro independiente de pagos y finalización de pedidos, el historial de pedidos terminados y una interfaz renovada con una paleta de colores naranja y crema.

## ✨ Funciones

### 🛒 Gestión de pedidos
- Crear pedidos con diferentes productos y cantidades.
- Consultar y administrar pedidos pendientes.
- Mostrar los productos mediante tarjetas visuales.
- Aumentar y disminuir las cantidades de los productos.
- Calcular el total del pedido en tiempo real.
- Mostrar la cantidad total de artículos seleccionados.
- Crear pedidos desde una barra inferior fija.
- Terminar pedidos sin obligar a registrar un pago.

### 💵 Cobros y ventas
- Registrar pagos de pedidos.
- Calcular el cambio a devolver a partir del importe recibido.
- Validar que el importe recibido cubra el total del pedido.
- Mantener separados el estado del pago y el estado de preparación.
- Consultar las ventas del día.
- Contabilizar únicamente los pedidos pagados en los indicadores de ventas.
- Registrar los ingresos según la fecha de pago.
- Consultar los productos vendidos y los importes correspondientes.

### 📚 Historial y cierres diarios
- Consultar los pedidos terminados individualmente.
- Conservar los pedidos terminados, independientemente de su estado de pago.
- Consultar los detalles de los pedidos y sus importes.
- Generar resúmenes diarios de ventas.
- Guardar el historial de cierres diarios.
- Cerrar el día desde la interfaz.
- Reiniciar la numeración visible de los pedidos al comenzar un nuevo día.
- Conservar los pedidos pendientes y el historial al realizar un cierre diario.

### 🎨 Interfaz
- Diseño visual con colores naranja, crema y amarillo.
- Totales de los pedidos destacados.
- Indicadores visuales para pedidos pagados y pendientes de cobro.
- Navegación mediante pestañas para consultar las ventas, los cierres diarios y los pedidos terminados.
- Diseño adaptable a pantallas pequeñas.
- Controles y formularios integrados en la interfaz.

## 💾 Almacenamiento

La aplicación utiliza una base de datos local de IndexedDB llamada `naviburgerDB`.

Actualmente contiene dos almacenes:

- `pedidos` — registros de pedidos.
- `historial` — registros históricos utilizados por la aplicación.

Los datos se almacenan localmente en el navegador mediante **IndexedDB**, lo que permite conservarlos entre sesiones en el mismo navegador.

> **Importante:** los datos locales no se sincronizan automáticamente entre dispositivos. Borrar los datos del navegador o perder el almacenamiento local puede provocar la pérdida de información. Se recomienda mantener respaldos de los datos importantes.

## 🛠️ Tecnologías

- **HTML5** — estructura de la aplicación.
- **CSS3** — diseño y adaptación a diferentes pantallas.
- **JavaScript** — lógica de pedidos, cobros y ventas.
- **IndexedDB** — almacenamiento local persistente.
- **Git y GitHub** — control de versiones y alojamiento del código.
- **GitHub Pages** — publicación de la aplicación web.

## 🗂️ Estructura del proyecto

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

## 🚀 Roadmap e historial de versiones

- **v0.1** — Sistema funcional básico.
- **v0.2** — Incorporación del menú completo.
- **v0.3** — Integración de la base de datos, persistencia, historial y cierre de día.
- **v0.3.1** — Incorporación del historial en la interfaz.
- **v0.3.2** — Correcciones en el manejo de fechas y prevención de reemplazos accidentales.
- **v0.3.3** — Correcciones adicionales y estado inicial de las pestañas de ventas.
- **v0.4** — Estilización y mejoras visuales generales.
- **v0.5** — Rediseño de la sección de pedidos, tarjetas con ilustraciones y barra inferior fija con resumen del pedido.
- **v0.6.0** — Implementación de cobros, cálculo de cambio, finalización independiente de pedidos, historial de pedidos terminados y ajustes en las ventas.
- **v0.7.0** — Renovación visual, mejoras en la presentación de los pedidos, indicadores de pago y navegación adaptable.
- **v1.0.0** — Primera versión estable que integra las funciones principales de pedidos, cobros, ventas, historial y cierres diarios.

## 🧪 Snapshots y respaldos

- **Snapshot-1** — Pruebas de persistencia y almacenamiento.
- **Snapshot-2** — Pruebas del cierre de día mediante la interfaz.
- **Snapshot-3** — Pruebas para la corrección de fechas.

Los snapshots forman parte del historial de desarrollo y las pruebas del proyecto.

## 🌐 Aplicación publicada

Puedes acceder a la aplicación desde GitHub Pages:

**https://arix0426-beep.github.io/NaviBurger/**

Repositorio: **https://github.com/arix0426-beep/NaviBurger**

## ⚠️ Notas técnicas

Durante la publicación de la versión v0.5, GitHub Pages presentó una demora inusual en el despliegue. El workflow `pages-build-deployment` permaneció en estado `Queued` durante varios días, incluso después de intentar ejecutarlo nuevamente.

Posteriormente, el workflow volvió a ejecutarse sin que fuera necesario modificar el código para resolver el bloqueo. La causa exacta no pudo determinarse, por lo que se documentó como un incidente temporal del proceso de publicación.

Si vuelve a ocurrir, se recomienda revisar GitHub Actions y los registros del workflow antes de modificar el código o la configuración del proyecto.

---

**Naviburger** — Gestión sencilla de pedidos y ventas. 🍔
