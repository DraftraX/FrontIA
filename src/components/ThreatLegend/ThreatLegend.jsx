import React from "react";
import { categories, categoryStyles } from "./data";


export default function ThreatLegend() {
  return (
    <div className="w-full bg-black/60 backdrop-blur-md py-4 px-6 flex flex-wrap justify-center gap-4 text-white text-sm border-t border-white/20 shadow-inner z-40">
      {Object.entries(categories).map(([category, attacks]) => (
        <div key={category} className="relative group cursor-default select-none">
          <span
            className={`font-semibold text-xs px-3 py-1 rounded-full transition-all duration-300 shadow-md hover:scale-105 ${categoryStyles[category]}`}
          >
            {category}
          </span>

          {/* Tooltip */}
          <div className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max max-w-xs rounded-md bg-black bg-opacity-90 px-4 py-2 text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 text-left">
            <strong className="block mb-1">{category}</strong>
            <ul className="list-disc pl-4">
              {attacks.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}