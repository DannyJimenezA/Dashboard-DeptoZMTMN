// import { useState } from 'react';
// import ApiRoutes from '../../Components/ApiRoutes';
// import Swal from 'sweetalert2';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../Auth/useAuth'; // 👈 Importa el contexto de auth

// export default function CrearFecha() {
//   const [nuevaFecha, setNuevaFecha] = useState<string>('');
//   const navigate = useNavigate();
//   const { userPermissions } = useAuth(); // 👈 Permisos del usuario

//   const handleCrearFecha = async () => {
//     const token = localStorage.getItem('token');

//     // 🚫 Verificar permiso antes de continuar
//     if (!userPermissions.includes('post_available-dates')) {
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
//         body: JSON.stringify({ date: nuevaFecha }),
//       });

//       if (!responseFecha.ok) {
//         const errorData = await responseFecha.json();
//         console.error('Error al crear la fecha:', errorData);
//         throw new Error(`Error al crear la fecha: ${responseFecha.statusText}`);
//       }

//       await Swal.fire('Éxito', 'Fecha creada correctamente.', 'success');
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
//     <div className="max-w-lg mx-auto mt-10 bg-white shadow-md rounded p-6">
//       <h1 className="text-2xl font-bold mb-4 text-center">Crear Nueva Fecha de Cita</h1>

//       <div className="mb-4">
//         <label htmlFor="fecha" className="block mb-2 font-medium">
//           Selecciona una fecha:
//         </label>
//         <input
//           id="fecha"
//           type="date"
//           value={nuevaFecha}
//           onChange={(e) => setNuevaFecha(e.target.value)}
//           className="w-full border rounded p-2"
//         />
//       </div>

//       <div className="flex justify-end gap-4">
//         <button
//           onClick={handleCrearFecha}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           Crear Fecha
//         </button>
//         <button
//           onClick={() => navigate('/dashboard/dias-citas')}
//           className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
//         >
//           Cancelar
//         </button>
//       </div>
//     </div>
//   );
// }

// src/Pages/CrearFecha.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/useAuth';
import ApiRoutes from '../../Components/ApiRoutes';
import Swal from 'sweetalert2';


export default function CrearFecha() {
  const [nuevaFecha, setNuevaFecha] = useState('');
  const navigate = useNavigate();
  const { userPermissions } = useAuth();

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

      // await Swal.fire('Éxito', 'Fecha creada correctamente.', 'success');
            Swal.fire({
              title: "¡Éxito!",
              text: `Fecha creada correctamente.`,
              icon: "success",
              confirmButtonColor: "#00a884",
                  timer: 3000,
            showConfirmButton: false,
            })
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
      {/* Header */}
      <div className="bg-slate-800 p-4 text-white flex justify-between items-center">
        <h2 className="text-xl font-bold">Crear Nueva Fecha de Cita</h2>
      </div>

      {/* Formulario */}
      <div className="p-6 space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-2">
            Selecciona una fecha:
          </label>
          <input
            id="fecha"
            type="date"
            value={nuevaFecha}
            onChange={(e) => setNuevaFecha(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Acciones */}
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
