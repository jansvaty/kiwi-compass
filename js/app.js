/* Kiwi Compass — minimal step-form UI and results rendering. */

const defaultImportance = () =>
  Object.fromEntries(FACTOR_META.map(f => [f.key, 5]));

const state = {
  step: 0,
  work: null,
  hobbies: new Set(),
  weather: null,
  transport: null,
  travel: new Set(),
  social: null,
  household: new Set(),
  purpose: null,
  housing: "rent",
  budget: { rent: 550, buy: 800000 },
  importance: defaultImportance()
};

// Factors that apply to this user (conditional ones only when picked)
function activeFactors() {
  return FACTOR_META.filter(f => !f.when || state.household.has(f.when));
}

const BUDGET_RANGE = {
  rent: { min: 300, max: 1000, step: 25 },
  buy: { min: 400000, max: 2000000, step: 50000 }
};

function fmtBudget() {
  return state.housing === "rent"
    ? `$${state.budget.rent} a week`
    : `$${state.budget.buy.toLocaleString("en-AU")}`;
}

const app = document.getElementById("app");

const steps = [
  {
    title: "What field do you work in?",
    hint: "We match this against employment strength in each city.",
    valid: () => state.work !== null,
    render() {
      return `<div class="grid grid-4">${WORK_FIELDS.map(w => `
        <button class="opt ${state.work === w.id ? "sel" : ""}" aria-pressed="${state.work === w.id}" data-work="${w.id}">${w.label}</button>
      `).join("")}</div>`;
    }
  },
  {
    title: "What do you love doing?",
    hint: "Pick as many as you like.",
    valid: () => true,
    render() {
      return `<div class="grid">${HOBBIES.map(h => `
        <button class="opt ${state.hobbies.has(h.id) ? "sel" : ""}" aria-pressed="${state.hobbies.has(h.id)}" data-hobby="${h.id}">${h.label}</button>
      `).join("")}</div>`;
    }
  },
  {
    title: "What weather suits you?",
    hint: "We match this against 30-year climate averages for each city.",
    valid: () => state.weather !== null,
    render() {
      return `<div class="cards">${WEATHER_OPTIONS.map(w => `
        <button class="card ${state.weather === w.id ? "sel" : ""}" aria-pressed="${state.weather === w.id}" data-weather="${w.id}">
          <strong>${w.label}</strong><span>${w.desc}</span>
        </button>
      `).join("")}</div>`;
    }
  },
  {
    title: "How do you like to get around?",
    hint: "We match this against each city's public transport, traffic and bike-friendliness.",
    valid: () => state.transport !== null,
    render() {
      return `<div class="cards">${TRANSPORT_OPTIONS.map(t => `
        <button class="card ${state.transport === t.id ? "sel" : ""}" aria-pressed="${state.transport === t.id}" data-transport="${t.id}">
          <strong>${t.label}</strong><span>${t.desc}</span>
        </button>
      `).join("")}</div>`;
    }
  },
  {
    title: "Where do you fly for holidays?",
    hint: "We check direct-flight coverage from each city's airport.",
    valid: () => true,
    render() {
      return `<div class="grid">${TRAVEL.map(t => `
        <button class="opt ${state.travel.has(t.id) ? "sel" : ""}" aria-pressed="${state.travel.has(t.id)}" data-travel="${t.id}">${t.label}</button>
      `).join("")}</div>`;
    }
  },
  {
    title: "What's your social life like?",
    hint: "",
    valid: () => state.social !== null,
    render() {
      return `<div class="cards">${SOCIAL_STYLES.map(s => `
        <button class="card ${state.social === s.id ? "sel" : ""}" aria-pressed="${state.social === s.id}" data-social="${s.id}">
          <strong>${s.label}</strong><span>${s.desc}</span>
        </button>
      `).join("")}</div>`;
    }
  },
  {
    title: "Who's making the move with you?",
    hint: "Pick all that apply, or none if it's just you two. Each pick switches on a matching factor.",
    valid: () => true,
    render() {
      return `<div class="cards">${HOUSEHOLD_OPTIONS.map(h => `
        <button class="card ${state.household.has(h.id) ? "sel" : ""}" aria-pressed="${state.household.has(h.id)}" data-who="${h.id}">
          <strong>${h.label}</strong><span>${h.desc}</span>
        </button>
      `).join("")}</div>`;
    }
  },
  {
    title: "What's the plan across the ditch?",
    hint: "We compare how well each city supports the kind of move you're making.",
    valid: () => state.purpose !== null,
    render() {
      return `<div class="cards">${PURPOSE_OPTIONS.map(p => `
        <button class="card ${state.purpose === p.id ? "sel" : ""}" aria-pressed="${state.purpose === p.id}" data-purpose="${p.id}">
          <strong>${p.label}</strong><span>${p.desc}</span>
        </button>
      `).join("")}</div>`;
    }
  },
  {
    title: "Renting or buying?",
    hint: "Set your budget and we compare it against each city's prices and availability.",
    valid: () => true,
    render() {
      const r = BUDGET_RANGE[state.housing];
      return `<div class="cards">${HOUSING_OPTIONS.map(h => `
        <button class="card ${state.housing === h.id ? "sel" : ""}" aria-pressed="${state.housing === h.id}" data-housing="${h.id}">
          <strong>${h.label}</strong><span>${h.desc}</span>
        </button>
      `).join("")}</div>
      <div class="budget">
        <label for="budget">Your ${state.housing === "rent" ? "weekly rent" : "purchase"} budget</label>
        <input type="range" id="budget" min="${r.min}" max="${r.max}" step="${r.step}"
          value="${state.budget[state.housing]}" aria-valuetext="${fmtBudget()}">
        <output id="budget-out" for="budget">${fmtBudget()}</output>
      </div>`;
    }
  },
  {
    title: "How much does each one matter?",
    hint: "0 means ignore it, 10 means top priority. These weights drive your ranking and your profile graph.",
    valid: () => true,
    render() {
      return `<div class="weights">${activeFactors().map(f => `
        <div class="weight-row">
          <div class="weight-head">
            <label for="w-${f.key}">${f.label}</label>
            <output id="wo-${f.key}" for="w-${f.key}">${state.importance[f.key]}</output>
          </div>
          ${f.hint ? `<p class="weight-hint">${f.hint}</p>` : ""}
          <input type="range" id="w-${f.key}" data-imp="${f.key}" min="0" max="10" step="1"
            value="${state.importance[f.key]}" aria-valuetext="${state.importance[f.key]} out of 10">
        </div>
      `).join("")}</div>`;
    }
  }
];

