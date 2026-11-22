# Sitio personal · Hidráulica digital

Sitio estático de ocho secciones para un perfil de ingeniería física, recursos hídricos e hidráulica digital. No tiene dependencias, no requiere compilación y está listo para publicarse en Vercel desde GitHub.

- **Stack:** HTML, CSS y JavaScript del navegador. Sin frameworks, sin `npm install`.
- **Páginas:** inicio, perfil, investigación, docencia, hidráulica digital, publicaciones, recursos y contacto.
- **Extras:** modo claro y oscuro, menú móvil, `404.html`, `sitemap.xml`, `robots.txt`, manifiesto e imagen para redes sociales.

---

## 1. Por qué este orden de secciones

El recorrido está pensado para tres visitantes: un colega que evalúa colaborar, un estudiante que busca material y una institución que revisa credenciales. El orden va de identidad a evidencia y de evidencia a contacto.

| # | Sección | Función | Por qué va ahí |
|---|---------|---------|----------------|
| 1 | **Inicio** | Quién eres y qué haces, en diez segundos | Es la única página que casi todos ven. Debe responder las tres preguntas básicas y ofrecer dos rutas: perfil y líneas de trabajo. |
| 2 | **Perfil** | Formación, trayectoria y enfoque | Da credibilidad antes de pedir tiempo. Un currículo extenso va aquí, no en la portada. |
| 3 | **Investigación** | Líneas, grupo y proyectos | Es el corazón académico. Va antes de docencia porque define la agenda y atrae colaboraciones. |
| 4 | **Docencia** | Cursos, método y materiales | Interesa a estudiantes y a quienes evalúan tu experiencia formativa. Prepara el camino a recursos. |
| 5 | **Hidráulica digital** | Herramientas, método y principios | Es tu diferenciador. Debe ir después de la credibilidad y antes de la producción, porque explica cómo trabajas, no solo qué has publicado. |
| 6 | **Publicaciones** | Artículos, ponencias, software | Es evidencia, no presentación. Quien llega hasta aquí ya quiere verificar. |
| 7 | **Recursos** | Guías, plantillas, scripts y datos | Convierte conocimiento en utilidad y da razones para volver. |
| 8 | **Contacto** | Correo, afiliación y temas | Cierra el recorrido. No debe competir con el contenido en el menú. |

Regla de mantenimiento: si una sección deja de tener contenido real, se oculta del menú en lugar de llenarse con texto genérico.

---

## 2. Estructura de archivos

```
.
├── index.html                 Inicio
├── sobre-mi.html              Perfil
├── investigacion.html         Investigación
├── docencia.html              Docencia
├── hidraulica-digital.html    Método y herramientas
├── publicaciones.html         Producción académica
├── recursos.html              Recursos
├── contacto.html              Contacto
├── 404.html                   Página de error
├── assets/
│   ├── css/styles.css         Todos los estilos y las variables de color
│   ├── js/main.js             Tema, menú móvil, año del pie
│   └── img/                   Favicon, iconos, imagen social
├── site.webmanifest           Instalación como aplicación
├── vercel.json                URLs limpias, cabeceras y caché
├── robots.txt
├── sitemap.xml
└── .gitignore
```

Cada página repite el encabezado y el pie. Si cambias un enlace del menú, cámbialo en las ocho páginas (o vuelve a generarlas con la plantilla que uses).

---

## 3. Ver el sitio en el computador

Desde la carpeta del proyecto:

```bash
python3 -m http.server 8000
```

Abre `http://localhost:8000`. Abrir `index.html` con doble clic también funciona, pero el servidor local reproduce mejor las rutas y el manifiesto.

---

## 4. Marcadores que debes reemplazar antes de publicar

Busca y reemplaza en todos los archivos. Son los únicos datos inventados o pendientes.

