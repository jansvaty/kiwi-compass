/*
 * Kiwi Compass — city dataset (indicative snapshot).
 *
 * Sources per field:
 *   population : ABS Estimated Resident Population, 2023 (Greater Capital City / SUA)
 *   nzBorn     : ABS Census 2021, country of birth (approx., rounded)
 *   rent       : median advertised weekly rent, indicative 2025 (ABS/CoreLogic-style snapshot)
 *   housing    : median house price + rental/buyer availability (0-1), indicative 2025
 *   family     : schools, education options and family-friendliness (0-1, ACARA/city profile)
 *   pets       : pet-friendly housing and lifestyle (0-1, tenancy rules + geography)
 *   weather    : fit for each climate preference (0-1, BOM 30-year averages)
 *   dating     : singles scene and ease of meeting people (0-1, city profile)
 *   pathways   : fit for temporary stays, study and settling (0-1, city profile)
 *   industries : derived from ABS employment-by-industry regional concentrations (0–1 relative strength)
 *   climate    : Bureau of Meteorology 30-year averages (summarised)
 *   flights    : scheduled international route coverage, 2025 (0–1 per region)
 *   hobbies    : geography + venue density profile (0–1)
 *   social     : relative fit for each social-life style (0–1)
 *
 * Figures are rounded snapshots for guidance, not live statistics.
 * A live feed can replace this file via the ABS Data API (api.data.abs.gov.au) — see README.
 */

