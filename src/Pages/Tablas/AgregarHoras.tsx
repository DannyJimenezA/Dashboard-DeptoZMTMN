// // src/Pages/Gestion/AgregarHorasPage.tsx

// import { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import ApiRoutes from '../../Components/ApiRoutes';
// import Swal from 'sweetalert2';

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
//     '15:00', '15:30'
//   ];

//   const obtenerFecha = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error('Token no disponible');

//       const response = await fetch(ApiRoutes.fechaCitas + `/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!response.ok) throw new Error('Error al obtener fecha');

//       const fecha = await response.json();
//       setFechaSeleccionada(fecha);
//     } catch (error) {
//       console.error(error);
//       Swal.fire('Error', 'No se pudo obtener la fecha seleccionada.', 'error');
//       navigate('/dashboard/dias-citas');
//     }
//   };


//   const obtenerHoras = async () => {
//     if (!id) return;
//     setLoadingHoras(true);
//     const token = localStorage.getItem('token');
//     if (!token) return;
  
//     try {
//       const response = await fetch(`${ApiRoutes.horasCitas}/fecha/${id}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       });
  
//       if (!response.ok) {
//         throw new Error(`Error: ${response.status} - ${response.statusText}`);
//       }
  
//       const data = await response.json();
//       const horasNormalizadas = (Array.isArray(data) ? data : data.horasDisponibles).map(
//         (item: any) => item.hora.slice(0, 5)
//       );
//       setHorasCreadas(horasNormalizadas);
//       setHorasSeleccionadas(horasNormalizadas);
//     } catch (error) {
//       console.error('Error al obtener las horas:', error);
//     } finally {
//       setLoadingHoras(false);
//     }
//   };
  
//   useEffect(() => {
//     obtenerFecha();
//     obtenerHoras();
//   }, [id]);

//   const seleccionarTodasLasHoras = () => {
//     const nuevasHoras = horasPreestablecidas.filter(h => !horasCreadas.includes(h));
//     setHorasSeleccionadas([...horasCreadas, ...nuevasHoras]);
//   };

//   const deseleccionarTodasLasHoras = () => {
//     setHorasSeleccionadas(horasCreadas);
//   };

//   const handleSeleccionarHora = (hora: string) => {
//     if (horasCreadas.includes(hora)) return;

//     if (horasSeleccionadas.includes(hora)) {
//       setHorasSeleccionadas(horasSeleccionadas.filter(h => h !== hora));
//     } else {
//       setHorasSeleccionadas([...horasSeleccionadas, hora]);
//     }
//   };

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
//       const responseHoras = await fetch(ApiRoutes.horasCitas, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           fechaId: Number(id),
//           hora: nuevasHoras,
//         }),
//       });

//       if (!responseHoras.ok) {
//         const errorData = await responseHoras.json();
//         throw new Error(errorData.message || 'Error al agregar la hora');
//       }

//       await responseHoras.json();
//       Swal.fire('¡Éxito!', 'Horas agregadas correctamente.', 'success');
//       navigate('/dashboard/dias-citas');
//     } catch (error) {
//       console.error('Error al agregar horas:', error);
//       Swal.fire('Error', 'Error al agregar horas. Intenta de nuevo.', 'error');
//     }
//   };

//   if (!fechaSeleccionada) return <p className="text-center mt-10">Cargando fecha...</p>;

//   return (
//     <div className="max-w-3xl mx-auto mt-10 bg-white shadow-md rounded p-6">
//       <h1 className="text-2xl font-bold text-center mb-6">
//         Agregar Horas a {fechaSeleccionada.date}
//       </h1>