| Marcador | Dónde aparece | Qué poner |
|----------|---------------|-----------|
| `[Nombre completo]` | Pie de las ocho páginas y metadato `author` | Tu nombre y apellidos |
| `[Institución y año]` | `sobre-mi.html`, tres veces | Institución y año de cada título |
| `contacto@tudominio.com` | `contacto.html`, dos veces (texto y `mailto`) | Tu correo real |
| `https://tu-dominio.vercel.app` | `sitemap.xml`, `robots.txt` | Tu dominio final |
| `assets/img/og.png` | `og:image` en las ocho páginas | Ruta relativa que funciona, pero algunas redes piden URL absoluta: `https://tu-dominio/og.png` |
| Perfiles ORCID, Scholar, GitHub, LinkedIn | `contacto.html`, bloque comentado al final | Descomenta y pega tus enlaces |

Además, revisa estos textos que describen tu trabajo y ajústalos a tu caso:

- La lista de cursos y sus temarios en `docencia.html`.
- Las líneas de investigación en `investigacion.html`.
- La descripción del grupo en `sobre-mi.html` e `investigacion.html`.
- Los correos de invitación de los bloques finales.

Sugerencia: añade también un `link rel="canonical"` con tu dominio final en cada página y un bloque JSON-LD de tipo `Person` con nombre, afiliación y `sameAs` de tus perfiles.

---

## 5. Crear el repositorio en GitHub

La carpeta ya es un repositorio Git con un primer commit en la rama `main`.

1. Crea un repositorio vacío en <https://github.com/new>. No marques README, licencia ni `.gitignore`: ya existen aquí.
2. Conecta el remoto y sube:

```bash
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
git branch -M main
git push -u origin main
```

Si el primer commit aparece a nombre de "Sitio personal", corrígelo antes de subir:

```bash
git config user.name "Tu Nombre"
git config user.email "tu-correo@ejemplo.com"
git commit --amend --reset-author --no-edit
git push -u origin main
```

También puedes subir los archivos con la interfaz web de GitHub, pero perderás el historial inicial.

---

## 6. Desplegar en Vercel

1. Entra a <https://vercel.com> e inicia sesión con GitHub.
2. **Add New → Project** e importa el repositorio.
3. En la configuración del proyecto:
   - **Framework Preset:** Other
   - **Build Command:** vacío
   - **Output Directory:** vacío o `.`
   - **Install Command:** vacío
4. Pulsa **Deploy**. La primera publicación tarda menos de un minuto.
5. Cada `git push` a `main` genera un despliegue nuevo.

El archivo `vercel.json` ya activa URLs limpias: `https://tu-proyecto.vercel.app/sobre-mi` funciona sin `.html`.

### Dominio propio

En Vercel: **Project → Settings → Domains → Add**. Agrega el dominio y sigue el registro DNS que indique la plataforma (normalmente `A` para el dominio raíz y `CNAME` para `www`). Cuando el dominio esté activo, actualiza `sitemap.xml`, `robots.txt` y `og:image`.

### Alternativa por línea de comandos

```bash
npm i -g vercel
vercel login
vercel --prod
```

La CLI abre el navegador para autenticarte; no requiere tarjeta para el plan gratuito.

---

## 7. Cómo mantenerlo

- **Publicación nueva:** copia el bloque comentado al final de `publicaciones.html` y completa título, autores, revista o evento, año y enlace.
- **Recurso nuevo:** reemplaza una tarjeta de "En preparación" por un enlace real en `recursos.html`.
- **Cambio de tema:** los colores están en las variables de `:root` y `[data-theme="dark"]` al inicio de `styles.css`.
- **Nueva sección:** duplica una página, cambia el `<title>`, la descripción, el `aria-current` del menú y añade el enlace en las ocho páginas y en el pie.

---

## 8. Verificación realizada

- Las nueve páginas cargan sin errores de consola.
- Sin desbordamiento horizontal en 1440, 900 y 390 píxeles.
- Navegación y enlaces internos sin destinos rotos.
- Modo oscuro con persistencia en `localStorage`.
- Menú móvil con estado `aria-expanded` correcto.
- Un solo `h1` por página, `lang="es"` y texto alternativo en los iconos decorativos.
- Contraste revisado en textos principales; los marcadores usan color ámbar a propósito.

---

## 9. Licencia y contenido

El código puede publicarse con la licencia que prefieras. El contenido académico, las fotografías y los datos de terceros requieren revisión aparte antes de hacerse públicos.
