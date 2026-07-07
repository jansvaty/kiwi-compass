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
const KIWI_SHARE_MAX = 0.07; // Gold Coast ≈ 6.9%

const clamp01 = v => Math.max(0, Math.min(1, v));

function fmtPrice(v) {
  return v >= 1e6
    ? `$${(v / 1e6).toFixed(2).replace(/\.?0+$/, "")}m`
    : `$${Math.round(v / 1000)}k`;
}

function scoreCity(city, prefs) {
  const breakdown = [];

  // 1. Career fit
  const career = city.industries[prefs.work] ?? 0.5;
  const workLabel = WORK_FIELDS.find(w => w.id === prefs.work)?.label ?? "your field";
  breakdown.push({
    key: "career", label: "Career fit", score: career,
    reason: `${careerAdjective(career)} for ${midSentence(workLabel)}. ${city.economy}`,
    source: "ABS employment by industry",
    sourceUrl: "https://www.abs.gov.au/statistics/labour/employment-and-unemployment"
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
    source: "City profile + BOM climate averages",
    sourceUrl: "http://www.bom.gov.au/climate/data/"
  });

  // 3. Family & schools / pets (only when they're making the trip)
  const withKids = prefs.family === "kids" || prefs.family === "both";
  const withPets = prefs.family === "pets" || prefs.family === "both";
  if (withKids) {
    breakdown.push({
      key: "family", label: "Family & schools", score: city.family.score,
      reason: city.family.note,
      source: "ACARA My School + city profile",
      sourceUrl: "https://www.myschool.edu.au"
    });
  }
  if (withPets) {
    breakdown.push({
      key: "pets", label: "Pets", score: city.pets.score,
      reason: city.pets.note,
      source: "State tenancy rules + city profile"
    });
  }

  // 4. Social scene
  const social = city.social[prefs.social] ?? 0.5;
  breakdown.push({
    key: "social", label: "Social life", score: social,
    reason: city.socialNote,
    source: "City profile"
  });

  // 5. Kiwi community
  const k = kiwiStats(city);
  const kiwiScore = Math.min(1, Math.sqrt(k.share / KIWI_SHARE_MAX)); // sqrt: diminishing returns
  breakdown.push({
    key: "kiwi", label: "Kiwi community", score: kiwiScore,
    reason: `${k.text}.`,
    source: "ABS Census 2021 (country of birth)",
    sourceUrl: "https://www.abs.gov.au/census"
  });

  // 6. Travel connections
  let travel = 0.5, travelReason = city.flightNote;
  if (prefs.travel.size > 0) {
    const picked = [...prefs.travel];
    travel = picked.reduce((sum, t) => sum + (city.flights[t] ?? 0.3), 0) / picked.length;
  }
  breakdown.push({
    key: "travel", label: "Travel connections", score: travel,
    reason: travelReason,
    source: "Scheduled international routes, 2025 (BITRE)",
    sourceUrl: "https://www.bitre.gov.au/statistics/aviation/international"
  });

  // 7. Housing fit: the user's budget against this city's market
  const buying = prefs.housing === "buy";
  const price = buying ? city.housing.buy : city.rent;
  const priceFit = clamp01((prefs.budget / price - 0.7) / 0.5);
  const avail = buying ? city.housing.buyAvail : city.housing.rentAvail;
  const housingScore = priceFit * 0.75 + avail * 0.25;
  breakdown.push({
    key: "housing", label: "Housing fit", score: housingScore,
    reason: buying
      ? `Median house price around ${fmtPrice(city.housing.buy)} against your ${fmtPrice(prefs.budget)} budget. ${city.housing.buyNote}`
      : `Median advertised rent around $${city.rent}/week against your $${prefs.budget}/week budget. ${city.housing.rentNote}`,
    source: buying
      ? "Property market snapshot, 2025 (indicative)"
      : "Rental market snapshot, 2025 (indicative)",
    sourceUrl: buying
      ? "https://www.abs.gov.au/statistics/economy/price-indexes-and-inflation/total-value-dwellings-australia"
      : "https://www.abs.gov.au/statistics/people/housing"
  });

  // Weights — kiwi flexes with stated importance; family and pets only
  // count when they're coming along
  const kiwiW = { high: 14, some: 8, low: 2 }[prefs.kiwi];
  const weights = {
    career: 28, hobbies: 20, social: 13, kiwi: kiwiW, travel: 9, housing: 14,
    family: withKids ? 12 : 0, pets: withPets ? 7 : 0
  };
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
