import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import ApiService from "../../Components/ApiService"
import ApiRoutes from "../../Components/ApiRoutes"
import type { Cita } from "../../Types/Types"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { ArrowLeft, Calendar, User, UserCheck, X } from "lucide-react"
import { socket } from "../../context/socket"; 

const MySwal = withReactContent(Swal)

export default function DetalleCitaPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [cita, setCita] = useState<Cita | null>(null)
  const [mensaje, setMensaje] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCita = async () => {
      try {
        setLoading(true)
        const data = await ApiService.get<Cita>(`${ApiRoutes.citas}/${id}`)
        setCita(data)
      } catch {
        Swal.fire({
          title: "Error",
          text: "Error al cargar la cita",
          icon: "error",
          confirmButtonColor: "#00a884",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCita()
  }, [id])

  const cambiarEstado = async (nuevoEstado: "Aprobada" | "Denegada") => {
    if (!mensaje.trim()) {
      Swal.fire({
        title: "Mensaje requerido",
        text: "Escribe un mensaje antes de continuar.",
        icon: "warning",
        confirmButtonColor: "#00a884",
      })
      return
    }

    const result = await MySwal.fire({
      title: `¿Confirmar ${nuevoEstado.toLowerCase()}?`,
      text: `Se notificará al usuario con tu mensaje.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, continuar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: nuevoEstado === "Aprobada" ? "#00a884" : "#e53935",
      cancelButtonColor: "#546e7a",
    })

    if (!result.isConfirmed || !cita) return

    try {
      const response = await fetch(`${ApiRoutes.urlBase}/appointments/${cita.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          status: nuevoEstado,
          message: mensaje,
        }),
      })

      if (response.status === 403) {
        Swal.fire({
          title: "Acceso Denegado",
          text: "No tienes permisos para realizar esta acción.",
          icon: "warning",
          confirmButtonColor: "#00a884",
        })
        return
      }

      if (!response.ok) throw new Error("Fallo al actualizar la cita")


    socket.emit("actualizar-solicitudes", { tipo: "citas" }); 

      Swal.fire({
        title: "¡Éxito!",
        text: `Cita ${nuevoEstado.toLowerCase()} correctamente.`,
        icon: "success",
        confirmButtonColor: "#00a884",
            timer: 3000,
      showConfirmButton: false,
      })
      navigate("/dashboard/citas")
    } catch (err) {
      console.error(err)
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al actualizar la cita.",
        icon: "error",
        confirmButtonColor: "#00a884",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando detalles de la cita...</p>
        </div>
      </div>
    )
  }

  if (!cita) {
    return (
      <div className="max-w-2xl mx-auto mt-8 bg-white shadow-lg rounded-lg p-6">
        <div className="text-center py-8">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Cita no encontrada</h2>
          <p className="text-gray-600 mb-6">No se pudo encontrar la información de esta cita.</p>
          <button
            onClick={() => navigate("/dashboard/citas")}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a la lista
          </button>
        </div>
      </div>
    )
  }

  const isEditable = cita.status === "Pendiente"

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pendiente":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
            Pendiente
          </span>
        )
      case "Aprobada":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800 border border-teal-200">
            Aprobada
          </span>
        )
      case "Denegada":
      case "Cancelada":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
            {status}
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
            {status}
          </span>
        )
    }
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Header */}
      {/* <div className="bg-teal-600 p-4 text-white flex justify-between items-center"> */}
      <div className="bg-slate-800 p-4 text-white flex justify-between items-center">


        <h2 className="text-xl font-bold">Detalles de la Cita</h2>
        {getStatusBadge(cita.status)}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Información del usuario */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2 text-gray-700">
              <User className="h-5 w-5 text-teal-600" />
              Información del Usuario
            </h3>
            <div className="space-y-3">
              <div className="flex">
                <span className="text-gray-500 w-24">Cédula:</span>
                <span className="font-medium">{cita.user?.cedula || "No disponible"}</span>
              </div>
              <div className="flex">
                <span className="text-gray-500 w-24">Nombre:</span>
                <span className="font-medium">{cita.user?.nombre || "No disponible"}</span>
              </div>
              <div className="flex">
                <span className="text-gray-500 w-24">Apellidos:</span>
                <span className="font-medium">{cita.user?.apellido1 || "No disponible"} {cita.user?.apellido2 || "No disponible"}</span>
              </div>
              {/* <div className="flex">
                <span className="text-gray-500 w-24">Email:</span>
                <span className="font-medium">{cita.user?.email || "No disponible"}</span>
              </div> */}
              <div className="grid grid-cols-[6rem_1fr] gap-2">
  <span className="text-gray-500 pt-1">Correo:</span>
  <div className="font-medium leading-relaxed whitespace-pre-line break-all">
    {cita.user?.email || "No especificado"}
  </div>
</div>
              <div className="flex">
                <span className="text-gray-500 w-24">Telefono:</span>
                <span className="font-medium">{cita.user?.telefono || "No disponible"}</span>
              </div>
            </div>
          </div>

          {/* Detalles de la cita */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2 text-gray-700">
              <Calendar className="h-5 w-5 text-teal-600" />
              Detalles de la Cita
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-gray-500 w-24">Fecha:</span>
                <span className="font-medium flex items-center">

                  {cita.availableDate?.date || "No disponible"}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-500 w-24">Hora:</span>
                <span className="font-medium flex items-center">

                  {cita.horaCita?.hora || "No disponible"}
                </span>
              </div>
              {/* <div className="flex items-start">
                <span className="text-gray-500 w-24">Descripción:</span>
                <span className="font-medium flex items-center">

                  {cita.description || "No disponible"}
                </span>
              </div> */}
              <div className="grid grid-cols-[6rem_1fr] gap-2">
  <span className="text-gray-500 pt-1">Descripción:</span>
  <div className="font-medium leading-relaxed whitespace-pre-line break-all">
    {cita.description || "No especificado"}
  </div>
</div>
            </div>
          </div>
        </div>



        {/* Formulario de respuesta (solo si es editable) */}
        {isEditable && (
          <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2 text-gray-700">
              <UserCheck className="h-5 w-5 text-teal-600" />
              Respuesta al Usuario
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje para el usuario:</label>
              <textarea
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-md p-3 resize-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                placeholder="Escribe aquí el mensaje que se enviará al usuario..."
              />
              <p className="text-sm text-gray-500 mt-1">Este mensaje será enviado al paciente como notificación.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                className="flex-1 bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
                onClick={() => cambiarEstado("Aprobada")}
              >
                <UserCheck className="h-5 w-5" />
                Aprobar Cita
              </button>
              <button
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                onClick={() => cambiarEstado("Denegada")}
              >
                <X className="h-5 w-5" />
                Denegar Cita
              </button>
            </div>
          </div>
        )}

        {/* Botón de volver */}
        <div className="mt-6 text-right">
          <button
            onClick={() => navigate("/dashboard/citas")}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center gap-2 ml-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a la lista
          </button>
        </div>
      </div>
    </div>
  )
}
