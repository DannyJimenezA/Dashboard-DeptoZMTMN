// // src/Pages/Tablas/LugarDenunciaTable.tsx
// import { useEffect, useState } from 'react';
// import Swal from 'sweetalert2';
// import ApiRoutes from '../../Components/ApiRoutes';

// interface DenunciaData {
//   id: number;
//   descripcion: string;
// }

// export default function LugarDenunciaTable() {
//   const [lugares, setLugares] = useState<DenunciaData[]>([]);
//   const [descripcion, setDescripcion] = useState('');
//   const [isAdding, setIsAdding] = useState(false);
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

//       if (!res.ok) throw new Error('Error al agregar');

//       const nuevo = await res.json();
//       setLugares(prev => [...prev, nuevo]);
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

//   if (loading) return <p className="p-4 text-gray-500">Cargando lugares...</p>;
//   if (error) return <p className="p-4 text-red-500">{error}</p>;

//   return (
//     <div className="flex flex-col w-full h-full p-4">
//       <h2 className="text-2xl font-bold mb-4 text-center">Lugares de Denuncia</h2>

//       <button
//         onClick={() => setIsAdding(true)}
//         className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//       >
//         Agregar Nuevo Lugar de Denuncia
//       </button>

//       <div className="flex-1 overflow-auto bg-white shadow-lg rounded-lg max-h-[70vh]">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50 sticky top-0 z-10">
//             <tr className="bg-gray-200">
//               <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Lugar</th>
//               <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Acciones</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {lugares.map((lugar) => (
//               <tr key={lugar.id}>
//                 <td className="px-4 py-2">{lugar.descripcion}</td>
//                 <td className="px-4 py-2">
//                   <button
//                     onClick={() => handleEliminar(lugar.id)}
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
import Swal from 'sweetalert2';
import ApiRoutes from '../../Components/ApiRoutes';
import { io, Socket } from 'socket.io-client';

interface DenunciaData {
  id: number;
  descripcion: string;
}

let socket: Socket;

export default function LugarDenunciaTable() {
  const [lugares, setLugares] = useState<DenunciaData[]>([]);
  const [descripcion, setDescripcion] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

    // 🔥 Conectarse al socket
    socket = io(ApiRoutes.urlBase, {
      auth: {
        token: localStorage.getItem('token'),
      },
    });

    // 🎧 Escuchar evento de nuevo lugar de denuncia
    socket.on('nuevo-lugar-denuncia', (nuevoLugar: DenunciaData) => {
      setLugares(prev => [...prev, nuevoLugar]);
    });

    return () => {
      socket.disconnect(); // 🧹 Limpiar cuando el componente se desmonta
    };
  }, []);

  const handleAgregar = async () => {
    if (!descripcion.trim()) {
      Swal.fire('Campo requerido', 'Por favor, ingresa una descripción.', 'info');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${ApiRoutes.urlBase}/lugar-denuncia`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ descripcion }),
      });

      if (!res.ok) throw new Error('Error al agregar');

      // 🔥 Ya no hace falta hacer setLugares aquí
      setIsAdding(false);
      setDescripcion('');
      Swal.fire('¡Agregado!', 'Lugar de denuncia agregado.', 'success');
    } catch (err) {
      Swal.fire('Error', 'Ocurrió un error al agregar.', 'error');
    }
  };

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

      if (!res.ok) throw new Error();

      setLugares(prev => prev.filter(l => l.id !== id));
      Swal.fire('Eliminado', 'Lugar eliminado correctamente.', 'success');
    } catch (err) {
      Swal.fire('Error', 'No se pudo eliminar el lugar.', 'error');
    }
  };

  if (loading) return <p className="p-4 text-gray-500">Cargando lugares...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="flex flex-col w-full h-full p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Lugares de Denuncia</h2>

      <button
        onClick={() => setIsAdding(true)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Agregar Nuevo Lugar de Denuncia
      </button>

      <div className="flex-1 overflow-auto bg-white shadow-lg rounded-lg max-h-[70vh]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Lugar</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {lugares.map((lugar) => (
              <tr key={lugar.id}>
                <td className="px-4 py-2">{lugar.descripcion}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleEliminar(lugar.id)}
                    className="text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAdding && (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Agregar Lugar</h3>
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
