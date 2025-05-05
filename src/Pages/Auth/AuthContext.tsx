// // src/context/AuthContext.tsx
// import { createContext, useState, useEffect, ReactNode } from 'react';
// import { jwtDecode } from 'jwt-decode';

// interface AuthContextType {
//   isAuthenticated: boolean;
//   userEmail: string;
//   userPermissions: string[];
//   login: (token: string) => void;
//   logout: () => void;
// }

// export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
//   const [userEmail, setUserEmail] = useState<string>('');
//   const [userPermissions, setUserPermissions] = useState<string[]>([]);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       handleToken(token);
//     }
//   }, []);

//   const handleToken = (token: string) => {
//     try {
//       const decodedToken = jwtDecode<any>(token);

//       if (decodedToken.email) {
//         setUserEmail(decodedToken.email);
//       }

//       if (decodedToken.permissions) {
//         const mapped = decodedToken.permissions.map(
//           (perm: { action: string; resource: string }) => {
//             if (perm.action === 'GET') return `ver_${perm.resource}`;
//             if (perm.action === 'POST') return `crear_${perm.resource}`;
//             if (perm.action === 'PUT') return `editar_${perm.resource}`;
//             if (perm.action === 'DELETE') return `eliminar_${perm.resource}`;
//             return `${perm.action.toLowerCase()}_${perm.resource}`;
//           }
//         );
//         // console.log(mapped)
//         setUserPermissions(mapped);
//       }

//       setIsAuthenticated(true);
//     } catch (error) {
//       console.error('Error al decodificar el token:', error);
//       logout();
//     }
//   };

//   const login = (token: string) => {
//     localStorage.setItem('token', token);
//     handleToken(token);
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setIsAuthenticated(false);
//     setUserEmail('');
//     setUserPermissions([]);
//   };

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, userEmail, userPermissions, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// src/context/AuthContext.tsx
// src/context/AuthContext.tsx
// src/context/AuthContext.tsx
import { createContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useSolicitudes } from '../../context/SolicitudesContext';
import { useSolicitudesGraficas } from '../../context/SolicitudesGraficasContext';

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string;
  userPermissions: string[];
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userPermissions, setUserPermissions] = useState<string[]>([]);

  const { fetchCounters } = useSolicitudes(); // 🔥 Importamos correctamente
  const { fetchSolicitudes } = useSolicitudesGraficas(); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('[AuthContext] Token encontrado en localStorage, procesando...');
      handleToken(token);
      fetchCounters(); // 🔥 Si refrescan página también actualizamos
    }
  }, []);

  const handleToken = (token: string) => {
    try {
      const decodedToken = jwtDecode<any>(token);

      if (decodedToken.email) {
        setUserEmail(decodedToken.email);
      }

      if (decodedToken.permissions) {
        const mapped = decodedToken.permissions.map(
          (perm: { action: string; resource: string }) => {
            if (perm.action === 'GET') return `ver_${perm.resource}`;
            if (perm.action === 'POST') return `crear_${perm.resource}`;
            if (perm.action === 'PUT') return `editar_${perm.resource}`;
            if (perm.action === 'PATCH') return `editar_${perm.resource}`;
            if (perm.action === 'DELETE') return `eliminar_${perm.resource}`;
            return `${perm.action.toLowerCase()}_${perm.resource}`;
          }
        );
        setUserPermissions(mapped);
      }

      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      logout();
    }
  };

  const login = (token: string) => {
    console.log('[AuthContext] Ejecutando login()...');

    localStorage.setItem('token', token);
    handleToken(token);

    console.log('[AuthContext] Disparando fetchCounters()...');
    fetchCounters(); // 🔥 Aquí disparamos explícitamente
    fetchSolicitudes();
  };

  const logout = () => {
    console.log('[AuthContext] Cerrando sesión...');
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserEmail('');
    setUserPermissions([]);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, userPermissions, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
