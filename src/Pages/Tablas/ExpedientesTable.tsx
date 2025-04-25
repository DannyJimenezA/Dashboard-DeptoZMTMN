// import { useEffect, useState } from 'react';
// import { CopiaExpediente } from '../../Types/Types';
// import Paginacion from '../../Components/Paginacion';
// import FiltroFecha from '../../Components/FiltroFecha';
// import SearchFilterBar from '../../Components/SearchFilterBar';
// import { FaEye, FaTrash } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import ApiRoutes from '../../Components/ApiRoutes';
// import Swal from 'sweetalert2';
// import { useAuth } from '../../Pages/Auth/useAuth';

// export default function ExpedientesTable() {
//   const [expedientes, setExpedientes] = useState<CopiaExpediente[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [filtroEstado, setFiltroEstado] = useState('todos');
//   const [fechaFiltro, setFechaFiltro] = useState<Date | null>(null);
//   const [searchText, setSearchText] = useState('');
//   const [searchBy, setSearchBy] = useState('nombreSolicitante');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(5);

//   const navigate = useNavigate();
//   const { isAuthenticated, userPermissions } = useAuth();

//   useEffect(() => {
//     if (!isAuthenticated || !userPermissions.includes('ver_copia_expediente')) {
//       navigate('/unauthorized');
//       return;
//     }

//     const obtener = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const res = await fetch(ApiRoutes.expedientes, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await res.json();
//         setExpedientes(data);
//       } catch {
//         setError('Error al cargar los expedientes.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     obtener();
//   }, [isAuthenticated, userPermissions, navigate]);

//   const handleEliminarExpediente = async (idExpediente: number) => {
//     const token = localStorage.getItem('token');
//     if (!token) return;

//     const confirm = await Swal.fire({
//       title: '¿Eliminar solicitud de expediente?',
//       text: 'Esta acción no se puede deshacer.',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Sí, eliminar',
//       cancelButtonText: 'Cancelar',
//       confirmButtonColor: '#28a745',
//       cancelButtonColor: '#dc3545',
//     });

