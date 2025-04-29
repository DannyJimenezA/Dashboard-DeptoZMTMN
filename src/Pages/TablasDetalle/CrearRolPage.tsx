import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ApiRoutes from '../../Components/ApiRoutes';

export default function CrearRolPage() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
        body: JSON.stringify({ name: nombre, description: descripcion }),
      });

      if (!response.ok) throw new Error('Error en la creación del rol');

      Swal.fire('Éxito', 'Rol creado correctamente', 'success').then(() => {
        navigate('/dashboard/roles');
      });
    } catch (error) {
      Swal.fire('Error', 'No se pudo crear el rol.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Crear Nuevo Rol</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Nombre del Rol</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Ej. administrador"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Descripción del rol"
            rows={3}
            required
          />
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {loading ? 'Guardando...' : 'Guardar Rol'}
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
