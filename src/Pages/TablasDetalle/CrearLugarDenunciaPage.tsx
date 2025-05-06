// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Swal from 'sweetalert2';
// import ApiRoutes from '../../Components/ApiRoutes';

// export default function CrearLugarDenunciaPage() {
//   const [descripcion, setDescripcion] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!descripcion.trim()) {
//       Swal.fire('Campo requerido', 'Por favor, ingresa una descripción.', 'info');
//       return;
//     }

//     setLoading(true);

//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch(`${ApiRoutes.urlBase}/lugar-denuncia`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ descripcion }),
//       });

//       if (!response.ok) throw new Error();

//       Swal.fire('¡Agregado!', 'Lugar de denuncia creado correctamente.', 'success').then(() => {
//         navigate('/dashboard/lugar-denuncia');
//       });
//     } catch (error) {
//       Swal.fire('Error', 'No se pudo crear el lugar de denuncia.', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold mb-6 text-center">Agregar Lugar de Denuncia</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-1">Lugar</label>
//           <input
//             type="text"
//             value={descripcion}
//             onChange={(e) => setDescripcion(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded"
//             placeholder="Escriba el nombre del lugar de denuncia"
//             required
//           />
//         </div>
//         <div className="flex justify-between">
//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//           >
//             {loading ? 'Guardando...' : 'Guardar Lugar'}
//           </button>
//           <button
//             type="button"
//             onClick={() => navigate('/dashboard/lugar-denuncia')}
//             className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
//           >
//             Cancelar
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// src/Pages/CrearLugarDenunciaPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ApiRoutes from '../../Components/ApiRoutes';


export default function CrearLugarDenunciaPage() {
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!descripcion.trim()) {
      Swal.fire('Campo requerido', 'Por favor, ingresa una descripción.', 'info');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${ApiRoutes.urlBase}/lugar-denuncia`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ descripcion }),
      });

      if (!response.ok) throw new Error();

      Swal.fire('¡Agregado!', 'Lugar de denuncia creado correctamente.', 'success').then(() => {
        navigate('/dashboard/lugar-denuncia');
      });
    } catch (error) {
      Swal.fire('Error', 'No se pudo crear el lugar de denuncia.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-slate-800 p-4 text-white flex justify-between items-center">
        <h2 className="text-xl font-bold">Agregar Lugar de Denuncia</h2>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Lugar</label>
          <input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Escriba el nombre del lugar de denuncia"
            required
          />
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 justify-center"
          >

            {loading ? 'Guardando...' : 'Guardar Lugar'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/dashboard/lugar-denuncia')}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center gap-2 justify-center"
          >

            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
