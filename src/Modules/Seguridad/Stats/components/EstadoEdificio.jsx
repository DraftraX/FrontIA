import React from "react";
import { Server } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function EstadoEdificio({ data = [] }) {
  if (!Array.isArray(data)) return null;

  const getStatusColor = (status) => {
    const colors = {
      critical: "bg-red-500",
      warning: "bg-yellow-500",
      safe: "bg-green-500",
    };
    return colors[status] || "bg-gray-500";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Server className="w-5 h-5 text-cyan-400" />
          Estado por Edificio - UNSM
          <span className="text-xs bg-green-600 px-2 py-1 rounded-full">
            LIVE
          </span>
        </h2>
        <div className="space-y-4">
          {data.map((building, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${getStatusColor(
                    building.status
                  )}`}
                ></div>
                <div>
                  <p className="font-medium">{building.name}</p>
                  <p className="text-sm text-gray-400">
                    {building.scans} escaneos detectados
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-yellow-400">{building.alerts}</p>
                <p className="text-xs text-gray-400">alertas</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">
          Dispositivos por Edificio
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis type="number" stroke="#9CA3AF" />
            <YAxis
              dataKey="name"
              type="category"
              stroke="#9CA3AF"
              fontSize={12}
              width={120}
            />
            <Tooltip />
            <Bar dataKey="devices" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
