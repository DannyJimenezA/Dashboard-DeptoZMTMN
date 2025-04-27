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
import CitaDetalle from '../Pages/TablasDetalle/DetalleCitas';
import DetalleConcesionPage from '../Pages/TablasDetalle/DetalleConcesion';
import DetalleProrrogaPage from '../Pages/TablasDetalle/DetalleProrroga';
import DetalleExpedientePage from '../Pages/TablasDetalle/DetalleExpediente';
import DetallePrecario from '../Pages/TablasDetalle/DetallePrecario';
import DetallePlanoPage from '../Pages/TablasDetalle/DetallePlano';
import DetalleDenuncia from '../Pages/TablasDetalle/DetalleDenuncia';
import AsignarPermisos from '../Pages/TablasDetalle/AsignarPermisos';
import CrearFecha from '../Pages/Tablas/CrearFecha';
import DiasCitasPage from '../Pages/Tablas/DiasCitas';
import AgregarHorasPage from '../Pages/Tablas/AgregarHoras';

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
          {/* Ruta personalizada para ver detalle de cita */}
  <Route
    path="citas/:id"
    element={
      <ProtectedRoute requiredPermission="ver_appointments">
        <CitaDetalle />
      </ProtectedRoute>
    }
  />
  
  <Route
  path="concesiones/:id"
  element={
    <ProtectedRoute requiredPermission="ver_concesiones">
      <DetalleConcesionPage />
    </ProtectedRoute>
  }
/>

<Route
  path="prorroga/:id"
  element={
    <ProtectedRoute requiredPermission="ver_prorroga">
      <DetalleProrrogaPage />
    </ProtectedRoute>
  }
/>

<Route
  path="expedientes/:id"
  element={
    <ProtectedRoute requiredPermission="ver_copia_expediente">
      <DetalleExpedientePage />
    </ProtectedRoute>
  }
/>
<Route
  path="precario/:id"
  element={
    <ProtectedRoute requiredPermission="ver_precario">
      <DetallePrecario />
    </ProtectedRoute>
  }
/>

<Route
  path="plano/:id"
  element={
    <ProtectedRoute requiredPermission="ver_revisionplano">
      <DetallePlanoPage />
    </ProtectedRoute>
  }
/>
<Route
  path="denuncia/:id"
  element={
    <ProtectedRoute requiredPermission="ver_denuncia">
      <DetalleDenuncia />
    </ProtectedRoute>
  }
/>

<Route
  path="asignar-permisos/:id"
  element={
    <ProtectedRoute requiredPermission="ver_permissions">
      <AsignarPermisos />
    </ProtectedRoute>
  }
/>
<Route
  path="dias-citas"
  element={
    <ProtectedRoute requiredPermission="ver_available-dates">
      <DiasCitasPage />
    </ProtectedRoute>
  }
/>

<Route
  path="crear-fecha"
  element={
    <ProtectedRoute requiredPermission="ver_available-dates">
      <CrearFecha />
    </ProtectedRoute>
  }
/>
<Route
  path="horas-citas/:id"
  element={
    <ProtectedRoute requiredPermission="ver_horas-cita">
      <AgregarHorasPage />
    </ProtectedRoute>
  }
/>



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
