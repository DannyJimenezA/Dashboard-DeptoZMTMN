// import { useEffect, useState } from "react"
// import { useParams, useNavigate } from "react-router-dom"
// import type { Denuncia } from "../../Types/Types"
// import ApiService from "../../Components/ApiService"
// import ApiRoutes from "../../Components/ApiRoutes"
// import Swal from "sweetalert2"
// import withReactContent from "sweetalert2-react-content"
// import {
//   ArrowLeft,
//   Calendar,
//   FileText,
//   User,
//   UserCheck,
//   X,
//   File,
//   ImageIcon,
//   ExternalLink,
// } from "lucide-react"

// const MySwal = withReactContent(Swal)

// export default function DetalleDenunciaPage() {
//   const { id } = useParams()
//   const navigate = useNavigate()
//   const [denuncia, setDenuncia] = useState<Denuncia | null>(null)
//   const [mensaje, setMensaje] = useState("")
//   const [archivos, setArchivos] = useState<string[]>([])
//   const [loading, setLoading] = useState<boolean>(true)

//   useEffect(() => {
//     const fetchDenuncia = async () => {
//       setLoading(true)
//       try {
//         const data = await ApiService.get<Denuncia>(`${ApiRoutes.denuncias}/${id}`)
//         setDenuncia(data)

//         if (data.archivosEvidencia) {
//           let archivosParseados: string[] = []

//           if (Array.isArray(data.archivosEvidencia)) {
//             archivosParseados = data.archivosEvidencia
//           } else {
//             try {
//               archivosParseados = JSON.parse(data.archivosEvidencia)
//             } catch {
//               archivosParseados = data.archivosEvidencia.includes(",")
//                 ? data.archivosEvidencia.split(",")
//                 : [data.archivosEvidencia]
//             }
//           }

//           setArchivos(archivosParseados)
//         }
//       } catch {
//         Swal.fire({
//           title: "Error",
//           text: "Error al cargar la denuncia",
//           icon: "error",
//           confirmButtonColor: "#00a884",
//         })
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchDenuncia()
//   }, [id])

//   const cambiarEstado = async (nuevoEstado: "Aprobada" | "Denegada") => {
//     if (!mensaje.trim()) {
//       Swal.fire({
//         title: "Mensaje requerido",
//         text: "Escribe un mensaje antes de continuar.",
//         icon: "warning",
//         confirmButtonColor: "#00a884",
//       })
//       return
//     }

//     const result = await MySwal.fire({
//       title: `¿Confirmar ${nuevoEstado.toLowerCase()}?`,
//       text: `Se notificará al usuario con tu mensaje.`,
//       icon: "question",
//       showCancelButton: true,
//       confirmButtonText: "Sí, continuar",
//       cancelButtonText: "Cancelar",
//       confirmButtonColor: nuevoEstado === "Aprobada" ? "#00a884" : "#e53935",
//       cancelButtonColor: "#546e7a",
//     })

//     if (!result.isConfirmed || !denuncia) return

//     try {
//       const response = await fetch(`${ApiRoutes.urlBase}/denuncia/${denuncia.id}/status`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify({ status: nuevoEstado }),
//       })

//       if (response.status === 403) {
//         Swal.fire({
//           title: "Acceso Denegado",
//           text: "No tienes permisos para realizar esta acción.",
//           icon: "warning",
//           confirmButtonColor: "#00a884",
//         })
//         return
//       }

//       if (!response.ok) throw new Error("Error al actualizar")

//       Swal.fire({
//         title: "¡Éxito!",
//         text: `Denuncia ${nuevoEstado.toLowerCase()} correctamente.`,
//         icon: "success",
//         confirmButtonColor: "#00a884",
//       })
//       navigate("/dashboard/denuncias")
//     } catch (err) {
//       console.error(err)
//       Swal.fire({
//         title: "Error",
//         text: "Hubo un problema al actualizar la denuncia.",
//         icon: "error",
//         confirmButtonColor: "#00a884",
//       })
//     }
//   }

