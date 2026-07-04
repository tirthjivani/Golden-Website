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

// Vector basemap: MapTiler "Streets v2 Dark" — a detailed dark vector style
// (road casing, dense labels, transit, POIs) matching the site's dark theme.
// The key is a publishable client-side key; restrict it to the site's domain
// in the MapTiler dashboard. Free tier (100k loads/mo), commercial use allowed.
// Production must set NEXT_PUBLIC_MAPTILER_KEY to the client's own key; the
// fallback is the development key.
const MAPTILER_KEY =
  process.env.NEXT_PUBLIC_MAPTILER_KEY ?? "jTWeD4sqej7xVBLZ2f5r";
const STYLE_URL = `https://api.maptiler.com/maps/basic-v2-dark/style.json?key=${MAPTILER_KEY}`;

const CATEGORY_ICONS: Record<LandmarkCategory, typeof GraduationCap> = {
  education: GraduationCap,
  healthcare: FirstAid,
  recreation: Tree,
  transit: Train,
};

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
  // First fitBounds after a (re)mount is instant; later category switches animate.
  const firstFitRef = useRef(true);
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
    firstFitRef.current = true;

    // Real pin positions vary in spread per project/category, so we don't fix a
    // zoom here — the marker effect calls fitBounds to frame the actual pins.
    // This initial zoom is just a sensible starting frame around the project.
    const map = new maplibregl.Map({
      container: node,
      style: STYLE_URL,
      center: coords,
      zoom: zoom ?? 13,
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

    // Only landmarks with a real geocoded position are pinned — we never
    // synthesise a fake location, so every pin sits where the place actually is.
    const visible = (
      activeCategory
        ? landmarks.filter((l) => l.category === activeCategory)
        : landmarks
    ).filter((l): l is Landmark & { coords: Coords } => Array.isArray(l.coords));

    for (const landmark of visible) {
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

      const pos = landmark.coords;
      el.dataset.name = landmark.name;

      // Click the pin → open its detail panel + fly in to reveal surroundings.
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onSelectRef.current?.(landmark);
        map.flyTo({
          center: pos,
          zoom: Math.max(map.getZoom(), 14.5),
          speed: 0.8,
          essential: true,
        });
      });

      const marker = new maplibregl.Marker({ element: el, anchor: "center" })
        .setLngLat(pos)
        .addTo(map);
      landmarkMarkersRef.current.push(marker);
    }

    // Frame the project plus all visible pins so the category fills the map.
    if (visible.length > 0) {
      const bounds = new maplibregl.LngLatBounds(coords, coords);
      for (const l of visible) bounds.extend(l.coords);
      map.fitBounds(bounds, {
        padding: { top: 90, bottom: 70, left: 60, right: 60 },
        maxZoom: 14,
        duration: firstFitRef.current ? 0 : 600,
      });
      firstFitRef.current = false;
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
