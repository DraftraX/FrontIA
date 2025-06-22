import React from "react";
import { Globe2 } from "lucide-react";
import "./AttackFilter.css";

const CountryFilter = ({ countries, filterCountry, setFilterCountry }) => {
  return (
    <div className="p-5 bg-white/5 border border-cyan-500/20 rounded-xl shadow-[0_0_12px_#00ffff33] backdrop-blur-md text-white relative z-50">
      <label
        htmlFor="country-select"
        className="flex items-center gap-2 mb-3 text-sm sm:text-base font-semibold tracking-widest text-cyan-400 uppercase"
      >
        <Globe2 className="w-5 h-5" />
        Filtrar por país
      </label>
      <div className="relative">
        <select
          id="country-select"
          className="w-full bg-black/30 text-white text-sm px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-black/50 transition-all appearance-none pr-8"
          value={filterCountry || ""}
          onChange={(e) => setFilterCountry(e.target.value)}
        >
          <option value="">Todos los países</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-cyan-400">
          ▼
        </div>
      </div>
    </div>
  );
};

export default CountryFilter;