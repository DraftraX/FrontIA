import React, { useState, useEffect } from 'react';
import { Map, MapPin, AlertTriangle, Shield, Activity } from 'lucide-react';

const SanMartinRealMap = ({ dynamicData }) => {
  const [currentAlerts, setCurrentAlerts] = useState(3);
  const [coverage, setCoverage] = useState(96.8);

  // Actualizar datos dinámicamente
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAlerts(Math.floor(Math.random() * 8) + 1);
      setCoverage(95 + Math.random() * 4); // Entre 95-99%
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Ubicaciones importantes en San Martín
  const locations = [
    {
      name: "UNSM - Tarapoto",
      position: { top: "45%", left: "60%" },
      type: "university",
      alerts: dynamicData?.activeAlerts || currentAlerts,
      status: "active",
      description: "Universidad Nacional de San Martín - Centro NIDS"
    },
    {
      name: "Moyobamba", 
      position: { top: "20%", left: "40%" },
      type: "city",
      alerts: Math.floor(Math.random() * 3) + 1,
      status: "warning"
    },
    {
      name: "Rioja",
      position: { top: "15%", left: "25%" },
      type: "city",
      alerts: Math.floor(Math.random() * 2),
      status: "safe"
    },
    {
      name: "Lamas",
      position: { top: "40%", left: "45%" },
      type: "city",
      alerts: Math.floor(Math.random() * 4) + 1,
      status: "warning"
    },
    {
      name: "Picota",
      position: { top: "55%", left: "55%" },
      type: "city",
      alerts: Math.floor(Math.random() * 5) + 2,
      status: "critical"
    },
    {
      name: "Bellavista",
      position: { top: "65%", left: "65%" },
      type: "city",
      alerts: Math.floor(Math.random() * 3),
      status: "warning"
    },
    {
      name: "Tocache",
      position: { top: "85%", left: "45%" },
      type: "city",
      alerts: Math.floor(Math.random() * 2),
      status: "safe"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "critical": return "#ef4444";
      case "warning": return "#f59e0b";
      case "safe": return "#10b981";
      case "active": return "#06d6a0";
      default: return "#6b7280";
    }
  };

  const getMarkerIcon = (type, status) => {
    if (type === "university") {
      return (
        <div className="relative">
          <div 
            className="w-6 h-6 rounded-full border-2 border-white animate-pulse"
            style={{ backgroundColor: "#ef4444" }}
          />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
        </div>
      );
    }
    
    return (
      <div 
        className="w-4 h-4 rounded-full border-2 border-white"
        style={{ backgroundColor: getStatusColor(status) }}
      />
    );
  };

  return (
    <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Map className="w-5 h-5 text-cyan-400" />
        Región San Martín - Mapa Interactivo
        <span className="text-xs bg-green-600 px-2 py-1 rounded-full">LIVE</span>
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mapa embebido de Google Maps */}
        <div className="relative">
          <div className="relative h-96 rounded-lg overflow-hidden border-2 border-gray-600">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d508627.8971339498!2d-77.0428!3d-6.4889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91b1b0d89a67a5b7%3A0x7f0b9b8a9e8a1234!2sTarapoto%2C%20Peru!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus&zoom=8"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de San Martín"
            />
            
            {/* Overlay con marcadores personalizados */}
            <div className="absolute inset-0 pointer-events-none">
              {locations.map((location, index) => (
                <div
                  key={index}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto group"
                  style={{
                    top: location.position.top,
                    left: location.position.left
                  }}
                >
                  {getMarkerIcon(location.type, location.status)}
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    <div className="font-semibold">{location.name}</div>
                    <div>{location.alerts} alertas activas</div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Círculos de cobertura */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Cobertura principal (30km) */}
              <div 
                className="absolute border-2 border-green-400 border-dashed rounded-full opacity-60 animate-pulse"
                style={{
                  top: "35%",
                  left: "50%",
                  width: "30%",
                  height: "40%",
                  transform: "translate(-50%, -50%)"
                }}
              />
              
              {/* Cobertura extendida (50km) */}
              <div 
                className="absolute border-2 border-yellow-400 border-dashed rounded-full opacity-40"
                style={{
                  top: "35%", 
                  left: "50%",
                  width: "50%",
                  height: "60%",
                  transform: "translate(-50%, -50%)"
                }}
              />
            </div>
          </div>
          
          {/* Controles del mapa */}
          <div className="absolute top-4 right-4 bg-black/80 rounded-lg p-2 space-y-2">
            <button className="block w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm">+</button>
            <button className="block w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm">-</button>
          </div>
        </div>
        
        {/* Panel de información */}
        <div className="space-y-4">
          {/* Estadísticas principales */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-800/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-cyan-400">{locations.length}</div>
              <div className="text-xs text-gray-400">Ciudades</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-400">{coverage.toFixed(1)}%</div>
              <div className="text-xs text-gray-400">Cobertura</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-yellow-400">24/7</div>
              <div className="text-xs text-gray-400">Monitoreo</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-red-400">{currentAlerts}</div>
              <div className="text-xs text-gray-400">Alertas</div>
            </div>
          </div>
          
          {/* Lista de ubicaciones */}
          <div className="bg-gray-800/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-cyan-400 mb-3">Ubicaciones Monitoreadas</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {locations.map((location, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-700/30 rounded">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getStatusColor(location.status) }}
                    />
                    <span className="text-sm font-medium">{location.name}</span>
                    {location.type === "university" && (
                      <span className="text-xs bg-cyan-600 px-1 py-0.5 rounded">HQ</span>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-yellow-400">{location.alerts}</div>
                    <div className="text-xs text-gray-400">alertas</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Estados de seguridad */}
          <div className="bg-gray-800/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-cyan-400 mb-3">Estado de Seguridad</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full" />
                  <span className="text-sm">Zonas Seguras</span>
                </div>
                <span className="text-green-400 font-bold">
                  {locations.filter(l => l.status === "safe").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                  <span className="text-sm">En Alerta</span>
                </div>
                <span className="text-yellow-400 font-bold">
                  {locations.filter(l => l.status === "warning").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full" />
                  <span className="text-sm">Críticas</span>
                </div>
                <span className="text-red-400 font-bold">
                  {locations.filter(l => l.status === "critical").length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Leyenda */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
          <span className="text-gray-300">UNSM Campus</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-400 rounded-full" />
          <span className="text-gray-300">Ciudades</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-1 border border-green-400 border-dashed" />
          <span className="text-gray-300">Cobertura 30km</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-1 border border-yellow-400 border-dashed" />
          <span className="text-gray-300">Cobertura 50km</span>
        </div>
      </div>
      
      {/* Información técnica */}
      <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
        <div className="flex items-center gap-2 text-blue-400 text-sm font-semibold mb-1">
          <Shield className="w-4 h-4" />
          Centro de Control NIDS
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-300">
          <div>
            <strong>Ubicación:</strong> UNSM, Tarapoto, San Martín<br/>
            <strong>Coordenadas:</strong> 6°29'20"S 76°21'43"W<br/>
            <strong>Altitud:</strong> 356 msnm
          </div>
          <div>
            <strong>Protocolo:</strong> NIDS v2.1 | <strong>Estado:</strong> Activo<br/>
            <strong>Última sync:</strong> {new Date().toLocaleTimeString()}<br/>
            <strong>Uptime:</strong> 99.7% | <strong>Ping:</strong> 12ms
          </div>
        </div>
      </div>
    </div>
  );
};

export default SanMartinRealMap;