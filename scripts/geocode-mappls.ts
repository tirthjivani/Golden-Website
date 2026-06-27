// Geocodes each project's landmarks via Mappls (MapmyIndia). The free tier's
// text endpoints return an eLoc + straight-line `distance` from a reference
// point but withhold lat/lng — so we query each place from 3 reference points
// and trilaterate. Strict matching (POI type + name overlap) avoids accepting
// a city-center fallback. Writes src/lib/landmarkCoords.ts.
//
//   MAPPLS_CLIENT_ID=... MAPPLS_CLIENT_SECRET=... node scripts/geocode-mappls.ts

import { writeFileSync } from "node:fs";
import { PROJECTS } from "../src/lib/projects.ts";

type LngLat = [number, number];

const CLIENT_ID = process.env.MAPPLS_CLIENT_ID;
const CLIENT_SECRET = process.env.MAPPLS_CLIENT_SECRET;
if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("Set MAPPLS_CLIENT_ID and MAPPLS_CLIENT_SECRET.");
  process.exit(1);
}

const SLEEP_MS = 120;
const M_PER_DEG_LAT = 110540;
const mPerDegLng = (lat: number) => 111320 * Math.cos((lat * Math.PI) / 180);
const OFFSET_M = 8000;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const GENERIC = new Set([
  "school", "hospital", "multispeciality", "multispecialty", "speciality",
  "specialty", "international", "public", "academy", "college", "university",
  "centre", "center", "clinic", "station", "railway", "junction", "depot",
  "the", "and", "for", "icu", "trust", "english", "medium", "high", "primary",
  "vidyalaya", "school's", "hospitals", "schools",
]);

function distinctive(name: string, extra: Set<string>): string[] {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !GENERIC.has(w) && !extra.has(w));
}
function nameMatches(landmark: string, placeName: string, extra: Set<string>): boolean {
  const toks = distinctive(landmark, extra);
  if (toks.length === 0) return false;
  const pn = placeName.toLowerCase();
  return toks.some((t) => pn.includes(t));
}

// Mappls occasionally returns 200 with an empty body under load. Parse
// defensively and retry once so a single blip doesn't abort the whole run.
async function fetchJson<T>(url: string, token: string): Promise<T | null> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await fetch(url, { headers: { Authorization: `bearer ${token}` } });
    if (!res.ok) return null;
    const text = await res.text();
    if (!text.trim()) {
      await sleep(400);
      continue;
    }
    try {
      return JSON.parse(text) as T;
    } catch {
      return null;
    }
  }
  return null;
}

async function getToken(): Promise<string> {
  const res = await fetch("https://outpost.mappls.com/api/security/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: CLIENT_ID!,
      client_secret: CLIENT_SECRET!,
    }),
  });
  if (!res.ok) throw new Error(`token ${res.status}`);
  const j = (await res.json()) as { access_token?: string };
  if (!j.access_token) throw new Error("no token");
  return j.access_token;
}

type Hit = { eLoc: string; distance: number; placeName: string; type: string };

async function search(token: string, query: string, loc: LngLat): Promise<Hit[]> {
  const url =
    `https://atlas.mappls.com/api/places/search/json?itemCount=10` +
    `&query=${encodeURIComponent(query)}&location=${loc[1]},${loc[0]}`;
  const j = await fetchJson<{ suggestedLocations?: Hit[] }>(url, token);
  return j?.suggestedLocations ?? [];
}

// Re-run the same text search from an offset reference point and read back the
// straight-line `distance` to the SAME place (matched by eLoc). The search
// endpoint is far more reliable than `nearby`, so this gives us the second and
// third trilateration readings without the dropouts that `nearby` caused.
async function searchDistance(token: string, query: string, loc: LngLat, eLoc: string): Promise<number | null> {
  const hits = await search(token, query, loc);
  const h = hits.find((x) => x.eLoc === eLoc);
  return h ? h.distance : null;
}

function trilaterate(project: LngLat, d1: number, d2: number, d3: number): LngLat {
  const y = (d1 * d1 - d2 * d2 + OFFSET_M * OFFSET_M) / (2 * OFFSET_M);
  const x = (d1 * d1 - d3 * d3 + OFFSET_M * OFFSET_M) / (2 * OFFSET_M);
  const lat = project[1] + y / M_PER_DEG_LAT;
  const lng = project[0] + x / mPerDegLng(project[1]);
  return [Number(lng.toFixed(6)), Number(lat.toFixed(6))];
}

