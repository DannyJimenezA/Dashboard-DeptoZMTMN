// // src/Pages/Tablas/DenunciasTable.tsx
// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Denuncia } from '../../Types/Types';
// import Paginacion from '../../Components/Paginacion';
// import FiltroFecha from '../../Components/FiltroFecha';
// import SearchFilterBar from '../../Components/SearchFilterBar';
// import { FaEye, FaTrash } from 'react-icons/fa';
// import ApiRoutes from '../../Components/ApiRoutes';
// import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';
// import { useAuth } from '../../Pages/Auth/useAuth';

// const MySwal = withReactContent(Swal);

// export default function DenunciasTable() {
//   const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [filtroEstado, setFiltroEstado] = useState('todos');
//   const [fechaFiltro, setFechaFiltro] = useState<Date | null>(null);
//   const [searchText, setSearchText] = useState('');
//   const [searchBy, setSearchBy] = useState('nombreDenunciante');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(5);

//   const navigate = useNavigate();
//   const { isAuthenticated, userPermissions } = useAuth();

//   useEffect(() => {
//     if (!isAuthenticated || !userPermissions.includes('ver_denuncia')) {
//       navigate('/unauthorized');
//       return;
//     }

//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const res = await fetch(ApiRoutes.denuncias, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await res.json();
//         setDenuncias(data);
//       } catch (err) {
//         console.error(err);
//         setError('Error al cargar las denuncias.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [isAuthenticated, userPermissions, navigate]);

//   const handleDelete = async (id: number) => {
//     const result = await MySwal.fire({
//       title: '¿Eliminar denuncia?',
//       text: 'Esta acción no se puede deshacer.',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#28a745',
//       cancelButtonColor: '#dc3545',
//       confirmButtonText: 'Sí, eliminar',
//       cancelButtonText: 'Cancelar',
//     });

//     if (result.isConfirmed) {
//       const token = localStorage.getItem('token');
//       const res = await fetch(`${ApiRoutes.denuncias}/${id}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (res.ok) {
//         setDenuncias(prev => prev.filter(d => d.id !== id));
//         MySwal.fire('Eliminada', 'La denuncia ha sido eliminada.', 'success');
//       } else {
//         MySwal.fire('Error', 'No se pudo eliminar la denuncia.', 'error');
//       }
//     }
//   };

//   const filtradas = denuncias.filter(d => {
//     const matchEstado = filtroEstado === 'todos' || d.status === filtroEstado;
//     const matchFecha = !fechaFiltro || d.Date === fechaFiltro.toISOString().split('T')[0];
//     const matchTexto = searchBy === 'nombreDenunciante'
//       ? d.nombreDenunciante?.toLowerCase().includes(searchText.toLowerCase())
//       : d.cedulaDenunciante?.toLowerCase().includes(searchText.toLowerCase());
//     return matchEstado && matchFecha && matchTexto;
//   });

//   const totalPaginas = Math.ceil(filtradas.length / itemsPerPage);
//   const indexFinal = currentPage * itemsPerPage;
//   const indexInicio = indexFinal - itemsPerPage;
//   const paginaActual = filtradas.slice(indexInicio, indexFinal);

//   if (loading) return <p>Cargando denuncias...</p>;
//   if (error) return <p className="text-red-500">{error}</p>;

//   return (
//     <div className="flex flex-col w-full h-full p-4">
//       <h2 className="text-2xl font-semibold mb-4">Listado de Denuncias</h2>

//       <SearchFilterBar
//         searchPlaceholder="Buscar por nombre o cédula..."
//         searchText={searchText}
//         onSearchTextChange={setSearchText}
//         searchByOptions={[
//           { value: 'nombreDenunciante', label: 'Nombre' },
//           { value: 'cedulaDenunciante', label: 'Cédula' },
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
//             <tr>
//               <th className="px-4 py-2">ID</th>
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
//                 <td className="px-4 py-2">{d.id}</td>
//                 <td className="px-4 py-2">{d.nombreDenunciante || 'Anónimo'}</td>
//                 <td className="px-4 py-2">{d.cedulaDenunciante || 'Anónimo'}</td>
//                 <td className="px-4 py-2">{d.Date}</td>
//                 <td className="px-4 py-2">{d.tipoDenuncia?.descripcion || '—'}</td>
//                 <td className="px-4 py-2">{d.lugarDenuncia?.descripcion || '—'}</td>
//                 <td className="px-4 py-2">{d.status}</td>
//                 <td className="px-4 py-2 space-x-2">
//                   <button className="button-view" onClick={() => console.log(d)}>
//                     <FaEye />
//                   </button>
//                   <button className="button-delete" onClick={() => handleDelete(d.id)}>
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
import { useAuth } from '../../Pages/Auth/useAuth';

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

  useEffect(() => {
    if (!isAuthenticated || !userPermissions.includes('ver_denuncia')) {
      navigate('/unauthorized');
      return;
    }

    const cargarDatos = async () => {
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

    cargarDatos();
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
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="bg-gray-200">
              {/* <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">ID</th> */}
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
                {/* <td className="px-4 py-2">{d.id}</td> */}
                <td className="px-4 py-2">{d.nombreDenunciante || 'Anónimo'}</td>
                <td className="px-4 py-2">{d.cedulaDenunciante || 'Anónimo'}</td>
                <td className="px-4 py-2">{d.Date}</td>
                <td className="px-4 py-2">{d.tipoDenuncia?.descripcion || '—'}</td>
                <td className="px-4 py-2">{d.lugarDenuncia?.descripcion || '—'}</td>
                <td className="px-4 py-2">{d.status}</td>
                <td className="px-4 py-2 space-x-2">
                <button
  className="button-view"
  onClick={() => navigate(`/dashboard/denuncia/${d.id}`)}
>
  <FaEye />
</button>
                  <button className="button-delete" onClick={() => eliminarDenuncia(d.id)}>
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
