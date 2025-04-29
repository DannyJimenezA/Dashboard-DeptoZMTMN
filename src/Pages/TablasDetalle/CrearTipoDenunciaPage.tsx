// src/Pages/TipoDenuncia/CrearTipoDenunciaPage.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ApiRoutes from '../../Components/ApiRoutes';

export default function CrearTipoDenunciaPage() {
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
      const response = await fetch(`${ApiRoutes.urlBase}/tipo-denuncia`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ descripcion }),
      });

      if (!response.ok) throw new Error();

      Swal.fire('¡Guardado!', 'Tipo de denuncia agregado correctamente.', 'success').then(() =>
        navigate('/dashboard/tipo-denuncia')
      );
    } catch (error) {
      Swal.fire('Error', 'Ocurrió un error al agregar.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Agregar Tipo de Denuncia</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Escriba el tipo de denuncia"
            required
          />
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {loading ? 'Guardando...' : 'Guardar Tipo'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard/tipo-denuncia')}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
