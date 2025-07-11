import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const [encryptedId, setEncryptedId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access");
    const storedUser = localStorage.getItem("user");

    setIsAuthenticated(!!token);

    try {
      if (storedUser && storedUser !== "undefined") {
        const user = JSON.parse(storedUser);
        if (user?.username) setUsername(user.username);
        if (user?.id_encriptado) setEncryptedId(user.id_encriptado); // ✅ EXTRAER ID
      }
    } catch (error) {
      console.warn("Error parseando 'user' en Header:", error);
      localStorage.removeItem("user");
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-20 bg-transparent px-6 py-4 flex items-center justify-between">
      <Link to="/home">
        <div className="text-white text-2xl font-bold tracking-wide flex items-center gap-3">
          <img className="h-8" src="/logo.jpeg" alt="Ember Guard" />
          EMBER GUARD
        </div>
      </Link>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <Link to="/stats">
              <button className={btnStyle}>STATS</button>
            </Link>
            <Link to="/encryption">
              <button className={btnStyle}>ENCRYPTION</button>
            </Link>
            <Link to="/decrypt">
              <button className={btnStyle}>DECRYPTION</button>
            </Link>
            {encryptedId && (
              <Link to={`/profile?s=${encryptedId}`}>
                <button className={btnStyle}>PERFIL</button>
              </Link>
            )}

            <button className={btnStyle} onClick={handleLogout}>
              LOGOUT
            </button>
          </>
        ) : (
          <Link to="/login">
            <button className={btnStyle}>ACCOUNT</button>
          </Link>
        )}
      </div>
    </div>
  );
}

const btnStyle =
  "bg-transparent border border-white text-white px-4 py-2 text-sm font-bold hover:bg-white hover:text-black transition-colors duration-200";
