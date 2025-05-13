// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import ApiRoutes from '../../Components/ApiRoutes';
// import Swal from 'sweetalert2';
// import { io, Socket } from 'socket.io-client';
// import Paginacion from '../../Components/Paginacion';
// import { FaPlus, FaTrash } from 'react-icons/fa';

// interface DenunciaData {
//   id: number;
//   descripcion: string;
// }

// let socket: Socket;

// export default function TipoDenunciaTable() {
//   const [tipos, setTipos] = useState<DenunciaData[]>([]);
//   const [searchText, setSearchText] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(5);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const navigate = useNavigate();

//   const fetchTipos = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await fetch(`${ApiRoutes.urlBase}/tipo-denuncia`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error('Error al cargar tipos');
//       const data = await res.json();
//       setTipos(data);
//     } catch (err) {
//       console.error(err);
//       setError('Error al cargar tipos de denuncia');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTipos();

//     socket = io(ApiRoutes.urlBase);
//     socket.on('nuevo-tipo-denuncia', (nuevoTipo: DenunciaData) => {
//       setTipos(prev => [...prev, nuevoTipo]);
//     });

//     return () => {
//       socket.off('nuevo-tipo-denuncia');
//       socket.disconnect();
//     };
//   }, []);

//   const handleEliminar = async (id: number) => {
//     const confirm = await Swal.fire({
//       title: '¿Eliminar tipo de denuncia?',
//       text: 'Esta acción no se puede deshacer.',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Sí, eliminar',
//       cancelButtonText: 'Cancelar',
//     });

//     if (!confirm.isConfirmed) return;

//     try {
//       const token = localStorage.getItem('token');
//       const res = await fetch(`${ApiRoutes.urlBase}/tipo-denuncia/${id}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!res.ok) throw new Error();

//       setTipos(prev => prev.filter(t => t.id !== id));
//       Swal.fire('Eliminado', 'Tipo eliminado correctamente.', 'success');
//     } catch (err) {
//       Swal.fire('Error', 'No se pudo eliminar el tipo.', 'error');
//     }
//   };

//   const tiposFiltrados = tipos.filter(t =>
//     t.descripcion.toLowerCase().includes(searchText.toLowerCase())
//   );

//   const indexFinal = currentPage * itemsPerPage;
//   const indexInicio = indexFinal - itemsPerPage;
//   const tiposActuales = tiposFiltrados.slice(indexInicio, indexFinal);
//   const totalPaginas = Math.ceil(tiposFiltrados.length / itemsPerPage);

//   if (loading) return <p className="p-4 text-gray-500">Cargando tipos...</p>;
//   if (error) return <p className="p-4 text-red-500">{error}</p>;

//   return (
//     <div className="flex flex-col w-full h-full p-4">
//       <h2 className="text-2xl font-bold mb-4 text-center">Tipos de Denuncia</h2>

//       <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4">
//         <input
//           type="text"
//           placeholder="Buscar tipo de denuncia"
//           value={searchText}
//           onChange={(e) => setSearchText(e.target.value)}
//           className="border border-gray-300 rounded px-2 py-1 text-sm w-60"
//         />
//         <button
//           onClick={() => navigate('/dashboard/crear-tipodenuncia')}
//           className="px-4 py-2 bg-blue-600 text-white rounded flex items-center hover:bg-blue-700 self-end"
//         >
//           <FaPlus className="mr-2" /> Agregar Nuevo Tipo de Denuncia
//         </button>
//       </div>

//       <div className="flex-1 overflow-auto bg-white shadow-lg rounded-lg max-h-[70vh]">
//         <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
//           <thead className="bg-gray-50 sticky top-0 z-10">
//             <tr className="bg-gray-200">
//               <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Tipo</th>
//               <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Acciones</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {tiposActuales.map((tipo) => (
//               <tr key={tipo.id}>
//                 <td className="px-4 py-2">{tipo.descripcion}</td>
//                 <td className="px-4 py-2 text-left">
//                   <button
//                     onClick={() => handleEliminar(tipo.id)}
//                     className="text-red-600 hover:text-red-800"
//                   >
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


