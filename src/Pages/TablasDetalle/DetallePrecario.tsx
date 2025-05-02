// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { FaFilePdf } from 'react-icons/fa';
// import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';
// import ApiService from '../../Components/ApiService';
// import ApiRoutes from '../../Components/ApiRoutes';
// import { Precario } from '../../Types/Types';

// const MySwal = withReactContent(Swal);

// export default function DetallePrecarioPage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [precario, setPrecario] = useState<Precario | null>(null);
//   const [mensaje, setMensaje] = useState('');
//   const [archivoVistaPrevia, setArchivoVistaPrevia] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchPrecario = async () => {
//       try {
//         const data = await ApiService.get<Precario>(`${ApiRoutes.precarios}/${id}`);
//         setPrecario(data);
//       } catch {
//         Swal.fire('Error', 'Error al cargar el uso precario', 'error');
//       }
//     };

//     fetchPrecario();
//   }, [id]);

//   const cambiarEstado = async (nuevoEstado: 'Aprobada' | 'Denegada') => {
//     if (!mensaje.trim()) {
//       Swal.fire('Escribe un mensaje antes de continuar.');
//       return;
//     }

//     const result = await MySwal.fire({
//       title: `¿Confirmar ${nuevoEstado.toLowerCase()}?`,
//       text: `Se notificará al usuario con tu mensaje.`,
//       icon: 'question',
//       showCancelButton: true,
//       confirmButtonText: 'Sí, continuar',
//       cancelButtonText: 'Cancelar',
//     });

//     if (!result.isConfirmed || !precario) return;

//     try {
//       await ApiService.put(`${ApiRoutes.precarios}/${precario.id}/status`, {
//         status: nuevoEstado,
//       });

//       await ApiService.post(`${ApiRoutes.urlBase}/mailer/send-custom-message`, {
//         email: precario.user?.email,
//         message: mensaje,
//       });

//       Swal.fire('Éxito', `Uso precario ${nuevoEstado.toLowerCase()} correctamente.`, 'success');
//       navigate('/dashboard/uso-precario');
//     } catch (err) {
//       console.error(err);
//       Swal.fire('Error', 'Hubo un problema al actualizar el estado.', 'error');
//     }
//   };

//   const manejarVerArchivo = (archivo: string) => {
//     const archivoFinal = archivo.replace(/[\[\]"]/g, '');
//     if (archivoFinal) {
//       const fileUrl = `${ApiRoutes.urlBase}/${archivoFinal}`;
//       setArchivoVistaPrevia(fileUrl);
//     }
//   };

//   const cerrarVistaPrevia = () => setArchivoVistaPrevia(null);

//   if (!precario) return <p className="p-4">Cargando precario...</p>;

//   const isEditable = precario.status === 'Pendiente';

//   return (
//     <div className="max-w-2xl mx-auto mt-8 bg-white shadow-lg rounded p-6">
//       <h2 className="text-2xl font-bold mb-4 text-center">Detalles del Uso Precario</h2>

//       <div className="space-y-2">
//         <p><strong>ID:</strong> {precario.id}</p>
//         <p><strong>Nombre:</strong> {precario.user?.nombre}</p>
//         <p><strong>Apellidos:</strong> {precario.user?.apellido1 || 'No disponible'} {precario.user?.apellido2 || ''}</p>
//         <p><strong>Cédula:</strong> {precario.user?.cedula}</p>
//         <p><strong>Detalle:</strong> {precario.Detalle}</p>
//         <p><strong>Estado:</strong> {precario.status}</p>
//         <p><strong>Archivos Adjuntos:</strong></p>
//         <div className="flex gap-2">
//           {precario.ArchivoAdjunto ? (
//             JSON.parse(precario.ArchivoAdjunto).map((archivo: string, index: number) => (
//               <FaFilePdf
//                 key={index}
//                 style={{ cursor: 'pointer' }}
//                 onClick={() => manejarVerArchivo(archivo)}
//                 title="Ver archivo"
//                 size={20}
//               />
//             ))
//           ) : (
//             <span>No disponible</span>
//           )}
//         </div>
//       </div>

//       {archivoVistaPrevia && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center"
//           onClick={cerrarVistaPrevia}
//         >
//           <div
//             className="relative w-full max-w-4xl h-[80vh] bg-white rounded-lg shadow-lg overflow-hidden"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <iframe
//               src={archivoVistaPrevia}
//               className="w-full h-full"
//               style={{ border: 'none' }}
//               title="Vista previa del archivo PDF"
//             />
//           </div>
//         </div>
//       )}

//       {isEditable && (
//         <>
//           <div className="mt-6">
//             <label className="block font-medium mb-1">Mensaje para el usuario:</label>
//             <textarea
//               value={mensaje}
//               onChange={(e) => setMensaje(e.target.value)}
//               rows={4}
//               className="w-full border border-gray-300 rounded p-2 resize-none"
//               placeholder="Escribe aquí el mensaje que se enviará al usuario..."
//             />
//           </div>