let focusHeading = false;

function render() {
  if (state.step >= steps.length) return renderResults();
  const s = steps[state.step];
  app.innerHTML = `
    <div class="progress" aria-hidden="true"><div class="bar" style="width:${((state.step) / steps.length) * 100}%"></div></div>
    <p class="stepnum">Step ${state.step + 1} of ${steps.length}</p>
    <h2 id="step-title" tabindex="-1">${s.title}</h2>
    ${s.hint ? `<p class="hint">${s.hint}</p>` : ""}
    ${s.render()}
    <div class="nav">
      ${state.step > 0 ? `<button class="ghost" id="back">Back</button>` : `<span></span>`}
      <button class="primary" id="next" ${s.valid() ? "" : "disabled"}>
        ${state.step === steps.length - 1 ? "See my matches" : "Next"}
      </button>
    </div>`;
  window.scrollTo(0, 0);
  if (focusHeading) {
    focusHeading = false;
    document.getElementById("step-title")?.focus();
  }
}

// Spider/radar chart: 0 at the centre, 10 at the rim.
// series = [{ values (0-10 per axis), cls }]
function radarChart(axes, series) {
  const N = axes.length, cx = 210, cy = 168, R = 112;
  const pt = (i, v) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / N;
    return [cx + (R * v / 10) * Math.cos(a), cy + (R * v / 10) * Math.sin(a)];
  };
  const poly = vals => vals.map((v, i) => pt(i, v).map(n => n.toFixed(1)).join(",")).join(" ");
  const rings = [2.5, 5, 7.5, 10].map(r =>
    `<polygon class="radar-grid" points="${poly(axes.map(() => r))}"/>`).join("");
  const spokes = axes.map((_, i) => {
    const [x, y] = pt(i, 10);
    return `<line class="radar-axis" x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"/>`;
  }).join("");
  const labels = axes.map((ax, i) => {
    const [x, y] = pt(i, 11.6);
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / N;
    const anchor = Math.cos(a) > 0.35 ? "start" : Math.cos(a) < -0.35 ? "end" : "middle";
    return `<text class="radar-label" x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="${anchor}">${ax}</text>`;
  }).join("");
  const shapes = series.map(s =>
    `<polygon class="${s.cls}" points="${poly(s.values)}"/>`).join("");
  return `<svg viewBox="0 0 420 336" role="img"
    aria-label="Radar graph of your priorities (0 centre to 10 edge) overlaid with your top city's scores">
    ${rings}${spokes}${shapes}${labels}</svg>`;
}

