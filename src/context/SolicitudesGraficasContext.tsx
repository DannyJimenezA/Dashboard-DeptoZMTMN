// import { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import ApiRoutes from '../Components/ApiRoutes';
// import { socket } from '../context/SocketListener'; 


// // Definimos cómo luce una solicitud
// interface Solicitud {
//   id: number;
//   Date: string;
//   status: 'Pendiente' | 'Aprobada' | 'Denegada';
//   availableDate?: { date: string }; // Opcional para citas
// }

// // Tipos de solicitudes que vamos a manejar
// type TipoSolicitud = 'citas' | 'denuncias' | 'concesiones' | 'prorrogas' | 'expedientes' | 'precarios' | 'planos';

// interface SolicitudesGraficasContextType {
//   solicitudes: Record<TipoSolicitud, Solicitud[]>;
//   loadingSolicitudes: boolean;
//   fetchSolicitudes: () => Promise<void>;
// }

// const SolicitudesGraficasContext = createContext<SolicitudesGraficasContextType | null>(null);

// export const useSolicitudesGraficas = () => {
//   const context = useContext(SolicitudesGraficasContext);
//   if (!context) throw new Error('useSolicitudesGraficas debe usarse dentro de SolicitudesGraficasProvider');
//   return context;
// };

// export const SolicitudesGraficasProvider = ({ children }: { children: React.ReactNode }) => {
//   const [solicitudes, setSolicitudes] = useState<Record<TipoSolicitud, Solicitud[]>>({
//     citas: [],
//     denuncias: [],
//     concesiones: [],
//     prorrogas: [],
//     expedientes: [],
//     precarios: [],
//     planos: [],
//   });

//   const [loadingSolicitudes, setLoadingSolicitudes] = useState(true);

//   const fetchSolicitudes = useCallback(async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       setLoadingSolicitudes(false);
//       return;
//     }

//     try {
//       const headers = { Authorization: `Bearer ${token}` };

//       const tipos: TipoSolicitud[] = ['citas', 'denuncias', 'concesiones', 'prorrogas', 'expedientes', 'precarios', 'planos'];

//       const solicitudesPorTipo: Record<TipoSolicitud, Solicitud[]> = {
//         citas: [],
//         denuncias: [],
//         concesiones: [],
//         prorrogas: [],
//         expedientes: [],
//         precarios: [],
//         planos: [],
//       };

//       await Promise.all(
//         tipos.map(async (tipo) => {
//           const response = await fetch(ApiRoutes[tipo], { headers });
//           const data = response.ok ? await response.json() : [];
//           solicitudesPorTipo[tipo] = data;
//         })
//       );

//       setSolicitudes(solicitudesPorTipo);
//     } catch (error) {
//       console.error('Error cargando solicitudes:', error);
//     } finally {
//       setLoadingSolicitudes(false);
//     }
//   }, []);

// //   useEffect(() => {
// //     fetchSolicitudes();
// //   }, [fetchSolicitudes]);
// useEffect(() => {
//     socket.on('nueva_solicitud', () => {
//       console.log('📈 Nueva solicitud detectada via WebSocket');
//       fetchSolicitudes(); // 🔥 Volver a cargar todas las solicitudes
//     });
  
//     return () => {
//       socket.off('nueva_solicitud'); // 🔥 Importante limpiar
//     };
//   }, [fetchSolicitudes]);

//   return (
//     <SolicitudesGraficasContext.Provider value={{ solicitudes, loadingSolicitudes, fetchSolicitudes }}>
//       {children}
//     </SolicitudesGraficasContext.Provider>
//   );
// };

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { socket } from './socket'; // ✅

import ApiRoutes from '../Components/ApiRoutes';

// Definimos cómo luce una solicitud
interface Solicitud {
  id: number;
  Date: string;
  status: 'Pendiente' | 'Aprobada' | 'Denegada';
  availableDate?: { date: string };
}

type TipoSolicitud = 'citas' | 'denuncias' | 'concesiones' | 'prorrogas' | 'expedientes' | 'precarios' | 'planos';

interface SolicitudesGraficasContextType {
  solicitudes: Record<TipoSolicitud, Solicitud[]>;
  loadingSolicitudes: boolean;
  fetchSolicitudes: () => Promise<void>;
}

const SolicitudesGraficasContext = createContext<SolicitudesGraficasContextType | null>(null);

export const useSolicitudesGraficas = () => {
  const context = useContext(SolicitudesGraficasContext);
  if (!context) throw new Error('useSolicitudesGraficas debe usarse dentro de SolicitudesGraficasProvider');
  return context;
};

export const SolicitudesGraficasProvider = ({ children }: { children: React.ReactNode }) => {
  const [solicitudes, setSolicitudes] = useState<Record<TipoSolicitud, Solicitud[]>>({
    citas: [],
    denuncias: [],
    concesiones: [],
    prorrogas: [],
    expedientes: [],
    precarios: [],
    planos: [],
  });

  const [loadingSolicitudes, setLoadingSolicitudes] = useState(true);

  const fetchSolicitudes = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoadingSolicitudes(false);
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const tipos: TipoSolicitud[] = ['citas', 'denuncias', 'concesiones', 'prorrogas', 'expedientes', 'precarios', 'planos'];

      const solicitudesPorTipo: Record<TipoSolicitud, Solicitud[]> = {
        citas: [],
        denuncias: [],
        concesiones: [],
        prorrogas: [],
        expedientes: [],
        precarios: [],
        planos: [],
      };

      await Promise.all(
        tipos.map(async (tipo) => {
          const response = await fetch(ApiRoutes[tipo], { headers });
          const data = response.ok ? await response.json() : [];
          solicitudesPorTipo[tipo] = data;
        })
      );

      setSolicitudes(solicitudesPorTipo);
    } catch (error) {
      console.error('Error cargando solicitudes:', error);
    } finally {
      setLoadingSolicitudes(false);
    }
  }, []);

  useEffect(() => {
    fetchSolicitudes(); // 👈🔥 Al entrar, cargar solicitudes
  }, [fetchSolicitudes]);

  useEffect(() => {
    socket.on('nueva_solicitud', () => {
      console.log('📈 Nueva solicitud detectada via WebSocket');
      fetchSolicitudes(); // 🔥 Volver a cargar todas las solicitudes
    });

    return () => {
      socket.off('nueva_solicitud');
    };
  }, [fetchSolicitudes]);

  return (
    <SolicitudesGraficasContext.Provider value={{ solicitudes, loadingSolicitudes, fetchSolicitudes }}>
      {children}
    </SolicitudesGraficasContext.Provider>
  );
};
