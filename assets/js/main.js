// --- Menu Offcanva com Focus Trap (TASK-09) ---
const hamburgerButton = document.getElementById("hamburger-button");
const offCanva = document.getElementById("offcanva");

if (hamburgerButton && offCanva) {
  hamburgerButton.addEventListener("click", toggleNav);

  const navLinks = document.querySelectorAll(".offcanva-nav--link");
  navLinks.forEach((navLink) => {
    navLink.addEventListener("click", toggleNav);
  });

  // Fechar com Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && hamburgerButton.classList.contains("is-active")) {
      toggleNav();
    }
  });
}

function toggleNav() {
  const isActive = hamburgerButton.classList.contains("is-active");

  if (isActive) {
    hamburgerButton.classList.remove("is-active");
    hamburgerButton.setAttribute("aria-expanded", "false");
    offCanva.setAttribute("aria-hidden", "true");
    offCanva.style.left = "-120%";
    document.body.style.overflow = "";
    offCanva.removeEventListener("keydown", trapFocusInOffcanva);
    hamburgerButton.focus();
  } else {
    hamburgerButton.classList.add("is-active");
    hamburgerButton.setAttribute("aria-expanded", "true");
    offCanva.setAttribute("aria-hidden", "false");
    offCanva.style.left = "0";
    document.body.style.overflow = "hidden";

    // Mover foco para o primeiro link
    const firstLink = offCanva.querySelector("a");
    if (firstLink) firstLink.focus();

    // Ativar focus trap
    offCanva.addEventListener("keydown", trapFocusInOffcanva);
  }
}

function trapFocusInOffcanva(e) {
  if (e.key !== "Tab") return;
  const focusables = offCanva.querySelectorAll('a, button, input, [tabindex]:not([tabindex="-1"])');
  if (focusables.length === 0) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}


// --- Active section indicator ---
const sections = document.querySelectorAll("section[id]");
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll(".header-link").forEach(l => l.classList.remove("active"));
      const active = document.querySelector(`.header-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add("active");
    }
  });
}, { threshold: 0.3 });
sections.forEach(s => navObserver.observe(s));


// --- Fade-in on scroll ---
const fadeEls = document.querySelectorAll(".fade-in");
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
      fadeObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
fadeEls.forEach(el => fadeObserver.observe(el));


// --- Lightbox com acessibilidade (TASK-07d) ---
const lightbox = document.getElementById("lightbox");
if (lightbox) {
  const lightboxImg = lightbox.querySelector("img");
  const lightboxClose = lightbox.querySelector(".lightbox-close");
  let lastFocusedElement = null;

  function openLightbox(img) {
    lastFocusedElement = document.activeElement;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
    if (lightboxClose) lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  // Click e keyboard nos result items
  document.querySelectorAll(".result-item").forEach(item => {
    const img = item.querySelector("img");
    item.addEventListener("click", () => openLightbox(img));
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(img);
      }
    });
  });

  // Fechar lightbox
  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("active")) {
      closeLightbox();
    }
  });

  // Focus trap dentro do lightbox
  lightbox.addEventListener("keydown", (e) => {
    if (e.key === "Tab" && lightbox.classList.contains("active")) {
      e.preventDefault();
      if (lightboxClose) lightboxClose.focus();
    }
  });
}


// --- Dark mode toggle com aria-checked (TASK-17 + TASK-24c) ---
const darkModeButton = document.getElementById("dark-mode-button");
const darkModeToggleMobile = document.querySelector(".dark-mode-toggle-mobile");

function toggleDarkMode(source) {
  document.body.classList.toggle("dark-theme");
  const isActive = document.body.classList.contains("dark-theme");

  // Sincronizar ambos os toggles
  if (darkModeButton) {
    darkModeButton.checked = isActive;
    darkModeButton.setAttribute("aria-checked", String(isActive));
  }
  if (darkModeToggleMobile) {
    darkModeToggleMobile.checked = isActive;
    darkModeToggleMobile.setAttribute("aria-checked", String(isActive));
  }
}

if (darkModeButton) {
  darkModeButton.addEventListener("change", () => toggleDarkMode("desktop"));
}
if (darkModeToggleMobile) {
  darkModeToggleMobile.addEventListener("change", () => toggleDarkMode("mobile"));
}


// --- Respeitar prefers-reduced-motion para vídeos (TASK-15b) ---
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.querySelectorAll("video[autoplay]").forEach(video => {
    video.pause();
    video.removeAttribute("autoplay");
  });
}
