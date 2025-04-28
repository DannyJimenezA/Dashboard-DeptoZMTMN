// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import ApiRoutes from '../../Components/ApiRoutes';
// import Swal from 'sweetalert2';
// import { io, Socket } from 'socket.io-client'; // 🔥 Importar socket.io

// interface FechaCita {
//   id: number;
//   date: string;
// }

// export default function DiasCitasPage() {
//   const [fechas, setFechas] = useState<FechaCita[]>([]);
//   const [mostrarProximas, setMostrarProximas] = useState<boolean>(true);
//   const [paginaActual, setPaginaActual] = useState<number>(1);
//   const [, setSocket] = useState<Socket | null>(null); // ✅ Socket state
//   const navigate = useNavigate();

//   const fechasPorPagina = 10;

//   const fetchFechas = async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       Swal.fire('Acceso denegado', 'No tienes permisos para ver las fechas.', 'warning');
//       return;
//     }

//     try {
//       const response = await fetch(ApiRoutes.fechaCitas, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Error al obtener las fechas');
//       }

//       const data = await response.json();
//       setFechas(data);
//     } catch (error) {
//       console.error(error);
//       Swal.fire('Error', 'No se pudieron cargar las fechas.', 'error');
//     }
//   };

//   useEffect(() => {
//     fetchFechas();

//     const newSocket = io(ApiRoutes.urlBase, {
//       transports: ['websocket'],
//       auth: { token: localStorage.getItem('token') },
//     });

//     setSocket(newSocket);

//     // 📢 Escuchar el evento cuando llega una nueva fecha
//     newSocket.on('nueva-fecha-cita', (nuevaFecha: FechaCita) => {
//       console.log('📅 Nueva fecha recibida:', nuevaFecha);
//       setFechas((prevFechas) => [nuevaFecha, ...prevFechas]);
//     });

//     return () => {
//       newSocket.disconnect();
//     };
//   }, []);

//   const fechasFiltradas = mostrarProximas
//     ? fechas.filter((fecha) => new Date(fecha.date) >= new Date())
//     : fechas;

//   const totalPaginas = Math.ceil(fechasFiltradas.length / fechasPorPagina);
//   const indiceInicio = (paginaActual - 1) * fechasPorPagina;
//   const fechasPaginadas = fechasFiltradas.slice(indiceInicio, indiceInicio + fechasPorPagina);

//   const cambiarPagina = (nuevaPagina: number) => {
//     if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
//       setPaginaActual(nuevaPagina);
//     }
//   };

//   const eliminarFecha = async (id: number) => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       Swal.fire('Acceso denegado', 'No tienes permisos para realizar esta acción.', 'warning');
//       return;
//     }

//     const confirmacion = await Swal.fire({
//       title: '¿Estás seguro?',
//       text: 'Esta acción eliminará la fecha seleccionada.',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Sí, eliminar',
//       cancelButtonText: 'Cancelar',
//     });

//     if (confirmacion.isConfirmed) {
//       try {
//         const response = await fetch(`${ApiRoutes.fechaCitas}/${id}`, {
//           method: 'DELETE',
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error('Error al eliminar la fecha');
//         }

//         Swal.fire('Eliminado', 'La fecha ha sido eliminada correctamente.', 'success');
//         fetchFechas();
//       } catch (error) {
//         console.error(error);
//         Swal.fire('Error', 'No se pudo eliminar la fecha.', 'error');
//       }
//     }
//   };

//   return (
//     <div className="max-w-5xl mx-auto mt-10 bg-white shadow-md rounded p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold">Fechas de Citas Disponibles</h1>
//         <button
//           onClick={() => navigate('/dashboard/crear-fecha')}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           Crear Nueva Fecha
//         </button>
//       </div>

//       <div className="mb-4">
//         <label className="mr-4 font-medium">Mostrar:</label>
//         <select
//           value={mostrarProximas ? 'proximas' : 'todas'}
//           onChange={(e) => {
//             setMostrarProximas(e.target.value === 'proximas');
//             setPaginaActual(1);
//           }}
//           className="border rounded p-2"
//         >
//           <option value="proximas">Próximas Fechas</option>
//           <option value="todas">Todas las Fechas</option>
//         </select>
//       </div>

