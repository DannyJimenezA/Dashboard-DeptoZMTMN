import React, { useState, useEffect } from 'react';
import { Permission, Role } from '../../Types/Types';
import ApiRoutes from '../../Components/ApiRoutes';
import Swal from 'sweetalert2';

interface AsignarPermisosFormProps {
  rol: Role;
  onCancelar: () => void;
}

const AsignarPermisosForm: React.FC<AsignarPermisosFormProps> = ({ rol, onCancelar }) => {
  const [permisos, setPermisos] = useState<Permission[]>([]);
  const [permisosSeleccionados, setPermisosSeleccionados] = useState<Permission[]>([]);
  const [recursoActivo, setRecursoActivo] = useState<string>('');

  useEffect(() => {
    const cargarPermisos = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token no disponible.');

        const response = await fetch(ApiRoutes.permisos, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Error al cargar los permisos.');

        const data: Permission[] = await response.json();
        setPermisos(data);
        if (data.length > 0) setRecursoActivo(data[0].resource);
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Error al cargar los permisos.', 'error');
      }
    };

    cargarPermisos();
  }, []);

  useEffect(() => {
    setPermisosSeleccionados(rol.permissions || []);
  }, [rol]);

  const togglePermiso = (permiso: Permission) => {
    setPermisosSeleccionados((prev) => {
      const existe = prev.some((p) => p.id === permiso.id);
      return existe ? prev.filter((p) => p.id !== permiso.id) : [...prev, permiso];
    });
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

    if (!confirmacion.isConfirmed) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token no disponible.');

      const newPermissions = permisosSeleccionados.map((permiso) => ({
        action: permiso.action,
        resource: permiso.resource,
      }));

      const response = await fetch(`${ApiRoutes.roles}/${rol.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPermissions }),
      });

      if (!response.ok) throw new Error('Error al actualizar permisos');

      await Swal.fire('Actualizado', 'Permisos guardados correctamente.', 'success');
      onCancelar();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Ocurrió un error al guardar los permisos.', 'error');
    }
  };

  const recursosUnicos = Array.from(new Set(permisos.map((p) => p.resource)));

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 mt-4">
      <h2 className="text-2xl font-bold text-center mb-6">
        Asignar Permisos al Rol: <span className="text-blue-700">{rol.name}</span>
      </h2>

      <div className="flex flex-wrap gap-2 justify-center mb-6 border-b pb-4">
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
            {recurso}
          </button>
        ))}
      </div>

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
                  {permiso.action.toUpperCase()}
                  <span className="text-gray-500 text-sm ml-2">{permiso.resource}</span>
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

      <div className="flex justify-end gap-4 mt-8">
        <button onClick={handleGuardarPermisos} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Guardar Permisos
        </button>
        <button onClick={onCancelar} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default AsignarPermisosForm;
