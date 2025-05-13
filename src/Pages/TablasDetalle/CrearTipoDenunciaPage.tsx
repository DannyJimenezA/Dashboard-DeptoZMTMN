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
      Swal.fire('Campo requerido', 'Por favor, ingresa un tipo de denuncia.', 'warning');
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

      Swal.fire({
        title: "¡Éxito!",
        text: `Tipo de denuncia creado correctamente.`,
        icon: "success",
        confirmButtonColor: "#00a884",
            timer: 3000,
      showConfirmButton: false,
      }).then(() =>
        navigate('/dashboard/tipo-denuncia')
      );
    } catch (error) {
      Swal.fire('Error', 'Ocurrió un error al agregar el tipo de denuncia.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-slate-800 p-4 text-white flex justify-between items-center">
        <h2 className="text-xl font-bold">Agregar Tipo de Denuncia</h2>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de denuncia</label>
          <input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Escriba el tipo de denuncia"
            // required
          />
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 justify-center"
          >
            {loading ? 'Guardando...' : 'Guardar Tipo'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/dashboard/tipo-denuncia')}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center gap-2 justify-center"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
