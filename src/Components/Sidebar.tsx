// // src/Components/Sidebar.tsx
// import { NavLink, useNavigate } from 'react-router-dom';
// import { useAuth } from '../Pages/Auth/useAuth';
// import { Disclosure } from '@headlessui/react';
// import { ChevronUpIcon } from '@heroicons/react/24/solid';
// import { useSolicitudes } from '../context/SolicitudesContext'; // 👈 IMPORTANTE: usando el context

// export default function Sidebar() {
//   const { userPermissions, logout, userEmail } = useAuth();
//   const { counters } = useSolicitudes(); // 👈 Aquí escuchamos los contadores del socket
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };

//   const hasPermission = (perm: string) => userPermissions.includes(perm);

//   const linkClass = (isActive: boolean) =>
//     `block px-4 py-2 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-800' : ''}`;

//   return (
//     // <aside className="w-64 h-screen bg-gray-900 text-white flex flex-col justify-between">
//     <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col overflow-y-auto">
//       <div className="flex flex-col h-screen bg-sidebar p-4 justify-between">

//       <div>
//         {/* Usuario */}
//         <div className="p-4 text-sm font-semibold border-b border-gray-700 break-words">
//           {userEmail}
//         </div>

//         {/* Navegación */}
//         <nav className="p-4 space-y-2 text-sm">
//           {/* Inicio */}
//           <NavLink to="/dashboard" end className={({ isActive }) => linkClass(isActive)}>
//             Inicio
//           </NavLink>

//           {/* Citas */}
//           {hasPermission('ver_appointments') && (
//             <NavLink to="/dashboard/citas" className={({ isActive }) => linkClass(isActive)}>
//               Citas {counters.citas > 0 && <span className="ml-2 bg-red-600 text-white rounded-full px-2">{counters.citas}</span>}
//             </NavLink>
//           )}

//           {/* Denuncias */}
//           {hasPermission('ver_denuncia') && (
//             <NavLink to="/dashboard/denuncias" className={({ isActive }) => linkClass(isActive)}>
//               Denuncias {counters.denuncias > 0 && <span className="ml-2 bg-red-600 text-white rounded-full px-2">{counters.denuncias}</span>}
//             </NavLink>
//           )}
//                   {hasPermission('ver_concesiones') && (
//                     <NavLink to="/dashboard/concesiones" className={({ isActive }) => linkClass(isActive)}>
//                       Concesiones {counters.concesiones > 0 && <span className="ml-2 bg-red-600 text-white rounded-full px-2">{counters.concesiones}</span>}
//                     </NavLink>
//                   )}
//                   {hasPermission('ver_prorrogas') && (
//                     <NavLink to="/dashboard/prorrogas" className={({ isActive }) => linkClass(isActive)}>
//                       Prorrogas {counters.prorrogas > 0 && <span className="ml-2 bg-red-600 text-white rounded-full px-2">{counters.prorrogas}</span>}
//                     </NavLink>
//                   )}
//                   {hasPermission('ver_copia_expediente') && (
//                     <NavLink to="/dashboard/expedientes" className={({ isActive }) => linkClass(isActive)}>
//                       Expedientes {counters.expedientes > 0 && <span className="ml-2 bg-red-600 text-white rounded-full px-2">{counters.expedientes}</span>}
//                     </NavLink>
//                   )}
//                   {hasPermission('ver_precario') && (
//                     <NavLink to="/dashboard/uso-precario" className={({ isActive }) => linkClass(isActive)}>
//                       Uso Precario {counters.usoPrecario > 0 && <span className="ml-2 bg-red-600 text-white rounded-full px-2">{counters.usoPrecario}</span>}
//                     </NavLink>
//                   )}
//                   {hasPermission('ver_revisionplano') && (
//                     <NavLink to="/dashboard/planos" className={({ isActive }) => linkClass(isActive)}>
//                       Planos {counters.planos > 0 && <span className="ml-2 bg-red-600 text-white rounded-full px-2">{counters.planos}</span>}
//                     </NavLink>
//                   )}