function cityOf(area: string): string {
  const parts = area.split(",").map((s) => s.trim()).filter(Boolean);
  return parts.length >= 2 ? parts[parts.length - 2] : parts[0] ?? area;
}

async function main() {
  const token = await getToken();
  console.log("Mappls token OK.\n");

  const result: Record<string, LngLat> = {};
  // Cache absolute coords by city::name so a landmark shared across projects in
  // the same city is only geocoded once (saves API transactions).
  const cache = new Map<string, LngLat | null>();
  let ok = 0, miss = 0, cached = 0;

  for (const project of PROJECTS) {
    const loc = project.detail?.location;
    if (!loc || !loc.landmarks?.length) continue;
    const area = loc.address ?? project.location;
    const city = cityOf(area);
    const P1 = loc.coords as LngLat;
    const P2: LngLat = [P1[0], P1[1] + OFFSET_M / M_PER_DEG_LAT];
    const P3: LngLat = [P1[0] + OFFSET_M / mPerDegLng(P1[1]), P1[1]];
    const extra = new Set(
      `${area} ${city} ${project.location} gujarat`.toLowerCase().split(/[^a-z]+/).filter((w) => w.length >= 4),
    );
    console.log(`# ${project.name} — ${city}`);

    for (const lm of loc.landmarks) {
      const key = `${project.slug}::${lm.name}`;
      const cacheKey = `${city}::${lm.name}`;
      if (cache.has(cacheKey)) {
        const c = cache.get(cacheKey)!;
        if (c) { result[key] = c; cached++; }
        continue;
      }

      const resolve = async (): Promise<LngLat | null> => {
        const query = `${lm.name} ${city}`;
        const hits = await search(token, query, P1);
        await sleep(SLEEP_MS);
        const maxM = Math.max(lm.distanceKm * 2500, lm.distanceKm * 1000 + 6000);
        const pois = hits.filter((h) => h.type === "POI" && h.distance <= maxM);
        // Prefer a place whose name shares a distinctive token. When the landmark
        // name is entirely generic (e.g. "Surat Railway Station" — every word is
        // a stopword or the city), trust Mappls' top-ranked POI within the gate.
        const toks = distinctive(lm.name, extra);
        const best =
          (toks.length > 0
            ? pois.find((h) => nameMatches(lm.name, h.placeName, extra))
            : pois[0]) ?? null;
        if (!best) {
          // Distinguish "found but too far" (likely a same-named place in
          // another city) from "nothing matched" for easier diagnosis.
          const named = toks.length > 0
            ? hits.find((h) => h.type === "POI" && nameMatches(lm.name, h.placeName, extra))
            : hits.find((h) => h.type === "POI");
          if (named) {
            console.log(`  far   ${lm.name} -> ${named.placeName} (${(named.distance / 1000).toFixed(1)}km)`);
          } else {
            console.log(`  miss  ${lm.name}`);
          }
          return null;
        }
        const d2 = await searchDistance(token, query, P2, best.eLoc);
        await sleep(SLEEP_MS);
        const d3 = await searchDistance(token, query, P3, best.eLoc);
        await sleep(SLEEP_MS);
        if (d2 == null || d3 == null) {
          console.log(`  miss  ${lm.name} (no triangulation)`);
          return null;
        }
        const coords = trilaterate(P1, best.distance, d2, d3);
        const rx = (coords[0] - P1[0]) * mPerDegLng(P1[1]);
        const ry = (coords[1] - P1[1]) * M_PER_DEG_LAT;
        if (Math.abs(Math.hypot(rx, ry) - best.distance) > 700) {
          console.log(`  bad   ${lm.name} (residual)`);
          return null;
        }
        console.log(`  ok    ${lm.name} -> ${best.placeName}`);
        return coords;
      };

      const coords = await resolve();
      cache.set(cacheKey, coords);
      if (coords) { result[key] = coords; ok++; } else { miss++; }
    }
  }

  writeFileSync(
    "src/lib/landmarkCoords.ts",
    "// AUTO-GENERATED by scripts/geocode-mappls.ts (Mappls trilateration).\n" +
      "// Key: `${slug}::${landmarkName}` -> [lng, lat]. Edit by hand to fix any pin.\n" +
      `export const LANDMARK_COORDS: Record<string, [number, number]> = ${JSON.stringify(result, null, 2)};\n`,
  );
  console.log(`\nDone. ok=${ok} miss=${miss} cached=${cached}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
