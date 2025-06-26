import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Clock } from "lucide-react"; // ✅ IMPORTACIÓN NECESARIA

const ActividadTemporal = ({ timelineData = [] }) => {
  if (!Array.isArray(timelineData) || timelineData.length === 0) {
    return <p className="text-gray-400 p-4">No hay datos disponibles aún.</p>;
  }

  return (
    <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-cyan-400" />
        Actividad de Escaneo - Últimas 24 Horas
        <span className="text-xs bg-green-600 px-2 py-1 rounded-full">
          LIVE
        </span>
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={timelineData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="hour" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="portScans"
            stackId="1"
            stroke="#06D6A0"
            fill="#06D6A0"
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="alerts"
            stackId="1"
            stroke="#F59E0B"
            fill="#F59E0B"
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="blocked"
            stackId="1"
            stroke="#EF4444"
            fill="#EF4444"
            fillOpacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActividadTemporal;
