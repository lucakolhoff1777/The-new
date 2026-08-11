/* ==========================================================================
   Der Übungsplan für zwischen den Terminen.

   Abgehakte Tage bleiben im Browser des Patienten — die Praxis sieht sie
   nicht. Das ist Absicht: ein Trainingstagebuch, das mitgelesen wird, führt
   niemand ehrlich.
   ========================================================================== */

(() => {
  "use strict";

  const P = window.PRAXIS;
  const byId = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const DAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  let me = null, plan = null, ticks = {};

  const storeKey = () => "lk-uebungen-" + (me ? me.code : "x");
  function load() {
    try { ticks = JSON.parse(localStorage.getItem(storeKey()) || "{}") || {}; }
    catch (e) { ticks = {}; }
  }
  function save() {
    try { localStorage.setItem(storeKey(), JSON.stringify(ticks)); } catch (e) { /* private mode */ }
  }

  function show(p) {
    me = p;
    plan = P.planFor(p.name);
    byId("codeForm").hidden = true;
    if (!plan) {
      byId("codeForm").hidden = false;
      const msg = byId("codeMsg");
      msg.innerHTML = `Für dich ist noch kein Übungsplan hinterlegt.
        Sprich uns beim nächsten Termin an — oder
        <a class="ul" href="erster-termin.html#rueckruf">lass dich zurückrufen</a>.`;
      msg.className = "form-note";
      return;
    }
    load();
    byId("planBox").hidden = false;
    byId("planFor").textContent = p.name.split(". ")[1];
    byId("planGoal").textContent = plan.goal;
    byId("planMeta").textContent =
      `${plan.items.length} Übungen · zusammengestellt von ${P.therOf(plan.ther).name} · ` +
      `zuletzt angepasst am ${P.deDate(plan.updated)}`;
    renderExercises();
    renderWeek();
  }

  byId("codeForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const p = P.patientByCode(byId("codeInput").value);
    const msg = byId("codeMsg");
    if (!p) {
      msg.textContent = "Diesen Code kennen wir nicht. Steht er genau so in deiner Bestätigung?";
      msg.className = "form-note is-error";
      return;
    }
    show(p);
  });

  function renderExercises() {
    byId("exList").innerHTML = plan.items.map((it, i) => {
      const ex = P.exerciseOf(it.key);
      return `<article class="ex glass">
        <span class="ex-num">${String(i + 1).padStart(2, "0")}</span>
        <div class="ex-body">
          <h3>${esc(ex.name)}</h3>
          <p class="ex-dose">${esc(ex.dose)} · ${it.days}× pro Woche</p>
          <p class="ex-note">${esc(ex.note)}</p>
        </div>
      </article>`;
    }).join("");
  }

  function renderWeek() {
    byId("weekGrid").innerHTML = `
      <div class="week-row week-head">
        <span></span>${DAYS.map((d) => `<span>${d}</span>`).join("")}
      </div>
      ${plan.items.map((it) => {
        const ex = P.exerciseOf(it.key);
        return `<div class="week-row">
          <span class="week-name">${esc(ex.name)}</span>
          ${DAYS.map((d, di) => {
            const k = it.key + "-" + di;
            return `<label class="week-cell">
              <input type="checkbox" data-tick="${k}" ${ticks[k] ? "checked" : ""}>
              <span aria-hidden="true"></span>
              <span class="sr-only">${ex.name}, ${d}</span>
            </label>`;
          }).join("")}
        </div>`;
      }).join("")}`;

    byId("weekGrid").querySelectorAll("[data-tick]").forEach((c) =>
      c.addEventListener("change", () => {
        ticks[c.dataset.tick] = c.checked;
        save();
        summary();
      }));
    summary();
  }

  function summary() {
    const want = plan.items.reduce((s, it) => s + it.days, 0);
    const got = plan.items.reduce((s, it) =>
      s + DAYS.filter((_, di) => ticks[it.key + "-" + di]).length, 0);
    const note = byId("weekNote");
    const pct = want ? Math.round((got / want) * 100) : 0;
    note.textContent = got === 0
      ? `Noch nichts abgehakt. ${want} Einheiten stehen diese Woche an.`
      : `${got} von ${want} Einheiten geschafft — ${pct} %.` +
        (pct >= 100 ? " Vollständig. Das merkt man beim nächsten Termin."
         : pct >= 60 ? " Gut dabei." : "");
    note.className = "form-note" + (pct >= 100 ? " is-ok" : "");
  }

  byId("planPrint").addEventListener("click", () => window.print());

  /* A code in the address bar signs the patient in — last, because show()
     renders and the renderers close over bindings declared above this point. */
  const fromUrl = new URLSearchParams(location.search).get("c");
  if (fromUrl) {
    const p = P.patientByCode(fromUrl);
    if (p) show(p);
    else byId("codeInput").value = fromUrl;
  }
})();