//   const abrirArchivo = (index: number) => {
//     if (!archivos[index]) return
//     let fileUrl = archivos[index]
//     if (!/^https?:\/\//i.test(fileUrl)) {
//       fileUrl = `${ApiRoutes.urlBase}/${fileUrl.replace(/\\/g, "/")}`
//     }
//     window.open(fileUrl, "_blank")
//   }

//   const esImagen = (archivo: string): boolean =>
//     /\.(jpeg|jpg|png|gif)$/i.test(archivo)

//   const getStatusBadge = (status: string) => {
//     const base = "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border"
//     switch (status) {
//       case "Pendiente":
//         return <span className={`${base} bg-amber-100 text-amber-800 border-amber-200`}>Pendiente</span>
//       case "Aprobada":
//         return <span className={`${base} bg-teal-100 text-teal-800 border-teal-200`}>Aprobada</span>
//       case "Denegada":
//         return <span className={`${base} bg-red-100 text-red-800 border-red-200`}>Denegada</span>
//       default:
//         return <span className={`${base} bg-gray-100 text-gray-800 border-gray-200`}>{status}</span>
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
//           <p className="text-gray-600">Cargando detalles de la denuncia...</p>
//         </div>
//       </div>
//     )
//   }

//   if (!denuncia) {
//     return (
//       <div className="max-w-2xl mx-auto mt-8 bg-white shadow-lg rounded-lg p-6 text-center">
//         <div className="py-8">
//           <div className="text-red-500 text-5xl mb-4">⚠️</div>
//           <h2 className="text-2xl font-bold mb-2">Denuncia no encontrada</h2>
//           <p className="text-gray-600 mb-6">No se pudo encontrar la información de esta denuncia.</p>
//           <button
//             onClick={() => navigate("/dashboard/denuncias")}
//             className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center gap-2 mx-auto"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             Volver a la lista
//           </button>
//         </div>
//       </div>
//     )
//   }

//   const isEditable = denuncia.status === "Pendiente"

//   return (
//     <div className="max-w-6xl mx-auto mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
//       {/* Encabezado */}
//       <div className="bg-slate-800 p-4 text-white flex justify-between items-center">
//         <h2 className="text-xl font-bold">Detalles de la Denuncia</h2>
//         {getStatusBadge(denuncia.status || "Pendiente")}
//       </div>

//       <div className="p-6 space-y-6">
//         {/* Grid principal */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Información del denunciante */}
//           <div className="bg-white border border-gray-200 rounded-lg p-4">
//             <h3 className="text-base font-semibold mb-4 flex items-center gap-2 text-gray-700">
//               <User className="h-5 w-5 text-teal-600" />
//               Información del Denunciante
//             </h3>
//             <div className="space-y-3">
//               <div className="flex"><span className="text-gray-500 w-28">Nombre:</span><span className="font-medium">{denuncia.nombreDenunciante || "Anónimo"}</span></div>
//               <div className="flex"><span className="text-gray-500 w-28">Cédula:</span><span className="font-medium">{denuncia.cedulaDenunciante || "Anónimo"}</span></div>
//               <div className="flex"><span className="text-gray-500 w-28">ID Denuncia:</span><span className="font-medium">{denuncia.id}</span></div>
//               <div className="flex"><span className="text-gray-500 w-28">Notificación:</span><span className="font-medium">{denuncia.metodoNotificacion || "No especificado"}</span></div>
//               <div className="flex"><span className="text-gray-500 w-28">Medio:</span><span className="font-medium">{denuncia.medioNotificacion || "No especificado"}</span></div>
//             </div>
//           </div>