const CITIES = [
  {
    id: "sydney", name: "Sydney", state: "NSW",
    population: 5450000, nzBorn: 85000, rent: 750,
    economy: "Australia's largest economy and its finance and tech capital.",
    industries: { healthcare: .8, construction: .8, tech: 1, education: .8, finance: 1, mining: .2, hospitality: .8, government: .6, creative: .9, manufacturing: .5, agriculture: .1, retail: .85 },
    climate: "Warm humid summers (~26°C), mild winters (~17°C), about 2,600 sunshine hours a year.",
    flights: { nz: 1, asia: 1, europe: .7, usa: 1, pacific: 1 },
    flightNote: "Australia's biggest international hub, with direct flights to all NZ main centres, the USA, Asia and the Pacific. Europe is one stop.",
    hobbies: { surf: 1, hike: .85, arts: .95, music: .9, sport: .95, food: .95, dive: .6, camp: .7, snow: .55 },
    hobbyHighlights: { surf: "100+ ocean beaches from Palm Beach to Cronulla", hike: "Blue Mountains and Royal National Park on the doorstep", snow: "Snowy Mountains ~5.5 hrs away" },
    social: { buzz: 1, balanced: .7, quiet: .3 },
    socialNote: "Big, fast and international, with a huge dining, nightlife and events scene. It takes effort to build a village.",
    family: { score: .7, note: "Enormous school choice and five major universities, but childcare costs and commutes are the toughest in the country." },
    pets: { score: .5, note: "Apartment-heavy rental stock and stiff competition make renting with pets hard; great coastal walks once you're settled." },
    housing: { buy: 1600000, rentAvail: .3, buyAvail: .45,
      rentNote: "Vacancy sits around 1.5% and competition for family homes is fierce.",
      buyNote: "Australia's priciest market; most family houses sell at auction." },
    weather: { mild: .8, hot: .6, tropical: .3, seasonal: .5 },
    dating: { score: .85, note: "Australia's biggest singles pool and endless ways to meet people, though the dating scene moves fast." },
    pathways: { temp: .8, study: .95, settle: .65,
      note: "The deepest job market and five universities, but costs work against putting down long-term roots." }
  },
  {
    id: "melbourne", name: "Melbourne", state: "VIC",
    population: 5200000, nzBorn: 80000, rent: 580,
    economy: "Cultural and events capital with deep education, creative and professional sectors.",
    industries: { healthcare: .9, construction: .9, tech: .9, education: 1, finance: .9, mining: .2, hospitality: .9, government: .6, creative: 1, manufacturing: .7, agriculture: .2, retail: .85 },
    climate: "Four-seasons-in-a-day: warm summers (~26°C), cool winters (~14°C), ~2,200 sunshine hours.",
    flights: { nz: 1, asia: 1, europe: .65, usa: .9, pacific: .7 },
    flightNote: "Second-largest hub, with direct flights to NZ, Asia and the USA. Europe and most Pacific islands are one stop.",
    hobbies: { surf: .6, hike: .7, arts: 1, music: 1, sport: 1, food: 1, dive: .4, camp: .7, snow: .6 },
    hobbyHighlights: { arts: "Australia's gallery, theatre and festival capital", music: "More live-music venues per capita than any Australian city", sport: "MCG, AFL, Australian Open and F1 on home turf" },
    social: { buzz: 1, balanced: .75, quiet: .35 },
    socialNote: "Laneway bars, live music and club sport. Arguably the easiest big city to find your scene.",
    family: { score: .8, note: "Strong public and private schools, Australia's biggest university sector, and family suburbs at every price point." },
    pets: { score: .65, note: "Victorian renters can generally keep pets, and parks are everywhere; inner-city apartments suit smaller animals." },
    housing: { buy: 950000, rentAvail: .45, buyAvail: .6,
      rentNote: "More rental supply than the other big capitals, with vacancy near 2%.",
      buyNote: "The best-supplied big-city market; units and townhouses keep entry prices down." },
    weather: { mild: .7, hot: .3, tropical: .05, seasonal: 1 },
    dating: { score: .9, note: "A huge, sociable singles scene built around bars, live music and hobby clubs." },
    pathways: { temp: .8, study: 1, settle: .75,
      note: "Australia's biggest university sector, a deep casual job market and better housing supply for settlers." }
  },
  {
    id: "brisbane", name: "Brisbane", state: "QLD",
    population: 2700000, nzBorn: 85000, rent: 650,
    economy: "Fast-growing capital with a 2032 Olympics construction and infrastructure boom.",
    industries: { healthcare: .9, construction: .95, tech: .7, education: .8, finance: .6, mining: .6, hospitality: .8, government: .7, creative: .6, manufacturing: .6, agriculture: .3, retail: .8 },
    climate: "Subtropical: hot summers (~29°C), dry sunny winters (~21°C), ~2,800 sunshine hours.",
    flights: { nz: 1, asia: .85, europe: .55, usa: .85, pacific: .85 },
    flightNote: "Direct flights to NZ, the USA, much of Asia and the Pacific from a growing hub.",
    hobbies: { surf: .7, hike: .75, arts: .7, music: .75, sport: .85, food: .8, dive: .7, camp: .8, snow: .1 },
    hobbyHighlights: { surf: "Gold Coast and Sunshine Coast breaks within an hour" },
    social: { buzz: .75, balanced: .9, quiet: .6 },
    socialNote: "Big-city options with a relaxed, outdoorsy pace, and one of the largest Kiwi communities in Australia.",
    family: { score: .85, note: "Good state schools, growing childcare supply and backyard suburbs; well-regarded universities." },
    pets: { score: .8, note: "Queensland rentals must consider pet requests, and house-with-yard stock plus off-leash parks make life easy." },
    housing: { buy: 1000000, rentAvail: .3, buyAvail: .45,
      rentNote: "Vacancy is tight at around 1%, driven by strong interstate migration.",
      buyNote: "Prices have run hard since 2021 but houses with yards remain findable." },
    weather: { mild: .5, hot: .85, tropical: .6, seasonal: .3 },
    dating: { score: .75, note: "A growing young-professional scene with an easier pace than Sydney." },
    pathways: { temp: .75, study: .85, settle: .85,
      note: "Strong growth, good universities and liveable costs make most pathways straightforward." }
  },
  {
    id: "perth", name: "Perth", state: "WA",
    population: 2300000, nzBorn: 65000, rent: 650,
    economy: "A resources powerhouse where mining, energy and engineering wages lead the country.",
    industries: { healthcare: .8, construction: .9, tech: .6, education: .7, finance: .6, mining: 1, hospitality: .7, government: .6, creative: .5, manufacturing: .6, agriculture: .4, retail: .75 },
    climate: "Mediterranean: hot dry summers (~31°C), mild wet winters (~19°C), Australia's sunniest capital (~3,200 hrs).",
    flights: { nz: .8, asia: 1, europe: 1, usa: .3, pacific: .2 },
    flightNote: "The only Australian city with non-stop flights to Europe (London, Paris, Rome); excellent Asia links, direct to Auckland.",
    hobbies: { surf: .9, hike: .7, arts: .65, music: .7, sport: .75, food: .8, dive: .8, camp: .8, snow: 0 },
    hobbyHighlights: { surf: "Consistent Indian Ocean swell, Margaret River 3 hrs south", dive: "Rottnest and Ningaloo within reach" },
    social: { buzz: .65, balanced: .85, quiet: .65 },
    socialNote: "Sunny, beachy and well-paid, but remote. The strong Kiwi and expat networks matter here.",
    family: { score: .8, note: "Spacious family suburbs near beaches, solid public schools and shorter commutes than the east coast." },
    pets: { score: .8, note: "Big yards, huge dog beaches and recent tenancy reforms that favour pet owners." },
    housing: { buy: 850000, rentAvail: .2, buyAvail: .4,
      rentNote: "The tightest rental market in the country, with vacancy under 1%.",
      buyNote: "Still cheaper than the east coast, but the boom has eaten the bargains." },
    weather: { mild: .6, hot: .9, tropical: .15, seasonal: .5 },
    dating: { score: .65, note: "A decent scene with a smaller pool; expat and Kiwi circles do a lot of the introducing." },
    pathways: { temp: .7, study: .75, settle: .8,
      note: "High wages and solid universities; the distance suits committed movers more than short stints." }
  },
  {
    id: "adelaide", name: "Adelaide", state: "SA",
    population: 1420000, nzBorn: 12000, rent: 580,
    economy: "Defence, space and advanced manufacturing hub with a famous wine and festival scene.",
    industries: { healthcare: .8, construction: .7, tech: .65, education: .8, finance: .5, mining: .5, hospitality: .7, government: .7, creative: .6, manufacturing: .8, agriculture: .7, retail: .7 },
    climate: "Mediterranean: hot dry summers (~29°C), mild winters (~16°C), ~2,500 sunshine hours.",
    flights: { nz: .6, asia: .7, europe: .5, usa: .2, pacific: .1 },
    flightNote: "Direct to Auckland and several Asian hubs; most long-haul is one-stop via Melbourne or Singapore.",
    hobbies: { surf: .6, hike: .75, arts: .8, music: .75, sport: .75, food: .85, dive: .6, camp: .8, snow: .05 },
    hobbyHighlights: { food: "Barossa and McLaren Vale wine regions under an hour away", arts: "Adelaide Festival and Fringe, the world's second-largest fringe" },
    social: { buzz: .55, balanced: .85, quiet: .75 },
    socialNote: "Compact, affordable and easy-going: 20 minutes to anywhere, though the Kiwi community is smaller.",
    family: { score: .85, note: "Affordable family houses, respected schools and three universities; the classic family-value pick." },
    pets: { score: .8, note: "Yard-heavy suburbs, dog-friendly beaches and tenancy rules that lean pet-positive." },
    housing: { buy: 800000, rentAvail: .3, buyAvail: .45,
      rentNote: "Vacancy is tight at around 1%, though rents stay below the big capitals.",
      buyNote: "One of the more affordable capital markets, with steady rather than frantic competition." },
    weather: { mild: .65, hot: .8, tropical: .05, seasonal: .7 },
    dating: { score: .55, note: "A smaller pool where social circles overlap quickly; clubs and sport open doors." },
    pathways: { temp: .6, study: .8, settle: .85,
      note: "Affordable, stable and studenty; one of the easiest cities to build a settled base." }
  },
  {
    id: "goldcoast", name: "Gold Coast", state: "QLD",
    population: 650000, nzBorn: 45000, rent: 700,
    economy: "Tourism, construction and a growing film and health precinct.",
    industries: { healthcare: .7, construction: .85, tech: .5, education: .6, finance: .4, mining: .1, hospitality: 1, government: .4, creative: .6, manufacturing: .4, agriculture: .2, retail: .8 },
    climate: "Subtropical: hot summers (~28°C), sunny mild winters (~21°C), ~2,900 sunshine hours.",
    flights: { nz: .9, asia: .6, europe: .3, usa: .3, pacific: .4 },
    flightNote: "Direct flights to Auckland and Christchurch; wider long-haul via Brisbane, 45 minutes up the road.",
    hobbies: { surf: 1, hike: .7, arts: .5, music: .7, sport: .7, food: .7, dive: .7, camp: .75, snow: 0 },
    hobbyHighlights: { surf: "World-class point breaks at Snapper, Burleigh and Kirra", hike: "Lamington and Springbrook rainforest in the hinterland" },
    social: { buzz: .6, balanced: .8, quiet: .6 },
    socialNote: "The unofficial Kiwi capital of Australia, with the highest NZ-born share of any Australian city.",
    family: { score: .75, note: "Plenty of young families and outdoor life; top-end school choice is thinner, with Brisbane an hour away." },
    pets: { score: .7, note: "Dog beaches and yards abound, but holiday-let competition squeezes pet-friendly rentals near the beach." },
    housing: { buy: 1150000, rentAvail: .3, buyAvail: .4,
      rentNote: "Tight vacancy and beach-suburb premiums; inland suburbs offer relief.",
      buyNote: "Beach postcodes price like Sydney; value sits in the hinterland corridors." },
    weather: { mild: .55, hot: .8, tropical: .6, seasonal: .3 },
    dating: { score: .7, note: "Young, active and transient; beach and fitness culture drives the scene." },
    pathways: { temp: .8, study: .6, settle: .7,
      note: "Casual tourism work makes arriving easy; study options are thinner and holiday-town costs bite long-term." }
  },
  {
    id: "canberra", name: "Canberra", state: "ACT",
    population: 470000, nzBorn: 7000, rent: 620,
    economy: "A government town where the public service, policy, defence and government IT dominate.",
    industries: { healthcare: .7, construction: .6, tech: .7, education: .8, finance: .4, mining: .1, hospitality: .6, government: 1, creative: .5, manufacturing: .3, agriculture: .2, retail: .6 },
    climate: "Continental: warm dry summers (~27°C), cold frosty winters (~12°C days), ~2,600 sunshine hours.",
    flights: { nz: .2, asia: .2, europe: .2, usa: .1, pacific: .1 },
    flightNote: "Essentially no international routes; everything connects through Sydney or Melbourne.",
    hobbies: { surf: .1, hike: .85, arts: .75, music: .6, sport: .7, food: .75, dive: .1, camp: .8, snow: .8 },
    hobbyHighlights: { snow: "Closest capital to the NSW snowfields (~2.5 hrs)", arts: "National galleries, museums and Parliament on your doorstep" },
    social: { buzz: .45, balanced: .8, quiet: .85 },
    socialNote: "Small, well-paid and family-friendly; quiet weekends, strong club and sports culture.",
    family: { score: .95, note: "Among the best-resourced public schools in the country, high family incomes and everything within 20 minutes." },
    pets: { score: .75, note: "Pet-positive tenancy rules and off-leash space everywhere; hot summers and frosty winters need managing." },
    housing: { buy: 970000, rentAvail: .65, buyAvail: .55,
      rentNote: "The highest vacancy of the mainland capitals; rents are high but findable.",
      buyNote: "Steady public-service demand keeps prices firm but rarely frenzied." },
    weather: { mild: .5, hot: .5, tropical: 0, seasonal: .95 },
    dating: { score: .6, note: "Full of young professionals but light on nightlife; apps, sport and clubs do the work." },
    pathways: { temp: .5, study: .85, settle: .85,
      note: "Stable government careers, the ANU and high incomes; ideal for settling, quieter for a short stint." }
  },
  {
    id: "sunshinecoast", name: "Sunshine Coast", state: "QLD",
    population: 360000, nzBorn: 15000, rent: 680,
    economy: "Health, construction and tourism led, anchored by a major new hospital precinct.",
    industries: { healthcare: .8, construction: .8, tech: .5, education: .5, finance: .3, mining: .1, hospitality: .9, government: .4, creative: .4, manufacturing: .4, agriculture: .4, retail: .7 },
    climate: "Subtropical: warm summers (~28°C), mild sunny winters (~21°C), ~2,800 sunshine hours.",
    flights: { nz: .5, asia: .2, europe: .2, usa: .1, pacific: .2 },
    flightNote: "Seasonal direct Auckland flights; otherwise via Brisbane, about 90 minutes south.",
    hobbies: { surf: .95, hike: .8, arts: .5, music: .5, sport: .6, food: .7, dive: .7, camp: .85, snow: 0 },
    hobbyHighlights: { surf: "Noosa's point breaks and 60 km of beaches", hike: "Glass House Mountains and Noosa National Park" },
    social: { buzz: .35, balanced: .7, quiet: .9 },
    socialNote: "Relaxed beach-town living with a sizeable Kiwi community; nightlife is limited by design.",
    family: { score: .8, note: "Beachside family lifestyle with good schools; local university options are limited." },
    pets: { score: .85, note: "Yards, beaches and acreage within reach; pet-friendly rentals go fast." },
    housing: { buy: 1100000, rentAvail: .3, buyAvail: .35,
      rentNote: "Sea-changers keep vacancy tight and rents close to capital-city levels.",
      buyNote: "Lifestyle demand has pushed prices past most capitals; stock is limited." },
    weather: { mild: .6, hot: .75, tropical: .65, seasonal: .3 },
    dating: { score: .5, note: "Couples-and-families territory; the singles pool is small and skews older." },
    pathways: { temp: .6, study: .4, settle: .75,
      note: "Lifestyle-first living; casual work exists but study options and career depth are limited." }
  },
  {
    id: "hobart", name: "Hobart", state: "TAS",
    population: 255000, nzBorn: 3000, rent: 470,
    economy: "Tourism, Antarctic science, aquaculture and a university-anchored economy.",
    industries: { healthcare: .7, construction: .6, tech: .4, education: .7, finance: .3, mining: .3, hospitality: .8, government: .6, creative: .6, manufacturing: .4, agriculture: .7, retail: .6 },
    climate: "Cool temperate: mild summers (~22°C), crisp winters (~12°C), the most NZ-like climate on the list.",
    flights: { nz: .1, asia: .1, europe: .1, usa: .1, pacific: .1 },
    flightNote: "No scheduled international routes; connect via Melbourne or Sydney.",
    hobbies: { surf: .4, hike: 1, arts: .8, music: .6, sport: .5, food: .8, dive: .5, camp: .9, snow: .3 },
    hobbyHighlights: { hike: "kunanyi/Mt Wellington above town and world-heritage wilderness beyond", arts: "MONA and Dark Mofo punch far above the city's size" },
    social: { buzz: .4, balanced: .75, quiet: .9 },
    socialNote: "Small, creative and outdoorsy, the closest thing to South Island life in Australia.",
    family: { score: .7, note: "Safe, small and outdoorsy with UTAS on hand; fewer school and childcare options than the mainland." },
    pets: { score: .8, note: "Cool climate, walking trails and yard stock suit dogs well; the rental pool is just small." },
    housing: { buy: 700000, rentAvail: .5, buyAvail: .55,
      rentNote: "The post-2020 squeeze has eased; rents are the lowest of any capital here.",
      buyNote: "The most affordable capital market, with character homes still under $700k." },
    weather: { mild: 1, hot: .15, tropical: 0, seasonal: .8 },
    dating: { score: .45, note: "A small pool with tight circles; the arts and outdoors scenes are the ways in." },
    pathways: { temp: .5, study: .65, settle: .7,
      note: "UTAS anchors the study options; cheap to settle if your industry fits the island." }
  },
  {
    id: "darwin", name: "Darwin", state: "NT",
    population: 150000, nzBorn: 4000, rent: 620,
    economy: "Government, defence, energy and the gateway to Asia. High wages, high turnover.",
    industries: { healthcare: .7, construction: .7, tech: .4, education: .5, finance: .3, mining: .8, hospitality: .7, government: .8, creative: .3, manufacturing: .3, agriculture: .4, retail: .6 },
    climate: "Tropical: hot year-round (~32°C), a humid wet season from November to April and a glorious dry season.",
    flights: { nz: .1, asia: .8, europe: .3, usa: .1, pacific: .1 },
    flightNote: "Closer to Bali and Singapore than to Sydney, with direct Asian routes but no NZ flights.",
    hobbies: { surf: .1, hike: .7, arts: .5, music: .5, sport: .5, food: .6, dive: .5, camp: .9, snow: 0 },
    hobbyHighlights: { camp: "Kakadu and Litchfield national parks within two hours", surf: "Swimming and surf are limited; crocodiles and stingers are real" },
    social: { buzz: .5, balanced: .7, quiet: .7 },
    socialNote: "Transient, friendly and informal. Easy to meet people, harder to keep them as folks move on.",
    family: { score: .55, note: "Friendly expat family scene, but school choice is limited and many families move south for high school." },
    pets: { score: .6, note: "Yards are standard, but heat, humidity and wildlife (snakes, crocs near water) are real considerations." },
    housing: { buy: 580000, rentAvail: .55, buyAvail: .7,
      rentNote: "Defence turnover keeps rentals moving; high rents for the price of the houses.",
      buyNote: "The cheapest capital houses in Australia, if you can commit to the tropics." },
    weather: { mild: .1, hot: 1, tropical: 1, seasonal: .1 },
    dating: { score: .65, note: "Highly transient and sociable; easy to meet people, most of them passing through." },
    pathways: { temp: .85, study: .45, settle: .5,
      note: "Made for stints: quick jobs and high turnover, but few people stay for the long haul." }
  },
  {
    id: "newcastle", name: "Newcastle", state: "NSW",
    population: 500000, nzBorn: 7000, rent: 600,
    economy: "Former steel city turned health, energy and education hub for the Hunter region.",
    industries: { healthcare: .8, construction: .8, tech: .5, education: .7, finance: .4, mining: .7, hospitality: .7, government: .5, creative: .5, manufacturing: .7, agriculture: .4, retail: .7 },
    climate: "Warm summers (~26°C), mild winters (~17°C), ~2,600 sunshine hours. Sydney's climate at two-thirds the rent.",
    flights: { nz: .3, asia: .2, europe: .2, usa: .1, pacific: .2 },
    flightNote: "A few short-haul routes; most international travel connects through Sydney, 2 hrs south.",
    hobbies: { surf: .9, hike: .7, arts: .6, music: .7, sport: .7, food: .7, dive: .6, camp: .75, snow: .3 },
    hobbyHighlights: { surf: "City beaches with genuine surf culture; Merewether is a national surfing reserve" },
    social: { buzz: .55, balanced: .85, quiet: .75 },
    socialNote: "Genuine surf-city community feel: big enough to have a scene, small enough to be known in it.",
    family: { score: .8, note: "Backyard suburbs, good schools and a strong university, with Sydney's options two hours away." },
    pets: { score: .8, note: "Off-leash beaches, yard stock and a dog-friendly cafe culture." },
    housing: { buy: 950000, rentAvail: .35, buyAvail: .45,
      rentNote: "Sydney escapees keep vacancy tight, but rents undercut Sydney by a third.",
      buyNote: "Family houses at two-thirds of Sydney prices, with demand to match." },
    weather: { mild: .8, hot: .6, tropical: .25, seasonal: .5 },
    dating: { score: .65, note: "A university city with genuine pub culture and a friendlier pace than Sydney." },
    pathways: { temp: .55, study: .75, settle: .8,
      note: "A solid university and steady industries; an easy middle path for settling." }
  },
  {
    id: "cairns", name: "Cairns", state: "QLD",
    population: 155000, nzBorn: 8000, rent: 580,
    economy: "Tourism capital of the tropics, where the Great Barrier Reef and the Daintree drive the economy.",
    industries: { healthcare: .7, construction: .6, tech: .3, education: .5, finance: .3, mining: .2, hospitality: 1, government: .5, creative: .4, manufacturing: .3, agriculture: .6, retail: .6 },
    climate: "Tropical: hot humid summers (~31°C), warm dry winters (~26°C).",
    flights: { nz: .6, asia: .7, europe: .2, usa: .2, pacific: .3 },
    flightNote: "Direct to Auckland plus Japan, Singapore and Bali. Strong links for a small city.",
    hobbies: { surf: .3, hike: .8, arts: .4, music: .5, sport: .5, food: .6, dive: 1, camp: .85, snow: 0 },
    hobbyHighlights: { dive: "The Great Barrier Reef is the day-trip", hike: "Daintree rainforest and the Atherton Tablelands" },
    social: { buzz: .45, balanced: .7, quiet: .8 },
    socialNote: "Small, tropical and tourism-driven: sociable and transient, with a solid Kiwi contingent.",
    family: { score: .6, note: "An outdoor childhood paradise; school and university choice is limited, with boarding common later on." },
    pets: { score: .65, note: "Yards are common, but tropical heat, ticks and crocodile-risk waterways constrain dog life." },
    housing: { buy: 550000, rentAvail: .25, buyAvail: .6,
      rentNote: "Tourism workers compete hard for a small rental pool.",
      buyNote: "Among the cheapest houses on this list; cyclone-rated insurance adds cost." },
    weather: { mild: .2, hot: .95, tropical: 1, seasonal: .15 },
    dating: { score: .6, note: "The backpacker and tourism crowd keeps it sociable, but faces change with the seasons." },
    pathways: { temp: .85, study: .45, settle: .6,
      note: "Tourism keeps short-term work plentiful; long-term career depth is limited." }
  }
];

