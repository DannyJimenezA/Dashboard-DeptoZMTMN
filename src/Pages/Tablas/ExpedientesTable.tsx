import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CopiaExpediente } from '../../Types/Types';
import Paginacion from '../../Components/Paginacion';
import FiltroFecha from '../../Components/FiltroFecha';
import SearchFilterBar from '../../Components/SearchFilterBar';
import { FaEye, FaTrash } from 'react-icons/fa';
import ApiRoutes from '../../Components/ApiRoutes';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useAuth } from '../../Pages/Auth/useAuth';
import { io, Socket } from 'socket.io-client';
import ApiService from '../../Components/ApiService';

const MySwal = withReactContent(Swal);

export default function ExpedientesTable() {
  const [expedientes, setExpedientes] = useState<CopiaExpediente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState('Pendiente');
  const [fechaFiltro, setFechaFiltro] = useState<Date | null>(null);
  const [fechasDisponibles, setFechasDisponibles] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
 const [searchBy, setSearchBy] = useState<'nombreSolicitante' | 'cedula'>('nombreSolicitante');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const navigate = useNavigate();
  const { isAuthenticated, userPermissions } = useAuth();

  const handleSearchTextChange = (text: string) => {
  setSearchText(text);
  setCurrentPage(1);
};

const handleSearchByChange = (value: string) => {
  setSearchBy(value as 'nombreSolicitante' | 'cedula');
  setCurrentPage(1);
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

  const cargarExpedientes = async () => {
    try {
      const data = await ApiService.get<CopiaExpediente[]>(ApiRoutes.expedientes);
      setExpedientes(data);
      const fechasUnicas = Array.from(new Set(data.map(e => String(e.Date)))).sort();
      setFechasDisponibles(fechasUnicas);
    } catch (error) {
      console.error('Error cargando expedientes', error);
      setError('Error al cargar expedientes.');
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   let socket: Socket | null = null;

  //   if (!isAuthenticated || !userPermissions.includes('ver_copia_expediente')) {
  //     navigate('/unauthorized');
  //     return;
  //   }

  //   cargarExpedientes();

  //   socket = io(ApiRoutes.urlBase, {
  //     transports: ['websocket'],
  //     auth: { token: localStorage.getItem('token') },
  //   });

  //   socket.on('nueva-solicitud', (data) => {
  //     if (data.tipo === 'expedientes') {
  //       cargarExpedientes();
  //     }
  //   });

  //   return () => {
  //     if (socket) socket.disconnect();
  //   };
  // }, [isAuthenticated, userPermissions, navigate]);


useEffect(() => {
  let socket: Socket | null = null;

  if (!isAuthenticated || !userPermissions.includes('ver_copia_expediente')) {
    navigate('/unauthorized');
    return;
  }

  cargarExpedientes(); // ⚡ Se carga al montar

  socket = io(ApiRoutes.urlBase, {
    transports: ['websocket'],
    auth: { token: localStorage.getItem('token') },
  });

  const manejarEvento = (data: any) => {
    if (data.tipo === 'expedientes') {
      console.log('🔁 Evento WebSocket recibido:', data);
      cargarExpedientes(); // Recargar lista
    }
  };

  socket.on('nueva-solicitud', manejarEvento);
  socket.on('actualizar-solicitudes', manejarEvento);
  socket.on('eliminar-solicitud', manejarEvento);

  return () => {
    socket.off('nueva-solicitud', manejarEvento);
    socket.off('actualizar-solicitudes', manejarEvento);
    socket.off('eliminar-solicitud', manejarEvento);
    socket.disconnect();
  };
}, [isAuthenticated, userPermissions, navigate]);


  const handleDelete = async (idExpediente: number) => {
    const confirm = await MySwal.fire({
      title: '¿Eliminar expediente?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${ApiRoutes.urlBase}/expedientes/${idExpediente}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (res.status === 403) {
        return MySwal.fire('Acceso denegado', 'No tienes permisos para realizar esta acción.', 'warning');
      }

      if (!res.ok) throw new Error();

      setExpedientes(prev => prev.filter(exp => exp.idExpediente !== idExpediente));
//      MySwal.fire('¡Eliminado!', 'El expediente ha sido eliminado.', 'success');
Swal.fire({
  icon: 'success',
  title: '¡Eliminada!',
  text: 'La solicitud de expediente ha sido eliminada.',
  timer: 3000,
  showConfirmButton: false,
});

    } catch (error) {
      console.error(error);
      MySwal.fire('Error', 'Hubo un problema al eliminar el expediente.', 'error');
    }
  };

  const filtrados = expedientes.filter(exp => {
    const matchEstado = filtroEstado === 'todos' || exp.status === filtroEstado;
    const matchFecha = !fechaFiltro || exp.Date === formatFechaFiltro(fechaFiltro);
const matchTexto =
  searchBy === 'nombreSolicitante'
    ? exp.nombreSolicitante?.toLowerCase().includes(searchText.toLowerCase())
    : exp.user?.cedula?.toLowerCase().includes(searchText.toLowerCase());

    return matchEstado && matchFecha && matchTexto;
  });

  const totalPaginas = Math.ceil(filtrados.length / itemsPerPage);
  const indexFinal = currentPage * itemsPerPage;
  const indexInicio = indexFinal - itemsPerPage;
  const paginaActual = filtrados.slice(indexInicio, indexFinal);

  if (loading) return <p className="p-4 text-gray-500">Cargando expedientes...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="flex flex-col w-full h-full p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Solicitudes de Copia de Expedientes</h2>

      <SearchFilterBar
        searchPlaceholder="Buscar por nombre o número de expediente..."
        searchText={searchText}
        onSearchTextChange={handleSearchTextChange}
        searchByOptions={[
          { value: 'nombreSolicitante', label: 'Nombre' },
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
              <option value="Aprobado">Aprobado</option>
              <option value="Denegado">Denegado</option>
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
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Estado</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
  {paginaActual.length > 0 ? (
    paginaActual.map(exp => (
      <tr key={exp.idExpediente}>
        <td className="px-4 py-2">{exp.nombreSolicitante || '—'}</td>
        <td className="px-4 py-2">{exp.user?.cedula}</td>
        {/* <td className="px-4 py-2">{exp.Date}</td> */}
        <td className="px-4 py-2">{formatearFechaVisual(exp.Date)}</td>

        <td className="px-4 py-2">
          <span className={`font-semibold px-3 py-1 rounded-full text-sm
            ${exp.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
              exp.status === 'Aprobada' ? 'bg-green-100 text-green-800' :
              exp.status === 'Denegada' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'}`}>
            {exp.status}
          </span>
        </td>
        <td className="px-4 py-2 space-x-2">
          <button
            className="text-blue-600 hover:text-blue-800"
            onClick={() => navigate(`/dashboard/expedientes/${exp.idExpediente}`)}
          >
            <FaEye />
          </button>
          <button
            onClick={() => handleDelete(exp.idExpediente)}
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
        No hay solicitudes de expedientes disponibles.
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
