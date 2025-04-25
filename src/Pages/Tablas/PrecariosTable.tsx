import { useState, useEffect } from 'react';
import { Precario } from '../../Types/Types';
import Paginacion from '../../Components/Paginacion';
import FiltroFecha from '../../Components/FiltroFecha';
import SearchFilterBar from '../../Components/SearchFilterBar';
import { FaEye, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ApiRoutes from '../../Components/ApiRoutes';
import Swal from 'sweetalert2';
import { useAuth } from '../../Pages/Auth/useAuth';

export default function PrecariosTable() {
  const [precarios, setPrecarios] = useState<Precario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [fechaFiltro, setFechaFiltro] = useState<Date | null>(null);
  const [searchText, setSearchText] = useState('');
  const [searchBy, setSearchBy] = useState('nombre');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const navigate = useNavigate();
  const { isAuthenticated, userPermissions } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !userPermissions.includes('ver_precario')) {
      navigate('/unauthorized');
      return;
    }

    const obtenerPrecarios = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(ApiRoutes.precarios, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setPrecarios(data);
      } catch (err) {
        console.error('Error al obtener los precarios:', err);
        setError('Error al cargar los precarios.');
      } finally {
        setLoading(false);
      }
    };

    obtenerPrecarios();
  }, [isAuthenticated, userPermissions, navigate]);

  const eliminarPrecario = async (id: number) => {
    const confirmacion = await Swal.fire({
      title: '¿Eliminar solicitud de uso precario?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545',
    });

    if (confirmacion.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${ApiRoutes.precarios}/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Error al eliminar la solicitud');

        Swal.fire('¡Eliminada!', 'La solicitud fue eliminada correctamente.', 'success');
        setPrecarios((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        Swal.fire('Error', 'No se pudo eliminar la solicitud.', 'error');
      }
    }
  };

  const obtenerPrecariosFiltrados = () => {
    let filtrados = precarios;

    if (filtroEstado !== 'todos') {
      filtrados = filtrados.filter((p) => p.status === filtroEstado);
    }

    if (fechaFiltro) {
      const fechaSeleccionada = fechaFiltro.toISOString().split('T')[0];
      filtrados = filtrados.filter((p) => p.Date === fechaSeleccionada);
    }

    if (searchText) {
      filtrados = filtrados.filter((p) =>
        searchBy === 'nombre'
          ? p.user?.nombre?.toLowerCase().includes(searchText.toLowerCase())
          : p.user?.cedula?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    return filtrados;
  };

  const precariosFiltrados = obtenerPrecariosFiltrados();
  const indexUltima = currentPage * itemsPerPage;
  const indexPrimera = indexUltima - itemsPerPage;
  const precariosActuales = precariosFiltrados.slice(indexPrimera, indexUltima);
  const numeroPaginas = Math.ceil(precariosFiltrados.length / itemsPerPage);

  if (loading) return <p>Cargando solicitudes de uso precario...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col w-full h-full p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Solicitudes de Uso Precario</h2>

      <SearchFilterBar
        searchPlaceholder="Buscar por nombre o cédula..."
        searchText={searchText}
        onSearchTextChange={setSearchText}
        searchByOptions={[
          { value: 'nombre', label: 'Nombre' },
          { value: 'cedula', label: 'Cédula' },
        ]}
        selectedSearchBy={searchBy}
        onSearchByChange={setSearchBy}
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

            <FiltroFecha fechaFiltro={fechaFiltro} onChangeFecha={setFechaFiltro} />
          </div>
        }
      />

      <div className="flex-1 overflow-auto bg-white shadow-lg rounded-lg max-h-[70vh]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="bg-gray-200">
              {/* <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">ID</th> */}
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Nombre Solicitante</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Cédula Solicitante</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Fecha</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Estado</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {precariosActuales.map((precario) => (
              <tr key={precario.id}>
                {/* <td className="px-4 py-2">{precario.id}</td> */}
                <td className="px-4 py-2">{precario.user?.nombre}</td>
                <td className="px-4 py-2">{precario.user?.cedula}</td>
                <td className="px-4 py-2">{precario.Date}</td>
                <td className="px-4 py-2">{precario.status}</td>
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => console.log(precario)} className="button-view">
                    <FaEye />
                  </button>
                  <button onClick={() => eliminarPrecario(precario.id)} className="button-delete">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Paginacion
        currentPage={currentPage}
        totalPages={numeroPaginas}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />
    </div>
  );
}
