// // src/Pages/Gestion/DiasCitasPage.tsx

// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import ApiRoutes from '../../Components/ApiRoutes';
// import Swal from 'sweetalert2';
// import ModalAgregarHoras from '../../Pages/Tablas/AgregarHoras';

// interface FechaCita {
//   id: number;
//   date: string;
// }

// export default function DiasCitasPage() {
//   const [fechas, setFechas] = useState<FechaCita[]>([]);
//   const [mostrarProximas, setMostrarProximas] = useState<boolean>(true);
//   const [paginaActual, setPaginaActual] = useState<number>(1);
//   const [modalAbierto, setModalAbierto] = useState<boolean>(false);
//   const [fechaSeleccionada, setFechaSeleccionada] = useState<number | null>(null);
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

//       <table className="w-full border border-gray-300">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="p-2 border-b">ID</th>
//             <th className="p-2 border-b">Fecha</th>
//             <th className="p-2 border-b">Acciones</th>
//           </tr>
//         </thead>
//         <tbody>
//           {fechasPaginadas.length > 0 ? (
//             fechasPaginadas.map((fecha) => (
//               <tr key={fecha.id} className="text-center">
//                 <td className="p-2 border-b">{fecha.id}</td>
//                 <td className="p-2 border-b">{fecha.date}</td>
//                 <td className="p-2 border-b space-x-2">
//                   <button
//                     onClick={() => {
//                       setFechaSeleccionada(fecha.id);
//                       setModalAbierto(true);
//                     }}
//                     className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
//                   >
//                     Asignar Horas
//                   </button>
//                   <button
//                     onClick={() => eliminarFecha(fecha.id)}
//                     className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//                   >
//                     Eliminar
//                   </button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan={3} className="p-2 text-center">
//                 No hay fechas disponibles.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>

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

//       {/* Modal para asignar horas */}
//       {modalAbierto && fechaSeleccionada !== null && (
//         <ModalAgregarHoras
//           isOpen={modalAbierto}
//           onClose={() => setModalAbierto(false)}
//           onHorasAgregadas={() => {
//             setModalAbierto(false);
//             fetchFechas();
//           }}
//           fechasDisponibles={fechas}
//           fechaInicialSeleccionada={fechaSeleccionada}
//         />
//       )}
//     </div>
//   );
// }

// src/Pages/Gestion/DiasCitasPage.tsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiRoutes from '../../Components/ApiRoutes';
import Swal from 'sweetalert2';

interface FechaCita {
  id: number;
  date: string;
}

export default function DiasCitasPage() {
  const [fechas, setFechas] = useState<FechaCita[]>([]);
  const [mostrarProximas, setMostrarProximas] = useState<boolean>(true);
  const [paginaActual, setPaginaActual] = useState<number>(1);
  const navigate = useNavigate();

  const fechasPorPagina = 10;

  const fetchFechas = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire('Acceso denegado', 'No tienes permisos para ver las fechas.', 'warning');
      return;
    }

    try {
      const response = await fetch(ApiRoutes.fechaCitas, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener las fechas');
      }

      const data = await response.json();
      setFechas(data);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudieron cargar las fechas.', 'error');
    }
  };

  useEffect(() => {
    fetchFechas();
  }, []);

  const fechasFiltradas = mostrarProximas
    ? fechas.filter((fecha) => new Date(fecha.date) >= new Date())
    : fechas;

  const totalPaginas = Math.ceil(fechasFiltradas.length / fechasPorPagina);
  const indiceInicio = (paginaActual - 1) * fechasPorPagina;
  const fechasPaginadas = fechasFiltradas.slice(indiceInicio, indiceInicio + fechasPorPagina);

  const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  const eliminarFecha = async (id: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire('Acceso denegado', 'No tienes permisos para realizar esta acción.', 'warning');
      return;
    }

    const confirmacion = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la fecha seleccionada.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (confirmacion.isConfirmed) {
      try {
        const response = await fetch(`${ApiRoutes.fechaCitas}/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al eliminar la fecha');
        }

        Swal.fire('Eliminado', 'La fecha ha sido eliminada correctamente.', 'success');
        fetchFechas();
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudo eliminar la fecha.', 'error');
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white shadow-md rounded p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Fechas de Citas Disponibles</h1>
        <button
          onClick={() => navigate('/dashboard/crear-fecha')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Crear Nueva Fecha
        </button>
      </div>

      <div className="mb-4">
        <label className="mr-4 font-medium">Mostrar:</label>
        <select
          value={mostrarProximas ? 'proximas' : 'todas'}
          onChange={(e) => {
            setMostrarProximas(e.target.value === 'proximas');
            setPaginaActual(1);
          }}
          className="border rounded p-2"
        >
          <option value="proximas">Próximas Fechas</option>
          <option value="todas">Todas las Fechas</option>
        </select>
      </div>

      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border-b">ID</th>
            <th className="p-2 border-b">Fecha</th>
            <th className="p-2 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {fechasPaginadas.length > 0 ? (
            fechasPaginadas.map((fecha) => (
              <tr key={fecha.id} className="text-center">
                <td className="p-2 border-b">{fecha.id}</td>
                <td className="p-2 border-b">{fecha.date}</td>
                <td className="p-2 border-b space-x-2">
                  {/* <button
                    onClick={() => navigate(`/dashboard/horas-citas/${fecha.id}`)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Asignar Horas
                  </button> */}
                  <button
  onClick={() => navigate(`/dashboard/horas-citas/${fecha.id}`)}
  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
>
  Asignar Horas
</button>

                  <button
                    onClick={() => eliminarFecha(fecha.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="p-2 text-center">
                No hay fechas disponibles.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-2">
          <button
            onClick={() => cambiarPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="font-medium">
            Página {paginaActual} de {totalPaginas}
          </span>
          <button
            onClick={() => cambiarPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
