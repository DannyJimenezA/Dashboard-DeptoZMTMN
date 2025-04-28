// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Prorroga } from '../../Types/Types';
// import Paginacion from '../../Components/Paginacion';
// import FiltroFecha from '../../Components/FiltroFecha';
// import SearchFilterBar from '../../Components/SearchFilterBar';
// import { FaEye, FaTrash } from 'react-icons/fa';
// import Swal from 'sweetalert2';
// import ApiService from '../../Components/ApiService';
// import ApiRoutes from '../../Components/ApiRoutes';
// import { useAuth } from '../../Pages/Auth/useAuth';
// import { io, Socket } from 'socket.io-client';

// export default function ProrrogasTable() {
//   const [prorrogas, setProrrogas] = useState<Prorroga[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [filtroEstado, setFiltroEstado] = useState('todos');
//   const [fechaFiltro, setFechaFiltro] = useState<Date | null>(null);
//   const [searchText, setSearchText] = useState('');
//   const [searchBy, setSearchBy] = useState<'nombre' | 'cedula'>('nombre');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(5);

//   const navigate = useNavigate();
//   const { isAuthenticated, userPermissions } = useAuth();

//   // useEffect(() => {
//   //   if (!isAuthenticated || !userPermissions.includes('ver_prorrogas')) {
//   //     navigate('/unauthorized');
//   //     return;
//   //   }

//   //   const cargarDatos = async () => {
//   //     try {
//   //       const data = await ApiService.get<Prorroga[]>(ApiRoutes.prorrogas);
//   //       setProrrogas(data);
//   //     } catch (err) {
//   //       console.error(err);
//   //       setError('Error al cargar las prórrogas.');
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   cargarDatos();
//   // }, [isAuthenticated, userPermissions, navigate]);

//   useEffect(() => {
//     let socket: Socket | null = null;
  
//     const permisosCargados = isAuthenticated && userPermissions.length > 0;
//     if (!permisosCargados) return;
  
//     if (!userPermissions.includes('ver_prorroga')) {
//       navigate('/unauthorized');
//       return;
//     }
  
//     const cargarDatos = async () => {
//       try {
//         const data = await ApiService.get<Prorroga[]>(ApiRoutes.prorrogas);
//         setProrrogas(data);
//       } catch {
//         setError('Error al cargar las prórrogas.');
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
  
//     socket.on('nueva-prorroga', async (nueva: { id: number }) => {
//       console.log('Nueva prórroga recibida:', nueva);
  
//       try {
//         const prorrogaCompleta = await ApiService.get<Prorroga>(`${ApiRoutes.prorrogas}/${nueva.id}`);
//         setProrrogas(prev => {
//           const yaExiste = prev.some(p => p.id === prorrogaCompleta.id);
//           if (yaExiste) return prev;
//           return [prorrogaCompleta, ...prev];
//         });
//       } catch (error) {
//         console.error('Error cargando prórroga completa', error);
//       }
//     });
  
//     return () => {
//       if (socket) {
//         socket.disconnect();
//       }
//     };
//   }, [isAuthenticated, userPermissions, navigate]);

//   const eliminarProrroga = async (id: number) => {
//     const confirmacion = await Swal.fire({
//       title: '¿Eliminar prórroga?',
//       text: 'Esta acción no se puede deshacer.',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Sí, eliminar',
//       cancelButtonText: 'Cancelar',
//       confirmButtonColor: '#28a745',
//       cancelButtonColor: '#dc3545',
//     });

//     if (!confirmacion.isConfirmed) return;

//     try {
//       await ApiService.delete(`${ApiRoutes.prorrogas}/${id}`);
//       setProrrogas((prev) => prev.filter((p) => p.id !== id));
//       Swal.fire('¡Eliminada!', 'La prórroga fue eliminada correctamente.', 'success');
//     } catch {
//       Swal.fire('Error', 'No se pudo eliminar la prórroga.', 'error');
//     }
//   };

//   const filtradas = prorrogas.filter((p) => {
//     const byEstado = filtroEstado === 'todos' || p.status === filtroEstado;
//     const byFecha = !fechaFiltro || p.Date === fechaFiltro.toISOString().split('T')[0];
//     const byTexto = searchBy === 'nombre'
//       ? p.user?.nombre?.toLowerCase().includes(searchText.toLowerCase())
//       : p.user?.cedula?.toLowerCase().includes(searchText.toLowerCase());
//     return byEstado && byFecha && byTexto;
//   });

//   const totalPaginas = Math.ceil(filtradas.length / itemsPerPage);
//   const inicio = (currentPage - 1) * itemsPerPage;
//   const paginaActual = filtradas.slice(inicio, inicio + itemsPerPage);

//   if (loading) return <p className="p-4 text-gray-500">Cargando prórrogas...</p>;
//   if (error) return <p className="p-4 text-red-500">{error}</p>;

//   return (
//     <div className="flex flex-col w-full h-full p-4">
//       <h2 className="text-2xl font-bold mb-4 text-center">Solicitudes de Prórrogas de Concesiones</h2>

