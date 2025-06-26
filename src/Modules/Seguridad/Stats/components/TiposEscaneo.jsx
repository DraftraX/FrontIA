import React from "react";
import { Activity } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function TiposEscaneo({ data = [] }) {
  if (!Array.isArray(data)) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          Tipos de Escaneo Detectados
          <span className="text-xs bg-green-600 px-2 py-1 rounded-full">
            LIVE
          </span>
        </h2>
        <div className="space-y-4">
          {data.map((scan, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{scan.type}</span>
                <div className="text-right">
                  <span className="font-bold">{scan.count}</span>
                  <span className="text-sm text-gray-400 ml-2">
                    ({scan.percentage}%)
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${scan.percentage}%`,
                    backgroundColor: scan.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">
          Distribución de Tipos de Escaneo
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="type"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={40}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