//           {/* Detalles básicos */}
//           <div className="bg-white border border-gray-200 rounded-lg p-4">
//             <h3 className="text-base font-semibold mb-4 flex items-center gap-2 text-gray-700">
//               <FileText className="h-5 w-5 text-teal-600" />
//               Detalles de la Denuncia
//             </h3>
//             <div className="space-y-3">
//               <div className="flex"><span className="text-gray-500 w-28">Fecha:</span><span className="font-medium flex items-center"><Calendar className="h-4 w-4 mr-1 text-teal-600" />{denuncia.Date || "No disponible"}</span></div>
//               <div className="flex"><span className="text-gray-500 w-28">Tipo:</span><span className="font-medium">{denuncia.tipoDenuncia?.descripcion || "No especificado"}</span></div>
//               <div className="flex"><span className="text-gray-500 w-28">Descripción:</span><span className="font-medium">{denuncia.descripcion || "No especificado"}</span></div>
//               <div className="flex"><span className="text-gray-500 w-28">Lugar:</span><span className="font-medium">{denuncia.lugarDenuncia?.descripcion || "No especificado"}</span></div>
//               <div className="flex"><span className="text-gray-500 w-28">Ubicación exacta:</span><span className="font-medium">{denuncia.ubicacion || "No especificado"}</span></div>
              
//             </div>
//           </div>
//         </div>

//         {/* Evidencias */}
//         <div className="bg-white border border-gray-200 rounded-lg p-4">
//           <h3 className="text-base font-semibold mb-3 flex items-center gap-2 text-gray-700">
//             <File className="h-5 w-5 text-teal-600" />
//             Evidencias
//           </h3>
//           <p className="text-gray-700 bg-gray-50 p-3 rounded-md mb-4">{denuncia.detallesEvidencia || "No se proporcionaron detalles de evidencia."}</p>

//           {archivos.length > 0 ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
//               {archivos.map((archivo, index) => (
//                 <div key={index} onClick={() => abrirArchivo(index)} className="flex items-center p-3 rounded-md border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
//                   {esImagen(archivo) ? (
//                     <ImageIcon className="h-5 w-5 text-blue-500 mr-2" />
//                   ) : (
//                     <File className="h-5 w-5 text-red-500 mr-2" />
//                   )}
//                   <span className="text-sm text-gray-700 flex-1 truncate">{archivo.split("/").pop() || `Archivo ${index + 1}`}</span>
//                   <ExternalLink className="h-4 w-4 text-gray-400" />
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p className="text-gray-500 text-center py-4 bg-gray-50 rounded-md">No hay archivos de evidencia</p>
//           )}
//         </div>

//         {/* Respuesta */}
//         {isEditable && (
//           <div className="bg-white border border-gray-200 rounded-lg p-4">
//             <h3 className="text-base font-semibold mb-4 flex items-center gap-2 text-gray-700">
//               <UserCheck className="h-5 w-5 text-teal-600" />
//               Respuesta al Usuario
//             </h3>
//             <textarea
//               value={mensaje}
//               onChange={(e) => setMensaje(e.target.value)}
//               rows={4}
//               className="w-full border border-gray-300 rounded-md p-3 resize-none focus:ring-2 focus:ring-teal-500"
//               placeholder="Escribe aquí el mensaje que se enviará al usuario..."
//             />
//             <p className="text-sm text-gray-500 mt-1">Este mensaje será enviado como notificación.</p>

//             <div className="flex flex-col sm:flex-row gap-3 mt-6">
//               <button onClick={() => cambiarEstado("Aprobada")} className="flex-1 bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 flex items-center justify-center gap-2">
//                 <UserCheck className="h-5 w-5" />
//                 Aprobar Denuncia
//               </button>
//               <button onClick={() => cambiarEstado("Denegada")} className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center justify-center gap-2">
//                 <X className="h-5 w-5" />
//                 Denegar Denuncia
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Botón volver */}
//         <div className="text-right">
//           <button
//             onClick={() => navigate("/dashboard/denuncias")}
//             className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center gap-2 ml-auto"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             Volver a la lista
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }



import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import type { Denuncia } from "../../Types/Types"
import ApiService from "../../Components/ApiService"
import ApiRoutes from "../../Components/ApiRoutes"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import {
  ArrowLeft,
  Calendar,
  FileText,
  User,
  UserCheck,
  X,
  File,
  ImageIcon,
  ExternalLink,
} from "lucide-react"

