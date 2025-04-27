// src/Pages/TablasDetalle/DetallePlano.tsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RevisionPlano } from '../../Types/Types';
import ApiService from '../../Components/ApiService';
import ApiRoutes from '../../Components/ApiRoutes';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { FaFilePdf } from 'react-icons/fa';

const MySwal = withReactContent(Swal);

export default function DetallePlanoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [revisionPlano, setRevisionPlano] = useState<RevisionPlano | null>(null);
  const [mensaje, setMensaje] = useState('');
  const [archivoVistaPrevia, setArchivoVistaPrevia] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlano = async () => {
      try {
        const data = await ApiService.get<RevisionPlano>(`${ApiRoutes.planos}/${id}`);
        setRevisionPlano(data);
      } catch {
        Swal.fire('Error', 'Error al cargar la revisión del plano', 'error');
      }
    };

    fetchPlano();
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

    if (!result.isConfirmed || !revisionPlano) return;

    try {
      await ApiService.put(`${ApiRoutes.planos}/${revisionPlano.id}/status`, {
        status: nuevoEstado,
      });

      await ApiService.post(`${ApiRoutes.urlBase}/mailer/send-custom-message`, {
        email: revisionPlano.user?.email,
        message: mensaje,
      });

      Swal.fire('Éxito', `Plano ${nuevoEstado.toLowerCase()} correctamente.`, 'success');
      navigate('/dashboard/planos');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Hubo un problema al actualizar el plano.', 'error');
    }
  };

  const manejarVerArchivo = (archivo: { nombre: string; ruta: string }) => {
    const fileUrl = `${ApiRoutes.urlBase}/${archivo.ruta.replace(/\\/g, '/')}`;
    setArchivoVistaPrevia(fileUrl);
  };

  const cerrarVistaPrevia = () => setArchivoVistaPrevia(null);

  if (!revisionPlano) return <p className="p-4">Cargando revisión de plano...</p>;

  const isEditable = revisionPlano.status === 'Pendiente';

  const archivos = typeof revisionPlano.ArchivosAdjuntos === 'string'
    ? JSON.parse(revisionPlano.ArchivosAdjuntos)
    : revisionPlano.ArchivosAdjuntos;

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white shadow-lg rounded p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Detalles de la Revisión de Plano</h2>

      <div className="space-y-2">
        <p><strong>ID Revisión:</strong> {revisionPlano.id}</p>
        <p><strong>Número de Expediente:</strong> {revisionPlano.NumeroExpediente}</p>
        <p><strong>Número de Plano:</strong> {revisionPlano.NumeroPlano}</p>
        <p><strong>Nombre:</strong> {revisionPlano.user?.nombre}</p>
        <p><strong>Apellidos:</strong> {revisionPlano.user?.apellido1 || 'No disponible'} {revisionPlano.user?.apellido2 || ''}</p>
        <p><strong>Comentario:</strong> {revisionPlano.Comentario}</p>
        <p><strong>Estado:</strong> {revisionPlano.status}</p>
        <p><strong>Archivos Adjuntos:</strong></p>
        <div className="flex gap-2">
          {archivos?.length ? (
            archivos.map((archivo: { nombre: string; ruta: string }, index: number) => (
              <FaFilePdf
                key={index}
                style={{ cursor: 'pointer' }}
                onClick={() => manejarVerArchivo(archivo)}
                title={archivo.nombre}
                size={20}
              />
            ))
          ) : (
            <span>No disponible</span>
          )}
        </div>
      </div>

      {archivoVistaPrevia && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center"
          onClick={cerrarVistaPrevia}
        >
          <div
            className="relative w-full max-w-4xl h-[80vh] bg-white rounded-lg shadow-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={archivoVistaPrevia}
              className="w-full h-full"
              title="Vista previa del archivo PDF"
              style={{ border: 'none' }}
            />
          </div>
        </div>
      )}

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
          onClick={() => navigate('/dashboard/planos')}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Volver
        </button>
      </div>
    </div>
  );
}
