// src/Pages/UsuarioSolicitudes/AppointmentTable.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaEye, FaTrash } from 'react-icons/fa';
import { useAuth } from '../Auth/useAuth';
import { Cita } from '../../Types/Types';
import ApiService from '../../Components/ApiService';
import ApiRoutes from '../../Components/ApiRoutes';
import SearchFilterBar from '../../Components/SearchFilterBar';
import FiltroFecha from '../../Components/FiltroFecha';
import Paginacion from '../../Components/Paginacion';

export default function AppointmentTable() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [fechaFiltro, setFechaFiltro] = useState<Date | null>(null);
  const [searchText, setSearchText] = useState('');
  const [searchBy, setSearchBy] = useState<'nombre' | 'cedula'>('nombre');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const { isAuthenticated, userPermissions } = useAuth();
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!isAuthenticated || !userPermissions?.includes('ver_appointments')) {
  //     navigate('/unauthorized');
  //     return;
  //   }

  //   const fetchData = async () => {
  //     try {
  //       const data = await ApiService.get<Cita[]>(ApiRoutes.citas.crearcita);
  //       setCitas(data);
  //     } catch {
  //       setError('Error al cargar las citas');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [isAuthenticated, userPermissions, navigate]);

  useEffect(() => {
    const permisosCargados = isAuthenticated && userPermissions.length > 0;
  
    if (!permisosCargados) return;
  
    if (!userPermissions.includes('ver_appointments')) {
      navigate('/unauthorized');
      return;
    }
  
    const fetchData = async () => {
      try {
        const data = await ApiService.get<Cita[]>(ApiRoutes.citas.crearcita);
        setCitas(data);
      } catch {
        setError('Error al cargar las citas');
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
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
      await ApiService.delete(`${ApiRoutes.citas.crearcita}/${id}`);
      Swal.fire('¡Eliminada!', 'La cita ha sido eliminada.', 'success');
      setCitas((prev) => prev.filter((c) => c.id !== id));
    } catch {
      Swal.fire('Error', 'No se pudo eliminar la cita.', 'error');
    }
  };

  if (!isAuthenticated || userPermissions.length === 0) {
    return <p className="text-center text-gray-500 p-4">Verificando permisos...</p>;
  }

  if (loading) return <p className="text-gray-500 p-4">Cargando citas...</p>;
  if (error) return <p className="text-red-500 p-4">{error}</p>;

  const citasFiltradas = citas.filter((cita) => {
    const matchEstado = filtroEstado === 'todos' || cita.status === filtroEstado;
    const matchFecha = !fechaFiltro || cita.availableDate?.date === fechaFiltro.toISOString().split('T')[0];
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
        searchPlaceholder="Buscar por nombre o cédula..."
        searchText={searchText}
        onSearchTextChange={setSearchText}
        searchByOptions={[
          { value: 'nombre', label: 'Nombre' },
          { value: 'cedula', label: 'Cédula' },
        ]}
        selectedSearchBy={searchBy}
        // onSearchByChange={setSearchBy}
        onSearchByChange={(val: string) => setSearchBy(val as 'nombre' | 'cedula')}

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
              <option value="Cancelada">Cancelada</option>
            </select>
            <FiltroFecha fechaFiltro={fechaFiltro} onChangeFecha={setFechaFiltro} />
          </div>
        }
      />

      <div className="flex-1 overflow-auto bg-white shadow-lg rounded-lg mt-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="bg-gray-200">
              {/* <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">ID</th> */}
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Nombre</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Cédula</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Fecha y Hora</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Estado</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {citasActuales.map((cita) => (
              <tr key={cita.id}>
                {/* <td className="px-4 py-2">{cita.id}</td> */}
                <td className="px-4 py-2">{cita.user?.nombre ?? '-'}</td>
                <td className="px-4 py-2">{cita.user?.cedula ?? '-'}</td>
                <td className="px-4 py-2">{`${cita.availableDate?.date ?? '-'} ${cita.horaCita?.hora ?? ''}`}</td>
                <td className="px-4 py-2">{cita.status}</td>
                <td className="px-4 py-2 space-x-2">
                  {/* <button className="button-view" onClick={() => Swal.fire(JSON.stringify(cita, null, 2))}>
                    <FaEye />
                  </button> */}
                  <button className="button-view" onClick={() => navigate(`/dashboard/citas/${cita.id}`)}>
  <FaEye />
</button>

                  <button className="button-delete" onClick={() => eliminarCita(cita.id)}>
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
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />
    </div>
  );
}
