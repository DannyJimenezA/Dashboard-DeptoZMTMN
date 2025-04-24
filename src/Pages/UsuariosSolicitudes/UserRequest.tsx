import { useState, useEffect } from 'react';
import Navbar from '../../Components/Navbar';
import ApiRoutes from '../../Components/ApiRoutes';
import { RequestList } from './RequestList';
import { RequestFilter } from './RequestFilter';
import { useNavigate } from 'react-router-dom';

interface Request {
  id: number;
  type: string;
  status: string;
  date: string;
  description: string;
  category: 'Plano' | 'Prórroga' | 'Precario' | 'Concesión' | 'CopiaExpediente';
  fileUrl: string; // Asegúrate de que esto contenga la URL del archivo adjunto
}

export default function UserRequests() {
  const [requests, setRequests] = useState<Request[]>([]); 
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
  const [filter, setFilter] = useState<'Todas' | 'Plano' | 'Prórroga' | 'Precario' | 'Concesión' | 'CopiaExpediente'>('Todas');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token'); 
        if (!token) {
          setError('No se encontró el token de autenticación');
          setLoading(false);
          navigate('/login');
          return;
        }

        // Llamadas a los endpoints
        const [
          planosResponse,
          prorrogasResponse,
          precariosResponse,
          concesionesResponse,
          copiaExpedientesResponse,
        ] = await Promise.all([
          fetch(`${ApiRoutes.planos}/my-planos`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }),
          fetch(`${ApiRoutes.prorrogas}/my-prorrogas`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }),
          fetch(`${ApiRoutes.precarios}/my-precarios`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }),
          fetch(`${ApiRoutes.concesiones}/my-concesiones`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }),
          fetch(`${ApiRoutes.expedientes}/my-solicitudes`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }),
        ]);

      
        // Procesar las respuestas
        const planosData = await planosResponse.json();
        const prorrogasData = await prorrogasResponse.json();
        const precariosData = await precariosResponse.json();
        const concesionesData = await concesionesResponse.json();
        const copiaExpedientesData = await copiaExpedientesResponse.json();

        const parseFileUrl = (fileString: string) => {
          try {
            const files = JSON.parse(fileString);
            const filePath = Array.isArray(files) && files.length > 0 ? files[0] : '';
            return filePath ? `${ApiRoutes.urlBase}/${filePath.replace(/\\/g, '/').replace(/\["|"\]/g, '')}` : '';
          } catch {
            return '';
          }
        };


        // Mapeo de datos
        const planos: Request[] = planosData.map((plan: any) => ({
          id: plan.id,
          type: plan.NumeroPlano || 'Plano sin título',
          status: plan.status || 'Desconocido',
          date: plan.Date || 'Sin fecha',
          description: plan.Comentario || 'Sin descripción disponible',
          category: 'Plano',
          fileUrl: parseFileUrl(plan.ArchivoAdjunto) || '', // Asegúrate de que el archivo adjunto esté aquí
        }));

        const prorrogas: Request[] = prorrogasData.map((prorroga: any) => ({
          id: prorroga.id,
          type: prorroga.ArchivoAdjunto || 'Prórroga sin título',
          status: prorroga.Status || 'Desconocido',
          date: prorroga.Date || 'Sin fecha',
          category: 'Prórroga',
          fileUrl: parseFileUrl(prorroga.ArchivoAdjunto) || '', // Asegúrate de que el archivo adjunto esté aquí
        }));

        const precarios: Request[] = precariosData.map((precario: any) => ({
          id: precario.id,
          type: precario.ArchivoAdjunto || 'Precario sin título',
          status: precario.Status || 'Desconocido',
          date: precario.Date || 'Sin fecha',
          category: 'Precario',
          fileUrl: parseFileUrl(precario.ArchivoAdjunto) || '', // Asegúrate de que el archivo adjunto esté aquí
        }));

        const concesiones: Request[] = concesionesData.map((concesion: any) => ({
          id: concesion.id,
          type: concesion.ArchivoAdjunto || 'Concesión sin título',
          status: concesion.Status || 'Desconocido',
          date: concesion.Date || 'Sin fecha',
          category: 'Concesión',
          fileUrl: parseFileUrl(concesion.ArchivoAdjunto),
        }));

        const copiaExpedientes: Request[] = copiaExpedientesData.map((solicitud: any) => ({
          id: solicitud.idExpediente,
          type: solicitud.numeroExpediente || 'Copia de Expediente sin título',
          status: solicitud.status || 'Desconocido',
          date: solicitud.Date || 'Sin fecha',
          category: 'CopiaExpediente',
          fileUrl: parseFileUrl(solicitud.ArchivoAdjunto) || '', // Asegúrate de que el archivo adjunto esté aquí
        }));

        // Combinar todas las solicitudes
        const combinedRequests = [
          ...planos,
          ...prorrogas,
          ...precarios,
          ...concesiones,
          ...copiaExpedientes,
        ];
        setRequests(combinedRequests);
        setFilteredRequests(combinedRequests);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (filter === 'Todas') {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(requests.filter((request) => request.category === filter));
    }
  }, [filter, requests]);

  if (loading) {
    return <div className="text-center py-10">Cargando solicitudes...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Mis Solicitudes</h1>
        <RequestFilter filter={filter} onFilterChange={setFilter} />
        <RequestList requests={filteredRequests} />
      </div>
    </div>
  );
}
