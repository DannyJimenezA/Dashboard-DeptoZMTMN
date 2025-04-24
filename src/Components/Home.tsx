import ImageSlider from './Slider';
import Navbar from './Navbar';
import Footer from './Footer';
import DocumentosPDF from './DocumentosPDF';

export default function Home() {
  return (
    <div >
      <Navbar/>
      <div className="container mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 text-gray-800">Zona Marítima Terrestre</h1>
          <p className="text-xl mb-8 text-gray-600 max-w-4xl mx-auto">
            Bienvenido a la plataforma de información sobre la Zona Marítima Terrestre de la Municipalidad de Nicoya.
            Aquí encontrarás información detallada sobre su definición, composición y regulaciones.
          </p>
        </section>

        <ImageSlider />

        <section className="text-center mb-16">
          <h2 className="text-3xl font-semibold mb-4 text-gray-800">Definición</h2>
          <p className="text-lg text-gray-700 mb-4">
            La Zona Marítimo Terrestre es la franja territorial de doscientos metros de ancho a todo lo largo de los litorales Atlántico y Pacífico de la República, cualquiera que sea su naturaleza, medidos horizontalmente a partir de la línea de la pleamar ordinaria, los terrenos y rocas que deje el mar en descubierto en la marea baja.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            Esta zona marítima se extiende también por las márgenes de los ríos hasta el sitio en que sean navegables o se hagan sensibles las mareas, con un ancho de doscientos metros desde cada orilla, contados desde la línea que marque la marea alta. Su uso y aprovechamiento se encuentra regulado por la Ley No. 6043.
          </p>
        </section>

        <section className="text-center mb-16">
          <h2 className="text-3xl font-semibold mb-4 text-gray-800">Composición</h2>
          <p className="text-lg text-gray-700 mb-4">Esta zona se compone de dos secciones:</p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-2 text-gray-800">Zona Pública</h3>
              <h3 className="text-2xl font-semibold mb-2 text-gray-800"> (primeros 50 metros)</h3>
              <p className="text-gray-700">
                Esta área es inalienable y de acceso público, lo que significa que no se permite propiedad privada ni construcciones permanentes.
              </p>
              <p className="text-gray-700"> *salvo infraestructura pública que no interfiera con el acceso y disfrute de la playa* </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-2 text-gray-800">Zona Restringida </h3>
              <h3 className="text-2xl font-semibold mb-2 text-gray-800">  (siguientes 150 metros)</h3>
              <p className="text-gray-700">
                Constituye áreas sujetas al uso privativo mediante las figuras jurídicas de concesión y permiso de uso precario. El otorgamiento de concesiones es exclusivo para aquellos sectores que cuenten con un Plan Regulador Costero vigente, la misma debe ser aprobada por la Municipalidad y por el Instituto Costarricense de Turismo (ICT), así como inscrita ante el Registro Nacional. Los permisos de uso en precario se otorgan por parte de la Municipalidad en aquellos sectores carentes de Plan Regulador Costero, conforme a las regulaciones de la Ley N°9242 y sus reformas, así como del Reglamento para el otorgamiento de permisos de uso en la zona marítimo terrestre del Cantón de Nicoya.
              </p>
            </div>
          </div>
        </section>

        <section className="text-center mb-16">
          <h2 className="text-3xl font-semibold mb-4 text-gray-800">Competencias del Departamento de Zona Marítima Terrestre</h2>
          <ul className="list-disc pl-6 space-y-4 text-lg text-gray-700">
            <li>
              Gestionar los trámites relativos a las concesiones de terrenos ubicados en la zona restringida de la zona marítimo terrestre jurisdicción de esta Municipalidad conforme lo establece el Plan Regulador Costero vigente para el sector costero, cumpliendo con establecido en Ley Nº6043 y su Reglamento, asimismo, tramitar las solicitudes de prórrogas de concesión, cesiones de derechos de una concesión inscrita.
            </li>
            <li>
              Gestionar los trámites relativos al otorgamiento de permisos de uso en precario sobre aquellos terrenos ubicados en la zona restringida de la zona marítimo terrestre jurisdicción de esta Municipalidad donde no se cuenta con Plan Regulador Costero.
            </li>
            <li>
              Realizar las inspecciones de terrenos y áreas con uso público ubicados dentro de la zona marítimo terrestre jurisdicción de esta Municipalidad, para el resguardo y protección de estos bienes demaniales.
            </li>
          </ul>
        </section>

        <section className="text-center">

          <DocumentosPDF/>
        </section>
      </div>
            <Footer/>
    </div>
  );
}

