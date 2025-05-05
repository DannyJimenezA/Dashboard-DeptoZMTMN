import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiRoutes from '../../Components/ApiRoutes';
import Swal from 'sweetalert2';
import { io } from 'socket.io-client';
import Paginacion from '../../Components/Paginacion';
import { FaClock, FaPlus, FaTrash } from 'react-icons/fa';
import { useAuth } from '../Auth/useAuth';

interface FechaCita {
  id: number;
  date: string;
}

export default function DiasCitasTable() {
  const [fechas, setFechas] = useState<FechaCita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [mostrarProximas, setMostrarProximas] = useState(true); // 🔥 Solo este filtro
    const { userPermissions } = useAuth();

  const navigate = useNavigate();

  const fetchFechas = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(ApiRoutes.fechaCitas, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Error al obtener fechas');
      const data = await response.json();
      setFechas(data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar las fechas de citas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFechas();

    const socket = io(ApiRoutes.urlBase, {
      transports: ['websocket'],
      auth: { token: localStorage.getItem('token') },
    });

    socket.on('nueva-fecha-cita', (nuevaFecha: FechaCita) => {
      setFechas((prev) => [nuevaFecha, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);



  
  const eliminarFecha = async (id: number) => {
    const confirmacion = await Swal.fire({
      title: '¿Eliminar fecha?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545',
    });

    if (!confirmacion.isConfirmed) return;

    try {
      const token = localStorage.getItem('token');
      await fetch(`${ApiRoutes.fechaCitas}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire('¡Eliminado!', 'La fecha fue eliminada correctamente.', 'success');
      setFechas((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'No se pudo eliminar la fecha.', 'error');
    }
  };


  const handleCrearFechaClick = () => {
    if (!userPermissions.includes('crear_available-dates')) {
      return Swal.fire(
        'Permiso denegado',
        'No tienes permisos para realizar esta acción.',
        'warning'
      );
    }
  
    navigate('/dashboard/crear-fecha');
  };

  // 🔥 Aplica solo filtro de fechas próximas/todas
  const fechasFiltradas = fechas.filter((fecha) =>
    mostrarProximas ? new Date(fecha.date) >= new Date() : true
  );

  const indexFinal = currentPage * itemsPerPage;
  const indexInicio = indexFinal - itemsPerPage;
  const fechasActuales = fechasFiltradas.slice(indexInicio, indexFinal);
  const totalPaginas = Math.ceil(fechasFiltradas.length / itemsPerPage);

  if (loading) return <p className="text-center text-gray-500">Cargando fechas...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="flex flex-col w-full h-full p-4">
  <h2 className="text-2xl font-bold mb-4 text-center">Fechas de Citas</h2>

  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
    <div>
      <label className="mr-2 font-semibold">Mostrar:</label>
      <select
        value={mostrarProximas ? 'proximas' : 'todas'}
        onChange={(e) => {
          setMostrarProximas(e.target.value === 'proximas');
          setCurrentPage(1);
        }}
        className="text-sm border border-gray-300 rounded-md px-3 py-2"
      >
        <option value="proximas">Próximas Fechas</option>
        <option value="todas">Todas las Fechas</option>
      </select>
    </div>

    {/* <button
      onClick={() => navigate('/dashboard/crear-fecha')}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
    >
     Crear Nueva Fecha
    </button> */}
<button
  onClick={handleCrearFechaClick}
  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
>
  <FaPlus className="mr-2" /> Crear Nueva Fecha
</button>
  </div>

  <div className="flex-1 overflow-auto bg-white shadow-lg rounded-lg max-h-[70vh]">
    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
      <thead className="bg-gray-50 sticky top-0 z-10">
        <tr className="bg-gray-200">
          <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Fecha</th>
          <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Acciones</th>
        </tr>
      </thead>
      {/* <tbody className="divide-y divide-gray-200">
        {fechasActuales.length > 0 ? (
          fechasActuales.map((fecha) => (
            <tr key={fecha.id}>
              <td className="px-4 py-2">{fecha.date}</td>
              <td className="px-4 py-2 space-x-2">
                <button
                  onClick={() => navigate(`/dashboard/horas-citas/${fecha.id}`)}
                  className="text-blue-600 hover:text-blue-800" 
                >
                  <FaClock />
                </button>
                <button
                  onClick={() => eliminarFecha(fecha.id)}
                   className="text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={2} className="p-4 text-center text-gray-500">
              No hay fechas disponibles.
            </td>
          </tr>
        )}
      </tbody>
       */}
       <tbody className="divide-y divide-gray-200">
  {fechasActuales.length > 0 ? (
    fechasActuales.map((fecha) => (
      <tr key={fecha.id}>
        <td className="px-4 py-2">{fecha.date}</td>
        <td className="px-4 py-2 space-x-2">
          <button
            onClick={() => {
              if (!userPermissions.includes('crear_horas-cita')) {
                return Swal.fire(
                  'Permiso denegado',
                  'No tienes permisos para gestionar las horas de esta fecha.',
                  'warning'
                );
              }
              navigate(`/dashboard/horas-citas/${fecha.id}`);
            }}
            className="text-blue-600 hover:text-blue-800"
          >
            <FaClock />
          </button>

          <button
            onClick={() => {
              if (!userPermissions.includes('eliminar_available-dates')) {
                return Swal.fire(
                  'Permiso denegado',
                  'No tienes permisos para realizar esta acción.',
                  'warning'
                );
              }
              eliminarFecha(fecha.id);
            }}
            className="text-red-600 hover:text-red-800"
          >
            <FaTrash />
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={2} className="p-4 text-center text-gray-500">
        No hay fechas disponibles.
      </td>
    </tr>
  )}
</tbody>

    </table>
  </div>

  <Paginacion
    currentPage={currentPage}
    totalPages={totalPaginas}
    itemsPerPage={itemsPerPage}
    onPageChange={setCurrentPage}
    onItemsPerPageChange={setItemsPerPage}
  />
</div>

  );
}