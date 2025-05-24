// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import type { CopiaExpediente } from "../../Types/Types";
// import ApiService from "../../Components/ApiService";
// import ApiRoutes from "../../Components/ApiRoutes";
// import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";
// import {
//   ArrowLeft,
//   FileText,
//   User,
//   UserCheck,
//   X,
//   CheckCircle,
//   XCircle,
// } from "lucide-react";
// import { useAuth } from "../Auth/AuthContext";

// const MySwal = withReactContent(Swal);

// export default function DetalleExpedientePage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//     const { userPermissions } = useAuth();
//   const [expediente, setExpediente] = useState<CopiaExpediente | null>(null);
//   const [mensaje, setMensaje] = useState("");
//   const [loading, setLoading] = useState(true);
//     const canEditExpediente = userPermissions.includes('editar_copia_expediente');

// function formatearFecha(fecha: string | String): string {
//   const fechaStr = fecha.toString(); // 🔁 Convertimos a string plano
//   const [year, month, day] = fechaStr.split('-');
//   return `${day}/${month}/${year}`;
// }


//   useEffect(() => {
//     const fetchExpediente = async () => {
//       setLoading(true);
//       try {
//         const data = await ApiService.get<CopiaExpediente>(`${ApiRoutes.expedientes}/${id}`);
//         setExpediente(data);
//       } catch {
//         Swal.fire({
//           title: "Error",
//           text: "Error al cargar el expediente",
//           icon: "error",
//           confirmButtonColor: "#00a884",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchExpediente();
//   }, [id]);

//   const cambiarEstado = async (nuevoEstado: "Aprobada" | "Denegada") => {
//     if (!mensaje.trim()) {
//       Swal.fire({
//         title: "Mensaje requerido",
//         text: "Escribe un mensaje antes de continuar.",
//         icon: "warning",
//         confirmButtonColor: "#00a884",
//       });
//       return;
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
//     });

//     if (!result.isConfirmed || !expediente) return;

//     try {
//       const res = await fetch(`${ApiRoutes.urlBase}/expedientes/${expediente.idExpediente}/status`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify({
//           status: nuevoEstado,
//           message: mensaje,
//         }),
//       });

//       if (!res.ok) throw new Error("Error al actualizar el expediente");

//       Swal.fire({
//         title: "¡Éxito!",
//         text: `Solicitud de expediente ${nuevoEstado.toLowerCase()} correctamente.`,
//         icon: "success",
//         confirmButtonColor: "#00a884",
//             timer: 3000,
//       showConfirmButton: false,
//       });
//       navigate("/dashboard/expedientes");
//     } catch (err) {
//       console.error(err);
//       Swal.fire({
//         title: "Error",
//         text: "Hubo un problema al actualizar el expediente.",
//         icon: "error",
//         confirmButtonColor: "#00a884",
//       });
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     const base = "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border";
//     switch (status) {
//       case "Pendiente":
//         return <span className={`${base} bg-amber-100 text-amber-800 border-amber-200`}>Pendiente</span>;
//       case "Aprobada":
//         return <span className={`${base} bg-teal-100 text-teal-800 border-teal-200`}>Aprobada</span>;
//       case "Denegada":
//         return <span className={`${base} bg-red-100 text-red-800 border-red-200`}>Denegada</span>;
//       default:
//         return <span className={`${base} bg-gray-100 text-gray-800 border-gray-200`}>{status}</span>;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
//           <p className="text-gray-600">Cargando detalles del expediente...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!expediente) {
//     return (
//       <div className="max-w-2xl mx-auto mt-8 bg-white shadow-lg rounded-lg p-6 text-center">
//         <div className="py-8">
//           <div className="text-red-500 text-5xl mb-4">⚠️</div>
//           <h2 className="text-2xl font-bold mb-2">Expediente no encontrado</h2>
//           <p className="text-gray-600 mb-6">No se pudo encontrar la información de este expediente.</p>
//           <button
//             onClick={() => navigate("/dashboard/expedientes")}
//             className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center gap-2 mx-auto"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             Volver a la lista
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const isEditable = expediente.status === "Pendiente";

//   return (
//     <div className="max-w-6xl mx-auto mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
//       <div className="bg-slate-800 p-4 text-white flex justify-between items-center">
//         <h2 className="text-xl font-bold">Detalles de la Solicitud de Expediente</h2>
//         {getStatusBadge(expediente.status || "Pendiente")}
//       </div>

