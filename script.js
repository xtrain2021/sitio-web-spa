/* =========================================================================
   MARCELLA BEAUTY NAILS - SCRIPT ÚNICO PARA TODAS LAS PÁGINAS
   01. Header que se encoge al hacer scroll
   02. Menú hamburguesa móvil
   03. Menú desplegable de Servicios
   04. Enlace activo según la página abierta
   05. Botón "volver arriba"
   06. Tarjetas giratorias 3D (hover + click + teclado)
   07. Particles.js - Mariposas que siguen el cursor
   08. Galería - Modal expandible
   09. Carrusel Antes / Después
   10. Sanitización anti-XSS para formularios
   ========================================================================= */

   document.addEventListener('DOMContentLoaded', function () {

    /* =========================================================
       01. HEADER QUE SE ENCOGE AL HACER SCROLL
       ========================================================= */
    const header = document.querySelector('.header');
    const btnArriba = document.getElementById('btnArriba');
  
    function alHacerScroll() {
      const y = window.scrollY;
      if (header) header.classList.toggle('scrolled', y > 60);
      if (btnArriba) btnArriba.classList.toggle('visible', y > 350);
    }
  
    window.addEventListener('scroll', alHacerScroll, { passive: true });
    alHacerScroll();
  
    /* =========================================================
       02. MENÚ HAMBURGUESA MÓVIL
       ========================================================= */
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('nav');
  
    function cerrarMenuMovil() {
      if (!nav) return;
      nav.classList.remove('active');
      if (menuToggle) {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      }
      document.body.style.overflow = '';
    }
  
    if (menuToggle && nav) {
      menuToggle.addEventListener('click', function () {
        const abierto = nav.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', String(abierto));
        menuToggle.innerHTML = abierto
          ? '<i class="fa-solid fa-xmark"></i>'
          : '<i class="fa-solid fa-bars"></i>';
        document.body.style.overflow = abierto ? 'hidden' : '';
      });
  
      nav.querySelectorAll('a').forEach(function (enlace) {
        enlace.addEventListener('click', function () {
          if (window.innerWidth <= 992 && !enlace.classList.contains('dropdown-toggle')) {
            cerrarMenuMovil();
          }
        });
      });
    }
  
    /* =========================================================
       03. MENÚ DESPLEGABLE DE SERVICIOS
       ========================================================= */
    const dropdowns = document.querySelectorAll('.dropdown');
  
    dropdowns.forEach(function (dropdown) {
      const toggle = dropdown.querySelector('.dropdown-toggle');
      if (!toggle) return;
  
      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        const estaAbierto = dropdown.classList.contains('is-open');
  
        dropdowns.forEach(function (d) {
          d.classList.remove('is-open');
          const t = d.querySelector('.dropdown-toggle');
          if (t) t.setAttribute('aria-expanded', 'false');
        });
  
        if (!estaAbierto) {
          dropdown.classList.add('is-open');
          toggle.setAttribute('aria-expanded', 'true');
        }
      });
    });
  
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.dropdown')) {
        dropdowns.forEach(function (d) {
          d.classList.remove('is-open');
          const t = d.querySelector('.dropdown-toggle');
          if (t) t.setAttribute('aria-expanded', 'false');
        });
      }
    });
  
    /* =========================================================
       04. ENLACE ACTIVO SEGÚN LA PÁGINA ABIERTA
       ========================================================= */
    const pathActual = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav a').forEach(function (enlace) {
      const href = enlace.getAttribute('href') || '';
      if (href === pathActual) enlace.classList.add('active');
    });
  
    /* =========================================================
       05. BOTÓN VOLVER ARRIBA
       ========================================================= */
    if (btnArriba) {
      btnArriba.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  
    /* =========================================================
       06. TARJETAS GIRATORIAS 3D (MEJORAS PASOS 1 Y 2)
       Giro activado ÚNICAMENTE por el botón "Toca para ver más"
       ========================================================= */
    const tarjetas = document.querySelectorAll('.flip-card');
  
    tarjetas.forEach(function (tarjeta) {
      const btnGirar = tarjeta.querySelector('.card-hint');
      const enlaces = tarjeta.querySelectorAll('a');

      function girarTarjeta(forzarEstado) {
        const estaGirada = tarjeta.classList.contains('flipped');
        const nuevoEstado = typeof forzarEstado === 'boolean' ? forzarEstado : !estaGirada;

        // Si se va a abrir, cerramos cualquier otra tarjeta abierta previamente
        if (nuevoEstado) {
          tarjetas.forEach(function (otra) {
            if (otra !== tarjeta) {
              otra.classList.remove('flipped');
              otra.setAttribute('aria-pressed', 'false');
            }
          });
        }

        tarjeta.classList.toggle('flipped', nuevoEstado);
        tarjeta.setAttribute('aria-pressed', String(nuevoEstado));
      }

      // [MEJORA PASO 1]: El giro se activa ÚNICAMENTE al hacer clic en "Toca para ver más"
      if (btnGirar) {
        btnGirar.setAttribute('tabindex', '0');
        btnGirar.setAttribute('role', 'button');
        btnGirar.setAttribute('aria-label', 'Ver más información del servicio');

        btnGirar.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          girarTarjeta();
        });

        btnGirar.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            girarTarjeta();
          }
        });
      }

      // [MEJORA PASO 2]: Garantizar que los enlaces y botones (ej: "Agendar cita") no interfieran con el giro
      // y permitan la navegación y redirección directa a la página destino
      enlaces.forEach(function (enlace) {
        enlace.addEventListener('click', function (e) {
          e.stopPropagation(); // Evita que el contenedor capture el clic y cancele la redirección
        });
      });

      // Permitir hacer clic en el reverso de la tarjeta (fuera del enlace) para regresar al frente
      const reverso = tarjeta.querySelector('.flip-card-back');
      if (reverso) {
        reverso.addEventListener('click', function (e) {
          if (e.target.closest('a')) return;
          girarTarjeta(false);
        });
      }
    });
  
    // Clic fuera de cualquier tarjeta desactiva el giro y la regresa al frente
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.flip-card')) {
        tarjetas.forEach(function (t) {
          t.classList.remove('flipped');
          t.setAttribute('aria-pressed', 'false');
        });
      }
    });
  
    /* =========================================================
       07. MARIPOSAS SUTILES Y ELEGANTES QUE SIGUEN EL CURSOR (MEJORA PASO 7)
       Sistema nativo Canvas 60 FPS con aleteo fluido y atracción al cursor
       ========================================================= */
    const contenedorParticulas = document.getElementById('particles-js');
    const heroBanner = document.getElementById('inicio');

    if (contenedorParticulas && heroBanner) {
      // Limpiar contenedor previo
      contenedorParticulas.innerHTML = '';

      const canvas = document.createElement('canvas');
      canvas.className = 'butterflies-canvas';
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.pointerEvents = 'none';
      contenedorParticulas.appendChild(canvas);

      const ctx = canvas.getContext('2d');
      let ancho = 0;
      let alto = 0;
      let animId = null;

      // Paleta sutil del spa para las mariposas (tonos rosados, dorados y champán)
      const coloresMariposas = [
        'rgba(232, 169, 212, 0.75)', // Rosa principal
        'rgba(216, 163, 196, 0.8)',  // Rosa medio
        'rgba(212, 175, 55, 0.7)',   // Dorado sutil
        'rgba(247, 214, 230, 0.85)', // Rosa champán
        'rgba(252, 238, 246, 0.8)'   // Acento suave
      ];

      function ajustarTamano() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        ancho = contenedorParticulas.clientWidth;
        alto = contenedorParticulas.clientHeight;
        canvas.width = ancho * dpr;
        canvas.height = alto * dpr;
        ctx.scale(dpr, dpr);
      }

      ajustarTamano();
      window.addEventListener('resize', ajustarTamano, { passive: true });

      // Estado del cursor
      const mouse = {
        x: ancho / 2,
        y: alto / 2,
        dentro: false
      };

      heroBanner.addEventListener('mousemove', function (e) {
        const rect = heroBanner.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.dentro = true;
      }, { passive: true });

      heroBanner.addEventListener('mouseleave', function () {
        mouse.dentro = false;
      }, { passive: true });

      // Generar 20 mariposas elegantes
      const totalMariposas = window.innerWidth < 768 ? 12 : 22;
      const mariposas = [];

      for (let i = 0; i < totalMariposas; i++) {
        mariposas.push({
          x: Math.random() * (ancho || 800),
          y: Math.random() * (alto || 500),
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2,
          size: 10 + Math.random() * 8, // Tamaño delicado (10-18px)
          color: coloresMariposas[i % coloresMariposas.length],
          wingAngle: Math.random() * Math.PI * 2,
          wingSpeed: 0.12 + Math.random() * 0.08,
          angulo: 0,
          opacidad: 0.65 + Math.random() * 0.3,
          faseFlotacion: Math.random() * Math.PI * 2
        });
      }

      function dibujarMariposa(b) {
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.angulo);

        const flap = Math.sin(b.wingAngle);
        const wingScale = 0.25 + 0.75 * Math.abs(flap);

        ctx.globalAlpha = b.opacidad;

        // Ala izquierda
        ctx.save();
        ctx.scale(-wingScale, 1);
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-b.size * 1.2, -b.size * 1.4, -b.size * 1.5, -b.size * 0.3, -b.size * 0.8, b.size * 0.4);
        ctx.bezierCurveTo(-b.size * 1.3, b.size * 0.9, -b.size * 0.5, b.size * 1.3, 0, b.size * 0.5);
        ctx.closePath();
        ctx.fill();

        // Destello interior suave
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-b.size * 0.6, -b.size * 0.7, -b.size * 0.8, -b.size * 0.2, -b.size * 0.4, b.size * 0.2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Ala derecha
        ctx.save();
        ctx.scale(wingScale, 1);
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-b.size * 1.2, -b.size * 1.4, -b.size * 1.5, -b.size * 0.3, -b.size * 0.8, b.size * 0.4);
        ctx.bezierCurveTo(-b.size * 1.3, b.size * 0.9, -b.size * 0.5, b.size * 1.3, 0, b.size * 0.5);
        ctx.closePath();
        ctx.fill();

        // Destello interior derecho
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-b.size * 0.6, -b.size * 0.7, -b.size * 0.8, -b.size * 0.2, -b.size * 0.4, b.size * 0.2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Cuerpo central estético
        ctx.fillStyle = 'rgba(125, 78, 104, 0.75)';
        ctx.beginPath();
        ctx.ellipse(0, 0, b.size * 0.12, b.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Antenas sutiles
        ctx.strokeStyle = 'rgba(125, 78, 104, 0.6)';
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(0, -b.size * 0.4);
        ctx.quadraticCurveTo(-b.size * 0.25, -b.size * 0.75, -b.size * 0.2, -b.size * 0.85);
        ctx.moveTo(0, -b.size * 0.4);
        ctx.quadraticCurveTo(b.size * 0.25, -b.size * 0.75, b.size * 0.2, -b.size * 0.85);
        ctx.stroke();

        ctx.restore();
      }

      function animar() {
        ctx.clearRect(0, 0, ancho, alto);

        for (let i = 0; i < mariposas.length; i++) {
          const b = mariposas[i];

          // Aleteo continuo de las alas
          b.wingAngle += b.wingSpeed;
          b.faseFlotacion += 0.03;

          // Física de atracción fluida hacia el cursor cuando está dentro del banner
          if (mouse.dentro) {
            const dx = mouse.x - b.x;
            const dy = mouse.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 30) {
              // Fuerza elástica hacia el cursor
              const fuerza = Math.min(dist * 0.00035, 0.08);
              b.vx += (dx / dist) * fuerza;
              b.vy += (dy / dist) * fuerza;

              // Fuerza orbital suave (para evitar que se apelmacen en un único punto)
              const fuerzaOrbital = 0.03;
              b.vx += (-dy / dist) * fuerzaOrbital;
              b.vy += (dx / dist) * fuerzaOrbital;
            }
          } else {
            // Movimiento errante natural cuando el cursor no está activo
            b.vx += Math.sin(b.faseFlotacion) * 0.02;
            b.vy += Math.cos(b.faseFlotacion * 0.8) * 0.02;
          }

          // Fricción / amortiguación suave
          b.vx *= 0.96;
          b.vy *= 0.96;

          // Límites de velocidad máxima para movimiento relajante
          const maxVel = mouse.dentro ? 2.8 : 1.6;
          const velActual = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
          if (velActual > maxVel) {
            b.vx = (b.vx / velActual) * maxVel;
            b.vy = (b.vy / velActual) * maxVel;
          }

          // Actualizar posición
          b.x += b.vx;
          b.y += b.vy;

          // Orientar el cuerpo hacia la dirección del vuelo
          b.angulo = Math.atan2(b.vy, b.vx) + Math.PI / 2;

          // Envoltura de bordes en pantalla
          const margen = 35;
          if (b.x < -margen) b.x = ancho + margen;
          if (b.x > ancho + margen) b.x = -margen;
          if (b.y < -margen) b.y = alto + margen;
          if (b.y > alto + margen) b.y = -margen;

          dibujarMariposa(b);
        }

        animId = requestAnimationFrame(animar);
      }

      // Iniciar animación si no está desactivada por accesibilidad
      const prefiereReducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefiereReducido) {
        animId = requestAnimationFrame(animar);
      }
    }
  
    /* =========================================================
       08. GALERÍA - MODAL EXPANDIBLE
       ========================================================= */
    const modal = document.getElementById('modal-galeria');
    const modalImg = document.getElementById('modal-img');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalClose = document.getElementById('modal-close');
    const galleryItems = document.querySelectorAll('.gallery-item');
  
    function abrirModal(item) {
      const img = item.querySelector('img');
      const titulo = item.dataset.title || (img ? img.alt : 'Galería');
      if (!img || !modal) return;
  
      modalImg.src = img.src;
      modalImg.alt = img.alt || titulo;
      modalTitulo.textContent = titulo;
      modal.classList.add('visible');
      document.body.style.overflow = 'hidden';
    }
  
    function cerrarModal() {
      if (!modal) return;
      modal.classList.remove('visible');
      document.body.style.overflow = '';
    }
  
    galleryItems.forEach(function (item) {
      item.addEventListener('click', function () { abrirModal(item); });
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          abrirModal(item);
        }
      });
    });
  
    if (modalClose) modalClose.addEventListener('click', cerrarModal);
  
    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) cerrarModal();
      });
    }
  
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') cerrarModal();
    });
  
    /* =========================================================
       09. CARRUSEL ANTES / DESPUÉS + TESTIMONIOS
       ========================================================= */
    const adSlider = document.getElementById('ad-slider');
    const adAntes = document.getElementById('ad-antes');
    const adDespues = document.getElementById('ad-despues');
    const adHandle = document.getElementById('ad-handle');
    const adTestimonio = document.getElementById('ad-testimonio');
    const adAutor = document.getElementById('ad-autor');
    const adPrev = document.querySelector('.ad-prev');
    const adNext = document.querySelector('.ad-next');
  
    const testimonios = [
      {
        antes: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=1200&q=80',
        despues: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1200&q=80',
        texto: 'Nunca me habían durado tanto unas uñas acrílicas. El servicio es increíble.',
        autor: 'Andrea G.'
      },
      {
        antes: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80',
        despues: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=80',
        texto: 'La veloterapia es súper relajante y mi cabello quedó brillante.',
        autor: 'Valentina R.'
      },
      {
        antes: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=1200&q=80',
        despues: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=1200&q=80',
        texto: 'El Pedi Spa es delicioso, me relajé tanto que casi me duermo.',
        autor: 'Camila M.'
      }
    ];
  
    let adIndex = 0;
  
    function renderTestimonio(i) {
      adIndex = (i + testimonios.length) % testimonios.length;
      const t = testimonios[adIndex];
      if (adAntes) adAntes.src = t.antes;
      if (adDespues) adDespues.src = t.despues;
      if (adTestimonio) adTestimonio.textContent = '"' + t.texto + '"';
      if (adAutor) adAutor.textContent = '— ' + t.autor;
    }
  
    if (adPrev) adPrev.addEventListener('click', function () { renderTestimonio(adIndex - 1); });
    if (adNext) adNext.addEventListener('click', function () { renderTestimonio(adIndex + 1); });
  
    // Slider comparador (arrastrar handle)
    if (adSlider && adHandle) {
      let arrastrando = false;
  
      function moverHandle(clientX) {
        const rect = adSlider.getBoundingClientRect();
        let x = clientX - rect.left;
        x = Math.max(0, Math.min(x, rect.width));
        const porcentaje = (x / rect.width) * 100;
        adHandle.style.left = porcentaje + '%';
        if (adDespues) adDespues.style.clipPath = 'inset(0 ' + (100 - porcentaje) + '% 0 0)';
        adSlider.setAttribute('aria-valuenow', Math.round(porcentaje));
        adSlider.classList.toggle('comparando', porcentaje > 50);
      }
  
      adHandle.addEventListener('mousedown', function () { arrastrando = true; });
      adSlider.addEventListener('mousemove', function (e) { if (arrastrando) moverHandle(e.clientX); });
      document.addEventListener('mouseup', function () { arrastrando = false; });
  
      adHandle.addEventListener('touchstart', function () { arrastrando = true; }, { passive: true });
      adSlider.addEventListener('touchmove', function (e) {
        if (arrastrando) moverHandle(e.touches[0].clientX);
      }, { passive: true });
      document.addEventListener('touchend', function () { arrastrando = false; });
  
      // Posición inicial
      adDespues.style.clipPath = 'inset(0 50% 0 0)';
    }
  
    /* =========================================================
       10. SANITIZACIÓN ANTI-XSS PARA FORMULARIOS
       ========================================================= */
    function sanitizar(input) {
      if (typeof input !== 'string') return '';
      // Bloquea etiquetas, atributos y caracteres peligrosos
      return input
        .replace(/[<>]/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '')
        .replace(/content\s*=/gi, '')
        .replace(/[\\/]{2,}/g, '')
        .trim();
    }
  
    function validarEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    }
  
    const formulario = document.getElementById('form-contacto');
  
    if (formulario) {
      formulario.addEventListener('submit', function (e) {
        e.preventDefault();
  
        const nombre = sanitizar(formulario.querySelector('#nombre')?.value || '');
        const email = sanitizar(formulario.querySelector('#email')?.value || '');
        const telefono = sanitizar(formulario.querySelector('#telefono')?.value || '');
        const servicio = sanitizar(formulario.querySelector('#servicio')?.value || '');
        const mensaje = sanitizar(formulario.querySelector('#mensaje')?.value || '');
  
        let valido = true;
  
        if (nombre.length < 3) valido = false;
        if (!validarEmail(email)) valido = false;
        if (telefono.replace(/\D/g, '').length < 7) valido = false;
        if (mensaje.length < 10) valido = false;
  
        if (!valido) {
          alert('Por favor revisa los campos del formulario. Algunos datos están incompletos.');
          return;
        }
  
        // 🔽 Envío real al backend (Formspree, EmailJS, PHP, etc.)
        console.log('Datos sanitizados listos para enviar:', { nombre, email, telefono, servicio, mensaje });
  
        const aviso = document.getElementById('form-aviso');
        if (aviso) {
          aviso.classList.add('visible');
          aviso.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
  
        formulario.reset();
      });
    }
  
    /* =========================================================
       INICIALIZACIÓN
       ========================================================= */
    renderTestimonio(0);
  });