(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Splash — signature mark animation */
  const splash = document.getElementById("splash");
  const splashSkip = document.getElementById("splashSkip");
  const heroMark = document.getElementById("heroMark");
  let splashTimer = null;

  function hideSplash() {
    clearTimeout(splashTimer);
    splash.classList.add("is-hidden");
    if (heroMark) heroMark.classList.add("go");
  }
  if (prefersReducedMotion) {
    hideSplash();
  } else {
    splashTimer = setTimeout(hideSplash, 7000);
  }
  splashSkip.addEventListener("click", hideSplash);
  splash.addEventListener("click", (e) => { if (e.target === splash) hideSplash(); });

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

  /* Philosophie — pinned scroll-parallax story */
  const storyTrack = document.getElementById("storyTrack");
  if (storyTrack && !prefersReducedMotion) {
    const panels = Array.from(storyTrack.querySelectorAll(".story-panel"));
    const progressWrap = document.getElementById("storyProgress");
    panels.forEach((_, i) => {
      const dot = document.createElement("span");
      if (i === 0) dot.classList.add("is-active");
      progressWrap.appendChild(dot);
    });
    const dots = Array.from(progressWrap.children);

    let ticking = false;
    function updateStory() {
      const rect = storyTrack.getBoundingClientRect();
      const total = storyTrack.offsetHeight - window.innerHeight;
      const progress = Math.min(1, Math.max(0, -rect.top / total));
      const idx = Math.min(panels.length - 1, Math.floor(progress * panels.length));
      panels.forEach((p, i) => p.classList.toggle("is-active", i === idx));
      dots.forEach((d, i) => d.classList.toggle("is-active", i === idx));
      ticking = false;
    }
    document.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(updateStory);
          ticking = true;
        }
      },
      { passive: true }
    );
    updateStory();
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
