import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "../../Components/ApiService";
import ApiRoutes from "../../Components/ApiRoutes";
import type { Prorroga } from "../../Types/Types";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  ArrowLeft,
  File,
  FileText,
  User,
  UserCheck,
  X,
  ExternalLink,
} from "lucide-react";

const MySwal = withReactContent(Swal);

export default function DetalleProrrogaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prorroga, setProrroga] = useState<Prorroga | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [archivos, setArchivos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProrroga = async () => {
      setLoading(true);
      try {
        const data = await ApiService.get<Prorroga>(`${ApiRoutes.prorrogas}/${id}`);
        setProrroga(data);

        if (data.ArchivoAdjunto) {
          try {
            const archivosParseados = JSON.parse(data.ArchivoAdjunto);
            setArchivos(
              Array.isArray(archivosParseados)
                ? archivosParseados.map((a: string) => a.replace(/[[\]"]/g, ""))
                : [archivosParseados.replace(/[[\]"]/g, "")]
            );
          } catch {
            setArchivos([data.ArchivoAdjunto.replace(/[[\]"]/g, "")]);
          }
        }
      } catch {
        Swal.fire({
          title: "Error",
          text: "Error al cargar la prórroga",
          icon: "error",
          confirmButtonColor: "#00a884",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProrroga();
  }, [id]);

  const cambiarEstado = async (nuevoEstado: "Aprobada" | "Denegada") => {
    if (!mensaje.trim()) {
      Swal.fire({
        title: "Mensaje requerido",
        text: "Escribe un mensaje antes de continuar.",
        icon: "warning",
        confirmButtonColor: "#00a884",
      });
      return;
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
    });

    if (!result.isConfirmed || !prorroga) return;

    try {
      await ApiService.put(`${ApiRoutes.prorrogas}/${prorroga.id}/status`, {
        status: nuevoEstado,
        message: mensaje,
      });

      await ApiService.post(`${ApiRoutes.urlBase}/mailer/send-custom-message`, {
        email: prorroga.user?.email,
        message: mensaje,
      });

      Swal.fire({
        title: "¡Éxito!",
        text: `Solicitud de prórroga ${nuevoEstado.toLowerCase()} correctamente.`,
        icon: "success",
        confirmButtonColor: "#00a884",
            timer: 3000,
      showConfirmButton: false,
      });

      navigate("/dashboard/prorrogas");
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al actualizar la prórroga.",
        icon: "error",
        confirmButtonColor: "#00a884",
      });
    }
  };

  const abrirArchivo = (archivo: string) => {
    const url = `${ApiRoutes.urlBase}/${archivo}`;
    window.open(url, "_blank");
  };

  const getStatusBadge = (status: string) => {
    const base = "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border";
    switch (status) {
      case "Pendiente":
        return <span className={`${base} bg-amber-100 text-amber-800 border-amber-200`}>Pendiente</span>;
      case "Aprobada":
        return <span className={`${base} bg-teal-100 text-teal-800 border-teal-200`}>Aprobada</span>;
      case "Denegada":
        return <span className={`${base} bg-red-100 text-red-800 border-red-200`}>Denegada</span>;
      default:
        return <span className={`${base} bg-gray-100 text-gray-800 border-gray-200`}>{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando detalles de la prórroga...</p>
        </div>
      </div>
    );
  }

  if (!prorroga) {
    return (
      <div className="max-w-2xl mx-auto mt-8 bg-white shadow-lg rounded-lg p-6 text-center">
        <div className="py-8">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Prórroga no encontrada</h2>
          <p className="text-gray-600 mb-6">No se pudo encontrar la información de esta prórroga.</p>
          <button
            onClick={() => navigate("/dashboard/prorrogas")}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  const isEditable = prorroga.status === "Pendiente";

  return (
    <div className="max-w-6xl mx-auto mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-slate-800 p-4 text-white flex justify-between items-center">
        <h2 className="text-xl font-bold">Detalles de la Prórroga</h2>
        {getStatusBadge(prorroga.status || "Pendiente")}
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Info del solicitante */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2 text-gray-700">
              <User className="h-5 w-5 text-teal-600" />
              Información del Solicitante
            </h3>
            <div className="space-y-3">
              <div className="flex"><span className="text-gray-500 w-24">Nombre:</span><span className="font-medium">{prorroga.user?.nombre}</span></div>
              <div className="flex"><span className="text-gray-500 w-24">Apellidos:</span><span className="font-medium">{prorroga.user?.apellido1} {prorroga.user?.apellido2 || ""}</span></div>
              <div className="flex"><span className="text-gray-500 w-24">Cédula:</span><span className="font-medium">{prorroga.user?.cedula}</span></div>
              <div className="flex items-center"><span className="text-gray-500 w-24">Email:</span><span className="font-medium flex items-center">{prorroga.user?.email}</span></div>
              <div className="flex items-center"><span className="text-gray-500 w-24">Telefono:</span><span className="font-medium flex items-center">{prorroga.user?.telefono}</span></div>
            </div>
          </div>

          {/* Detalles de la prórroga */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2 text-gray-700">
              <FileText className="h-5 w-5 text-teal-600" />
              Detalles de la Prórroga
            </h3>
            <div className="space-y-3">
              <div className="flex"><span className="text-gray-500 w-24">Fecha:</span><span className="font-medium flex items-center">{prorroga.Date}</span></div>
              {/* <div className="flex"><span className="text-gray-500 w-24">Detalle:</span><span className="font-medium">{prorroga.Detalle}</span></div> */}
              <div className="grid grid-cols-[6rem_1fr] gap-2">
  <span className="text-gray-500 pt-1">Detalle:</span>
  <div className="font-medium leading-relaxed whitespace-pre-line break-all">
    {prorroga.Detalle || "No especificado"}
  </div>
</div>
            </div>
          </div>
        </div>

        {/* Archivos adjuntos */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-base font-semibold mb-3 flex items-center gap-2 text-gray-700">
            <File className="h-5 w-5 text-teal-600" />
            Archivos Adjuntos
          </h3>

          {archivos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {archivos.map((archivo, index) => (
                <div
                  key={index}
                  onClick={() => abrirArchivo(archivo)}
                  className="flex items-center p-3 rounded-md border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <File className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-sm text-gray-700 flex-1 truncate">
                    {archivo.split("/").pop() || `Documento ${index + 1}`}
                  </span>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4 bg-gray-50 rounded-md">No hay archivos adjuntos</p>
          )}
        </div>

        {/* Formulario de respuesta */}
        {isEditable && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2 text-gray-700">
              <UserCheck className="h-5 w-5 text-teal-600" />
              Respuesta al Usuario
            </h3>
            <textarea
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-md p-3 resize-none focus:ring-2 focus:ring-teal-500"
              placeholder="Escribe aquí el mensaje que se enviará al usuario..."
            />
            <p className="text-sm text-gray-500 mt-1">Este mensaje será enviado al solicitante por correo electrónico.</p>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button onClick={() => cambiarEstado("Aprobada")} className="flex-1 bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 flex items-center justify-center gap-2">
                <UserCheck className="h-5 w-5" />
                Aprobar Solicitud
              </button>
              <button onClick={() => cambiarEstado("Denegada")} className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center justify-center gap-2">
                <X className="h-5 w-5" />
                Denegar Solicitud
              </button>
            </div>
          </div>
        )}

        {/* Botón volver */}
        <div className="text-right">
          <button
            onClick={() => navigate("/dashboard/prorrogas")}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center gap-2 ml-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a la lista
          </button>
        </div>
      </div>
    </div>
  );
}
