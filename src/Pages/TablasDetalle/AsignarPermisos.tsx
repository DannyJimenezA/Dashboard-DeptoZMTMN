// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Role, Permission } from '../../Types/Types';
// import ApiRoutes from '../../Components/ApiRoutes';
// import Swal from 'sweetalert2';
// import { fetchWithAuth } from '../../Components/ApiService';
// import { ArrowLeft, ShieldCheck } from 'lucide-react';

// export default function AsignarPermisos() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [rol, setRol] = useState<Role | null>(null);
//   const [permisos, setPermisos] = useState<Permission[]>([]);
//   const [permisosSeleccionados, setPermisosSeleccionados] = useState<Permission[]>([]);
//   const [recursoActivo, setRecursoActivo] = useState<string>('');

//   useEffect(() => {
//     const cargarDatos = async () => {
//       try {
//         const [rolRes, permisosRes] = await Promise.all([
//           fetchWithAuth(`${ApiRoutes.roles}/${id}`),
//           fetchWithAuth(`${ApiRoutes.urlBase}/permissions`),
//         ]);

//         if (!rolRes?.ok || !permisosRes?.ok) throw new Error('Error al cargar datos');

//         const rolData: Role = await rolRes.json();
//         const permisosData: Permission[] = await permisosRes.json();

//         setRol(rolData);
//         setPermisos(permisosData);
//         setPermisosSeleccionados(rolData.permissions || []);
//         if (permisosData.length > 0) setRecursoActivo(permisosData[0].resource);
//       } catch (error) {
//         console.error(error);
//         Swal.fire('Error', 'Ocurrió un error al cargar la información.', 'error');
//         navigate('/dashboard/roles');
//       }
//     };

//     cargarDatos();
//   }, [id, navigate]);

//   const togglePermiso = (permiso: Permission) => {
//     setPermisosSeleccionados((prev) =>
//       prev.some((p) => p.id === permiso.id)
//         ? prev.filter((p) => p.id !== permiso.id)
//         : [...prev, permiso]
//     );
//   };

//   const handleGuardarPermisos = async () => {
//     const confirmacion = await Swal.fire({
//       title: '¿Estás seguro?',
//       text: 'Esta acción actualizará los permisos del rol.',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Sí, actualizar',
//       cancelButtonText: 'Cancelar',
//       confirmButtonColor: '#2563eb',
//       cancelButtonColor: '#d33',
//     });

//     if (!confirmacion.isConfirmed || !rol) return;

//     try {
//       const newPermissions = permisosSeleccionados.map((p) => ({
//         action: p.action,
//         resource: p.resource,
//       }));

//       const res = await fetchWithAuth(`${ApiRoutes.roles}/${rol.id}`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ newPermissions }),
//       });

//       if (!res?.ok) throw new Error('Error al actualizar permisos');

//       await Swal.fire('Actualizado', 'Permisos guardados correctamente.', 'success');
//       navigate('/dashboard/roles');
//     } catch (error) {
//       console.error(error);
//       Swal.fire('Error', 'Error al guardar los permisos.', 'error');
//     }
//   };

//   if (!rol) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
//           <p className="text-gray-600">Cargando información del rol...</p>
//         </div>
//       </div>
//     );
//   }

//   const recursosUnicos = Array.from(new Set(permisos.map((p) => p.resource)));

//   return (
//     <div className="max-w-6xl mx-auto mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
//       <div className="bg-slate-800 p-4 text-white flex justify-between items-center">
//         <h2 className="text-xl font-bold">Asignar Permisos</h2>
//         <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border bg-blue-100 text-blue-800 border-blue-200">
//           Rol: {rol.name}
//         </span>
//       </div>

//       <div className="p-6 space-y-6">
//         {/* Tabs */}
//         <div className="flex flex-wrap gap-2 border-b pb-4">
//           {recursosUnicos.map((recurso) => (
//             <button
//               key={recurso}
//               onClick={() => setRecursoActivo(recurso)}
//               className={`px-3 py-1 text-sm rounded font-medium transition ${
//                 recursoActivo === recurso
//                   ? 'bg-blue-600 text-white'
//                   : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
//               }`}
//             >
//               {recurso}
//             </button>
//           ))}
//         </div>

//         {/* Permisos por recurso */}
//         <div className="grid sm:grid-cols-2 gap-4">
//           {permisos
//             .filter((p) => p.resource === recursoActivo)
//             .map((permiso) => {
//               const isSelected = permisosSeleccionados.some((pSel) => pSel.id === permiso.id);
//               return (
//                 <div
//                   key={permiso.id}
//                   className={`flex justify-between items-center p-3 border rounded transition
//                     ${isSelected ? 'bg-blue-50 border-blue-500 shadow-sm' : 'bg-white border-gray-200'}
//                   `}
//                 >
//                   <span className="font-medium text-gray-800">
//                     {permiso.action.toUpperCase()}
//                     <span className="text-gray-500 text-sm ml-2">{permiso.resource}</span>
//                   </span>

//                   <label className="inline-flex items-center cursor-pointer">
//                     <input
//                       type="checkbox"
//                       className="sr-only peer"
//                       checked={isSelected}
//                       onChange={() => togglePermiso(permiso)}
//                     />
//                     <div
//                       className={`w-11 h-6 bg-gray-300 rounded-full peer-focus:ring-2 peer-focus:ring-blue-400 transition relative
//                         ${isSelected ? 'bg-blue-600' : ''}
//                       `}
//                     >
//                       <div
//                         className={`absolute top-[2px] left-[2px] bg-white w-5 h-5 rounded-full shadow-md transition-transform ${
//                           isSelected ? 'translate-x-5' : ''
//                         }`}
//                       />
//                     </div>
//                   </label>
//                 </div>
//               );
//             })}
//         </div>

