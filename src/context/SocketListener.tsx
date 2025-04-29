import { useEffect } from 'react';
import { useSolicitudes } from './SolicitudesContext';
import { socket } from './socket'; // ✅ socket centralizado

export default function SocketListener() {
  const { fetchCounters } = useSolicitudes(); 

  useEffect(() => {
    socket.connect(); // 👈 Importante: conectar explícitamente

    // Cada vez que haya una nueva solicitud o cambio
    socket.on('nueva-solicitud', () => {
      console.log('🛎️ Nueva solicitud recibida vía WebSocket');
      fetchCounters(); // 🔥 Siempre consulta el contador real
    });

    socket.on('actualizar-solicitudes', () => {
      console.log('🔄 Actualización masiva de solicitudes');
      fetchCounters(); // 🔥 Igual refresca todo
    });

    return () => {
      socket.disconnect(); // 👋 Siempre desconectarse al desmontar
    };
  }, [fetchCounters]); // 🔥 Solo depende de `fetchCounters`

  return null; // No renderiza nada visual
}