//       <div className="p-6 space-y-6">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Info del solicitante */}
//           <div className="bg-white border border-gray-200 rounded-lg p-4">
//             <h3 className="text-base font-semibold mb-4 flex items-center gap-2 text-gray-700">
//               <User className="h-5 w-5 text-teal-600" />
//               Información del Solicitante
//             </h3>
//             <div className="space-y-3">
//               <div className="flex">
//                 <span className="text-gray-500 w-28">Nombre:</span>
//                 <span className="font-medium">{expediente.nombreSolicitante}</span>
//               </div>

//               <div className="flex">
//                 <span className="text-gray-500 w-28">Apellidos:</span>
//                 <span className="font-medium">{expediente.user?.apellido1 } {expediente.user?.apellido2 } </span>
//               </div>

//               <div className="flex items-center">
//                 <span className="text-gray-500 w-28">Teléfono:</span>
//                 <span className="font-medium flex items-center">
//                   {expediente.telefonoSolicitante}
//                 </span>
//               </div>
//               <div className="flex items-center">
//                 <span className="text-gray-500 w-28">Correo:</span>
//                 <span className="font-medium flex items-center">
//                   {expediente.user?.email}
//                 </span>
//               </div>
//               <div className="flex items-center">
//                 <span className="text-gray-500 w-28">Medio de notificación:</span>
//                 <span className="font-medium flex items-center">

//                   {/* {expediente.medioNotificacion} */}
//                   {expediente.medioNotificacion.charAt(0).toUpperCase() + expediente.medioNotificacion.slice(1).toLowerCase()}

//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Detalles del expediente */}
//           <div className="bg-white border border-gray-200 rounded-lg p-4">
//             <h3 className="text-base font-semibold mb-4 flex items-center gap-2 text-gray-700">
//               <FileText className="h-5 w-5 text-teal-600" />
//               Detalles del Expediente
//             </h3>
//             <div className="space-y-3">
//               {/* <div className="flex items-center">
//                 <span className="text-gray-500 w-28">Fecha:</span>
//                 <span className="font-medium flex items-center">
//                   {expediente.Date}
//                 </span>
//               </div> */}
//                             <div className="flex items-center">
//   <span className="text-gray-500 w-24">Fecha:</span>
//   <span className="font-medium flex items-center">
//     {expediente.Date ? formatearFecha(expediente.Date) : "No disponible"}
//   </span>
// </div>
//               <div className="flex">
//                 <span className="text-gray-500 w-28">Número:</span>
//                 <span className="font-medium">{expediente.numeroExpediente}</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="text-gray-500 w-28">Certificada:</span>
//                 <span className="font-medium flex items-center">
//                   {expediente.copiaCertificada ? (
//                     <>
//                       <CheckCircle className="h-4 w-4 mr-1 text-teal-600" /> Sí
//                     </>
//                   ) : (
//                     <>
//                       <XCircle className="h-4 w-4 mr-1 text-gray-500" /> No
//                     </>
//                   )}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Formulario de respuesta */}
//         {isEditable && canEditExpediente && (
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
//             <p className="text-sm text-gray-500 mt-1">Este mensaje será enviado al solicitante como notificación.</p>

//             <div className="flex flex-col sm:flex-row gap-3 mt-6">
//               <button
//                 onClick={() => cambiarEstado("Aprobada")}
//                 className="flex-1 bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 flex items-center justify-center gap-2"
//               >
//                 <UserCheck className="h-5 w-5" />
//                 Aprobar Solicitud
//               </button>
//               <button
//                 onClick={() => cambiarEstado("Denegada")}
//                 className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center justify-center gap-2"
//               >
//                 <X className="h-5 w-5" />
//                 Denegar Solicitud
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Botón volver */}
//         <div className="text-right">
//           <button
//             onClick={() => navigate("/dashboard/expedientes")}
//             className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center gap-2 ml-auto"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             Volver a la lista
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { CopiaExpediente } from "../../Types/Types";
import ApiService from "../../Components/ApiService";
import ApiRoutes from "../../Components/ApiRoutes";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  ArrowLeft,
  FileText,
  User,
  UserCheck,
  X,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useAuth } from "../Auth/AuthContext";

const MySwal = withReactContent(Swal);