//       {loadingHoras ? (
//         <p className="text-center">Cargando horas...</p>
//       ) : (
//         <>
//           <div className="flex justify-center gap-4 mb-6">
//             <button
//               onClick={seleccionarTodasLasHoras}
//               className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//             >
//               Seleccionar Todas
//             </button>
//             <button
//               onClick={deseleccionarTodasLasHoras}
//               className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
//             >
//               Deseleccionar Todas
//             </button>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             {horasPreestablecidas.map((hora, index) => {
//               const yaCreada = horasCreadas.includes(hora);
//               return (
//                 <label key={index} className="flex items-center space-x-2">
//                   <input
//                     type="checkbox"
//                     checked={horasSeleccionadas.includes(hora)}
//                     onChange={() => handleSeleccionarHora(hora)}
//                     disabled={yaCreada}
//                     className="form-checkbox h-5 w-5 text-blue-600"
//                   />
//                   <span className={yaCreada ? 'text-gray-500 italic' : ''}>
//                     {hora} {yaCreada && '(ya creada)'}
//                   </span>
//                 </label>
//               );
//             })}
//           </div>

//           <div className="flex justify-end gap-4 mt-8">
//             <button
//               onClick={handleAgregarHoras}
//               className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//             >
//               Confirmar
//             </button>
//             <button
//               onClick={() => navigate('/dashboard/dias-citas')}
//               className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
//             >
//               Cancelar
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// src/Pages/Gestion/AgregarHorasPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ApiRoutes from '../../Components/ApiRoutes';
import Swal from 'sweetalert2';


export default function AgregarHorasPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [horasSeleccionadas, setHorasSeleccionadas] = useState<string[]>([]);
  const [horasCreadas, setHorasCreadas] = useState<string[]>([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<{ id: number; date: string } | null>(null);
  const [loadingHoras, setLoadingHoras] = useState<boolean>(false);

  const horasPreestablecidas = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30',
  ];

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
          (item: any) => item.hora.slice(0, 5)
        );

        setHorasCreadas(horasNormalizadas);
        setHorasSeleccionadas(horasNormalizadas);
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
    const nuevasHoras = horasPreestablecidas.filter(h => !horasCreadas.includes(h));
    setHorasSeleccionadas([...horasCreadas, ...nuevasHoras]);
  };

  const deseleccionarTodasLasHoras = () => {
    setHorasSeleccionadas(horasCreadas);
  };

  const handleSeleccionarHora = (hora: string) => {
    if (horasCreadas.includes(hora)) return;

    setHorasSeleccionadas(prev =>
      prev.includes(hora)
        ? prev.filter(h => h !== hora)
        : [...prev, hora]
    );
  };

  const handleAgregarHoras = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire('Acceso denegado', 'No tienes permisos para realizar esta acción.', 'warning');
      return;
    }

    const nuevasHoras = horasSeleccionadas.filter(h => !horasCreadas.includes(h));
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
      Swal.fire('¡Éxito!', 'Horas agregadas correctamente.', 'success');
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
      {/* Header */}
      <div className="bg-slate-800 p-4 text-white flex justify-between items-center">
        <h2 className="text-xl font-bold">Agregar Horas a {fechaSeleccionada.date}</h2>
      </div>

      {/* Contenido */}
      <div className="p-6 space-y-6">
        {loadingHoras ? (
          <div className="text-center text-gray-500">Cargando horas disponibles...</div>
        ) : (
          <>
            <div className="flex gap-4 justify-center mb-4">
              <button
                onClick={seleccionarTodasLasHoras}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
              >
                Seleccionar Todas
              </button>
              <button
                onClick={deseleccionarTodasLasHoras}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center gap-2"
              >
                Deseleccionar Todas
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {horasPreestablecidas.map((hora, index) => {
                const yaCreada = horasCreadas.includes(hora);
                return (
                  <label key={index} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-5 w-5 text-teal-600"
                      checked={horasSeleccionadas.includes(hora)}
                      onChange={() => handleSeleccionarHora(hora)}
                      disabled={yaCreada}
                    />
                    <span className={yaCreada ? 'text-gray-500 italic' : 'text-gray-700'}>
                      {hora} {yaCreada && '(ya creada)'}
                    </span>
                  </label>
                );
              })}
            </div>

            <div className="flex justify-end gap-4 pt-6">
              <button
                onClick={handleAgregarHoras}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
              >
                Confirmar
              </button>
              <button
                onClick={() => navigate('/dashboard/dias-citas')}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 flex items-center gap-2"
              >
                Cancelar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
