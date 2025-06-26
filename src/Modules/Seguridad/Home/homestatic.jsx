// pages/Home.jsx
import { useState, useEffect } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import MapAttack from "./components/MapAttack";
import Panel from "./components/Panel";

import {
  countries,
  threatTypes,
  malwareNames,
  cityCoordinates,
  staticAttacks,
  staticConnections,
  staticCountryStats,
} from "./data";

export default function Home2() {
  const [attacks, setAttacks] = useState(staticAttacks);
  const [connections, setConnections] = useState(staticConnections);
  const [countryStats, setCountryStats] = useState(staticCountryStats);

  const getRandomCoordinate = (country) => {
    const coords = cityCoordinates[country];
    if (coords?.length) {
      const [lon, lat] = coords[Math.floor(Math.random() * coords.length)];
      return [lon + (Math.random() - 0.5) * 2, lat + (Math.random() - 0.5) * 2];
    }
    return [Math.random() * 360 - 180, Math.random() * 180 - 90];
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const sourceCountry =
        countries[Math.floor(Math.random() * countries.length)];
      const targetCountry =
        countries[Math.floor(Math.random() * countries.length)];
      const threatType =
        threatTypes[Math.floor(Math.random() * threatTypes.length)];

      const mockAttack = {
        id: Date.now() + Math.random(),
        time: new Date().toLocaleString("en-US", {
          hour12: true,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        type: threatType,
        malware:
          threatType === "INFECTION"
            ? malwareNames[Math.floor(Math.random() * malwareNames.length)]
            : "N/A",
        sourceCountry,
        targetCountry: Math.random() > 0.3 ? targetCountry : "N/A",
        source: { coordinates: getRandomCoordinate(sourceCountry) },
        target:
          Math.random() > 0.3
            ? { coordinates: getRandomCoordinate(targetCountry) }
            : null,
      };

      setAttacks((prev) => [...prev.slice(-49), mockAttack]);
      if (mockAttack.target) {
        setConnections((prev) => [
          ...prev.slice(-20),
          {
            id: mockAttack.id,
            from: mockAttack.source.coordinates,
            to: mockAttack.target.coordinates,
            type: threatType,
            timestamp: Date.now(),
          },
        ]);
      }
      setCountryStats((prev) => ({
        ...prev,
        [sourceCountry]: (prev[sourceCountry] || 0) + 1,
      }));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const cleanup = setInterval(() => {
      setConnections((prev) =>
        prev.filter((c) => Date.now() - c.timestamp < 5000)
      );
    }, 1000);
    return () => clearInterval(cleanup);
  }, []);

  return (
    <div className="flex flex-col h-screen w-full bg-black text-white font-mono relative overflow-hidden">
      <Header />
      <MapAttack attacks={attacks} connections={connections} />
      <Panel attacks={attacks} countryStats={countryStats} />
      <Footer />
    </div>
  );
}
