import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaFilePdf } from 'react-icons/fa';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ApiService from '../../Components/ApiService';
import ApiRoutes from '../../Components/ApiRoutes';
import { Precario } from '../../Types/Types';

const MySwal = withReactContent(Swal);

export default function DetallePrecarioPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [precario, setPrecario] = useState<Precario | null>(null);
  const [mensaje, setMensaje] = useState('');
  const [archivoVistaPrevia, setArchivoVistaPrevia] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrecario = async () => {
      try {
        const data = await ApiService.get<Precario>(`${ApiRoutes.precarios}/${id}`);
        setPrecario(data);
      } catch {
        Swal.fire('Error', 'Error al cargar el uso precario', 'error');
      }
    };

    fetchPrecario();
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

    if (!result.isConfirmed || !precario) return;

    try {
      await ApiService.put(`${ApiRoutes.precarios}/${precario.id}/status`, {
        status: nuevoEstado,
      });

      await ApiService.post(`${ApiRoutes.urlBase}/mailer/send-custom-message`, {
        email: precario.user?.email,
        message: mensaje,
      });

      Swal.fire('Éxito', `Uso precario ${nuevoEstado.toLowerCase()} correctamente.`, 'success');
      navigate('/dashboard/uso-precario');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Hubo un problema al actualizar el estado.', 'error');
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

  if (!precario) return <p className="p-4">Cargando precario...</p>;

  const isEditable = precario.status === 'Pendiente';

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white shadow-lg rounded p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Detalles del Uso Precario</h2>

      <div className="space-y-2">
        <p><strong>ID:</strong> {precario.id}</p>
        <p><strong>Nombre:</strong> {precario.user?.nombre}</p>
        <p><strong>Apellidos:</strong> {precario.user?.apellido1 || 'No disponible'} {precario.user?.apellido2 || ''}</p>
        <p><strong>Cédula:</strong> {precario.user?.cedula}</p>
        <p><strong>Detalle:</strong> {precario.Detalle}</p>
        <p><strong>Estado:</strong> {precario.status}</p>
        <p><strong>Archivos Adjuntos:</strong></p>
        <div className="flex gap-2">
          {precario.ArchivoAdjunto ? (
            JSON.parse(precario.ArchivoAdjunto).map((archivo: string, index: number) => (
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
          onClick={() => navigate('/dashboard/uso-precario')}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Volver
        </button>
      </div>
    </div>
  );
}
