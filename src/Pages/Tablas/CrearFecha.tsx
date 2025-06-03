// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../Auth/useAuth';
// import ApiRoutes from '../../Components/ApiRoutes';
// import Swal from 'sweetalert2';

// export default function CrearFecha() {
//   const [nuevaFecha, setNuevaFecha] = useState('');
//   const navigate = useNavigate();
//   const { userPermissions } = useAuth();

//   function formatearFechaDDMMYYYY(fechaISO: string): string {
//     if (!fechaISO) return '';
//     const [year, month, day] = fechaISO.split('-');
//     return `${day}/${month}/${year}`;
//   }

//   const handleCrearFecha = async () => {
//     const token = localStorage.getItem('token');

//     if (!userPermissions.includes('crear_available-dates')) {
//       Swal.fire('Permiso denegado', 'No tienes permisos para crear una nueva fecha.', 'warning');
//       return;
//     }

//     if (!token) {
//       Swal.fire('Acceso denegado', 'Token inválido o sesión expirada.', 'warning');
//       return;
//     }

//     if (!nuevaFecha) {
//       Swal.fire('Campo vacío', 'Por favor selecciona una fecha antes de continuar.', 'info');
//       return;
//     }

//     try {
//       const responseFecha = await fetch(ApiRoutes.fechaCitas, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ date: nuevaFecha }), // enviar en ISO para backend
//       });

//       if (!responseFecha.ok) {
//         const errorData = await responseFecha.json();
//         console.error('Error al crear la fecha:', errorData);
//         throw new Error(`Error al crear la fecha: ${responseFecha.statusText}`);
//       }

//       Swal.fire({
//         title: "¡Éxito!",
//         text: `Fecha creada correctamente.`,
//         icon: "success",
//         confirmButtonColor: "#00a884",
//         timer: 3000,
//         showConfirmButton: false,
//       });
//       setNuevaFecha('');
//       navigate('/dashboard/dias-citas');
//     } catch (error) {
//       console.error('Error al crear la fecha:', error);
//       Swal.fire(
//         'Error',
//         'Ocurrió un error al crear la fecha. Verifica que no exista y vuelve a intentarlo.',
//         'error'
//       );
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
//       {/* Header */}
//       <div className="bg-slate-800 p-4 text-white flex justify-between items-center">
//         <h2 className="text-xl font-bold">Crear Nueva Fecha de Cita</h2>
//       </div>

//       {/* Formulario */}
//       <div className="p-6 space-y-6">
//         <div className="bg-white border border-gray-200 rounded-lg p-4">
//           <label
//             htmlFor="fecha"
//             className="block text-sm font-medium text-gray-700 mb-2 flex items-center justify-between"
//           >
//             Selecciona una fecha:
//             <span className="text-gray-600 text-sm ml-4">
//               {nuevaFecha ? formatearFechaDDMMYYYY(nuevaFecha) : ''}
//             </span>
//           </label>
//           <input
//             id="fecha"
//             type="date"
//             value={nuevaFecha}  // El input debe mantener el valor yyyy-mm-dd para funcionar correctamente
//             onChange={(e) => setNuevaFecha(e.target.value)}
//             className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//           />
//         </div>

//         {/* Acciones */}
//         <div className="flex flex-col sm:flex-row justify-end gap-3">
//           <button
//             onClick={handleCrearFecha}
//             className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 justify-center"
//           >
//             Crear Fecha
//           </button>
//           <button
//             onClick={() => navigate('/dashboard/dias-citas')}
//             className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center gap-2 justify-center"
//           >
//             Cancelar
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/useAuth';
import ApiRoutes from '../../Components/ApiRoutes';
import Swal from 'sweetalert2';

export default function CrearFecha() {
  const [nuevaFecha, setNuevaFecha] = useState('');
  const [fechasExistentes, setFechasExistentes] = useState<string[]>([]);
  const navigate = useNavigate();
  const { userPermissions } = useAuth();

  useEffect(() => {
    const fetchFechasExistentes = async () => {
      try {
        const response = await fetch(ApiRoutes.fechaCitas);
        if (!response.ok) throw new Error('Error al cargar fechas existentes');
        const data = await response.json();
        setFechasExistentes(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFechasExistentes();
  }, []);

  function formatearFechaDDMMYYYY(fechaISO: string): string {
    if (!fechaISO) return '';
    const [year, month, day] = fechaISO.split('-');
    return `${day}/${month}/${year}`;
  }

  const handleCrearFecha = async () => {
    const token = localStorage.getItem('token');

    if (!userPermissions.includes('crear_available-dates')) {
      Swal.fire('Permiso denegado', 'No tienes permisos para crear una nueva fecha.', 'warning');
      return;
    }

    if (!token) {
      Swal.fire('Acceso denegado', 'Token inválido o sesión expirada.', 'warning');
      return;
    }

    if (!nuevaFecha) {
      Swal.fire('Campo vacío', 'Por favor selecciona una fecha antes de continuar.', 'info');
      return;
    }

    if (fechasExistentes.includes(nuevaFecha)) {
      Swal.fire('Fecha duplicada', 'Esa fecha ya fue creada, elige otra.', 'warning');
      return;
    }

    const hoy = new Date();
    const fechaSeleccionada = new Date(nuevaFecha + 'T00:00:00');

    if (fechaSeleccionada < new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())) {
      Swal.fire('Fecha inválida', 'No puedes seleccionar una fecha anterior a hoy.', 'warning');
      return;
    }

    try {
      const responseFecha = await fetch(ApiRoutes.fechaCitas, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ date: nuevaFecha }),
      });

      if (!responseFecha.ok) {
        const errorData = await responseFecha.json();
        console.error('Error al crear la fecha:', errorData);
        throw new Error(`Error al crear la fecha: ${responseFecha.statusText}`);
      }

      Swal.fire({
        title: "¡Éxito!",
        text: `Fecha creada correctamente.`,
        icon: "success",
        confirmButtonColor: "#00a884",
        timer: 3000,
        showConfirmButton: false,
      });
      setNuevaFecha('');
      navigate('/dashboard/dias-citas');
    } catch (error) {
      console.error('Error al crear la fecha:', error);
      Swal.fire(
        'Error',
        'Ocurrió un error al crear la fecha. Verifica que no exista y vuelve a intentarlo.',
        'error'
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-slate-800 p-4 text-white flex justify-between items-center">
        <h2 className="text-xl font-bold">Crear Nueva Fecha de Cita</h2>
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <label
            htmlFor="fecha"
            className="block text-sm font-medium text-gray-700 mb-2 flex items-center justify-between"
          >
            Selecciona una fecha:
            <span className="text-gray-600 text-sm ml-4">
              {nuevaFecha ? formatearFechaDDMMYYYY(nuevaFecha) : ''}
            </span>
          </label>
          <input
            id="fecha"
            type="date"
            value={nuevaFecha}
            min={new Date().toISOString().split('T')[0]} // Fecha mínima hoy
            onChange={(e) => setNuevaFecha(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={handleCrearFecha}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 justify-center"
          >
            Crear Fecha
          </button>
          <button
            onClick={() => navigate('/dashboard/dias-citas')}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center gap-2 justify-center"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
