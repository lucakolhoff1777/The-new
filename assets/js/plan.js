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
    A(0, 2, "08:15", 60, "lk", "K. Falk", "Manuelle Therapie", "privat"),
    A(0, 0, "08:30", 45, "jr", "L. Sander", "Krankengymnastik", "rezept"),
    A(0, 3, "09:00", 60, "mb", "Y. Kessler", "Sportphysiotherapie", "privat"),
    A(0, 2, "09:15", 60, "jr", "G. Hübner", "Manuelle Therapie", "rezept"),
    A(0, 0, "10:00", 60, "sh", "N. Görlitz", "Klassische Massage", "privat"),
    A(0, 1, "10:00", 60, "lk", "S. Renner", "Sportphysiotherapie", "privat"),
    A(0, 3, "10:30", 60, "mb", "J. Amrein", "Sportphysiotherapie", "privat"),
    A(0, 0, "11:15", 60, "jr", "U. Sperling", "Krankengymnastik", "rezept"),
    A(0, 1, "11:30", 60, "sh", "I. Wendler", "Klassische Massage", "privat"),
    A(0, 2, "12:30", 45, "lk", "E. Lindqvist", "Schienenbegleitung", "zuweis"),
    A(0, 3, "12:30", 60, "mb", "O. Behrend", "Return-to-Sport", "paket"),
    A(0, 0, "13:00", 45, "jr", "G. Hübner", "Krankengymnastik", "rezept"),
    A(0, 1, "13:30", 60, "sh", "I. Wendler", "Klassische Massage", "privat"),
    A(0, 0, "13:45", 60, "lk", "A. Wiegand", "Manuelle Therapie", "privat"),
    A(0, 3, "13:45", 60, "mb", "J. Amrein", "Sportphysiotherapie", "privat"),
    A(0, 2, "14:00", 60, "jr", "G. Hübner", "Krankengymnastik", "rezept"),
    A(0, 1, "14:45", 45, "sh", "N. Görlitz", "Klassische Massage", "privat"),
    A(0, 3, "15:00", 60, "mb", "Y. Kessler", "Sportphysiotherapie", "privat"),

    /* ---- Dienstag ---- */
    A(1, 0, "08:30", 60, "lk", "E. Lindqvist", "Manuelle Therapie", "rezept"),
    A(1, 2, "08:30", 60, "jr", "R. Timm", "Krankengymnastik", "rezept"),
    A(1, 3, "08:30", 90, "mb", "F. Kolb", "Athletik-Check", "privat"),
    A(1, 1, "09:00", 45, "sh", "T. Lorenz", "Klassische Massage", "privat"),
    A(1, 1, "10:00", 45, "jr", "G. Hübner", "Elektro & Ultraschall", "rezept"),
    A(1, 2, "10:00", 60, "lk", "A. Wiegand", "Manuelle Therapie", "privat"),
    A(1, 3, "10:00", 60, "mb", "Y. Kessler", "Return-to-Sport", "paket"),
    A(1, 0, "10:15", 45, "sh", "N. Görlitz", "Klassische Massage", "privat"),
    A(1, 3, "11:00", 15, "mb", "Y. Kessler", "Kinesiotaping", "privat"),
    A(1, 1, "11:15", 60, "sh", "H. Bauer", "Klassische Massage", "privat"),
    A(1, 2, "11:15", 45, "jr", "P. Neuhaus", "Krankengymnastik", "rezept"),
    A(1, 0, "11:30", 60, "lk", "M. Draxler", "Manuelle Therapie", "privat"),
    A(1, 1, "12:15", 60, "jr", "B. Kirsch", "Krankengymnastik", "rezept"),
    A(1, 2, "12:15", 60, "sh", "H. Bauer", "Klassische Massage", "privat"),
    A(1, 3, "12:30", 45, "mb", "F. Kolb", "Leistungs-Recheck", "privat"),
    A(1, 1, "13:15", 60, "lk", "A. Wiegand", "Manuelle Therapie", "privat"),
    A(1, 0, "13:30", 60, "sh", "N. Görlitz", "Klassische Massage", "privat"),
    A(1, 2, "13:30", 45, "jr", "L. Sander", "Elektro & Ultraschall", "rezept"),
    A(1, 2, "14:15", 15, "mb", "L. Vogt", "Kinesiotaping", "privat"),
    A(1, 0, "14:45", 60, "sh", "T. Lorenz", "Klassische Massage", "privat"),
    A(1, 1, "14:45", 60, "lk", "V. Roth", "CMD-Ersttermin", "zuweis"),
    A(1, 3, "15:00", 60, "mb", "J. Amrein", "Return-to-Sport", "paket"),
    A(1, 2, "15:45", 60, "lk", "S. Renner", "CMD-Ersttermin", "zuweis"),
    A(1, 2, "17:15", 45, "lk", "M. Draxler", "CMD-Folge", "zuweis"),

    /* ---- Mittwoch ---- */
    A(2, 1, "08:00", 60, "lk", "R. Böhm", "CMD-Ersttermin", "zuweis"),
    A(2, 0, "08:30", 45, "sh", "C. Mertens", "Lymphdrainage", "rezept"),
    A(2, 1, "09:00", 60, "lk", "S. Renner", "CMD-Ersttermin", "zuweis"),
    A(2, 2, "09:00", 60, "jr", "B. Kirsch", "Manuelle Therapie", "rezept"),
    A(2, 1, "10:00", 45, "lk", "E. Lindqvist", "Schienenbegleitung", "zuweis"),
    A(2, 2, "10:00", 60, "sh", "T. Lorenz", "Klassische Massage", "privat"),
    A(2, 3, "10:00", 60, "mb", "D. Stauss", "Return-to-Sport", "paket"),
    A(2, 1, "11:00", 60, "lk", "A. Wiegand", "CMD-Ersttermin", "zuweis"),
    A(2, 2, "11:00", 45, "jr", "P. Neuhaus", "Elektro & Ultraschall", "rezept"),
    A(2, 2, "11:45", 60, "mb", "L. Vogt", "Sportphysiotherapie", "privat"),
    A(2, 1, "12:30", 30, "sh", "H. Bauer", "Lymphdrainage", "rezept"),
    A(2, 2, "12:45", 45, "jr", "M. Reiss", "Krankengymnastik", "rezept"),
    A(2, 0, "13:00", 45, "sh", "I. Wendler", "Lymphdrainage", "rezept"),
    A(2, 1, "13:30", 15, "mb", "P. Marchand", "Kinesiotaping", "privat"),
    A(2, 2, "14:00", 60, "jr", "A. Cetin", "Manuelle Therapie", "rezept"),
    A(2, 3, "14:45", 45, "mb", "O. Behrend", "Leistungs-Recheck", "privat"),
    A(2, 0, "15:30", 45, "jr", "R. Timm", "Krankengymnastik", "rezept"),
    A(2, 3, "16:00", 90, "mb", "P. Marchand", "Athletik-Check", "privat"),
    A(2, 2, "16:30", 60, "jr", "G. Hübner", "Krankengymnastik", "rezept"),

    /* ---- Donnerstag ---- */
    A(3, 3, "08:00", 45, "mb", "J. Amrein", "Leistungs-Recheck", "privat"),
    A(3, 3, "09:00", 90, "mb", "Y. Kessler", "Athletik-Check", "privat"),
    A(3, 1, "09:30", 60, "lk", "N. Kettler", "Manuelle Therapie", "privat"),
    A(3, 2, "09:30", 60, "jr", "R. Timm", "Krankengymnastik", "rezept"),
    A(3, 0, "10:30", 30, "sh", "S. Aksoy", "Lymphdrainage", "rezept"),
    A(3, 3, "10:45", 60, "lk", "T. Ohlert", "Sportphysiotherapie", "privat"),
    A(3, 2, "11:00", 45, "jr", "R. Timm", "Elektro & Ultraschall", "rezept"),
    A(3, 1, "11:15", 60, "sh", "I. Wendler", "Klassische Massage", "privat"),
    A(3, 3, "11:45", 45, "mb", "J. Amrein", "Leistungs-Recheck", "privat"),
    A(3, 1, "13:00", 45, "sh", "T. Lorenz", "Klassische Massage", "privat"),
    A(3, 2, "13:00", 60, "lk", "N. Kettler", "Manuelle Therapie", "rezept"),
    A(3, 3, "13:00", 15, "mb", "P. Marchand", "Kinesiotaping", "privat"),
    A(3, 0, "13:30", 45, "jr", "P. Neuhaus", "Krankengymnastik", "rezept"),
    A(3, 2, "14:00", 45, "sh", "C. Mertens", "Klassische Massage", "privat"),
    A(3, 0, "14:15", 60, "lk", "A. Wiegand", "CMD-Ersttermin", "zuweis"),
    A(3, 2, "14:45", 45, "jr", "G. Hübner", "Elektro & Ultraschall", "rezept"),
    A(3, 1, "15:00", 30, "sh", "N. Görlitz", "Lymphdrainage", "rezept"),
    A(3, 0, "15:45", 60, "lk", "S. Renner", "CMD-Ersttermin", "zuweis"),
    A(3, 2, "16:00", 45, "sh", "C. Mertens", "Lymphdrainage", "rezept"),
    A(3, 0, "16:45", 60, "sh", "W. Pohl", "Klassische Massage", "privat"),

    /* ---- Freitag ---- */
    A(4, 2, "08:00", 60, "lk", "E. Lindqvist", "Sportphysiotherapie", "privat"),
    A(4, 1, "08:30", 60, "jr", "B. Kirsch", "Krankengymnastik", "rezept"),
    A(4, 0, "09:00", 45, "sh", "H. Bauer", "Lymphdrainage", "rezept"),
    A(4, 3, "09:15", 45, "mb", "J. Amrein", "Leistungs-Recheck", "privat"),
    A(4, 1, "09:30", 60, "lk", "A. Wiegand", "Manuelle Therapie", "privat"),
    A(4, 0, "10:00", 45, "sh", "N. Görlitz", "Lymphdrainage", "rezept"),
    A(4, 2, "10:00", 60, "jr", "A. Cetin", "Manuelle Therapie", "rezept"),
    A(4, 0, "10:45", 60, "lk", "V. Roth", "CMD-Ersttermin", "zuweis"),
    A(4, 3, "10:45", 60, "mb", "J. Amrein", "Sportphysiotherapie", "privat"),
    A(4, 2, "11:00", 45, "sh", "S. Aksoy", "Klassische Massage", "privat"),
    A(4, 1, "11:30", 60, "jr", "L. Sander", "Krankengymnastik", "rezept"),
    A(4, 3, "12:15", 60, "lk", "E. Lindqvist", "Sportphysiotherapie", "privat"),
    A(4, 2, "12:30", 45, "sh", "S. Aksoy", "Klassische Massage", "privat"),
    A(4, 3, "13:15", 90, "mb", "O. Behrend", "Athletik-Check", "privat"),
    A(4, 1, "13:45", 45, "lk", "K. Falk", "CMD-Folge", "zuweis"),
    A(4, 2, "15:45", 15, "mb", "F. Kolb", "Kinesiotaping", "privat"),

    /* ---- Samstag ---- */
    A(5, 1, "09:30", 60, "lk", "E. Lindqvist", "Sportphysiotherapie", "privat"),
    A(5, 3, "09:30", 60, "mb", "O. Behrend", "Return-to-Sport", "paket"),
    A(5, 1, "10:45", 60, "lk", "M. Draxler", "Manuelle Therapie", "privat"),
    A(5, 3, "11:00", 90, "mb", "J. Amrein", "Athletik-Check", "privat"),
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
     Sign-in — a curtain, not a lock (see the note in the page footer).
     The session flag only saves re-typing while the tab is open.
     ======================================================================= */

  const PASSWORD = "2026";
  const SESSION_KEY = "lk-intranet";
  const gate = byId("gate"), app = byId("app");

  function signIn() {
    gate.classList.add("is-open");
    app.hidden = false;
    try { sessionStorage.setItem(SESSION_KEY, "1"); } catch (e) { /* private mode */ }
    render();
  }

  byId("gateForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const note = byId("gateNote");
    if (byId("gateInput").value.trim() === PASSWORD) {
      signIn();
    } else {
      note.textContent = "Passwort stimmt nicht — Demo-Passwort ist 2026.";
      note.classList.add("is-error");
      byId("gateInput").select();
    }
  });

  byId("logout").addEventListener("click", () => {
    try { sessionStorage.removeItem(SESSION_KEY); } catch (e) { /* private mode */ }
    location.reload();
  });

  /* =======================================================================
     Section tabs
     ======================================================================= */

  document.querySelectorAll(".tab").forEach((t) => {
    t.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((x) => {
        const on = x === t;
        x.classList.toggle("is-on", on);
        x.setAttribute("aria-selected", String(on));
      });
      document.querySelectorAll(".panel").forEach((p) => {
        p.hidden = p.dataset.panel !== t.dataset.tab;
      });
    });
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

  /* =======================================================================
     Week matrix — therapists down, days across
     ======================================================================= */

  const statsFor = (list) => ({
    n: list.length,
    h: list.reduce((s, a) => s + a.min, 0) / 60,
  });

  function renderWeek() {
    byId("matrixHead").innerHTML =
      `<th scope="col">Therapeut:in</th>` +
      DAYS.map((d) => `<th scope="col">${d.short}<small>${d.date}</small></th>`).join("") +
      `<th scope="col" class="tot">Woche</th>`;

    // one shared scale so the cells are comparable across the whole table
    let peak = 0;
    THERAPISTS.forEach((t) => DAYS.forEach((d) => {
      const n = APPOINTMENTS.filter((a) => a.ther === t.id && a.day === d.key).length;
      if (n > peak) peak = n;
    }));

    byId("matrixBody").innerHTML = THERAPISTS.map((t) => {
      const cells = DAYS.map((d) => {
        const s = statsFor(APPOINTMENTS.filter((a) => a.ther === t.id && a.day === d.key));
        if (!s.n) return `<td class="mc is-empty"><span class="mc-n">–</span></td>`;
        const strength = 0.16 + (s.n / peak) * 0.5;
        return `<td class="mc" style="--c:${t.color}; --f:${strength}">
                  <span class="mc-n">${s.n}</span>
                  <span class="mc-h">${s.h.toFixed(1).replace(".", ",")} h</span>
                </td>`;
      }).join("");
      const w = statsFor(APPOINTMENTS.filter((a) => a.ther === t.id));
      return `<tr>
        <th scope="row" class="mrow" style="--c:${t.color}">
          <i></i><span><b>${t.name}</b><small>${t.role}</small></span>
        </th>
        ${cells}
        <td class="mc tot"><span class="mc-n">${w.n}</span><span class="mc-h">${w.h.toFixed(1).replace(".", ",")} h</span></td>
      </tr>`;
    }).join("");

    // room utilisation across the week
    const openMin = DAYS.length * (DAY_END - DAY_START) * 60;
    byId("roomsLoad").innerHTML = ROOMS.map((r) => {
      const mins = APPOINTMENTS.filter((a) => a.room === r.id).reduce((s, a) => s + a.min, 0);
      const pct = Math.round((mins / openMin) * 100);
      return `<div class="rl">
        <div class="rl-top"><span>${r.name}</span><b>${pct} %</b></div>
        <span class="meter"><i style="width:${pct}%"></i></span>
        <span class="rl-note">${(mins / 60).toFixed(1).replace(".", ",")} h belegt · ${r.note}</span>
      </div>`;
    }).join("");
  }

  /* =======================================================================
     Team
     ======================================================================= */

  function renderTeam() {
    byId("teamList").innerHTML = THERAPISTS.map((t) => {
      const mine = APPOINTMENTS.filter((a) => a.ther === t.id);
      const w = statsFor(mine);
      const rooms = [...new Set(mine.map((a) => ROOMS[a.room].name))].join(" · ") || "—";
      const types = [...new Set(mine.map((a) => a.type))];
      return `<article class="tcard" style="--c:${t.color}">
        <div class="tcard-top">
          <span class="tcard-badge">${t.short}</span>
          <div><h3>${t.name}</h3><p>${t.role}</p></div>
        </div>
        <dl class="tcard-figs">
          <div><dt>Termine</dt><dd>${w.n}</dd></div>
          <div><dt>Stunden</dt><dd>${w.h.toFixed(1).replace(".", ",")}</dd></div>
          <div><dt>Ø / Tag</dt><dd>${(w.n / DAYS.length).toFixed(1).replace(".", ",")}</dd></div>
        </dl>
        <p class="tcard-rooms"><span>Räume</span>${rooms}</p>
        <div class="tcard-types">${types.map((x) => `<span>${x}</span>`).join("")}</div>
      </article>`;
    }).join("");
  }

  function render() {
    renderHead();
    renderBoard();
    renderList();
    renderStats();
    renderWeek();
    renderTeam();
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

  /* =======================================================================
     Restore an open session — last, because signIn() renders and the
     renderers close over bindings declared above this point.
     ======================================================================= */

  let restored = false;
  try { restored = sessionStorage.getItem(SESSION_KEY) === "1"; } catch (e) { /* private mode */ }
  if (restored) signIn();
})();
