import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import tokenItem from "./TokenItem";

export default function RutasProtegidas() {
  const [cargando, setCargando] = useState(true);
  const [autenticado, setAutenticado] = useState(false);

  useEffect(() => {
    const validarSesion = async () => {
      const token = localStorage.getItem("access");
      const sessionToken = localStorage.getItem("session_token");

      if (!token || !sessionToken) {
        setAutenticado(false);
        setCargando(false);
        return;
      }

      try {
        const response = await tokenItem.post(
          "/api/auth/validate-session/",
          {},
          {
            headers: {
              "X-Session-Token": sessionToken,
            },
          }
        );
        if (response.status === 200) {
          setAutenticado(true);
        }
      } catch (error) {
        console.warn("⛔ Sesión inválida o duplicada:", error);
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("session_token");
        setAutenticado(false);
      } finally {
        setCargando(false);
      }
    };

    validarSesion();
  }, []);

  if (cargando) return null; // O un spinner

  return autenticado ? <Outlet /> : <Navigate to="/login" />;
}
