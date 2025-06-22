import { useState, useEffect } from "react";
import { 
  Menu, 
  X, 
  Settings, 
  Download, 
  Maximize2, 
  Minimize2,
  Shield,
  Activity
} from "lucide-react";
import LiveCyberAttack from "../../../components/LiveCyberAttack/LiveCyberAttack";
import AttackList from "../../../components/AttackList/AttackList";
import CountryFilter from "../../../components/AttackList/CountryFilter";
import ThreatLegend from "../../../components/ThreatLegend/ThreatLegend";
import AlertSystem from "../../../components/AlertSystem/AlertSystem";
import { countries } from "./data";

export default function Home() {
  const [attacks, setAttacks] = useState([]);
  const [filterCountry, setFilterCountry] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredAttacks = !filterCountry || filterCountry === ""
    ? attacks
    : attacks.filter(
        (a) => a.startCountry === filterCountry || a.endCountry === filterCountry
      );

  const toggleFullscreen = () => {
    if (!fullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setFullscreen(!fullscreen);
  };

  const exportData = () => {
    const data = {
      timestamp: new Date().toISOString(),
      totalAttacks: filteredAttacks.length,
      attacks: filteredAttacks,
      filterCountry
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nids-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const goToStats = () => {
    window.location.href = '/stats';
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-900">
      <div className="absolute inset-0 z-0">
        <LiveCyberAttack
          attacks={attacks}
          onUpdateAttacks={setAttacks}
          filterCountry={filterCountry || null}
          setFilterCountry={setFilterCountry}
        />
      </div>

      <AlertSystem attacks={filteredAttacks} />

      <header className="relative z-10 flex items-center justify-between p-4 bg-black/60 backdrop-blur-md border-b border-white/20">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-white transition-all"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">EmberGuard</h2>
                <p className="text-xs text-gray-400">Network Intrusion Detection System</p>
              </div>
            </div>
            
            <button 
              onClick={goToStats}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
            >
              <Activity className="w-4 h-4" />
              <span className="font-medium">Estadísticas</span>
            </button>
          </div>
        </div>

        <div className="text-center flex flex-col text-white">
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400">
            LIVE CYBER THREAT MAP
          </h1>
          <div className="flex items-center justify-center gap-4 mt-1">
            <p className="text-sm lg:text-lg text-white/80">
              <span className="font-semibold text-green-400">
                {filteredAttacks.length.toLocaleString()}
              </span>{" "}
              {filteredAttacks.length === 1 ? 'Ataque' : 'Ataques'} detectados
            </p>
            <div className="h-4 w-px bg-white/20" />
            <p className="text-sm text-white/60">
              {currentTime.toLocaleTimeString()}
            </p>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Universidad Nacional de San Martín - Campus Monitoreo
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportData}
            className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-white transition-all"
            title="Exportar datos"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-white transition-all"
            title="Pantalla completa"
          >
            {fullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
          <button className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-white transition-all">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="relative z-10 flex h-[calc(100vh-80px)]">
        <aside className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          fixed lg:relative lg:translate-x-0
          top-0 left-0 h-full w-80 lg:w-72 xl:w-80
          bg-black/70 backdrop-blur-md border-r border-white/20
          transition-transform duration-300 ease-in-out
          z-20 lg:z-10
          overflow-y-auto
        `}>
          <div className="p-4 space-y-6">
            <div className="lg:hidden pt-16"></div>
            <div className="space-y-6">
              <CountryFilter
                countries={countries}
                filterCountry={filterCountry}
                setFilterCountry={setFilterCountry}
              />
              <AttackList 
                filteredAttacks={filteredAttacks} 
                filterCountry={filterCountry} 
              />
            </div>
          </div>
        </aside>

        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-15 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 relative">
          <div className="absolute inset-0 pointer-events-none" />
        </main>
      </div>

      <footer className="relative z-10 bg-black/60 backdrop-blur-md border-t border-white/20">
        <ThreatLegend />
      </footer>

      <button 
        onClick={goToStats}
        className="lg:hidden fixed bottom-4 right-4 z-30 bg-cyan-600 hover:bg-cyan-700 text-white p-4 rounded-full shadow-lg transition-all"
      >
        <Activity className="w-6 h-6" />
      </button>

      <div className="fixed bottom-4 left-4 z-30 flex items-center space-x-2">
        <div className="flex items-center space-x-2 bg-black/60 backdrop-blur-md rounded-full px-3 py-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-white text-xs font-medium">Sistema Activo</span>
        </div>
        <div className="bg-black/60 backdrop-blur-md rounded-full px-3 py-2">
          <span className="text-white text-xs font-medium">
            {attacks.length > 0 && `Último: ${new Date(attacks[attacks.length - 1]?.time).toLocaleTimeString()}`}
          </span>
        </div>
      </div>
    </div>
  );
}