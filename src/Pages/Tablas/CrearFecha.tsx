import { useState } from 'react';
import ApiRoutes from '../../Components/ApiRoutes';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function CrearFecha() {
  const [nuevaFecha, setNuevaFecha] = useState<string>('');
  const navigate = useNavigate();

  const handleCrearFecha = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire('Acceso denegado', 'No tienes permisos para realizar esta acción.', 'warning');
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

      await Swal.fire('Éxito', 'Fecha creada correctamente.', 'success');
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
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-md rounded p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Crear Nueva Fecha de Cita</h1>

      <div className="mb-4">
        <label htmlFor="fecha" className="block mb-2 font-medium">
          Selecciona una fecha:
        </label>
        <input
          id="fecha"
          type="date"
          value={nuevaFecha}
          onChange={(e) => setNuevaFecha(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={() => navigate('/dashboard/dias-citas')}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Cancelar
        </button>
        <button
          onClick={handleCrearFecha}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Crear Fecha
        </button>
      </div>
    </div>
  );
}
