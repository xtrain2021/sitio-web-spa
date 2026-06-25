// ============================================
// 1. HEADER SCROLL EFFECT (con debounce)
// ============================================
let scrollTimeout;
window.addEventListener('scroll', () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, 10); // Pequeño retraso para mejorar rendimiento
});

// ============================================
// 2. MENÚ MÓVIL
// ============================================
const menuToggle = document.getElementById('menu-toggle');
const nav = document.getElementById('nav');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation(); // Evita que el clic se propague y cierre el menú inmediatamente
    nav.classList.toggle('active');
  });

  // Cerrar menú al hacer clic en un enlace
  document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
    });
  });

  // Cerrar menú al hacer clic fuera de él
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
      nav.classList.remove('active');
    }
  });
}

// ============================================
// 3. DROPDOWNS: comportamiento adaptativo
//    - En desktop: hover (manejado por CSS)
//    - En móvil: clic en el enlace padre para abrir/cerrar
// ============================================
function initDropdowns() {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const dropdowns = document.querySelectorAll('.dropdown');

  if (isTouchDevice) {
    // En móviles, desactivamos el hover (CSS) y manejamos con clic
    dropdowns.forEach(dropdown => {
      const link = dropdown.querySelector('a'); // El enlace principal del dropdown
      const menu = dropdown.querySelector('.dropdown-menu');

      link.addEventListener('click', (e) => {
        e.preventDefault(); // Evita la navegación (opcional, si quieres que solo abra el menú)
        // Cierra otros dropdowns abiertos
        dropdowns.forEach(d => {
          if (d !== dropdown) d.classList.remove('open');
        });
        dropdown.classList.toggle('open');
      });

      // Cerrar al hacer clic fuera
      document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove('open');
        }
      });
    });
  } else {
    // En desktop, aseguramos que el hover funcione (CSS puro)
    // También podemos cerrar dropdowns si se hace clic fuera (opcional)
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
      }
    });
  }
}
initDropdowns();

// ============================================
// 4. TESTIMONIALS SLIDER
// ============================================
const testimonials = document.querySelectorAll('.testimonial');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
let currentIndex = 0;
let autoSlideInterval;

function showTestimonial(index) {
  testimonials.forEach((t, i) => {
    t.classList.toggle('active', i === index);
  });
}

function nextTestimonial() {
  currentIndex = (currentIndex + 1) % testimonials.length;
  showTestimonial(currentIndex);
  resetAutoSlide();
}

function prevTestimonial() {
  currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
  showTestimonial(currentIndex);
  resetAutoSlide();
}

function startAutoSlide() {
  if (testimonials.length > 1) {
    autoSlideInterval = setInterval(nextTestimonial, 5000);
  }
}

function resetAutoSlide() {
  clearInterval(autoSlideInterval);
  startAutoSlide();
}

if (prevBtn && nextBtn && testimonials.length > 0) {
  prevBtn.addEventListener('click', prevTestimonial);
  nextBtn.addEventListener('click', nextTestimonial);
  startAutoSlide();
}

// ============================================
// 5. ANIMACIONES AL HACER SCROLL (Intersection Observer)
//    - Usamos una clase CSS '.animate-on-scroll' para los elementos que queremos animar.
//    - Al entrar, añadimos la clase '.animated' que dispara la animación.
// ============================================
const animatedElements = document.querySelectorAll('.service-card, .about-content, .gallery-item, .testimonial');

if (animatedElements.length > 0) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target); // Deja de observarlo una vez animado
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }); // Pequeño margen para activar un poco antes

  animatedElements.forEach(el => observer.observe(el));
}

// ============================================
// 6. (OPCIONAL) SMOOTH SCROLL PARA ENLACES INTERNOS
//    - Si tienes enlaces que apuntan a secciones (ej: #contacto)
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});