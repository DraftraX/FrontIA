// Datos de países
export const countries = [
  "UNITED STATES",
  "GERMANY",
  "UNITED KINGDOM",
  "INDIA",
  "BRAZIL",
  "ITALY",
  "FRANCE",
  "JAPAN",
  "ROMANIA",
  "SERBIA",
  "AUSTRALIA",
  "CANADA",
  "CHINA",
  "RUSSIA",
  "SOUTH KOREA",
];

// Tipos de amenazas
export const threatTypes = ["SPAM", "INFECTION", "ATTACK"];

// Nombres de malware
export const malwareNames = [
  "WIN32.BRONTOR.ND",
  "TROJAN.AGENT.GDYH",
  "TROJAN.VB.NKU",
  "TROJAN.MAC.AGENT.IR",
  "ADWARE.GENERIC",
  "RANSOMWARE.LOCKY",
  "BACKDOOR.AGENT",
  "SPYWARE.KEYLOG",
  "VIRUS.WIN32",
];

// Coordenadas de ciudades por país
export const cityCoordinates = {
  "UNITED STATES": [
    [-74, 40.7], // Nueva York
    [-87.6, 41.9], // Chicago
    [-118.2, 34.1], // Los Ángeles
    [-122.4, 37.8], // San Francisco
  ],
  GERMANY: [
    [13.4, 52.5], // Berlín
    [11.6, 48.1], // Múnich
  ],
  "UNITED KINGDOM": [
    [-0.1, 51.5], // Londres
    [-2.2, 53.5], // Liverpool
  ],
  INDIA: [
    [77.2, 28.6], // Delhi
    [72.8, 19.1], // Mumbai
  ],
  BRAZIL: [
    [-43.2, -22.9], // Río de Janeiro
    [-46.6, -23.5], // São Paulo
  ],
  ITALY: [
    [12.5, 41.9], // Roma
    [9.2, 45.5], // Milán
  ],
  FRANCE: [
    [2.3, 48.9], // París
    [5.4, 43.3], // Marsella
  ],
  JAPAN: [
    [139.7, 35.7], // Tokio
    [135.5, 34.7], // Osaka
  ],
  ROMANIA: [[26.1, 44.4]], // Bucarest
  SERBIA: [[20.5, 44.8]], // Belgrado
  AUSTRALIA: [
    [151.2, -33.9], // Sydney
    [144.9, -37.8], // Melbourne
  ],
  CANADA: [
    [-79.4, 43.7], // Toronto
    [-123.1, 49.3], // Vancouver
  ],
  CHINA: [
    [116.4, 39.9], // Beijing
    [121.5, 31.2], // Shanghai
  ],
  RUSSIA: [
    [37.6, 55.8], // Moscú
    [30.3, 59.9], // San Petersburgo
  ],
  "SOUTH KOREA": [[126.98, 37.57]], // Seúl
};

// Ataques estáticos de ejemplo
export const staticAttacks = [
  {
    id: 1,
    time: new Date().toLocaleString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }),
    type: "ATTACK",
    malware: "RANSOMWARE.LOCKY",
    sourceCountry: "RUSSIA",
    targetCountry: "UNITED STATES",
    source: { coordinates: [37.6, 55.8] },
    target: { coordinates: [-74, 40.7] },
  },
  {
    id: 2,
    time: new Date().toLocaleString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }),
    type: "INFECTION",
    malware: "TROJAN.AGENT.GDYH",
    sourceCountry: "CHINA",
    targetCountry: "GERMANY",
    source: { coordinates: [116.4, 39.9] },
    target: { coordinates: [13.4, 52.5] },
  },
  {
    id: 3,
    time: new Date().toLocaleString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }),
    type: "SPAM",
    malware: "N/A",
    sourceCountry: "UNITED STATES",
    targetCountry: "UNITED KINGDOM",
    source: { coordinates: [-118.2, 34.1] },
    target: { coordinates: [-0.1, 51.5] },
  },
];

// Conexiones estáticas de ejemplo
export const staticConnections = [
  {
    id: 1,
    from: [37.6, 55.8],
    to: [-74, 40.7],
    type: "ATTACK",
    timestamp: Date.now(),
  },
  {
    id: 2,
    from: [116.4, 39.9],
    to: [13.4, 52.5],
    type: "INFECTION",
    timestamp: Date.now(),
  },
  {
    id: 3,
    from: [-118.2, 34.1],
    to: [-0.1, 51.5],
    type: "SPAM",
    timestamp: Date.now(),
  },
];

// Estadísticas de países estáticas
export const staticCountryStats = {
  "RUSSIA": 5,
  "CHINA": 3,
  "UNITED STATES": 2,
  "GERMANY": 2,
  "UNITED KINGDOM": 1,
};
