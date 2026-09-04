document.documentElement.classList.add("js");

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const filterButtons = document.querySelectorAll(".filter-button");
const appCards = document.querySelectorAll(".app-card");
const storeLinks = document.querySelectorAll("[data-store-pending]");
const currentYear = document.querySelector("#current-year");
const parallaxTarget = document.querySelector("[data-parallax-target]");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

function closeMenu() {
  if (!siteNav || !menuToggle) return;
  siteNav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
}

menuToggle?.addEventListener("click", () => {
  const isOpen = siteNav?.classList.toggle("is-open") ?? false;
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    appCards.forEach((card) => {
      const shouldShow = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

storeLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    if (!link.getAttribute("href")) {
      event.preventDefault();
    }
  });
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reducedMotion && parallaxTarget) {
  const hero = parallaxTarget.closest(".hero-art-wrap");

  hero?.addEventListener("pointermove", (event) => {
    const bounds = hero.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    parallaxTarget.style.setProperty("--parallax-x", `${x * 10}px`);
    parallaxTarget.style.setProperty("--parallax-y", `${y * 8}px`);
  });

  hero?.addEventListener("pointerleave", () => {
    parallaxTarget.style.setProperty("--parallax-x", "0px");
    parallaxTarget.style.setProperty("--parallax-y", "0px");
  });
}

const revealItems = document.querySelectorAll(".reveal");

if (reducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}
