import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import ApiRoutes from '../Components/ApiRoutes';

interface Counters {
  citas: number;
  denuncias: number;
  concesiones: number;
  prorrogas: number;
  expedientes: number;
  usoPrecario: number;
  planos: number;
}

interface SolicitudesContextType {
  counters: Counters;
  setCounters: React.Dispatch<React.SetStateAction<Counters>>;
  fetchCounters: () => Promise<void>;
  loadingCounters: boolean;
}

const SolicitudesContext = createContext<SolicitudesContextType | null>(null);

export const useSolicitudes = () => {
  const context = useContext(SolicitudesContext);
  if (!context) throw new Error('useSolicitudes debe usarse dentro de SolicitudesProvider');
  return context;
};

export const SolicitudesProvider = ({ children }: { children: React.ReactNode }) => {
  const [counters, setCounters] = useState<Counters>({
    citas: 0,
    denuncias: 0,
    concesiones: 0,
    prorrogas: 0,
    expedientes: 0,
    usoPrecario: 0,
    planos: 0,
  });

  const [loadingCounters, setLoadingCounters] = useState<boolean>(true); // ⏳ Nuevo loading

  const fetchCounters = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoadingCounters(false); // 🔥 Si no hay token, termina la carga
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [
        concesionesRes,
        prorrogasRes,
        expedientesRes,
        precariosRes,
        planosRes,
        citasRes,
        denunciasRes,
      ] = await Promise.all([
        fetch(`${ApiRoutes.concesiones}/pendientes`, { headers }),
        fetch(`${ApiRoutes.prorrogas}/pendientes`, { headers }),
        fetch(`${ApiRoutes.expedientes}/pendientes`, { headers }),
        fetch(`${ApiRoutes.precarios}/pendientes`, { headers }),
        fetch(`${ApiRoutes.planos}/pendientes`, { headers }),
        fetch(`${ApiRoutes.citas}/pendientes`, { headers }),
        fetch(`${ApiRoutes.denuncias}/pendientes`, { headers }),
      ]);

      const [
        concesiones,
        prorrogas,
        expedientes,
        usoPrecario,
        planos,
        citas,
        denuncias,
      ] = await Promise.all([
        concesionesRes.ok ? concesionesRes.text() : "0",
        prorrogasRes.ok ? prorrogasRes.text() : "0",
        expedientesRes.ok ? expedientesRes.text() : "0",
        precariosRes.ok ? precariosRes.text() : "0",
        planosRes.ok ? planosRes.text() : "0",
        citasRes.ok ? citasRes.text() : "0",
        denunciasRes.ok ? denunciasRes.text() : "0",
      ]);

      setCounters({
        concesiones: Number(concesiones),
        prorrogas: Number(prorrogas),
        expedientes: Number(expedientes),
        usoPrecario: Number(usoPrecario),
        planos: Number(planos),
        citas: Number(citas),
        denuncias: Number(denuncias),
      });
    } catch (error) {
      console.error('Error cargando los contadores:', error);
    } finally {
      setLoadingCounters(false); // ✅ Siempre terminamos la carga
    }
  }, []);

  useEffect(() => {
    fetchCounters();
  }, [fetchCounters]);

  return (
    <SolicitudesContext.Provider value={{ counters, setCounters, fetchCounters, loadingCounters }}>
      {children}
    </SolicitudesContext.Provider>
  );
};
