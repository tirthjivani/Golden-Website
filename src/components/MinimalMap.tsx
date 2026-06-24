"use client";

import "maplibre-gl/dist/maplibre-gl.css";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { renderToStaticMarkup } from "react-dom/server";
import {
  GraduationCap,
  FirstAid,
  Tree,
  Train,
  MapPin,
} from "@phosphor-icons/react";
import type { Landmark, LandmarkCategory } from "@/lib/projects";

type Coords = [number, number];

// Vector basemap (CARTO Dark Matter) — a polished, detailed dark vector style
// with real road hierarchy, labels and built-in area shading. Free, no API key,
// served from a fast CDN. Used natively (no recolor) so its own shading shows.
const STYLE_URL =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

const CATEGORY_ICONS: Record<LandmarkCategory, typeof GraduationCap> = {
  education: GraduationCap,
  healthcare: FirstAid,
  recreation: Tree,
  transit: Train,
};

// Distribute landmarks across the northern hemisphere of the project (away
// from the Narmada / Tapi to the south of most sites). Each category gets a
// home bearing and items in that category fan out across a narrow arc.
const CATEGORY_BEARING: Record<LandmarkCategory, number> = {
  education: 25,
  healthcare: 335,
  recreation: 95,
  transit: 265,
};
// Wide arc so a category's pins encircle the project (avoids label collisions).
const SPREAD_ARC = 300;

function offsetCoords(
  base: Coords,
  distanceKm: number,
  bearingDeg: number,
): Coords {
  const [lng, lat] = base;
  const bearingRad = (bearingDeg * Math.PI) / 180;
  const dLat = (distanceKm * Math.cos(bearingRad)) / 111;
  const dLng =
    (distanceKm * Math.sin(bearingRad)) /
    (111 * Math.cos((lat * Math.PI) / 180));
  return [lng + dLng, lat + dLat];
}

// Normalise real distances into a tight visual band so pins cluster near the
// project rather than spreading across many km. Positions are illustrative, so
// we keep relative ordering but compress the scale to avoid an airy, sparse map.
function compressKm(distanceKm: number): number {
  return 0.4 + Math.min(distanceKm, 12) * 0.09;
}

function landmarkPosition(
  landmark: Landmark,
  base: Coords,
  indexInCategory: number,
  totalInCategory: number,
): Coords {
  const radiusKm = compressKm(landmark.distanceKm);
  if (landmark.bearing !== undefined) {
    return offsetCoords(base, radiusKm, landmark.bearing);
  }
  // Distribute the category's pins around the project across a wide arc and
  // stagger them between an inner and outer ring, so the (wide) labels don't
  // collide even though the radii are tightly compressed.
  const home = CATEGORY_BEARING[landmark.category];
  const t =
    totalInCategory <= 1 ? 0.5 : indexInCategory / (totalInCategory - 1);
  const bearing = home - SPREAD_ARC / 2 + SPREAD_ARC * t;
  const ring = indexInCategory % 2 === 0 ? 1 : 1.4;
  return offsetCoords(base, radiusKm * ring, bearing);
}

function iconSvg(category: LandmarkCategory, color = "#ffffff"): string {
  const Icon = CATEGORY_ICONS[category];
  return renderToStaticMarkup(
    <Icon weight="regular" size={20} color={color} />,
  );
}

