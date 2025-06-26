import React, { useEffect, useRef, useState } from "react";
import Globe from "globe.gl";
import * as topojson from "topojson-client";
import { categoryMap, allAttackTypes, fakeCoords } from "./data";

window.topojson = topojson;

const ATK_INTERVAL = 650;
const MAX_ARC_LIFETIME = 10000; // ms

export default function LiveCyberAttack2({
  attacks,
  onUpdateAttacks,
  filterCountry,
  setFilterCountry,
}) {
  const globeEl = useRef();
  const globe = useRef();
  const cached = useRef([]);
  const [countryInfo, setCountryInfo] = useState(null);

  const generateFake = () => {
    const rnd = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const start = rnd(fakeCoords);
    const end = rnd(fakeCoords);
    const type = rnd(allAttackTypes);
    const category = Object.entries(categoryMap).find(([, v]) =>
      v.attacks.includes(type)
    )?.[0];
    const color = categoryMap[category]?.color || "#00ffe4";

    return {
      startLat: start.lat,
      startLng: start.lng,
      endLat: end.lat,
      endLng: end.lng,
      classification: type,
      category,
      color,
      id: Math.random().toString(36).slice(2),
      createdAt: Date.now(),
      startCountry: start.country,
      endCountry: end.country,
    };
  };

  useEffect(() => {
    if (!globeEl.current) return;

    globe.current = Globe()(globeEl.current)
      .globeImageUrl(
        "https://unpkg.com/three-globe@2.24.11/example/img/earth-blue-marble.jpg"
      )
      .backgroundImageUrl(
        "https://unpkg.com/three-globe@2.24.11/example/img/night-sky.png"
      )
      .showAtmosphere(true)
      .atmosphereColor("#3da9fc")
      .atmosphereAltitude(0.18)
      .pointOfView({ lat: 25, lng: 0, altitude: 1.5 }, 0);

    setTimeout(() => {
      const controls = globe.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.2;
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.enableDamping = true;
      controls.dampingFactor = 0.07;
    }, 0);

    fetch("https://unpkg.com/world-atlas/countries-110m.json")
      .then((r) => r.json())
      .then((topojsonData) => {
        const features = window.topojson.feature(
          topojsonData,
          topojsonData.objects.countries
        ).features;

        globe.current
          .polygonsData(features)
          .polygonCapColor(() => "rgba(0,0,0,0)")
          .polygonSideColor(() => "rgba(0,0,0,0)")
          .polygonStrokeColor(() => "rgba(255,255,255,0.05)")
          .polygonLabel(({ properties: d }) => `<b>${d.name}</b>`)
          .onPolygonClick(({ properties: d }) => {
            setFilterCountry(d.name);
            setCountryInfo({
              name: d.name,
              description: `Actividad detectada en ${d.name}`,
            });
          });

        const labels = features.map((c) => {
          const coords =
            c.geometry.type === "MultiPolygon"
              ? c.geometry.coordinates[0][0]
              : c.geometry.coordinates[0];
          const avg = coords.reduce(
            (a, [lng, lat]) => [a[0] + lng, a[1] + lat],
            [0, 0]
          );
          const len = coords.length;
          return {
            lat: avg[1] / len,
            lng: avg[0] / len,
            text: c.properties.name,
          };
        });

        globe.current
          .labelsData(labels)
          .labelLat((d) => d.lat)
          .labelLng((d) => d.lng)
          .labelText((d) => d.text)
          .labelColor(() => "rgba(255,255,255,0.45)")
          .labelSize(0.28)
          .labelDotRadius(0.02)
          .labelResolution(2);
      });

    const onResize = () => {
      if (globeEl.current) {
        const { clientWidth, clientHeight } = globeEl.current;
        globe.current.width(clientWidth).height(clientHeight);
        globe.current.renderer().setSize(clientWidth, clientHeight, false);
      }
    };

    window.addEventListener("resize", onResize);
    onResize();

    return () => {
      window.removeEventListener("resize", onResize);
      globe.current && globe.current.renderer().dispose();
    };
  }, [setFilterCountry]);

  useEffect(() => {
    // Configurar propiedades de arcos una vez
    globe.current
      .arcStartLat((d) => d.startLat)
      .arcStartLng((d) => d.startLng)
      .arcEndLat((d) => d.endLat)
      .arcEndLng((d) => d.endLng)
      .arcColor((d) => {
        const age = Date.now() - d.createdAt;
        const alpha = 1 - age / MAX_ARC_LIFETIME;
        return d.color.replace("rgb", "rgba").replace(")", `,${alpha})`);
      })
      .arcStroke(1.1)
      .arcDashLength(0.25)
      .arcDashGap(1.8)
      .arcDashInitialGap(() => Math.random() * 5)
      .arcDashAnimateTime(7000);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const filtered = filterCountry
        ? cached.current.filter(
            (a) =>
              (a.startCountry === filterCountry ||
                a.endCountry === filterCountry) &&
              now - a.createdAt < MAX_ARC_LIFETIME
          )
        : cached.current.filter((a) => now - a.createdAt < MAX_ARC_LIFETIME);

      globe.current.arcsData(filtered);
    }, 500);

    return () => clearInterval(interval);
  }, [filterCountry]);

  useEffect(() => {
    if (typeof onUpdateAttacks !== "function") return;

    const tick = () => {
      const now = Date.now();
      const atk = { ...generateFake(), createdAt: now };

      cached.current = [
        ...cached.current.filter((a) => now - a.createdAt < MAX_ARC_LIFETIME),
        atk,
      ];

      onUpdateAttacks(cached.current);
    };

    const id = setInterval(tick, ATK_INTERVAL);
    return () => clearInterval(id);
  }, [onUpdateAttacks]);

  return (
    <div className="relative w-full h-full bg-[#0a0e1a]">
      <div ref={globeEl} className="w-full h-full" />
      {countryInfo && (
        <div className="absolute bottom-6 left-6 bg-white/5 text-white p-5 rounded-lg shadow-xl backdrop-blur-sm border border-white/10 max-w-sm">
          <h3 className="font-semibold text-base tracking-wide mb-1">
            {countryInfo.name}
          </h3>
          <p className="text-sm text-gray-300">{countryInfo.description}</p>
          <button
            className="mt-3 px-3 py-1 text-xs border border-gray-400 rounded hover:bg-white hover:text-black transition"
            onClick={() => {
              setFilterCountry("");
              setCountryInfo(null);
            }}
          >
            Limpiar filtro
          </button>
        </div>
      )}
    </div>
  );
}