//     if (confirm.isConfirmed) {
//       try {
//         const res = await fetch(`${ApiRoutes.expedientes}/${idExpediente}`, {
//           method: 'DELETE',
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (res.ok) {
//           setExpedientes((prev) => prev.filter((exp) => exp.idExpediente !== idExpediente));
//           Swal.fire('¡Eliminado!', 'El expediente ha sido eliminado.', 'success');
//         } else {
//           throw new Error('No se pudo eliminar');
//         }
//       } catch (error) {
//         Swal.fire('Error', 'Hubo un problema al eliminar el expediente.', 'error');
//       }
//     }
//   };

//   const filtrados = () => {
//     let lista = expedientes;

//     if (filtroEstado !== 'todos') {
//       lista = lista.filter((e) => e.status === filtroEstado);
//     }

//     if (fechaFiltro) {
//       const fecha = fechaFiltro.toISOString().split('T')[0];
//       lista = lista.filter((e) => e.Date === fecha);
//     }

//     if (searchText) {
//       lista = lista.filter((e) =>
//         searchBy === 'nombreSolicitante'
//           ? e.nombreSolicitante?.toLowerCase().includes(searchText.toLowerCase())
//           : e.numeroExpediente?.toString().includes(searchText)
//       );
//     }

//     return lista;
//   };

//   const listaFinal = filtrados();
//   const ultima = currentPage * itemsPerPage;
//   const primera = ultima - itemsPerPage;
//   const actuales = listaFinal.slice(primera, ultima);
//   const totalPaginas = Math.ceil(listaFinal.length / itemsPerPage);

//   if (loading) return <p>Cargando expedientes...</p>;
//   if (error) return <p>Error: {error}</p>;

//   return (
//     <div className="flex flex-col w-full h-full p-4">
//       <h2 className="text-2xl font-semibold mb-4">Solicitudes de Expedientes</h2>

//       <SearchFilterBar
//         searchPlaceholder="Buscar por nombre o número..."
//         searchText={searchText}
//         onSearchTextChange={setSearchText}
//         searchByOptions={[
//           { value: 'nombreSolicitante', label: 'Nombre' },
//           { value: 'numeroExpediente', label: 'N° Expediente' },
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
//               <option value="Aprobado">Aprobado</option>
//               <option value="Denegado">Denegado</option>
//             </select>
//             <FiltroFecha fechaFiltro={fechaFiltro} onChangeFecha={setFechaFiltro} />
//           </div>
//         }
//       />

//       <div className="flex-1 overflow-auto bg-white shadow-lg rounded-lg max-h-[70vh]">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50 sticky top-0 z-10">
//             <tr>
//               <th className="px-4 py-2">ID</th>
//               <th className="px-4 py-2">Solicitante</th>
//               <th className="px-4 py-2">N° Expediente</th>
//               <th className="px-4 py-2">Fecha</th>
//               <th className="px-4 py-2">Estado</th>
//               <th className="px-4 py-2">Acciones</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {actuales.map((exp) => (
//               <tr key={exp.idExpediente}>
//                 <td className="px-4 py-2">{exp.idExpediente}</td>
//                 <td className="px-4 py-2">{exp.nombreSolicitante || 'N/A'}</td>
//                 <td className="px-4 py-2">{exp.numeroExpediente}</td>
//                 <td className="px-4 py-2">{exp.Date}</td>
//                 <td className="px-4 py-2">{exp.status || 'Pendiente'}</td>
//                 <td className="px-4 py-2 space-x-2">
//                   <button className="button-view" onClick={() => console.log(exp)}>
//                     <FaEye />
//                   </button>
//                   <button className="button-delete" onClick={() => handleEliminarExpediente(exp.idExpediente)}>
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

// src/Pages/Tablas/ExpedientesTable.tsx
// src/Pages/Tablas/ExpedientesTable.tsx
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

const MySwal = withReactContent(Swal);

export default function ExpedientesTable() {
  const [expedientes, setExpedientes] = useState<CopiaExpediente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [fechaFiltro, setFechaFiltro] = useState<Date | null>(null);
  const [searchText, setSearchText] = useState('');
  const [searchBy, setSearchBy] = useState('nombreSolicitante');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const navigate = useNavigate();
  const { isAuthenticated, userPermissions } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !userPermissions.includes('ver_copia_expediente')) {
      navigate('/unauthorized');
      return;
    }

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(ApiRoutes.expedientes, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Error al obtener los expedientes');
        const data = await res.json();
        setExpedientes(data);
      } catch (err) {
        console.error(err);
        setError('Error al cargar los expedientes.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, userPermissions, navigate]);

  const handleDelete = async (idExpediente: number) => {
    const result = await MySwal.fire({
      title: '¿Eliminar solicitud de expediente?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${ApiRoutes.expedientes}/${idExpediente}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          setExpedientes(prev => prev.filter(exp => exp.idExpediente !== idExpediente));
          MySwal.fire('¡Eliminado!', 'El expediente ha sido eliminado.', 'success');
        } else {
          throw new Error('No se pudo eliminar');
        }
      } catch (error) {
        MySwal.fire('Error', 'Hubo un problema al eliminar el expediente.', 'error');
      }
    }
  };

  const filtrados = expedientes.filter(exp => {
    const matchEstado = filtroEstado === 'todos' || exp.status === filtroEstado;
    const matchFecha = !fechaFiltro || exp.Date === fechaFiltro.toISOString().split('T')[0];
    const matchTexto = searchBy === 'nombreSolicitante'
      ? exp.nombreSolicitante?.toLowerCase().includes(searchText.toLowerCase())
      : exp.numeroExpediente?.toString().includes(searchText);
    return matchEstado && matchFecha && matchTexto;
  });

  const totalPaginas = Math.ceil(filtrados.length / itemsPerPage);
  const indexFinal = currentPage * itemsPerPage;
  const indexInicio = indexFinal - itemsPerPage;
  const paginaActual = filtrados.slice(indexInicio, indexFinal);

  if (loading) return <p>Cargando expedientes...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-col w-full h-full p-4">
      <h2 className="text-2xl font-semibold mb-4">Solicitudes de Expedientes</h2>

      <SearchFilterBar
        searchPlaceholder="Buscar por nombre o número..."
        searchText={searchText}
        onSearchTextChange={setSearchText}
        searchByOptions={[
          { value: 'nombreSolicitante', label: 'Nombre' },
          { value: 'numeroExpediente', label: 'N° Expediente' },
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
              <option value="Aprobado">Aprobado</option>
              <option value="Denegado">Denegado</option>
            </select>
            <FiltroFecha fechaFiltro={fechaFiltro} onChangeFecha={setFechaFiltro} />
          </div>
        }
      />

      <div className="flex-1 overflow-auto bg-white shadow-lg rounded-lg max-h-[70vh] mt-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="bg-gray-200">
              {/* <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">ID</th> */}
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Solicitante</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">N° Expediente</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Fecha</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Estado</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginaActual.map((exp) => (
              <tr key={exp.idExpediente}>
                {/* <td className="px-4 py-2">{exp.idExpediente}</td> */}
                <td className="px-4 py-2">{exp.nombreSolicitante || 'N/A'}</td>
                <td className="px-4 py-2">{exp.numeroExpediente}</td>
                <td className="px-4 py-2">{exp.Date}</td>
                <td className="px-4 py-2">{exp.status || 'Pendiente'}</td>
                <td className="px-4 py-2 space-x-2">
                  <button className="button-view" onClick={() => console.log(exp)}>
                    <FaEye />
                  </button>
                  <button className="button-delete" onClick={() => handleDelete(exp.idExpediente)}>
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
