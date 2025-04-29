// // src/Pages/Tablas/TipoDenunciaTable.tsx
// import { useState, useEffect } from 'react';
// import ApiRoutes from '../../Components/ApiRoutes';
// import Swal from 'sweetalert2';
// import { io, Socket } from 'socket.io-client';

// interface DenunciaData {
//   id: number;
//   descripcion: string;
// }

// let socket: Socket;

// export default function TipoDenunciaTable() {
//   const [tipos, setTipos] = useState<DenunciaData[]>([]);
//   const [isAdding, setIsAdding] = useState(false);
//   const [descripcion, setDescripcion] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

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

//     // 🔥 Conectar el socket
//     socket = io(ApiRoutes.urlBase);

//     // 🔥 Escuchar el evento de nuevo tipo de denuncia
//     socket.on('nuevo-tipo-denuncia', (nuevoTipo: DenunciaData) => {
//       setTipos(prev => [...prev, nuevoTipo]);
//     });

//     // Limpiar al desmontar
//     return () => {
//       socket.off('nuevo-tipo-denuncia');
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
//       const res = await fetch(`${ApiRoutes.urlBase}/tipo-denuncia`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ descripcion }),
//       });

//       if (!res.ok) throw new Error();

//       // No agregamos manualmente porque el socket lo hará automáticamente 🔥
//       setIsAdding(false);
//       setDescripcion('');
//       Swal.fire('¡Guardado!', 'Tipo de denuncia agregado.', 'success');
//     } catch (err) {
//       Swal.fire('Error', 'Ocurrió un error al agregar.', 'error');
//     }
//   };

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

//   if (loading) return <p className="p-4 text-gray-500">Cargando tipos...</p>;
//   if (error) return <p className="p-4 text-red-500">{error}</p>;

//   return (
//     <div className="flex flex-col w-full h-full p-4">
//       <h2 className="text-2xl font-semibold mb-4 text-center">Tipos de Denuncia</h2>

//       <button
//         onClick={() => setIsAdding(true)}
//         className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//       >
//         Agregar Nuevo Tipo de Denuncia
//       </button>

//       <div className="flex-1 overflow-auto bg-white shadow-lg rounded-lg max-h-[70vh]">
//         <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
//           <thead className="bg-gray-50 sticky top-0 z-10">
//             <tr className="bg-gray-200">
//               <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Tipo</th>
//               <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Acciones</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {tipos.map((tipo) => (
//               <tr key={tipo.id}>
//                 <td className="px-4 py-2">{tipo.descripcion}</td>
//                 <td className="px-4 py-2">
//                   <button
//                     onClick={() => handleEliminar(tipo.id)}
//                     className="text-red-600 hover:underline"
//                   >
//                     Eliminar
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {isAdding && (
//         <div className="modal-overlay fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
//           <div className="bg-white p-6 rounded shadow-lg w-96">
//             <h3 className="text-lg font-semibold mb-4">Agregar Tipo</h3>
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

import { useState, useEffect } from 'react';
import ApiRoutes from '../../Components/ApiRoutes';
import Swal from 'sweetalert2';
import { io, Socket } from 'socket.io-client';
import Paginacion from '../../Components/Paginacion';
import { FaPlus, FaTrash } from 'react-icons/fa';

interface DenunciaData {
  id: number;
  descripcion: string;
}

let socket: Socket;

export default function TipoDenunciaTable() {
  const [tipos, setTipos] = useState<DenunciaData[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [descripcion, setDescripcion] = useState('');
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    socket = io(ApiRoutes.urlBase);
    socket.on('nuevo-tipo-denuncia', (nuevoTipo: DenunciaData) => {
      setTipos(prev => [...prev, nuevoTipo]);
    });
    return () => {
      socket.off('nuevo-tipo-denuncia');
      socket.disconnect();
    };
  }, []);

  const handleAgregar = async () => {
    if (!descripcion.trim()) {
      Swal.fire('Campo requerido', 'Por favor, ingresa una descripción.', 'info');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${ApiRoutes.urlBase}/tipo-denuncia`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ descripcion }),
      });
      if (!res.ok) throw new Error();
      setIsAdding(false);
      setDescripcion('');
      Swal.fire('¡Guardado!', 'Tipo de denuncia agregado.', 'success');
    } catch (err) {
      Swal.fire('Error', 'Ocurrió un error al agregar.', 'error');
    }
  };

  const handleEliminar = async (id: number) => {
    const confirm = await Swal.fire({
      title: '¿Eliminar tipo de denuncia?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (!confirm.isConfirmed) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${ApiRoutes.urlBase}/tipo-denuncia/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setTipos(prev => prev.filter(t => t.id !== id));
      Swal.fire('Eliminado', 'Tipo eliminado correctamente.', 'success');
    } catch (err) {
      Swal.fire('Error', 'No se pudo eliminar el tipo.', 'error');
    }
  };

  const tiposFiltrados = tipos.filter(t =>
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
          onClick={() => setIsAdding(true)}
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
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => handleEliminar(tipo.id)}  className="text-red-600 hover:text-red-800">
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

      {isAdding && (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Agregar Tipo</h3>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción"
              className="w-full mb-4 p-2 border border-gray-300 rounded"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsAdding(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                Cancelar
              </button>
              <button onClick={handleAgregar} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
