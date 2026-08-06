(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Preloader */
  window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");
    setTimeout(() => preloader.classList.add("is-hidden"), 500);
  });

  /* Header scroll state + active nav link */
  const header = document.getElementById("siteHeader");
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  const backToTop = document.getElementById("backToTop");

  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 40);
    backToTop.classList.toggle("is-visible", y > 600);

    let current = "";
    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      if (y >= top) current = section.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${current}`);
    });
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });

  /* Mobile menu */
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");

  function closeMenu() {
    hamburger.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
    mobileMenu.classList.remove("is-open");
  }

  hamburger.addEventListener("click", () => {
    const isOpen = hamburger.classList.toggle("is-open");
    hamburger.setAttribute("aria-expanded", String(isOpen));
    mobileMenu.classList.toggle("is-open", isOpen);
  });
  mobileMenu.querySelectorAll(".nav-link").forEach((link) => link.addEventListener("click", closeMenu));

  /* Smooth scroll with header offset for all in-page anchors */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const headerH = header.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH + 1;
      window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  });

  /* Scroll reveal */
  const revealEls = document.querySelectorAll("[data-reveal]");
  revealEls.forEach((el) => {
    const delay = el.getAttribute("data-delay");
    if (delay) el.style.setProperty("--delay", `${delay}ms`);
  });

  if (prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* Process line fill */
  const processTrack = document.querySelector(".process-track");
  if (processTrack) {
    const trackObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    trackObserver.observe(processTrack);
  }

  /* Count-up stats */
  const counters = document.querySelectorAll("[data-count]");
  function animateCounter(el) {
    const target = parseInt(el.getAttribute("data-count"), 10);
    if (prefersReducedMotion) {
      el.textContent = target;
      return;
    }
    const duration = 1600;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((el) => counterObserver.observe(el));

  /* Hero parallax */
  const parallaxEls = document.querySelectorAll("[data-parallax]");
  if (!prefersReducedMotion && parallaxEls.length) {
    let ticking = false;
    function updateParallax() {
      const y = window.scrollY;
      parallaxEls.forEach((el) => {
        const speed = parseFloat(el.getAttribute("data-parallax"));
        el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
      });
      ticking = false;
    }
    document.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(updateParallax);
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  /* Testimonial slider */
  const track = document.getElementById("testimonialTrack");
  const dotsWrap = document.getElementById("testimonialDots");
  if (track && dotsWrap) {
    const slides = Array.from(track.querySelectorAll(".testimonial-slide"));
    let activeIndex = 0;
    let timer;

    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.setAttribute("aria-label", `Bewertung ${i + 1} anzeigen`);
      if (i === 0) dot.classList.add("is-active");
      dot.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function goTo(index) {
      slides[activeIndex].classList.remove("is-active");
      dots[activeIndex].classList.remove("is-active");
      activeIndex = (index + slides.length) % slides.length;
      slides[activeIndex].classList.add("is-active");
      dots[activeIndex].classList.add("is-active");
    }

    function nextSlide() { goTo(activeIndex + 1); }

    function startAutoplay() {
      if (prefersReducedMotion) return;
      timer = setInterval(nextSlide, 6000);
    }
    function stopAutoplay() { clearInterval(timer); }

    track.addEventListener("mouseenter", stopAutoplay);
    track.addEventListener("mouseleave", startAutoplay);
    startAutoplay();
  }

  /* Contact form (client-side only demo submit) */
  const form = document.getElementById("contactForm");
  const formNote = document.getElementById("formNote");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        formNote.textContent = "Bitte füllen Sie alle Pflichtfelder korrekt aus.";
        formNote.classList.add("is-error");
        return;
      }
      formNote.classList.remove("is-error");
      formNote.textContent = "Danke! Ihre Nachricht wurde gesendet — wir melden uns in Kürze.";
      form.reset();
    });
  }

  /* Footer year */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
