// src/Pages/DetalleExpedientePage.tsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CopiaExpediente } from '../../Types/Types';
import ApiService from '../../Components/ApiService';
import ApiRoutes from '../../Components/ApiRoutes';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function DetalleExpedientePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expediente, setExpediente] = useState<CopiaExpediente | null>(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const fetchExpediente = async () => {
      try {
        const data = await ApiService.get<CopiaExpediente>(`${ApiRoutes.expedientes}/${id}`);
        setExpediente(data);
      } catch {
        Swal.fire('Error', 'Error al cargar el expediente', 'error');
      }
    };

    fetchExpediente();
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

    if (!result.isConfirmed || !expediente) return;

    try {
      await ApiService.put(`${ApiRoutes.expedientes}/${expediente.idExpediente}/status`, {
        status: nuevoEstado,
      });

      await ApiService.post(`${ApiRoutes.urlBase}/mailer/send-custom-message`, {
        email: expediente.user?.email,
        message: mensaje,
      });

      Swal.fire('Éxito', `Expediente ${nuevoEstado.toLowerCase()} correctamente.`, 'success');
      navigate('/dashboard/expedientes');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Hubo un problema al actualizar el expediente.', 'error');
    }
  };

  if (!expediente) return <p className="p-4">Cargando expediente...</p>;

  const isEditable = expediente.status === 'Pendiente';

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white shadow-lg rounded p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Detalles de la Solicitud de Expediente</h2>

      <div className="space-y-2">
        <p><strong>ID Expediente:</strong> {expediente.idExpediente}</p>
        <p><strong>Nombre Solicitante:</strong> {expediente.nombreSolicitante}</p>
        <p><strong>Teléfono Solicitante:</strong> {expediente.telefonoSolicitante}</p>
        <p><strong>Medio de Notificación:</strong> {expediente.medioNotificacion}</p>
        <p><strong>Número de Expediente:</strong> {expediente.numeroExpediente}</p>
        <p><strong>Copia Certificada:</strong> {expediente.copiaCertificada ? 'Sí' : 'No'}</p>
        <p><strong>Estado:</strong> {expediente.status}</p>
      </div>

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

          <div className="mt-4 flex gap-4 justify-center">
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

      <div className="mt-6 text-right">
        <button
          onClick={() => navigate('/dashboard/expedientes')}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Volver
        </button>
      </div>
    </div>
  );
}
