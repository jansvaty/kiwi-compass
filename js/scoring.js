/*
 * Matching engine: turns user preferences + city data into a 0–100 match
 * with a per-factor breakdown and plain-English reasoning.
 */

// Lowercase a label for mid-sentence use, preserving acronyms like "IT"
function midSentence(label) {
  return /^[A-Z]{2}/.test(label) ? label : label.charAt(0).toLowerCase() + label.slice(1);
}

function careerAdjective(s) {
  if (s >= 0.9) return "One of the strongest markets in the country";
  if (s >= 0.75) return "Strong demand";
  if (s >= 0.55) return "Solid opportunities";
  if (s >= 0.35) return "A smaller market";
  return "Limited local demand";
}

function kiwiStats(city) {
  const share = city.nzBorn / city.population;
  return {
    share,
    text: `~${(city.nzBorn / 1000).toFixed(0)},000 NZ-born residents (${(share * 100).toFixed(1)}% of the population)`
  };
}

// Normalisers derived from the dataset's range
const RENT_MIN = 450, RENT_MAX = 800;
const KIWI_SHARE_MAX = 0.07; // Gold Coast ≈ 6.9%

function scoreCity(city, prefs) {
  const breakdown = [];

  // 1. Career fit
  const career = city.industries[prefs.work] ?? 0.5;
  const workLabel = WORK_FIELDS.find(w => w.id === prefs.work)?.label ?? "your field";
  breakdown.push({
    key: "career", label: "Career fit", score: career,
    reason: `${careerAdjective(career)} for ${midSentence(workLabel)}. ${city.economy}`,
    source: "ABS employment by industry"
  });

  // 2. Hobbies & lifestyle
  let hobbyScore = 0.6, hobbyReason = "No hobbies selected, so lifestyle was scored neutrally.";
  if (prefs.hobbies.size > 0) {
    const picked = [...prefs.hobbies];
    hobbyScore = picked.reduce((sum, h) => sum + (city.hobbies[h] ?? 0.5), 0) / picked.length;
    const notes = [];
    const sorted = picked.slice().sort((a, b) => (city.hobbies[b] ?? 0) - (city.hobbies[a] ?? 0));
    for (const h of sorted) {
      if (city.hobbyHighlights?.[h]) notes.push(city.hobbyHighlights[h]);
    }
    const best = sorted.filter(h => (city.hobbies[h] ?? 0) >= 0.75).map(h => midSentence(HOBBIES.find(x => x.id === h).label));
    const weak = sorted.filter(h => (city.hobbies[h] ?? 0) < 0.4).map(h => midSentence(HOBBIES.find(x => x.id === h).label));
    let sentence = "";
    if (best.length) sentence += `Great for ${best.join(", ")}. `;
    if (weak.length) sentence += `Weak for ${weak.join(", ")}. `;
    if (notes.length) sentence += notes.slice(0, 2).join(". ") + ".";
    hobbyReason = (sentence || "A middling fit for the hobbies you picked.") + ` ${city.climate}`;
  } else {
    hobbyReason += ` ${city.climate}`;
  }
  breakdown.push({
    key: "hobbies", label: "Lifestyle & hobbies", score: hobbyScore,
    reason: hobbyReason.trim(),
    source: "City profile + BOM climate averages"
  });

  // 3. Social scene
  const social = city.social[prefs.social] ?? 0.5;
  breakdown.push({
    key: "social", label: "Social life", score: social,
    reason: city.socialNote,
    source: "City profile"
  });

  // 4. Kiwi community
  const k = kiwiStats(city);
  const kiwiScore = Math.min(1, Math.sqrt(k.share / KIWI_SHARE_MAX)); // sqrt: diminishing returns
  breakdown.push({
    key: "kiwi", label: "Kiwi community", score: kiwiScore,
    reason: `${k.text}.`,
    source: "ABS Census 2021 (country of birth)"
  });

  // 5. Travel connections
  let travel = 0.5, travelReason = city.flightNote;
  if (prefs.travel.size > 0) {
    const picked = [...prefs.travel];
    travel = picked.reduce((sum, t) => sum + (city.flights[t] ?? 0.3), 0) / picked.length;
  }
  breakdown.push({
    key: "travel", label: "Travel connections", score: travel,
    reason: travelReason,
    source: "Scheduled international routes, 2025"
  });

  // 6. Affordability
  const afford = Math.max(0, Math.min(1, (RENT_MAX - city.rent) / (RENT_MAX - RENT_MIN)));
  breakdown.push({
    key: "afford", label: "Affordability", score: afford,
    reason: `Median advertised rent around $${city.rent}/week.`,
    source: "Rental market snapshot, 2025 (indicative)"
  });

  // Weights — adjusted by how much the user cares about Kiwi community and cost
  const kiwiW = { high: 14, some: 8, low: 2 }[prefs.kiwi];
  const costW = { high: 16, some: 9, low: 3 }[prefs.cost];
  const weights = { career: 30, hobbies: 24, social: 15, kiwi: kiwiW, travel: 10, afford: costW };
  const totalW = Object.values(weights).reduce((a, b) => a + b, 0);

  let total = 0;
  for (const f of breakdown) {
    f.weight = weights[f.key] / totalW;
    total += f.score * f.weight;
  }

  return { city, percent: Math.round(total * 100), breakdown };
}

function scoreCities(prefs) {
  return CITIES.map(c => scoreCity(c, prefs)).sort((a, b) => b.percent - a.percent);
}
