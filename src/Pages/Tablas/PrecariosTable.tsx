// import { useState, useEffect } from 'react';
// import { Precario } from '../../Types/Types';
// import Paginacion from '../../Components/Paginacion';
// import FiltroFecha from '../../Components/FiltroFecha';
// import SearchFilterBar from '../../Components/SearchFilterBar';
// import { FaEye, FaTrash } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import ApiRoutes from '../../Components/ApiRoutes';
// import Swal from 'sweetalert2';
// import { useAuth } from '../../Pages/Auth/useAuth';
// import { io, Socket } from 'socket.io-client';
// import ApiService from '../../Components/ApiService';


// export default function PrecariosTable() {
//   const [precarios, setPrecarios] = useState<Precario[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [filtroEstado, setFiltroEstado] = useState('todos');
//   const [fechaFiltro, setFechaFiltro] = useState<Date | null>(null);
//   const [searchText, setSearchText] = useState('');
//   const [searchBy, setSearchBy] = useState('nombre');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(5);

//   const navigate = useNavigate();
//   const { isAuthenticated, userPermissions } = useAuth();

//   // useEffect(() => {
//   //   if (!isAuthenticated || !userPermissions.includes('ver_precario')) {
//   //     navigate('/unauthorized');
//   //     return;
//   //   }

//   //   const obtenerPrecarios = async () => {
//   //     try {
//   //       const token = localStorage.getItem('token');
//   //       const response = await fetch(ApiRoutes.precarios, {
//   //         headers: {
//   //           'Authorization': `Bearer ${token}`,
//   //         },
//   //       });
//   //       const data = await response.json();
//   //       setPrecarios(data);
//   //     } catch (err) {
//   //       console.error('Error al obtener los precarios:', err);
//   //       setError('Error al cargar los precarios.');
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   obtenerPrecarios();
//   // }, [isAuthenticated, userPermissions, navigate]);

//   useEffect(() => {
//     let socket: Socket | null = null;
  
//     const permisosCargados = isAuthenticated && userPermissions.length > 0;
//     if (!permisosCargados) return;
  
//     if (!userPermissions.includes('ver_precario')) {
//       navigate('/unauthorized');
//       return;
//     }
  
//     const cargarDatos = async () => {
//       try {
//         const data = await ApiService.get<Precario[]>(ApiRoutes.precarios);
//         setPrecarios(data);
//       } catch {
//         setError('Error al cargar precarios.');
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     cargarDatos();
  
//     socket = io(ApiRoutes.urlBase, {
//       transports: ['websocket'],
//       auth: {
//         token: localStorage.getItem('token'),
//       },
//     });
  
//     socket.on('nuevo-precario', async (nuevo: { id: number }) => {
//       console.log('Nuevo precario recibido:', nuevo);
  
//       try {
//         const precarioCompleto = await ApiService.get<Precario>(`${ApiRoutes.precarios}/${nuevo.id}`);
//         setPrecarios(prev => {
//           const yaExiste = prev.some(p => p.id === precarioCompleto.id);
//           if (yaExiste) return prev;
//           return [precarioCompleto, ...prev];
//         });
//       } catch (error) {
//         console.error('Error trayendo precario completo', error);
//       }
//     });
  
//     return () => {
//       if (socket) {
//         socket.disconnect();
//       }
//     };
//   }, [isAuthenticated, userPermissions, navigate]);

//   const eliminarPrecario = async (id: number) => {
//     const confirmacion = await Swal.fire({
//       title: '¿Eliminar solicitud de uso precario?',
//       text: 'Esta acción no se puede deshacer.',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Sí, eliminar',
//       cancelButtonText: 'Cancelar',
//       confirmButtonColor: '#28a745',
//       cancelButtonColor: '#dc3545',
//     });

//     if (confirmacion.isConfirmed) {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await fetch(`${ApiRoutes.precarios}/${id}`, {
//           method: 'DELETE',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) throw new Error('Error al eliminar la solicitud');

