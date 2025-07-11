import React, { useState, useEffect, useMemo } from "react";
import tokenItem from "../../../utils/TokenItem";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

import ActividadTemporal from "./components/ActividadTemporal";
import AnalisisPuertos from "./components/AnalisisPuertos";
import EstadoEdificio from "./components/EstadoEdificio";
import MapaCampus from "./components/MapaCampus";
import TiposEscaneo from "./components/TiposEscaneo";
import TablaLogs from "./components/TablaLogs";

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
    logs: [],
  });
  const [timelineData, setTimelineData] = useState([]);

  useEffect(() => {
    const fetchSnortLogs = async () => {
      try {
        const res = await tokenItem.get(`/api/deteccion/logs-snort/`); // ✅ Autenticado
        const alerts = res.data;

        const ports = {};
        const types = {};
        const timeline = Array(24).fill(0);

        alerts.forEach((alert) => {
          const port = parseInt(alert.dst_port);
          const hour = alert.timestamp?.split(":")[0] || "00";

          ports[port] = (ports[port] || 0) + 1;

          const type = alert.message.includes("SYN")
            ? "TCP SYN"
            : alert.protocol;
          types[type] = (types[type] || 0) + 1;

          timeline[parseInt(hour)] += 1;
        });

        setData({
          commonPorts: Object.entries(ports).map(([port, attempts]) => ({
            port,
            attempts,
          })),
          buildings: [], // Si tienes data, reemplaza esto
          scanTypes: Object.entries(types).map(([type, count]) => ({
            type,
            count,
          })),
          logs: alerts,
        });

        setTimelineData(
          timeline.map((count, i) => ({
            hour: `${i.toString().padStart(2, "0")}:00`,
            portScans: count,
          }))
        );
      } catch (error) {
        console.error("Error al obtener logs de Snort:", error);
      }
    };

    fetchSnortLogs();
    const interval = setInterval(fetchSnortLogs, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = useMemo(
    () => ({
      totalScans: data.commonPorts.reduce(
        (sum, port) => sum + port.attempts,
        0
      ),
      totalBuildings: data.buildings.length,
      activeAlerts: data.commonPorts.reduce((sum, p) => sum + p.attempts, 0),
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
    { id: "logs", label: "Logs" },
  ];

  return (
    <div className="relative flex flex-col min-h-screen bg-black text-white font-mono overflow-x-hidden">
      <Header />

      <div className="pt-24 pb-16 px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Escaneos" value={stats.totalScans} />
          <StatCard title="Edificios" value={stats.totalBuildings} />
          <StatCard title="Alertas" value={stats.activeAlerts} />
          <StatCard title="Dispositivos" value={stats.totalDevices} />
        </div>

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
          {activeTab === "logs" && <TablaLogs logs={data.logs} />}
        </div>
      </div>

      <Footer />
    </div>
  );
}
