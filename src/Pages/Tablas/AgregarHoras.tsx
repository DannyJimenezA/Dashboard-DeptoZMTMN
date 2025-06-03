// import { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import ApiRoutes from '../../Components/ApiRoutes';
// import Swal from 'sweetalert2';
// import { FaTrash } from 'react-icons/fa';

// export default function AgregarHorasPage() {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const [horasSeleccionadas, setHorasSeleccionadas] = useState<string[]>([]);
//   const [horasCreadas, setHorasCreadas] = useState<string[]>([]);
//   const [fechaSeleccionada, setFechaSeleccionada] = useState<{ id: number; date: string } | null>(null);
//   const [loadingHoras, setLoadingHoras] = useState<boolean>(false);

//   const horasPreestablecidas = [
//     '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
//     '11:00', '11:30', '13:00', '13:30', '14:00', '14:30',
//     '15:00', '15:30',
//   ];

//   function formatearFechaVisual(fechaISO: string): string {
//     const [year, month, day] = fechaISO.split('-');
//     return `${day}/${month}/${year}`;
//   }

//   function formatearHora12h(hora24: string): string {
//     const [horas, minutos] = hora24.split(':');
//     const date = new Date();
//     date.setHours(parseInt(horas, 10));
//     date.setMinutes(parseInt(minutos, 10));

//     return date.toLocaleTimeString('es-CR', {
//       hour: 'numeric',
//       minute: '2-digit',
//       hour12: true,
//     });
//   }

//   useEffect(() => {
//     const obtenerFecha = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) throw new Error('Token no disponible');
//         const response = await fetch(`${ApiRoutes.fechaCitas}/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (!response.ok) throw new Error('Error al obtener fecha');
//         const fecha = await response.json();
//         setFechaSeleccionada(fecha);
//       } catch (error) {
//         console.error(error);
//         Swal.fire('Error', 'No se pudo obtener la fecha seleccionada.', 'error');
//         navigate('/dashboard/dias-citas');
//       }
//     };

//     const obtenerHoras = async () => {
//       if (!id) return;
//       setLoadingHoras(true);
//       const token = localStorage.getItem('token');
//       if (!token) return;

//       try {
//         const response = await fetch(`${ApiRoutes.horasCitas}/fecha/${id}`, {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) throw new Error(`Error: ${response.status}`);

//         const data = await response.json();
//         const horasNormalizadas = (Array.isArray(data) ? data : data.horasDisponibles).map(
//           (item: any) => item.hora.slice(0, 5)
//         );

//         setHorasCreadas(horasNormalizadas);
//         setHorasSeleccionadas(horasNormalizadas);
//       } catch (error) {
//         console.error('Error al obtener las horas:', error);
//       } finally {
//         setLoadingHoras(false);
//       }
//     };

//     obtenerFecha();
//     obtenerHoras();
//   }, [id, navigate]);

//   const seleccionarTodasLasHoras = () => {
//     const nuevasHoras = horasPreestablecidas.filter(h => !horasCreadas.includes(h));
//     setHorasSeleccionadas([...horasCreadas, ...nuevasHoras]);
//   };

//   const deseleccionarTodasLasHoras = () => {
//     setHorasSeleccionadas(horasCreadas);
//   };

//   const handleSeleccionarHora = (hora: string) => {
//     if (horasCreadas.includes(hora)) return;

//     setHorasSeleccionadas(prev =>
//       prev.includes(hora)
//         ? prev.filter(h => h !== hora)
//         : [...prev, hora]
//     );
//   };

//   // const handleEliminarHora = async (hora: string) => {
//   //   const token = localStorage.getItem('token');
//   //   if (!token || !id) return;

//   //   const confirmacion = await Swal.fire({
//   //     title: `¿Eliminar la hora ${formatearHora12h(hora)}?`,
//   //     text: 'Esta acción no se puede deshacer.',
//   //     icon: 'warning',
//   //     showCancelButton: true,
//   //     confirmButtonText: 'Sí, eliminar',
//   //     cancelButtonText: 'Cancelar',
//   //     confirmButtonColor: '#d33',
//   //     cancelButtonColor: '#3085d6',
//   //   });

//   //   if (!confirmacion.isConfirmed) return;

//   //   try {
//   //     const response = await fetch(`${ApiRoutes.horasCitas}/${id}/${hora}`, {
//   //       method: 'DELETE',
//   //       headers: {
//   //         Authorization: `Bearer ${token}`,
//   //       },
//   //     });

//   //     if (!response.ok) throw new Error('Error al eliminar la hora');

//   //     Swal.fire('Eliminada', 'La hora fue eliminada exitosamente.', 'success');
//   //     setHorasCreadas(prev => prev.filter(h => h !== hora));
//   //     setHorasSeleccionadas(prev => prev.filter(h => h !== hora));
//   //   } catch (error) {
//   //     console.error('Error al eliminar la hora:', error);
//   //     Swal.fire('Error', 'No se pudo eliminar la hora. Intenta de nuevo.', 'error');
//   //   }
//   // };

