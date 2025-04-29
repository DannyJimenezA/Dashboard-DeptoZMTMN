// src/Components/AutoFetcher.tsx
import { useEffect } from 'react';
import { useAuth } from '../Pages/Auth/useAuth';
import { useSolicitudes } from '../context/SolicitudesContext';
import { useSolicitudesGraficas } from '../context/SolicitudesGraficasContext';

export default function AutoFetcher() {
  const { isAuthenticated } = useAuth();
  const { fetchCounters } = useSolicitudes();
  const { fetchSolicitudes } = useSolicitudesGraficas();

  useEffect(() => {
    if (isAuthenticated) {
      console.log('🔄 Usuario autenticado, refrescando datos...');
      fetchCounters();
      fetchSolicitudes();
    }
  }, [isAuthenticated, fetchCounters, fetchSolicitudes]);

  return null;
}
