import { useEffect, useState } from 'react';
import { FaEye, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/useAuth';
import ApiService from '../../Components/ApiService';
import ApiRoutes from '../../Components/ApiRoutes';
import SearchFilterBar from '../../Components/SearchFilterBar';
import FiltroFecha from '../../Components/FiltroFecha';
import Paginacion from '../../Components/Paginacion';
import { Concesion } from '../../Types/Types';
import { io, Socket } from 'socket.io-client';

export default function ConcesionesTable() {
  const [concesiones, setConcesiones] = useState<Concesion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState('Pendiente');
  const [fechaFiltro, setFechaFiltro] = useState<Date | null>(null);
  const [searchText, setSearchText] = useState('');
  const [searchBy, setSearchBy] = useState<'nombre' | 'cedula'>('nombre');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const { isAuthenticated, userPermissions } = useAuth();
  const navigate = useNavigate();
  const [fechasDisponibles, setFechasDisponibles] = useState<string[]>([]);

  const handleSearchTextChange = (text: string) => {
  setSearchText(text);
  setCurrentPage(1); // Reinicia la paginación
};

const handleSearchByChange = (value: string) => {
  setSearchBy(value as 'nombre' | 'cedula');
  setCurrentPage(1); // Reinicia la paginación
};

  function formatearFechaVisual(fechaISO: string): string {
  const [year, month, day] = fechaISO.split('-');
  return `${day}/${month}/${year}`;
}


  const formatFechaFiltro = (fecha: Date | null): string | null => {
    if (!fecha) return null;

    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  const fetchConcesiones = async () => {
    try {
      const data = await ApiService.get<Concesion[]>(ApiRoutes.concesiones);
      setConcesiones(data);
      const fechasUnicas = Array.from(new Set(data.map(c => c.Date))).sort();
      setFechasDisponibles(fechasUnicas);

    } catch (error) {
      console.error('Error cargando concesiones', error);
      setError('Error al cargar las concesiones.');
    } finally {
      setLoading(false);
    }
  };


useEffect(() => {
  if (!isAuthenticated || !userPermissions.includes('ver_concesiones')) {
    navigate('/unauthorized');
    return;
  }

  fetchConcesiones(); // 🔄 Cargar al montar

  const socket: Socket = io(ApiRoutes.urlBase, {
    transports: ['websocket'],
    auth: { token: localStorage.getItem('token') },
  });

  const actualizarTabla = (data: any) => {
    if (data.tipo === 'concesiones') {
      console.log('📡 Evento WebSocket recibido:', data);
      fetchConcesiones();
    }
  };

  // 👂 Suscribirse a los 3 tipos de eventos
  socket.on('nueva-solicitud', actualizarTabla);
  socket.on('actualizar-solicitudes', actualizarTabla);
  socket.on('eliminar-solicitud', actualizarTabla);

  return () => {
    socket.off('nueva-solicitud', actualizarTabla);
    socket.off('actualizar-solicitudes', actualizarTabla);
    socket.off('eliminar-solicitud', actualizarTabla);
    socket.disconnect();
  };
}, [isAuthenticated, userPermissions, navigate]);



  const eliminarConcesion = async (id: number) => {
    const confirmacion = await Swal.fire({
      title: '¿Eliminar solicitud de concesión?',
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
      const response = await fetch(`${ApiRoutes.urlBase}/concesiones/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 403) {
        Swal.fire('Acceso Denegado', 'No tienes permisos para realizar esta acción.', 'warning');
        return;
      }

      if (!response.ok) {
        throw new Error('Error en la eliminación');
      }

      // Swal.fire('¡Eliminada!', 'La concesión fue eliminada.', 'success');
      Swal.fire({
  icon: 'success',
  title: '¡Eliminada!',
  text: 'La solicitud de concesión ha sido eliminada.',
  timer: 3000,
  showConfirmButton: false,
});

      setConcesiones(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo eliminar la concesión.', 'error');
    }
  };


  const concesionesFiltradas = concesiones.filter((c) => {
    const matchEstado = filtroEstado === 'todos' || c.status === filtroEstado;
    // const matchFecha = !fechaFiltro || c.Date === fechaFiltro.toISOString().split('T')[0];
    const matchFecha = !fechaFiltro || c.Date === formatFechaFiltro(fechaFiltro);

    const matchTexto =
      searchBy === 'nombre'
        ? c.user?.nombre?.toLowerCase().includes(searchText.toLowerCase())
        : c.user?.cedula?.toLowerCase().includes(searchText.toLowerCase());
    return matchEstado && matchFecha && matchTexto;
  });

  const indexFinal = currentPage * itemsPerPage;
  const indexInicio = indexFinal - itemsPerPage;
  const paginaActual = concesionesFiltradas.slice(indexInicio, indexFinal);
  const totalPaginas = Math.ceil(concesionesFiltradas.length / itemsPerPage);

  if (loading) return <p className="p-4 text-gray-500">Cargando concesiones...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="flex flex-col w-full h-full p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Solicitudes de Concesión</h2>

      <SearchFilterBar
        searchPlaceholder="Buscar por nombre o identificación..."
        searchText={searchText}
        onSearchTextChange={handleSearchTextChange}
        searchByOptions={[
          { value: 'nombre', label: 'Nombre' },
          { value: 'cedula', label: 'Identificación' },
        ]}
        selectedSearchBy={searchBy}
        onSearchByChange={handleSearchByChange}
        extraFilters={
          <div className="flex flex-wrap items-end gap-2">
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="text-sm py-2 px-3 border border-gray-300 rounded-md w-44"
            >
              <option value="todos">Todos</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Aprobada">Aprobada</option>
              <option value="Denegada">Denegada</option>
            </select>
            {/* <FiltroFecha fechaFiltro={fechaFiltro} onChangeFecha={setFechaFiltro} /> */}
            <FiltroFecha
              fechaFiltro={fechaFiltro}
              onChangeFecha={setFechaFiltro}
              fechasDisponibles={fechasDisponibles}
            />

          </div>
        }
      />

      <div className="flex-1 overflow-auto bg-white shadow-lg rounded-lg mt-4">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          <thead className="bg-gray-50 sticky top-0 z-0">
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Nombre</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Identificación</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Fecha</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Estado</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
  {paginaActual.length > 0 ? (
    paginaActual.map((c) => (
      <tr key={c.id}>
        <td className="px-4 py-2">{c.user?.nombre || '-'}</td>
        <td className="px-4 py-2">{c.user?.cedula || '-'}</td>
        {/* <td className="px-4 py-2">{c.Date}</td> */}
        <td className="px-4 py-2">{formatearFechaVisual(c.Date)}</td>

        <td className="px-4 py-2">
          <span className={`font-semibold px-3 py-1 rounded-full text-sm
            ${c.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
              c.status === 'Aprobada' ? 'bg-green-100 text-green-800' :
              c.status === 'Denegada' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'}`}>
            {c.status}
          </span>
        </td>
        <td className="px-4 py-2 space-x-2">
          <button
            className="text-blue-600 hover:text-blue-800"
            onClick={() => navigate(`/dashboard/concesiones/${c.id}`)}
          >
            <FaEye />
          </button>
          <button
            onClick={() => eliminarConcesion(c.id)}
            className="text-red-600 hover:text-red-800"
          >
            <FaTrash />
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={5} className="p-4 text-center text-gray-500">
        No hay solicitudes de concesión disponibles.
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
