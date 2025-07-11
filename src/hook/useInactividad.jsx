import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function useInactividad(timeout = 5 * 60 * 1000) {
  const navigate = useNavigate();

  useEffect(() => {
    let timeoutId;

    const logout = () => {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("session_token");
      navigate("/login");
    };

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(logout, timeout);
    };

    const eventos = ["mousemove", "keydown", "click"];

    eventos.forEach((e) => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      eventos.forEach((e) => window.removeEventListener(e, resetTimer));
      clearTimeout(timeoutId);
    };
  }, [timeout, navigate]);
}
