// // // src/Components/Sidebar.tsx
// // import { NavLink, useNavigate } from 'react-router-dom';
// // import { useAuth } from '../Pages/Auth/useAuth';
// // import { Disclosure } from '@headlessui/react';
// // import { ChevronUpIcon } from '@heroicons/react/24/solid';

// // export default function Sidebar() {
// //   const { userPermissions, logout, userEmail } = useAuth();
// //   const navigate = useNavigate();

// //   const handleLogout = () => {
// //     logout();
// //     navigate('/');
// //   };

// //   const hasPermission = (perm: string) => userPermissions.includes(perm);

// //   const linkClass = (isActive: boolean) =>
// //     `block px-4 py-2 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-800' : ''}`;

// //   return (
// //     <aside className="w-64 h-screen bg-gray-900 text-white flex flex-col justify-between">
// //       <div>
// //         {/* Usuario */}
// //         <div className="p-4 text-sm font-semibold border-b border-gray-700 break-words">
// //           {userEmail}
// //         </div>

// //         {/* Navegación */}
// //         <nav className="p-4 space-y-2 text-sm">
// //           {/* Inicio */}
// //           <NavLink to="/dashboard" className={({ isActive }) => linkClass(isActive)}>
// //             Inicio
// //           </NavLink>

// //           {/* Citas */}
// //           {hasPermission('ver_appointments') && (
// //             <NavLink to="/dashboard/citas" className={({ isActive }) => linkClass(isActive)}>
// //               Citas
// //             </NavLink>
// //           )}

// //             {/* Denuncias */}
// //             {hasPermission('ver_denuncia') && (
// //               <NavLink to="/dashboard/denuncias" className={({ isActive }) => linkClass(isActive)}>
// //                 Denuncias
// //               </NavLink>
// //             )}
// //           {/* Solicitudes */}
// //           <Disclosure>
// //             {({ open }) => (
// //               <>
// //                 <Disclosure.Button className="w-full flex justify-between items-center px-4 py-2 rounded hover:bg-gray-700">
// //                   <span>Solicitudes</span>
// //                   <ChevronUpIcon className={`${open ? 'rotate-180 transform' : ''} h-4 w-4`} />
// //                 </Disclosure.Button>
// //                 <Disclosure.Panel className="pl-4 mt-1 space-y-1">
// //                   {hasPermission('ver_concesiones') && (
// //                     <NavLink to="/dashboard/concesiones" className={({ isActive }) => linkClass(isActive)}>
// //                       Concesiones
// //                     </NavLink>
// //                   )}
// //                   {hasPermission('ver_prorrogas') && (
// //                     <NavLink to="/dashboard/prorrogas" className={({ isActive }) => linkClass(isActive)}>
// //                       Prórrogas
// //                     </NavLink>
// //                   )}
// //                   {hasPermission('ver_copia_expediente') && (
// //                     <NavLink to="/dashboard/expedientes" className={({ isActive }) => linkClass(isActive)}>
// //                       Expedientes
// //                     </NavLink>
// //                   )}
// //                   {hasPermission('ver_precario') && (
// //                     <NavLink to="/dashboard/uso-precario" className={({ isActive }) => linkClass(isActive)}>
// //                       Uso Precario
// //                     </NavLink>
// //                   )}
// //                   {hasPermission('ver_revisionplano') && (
// //                     <NavLink to="/dashboard/planos" className={({ isActive }) => linkClass(isActive)}>
// //                       Planos
// //                     </NavLink>
// //                   )}
// //                 </Disclosure.Panel>
// //               </>
// //             )}
// //           </Disclosure>


// //           {/* Usuarios */}
// //           {hasPermission('ver_users') && (
// //             <NavLink to="/dashboard/usuarios" className={({ isActive }) => linkClass(isActive)}>
// //               Usuarios
// //             </NavLink>
// //           )}

// //           {/* Gestión */}
// //           <Disclosure>
// //             {({ open }) => (
// //               <>
// //                 <Disclosure.Button className="w-full flex justify-between items-center px-4 py-2 rounded hover:bg-gray-700">
// //                   <span>Gestión</span>
// //                   <ChevronUpIcon className={`${open ? 'rotate-180 transform' : ''} h-4 w-4`} />
// //                 </Disclosure.Button>
// //                 <Disclosure.Panel className="pl-4 mt-1 space-y-1">
// //                   {hasPermission('ver_roles') && (
// //                     <NavLink to="/dashboard/roles" className={({ isActive }) => linkClass(isActive)}>
// //                       Roles
// //                     </NavLink>
// //                   )}
// //                   {hasPermission('ver_available-dates') && (
// //   <NavLink to="/dashboard/dias-citas" className={({ isActive }) => linkClass(isActive)}>
// //     Días Citas
// //   </NavLink>
// // )}

