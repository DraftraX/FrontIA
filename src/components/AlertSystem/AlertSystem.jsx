import React, { useState, useEffect } from "react";
import { 
  AlertTriangle, 
  Shield, 
  X, 
  Volume2, 
  VolumeX,
  Bell,
  Clock,
  MapPin
} from "lucide-react";

const AlertSystem = ({ attacks }) => {
  const [alerts, setAlerts] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showAlerts, setShowAlerts] = useState(true);

  const criticalAttacks = ["Zero-Day", "Ransomware", "DDoS", "SQL Injection"];
  
  useEffect(() => {
    if (!attacks || attacks.length === 0) return;

    const latestAttack = attacks[attacks.length - 1];
    
    if (criticalAttacks.includes(latestAttack.classification)) {
      const newAlert = {
        id: `alert-${Date.now()}`,
        type: "critical",
        title: "¡ATAQUE CRÍTICO DETECTADO!",
        message: `${latestAttack.classification} detectado desde ${latestAttack.startCountry} hacia ${latestAttack.endCountry}`,
        timestamp: new Date(),
        attack: latestAttack,
        severity: "high"
      };

      setAlerts(prev => [newAlert, ...prev.slice(0, 2)]); // Solo mantener 3 alertas máximo

      if (soundEnabled) {
        playAlertSound();
      }
    }
  }, [attacks, soundEnabled]);

  const playAlertSound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  const dismissAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high": return "border-red-500 bg-red-500/10";
      case "medium": return "border-yellow-500 bg-yellow-500/10";
      case "low": return "border-blue-500 bg-blue-500/10";
      default: return "border-gray-500 bg-gray-500/10";
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "high": return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case "medium": return <Shield className="w-5 h-5 text-yellow-400" />;
      case "low": return <Bell className="w-5 h-5 text-blue-400" />;
      default: return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  if (!showAlerts) {
    return (
      <button
        onClick={() => setShowAlerts(true)}
        className="fixed top-20 right-4 z-50 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 animate-pulse"
      >
        <Bell className="w-6 h-6" />
        {alerts.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {alerts.length}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed top-20 right-4 z-50 w-96 space-y-2">
      <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-cyan-400" />
          <span className="text-white font-semibold">Sistema de Alertas</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg transition-all ${
              soundEnabled 
                ? "bg-green-600 hover:bg-green-700 text-white" 
                : "bg-gray-600 hover:bg-gray-700 text-gray-300"
            }`}
            title={soundEnabled ? "Desactivar sonido" : "Activar sonido"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setShowAlerts(false)}
            className="p-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-gray-300 transition-all"
            title="Minimizar alertas"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Solo mostrar máximo 3 alertas, sin scroll */}
      <div className="space-y-2">
        {alerts.length === 0 ? (
          <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg p-4 text-center">
            <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-green-400 font-semibold">Sistema Seguro</p>
            <p className="text-gray-400 text-sm">No hay alertas críticas</p>
          </div>
        ) : (
          alerts.slice(0, 3).map((alert) => (
            <div
              key={alert.id}
              className={`bg-gray-900/95 backdrop-blur-sm border-2 rounded-lg p-4 transition-all duration-300 hover:scale-105 ${getSeverityColor(alert.severity)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {getSeverityIcon(alert.severity)}
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-sm mb-1">
                      {alert.title}
                    </h4>
                    <p className="text-gray-300 text-xs mb-2">
                      {alert.message}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(alert.timestamp)}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {alert.attack.startCountry} → {alert.attack.endCountry}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-700">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Tipo de ataque:</span>
                  <span 
                    className="px-2 py-1 rounded-full text-white font-semibold"
                    style={{ backgroundColor: alert.attack.color }}
                  >
                    {alert.attack.classification}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {alerts.length > 0 && (
        <div className="bg-red-600/90 backdrop-blur-sm border border-red-500 rounded-lg p-3 animate-pulse">
          <div className="flex items-center justify-center gap-2">
            <AlertTriangle className="w-5 h-5 text-white" />
            <span className="text-white font-bold text-sm">
              {alerts.length} ALERTA{alerts.length > 1 ? 'S' : ''} CRÍTICA{alerts.length > 1 ? 'S' : ''} ACTIVA{alerts.length > 1 ? 'S' : ''}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertSystem;