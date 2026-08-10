(() => {
  "use strict";

  /* =======================================================================
     Reference data — example week, replace with the practice's own records
     ======================================================================= */

  // Fixed categorical order. Validated for the dark surface with
  // scripts/validate_palette.js: lightness band, chroma floor, CVD
  // separation, normal-vision floor and contrast all pass.
  const THERAPISTS = [
    { id: "lk", short: "LK", name: "Luca Kolhoff",    role: "Manuelle Therapie · CMD",        color: "#2E9A76" },
    { id: "mb", short: "MB", name: "Mira Bergmann",   role: "Sportphysio · Athletik-Lab",     color: "#BE8418" },
    { id: "jr", short: "JR", name: "Jonas Reither",   role: "Krankengymnastik · Elektro",     color: "#4489BE" },
    { id: "sh", short: "SH", name: "Sophie Hartmann", role: "Lymphdrainage · Massage",        color: "#BC5570" },
  ];

  const ROOMS = [
    { id: 0, name: "Raum I",       note: "Manuelle Therapie" },
    { id: 1, name: "Raum II",      note: "Krankengymnastik" },
    { id: 2, name: "Raum III",     note: "Massage · Lymphe" },
    { id: 3, name: "Athletik-Lab", note: "Diagnostik · Training" },
  ];

  const DAYS = [
    { key: 0, short: "Mo", date: "10.08." },
    { key: 1, short: "Di", date: "11.08." },
    { key: 2, short: "Mi", date: "12.08." },
    { key: 3, short: "Do", date: "13.08." },
    { key: 4, short: "Fr", date: "14.08." },
    { key: 5, short: "Sa", date: "15.08." },
  ];

  const BILL = {
    rezept: "Heilmittelverordnung",
    privat: "Privat / Selbstzahler",
    paket:  "Return-to-Sport Paket",
    zuweis: "CMD · mit Zuweisung",
  };

  // day, room, start, minutes, therapist, patient, treatment, billing
  const A = (day, room, start, min, ther, patient, type, bill) =>
    ({ day, room, start, min, ther, patient, type, bill });

  const APPOINTMENTS = [
    /* ---- Montag ---- */
    A(0, 0, "08:00", 60, "lk", "M. Draxler",   "Manuelle Therapie", "rezept"),
    A(0, 0, "09:15", 60, "lk", "S. Renner",    "CMD-Ersttermin",    "zuweis"),
    A(0, 0, "10:30", 45, "lk", "T. Ohlert",    "CMD-Folge",         "zuweis"),
    A(0, 0, "13:00", 60, "lk", "A. Wiegand",   "Manuelle Therapie", "privat"),
    A(0, 0, "14:15", 60, "lk", "K. Falk",      "Manuelle Therapie", "rezept"),
    A(0, 1, "08:00", 60, "jr", "P. Neuhaus",   "Krankengymnastik",  "rezept"),
    A(0, 1, "09:15", 60, "jr", "L. Sander",    "Krankengymnastik",  "rezept"),
    A(0, 1, "11:00", 45, "jr", "B. Kirsch",    "Elektro & Ultraschall", "rezept"),
    A(0, 1, "14:00", 60, "jr", "R. Timm",      "Krankengymnastik",  "rezept"),
    A(0, 2, "09:00", 45, "sh", "H. Bauer",     "Lymphdrainage",     "rezept"),
    A(0, 2, "10:00", 45, "sh", "C. Mertens",   "Klassische Massage","privat"),
    A(0, 2, "13:30", 45, "sh", "N. Görlitz",   "Lymphdrainage",     "rezept"),
    A(0, 3, "10:00", 90, "mb", "J. Amrein",    "Athletik-Check",    "privat"),
    A(0, 3, "14:00", 60, "mb", "F. Kolb",      "Return-to-Sport 4/10", "paket"),
    A(0, 3, "15:15", 60, "mb", "D. Stauss",    "Sportphysiotherapie", "privat"),

    /* ---- Dienstag ---- */
    A(1, 0, "08:00", 60, "lk", "S. Renner",    "CMD-Folge",         "zuweis"),
    A(1, 0, "09:15", 60, "lk", "E. Lindqvist", "Manuelle Therapie", "privat"),
    A(1, 0, "11:00", 60, "lk", "M. Draxler",   "Manuelle Therapie", "rezept"),
    A(1, 0, "15:00", 45, "lk", "T. Ohlert",    "Schienenbegleitung","zuweis"),
    A(1, 0, "16:00", 60, "lk", "V. Roth",      "CMD-Ersttermin",    "zuweis"),
    A(1, 1, "08:30", 60, "jr", "L. Sander",    "Krankengymnastik",  "rezept"),
    A(1, 1, "10:00", 60, "jr", "G. Hübner",    "Krankengymnastik",  "rezept"),
    A(1, 1, "13:00", 45, "jr", "B. Kirsch",    "Elektro & Ultraschall", "rezept"),
    A(1, 1, "14:00", 60, "jr", "P. Neuhaus",   "Krankengymnastik",  "rezept"),
    A(1, 2, "09:00", 45, "sh", "H. Bauer",     "Lymphdrainage",     "rezept"),
    A(1, 2, "11:00", 45, "sh", "I. Wendler",   "Klassische Massage","privat"),
    A(1, 2, "15:00", 45, "sh", "C. Mertens",   "Klassische Massage","privat"),
    A(1, 3, "08:00", 60, "mb", "F. Kolb",      "Return-to-Sport 5/10", "paket"),
    A(1, 3, "11:00", 90, "mb", "O. Behrend",   "Athletik-Check",    "privat"),
    A(1, 3, "16:00", 60, "mb", "D. Stauss",    "Sportphysiotherapie", "privat"),

    /* ---- Mittwoch ---- */
    A(2, 0, "08:00", 60, "lk", "A. Wiegand",   "Manuelle Therapie", "privat"),
    A(2, 0, "09:15", 60, "lk", "V. Roth",      "CMD-Folge",         "zuweis"),
    A(2, 0, "10:30", 60, "lk", "K. Falk",      "Manuelle Therapie", "rezept"),
    A(2, 0, "13:30", 45, "lk", "S. Renner",    "CMD-Folge",         "zuweis"),
    A(2, 1, "08:00", 60, "jr", "R. Timm",      "Krankengymnastik",  "rezept"),
    A(2, 1, "09:15", 60, "jr", "G. Hübner",    "Krankengymnastik",  "rezept"),
    A(2, 1, "10:30", 45, "jr", "U. Sperling",  "Elektro & Ultraschall", "rezept"),
    A(2, 1, "13:00", 60, "jr", "L. Sander",    "Krankengymnastik",  "rezept"),
    A(2, 1, "14:15", 60, "jr", "P. Neuhaus",   "Krankengymnastik",  "rezept"),
    A(2, 2, "08:30", 45, "sh", "N. Görlitz",   "Lymphdrainage",     "rezept"),
    A(2, 2, "10:00", 45, "sh", "I. Wendler",   "Klassische Massage","privat"),
    A(2, 2, "11:00", 45, "sh", "H. Bauer",     "Lymphdrainage",     "rezept"),
    A(2, 2, "14:00", 45, "sh", "W. Pohl",      "Klassische Massage","privat"),
    A(2, 3, "09:00", 60, "mb", "F. Kolb",      "Return-to-Sport 6/10", "paket"),
    A(2, 3, "13:00", 60, "mb", "J. Amrein",    "Sportphysiotherapie", "privat"),
    A(2, 3, "15:00", 60, "mb", "Y. Kessler",   "Sportphysiotherapie", "privat"),

    /* ---- Donnerstag ---- */
    A(3, 0, "08:00", 60, "lk", "E. Lindqvist", "Manuelle Therapie", "privat"),
    A(3, 0, "09:15", 60, "lk", "T. Ohlert",    "CMD-Folge",         "zuweis"),
    A(3, 0, "11:00", 60, "lk", "M. Draxler",   "Manuelle Therapie", "rezept"),
    A(3, 0, "14:00", 60, "lk", "Z. Aydin",     "CMD-Ersttermin",    "zuweis"),
    A(3, 0, "15:15", 60, "lk", "A. Wiegand",   "Manuelle Therapie", "privat"),
    A(3, 1, "08:30", 60, "jr", "G. Hübner",    "Krankengymnastik",  "rezept"),
    A(3, 1, "10:00", 60, "jr", "R. Timm",      "Krankengymnastik",  "rezept"),
    A(3, 1, "13:30", 45, "jr", "U. Sperling",  "Elektro & Ultraschall", "rezept"),
    A(3, 1, "14:30", 60, "jr", "L. Sander",    "Krankengymnastik",  "rezept"),
    A(3, 2, "09:00", 45, "sh", "W. Pohl",      "Klassische Massage","privat"),
    A(3, 2, "10:00", 45, "sh", "H. Bauer",     "Lymphdrainage",     "rezept"),
    A(3, 2, "13:00", 45, "sh", "C. Mertens",   "Klassische Massage","privat"),
    A(3, 2, "16:00", 45, "sh", "N. Görlitz",   "Lymphdrainage",     "rezept"),
    A(3, 3, "08:00", 90, "mb", "Y. Kessler",   "Athletik-Check",    "privat"),
    A(3, 3, "11:00", 60, "mb", "F. Kolb",      "Return-to-Sport 7/10", "paket"),
    A(3, 3, "15:00", 60, "mb", "O. Behrend",   "Sportphysiotherapie", "privat"),

    /* ---- Freitag ---- */
    A(4, 0, "08:00", 60, "lk", "K. Falk",      "Manuelle Therapie", "rezept"),
    A(4, 0, "09:15", 60, "lk", "Z. Aydin",     "CMD-Folge",         "zuweis"),
    A(4, 0, "10:30", 45, "lk", "V. Roth",      "Schienenbegleitung","zuweis"),
    A(4, 0, "13:00", 60, "lk", "S. Renner",    "CMD-Folge",         "zuweis"),
    A(4, 1, "08:00", 60, "jr", "P. Neuhaus",   "Krankengymnastik",  "rezept"),
    A(4, 1, "09:15", 60, "jr", "L. Sander",    "Krankengymnastik",  "rezept"),
    A(4, 1, "10:30", 60, "jr", "G. Hübner",    "Krankengymnastik",  "rezept"),
    A(4, 1, "13:00", 45, "jr", "B. Kirsch",    "Elektro & Ultraschall", "rezept"),
    A(4, 2, "09:00", 45, "sh", "I. Wendler",   "Klassische Massage","privat"),
    A(4, 2, "10:00", 45, "sh", "H. Bauer",     "Lymphdrainage",     "rezept"),
    A(4, 2, "11:00", 45, "sh", "W. Pohl",      "Klassische Massage","privat"),
    A(4, 3, "09:00", 60, "mb", "F. Kolb",      "Return-to-Sport 8/10", "paket"),
    A(4, 3, "10:30", 60, "mb", "D. Stauss",    "Sportphysiotherapie", "privat"),
    A(4, 3, "13:00", 90, "mb", "J. Amrein",    "Athletik-Check",    "privat"),

    /* ---- Samstag (nach Absprache) ---- */
    A(5, 0, "09:00", 60, "lk", "E. Lindqvist", "Manuelle Therapie", "privat"),
    A(5, 0, "10:15", 60, "lk", "Z. Aydin",     "CMD-Folge",         "zuweis"),
    A(5, 3, "09:00", 60, "mb", "Y. Kessler",   "Sportphysiotherapie", "privat"),
    A(5, 3, "10:15", 90, "mb", "O. Behrend",   "Athletik-Check",    "privat"),
  ];

  /* =======================================================================
     Helpers
     ======================================================================= */

  const DAY_START = 8, DAY_END = 19;
  // One source of truth for the row height — CSS reads it back off :root,
  // so the grid lines and the blocks can never drift apart.
  const HOUR_PX = 76;
  document.documentElement.style.setProperty("--hour", HOUR_PX + "px");
  const byId = (id) => document.getElementById(id);
  const therOf = (id) => THERAPISTS.find((t) => t.id === id);
  const toMin = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };
  const fmt = (mins) => `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;

  const state = { day: 0, hidden: new Set(), view: "raum" };

  /* =======================================================================
     Gate — a curtain, not a lock (see the note in the page footer)
     ======================================================================= */

  const gate = byId("gate"), app = byId("app");
  byId("gateForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const note = byId("gateNote");
    if (byId("gateInput").value.trim() === "2026") {
      gate.classList.add("is-open");
      app.hidden = false;
      render();
    } else {
      note.textContent = "Code stimmt nicht — Demo-Code ist 2026.";
      note.classList.add("is-error");
    }
  });

  /* =======================================================================
     Controls
     ======================================================================= */

  const daysWrap = byId("days");
  DAYS.forEach((d) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "day" + (d.key === state.day ? " is-on" : "");
    b.setAttribute("role", "tab");
    b.setAttribute("aria-selected", String(d.key === state.day));
    b.innerHTML = `<b>${d.short}</b><span>${d.date}</span>`;
    b.addEventListener("click", () => {
      state.day = d.key;
      daysWrap.querySelectorAll(".day").forEach((x, i) => {
        x.classList.toggle("is-on", i === d.key);
        x.setAttribute("aria-selected", String(i === d.key));
      });
      render();
    });
    daysWrap.appendChild(b);
  });

  const legend = byId("legend");
  THERAPISTS.forEach((t) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "lg";
    b.style.setProperty("--c", t.color);
    b.setAttribute("aria-pressed", "true");
    b.innerHTML = `<span class="dot"></span>${t.name}`;
    b.addEventListener("click", () => {
      if (state.hidden.has(t.id)) state.hidden.delete(t.id);
      else state.hidden.add(t.id);
      const off = state.hidden.has(t.id);
      b.classList.toggle("is-off", off);
      b.setAttribute("aria-pressed", String(!off));
      render();
    });
    legend.appendChild(b);
  });

  document.querySelectorAll(".vbtn").forEach((b) => {
    b.addEventListener("click", () => {
      state.view = b.dataset.view;
      document.querySelectorAll(".vbtn").forEach((x) => x.classList.toggle("is-on", x === b));
      byId("boardWrap").hidden = state.view !== "raum";
      byId("listWrap").hidden = state.view !== "liste";
    });
  });

  /* =======================================================================
     Rendering
     ======================================================================= */

  const head = byId("boardHead"), body = byId("boardBody");
  head.style.setProperty("--rooms", ROOMS.length);
  body.style.setProperty("--rooms", ROOMS.length);

  function visibleForDay() {
    return APPOINTMENTS.filter((a) => a.day === state.day);
  }

  function renderHead() {
    head.innerHTML =
      `<div class="rh">Zeit</div>` +
      ROOMS.map((r) => `<div class="rh">${r.name}<small>${r.note}</small></div>`).join("");
  }

  function renderBoard() {
    const hours = DAY_END - DAY_START;
    let html = `<div class="axis">`;
    for (let h = DAY_START; h < DAY_END; h++) html += `<div class="tick">${String(h).padStart(2, "0")}:00</div>`;
    html += `</div>`;

    ROOMS.forEach((room) => {
      html += `<div class="col">`;
      for (let h = 0; h < hours; h++) html += `<div class="slot"></div>`;
      visibleForDay()
        .filter((a) => a.room === room.id)
        .forEach((a) => {
          const t = therOf(a.ther);
          const top = ((toMin(a.start) - DAY_START * 60) / 60) * HOUR_PX;
          const h = (a.min / 60) * HOUR_PX - 3;           // 3px keeps a surface gap between blocks
          const dim = state.hidden.has(a.ther) ? " is-dim" : "";
          // 45-minute blocks still fit the treatment if set tight; below that it goes
          const short = a.min <= 30 ? " is-mini" : a.min <= 45 ? " is-short" : "";
          html += `<button type="button" class="appt${dim}${short}"
              style="--c:${t.color}; top:${top}px; height:${h}px"
              data-id="${APPOINTMENTS.indexOf(a)}">
              <span class="who">${t.short}</span>
              <span class="t">${a.start}–${fmt(toMin(a.start) + a.min)}</span>
              <span class="n">${a.patient}</span>
              <span class="s">${a.type}</span>
            </button>`;
        });
      html += `</div>`;
    });
    body.innerHTML = html;

    body.querySelectorAll(".appt").forEach((el) => {
      el.addEventListener("click", () => openDrawer(APPOINTMENTS[+el.dataset.id]));
    });
  }

  function renderList() {
    const rows = visibleForDay()
      .filter((a) => !state.hidden.has(a.ther))
      .sort((x, y) => toMin(x.start) - toMin(y.start));
    byId("listBody").innerHTML = rows.map((a) => {
      const t = therOf(a.ther);
      return `<tr>
        <td>${a.start}–${fmt(toMin(a.start) + a.min)}</td>
        <td>${ROOMS[a.room].name}</td>
        <td><span class="who-cell" style="--c:${t.color}"><i></i>${t.name}</span></td>
        <td>${a.patient}</td>
        <td>${a.type}</td>
      </tr>`;
    }).join("") || `<tr><td colspan="5">Keine Termine für die gewählte Auswahl.</td></tr>`;
  }

  function renderStats() {
    const shown = visibleForDay().filter((a) => !state.hidden.has(a.ther));
    const minutes = shown.reduce((s, a) => s + a.min, 0);
    const capacity = ROOMS.length * (DAY_END - DAY_START) * 60;

    byId("statCount").textContent = shown.length;
    byId("statCountNote").textContent = `${DAYS[state.day].short} ${DAYS[state.day].date}`;
    byId("statHours").textContent = (minutes / 60).toFixed(1).replace(".", ",") + " h";

    const load = capacity ? Math.round((minutes / capacity) * 100) : 0;
    byId("statLoad").textContent = load + " %";
    byId("statLoadBar").style.width = load + "%";

    // longest stretch with no appointment in any room
    const busy = new Array(DAY_END * 60).fill(false);
    shown.forEach((a) => {
      for (let m = toMin(a.start); m < toMin(a.start) + a.min; m++) busy[m] = true;
    });
    let best = 0, run = 0, bestEnd = 0;
    for (let m = DAY_START * 60; m < DAY_END * 60; m++) {
      if (!busy[m]) { run++; if (run > best) { best = run; bestEnd = m + 1; } }
      else run = 0;
    }
    byId("statGap").textContent = best >= 60
      ? (best / 60).toFixed(1).replace(".", ",") + " h"
      : best + " min";
    byId("statGapNote").textContent = best
      ? `${fmt(bestEnd - best)}–${fmt(bestEnd)} praxisweit frei`
      : "durchgehend belegt";
  }

  function render() {
    renderHead();
    renderBoard();
    renderList();
    renderStats();
  }

  /* =======================================================================
     Detail drawer
     ======================================================================= */

  const drawer = byId("drawer");
  function openDrawer(a) {
    const t = therOf(a.ther);
    byId("dTime").textContent = `${DAYS[a.day].short} ${DAYS[a.day].date} · ${a.start}–${fmt(toMin(a.start) + a.min)}`;
    byId("dTitle").textContent = a.patient;
    byId("dTher").textContent = `${t.name} (${t.short})`;
    byId("dRoom").textContent = ROOMS[a.room].name;
    byId("dType").textContent = a.type;
    byId("dDur").textContent = a.min + " Minuten";
    byId("dBill").textContent = BILL[a.bill] || "—";
    drawer.hidden = false;
  }
  function closeDrawer() { drawer.hidden = true; }
  byId("drawerClose").addEventListener("click", closeDrawer);
  drawer.addEventListener("click", (e) => { if (e.target === drawer) closeDrawer(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDrawer(); });
})();
