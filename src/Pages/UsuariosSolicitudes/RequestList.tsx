import { FaFilePdf } from 'react-icons/fa'; // Usando un ícono de FontAwesome para PDF
import { IoIosDocument } from 'react-icons/io'; // Usando un ícono genérico para otros tipos de archivo

interface Request {
  id: number;
  type: string;
  status: string;
  date: string;
  description: string;
  category: 'Plano' | 'Prórroga' | 'Precario' | 'Concesión' | 'CopiaExpediente';
  fileUrl?: string; // Campo opcional para la URL del archivo adjunto
}

interface RequestListProps {
  requests: Request[]; // Lista de solicitudes a mostrar
}

// Función para determinar el color del estado
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pendiente':
      return 'bg-yellow-100 text-yellow-800';
    case 'aprobada':
      return 'bg-green-100 text-green-800';
    case 'otras':
      return 'bg-blue-100 text-blue-800';
    case 'denegada':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Función para obtener el ícono del archivo según su tipo
const getFileIcon = (fileUrl: string) => {
  if (fileUrl.endsWith('.pdf')) {
    return <FaFilePdf className="text-red-600" />;
  } else if (fileUrl.endsWith('.doc') || fileUrl.endsWith('.docx')) {
    return <IoIosDocument className="text-blue-600" />;
  } else {
    return <IoIosDocument className="text-gray-600" />;
  }
};

export const RequestList: React.FC<RequestListProps> = ({ requests }) => {
  if (requests.length === 0) {
    return <p>No tienes solicitudes activas en esta categoría.</p>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {requests.map((request) => (
        <div key={request.id} className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            {/*<h2 className="text-xl font-semibold">{request.type}</h2>*/}
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                request.status
              )}`}
            >
              {request.status}
            </span>
          </div>
          <p className="text-gray-600 mb-2">{request.description}</p>
          <p className="text-sm text-gray-500">Fecha: {request.date}</p>
          <p className="text-sm text-gray-500 font-bold">Categoría: {request.category}</p>

          {/* Mostrar archivo adjunto si existe */}
          {request.fileUrl && (
            <div className="mt-2">
              <a href={request.fileUrl} target="_blank" rel="noopener noreferrer">
                <span className="flex items-center">
                  {getFileIcon(request.fileUrl)}
                  <span className="ml-2 text-blue-500 hover:underline">Ver archivo</span>
                </span>
              </a>
            </div>
          )}

          <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Ver detalles
          </button>
        </div>
      ))}
    </div>
  );
};
