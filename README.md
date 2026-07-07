# Kiwi Compass

*Find your place across the ditch.*

A minimalist web app for New Zealanders weighing up a move to Australia. Answer six quick questions - field of work, hobbies, holiday travel, social life, who's coming with you (kids/pets), and your rent-or-buy budget, and get a ranked percentage match for 12 Australian cities, with plain-English reasoning and a source for every factor.

## Run it

No build step, no dependencies. Serve the folder with any static server:

```sh
cd ~/kiwi-compass
python3 -m http.server 4173
# open http://localhost:4173
```

(Opening `index.html` directly also works, but the service worker/PWA features need a server.)

## How the matching works

Each city gets a weighted score out of 100 across up to eight factors:

| Factor | Weight | Driven by |
|---|---|---|
| Career fit | 28 | Employment strength for your field (ABS employment by industry) |
| Lifestyle & hobbies | 20 | City geography, venues, BOM climate averages |
| Family & schools | 12 (only with kids) | Schools, education options and family-friendliness (ACARA/city profile) |
| Pets | 7 (only with pets) | Pet-friendly tenancy rules, housing stock and lifestyle |
| Social life | 13 | Fit against your preferred social style |
| Kiwi community | 2–14 | NZ-born residents, ABS Census 2021 — weight follows how much you said it matters |
| Travel connections | 9 | Direct international route coverage from the local airport (2025) |
| Housing fit | 14 | Your rent-or-buy budget (slider) against median rents/house prices and market availability |

Every factor in the results shows its reasoning and its data source.

## Data

The dataset ([js/data.js](js/data.js)) is an **indicative snapshot compiled from official sources** — ABS Census 2021 (country of birth), ABS employment-by-industry statistics, Bureau of Meteorology 30-year climate averages, and 2025 scheduled airline routes. Figures are rounded and should be verified before making real decisions; the app says so in its footer.

**Making it live:** the ABS Data API (`https://api.data.abs.gov.au`, SDMX-JSON, no key required) can serve Census and labour-force series at runtime. The clean path is a small scheduled job (or serverless function) that pulls the relevant series, rewrites the fields in `data.js`, and redeploys — keeping the client static, fast and offline-capable rather than hitting SDMX from the browser.

## Deploying the web app

It's a static folder — drop it on GitHub Pages, Netlify, Cloudflare Pages, or any host. HTTPS is required for the PWA install prompt and service worker.

## iOS

Two stages:

1. **Now (PWA):** once hosted on HTTPS, iPhone users open it in Safari → Share → **Add to Home Screen**. It installs with the app icon, runs full-screen and works offline (service worker pre-caches everything).
2. **App Store (when ready):** wrap the same folder with [Capacitor](https://capacitorjs.com) — `npm init @capacitor/app`, point `webDir` at this folder, `npx cap add ios`, open in Xcode and submit. No code changes needed.

## Structure

```
index.html            home page — intent, method, data sources
app.html              the questionnaire app shell
css/style.css         all styling (CSS variables for theming)
js/data.js            city dataset + question definitions (sources documented inline)
js/scoring.js         matching engine + reasoning generation
js/app.js             step form, results rendering, state
manifest.webmanifest  PWA manifest
sw.js                 offline cache
icons/                app icons (Southern Cross)
```
