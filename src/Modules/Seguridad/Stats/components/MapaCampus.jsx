import React, { useState, useEffect } from "react";
import { Shield } from "lucide-react";

const MapaCampus = () => {
  const [currentAlerts, setCurrentAlerts] = useState(3);
  const [coverage, setCoverage] = useState(97.5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAlerts(Math.floor(Math.random() * 6) + 1);
      setCoverage(95 + Math.random() * 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const campusPoints = [
    { name: "Facultad de Sistemas", status: "safe" },
    { name: "OTI", status: "critical" },
    { name: "Auditorio Central", status: "safe" },
    { name: "Videoconferencia", status: "warning" },
  ];

  return (
    <div className="bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-cyan-400 mb-5 flex items-center gap-3">
        Ciudad Universitaria UNSM - Tarapoto
        <span className="text-xs bg-red-600 px-2 py-0.5 rounded-full animate-pulse">
          MONITOREO ACTIVO
        </span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mapa enfocado a la UNSM */}
        <div className="relative h-[500px] rounded-xl overflow-hidden border-2 border-cyan-500 shadow-inner">
          <iframe
            width="100%"
            height="100%"
            src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=es&amp;q=Jr.%20Amorarca%20315,%20Tarapoto%2022201+()&amp;t=k&amp;z=18&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title="UNSM Campus"
          />
        </div>

        {/* Panel de información */}
        <div className="space-y-4 text-gray-300 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/60 rounded-xl p-4 text-center shadow">
              <div className="text-3xl font-bold text-green-400">
                {coverage.toFixed(1)}%
              </div>
              <div className="mt-1 text-xs">Cobertura NIDS</div>
            </div>
            <div className="bg-gray-800/60 rounded-xl p-4 text-center shadow">
              <div className="text-3xl font-bold text-red-400">
                {currentAlerts}
              </div>
              <div className="mt-1 text-xs">Alertas activas</div>
            </div>
            <div className="bg-gray-800/60 rounded-xl p-4 text-center shadow">
              <div className="text-3xl font-bold text-yellow-400">24/7</div>
              <div className="mt-1 text-xs">Monitoreo</div>
            </div>
            <div className="bg-gray-800/60 rounded-xl p-4 text-center shadow">
              <div className="text-3xl font-bold text-cyan-400">99.8%</div>
              <div className="mt-1 text-xs">Uptime</div>
            </div>
          </div>

          <div className="bg-gray-800/40 rounded-xl p-4 shadow">
            <h3 className="text-lg font-semibold text-cyan-300 mb-3">
              Estado Interno del Campus
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full" />
                  Zonas Seguras
                </span>
                <span className="text-green-400 font-bold">
                  {campusPoints.filter((p) => p.status === "safe").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                  En Observación
                </span>
                <span className="text-yellow-400 font-bold">
                  {campusPoints.filter((p) => p.status === "warning").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  Críticas
                </span>
                <span className="text-red-500 font-bold">
                  {campusPoints.filter((p) => p.status === "critical").length}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-blue-900/20 border border-blue-500/40 rounded-lg p-4 text-xs">
            <div className="flex items-center gap-2 text-blue-400 font-semibold mb-2">
              <Shield className="w-4 h-4" />
              Nodo Central - UNSM NIDS
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <strong>Ubicación:</strong> Jr. Amorarca 315, Tarapoto
                <br />
                <strong>Altitud:</strong> 356 msnm
                <br />
                <strong>Coordenadas:</strong> 6°29'20"S 76°21'43"W
              </div>
              <div>
                <strong>Protocolo:</strong> NIDS v2.1
                <br />
                <strong>Última sync:</strong> {new Date().toLocaleTimeString()}
                <br />
                <strong>Ping:</strong> 12 ms
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapaCampus;
