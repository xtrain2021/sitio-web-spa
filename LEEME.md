# Marcella Beauty Nails — sitio reorganizado

## 1. Estructura de carpetas

Copia todos estos archivos a la raíz de tu proyecto en VS Code, con la carpeta
`images/` al lado:

```
marcella-beauty-nails/
├── index.html
├── contacto.html
├── manicura.html
├── pedicura.html
├── pedi_spa.html
├── veloterapia.html
├── cabello.html
├── cejas.html
├── pestanas.html
├── style.css
├── script.js
└── images/
```

Los tres archivos de la raíz (`style.css`, `script.js` y las páginas) son los
únicos que existen: **no hay estilos ni scripts repetidos en ningún HTML**.

## 2. Imágenes que debes poner en `images/`

Renombra tus archivos actuales con estos nombres exactos. Usa solo minúsculas,
sin espacios ni tildes: un servidor Linux distingue mayúsculas y los espacios
rompen las rutas.

| Nombre del archivo         | Dónde se usa                        |
|----------------------------|-------------------------------------|
| `logo.png`                 | Header, footer y favicon            |
| `hero-bg.jpg`              | Fondo de la portada                 |
| `marcella.jpg`             | Sección "Sobre mí"                  |
| `manicura-front.jpg`       | Tarjeta y página de manicura        |
| `pedicura.jpg`             | Tarjeta y página de pedicura        |
| `pedispa-detalle.jpg`      | Tarjeta y página de Pedi Spa        |
| `veloterapia-detalle.jpg`  | Tarjeta y página de veloterapia     |
| `cabello.jpg`              | Tarjeta y página de cuidado capilar |
| `cejas.jpg`                | Tarjeta y página de cejas           |
| `pestanas.jpg`             | Tarjeta y página de pestañas        |
| `una1.jpg` … `una9.jpg`    | Galería de la portada               |

Tu logo actual se llama `Logo_fondo rosa letra blanca.png`. Renómbralo a
`logo.png` o, si prefieres conservar el nombre, busca y reemplaza `images/logo.png`
en los 9 HTML.

## 3. Datos que debes reemplazar

Búscalos con `Ctrl + Shift + F` en VS Code y reemplázalos en todos los archivos:

| Buscar                                             | Cambiar por                  |
|----------------------------------------------------|------------------------------|
| `https://www.facebook.com/marcellabeautynails`      | Tu página real de Facebook   |
| `https://www.instagram.com/marcellabeautynails`     | Tu perfil real de Instagram  |
| `573122495747`                                      | Tu número real de WhatsApp   |
| `citas@marcellabeauty.com`                          | Tu correo real               |
| `politicas_privacidad.pdf`                          | Tu PDF, o borra el enlace    |
| `terminos_condiciones.pdf`                          | Tu PDF, o borra el enlace    |

## 4. Conectar el formulario de contacto

Ahora mismo el formulario valida los campos y muestra la confirmación en pantalla,
pero no envía nada. Para que llegue a tu correo:

1. Crea una cuenta gratis en https://formspree.io y copia tu endpoint.
2. En `contacto.html`, añade al `<form>` el atributo `action`:

```html
<form id="form-contacto" action="https://formspree.io/f/TU_CODIGO" method="POST" novalidate>
```

3. En `script.js`, sección **07**, reemplaza el bloque marcado con el comentario
   "Envío real" por:

```js
fetch(formulario.action, {
  method: 'POST',
  body: new FormData(formulario),
  headers: { 'Accept': 'application/json' }
})
  .then(function () {
    if (aviso) {
      aviso.classList.add('visible');
      aviso.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    formulario.reset();
  });
```

## 5. Cómo probarlo

Instala la extensión **Live Server** en VS Code, haz clic derecho sobre
`index.html` y elige *Open with Live Server*.

Abrir el archivo con doble clic también funciona, pero el mapa de Google no carga
desde `file://`.

## 6. Guía rápida del CSS

`style.css` está dividido en 14 secciones numeradas con un índice al inicio.
Los colores y tipografías salen de variables en la sección 01: cambia un valor
ahí y se actualiza todo el sitio.

```css
:root {
  --color-principal: #e8a9d4;   /* Rosa suave */
  --color-secundario: #7d4e68;  /* Malva oscuro */
  --color-acento: #fceef6;      /* Rosa traslúcido */
}
```

Para añadir un servicio nuevo hay que tocar tres puntos:

1. Una tarjeta nueva en la sección de servicios de `index.html`.
2. Un `<li>` en el `<ul class="dropdown-menu">` del header de las 9 páginas.
3. Un `<li>` en la columna "Servicios" del footer de las 9 páginas.

Copia una página de servicio existente como plantilla y cambia solo el bloque
`<main class="service-detail">`.
