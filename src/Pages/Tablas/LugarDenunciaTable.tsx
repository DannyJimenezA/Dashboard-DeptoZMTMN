// import { useEffect, useState } from 'react';
// import Swal from 'sweetalert2';
// import ApiRoutes from '../../Components/ApiRoutes';
// import { io, Socket } from 'socket.io-client';
// import Paginacion from '../../Components/Paginacion';
// import { FaPlus, FaTrash } from 'react-icons/fa';

// interface DenunciaData {
//   id: number;
//   descripcion: string;
// }

// let socket: Socket;

// export default function LugarDenunciaTable() {
//   const [lugares, setLugares] = useState<DenunciaData[]>([]);
//   const [descripcion, setDescripcion] = useState('');
//   const [isAdding, setIsAdding] = useState(false);
//   const [searchText, setSearchText] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(5);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchLugares = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await fetch(`${ApiRoutes.urlBase}/lugar-denuncia`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error('Error al cargar lugares');
//       const data = await res.json();
//       setLugares(data);
//     } catch (err) {
//       console.error(err);
//       setError('Error al cargar lugares');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchLugares();

//     socket = io(ApiRoutes.urlBase, {
//       auth: {
//         token: localStorage.getItem('token'),
//       },
//     });

//     socket.on('nuevo-lugar-denuncia', (nuevoLugar: DenunciaData) => {
//       setLugares(prev => [...prev, nuevoLugar]);
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   const handleAgregar = async () => {
//     if (!descripcion.trim()) {
//       Swal.fire('Campo requerido', 'Por favor, ingresa una descripción.', 'info');
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');
//       const res = await fetch(`${ApiRoutes.urlBase}/lugar-denuncia`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ descripcion }),
//       });

//       if (!res.ok) throw new Error();

//       setIsAdding(false);
//       setDescripcion('');
//       Swal.fire('¡Agregado!', 'Lugar de denuncia agregado.', 'success');
//     } catch (err) {
//       Swal.fire('Error', 'Ocurrió un error al agregar.', 'error');
//     }
//   };

//   const handleEliminar = async (id: number) => {
//     const confirm = await Swal.fire({
//       title: '¿Eliminar lugar?',
//       text: 'Esta acción no se puede deshacer.',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Sí, eliminar',
//       cancelButtonText: 'Cancelar',
//     });

//     if (!confirm.isConfirmed) return;

//     try {
//       const token = localStorage.getItem('token');
//       const res = await fetch(`${ApiRoutes.urlBase}/lugar-denuncia/${id}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!res.ok) throw new Error();

//       setLugares(prev => prev.filter(l => l.id !== id));
//       Swal.fire('Eliminado', 'Lugar eliminado correctamente.', 'success');
//     } catch (err) {
//       Swal.fire('Error', 'No se pudo eliminar el lugar.', 'error');
//     }
//   };

//   const lugaresFiltrados = lugares.filter(lugar =>
//     lugar.descripcion.toLowerCase().includes(searchText.toLowerCase())
//   );

//   const indexFinal = currentPage * itemsPerPage;
//   const indexInicio = indexFinal - itemsPerPage;
//   const lugaresActuales = lugaresFiltrados.slice(indexInicio, indexFinal);
//   const totalPaginas = Math.ceil(lugaresFiltrados.length / itemsPerPage);

//   if (loading) return <p className="p-4 text-gray-500">Cargando lugares...</p>;
//   if (error) return <p className="p-4 text-red-500">{error}</p>;

//   return (
//     <div className="flex flex-col w-full h-full p-4">
//       <h2 className="text-2xl font-bold mb-4 text-center">Lugares de Denuncia</h2>

//       <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4">
//         <input
//           type="text"
//           placeholder="Buscar lugar de denuncia"
//           value={searchText}
//           onChange={(e) => setSearchText(e.target.value)}
//           className="border border-gray-300 rounded px-2 py-1 text-sm w-60"
//         />
// <button
//   onClick={() => navigate('/dashboard/crear-lugar-denuncia')}
//   className="px-4 py-2 bg-blue-600 text-white rounded flex items-center hover:bg-blue-700 self-end"
// >
//   <FaPlus className="mr-2" /> Agregar Lugar de Denuncia
// </button>

//       </div>

//       <div className="flex-1 overflow-auto bg-white shadow-lg rounded-lg max-h-[70vh]">
//         <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
//           <thead className="bg-gray-50 sticky top-0 z-10">
//             <tr className="bg-gray-200">
//               <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Lugar</th>
//               {/* <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Acciones</th>
//                */}
//                <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Acciones</th>

//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {lugaresActuales.map((lugar) => (
//               <tr key={lugar.id}>
//                 <td className="px-4 py-2">{lugar.descripcion}</td>
//                 {/* <td className="px-4 py-2 text-left space-x-2">
//                   <button onClick={() => handleEliminar(lugar.id)} className="button-delete">
//                     <FaTrash />
//                   </button>
//                 </td> */}
// <td className="px-4 py-2 text-left">
//   <div className="flex justify-start w-full">
//     <button
//       onClick={() => handleEliminar(lugar.id)}
//       className="text-red-600 hover:text-red-800"
//     >
//       <FaTrash />
//     </button>
//   </div>
// </td>


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

//       {isAdding && (
//         <div className="modal-overlay fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
//           <div className="bg-white p-6 rounded shadow-lg w-96">
//             <h3 className="text-lg font-semibold mb-4">Agregar Lugar</h3>
//             <input
//               type="text"
//               value={descripcion}
//               onChange={(e) => setDescripcion(e.target.value)}
//               placeholder="Descripción"
//               className="w-full mb-4 p-2 border border-gray-300 rounded"
//             />
//             <div className="flex justify-end gap-2">
//               <button onClick={() => setIsAdding(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
//                 Cancelar
//               </button>
//               <button onClick={handleAgregar} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
//                 Guardar
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ApiRoutes from '../../Components/ApiRoutes';
import { io, Socket } from 'socket.io-client';
import Paginacion from '../../Components/Paginacion';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { useAuth } from '../Auth/useAuth';


interface DenunciaData {
  id: number;
  descripcion: string;
}

let socket: Socket;

export default function LugarDenunciaTable() {
  const [lugares, setLugares] = useState<DenunciaData[]>([]);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { userPermissions } = useAuth(); // ✅ Esto faltaba


  const fetchLugares = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${ApiRoutes.urlBase}/lugar-denuncia`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Error al cargar lugares');
      const data = await res.json();
      setLugares(data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar lugares');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLugares();

    socket = io(ApiRoutes.urlBase, {
      auth: {
        token: localStorage.getItem('token'),
      },
    });

    socket.on('nuevo-lugar-denuncia', (nuevoLugar: DenunciaData) => {
      setLugares(prev => [...prev, nuevoLugar]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // const handleEliminar = async (id: number) => {
  //   const confirm = await Swal.fire({
  //     title: '¿Eliminar lugar?',
  //     text: 'Esta acción no se puede deshacer.',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Sí, eliminar',
  //     cancelButtonText: 'Cancelar',
  //   });

  //   if (!confirm.isConfirmed) return;

  //   try {
  //     const token = localStorage.getItem('token');
  //     const res = await fetch(`${ApiRoutes.urlBase}/lugar-denuncia/${id}`, {
  //       method: 'DELETE',
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     if (!res.ok) throw new Error();

  //     setLugares(prev => prev.filter(l => l.id !== id));
  //     Swal.fire('Eliminado', 'Lugar eliminado correctamente.', 'success');
  //   } catch (err) {
  //     Swal.fire('Error', 'No se pudo eliminar el lugar.', 'error');
  //   }
  // };
  const handleEliminar = async (id: number) => {
    const confirm = await Swal.fire({
      title: '¿Eliminar lugar?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
  
    if (!confirm.isConfirmed) return;
  
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${ApiRoutes.urlBase}/lugar-denuncia/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (res.status === 403) {
        return Swal.fire(
          'Permiso denegado',
          'No tienes permisos para realizar esta acción.',
          'warning'
        );
      }
  
      if (!res.ok) throw new Error();
  
      setLugares((prev) => prev.filter((l) => l.id !== id));
      Swal.fire('Eliminado', 'Lugar eliminado correctamente.', 'success');
    } catch (err) {
      Swal.fire('Error', 'No se pudo eliminar el lugar.', 'error');
    }
  };
  

  const lugaresFiltrados = lugares.filter(lugar =>
    lugar.descripcion.toLowerCase().includes(searchText.toLowerCase())
  );

  const indexFinal = currentPage * itemsPerPage;
  const indexInicio = indexFinal - itemsPerPage;
  const lugaresActuales = lugaresFiltrados.slice(indexInicio, indexFinal);
  const totalPaginas = Math.ceil(lugaresFiltrados.length / itemsPerPage);

  if (loading) return <p className="p-4 text-gray-500">Cargando lugares...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="flex flex-col w-full h-full p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Lugares de Denuncia</h2>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4">
        <input
          type="text"
          placeholder="Buscar lugar de denuncia"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-sm w-60"
        />
        {/* <button
          onClick={() => navigate('/dashboard/crear-lugardenuncia')}
          className="px-4 py-2 bg-blue-600 text-white rounded flex items-center hover:bg-blue-700 self-end"
        >
          <FaPlus className="mr-2" /> Agregar Lugar de Denuncia
        </button> */}
        <button
  onClick={() => {
    if (!userPermissions.includes('crear_lugardenuncia')) {
      return Swal.fire(
        'Permiso denegado',
        'No tienes permisos para realizar esta acción',
        'warning'
      );
    }
    navigate('/dashboard/crear-lugardenuncia');
  }}
  className="px-4 py-2 bg-blue-600 text-white rounded flex items-center hover:bg-blue-700 self-end"
>
  <FaPlus className="mr-2" /> Agregar Lugar de Denuncia
</button>

      </div>

      <div className="flex-1 overflow-auto bg-white shadow-lg rounded-lg max-h-[70vh]">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Lugar</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {lugaresActuales.map((lugar) => (
              <tr key={lugar.id}>
                <td className="px-4 py-2">{lugar.descripcion}</td>
                <td className="px-4 py-2 text-left">
                  <div className="flex justify-start w-full">
                    {/* <button
                      onClick={() => handleEliminar(lugar.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button> */}
                    <button
  onClick={() => {
    if (!userPermissions.includes('eliminar_lugardenuncia')) {
      return Swal.fire(
        'Permiso denegado',
        'No tienes permisos para realizar esta acción.',
        'warning'
      );
    }
    handleEliminar(lugar.id);
  }}
  className="text-red-600 hover:text-red-800"
>
  <FaTrash />
</button>

                  </div>
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