//         Swal.fire('¡Eliminada!', 'La solicitud fue eliminada correctamente.', 'success');
//         setPrecarios((prev) => prev.filter((p) => p.id !== id));
//       } catch (err) {
//         Swal.fire('Error', 'No se pudo eliminar la solicitud.', 'error');
//       }
//     }
//   };

//   const obtenerPrecariosFiltrados = () => {
//     let filtrados = precarios;

//     if (filtroEstado !== 'todos') {
//       filtrados = filtrados.filter((p) => p.status === filtroEstado);
//     }

//     if (fechaFiltro) {
//       const fechaSeleccionada = fechaFiltro.toISOString().split('T')[0];
//       filtrados = filtrados.filter((p) => p.Date === fechaSeleccionada);
//     }

//     if (searchText) {
//       filtrados = filtrados.filter((p) =>
//         searchBy === 'nombre'
//           ? p.user?.nombre?.toLowerCase().includes(searchText.toLowerCase())
//           : p.user?.cedula?.toLowerCase().includes(searchText.toLowerCase())
//       );
//     }

//     return filtrados;
//   };

//   const precariosFiltrados = obtenerPrecariosFiltrados();
//   const indexUltima = currentPage * itemsPerPage;
//   const indexPrimera = indexUltima - itemsPerPage;
//   const precariosActuales = precariosFiltrados.slice(indexPrimera, indexUltima);
//   const numeroPaginas = Math.ceil(precariosFiltrados.length / itemsPerPage);

//   if (loading) return <p>Cargando solicitudes de uso precario...</p>;
//   if (error) return <p>Error: {error}</p>;

//   return (
//     <div className="flex flex-col w-full h-full p-4">
//       <h2 className="text-2xl font-bold mb-4 text-center">Solicitudes de Uso Precario</h2>

//       <SearchFilterBar
//         searchPlaceholder="Buscar por nombre o cédula..."
//         searchText={searchText}
//         onSearchTextChange={setSearchText}
//         searchByOptions={[
//           { value: 'nombre', label: 'Nombre' },
//           { value: 'cedula', label: 'Cédula' },
//         ]}
//         selectedSearchBy={searchBy}
//         onSearchByChange={setSearchBy}
//         extraFilters={
//           <div className="flex flex-wrap items-end gap-2">
//             <select
//               value={filtroEstado}
//               onChange={(e) => setFiltroEstado(e.target.value)}
//               className="text-sm py-2 px-3 border border-gray-300 rounded-md w-44"
//             >
//               <option value="todos">Todos</option>
//               <option value="Pendiente">Pendiente</option>
//               <option value="Aprobada">Aprobada</option>
//               <option value="Denegada">Denegada</option>
//             </select>

//             <FiltroFecha fechaFiltro={fechaFiltro} onChangeFecha={setFechaFiltro} />
//           </div>
//         }
//       />

//       <div className="flex-1 overflow-auto bg-white shadow-lg rounded-lg max-h-[70vh]">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50 sticky top-0 z-10">
//             <tr className="bg-gray-200">
//               {/* <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">ID</th> */}
//               <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Nombre Solicitante</th>
//               <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Cédula Solicitante</th>
//               <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Fecha</th>
//               <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Estado</th>
//               <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Acciones</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {precariosActuales.map((precario) => (
//               <tr key={precario.id}>
//                 {/* <td className="px-4 py-2">{precario.id}</td> */}
//                 <td className="px-4 py-2">{precario.user?.nombre}</td>
//                 <td className="px-4 py-2">{precario.user?.cedula}</td>
//                 <td className="px-4 py-2">{precario.Date}</td>
//                 <td className="px-4 py-2">{precario.status}</td>
//                 <td className="px-4 py-2 space-x-2">
//                 <button
//   className="button-view"
//   onClick={() => navigate(`/dashboard/precario/${precario.id}`)}
// >
//   <FaEye />
// </button>
//                   <button onClick={() => eliminarPrecario(precario.id)} className="button-delete">
//                     <FaTrash />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <Paginacion
//         currentPage={currentPage}
//         totalPages={numeroPaginas}
//         itemsPerPage={itemsPerPage}
//         onPageChange={setCurrentPage}
//         onItemsPerPageChange={setItemsPerPage}
//       />
//     </div>
//   );
// }


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
import { io, Socket } from 'socket.io-client';
import ApiService from '../../Components/ApiService';