import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiRoutes from '../../Components/ApiRoutes';
import Swal from 'sweetalert2';
import { io, Socket } from 'socket.io-client';
import Paginacion from '../../Components/Paginacion';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { useAuth } from '../Auth/useAuth';

interface DenunciaData {
  id: number;
  descripcion: string;
}

let socket: Socket;

export default function TipoDenunciaTable() {
  const [tipos, setTipos] = useState<DenunciaData[]>([]);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { userPermissions } = useAuth(); // ✅

  const fetchTipos = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${ApiRoutes.urlBase}/tipo-denuncia`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Error al cargar tipos');
      const data = await res.json();
      setTipos(data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar tipos de denuncia');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTipos();

    socket = io(ApiRoutes.urlBase, {
      auth: {
        token: localStorage.getItem('token'),
      },
    });

    socket.on('nuevo-tipo-denuncia', (nuevoTipo: DenunciaData) => {
      setTipos((prev) => [...prev, nuevoTipo]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // const handleEliminar = async (id: number) => {
  //   if (!userPermissions.includes('eliminar_tipodenuncia')) {
  //     return Swal.fire(
  //       'Permiso denegado',
  //       'No tienes permisos para eliminar tipos de denuncia.',
  //       'warning'
  //     );
  //   }

  //   const confirm = await Swal.fire({
  //     title: '¿Eliminar tipo de denuncia?',
  //     text: 'Esta acción no se puede deshacer.',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Sí, eliminar',
  //     cancelButtonText: 'Cancelar',
  //         confirmButtonColor: '#28a745',
  //   cancelButtonColor: '#dc3545',
    
  //   });

  //   if (!confirm.isConfirmed) return;

  //   try {
  //     const token = localStorage.getItem('token');
  //     const res = await fetch(`${ApiRoutes.urlBase}/tipo-denuncia/${id}`, {
  //       method: 'DELETE',
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     if (res.status === 403) {
  //       return Swal.fire(
  //         'Permiso denegado',
  //         'No tienes permisos para realizar esta acción.',
  //         'warning'
  //       );
  //     }

  //     if (!res.ok) throw new Error();

  //     setTipos((prev) => prev.filter((t) => t.id !== id));
  //     Swal.fire({
  //       title: "¡Éxito!",
  //       text: `Tipo de denuncia ha sido eliminado.`,
  //       icon: "success",
  //       confirmButtonColor: "#00a884",
  //           timer: 3000,
  //     showConfirmButton: false,
  //     })
  //   } catch (err) {
  //     Swal.fire('Error', 'No se pudo eliminar el tipo.', 'error');
  //   }
  // };

const handleEliminar = async (id: number) => {
  if (!userPermissions.includes('eliminar_tipodenuncia')) {
    return Swal.fire(
      'Permiso denegado',
      'No tienes permisos para eliminar tipos de denuncia.',
      'warning'
    );
  }

  const confirm = await Swal.fire({
    title: '¿Eliminar tipo de denuncia?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#28a745',
    cancelButtonColor: '#dc3545',
  });

  if (!confirm.isConfirmed) return;

  // try {
  //   const token = localStorage.getItem('token');
  //   const res = await fetch(`${ApiRoutes.urlBase}/tipo-denuncia/${id}`, {
  //     method: 'DELETE',
  //     headers: { Authorization: `Bearer ${token}` },
  //   });

  //   const data = await res.json();

  //   if (res.status === 403) {
  //     return Swal.fire(
  //       'Permiso denegado',
  //       'No tienes permisos para realizar esta acción.',
  //       'warning'
  //     );
  //   }

  //   if (!res.ok) {
  //     // 👇 Detectar mensaje específico del backend
  //     if (
  //       typeof data === 'object' &&
  //       data !== null &&
  //       'message' in data &&
  //       typeof data.message === 'string' &&
  //       data.message.includes('denuncias asociadas')
  //     ) {
  //       return Swal.fire({
  //         icon: 'warning',
  //         title: 'No se puede eliminar',
  //         text: 'Este tipo de denuncia está siendo utilizado por una o más denuncias. Elimínalas antes de eliminarlo.',
  //         confirmButtonColor: '#dc3545',
  //       });
  //     }

  //     throw new Error('Error al eliminar');
  //   }

  //   setTipos((prev) => prev.filter((t) => t.id !== id));
  //   Swal.fire({
  //     title: '¡Éxito!',
  //     text: 'Tipo de denuncia eliminado correctamente.',
  //     icon: 'success',
  //     confirmButtonColor: '#00a884',
  //     timer: 3000,
  //     showConfirmButton: false,
  //   });
  // } catch (err) {
  //   console.error(err);
  //   Swal.fire('Error', 'No se pudo eliminar el tipo.', 'error');
  // }

try {
  const token = localStorage.getItem('token');
  const res = await fetch(`${ApiRoutes.urlBase}/tipo-denuncia/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  // ✅ Si se eliminó correctamente (por ejemplo, 204 No Content)
  if (res.status === 204 || res.status === 200) {
    setTipos((prev) => prev.filter((t) => t.id !== id));
    return Swal.fire({
      title: '¡Éxito!',
      text: 'Tipo de denuncia eliminado correctamente.',
      icon: 'success',
      confirmButtonColor: '#00a884',
      timer: 3000,
      showConfirmButton: false,
    });
  }

  // ❌ Si no es éxito, intentamos leer el mensaje de error
  const data = await res.json();

  if (res.status === 403) {
    return Swal.fire(
      'Permiso denegado',
      'No tienes permisos para realizar esta acción.',
      'warning'
    );
  }

  if (
    typeof data === 'object' &&
    data !== null &&
    'message' in data &&
    typeof data.message === 'string' &&
    data.message.includes('denuncias asociadas')
  ) {
    return Swal.fire({
      icon: 'warning',
      title: 'No se puede eliminar',
      text: 'Este tipo de denuncia está siendo utilizado por una o más denuncias. Elimínalas antes de eliminarlo.',
      confirmButtonColor: '#dc3545',
    });
  }

  throw new Error('Error desconocido');
} catch (err) {
  console.error(err);
  Swal.fire('Error', 'No se pudo eliminar el tipo.', 'error');
}



};


  const tiposFiltrados = tipos.filter((t) =>
    t.descripcion.toLowerCase().includes(searchText.toLowerCase())
  );

  const indexFinal = currentPage * itemsPerPage;
  const indexInicio = indexFinal - itemsPerPage;
  const tiposActuales = tiposFiltrados.slice(indexInicio, indexFinal);
  const totalPaginas = Math.ceil(tiposFiltrados.length / itemsPerPage);

  if (loading) return <p className="p-4 text-gray-500">Cargando tipos...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="flex flex-col w-full h-full p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Tipos de Denuncia</h2>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4">
        <input
          type="text"
          placeholder="Buscar tipo de denuncia"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-sm w-60"
        />

        <button
          onClick={() => {
            if (!userPermissions.includes('crear_tipodenuncia')) {
              return Swal.fire(
                'Permiso denegado',
                'No tienes permisos para realizar esta acción.',
                'warning'
              );
            }
            navigate('/dashboard/crear-tipodenuncia');
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded flex items-center hover:bg-blue-700 self-end"
        >
          <FaPlus className="mr-2" /> Agregar Nuevo Tipo de Denuncia
        </button>
      </div>

      <div className="flex-1 overflow-auto bg-white shadow-lg rounded-lg max-h-[70vh]">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Tipo</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tiposActuales.map((tipo) => (
              <tr key={tipo.id}>
                <td className="px-4 py-2">{tipo.descripcion}</td>
                <td className="px-4 py-2 text-left">
                  <button
                    onClick={() => handleEliminar(tipo.id)}
                    className="text-red-600 hover:text-red-800"
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
