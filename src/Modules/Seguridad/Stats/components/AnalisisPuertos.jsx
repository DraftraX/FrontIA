import React from "react";
import { Network } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function AnalisisPuertos({ data = [] }) {
  if (!Array.isArray(data)) return null;

  const getRiskColor = (risk) => {
    const colors = {
      High: "text-red-400 bg-red-400/10",
      Medium: "text-yellow-400 bg-yellow-400/10",
      Low: "text-green-400 bg-green-400/10",
    };
    return colors[risk] || "text-gray-400 bg-gray-400/10";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Network className="w-5 h-5 text-cyan-400" />
          Puertos Más Escaneados (UNSM)
          <span className="text-xs bg-green-600 px-2 py-1 rounded-full">
            LIVE
          </span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-2">Puerto</th>
                <th className="text-left p-2">Servicio</th>
                <th className="text-left p-2">Intentos</th>
                <th className="text-left p-2">Riesgo</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 8).map((port) => (
                <tr
                  key={port.port}
                  className="border-b border-gray-800 hover:bg-gray-800/50"
                >
                  <td className="p-2 font-mono text-cyan-400">{port.port}</td>
                  <td className="p-2">{port.service}</td>
                  <td className="p-2 font-bold">{port.attempts}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(
                        port.risk
                      )}`}
                    >
                      {port.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">
          Distribución de Escaneos por Puerto
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.slice(0, 6)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="port" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip />
            <Bar dataKey="attempts" fill="#06D6A0" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
