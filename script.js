document.addEventListener('DOMContentLoaded', function () {

  /* 01. HEADER QUE SE ENCOGE AL SCROLL */
  const header = document.querySelector('.header');
  const btnArriba = document.getElementById('btnArriba');

  function alHacerScroll() {
    const y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 60);
    if (btnArriba) btnArriba.classList.toggle('visible', y > 350);
  }
  window.addEventListener('scroll', alHacerScroll, { passive: true });
  alHacerScroll();

  /* 02. MENÚ HAMBURGUESA MÓVIL */
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
      menuToggle.innerHTML = abierto ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
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
  /* 03. MENÚ DESPLEGABLE DE SERVICIOS */
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

  /* 04. ENLACE ACTIVO */
  const pathActual = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(function (enlace) {
    const href = enlace.getAttribute('href') || '';
    if (href === pathActual) enlace.classList.add('active');
  });

  /* 05. BOTÓN VOLVER ARRIBA */
  if (btnArriba) {
    btnArriba.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  /* 06. TARJETAS GIRATORIAS TÁCTILES */
  const tarjetas = document.querySelectorAll('.flip-card');
  tarjetas.forEach(function (tarjeta) {
    const btnGirar = tarjeta.querySelector('.card-hint');
    const enlaces = tarjeta.querySelectorAll('a');

    function girarTarjeta(forzarEstado) {
      const estaGirada = tarjeta.classList.contains('flipped');
      const nuevoEstado = typeof forzarEstado === 'boolean' ? forzarEstado : !estaGirada;
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

    if (btnGirar) {
      btnGirar.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        girarTarjeta();
      });
    }

    /* Toda la tarjeta gira y se devuelve al hacer clic en cualquier punto
       (donde el cursor ya se ve como manito, gracias a cursor:pointer en
       .flip-card). El botón "Ver detalles" queda excluido: su propio
       listener de abajo hace stopPropagation, así que un clic ahí nunca
       llega hasta aquí y el enlace navega con normalidad. */
    tarjeta.addEventListener('click', function (e) {
      if (e.target.closest('a')) return;
      girarTarjeta();
    });

    enlaces.forEach(function (enlace) {
      let navegoPorToque = false;
      enlace.addEventListener('touchend', function (e) {
        if (!enlace.href) return;
        e.preventDefault(); e.stopPropagation();
        navegoPorToque = true;
        window.location.href = enlace.href;
      }, { passive: false });

      enlace.addEventListener('click', function (e) {
        e.stopPropagation();
        if (navegoPorToque) { e.preventDefault(); navegoPorToque = false; }
      });
    });
  });
  /* 07. CANVAS DE MARIPOSAS REALES, FLUIDAS Y MODERADAMENTE RÁPIDAS */
  const contenedorParticulas = document.getElementById('particles-js');
  const heroBanner = document.getElementById('inicio');

  if (contenedorParticulas && heroBanner) {
    contenedorParticulas.innerHTML = '';
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute'; canvas.style.inset = '0';
    canvas.style.pointerEvents = 'none';
    contenedorParticulas.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    
    let ancho, alto;
    function ajustarTamano() {
      ancho = canvas.width = contenedorParticulas.clientWidth;
      alto = canvas.height = contenedorParticulas.clientHeight;
    }
    ajustarTamano();
    window.addEventListener('resize', ajustarTamano, { passive: true });

    const mouse = { x: ancho / 2, y: alto / 2, dentro: false };
    let heroRect = heroBanner.getBoundingClientRect();
    
    window.addEventListener('scroll', () => { heroRect = heroBanner.getBoundingClientRect(); }, { passive: true });
    window.addEventListener('resize', () => { heroRect = heroBanner.getBoundingClientRect(); }, { passive: true });

    heroBanner.addEventListener('mousemove', function (e) {
      mouse.x = e.clientX - heroRect.left;
      mouse.y = e.clientY - heroRect.top;
      mouse.dentro = true;
    }, { passive: true });

    heroBanner.addEventListener('mouseleave', () => { mouse.dentro = false; }, { passive: true });

    const mariposas = [];
    const colores = ['rgba(232, 169, 212, 0.85)', 'rgba(212, 175, 55, 0.8)', 'rgba(247, 214, 230, 0.9)'];
    const total = window.innerWidth < 768 ? 12 : 22;

    for (let i = 0; i < total; i++) {
      mariposas.push({
        x: Math.random() * ancho, y: Math.random() * alto,
        vx: (Math.random() - 0.5) * 2.5, vy: (Math.random() - 0.5) * 2.5,
        size: 12 + Math.random() * 6, color: colores[i % colores.length],
        wingAngle: Math.random() * Math.PI, wingSpeed: 0.22, fase: Math.random() * 10
      });
    }
    function dibujarMariposa(b) {
      ctx.save();
      ctx.translate(b.x, b.y);
      let anguloVuelo = Math.atan2(b.vy, b.vx) + Math.PI / 2;
      ctx.rotate(anguloVuelo);
      let flap = Math.abs(Math.sin(b.wingAngle));
      
      ctx.fillStyle = b.color;
      
      // Ala Superior Izquierda Profesional
      ctx.beginPath();
      ctx.moveTo(0, -b.size * 0.2);
      ctx.bezierCurveTo(-b.size * 1.3 * flap, -b.size * 1.1, -b.size * 1.5 * flap, -b.size * 0.1, 0, b.size * 0.1);
      ctx.fill();
      
      // Ala Superior Derecha Profesional
      ctx.beginPath();
      ctx.moveTo(0, -b.size * 0.2);
      ctx.bezierCurveTo(b.size * 1.3 * flap, -b.size * 1.1, b.size * 1.5 * flap, -b.size * 0.1, 0, b.size * 0.1);
      ctx.fill();

      // Ala Inferior Izquierda
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-b.size * 1.0 * flap, b.size * 0.2, -b.size * 0.8 * flap, b.size * 1.0, 0, b.size * 0.4);
      ctx.fill();

      // Ala Inferior Derecha
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(b.size * 1.0 * flap, b.size * 0.2, b.size * 0.8 * flap, b.size * 1.0, 0, b.size * 0.4);
      ctx.fill();
      
      // Cuerpo real de la mariposa
      ctx.fillStyle = '#563247';
      ctx.beginPath();
      ctx.ellipse(0, 0, b.size * 0.1, b.size * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function animar() {
      ctx.clearRect(0, 0, ancho, alto);
      mariposas.forEach(b => {
        b.wingAngle += b.wingSpeed;
        b.fase += 0.04;
        if (mouse.dentro) {
          let dx = mouse.x - b.x, dy = mouse.y - b.y;
          let dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 30) {
            b.vx += (dx / dist) * 0.12; b.vy += (dy / dist) * 0.12;
          }
        } else {
          b.vx += Math.sin(b.fase) * 0.05; b.vy += Math.cos(b.fase) * 0.05;
        }
        b.vx *= 0.95; b.vy *= 0.95;
        b.x += b.vx; b.y += b.vy;

        if (b.x < -20) b.x = ancho + 20; if (b.x > ancho + 20) b.x = -20;
        if (b.y < -20) b.y = alto + 20; if (b.y > alto + 20) b.y = -20;
        dibujarMariposa(b);
      });
      requestAnimationFrame(animar);
    }
    animar();
  }
  /* 08b. GLOBALIZACIÓN MODALES LEGALES (EVITA ERROR 404) */
  const modalLegal = document.getElementById('modal-legal');
  const modalLegalTitulo = document.getElementById('modal-legal-titulo');
  const modalLegalTexto = document.getElementById('modal-legal-texto');
  const modalLegalClose = document.getElementById('modal-legal-close');

  const contenidoLegal = {
    privacidad: {
      titulo: 'Política de privacidad',
      texto: '<p>En Marcella Beauty Nails protegemos tus datos personales. La información compartida en los formularios o WhatsApp se utiliza estrictamente para agendar tus citas y brindarte asesoramiento personalizado.</p>'
    },
    terminos: {
      titulo: 'Términos y condiciones',
      texto: '<p>Al agendar un servicio aceptas nuestras políticas de puntualidad. Agradecemos notificar cualquier cancelación o reprogramación con un mínimo de 3 horas de anticipación.</p>'
    }
  };

  document.querySelectorAll('[data-modal]').forEach(enlace => {
    enlace.addEventListener('click', function (e) {
      e.preventDefault();
      const info = contenidoLegal[enlace.dataset.modal];
      if (!info || !modalLegal) return;
      modalLegalTitulo.textContent = info.titulo;
      modalLegalTexto.innerHTML = info.texto;
      modalLegal.classList.add('visible');
      document.body.style.overflow = 'hidden';
    });
  });

  if (modalLegalClose) modalLegalClose.addEventListener('click', () => { modalLegal.classList.remove('visible'); document.body.style.overflow = ''; });

  /* 09. CARRUSEL ANTES / DESPUÉS + 5 TESTIMONIOS AMPLIADOS CON ENLACES CORREGIDOS */
  const adAntes = document.getElementById('ad-antes');
  const adDespues = document.getElementById('ad-despues');
  const adHandle = document.getElementById('ad-handle');
  const adSlider = document.getElementById('ad-slider');
  const adTestimonio = document.getElementById('ad-testimonio');
  const adAutor = document.getElementById('ad-autor');
  const adPrev = document.querySelector('.ad-prev');
  const adNext = document.querySelector('.ad-next');

  const testimonios = [
    { antes: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=1200&q=80', despues: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1200&q=80', texto: 'Nunca me habían durado tanto unas uñas acrílicas. El servicio es increíble.', autor: 'Andrea G.' },
    { antes: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=80', despues: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80', texto: 'La veloterapia es súper relajante y mi cabello quedó brillante.', autor: 'Valentina R.' },
    { antes: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1200&q=80', despues: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=1200&q=80', texto: 'El Pedi Spa es delicioso, me relajé tanto que casi me duermo.', autor: 'Camila M.' },
    { antes: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80', despues: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=80', texto: 'Excelente servicio de hidratación de cabello, quedó sedoso y con un brillo increíble.', autor: 'Lina' },
    { antes: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=1200&q=80', despues: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=1200&q=80', texto: 'Las uñas de mis pies quedaron muy pulidas y perfectas, una atención impecable.', autor: 'Natalia' },
    { antes: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=1200&q=80', despues: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=80', texto: 'El corte de cabello me quedó genial, justo el estilo moderno que estaba buscando.', autor: 'Alejandra' },
    { antes: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=80', despues: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80', texto: 'Mi cabello estaba súper maltratado por procesos anteriores y Marcella Beauty Nails lo restauró por completo.', autor: 'Milena' },
    { antes: 'https://images.unsplash.com/photo-1587909209111-5097ee578ec3?w=1200&q=80', despues: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=1200&q=80', texto: 'Es un spa súper integral, la atención y todos los servicios son 1A. Súper recomendado.', autor: 'Sandra' }
  ];



  let adIndex = 0;
  function renderTestimonio(i) {
    adIndex = (i + testimonios.length) % testimonios.length;
    const t = testimonios[adIndex];
    if (adAntes) adAntes.src = t.antes; if (adDespues) adDespues.src = t.despues;
    if (adTestimonio) adTestimonio.textContent = '"' + t.texto + '"';
    if (adAutor) adAutor.textContent = '— ' + t.autor;
  }

  if (adPrev) adPrev.addEventListener('click', () => renderTestimonio(adIndex - 1));
  if (adNext) adNext.addEventListener('click', () => renderTestimonio(adIndex + 1));
  
  if (adSlider && adHandle) {
    let arrastrando = false;
    function moverHandle(clientX) {
      const rect = adSlider.getBoundingClientRect();
      let x = clientX - rect.left;
      x = Math.max(0, Math.min(x, rect.width));
      const porcentaje = (x / rect.width) * 100;
      adHandle.style.left = porcentaje + '%';
      if (adDespues) adDespues.style.clipPath = 'inset(0 ' + (100 - porcentaje) + '% 0 0)';
    }
    adHandle.addEventListener('mousedown', () => arrastrando = true);
    adSlider.addEventListener('mousemove', (e) => { if (arrastrando) moverHandle(e.clientX); });
    document.addEventListener('mouseup', () => arrastrando = false);
    adHandle.addEventListener('touchstart', () => arrastrando = true, { passive: true });
    adSlider.addEventListener('touchmove', (e) => { if (arrastrando) moverHandle(e.touches[0].clientX); }, { passive: true });
    document.addEventListener('touchend', () => arrastrando = false);
  }
    // Forzar inicialización limpia y estable de imágenes sin rebotes
    setTimeout(function() {
      renderTestimonio(0);
    }, 100);
  });