//           {/* Usuarios */}
//           {hasPermission('ver_users') && (
//             <NavLink to="/dashboard/usuarios" className={({ isActive }) => linkClass(isActive)}>
//               Usuarios
//             </NavLink>
//           )}

//           {/* Gestión */}
//           <Disclosure>
//             {({ open }) => (
//               <>
//                 <Disclosure.Button className="w-full flex justify-between items-center px-4 py-2 rounded hover:bg-gray-700">
//                   <span>Gestión</span>
//                   <ChevronUpIcon className={`${open ? 'rotate-180 transform' : ''} h-4 w-4`} />
//                 </Disclosure.Button>
//                 {/* <Disclosure.Panel className="pl-4 mt-1 space-y-1"> */}
//                 <Disclosure.Panel className="pl-4 mt-1 space-y-1 transition-all duration-300 ease-in-out">

//                   <NavLink to="/dashboard/roles" className={({ isActive }) => linkClass(isActive)}>
//                     Roles
//                   </NavLink>
//                   <NavLink to="/dashboard/dias-citas" className={({ isActive }) => linkClass(isActive)}>
//                     Días Citas
//                   </NavLink>
//                   <NavLink to="/dashboard/lugar-denuncia" className={({ isActive }) => linkClass(isActive)}>
//                     Lugar Denuncia
//                   </NavLink>
//                   <NavLink to="/dashboard/tipo-denuncia" className={({ isActive }) => linkClass(isActive)}>
//                     Tipo Denuncia
//                   </NavLink>
//                 </Disclosure.Panel>
//               </>
//             )}
//           </Disclosure>
//         </nav>
//       </div>

//       {/* Cerrar sesión */}
//       <div className="p-4 border-t border-gray-700">
//         <button
//           onClick={handleLogout}
//           className="w-full px-4 py-2 rounded bg-red-600 hover:bg-red-700 transition-colors text-left"
//         >
//           Cerrar sesión
//         </button>
//       </div>
//       </div>
//     </aside>
//   );
// }

// src/Components/Sidebar.tsx
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../Pages/Auth/useAuth';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/24/solid';
import { useSolicitudes } from '../context/SolicitudesContext'; // 👈 IMPORTANTE: usando el context

