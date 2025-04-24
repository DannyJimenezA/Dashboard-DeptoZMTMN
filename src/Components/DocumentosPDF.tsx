import { FaFilePdf } from 'react-icons/fa';

const DocumentosPDF = () => {
  return (
    <section className="mb-16">
      <h2 className="text-3xl font-semibold mb-4 text-gray-800 text-center">Documentos</h2>
      <p className="text-lg text-gray-600 mb-8 text-center">Aquí podrás descargar documentos relevantes sobre la Zona Marítima Terrestre:</p>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
        <ul className="space-y-4">
          <li className="flex items-center">
            <FaFilePdf className="text-red-500 mr-3" />
            <a 
              href="/DocsPdf/Formulario Solicitud de Concesión.pdf" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:underline"
            >
              Formulario para Solicitud de Concesión
            </a>
          </li>
          <li className="flex items-center">
            <FaFilePdf className="text-red-500 mr-3" />
            <a 
              href="/DocsPdf/Formulario Solicitud de Prorroga de Concesión.pdf" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:underline"
            >
              Formulario para Prórroga de Concesión
            </a>
          </li>
          <li className="flex items-center">
            <FaFilePdf className="text-red-500 mr-3" />
            <a 
              href="/DocsPdf/Formulario Solicitud de Uso Precario.pdf" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:underline"
            >
              Formulario para Solicitud de Uso Precario
            </a>
          </li>
          <li className="flex items-center">
            <FaFilePdf className="text-red-500 mr-3" />
            <a 
              href="/DocsPdf/Formulario Solicitud de Expediente.pdf" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:underline"
            >
              Formulario para Solicitud de Expediente
            </a>
          </li>
          <li className="flex items-center">
            <FaFilePdf className="text-red-500 mr-3" />
            <a 
              href="/DocsPdf/Formulario Solicitud de Cita.pdf" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:underline"
            >
              Formulario de Solicitud de Cita / Audiencia
            </a>
          </li>
          <li className="flex items-center">
            <FaFilePdf className="text-red-500 mr-3" />
            <a 
              href="/DocsPdf/Formulario de Denuncia.pdf" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:underline"
            >
              Formulario para Denuncia
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default DocumentosPDF;
