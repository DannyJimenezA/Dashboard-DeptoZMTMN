// src/Components/Sidebar.tsx
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../Pages/Auth/useAuth';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/24/solid';

export default function Sidebar() {
  const { userPermissions, logout, userEmail } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const hasPermission = (perm: string) => userPermissions.includes(perm);

  const linkClass = (isActive: boolean) =>
    `block px-4 py-2 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-800' : ''}`;

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white flex flex-col justify-between">
      <div>
        {/* Usuario */}
        <div className="p-4 text-sm font-semibold border-b border-gray-700 break-words">
          {userEmail}
        </div>

        {/* Navegación */}
        <nav className="p-4 space-y-2 text-sm">
          {/* Inicio */}
          <NavLink to="/dashboard" className={({ isActive }) => linkClass(isActive)}>
            Inicio
          </NavLink>

          {/* Citas */}
          {hasPermission('ver_appointments') && (
            <NavLink to="/dashboard/citas" className={({ isActive }) => linkClass(isActive)}>
              Citas
            </NavLink>
          )}

            {/* Denuncias */}
            {hasPermission('ver_denuncia') && (
              <NavLink to="/dashboard/denuncias" className={({ isActive }) => linkClass(isActive)}>
                Denuncias
              </NavLink>
            )}
          {/* Solicitudes */}
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="w-full flex justify-between items-center px-4 py-2 rounded hover:bg-gray-700">
                  <span>Solicitudes</span>
                  <ChevronUpIcon className={`${open ? 'rotate-180 transform' : ''} h-4 w-4`} />
                </Disclosure.Button>
                <Disclosure.Panel className="pl-4 mt-1 space-y-1">
                  {hasPermission('ver_concesiones') && (
                    <NavLink to="/dashboard/concesiones" className={({ isActive }) => linkClass(isActive)}>
                      Concesiones
                    </NavLink>
                  )}
                  {hasPermission('ver_prorrogas') && (
                    <NavLink to="/dashboard/prorrogas" className={({ isActive }) => linkClass(isActive)}>
                      Prórrogas
                    </NavLink>
                  )}
                  {hasPermission('ver_copia_expediente') && (
                    <NavLink to="/dashboard/expedientes" className={({ isActive }) => linkClass(isActive)}>
                      Expedientes
                    </NavLink>
                  )}
                  {hasPermission('ver_precario') && (
                    <NavLink to="/dashboard/uso-precario" className={({ isActive }) => linkClass(isActive)}>
                      Uso Precario
                    </NavLink>
                  )}
                  {hasPermission('ver_revisionplano') && (
                    <NavLink to="/dashboard/planos" className={({ isActive }) => linkClass(isActive)}>
                      Planos
                    </NavLink>
                  )}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>


          {/* Usuarios */}
          {hasPermission('ver_users') && (
            <NavLink to="/dashboard/usuarios" className={({ isActive }) => linkClass(isActive)}>
              Usuarios
            </NavLink>
          )}

          {/* Gestión */}
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="w-full flex justify-between items-center px-4 py-2 rounded hover:bg-gray-700">
                  <span>Gestión</span>
                  <ChevronUpIcon className={`${open ? 'rotate-180 transform' : ''} h-4 w-4`} />
                </Disclosure.Button>
                <Disclosure.Panel className="pl-4 mt-1 space-y-1">
                  {hasPermission('ver_roles') && (
                    <NavLink to="/dashboard/roles" className={({ isActive }) => linkClass(isActive)}>
                      Roles
                    </NavLink>
                  )}
                  {hasPermission('ver_available-dates') && (
  <NavLink to="/dashboard/dias-citas" className={({ isActive }) => linkClass(isActive)}>
    Días Citas
  </NavLink>
)}

                  {hasPermission('ver_lugardenuncia') && (
                    <NavLink to="/dashboard/lugar-denuncia" className={({ isActive }) => linkClass(isActive)}>
                      Lugar Denuncia
                    </NavLink>
                  )}
                  {hasPermission('ver_tipodenuncia') && (
                    <NavLink to="/dashboard/tipo-denuncia" className={({ isActive }) => linkClass(isActive)}>
                      Tipo Denuncia
                    </NavLink>
                  )}

                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </nav>
      </div>

      {/* Cerrar sesión */}
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
