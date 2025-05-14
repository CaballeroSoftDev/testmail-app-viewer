# Testmail.app Viewer

Una interfaz web para visualizar correos electrónicos de [Testmail.app](https://testmail.app/) de forma gráfica.

## Descripción

Esta aplicación permite gestionar y leer correos enviados a un namespace de Testmail.app sin mostrar el JSON directamente, ofreciendo:

- Un modal de configuración para API Key y Namespace.
- Panel lateral con filtros (tag prefix, límite, offset, rango de fechas) y botón de refresco.
- Lista de correos con avatar, asunto, remitente y fecha.
- Panel de lectura con vista detallada del correo (HTML o texto). 

## Funcionalidad principal

1. Configurar API Key y Namespace.
2. Filtrar correos por:
   - Tag Prefix
   - Límite y Offset
3. Refrescar la lista de correos sin recargar la página.
4. Navegar la lista con scroll independiente.
5. Ver contenido detallado de cada correo en un panel expandido.

## Tecnologías

- React + TypeScript
- Vite
- Material UI (MUI)

## Instalación

```bash
# Clonar el repositorio
git clone <URL-del-repositorio>
cd testmail-app-viewer

# Instalar dependencias
yarn

# Iniciar en modo desarrollo
yarn dev
```

Abrir en el navegador: `http://localhost:5173`

## Uso

1. Ingresar tu API Key y Namespace.
2. Ajustar los filtros y hacer clic en **REFRESH**.
3. Seleccionar un correo en la lista para ver su contenido.

## Licencia

Este proyecto está bajo la [MIT License](LICENSE).
