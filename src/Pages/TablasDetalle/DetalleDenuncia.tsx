import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Denuncia } from '../../Types/Types';
import ApiService from '../../Components/ApiService';
import ApiRoutes from '../../Components/ApiRoutes';

const MySwal = withReactContent(Swal);

export default function DetalleDenunciaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [denuncia, setDenuncia] = useState<Denuncia | null>(null);
  const [mensaje, setMensaje] = useState('');
  const [archivoVistaPrevia, setArchivoVistaPrevia] = useState<string | null>(null);

  useEffect(() => {
    const fetchDenuncia = async () => {
      try {
        const data = await ApiService.get<Denuncia>(`${ApiRoutes.denuncias}/${id}`);
        setDenuncia(data);
      } catch {
        Swal.fire('Error', 'Error al cargar la denuncia', 'error');
      }
    };

    fetchDenuncia();
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

    if (!result.isConfirmed || !denuncia) return;

    try {
      await ApiService.put(`${ApiRoutes.denuncias}/${denuncia.id}/status`, {
        status: nuevoEstado,
      });

      Swal.fire('Éxito', `Denuncia ${nuevoEstado.toLowerCase()} correctamente.`, 'success');
      navigate('/dashboard/denuncias');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Hubo un problema al actualizar la denuncia.', 'error');
    }
  };

  // const manejarVerArchivo = (archivo: string) => {
  //   const fileUrl = `${ApiRoutes.urlBase}/${archivo.replace(/\\/g, '/')}`;
  //   setArchivoVistaPrevia(fileUrl);
  // };
  const manejarVerArchivo = (archivo: string) => {
    let fileUrl = archivo;
  
    // Si NO comienza con http o https, entonces sí agregamos el servidor local
    if (!/^https?:\/\//i.test(archivo)) {
      fileUrl = `${ApiRoutes.urlBase}/${archivo.replace(/\\/g, '/')}`;
    }
  
    setArchivoVistaPrevia(fileUrl);
  };
  

  const cerrarVistaPrevia = () => setArchivoVistaPrevia(null);

  if (!denuncia) return <p className="p-4">Cargando denuncia...</p>;

  const isEditable = denuncia.status === 'Pendiente';

  const archivos = (() => {
    if (!denuncia.archivosEvidencia) return [];
    if (Array.isArray(denuncia.archivosEvidencia)) return denuncia.archivosEvidencia;
    try {
      return JSON.parse(denuncia.archivosEvidencia);
    } catch {
      return denuncia.archivosEvidencia.includes(',')
        ? denuncia.archivosEvidencia.split(',')
        : [denuncia.archivosEvidencia];
    }
  })();

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white shadow-lg rounded p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Detalles de la Denuncia</h2>

      <div className="space-y-2">
        <p><strong>ID:</strong> {denuncia.id}</p>
        <p><strong>Fecha de Creación:</strong> {denuncia.Date}</p>
        <p><strong>Nombre del Denunciante:</strong> {denuncia.nombreDenunciante || 'Anónimo'}</p>
        <p><strong>Cédula del Denunciante:</strong> {denuncia.cedulaDenunciante || 'Anónimo'}</p>
        <p><strong>Método de Notificación:</strong> {denuncia.metodoNotificacion || 'No especificado'}</p>
        <p><strong>Medio de Notificación:</strong> {denuncia.medioNotificacion || 'No especificado'}</p>
        <p><strong>Tipo de Denuncia:</strong> {denuncia.tipoDenuncia?.descripcion}</p>
        <p><strong>Descripción:</strong> {denuncia.descripcion}</p>
        <p><strong>Lugar de Denuncia:</strong> {denuncia.lugarDenuncia?.descripcion}</p>
        <p><strong>Ubicación Exacta:</strong> {denuncia.ubicacion}</p>
        <p><strong>Detalles de Evidencia:</strong> {denuncia.detallesEvidencia || 'No disponible'}</p>
        <p><strong>Estado:</strong> {denuncia.status}</p>

        <p><strong>Archivos de Evidencia:</strong></p>
        <div className="flex gap-2 flex-wrap">
          {archivos.length > 0 ? (
            archivos.map((archivo: string, index: number) => (
              <span key={index} onClick={() => manejarVerArchivo(archivo)} style={{ cursor: 'pointer' }}>
                {/* {archivo.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                  <FaImage size={20} title={`Ver imagen ${index + 1}`} />
                ) : (
                  <FaFilePdf size={20} title={`Ver archivo ${index + 1}`} />
                )} */}
                {archivo.match(/\.(jpeg|jpg|png|gif)$/i) ? (
  <img src={archivo} alt="Vista previa" className="w-full h-full object-contain" />
) : (
  <iframe
    src={archivo}
    className="w-full h-full"
    title="Vista previa del archivo"
    style={{ border: 'none' }}
  />
)}

              </span>
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
              title="Vista previa del archivo"
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
          onClick={() => navigate('/dashboard/denuncias')}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Volver
        </button>
      </div>
    </div>
  );
}
