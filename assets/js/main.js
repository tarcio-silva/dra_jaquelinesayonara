const hamburgerButton = document.getElementById("hamburger-button");
const offCanva = document.getElementById("offcanva");

if (hamburgerButton && offCanva) {
  hamburgerButton.addEventListener("click", toggleNav);

  const navLinks = document.querySelectorAll(".offcanva-nav--link");
  navLinks.forEach((navLink) => {
    navLink.addEventListener("click", toggleNav);
  });
}

function toggleNav() {
  const isActive = hamburgerButton.classList.contains("is-active");

  if (isActive) {
    hamburgerButton.classList.remove("is-active");
    hamburgerButton.setAttribute("aria-expanded", "false");
    offCanva.setAttribute("aria-hidden", "true");
    offCanva.style.left = "-120%";
  } else {
    hamburgerButton.classList.add("is-active");
    hamburgerButton.setAttribute("aria-expanded", "true");
    offCanva.setAttribute("aria-hidden", "false");
    offCanva.style.left = "0";
  }
}

// Active section indicator
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


// Fade-in on scroll
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



// Lightbox
const lightbox = document.getElementById("lightbox");
if (lightbox) {
  const lightboxImg = lightbox.querySelector("img");
  document.querySelectorAll(".result-item").forEach(item => {
    item.addEventListener("click", () => {
      const img = item.querySelector("img");
      if (img && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add("active");
      }
    });
  });
  lightbox.addEventListener("click", () => lightbox.classList.remove("active"));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") lightbox.classList.remove("active");
  });
}
