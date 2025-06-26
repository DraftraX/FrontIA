// components/ThreatMapGlobe.jsx
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
} from "react-simple-maps";

const geoUrl =
  "https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/countries.geojson";

export default function MapAttack({ attacks, connections }) {
  const getTypeColor = (type) => {
    switch (type) {
      case "ATTACK":
        return "#ff4444";
      case "INFECTION":
        return "#ff8c00";
      case "SPAM":
        return "#ffffff";
      default:
        return "#ffffff";
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ rotate: [0, 0, 0], scale: 130, center: [0, 30] }}
        style={{ width: "100%", height: "100%" }}
      >
        <defs>
          <linearGradient
            id="connectionGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#ff4444" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#ff8c00" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#1a1a1a"
                stroke="#444444"
                strokeWidth={0.5}
                style={{
                  default: { outline: "none" },
                  hover: { fill: "#2a2a2a", outline: "none" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>

        {connections.map((conn) => (
          <Line
            key={conn.id}
            from={conn.from}
            to={conn.to}
            stroke="url(#connectionGradient)"
            strokeWidth={1}
            strokeOpacity={0.6}
            style={{ pointerEvents: "none" }}
          />
        ))}

        {attacks.map((atk) => (
          <Marker
            key={atk.id}
            coordinates={atk.source.coordinates}
            style={{ default: { pointerEvents: "none" } }}
          >
            <circle
              r={3}
              fill={getTypeColor(atk.type)}
              stroke="#000"
              strokeWidth={0.5}
              opacity={0.9}
            />
            <circle
              r={6}
              fill="none"
              stroke={getTypeColor(atk.type)}
              strokeWidth={1}
              opacity={0.5}
            >
              <animate
                attributeName="r"
                values="6;12;6"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.5;0;0.5"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
}
