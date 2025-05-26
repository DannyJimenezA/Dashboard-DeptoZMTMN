import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Denuncia } from '../../Types/Types';
import Paginacion from '../../Components/Paginacion';
import FiltroFecha from '../../Components/FiltroFecha';
import SearchFilterBar from '../../Components/SearchFilterBar';
import { FaEye, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import ApiService from '../../Components/ApiService';
import ApiRoutes from '../../Components/ApiRoutes';
import { useAuth } from '../Auth/useAuth';
import { io, Socket } from 'socket.io-client'; // 🔥

export default function DenunciasTable() {
  const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState('Pendiente');
  const [fechaFiltro, setFechaFiltro] = useState<Date | null>(null);
  const [searchText, setSearchText] = useState('');
  const [searchBy, setSearchBy] = useState<'nombreDenunciante' | 'cedulaDenunciante'>('nombreDenunciante');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const fechasConDenuncia = Array.from(new Set(denuncias.map(d => d.Date))).sort();



  const navigate = useNavigate();
  const { isAuthenticated, userPermissions } = useAuth();

  const formatFechaFiltro = (fecha: Date | null): string | null => {
    if (!fecha) return null;

    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  function formatearFechaVisual(fechaISO: string): string {
  const [year, month, day] = fechaISO.split('-');
  return `${day}/${month}/${year}`;
}


  // 🚀 Función para cargar las denuncias
  const fetchDenuncias = async () => {
    try {
      const data = await ApiService.get<Denuncia[]>(ApiRoutes.denuncias);
      setDenuncias(data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar las denuncias.');
    } finally {
      setLoading(false);
    }
  };


useEffect(() => {
  if (!isAuthenticated || !userPermissions.includes('ver_denuncia')) {
    navigate('/unauthorized');
    return;
  }

  fetchDenuncias(); // 🔄 Cargar al entrar

  const socket: Socket = io(ApiRoutes.urlBase, {
    transports: ['websocket'],
    auth: { token: localStorage.getItem('token') },
  });

  // 👂 Manejo unificado de eventos por tipo
  const actualizarTabla = (data: any) => {
    if (data.tipo === 'denuncias') {
      console.log('📡 Evento WebSocket recibido:', data);
      fetchDenuncias();
    }
  };

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


  const eliminarDenuncia = async (id: number) => {
    const confirmacion = await Swal.fire({
      title: '¿Eliminar denuncia?',
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
      const response = await fetch(`${ApiRoutes.urlBase}/denuncia/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 403) {
        Swal.fire('Acceso Denegado', 'No tienes permisos para realizar esta acción.', 'warning');
        return;
      }

      if (!response.ok) throw new Error('Error al eliminar');

      setDenuncias(prev => prev.filter(d => d.id !== id));
      // Swal.fire('Eliminada', 'La denuncia fue eliminada correctamente.', 'success');
      Swal.fire({
        icon: 'success',
        title: '¡Eliminada!',
        text: 'La denuncia ha sido eliminada.',
        timer: 3000,
        showConfirmButton: false,
      });

    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'No se pudo eliminar la denuncia.', 'error');
    }
  };


  const filtradas = denuncias.filter((d) => {
    const byEstado = filtroEstado === 'todos' || d.status === filtroEstado;
    // const byFecha = !fechaFiltro || d.Date === fechaFiltro.toISOString().split('T')[0];
    const byFecha = !fechaFiltro || d.Date === formatFechaFiltro(fechaFiltro);



    const byTexto = searchBy === 'nombreDenunciante'
      ? d.nombreDenunciante?.toLowerCase().includes(searchText.toLowerCase())
      : d.cedulaDenunciante?.toLowerCase().includes(searchText.toLowerCase());

    return byEstado && byFecha && byTexto;
  });

  const totalPaginas = Math.ceil(filtradas.length / itemsPerPage);
  const indexInicio = (currentPage - 1) * itemsPerPage;
  const paginaActual = filtradas.slice(indexInicio, indexInicio + itemsPerPage);

  if (loading) return <p className="p-4 text-gray-500">Cargando denuncias...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="flex flex-col w-full h-full p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Listado de Denuncias</h2>

      <SearchFilterBar
        searchPlaceholder="Buscar por nombre o identificación..."
        searchText={searchText}
        onSearchTextChange={setSearchText}
        searchByOptions={[
          { value: 'nombreDenunciante', label: 'Nombre' },
          { value: 'cedulaDenunciante', label: 'Identificación' },
        ]}
        selectedSearchBy={searchBy}
        onSearchByChange={(val) => setSearchBy(val as 'nombreDenunciante' | 'cedulaDenunciante')}
        extraFilters={
          <div className="flex flex-wrap items-end gap-2">
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="text-sm py-2 px-3 border border-gray-300 rounded-md w-44"
            >
              <option value="todos">Todos</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Aprobada">Atendida</option>
              <option value="Denegada">Denegada</option>
            </select>
            {/* <FiltroFecha fechaFiltro={fechaFiltro} onChangeFecha={setFechaFiltro} /> */}
            <FiltroFecha
              fechaFiltro={fechaFiltro}
              onChangeFecha={setFechaFiltro}
              fechasDisponibles={fechasConDenuncia}
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
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Tipo</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Lugar</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Estado</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Acciones</th>
            </tr>
          </thead>
       
          <tbody className="divide-y divide-gray-200">
  {paginaActual.length > 0 ? (
    paginaActual.map((d) => (
      <tr key={d.id}>
        <td className="px-4 py-2">{d.nombreDenunciante || 'Anónimo'}</td>
        <td className="px-4 py-2">{d.cedulaDenunciante || 'Anónimo'}</td>
        {/* <td className="px-4 py-2">{d.Date}</td> */}
        <td className="px-4 py-2">{formatearFechaVisual(d.Date)}</td>

        <td className="px-4 py-2">{d.tipoDenuncia?.descripcion || '—'}</td>
        <td className="px-4 py-2">{d.lugarDenuncia?.descripcion || '—'}</td>
        <td className="px-4 py-2">
          <span className={`font-semibold px-3 py-1 rounded-full text-sm
            ${d.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
              d.status === 'Aprobada' ? 'bg-green-100 text-green-800' :
              d.status === 'Denegada' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'}`}>
            {d.status === 'Aprobada' ? 'Atendida' : d.status}
          </span>
        </td>
        <td className="px-4 py-2 space-x-2">
          <button className="text-blue-600 hover:text-blue-800" onClick={() => navigate(`/dashboard/denuncia/${d.id}`)}>
            <FaEye />
          </button>
          <button className="text-red-600 hover:text-red-800" onClick={() => eliminarDenuncia(d.id)}>
            <FaTrash />
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={7} className="p-4 text-center text-gray-500">
        No hay denuncias disponibles.
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
