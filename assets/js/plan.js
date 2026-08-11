(() => {
  "use strict";

  /* =======================================================================
     Everything the intranet knows comes from assets/js/practice-data.js —
     the same file the booking page reads, so a slot cannot be free there and
     taken here.
     ======================================================================= */

  const P = window.PRAXIS;
  const {
    THERAPISTS, ROOMS, DAYS, BILL, APPOINTMENTS, PRICES, priceOf, eur, eur0,
    PAYMENTS, hash, SERVICES, SKILLS, SHIFTS, ABSENCES, ABSENCE_KIND, BLOCKS,
    BLOCK_KIND, PRESCRIPTIONS, PATIENTS, WAITLIST, MONTHS, WEEK0, TODAY,
    toMin, fmt, svcOf, priceFor, absentOn, addDays, daysBetween, weekday,
    deDate, DE_DAY, slotsFor, readRequests,
  } = P;
  /* =======================================================================
     Helpers
     ======================================================================= */

  const { DAY_START, DAY_END, LUNCH, hasLunch } = P;
  // One source of truth for the row height — CSS reads it back off :root,
  // so the grid lines and the blocks can never drift apart.
  const HOUR_PX = 82;
  document.documentElement.style.setProperty("--hour", HOUR_PX + "px");
  const byId = (id) => document.getElementById(id);
  const therOf = P.therOf;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const dateOfDay = (d) => addDays(WEEK0, d);

  const state = { day: 0, hidden: new Set(), view: "raum" };

  /* =======================================================================
     Sign-in — a curtain, not a lock (see the note in the page footer).
     The session flag only saves re-typing while the tab is open.
     ======================================================================= */

  const SESSION_KEY = "lk-intranet";
  const gate = byId("gate"), app = byId("app");

  function signIn(key) {
    roleKey = ROLES[key] ? key : "leitung";
    role = ROLES[roleKey];
    gate.classList.add("is-open");
    app.hidden = false;
    try { sessionStorage.setItem(SESSION_KEY, roleKey); } catch (e) { /* private mode */ }
    applyRole();
    render();
  }

  byId("gateForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const note = byId("gateNote");
    const key = byId("gateRole").value;
    if (byId("gateInput").value.trim() === ROLES[key].pw) {
      signIn(key);
    } else {
      note.textContent = `Passwort stimmt nicht — für ${ROLES[key].label} ist es „${ROLES[key].pw}“.`;
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
          // 45-minute blocks still fit the treatment if set tight; the
          // shortest ones collapse to a single line with just the name
          const short = a.min <= 20 ? " is-mini"
                      : a.min <= 30 ? " is-tight"
                      : a.min <= 45 ? " is-short" : "";
          html += `<button type="button" class="appt${dim}${short}"
              style="--c:${t.color}; top:${top}px; height:${h}px"
              data-id="${APPOINTMENTS.indexOf(a)}">
              <span class="who">${t.short}</span>
              <span class="t">${a.start}–${fmt(toMin(a.start) + a.min)}</span>
              <span class="n">${a.patient}</span>
              <span class="s">${a.type}</span>
            </button>`;
        });
      html += blocksHtml(room.id);
      html += `</div>`;
    });
    if (hasLunch(state.day)) {
      html += `<div class="lunchband" style="top:${((LUNCH[0] - DAY_START * 60) / 60) * HOUR_PX}px;
               height:${((LUNCH[1] - LUNCH[0]) / 60) * HOUR_PX}px"><span>Mittagspause 12–13 Uhr</span></div>`;
    }
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
    const closed = hasLunch(state.day) ? LUNCH[1] - LUNCH[0] : 0;
    const capacity = ROOMS.length * ((DAY_END - DAY_START) * 60 - closed);

    byId("statCount").textContent = shown.length;
    byId("statCountNote").textContent = `${DAYS[state.day].short} ${DAYS[state.day].date}`;
    byId("statHours").textContent = (minutes / 60).toFixed(1).replace(".", ",") + " h";

    const load = capacity ? Math.round((minutes / capacity) * 100) : 0;
    byId("statLoad").textContent = load + " %";
    byId("statLoadBar").style.width = load + "%";
    byId("statLoadNote").textContent = closed
      ? `${ROOMS.length} Räume · 08–19 Uhr ohne Mittagspause`
      : `${ROOMS.length} Räume · 08–19 Uhr`;

    // longest stretch with no appointment in any room
    const busy = new Array(DAY_END * 60).fill(false);
    shown.forEach((a) => {
      for (let m = toMin(a.start); m < toMin(a.start) + a.min; m++) busy[m] = true;
    });
    if (hasLunch(state.day)) for (let m = LUNCH[0]; m < LUNCH[1]; m++) busy[m] = true;
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
          <div><dt>Umsatz</dt><dd>${eur0(mine.reduce((s, a) => s + priceOf(a), 0))}</dd></div>
        </dl>
        <p class="tcard-rooms"><span>Räume</span>${rooms}</p>
        <div class="tcard-types">${types.map((x) => `<span>${x}</span>`).join("")}</div>
      </article>`;
    }).join("");
  }

  /* =======================================================================
     Abrechnung — eine Rechnung je Patient:in über die ganze Woche
     ======================================================================= */

  // gebaut, sobald die Datei geladen ist; die Woche ändert sich nicht mehr
  const INVOICES = (() => {
    const map = new Map();
    APPOINTMENTS.forEach((a, i) => {
      if (!map.has(a.patient)) map.set(a.patient, { patient: a.patient, items: [] });
      map.get(a.patient).items.push({ idx: i, appt: a, price: priceOf(a) });
    });

    return [...map.values()].map((inv) => {
      inv.items.sort((x, y) =>
        x.appt.day - y.appt.day || toMin(x.appt.start) - toMin(y.appt.start));
      inv.total = inv.items.reduce((s, it) => s + it.price, 0);
      inv.types = [...new Set(inv.items.map((it) => it.appt.type))];
      inv.bills = [...new Set(inv.items.map((it) => it.appt.bill))];
      inv.thers = [...new Set(inv.items.map((it) => it.appt.ther))];
      const last = inv.items[inv.items.length - 1].appt;
      inv.lastDay = DAYS[last.day];

      const h = hash(inv.patient);
      inv.paid = h % 100 < 62;
      inv.pay = PAYMENTS[h % PAYMENTS.length];
      inv.no = "R-2026-" + String(1200 + (h % 780)).padStart(4, "0");
      return inv;
    });
  })();

  const billState = { sort: "summe", q: "" };

  function billRows() {
    const q = billState.q.trim().toLowerCase();
    const rows = INVOICES.filter((inv) =>
      !q || inv.patient.toLowerCase().includes(q) ||
      inv.types.some((t) => t.toLowerCase().includes(q)));

    const by = {
      summe:   (x, y) => y.total - x.total,
      termine: (x, y) => y.items.length - x.items.length || y.total - x.total,
      name:    (x, y) => x.patient.localeCompare(y.patient, "de"),
    }[billState.sort];
    return rows.sort(by);
  }

  function renderBill() {
    const total = INVOICES.reduce((s, i) => s + i.total, 0);
    const open = INVOICES.filter((i) => !i.paid).reduce((s, i) => s + i.total, 0);
    const n = APPOINTMENTS.length;

    byId("billTotal").textContent = eur0(total);
    byId("billTotalNote").textContent = `${n} Positionen · ${INVOICES.length} Rechnungen`;
    byId("billOpen").textContent = eur0(open);
    byId("billOpenNote").textContent =
      `${INVOICES.filter((i) => !i.paid).length} offene Rechnungen · ${Math.round((open / total) * 100)} % vom Umsatz`;
    byId("billOpenBar").style.width = Math.round((open / total) * 100) + "%";
    byId("billAvg").textContent = eur0(total / n);
    byId("billHeads").textContent = INVOICES.length;
    byId("billHeadsNote").textContent =
      `Ø ${(n / INVOICES.length).toFixed(1).replace(".", ",")} Termine je Person`;

    /* --- Umsatz nach Leistung: eine Größe, deshalb ein Farbton --- */
    const perType = Object.keys(PRICES).map((type) => {
      const list = APPOINTMENTS.filter((a) => a.type === type);
      return { type, n: list.length, sum: list.reduce((s, a) => s + priceOf(a), 0) };
    }).filter((r) => r.n).sort((x, y) => y.sum - x.sum);

    const peak = perType[0].sum;
    byId("billBars").innerHTML = perType.map((r) => `
      <div class="bar">
        <span class="bar-label">${r.type}</span>
        <span class="bar-track"><i style="width:${(r.sum / peak) * 100}%"></i></span>
        <span class="bar-val"><b>${eur0(r.sum)}</b><small>${r.n}×</small></span>
      </div>`).join("");

    /* --- Rechnungen je Patient:in --- */
    const rows = billRows();
    byId("billBody").innerHTML = rows.map((inv) => `
      <tr tabindex="0" role="button" data-patient="${inv.patient}">
        <td class="bp"><b>${inv.patient}</b><small>${inv.no}</small></td>
        <td class="num">${inv.items.length}</td>
        <td><span class="chips">${inv.types.map((t) => `<span>${t}</span>`).join("")}</span></td>
        <td class="bmuted">${inv.bills.map((b) => BILL[b]).join(" · ")}</td>
        <td>${inv.paid
          ? `<span class="pill is-paid">✓ bezahlt<small>${inv.pay}</small></span>`
          : `<span class="pill is-open">● offen<small>seit ${inv.lastDay.date}</small></span>`}</td>
        <td class="num sum">${eur(inv.total)}</td>
      </tr>`).join("") ||
      `<tr><td colspan="6">Keine Treffer für „${billState.q}“.</td></tr>`;

    byId("billFoot").textContent = eur(rows.reduce((s, i) => s + i.total, 0));

    byId("billBody").querySelectorAll("tr[data-patient]").forEach((tr) => {
      const inv = INVOICES.find((i) => i.patient === tr.dataset.patient);
      tr.addEventListener("click", () => openInvoice(inv));
      tr.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openInvoice(inv); }
      });
    });

    byId("priceList").innerHTML = Object.entries(PRICES)
      .sort((a, b) => b[1].eur / b[1].unit - a[1].eur / a[1].unit)
      .map(([type, p]) => `<div class="pr">
        <span class="pr-name">${type}</span>
        <span class="pr-unit">${p.unit} Min.</span>
        <span class="pr-eur">${eur0(p.eur)}</span>
      </div>`).join("");
  }

  /* =======================================================================
     Umsatz je Therapeut:in — dieselben Positionen, nur anders gruppiert
     ======================================================================= */

  const therState = { split: "detail", hidden: new Set() };

  // Gruppenschlüssel je Ansicht. `detail` ist die Dreierkombination
  // Therapeut:in × Patient:in × Leistung, die anderen fassen eine Stufe zusammen.
  const SPLITS = {
    detail:   { key: (a) => [a.ther, a.patient, a.type],
                head: ["Therapeut:in", "Patient:in", "Leistung"] },
    patient:  { key: (a) => [a.ther, a.patient],
                head: ["Therapeut:in", "Patient:in", "Leistungen"] },
    leistung: { key: (a) => [a.ther, a.type],
                head: ["Therapeut:in", "Leistung", "Patient:innen"] },
  };

  function therGroups() {
    const split = SPLITS[therState.split];
    const map = new Map();
    APPOINTMENTS.forEach((a) => {
      if (therState.hidden.has(a.ther)) return;
      const k = JSON.stringify(split.key(a));
      if (!map.has(k)) {
        map.set(k, { ther: a.ther, patient: a.patient, type: a.type,
                     patients: new Set(), types: new Set(), n: 0, sum: 0 });
      }
      const g = map.get(k);
      g.patients.add(a.patient);
      g.types.add(a.type);
      g.n += 1;
      g.sum += priceOf(a);
    });
    // nach Therapeut:in in fester Reihenfolge, darin der größte Posten zuerst
    const order = (id) => THERAPISTS.findIndex((t) => t.id === id);
    return [...map.values()].sort((x, y) => order(x.ther) - order(y.ther) || y.sum - x.sum);
  }

  function renderTherRevenue() {
    const per = THERAPISTS.map((t) => {
      const mine = APPOINTMENTS.filter((a) => a.ther === t.id);
      const sum = mine.reduce((s, a) => s + priceOf(a), 0);
      const top = (pick) => {
        const acc = {};
        mine.forEach((a) => { acc[pick(a)] = (acc[pick(a)] || 0) + priceOf(a); });
        return Object.entries(acc).sort((x, y) => y[1] - x[1])[0];
      };
      return { t, n: mine.length, sum,
               heads: new Set(mine.map((a) => a.patient)).size,
               topType: top((a) => a.type), topPat: top((a) => a.patient) };
    }).sort((x, y) => y.sum - x.sum);

    const grand = per.reduce((s, x) => s + x.sum, 0);

    byId("therCards").innerHTML = per.map((r) => `
      <article class="tr-card" style="--c:${r.t.color}">
        <div class="tr-top">
          <span class="tr-badge">${r.t.short}</span>
          <div><h3>${r.t.name}</h3><p>${r.t.role}</p></div>
        </div>
        <span class="tr-sum">${eur0(r.sum)}</span>
        <span class="meter" aria-hidden="true"><i style="width:${(r.sum / grand) * 100}%"></i></span>
        <span class="tr-share">${Math.round((r.sum / grand) * 100)} % vom Wochenumsatz ·
          ${r.n} Termine · ${r.heads} Patient:innen · Ø ${eur0(r.sum / r.n)}</span>
        <dl class="tr-facts">
          <div><dt>Stärkste Leistung</dt><dd>${r.topType[0]}<b>${eur0(r.topType[1])}</b></dd></div>
          <div><dt>Stärkste:r Patient:in</dt><dd>${r.topPat[0]}<b>${eur0(r.topPat[1])}</b></dd></div>
        </dl>
      </article>`).join("");

    const head = SPLITS[therState.split].head;
    byId("therHead").innerHTML =
      head.map((h) => `<th scope="col">${h}</th>`).join("") +
      `<th scope="col" class="num">Termine</th><th scope="col" class="num">Umsatz</th>`;

    const rows = therGroups();
    byId("therBody").innerHTML = rows.map((g) => {
      const t = therOf(g.ther);
      const mid = {
        detail:   `<td>${g.patient}</td><td>${g.type}</td>`,
        patient:  `<td>${g.patient}</td>
                   <td><span class="chips">${[...g.types].map((x) => `<span>${x}</span>`).join("")}</span></td>`,
        leistung: `<td>${g.type}</td>
                   <td class="bmuted">${g.patients.size} ${g.patients.size === 1 ? "Person" : "Personen"}</td>`,
      }[therState.split];
      return `<tr>
        <td><span class="who-cell" style="--c:${t.color}"><i></i>${t.name}</span></td>
        ${mid}
        <td class="num">${g.n}</td>
        <td class="num sum">${eur(g.sum)}</td>
      </tr>`;
    }).join("") || `<tr><td colspan="5">Keine Therapeut:in ausgewählt.</td></tr>`;

    byId("therFoot").textContent = eur(rows.reduce((s, g) => s + g.sum, 0));
  }

  // Filterknöpfe — dieselbe Mechanik wie die Legende im Tagesplan
  const therPick = byId("therPick");
  THERAPISTS.forEach((t) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "lg";
    b.style.setProperty("--c", t.color);
    b.setAttribute("aria-pressed", "true");
    b.innerHTML = `<span class="dot"></span>${t.name}`;
    b.addEventListener("click", () => {
      if (therState.hidden.has(t.id)) therState.hidden.delete(t.id);
      else therState.hidden.add(t.id);
      const off = therState.hidden.has(t.id);
      b.classList.toggle("is-off", off);
      b.setAttribute("aria-pressed", String(!off));
      renderTherRevenue();
    });
    therPick.appendChild(b);
  });

  document.querySelectorAll("[data-split]").forEach((b) => {
    b.addEventListener("click", () => {
      therState.split = b.dataset.split;
      document.querySelectorAll("[data-split]").forEach((x) => x.classList.toggle("is-on", x === b));
      renderTherRevenue();
    });
  });

  byId("billSearch").addEventListener("input", (e) => {
    billState.q = e.target.value;
    renderBill();
  });
  document.querySelectorAll("[data-sort]").forEach((b) => {
    b.addEventListener("click", () => {
      billState.sort = b.dataset.sort;
      document.querySelectorAll("[data-sort]").forEach((x) => x.classList.toggle("is-on", x === b));
      renderBill();
    });
  });

  /* =======================================================================
     Roles. Three people look at this page and they do not need the same
     things: the practice owner sees the money, a therapist sees their own
     patients, reception sees the diary and the contact details.
     ======================================================================= */

  const ROLES = {
    leitung:  { pw: "2026",    label: "Praxisleitung", ther: null, money: true  },
    therapie: { pw: "team26",  label: "Therapie",      ther: "hw", money: false },
    empfang:  { pw: "front26", label: "Empfang",       ther: null, money: false },
  };
  let role = ROLES.leitung, roleKey = "leitung";

  function applyRole() {
    const me = role.ther ? therOf(role.ther) : null;
    byId("whoami").textContent = me ? `${me.name} · ${role.label}` : role.label;
    document.querySelectorAll("[data-roles]").forEach((el) => {
      el.hidden = !el.dataset.roles.split(" ").includes(roleKey);
    });
    document.body.classList.toggle("no-money", !role.money);
    // a therapist's view starts filtered to their own diary
    state.hidden = new Set(role.ther ? THERAPISTS.filter((t) => t.id !== role.ther).map((t) => t.id) : []);
    legend.querySelectorAll(".lg").forEach((b, i) => {
      const off = state.hidden.has(THERAPISTS[i].id);
      b.classList.toggle("is-off", off);
      b.setAttribute("aria-pressed", String(!off));
    });
    // if the active tab just disappeared, fall back to the day plan
    const on = document.querySelector(".tab.is-on");
    if (on && on.hidden) document.querySelector('.tab[data-tab="tagesplan"]').click();
  }

  const mine = (list, key) => (role.ther ? list.filter((x) => x[key || "ther"] === role.ther) : list);

  /* =======================================================================
     Room blocks — cleaning, servicing, deliveries. Not appointments, but
     they occupy the room, so they belong on the board and they block the
     online booking.
     ======================================================================= */

  function blocksHtml(roomId) {
    return BLOCKS.filter((b) => b.day === state.day && b.room === roomId).map((b) => {
      const top = ((toMin(b.start) - DAY_START * 60) / 60) * HOUR_PX;
      const h = (b.min / 60) * HOUR_PX - 3;
      const tier = b.min <= 20 ? " is-mini" : b.min <= 30 ? " is-tight" : " is-short";
      return `<div class="appt blocker${tier}" style="top:${top}px; height:${h}px">
          <span class="who">—</span>
          <span class="t">${b.start}–${fmt(toMin(b.start) + b.min)}</span>
          <span class="n">${BLOCK_KIND[b.kind]}</span>
          <span class="s">${esc(b.note)}</span>
        </div>`;
    }).join("");
  }

  /* =======================================================================
     Erinnerungen — 24 hours before the appointment
     ======================================================================= */

  const sentReminders = new Set();

  function remindDay() {
    // the reminders for the day after the one on screen
    return Math.min(state.day + 1, DAYS.length - 1);
  }

  function reminderRows() {
    const d = remindDay();
    return APPOINTMENTS.filter((a) => a.day === d)
      .filter((a) => !state.hidden.has(a.ther))
      .sort((x, y) => toMin(x.start) - toMin(y.start))
      .map((a) => {
        const rec = PATIENTS.find((p) => p.name === a.patient) || { remind: true, channel: "SMS" };
        const key = `${d}-${a.start}-${a.patient}`;
        const state_ = !rec.remind ? "abgemeldet"
          : (sentReminders.has(key) || dateOfDay(d) <= addDays(TODAY, 1)) ? "gesendet" : "geplant";
        return { a, rec, key, state: state_ };
      });
  }

  function renderReminders() {
    const d = remindDay();
    const rows = reminderRows();
    const n = (s) => rows.filter((r) => r.state === s).length;
    byId("remindSum").innerHTML =
      `<b>${DE_DAY[d]}, ${deDate(dateOfDay(d))}</b>
       <span>${rows.length} Termine · ${n("gesendet")} gesendet · ${n("geplant")} geplant ·
       ${n("abgemeldet")} abgemeldet</span>`;
    byId("remindSend").disabled = n("geplant") === 0;

    byId("remindBody").innerHTML = rows.map((r) => `
      <tr>
        <td class="bp"><b>${r.a.start}</b><small>${DAYS[d].short} ${DAYS[d].date}</small></td>
        <td>${esc(r.a.patient)}</td>
        <td class="bmuted">${r.a.type}</td>
        <td class="bmuted">${r.state === "abgemeldet" ? "—" : r.rec.channel}</td>
        <td>${r.state === "gesendet" ? `<span class="pill is-paid">✓ gesendet</span>`
            : r.state === "geplant" ? `<span class="pill is-open">● geplant</span>`
            : `<span class="pill is-off">– abgemeldet</span>`}</td>
      </tr>`).join("") || `<tr><td colspan="5">Für diesen Tag stehen keine Termine an.</td></tr>`;
  }

  byId("remindSend").addEventListener("click", () => {
    reminderRows().filter((r) => r.state === "geplant").forEach((r) => sentReminders.add(r.key));
    renderReminders();
  });

  /* =======================================================================
     Anfragen aus der Website + Warteliste
     ======================================================================= */

  const reqState = new Map();          // id -> state changed in this session
  const KIND = { termin: "Terminwunsch", rueckruf: "Rückruf" };

  const requests = () => readRequests().map((r) => ({ ...r, state: reqState.get(r.id) || r.state }));

  function renderRequests() {
    const all = requests();
    const open = all.filter((r) => r.state === "offen");
    byId("reqOpen").textContent = open.length;
    byId("reqBook").textContent = all.filter((r) => r.kind === "termin").length;
    byId("reqCall").textContent = all.filter((r) => r.kind === "rueckruf").length;
    byId("reqWait").textContent = WAITLIST.length;
    const badge = byId("tabBadge");
    badge.textContent = open.length || "";
    badge.hidden = !open.length;

    const order = { offen: 0, "bestätigt": 1, erledigt: 2 };
    byId("reqList").innerHTML = all
      .sort((a, b) => (order[a.state] - order[b.state]) || b.at.localeCompare(a.at))
      .map((r) => {
        const t = r.ther ? therOf(r.ther) : null;
        return `<article class="req is-${r.kind} is-${r.state === "offen" ? "open" : "done"}">
          <div class="req-top">
            <span class="req-kind">${KIND[r.kind]}</span>
            <span class="req-id">${r.id}</span>
            <span class="req-at">${r.at.replace(" ", " · ")} Uhr</span>
          </div>
          <h3>${esc(r.name)}</h3>
          <dl class="req-facts">
            <div><dt>Telefon</dt><dd><a href="tel:${r.phone.replace(/\\s/g, "")}">${r.phone}</a></dd></div>
            ${r.mail ? `<div><dt>E-Mail</dt><dd><a href="mailto:${r.mail}">${r.mail}</a></dd></div>` : ""}
            ${r.kind === "termin"
              ? `<div><dt>Wunschtermin</dt><dd>${deDate(r.date)} · ${r.start} Uhr</dd></div>
                 <div><dt>Leistung</dt><dd>${esc(r.type)}${t ? ` · ${t.name}` : " · egal wer"}</dd></div>`
              : `<div><dt>Zeitfenster</dt><dd>${esc(r.window || "egal")}</dd></div>`}
          </dl>
          ${r.note ? `<p class="req-note">„${esc(r.note)}“</p>` : ""}
          <div class="req-foot">
            <span class="pill ${r.state === "offen" ? "is-open" : "is-paid"}">
              ${r.state === "offen" ? "● offen" : "✓ " + r.state}</span>
            ${r.state === "offen" ? `
              <button type="button" class="btn-line" data-req="${r.id}" data-to="bestätigt">Bestätigen</button>
              <button type="button" class="btn-line" data-req="${r.id}" data-to="erledigt">Erledigt</button>` : ""}
          </div>
        </article>`;
      }).join("");

    byId("reqList").querySelectorAll("[data-req]").forEach((b) => {
      b.addEventListener("click", () => {
        reqState.set(b.dataset.req, b.dataset.to);
        renderRequests();
      });
    });

    byId("waitBody").innerHTML = WAITLIST.map((w, i) => {
      const t = w.ther ? therOf(w.ther) : null;
      return `<tr>
        <td class="bp"><b>${esc(w.patient)}</b><small>${w.phone}</small></td>
        <td>${esc(w.type)}</td>
        <td class="bmuted">${esc(w.prefer)}${t ? ` · ${t.short}` : ""}</td>
        <td class="bmuted">${deDate(w.since)}</td>
        <td class="bmuted">${esc(w.note) || "—"}</td>
        <td><button type="button" class="btn-line" data-wait="${i}">Passende suchen</button></td>
      </tr>`;
    }).join("");

    byId("waitBody").querySelectorAll("[data-wait]").forEach((b) => {
      b.addEventListener("click", () => openWait(WAITLIST[+b.dataset.wait]));
    });
  }

  /** What could this person be offered? Reads the same availability the
      website's booking page uses, so nothing is offered twice. */
  function openWait(w) {
    const svc = SERVICES.find((s) => s.name === w.type && s.book) || SERVICES.find((s) => s.name === w.type);
    const found = [];
    for (const d of P.nextDates(10)) {
      const slots = svc ? slotsFor(svc.key, d, w.ther || null) : [];
      slots.slice(0, 3).forEach((s) => found.push({ date: d, ...s }));
      if (found.length >= 9) break;
    }
    byId("dTime").textContent = `Warteliste · wartet seit ${deDate(w.since)}`;
    byId("dTitle").textContent = w.patient;
    drawerBody.innerHTML = `
      <dl class="drawer-list">
        <div><dt>Gewünschte Leistung</dt><dd>${esc(w.type)}</dd></div>
        <div><dt>Wunschzeit</dt><dd>${esc(w.prefer)}</dd></div>
        <div><dt>Therapeut:in</dt><dd>${w.ther ? therOf(w.ther).name : "egal"}</dd></div>
        <div><dt>Telefon</dt><dd><a href="tel:${w.phone.replace(/\s/g, "")}">${w.phone}</a></dd></div>
      </dl>
      <h3 class="drawer-sub">Freie Termine, die passen</h3>
      ${found.length ? `<ul class="slotlist">${found.map((f) => `
        <li><b>${DE_DAY[weekday(f.date)].slice(0, 2)} ${deDate(f.date)}</b>
            <span>${f.start} Uhr</span>
            <em>${therOf(f.ther).name}</em></li>`).join("")}</ul>`
        : `<p class="drawer-empty">In den nächsten zehn Tagen ist nichts frei, das passt.
           ${w.ther ? "Ohne Bindung an eine Person wären es mehr." : ""}</p>`}
      <p class="drawer-hint">Dieselbe Verfügbarkeit, die auch die Online-Buchung anzeigt.</p>`;
    drawer.hidden = false;
  }

  /* =======================================================================
     Patient:innen
     ======================================================================= */

  const patState = { q: "", filter: "alle" };

  const apptsOf = (name) => APPOINTMENTS.filter((a) => a.patient === name);
  const rxOf = (name) => PRESCRIPTIONS.find((r) => r.patient === name);
  function nextApptOf(name) {
    return apptsOf(name).map((a) => ({ a, date: dateOfDay(a.day) }))
      .filter((x) => x.date >= TODAY)
      .sort((x, y) => x.date.localeCompare(y.date) || toMin(x.a.start) - toMin(y.a.start))[0] || null;
  }

  function patientRows() {
    const q = patState.q.trim().toLowerCase();
    return mine(PATIENTS, "ther").filter((p) => {
      const list = apptsOf(p.name);
      if (patState.filter === "rezept" && !rxOf(p.name)) return false;
      if (patState.filter === "woche" && !list.length) return false;
      if (!q) return true;
      const t = therOf(p.ther);
      return p.name.toLowerCase().includes(q) ||
             (t && t.name.toLowerCase().includes(q)) ||
             list.some((a) => a.type.toLowerCase().includes(q));
    }).sort((a, b) => a.name.localeCompare(b.name, "de"));
  }

  function renderPatients() {
    const rows = patientRows();
    byId("patBody").innerHTML = rows.map((p) => {
      const t = therOf(p.ther);
      const list = apptsOf(p.name);
      const types = [...new Set(list.map((a) => a.type))];
      const rx = rxOf(p.name);
      const st = rx ? rxStatus(rx) : null;
      return `<tr tabindex="0" role="button" data-pat="${esc(p.name)}">
        <td class="bp"><b>${esc(p.name)}</b><small>${p.phone}</small></td>
        <td class="bmuted">${p.born}</td>
        <td><span class="who-cell" style="--c:${t.color}"><i></i>${t.name}</span></td>
        <td><span class="chips">${types.map((x) => `<span>${x}</span>`).join("") || "—"}</span></td>
        <td class="num">${list.length}</td>
        <td>${rx ? `<span class="pill is-${st.tone}">${st.short}</span>` : `<span class="bmuted">Selbstzahler</span>`}</td>
        <td class="bmuted">${p.remind ? p.channel : "abgemeldet"}</td>
      </tr>`;
    }).join("") || `<tr><td colspan="7">Keine Treffer.</td></tr>`;

    byId("patBody").querySelectorAll("[data-pat]").forEach((tr) => {
      const open = () => openPatient(PATIENTS.find((p) => p.name === tr.dataset.pat));
      tr.addEventListener("click", open);
      tr.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
      });
    });
  }

  function openPatient(p) {
    const t = therOf(p.ther);
    const list = apptsOf(p.name).sort((x, y) => x.day - y.day || toMin(x.start) - toMin(y.start));
    const rx = rxOf(p.name);
    const st = rx ? rxStatus(rx) : null;
    const sum = list.reduce((s, a) => s + priceOf(a), 0);
    byId("dTime").textContent = `Patientenakte · seit ${deDate(p.since)}`;
    byId("dTitle").textContent = p.name;
    drawerBody.innerHTML = `
      <dl class="drawer-list">
        <div><dt>Jahrgang</dt><dd>${p.born}</dd></div>
        <div><dt>Telefon</dt><dd><a href="tel:${p.phone.replace(/\s/g, "")}">${p.phone}</a></dd></div>
        <div><dt>E-Mail</dt><dd>${p.mail}</dd></div>
        <div><dt>Adresse</dt><dd>${esc(p.street)}</dd></div>
        <div><dt>Therapeut:in</dt><dd>${t.name}</dd></div>
        <div><dt>Erinnerung</dt><dd>${p.remind ? p.channel + ", 24 h vorher" : "abgemeldet"}</dd></div>
      </dl>

      ${rx ? `<h3 class="drawer-sub">Verordnung ${rx.no}</h3>
      <div class="rxbox is-${st.tone}">
        <div class="rxbox-top"><b>${rx.type}</b><span>${rx.done} von ${rx.units} Einheiten</span></div>
        <span class="meter"><i style="width:${Math.min(100, (rx.done / rx.units) * 100)}%"></i></span>
        <p>${st.label}</p>
      </div>` : `<p class="drawer-hint">Keine laufende Verordnung — Selbstzahler.</p>`}

      <h3 class="drawer-sub">Behandlungen dieser Woche</h3>
      ${list.length ? `<table class="postable">
        <thead><tr><th scope="col">Tag</th><th scope="col">Leistung</th>
                   <th scope="col">Wer</th><th scope="col" class="num">Dauer</th>
                   <th scope="col" class="num money">Betrag</th></tr></thead>
        <tbody>${list.map((a) => {
          const th = therOf(a.ther);
          return `<tr><td>${DAYS[a.day].short} ${DAYS[a.day].date}<small>${a.start}</small></td>
            <td>${a.type}</td>
            <td><span class="who-cell" style="--c:${th.color}"><i></i>${th.short}</span></td>
            <td class="num">${a.min} Min.</td>
            <td class="num money">${eur(priceOf(a))}</td></tr>`;
        }).join("")}</tbody>
        <tfoot><tr><th scope="row" colspan="4">Gesamt</th>
                   <td class="num money">${eur(sum)}</td></tr></tfoot>
      </table>` : `<p class="drawer-empty">In dieser Beispielwoche kein Termin.</p>`}`;
    drawer.hidden = false;
  }

  byId("patSearch").addEventListener("input", (e) => { patState.q = e.target.value; renderPatients(); });
  document.querySelectorAll("[data-patf]").forEach((b) => {
    b.addEventListener("click", () => {
      patState.filter = b.dataset.patf;
      b.parentElement.querySelectorAll(".vbtn").forEach((x) => x.classList.toggle("is-on", x === b));
      renderPatients();
    });
  });

  /* =======================================================================
     Heilmittelverordnungen.

     Two deadlines decide whether the health insurer pays: treatment has to
     start within 28 days of the issue date, and a running series must not be
     interrupted for more than 14 days. A booked follow-up inside the window
     settles it — that is why the next appointment is part of the check.
     ======================================================================= */

  const RX_START_DAYS = 28, RX_GAP_DAYS = 14;

  function rxStatus(r) {
    const next = nextApptOf(r.patient);
    const nextDate = next ? next.date : null;

    if (r.done >= r.units) {
      return { tone: "late", short: "aufgebraucht", label:
        `Alle ${r.units} Einheiten abgerechnet. Für weitere Behandlungen braucht es eine Folgeverordnung.`,
        left: null, dead: null, rank: 1 };
    }
    const started = !!r.started;
    const dead = addDays(started ? r.last : r.issued, started ? RX_GAP_DAYS : RX_START_DAYS);
    const left = daysBetween(TODAY, dead);

    if (nextDate && nextDate <= dead) {
      return { tone: "paid", short: "terminiert", rank: 4,
        label: `${started ? "Fortsetzung" : "Beginn"} am ${deDate(nextDate)} gebucht — Frist bis ${deDate(dead)} gewahrt.`,
        left, dead };
    }
    const tone = left <= 3 ? "late" : left <= 7 ? "open" : "paid";
    return {
      tone, rank: left <= 3 ? 0 : left <= 7 ? 2 : 3,
      short: left < 0 ? "abgelaufen" : `${left} Tage`,
      label: started
        ? `Letzte Behandlung am ${deDate(r.last)}. Ohne Folgetermin bis ${deDate(dead)} verfällt die Verordnung.`
        : `Ausgestellt am ${deDate(r.issued)}. Behandlungsbeginn muss bis ${deDate(dead)} erfolgen.`,
      left, dead,
    };
  }

  const rxState = { filter: "handeln" };

  function renderRx() {
    const all = mine(PRESCRIPTIONS, "ther").map((r) => ({ r, st: rxStatus(r) }));
    const count = (f) => all.filter(f).length;
    byId("rxCrit").textContent = count((x) => x.st.rank === 0);
    byId("rxWarn").textContent = count((x) => x.st.rank === 2);
    byId("rxDone").textContent = count((x) => x.st.rank === 1);
    byId("rxOk").textContent = count((x) => x.st.rank >= 3);

    const rows = all
      .filter((x) => rxState.filter === "alle" || x.st.rank <= 2)
      .sort((a, b) => a.st.rank - b.st.rank || (a.st.left ?? 99) - (b.st.left ?? 99));

    byId("rxBody").innerHTML = rows.map(({ r, st }) => {
      const t = therOf(r.ther);
      const next = nextApptOf(r.patient);
      return `<tr tabindex="0" role="button" data-rx="${r.no}">
        <td class="bp"><b>${r.no}</b><small>${deDate(r.issued)}</small></td>
        <td>${esc(r.patient)}<br><span class="who-cell" style="--c:${t.color}"><i></i>${t.short}</span></td>
        <td class="bmuted">${r.type}</td>
        <td class="num">${r.done} / ${r.units}</td>
        <td class="bmuted">${st.dead ? deDate(st.dead) : "—"}</td>
        <td class="bmuted">${next ? `${deDate(next.date)} · ${next.a.start}` : "— nicht gebucht"}</td>
        <td><span class="pill is-${st.tone}">${st.rank === 0 ? "▲ " : st.rank === 2 ? "● " : "✓ "}${st.short}</span></td>
      </tr>`;
    }).join("") || `<tr><td colspan="7">Nichts zu tun — alle Verordnungen laufen im Rahmen.</td></tr>`;

    byId("rxBody").querySelectorAll("[data-rx]").forEach((tr) => {
      const open = () => openRx(PRESCRIPTIONS.find((r) => r.no === tr.dataset.rx));
      tr.addEventListener("click", open);
      tr.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
      });
    });
  }

  function openRx(r) {
    const st = rxStatus(r), t = therOf(r.ther);
    const next = nextApptOf(r.patient);
    const pat = PATIENTS.find((p) => p.name === r.patient);
    byId("dTime").textContent = `${r.no} · ausgestellt ${deDate(r.issued)}`;
    byId("dTitle").textContent = r.patient;
    drawerBody.innerHTML = `
      <div class="rxbox is-${st.tone}">
        <div class="rxbox-top"><b>${r.type}</b><span>${r.done} von ${r.units} Einheiten</span></div>
        <span class="meter"><i style="width:${Math.min(100, (r.done / r.units) * 100)}%"></i></span>
        <p>${st.label}</p>
      </div>
      <dl class="drawer-list">
        <div><dt>Art</dt><dd>${BILL[r.kind] || r.kind}</dd></div>
        <div><dt>Therapeut:in</dt><dd>${t.name}</dd></div>
        <div><dt>Behandlung begonnen</dt><dd>${r.started ? deDate(r.started) : "noch nicht"}</dd></div>
        <div><dt>Letzte Behandlung</dt><dd>${r.last ? deDate(r.last) : "—"}</dd></div>
        <div><dt>Nächster Termin</dt><dd>${next ? `${deDate(next.date)} · ${next.a.start} Uhr` : "nicht gebucht"}</dd></div>
        ${pat ? `<div><dt>Telefon</dt><dd><a href="tel:${pat.phone.replace(/\s/g, "")}">${pat.phone}</a></dd></div>` : ""}
      </dl>
      <p class="drawer-hint">Fristen nach Heilmittel-Richtlinie: Behandlungsbeginn innerhalb von
        ${RX_START_DAYS} Tagen nach Ausstellung, Unterbrechung höchstens ${RX_GAP_DAYS} Tage.</p>`;
    drawer.hidden = false;
  }

  document.querySelectorAll("[data-rxf]").forEach((b) => {
    b.addEventListener("click", () => {
      rxState.filter = b.dataset.rxf;
      b.parentElement.querySelectorAll(".vbtn").forEach((x) => x.classList.toggle("is-on", x === b));
      renderRx();
    });
  });

  /* =======================================================================
     Umsatz im Verlauf — one measure over time, so one hue
     ======================================================================= */

  function renderTrend() {
    const peak = Math.max(...MONTHS.map((m) => m.revenue));
    byId("trend").innerHTML = MONTHS.map((m) => `
      <div class="tcol${m.partial ? " is-partial" : ""}">
        <span class="tcol-val">${eur0(m.revenue)}</span>
        <span class="tcol-bar" style="height:${(m.revenue / peak) * 100}%"></span>
        <span class="tcol-lab">${m.label}</span>
      </div>`).join("");

    byId("trendBody").innerHTML = MONTHS.map((m, i) => {
      const prev = MONTHS[i - 1];
      const delta = prev ? (m.revenue / prev.revenue - 1) * 100 : null;
      return `<tr>
        <td class="bp"><b>${m.label} 2026</b>${m.partial ? "<small>läuft noch</small>" : ""}</td>
        <td class="num sum">${eur0(m.revenue)}</td>
        <td class="num">${m.appts}</td>
        <td class="num">${eur0(m.revenue / m.appts)}</td>
        <td class="num ${delta === null ? "" : delta < 0 ? "is-down" : "is-up"}">${
          delta === null ? "—" : (delta > 0 ? "+" : "") + delta.toFixed(1).replace(".", ",") + " %"}</td>
      </tr>`;
    }).join("");
  }

  /* =======================================================================
     Abwesenheiten und Raumblocker
     ======================================================================= */

  function renderAbsences() {
    byId("absBody").innerHTML = ABSENCES.map((x) => {
      const t = therOf(x.ther);
      const days = daysBetween(x.from, x.to) + 1;
      // series that would run into the gap
      const hit = PRESCRIPTIONS.filter((r) => r.ther === x.ther && r.done < r.units).length;
      return `<tr>
        <td><span class="who-cell" style="--c:${t.color}"><i></i>${t.name}</span></td>
        <td>${ABSENCE_KIND[x.kind]}${x.note ? `<br><span class="bmuted">${esc(x.note)}</span>` : ""}</td>
        <td class="bmuted">${deDate(x.from)}</td>
        <td class="bmuted">${deDate(x.to)}</td>
        <td class="num">${days}</td>
        <td class="bmuted">${hit} laufende Verordnung${hit === 1 ? "" : "en"}</td>
      </tr>`;
    }).join("");

    byId("blockBody").innerHTML = BLOCKS.map((b) => `
      <tr>
        <td class="bp"><b>${DAYS[b.day].short}</b><small>${DAYS[b.day].date}</small></td>
        <td class="bmuted">${b.start}–${fmt(toMin(b.start) + b.min)}</td>
        <td>${ROOMS[b.room].name}</td>
        <td>${BLOCK_KIND[b.kind]}</td>
        <td class="bmuted">${esc(b.note)}</td>
      </tr>`).join("") || `<tr><td colspan="5">Keine Blocker eingetragen.</td></tr>`;
  }

  function render() {
    renderHead();
    renderBoard();
    renderList();
    renderStats();
    renderWeek();
    renderBill();
    renderTherRevenue();
    renderTrend();
    renderTeam();
    renderReminders();
    renderRequests();
    renderPatients();
    renderRx();
    renderAbsences();
  }

  /* =======================================================================
     Detail drawer
     ======================================================================= */

  const drawer = byId("drawer");
  const drawerBody = byId("drawerBody");

  function openDrawer(a) {
    const t = therOf(a.ther);
    byId("dTime").textContent = `${DAYS[a.day].short} ${DAYS[a.day].date} · ${a.start}–${fmt(toMin(a.start) + a.min)}`;
    byId("dTitle").textContent = a.patient;
    drawerBody.innerHTML = `
      <dl class="drawer-list">
        <div><dt>Therapeut:in</dt><dd>${t.name} (${t.short})</dd></div>
        <div><dt>Raum</dt><dd>${ROOMS[a.room].name}</dd></div>
        <div><dt>Leistung</dt><dd>${a.type}</dd></div>
        <div><dt>Dauer</dt><dd>${a.min} Minuten</dd></div>
        <div><dt>Abrechnung</dt><dd>${BILL[a.bill] || "—"}</dd></div>
        <div><dt>Betrag</dt><dd>${eur(priceOf(a))}</dd></div>
      </dl>
      <button type="button" class="drawer-more" data-open-invoice="${a.patient}">
        Ganze Abrechnung von ${a.patient} ansehen →
      </button>`;
    drawerBody.querySelector("[data-open-invoice]").addEventListener("click", () => {
      openInvoice(INVOICES.find((i) => i.patient === a.patient));
    });
    drawer.hidden = false;
  }

  function openInvoice(inv) {
    byId("dTime").textContent = `${inv.no} · Woche 10.–15.08.2026`;
    byId("dTitle").textContent = inv.patient;
    drawerBody.innerHTML = `
      <div class="print-head">
        <div>
          <b>Luca Kolhoff · Privatpraxis für Physiotherapie</b>
          <span>Musterstraße 12 · 00000 Musterstadt · +49 000 000 000</span>
          <span>hallo@lucakolhoff.de · Steuernummer 000/000/00000</span>
        </div>
        <div class="print-inv">
          <b>Rechnung ${inv.no}</b>
          <span>Rechnungsdatum ${deDate(TODAY)}</span>
          <span>Leistungszeitraum 10.–15.08.2026</span>
        </div>
      </div>
      <div class="inv-head">
        ${inv.paid
          ? `<span class="pill is-paid">✓ bezahlt<small>${inv.pay}</small></span>`
          : `<span class="pill is-open">● offen<small>seit ${inv.lastDay.date}</small></span>`}
        <span class="inv-meta">${inv.items.length} Positionen · ${inv.bills.map((b) => BILL[b]).join(" · ")}</span>
      </div>
      <table class="postable">
        <caption class="sr-only">Einzelpositionen</caption>
        <thead>
          <tr><th scope="col">Tag</th><th scope="col">Leistung</th>
              <th scope="col">Therapeut:in</th><th scope="col" class="num">Dauer</th>
              <th scope="col" class="num">Betrag</th></tr>
        </thead>
        <tbody>
          ${inv.items.map((it) => {
            const a = it.appt, t = therOf(a.ther);
            return `<tr>
              <td>${DAYS[a.day].short} ${DAYS[a.day].date}<small>${a.start}</small></td>
              <td>${a.type}</td>
              <td><span class="who-cell" style="--c:${t.color}"><i></i>${t.short}</span></td>
              <td class="num">${a.min} Min.</td>
              <td class="num">${eur(it.price)}</td>
            </tr>`;
          }).join("")}
        </tbody>
        <tfoot>
          <tr><th scope="row" colspan="4">Gesamt</th><td class="num">${eur(inv.total)}</td></tr>
        </tfoot>
      </table>
      <p class="inv-terms">Zahlbar innerhalb von 14 Tagen ohne Abzug.
        Leistungen nach GebüH; Heilmittel auf Grundlage der jeweiligen Verordnung.</p>
      <button type="button" class="btn-line btn-wide" id="invPrint">Rechnung drucken / als PDF sichern</button>`;
    byId("invPrint").addEventListener("click", () => window.print());
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

  let restored = null;
  try { restored = sessionStorage.getItem(SESSION_KEY); } catch (e) { /* private mode */ }
  if (restored && ROLES[restored]) signIn(restored);
})();
