const hamburgerButton = document.getElementById("hamburger-button");
const offCanva = document.getElementById("offcanva");

hamburgerButton.addEventListener("click", toggleNav);

const navLinks = document.querySelectorAll(".offcanva-nav--link");
navLinks.forEach((navLink) => {
  navLink.addEventListener("click", toggleNav);
});

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

const getRating = async () => {
  try {
    const response = await fetch("/api/get-reviews.js");
    if (!response.ok) return;
    const reviews = await response.json();
    console.log(reviews);
  } catch (e) {}
};

getRating();

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


//const userContainer = document.getElementById("user-container");

// rating.length > 0
//   ? rating.map((review) => {
//       userContainer.innerHTML += `
    
//                     <div class="user-container">
//                         <img class="user-photo" src=${
//                           review?.profile_photo_url
//                         } alt="user photo">
//                         <div class="user-description">
//                             <span>${review?.author_name}</span>
//                             <div class="rating-stars">
//                                 ${[...Array((Number(review.rating))).keys()]
//                                   .map((i) => {
//                                     return '<span class="star">★</span>'
//                                   })
//                                   .join("")}
//                             </div>
//                             <p>${review?.text || ""}</p>
//                         </div>
//                     </div>
  
//   `;
//     })
//   : [1, 2, 3].map((element) => {
//       userContainer.innerHTML += `<div class="skeleton">
//                         <img />
//                         <div>
//                             <div class="skeleton-name">
//                             </div>
//                             <div>
//                                 <div class="skeleton-stars"></div>
//                             </div>
//                             <div class="skeleton-description"></div>
//                         </div>
//                     </div>`;
//     });

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

// Carousel navigation
const track = document.querySelector(".results-track");
const prevBtn = document.querySelector(".carousel-btn.prev");
const nextBtn = document.querySelector(".carousel-btn.next");
if (track && prevBtn && nextBtn) {
  const scrollAmount = () => track.querySelector(".result-item")?.offsetWidth + 5 || 300;
  prevBtn.addEventListener("click", () => track.scrollBy({ left: -scrollAmount(), behavior: "smooth" }));
  nextBtn.addEventListener("click", () => track.scrollBy({ left: scrollAmount(), behavior: "smooth" }));
}