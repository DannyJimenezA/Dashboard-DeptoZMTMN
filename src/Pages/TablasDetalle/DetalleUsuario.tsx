// src/Pages/DetalleUsuarioPage.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import ApiService from "../../Components/ApiService";
import ApiRoutes from "../../Components/ApiRoutes";
import { Usuario } from "../../Types/Types";
import { useAuth } from "../Auth/useAuth";
import {
  ArrowLeft,
  User,
  ShieldCheck,
  UserCheck,
  XCircle,
} from "lucide-react";

export default function DetalleUsuarioPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [rolesDisponibles, setRolesDisponibles] = useState<{ id: number; name: string }[]>([]);
  const [rolSeleccionado, setRolSeleccionado] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { userPermissions } = useAuth();

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const data = await ApiService.get<Usuario>(`${ApiRoutes.usuarios}/${id}`);
        setUsuario(data);
        setRolSeleccionado(data.roles.length > 0 ? data.roles[0].id : null);
      } catch (error) {
        console.error("Error cargando usuario:", error);
        Swal.fire("Error", "No se pudo cargar el usuario.", "error");
      }
    };

    const fetchRoles = async () => {
      try {
        const data = await ApiService.get<{ id: number; name: string }[]>(ApiRoutes.roles);
        setRolesDisponibles(data);
      } catch (error) {
        console.error("Error cargando roles:", error);
      }
    };

    if (id) {
      fetchUsuario();
      fetchRoles();
    }
  }, [id]);

  const handleAsignarRol = async () => {
    if (!rolSeleccionado) {
      Swal.fire("Error", "Debes seleccionar un rol antes de asignarlo.", "error");
      return;
    }

    try {
      setLoading(true);
      await ApiService.patch(`${ApiRoutes.usuarios}/${id}/roles`, {
        roles: [rolSeleccionado],
      });

      // const rolNombre = rolesDisponibles.find((r) => r.id === rolSeleccionado)?.name || "";

      // await Swal.fire({
      //   title: "Rol Asignado",
      //   text: `El rol "${rolNombre}" fue asignado correctamente.`,
      //   icon: "success",
      //   confirmButtonText: "Aceptar",
      // });
      const rolNombre = rolesDisponibles.find(r => r.id === rolSeleccionado)?.name ?? 'Rol asignado';

      await Swal.fire({
        title: 'Rol Asignado',
        text: `El rol "${rolNombre}" fue asignado correctamente.`,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        timer: 3000,
        showConfirmButton: false,
      });


      navigate("/dashboard/usuarios");
    } catch (error) {
      console.error("Error asignando rol:", error);
      Swal.fire("Error", "No se pudo asignar el rol.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!usuario) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando detalles del usuario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-slate-800 p-4 text-white flex justify-between items-center">
        <h2 className="text-xl font-bold">Detalles del Usuario</h2>
        <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium border bg-blue-100 text-blue-800 border-blue-200">
          {usuario.isActive ? "Activo" : "Inactivo"}
        </span>
      </div>

      <div className="p-6 space-y-6">
        {/* Info del Usuario */}

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-base font-semibold mb-4 flex items-center gap-2 text-gray-700">
            <User className="h-5 w-5 text-teal-600" />
            Información del Usuario
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <span className="text-gray-500 w-28">Nombre:</span>
              <span className="font-medium">{usuario.nombre} {usuario.apellido1} {usuario.apellido2}</span>
            </div>

            <div className="flex items-start gap-2">
              <span className="text-gray-500 w-28">Identificación:</span>
              <span className="font-medium">{usuario.cedula}</span>
            </div>

            <div className="flex items-start gap-2">
              <span className="text-gray-500 w-28">Correo:</span>
              <span className="font-medium break-words">{usuario.email}</span>
            </div>

            <div className="flex items-start gap-2">
              <span className="text-gray-500 w-28">Teléfono:</span>
              <span className="font-medium">{usuario.telefono}</span>
            </div>

            <div className="flex items-start gap-2">
              <span className="text-gray-500 w-28">Rol Actual:</span>
              <span className="font-medium">{usuario.roles[0]?.name || "Sin rol asignado"}</span>
            </div>
          </div>


        </div>



        {/* Acciones */}
        <div className="flex gap-4 justify-end">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded flex items-center gap-2"

            onClick={() => {
              if (!userPermissions.includes("editar_users")) {
                return Swal.fire("Permiso denegado", "No tienes permisos para esta acción.", "warning");
              }

              if (!userPermissions.includes("ver_roles")) {
                return Swal.fire("Permiso denegado", "No tienes permisos para ver o asignar roles.", "warning");
              }

              setIsModalOpen(true);
            }}

          >
            <ShieldCheck className="h-4 w-4" />
            Asignar Rol
          </button>

          <button
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded flex items-center gap-2"
            onClick={() => navigate("/dashboard/usuarios")}
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a la lista
          </button>
        </div>
      </div>

      {/* Modal de Asignación de Rol */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
              Asignar Rol al Usuario
            </h3>

            <div className="flex flex-col gap-2 mb-4">
              {rolesDisponibles.map((rol) => (
                <label key={rol.id} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="rol"
                    value={rol.id}
                    checked={rolSeleccionado === rol.id}
                    onChange={() => setRolSeleccionado(rol.id)}
                  />
                  {rol.name}
                </label>
              ))}
            </div>

            <div className="flex gap-4 justify-end">
              <button
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded flex items-center gap-2"
                onClick={handleAsignarRol}
                disabled={loading}
              >
                {loading ? "Asignando..." : (
                  <>
                    <UserCheck className="h-4 w-4" />
                    Confirmar
                  </>
                )}
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded flex items-center gap-2"
                onClick={() => setIsModalOpen(false)}
              >
                <XCircle className="h-4 w-4" />
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
