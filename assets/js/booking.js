/* ==========================================================================
   Online booking.

   Availability comes from assets/js/practice-data.js — the same source the
   intranet reads, so a slot offered here is genuinely free in the diary.

   A real practice needs this on a server: the moment two people load the page
   at once, only a server can hand out a slot exactly once. What runs here is
   the front end of that, with the request written to localStorage so the
   intranet's "Anfragen" tab can pick it up in the same browser.
   ========================================================================== */

(() => {
  "use strict";

  const P = window.PRAXIS;
  const byId = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const pick = { svc: null, ther: "", date: null, start: null, slotTher: null };

  /* ------------------------------------------------------------- steps */

  function goto(n) {
    document.querySelectorAll(".bk-step").forEach((s) => { s.hidden = s.dataset.panel !== String(n); });
    document.querySelectorAll(".step").forEach((s) => {
      const i = Number(s.dataset.step);
      s.classList.toggle("is-on", i === n);
      s.classList.toggle("is-done", i < n);
    });
    byId("steps").hidden = n > 3;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  document.querySelectorAll("[data-goto]").forEach((b) =>
    b.addEventListener("click", () => goto(Number(b.dataset.goto))));

  /* --------------------------------------------------- 1. pick a service */

  byId("svcPick").innerHTML = P.SERVICES.filter((s) => s.book).map((s) => `
    <button type="button" class="glass glass-lift svc-opt" data-svc="${s.key}">
      <span class="svc-opt-top">
        <b>${s.name}</b>
        <span class="svc-opt-meta">${s.min} Min · ${P.eur0(P.priceFor(s))}</span>
      </span>
      <span class="svc-opt-desc">${s.desc}</span>
      <span class="svc-opt-bill">${P.BILL[s.bill]}</span>
    </button>`).join("");

  byId("svcPick").querySelectorAll("[data-svc]").forEach((b) =>
    b.addEventListener("click", () => {
      pick.svc = P.svcOf(b.dataset.svc);
      pick.date = null; pick.start = null;
      byId("bkPicked").textContent = `${pick.svc.name} · ${pick.svc.min} Minuten`;
      buildTherapists();
      buildDays();
      goto(2);
    }));

  /* --------------------------------------------------- 2. pick a slot */

  function buildTherapists() {
    const able = P.THERAPISTS.filter((t) => (P.SKILLS[t.id] || []).includes(pick.svc.name));
    byId("therPick").innerHTML =
      `<button type="button" class="chip is-on" data-ther="">Egal wer</button>` +
      able.map((t) => `<button type="button" class="chip" data-ther="${t.id}"
          style="--c:${t.color}"><i></i>${t.name}</button>`).join("");
    byId("therPick").querySelectorAll("[data-ther]").forEach((b) =>
      b.addEventListener("click", () => {
        pick.ther = b.dataset.ther;
        byId("therPick").querySelectorAll(".chip").forEach((x) => x.classList.toggle("is-on", x === b));
        buildDays();
      }));
  }

  function buildDays() {
    const dates = P.nextDates(14);
    const counts = dates.map((d) => P.slotsFor(pick.svc.key, d, pick.ther || null).length);
    // open on the first day that actually has something
    if (!pick.date || !dates.includes(pick.date) || !counts[dates.indexOf(pick.date)]) {
      const i = counts.findIndex((c) => c > 0);
      pick.date = i >= 0 ? dates[i] : dates[0];
    }
    byId("dayStrip").innerHTML = dates.map((d, i) => `
      <button type="button" class="dayb${d === pick.date ? " is-on" : ""}${counts[i] ? "" : " is-full"}"
              data-date="${d}" role="tab" aria-selected="${d === pick.date}">
        <b>${P.DE_DAY[P.weekday(d)].slice(0, 2)}</b>
        <span>${P.deDate(d).slice(0, 6)}</span>
        <em>${counts[i] ? counts[i] + " frei" : "belegt"}</em>
      </button>`).join("");
    byId("dayStrip").querySelectorAll("[data-date]").forEach((b) =>
      b.addEventListener("click", () => { pick.date = b.dataset.date; buildDays(); }));
    buildSlots();
  }

  const BANDS = [["Vormittag", 0, 12 * 60], ["Nachmittag", 13 * 60, 16 * 60], ["Abend", 16 * 60, 24 * 60]];

  function buildSlots() {
    const slots = P.slotsFor(pick.svc.key, pick.date, pick.ther || null);
    if (!slots.length) {
      const dates = P.nextDates(14);
      const next = dates.find((d) => P.slotsFor(pick.svc.key, d, pick.ther || null).length);
      byId("slots").innerHTML = `
        <p class="slots-empty">
          Am ${P.DE_DAY[P.weekday(pick.date)]}, ${P.deDate(pick.date)} ist für
          ${esc(pick.svc.name)} nichts mehr frei.
          ${next ? `Der nächste freie Termin ist am <button type="button" class="ul"
                     data-jump="${next}">${P.DE_DAY[P.weekday(next)]}, ${P.deDate(next)}</button>.`
                 : `In den nächsten zwei Wochen ist alles belegt — ruf uns an, wir finden etwas.`}
          ${pick.ther ? "<br>Ohne feste Therapeut:in gäbe es mehr Auswahl." : ""}
        </p>`;
      const jump = byId("slots").querySelector("[data-jump]");
      if (jump) jump.addEventListener("click", () => { pick.date = jump.dataset.jump; buildDays(); });
      return;
    }

    byId("slots").innerHTML = BANDS.map(([label, from, to]) => {
      const band = slots.filter((s) => P.toMin(s.start) >= from && P.toMin(s.start) < to);
      if (!band.length) return "";
      return `<div class="slotband">
        <h3>${label}</h3>
        <div class="slotgrid">${band.map((s) => {
          const t = P.therOf(s.ther);
          return `<button type="button" class="slot-btn" data-start="${s.start}" data-ther="${s.ther}"
                    style="--c:${t.color}"><b>${s.start}</b><span>${t.short}</span></button>`;
        }).join("")}</div>
      </div>`;
    }).join("") + `<p class="slots-foot">${slots.length} freie Zeiten ·
      Zeiten sind Behandlungsbeginn, sei bitte fünf Minuten vorher da.</p>`;

    byId("slots").querySelectorAll(".slot-btn").forEach((b) =>
      b.addEventListener("click", () => {
        pick.start = b.dataset.start;
        pick.slotTher = b.dataset.ther;
        showSummary();
        goto(3);
      }));
  }

  /* ------------------------------------------------------- 3. contact */

  function showSummary() {
    const t = P.therOf(pick.slotTher);
    byId("bkSummary").innerHTML = `
      <dl>
        <div><dt>Leistung</dt><dd>${esc(pick.svc.name)}</dd></div>
        <div><dt>Termin</dt><dd>${P.DE_DAY[P.weekday(pick.date)]}, ${P.deDate(pick.date)} · ${pick.start} Uhr</dd></div>
        <div><dt>Dauer</dt><dd>${pick.svc.min} Minuten</dd></div>
        <div><dt>Therapeut:in</dt><dd>${t.name}</dd></div>
        <div><dt>Abrechnung</dt><dd>${P.BILL[pick.svc.bill]}</dd></div>
        <div class="is-total"><dt>Preis</dt><dd>${P.eur(P.priceFor(pick.svc))}</dd></div>
      </dl>`;
  }

  byId("bkForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = byId("bkMsg");
    const name = byId("fName").value.trim();
    const phone = byId("fPhone").value.trim();
    const mail = byId("fMail").value.trim();

    if (name.length < 2) return fail(msg, "Bitte trag deinen Namen ein.", "fName");
    if (phone.replace(/\D/g, "").length < 6) return fail(msg, "Ohne Telefonnummer können wir nicht bestätigen.", "fPhone");
    if (mail && !/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(mail)) return fail(msg, "Die E-Mail-Adresse sieht nicht richtig aus.", "fMail");
    if (!byId("fPrivacy").checked) return fail(msg, "Bitte bestätige die Datenschutzerklärung.", "fPrivacy");

    const now = new Date();
    P.addRequest({
      kind: "termin", name, phone, mail,
      type: pick.svc.name, ther: pick.slotTher,
      date: pick.date, start: pick.start,
      note: byId("fNote").value.trim(),
      remind: byId("fRemind").checked,
      at: `${now.toISOString().slice(0, 10)} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
      state: "offen",
    });

    const t = P.therOf(pick.slotTher);
    byId("doneTitle").textContent = `Danke, ${name.split(" ")[0]}`;
    byId("doneText").textContent =
      `Dein Termin für ${pick.svc.name} steht bei uns im Kalender.`;
    byId("doneFacts").innerHTML = `
      <div><span>Wann</span><b>${P.DE_DAY[P.weekday(pick.date)]}, ${P.deDate(pick.date)}, ${pick.start} Uhr</b></div>
      <div><span>Wer</span><b>${t.name}</b></div>
      <div><span>Dauer</span><b>${pick.svc.min} Minuten</b></div>
      <div><span>Preis</span><b>${P.eur(P.priceFor(pick.svc))}</b></div>`;
    goto(4);
  });

  function fail(msg, text, focusId) {
    msg.textContent = text;
    msg.className = "form-note is-error";
    byId(focusId).focus();
  }
})();
