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
  const lightboxCTA = lightbox.querySelector(".lightbox-cta");
  const resultItems = document.querySelectorAll(".result-item");
  let currentIndex = 0;
  let lastFocusedElement = null;

  function getVisibleItems() {
    return [...resultItems].filter(item => !item.classList.contains("hidden"));
  }

  function updateLightboxImage() {
    const visibleItems = getVisibleItems();
    const item = visibleItems[currentIndex];
    if (!item) return;
    const img = item.querySelector("img");
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentIndex + 1} / ${visibleItems.length}`;
    }
    // CTA contextual
    if (lightboxCTA) {
      const ctaText = item.dataset.ctaText || "Quero transformar meu sorriso";
      const ctaLink = item.dataset.ctaLink || "https://wa.me/+5583994058749/?text=Gostaria%20de%20transformar%20meu%20sorriso";
      lightboxCTA.textContent = ctaText;
      lightboxCTA.href = ctaLink;
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
    const visibleItems = getVisibleItems();
    currentIndex = (currentIndex + direction + visibleItems.length) % visibleItems.length;
    updateLightboxImage();
  }

  // Click e keyboard nos result items
  resultItems.forEach(item => {
    item.addEventListener("click", () => {
      const visibleItems = getVisibleItems();
      const index = visibleItems.indexOf(item);
      if (index !== -1) openLightbox(index);
    });
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const visibleItems = getVisibleItems();
        const index = visibleItems.indexOf(item);
        if (index !== -1) openLightbox(index);
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
    const focusables = lightbox.querySelectorAll('button:not([disabled]), a[href]');
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


// --- Filtros de resultados (Fase 4) ---
const filterBtns = document.querySelectorAll(".filter-btn");
const filterableItems = document.querySelectorAll(".result-item[data-category]");

if (filterBtns.length > 0 && filterableItems.length > 0) {
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      filterableItems.forEach(item => {
        if (filter === "all" || item.dataset.category === filter) {
          item.classList.remove("hidden");
        } else {
          item.classList.add("hidden");
        }
      });

      // Reset carousel scroll and update dots
      const carousel = document.querySelector(".results-carousel");
      if (carousel) carousel.scrollTo({ left: 0, behavior: "smooth" });
      updateCarouselDots();
    });
  });
}


// --- Carousel de resultados ---
const carousel = document.querySelector(".results-carousel");
const carouselPrev = document.querySelector(".carousel-prev");
const carouselNext = document.querySelector(".carousel-next");
const carouselDotsContainer = document.querySelector(".carousel-dots");

if (carousel && carouselPrev && carouselNext && carouselDotsContainer) {
  function getVisibleCarouselItems() {
    return [...carousel.querySelectorAll(".result-item:not(.hidden)")];
  }

  function getItemsPerView() {
    const containerWidth = carousel.clientWidth;
    const items = getVisibleCarouselItems();
    if (items.length === 0) return 1;
    const itemWidth = items[0].offsetWidth + 16; // gap
    return Math.round(containerWidth / itemWidth) || 1;
  }

  function getTotalPages() {
    const items = getVisibleCarouselItems();
    const perView = getItemsPerView();
    return Math.ceil(items.length / perView);
  }

  function getCurrentPage() {
    const items = getVisibleCarouselItems();
    if (items.length === 0) return 0;
    const itemWidth = items[0].offsetWidth + 16;
    return Math.round(carousel.scrollLeft / (itemWidth * getItemsPerView()));
  }

  function scrollToPage(page) {
    const items = getVisibleCarouselItems();
    if (items.length === 0) return;
    const itemWidth = items[0].offsetWidth + 16;
    const perView = getItemsPerView();
    const scrollTarget = page * perView * itemWidth;
    carousel.scrollTo({ left: scrollTarget, behavior: "smooth" });
  }

  function updateCarouselDots() {
    const totalPages = getTotalPages();
    carouselDotsContainer.innerHTML = "";

    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement("button");
      dot.classList.add("carousel-dot");
      dot.setAttribute("aria-label", `Página ${i + 1}`);
      dot.setAttribute("role", "tab");
      if (i === getCurrentPage()) dot.classList.add("active");
      dot.addEventListener("click", () => scrollToPage(i));
      carouselDotsContainer.appendChild(dot);
    }
  }

  function updateCarouselState() {
    const page = getCurrentPage();
    const totalPages = getTotalPages();
    carouselPrev.disabled = page <= 0;
    carouselNext.disabled = page >= totalPages - 1;

    // Update active dot
    const dots = carouselDotsContainer.querySelectorAll(".carousel-dot");
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === page);
    });
  }

  carouselPrev.addEventListener("click", () => {
    const page = getCurrentPage();
    if (page > 0) scrollToPage(page - 1);
  });

  carouselNext.addEventListener("click", () => {
    const page = getCurrentPage();
    if (page < getTotalPages() - 1) scrollToPage(page + 1);
  });

  carousel.addEventListener("scroll", () => {
    updateCarouselState();
  }, { passive: true });

  // Init
  updateCarouselDots();
  updateCarouselState();

  // Re-calc on resize
  window.addEventListener("resize", () => {
    updateCarouselDots();
    updateCarouselState();
  });

  // Autoplay
  let autoplayInterval = null;
  const AUTOPLAY_DELAY = 4000;

  function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(() => {
      const page = getCurrentPage();
      const totalPages = getTotalPages();
      if (page >= totalPages - 1) {
        carousel.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollToPage(page + 1);
      }
    }, AUTOPLAY_DELAY);
  }

  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }

  // Pausar ao interagir, retomar após 8s
  let resumeTimeout = null;

  function pauseAndResume() {
    stopAutoplay();
    clearTimeout(resumeTimeout);
    resumeTimeout = setTimeout(startAutoplay, 8000);
  }

  carousel.addEventListener("pointerdown", pauseAndResume);
  carousel.addEventListener("touchstart", pauseAndResume, { passive: true });
  carouselPrev.addEventListener("click", pauseAndResume);
  carouselNext.addEventListener("click", pauseAndResume);

  // Pausar se prefers-reduced-motion
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    startAutoplay();
  }
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