export default function DetalleExpedientePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userPermissions } = useAuth();
  const [expediente, setExpediente] = useState<CopiaExpediente | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const canEditExpediente = userPermissions.includes('editar_copia_expediente');

  function formatearFecha(fecha: string | String): string {
    const fechaStr = fecha.toString();
    const [year, month, day] = fechaStr.split('-');
    return `${day}/${month}/${year}`;
  }

  useEffect(() => {
    const fetchExpediente = async () => {
      setLoading(true);
      try {
        const data = await ApiService.get<CopiaExpediente>(`${ApiRoutes.expedientes}/${id}`);
        setExpediente(data);
      } catch {
        Swal.fire({
          title: "Error",
          text: "Error al cargar el expediente",
          icon: "error",
          confirmButtonColor: "#00a884",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchExpediente();
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

    if (!result.isConfirmed || !expediente) return;

    try {
      const res = await fetch(`${ApiRoutes.urlBase}/expedientes/${expediente.idExpediente}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          status: nuevoEstado,
          message: mensaje,
        }),
      });

      if (!res.ok) throw new Error("Error al actualizar el expediente");

      Swal.fire({
        title: "¡Éxito!",
        text: `Solicitud de expediente ${nuevoEstado.toLowerCase()} correctamente.`,
        icon: "success",
        confirmButtonColor: "#00a884",
        timer: 3000,
        showConfirmButton: false,
      });
      navigate("/dashboard/expedientes");
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al actualizar el expediente.",
        icon: "error",
        confirmButtonColor: "#00a884",
      });
    }
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
          <p className="text-gray-600">Cargando detalles del expediente...</p>
        </div>
      </div>
    );
  }

  if (!expediente) {
    return (
      <div className="max-w-2xl mx-auto mt-8 bg-white shadow-lg rounded-lg p-6 text-center">
        <div className="py-8">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Expediente no encontrado</h2>
          <p className="text-gray-600 mb-6">No se pudo encontrar la información de este expediente.</p>
          <button
            onClick={() => navigate("/dashboard/expedientes")}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  const isEditable = expediente.status === "Pendiente";

  return (
    <div className="max-w-6xl mx-auto mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-slate-800 p-4 text-white flex justify-between items-center">
        <h2 className="text-xl font-bold">Detalles de la Solicitud de Expediente</h2>
        {getStatusBadge(expediente.status || "Pendiente")}
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2 text-gray-700">
              <User className="h-5 w-5 text-teal-600" />
              Información del Solicitante
            </h3>
            <div className="space-y-2">
              {[
                { label: "Cédula", value: expediente.user?.cedula },
                { label: "Nombre", value: `${expediente.user?.nombre} ${expediente.user?.apellido1} ${expediente.user?.apellido2}` },
                { label: "Correo", value: expediente.user?.email },
                { label: "Teléfono", value: expediente.telefonoSolicitante },
                { label: "Medio de notificación", value: expediente.medioNotificacion.charAt(0).toUpperCase() + expediente.medioNotificacion.slice(1).toLowerCase() },
              ].map(({ label, value }) => (
                <div key={label} className="grid grid-cols-[9rem_1fr] items-start gap-2">
                  <span className="text-gray-500 pt-1">{label}:</span>
                  <span className="font-medium break-words whitespace-pre-wrap">{value || "No disponible"}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2 text-gray-700">
              <FileText className="h-5 w-5 text-teal-600" />
              Detalles del Expediente
            </h3>
            <div className="space-y-2">
              <div className="grid grid-cols-[9rem_1fr] items-start gap-2">
                <span className="text-gray-500 pt-1">Fecha:</span>
                <span className="font-medium break-words whitespace-pre-wrap">{expediente.Date ? formatearFecha(expediente.Date) : "No disponible"}</span>
              </div>
              <div className="grid grid-cols-[9rem_1fr] items-start gap-2">
                <span className="text-gray-500 pt-1">Número:</span>
                <span className="font-medium break-words whitespace-pre-wrap">{expediente.numeroExpediente || "No disponible"}</span>
              </div>
              <div className="grid grid-cols-[9rem_1fr] items-start gap-2">
                <span className="text-gray-500 pt-1">Certificada:</span>
                <span className="font-medium break-words whitespace-pre-wrap flex items-center">
                  {expediente.copiaCertificada ? (
                    <><CheckCircle className="h-4 w-4 mr-1 text-teal-600" /> Sí</>
                  ) : (
                    <><XCircle className="h-4 w-4 mr-1 text-gray-500" /> No</>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {isEditable && canEditExpediente && (
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
              <button
                onClick={() => cambiarEstado("Aprobada")}
                className="flex-1 bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 flex items-center justify-center gap-2"
              >
                <UserCheck className="h-5 w-5" />
                Aprobar Solicitud
              </button>
              <button
                onClick={() => cambiarEstado("Denegada")}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center justify-center gap-2"
              >
                <X className="h-5 w-5" />
                Denegar Solicitud
              </button>
            </div>
          </div>
        )}

        <div className="text-right">
          <button
            onClick={() => navigate("/dashboard/expedientes")}
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