const WORK_FIELDS = [
  { id: "healthcare", label: "Healthcare & nursing" },
  { id: "construction", label: "Construction & trades" },
  { id: "tech", label: "IT & tech" },
  { id: "education", label: "Education & training" },
  { id: "finance", label: "Finance & professional services" },
  { id: "mining", label: "Mining & resources" },
  { id: "hospitality", label: "Hospitality & tourism" },
  { id: "government", label: "Government & public sector" },
  { id: "creative", label: "Creative & design" },
  { id: "manufacturing", label: "Manufacturing & engineering" },
  { id: "agriculture", label: "Agriculture & primary industries" },
  { id: "retail", label: "Retail & customer service" }
];

const HOBBIES = [
  { id: "surf", label: "Beach & surfing" },
  { id: "hike", label: "Hiking & tramping" },
  { id: "arts", label: "Arts & culture" },
  { id: "music", label: "Live music & nightlife" },
  { id: "sport", label: "Sport (playing or watching)" },
  { id: "food", label: "Food, coffee & wine" },
  { id: "dive", label: "Diving & snorkelling" },
  { id: "camp", label: "Camping & road trips" },
  { id: "snow", label: "Skiing & snowboarding" }
];

const TRAVEL = [
  { id: "nz", label: "Back home to NZ" },
  { id: "asia", label: "Asia (Bali, Japan, SE Asia)" },
  { id: "europe", label: "Europe & UK" },
  { id: "usa", label: "USA & Canada" },
  { id: "pacific", label: "Pacific Islands" }
];

