import { useEffect, useState } from 'react';
import { FaTrash, FaPlus } from 'react-icons/fa';
import { Role } from '../../Types/Types';
import ApiRoutes from '../../Components/ApiRoutes';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Pages/Auth/useAuth';
import Paginacion from '../../Components/Paginacion';

import { io, Socket } from 'socket.io-client';
import { FaScrewdriverWrench } from "react-icons/fa6";

export default function RolesTable() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchText, setSearchText] = useState('');
 

  const navigate = useNavigate();
  const { isAuthenticated, userPermissions } = useAuth();

  useEffect(() => {
    let socket: Socket | null = null;

    if (!isAuthenticated || !userPermissions.includes('ver_roles')) {
      navigate('/unauthorized');
      return;
    }

    const cargarRoles = async () => {
      setLoading(true);
      try {
        const response = await fetch(ApiRoutes.roles, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (!response.ok) throw new Error('Error al obtener roles.');
        setRoles(await response.json());
      } catch (error) {
        setError('Error al cargar los roles.');
      } finally {
        setLoading(false);
      }
    };

    cargarRoles();

    // 👉 Socket.io para nuevos roles
    socket = io(ApiRoutes.urlBase, {
      transports: ['websocket'],
      auth: {
        token: localStorage.getItem('token'),
      },
    });

    socket.on('nuevo-rol', (nuevoRol: Role) => {
      console.log('Nuevo rol recibido via socket:', nuevoRol);
      setRoles((prevRoles) => {
        const existe = prevRoles.some(r => r.id === nuevoRol.id);
        if (existe) return prevRoles; // evita duplicados
        return [...prevRoles, nuevoRol];
      });
    });

    return () => {
      socket?.disconnect();
    };
  }, [isAuthenticated, userPermissions, navigate]);



 


  const manejarEliminarRol = async (id: number) => {
    const confirmacion = await Swal.fire({
      title: '¿Eliminar rol?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545',
    });

    if (confirmacion.isConfirmed) {
      try {
        const response = await fetch(`${ApiRoutes.roles}/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) throw new Error(`Error eliminando el rol: ${response.status}`);

        Swal.fire('¡Eliminado!', 'El rol fue eliminado correctamente.', 'success');
        setRoles((prev) => prev.filter((rol) => rol.id !== id));
      } catch (error) {
        console.error('Error eliminando el rol:', error);
        Swal.fire('Error', 'Ocurrió un error al eliminar el rol.', 'error');
      }
    }
  };

  const rolesFiltrados = roles.filter((rol) =>
    rol.name.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) return <p className="text-center">Cargando roles...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  const indexFinal = currentPage * itemsPerPage;
  const indexInicio = indexFinal - itemsPerPage;
  const rolesActuales = rolesFiltrados.slice(indexInicio, indexFinal);
  const totalPaginas = Math.ceil(rolesFiltrados.length / itemsPerPage);

  return (
   
<div className="flex flex-col w-full h-full p-4">
  <h2 className="text-2xl font-bold mb-4 text-center">Lista de Roles</h2>

  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4">
    {/* Filtro de búsqueda */}
    <div className="flex items-center space-x-2">
      <input
        type="text"
        placeholder="Buscar por nombre de rol"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="border border-gray-300 rounded px-2 py-1 text-sm w-60"
      />
    </div>

    {/* Botón de crear nuevo rol */}
    <button
  onClick={() => navigate('/dashboard/crear-rol')}
  className="px-4 py-2 bg-blue-600 text-white rounded flex items-center self-end hover:bg-blue-700"
>
  <FaPlus className="mr-2" /> Crear Nuevo Rol
</button>

  </div>


  <div className="flex-1 overflow-auto bg-white shadow-lg rounded-lg max-h-[70vh]">
    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
      <thead className="bg-gray-50 sticky top-0 z-10">
        <tr className="bg-gray-200">
          <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Nombre del Rol</th>
          <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Descripción</th>
          <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Acciones</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {rolesActuales.map((rol) => (
          <tr key={rol.id}>
            <td className="px-4 py-2">{rol.name}</td>
            <td className="px-4 py-2">{rol.description || 'Sin descripción'}</td>
            <td className="px-4 py-2 space-x-2">
              <button className="text-blue-600 hover:text-blue-800"  onClick={() => navigate(`/dashboard/asignar-permisos/${rol.id}`)}>
              <FaScrewdriverWrench />
              </button>
              <button onClick={() => manejarEliminarRol(rol.id)}
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
