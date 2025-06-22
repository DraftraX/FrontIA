// Categorías con ataques y colores
export const categoryMap = {
  "Reconocimiento": {
    attacks: ["Port Scan", "Network Scan"],
    color: "rgb(96,165,250)",
  },
  "Denegación de Servicio": {
    attacks: ["DoS", "DDoS"],
    color: "rgb(239,68,68)",
  },
  "Malware": {
    attacks: ["Troyano", "Ransomware", "Spyware"],
    color: "rgb(192,132,252)",
  },
  "Ingeniería Social": {
    attacks: ["Phishing", "Spear Phishing", "Vishing"],
    color: "rgb(234,179,8)",
  },
  "Intercepción": {
    attacks: ["Man in the Middle", "ARP Spoofing"],
    color: "rgb(244,114,182)",
  },
  "Explotación de Vulnerabilidades": {
    attacks: ["Exploit", "Zero-Day"],
    color: "rgb(251,146,60)",
  },
  "Ataques Web": {
    attacks: ["SQL Injection", "XSS", "CSRF"],
    color: "rgb(74,222,128)",
  },
  "Brute Force": {
    attacks: ["Password Cracking", "Credential Stuffing"],
    color: "rgb(107,114,128)",
  },
  "Insider Threat": {
    attacks: ["Data Exfiltration", "Sabotage"],
    color: "rgb(156,163,175)",
  },
};

// Extraemos todos los tipos de ataque para uso general
export const allAttackTypes = Object.values(categoryMap).flatMap(c => c.attacks);

// Coordenadas para ataques falsos (sin cambios)
export const fakeCoords = [
  { lat: 34.0522, lng: -118.2437, country: "USA" },
  { lat: 35.6895, lng: 139.6917, country: "Japan" },
  { lat: 48.8566, lng: 2.3522, country: "France" },
  { lat: 55.7558, lng: 37.6173, country: "Russia" },
  { lat: -33.8688, lng: 151.2093, country: "Australia" },
  { lat: 40.7128, lng: -74.0060, country: "USA" },
  { lat: -12.0464, lng: -77.0428, country: "Peru" },
];