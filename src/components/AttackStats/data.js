export const categoryMap = {
  "Reconocimiento": {
    attacks: ["Port Scan", "Network Scan"],
    color: "rgb(96,165,250)", // azul claro
  },
  "Denegación de Servicio": {
    attacks: ["DoS", "DDoS"],
    color: "rgb(239,68,68)", // rojo
  },
  "Malware": {
    attacks: ["Troyano", "Ransomware", "Spyware"],
    color: "rgb(192,132,252)", // morado claro
  },
  "Ingeniería Social": {
    attacks: ["Phishing", "Spear Phishing", "Vishing"],
    color: "rgb(234,179,8)", // amarillo
  },
  "Intercepción": {
    attacks: ["Man in the Middle", "ARP Spoofing"],
    color: "rgb(244,114,182)", // rosa
  },
  "Explotación de Vulnerabilidades": {
    attacks: ["Exploit", "Zero-Day"],
    color: "rgb(251,146,60)", // naranja
  },
  "Ataques Web": {
    attacks: ["SQL Injection", "XSS", "CSRF"],
    color: "rgb(74,222,128)", // verde
  },
  "Brute Force": {
    attacks: ["Password Cracking", "Credential Stuffing"],
    color: "rgb(107,114,128)", // gris oscuro
  },
  "Insider Threat": {
    attacks: ["Data Exfiltration", "Sabotage"],
    color: "rgb(156,163,175)", // gris claro
  },
};

export const abbreviations = {
  "Reconocimiento": "RCE",
  "Denegación de Servicio": "DoS",
  "Malware": "MAL",
  "Ingeniería Social": "IS",
  "Intercepción": "MITM",
  "Explotación de Vulnerabilidades": "EXPLOIT",
  "Ataques Web": "WEB",
  "Brute Force": "BF",
  "Insider Threat": "INSIDER",
};