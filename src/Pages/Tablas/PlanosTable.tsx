// import { useState, useEffect } from 'react';
// import { RevisionPlano } from '../../Types/Types';
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

// export default function PlanosTable() {
//   const [planos, setPlanos] = useState<RevisionPlano[]>([]);
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
//   //   if (!isAuthenticated || !userPermissions.includes('ver_revisionplano')) {
//   //     navigate('/unauthorized');
//   //     return;
//   //   }

//   //   const obtenerRevisionplano = async () => {
//   //     try {
//   //       const token = localStorage.getItem('token');
//   //       const response = await fetch(ApiRoutes.planos, {
//   //         headers: {
//   //           Authorization: `Bearer ${token}`,
//   //         },
//   //       });

//   //       const data = await response.json();
//   //       setPlanos(data);
//   //     } catch (err) {
//   //       console.error('Error al obtener las solicitudes:', err);
//   //       setError('Error al cargar las solicitudes de revisión de planos.');
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   obtenerRevisionplano();
//   // }, [isAuthenticated, userPermissions, navigate]);

//   useEffect(() => {
//     let socket: Socket | null = null;
  
//     const permisosCargados = isAuthenticated && userPermissions.length > 0;
//     if (!permisosCargados) return;
  
//     if (!userPermissions.includes('ver_revisionplano')) {
//       navigate('/unauthorized');
//       return;
//     }
  
//     const cargarDatos = async () => {
//       try {
//         const data = await ApiService.get<RevisionPlano[]>(ApiRoutes.planos);
//         setPlanos(data);
//       } catch {
//         setError('Error al cargar las revisiones de planos.');
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
  
//     socket.on('nuevo-plano', async (nuevo: { id: number }) => {
//       console.log('Nuevo plano recibido:', nuevo);
  
//       try {
//         const planoCompleto = await ApiService.get<RevisionPlano>(`${ApiRoutes.planos}/${nuevo.id}`);
//         setPlanos(prev => {
//           const yaExiste = prev.some(p => p.id === planoCompleto.id);
//           if (yaExiste) return prev;
//           return [planoCompleto, ...prev];
//         });
//       } catch (error) {
//         console.error('Error trayendo plano completo', error);
//       }
//     });
  
//     return () => {
//       if (socket) {
//         socket.disconnect();
//       }
//     };
//   }, [isAuthenticated, userPermissions, navigate]);

//   const eliminarRevisionPlano = async (id: number) => {
//     const confirmacion = await Swal.fire({
//       title: '¿Eliminar solicitud de revisión de plano?',
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
//       const token = localStorage.getItem('token');
//       const response = await fetch(`${ApiRoutes.planos}/${id}`, {
//         method: 'DELETE',
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) throw new Error('Error al eliminar la solicitud');

//       Swal.fire('¡Eliminada!', 'La solicitud fue eliminada correctamente.', 'success');
//       setPlanos((prev) => prev.filter((p) => p.id !== id));
//     } catch (err) {
//       Swal.fire('Error', 'No se pudo eliminar la solicitud.', 'error');
//     }
//   };

//   const planosFiltrados = planos.filter((plano) => {
//     const matchEstado = filtroEstado === 'todos' || plano.status === filtroEstado;
//     const matchFecha = !fechaFiltro || plano.Date === fechaFiltro.toISOString().split('T')[0];
//     const matchTexto = searchBy === 'nombre'
//       ? plano.user?.nombre?.toLowerCase().includes(searchText.toLowerCase())
//       : plano.user?.cedula?.toLowerCase().includes(searchText.toLowerCase());

//     return matchEstado && matchFecha && matchTexto;
//   });

//   const indexUltima = currentPage * itemsPerPage;
//   const indexPrimera = indexUltima - itemsPerPage;
//   const planosActuales = planosFiltrados.slice(indexPrimera, indexUltima);
//   const totalPages = Math.ceil(planosFiltrados.length / itemsPerPage);

//   if (loading) return <p>Cargando solicitudes de revisión de planos...</p>;
//   if (error) return <p className="text-red-500">{error}</p>;

//   return (
//     <div className="flex flex-col w-full h-full p-4">
//       <h2 className="text-2xl font-bold mb-4 text-center">Solicitudes de Revisión de Planos</h2>

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