//       <div className="flex-1 overflow-auto bg-white shadow-lg rounded-lg mt-4">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="p-2 border-b">ID</th>
//               <th className="p-2 border-b">Fecha</th>
//               <th className="p-2 border-b">Acciones</th>
//             </tr>
//           </thead>
//           <tbody>
//             {fechasPaginadas.length > 0 ? (
//               fechasPaginadas.map((fecha) => (
//                 <tr key={fecha.id} className="text-center">
//                   <td className="p-2 border-b">{fecha.id}</td>
//                   <td className="p-2 border-b">{fecha.date}</td>
//                   <td className="p-2 border-b space-x-2">
//                     <button
//                       onClick={() => navigate(`/dashboard/horas-citas/${fecha.id}`)}
//                       className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
//                     >
//                       Asignar Horas
//                     </button>
//                     <button
//                       onClick={() => eliminarFecha(fecha.id)}
//                       className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//                     >
//                       Eliminar
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={3} className="p-2 text-center">
//                   No hay fechas disponibles.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Paginación */}
//       {totalPaginas > 1 && (
//         <div className="flex justify-center items-center mt-4 space-x-2">
//           <button
//             onClick={() => cambiarPagina(paginaActual - 1)}
//             disabled={paginaActual === 1}
//             className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
//           >
//             Anterior
//           </button>
//           <span className="font-medium">
//             Página {paginaActual} de {totalPaginas}
//           </span>
//           <button
//             onClick={() => cambiarPagina(paginaActual + 1)}
//             disabled={paginaActual === totalPaginas}
//             className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
//           >
//             Siguiente
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiRoutes from '../../Components/ApiRoutes';
import Swal from 'sweetalert2';
import { io, Socket } from 'socket.io-client';
import Paginacion from '../../Components/Paginacion';

interface FechaCita {
  id: number;
  date: string;
}

export default function DiasCitasTable() {
  const [fechas, setFechas] = useState<FechaCita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [mostrarProximas, setMostrarProximas] = useState(true); // 🔥 Solo este filtro

  const navigate = useNavigate();

  const fetchFechas = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(ApiRoutes.fechaCitas, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Error al obtener fechas');
      const data = await response.json();
      setFechas(data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar las fechas de citas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFechas();

    const socket = io(ApiRoutes.urlBase, {
      transports: ['websocket'],
      auth: { token: localStorage.getItem('token') },
    });

    socket.on('nueva-fecha-cita', (nuevaFecha: FechaCita) => {
      setFechas((prev) => [nuevaFecha, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const eliminarFecha = async (id: number) => {
    const confirmacion = await Swal.fire({
      title: '¿Eliminar fecha?',
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
      const token = localStorage.getItem('token');
      await fetch(`${ApiRoutes.fechaCitas}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire('¡Eliminado!', 'La fecha fue eliminada correctamente.', 'success');
      setFechas((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'No se pudo eliminar la fecha.', 'error');
    }
  };

  // 🔥 Aplica solo filtro de fechas próximas/todas
  const fechasFiltradas = fechas.filter((fecha) =>
    mostrarProximas ? new Date(fecha.date) >= new Date() : true
  );

  const indexFinal = currentPage * itemsPerPage;
  const indexInicio = indexFinal - itemsPerPage;
  const fechasActuales = fechasFiltradas.slice(indexInicio, indexFinal);
  const totalPaginas = Math.ceil(fechasFiltradas.length / itemsPerPage);

  if (loading) return <p className="text-center text-gray-500">Cargando fechas...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="flex flex-col p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Fechas de Citas</h2>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        {/* 🔥 Filtro solo de próximas/todas */}
        <div>
          <label className="mr-2 font-semibold">Mostrar:</label>
          <select
            value={mostrarProximas ? 'proximas' : 'todas'}
            onChange={(e) => {
              setMostrarProximas(e.target.value === 'proximas');
              setCurrentPage(1); // Reset página
            }}
            className="text-sm border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="proximas">Próximas Fechas</option>
            <option value="todas">Todas las Fechas</option>
          </select>
        </div>

        <button
          onClick={() => navigate('/dashboard/crear-fecha')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Crear Nueva Fecha
        </button>
      </div>

      <div className="flex-1 overflow-auto bg-white shadow-lg rounded-lg max-h-[70vh]">
        <table className="min-w-full border border-gray-300 rounded-lg shadow-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">ID</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Fecha</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {fechasActuales.length > 0 ? (
              fechasActuales.map((fecha) => (
                <tr key={fecha.id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border-b">{fecha.id}</td>
                  <td className="px-4 py-2 border-b">{fecha.date}</td>
                  <td className="px-4 py-2 border-b space-x-2">
                    <button
                      onClick={() => navigate(`/dashboard/horas-citas/${fecha.id}`)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Asignar Horas
                    </button>
                    <button
                      onClick={() => eliminarFecha(fecha.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="p-4 text-center">
                  No hay fechas disponibles.
                </td>
              </tr>
            )}
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
