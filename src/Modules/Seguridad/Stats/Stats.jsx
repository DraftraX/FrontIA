import React, { useState, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  MapPin,
  Shield,
  AlertTriangle,
  Activity,
  Server,
  Network,
  Eye,
  TrendingUp,
  Clock,
  Wifi,
  Database,
  Zap,
  Globe,
  Map,
  Home
} from "lucide-react";
import SanMartinRealMap from './SanMartinRealMap';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";

export default function Stats() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("map");
  const [dynamicData, setDynamicData] = useState({});

  // Datos base que cambiarán dinámicamente
  const [baseData, setBaseData] = useState({
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
    scanTypes: [
      { type: "TCP SYN Scan", count: 156, percentage: 45, color: "#ef4444" },
      { type: "UDP Scan", count: 89, percentage: 26, color: "#f97316" },
      { type: "TCP Connect", count: 67, percentage: 19, color: "#eab308" },
      { type: "Stealth Scan", count: 34, percentage: 10, color: "#8b5cf6" }
    ]
  });

  // Actualizar datos dinámicamente cada 5 segundos
  useEffect(() => {
    const updateDynamicData = () => {
      setBaseData(prev => ({
        ...prev,
        commonPorts: prev.commonPorts.map(port => ({
          ...port,
          attempts: port.attempts + Math.floor(Math.random() * 10) - 5
        })),
        unsmBuildings: prev.unsmBuildings.map(building => ({
          ...building,
          scans: Math.max(1, building.scans + Math.floor(Math.random() * 20) - 10),
          alerts: Math.max(0, building.alerts + Math.floor(Math.random() * 6) - 3)
        })),
        scanTypes: prev.scanTypes.map(scan => ({
          ...scan,
          count: Math.max(10, scan.count + Math.floor(Math.random() * 40) - 20)
        }))
      }));
    };

    updateDynamicData();
    const interval = setInterval(updateDynamicData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Actualizar percentajes de scan types
  useEffect(() => {
    const totalScans = baseData.scanTypes.reduce((sum, scan) => sum + scan.count, 0);
    setBaseData(prev => ({
      ...prev,
      scanTypes: prev.scanTypes.map(scan => ({
        ...scan,
        percentage: Math.round((scan.count / totalScans) * 100)
      }))
    }));
  }, [baseData.scanTypes.map(s => s.count).join(',')]);

  // Timeline data dinámico
  const timelineData = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => ({
      hour: `${i.toString().padStart(2, '0')}:00`,
      portScans: Math.floor(Math.random() * 30) + 5,
      alerts: Math.floor(Math.random() * 8),
      blocked: Math.floor(Math.random() * 15) + 2
    }));
  }, [currentTime.getMinutes()]);

  // Estadísticas calculadas
  const unsmData = useMemo(() => ({
    ...baseData,
    timelineData,
    get totalScans() {
      return this.commonPorts.reduce((sum, port) => sum + port.attempts, 0);
    },
    get totalBuildings() {
      return this.unsmBuildings.length;
    },
    get activeAlerts() {
      return this.unsmBuildings.reduce((sum, building) => sum + building.alerts, 0);
    }
  }), [baseData, timelineData]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const goToHome = () => {
    window.location.href = '/home';
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = "text-cyan-400", trend }) => (
    <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Icon className={`w-6 h-6 ${color}`} />
            <h3 className="text-gray-300 font-medium">{title}</h3>
          </div>
          <p className={`text-3xl font-bold ${color} mb-1`}>{value}</p>
          {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
        </div>
        {trend && (
          <div className="text-right">
            <div className={`flex items-center gap-1 text-sm ${trend > 0 ? 'text-red-400' : 'text-green-400'}`}>
              <TrendingUp className={`w-4 h-4 ${trend < 0 ? 'rotate-180' : ''}`} />
              <span>{Math.abs(trend)}%</span>
            </div>
            <p className="text-xs text-gray-500">vs. ayer</p>
          </div>
        )}
      </div>
    </div>
  );

  const getRiskColor = (risk) => {
    switch (risk) {
      case "High": return "text-red-400 bg-red-400/10";
      case "Medium": return "text-yellow-400 bg-yellow-400/10";
      case "Low": return "text-green-400 bg-green-400/10";
      default: return "text-gray-400 bg-gray-400/10";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "critical": return "bg-red-500";
      case "warning": return "bg-yellow-500";
      case "safe": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  // Mapa preciso de San Martín basado en la imagen real
  const SanMartinMap = () => (
    <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Map className="w-5 h-5 text-cyan-400" />
        Región San Martín - Monitoreo Provincial
      </h2>
      
      <div className="relative">
        <svg viewBox="0 0 500 600" className="w-full h-96 bg-gradient-to-b from-blue-950/30 to-green-950/20 rounded-lg border border-cyan-500/30">
          <defs>
            <linearGradient id="riojaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#16a34a', stopOpacity: 0.8 }} />
              <stop offset="100%" style={{ stopColor: '#15803d', stopOpacity: 0.6 }} />
            </linearGradient>
            <linearGradient id="moyobambaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#ea580c', stopOpacity: 0.8 }} />
              <stop offset="100%" style={{ stopColor: '#c2410c', stopOpacity: 0.6 }} />
            </linearGradient>
            <linearGradient id="lamasGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#7c3aed', stopOpacity: 0.8 }} />
              <stop offset="100%" style={{ stopColor: '#5b21b6', stopOpacity: 0.6 }} />
            </linearGradient>
            <linearGradient id="sanmartinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#1e40af', stopOpacity: 0.8 }} />
              <stop offset="100%" style={{ stopColor: '#1e3a8a', stopOpacity: 0.6 }} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Rioja - Verde (noroeste) */}
          <path
            d="M30 60 Q50 40 80 50 L120 45 Q140 55 130 80 L120 100 Q100 120 80 110 L50 105 Q30 90 30 60 Z"
            fill="url(#riojaGrad)"
            stroke="#16a34a"
            strokeWidth="1"
            className="hover:fill-green-500/40 transition-all duration-300"
          />
          <text x="75" y="85" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">RIOJA</text>
          
          {/* Moyobamba - Naranja (norte) */}
          <path
            d="M130 45 Q160 30 200 40 L240 35 Q270 45 265 70 L250 95 Q230 110 200 100 L170 95 Q140 85 130 45 Z"
            fill="url(#moyobambaGrad)"
            stroke="#ea580c"
            strokeWidth="1"
            className="hover:fill-orange-500/40 transition-all duration-300"
          />
          <text x="200" y="75" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">MOYOBAMBA</text>
          
          {/* Lamas - Morado (centro-norte) */}
          <path
            d="M140 110 Q180 95 220 105 L260 110 Q290 125 285 155 L270 185 Q250 200 220 190 L180 185 Q150 170 140 110 Z"
            fill="url(#lamasGrad)"
            stroke="#7c3aed"
            strokeWidth="1"
            className="hover:fill-purple-500/40 transition-all duration-300"
          />
          <text x="215" y="150" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">LAMAS</text>
          
          {/* San Martín - Azul oscuro (este) - PROVINCIA PRINCIPAL */}
          <path
            d="M290 70 Q330 55 370 65 L410 70 Q440 85 435 120 L425 160 Q415 200 390 220 L360 240 Q330 250 300 235 L285 200 Q280 165 285 130 L290 95 Z"
            fill="url(#sanmartinGrad)"
            stroke="#1e40af"
            strokeWidth="2"
            className="hover:fill-blue-500/40 transition-all duration-300"
            filter="url(#glow)"
          />
          <text x="365" y="140" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">SAN MARTÍN</text>
          <text x="365" y="155" fill="#06d6a0" fontSize="9" textAnchor="middle">(Tarapoto)</text>
          
          {/* El Dorado - Verde (centro-oeste) */}
          <path
            d="M90 120 Q120 110 150 120 L180 125 Q200 140 190 170 L175 195 Q155 210 125 200 L95 190 Q75 175 90 120 Z"
            fill="#047857"
            stroke="#059669"
            strokeWidth="1"
            className="hover:fill-emerald-600/40 transition-all duration-300"
          />
          <text x="140" y="165" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">EL DORADO</text>
          
          {/* Huallaga - Azul claro (oeste) */}
          <path
            d="M40 130 Q70 115 100 125 L130 130 Q150 145 140 175 L125 205 Q105 220 75 210 L45 200 Q25 185 40 130 Z"
            fill="#0891b2"
            stroke="#0e7490"
            strokeWidth="1"
            className="hover:fill-cyan-500/40 transition-all duration-300"
          />
          <text x="95" y="175" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">HUALLAGA</text>
          
          {/* Mariscal Cáceres - Amarillo/dorado (suroeste) */}
          <path
            d="M50 220 Q80 205 110 215 L140 220 Q160 235 150 265 L135 295 Q115 310 85 300 L55 290 Q35 275 50 220 Z"
            fill="#ca8a04"
            stroke="#a16207"
            strokeWidth="1"
            className="hover:fill-yellow-600/40 transition-all duration-300"
          />
          <text x="100" y="250" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">MARISCAL</text>
          <text x="100" y="265" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">CÁCERES</text>
          
          {/* Picota - Rosado/morado claro (centro-este) */}
          <path
            d="M220 200 Q250 185 280 195 L310 200 Q330 215 320 245 L305 275 Q285 290 255 280 L225 270 Q205 255 220 200 Z"
            fill="#c084fc"
            stroke="#a855f7"
            strokeWidth="1"
            className="hover:fill-purple-400/40 transition-all duration-300"
          />
          <text x="265" y="240" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">PICOTA</text>
          
          {/* Bellavista - Rojo/rosa (sureste) */}
          <path
            d="M330 250 Q360 235 390 245 L420 250 Q440 265 430 295 L415 325 Q395 340 365 330 L335 320 Q315 305 330 250 Z"
            fill="#dc2626"
            stroke="#b91c1c"
            strokeWidth="1"
            className="hover:fill-red-500/40 transition-all duration-300"
          />
          <text x="375" y="290" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">BELLAVISTA</text>
          
          {/* Tocache - Azul (sur) */}
          <path
            d="M160 310 Q190 295 220 305 L250 310 Q280 325 270 355 L255 385 Q235 400 205 390 L175 380 Q155 365 160 310 Z"
            fill="#2563eb"
            stroke="#1d4ed8"
            strokeWidth="1"
            className="hover:fill-blue-500/40 transition-all duration-300"
          />
          <text x="215" y="350" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">TOCACHE</text>
          
          {/* Tarapoto - Ciudad principal */}
          <circle
            cx="365"
            cy="170"
            r="6"
            fill="#ff0000"
            stroke="#ffffff"
            strokeWidth="2"
            filter="url(#glow)"
            className="animate-pulse"
          />
          <text x="375" y="175" fill="#ffffff" fontSize="8" fontWeight="bold">TARAPOTO</text>
          <text x="375" y="185" fill="#06d6a0" fontSize="7">UNSM</text>
          
          {/* Torre NIDS */}
          <g>
            <rect x="362" y="160" width="2" height="8" fill="#06d6a0" />
            <circle cx="363" cy="158" r="1" fill="#06d6a0" />
            <text x="370" y="162" fill="#06d6a0" fontSize="7">NIDS</text>
          </g>
          
          {/* Otras ciudades importantes */}
          <circle cx="200" cy="60" r="3" fill="#fbbf24" />
          <text x="210" y="65" fill="#ffffff" fontSize="8">Moyobamba</text>
          
          <circle cx="75" cy="75" r="3" fill="#fbbf24" />
          <text x="85" y="80" fill="#ffffff" fontSize="8">Rioja</text>
          
          <circle cx="215" cy="135" r="3" fill="#fbbf24" />
          <text x="225" y="140" fill="#ffffff" fontSize="8">Lamas</text>
          
          <circle cx="265" cy="225" r="3" fill="#fbbf24" />
          <text x="275" y="230" fill="#ffffff" fontSize="8">Picota</text>
          
          {/* Cobertura NIDS */}
          <circle cx="365" cy="170" r="40" fill="none" stroke="#06d6a0" strokeWidth="1" strokeDasharray="4,4" opacity="0.6">
            <animate attributeName="r" values="35;45;35" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="365" cy="170" r="70" fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2,2" opacity="0.4">
            <animate attributeName="r" values="65;75;65" dur="6s" repeatCount="indefinite" />
          </circle>
          
          {/* Indicadores de estado por provincia */}
          <g>
            <circle cx="440" cy="100" r="2" fill="#ef4444" className="animate-ping" />
            <text x="445" y="105" fill="#ef4444" fontSize="7">Alerta</text>
          </g>
          
          <g>
            <circle cx="100" cy="150" r="2" fill="#10b981" className="animate-pulse" />
            <text x="105" y="155" fill="#10b981" fontSize="7">Seguro</text>
          </g>
          
          {/* Brújula */}
          <g transform="translate(450, 50)">
            <circle cx="0" cy="0" r="20" fill="none" stroke="#9ca3af" strokeWidth="1" />
            <text x="0" y="-25" fill="#9ca3af" fontSize="10" textAnchor="middle">N</text>
            <text x="25" y="5" fill="#9ca3af" fontSize="10" textAnchor="middle">E</text>
            <text x="0" y="35" fill="#9ca3af" fontSize="10" textAnchor="middle">S</text>
            <text x="-25" y="5" fill="#9ca3af" fontSize="10" textAnchor="middle">W</text>
            <polygon points="0,-15 -3,10 0,5 3,10" fill="#ef4444" />
          </g>
        </svg>
        
        {/* Leyenda del mapa */}
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-gray-300">Tarapoto - UNSM</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span className="text-gray-300">Capitales Provinciales</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-gray-300">Torre NIDS</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 border border-green-400 border-dashed"></div>
              <span className="text-gray-300">Cobertura Principal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 border border-yellow-400 border-dashed"></div>
              <span className="text-gray-300">Cobertura Extendida</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded"></div>
              <span className="text-gray-300">Provincias Monitoreadas</span>
            </div>
          </div>
        </div>
        
        {/* Estadísticas del mapa */}
        <div className="mt-4 grid grid-cols-4 gap-3">
          <div className="text-center p-2 bg-gray-800/50 rounded-lg">
            <div className="text-lg font-bold text-cyan-400">10</div>
            <div className="text-xs text-gray-400">Provincias</div>
          </div>
          <div className="text-center p-2 bg-gray-800/50 rounded-lg">
            <div className="text-lg font-bold text-green-400">{Math.floor(Math.random() * 5) + 95}.{Math.floor(Math.random() * 10)}%</div>
            <div className="text-xs text-gray-400">Cobertura</div>
          </div>
          <div className="text-center p-2 bg-gray-800/50 rounded-lg">
            <div className="text-lg font-bold text-yellow-400">24/7</div>
            <div className="text-xs text-gray-400">Monitoreo</div>
          </div>
          <div className="text-center p-2 bg-gray-800/50 rounded-lg">
            <div className="text-lg font-bold text-red-400">{unsmData.activeAlerts}</div>
            <div className="text-xs text-gray-400">Alertas</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-black/60 backdrop-blur-md border-b border-white/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={goToHome}
              className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-all flex items-center gap-2"
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline">Regresar</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">UNSM Tarapoto - Estadísticas</h1>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>Universidad Nacional de San Martín - Datos en Tiempo Real</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">{currentTime.toLocaleTimeString()}</p>
            <p className="text-sm text-gray-400">{currentTime.toLocaleDateString()}</p>
            <p className="text-xs text-green-400">Actualizándose cada 5s</p>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Eye}
            title="Escaneos de Puertos"
            value={unsmData.totalScans.toLocaleString()}
            subtitle="Últimas 24 horas"
            color="text-red-400"
            trend={15}
          />
          <StatCard
            icon={Server}
            title="Edificios Monitoreados"
            value={unsmData.totalBuildings}
            subtitle="Campus UNSM"
            color="text-blue-400"
          />
          <StatCard
            icon={AlertTriangle}
            title="Alertas Activas"
            value={unsmData.activeAlerts}
            subtitle="Requieren atención"
            color="text-yellow-400"
            trend={-8}
          />
          <StatCard
            icon={Shield}
            title="Estado del Sistema"
            value="ACTIVO"
            subtitle="Monitoreo en tiempo real"
            color="text-green-400"
          />
        </div>

        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {[
            { id: "map", label: "Mapa Regional", icon: Map },
            { id: "ports", label: "Análisis de Puertos", icon: Network },
            { id: "buildings", label: "Estado por Edificio", icon: Server },
            { id: "timeline", label: "Actividad Temporal", icon: Clock },
            { id: "types", label: "Tipos de Escaneo", icon: Activity }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
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

        <div className="space-y-6">
          {activeTab === "map" && (
            <div className="grid grid-cols-1 gap-6">
              <SanMartinRealMap dynamicData={unsmData} />
            </div>
          )}

          {activeTab === "ports" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Network className="w-5 h-5 text-cyan-400" />
                  Puertos Más Escaneados (UNSM)
                  <span className="text-xs bg-green-600 px-2 py-1 rounded-full">LIVE</span>
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left p-2">Puerto</th>
                        <th className="text-left p-2">Servicio</th>
                        <th className="text-left p-2">Intentos</th>
                        <th className="text-left p-2">Riesgo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {unsmData.commonPorts.slice(0, 8).map((port) => (
                        <tr key={port.port} className="border-b border-gray-800 hover:bg-gray-800/50">
                          <td className="p-2 font-mono text-cyan-400">{port.port}</td>
                          <td className="p-2">{port.service}</td>
                          <td className="p-2 font-bold">{port.attempts}</td>
                          <td className="p-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(port.risk)}`}>
                              {port.risk}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Distribución de Escaneos por Puerto</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={unsmData.commonPorts.slice(0, 6)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="port" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip />
                    <Bar dataKey="attempts" fill="#06D6A0" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === "buildings" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Server className="w-5 h-5 text-cyan-400" />
                  Estado por Edificio - UNSM
                  <span className="text-xs bg-green-600 px-2 py-1 rounded-full">LIVE</span>
                </h2>
                <div className="space-y-4">
                  {unsmData.unsmBuildings.map((building, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(building.status)}`}></div>
                        <div>
                          <p className="font-medium">{building.name}</p>
                          <p className="text-sm text-gray-400">{building.scans} escaneos detectados</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-yellow-400">{building.alerts}</p>
                        <p className="text-xs text-gray-400">alertas</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Escaneos por Edificio</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={unsmData.unsmBuildings} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" stroke="#9CA3AF" />
                    <YAxis dataKey="name" type="category" stroke="#9CA3AF" fontSize={12} width={120} />
                    <Tooltip />
                    <Bar dataKey="scans" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                Actividad de Escaneo - Últimas 24 Horas
                <span className="text-xs bg-green-600 px-2 py-1 rounded-full">LIVE</span>
              </h2>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={unsmData.timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="hour" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip />
                  <Area type="monotone" dataKey="portScans" stackId="1" stroke="#06D6A0" fill="#06D6A0" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="alerts" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="blocked" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {activeTab === "types" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  Tipos de Escaneo Detectados
                  <span className="text-xs bg-green-600 px-2 py-1 rounded-full">LIVE</span>
                </h2>
                <div className="space-y-4">
                  {unsmData.scanTypes.map((scan, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{scan.type}</span>
                        <div className="text-right">
                          <span className="font-bold">{scan.count}</span>
                          <span className="text-sm text-gray-400 ml-2">({scan.percentage}%)</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${scan.percentage}%`, 
                            backgroundColor: scan.color 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Distribución de Tipos de Escaneo</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={unsmData.scanTypes}
                      dataKey="count"
                      nameKey="type"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={40}
                    >
                      {unsmData.scanTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}