function formatKm(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(km < 10 ? 1 : 0)} km`;
}

export function MinimalMap({
  coords,
  landmarks = [],
  activeCategory,
  className = "",
  zoom,
  projectName,
  onSelectLandmark,
  selectedName,
}: {
  coords: Coords;
  landmarks?: Landmark[];
  activeCategory?: LandmarkCategory;
  className?: string;
  zoom?: number;
  projectName?: string;
  onSelectLandmark?: (landmark: Landmark | null) => void;
  selectedName?: string | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const landmarkMarkersRef = useRef<maplibregl.Marker[]>([]);
  // Keep the latest onSelectLandmark in a ref so the map-mount effect (which
  // must not re-run on every render) can call the current callback.
  const onSelectRef = useRef(onSelectLandmark);
  useEffect(() => {
    onSelectRef.current = onSelectLandmark;
  }, [onSelectLandmark]);

  // Mount/teardown map and main marker. Stable across category switches.
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    // Pins are placed using the compressed scale, so zoom to fit that tight
    // visual spread (not the raw km) — keeps the map full rather than airy.
    const maxKm = landmarks.reduce(
      (m, l) => (l.distanceKm > m ? l.distanceKm : m),
      0,
    );
    const maxVisualKm = compressKm(maxKm) * 1.4; // outer staggered ring
    const autoZoom =
      zoom ??
      (maxVisualKm <= 1.1
        ? 15.3
        : maxVisualKm <= 1.5
        ? 14.9
        : maxVisualKm <= 1.9
        ? 14.6
        : 14.3);

    const map = new maplibregl.Map({
      container: node,
      style: STYLE_URL,
      center: coords,
      zoom: autoZoom,
      cooperativeGestures: true,
      attributionControl: { compact: true },
    });

    mapRef.current = map;

    // Visible zoom controls so the map clearly reads as interactive.
    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false, visualizePitch: false }),
      "bottom-right",
    );

    // Click empty map (not a pin) → clear the selection / close the panel.
    map.on("click", () => onSelectRef.current?.(null));

    const mainEl = document.createElement("div");
    mainEl.className = "golden-main-pin";
    mainEl.setAttribute(
      "aria-label",
      projectName ? `${projectName} location` : "Project location",
    );
    const pinIcon = renderToStaticMarkup(
      <MapPin weight="fill" size={18} color="#0a0a0a" />,
    );
    const labelHtml = projectName
      ? `<span class="golden-main-pin__label"></span>`
      : "";
    mainEl.innerHTML = `<span class="golden-main-pin__inner">${pinIcon}</span>${labelHtml}`;
    if (projectName) {
      const labelEl = mainEl.querySelector(
        ".golden-main-pin__label",
      ) as HTMLElement | null;
      if (labelEl) labelEl.textContent = projectName;
    }
    const mainMarker = new maplibregl.Marker({
      element: mainEl,
      anchor: "center",
    })
      .setLngLat(coords)
      .addTo(map);

    const handleResize = () => map.resize();
    const ro = new ResizeObserver(handleResize);
    ro.observe(node);

    return () => {
      ro.disconnect();
      for (const m of landmarkMarkersRef.current) m.remove();
      landmarkMarkersRef.current = [];
      mainMarker.remove();
      map.remove();
      mapRef.current = null;
    };
    // We intentionally exclude landmarks/activeCategory from deps so the map
    // doesn't tear down when switching tabs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords, zoom, projectName]);

  // Manage landmark markers reactively. Filtered by activeCategory.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    for (const m of landmarkMarkersRef.current) m.remove();
    landmarkMarkersRef.current = [];

    const visible = activeCategory
      ? landmarks.filter((l) => l.category === activeCategory)
      : landmarks;

    const categoryCounts = new Map<LandmarkCategory, number>();
    for (const l of visible) {
      categoryCounts.set(l.category, (categoryCounts.get(l.category) ?? 0) + 1);
    }
    const categoryIndex = new Map<LandmarkCategory, number>();

    for (const landmark of visible) {
      const i = categoryIndex.get(landmark.category) ?? 0;
      categoryIndex.set(landmark.category, i + 1);
      const total = categoryCounts.get(landmark.category) ?? 1;

      const el = document.createElement("div");
      el.className = "golden-landmark";
      el.setAttribute(
        "aria-label",
        `${landmark.name}, ${landmark.minutes} minutes`,
      );

      const icon = document.createElement("span");
      icon.className = "golden-landmark__icon";
      icon.innerHTML = iconSvg(landmark.category, "#d6b25e");

      const name = document.createElement("span");
      name.className = "golden-landmark__name";
      name.textContent = landmark.name;

      const pop = document.createElement("div");
      pop.className = "golden-landmark__pop";
      pop.textContent = `${landmark.minutes} min · ${formatKm(landmark.distanceKm)}`;

      el.append(icon, name, pop);

      const pos = landmarkPosition(landmark, coords, i, total);
      el.dataset.name = landmark.name;

      // Click the pin → open its detail panel + fly in to reveal surroundings.
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onSelectRef.current?.(landmark);
        map.flyTo({
          center: pos,
          zoom: Math.max(map.getZoom(), 15.5),
          speed: 0.8,
          essential: true,
        });
      });

      const marker = new maplibregl.Marker({ element: el, anchor: "center" })
        .setLngLat(pos)
        .addTo(map);
      landmarkMarkersRef.current.push(marker);
    }
  }, [landmarks, activeCategory, coords]);

  // Highlight the selected pin (and raise it above the rest).
  useEffect(() => {
    for (const m of landmarkMarkersRef.current) {
      const el = m.getElement();
      el.classList.toggle(
        "golden-landmark--active",
        !!selectedName && el.dataset.name === selectedName,
      );
    }
  }, [selectedName, landmarks, activeCategory]);

  return (
    <div className={`relative w-full bg-black ${className}`}>
      <div ref={containerRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