//           <div className="mt-4 flex gap-4 justify-center">
//             <button
//               className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//               onClick={() => cambiarEstado('Aprobada')}
//             >
//               Aprobar
//             </button>
//             <button
//               className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
//               onClick={() => cambiarEstado('Denegada')}
//             >
//               Denegar
//             </button>
//           </div>
//         </>
//       )}

//       <div className="mt-6 text-right">
//         <button
//           onClick={() => navigate('/dashboard/uso-precario')}
//           className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
//         >
//           Volver
//         </button>
//       </div>
//     </div>
//   );
// }

"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import type { Precario } from "../../Types/Types"
import ApiService from "../../Components/ApiService"
import ApiRoutes from "../../Components/ApiRoutes"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import {
  FaFilePdf,
  FaArrowLeft,
  FaCheck,
  FaTimes,
  FaEye,
  FaDownload,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa"

const MySwal = withReactContent(Swal)

export default function DetallePrecarioPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [precario, setPrecario] = useState<Precario | null>(null)
  const [mensaje, setMensaje] = useState("")
  const [archivoVistaPrevia, setArchivoVistaPrevia] = useState<string | null>(null)
  const [archivos, setArchivos] = useState<string[]>([])
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchPrecario = async () => {
      setLoading(true)
      try {
        const data = await ApiService.get<Precario>(`${ApiRoutes.precarios}/${id}`)
        setPrecario(data)

        // Procesar archivos adjuntos
        if (data.ArchivoAdjunto) {
          try {
            const archivosParseados = JSON.parse(data.ArchivoAdjunto)
            setArchivos(archivosParseados.map((archivo: string) => archivo.replace(/[[\]"]/g, "")))
          } catch (error) {
            console.error("Error al parsear ArchivoAdjunto:", error)
          }
        }
      } catch (error) {
        Swal.fire("Error", "Error al cargar el uso precario", "error")
      } finally {
        setLoading(false)
      }
    }

    fetchPrecario()
  }, [id])

  const cambiarEstado = async (nuevoEstado: "Aprobada" | "Denegada") => {
    if (!mensaje.trim()) {
      Swal.fire("Atención", "Escribe un mensaje antes de continuar.", "warning")
      return
    }

    const result = await MySwal.fire({
      title: `¿Confirmar ${nuevoEstado.toLowerCase()}?`,
      text: `Se notificará al usuario con tu mensaje.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, continuar",
      cancelButtonText: "Cancelar",
    })

    if (!result.isConfirmed || !precario) return

    try {
      await ApiService.put(`${ApiRoutes.precarios}/${precario.id}/status`, {
        status: nuevoEstado,
      })

      await ApiService.post(`${ApiRoutes.urlBase}/mailer/send-custom-message`, {
        email: precario.user?.email,
        message: mensaje,
      })

      Swal.fire("Éxito", `Uso precario ${nuevoEstado.toLowerCase()} correctamente.`, "success")
      navigate("/dashboard/uso-precario")
    } catch (err) {
      console.error(err)
      Swal.fire("Error", "Hubo un problema al actualizar el estado.", "error")
    }
  }

  const manejarVerArchivo = (index: number) => {
    if (archivos[index]) {
      setArchivoSeleccionado(index)
      const fileUrl = `${ApiRoutes.urlBase}/${archivos[index]}`
      setArchivoVistaPrevia(fileUrl)
    }
  }

  const descargarArchivo = (index: number) => {
    if (archivos[index]) {
      const fileUrl = `${ApiRoutes.urlBase}/${archivos[index]}`
      window.open(fileUrl, "_blank")
    }
  }

  const cerrarVistaPrevia = () => setArchivoVistaPrevia(null)

  const navegarArchivo = (direccion: "anterior" | "siguiente") => {
    let nuevoIndice = archivoSeleccionado

    if (direccion === "anterior") {
      nuevoIndice = archivoSeleccionado > 0 ? archivoSeleccionado - 1 : archivos.length - 1
    } else {
      nuevoIndice = archivoSeleccionado < archivos.length - 1 ? archivoSeleccionado + 1 : 0
    }

    manejarVerArchivo(nuevoIndice)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!precario) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-xl text-gray-700 mb-4">No se encontró el uso precario solicitado</p>
        <button
          onClick={() => navigate("/dashboard/uso-precario")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
        >
          <FaArrowLeft className="mr-2" /> Volver al listado
        </button>
      </div>
    )
  }

  const isEditable = precario.status === "Pendiente"
  const statusColor =
    precario.status === "Aprobada"
      ? "bg-green-100 text-green-800"
      : precario.status === "Denegada"
        ? "bg-red-100 text-red-800"
        : "bg-yellow-100 text-yellow-800"

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Detalles del Uso Precario</h1>
        <button
          onClick={() => navigate("/dashboard/uso-precario")}
          className="bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700 flex items-center"
        >
          <FaArrowLeft className="mr-2" /> Volver
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información del uso precario */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Información General</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">ID:</span>
                <span className="text-gray-800">{precario.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Nombre:</span>
                <span className="text-gray-800">{precario.user?.nombre || "No disponible"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Apellidos:</span>
                <span className="text-gray-800">
                  {precario.user?.apellido1 || "No disponible"} {precario.user?.apellido2 || ""}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Cédula:</span>
                <span className="text-gray-800">{precario.user?.cedula || "No disponible"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Email:</span>
                <span className="text-gray-800">{precario.user?.email || "No disponible"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Estado:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
                  {precario.status || "Pendiente"}
                </span>
              </div>
              <div className="mt-4">
                <span className="text-gray-600 font-medium block mb-2">Detalle:</span>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{precario.Detalle}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de mensaje (en la columna izquierda) */}
          {isEditable && (
            <div className="bg-white shadow-lg rounded-lg overflow-hidden mt-6">
              <div className="bg-gray-50 px-6 py-4 border-b">
                <h2 className="text-xl font-semibold text-gray-800">Respuesta al Usuario</h2>
              </div>
              <div className="p-6">
                <h3 className="text-base font-medium text-gray-700 mb-2">Mensaje para el usuario:</h3>
                <textarea
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg p-3 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Escribe aquí el mensaje que se enviará al usuario..."
                />

                <div className="mt-4 flex gap-4">
                  <button
                    className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 flex items-center justify-center"
                    onClick={() => cambiarEstado("Aprobada")}
                  >
                    <FaCheck className="mr-2" /> Aprobar Solicitud
                  </button>
                  <button
                    className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 flex items-center justify-center"
                    onClick={() => cambiarEstado("Denegada")}
                  >
                    <FaTimes className="mr-2" /> Denegar Solicitud
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Previsualización de documentos con archivos adjuntos integrados */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Previsualización de Documentos</h2>
            </div>
            <div className="p-6">
              {/* Mostrar lista de archivos o archivo seleccionado */}
              {!archivoVistaPrevia ? (
                /* Lista de archivos cuando no hay previsualización */
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Archivos Adjuntos</h3>
                  {archivos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {archivos.map((_archivo, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100"
                        >
                          <div className="flex items-center">
                            <FaFilePdf className="text-red-500 text-xl mr-3" />
                            <span className="text-gray-700">Documento {index + 1}</span>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => manejarVerArchivo(index)}
                              className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-100"
                              title="Ver archivo"
                            >
                              <FaEye />
                            </button>
                            <button
                              onClick={() => descargarArchivo(index)}
                              className="p-2 text-green-600 hover:text-green-800 rounded-full hover:bg-green-100"
                              title="Descargar archivo"
                            >
                              <FaDownload />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4 bg-gray-50 rounded-lg">No hay archivos adjuntos</p>
                  )}
                </div>
              ) : (
                /* Archivo seleccionado cuando hay previsualización */
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-800">Archivo seleccionado</h3>
                    <button
                      onClick={cerrarVistaPrevia}
                      className="text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
                      title="Volver a la lista de archivos"
                    >
                      Volver a la lista
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200 mb-4">
                    <div className="flex items-center">
                      <FaFilePdf className="text-red-500 text-xl mr-3" />
                      <span className="text-gray-700">
                        Documento {archivoSeleccionado + 1} de {archivos.length}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navegarArchivo("anterior")}
                        className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-100"
                        title="Documento anterior"
                        disabled={archivos.length <= 1}
                      >
                        <FaChevronLeft />
                      </button>
                      <button
                        onClick={() => descargarArchivo(archivoSeleccionado)}
                        className="p-2 text-green-600 hover:text-green-800 rounded-full hover:bg-green-100"
                        title="Descargar archivo"
                      >
                        <FaDownload />
                      </button>
                      <button
                        onClick={() => navegarArchivo("siguiente")}
                        className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-100"
                        title="Documento siguiente"
                        disabled={archivos.length <= 1}
                      >
                        <FaChevronRight />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Visor de PDF */}
              {archivoVistaPrevia ? (
                <div className="border border-gray-300 rounded-lg overflow-hidden h-[600px]">
                  <iframe
                    src={archivoVistaPrevia}
                    className="w-full h-full"
                    style={{ border: "none" }}
                    title="Vista previa del archivo PDF"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-[400px] bg-gray-50 rounded-lg border border-dashed border-gray-300 mt-6">
                  <div className="text-center">
                    <FaFilePdf className="mx-auto text-gray-400 text-4xl mb-2" />
                    <p className="text-gray-500">Selecciona un archivo para visualizarlo</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
