// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Denuncia } from '../../Types/Types';
// import Paginacion from '../../Components/Paginacion';
// import FiltroFecha from '../../Components/FiltroFecha';
// import SearchFilterBar from '../../Components/SearchFilterBar';
// import { FaEye, FaTrash } from 'react-icons/fa';
// import Swal from 'sweetalert2';
// import ApiService from '../../Components/ApiService';
// import ApiRoutes from '../../Components/ApiRoutes';
// import { useAuth } from '../Auth/useAuth';
// import { io, Socket } from 'socket.io-client'; // 👈 Agregado

// export default function DenunciasTable() {
//   const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [filtroEstado, setFiltroEstado] = useState('todos');
//   const [fechaFiltro, setFechaFiltro] = useState<Date | null>(null);
//   const [searchText, setSearchText] = useState('');
//   const [searchBy, setSearchBy] = useState<'nombreDenunciante' | 'cedulaDenunciante'>('nombreDenunciante');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(5);

//   const navigate = useNavigate();
//   const { isAuthenticated, userPermissions } = useAuth();

//   useEffect(() => {
//     let socket: Socket | null = null;

//     if (!isAuthenticated || !userPermissions.includes('ver_denuncia')) {
//       navigate('/unauthorized');
//       return;
//     }

//     const cargarDatos = async () => {
//       try {
//         const data = await ApiService.get<Denuncia[]>(ApiRoutes.denuncias);
//         setDenuncias(data);
//       } catch (err) {
//         console.error(err);
//         setError('Error al cargar las denuncias.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     cargarDatos();

//     // 🚀 Conexión WebSocket para escuchar nuevas denuncias
//     socket = io(ApiRoutes.urlBase, {
//       transports: ['websocket'],
//       auth: {
//         token: localStorage.getItem('token'),
//       },
//     });

//     // socket.on('nueva-denuncia', (nuevaDenuncia: Denuncia) => {
//     //   console.log('Nueva denuncia recibida:', nuevaDenuncia);
//     //   setDenuncias(prev => {
//     //     const yaExiste = prev.some(d => d.id === nuevaDenuncia.id);
//     //     if (yaExiste) return prev;
//     //     return [nuevaDenuncia, ...prev];
//     //   });
//     // });
//     socket.on('nueva-denuncia', async (nuevaDenuncia: Denuncia) => {
//       console.log('Nueva denuncia recibida:', nuevaDenuncia);
    
//       try {
//         // 🔥 Pedimos los datos completos de la nueva denuncia
//         const denunciaCompleta = await ApiService.get<Denuncia>(`${ApiRoutes.denuncias}/${nuevaDenuncia.id}`);
    
//         setDenuncias(prev => {
//           const yaExiste = prev.some(d => d.id === denunciaCompleta.id);
//           if (yaExiste) return prev;
//           return [denunciaCompleta, ...prev];
//         });
//       } catch (error) {
//         console.error('Error cargando denuncia completa', error);
//       }
//     });
    
//     return () => {
//       if (socket) {
//         socket.disconnect();
//       }
//     };
//   }, [isAuthenticated, userPermissions, navigate]);

//   const eliminarDenuncia = async (id: number) => {
//     const confirmacion = await Swal.fire({
//       title: '¿Eliminar denuncia?',
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
//       await ApiService.delete(`${ApiRoutes.denuncias}/${id}`);
//       setDenuncias(prev => prev.filter(d => d.id !== id));
//       Swal.fire('Eliminada', 'La denuncia fue eliminada correctamente.', 'success');
//     } catch {
//       Swal.fire('Error', 'No se pudo eliminar la denuncia.', 'error');
//     }
//   };

//   const filtradas = denuncias.filter((d) => {
//     const byEstado = filtroEstado === 'todos' || d.status === filtroEstado;
//     const byFecha = !fechaFiltro || d.Date === fechaFiltro.toISOString().split('T')[0];
//     const byTexto = searchBy === 'nombreDenunciante'
//       ? d.nombreDenunciante?.toLowerCase().includes(searchText.toLowerCase())
//       : d.cedulaDenunciante?.toLowerCase().includes(searchText.toLowerCase());

//     return byEstado && byFecha && byTexto;
//   });

//   const totalPaginas = Math.ceil(filtradas.length / itemsPerPage);
//   const indexInicio = (currentPage - 1) * itemsPerPage;
//   const paginaActual = filtradas.slice(indexInicio, indexInicio + itemsPerPage);

//   if (loading) return <p className="p-4 text-gray-500">Cargando denuncias...</p>;
//   if (error) return <p className="p-4 text-red-500">{error}</p>;

//   return (
//     <div className="flex flex-col w-full h-full p-4">
//       <h2 className="text-2xl font-bold mb-4 text-center">Listado de Denuncias</h2>

