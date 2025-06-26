import { useState, useEffect } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import MapAttack from "./components/MapAttack";
import Panel from "./components/Panel";
import axios from "axios";
import randomIPs from "./data";
import tokenItem from "../../../utils/TokenItem";

// Utils para IP aleatoria
const getRandomIP = () =>
  randomIPs[Math.floor(Math.random() * randomIPs.length)];

// Cache en memoria
const cacheGN = new Map();
// IPs que están en consulta para evitar múltiples fetch
const pendingIPs = new Set();

// Configuración del cache en localStorage
const LOCAL_CACHE_KEY = "greynoiseCache";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 horas

const loadLocalCache = () => {
  const data = localStorage.getItem(LOCAL_CACHE_KEY);
  return data ? JSON.parse(data) : {};
};

const saveLocalCache = (cache) => {
  localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(cache));
};

const getCachedGreyNoise = (ip) => {
  const cache = loadLocalCache();
  const entry = cache[ip];
  if (entry && Date.now() - entry.timestamp < CACHE_TTL_MS) {
    return entry.data;
  }
  return null;
};

const setCachedGreyNoise = (ip, data) => {
  const cache = loadLocalCache();
  cache[ip] = {
    data,
    timestamp: Date.now(),
  };
  saveLocalCache(cache);
};

// Lookup de IP geolocalización
const geoLookup = async (ip) => {
  try {
    const res = await axios.get(`http://ip-api.com/json/${ip}`);
    return res.data.status === "success"
      ? { country: res.data.country, lat: res.data.lat, lon: res.data.lon }
      : null;
  } catch {
    return null;
  }
};

// Lookup GreyNoise con cache local + memoria
const greyNoiseLookup = async (ip) => {
  if (cacheGN.has(ip)) return cacheGN.get(ip);

  const localCache = getCachedGreyNoise(ip);
  if (localCache) {
    console.log(`(localStorage) GreyNoise result for ${ip}:`, localCache);
    cacheGN.set(ip, localCache);
    return localCache;
  }

  if (pendingIPs.has(ip)) return null;
  pendingIPs.add(ip);

  try {
    console.log(`(API) Consultando GreyNoise para IP: ${ip}`);
    const res = await tokenItem.get(`/api/greynoise/${ip}/`);

    if (res.data) {
      cacheGN.set(ip, res.data);
      setCachedGreyNoise(ip, res.data);
      return res.data;
    }
  } catch (err) {
    console.warn("GreyNoise API error:", err.response?.data || err.message);
  } finally {
    pendingIPs.delete(ip);
  }

  return null;
};

export default function Home() {
  const [attacks, setAttacks] = useState(() => {
    const saved = sessionStorage.getItem("attacks");
    return saved ? JSON.parse(saved) : [];
  });

  const [connections, setConnections] = useState([]);
  const [countryStats, setCountryStats] = useState(() => {
    const saved = sessionStorage.getItem("countryStats");
    return saved ? JSON.parse(saved) : {};
  });

  // Guardar en sessionStorage cuando cambien
  useEffect(() => {
    sessionStorage.setItem("attacks", JSON.stringify(attacks));
    sessionStorage.setItem("countryStats", JSON.stringify(countryStats));
  }, [attacks, countryStats]);

  // Generación de ataques simulados
  useEffect(() => {
    const interval = setInterval(async () => {
      if (attacks.length >= 30) return;

      const srcIP = getRandomIP();
      const tgtIP = getRandomIP();

      const [srcGeo, tgtGeo, srcGN] = await Promise.all([
        geoLookup(srcIP),
        geoLookup(tgtIP),
        greyNoiseLookup(srcIP),
      ]);

      if (srcGeo && tgtGeo) {
        const id = Date.now();
        const type =
          srcGN?.classification === "malicious"
            ? "ATTACK"
            : srcGN?.riot
            ? "INFECTION"
            : "SPAM";

        const atk = {
          id,
          time: new Date().toLocaleTimeString(),
          type,
          malware: type === "INFECTION" ? "RIOT_ACTIVITY" : "N/A",
          sourceCountry: srcGeo.country,
          targetCountry: tgtGeo.country,
          source: { coordinates: [srcGeo.lon, srcGeo.lat] },
          target: { coordinates: [tgtGeo.lon, tgtGeo.lat] },
        };

        setAttacks((prev) => [...prev.slice(-49), atk]);
        setConnections((prev) => [
          ...prev.slice(-19),
          {
            id,
            from: atk.source.coordinates,
            to: atk.target.coordinates,
            type,
            timestamp: id,
          },
        ]);
        setCountryStats((prev) => ({
          ...prev,
          [atk.sourceCountry]: (prev[atk.sourceCountry] || 0) + 1,
        }));
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [attacks]);

  // Limpiar conexiones viejas cada 2 segundos
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setConnections((prev) => prev.filter((c) => now - c.timestamp < 10000));
    }, 2000);
    return () => clearInterval(cleanup);
  }, []);

  return (
    <div className="flex flex-col h-screen w-full bg-black text-white font-mono relative overflow-hidden">
      <Header />
      <MapAttack attacks={attacks} connections={connections} />
      <Panel attacks={attacks} countryStats={countryStats} />
      <Footer />
    </div>
  );
}
