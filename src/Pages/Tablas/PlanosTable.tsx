import { useState, useEffect } from 'react';
import { RevisionPlano } from '../../Types/Types';
import Paginacion from '../../Components/Paginacion';
import FiltroFecha from '../../Components/FiltroFecha';
import SearchFilterBar from '../../Components/SearchFilterBar';
import { FaEye, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ApiRoutes from '../../Components/ApiRoutes';
import Swal from 'sweetalert2';
import { useAuth } from '../../Pages/Auth/useAuth';
import { io, Socket } from 'socket.io-client';
import ApiService from '../../Components/ApiService';

export default function PlanosTable() {
  const [planos, setPlanos] = useState<RevisionPlano[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState('Pendiente');
  const [fechaFiltro, setFechaFiltro] = useState<Date | null>(null);
  const [searchText, setSearchText] = useState('');
  const [searchBy, setSearchBy] = useState<'nombre' | 'cedula'>('nombre');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [fechasDisponibles, setFechasDisponibles] = useState<string[]>([]);


  const navigate = useNavigate();
  const { isAuthenticated, userPermissions } = useAuth();

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

useEffect(() => {
  let socket: Socket | null = null;

  if (!isAuthenticated || !userPermissions.includes('ver_revisionplano')) {
    navigate('/unauthorized');
    return;
  }

  const cargarDatos = async () => {
    try {
      const data = await ApiService.get<RevisionPlano[]>(ApiRoutes.planos);
      setPlanos(data);
      const fechasUnicas = Array.from(new Set(data.map(p => p.Date))).sort();
      setFechasDisponibles(fechasUnicas);
    } catch {
      setError('Error al cargar las revisiones de planos.');
    } finally {
      setLoading(false);
    }
  };

  cargarDatos(); // 👈 carga inicial

  socket = io(ApiRoutes.urlBase, {
    transports: ['websocket'],
    auth: {
      token: localStorage.getItem('token'),
    },
  });

  const manejarEvento = (data: any) => {
    if (data.tipo === 'planos') {
      console.log('📡 WebSocket evento (planos):', data);
      cargarDatos();
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



  const eliminarRevisionPlano = async (id: number) => {
    const confirmacion = await Swal.fire({
      title: '¿Eliminar solicitud de revisión de plano?',
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
      const response = await fetch(`${ApiRoutes.urlBase}/revision-plano/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (response.status === 403) {
        return Swal.fire('Permiso denegado', 'No tienes permisos para realizar esta acción.', 'warning');
      }
  
      if (!response.ok) throw new Error();
  
      setPlanos(prev => prev.filter(p => p.id !== id));
      //Swal.fire('¡Eliminada!', 'La solicitud fue eliminada correctamente.', 'success');

    Swal.fire({
  icon: 'success',
  title: '¡Eliminada!',
  text: 'La solicitud de revisión de plano ha sido eliminada.',
  timer: 3000,
  showConfirmButton: false,
});

    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'No se pudo eliminar la solicitud.', 'error');
    }
  };
  

  const planosFiltrados = planos.filter((plano) => {
    const matchEstado = filtroEstado === 'todos' || plano.status === filtroEstado;
    // const matchFecha = !fechaFiltro || plano.Date === fechaFiltro.toISOString().split('T')[0];
    const matchFecha = !fechaFiltro || plano.Date === formatFechaFiltro(fechaFiltro);

    const matchTexto = searchBy === 'nombre'
      ? plano.user?.nombre?.toLowerCase().includes(searchText.toLowerCase())
      : plano.user?.cedula?.toLowerCase().includes(searchText.toLowerCase());

    return matchEstado && matchFecha && matchTexto;
  });

  const indexUltima = currentPage * itemsPerPage;
  const indexPrimera = indexUltima - itemsPerPage;
  const planosActuales = planosFiltrados.slice(indexPrimera, indexUltima);
  const totalPages = Math.ceil(planosFiltrados.length / itemsPerPage);

  if (loading) return <p className="p-4 text-gray-500">Cargando solicitudes de revisión de planos...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="flex flex-col w-full h-full p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Solicitudes de Revisión de Planos</h2>

      <SearchFilterBar
        searchPlaceholder="Buscar por nombre o identificación..."
        searchText={searchText}
        onSearchTextChange={setSearchText}
        searchByOptions={[
          { value: 'nombre', label: 'Nombre' },
          { value: 'cedula', label: 'Identificación' },
        ]}
        selectedSearchBy={searchBy}
        onSearchByChange={(val) => setSearchBy(val as 'nombre' | 'cedula')}
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

      <div className="flex-1 overflow-auto bg-white shadow-lg rounded-lg max-h-[70vh] mt-4">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          <thead className="bg-gray-50 sticky top-0 z-0">
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Nombre </th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Identificación </th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Fecha </th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Estado</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
  {planosActuales.length > 0 ? (
    planosActuales.map((plano) => (
      <tr key={plano.id}>
        <td className="px-4 py-2">{plano.user?.nombre || '—'}</td>
        <td className="px-4 py-2">{plano.user?.cedula || '—'}</td>
        {/* <td className="px-4 py-2">{plano.Date}</td> */}
        <td className="px-4 py-2">{formatearFechaVisual(plano.Date)}</td>

        <td className="px-4 py-2">
          <span className={`font-semibold px-3 py-1 rounded-full text-sm
            ${plano.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
              plano.status === 'Aprobada' ? 'bg-green-100 text-green-800' :
              plano.status === 'Denegada' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'}`}>
            {plano.status}
          </span>
        </td>
        <td className="px-4 py-2 space-x-2">
          <button
            className="text-blue-600 hover:text-blue-800"
            onClick={() => navigate(`/dashboard/plano/${plano.id}`)}
          >
            <FaEye />
          </button>
          <button
            onClick={() => eliminarRevisionPlano(plano.id)}
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
        No hay solicitudes de revisión de planos disponibles.
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