function renderResults() {
  const prefs = {
    work: state.work, hobbies: state.hobbies, weather: state.weather,
    transport: state.transport, travel: state.travel, social: state.social,
    household: state.household, purpose: state.purpose,
    housing: state.housing, budget: state.budget[state.housing],
    importance: state.importance
  };
  const results = scoreCities(prefs);
  const top = results[0];
  const axes = activeFactors();
  const cityScore = key => (top.breakdown.find(f => f.key === key)?.score ?? 0.5) * 10;
  const radar = radarChart(
    axes.map(f => f.short),
    [
      { values: axes.map(f => cityScore(f.key)), cls: "radar-city" },
      { values: axes.map(f => state.importance[f.key]), cls: "radar-user" }
    ]
  );
  app.innerHTML = `
    <h2 id="step-title" tabindex="-1">Your matches</h2>
    <p class="hint">Weighted by your importance sliders and matched against each city's profile.
    Tap a city to see the reasoning.</p>
    <div class="radar-wrap">
      <h3>Your priorities vs ${top.city.name}</h3>
      ${radar}
      <div class="radar-legend">
        <span class="leg leg-user">Your priorities</span>
        <span class="leg leg-city">${top.city.name}'s fit</span>
      </div>
    </div>
    <div class="results">
      ${results.map((r, i) => `
        <details class="result" ${i === 0 ? "open" : ""}>
          <summary>
            <span class="ring" style="--p:${r.percent}"><span>${r.percent}%</span></span>
            <span class="cityname"><strong>${r.city.name}</strong><em>${r.city.state}</em></span>
            <span class="chev" aria-hidden="true">›</span>
          </summary>
          <div class="breakdown">
            ${r.breakdown.map(f => `
              <div class="factor">
                <div class="factor-head">
                  <span>${f.label}</span>
                  <span class="pct">${Math.round(f.score * 100)}%</span>
                </div>
                <div class="meter" aria-hidden="true"><div style="width:${f.score * 100}%"></div></div>
                <p>${f.reason}</p>
                <p class="source">Source: ${f.sourceUrl
                  ? `<a href="${f.sourceUrl}" target="_blank" rel="noopener">${f.source}<span class="sr-only"> (opens in new tab)</span></a>`
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
  if (focusHeading) {
    focusHeading = false;
    document.getElementById("step-title")?.focus();
  }
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
  else if (b.dataset.weather !== undefined) { state.weather = b.dataset.weather; render(); }
  else if (b.dataset.transport !== undefined) { state.transport = b.dataset.transport; render(); }
  else if (b.dataset.social !== undefined) { state.social = b.dataset.social; render(); }
  else if (b.dataset.who !== undefined) {
    state.household.has(b.dataset.who) ? state.household.delete(b.dataset.who) : state.household.add(b.dataset.who);
    render();
  }
  else if (b.dataset.purpose !== undefined) { state.purpose = b.dataset.purpose; render(); }
  else if (b.dataset.housing !== undefined) { state.housing = b.dataset.housing; render(); }
  else if (b.id === "next") { state.step++; focusHeading = true; render(); }
  else if (b.id === "back") { state.step--; focusHeading = true; render(); }
  else if (b.id === "restart") {
    Object.assign(state, {
      step: 0, work: null, weather: null, transport: null, social: null,
      purpose: null, housing: "rent", budget: { rent: 550, buy: 800000 },
      importance: defaultImportance()
    });
    state.hobbies.clear(); state.travel.clear(); state.household.clear();
    focusHeading = true;
    render();
  }
});

app.addEventListener("input", e => {
  if (e.target.id === "budget") {
    state.budget[state.housing] = +e.target.value;
    e.target.setAttribute("aria-valuetext", fmtBudget());
    document.getElementById("budget-out").textContent = fmtBudget();
  } else if (e.target.dataset.imp) {
    const key = e.target.dataset.imp;
    state.importance[key] = +e.target.value;
    e.target.setAttribute("aria-valuetext", `${e.target.value} out of 10`);
    document.getElementById(`wo-${key}`).textContent = e.target.value;
  }
});

render();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