//       <SearchFilterBar
//         searchPlaceholder="Buscar por nombre o cédula..."
//         searchText={searchText}
//         onSearchTextChange={setSearchText}
//         searchByOptions={[
//           { value: 'nombre', label: 'Nombre' },
//           { value: 'cedula', label: 'Cédula' },
//         ]}
//         selectedSearchBy={searchBy}
//         onSearchByChange={(val) => setSearchBy(val as 'nombre' | 'cedula')}
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

//       <div className="flex-1 overflow-auto bg-white shadow-lg rounded-lg mt-4">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50 sticky top-0 z-10">
//             <tr className="bg-gray-200">
//               {/* <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">ID</th> */}
//               <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Nombre</th>
//               <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Cédula</th>
//               <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Fecha</th>
//               <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Estado</th>
//               <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Acciones</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {paginaActual.map((p) => (
//               <tr key={p.id}>
//                 {/* <td className="px-4 py-2">{p.id}</td> */}
//                 <td className="px-4 py-2">{p.user?.nombre || '—'}</td>
//                 <td className="px-4 py-2">{p.user?.cedula || '—'}</td>
//                 <td className="px-4 py-2">{p.Date}</td>
//                 <td className="px-4 py-2">{p.status}</td>
//                 <td className="px-4 py-2 space-x-2">
//                 <button
//   className="button-view"
//   onClick={() => navigate(`/dashboard/prorroga/${p.id}`)}
// >
//   <FaEye />
// </button>
//                   <button className="button-delete" onClick={() => eliminarProrroga(p.id)}>
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
//         totalPages={totalPaginas}
//         itemsPerPage={itemsPerPage}
//         onPageChange={setCurrentPage}
//         onItemsPerPageChange={setItemsPerPage}
//       />
//     </div>
//   );
// }


import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Prorroga } from '../../Types/Types';
import Paginacion from '../../Components/Paginacion';
import FiltroFecha from '../../Components/FiltroFecha';
import SearchFilterBar from '../../Components/SearchFilterBar';
import { FaEye, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import ApiService from '../../Components/ApiService';
import ApiRoutes from '../../Components/ApiRoutes';
import { useAuth } from '../../Pages/Auth/useAuth';
import { io, Socket } from 'socket.io-client';

export default function ProrrogasTable() {
  const [prorrogas, setProrrogas] = useState<Prorroga[]>([]);
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

  const cargarProrrogas = async () => {
    try {
      const data = await ApiService.get<Prorroga[]>(ApiRoutes.prorrogas);
      setProrrogas(data);
    } catch (error) {
      console.error('Error cargando prórrogas', error);
      setError('Error al cargar las prórrogas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !userPermissions.includes('ver_prorrogas')) {
      navigate('/unauthorized');
      return;
    }

    cargarProrrogas();

    const socket: Socket = io(ApiRoutes.urlBase, {
      transports: ['websocket'],
      auth: {
        token: localStorage.getItem('token'),
      },
    });

    // 🚀 Escuchar cuando llega una nueva prórroga
    socket.on('nueva-solicitud', (data) => {
      if (data.tipo === 'prorrogas') {
        cargarProrrogas(); // 🔥 recargar automáticamente
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated, userPermissions, navigate]);

  const eliminarProrroga = async (id: number) => {
    const confirmacion = await Swal.fire({
      title: '¿Eliminar prórroga?',
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
      await ApiService.delete(`${ApiRoutes.prorrogas}/${id}`);
      setProrrogas(prev => prev.filter(p => p.id !== id));
      Swal.fire('¡Eliminada!', 'La prórroga fue eliminada correctamente.', 'success');
    } catch {
      Swal.fire('Error', 'No se pudo eliminar la prórroga.', 'error');
    }
  };

  const filtradas = prorrogas.filter((p) => {
    const byEstado = filtroEstado === 'todos' || p.status === filtroEstado;
    const byFecha = !fechaFiltro || p.Date === fechaFiltro.toISOString().split('T')[0];
    const byTexto = searchBy === 'nombre'
      ? p.user?.nombre?.toLowerCase().includes(searchText.toLowerCase())
      : p.user?.cedula?.toLowerCase().includes(searchText.toLowerCase());
    return byEstado && byFecha && byTexto;
  });

  const totalPaginas = Math.ceil(filtradas.length / itemsPerPage);
  const inicio = (currentPage - 1) * itemsPerPage;
  const paginaActual = filtradas.slice(inicio, inicio + itemsPerPage);

  if (loading) return <p className="p-4 text-gray-500">Cargando prórrogas...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="flex flex-col w-full h-full p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Solicitudes de Prórrogas de Concesiones</h2>

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

      <div className="flex-1 overflow-auto bg-white shadow-lg rounded-lg mt-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-0">
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Nombre</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Cédula</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Fecha</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Estado</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginaActual.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-2">{p.user?.nombre || '—'}</td>
                <td className="px-4 py-2">{p.user?.cedula || '—'}</td>
                <td className="px-4 py-2">{p.Date}</td>
                <td className="px-4 py-2">{p.status}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    className="button-view"
                    onClick={() => navigate(`/dashboard/prorroga/${p.id}`)}
                  >
                    <FaEye />
                  </button>
                  <button
                    className="button-delete"
                    onClick={() => eliminarProrroga(p.id)}
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
        totalPages={totalPaginas}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />
    </div>
  );
}
