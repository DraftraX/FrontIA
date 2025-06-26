import React, { useState, useEffect, useMemo } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

import ActividadTemporal from "./components/ActividadTemporal";
import AnalisisPuertos from "./components/AnalisisPuertos";
import EstadoEdificio from "./components/EstadoEdificio";
import MapaCampus from "./components/MapaCampus";
import TiposEscaneo from "./components/TiposEscaneo";

const StatCard = ({ title, value }) => (
  <div className="bg-neutral-900/60 backdrop-blur-sm border border-neutral-800 rounded-xl p-4">
    <h3 className="text-sm text-neutral-400 mb-1">{title}</h3>
    <p className="text-2xl text-white font-semibold">{value}</p>
  </div>
);

export default function Stats() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("map");
  const [data, setData] = useState({
    commonPorts: [],
    buildings: [],
    scanTypes: [],
  });

  const generateRandomData = () => {
    const ports = [22, 80, 443, 21, 23, 3389, 25, 53, 110, 143];
    const buildings = [
      "Facultad de Ingeniería",
      "Biblioteca Central",
      "Centro de Cómputo",
      "Administración",
      "Laboratorios",
      "Aulas Virtuales",
    ];

    return {
      commonPorts: ports.map((port) => ({
        port,
        attempts: Math.floor(Math.random() * 200),
      })),
      buildings: buildings.map((name) => ({
        name,
        alerts: Math.floor(Math.random() * 25),
        devices: Math.floor(Math.random() * 50) + 10,
      })),
      scanTypes: [
        { type: "TCP SYN", count: Math.floor(Math.random() * 200) },
        { type: "UDP", count: Math.floor(Math.random() * 150) },
        { type: "TCP Connect", count: Math.floor(Math.random() * 100) },
      ],
    };
  };

  useEffect(() => {
    const updateData = () => {
      setData(generateRandomData());
    };

    updateData();
    const interval = setInterval(updateData, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timelineData = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => ({
      hour: `${i.toString().padStart(2, "0")}:00`,
      portScans: Math.floor(Math.random() * 30) + 5,
    }));
  }, [currentTime.getMinutes()]);

  const stats = useMemo(
    () => ({
      totalScans: data.commonPorts.reduce(
        (sum, port) => sum + port.attempts,
        0
      ),
      totalBuildings: data.buildings.length,
      activeAlerts: data.buildings.reduce((sum, b) => sum + b.alerts, 0),
      totalDevices: data.buildings.reduce((sum, b) => sum + b.devices, 0),
    }),
    [data]
  );

  const tabs = [
    { id: "map", label: "Mapa" },
    { id: "ports", label: "Puertos" },
    { id: "buildings", label: "Edificios" },
    { id: "timeline", label: "Actividad" },
    { id: "types", label: "Tipos" },
  ];

  return (
    <div className="relative flex flex-col min-h-screen bg-black text-white font-mono overflow-x-hidden">
      <Header />

      <div className="pt-24 pb-16 px-6 max-w-7xl mx-auto w-full">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Escaneos" value={stats.totalScans} />
          <StatCard title="Edificios" value={stats.totalBuildings} />
          <StatCard title="Alertas" value={stats.activeAlerts} />
          <StatCard title="Dispositivos" value={stats.totalDevices} />
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 text-sm">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-4 py-1.5 rounded border border-neutral-700 hover:border-cyan-500 transition ${
                activeTab === id
                  ? "bg-cyan-600 text-white"
                  : "bg-neutral-900 text-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Views */}
        <div className="space-y-6">
          {activeTab === "map" && (
            <MapaCampus activeAlerts={stats.activeAlerts} />
          )}
          {activeTab === "ports" && <AnalisisPuertos data={data.commonPorts} />}
          {activeTab === "buildings" && (
            <EstadoEdificio data={data.buildings} />
          )}
          {activeTab === "timeline" && (
            <ActividadTemporal timelineData={timelineData} />
          )}
          {activeTab === "types" && <TiposEscaneo data={data.scanTypes} />}
        </div>
      </div>

      <Footer />
    </div>
  );
}
