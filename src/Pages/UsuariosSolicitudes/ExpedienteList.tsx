import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../Components/Navbar';
import { TrashIcon, XCircleIcon, CheckCircleIcon } from 'lucide-react';
import ApiRoutes from '../../Components/ApiRoutes';
import { FaFilePdf } from 'react-icons/fa';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

interface User {
  id: number;
  cedula: string;
  nombre: string;
  apellido1: string;
  apellido2: string;
  telefono: string;
  email: string;
  password: string;
  isActive: boolean;
}

interface Expediente {
  idExpediente: number;
  Date: string;
  nombreSolicitante: string;
  telefonoSolicitante: string;
  medioNotificacion: string;
  numeroExpediente: string;
  copiaCertificada: boolean;
  status: string;
  user: User;
}

const ExpedientesList = () => {
  const [expedientes, setExpedientes] = useState<Expediente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const MySwal = withReactContent(Swal);
  /** Carga los expedientes del usuario autenticado */
  useEffect(() => {
    const fetchExpedientes = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(ApiRoutes.misexpedientes, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Expedientes recibidos:", response.data);

        if (!Array.isArray(response.data)) {
          throw new Error('La respuesta del backend no es un array válido.');
        }

        setExpedientes(response.data);
      } catch (error) {
        setError('Error al cargar los expedientes. Intente nuevamente.');
        console.error('Error obteniendo expedientes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpedientes();
  }, [navigate]);

  const handleCreateExpediente = () => {
    navigate('/usuario-expediente');
  };

  /** Maneja la eliminación de un expediente */
  // const handleDeleteExpediente = async (idExpediente: number) => {
  //   if (!window.confirm('¿Está seguro que desea eliminar este expediente?')) return;

  //   try {
  //     const token = localStorage.getItem('token');
  //     if (!token) {
  //       navigate('/login');
  //       return;
  //     }

  //     await axios.delete(`${ApiRoutes.eliminarexpediente}/${idExpediente}`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     setExpedientes((prev) => prev.filter((expediente) => expediente.idExpediente !== idExpediente));
  //   } catch (error) {
  //     setError('Error al eliminar el expediente. Intente nuevamente.');
  //     console.error('Error eliminando expediente:', error);
  //   }
  // };
  const handleDeleteExpediente = async (idExpediente: number) => {
    const result = await MySwal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará tu solicitud de expediente permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
  
    if (!result.isConfirmed) return;
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
  
      await axios.delete(`${ApiRoutes.eliminarexpediente}/${idExpediente}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setExpedientes((prev) =>
        prev.filter((expediente) => expediente.idExpediente !== idExpediente)
      );
  
      await MySwal.fire({
        icon: 'success',
        title: 'Expediente eliminado',
        text: 'La solicitud fue eliminada correctamente.',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      setError('Error al eliminar el expediente. Intente nuevamente.');
      console.error('Error eliminando expediente:', error);
    }
  };
  

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mis Solicitudes de Copia de Expediente</h1>
                    <button
                      onClick={handleCreateExpediente}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <FaFilePdf className="h-4 w-4 mr-2" />
                      Enviar Solicitud
                    </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* <div className="grid gap-6"> */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">

          {expedientes.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-500">No se encontraron expedientes registrados</p>
            </div>
          ) : (
            expedientes.map((expediente) => (
              <div key={expediente.idExpediente} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold">Expediente: {expediente.numeroExpediente}</h3>
                <p className="text-sm text-gray-500">Fecha: {expediente.Date}</p>
                {/* <p className="text-sm text-gray-500">Solicitante: {expediente.nombreSolicitante}</p> */}
                {/* <p className="text-sm text-gray-500">Teléfono: {expediente.telefonoSolicitante}</p>
                <p className="text-sm text-gray-500">Notificación: {expediente.medioNotificacion}</p>
                 */}
                 {expediente.medioNotificacion === 'telefono' && (
  <p className="text-sm text-gray-500">
    Notificación por Teléfono: {expediente.telefonoSolicitante}
  </p>
)}

{expediente.medioNotificacion === 'correo' && (
  <p className="text-sm text-gray-500">
    Notificación por Correo: {expediente.user?.email || 'No disponible'}
  </p>
)}

                <p className="text-sm text-gray-500">
                  Copia Certificada: {expediente.copiaCertificada ? "Sí" : "No"}
                </p>

                {/* <p className="flex items-center gap-1 mt-4">
                  Estado:
                  <span className={`inline-flex items-center ${
                    expediente.status === 'Aprobada' ? 'text-green-600' :
                    expediente.status === 'Denegada' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {expediente.status === 'Aprobada' ? <CheckCircleIcon className="h-4 w-4 mr-1" /> : <XCircleIcon className="h-4 w-4 mr-1" />}
                    {expediente.status}
                  </span>
                </p> */}
                                <p className="flex items-center gap-1 mt-4">
                  Estado:
                  <span className={`inline-flex items-center ${expediente.status === 'Aprobada' ? 'text-green-600' :
                      expediente.status === 'Denegada' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                    {expediente.status === 'Aprobada' && (
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                    )}
                    {expediente.status === 'Denegada' && (
                      <XCircleIcon className="h-4 w-4 mr-1" />
                    )}
                    {expediente.status === 'Pendiente' && (
                      <span className="inline-block w-4 h-4 border-2 border-yellow-500 rounded-full mr-1"></span>
                    )}
                    {expediente.status}
                  </span>
                </p>

                {expediente.status === 'Pendiente' && (
                  <button
                    onClick={() => handleDeleteExpediente(expediente.idExpediente)}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
                  >
                    <TrashIcon className="h-5 w-5 mr-2" />
                    Eliminar Expediente
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpedientesList;
