import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaEye, FaTrash } from 'react-icons/fa';
import { useAuth } from '../Auth/useAuth';
import { Cita } from '../../Types/Types';
import ApiService, { fetchWithAuth } from '../../Components/ApiService';
import ApiRoutes from '../../Components/ApiRoutes';
import SearchFilterBar from '../../Components/SearchFilterBar';
import FiltroFecha from '../../Components/FiltroFecha';
import Paginacion from '../../Components/Paginacion';
import { io, Socket } from 'socket.io-client';

export default function AppointmentTable() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState('Pendiente');
  const [fechaFiltro, setFechaFiltro] = useState<Date | null>(null);
  const [fechasDisponibles, setFechasDisponibles] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const [searchBy, setSearchBy] = useState<'nombre' | 'cedula'>('nombre');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const { isAuthenticated, userPermissions } = useAuth();


  const handleSearchTextChange = (text: string) => {
  setSearchText(text);
  setCurrentPage(1); // Reinicia la paginación
};

const handleSearchByChange = (value: string) => {
  setSearchBy(value as 'nombre' | 'cedula');
  setCurrentPage(1); // Reinicia la paginación
};



function formatearFecha(fechaISO: string): string {
  const [year, month, day] = fechaISO.split('-');
  return `${day}/${month}/${year}`;
}


