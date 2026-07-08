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

  // 3. Weather fit
  const weather = city.weather[prefs.weather] ?? 0.5;
  const weatherLabel = WEATHER_OPTIONS.find(w => w.id === prefs.weather)?.label ?? "your pick";
  breakdown.push({
    key: "weather", label: "Weather fit", score: weather,
    reason: `${weather >= 0.75 ? "A strong match" : weather >= 0.5 ? "A reasonable match" : "A stretch"} for ${midSentence(weatherLabel)}. ${city.climate}`,
    source: "BOM 30-year climate averages",
    sourceUrl: "http://www.bom.gov.au/climate/data/"
  });

  // 4. Getting around
  const t = city.transport;
  const transport = prefs.transport === "mix"
    ? (t.transit + t.car + t.active) / 3
    : t[prefs.transport] ?? 0.5;
  breakdown.push({
    key: "transport", label: "Getting around", score: transport,
    reason: t.note,
    source: "BITRE urban transport + city profile",
    sourceUrl: "https://www.bitre.gov.au/statistics"
  });

  // 5. Family & schools / pets / meeting someone (only when relevant)
  const withKids = prefs.household.has("kids");
  const withPets = prefs.household.has("pets");
  const lookingToMeet = prefs.household.has("connection");
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
  if (lookingToMeet) {
    breakdown.push({
      key: "dating", label: "Meeting someone", score: city.dating.score,
      reason: city.dating.note,
      source: "City profile"
    });
  }

  // 6. Social scene
  const social = city.social[prefs.social] ?? 0.5;
  breakdown.push({
    key: "social", label: "Social life", score: social,
    reason: city.socialNote,
    source: "City profile"
  });

  // 7. Kiwi community
  const k = kiwiStats(city);
  const kiwiScore = Math.min(1, Math.sqrt(k.share / KIWI_SHARE_MAX)); // sqrt: diminishing returns
  breakdown.push({
    key: "kiwi", label: "Kiwi community", score: kiwiScore,
    reason: `${k.text}.`,
    source: "ABS Census 2021 (country of birth)",
    sourceUrl: "https://www.abs.gov.au/census"
  });

  // 8. Travel connections
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

  // 9. Pathway fit: how well the city supports the reason for the move
  const settling = prefs.purpose === "settle";
  const pathScore = city.pathways[prefs.purpose] ?? 0.6;
  const purposeLabel = PURPOSE_OPTIONS.find(p => p.id === prefs.purpose)?.label ?? "your plan";
  const pathAdj = pathScore >= 0.85 ? "One of the easiest bases"
    : pathScore >= 0.7 ? "A strong base"
    : pathScore >= 0.55 ? "A workable base"
    : "A harder base";
  let pathReason = `${pathAdj} for ${midSentence(purposeLabel)}. ${city.pathways.note}`;
  if (settling) {
    pathReason += " If citizenship is the goal, the four-year direct pathway for NZ citizens is the same nationwide; what differs is how easily you can build the stable residence behind it.";
  }
  breakdown.push({
    key: "pathway", label: "Pathway fit", score: pathScore,
    reason: pathReason,
    source: settling ? "Dept of Home Affairs + city profile" : "City profile",
    sourceUrl: settling ? "https://immi.homeaffairs.gov.au/citizenship" : undefined
  });

  // 10. Housing fit: the user's budget against this city's market
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

  // Weights come straight from the user's 0-10 importance sliders.
  // A slider at 0 removes that factor from the score entirely.
  let totalW = breakdown.reduce((sum, f) => sum + (prefs.importance[f.key] ?? 5), 0);
  if (totalW === 0) totalW = breakdown.length; // all-zero fallback: equal weights

  let total = 0;
  for (const f of breakdown) {
    const imp = prefs.importance[f.key] ?? 5;
    f.weight = (totalW === breakdown.length && imp === 0 ? 1 : imp) / totalW;
    total += f.score * f.weight;
  }

  return { city, percent: Math.round(total * 100), breakdown };
}

function scoreCities(prefs) {
  const results = CITIES.map(c => scoreCity(c, prefs)).sort((a, b) => b.percent - a.percent);
  // Presentation spread: raw scores tend to bunch in a narrow band, which
  // makes close calls hard to compare. Keep the leader's score as-is and
  // widen every gap below it by 1.8x so the ranking reads decisively.
  const top = results[0].percent;
  for (const r of results) {
    r.percent = Math.max(2, Math.round(top - (top - r.percent) * 1.8));
  }
  return results;
}