//       <SearchFilterBar
//         searchPlaceholder="Buscar por nombre o cédula..."
//         searchText={searchText}
//         onSearchTextChange={setSearchText}
//         searchByOptions={[
//           { value: 'nombreDenunciante', label: 'Nombre' },
//           { value: 'cedulaDenunciante', label: 'Cédula' },
//         ]}
//         selectedSearchBy={searchBy}
//         onSearchByChange={(val) => setSearchBy(val as 'nombreDenunciante' | 'cedulaDenunciante')}
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
//               <th className="px-4 py-2">Nombre</th>
//               <th className="px-4 py-2">Cédula</th>
//               <th className="px-4 py-2">Fecha</th>
//               <th className="px-4 py-2">Tipo</th>
//               <th className="px-4 py-2">Lugar</th>
//               <th className="px-4 py-2">Estado</th>
//               <th className="px-4 py-2">Acciones</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {paginaActual.map((d) => (
//               <tr key={d.id}>
//                 <td className="px-4 py-2">{d.nombreDenunciante || 'Anónimo'}</td>
//                 <td className="px-4 py-2">{d.cedulaDenunciante || 'Anónimo'}</td>
//                 <td className="px-4 py-2">{d.Date}</td>
//                 <td className="px-4 py-2">{d.tipoDenuncia?.descripcion || '—'}</td>
//                 <td className="px-4 py-2">{d.lugarDenuncia?.descripcion || '—'}</td>
//                 <td className="px-4 py-2">{d.status}</td>
//                 <td className="px-4 py-2 space-x-2">
//                   <button className="button-view" onClick={() => navigate(`/dashboard/denuncia/${d.id}`)}>
//                     <FaEye />
//                   </button>
//                   <button className="button-delete" onClick={() => eliminarDenuncia(d.id)}>
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
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [fechaFiltro, setFechaFiltro] = useState<Date | null>(null);
  const [searchText, setSearchText] = useState('');
  const [searchBy, setSearchBy] = useState<'nombreDenunciante' | 'cedulaDenunciante'>('nombreDenunciante');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const navigate = useNavigate();
  const { isAuthenticated, userPermissions } = useAuth();

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

    fetchDenuncias();

    const socket: Socket = io(ApiRoutes.urlBase, {
      transports: ['websocket'],
      auth: { token: localStorage.getItem('token') },
    });

    // 👂 Escuchar evento de nueva solicitud (por tipo)
    socket.on('nueva-solicitud', (data) => {
      if (data.tipo === 'denuncias') {
        fetchDenuncias(); // 🔥 recargar la tabla
      }
    });

    return () => {
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
      await ApiService.delete(`${ApiRoutes.denuncias}/${id}`);
      setDenuncias(prev => prev.filter(d => d.id !== id));
      Swal.fire('Eliminada', 'La denuncia fue eliminada correctamente.', 'success');
    } catch {
      Swal.fire('Error', 'No se pudo eliminar la denuncia.', 'error');
    }
  };

  const filtradas = denuncias.filter((d) => {
    const byEstado = filtroEstado === 'todos' || d.status === filtroEstado;
    const byFecha = !fechaFiltro || d.Date === fechaFiltro.toISOString().split('T')[0];
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
        searchPlaceholder="Buscar por nombre o cédula..."
        searchText={searchText}
        onSearchTextChange={setSearchText}
        searchByOptions={[
          { value: 'nombreDenunciante', label: 'Nombre' },
          { value: 'cedulaDenunciante', label: 'Cédula' },
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
              <option value="Aprobada">Aprobada</option>
              <option value="Denegada">Denegada</option>
            </select>
            <FiltroFecha fechaFiltro={fechaFiltro} onChangeFecha={setFechaFiltro} />
          </div>
        }
      />

      <div className="flex-1 overflow-auto bg-white shadow-lg rounded-lg mt-4">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          <thead className="bg-gray-50 sticky top-0 z-0">
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Nombre</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Cédula</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Fecha</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Tipo</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Lugar</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Estado</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginaActual.map((d) => (
              <tr key={d.id}>
                <td className="px-4 py-2">{d.nombreDenunciante || 'Anónimo'}</td>
                <td className="px-4 py-2">{d.cedulaDenunciante || 'Anónimo'}</td>
                <td className="px-4 py-2">{d.Date}</td>
                <td className="px-4 py-2">{d.tipoDenuncia?.descripcion || '—'}</td>
                <td className="px-4 py-2">{d.lugarDenuncia?.descripcion || '—'}</td>
                <td className="px-4 py-2">{d.status}</td>
                <td className="px-4 py-2 space-x-2">
                  <button className="text-blue-600 hover:text-blue-800"  onClick={() => navigate(`/dashboard/denuncia/${d.id}`)}>
                    <FaEye />
                  </button>
                  <button  className="text-red-600 hover:text-red-800" onClick={() => eliminarDenuncia(d.id)}>
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
