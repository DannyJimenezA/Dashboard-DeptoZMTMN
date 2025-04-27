// src/Pages/DetalleConcesionPage.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../../Components/ApiService';
import ApiRoutes from '../../Components/ApiRoutes';
import { Concesion } from '../../Types/Types';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { FaFilePdf } from 'react-icons/fa';

const MySwal = withReactContent(Swal);

export default function DetalleConcesionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [concesion, setConcesion] = useState<Concesion | null>(null);
  const [mensaje, setMensaje] = useState('');
  const [archivoVistaPrevia, setArchivoVistaPrevia] = useState<string | null>(null);

  useEffect(() => {
    const fetchConcesion = async () => {
      try {
        const data = await ApiService.get<Concesion>(`${ApiRoutes.concesiones}/${id}`);
        setConcesion(data);
      } catch {
        Swal.fire('Error', 'Error al cargar la concesión', 'error');
      }
    };

    fetchConcesion();
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

    if (!result.isConfirmed || !concesion) return;

    try {
      await ApiService.put(`${ApiRoutes.concesiones}/${concesion.id}/status`, {
        status: nuevoEstado,
      });

      await ApiService.post(`${ApiRoutes.urlBase}/mailer/send-custom-message`, {
        email: concesion.user?.email,
        message: mensaje,
      });

      Swal.fire('Éxito', `Concesión ${nuevoEstado.toLowerCase()} correctamente.`, 'success');
      navigate('/dashboard/concesiones');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Hubo un problema al actualizar la concesión.', 'error');
    }
  };

  const manejarVerArchivo = (archivo: string) => {
    const archivoFinal = archivo.replace(/[\[\]"]/g, '');
    if (archivoFinal) {
      const fileUrl = `${ApiRoutes.urlBase}/${archivoFinal}`;
      setArchivoVistaPrevia(fileUrl);
    }
  };

  const cerrarVistaPrevia = () => setArchivoVistaPrevia(null);

  if (!concesion) return <p className="p-4">Cargando concesión...</p>;

  const isEditable = concesion.status === 'Pendiente';

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white shadow-lg rounded p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Detalles de la Concesión</h2>

      <div className="space-y-2">
        <p><strong>ID:</strong> {concesion.id}</p>
        <p><strong>Nombre:</strong> {concesion.user?.nombre}</p>
        <p><strong>Apellidos:</strong> {concesion.user?.apellido1 || 'No disponible'} {concesion.user?.apellido2 || ''}</p>
        <p><strong>Cédula:</strong> {concesion.user?.cedula}</p>
        <p><strong>Detalle:</strong> {concesion.Detalle}</p>
        <p><strong>Estado:</strong> {concesion.status}</p>
        <p><strong>Archivos Adjuntos:</strong></p>
        <div className="flex gap-2">
          {concesion.ArchivoAdjunto ? (
            JSON.parse(concesion.ArchivoAdjunto).map((archivo: string, index: number) => (
              <FaFilePdf
                key={index}
                style={{ cursor: 'pointer' }}
                onClick={() => manejarVerArchivo(archivo)}
                title="Ver archivo"
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
              style={{ border: 'none' }}
              title="Vista previa del archivo PDF"
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
          onClick={() => navigate('/dashboard/concesiones')}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Volver
        </button>
      </div>
    </div>
  );
}