export default function PrecariosTable() {
  const [precarios, setPrecarios] = useState<Precario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [fechaFiltro, setFechaFiltro] = useState<Date | null>(null);
  const [searchText, setSearchText] = useState('');
  const [searchBy, setSearchBy] = useState<'nombre' | 'cedula'>('nombre');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const navigate = useNavigate();
  const { isAuthenticated, userPermissions } = useAuth();

  const cargarPrecarios = async () => {
    try {
      const data = await ApiService.get<Precario[]>(ApiRoutes.precarios);
      setPrecarios(data);
    } catch {
      setError('Error al cargar precarios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let socket: Socket | null = null;

    if (!isAuthenticated || !userPermissions.includes('ver_precario')) {
      navigate('/unauthorized');
      return;
    }

    cargarPrecarios();

    socket = io(ApiRoutes.urlBase, {
      transports: ['websocket'],
      auth: {
        token: localStorage.getItem('token'),
      },
    });

    // 🔥 Escuchamos nueva solicitud de precario
    socket.on('nueva-solicitud', (data) => {
      if (data.tipo === 'usoPrecario') {
        cargarPrecarios();
      }
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, [isAuthenticated, userPermissions, navigate]);

  const eliminarPrecario = async (id: number) => {
    const confirm = await Swal.fire({
      title: '¿Eliminar solicitud de uso precario?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545',
    });

    if (!confirm.isConfirmed) return;

    try {
      await ApiService.delete(`${ApiRoutes.precarios}/${id}`);
      setPrecarios(prev => prev.filter(p => p.id !== id));
      Swal.fire('¡Eliminada!', 'La solicitud fue eliminada correctamente.', 'success');
    } catch {
      Swal.fire('Error', 'No se pudo eliminar la solicitud.', 'error');
    }
  };

  const precariosFiltrados = precarios.filter(p => {
    const matchEstado = filtroEstado === 'todos' || p.status === filtroEstado;
    const matchFecha = !fechaFiltro || p.Date === fechaFiltro.toISOString().split('T')[0];
    const matchTexto = searchBy === 'nombre'
      ? p.user?.nombre?.toLowerCase().includes(searchText.toLowerCase())
      : p.user?.cedula?.toLowerCase().includes(searchText.toLowerCase());

    return matchEstado && matchFecha && matchTexto;
  });

  const indexUltima = currentPage * itemsPerPage;
  const indexPrimera = indexUltima - itemsPerPage;
  const paginaActual = precariosFiltrados.slice(indexPrimera, indexUltima);
  const numeroPaginas = Math.ceil(precariosFiltrados.length / itemsPerPage);

  if (loading) return <p className="p-4 text-gray-500">Cargando solicitudes de uso precario...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

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
            <FiltroFecha fechaFiltro={fechaFiltro} onChangeFecha={setFechaFiltro} />
          </div>
        }
      />

      <div className="flex-1 overflow-auto bg-white shadow-lg rounded-lg max-h-[70vh]">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          <thead className="bg-gray-50 sticky top-0 z-0">
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Nombre</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Cédula Solicitante</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Fecha</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Estado</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginaActual.map(precario => (
              <tr key={precario.id}>
                <td className="px-4 py-2">{precario.user?.nombre || '-'}</td>
                <td className="px-4 py-2">{precario.user?.cedula || '-'}</td>
                <td className="px-4 py-2">{precario.Date}</td>
                <td className="px-4 py-2">{precario.status || 'Pendiente'}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    className="button-view"
                    onClick={() => navigate(`/dashboard/precario/${precario.id}`)}
                  >
                    <FaEye />
                  </button>
                  <button
                    className="button-delete"
                    onClick={() => eliminarPrecario(precario.id)}
                  >
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
