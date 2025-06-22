export const unsmData = {
  commonPorts: [
    { port: 22, service: "SSH", attempts: 145, risk: "Medium" },
    { port: 80, service: "HTTP", attempts: 89, risk: "Low" },
    { port: 443, service: "HTTPS", attempts: 67, risk: "Low" },
    { port: 21, service: "FTP", attempts: 43, risk: "High" },
    { port: 23, service: "Telnet", attempts: 38, risk: "High" },
    { port: 3389, service: "RDP", attempts: 56, risk: "High" },
    { port: 25, service: "SMTP", attempts: 29, risk: "Medium" },
    { port: 53, service: "DNS", attempts: 34, risk: "Medium" },
    { port: 110, service: "POP3", attempts: 21, risk: "Medium" },
    { port: 143, service: "IMAP", attempts: 18, risk: "Low" }
  ],

  unsmBuildings: [
    { name: "Facultad de Ingeniería", scans: 67, alerts: 12, status: "warning" },
    { name: "Biblioteca Central", scans: 34, alerts: 3, status: "safe" },
    { name: "Centro de Cómputo", scans: 89, alerts: 23, status: "critical" },
    { name: "Administración", scans: 45, alerts: 8, status: "warning" },
    { name: "Laboratorios", scans: 56, alerts: 15, status: "warning" },
    { name: "Aulas Virtuales", scans: 23, alerts: 2, status: "safe" }
  ],

  timelineData: Array.from({ length: 24 }, (_, i) => ({
    hour: `${i.toString().padStart(2, '0')}:00`,
    portScans: Math.floor(Math.random() * 30) + 5,
    alerts: Math.floor(Math.random() * 8),
    blocked: Math.floor(Math.random() * 15) + 2
  })),

  scanTypes: [
    { type: "TCP SYN Scan", count: 156, percentage: 45, color: "#ef4444" },
    { type: "UDP Scan", count: 89, percentage: 26, color: "#f97316" },
    { type: "TCP Connect", count: 67, percentage: 19, color: "#eab308" },
    { type: "Stealth Scan", count: 34, percentage: 10, color: "#8b5cf6" }
  ],

  get totalScans() {
    return this.commonPorts.reduce((sum, port) => sum + port.attempts, 0);
  },

  get totalBuildings() {
    return this.unsmBuildings.length;
  },

  get activeAlerts() {
    return this.unsmBuildings.reduce((sum, building) => sum + building.alerts, 0);
  }
};