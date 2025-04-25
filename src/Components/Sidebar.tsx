import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../Pages/Auth/useAuth';
import { ROUTES_WITH_PERMISSIONS } from '../Components/permissions';

export default function Sidebar() {
  const { userPermissions, logout, userEmail } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const availableRoutes = ROUTES_WITH_PERMISSIONS.filter(route =>
    userPermissions.includes(route.requiredPermission)
  );

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white flex flex-col justify-between">
      {/* Top - Mostrar correo */}
      <div>
        <div className="p-4 text-lg font-bold border-b border-gray-700 break-words">
         {userEmail}
        </div>
        <nav className="p-4 space-y-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `block px-4 py-2 rounded hover:bg-gray-700 ${
                isActive ? 'bg-gray-800' : ''
              }`
            }
          >
            Inicio
          </NavLink>

          {availableRoutes.map(({ path, name }) => (
            <NavLink
              key={path}
              to={`/dashboard/${path}`}
              className={({ isActive }) =>
                `block px-4 py-2 rounded hover:bg-gray-700 ${
                  isActive ? 'bg-gray-800' : ''
                }`
              }
            >
              {name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom - Logout */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 rounded bg-red-600 hover:bg-red-700 transition-colors text-left"
        >
         Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