//       <div className="flex-1 overflow-auto bg-white shadow-lg rounded-lg max-h-[70vh] mt-4">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50 sticky top-0 z-10">
//             <tr className="bg-gray-200">
//               {/* <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">ID</th> */}
//               <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Nombre Solicitante</th>
//               <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Cédula Solicitante</th>
//               <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Fecha Creación</th>
//               <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Estado</th>
//               <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Acciones</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {planosActuales.map((plano) => (
//               <tr key={plano.id}>
//                 {/* <td className="px-4 py-2">{plano.id}</td> */}
//                 <td className="px-4 py-2">{plano.user?.nombre || '—'}</td>
//                 <td className="px-4 py-2">{plano.user?.cedula || '—'}</td>
//                 <td className="px-4 py-2">{plano.Date}</td>
//                 <td className="px-4 py-2">{plano.status || 'Pendiente'}</td>
//                 <td className="px-4 py-2 space-x-2">
//                 <button
//   className="button-view"
//   onClick={() => navigate(`/dashboard/plano/${plano.id}`)}
// >
//   <FaEye />
// </button>
//                   <button onClick={() => eliminarRevisionPlano(plano.id)} className="button-delete">
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
//         totalPages={totalPages}
//         itemsPerPage={itemsPerPage}
//         onPageChange={setCurrentPage}
//         onItemsPerPageChange={setItemsPerPage}
//       />
//     </div>
//   );
// }

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
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [fechaFiltro, setFechaFiltro] = useState<Date | null>(null);
  const [searchText, setSearchText] = useState('');
  const [searchBy, setSearchBy] = useState<'nombre' | 'cedula'>('nombre');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const navigate = useNavigate();
  const { isAuthenticated, userPermissions } = useAuth();

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
      } catch {
        setError('Error al cargar las revisiones de planos.');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();

    socket = io(ApiRoutes.urlBase, {
      transports: ['websocket'],
      auth: {
        token: localStorage.getItem('token'),
      },
    });

    socket.on('nueva-solicitud', (data) => {
      if (data.tipo === 'planos') {
        cargarDatos();
      }
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [isAuthenticated, userPermissions, navigate]);

  // const eliminarRevisionPlano = async (id: number) => {
  //   const confirmacion = await Swal.fire({
  //     title: '¿Eliminar solicitud de revisión de plano?',
  //     text: 'Esta acción no se puede deshacer.',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Sí, eliminar',
  //     cancelButtonText: 'Cancelar',
  //     confirmButtonColor: '#28a745',
  //     cancelButtonColor: '#dc3545',
  //   });

  //   if (!confirmacion.isConfirmed) return;

  //   try {
  //     await ApiService.delete(`${ApiRoutes.planos}/${id}`);
  //     setPlanos(prev => prev.filter(p => p.id !== id));
  //     Swal.fire('¡Eliminada!', 'La solicitud fue eliminada correctamente.', 'success');
  //   } catch (err) {
  //     Swal.fire('Error', 'No se pudo eliminar la solicitud.', 'error');
  //   }
  // };

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
      Swal.fire('¡Eliminada!', 'La solicitud fue eliminada correctamente.', 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'No se pudo eliminar la solicitud.', 'error');
    }
  };
  

  const planosFiltrados = planos.filter((plano) => {
    const matchEstado = filtroEstado === 'todos' || plano.status === filtroEstado;
    const matchFecha = !fechaFiltro || plano.Date === fechaFiltro.toISOString().split('T')[0];
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

      <div className="flex-1 overflow-auto bg-white shadow-lg rounded-lg max-h-[70vh] mt-4">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          <thead className="bg-gray-50 sticky top-0 z-0">
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Nombre </th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Cédula </th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Fecha </th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Estado</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {planosActuales.map((plano) => (
              <tr key={plano.id}>
                <td className="px-4 py-2">{plano.user?.nombre || '—'}</td>
                <td className="px-4 py-2">{plano.user?.cedula || '—'}</td>
                <td className="px-4 py-2">{plano.Date}</td>
                <td className="px-4 py-2">{plano.status || 'Pendiente'}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
    className="text-blue-600 hover:text-blue-800" 
                    onClick={() => navigate(`/dashboard/plano/${plano.id}`)}
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => eliminarRevisionPlano(plano.id)}
                    className="text-red-600 hover:text-red-800">
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