// const handleEliminarHora = async (hora: string) => {
//   const token = localStorage.getItem('token');
//   if (!token || !id) return;

//   const confirmacion = await Swal.fire({
//     title: `¿Eliminar la hora ${formatearHora12h(hora)}?`,
//     text: 'Esta acción no se puede deshacer.',
//     icon: 'warning',
//     showCancelButton: true,
//     confirmButtonText: 'Sí, eliminar',
//     cancelButtonText: 'Cancelar',
//     confirmButtonColor: '#d33',
//     cancelButtonColor: '#3085d6',
//   });

//   if (!confirmacion.isConfirmed) return;

//   try {
//     const response = await fetch(`${ApiRoutes.horasCitas}/${id}/${hora}`, {
//       method: 'DELETE',
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!response.ok) {
//       if (response.status === 409) {
//         const { message } = await response.json();
//         Swal.fire('No se puede eliminar', message || 'La hora tiene una cita asociada.', 'info');
//       } else {
//         throw new Error('Error inesperado al eliminar');
//       }
//       return;
//     }

//     Swal.fire('Eliminada', 'La hora fue eliminada exitosamente.', 'success');
//     setHorasCreadas(prev => prev.filter(h => h !== hora));
//     setHorasSeleccionadas(prev => prev.filter(h => h !== hora));
//   } catch (error) {
//     console.error('Error al eliminar la hora:', error);
//     Swal.fire('Error', 'No se pudo eliminar la hora. Intenta de nuevo.', 'error');
//   }
// };


//   const handleAgregarHoras = async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       Swal.fire('Acceso denegado', 'No tienes permisos para realizar esta acción.', 'warning');
//       return;
//     }

//     const nuevasHoras = horasSeleccionadas.filter(h => !horasCreadas.includes(h));
//     if (nuevasHoras.length === 0) {
//       Swal.fire('Sin selección', 'Selecciona al menos una hora nueva para agregar.', 'info');
//       return;
//     }

//     try {
//       const response = await fetch(ApiRoutes.horasCitas, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ fechaId: Number(id), hora: nuevasHoras }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Error al agregar la hora');
//       }

//       await response.json();
//       Swal.fire({
//         title: '¡Éxito!',
//         text: 'Horas agregadas correctamente.',
//         icon: 'success',
//         confirmButtonColor: '#00a884',
//         timer: 3000,
//         showConfirmButton: false,
//       });
//       navigate('/dashboard/dias-citas');
//     } catch (error) {
//       console.error('Error al agregar horas:', error);
//       Swal.fire('Error', 'Error al agregar horas. Intenta de nuevo.', 'error');
//     }
//   };

//   if (!fechaSeleccionada) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <p className="text-gray-600">Cargando fecha...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
//       <div className="bg-slate-800 p-4 text-white flex justify-between items-center">
//         <h2 className="text-xl font-bold">
//           Agregar Horas a {formatearFechaVisual(fechaSeleccionada.date)}
//         </h2>
//       </div>

//       <div className="p-6 space-y-6">
//         {loadingHoras ? (
//           <div className="text-center text-gray-500">Cargando horas disponibles...</div>
//         ) : (
//           <>
//             <div className="flex gap-4 justify-center mb-4">
//               <button
//                 onClick={seleccionarTodasLasHoras}
//                 className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
//               >
//                 Seleccionar Todas
//               </button>
//               <button
//                 onClick={deseleccionarTodasLasHoras}
//                 className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center gap-2"
//               >
//                 Deseleccionar Todas
//               </button>
//             </div>

//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//               {horasPreestablecidas.map((hora, index) => {
//                 const yaCreada = horasCreadas.includes(hora);
//                 return (
//                   <div key={index} className="flex items-center justify-between">
//                     <label className="flex items-center gap-2">
//                       <input
//                         type="checkbox"
//                         className="h-5 w-5 text-teal-600"
//                         checked={horasSeleccionadas.includes(hora)}
//                         onChange={() => handleSeleccionarHora(hora)}
//                         disabled={yaCreada}
//                       />
//                       <span className={yaCreada ? 'text-gray-500 italic' : 'text-gray-700'}>
//                         {/* {formatearHora12h(hora)} {yaCreada && '(ya creada)'} */}
//                         {formatearHora12h(hora)} {yaCreada}

//                       </span>
//                     </label>
//                     {yaCreada && (
//                       <button
//                         onClick={() => handleEliminarHora(hora)}
//                         className="text-red-600 hover:text-red-800 text-sm"
//                       >
//                          <FaTrash />
//                         {/* Eliminar */}
//                       </button>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>

//             <div className="flex justify-end gap-4 pt-6">
//               <button
//                 onClick={handleAgregarHoras}
//                 className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
//               >
//                 Confirmar
//               </button>
//               <button
//                 onClick={() => navigate('/dashboard/dias-citas')}
//                 className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 flex items-center gap-2"
//               >
//                 Cancelar
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ApiRoutes from '../../Components/ApiRoutes';
import Swal from 'sweetalert2';
import { FaTrash } from 'react-icons/fa';

// interface HoraConEstado {
//   hora: string;
//   tieneCita: boolean;
// }

interface HoraInfo {
  hora: string;
  tieneCita: boolean;
}

export default function AgregarHorasPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [horasSeleccionadas, setHorasSeleccionadas] = useState<string[]>([]);
  const [horasCreadas, setHorasCreadas] = useState<HoraInfo[]>([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<{ id: number; date: string } | null>(null);
  const [loadingHoras, setLoadingHoras] = useState<boolean>(false);

  const horasPreestablecidas = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30',
  ];

  function formatearFechaVisual(fechaISO: string): string {
    const [year, month, day] = fechaISO.split('-');
    return `${day}/${month}/${year}`;
  }

  function formatearHora12h(hora24: string): string {
    const [horas, minutos] = hora24.split(':');
    const date = new Date();
    date.setHours(parseInt(horas, 10));
    date.setMinutes(parseInt(minutos, 10));
    return date.toLocaleTimeString('es-CR', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  useEffect(() => {
    const obtenerFecha = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token no disponible');
        const response = await fetch(`${ApiRoutes.fechaCitas}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Error al obtener fecha');
        const fecha = await response.json();
        setFechaSeleccionada(fecha);
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudo obtener la fecha seleccionada.', 'error');
        navigate('/dashboard/dias-citas');
      }
    };

    const obtenerHoras = async () => {
      if (!id) return;
      setLoadingHoras(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch(`${ApiRoutes.horasCitas}/fecha/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const data = await response.json();
        const horasNormalizadas = (Array.isArray(data) ? data : data.horasDisponibles).map(
          (item: any) => ({
            hora: item.hora.slice(0, 5),
            tieneCita: item.disponibilidad === false,
          })
        );

        setHorasCreadas(horasNormalizadas);
        setHorasSeleccionadas(horasNormalizadas.map((h: HoraInfo) => h.hora));
      } catch (error) {
        console.error('Error al obtener las horas:', error);
      } finally {
        setLoadingHoras(false);
      }
    };

    obtenerFecha();
    obtenerHoras();
  }, [id, navigate]);

  const seleccionarTodasLasHoras = () => {
    const nuevasHoras = horasPreestablecidas.filter(h => !horasCreadas.some(hc => hc.hora === h));
    setHorasSeleccionadas([...horasCreadas.map(h => h.hora), ...nuevasHoras]);
  };

  const deseleccionarTodasLasHoras = () => {
    setHorasSeleccionadas(horasCreadas.map(h => h.hora));
  };

  const handleSeleccionarHora = (hora: string) => {
    if (horasCreadas.some(hc => hc.hora === hora)) return;

    setHorasSeleccionadas(prev =>
      prev.includes(hora)
        ? prev.filter(h => h !== hora)
        : [...prev, hora]
    );
  };

  // const handleEliminarHora = async (hora: string) => {
  //   const token = localStorage.getItem('token');
  //   if (!token || !id) return;

  //   const confirmacion = await Swal.fire({
  //     title: `¿Eliminar la hora ${formatearHora12h(hora)}?`,
  //     text: 'Esta acción no se puede deshacer.',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Sí, eliminar',
  //     cancelButtonText: 'Cancelar',
  //     confirmButtonColor: '#d33',
  //     cancelButtonColor: '#3085d6',
  //   });

  //   if (!confirmacion.isConfirmed) return;

  //   try {
  //     const response = await fetch(`${ApiRoutes.horasCitas}/${id}/${hora}`, {
  //       method: 'DELETE',
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     if (!response.ok) {
  //       if (response.status === 409) {
  //         const { message } = await response.json();
  //         Swal.fire('No se puede eliminar', message || 'La hora tiene una cita asociada.', 'info');
  //       } else {
  //         throw new Error('Error inesperado al eliminar');
  //       }
  //       return;
  //     }

  //     Swal.fire('Eliminada', 'La hora fue eliminada exitosamente.', 'success');
  //     setHorasCreadas(prev => prev.filter(h => h.hora !== hora));
  //     setHorasSeleccionadas(prev => prev.filter(h => h !== hora));
  //   } catch (error) {
  //     console.error('Error al eliminar la hora:', error);
  //     Swal.fire('Error', 'No se pudo eliminar la hora. Intenta de nuevo.', 'error');
  //   }
  // };

const handleEliminarHora = async (hora: string) => {
  const token = localStorage.getItem('token');
  if (!token || !id) return;

  const confirmacion = await Swal.fire({
    title: `¿Eliminar la hora ${formatearHora12h(hora)}?`,
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
  });

  if (!confirmacion.isConfirmed) return;

  try {
    const response = await fetch(`${ApiRoutes.horasCitas}/${id}/${hora}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    // Aquí permitimos eliminar aunque la hora esté asociada a una cita,
    // por lo que no bloqueamos con error 409, simplemente avisamos o ignoramos el error.

    if (!response.ok) {
      // Opcional: si quieres mostrar el error para otros casos:
      if (response.status !== 409) {
        throw new Error('Error inesperado al eliminar');
      }
      // Si es 409, no mostramos error, se permite eliminar igual.
    }

    Swal.fire('Eliminada', 'La hora fue eliminada exitosamente.', 'success');
    setHorasCreadas(prev => prev.filter(h => h.hora !== hora));
    setHorasSeleccionadas(prev => prev.filter(h => h !== hora));
  } catch (error) {
    console.error('Error al eliminar la hora:', error);
    Swal.fire('Error', 'No se pudo eliminar la hora. Intenta de nuevo.', 'error');
  }
};


  const handleAgregarHoras = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire('Acceso denegado', 'No tienes permisos para realizar esta acción.', 'warning');
      return;
    }

    const nuevasHoras = horasSeleccionadas.filter(h => !horasCreadas.some(hc => hc.hora === h));
    if (nuevasHoras.length === 0) {
      Swal.fire('Sin selección', 'Selecciona al menos una hora nueva para agregar.', 'info');
      return;
    }

    try {
      const response = await fetch(ApiRoutes.horasCitas, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fechaId: Number(id), hora: nuevasHoras }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al agregar la hora');
      }

      await response.json();
      Swal.fire({
        title: '¡Éxito!',
        text: 'Horas agregadas correctamente.',
        icon: 'success',
        confirmButtonColor: '#00a884',
        timer: 3000,
        showConfirmButton: false,
      });
      navigate('/dashboard/dias-citas');
    } catch (error) {
      console.error('Error al agregar horas:', error);
      Swal.fire('Error', 'Error al agregar horas. Intenta de nuevo.', 'error');
    }
  };

  if (!fechaSeleccionada) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">Cargando fecha...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-slate-800 p-4 text-white flex justify-between items-center">
        <h2 className="text-xl font-bold">
          Agregar Horas a {formatearFechaVisual(fechaSeleccionada.date)}
        </h2>
      </div>

      <div className="p-6 space-y-6">
        {loadingHoras ? (
          <div className="text-center text-gray-500">Cargando horas disponibles...</div>
        ) : (
          <>
            <div className="flex gap-4 justify-center mb-4">
              <button onClick={seleccionarTodasLasHoras} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Seleccionar Todas</button>
              <button onClick={deseleccionarTodasLasHoras} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Deseleccionar Todas</button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {/* {horasPreestablecidas.map((hora, index) => {
                const horaInfo = horasCreadas.find(hc => hc.hora === hora);
                const yaCreada = !!horaInfo;
                const tieneCita = horaInfo?.tieneCita;

                return (
                  <div key={index} className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-5 w-5 text-teal-600"
                        checked={horasSeleccionadas.includes(hora)}
                        onChange={() => handleSeleccionarHora(hora)}
                        disabled={yaCreada}
                      />
                      <span className={yaCreada ? 'text-gray-500 italic' : 'text-gray-700'}>
                        {formatearHora12h(hora)} {yaCreada && '(ya creada)'}
                      </span>
                    </label>
                    {yaCreada && !tieneCita && (
                      <button
                        onClick={() => handleEliminarHora(hora)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                );
              })} */}
              {horasPreestablecidas.map((hora, index) => {
                const horaObj = horasCreadas.find((h) => h.hora === hora);
                const yaCreada = !!horaObj;
                const tieneCita = horaObj?.tieneCita;

                return (
                  <div key={index} className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-5 w-5 text-teal-600"
                        checked={horasSeleccionadas.includes(hora)}
                        onChange={() => handleSeleccionarHora(hora)}
                        disabled={yaCreada}
                      />
                      <span className={yaCreada ? 'text-gray-500 italic' : 'text-gray-700'}>
                        {formatearHora12h(hora)} {yaCreada && '(ya creada)'}
                      </span>
                    </label>

                    {yaCreada && !tieneCita && (
                      <button
                        onClick={() => handleEliminarHora(hora)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                );
              })}

            </div>

            <div className="flex justify-end gap-4 pt-6">
              <button onClick={handleAgregarHoras} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Confirmar</button>
              <button onClick={() => navigate('/dashboard/dias-citas')} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">Cancelar</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