// //                   {hasPermission('ver_lugardenuncia') && (
// //                     <NavLink to="/dashboard/lugar-denuncia" className={({ isActive }) => linkClass(isActive)}>
// //                       Lugar Denuncia
// //                     </NavLink>
// //                   )}
// //                   {hasPermission('ver_tipodenuncia') && (
// //                     <NavLink to="/dashboard/tipo-denuncia" className={({ isActive }) => linkClass(isActive)}>
// //                       Tipo Denuncia
// //                     </NavLink>
// //                   )}

// //                 </Disclosure.Panel>
// //               </>
// //             )}
// //           </Disclosure>
// //         </nav>
// //       </div>

// //       {/* Cerrar sesión */}
// //       <div className="p-4 border-t border-gray-700">
// //         <button
// //           onClick={handleLogout}
// //           className="w-full px-4 py-2 rounded bg-red-600 hover:bg-red-700 transition-colors text-left"
// //         >
// //           Cerrar sesión
// //         </button>
// //       </div>
// //     </aside>
// //   );
// // }

// // src/Components/Sidebar.tsx
// import { NavLink, useNavigate } from 'react-router-dom';
// import { useAuth } from '../Pages/Auth/useAuth';
// import { Disclosure } from '@headlessui/react';
// import { ChevronUpIcon } from '@heroicons/react/24/solid';
// import { useEffect, useState } from 'react';
// import ApiRoutes from './ApiRoutes'; // 🔥 usa ApiRoutes correctamente

// export default function Sidebar() {
//   const { userPermissions, logout, userEmail } = useAuth();
//   const navigate = useNavigate();

//   const [pendientes, setPendientes] = useState({
//     concesiones: 0,
//     prorroga: 0,
//     expedientes: 0,
//     precario: 0,
//     planos: 0,
//     citas: 0,
//     denuncias: 0,
//   });

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };

//   const hasPermission = (perm: string) => userPermissions.includes(perm);

//   const linkClass = (isActive: boolean) =>
//     `block px-4 py-2 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-800' : ''}`;

//   useEffect(() => {
//     const fetchPendientes = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) return;

//       try {
//         const headers = { Authorization: `Bearer ${token}` };

//         const [
//           concesionesRes,
//           prorrogaRes,
//           expedientesRes,
//           precarioRes,
//           planosRes,
//           citasRes,
//           denunciasRes,
//         ] = await Promise.all([
//           fetch(`${ApiRoutes.concesiones}/pendientes`, { headers }),
//           fetch(`${ApiRoutes.prorrogas}/pendientes`, { headers }),
//           fetch(`${ApiRoutes.expedientes}/pendientes`, { headers }),
//           fetch(`${ApiRoutes.precarios}/pendientes`, { headers }),
//           fetch(`${ApiRoutes.planos}/pendientes`, { headers }),
//           fetch(`${ApiRoutes.citas}/pendientes`, { headers }),
//           fetch(`${ApiRoutes.denuncias}/pendientes`, { headers }),
//         ]);

//         const [
//           concesiones,
//           prorroga,
//           expedientes,
//           precario,
//           planos,
//           citas,
//           denuncias,
//         ] = await Promise.all([
//           concesionesRes.ok ? concesionesRes.text() : "0",
//           prorrogaRes.ok ? prorrogaRes.text() : "0",
//           expedientesRes.ok ? expedientesRes.text() : "0",
//           precarioRes.ok ? precarioRes.text() : "0",
//           planosRes.ok ? planosRes.text() : "0",
//           citasRes.ok ? citasRes.text() : "0",
//           denunciasRes.ok ? denunciasRes.text() : "0",
//         ]);

//         setPendientes({
//           concesiones: Number(concesiones),
//           prorroga: Number(prorroga),
//           expedientes: Number(expedientes),
//           precario: Number(precario),
//           planos: Number(planos),
//           citas: Number(citas),
//           denuncias: Number(denuncias),
//         });
//       } catch (error) {
//         console.error('Error obteniendo pendientes:', error);
//       }
//     };

//     fetchPendientes();
//   }, []);

//   return (
//     <aside className="w-64 h-screen bg-gray-900 text-white flex flex-col justify-between">
//       <div>
//         {/* Usuario */}
//         <div className="p-4 text-sm font-semibold border-b border-gray-700 break-words">
//           {userEmail}
//         </div>

