/* ==========================================================================
   Termin absagen, verschieben oder in den eigenen Kalender legen.

   The code in the confirmation stands in for a login. That is fine for
   cancelling an appointment and wrong for anything else — a real deployment
   should use a one-time link per appointment, not a code that never expires,
   and it belongs on a server: this page can only remember a cancellation in
   the browser that made it.
   ========================================================================== */

(() => {
  "use strict";

  const P = window.PRAXIS;
  const byId = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  let me = null, moving = null;

  /* ------------------------------------------------------------- sign in */

  function show(p) {
    me = p;
    byId("codeForm").hidden = true;
    byId("mine").hidden = false;
    byId("mineTitle").textContent = `Hallo ${p.name.split(". ")[1]}`;
    renderAppointments();
  }

  byId("codeForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const p = P.patientByCode(byId("codeInput").value);
    const msg = byId("codeMsg");
    if (!p) {
      msg.textContent = "Diesen Code kennen wir nicht. Steht er genau so in der Bestätigung?";
      msg.className = "form-note is-error";
      return;
    }
    show(p);
  });

  /* ------------------------------------------------- upcoming appointments */

  const hoursTo = (dateISO, start) => {
    const now = new Date(P.TODAY + "T09:00:00");
    const then = new Date(dateISO + "T" + start + ":00");
    return (then - now) / 3600000;
  };

  function renderAppointments() {
    const list = P.upcomingOf(me.name);
    byId("apptCards").innerHTML = list.length ? list.map(({ a, date }) => {
      const t = P.therOf(a.ther);
      const svc = P.SERVICES.find((s) => s.name === a.type && s.min === a.min) ||
                  P.SERVICES.find((s) => s.name === a.type);
      const late = hoursTo(date, a.start) < 24;
      return `<article class="appt-card glass">
        <div class="appt-when">
          <b>${P.DE_DAY[P.weekday(date)]}</b>
          <span>${P.deDate(date)}</span>
          <em>${a.start} Uhr</em>
        </div>
        <div class="appt-what">
          <h3>${esc(a.type)}</h3>
          <p>${a.min} Minuten · ${t.name}</p>
          <p class="appt-where" data-placeholder>Musterstraße 12, 00000 Musterstadt</p>
          ${late ? `<p class="appt-warn">Weniger als 24 Stunden hin — eine Absage kostet jetzt
             die Hälfte. Ruf uns lieber kurz an, oft finden wir eine Lösung.</p>` : ""}
        </div>
        <div class="appt-do">
          <button type="button" class="btn-line" data-ics="${date}|${a.start}|${a.min}|${esc(a.type)}">
            In meinen Kalender</button>
          <button type="button" class="btn-line" data-move="${date}|${a.start}|${svc ? svc.key : ""}">
            Verschieben</button>
          <button type="button" class="btn-line is-danger" data-cancel="${date}|${a.start}|${esc(a.type)}">
            Absagen</button>
        </div>
      </article>`;
    }).join("") : `<p class="slots-empty">Für dich steht gerade kein Termin an.
        <a class="ul" href="termin.html">Freie Zeiten ansehen</a>.</p>`;

    byId("apptCards").querySelectorAll("[data-ics]").forEach((b) =>
      b.addEventListener("click", () => {
        const [date, start, min, type] = b.dataset.ics.split("|");
        downloadIcs(date, start, +min, type);
      }));
    byId("apptCards").querySelectorAll("[data-move]").forEach((b) =>
      b.addEventListener("click", () => startMove(...b.dataset.move.split("|"))));
    byId("apptCards").querySelectorAll("[data-cancel]").forEach((b) =>
      b.addEventListener("click", () => cancel(...b.dataset.cancel.split("|"))));
  }

  /* ----------------------------------------------------------------- .ics */

  function downloadIcs(date, start, min, type) {
    const text = P.icsFor({
      title: `${type} · Praxis Luca Kolhoff`,
      dateISO: date, start, min,
      description: "Bitte fünf Minuten vorher da sein. Absage bis 24 Stunden vorher kostenfrei.",
    });
    const url = URL.createObjectURL(new Blob([text], { type: "text/calendar;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `termin-${date}-${start.replace(":", "")}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  /* --------------------------------------------------------------- cancel */

  function cancel(date, start, type) {
    const late = hoursTo(date, start) < 24;
    if (!confirm(late
      ? `${type} am ${P.deDate(date)} um ${start} Uhr absagen?\n\nWeniger als 24 Stunden vorher — dafür berechnen wir die Hälfte.`
      : `${type} am ${P.deDate(date)} um ${start} Uhr absagen?\n\nDas ist kostenfrei.`)) return;

    P.addChange({ kind: "absage", patient: me.name, key: date + start, date, start, type, late });
    P.addRequest({
      kind: "rueckruf", name: me.name, phone: me.phone, mail: me.mail || "",
      type: "", ther: "", date: "", start: "",
      window: "Absage über den Link",
      note: `Termin ${P.deDate(date)} ${start} Uhr (${type}) selbst abgesagt${late ? " — kurzfristig" : ""}.`,
      at: new Date().toISOString().slice(0, 16).replace("T", " "),
      state: "offen",
    });
    done("Abgesagt",
      `Dein Termin am ${P.deDate(date)} um ${start} Uhr ist raus. ` +
      (late ? "Weil es kurzfristig war, berechnen wir die Hälfte — wenn etwas dazwischenkam, ruf uns an, wir finden meist eine Lösung."
            : "Kostenfrei, alles gut. Der Platz geht an jemanden von der Warteliste."));
  }

  /* ------------------------------------------------------------ reschedule */

  function startMove(date, start, svcKey) {
    moving = { date, start, svcKey: svcKey || "mt60", pick: null };
    byId("mine").hidden = true;
    byId("moveBox").hidden = false;
    const svc = P.svcOf(moving.svcKey);
    byId("moveFor").textContent =
      `${svc.name}, ${svc.min} Minuten — statt ${P.deDate(date)} um ${start} Uhr.`;
    buildMoveDays();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function buildMoveDays(keep) {
    const dates = P.nextDates(14);
    const counts = dates.map((d) => P.slotsFor(moving.svcKey, d, null).length);
    if (!keep && (!moving.day || !counts[dates.indexOf(moving.day)])) {
      const i = counts.findIndex((c) => c > 0);
      moving.day = i >= 0 ? dates[i] : dates[0];
    }
    byId("moveDays").innerHTML = dates.map((d, i) => `
      <button type="button" class="dayb${d === moving.day ? " is-on" : ""}${counts[i] ? "" : " is-full"}"
              data-date="${d}"><b>${P.DE_DAY[P.weekday(d)].slice(0, 2)}</b>
        <span>${P.deDate(d).slice(0, 6)}</span>
        <em>${counts[i] ? counts[i] + " frei" : "belegt"}</em></button>`).join("");
    byId("moveDays").querySelectorAll("[data-date]").forEach((b) =>
      b.addEventListener("click", () => { moving.day = b.dataset.date; buildMoveDays(true); }));
    buildMoveSlots();
  }

  function buildMoveSlots() {
    const slots = P.slotsFor(moving.svcKey, moving.day, null);
    if (!slots.length) {
      byId("moveSlots").innerHTML =
        `<p class="slots-empty">An diesem Tag ist nichts frei. Nimm einen anderen —
          oder <a class="ul" href="erster-termin.html#rueckruf">lass dich zurückrufen</a>.</p>`;
      return;
    }
    byId("moveSlots").innerHTML = `<div class="slotgrid">${slots.map((s) => {
      const t = P.therOf(s.ther);
      return `<button type="button" class="slot-btn" data-start="${s.start}" data-ther="${s.ther}"
                style="--c:${t.color}"><b>${s.start}</b><span>${t.short}</span></button>`;
    }).join("")}</div>`;
    byId("moveSlots").querySelectorAll(".slot-btn").forEach((b) =>
      b.addEventListener("click", () => confirmMove(b.dataset.start, b.dataset.ther)));
  }

  function confirmMove(start, ther) {
    const svc = P.svcOf(moving.svcKey);
    P.addChange({ kind: "verschoben", patient: me.name, key: moving.date + moving.start,
                  date: moving.date, start: moving.start, to: moving.day, toStart: start });
    P.addRequest({
      kind: "termin", name: me.name, phone: me.phone, mail: me.mail || "",
      type: svc.name, ther, date: moving.day, start,
      note: `Verschiebung: war ${P.deDate(moving.date)} ${moving.start} Uhr.`,
      at: new Date().toISOString().slice(0, 16).replace("T", " "),
      state: "offen",
    });
    byId("moveBox").hidden = true;
    done("Verschoben",
      `Neuer Termin: ${P.DE_DAY[P.weekday(moving.day)]}, ${P.deDate(moving.day)} um ${start} Uhr ` +
      `bei ${P.therOf(ther).name}. Die Bestätigung kommt noch heute.`);
    // and give them the calendar entry for the new one right away
    const box = byId("doneBox").querySelector(".bk-done-actions");
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn btn-glass";
    b.textContent = "In meinen Kalender";
    b.addEventListener("click", () => downloadIcs(moving.day, start, svc.min, svc.name));
    box.prepend(b);
  }

  function done(title, text) {
    byId("mine").hidden = true;
    byId("moveBox").hidden = true;
    byId("doneBox").hidden = false;
    byId("doneH").textContent = title;
    byId("doneP").textContent = text;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* A code in the address bar signs the patient in — last, because show()
     renders and the renderers close over bindings declared above this point. */
  const fromUrl = new URLSearchParams(location.search).get("c");
  if (fromUrl) {
    const p = P.patientByCode(fromUrl);
    if (p) show(p);
    else byId("codeInput").value = fromUrl;
  }
})();
