import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
countries.registerLocale(enLocale);

export default function Panel({ attacks, countryStats }) {
  const getFlagURL = (countryName) => {
    const code = countries.getAlpha2Code(countryName, "en");
    return code ? `https://flagcdn.com/w40/${code.toLowerCase()}.png` : null;
  };

  return (
    <div className="absolute bottom-8 left-8 right-8 z-10 bg-gray-900 bg-opacity-20 border border-gray-700 rounded-lg grid grid-cols-[1fr_2fr_1fr] text-xs backdrop-blur-sm">
      {/* LEGEND */}
      <div className="p-4 border-r border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-bold">LEGEND</h3>
          <span className="text-gray-400">▼</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded border border-red-500 bg-red-500 bg-opacity-20 flex items-center justify-center">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
            <span className="text-white">ATTACKS</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded border border-orange-500 bg-orange-500 bg-opacity-20 flex items-center justify-center">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            </div>
            <span className="text-white">INFECTIONS</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded border border-white bg-white bg-opacity-20 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span className="text-white">SPAM</span>
          </div>
        </div>
      </div>

      {/* LIVE ATTACKS */}
      <div className="p-4 border-r border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-bold">LIVE ATTACKS</h3>
          <span className="text-gray-400">▼</span>
        </div>
        <div className="space-y-1">
          <div className="grid grid-cols-5 gap-2 text-gray-400 text-xs pb-1 border-b border-gray-700">
            <span>TIME</span>
            <span>MALWARE</span>
            <span>TYPE</span>
            <span>FROM</span>
            <span>TO</span>
          </div>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {[...attacks]
              .slice(-6)
              .reverse()
              .map((atk) => (
                <div key={atk.id} className="grid grid-cols-5 gap-2 text-xs">
                  <span className="text-gray-300 truncate">{atk.time}</span>
                  <span className="text-gray-300 truncate">{atk.malware}</span>
                  <span
                    className={`font-bold truncate ${
                      atk.type === "ATTACK"
                        ? "text-red-400"
                        : atk.type === "INFECTION"
                        ? "text-orange-400"
                        : "text-white"
                    }`}
                  >
                    {atk.type}
                  </span>
                  <span className="text-gray-300 truncate">
                    {atk.sourceCountry}
                  </span>
                  <span className="text-gray-300 truncate">
                    {atk.targetCountry}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* TOP LOCATIONS */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-bold">TOP LOCATIONS</h3>
          <span className="text-gray-400">▼</span>
        </div>
        <div className="space-y-1">
          {Object.entries(countryStats)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 6)
            .map(([country, count]) => {
              const flagURL = getFlagURL(country);
              return (
                <div key={country} className="flex items-center gap-2">
                  {flagURL ? (
                    <img
                      src={flagURL}
                      alt={country}
                      className="w-5 h-3 object-cover border border-gray-600 rounded-sm"
                    />
                  ) : (
                    <div className="w-5 h-3 bg-gray-700 border border-gray-600 rounded-sm" />
                  )}
                  <span className="text-white text-xs flex-1 truncate">
                    {country}
                  </span>
                  <span className="text-gray-400 text-xs">{count}</span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
