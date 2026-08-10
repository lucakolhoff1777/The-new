(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -----------------------------------------------------------------------
     Intro: the wordmark settles, the inline chip widens, then that chip
     opens out to a full-bleed image — the hero is already waiting beneath it.
     ----------------------------------------------------------------------- */
  const intro = document.getElementById("intro");
  const introSkip = document.getElementById("introSkip");
  const timers = [];

  const heroMedia = document.getElementById("heroMedia");
  let flightStarted = false;

  function startFlight() {
    if (flightStarted || !heroMedia) return;
    flightStarted = true;
    if (prefersReducedMotion) {
      heroMedia.classList.add("is-landed");
      return;
    }
    heroMedia.classList.add("is-flying");
    // hold the landed state once the approach finishes
    setTimeout(() => {
      heroMedia.classList.remove("is-flying");
      heroMedia.classList.add("is-landed");
    }, 3400);   // matches the flight animations in style.css
  }

  function finishIntro() {
    timers.forEach(clearTimeout);
    timers.length = 0;
    intro.classList.add("is-done");
    document.body.style.removeProperty("overflow");
    startFlight();
  }

  function runIntro() {
    document.body.style.overflow = "hidden";
    intro.classList.add("is-running");
    timers.push(setTimeout(() => intro.classList.add("is-widening"), 1150));
    // the wordmark hands straight over to the approach: the hero is already
    // sitting at its far position behind the overlay, so nothing jumps
    timers.push(setTimeout(finishIntro, 2350));
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
     Räume — drag the oversized shot inside the frame to look around
     ----------------------------------------------------------------------- */
  const ROOMS = [
    {
      img: "assets/img/empfang.jpg",
      name: "Empfang",
      desc: "Eine Wand aus konserviertem Moos, von hinten beleuchtet, mit unserem " +
            "Monogramm darin. Davor ein Tresen aus einem einzigen Stamm. Hier kommst " +
            "du an, hier wirst du empfangen — ohne Wartezimmer-Atmosphäre.",
      tags: ["Mooswand", "Hinterleuchtetes Monogramm", "Massivholztresen"],
    },
    {
      img: "assets/img/raum-1.jpg",
      name: "Behandlungsraum I",
      desc: "Heller Raum für Manuelle Therapie und CMD. Runde Nischen mit indirektem " +
            "Licht, Waschbecken am Platz, Olivenbaum am Fenster. Ruhig genug, dass " +
            "man am Kiefer arbeiten kann.",
      tags: ["Manuelle Therapie", "CMD · CRAFTA", "Höhenverstellbare Liege"],
    },
    {
      img: "assets/img/raum-2.jpg",
      name: "Behandlungsraum II",
      desc: "Holz, Kalkputz und ein hinterleuchtetes Rattanpaneel. Der dunklere, " +
            "geschütztere Raum — für Massage, Lymphdrainage und alles, wobei man " +
            "wirklich abschalten soll.",
      tags: ["Massage", "Lymphdrainage", "Gedämpftes Licht"],
    },
    {
      img: "assets/img/lab.jpg",
      name: "Athletik-Lab",
      desc: "Kraftmessung, Sprungdiagnostik und aktives Training. Geplant sind " +
            "zusätzlich eine Kunstrasenbahn für Sprint- und Schlittenarbeit sowie " +
            "ein Gewichtsschlitten in derselben Holz-Optik wie die Geräteschränke.",
      tags: ["Kraftmessdiagnostik", "Return-to-Sport"],
      planned: ["Kunstrasenbahn", "Gewichtsschlitten"],
    },
    {
      img: "assets/img/umkleide.jpg",
      name: "Umkleide & Duschen",
      desc: "Abschließbare Schränke, Duschen und frische Handtücher. Gedacht für " +
            "alle, die vor oder nach dem Training kommen — du musst nicht in " +
            "Sportsachen wieder aus der Tür.",
      tags: ["Abschließbare Schränke", "Duschen", "Handtuchservice"],
    },
  ];

  const viewer = document.getElementById("viewer");
  if (viewer) {
    const stage = document.getElementById("viewerStage");
    const vImg = document.getElementById("viewerImg");
    const vHint = document.getElementById("viewerHint");
    let current = 0;
    let pan = { x: 0, y: 0 };
    let drag = null;

    function applyPan() {
      vImg.style.transform = `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px))`;
    }

    function limits() {
      // how far the oversized image may travel before its edge shows
      return {
        x: Math.max(0, (vImg.offsetWidth - stage.clientWidth) / 2),
        y: Math.max(0, (vImg.offsetHeight - stage.clientHeight) / 2),
      };
    }

    function show(i) {
      current = (i + ROOMS.length) % ROOMS.length;
      const r = ROOMS[current];
      vImg.src = r.img;
      vImg.alt = r.name;
      document.getElementById("vName").textContent = r.name;
      document.getElementById("vDesc").textContent = r.desc;
      document.getElementById("vCount").textContent = `${current + 1} / ${ROOMS.length}`;
      document.getElementById("vTags").innerHTML =
        (r.tags || []).map((t) => `<span>${t}</span>`).join("") +
        (r.planned || []).map((t) => `<span class="is-planned">${t} · geplant</span>`).join("");
      pan = { x: 0, y: 0 };
      applyPan();
      vHint.classList.remove("is-gone");
    }

    function open(i) {
      viewer.hidden = false;
      document.body.style.overflow = "hidden";
      show(i);
    }
    function close() {
      viewer.hidden = true;
      document.body.style.removeProperty("overflow");
    }

    document.querySelectorAll(".room-card").forEach((card) => {
      card.addEventListener("click", () => open(+card.dataset.room));
    });
    document.getElementById("viewerClose").addEventListener("click", close);
    document.getElementById("vPrev").addEventListener("click", () => show(current - 1));
    document.getElementById("vNext").addEventListener("click", () => show(current + 1));
    viewer.addEventListener("click", (e) => { if (e.target === viewer) close(); });

    document.addEventListener("keydown", (e) => {
      if (viewer.hidden) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") show(current + 1);
      if (e.key === "ArrowLeft") show(current - 1);
    });

    stage.addEventListener("pointerdown", (e) => {
      drag = { sx: e.clientX, sy: e.clientY, px: pan.x, py: pan.y };
      stage.classList.add("is-dragging");
      stage.setPointerCapture(e.pointerId);
      vHint.classList.add("is-gone");
    });
    stage.addEventListener("pointermove", (e) => {
      if (!drag) return;
      const l = limits();
      pan.x = Math.max(-l.x, Math.min(l.x, drag.px + (e.clientX - drag.sx)));
      pan.y = Math.max(-l.y, Math.min(l.y, drag.py + (e.clientY - drag.sy)));
      applyPan();
    });
    ["pointerup", "pointercancel"].forEach((ev) =>
      stage.addEventListener(ev, () => { drag = null; stage.classList.remove("is-dragging"); }));
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
