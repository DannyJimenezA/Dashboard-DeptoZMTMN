// import { Routes, Route } from 'react-router-dom';
// import { AuthProvider } from '../Pages/Auth//AuthContext';
// import ProtectedRoute from './ProtectedRoute';
// import DashboardLayout from '../Components/DashboardLayout';
// import DashboardHome from '../Pages//DashboardHome';
// import { ROUTES_WITH_PERMISSIONS } from '../Components//permissions';

// import Login from '../Pages/Auth/Login';
// import Register from '../Pages/Auth/Register';
// import ConfirmAccount from '../Pages/Auth/ConfirmAccount';
// import ForgotPassword from '../Pages/Auth/ForgotPassword';
// import ResetPassword from '../Pages/Auth/ResetPassword';
// import MiPerfil from '../Pages/Auth/MiPerfil';

// function AppRoutes() {
//   return (
//     <AuthProvider>
//       <Routes>
//         {/* Rutas públicas */}
//         <Route path="/" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/confirm-account/:token" element={<ConfirmAccount />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="/reset-password" element={<ResetPassword />} />
//         <Route path="/mi-perfil" element={<MiPerfil />} />

//         {/* Rutas protegidas */}
//         <Route path="/dashboard" element={<DashboardLayout />}>
//   <Route index element={<DashboardHome />} />
//   {ROUTES_WITH_PERMISSIONS.map(({ path, component: Component, requiredPermission }) => (
//     <Route
//       key={path}
//       path={path.replace(/^\//, '')}
//       element={
//         <ProtectedRoute requiredPermission={requiredPermission}>
//           <Component />
//         </ProtectedRoute>
//       }
//     />
//   ))}
// </Route>


//         <Route path="/unauthorized" element={<div className="text-center mt-10">🚫 No autorizado</div>} />
//       </Routes>
//     </AuthProvider>
//   );
// }

// export default AppRoutes;

import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../Pages/Auth/AuthContext';
import { useAuth } from '../Pages/Auth/useAuth';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../Components/DashboardLayout';
import DashboardHome from '../Pages/DashboardHome';
import { ROUTES_WITH_PERMISSIONS } from '../Components/permissions';

import Login from '../Pages/Auth/Login';
import Register from '../Pages/Auth/Register';
import ConfirmAccount from '../Pages/Auth/ConfirmAccount';
import ForgotPassword from '../Pages/Auth/ForgotPassword';
import ResetPassword from '../Pages/Auth/ResetPassword';
import MiPerfil from '../Pages/Auth/MiPerfil';

const AppRoutesContent = () => {
  const { isAuthenticated } = useAuth();

  // Aquí esperas a que el estado de autenticación esté resuelto
  if (localStorage.getItem('token') && !isAuthenticated) {
    return <div className="text-center mt-10">Cargando autenticación...</div>;
  }

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/confirm-account/:token" element={<ConfirmAccount />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/mi-perfil" element={<MiPerfil />} />

      {/* Rutas protegidas */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        {ROUTES_WITH_PERMISSIONS.map(({ path, component: Component, requiredPermission }) => (
          <Route
            key={path}
            path={path.replace(/^\//, '')}
            element={
              <ProtectedRoute requiredPermission={requiredPermission}>
                <Component />
              </ProtectedRoute>
            }
          />
        ))}
      </Route>

      <Route path="/unauthorized" element={<div className="text-center mt-10">🚫 No autorizado</div>} />
    </Routes>
  );
};

export default function AppRoutes() {
  return (
    <AuthProvider>
      <AppRoutesContent />
    </AuthProvider>
  );
}
