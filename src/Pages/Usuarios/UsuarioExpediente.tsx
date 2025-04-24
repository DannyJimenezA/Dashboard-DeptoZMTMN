import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ApiRoutes from '../../Components/ApiRoutes';

const MySwal = withReactContent(Swal);

interface DecodedToken {
  exp: number;
  sub: string;
}

export default function UsuarioExpediente() {
  const [telefonoSolicitante, setTelefonoSolicitante] = useState('');
  const [emailSolicitante, setEmailSolicitante] = useState('');
  const [numeroExpediente, setNumeroExpediente] = useState('');
  const [copiaCertificada, setCopiaCertificada] = useState<string | null>(null);
  const [medioNotificacion, setMedioNotificacion] = useState<'' | 'correo' | 'telefono'>('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no disponible');
      return;
    }
    if (!token) {
      navigate('/login');
    } else {
      const decodedToken = parseJwt(token);
      if (!decodedToken || decodedToken.exp * 1000 < Date.now()) {
        console.warn('Token expirado o inválido, redirigiendo al login');
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!numeroExpediente.trim()) {
      MySwal.fire('Campo requerido', 'Debes ingresar el número o nombre del expediente.', 'warning');
      return;
    }

    if (!copiaCertificada) {
      MySwal.fire('Campo requerido', 'Debes indicar si deseas copia certificada.', 'warning');
      return;
    }

    if (!medioNotificacion) {
      MySwal.fire('Campo requerido', 'Debes seleccionar un medio de notificación.', 'warning');
      return;
    }

    const confirmacion = await MySwal.fire({
      title: '¿Está seguro de enviar esta solicitud?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'btn-azul',
        cancelButton: 'btn-rojo',
        actions: 'botones-horizontales',
      },
      buttonsStyling: false,
    });

    if (!confirmacion.isConfirmed) return;

    const token = localStorage.getItem('token');
    const decodedToken = parseJwt(token);
    const userId = decodedToken?.sub;

    if (!userId) {
      console.error('No se pudo extraer el userId del token');
      return;
    }

    const solicitud = {
      userId,
      telefonoSolicitante,
      emailSolicitante,
      numeroExpediente,
      copiaCertificada,
      medioNotificacion,
    };

    try {
      const response = await fetch(`${ApiRoutes.expedientes}/solicitud`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(solicitud),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al enviar los datos al servidor');
      }

      await MySwal.fire({
        title: 'Solicitud enviada',
        text: '¡La solicitud de expediente ha sido enviada exitosamente!',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        customClass: { confirmButton: 'btn-azul' },
        buttonsStyling: false,
        timer: 3000,
      });

      setTelefonoSolicitante('');
      setEmailSolicitante('');
      setNumeroExpediente('');
      setCopiaCertificada(null);
      setMedioNotificacion('');
      navigate('/mis-expedientes');
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      MySwal.fire('Error', 'Hubo un problema al enviar la solicitud. Inténtalo de nuevo.', 'error');
    }
  };

  const parseJwt = (token: string | null): DecodedToken | null => {
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <style>
        {`
          .btn-azul {
            background-color: #2563eb !important;
            color: white !important;
            border: none !important;
            border-radius: 6px !important;
            padding: 8px 20px !important;
            font-weight: bold !important;
          }

          .btn-rojo {
            background-color: #dc2626 !important;
            color: white !important;
            border: none !important;
            border-radius: 6px !important;
            padding: 8px 20px !important;
            font-weight: bold !important;
          }

          .botones-horizontales {
            display: flex !important;
            justify-content: center;
            gap: 10px;
          }
        `}
      </style>

      <h1 className="text-4xl font-bold mb-8 text-center">Módulo de Solicitud de Expediente</h1>

      <form onSubmit={handleSubmit} noValidate>
        <div className="mt-4">
          <label htmlFor="numeroExpediente" className="block text-lg font-medium text-gray-700 mb-2">
            Nombre de expediente o número:
          </label>
          <input
            type="text"
            id="numeroExpediente"
            value={numeroExpediente}
            onChange={(e) => setNumeroExpediente(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Número o nombre del expediente"
          />
        </div>

        <div className="mt-4">
          <label className="block text-lg font-medium text-gray-700 mb-2">Copia certificada:</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="copiaCertificada"
                value="sí"
                checked={copiaCertificada === 'sí'}
                onChange={() => setCopiaCertificada('sí')}
                required
                className="mr-2"
              />
              Sí
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="copiaCertificada"
                value="no"
                checked={copiaCertificada === 'no'}
                onChange={() => setCopiaCertificada('no')}
                required
                className="mr-2"
              />
              No
            </label>
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="medioNotificacion" className="block text-lg font-medium text-gray-700 mb-2">
            Medio de Notificación:
          </label>
          <select
            id="medioNotificacion"
            value={medioNotificacion}
            onChange={(e) => setMedioNotificacion(e.target.value as 'correo' | 'telefono')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="null">Seleccione un medio de comunicación</option>
            <option value="telefono">Teléfono</option>
            <option value="correo">Correo</option>
          </select>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={() => navigate('/mis-expedientes')}
            className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded hover:bg-gray-400 transition-colors"
          >
            Volver
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors"
          >
            Enviar Solicitud
          </button>
        </div>
      </form>
    </div>
  );
}
