import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  TrendingUp,
  Clock,
  Globe,
  Zap
} from "lucide-react";
import { categoryMap, abbreviations } from "./data";

const AttackStats = ({ attacks }) => {
  const [activeTab, setActiveTab] = useState("overview");

  const stats = useMemo(() => {
    if (!attacks || attacks.length === 0) {
      return {
        totalAttacks: 0,
        uniqueCountries: 0,
        topAttackType: "N/A",
        averagePerMinute: 0,
        categoryData: [],
        countryData: [],
        timelineData: []
      };
    }

    const totalAttacks = attacks.length;
    const countries = new Set();
    const attackTypes = {};
    const countryCounts = {};

    attacks.forEach(attack => {
      countries.add(attack.startCountry);
      countries.add(attack.endCountry);
      
      const type = attack.classification || "Desconocido";
      attackTypes[type] = (attackTypes[type] || 0) + 1;
      
      countryCounts[attack.endCountry] = (countryCounts[attack.endCountry] || 0) + 1;
    });

    const topAttackType = Object.entries(attackTypes)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || "N/A";

    const categoryDataMap = {};
    Object.entries(attackTypes).forEach(([type, count]) => {
      for (const [category, info] of Object.entries(categoryMap)) {
        if (info.attacks.includes(type)) {
          if (!categoryDataMap[category]) {
            categoryDataMap[category] = {
              name: abbreviations[category] || category,
              value: 0,
              color: info.color,
              fullName: category
            };
          }
          categoryDataMap[category].value += count;
          break;
        }
      }
    });

    const categoryData = Object.values(categoryDataMap);
    const countryData = Object.entries(countryCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([country, count]) => ({ name: country, value: count }));

    const timelineData = Array.from({ length: 10 }, (_, i) => ({
      time: `${9 - i}m`,
      attacks: Math.floor(Math.random() * 20) + 5
    }));

    return {
      totalAttacks,
      uniqueCountries: countries.size,
      topAttackType,
      averagePerMinute: Math.round(totalAttacks / 10),
      categoryData,
      countryData,
      timelineData
    };
  }, [attacks]);

  const StatCard = ({ icon: Icon, title, value, color = "text-cyan-400" }) => (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 hover:border-cyan-500/50 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className={`text-2xl font-bold ${color} mt-1`}>{value}</p>
        </div>
        <Icon className={`w-8 h-8 ${color} opacity-60`} />
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col text-white p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
          <Activity className="w-6 h-6" />
          Estadísticas en Tiempo Real
        </h2>
      </div>

      <div className="flex space-x-2 mb-4">
        {[
          { id: "overview", label: "Resumen", icon: Shield },
          { id: "categories", label: "Categorías", icon: AlertTriangle },
          { id: "timeline", label: "Timeline", icon: TrendingUp }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === id
                ? "bg-cyan-500 text-white"
                : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === "overview" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <StatCard
                icon={Zap}
                title="Ataques Totales"
                value={stats.totalAttacks.toLocaleString()}
                color="text-red-400"
              />
              <StatCard
                icon={Globe}
                title="Países Afectados"
                value={stats.uniqueCountries}
                color="text-blue-400"
              />
              <StatCard
                icon={Clock}
                title="Promedio/min"
                value={stats.averagePerMinute}
                color="text-yellow-400"
              />
              <StatCard
                icon={AlertTriangle}
                title="Ataque Principal"
                value={stats.topAttackType}
                color="text-purple-400"
              />
            </div>

            {stats.countryData.length > 0 && (
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-cyan-400 mb-3">Países Más Atacados</h3>
                <div className="space-y-2">
                  {stats.countryData.map((country, index) => (
                    <div key={country.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          index === 0 ? "bg-red-400" :
                          index === 1 ? "bg-orange-400" :
                          index === 2 ? "bg-yellow-400" : "bg-gray-400"
                        }`} />
                        <span className="text-sm font-medium">{country.name}</span>
                      </div>
                      <span className="text-cyan-400 font-bold">{country.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "categories" && (
          <div className="space-y-4">
            {stats.categoryData.length > 0 ? (
              <>
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-cyan-400 mb-3">Distribución por Categorías</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={stats.categoryData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        innerRadius={30}
                      >
                        {stats.categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-cyan-400 mb-3">Ataques por Categoría</h3>
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={stats.categoryData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                      <YAxis stroke="#9CA3AF" fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="value">
                        {stats.categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            ) : (
              <p className="text-gray-400 text-center py-8">No hay datos de categorías disponibles</p>
            )}
          </div>
        )}

        {activeTab === "timeline" && (
          <div className="space-y-4">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-cyan-400 mb-3">Actividad Reciente</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={stats.timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="attacks" 
                    stroke="#06D6A0" 
                    strokeWidth={2}
                    dot={{ fill: "#06D6A0", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttackStats;