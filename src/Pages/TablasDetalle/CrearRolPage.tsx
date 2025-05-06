// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Swal from 'sweetalert2';
// import ApiRoutes from '../../Components/ApiRoutes';
// import { fetchWithAuth } from '../../Components/ApiService';
// import { Permission } from '../../Types/Types';

// export default function CrearRolPage() {
//   const [nombre, setNombre] = useState('');
//   const [descripcion, setDescripcion] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [permisos, setPermisos] = useState<Permission[]>([]);
//   const [permisosSeleccionados, setPermisosSeleccionados] = useState<Permission[]>([]);
//   const [recursoActivo, setRecursoActivo] = useState<string>('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchPermisos = async () => {
//       try {
//         const res = await fetchWithAuth(`${ApiRoutes.urlBase}/permissions`);
//         if (!res || !res.ok) throw new Error('Error al obtener permisos');
  
//         const data = await res.json();
//         setPermisos(data);
//         if (data.length > 0) setRecursoActivo(data[0].resource);
//       } catch (error) {
//         console.error(error);
//         Swal.fire('Error', 'No se pudieron cargar los permisos', 'error');
//       }
//     };
  
//     fetchPermisos();
//   }, []);
  

//   const togglePermiso = (permiso: Permission) => {
//     setPermisosSeleccionados((prev) =>
//       prev.some((p) => p.id === permiso.id)
//         ? prev.filter((p) => p.id !== permiso.id)
//         : [...prev, permiso]
//     );
//   };

//   // const handleSubmit = async (e: React.FormEvent) => {
//   //   e.preventDefault();

//   //   if (!nombre.trim() || !descripcion.trim()) {
//   //     Swal.fire('Campos requeridos', 'Por favor, completa todos los campos.', 'warning');
//   //     return;
//   //   }

//   //   setLoading(true);

//   //   try {
//   //     const response = await fetch(ApiRoutes.roles, {
//   //       method: 'POST',
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //         Authorization: `Bearer ${localStorage.getItem('token')}`,
//   //       },
//   //       body: JSON.stringify({
//   //         name: nombre,
//   //         description: descripcion,
//   //         newPermissions: permisosSeleccionados.map((p) => ({
//   //           action: p.action,
//   //           resource: p.resource,
//   //         })),
//   //       }),
//   //     });

//   //     if (!response.ok) throw new Error('Error en la creación del rol');

//   //     Swal.fire('Éxito', 'Rol creado correctamente', 'success').then(() => {
//   //       navigate('/dashboard/roles');
//   //     });
//   //   } catch (error) {
//   //     Swal.fire('Error', 'No se pudo crear el rol.', 'error');
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };


//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
  
//     if (!nombre.trim() || !descripcion.trim()) {
//       Swal.fire('Campos requeridos', 'Por favor, completa todos los campos.', 'warning');
//       return;
//     }
  
//     setLoading(true);
  
//     try {
//       const response = await fetch(ApiRoutes.roles, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//         body: JSON.stringify({
//           name: nombre,
//           description: descripcion,
//           permissionIds: permisosSeleccionados.map((p) => p.id),
//         }),
//       });
  
//       const result = await response.json(); // <-- esto es lo importante
  
//       if (!response.ok) {
//         if (response.status === 400 && result.message?.includes('ya existe')) {
//           Swal.fire('Nombre duplicado', result.message, 'warning');
//         } else {
//           Swal.fire('Error', result.message || 'No se pudo crear el rol.', 'error');
//         }
//         return;
//       }
  
//       Swal.fire('Éxito', 'Rol creado correctamente', 'success').then(() => {
//         navigate('/dashboard/roles');
//       });
//     } catch (error) {
//       console.error(error);
//       Swal.fire('Error', 'Error inesperado al crear el rol.', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };
  
  

//   const recursosUnicos = Array.from(new Set(permisos.map((p) => p.resource)));

//   return (
//     <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold mb-6 text-center">Crear Nuevo Rol</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-1">Nombre del Rol</label>
//           <input
//             type="text"
//             value={nombre}
//             onChange={(e) => setNombre(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded"
//             placeholder="Ej. administrador"
//             required
//           />
//         </div>

//         <div className="mb-6">
//           <label className="block text-sm font-medium mb-1">Descripción</label>
//           <textarea
//             value={descripcion}
//             onChange={(e) => setDescripcion(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded"
//             placeholder="Descripción del rol"
//             rows={3}
//             required
//           />
//         </div>

//         {/* Permisos */}
//         <div className="mb-6">
//           <h3 className="text-lg font-semibold mb-2">Asignar Permisos</h3>

//           <div className="flex flex-wrap gap-2 mb-4">
//             {recursosUnicos.map((resource) => (
//               <button
//                 key={resource}
//                 type="button"
//                 onClick={() => setRecursoActivo(resource)}
//                 className={`px-3 py-1 text-sm rounded font-medium transition ${
//                   recursoActivo === resource
//                     ? 'bg-blue-600 text-white'
//                     : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
//                 }`}
//               >
//                 {resource}
//               </button>
//             ))}
//           </div>

