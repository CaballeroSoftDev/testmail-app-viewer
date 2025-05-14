# mail-test-app

Una interfaz web para visualizar correos electrónicos de Testmail.app de forma gráfica.

## Descripción

Esta aplicación permite gestionar y leer correos enviados a un namespace de Testmail.app sin mostrar el JSON directamente, ofreciendo:

- Un modal de configuración para API Key y Namespace.
- Panel lateral con filtros (tag prefix, límite, offset, rango de fechas) y botón de refresco.
- Lista de correos con avatar, asunto, remitente y fecha.
- Panel de lectura con vista detallada del correo (HTML o texto). 

## Funcionalidad principal

1. Configurar API Key y Namespace desde un modal.
2. Filtrar correos por:
   - Tag Prefix
   - Límite y Offset
   - Fecha de envío (desde / hasta)
3. Refrescar la lista de correos sin recargar la página.
4. Navegar la lista con scroll independiente.
5. Ver contenido detallado de cada correo en un panel expandido.

## Tecnologías

- React 19 + TypeScript
- Vite
- Material UI v7 (MUI)
- MUI X Date Pickers (@mui/x-date-pickers)
- date-fns (formato y localización de fechas)

## Instalación

```bash
# Clonar el repositorio
git clone <URL-del-repositorio>
cd mail-test-app

# Instalar dependencias
yarn

# Iniciar en modo desarrollo
yarn dev
```

Abrir en el navegador: `http://localhost:5173`

## Uso

1. Hacer clic en el icono de configuración (engranaje) en la cabecera.
2. Ingresar tu API Key y Namespace.
3. Ajustar los filtros y hacer clic en **REFRESH**.
4. Seleccionar un correo en la lista para ver su contenido.

## Licencia

Este proyecto está bajo la [MIT License](LICENSE).
