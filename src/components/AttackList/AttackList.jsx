import React, { useEffect, useState } from "react";

const AttackList = ({ filteredAttacks, filterCountry }) => {
  const [visibleAttacks, setVisibleAttacks] = useState([]);

  useEffect(() => {
    const uniqueAttacks = [];
    const seenIds = new Set();

    // Solo mantener los últimos 3 ataques únicos
    for (let i = filteredAttacks.length - 1; i >= 0 && uniqueAttacks.length < 3; i--) {
      const attack = filteredAttacks[i];
      if (!seenIds.has(attack.id)) {
        uniqueAttacks.push(attack);
        seenIds.add(attack.id);
      }
    }

    setVisibleAttacks(uniqueAttacks.reverse());
  }, [filteredAttacks]);

  const formatTime = (time) => {
    if (!time) return "";
    const date = new Date(time);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3 border-b border-gray-600 pb-1 text-yellow-400">
        Ataques {filterCountry ? `en ${filterCountry}` : "globales"}
      </h2>
      
      {/* Solo mostrar 3 ataques, sin scroll */}
      <div className="space-y-4 text-sm">
        {visibleAttacks.length === 0 ? (
          <p className="text-gray-400 italic">No hay ataques activos.</p>
        ) : (
          visibleAttacks.map((attack) => (
            <div
              key={attack.id}
              className="border-b border-gray-600 pb-3 opacity-100 flex flex-col transition-all duration-300 hover:bg-gray-800/30 p-2 rounded"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-full animate-pulse"
                  style={{ backgroundColor: attack.color || "#888" }}
                  title={`Color: ${attack.color || "Desconocido"}`}
                ></div>

                <span className="font-semibold text-white">
                  {attack.classification || "Tipo desconocido"}
                </span>
              </div>

              <div className="text-yellow-400 text-xs mt-1">
                {attack.startCountry} &rarr; {attack.endCountry}
              </div>

              <div className="text-gray-400 text-xs mt-0.5">
                {formatTime(attack.time)}
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Indicador si hay más ataques */}
      {filteredAttacks.length > 3 && (
        <div className="mt-3 text-center">
          <span className="text-xs text-gray-500">
            +{filteredAttacks.length - 3} ataques más
          </span>
        </div>
      )}
    </div>
  );
};

export default AttackList;