export default function Sidebar() {
  const { userPermissions, logout, userEmail } = useAuth();
  const { counters, loadingCounters } = useSolicitudes(); // 👈 Escuchamos loadingCounters
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const hasPermission = (perm: string) => userPermissions.includes(perm);

  const linkClass = (isActive: boolean) =>
    `block px-4 py-2 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-800' : ''}`;

  const gestionPermissions = [
    'ver_roles',
    'ver_available-dates',
    'ver_tipodenuncia',
    'ver_lugardenuncia',
  ];
  
  const showGestion = gestionPermissions.some(perm => hasPermission(perm));
  

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col overflow-y-auto">
      <div className="flex flex-col h-screen bg-sidebar p-4 justify-between">
        <div>
          {/* Usuario */}
          <div className="p-4 text-sm font-semibold border-b border-gray-700 break-words">
            {userEmail}
          </div>

          {/* Navegación */}
          <nav className="p-4 space-y-2 text-sm">
            {/* Inicio */}
            <NavLink to="/dashboard" end className={({ isActive }) => linkClass(isActive)}>
              Inicio
            </NavLink>

            {/* Citas */}
            {hasPermission('ver_appointments') && (
              <NavLink to="/dashboard/citas" className={({ isActive }) => linkClass(isActive)}>
                Citas {!loadingCounters && counters.citas > 0 && <span className="ml-2 bg-red-600 text-white rounded-full px-2">{counters.citas}</span>}
              </NavLink>
            )}

            {/* Denuncias */}
            {hasPermission('ver_denuncia') && (
              <NavLink to="/dashboard/denuncias" className={({ isActive }) => linkClass(isActive)}>
                Denuncias {!loadingCounters && counters.denuncias > 0 && <span className="ml-2 bg-red-600 text-white rounded-full px-2">{counters.denuncias}</span>}
              </NavLink>
            )}

            {/* Concesiones */}
            {hasPermission('ver_concesiones') && (
              <NavLink to="/dashboard/concesiones" className={({ isActive }) => linkClass(isActive)}>
                Concesiones {!loadingCounters && counters.concesiones > 0 && <span className="ml-2 bg-red-600 text-white rounded-full px-2">{counters.concesiones}</span>}
              </NavLink>
            )}

            {/* Prorrogas */}
            {hasPermission('ver_prorrogas') && (
              <NavLink to="/dashboard/prorrogas" className={({ isActive }) => linkClass(isActive)}>
                Prorrogas {!loadingCounters && counters.prorrogas > 0 && <span className="ml-2 bg-red-600 text-white rounded-full px-2">{counters.prorrogas}</span>}
              </NavLink>
            )}

            {/* Expedientes */}
            {hasPermission('ver_copia_expediente') && (
              <NavLink to="/dashboard/expedientes" className={({ isActive }) => linkClass(isActive)}>
                Expedientes {!loadingCounters && counters.expedientes > 0 && <span className="ml-2 bg-red-600 text-white rounded-full px-2">{counters.expedientes}</span>}
              </NavLink>
            )}

            {/* Uso Precario */}
            {hasPermission('ver_precario') && (
              <NavLink to="/dashboard/uso-precario" className={({ isActive }) => linkClass(isActive)}>
                Uso Precario {!loadingCounters && counters.usoPrecario > 0 && <span className="ml-2 bg-red-600 text-white rounded-full px-2">{counters.usoPrecario}</span>}
              </NavLink>
            )}

            {/* Planos */}
            {hasPermission('ver_revisionplano') && (
              <NavLink to="/dashboard/planos" className={({ isActive }) => linkClass(isActive)}>
                Planos {!loadingCounters && counters.planos > 0 && <span className="ml-2 bg-red-600 text-white rounded-full px-2">{counters.planos}</span>}
              </NavLink>
            )}

            {/* Usuarios */}
            {hasPermission('ver_users') && (
              <NavLink to="/dashboard/usuarios" className={({ isActive }) => linkClass(isActive)}>
                Usuarios
              </NavLink>
            )}

            {/* Gestión */}
            {/* <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="w-full flex justify-between items-center px-4 py-2 rounded hover:bg-gray-700">
                    <span>Gestión</span>
                    <ChevronUpIcon className={`${open ? 'rotate-180 transform' : ''} h-4 w-4`} />
                  </Disclosure.Button>
                  <Disclosure.Panel className="pl-4 mt-1 space-y-1 transition-all duration-300 ease-in-out">
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
                    {hasPermission('ver_tipodenuncia') && (
                      <NavLink to="/dashboard/tipo-denuncia" className={({ isActive }) => linkClass(isActive)}>
                        Tipo Denuncia
                      </NavLink>
                    )}
                    {hasPermission('ver_lugardenuncia') && (
                      <NavLink to="/dashboard/lugar-denuncia" className={({ isActive }) => linkClass(isActive)}>
                        Lugar Denuncia
                      </NavLink>
                    )}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure> */}
            {showGestion && (
  <Disclosure>
    {({ open }) => (
      <>
        <Disclosure.Button className="w-full flex justify-between items-center px-4 py-2 rounded hover:bg-gray-700">
          <span>Gestión</span>
          <ChevronUpIcon className={`${open ? 'rotate-180 transform' : ''} h-4 w-4`} />
        </Disclosure.Button>
        <Disclosure.Panel className="pl-4 mt-1 space-y-1 transition-all duration-300 ease-in-out">
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
          {hasPermission('ver_tipodenuncia') && (
            <NavLink to="/dashboard/tipo-denuncia" className={({ isActive }) => linkClass(isActive)}>
              Tipo Denuncia
            </NavLink>
          )}
          {hasPermission('ver_lugardenuncia') && (
            <NavLink to="/dashboard/lugar-denuncia" className={({ isActive }) => linkClass(isActive)}>
              Lugar Denuncia
            </NavLink>
          )}
        </Disclosure.Panel>
      </>
    )}
  </Disclosure>
)}

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
      </div>
    </aside>
  );
}