//           <div className="grid sm:grid-cols-2 gap-3">
//             {permisos
//               .filter((p) => p.resource === recursoActivo)
//               .map((permiso) => {
//                 const isSelected = permisosSeleccionados.some((pSel) => pSel.id === permiso.id);
//                 return (
//                   <div
//                     key={permiso.id}
//                     className={`flex justify-between items-center p-3 border rounded transition ${
//                       isSelected ? 'bg-blue-50 border-blue-500' : 'bg-white border-gray-200'
//                     }`}
//                   >
//                     <span className="font-medium text-gray-800">
//                       {permiso.action.toUpperCase()}
//                       <span className="ml-2 text-gray-500 text-sm">{permiso.resource}</span>
//                     </span>
//                     <input
//                       type="checkbox"
//                       checked={isSelected}
//                       onChange={() => togglePermiso(permiso)}
//                       className="w-5 h-5"
//                     />
//                   </div>
//                 );
//               })}
//           </div>
//         </div>

//         <div className="flex justify-between">
//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//           >
//             {loading ? 'Guardando...' : 'Guardar Rol'}
//           </button>
//           <button
//             type="button"
//             onClick={() => navigate('/dashboard/roles')}
//             className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
//           >
//             Cancelar
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ApiRoutes from '../../Components/ApiRoutes';
import { fetchWithAuth } from '../../Components/ApiService';
import { Permission } from '../../Types/Types';

const accionesLegibles: Record<string, string> = {
  GET: 'Ver',
  POST: 'Crear',
  PUT: 'Editar',
  PATCH: 'Editar Estado',
  DELETE: 'Eliminar',
};

const recursoLegible = (resource: string) => {
  const mapa: Record<string, string> = {
    'available-dates': 'Fechas disponibles',
    'horas-cita': 'Horas de cita',
    'users': 'Usuarios',
    'roles': 'Roles',
    'denuncia': 'Denuncias',
    'concesiones': 'Concesiones',
    'expedientes': 'Expedientes',
    'appointments': 'Citas',
    'revision-plano': 'Planos',
    'permissions': 'Permisos',
    'tipo-denuncia': 'Tipo de Denuncia',
    'lugar-denuncia': 'Lugar de Denuncia',
  };
  return mapa[resource] || resource.charAt(0).toUpperCase() + resource.slice(1).replace(/-/g, ' ');
};

export default function CrearRolPage() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);
  const [permisos, setPermisos] = useState<Permission[]>([]);
  const [permisosSeleccionados, setPermisosSeleccionados] = useState<Permission[]>([]);
  const [recursoActivo, setRecursoActivo] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPermisos = async () => {
      try {
        const res = await fetchWithAuth(`${ApiRoutes.urlBase}/permissions`);
        if (!res || !res.ok) throw new Error('Error al obtener permisos');

        const data = await res.json();
        setPermisos(data);
        if (data.length > 0) setRecursoActivo(data[0].resource);
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudieron cargar los permisos', 'error');
      }
    };

    fetchPermisos();
  }, []);

  const togglePermiso = (permiso: Permission) => {
    setPermisosSeleccionados((prev) =>
      prev.some((p) => p.id === permiso.id)
        ? prev.filter((p) => p.id !== permiso.id)
        : [...prev, permiso]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim() || !descripcion.trim()) {
      Swal.fire('Campos requeridos', 'Por favor, completa todos los campos.', 'warning');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(ApiRoutes.roles, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name: nombre,
          description: descripcion,
          permissionIds: permisosSeleccionados.map((p) => p.id),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 400 && result.message?.includes('ya existe')) {
          Swal.fire('Nombre duplicado', result.message, 'warning');
        } else {
          Swal.fire('Error', result.message || 'No se pudo crear el rol.', 'error');
        }
        return;
      }

      Swal.fire('Éxito', 'Rol creado correctamente', 'success').then(() => {
        navigate('/dashboard/roles');
      });
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Error inesperado al crear el rol.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const recursosUnicos = Array.from(new Set(permisos.map((p) => p.resource)));

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Crear Nuevo Rol</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Nombre del Rol</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Ej. Administrador General"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Ej. Este rol tiene control completo del sistema"
            rows={3}
            required
          />
        </div>

        {/* Permisos */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Permisos del Rol</h3>

          <div className="flex flex-wrap gap-2 mb-4">
            {recursosUnicos.map((resource) => (
              <button
                key={resource}
                type="button"
                onClick={() => setRecursoActivo(resource)}
                className={`px-3 py-1 text-sm rounded font-medium transition ${
                  recursoActivo === resource
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {recursoLegible(resource)}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {permisos
              .filter((p) => p.resource === recursoActivo)
              .map((permiso) => {
                const isSelected = permisosSeleccionados.some((pSel) => pSel.id === permiso.id);
                return (
                  <div
                    key={permiso.id}
                    className={`flex justify-between items-center p-3 border rounded transition ${
                      isSelected ? 'bg-blue-50 border-blue-500' : 'bg-white border-gray-200'
                    }`}
                  >
                    <span className="font-medium text-gray-800">
                      {accionesLegibles[permiso.action.toUpperCase()] || permiso.action}
                      <span className="ml-2 text-gray-500 text-sm">{recursoLegible(permiso.resource)}</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => togglePermiso(permiso)}
                      className="w-5 h-5"
                    />
                  </div>
                );
              })}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {loading ? 'Guardando...' : 'Crear Rol'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard/roles')}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
