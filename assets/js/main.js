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
}, { threshold: 0.05 });
fadeEls.forEach(el => fadeObserver.observe(el));


// --- Lightbox com acessibilidade (TASK-07d) ---
const lightbox = document.getElementById("lightbox");
if (lightbox) {
  const lightboxImg = lightbox.querySelector("img");
  const lightboxClose = lightbox.querySelector(".lightbox-close");
  const lightboxPrev = lightbox.querySelector(".lightbox-prev");
  const lightboxNext = lightbox.querySelector(".lightbox-next");
  const lightboxCounter = lightbox.querySelector(".lightbox-counter");
  const resultItems = document.querySelectorAll(".result-item");
  let currentIndex = 0;
  let lastFocusedElement = null;

  function updateLightboxImage() {
    const img = resultItems[currentIndex].querySelector("img");
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentIndex + 1} / ${resultItems.length}`;
    }
  }

  function openLightbox(index) {
    lastFocusedElement = document.activeElement;
    currentIndex = index;
    updateLightboxImage();
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
    if (lightboxClose) lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  function navigate(direction) {
    currentIndex = (currentIndex + direction + resultItems.length) % resultItems.length;
    updateLightboxImage();
  }

  // Click e keyboard nos result items
  resultItems.forEach((item, index) => {
    item.addEventListener("click", () => openLightbox(index));
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });

  // Botões prev/next
  if (lightboxPrev) lightboxPrev.addEventListener("click", () => navigate(-1));
  if (lightboxNext) lightboxNext.addEventListener("click", () => navigate(1));

  // Fechar lightbox
  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") navigate(-1);
    if (e.key === "ArrowRight") navigate(1);
  });

  // Focus trap dentro do lightbox
  lightbox.addEventListener("keydown", (e) => {
    if (e.key !== "Tab" || !lightbox.classList.contains("active")) return;
    const focusables = lightbox.querySelectorAll('button:not([disabled])');
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
  });

  // Swipe em mobile
  let touchStartX = 0;
  let touchEndX = 0;
  const SWIPE_THRESHOLD = 50;

  lightbox.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      if (diff > 0) navigate(1);   // swipe left → próxima
      else navigate(-1);            // swipe right → anterior
    }
  });
}


// --- Dark mode toggle com aria-checked (TASK-17 + TASK-24c) ---
const darkModeButton = document.getElementById("dark-mode-button");
const darkModeToggleMobile = document.querySelector(".dark-mode-toggle-mobile");
const darkModeToggleNav = document.querySelector(".dark-mode-toggle-nav");

// Restaurar preferência salva
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark-theme");
  if (darkModeButton) {
    darkModeButton.checked = true;
    darkModeButton.setAttribute("aria-checked", "true");
  }
  if (darkModeToggleMobile) {
    darkModeToggleMobile.checked = true;
    darkModeToggleMobile.setAttribute("aria-checked", "true");
  }
  if (darkModeToggleNav) {
    darkModeToggleNav.checked = true;
    darkModeToggleNav.setAttribute("aria-checked", "true");
  }
}

function toggleDarkMode(source) {
  document.body.classList.toggle("dark-theme");
  const isActive = document.body.classList.contains("dark-theme");

  // Persistir preferência
  localStorage.setItem("theme", isActive ? "dark" : "light");

  // Sincronizar todos os toggles
  if (darkModeButton) {
    darkModeButton.checked = isActive;
    darkModeButton.setAttribute("aria-checked", String(isActive));
  }
  if (darkModeToggleMobile) {
    darkModeToggleMobile.checked = isActive;
    darkModeToggleMobile.setAttribute("aria-checked", String(isActive));
  }
  if (darkModeToggleNav) {
    darkModeToggleNav.checked = isActive;
    darkModeToggleNav.setAttribute("aria-checked", String(isActive));
  }
}

if (darkModeButton) {
  darkModeButton.addEventListener("change", () => toggleDarkMode("desktop"));
}
if (darkModeToggleMobile) {
  darkModeToggleMobile.addEventListener("change", () => toggleDarkMode("mobile"));
}
if (darkModeToggleNav) {
  darkModeToggleNav.addEventListener("change", () => toggleDarkMode("nav"));
}


// --- Respeitar prefers-reduced-motion para vídeos (TASK-15b) ---
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.querySelectorAll("video[autoplay]").forEach(video => {
    video.pause();
    video.removeAttribute("autoplay");
  });
}


// --- Lazy-load de vídeo (evitar download de 5.8MB no load) ---
const lazyVideos = document.querySelectorAll("video");
if (lazyVideos.length > 0) {
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const video = entry.target;
        const sources = video.querySelectorAll("source[data-src]");
        sources.forEach(source => {
          source.src = source.dataset.src;
          source.removeAttribute("data-src");
        });
        video.load();
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          video.autoplay = true;
          video.play().catch(() => {});
        }
        videoObserver.unobserve(video);
      }
    });
  }, { rootMargin: "200px" });

  lazyVideos.forEach(video => {
    if (video.querySelector("source[data-src]")) {
      videoObserver.observe(video);
    }
  });
}
