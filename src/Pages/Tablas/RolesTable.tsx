import { useEffect, useState } from 'react';
import { FaTrash, FaPlus } from 'react-icons/fa';
import { Role } from '../../Types/Types';
import ApiRoutes from '../../Components/ApiRoutes';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Pages/Auth/useAuth';
import Paginacion from '../../Components/Paginacion';
import SearchFilterBar from '../../Components/SearchFilterBar';

export default function RolesTable() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingRole, setIsCreatingRole] = useState<boolean>(false);
  const [newRoleName, setNewRoleName] = useState<string>('');
  const [newRoleDescription, setNewRoleDescription] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchText, setSearchText] = useState('');
  const [searchBy, setSearchBy] = useState('nombre');


  const navigate = useNavigate();
  const { isAuthenticated, userPermissions } = useAuth();

  useEffect(() => {
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
  }, [isAuthenticated, userPermissions, navigate]);

  const abrirModalCrearRol = () => {
    setIsCreatingRole(true);
    setNewRoleName('');
    setNewRoleDescription('');
  };

  const cerrarModalCrearRol = () => {
    setIsCreatingRole(false);
  };

  const manejarCrearRol = async () => {
    if (!newRoleName.trim() || !newRoleDescription.trim()) {
      Swal.fire('Campos requeridos', 'Por favor, ingresa el nombre y la descripción del rol.', 'warning');
      return;
    }

    try {
      const response = await fetch(ApiRoutes.roles, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name: newRoleName, description: newRoleDescription }),
      });

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }

      const nuevoRol = await response.json();
      setRoles([...roles, nuevoRol]);
      cerrarModalCrearRol();
      Swal.fire('Éxito', 'Rol creado correctamente.', 'success');
    } catch (error) {
      console.error('Error creando el rol:', error);
      Swal.fire('Error', 'Ocurrió un error al crear el rol.', 'error');
    }
  };

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
    
    <div className="flex flex-col h-screen p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Lista de Roles</h2>

      <SearchFilterBar
        searchPlaceholder="Buscar por nombre"
        searchText={searchText}
        onSearchTextChange={setSearchText}
        searchByOptions={[
          { value: 'nombre', label: 'Nombre' },
        ]}
        selectedSearchBy={searchBy}
        onSearchByChange={setSearchBy}
      />

      <button onClick={abrirModalCrearRol} className="mb-4 px-4 py-2 bg-blue-600 text-white rounded flex items-center">
        <FaPlus className="mr-2" /> Crear Nuevo Rol
      </button>

      <div className="flex-1 overflow-auto bg-white shadow-lg rounded-lg max-h-[70vh]">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          <thead >
            <tr className="bg-gray-200">
              {/* <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">ID</th> */}
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Nombre del Rol</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Descripción</th>
              <th className="px-4 py-2 text-left text-sm font-bold text-black-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rolesActuales.map((rol) => (
              <tr key={rol.id} className="hover:bg-gray-100">
                {/* <td className="py-2 px-4 border-b">{rol.id}</td> */}
                <td className="py-2 px-4 border-b">{rol.name}</td>
                <td className="py-2 px-4 border-b">{rol.description || 'Sin descripción'}</td>
                <td className="py-2 px-4 border-b space-x-2">
                  <button className="button-edit" onClick={() => console.log('Asignar permisos', rol)}>
                    🛠 Asignar Permisos
                  </button>
                  <button className="button-delete" onClick={() => manejarEliminarRol(rol.id)}>
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

      {isCreatingRole && (
        <div className="modal-overlay">
          <div className="modal-container">
            <button className="absolute top-2 right-2 text-gray-500" onClick={cerrarModalCrearRol}>
              ✖
            </button>
            <h3 className="text-xl font-bold mb-4 text-center">Crear Nuevo Rol</h3>
            <input
              type="text"
              className="w-full p-2 border rounded mb-4"
              placeholder="Nombre del rol"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
            />
            <textarea
              className="w-full p-2 border rounded mb-4"
              placeholder="Descripción del rol"
              value={newRoleDescription}
              onChange={(e) => setNewRoleDescription(e.target.value)}
              rows={3}
            />
            <button onClick={manejarCrearRol} className="w-full bg-blue-600 text-white py-2 rounded">
              Guardar
            </button>
          </div>
        </div>
      )}
    </div>
    
  );
}
