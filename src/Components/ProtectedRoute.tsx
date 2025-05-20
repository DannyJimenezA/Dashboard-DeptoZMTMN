// // src/components/ProtectedRoute.tsx
// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../Pages/Auth/useAuth';

// interface ProtectedRouteProps {
//   children: React.ReactNode;
//   requiredPermission?: string; // ✅ Permiso opcional
// }

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredPermission }) => {
//   const { isAuthenticated, userPermissions } = useAuth();

//   // console.log('🔐 Permissions en ProtectedRoute:', userPermissions)

//   if (!isAuthenticated) {
//     return <Navigate to="/" replace />;
//   }

//   if (requiredPermission && !userPermissions.includes(requiredPermission)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return <>{children}</>;
// };

// export default ProtectedRoute;

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Pages/Auth/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredPermission }) => {
  const { isAuthenticated, userPermissions, isLoading } = useAuth();

  if (isLoading) {
    return <div className="text-center mt-10 text-gray-500">Cargando permisos...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requiredPermission && !userPermissions.includes(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
