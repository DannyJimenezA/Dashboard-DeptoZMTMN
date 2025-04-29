import { useState, useEffect } from 'react';
import { Usuario } from '../../Types/Types';
import Paginacion from '../../Components/Paginacion';
import SearchFilterBar from '../../Components/SearchFilterBar';
import { FaEye, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ApiRoutes from '../../Components/ApiRoutes';
import Swal from 'sweetalert2';
import { useAuth } from '../../Pages/Auth/useAuth';
import { io, Socket } from 'socket.io-client'; // 👈 AÑADIMOS socket.io-client
import ApiService from '../../Components/ApiService'; // 👈 (opcional) si prefieres usar tu ApiService

export default function UsersTable() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchText, setSearchText] = useState('');
  const [searchBy, setSearchBy] = useState('nombre');

  const navigate = useNavigate();
  const { isAuthenticated, userPermissions } = useAuth();

  useEffect(() => {
    let socket: Socket | null = null;

    if (!isAuthenticated || !userPermissions.includes('ver_users')) {
      navigate('/unauthorized');
      return;
    }

    const obtenerUsuarios = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(ApiRoutes.usuarios, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setUsuarios(data);
      } catch (err) {
        console.error('Error al obtener los usuarios:', err);
        setError('Error al cargar los usuarios.');
      } finally {
        setLoading(false);
      }
    };

    obtenerUsuarios();

    // 🚀 Conexión WebSocket
    socket = io(ApiRoutes.urlBase, {
      transports: ['websocket'],
      auth: { token: localStorage.getItem('token') },
    });

    // 🎯 Escuchar el evento "nuevo-usuario"
    socket.on('nuevo-usuario', async (nuevo: { id: number }) => {
      console.log('Nuevo usuario recibido:', nuevo);

      try {
        const nuevoUsuario = await ApiService.get<Usuario>(`${ApiRoutes.usuarios}/${nuevo.id}`);
        setUsuarios(prev => {
          const yaExiste = prev.some(u => u.id === nuevoUsuario.id);
          if (yaExiste) return prev;
          return [nuevoUsuario, ...prev];
        });
      } catch (error) {
        console.error('Error al traer el usuario completo:', error);
      }
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [isAuthenticated, userPermissions, navigate]);

  const eliminarUsuario = async (id: number) => {
    const confirmacion = await Swal.fire({
      title: '¿Eliminar usuario?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545',
    });

    if (!confirmacion.isConfirmed) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${ApiRoutes.usuarios}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Error al eliminar el usuario');

      Swal.fire('¡Eliminado!', 'El usuario fue eliminado correctamente.', 'success');
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error');
    }
  };

  const usuariosFiltrados = usuarios.filter((usuario) =>
    searchBy === 'nombre'
      ? usuario.nombre.toLowerCase().includes(searchText.toLowerCase())
      : searchBy === 'cedula'
      ? usuario.cedula.toLowerCase().includes(searchText.toLowerCase())
      : usuario.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const indexFinal = currentPage * itemsPerPage;
  const indexInicio = indexFinal - itemsPerPage;
  const usuariosActuales = usuariosFiltrados.slice(indexInicio, indexFinal);
  const totalPaginas = Math.ceil(usuariosFiltrados.length / itemsPerPage);

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col w-full h-full p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Lista de Usuarios</h2>

      <SearchFilterBar
        searchPlaceholder="Buscar por nombre, cédula o correo..."
        searchText={searchText}
        onSearchTextChange={setSearchText}
        searchByOptions={[
          { value: 'nombre', label: 'Nombre' },
          { value: 'cedula', label: 'Cédula' },
          { value: 'email', label: 'Correo' },
        ]}
        selectedSearchBy={searchBy}
        onSearchByChange={setSearchBy}
      />

      <div className="flex-1 overflow-auto bg-white shadow-lg rounded-lg max-h-[70vh]">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className='bg-gray-200'>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Nombre</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Apellidos</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Cédula</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Correo</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Rol</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {usuariosActuales.map((usuario) => (
              <tr key={usuario.id}>
                <td className="px-4 py-2">{usuario.nombre}</td>
                <td className="px-4 py-2">{usuario.apellido1} {usuario.apellido2}</td>
                <td className="px-4 py-2">{usuario.cedula}</td>
                <td className="px-4 py-2">{usuario.email}</td>
                <td className="px-4 py-2">
                  {usuario.roles && usuario.roles.length > 0
                    ? usuario.roles.map((rol) => rol.name).join(', ')
                    : 'Sin rol'}
                </td>
                <td className="px-4 py-2 space-x-2">
                <button className="text-blue-600 hover:text-blue-800"  onClick={() => navigate(`/dashboard/usuario/${usuario.id}`)}>
                    <FaEye />
                  </button>
                  <button  onClick={() => eliminarUsuario(usuario.id)}
                     className="text-red-600 hover:text-red-800">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Paginacion
        currentPage={currentPage}
        totalPages={totalPaginas}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />
    </div>
  );
}
