import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ApiService from '../../Components/ApiService';
import ApiRoutes from '../../Components/ApiRoutes';
import Swal from 'sweetalert2';
import { Usuario } from '../../Types/Types';
import { useAuth } from '../../Pages/Auth/useAuth';


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
    if (!id) return;

    const fetchUsuario = async () => {
      try {
        const data = await ApiService.get<Usuario>(`${ApiRoutes.usuarios}/${id}`);
        setUsuario(data);
        setRolSeleccionado(data.roles.length > 0 ? data.roles[0].id : null);
      } catch (error) {
        console.error('Error cargando usuario:', error);
        Swal.fire('Error', 'No se pudo cargar el usuario.', 'error');
      }
    };

    const fetchRoles = async () => {
      try {
        const data = await ApiService.get<{ id: number; name: string }[]>(ApiRoutes.roles);
        setRolesDisponibles(data);
      } catch (error) {
        console.error('Error cargando roles:', error);
      }
    };

    fetchUsuario();
    fetchRoles();
  }, [id]);

  const handleAsignarRol = async () => {
    if (!rolSeleccionado) {
      Swal.fire('Error', 'Debes seleccionar un rol antes de asignarlo.', 'error');
      return;
    }
  
    try {
      setLoading(true);
      await ApiService.patch(`${ApiRoutes.usuarios}/${id}/roles`, {
        roles: [rolSeleccionado]
      });
  
      const rolNombre = rolesDisponibles.find(r => r.id === rolSeleccionado)?.name || '';
      
      // Mostrar el SweetAlert y luego redireccionar
      await Swal.fire({
        title: 'Rol Asignado',
        text: `El rol "${rolNombre}" fue asignado correctamente.`,
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
  
      // ✅ Redireccionar a la tabla de usuarios (o donde quieras)
      navigate('/dashboard/usuarios'); 
  
    } catch (error) {
      console.error('Error asignando rol:', error);
      Swal.fire('Error', 'No se pudo asignar el rol.', 'error');
    } finally {
      setLoading(false);
    }
  };
  

  if (!usuario) {
    return <div className="text-center mt-10">Cargando usuario...</div>;
  }

  return (
    <div className="p-6 bg-white rounded shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Detalles del Usuario</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div><strong>ID:</strong> {usuario.id}</div>
        <div><strong>Cédula:</strong> {usuario.cedula}</div>
        <div><strong>Nombre:</strong> {usuario.nombre}</div>
        <div><strong>Apellidos:</strong> {usuario.apellido1} {usuario.apellido2}</div>
        <div><strong>Email:</strong> {usuario.email}</div>
        <div><strong>Teléfono:</strong> {usuario.telefono}</div>
        <div><strong>Estado:</strong> {usuario.isActive ? 'Activo' : 'Inactivo'}</div>
        <div><strong>Rol Actual:</strong> {usuario.roles.length > 0 ? usuario.roles[0].name : 'Sin rol asignado'}</div>
      </div>

      <div className="flex gap-4 justify-center">
        {/* <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          Asignar Rol
        </button> */}
        <button
  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
  onClick={() => {
    if (!userPermissions.includes('patch_users')) {
      return Swal.fire(
        'Permiso denegado',
        'No tienes permisos para realizar esta acción.',
        'warning'
      );
    }
    setIsModalOpen(true);
  }}
>
  Asignar Rol
</button>

        <button
          className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
          onClick={() => navigate(-1)}
        >
          Volver
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Asignar Rol</h3>

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
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
                onClick={handleAsignarRol}
                disabled={loading}
              >
                {loading ? 'Asignando...' : 'Confirmar'}
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