//         {/* Acciones */}
//         <div className="flex justify-end gap-4 mt-6">
//           <button
//             onClick={handleGuardarPermisos}
//             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
//           >
//             <ShieldCheck className="h-4 w-4" />
//             Guardar Permisos
//           </button>

//           <button
//             onClick={() => navigate('/dashboard/roles')}
//             className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 flex items-center gap-2"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             Volver
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Role, Permission } from '../../Types/Types';
import ApiRoutes from '../../Components/ApiRoutes';
import Swal from 'sweetalert2';
import { fetchWithAuth } from '../../Components/ApiService';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

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

export default function AsignarPermisos() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [rol, setRol] = useState<Role | null>(null);
  const [permisos, setPermisos] = useState<Permission[]>([]);
  const [permisosSeleccionados, setPermisosSeleccionados] = useState<Permission[]>([]);
  const [recursoActivo, setRecursoActivo] = useState<string>('');

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [rolRes, permisosRes] = await Promise.all([
          fetchWithAuth(`${ApiRoutes.roles}/${id}`),
          fetchWithAuth(`${ApiRoutes.urlBase}/permissions`),
        ]);

        if (!rolRes?.ok || !permisosRes?.ok) throw new Error('Error al cargar datos');

        const rolData: Role = await rolRes.json();
        const permisosData: Permission[] = await permisosRes.json();

        setRol(rolData);
        setPermisos(permisosData);
        setPermisosSeleccionados(rolData.permissions || []);
        if (permisosData.length > 0) setRecursoActivo(permisosData[0].resource);
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Ocurrió un error al cargar la información.', 'error');
        navigate('/dashboard/roles');
      }
    };

    cargarDatos();
  }, [id, navigate]);

  const togglePermiso = (permiso: Permission) => {
    setPermisosSeleccionados((prev) =>
      prev.some((p) => p.id === permiso.id)
        ? prev.filter((p) => p.id !== permiso.id)
        : [...prev, permiso]
    );
  };

  const handleGuardarPermisos = async () => {
    const confirmacion = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción actualizará los permisos del rol.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#d33',
    });

    if (!confirmacion.isConfirmed || !rol) return;

    try {
      const newPermissions = permisosSeleccionados.map((p) => ({
        action: p.action,
        resource: p.resource,
      }));

      const res = await fetchWithAuth(`${ApiRoutes.roles}/${rol.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPermissions }),
      });

      if (!res?.ok) throw new Error('Error al actualizar permisos');

      await Swal.fire('Actualizado', 'Permisos guardados correctamente.', 'success');
      navigate('/dashboard/roles');
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Error al guardar los permisos.', 'error');
    }
  };

  if (!rol) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información del rol...</p>
        </div>
      </div>
    );
  }

  const recursosUnicos = Array.from(new Set(permisos.map((p) => p.resource)));

  return (
    <div className="max-w-6xl mx-auto mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-slate-800 p-4 text-white flex justify-between items-center">
        <h2 className="text-xl font-bold">Gestión de Permisos</h2>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border bg-blue-100 text-blue-800 border-blue-200">
          Permisos para: <strong className="ml-1">{rol.name}</strong>
        </span>
      </div>

      <div className="p-6 space-y-6">
        {/* Tabs por recurso */}
        <div className="flex flex-wrap gap-2 border-b pb-4">
          {recursosUnicos.map((recurso) => (
            <button
              key={recurso}
              onClick={() => setRecursoActivo(recurso)}
              className={`px-3 py-1 text-sm rounded font-medium transition ${
                recursoActivo === recurso
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {recursoLegible(recurso)}
            </button>
          ))}
        </div>

        {/* Permisos de recurso activo */}
        <div className="grid sm:grid-cols-2 gap-4">
          {permisos
            .filter((p) => p.resource === recursoActivo)
            .map((permiso) => {
              const isSelected = permisosSeleccionados.some((pSel) => pSel.id === permiso.id);
              return (
                <div
                  key={permiso.id}
                  className={`flex justify-between items-center p-3 border rounded transition
                    ${isSelected ? 'bg-blue-50 border-blue-500 shadow-sm' : 'bg-white border-gray-200'}
                  `}
                >
                  <span className="font-medium text-gray-800">
                    {accionesLegibles[permiso.action.toUpperCase()] || permiso.action}
                    <span className="text-gray-500 text-sm ml-2">
                      {recursoLegible(permiso.resource)}
                    </span>
                  </span>

                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={isSelected}
                      onChange={() => togglePermiso(permiso)}
                    />
                    <div
                      className={`w-11 h-6 bg-gray-300 rounded-full peer-focus:ring-2 peer-focus:ring-blue-400 transition relative
                        ${isSelected ? 'bg-blue-600' : ''}
                      `}
                    >
                      <div
                        className={`absolute top-[2px] left-[2px] bg-white w-5 h-5 rounded-full shadow-md transition-transform ${
                          isSelected ? 'translate-x-5' : ''
                        }`}
                      />
                    </div>
                  </label>
                </div>
              );
            })}
        </div>

        {/* Acciones */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={handleGuardarPermisos}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
          >
            <ShieldCheck className="h-4 w-4" />
            Guardar Cambios
          </button>

          <button
            onClick={() => navigate('/dashboard/roles')}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}
