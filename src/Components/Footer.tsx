import { FaFacebook, FaWhatsapp, FaInstagram, FaClock, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { TbWorld } from 'react-icons/tb';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Sección de redes sociales */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">Síguenos en nuestras redes</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="https://www.facebook.com/alcaldia.denicoya" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <FaFacebook size={24} />
              </a>
              <a href="https://www.instagram.com/municipalidadnicoya/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <FaInstagram size={24} />
              </a>
              <a href="https://www.nicoya.go.cr" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <TbWorld size={24} />
              </a>
            </div>
          </div>

          {/* Sección de contacto */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <p className="text-gray-400 flex items-center justify-center md:justify-start">
              <FaEnvelope size={20} className="mr-2" /> 
              <a href="mailto:contraloria@municoya.go.cr" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                contraloria@municoya.go.cr
              </a>
            </p>
            <p className="text-gray-400 flex items-center justify-center md:justify-start">
              <FaWhatsapp size={20} className="mr-2" /> 
              <a href="https://wa.me/26858700" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                WhatsApp: 2685-8700
              </a>
            </p>
          </div>

          {/* Sección de horario */}
          <div className="text-center md:text-left ">
            <h3 className="text-lg font-semibold mb-4">Horario</h3>
            <p className="text-gray-400 flex items-center justify-center md:justify-start">
              <FaClock className="mr-2" /> 
              Lunes a Viernes: 7:30 AM - 4:00 PM
            </p>
          </div>

          {/* Sección de ubicación */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">Ubicación</h3>
            <p className="text-gray-400 flex items-center justify-center md:justify-start">
              <FaMapMarkerAlt className="mr-2" />
              <a 
                href="https://www.google.com/maps/place/Municipalidad+de+Nicoya/@10.1418147,-85.4563309,17z/data=!3m1!4b1!4m6!3m5!1s0x8f9fb74b9d1849d9:0x27d28df7f75141ae!8m2!3d10.1418147!4d-85.453756!16s%2Fg%2F1hhvs4gzc?entry=ttu&g_ep=EgoyMDI0MTAyOS4wIKXMDSoASAFQAw%3D%3D" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-white"
              >
                Frente al Parque Recaredo Briceño
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