//         {/* Navegación */}
//         <nav className="p-4 space-y-2 text-sm">
//           {/* Inicio */}
//           <NavLink to="/dashboard" className={({ isActive }) => linkClass(isActive)}>
//             Inicio
//           </NavLink>

//           {/* Citas */}
//           {hasPermission('ver_appointments') && (
//             <NavLink to="/dashboard/citas" className={({ isActive }) => linkClass(isActive)}>
//               Citas {pendientes.citas > 0 && <span className="ml-2 bg-red-600 text-white rounded-full px-2">{pendientes.citas}</span>}
//             </NavLink>
//           )}

//           {/* Denuncias */}
//           {hasPermission('ver_denuncia') && (
//             <NavLink to="/dashboard/denuncias" className={({ isActive }) => linkClass(isActive)}>
//               Denuncias {pendientes.denuncias > 0 && <span className="ml-2 bg-red-600 text-white rounded-full px-2">{pendientes.denuncias}</span>}
//             </NavLink>
//           )}
//                   {hasPermission('ver_concesiones') && (
//                     <NavLink to="/dashboard/concesiones" className={({ isActive }) => linkClass(isActive)}>
//                       Concesiones {pendientes.concesiones > 0 && <span className="ml-2 bg-red-600 text-white rounded-full px-2">{pendientes.concesiones}</span>}
//                     </NavLink>
//                   )}
//                   {hasPermission('ver_prorrogas') && (
//                     <NavLink to="/dashboard/prorrogas" className={({ isActive }) => linkClass(isActive)}>
//                       Prórrogas {pendientes.prorroga > 0 && <span className="ml-2 bg-red-600 text-white rounded-full px-2">{pendientes.prorroga}</span>}
//                     </NavLink>
//                   )}
//                   {hasPermission('ver_copia_expediente') && (
//                     <NavLink to="/dashboard/expedientes" className={({ isActive }) => linkClass(isActive)}>
//                       Expedientes {pendientes.expedientes > 0 && <span className="ml-2 bg-red-600 text-white rounded-full px-2">{pendientes.expedientes}</span>}
//                     </NavLink>
//                   )}
//                   {hasPermission('ver_precario') && (
//                     <NavLink to="/dashboard/uso-precario" className={({ isActive }) => linkClass(isActive)}>
//                       Uso Precario {pendientes.precario > 0 && <span className="ml-2 bg-red-600 text-white rounded-full px-2">{pendientes.precario}</span>}
//                     </NavLink>
//                   )}
//                   {hasPermission('ver_revisionplano') && (
//                     <NavLink to="/dashboard/planos" className={({ isActive }) => linkClass(isActive)}>
//                       Planos {pendientes.planos > 0 && <span className="ml-2 bg-red-600 text-white rounded-full px-2">{pendientes.planos}</span>}
//                     </NavLink>
//                   )}
//           {/* Solicitudes */}
//           {/* <Disclosure>
//             {({ open }) => (
//               <>
//                 <Disclosure.Button className="w-full flex justify-between items-center px-4 py-2 rounded hover:bg-gray-700">
//                   <span>Solicitudes</span>
//                   <ChevronUpIcon className={`${open ? 'rotate-180 transform' : ''} h-4 w-4`} />
//                 </Disclosure.Button>
//                 <Disclosure.Panel className="pl-4 mt-1 space-y-1">
//                   {hasPermission('ver_concesiones') && (
//                     <NavLink to="/dashboard/concesiones" className={({ isActive }) => linkClass(isActive)}>
//                       Concesiones {pendientes.concesiones > 0 && <span className="ml-2 bg-red-600 text-white rounded-full px-2">{pendientes.concesiones}</span>}
//                     </NavLink>
//                   )}
//                   {hasPermission('ver_prorrogas') && (
//                     <NavLink to="/dashboard/prorrogas" className={({ isActive }) => linkClass(isActive)}>
//                       Prórrogas {pendientes.prorroga > 0 && <span className="ml-2 bg-red-600 text-white rounded-full px-2">{pendientes.prorroga}</span>}
//                     </NavLink>
//                   )}
//                   {hasPermission('ver_copia_expediente') && (
//                     <NavLink to="/dashboard/expedientes" className={({ isActive }) => linkClass(isActive)}>
//                       Expedientes {pendientes.expedientes > 0 && <span className="ml-2 bg-red-600 text-white rounded-full px-2">{pendientes.expedientes}</span>}
//                     </NavLink>
//                   )}
//                   {hasPermission('ver_precario') && (
//                     <NavLink to="/dashboard/uso-precario" className={({ isActive }) => linkClass(isActive)}>
//                       Uso Precario {pendientes.precario > 0 && <span className="ml-2 bg-red-600 text-white rounded-full px-2">{pendientes.precario}</span>}
//                     </NavLink>
//                   )}
//                   {hasPermission('ver_revisionplano') && (
//                     <NavLink to="/dashboard/planos" className={({ isActive }) => linkClass(isActive)}>
//                       Planos {pendientes.planos > 0 && <span className="ml-2 bg-red-600 text-white rounded-full px-2">{pendientes.planos}</span>}
//                     </NavLink>
//                   )}
//                 </Disclosure.Panel>
//               </>
//             )}
//           </Disclosure> */}

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
//                 <Disclosure.Panel className="pl-4 mt-1 space-y-1">
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
  const { counters } = useSolicitudes(); // 👈 Aquí escuchamos los contadores del socket
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const hasPermission = (perm: string) => userPermissions.includes(perm);

  const linkClass = (isActive: boolean) =>
    `block px-4 py-2 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-800' : ''}`;

  return (
    // <aside className="w-64 h-screen bg-gray-900 text-white flex flex-col justify-between">
    <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col overflow-y-auto">
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
              Citas {counters.citas > 0 && <span className="ml-2 bg-red-600 text-white rounded-full px-2">{counters.citas}</span>}
            </NavLink>
          )}

          {/* Denuncias */}
          {hasPermission('ver_denuncia') && (
            <NavLink to="/dashboard/denuncias" className={({ isActive }) => linkClass(isActive)}>
              Denuncias {counters.denuncias > 0 && <span className="ml-2 bg-red-600 text-white rounded-full px-2">{counters.denuncias}</span>}
            </NavLink>
          )}
                  {hasPermission('ver_concesiones') && (
                    <NavLink to="/dashboard/concesiones" className={({ isActive }) => linkClass(isActive)}>
                      Concesiones {counters.concesiones > 0 && <span className="ml-2 bg-red-600 text-white rounded-full px-2">{counters.concesiones}</span>}
                    </NavLink>
                  )}
                  {hasPermission('ver_prorrogas') && (
                    <NavLink to="/dashboard/prorrogas" className={({ isActive }) => linkClass(isActive)}>
                      Prorrogas {counters.prorrogas > 0 && <span className="ml-2 bg-red-600 text-white rounded-full px-2">{counters.prorrogas}</span>}
                    </NavLink>
                  )}
                  {hasPermission('ver_copia_expediente') && (
                    <NavLink to="/dashboard/expedientes" className={({ isActive }) => linkClass(isActive)}>
                      Expedientes {counters.expedientes > 0 && <span className="ml-2 bg-red-600 text-white rounded-full px-2">{counters.expedientes}</span>}
                    </NavLink>
                  )}
                  {hasPermission('ver_precario') && (
                    <NavLink to="/dashboard/uso-precario" className={({ isActive }) => linkClass(isActive)}>
                      Uso Precario {counters.usoPrecario > 0 && <span className="ml-2 bg-red-600 text-white rounded-full px-2">{counters.usoPrecario}</span>}
                    </NavLink>
                  )}
                  {hasPermission('ver_revisionplano') && (
                    <NavLink to="/dashboard/planos" className={({ isActive }) => linkClass(isActive)}>
                      Planos {counters.planos > 0 && <span className="ml-2 bg-red-600 text-white rounded-full px-2">{counters.planos}</span>}
                    </NavLink>
                  )}

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
                {/* <Disclosure.Panel className="pl-4 mt-1 space-y-1"> */}
                <Disclosure.Panel className="pl-4 mt-1 space-y-1 transition-all duration-300 ease-in-out">

                  <NavLink to="/dashboard/roles" className={({ isActive }) => linkClass(isActive)}>
                    Roles
                  </NavLink>
                  <NavLink to="/dashboard/dias-citas" className={({ isActive }) => linkClass(isActive)}>
                    Días Citas
                  </NavLink>
                  <NavLink to="/dashboard/lugar-denuncia" className={({ isActive }) => linkClass(isActive)}>
                    Lugar Denuncia
                  </NavLink>
                  <NavLink to="/dashboard/tipo-denuncia" className={({ isActive }) => linkClass(isActive)}>
                    Tipo Denuncia
                  </NavLink>
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
