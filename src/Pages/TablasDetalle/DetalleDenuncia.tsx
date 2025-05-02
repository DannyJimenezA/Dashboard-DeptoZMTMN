import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import type { Denuncia } from "../../Types/Types"
import ApiService from "../../Components/ApiService"
import ApiRoutes from "../../Components/ApiRoutes"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import {
  FaFilePdf,
  FaImage,
  FaArrowLeft,
  FaCheck,
  FaTimes,
  FaEye,
  FaDownload,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa"

const MySwal = withReactContent(Swal)

export default function DetalleDenunciaPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [denuncia, setDenuncia] = useState<Denuncia | null>(null)
  const [mensaje, setMensaje] = useState("")
  const [archivoVistaPrevia, setArchivoVistaPrevia] = useState<string | null>(null)
  const [archivos, setArchivos] = useState<string[]>([])
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchDenuncia = async () => {
      setLoading(true)
      try {
        const data = await ApiService.get<Denuncia>(`${ApiRoutes.denuncias}/${id}`)
        setDenuncia(data)

        // Procesar archivos de evidencia
        if (data.archivosEvidencia) {
          let archivosParseados: string[] = []

          if (Array.isArray(data.archivosEvidencia)) {
            archivosParseados = data.archivosEvidencia
          } else {
            try {
              archivosParseados = JSON.parse(data.archivosEvidencia)
            } catch {
              archivosParseados = data.archivosEvidencia.includes(",")
                ? data.archivosEvidencia.split(",")
                : [data.archivosEvidencia]
            }
          }

          setArchivos(archivosParseados)
        }
      } catch (error) {
        Swal.fire("Error", "Error al cargar la denuncia", "error")
      } finally {
        setLoading(false)
      }
    }

    fetchDenuncia()
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

    if (!result.isConfirmed || !denuncia) return

    try {
      await ApiService.put(`${ApiRoutes.denuncias}/${denuncia.id}/status`, {
        status: nuevoEstado,
      })

      Swal.fire("Éxito", `Denuncia ${nuevoEstado.toLowerCase()} correctamente.`, "success")
      navigate("/dashboard/denuncias")
    } catch (err) {
      console.error(err)
      Swal.fire("Error", "Hubo un problema al actualizar la denuncia.", "error")
    }
  }

  const manejarVerArchivo = (index: number) => {
    if (archivos[index]) {
      setArchivoSeleccionado(index)
      let fileUrl = archivos[index]

      // Si NO comienza con http o https, entonces sí agregamos el servidor local
      if (!/^https?:\/\//i.test(archivos[index])) {
        fileUrl = `${ApiRoutes.urlBase}/${archivos[index].replace(/\\/g, "/")}`
      }

      setArchivoVistaPrevia(fileUrl)
    }
  }

  const descargarArchivo = (index: number) => {
    if (archivos[index]) {
      let fileUrl = archivos[index]

      // Si NO comienza con http o https, entonces sí agregamos el servidor local
      if (!/^https?:\/\//i.test(archivos[index])) {
        fileUrl = `${ApiRoutes.urlBase}/${archivos[index].replace(/\\/g, "/")}`
      }

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

  const esImagen = (archivo: string): boolean => {
    return /\.(jpeg|jpg|png|gif)$/i.test(archivo)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!denuncia) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-xl text-gray-700 mb-4">No se encontró la denuncia solicitada</p>
        <button
          onClick={() => navigate("/dashboard/denuncias")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
        >
          <FaArrowLeft className="mr-2" /> Volver al listado
        </button>
      </div>
    )
  }

  const isEditable = denuncia.status === "Pendiente"
  const statusColor =
    denuncia.status === "Aprobada"
      ? "bg-green-100 text-green-800"
      : denuncia.status === "Denegada"
        ? "bg-red-100 text-red-800"
        : "bg-yellow-100 text-yellow-800"

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Detalles de la Denuncia</h1>
        <button
          onClick={() => navigate("/dashboard/denuncias")}
          className="bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700 flex items-center"
        >
          <FaArrowLeft className="mr-2" /> Volver
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información de la denuncia */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Información General</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">ID:</span>
                <span className="text-gray-800">{denuncia.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Fecha de Creación:</span>
                <span className="text-gray-800">{denuncia.Date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Nombre del Denunciante:</span>
                <span className="text-gray-800">{denuncia.nombreDenunciante || "Anónimo"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Cédula del Denunciante:</span>
                <span className="text-gray-800">{denuncia.cedulaDenunciante || "Anónimo"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Método de Notificación:</span>
                <span className="text-gray-800">{denuncia.metodoNotificacion || "No especificado"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Medio de Notificación:</span>
                <span className="text-gray-800">{denuncia.medioNotificacion || "No especificado"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Tipo de Denuncia:</span>
                <span className="text-gray-800">{denuncia.tipoDenuncia?.descripcion || "No especificado"}</span>
              </div>
              <div className="mt-4">
                <span className="text-gray-600 font-medium block mb-2">Descripción de la Denuncia:</span>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{denuncia.descripcion}</p>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Lugar de Denuncia:</span>
                <span className="text-gray-800">{denuncia.lugarDenuncia?.descripcion || "No especificado"}</span>
              </div>
              <div className="mt-4">
                <span className="text-gray-600 font-medium block mb-2">Ubicación Exacta:</span>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{denuncia.ubicacion || "No especificada"}</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Estado:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
                  {denuncia.status || "Pendiente"}
                </span>
              </div>
              <div className="mt-4">
                <span className="text-gray-600 font-medium block mb-2">Detalles de Evidencia:</span>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{denuncia.detallesEvidencia || "No disponible"}</p>
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
                    <FaCheck className="mr-2" /> Aprobar Denuncia
                  </button>
                  <button
                    className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 flex items-center justify-center"
                    onClick={() => cambiarEstado("Denegada")}
                  >
                    <FaTimes className="mr-2" /> Denegar Denuncia
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
              <h2 className="text-xl font-semibold text-gray-800">Evidencias de la Denuncia</h2>
            </div>
            <div className="p-6">
              {/* Mostrar lista de archivos o archivo seleccionado */}
              {!archivoVistaPrevia ? (
                /* Lista de archivos cuando no hay previsualización */
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Archivos de Evidencia</h3>
                  {archivos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {archivos.map((archivo, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100"
                        >
                          <div className="flex items-center">
                            {esImagen(archivo) ? (
                              <FaImage className="text-blue-500 text-xl mr-3" />
                            ) : (
                              <FaFilePdf className="text-red-500 text-xl mr-3" />
                            )}
                            <span className="text-gray-700">
                              {esImagen(archivo) ? "Imagen" : "Documento"} {index + 1}
                            </span>
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
                    <p className="text-gray-500 text-center py-4 bg-gray-50 rounded-lg">No hay archivos de evidencia</p>
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
                      {esImagen(archivos[archivoSeleccionado]) ? (
                        <FaImage className="text-blue-500 text-xl mr-3" />
                      ) : (
                        <FaFilePdf className="text-red-500 text-xl mr-3" />
                      )}
                      <span className="text-gray-700">
                        {esImagen(archivos[archivoSeleccionado]) ? "Imagen" : "Documento"} {archivoSeleccionado + 1} de{" "}
                        {archivos.length}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navegarArchivo("anterior")}
                        className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-100"
                        title="Archivo anterior"
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
                        title="Archivo siguiente"
                        disabled={archivos.length <= 1}
                      >
                        <FaChevronRight />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Visor de archivo */}
              {archivoVistaPrevia ? (
                <div className="border border-gray-300 rounded-lg overflow-hidden h-[600px]">
                  {esImagen(archivos[archivoSeleccionado]) ? (
                    <img
                      src={archivoVistaPrevia || "/placeholder.svg"}
                      alt="Vista previa"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <iframe
                      src={archivoVistaPrevia}
                      className="w-full h-full"
                      style={{ border: "none" }}
                      title="Vista previa del archivo"
                    />
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-[400px] bg-gray-50 rounded-lg border border-dashed border-gray-300 mt-6">
                  <div className="text-center">
                    <div className="mx-auto text-gray-400 text-4xl mb-2 flex justify-center">
                      <FaFilePdf className="mr-2" />
                      <FaImage />
                    </div>
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
