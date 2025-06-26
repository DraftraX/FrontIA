import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  Settings,
  Download,
  Maximize2,
  Minimize2,
  Activity,
} from "lucide-react";

import LiveCyberAttack from "../../../components/LiveCyberAttack/LiveCyberAttack";
import AttackList from "../../../components/AttackList/AttackList";
import CountryFilter from "../../../components/AttackList/CountryFilter";
import ThreatLegend from "../../../components/ThreatLegend/ThreatLegend";
import AlertSystem from "../../../components/AlertSystem/AlertSystem";
import { countries } from "./data";

export default function Home2() {
  const [attacks, setAttacks] = useState([]);
  const [filterCountry, setFilterCountry] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredAttacks = filterCountry
    ? attacks.filter(
        (a) =>
          a.startCountry === filterCountry || a.endCountry === filterCountry
      )
    : attacks;

  const toggleFullscreen = () => {
    if (!fullscreen) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
    setFullscreen((prev) => !prev);
  };

  const exportData = () => {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            timestamp: new Date().toISOString(),
            totalAttacks: filteredAttacks.length,
            attacks: filteredAttacks,
            filterCountry,
          },
          null,
          2
        ),
      ],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nids-report-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const goToStats = () => (window.location.href = "/stats");

  return (
    <div className="relative w-full h-screen flex flex-col bg-gray-900 overflow-hidden">
      {/* Header */}
      <header className="relative z-20 flex items-center justify-between p-4 bg-black/60 backdrop-blur-md border-b border-white/20">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-white"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          {/* Logo y botón de estadísticas */}
          <div className="flex items-center space-x-3">
            <div className="w-14 h-10  rounded-lg flex items-center justify-center">
              <Link to={"/home"}>
                <img src="../../../logo.jpeg" alt="" />
              </Link>
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-white">EmberGuard</h2>
              <p className="text-xs text-gray-400 -mt-1">
                Network Intrusion Detection System
              </p>
            </div>
            <button
              onClick={goToStats}
              className="hidden lg:block ml-2 p-2 rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white"
              title="Ver estadísticas"
            >
              <Activity className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="text-center text-white">
          <h1 className="text-2xl lg:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-green-400">
            LIVE CYBER THREAT MAP
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Universidad Nacional de San Martín - Campus Monitoreo
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportData}
            className="p-2 rounded-lg bg-gray-800/50 text-white hover:bg-gray-700/50"
            title="Exportar datos"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-gray-800/50 text-white hover:bg-gray-700/50"
            title="Pantalla completa"
          >
            {fullscreen ? (
              <Minimize2 className="w-5 h-5" />
            ) : (
              <Maximize2 className="w-5 h-5" />
            )}
          </button>
          <button className="p-2 rounded-lg bg-gray-800/50 text-white hover:bg-gray-700/50">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Sidebar Izquierda */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed md:relative md:translate-x-0 z-30 md:z-10
          top-0 left-0 h-full w-72 bg-black/70 backdrop-blur-md border-r border-white/20
          transition-transform duration-300 ease-in-out overflow-y-auto`}
        >
          <div className="p-4 space-y-6 pt-16 md:pt-4">
            <CountryFilter
              countries={countries}
              filterCountry={filterCountry}
              setFilterCountry={setFilterCountry}
            />
            <AttackList
              filteredAttacks={filteredAttacks}
              filterCountry={filterCountry}
            />
          </div>
        </aside>

        {/* Panel central (globo) */}
        <main className="flex-1 relative z-0 overflow-hidden">
          <div className="absolute inset-0 z-0">
            {/* <LiveCyberAttack
              attacks={attacks}
              onUpdateAttacks={setAttacks}
              filterCountry={filterCountry || null}
              setFilterCountry={setFilterCountry}
            /> */}
            <iframe
              width="100%"
              height="800"
              src="https://cybermap.kaspersky.com/en/widget/dynamic/dark"
              frameBorder="0"
              allowFullScreen
              title="Kaspersky CyberMap"
            />
          </div>
        </main>

        {/* Panel derecho (alertas) */}
        <aside className="hidden lg:block w-72 bg-black/70 backdrop-blur-md border-l border-white/20 overflow-y-auto z-10">
          <AlertSystem
            filteredAttacks={filteredAttacks}
            filterCountry={filterCountry}
          />
        </aside>
      </div>

      {/* Footer */}
      <footer className="relative z-20 bg-black/60 backdrop-blur-md border-t border-white/20">
        <ThreatLegend />
      </footer>

      {/* Botón de estadísticas en móvil */}
      <button
        onClick={goToStats}
        className="lg:hidden fixed bottom-4 right-4 z-40 bg-cyan-600 hover:bg-cyan-700 text-white p-4 rounded-full shadow-lg"
      >
        <Activity className="w-6 h-6" />
      </button>

      {/* Estado del sistema */}
      <div className="fixed bottom-4 left-4 z-40 flex items-center space-x-2">
        <div className="flex items-center space-x-2 bg-black/60 backdrop-blur-md rounded-full px-3 py-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-white text-xs font-medium">Sistema Activo</span>
        </div>
        {attacks.length > 0 && (
          <div className="bg-black/60 backdrop-blur-md rounded-full px-3 py-2">
            <span className="text-white text-xs font-medium">
              Último:{" "}
              {new Date(attacks[attacks.length - 1]?.time).toLocaleTimeString()}
            </span>
          </div>
        )}
      </div>

      {/* Overlay móvil para cerrar sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
