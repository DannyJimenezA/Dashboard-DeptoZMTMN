// import { useEffect } from 'react';
// import { io } from 'socket.io-client';
// import { useSolicitudes } from './SolicitudesContext';
// import ApiRoutes from '../Components/ApiRoutes';

// export default function SocketListener() {
//   const { setCounters, counters } = useSolicitudes(); // 👈 también traigo counters para saber el tipo

//   useEffect(() => {
//     const socket = io(ApiRoutes.urlBase);

//     socket.on('nueva-solicitud', (data: { tipo: keyof typeof counters }) => {
//       setCounters((prev: typeof counters) => ({
//         ...prev,
//         [data.tipo]: (prev[data.tipo] || 0) + 1, // suma automáticamente el tipo
//       }));
//     });

    

//     return () => {
//       socket.disconnect();
//     };
//   }, [setCounters, counters]);

//   return null; // Solo escucha
// }

import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useSolicitudes } from './SolicitudesContext';
import ApiRoutes from '../Components/ApiRoutes';

export default function SocketListener() {
  const { setCounters, counters, fetchCounters } = useSolicitudes(); 
  // 👆 Importante: traemos `fetchCounters`, que sí existe en tu contexto

  useEffect(() => {
    const socket = io(ApiRoutes.urlBase, {
      transports: ['websocket'],
      auth: {
        token: localStorage.getItem('token'),
      },
    });

    socket.on('nueva-solicitud', (data: { tipo: keyof typeof counters }) => {
      setCounters((prev: typeof counters) => ({
        ...prev,
        [data.tipo]: (prev[data.tipo] || 0) + 1, // suma automáticamente
      }));
    });

    socket.on('actualizar-solicitudes', (data) => {
      console.log('Actualizar solicitudes recibido:', data);
      fetchCounters(); // 🔥 Correctamente recarga los contadores
    });

    return () => {
      socket.disconnect();
    };
  }, [setCounters, counters, fetchCounters]);

  return null; // Solo escucha
}
