"use client";

import "maplibre-gl/dist/maplibre-gl.css";

import { useEffect, useRef } from "react";
import maplibregl, { type StyleSpecification } from "maplibre-gl";
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

const DARK_STYLE: StyleSpecification = {
  version: 8,
  name: "Golden Minimal Dark",
  sources: {
    carto: {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
        "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
        "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
        "https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
      ],
      tileSize: 256,
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
    },
  },
  layers: [
    { id: "bg", type: "background", paint: { "background-color": "#0b0f14" } },
    {
      id: "carto",
      type: "raster",
      source: "carto",
      paint: {
        "raster-opacity": 0.95,
        "raster-contrast": 0.05,
        "raster-saturation": -0.1,
      },
    },
  ],
};

const CATEGORY_ICONS: Record<LandmarkCategory, typeof GraduationCap> = {
  education: GraduationCap,
  healthcare: FirstAid,
  recreation: Tree,
  transit: Train,
};

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

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

function landmarkPosition(landmark: Landmark, base: Coords): Coords {
  const bearing = landmark.bearing ?? (hashString(landmark.name) % 360);
  return offsetCoords(base, landmark.distanceKm, bearing);
}

function iconSvg(category: LandmarkCategory, color = "#ffffff"): string {
  const Icon = CATEGORY_ICONS[category];
  return renderToStaticMarkup(
    <Icon weight="regular" size={16} color={color} />,
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
}: {
  coords: Coords;
  landmarks?: Landmark[];
  activeCategory?: LandmarkCategory;
  className?: string;
  zoom?: number;
  projectName?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const landmarkMarkersRef = useRef<maplibregl.Marker[]>([]);

  // Mount/teardown map and main marker. Stable across category switches.
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const maxKm = landmarks.reduce(
      (m, l) => (l.distanceKm > m ? l.distanceKm : m),
      0,
    );
    const autoZoom =
      zoom ??
      (maxKm <= 1
        ? 14.5
        : maxKm <= 3
        ? 13.5
        : maxKm <= 6
        ? 12.7
        : maxKm <= 12
        ? 11.7
        : 10.8);

    const map = new maplibregl.Map({
      container: node,
      style: DARK_STYLE,
      center: coords,
      zoom: autoZoom,
      cooperativeGestures: true,
    });

    mapRef.current = map;

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

    for (const landmark of visible) {
      const el = document.createElement("div");
      el.className = "golden-landmark";
      el.setAttribute(
        "aria-label",
        `${landmark.name}, ${landmark.minutes} minutes`,
      );

      const icon = document.createElement("span");
      icon.className = "golden-landmark__icon";
      icon.innerHTML = iconSvg(landmark.category);

      const pop = document.createElement("div");
      pop.className = "golden-landmark__pop";
      pop.innerHTML = `
        <div class="golden-landmark__pop-title"></div>
        <div class="golden-landmark__pop-meta"></div>
      `;
      (pop.querySelector(".golden-landmark__pop-title") as HTMLElement).textContent =
        landmark.name;
      (pop.querySelector(".golden-landmark__pop-meta") as HTMLElement).textContent =
        `${landmark.minutes} min · ${formatKm(landmark.distanceKm)}`;

      el.append(icon, pop);

      const marker = new maplibregl.Marker({ element: el, anchor: "center" })
        .setLngLat(landmarkPosition(landmark, coords))
        .addTo(map);
      landmarkMarkersRef.current.push(marker);
    }
  }, [landmarks, activeCategory, coords]);

  return (
    <div className={`relative w-full bg-black ${className}`}>
      <div ref={containerRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
