
// src/Pages/DetalleCitaPage.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../../Components/ApiService';
import ApiRoutes from '../../Components/ApiRoutes';
import { Cita } from '../../Types/Types';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

// ...importaciones (igual que antes)

export default function DetalleCitaPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cita, setCita] = useState<Cita | null>(null);
    const [mensaje, setMensaje] = useState('');
  
    useEffect(() => {
      const fetchCita = async () => {
        try {
          const data = await ApiService.get<Cita>(`${ApiRoutes.citas}/${id}`);
          setCita(data);
        } catch {
          Swal.fire('Error', 'Error al cargar la cita', 'error');
        }
      };
  
      fetchCita();
    }, [id]);
  
    const cambiarEstado = async (nuevoEstado: 'Aprobada' | 'Denegada') => {
      if (!mensaje.trim()) {
        Swal.fire('Escribe un mensaje antes de continuar.');
        return;
      }
  
      const result = await MySwal.fire({
        title: `¿Confirmar ${nuevoEstado.toLowerCase()}?`,
        text: `Se notificará al usuario con tu mensaje.`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'Cancelar',
      });
  
      if (!result.isConfirmed || !cita) return;
  
      try {
        await ApiService.put(`${ApiRoutes.citas}/${cita.id}/status`, {
          status: nuevoEstado,
        });
  
        await ApiService.post(`${ApiRoutes.urlBase}/mailer/send-custom-message`, {
          email: cita.user?.email,
          message: mensaje,
        });
  
        Swal.fire('Éxito', `Cita ${nuevoEstado.toLowerCase()} correctamente.`, 'success');
        navigate('/dashboard/citas');
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Hubo un problema al actualizar la cita.', 'error');
      }
    };
  
    if (!cita) return <p className="p-4">Cargando cita...</p>;
  
    const isEditable = cita.status === 'Pendiente';
  
    return (
      <div className="max-w-2xl mx-auto mt-8 bg-white shadow-lg rounded p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Detalles de la Cita</h2>
  
        <div className="space-y-2">
          <p><strong>ID:</strong> {cita.id}</p>
          <p><strong>Nombre:</strong> {cita.user?.nombre}</p>
          <p><strong>Cédula:</strong> {cita.user?.cedula}</p>
          <p><strong>Fecha:</strong> {cita.availableDate?.date}</p>
          <p><strong>Hora:</strong> {cita.horaCita?.hora}</p>
          <p><strong>Estado:</strong> {cita.status}</p>
          <p><strong>Descripción:</strong> {cita.description}</p>
        </div>
  
        {/* Mostrar solo si editable */}
        {isEditable && (
          <>
            <div className="mt-6">
              <label className="block font-medium mb-1">Mensaje para el usuario:</label>
              <textarea
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded p-2 resize-none"
                placeholder="Escribe aquí el mensaje que se enviará al usuario..."
              />
            </div>
  
            <div className="mt-4 flex gap-4">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={() => cambiarEstado('Aprobada')}
              >
                Aprobar
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={() => cambiarEstado('Denegada')}
              >
                Denegar
              </button>
            </div>
          </>
        )}
  
        <div className="mt-4 text-right">
          <button
            onClick={() => navigate('/dashboard/citas')}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }
  