const SOCIAL_STYLES = [
  { id: "buzz", label: "Big-city buzz", desc: "Bars, events, new people, always something on" },
  { id: "balanced", label: "Balanced", desc: "A good scene when I want it, quiet when I don't" },
  { id: "quiet", label: "Quiet & community", desc: "Small circles, neighbours, space and calm" }
];

const KIWI_IMPORTANCE = [
  { id: "high", label: "Really important", desc: "I want Kiwis around me" },
  { id: "some", label: "Nice to have", desc: "A bonus, not a dealbreaker" },
  { id: "low", label: "Not a factor", desc: "I'll make friends anywhere" }
];

const WEATHER_OPTIONS = [
  { id: "mild", label: "Milder and temperate", desc: "Closest to NZ: warm summers, cool winters" },
  { id: "hot", label: "Hot and sunny", desc: "Dry heat, big summers, beach weather" },
  { id: "tropical", label: "Tropical", desc: "Hot and humid, wet season included" },
  { id: "seasonal", label: "Four distinct seasons", desc: "Melbourne-style variety, cold snaps included" }
];

const HOUSEHOLD_OPTIONS = [
  { id: "single", label: "I'm single", desc: "Moving on my own" },
  { id: "connection", label: "Hoping to meet someone", desc: "Dating and meeting people matters" },
  { id: "kids", label: "Kids in tow", desc: "Schools, childcare and family life matter" },
  { id: "pets", label: "Pets in tow", desc: "Pet-friendly housing and lifestyle matter" }
];

const PURPOSE_OPTIONS = [
  { id: "temp", label: "Temporarily", desc: "A working stint or adventure, then reassess" },
  { id: "study", label: "To study", desc: "University and training options matter" },
  { id: "settle", label: "To settle down", desc: "Long-term roots, stability and housing" },
  { id: "citizenship", label: "Working towards citizenship", desc: "Building the four-year direct pathway for Kiwis" }
];

const HOUSING_OPTIONS = [
  { id: "rent", label: "Renting", desc: "Compare my budget against local rents and vacancy" },
  { id: "buy", label: "Buying", desc: "Compare my budget against local house prices" }
];
