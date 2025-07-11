// src/hooks/useValidateSession.js
import { useEffect } from 'react';
import tokenItem from '../utils/TokenItem';

export default function useValidateSession() {
  useEffect(() => {
    const validarSesion = async () => {
      try {
        // Ya no necesitas enviar headers manualmente
        await tokenItem.post('/api/auth/validate-session/');
      } catch (error) {
        // La redirección ya está manejada en el interceptor de TokenItem
        console.warn("Error al validar sesión:", error);
      }
    };

    const intervalo = setInterval(validarSesion, 15000);
    return () => clearInterval(intervalo);
  }, []);
}
