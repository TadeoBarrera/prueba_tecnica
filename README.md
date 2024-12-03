# **Sistema de Solicitud de Crédito**

Este proyecto es una aplicación React que permite a los usuarios completar una solicitud de crédito. La aplicación evalúa la solicitud utilizando una base de datos SQLite, la cual se guarda y restaura automáticamente en el almacenamiento local del navegador (LocalStorage). Además, incluye validaciones basadas en criterios específicos.

---

## **Características**

- **Formulario de Solicitud de Crédito**: Captura información como nombre, RFC, fecha de nacimiento, ingresos mensuales y monto solicitado.
- **Validaciones**: Verifica:
  - La edad mínima requerida (mayor de 18 años).
  - Historial crediticio del usuario.
  - Si hay solicitudes en proceso.
- **Persistencia de Datos**:
  - Guarda los datos en LocalStorage para que persistan entre recargas de la página.
  - Utiliza SQLite a través de `sql.js`.
- **Registro Automático**: Si un cliente no existe en la base de datos, se registra automáticamente.

---

## **Requisitos Previos**

- **Node.js**: Asegúrate de tener Node.js instalado para ejecutar el servidor de desarrollo.
- **Gestor de Paquetes**: Usa npm.
- **Dependencias del Proyecto**:
  - `react`, `react-dom`: Framework y librerías para construir la UI.
  - `sql.js`: Para manejar SQLite en el navegador.
  - `typescript`: Para añadir tipado estático al proyecto.
  - `tailwind`: Para darle estilos al programa.

---