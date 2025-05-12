// src/Pages/DetallePlanoPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ApiService from "../../Components/ApiService";
import ApiRoutes from "../../Components/ApiRoutes";
import { ArrowLeft, File, FileText, User, UserCheck, X, ExternalLink, } from "lucide-react";
import type { RevisionPlano } from "../../Types/Types";

const MySwal = withReactContent(Swal);

interface ArchivoPlano {
  nombre: string;
  ruta: string;
}

export default function DetallePlanoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [revisionPlano, setRevisionPlano] = useState<RevisionPlano | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const [archivos, setArchivos] = useState<ArchivoPlano[]>([]);

  useEffect(() => {
    const fetchPlano = async () => {
      try {
        setLoading(true);
        const data = await ApiService.get<RevisionPlano>(`${ApiRoutes.planos}/${id}`);
        setRevisionPlano(data);

        if (data.ArchivosAdjuntos) {
          try {
            const parsed = typeof data.ArchivosAdjuntos === "string"
              ? JSON.parse(data.ArchivosAdjuntos)
              : data.ArchivosAdjuntos;

            setArchivos(Array.isArray(parsed) ? parsed : [parsed]);
          } catch {
            console.error("Archivos mal formateados");
          }
        }
      } catch {
        Swal.fire({
          title: "Error",
          text: "Error al cargar la revisión del plano",
          icon: "error",
          confirmButtonColor: "#00a884",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPlano();
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

    if (!result.isConfirmed || !revisionPlano) return;

    try {
      await ApiService.put(`${ApiRoutes.urlBase}/revision-plano/${revisionPlano.id}/status`, {
        status: nuevoEstado,
        message: mensaje,
      });

      Swal.fire({
        title: "¡Éxito!",
        text: `Plano ${nuevoEstado.toLowerCase()} correctamente.`,
        icon: "success",
        confirmButtonColor: "#00a884",
      });
      navigate("/dashboard/planos");
    } catch {
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al actualizar el estado.",
        icon: "error",
        confirmButtonColor: "#00a884",
      });
    }
  };

  const abrirArchivo = (ruta: string) => {
    const url = `${ApiRoutes.urlBase}/${ruta.replace(/\\/g, "/")}`;
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
          <p className="text-gray-600">Cargando detalles del plano...</p>
        </div>
      </div>
    );
  }

  if (!revisionPlano) {
    return (
      <div className="max-w-2xl mx-auto mt-8 bg-white shadow-lg rounded-lg p-6 text-center">
        <div className="py-8">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Plano no encontrado</h2>
          <p className="text-gray-600 mb-6">No se pudo encontrar la información de este plano.</p>
          <button
            onClick={() => navigate("/dashboard/planos")}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  const isEditable = revisionPlano.status === "Pendiente";

  return (
    <div className="max-w-6xl mx-auto mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-slate-800 p-4 text-white flex justify-between items-center">
        <h2 className="text-xl font-bold">Detalles de la Revisión de Plano</h2>
        {getStatusBadge(revisionPlano.status || "Pendiente")}

      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2 text-gray-700">
              <User className="h-5 w-5 text-teal-600" />
              Información del Solicitante
            </h3>
            <div className="space-y-3">
              <div className="flex"><span className="text-gray-500 w-24">Nombre:</span><span className="font-medium">{revisionPlano.user?.nombre || "No disponible"}</span></div>
              <div className="flex"><span className="text-gray-500 w-24">Apellidos:</span><span className="font-medium">{revisionPlano.user?.apellido1} {revisionPlano.user?.apellido2 || ""}</span></div>
              <div className="flex"><span className="text-gray-500 w-24">Email:</span><span className="font-medium">{revisionPlano.user?.email}</span></div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2 text-gray-700">
              <FileText className="h-5 w-5 text-teal-600" />
              Detalles del Plano
            </h3>
            <div className="space-y-3">
              <div className="flex"><span className="text-gray-500 w-24">Fecha:</span><span className="font-medium">{revisionPlano.Date}</span></div>
              <div className="flex"><span className="text-gray-500 w-24">Expediente:</span><span className="font-medium">{revisionPlano.NumeroExpediente}</span></div>
              <div className="flex"><span className="text-gray-500 w-24">Plano:</span><span className="font-medium">{revisionPlano.NumeroPlano}</span></div>
              {/* <div className="flex"><span className="text-gray-500 w-24">Comentario:</span><span className="font-medium">{revisionPlano.Comentario || "No especificado"}</span></div> */}
              <div className="grid grid-cols-[6rem_1fr] gap-2">
  <span className="text-gray-500 pt-1">Comentario:</span>
  <div className="font-medium leading-relaxed whitespace-pre-line break-all">
    {revisionPlano.Comentario || "No especificado"}
  </div>
</div>
            </div>
          </div>
        </div>

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
                  onClick={() => abrirArchivo(archivo.ruta)}
                  className="flex items-center p-3 rounded-md border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <File className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-sm text-gray-700 flex-1 truncate">
                    {archivo.nombre || `Documento ${index + 1}`}
                  </span>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4 bg-gray-50 rounded-md">No hay archivos adjuntos</p>
          )}
        </div>

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
            <p className="text-sm text-gray-500 mt-1">Este mensaje será enviado al solicitante como notificación.</p>

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

        <div className="text-right">
          <button
            onClick={() => navigate("/dashboard/planos")}
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
