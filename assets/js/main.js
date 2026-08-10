(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -----------------------------------------------------------------------
     Intro: the wordmark settles, the inline chip widens, then that chip
     opens out to a full-bleed image — the hero is already waiting beneath it.
     ----------------------------------------------------------------------- */
  const intro = document.getElementById("intro");
  const introChip = document.getElementById("introChip");
  const introExpand = document.getElementById("introExpand");
  const introSkip = document.getElementById("introSkip");
  const timers = [];

  function finishIntro() {
    timers.forEach(clearTimeout);
    timers.length = 0;
    intro.classList.add("is-done");
    introExpand.classList.add("is-gone");
    document.body.style.removeProperty("overflow");
  }

  function openChip() {
    // Clip the full-screen image to exactly where the chip sits, then release it.
    const r = introChip.getBoundingClientRect();
    const top = r.top;
    const right = window.innerWidth - r.right;
    const bottom = window.innerHeight - r.bottom;
    const left = r.left;
    introExpand.style.clipPath = `inset(${top}px ${right}px ${bottom}px ${left}px round 8px)`;
    introExpand.classList.add("is-armed");

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        introExpand.style.clipPath = "";
        introExpand.classList.add("is-open");
        // the words leave, the moss ground stays until the image has covered it
        intro.classList.add("is-opening");
      });
    });

    // once the image fills the viewport the overlay is safe to drop outright
    timers.push(setTimeout(() => intro.classList.add("is-covered"), 1200));
    timers.push(setTimeout(finishIntro, 1500));
  }

  function runIntro() {
    document.body.style.overflow = "hidden";
    intro.classList.add("is-running");
    timers.push(setTimeout(() => intro.classList.add("is-widening"), 1150));
    timers.push(setTimeout(openChip, 2350));
  }

  if (prefersReducedMotion) {
    finishIntro();
  } else {
    runIntro();
  }
  introSkip.addEventListener("click", finishIntro);

  /* -----------------------------------------------------------------------
     Header state + active section
     ----------------------------------------------------------------------- */
  const header = document.getElementById("siteHeader");
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  const backToTop = document.getElementById("backToTop");

  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 40);
    backToTop.classList.toggle("is-visible", y > 700);

    let current = "";
    sections.forEach((section) => {
      if (y >= section.offsetTop - 130) current = section.id;
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

  /* -----------------------------------------------------------------------
     Mobile menu
     ----------------------------------------------------------------------- */
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
  mobileMenu.querySelectorAll(".nav-link").forEach((l) => l.addEventListener("click", closeMenu));

  /* -----------------------------------------------------------------------
     In-page anchors, offset for the fixed header
     ----------------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - header.offsetHeight + 1;
      window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  });

  /* -----------------------------------------------------------------------
     Scroll reveal
     ----------------------------------------------------------------------- */
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
    revealEls.forEach((el) => {
      // Anything already on screen at load is shown outright — the observer's
      // negative bottom margin would otherwise skip elements pinned near the fold.
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        el.classList.add("is-visible");
      } else {
        revealObserver.observe(el);
      }
    });
  }

  /* -----------------------------------------------------------------------
     Service filter — nine cards is a lot to read through
     ----------------------------------------------------------------------- */
  const filterChips = document.querySelectorAll(".svc-chip");
  const svcCards = document.querySelectorAll(".svc-card");
  if (filterChips.length && svcCards.length) {
    filterChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        const want = chip.dataset.filter;
        filterChips.forEach((c) => c.classList.toggle("is-on", c === chip));
        svcCards.forEach((card) => {
          const cats = (card.dataset.cat || "").split(" ");
          const show = want === "alle" || cats.includes(want);
          card.classList.toggle("is-filtered-out", !show);
          card.setAttribute("aria-hidden", show ? "false" : "true");
        });
      });
    });
  }

  /* -----------------------------------------------------------------------
     Philosophie: pinned panels driven by scroll position
     ----------------------------------------------------------------------- */
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
    const storyBg = storyTrack.querySelector(".story-bg img");

    let ticking = false;
    function updateStory() {
      const rect = storyTrack.getBoundingClientRect();
      const total = storyTrack.offsetHeight - window.innerHeight;
      const progress = Math.min(1, Math.max(0, -rect.top / total));
      const idx = Math.min(panels.length - 1, Math.floor(progress * panels.length));
      panels.forEach((p, i) => p.classList.toggle("is-active", i === idx));
      dots.forEach((d, i) => d.classList.toggle("is-active", i === idx));
      if (storyBg) storyBg.style.transform = `scale(${1.06 + progress * 0.08})`;
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

  /* -----------------------------------------------------------------------
     Contact form (front-end only in this build)
     ----------------------------------------------------------------------- */
  const form = document.getElementById("contactForm");
  const formNote = document.getElementById("formNote");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        formNote.textContent = "Bitte fülle Name, E-Mail und dein Anliegen aus.";
        formNote.classList.add("is-error");
        return;
      }
      formNote.classList.remove("is-error");
      formNote.textContent = "Danke — deine Nachricht ist da. Wir melden uns innerhalb eines Werktages.";
      form.reset();
    });
  }

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
