import React, { useEffect, useRef, useState } from "react";
import Globe from "globe.gl";
import * as topojson from "topojson-client";
import { categoryMap, allAttackTypes, fakeCoords } from "./data";

window.topojson = topojson;

export default function LiveCyberAttack({
  attacks,
  onUpdateAttacks,
  filterCountry,
  setFilterCountry,
}) {
  const globeEl = useRef();
  const globeInstance = useRef();
  const [countryInfo, setCountryInfo] = useState(null);

  const generateFakeAttack = () => {
    const start = fakeCoords[Math.floor(Math.random() * fakeCoords.length)];
    const end = fakeCoords[Math.floor(Math.random() * fakeCoords.length)];
    const type = allAttackTypes[Math.floor(Math.random() * allAttackTypes.length)];
    const category = Object.keys(categoryMap).find((cat) =>
      categoryMap[cat].attacks.includes(type)
    );
    const color = categoryMap[category]?.color || "white";
    const now = new Date().toISOString();

    return {
      startLat: start.lat,
      startLng: start.lng,
      startCountry: start.country,
      endLat: end.lat,
      endLng: end.lng,
      endCountry: end.country,
      classification: type,
      category,
      color,
      id: Math.random().toString(36).substr(2, 9),
      time: now,
    };
  };

  function getPolygonCentroid(geometry) {
    if (!geometry || !geometry.coordinates) return [0, 0];
    let coordinates = [];

    if (geometry.type === "Polygon") {
      coordinates = geometry.coordinates[0];
    } else if (geometry.type === "MultiPolygon") {
      coordinates = geometry.coordinates[0][0];
    } else {
      return [0, 0];
    }

    let lngSum = 0,
      latSum = 0;

    coordinates.forEach(([lng, lat]) => {
      lngSum += lng;
      latSum += lat;
    });

    const count = coordinates.length;

    return [lngSum / count, latSum / count];
  }

  useEffect(() => {
    if (!globeEl.current) return;

    const globe = Globe()(globeEl.current)
      .globeImageUrl("//unpkg.com/three-globe/example/img/earth-night.jpg")
      .backgroundColor("#000011")
      .showAtmosphere(true)
      .atmosphereColor("lightblue")
      .atmosphereAltitude(0.1)
      .pointOfView({ lat: 20, lng: 0, altitude: 2 });

    globeInstance.current = globe;

    setTimeout(() => {
      const controls = globe.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
    }, 1000);

    fetch("https://unpkg.com/world-atlas/countries-110m.json")
      .then((res) => res.json())
      .then((topojsonData) => {
        const countries = window.topojson.feature(
          topojsonData,
          topojsonData.objects.countries
        ).features;

        globe
          .polygonsData(countries)
          .polygonCapColor(() => "rgba(0, 255, 0, 0.15)")
          .polygonSideColor(() => "rgba(0, 100, 0, 0.3)")
          .polygonStrokeColor(() => "#00ff00")
          .polygonLabel(({ properties: d }) => `<b>${d.name}</b>`)
          .onPolygonClick((polygon) => {
            const countryName = polygon.properties.name;
            setFilterCountry(countryName);
            setCountryInfo({
              name: countryName,
              description: `Información específica para ${countryName}.`,
            });
          })
          .onPolygonHover((polygon) => {
            globe.polygonCapColor((d) =>
              d === polygon ? "rgba(255,255,255,0.4)" : "rgba(0, 255, 0, 0.15)"
            );
          });

        const labels = countries.map((country) => {
          const [lng, lat] = getPolygonCentroid(country.geometry);
          return {
            lat,
            lng,
            text: country.properties.name,
          };
        });

        globe
          .labelsData(labels)
          .labelLat((d) => d.lat)
          .labelLng((d) => d.lng)
          .labelText((d) => d.text)
          .labelColor(() => "white")
          .labelSize(() => 0.5)
          .labelDotRadius(() => 0.1)
          .labelResolution(2);
      });

    const handleResize = () => {
      if (globeEl.current) {
        const { clientWidth, clientHeight } = globeEl.current;
        globe.width(clientWidth);
        globe.height(clientHeight);
        globe.renderer().setSize(clientWidth, clientHeight, false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      globeInstance.current && globeInstance.current.renderer().dispose();
      globeInstance.current = null;
    };
  }, [setFilterCountry]);

  useEffect(() => {
    if (!globeInstance.current) return;

    let filtered = attacks;
    if (filterCountry && filterCountry !== "") {
      filtered = attacks.filter(
        (a) => a.startCountry === filterCountry || a.endCountry === filterCountry
      );
    }

    globeInstance.current
      .arcsData(filtered)
      .arcColor((d) => d.color || "white")
      .arcAltitude(0.2)
      .arcStroke(0.8)
      .arcDashLength(0.5)
      .arcDashGap(0.4)
      .arcDashAnimateTime(4000);
  }, [attacks, filterCountry]);

  useEffect(() => {
    if (typeof onUpdateAttacks !== "function") {
      console.warn("onUpdateAttacks no es función, no se generan ataques falsos.");
      return;
    }

    const interval = setInterval(() => {
      const attack = generateFakeAttack();
      onUpdateAttacks((prev) => {
        if (!Array.isArray(prev)) return [attack];
        return [...prev.slice(-999), attack];
      });
    }, 500);

    return () => clearInterval(interval);
  }, [onUpdateAttacks]);

  return (
    <div className="relative w-full h-full" style={{ minHeight: 0 }}>
      <div
        className="w-full h-full"
        ref={globeEl}
        style={{ minHeight: 0, minWidth: 0 }}
      ></div>

      {countryInfo && (
        <div className="absolute bottom-10 left-10 bg-black bg-opacity-80 text-white p-4 rounded-md max-w-xs shadow-md">
          <h3 className="text-lg font-semibold mb-1">{countryInfo.name}</h3>
          <p>{countryInfo.description}</p>
          <button
            className="mt-2 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded"
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