const MySwal = withReactContent(Swal)

export default function DetalleDenunciaPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [denuncia, setDenuncia] = useState<Denuncia | null>(null)
  const [archivos, setArchivos] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchDenuncia = async () => {
      setLoading(true)
      try {
        const data = await ApiService.get<Denuncia>(`${ApiRoutes.denuncias}/${id}`)
        setDenuncia(data)

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
      } catch {
        Swal.fire({
          title: "Error",
          text: "Error al cargar la denuncia",
          icon: "error",
          confirmButtonColor: "#00a884",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDenuncia()
  }, [id])

  const cambiarEstado = async (nuevoEstado: "Aprobada" | "Denegada") => {
    const result = await MySwal.fire({
      title: `¿Confirmar ${nuevoEstado.toLowerCase()}?`,
      text: `¿Estás seguro que deseas marcar esta denuncia como ${nuevoEstado.toLowerCase()}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, continuar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: nuevoEstado === "Aprobada" ? "#00a884" : "#e53935",
      cancelButtonColor: "#546e7a",
    });
  
    if (!result.isConfirmed || !denuncia) return;
  
    try {
      const response = await fetch(`${ApiRoutes.urlBase}/denuncia/${denuncia.id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: nuevoEstado }),
      });
  
      if (!response.ok) throw new Error();
  
      Swal.fire({
        title: "¡Éxito!",
        text: `Denuncia ${nuevoEstado.toLowerCase()} correctamente.`,
        icon: "success",
        confirmButtonColor: "#00a884",
      });
  
      navigate("/dashboard/denuncias");
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al actualizar la denuncia.",
        icon: "error",
        confirmButtonColor: "#00a884",
      });
    }
  };
  

  const abrirArchivo = (index: number) => {
    if (!archivos[index]) return
    let fileUrl = archivos[index]
    if (!/^https?:\/\//i.test(fileUrl)) {
      fileUrl = `${ApiRoutes.urlBase}/${fileUrl.replace(/\\/g, "/")}`
    }
    window.open(fileUrl, "_blank")
  }

  const esImagen = (archivo: string): boolean =>
    /\.(jpeg|jpg|png|gif)$/i.test(archivo)

  const getStatusBadge = (status: string) => {
    const base = "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border"
    switch (status) {
      case "Pendiente":
        return <span className={`${base} bg-amber-100 text-amber-800 border-amber-200`}>Pendiente</span>
      case "Aprobada":
        return <span className={`${base} bg-teal-100 text-teal-800 border-teal-200`}>Aprobada</span>
      case "Denegada":
        return <span className={`${base} bg-red-100 text-red-800 border-red-200`}>Denegada</span>
      default:
        return <span className={`${base} bg-gray-100 text-gray-800 border-gray-200`}>{status}</span>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando detalles de la denuncia...</p>
        </div>
      </div>
    )
  }

  if (!denuncia) {
    return (
      <div className="max-w-2xl mx-auto mt-8 bg-white shadow-lg rounded-lg p-6 text-center">
        <div className="py-8">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Denuncia no encontrada</h2>
          <p className="text-gray-600 mb-6">No se pudo encontrar la información de esta denuncia.</p>
          <button
            onClick={() => navigate("/dashboard/denuncias")}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a la lista
          </button>
        </div>
      </div>
    )
  }

  const isEditable = denuncia.status === "Pendiente"

  return (
    <div className="max-w-6xl mx-auto mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Encabezado */}
      <div className="bg-slate-800 p-4 text-white flex justify-between items-center">
        <h2 className="text-xl font-bold">Detalles de la Denuncia</h2>
        {getStatusBadge(denuncia.status || "Pendiente")}
      </div>

      <div className="p-6 space-y-6">
        {/* Grid principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Información del denunciante */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2 text-gray-700">
              <User className="h-5 w-5 text-teal-600" />
              Información del Denunciante
            </h3>
            <div className="space-y-3">
              <div className="flex"><span className="text-gray-500 w-28">Nombre:</span><span className="font-medium">{denuncia.nombreDenunciante || "Anónimo"}</span></div>
              <div className="flex"><span className="text-gray-500 w-28">Cédula:</span><span className="font-medium">{denuncia.cedulaDenunciante || "Anónimo"}</span></div>
              <div className="flex"><span className="text-gray-500 w-28">ID Denuncia:</span><span className="font-medium">{denuncia.id}</span></div>
              <div className="flex"><span className="text-gray-500 w-28">Notificación:</span><span className="font-medium">{denuncia.metodoNotificacion || "No especificado"}</span></div>
              <div className="flex"><span className="text-gray-500 w-28">Medio:</span><span className="font-medium">{denuncia.medioNotificacion || "No especificado"}</span></div>
            </div>
          </div>

          {/* Detalles básicos */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2 text-gray-700">
              <FileText className="h-5 w-5 text-teal-600" />
              Detalles de la Denuncia
            </h3>
            <div className="space-y-3">
              <div className="flex"><span className="text-gray-500 w-28">Fecha:</span><span className="font-medium flex items-center"><Calendar className="h-4 w-4 mr-1 text-teal-600" />{denuncia.Date || "No disponible"}</span></div>
              <div className="flex"><span className="text-gray-500 w-28">Tipo:</span><span className="font-medium">{denuncia.tipoDenuncia?.descripcion || "No especificado"}</span></div>
              <div className="flex"><span className="text-gray-500 w-28">Descripción:</span><span className="font-medium">{denuncia.descripcion || "No especificado"}</span></div>
              <div className="flex"><span className="text-gray-500 w-28">Lugar:</span><span className="font-medium">{denuncia.lugarDenuncia?.descripcion || "No especificado"}</span></div>
              <div className="flex"><span className="text-gray-500 w-28">Ubicación exacta:</span><span className="font-medium">{denuncia.ubicacion || "No especificado"}</span></div>
              
            </div>
          </div>
        </div>

        {/* Evidencias */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-base font-semibold mb-3 flex items-center gap-2 text-gray-700">
            <File className="h-5 w-5 text-teal-600" />
            Evidencias
          </h3>
          <p className="text-gray-700 bg-gray-50 p-3 rounded-md mb-4">{denuncia.detallesEvidencia || "No se proporcionaron detalles de evidencia."}</p>

          {archivos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {archivos.map((archivo, index) => (
                <div key={index} onClick={() => abrirArchivo(index)} className="flex items-center p-3 rounded-md border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                  {esImagen(archivo) ? (
                    <ImageIcon className="h-5 w-5 text-blue-500 mr-2" />
                  ) : (
                    <File className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <span className="text-sm text-gray-700 flex-1 truncate">{archivo.split("/").pop() || `Archivo ${index + 1}`}</span>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4 bg-gray-50 rounded-md">No hay archivos de evidencia</p>
          )}
        </div>

        {/* Respuesta */}
        {isEditable && (
  <div className="bg-white border border-gray-200 rounded-lg p-4">
    <h3 className="text-base font-semibold mb-4 flex items-center gap-2 text-gray-700">
      <UserCheck className="h-5 w-5 text-teal-600" />
      Gestionar Estado de la Denuncia
    </h3>
    <p className="text-sm text-gray-600 mb-4">
      Puedes aprobar o denegar esta denuncia. No se enviará mensaje ya que puede ser anónima.
    </p>
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        onClick={() => cambiarEstado("Aprobada")}
        className="flex-1 bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 flex items-center justify-center gap-2"
      >
        <UserCheck className="h-5 w-5" />
        Aprobar Denuncia
      </button>
      <button
        onClick={() => cambiarEstado("Denegada")}
        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center justify-center gap-2"
      >
        <X className="h-5 w-5" />
        Denegar Denuncia
      </button>
    </div>
  </div>
)}


        {/* Botón volver */}
        <div className="text-right">
          <button
            onClick={() => navigate("/dashboard/denuncias")}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center gap-2 ml-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a la lista
          </button>
        </div>
      </div>
    </div>
  )
}