function formatearHora(hora24: string): string {
  const [horas, minutos] = hora24.split(':');
  const date = new Date();
  date.setHours(parseInt(horas, 10));
  date.setMinutes(parseInt(minutos, 10));
  return date.toLocaleTimeString('es-CR', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}


  const navigate = useNavigate();
const fechasSonIguales = (fechaStr: string, fechaSeleccionada: Date) => {
  const [year, month, day] = fechaStr.split('-').map(Number);
  const fecha1 = new Date(year, month - 1, day); // sin conversión UTC
  const fecha2 = new Date(fechaSeleccionada);

  return (
    fecha1.getFullYear() === fecha2.getFullYear() &&
    fecha1.getMonth() === fecha2.getMonth() &&
    fecha1.getDate() === fecha2.getDate()
  );
};


const fetchCitas = async () => {
  try {
    const data = await ApiService.get<Cita[]>(ApiRoutes.citas);
    setCitas(data);

    const fechasUnicas = Array.from(
      new Set(
        data
          .map(c => c.availableDate?.date)
          .filter(Boolean)
      )
    ).sort();
    setFechasDisponibles(fechasUnicas);

  } catch {
    setError('Error al cargar las citas');
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
  if (!isAuthenticated || !userPermissions.includes('ver_appointments')) {
    navigate('/unauthorized');
    return;
  }

  fetchCitas(); // Carga inicial

  const socket: Socket = io(ApiRoutes.urlBase, {
    transports: ['websocket'],
    auth: { token: localStorage.getItem('token') },
  });

  // 🔥 Escucha eventos WebSocket
  const actualizarCitas = (data: any) => {
    if (data.tipo === 'citas') {
      console.log('🔄 Evento WebSocket recibido:', data);
      fetchCitas();
    }
  };

  socket.on('nueva-solicitud', actualizarCitas);
  socket.on('actualizar-solicitudes', actualizarCitas);
  socket.on('eliminar-solicitud', actualizarCitas);

  return () => {
    socket.off('nueva-solicitud', actualizarCitas);
    socket.off('actualizar-solicitudes', actualizarCitas);
    socket.off('eliminar-solicitud', actualizarCitas);
    socket.disconnect();
  };
}, [isAuthenticated, userPermissions, navigate]);


  const eliminarCita = async (id: number) => {
    const confirmar = await Swal.fire({
      title: '¿Eliminar cita?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545',
    });

    if (!confirmar.isConfirmed) return;

    try {
      const res = await fetchWithAuth(`${ApiRoutes.citas}/${id}`, {
        method: 'DELETE',
      });

      if (!res) throw new Error('No hubo respuesta del servidor');
      if (res.status === 403) {
        Swal.fire('Acceso Denegado', 'No tienes permisos para realizar esta acción.', 'warning');
        return;
      }
      if (!res.ok) throw new Error('Falló la eliminación');

      // Swal.fire('¡Eliminada!', 'La cita ha sido eliminada.', 'success', );
      Swal.fire({
  icon: 'success',
  title: '¡Eliminada!',
  text: 'La cita ha sido eliminada.',
  timer: 3000,
  showConfirmButton: false,
});

      
      setCitas(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error al eliminar cita:', error);
      Swal.fire('Error', 'No se pudo eliminar la cita.', 'error');
    }
  };

  if (!isAuthenticated || userPermissions.length === 0) {
    return <p className="text-center text-gray-500 p-4">Verificando permisos...</p>;
  }

  if (loading) return <p className="text-gray-500 p-4">Cargando citas...</p>;
  if (error) return <p className="text-red-500 p-4">{error}</p>;

  const citasFiltradas = citas.filter(cita => {
    const matchEstado = filtroEstado === 'todos' || cita.status === filtroEstado;
const matchFecha =
  !fechaFiltro || (cita.availableDate?.date && fechasSonIguales(cita.availableDate.date, fechaFiltro));

    const matchTexto =
      searchBy === 'nombre'
        ? cita.user?.nombre?.toLowerCase().includes(searchText.toLowerCase())
        : cita.user?.cedula?.toLowerCase().includes(searchText.toLowerCase());
    return matchEstado && matchFecha && matchTexto;
  });

  const indexUltima = currentPage * itemsPerPage;
  const indexPrimera = indexUltima - itemsPerPage;
  const citasActuales = citasFiltradas.slice(indexPrimera, indexUltima);
  const totalPages = Math.ceil(citasFiltradas.length / itemsPerPage);

  return (
    <div className="flex flex-col w-full h-full p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Solicitudes de Citas</h2>

      <SearchFilterBar
        searchByOptions={[
          { value: 'nombre', label: 'Nombre' },
          { value: 'cedula', label: 'Identificación' },
        ]}
        searchPlaceholder="Buscar por nombre o identificación..."
        searchText={searchText}
        onSearchTextChange={handleSearchTextChange}
        selectedSearchBy={searchBy}
        onSearchByChange={handleSearchByChange}
        extraFilters={
          <div className="flex flex-wrap items-end gap-2 relative z-50">
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
            <FiltroFecha fechaFiltro={fechaFiltro} onChangeFecha={setFechaFiltro} fechasDisponibles={fechasDisponibles} />
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
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Hora</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Estado</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
  {citasActuales.length > 0 ? (
    citasActuales.map((cita) => (
      <tr key={cita.id}>
        <td className="px-4 py-2">{cita.user?.nombre ?? '-'}</td>
        <td className="px-4 py-2">{cita.user?.cedula ?? '-'}</td>
        {/* <td className="px-4 py-2">{`${cita.availableDate?.date ?? '-'} ${cita.horaCita?.hora ?? ''}`}</td> */}
<td className="px-4 py-2">
  {cita.availableDate?.date ? formatearFecha(cita.availableDate.date) : '-'}
</td>
<td className="px-4 py-2">
  {cita.horaCita?.hora ? formatearHora(cita.horaCita.hora) : '-'}
</td>


        <td className="px-4 py-2">
          <span className={`font-semibold px-3 py-1 rounded-full text-sm
            ${cita.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
              cita.status === 'Aprobada' ? 'bg-green-100 text-green-800' :
              cita.status === 'Denegada' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'}`}>
            {cita.status}
          </span>
        </td>
        <td className="px-4 py-2 space-x-2">
          <button className="text-blue-600 hover:text-blue-800" onClick={() => navigate(`/dashboard/citas/${cita.id}`)}>
            <FaEye />
          </button>
          <button className="text-red-600 hover:text-red-800" onClick={() => eliminarCita(cita.id)}>
            <FaTrash />
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={6} className="p-4 text-center text-gray-500">
        No hay solicitudes de citas disponibles.
      </td>
    </tr>
  )}
</tbody>

        </table>
      </div>

      <Paginacion
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />
    </div>
  );
}