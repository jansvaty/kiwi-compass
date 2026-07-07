/* Kiwi Compass — minimal step-form UI and results rendering. */

const state = {
  step: 0,
  work: null,
  hobbies: new Set(),
  travel: new Set(),
  social: null,
  kiwi: "some",
  cost: "some"
};

const app = document.getElementById("app");

const steps = [
  {
    title: "What field do you work in?",
    hint: "We match this against employment strength in each city.",
    valid: () => state.work !== null,
    render() {
      return `<div class="grid">${WORK_FIELDS.map(w => `
        <button class="opt ${state.work === w.id ? "sel" : ""}" data-work="${w.id}">${w.label}</button>
      `).join("")}</div>`;
    }
  },
  {
    title: "What do you love doing?",
    hint: "Pick as many as you like.",
    valid: () => true,
    render() {
      return `<div class="grid">${HOBBIES.map(h => `
        <button class="opt ${state.hobbies.has(h.id) ? "sel" : ""}" data-hobby="${h.id}">${h.label}</button>
      `).join("")}</div>`;
    }
  },
  {
    title: "Where do you fly for holidays?",
    hint: "We check direct-flight coverage from each city's airport.",
    valid: () => true,
    render() {
      return `<div class="grid">${TRAVEL.map(t => `
        <button class="opt ${state.travel.has(t.id) ? "sel" : ""}" data-travel="${t.id}">${t.label}</button>
      `).join("")}</div>`;
    }
  },
  {
    title: "What's your social life like?",
    hint: "",
    valid: () => state.social !== null,
    render() {
      return `<div class="cards">${SOCIAL_STYLES.map(s => `
        <button class="card ${state.social === s.id ? "sel" : ""}" data-social="${s.id}">
          <strong>${s.label}</strong><span>${s.desc}</span>
        </button>
      `).join("")}</div>
      <h3 class="sub">Having other Kiwis around?</h3>
      <div class="cards">${KIWI_IMPORTANCE.map(k => `
        <button class="card ${state.kiwi === k.id ? "sel" : ""}" data-kiwi="${k.id}">
          <strong>${k.label}</strong><span>${k.desc}</span>
        </button>
      `).join("")}</div>`;
    }
  },
  {
    title: "How much does cost of living matter?",
    hint: "This adjusts how heavily rent weighs in your match.",
    valid: () => true,
    render() {
      return `<div class="cards">${COST_IMPORTANCE.map(c => `
        <button class="card ${state.cost === c.id ? "sel" : ""}" data-cost="${c.id}">
          <strong>${c.label}</strong><span>${c.desc}</span>
        </button>
      `).join("")}</div>`;
    }
  }
];

function render() {
  if (state.step >= steps.length) return renderResults();
  const s = steps[state.step];
  app.innerHTML = `
    <div class="progress"><div class="bar" style="width:${((state.step) / steps.length) * 100}%"></div></div>
    <p class="stepnum">Step ${state.step + 1} of ${steps.length}</p>
    <h2>${s.title}</h2>
    ${s.hint ? `<p class="hint">${s.hint}</p>` : ""}
    ${s.render()}
    <div class="nav">
      ${state.step > 0 ? `<button class="ghost" id="back">Back</button>` : `<span></span>`}
      <button class="primary" id="next" ${s.valid() ? "" : "disabled"}>
        ${state.step === steps.length - 1 ? "See my matches" : "Next"}
      </button>
    </div>`;
  window.scrollTo(0, 0);
}

function renderResults() {
  const prefs = { work: state.work, hobbies: state.hobbies, travel: state.travel, social: state.social, kiwi: state.kiwi, cost: state.cost };
  const results = scoreCities(prefs);
  const top = results[0];
  app.innerHTML = `
    <h2>Your matches</h2>
    <p class="hint">Based on your work, hobbies, travel and social life against each city's profile.
    Tap a city to see the reasoning.</p>
    <div class="results">
      ${results.map((r, i) => `
        <details class="result" ${i === 0 ? "open" : ""}>
          <summary>
            <span class="ring" style="--p:${r.percent}"><span>${r.percent}%</span></span>
            <span class="cityname"><strong>${r.city.name}</strong><em>${r.city.state}</em></span>
            <span class="chev">›</span>
          </summary>
          <div class="breakdown">
            ${r.breakdown.map(f => `
              <div class="factor">
                <div class="factor-head">
                  <span>${f.label}</span>
                  <span class="pct">${Math.round(f.score * 100)}%</span>
                </div>
                <div class="meter"><div style="width:${f.score * 100}%"></div></div>
                <p>${f.reason}</p>
                <p class="source">Source: ${f.sourceUrl
                  ? `<a href="${f.sourceUrl}" target="_blank" rel="noopener">${f.source}</a>`
                  : f.source}</p>
              </div>
            `).join("")}
          </div>
        </details>
      `).join("")}
    </div>
    <div class="nav">
      <button class="ghost" id="restart">Start over</button>
      <span></span>
    </div>
    <p class="disclaimer">Figures are indicative snapshots compiled from official sources
    (ABS Census 2021, ABS labour statistics, Bureau of Meteorology averages, 2025 airline routes).
    Always verify current data before making the move.</p>`;
  window.scrollTo(0, 0);
}

app.addEventListener("click", e => {
  const b = e.target.closest("button");
  if (!b) return;
  if (b.dataset.work !== undefined) { state.work = b.dataset.work; render(); }
  else if (b.dataset.hobby !== undefined) {
    state.hobbies.has(b.dataset.hobby) ? state.hobbies.delete(b.dataset.hobby) : state.hobbies.add(b.dataset.hobby);
    render();
  }
  else if (b.dataset.travel !== undefined) {
    state.travel.has(b.dataset.travel) ? state.travel.delete(b.dataset.travel) : state.travel.add(b.dataset.travel);
    render();
  }
  else if (b.dataset.social !== undefined) { state.social = b.dataset.social; render(); }
  else if (b.dataset.kiwi !== undefined) { state.kiwi = b.dataset.kiwi; render(); }
  else if (b.dataset.cost !== undefined) { state.cost = b.dataset.cost; render(); }
  else if (b.id === "next") { state.step++; render(); }
  else if (b.id === "back") { state.step--; render(); }
  else if (b.id === "restart") {
    Object.assign(state, { step: 0, work: null, social: null, kiwi: "some", cost: "some" });
    state.hobbies.clear(); state.travel.clear();
    render();
  }
});

render();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
