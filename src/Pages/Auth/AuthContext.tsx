// src/context/AuthContext.tsx
import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useSolicitudes } from '../../context/SolicitudesContext';
import { useSolicitudesGraficas } from '../../context/SolicitudesGraficasContext';

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string;
  userPermissions: string[];
    isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // console.log('[AuthContext] Token encontrado en localStorage, procesando...');
      handleToken(token);
      fetchCounters(); // 🔥 Si refrescan página también actualizamos
        } else {
    setIsLoading(false);
    }
  }, []);

  // const handleToken = (token: string) => {
  //   try {
  //     const decodedToken = jwtDecode<any>(token) ;
  //     console.log('[🔐 Token Decodificado]', decodedToken);

  //     if (decodedToken.email) {
  //       setUserEmail(decodedToken.email);
  //     }

  //     if (decodedToken.permissions) {
  //       const mapped = decodedToken.permissions.map(
  //         (perm: { action: string; resource: string }) => {
  //           if (perm.action === 'GET') return `ver_${perm.resource}`;
  //           if (perm.action === 'POST') return `crear_${perm.resource}`;
  //           if (perm.action === 'PUT') return `editar_${perm.resource}`;
  //           if (perm.action === 'PATCH') return `editar_${perm.resource}`;
  //           if (perm.action === 'DELETE') return `eliminar_${perm.resource}`;
  //           return `${perm.action.toLowerCase()}_${perm.resource}`;
  //         }
  //       );

  //       setUserPermissions(mapped);
  //     }

  //     setIsAuthenticated(true);
  //     setIsLoading(false);
  //   } catch (error) {
  //     console.error('Error al decodificar el token:', error);
  //     logout();
  //   }
  // };

  const handleToken = (token: string) => {
  try {
    const decodedToken = jwtDecode<any>(token);
    // console.log('[🔐 Token Decodificado]', decodedToken);

    if (decodedToken.email) {
      setUserEmail(decodedToken.email);
    }

    if (decodedToken.permissions && Array.isArray(decodedToken.permissions)) {
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
      // console.log('[🔐 Permisos mapeados]', mapped);
      setUserPermissions(mapped);
    } else {
      console.warn('[⚠️] El token no contiene permisos válidos');
    }

    setIsAuthenticated(true);
  } catch (error) {
    console.error('❌ Error al decodificar el token:', error);
    logout();
  } finally {
    // Siempre ocultar el loader
    setIsLoading(false);
  }
};


  const login = (token: string) => {
//     console.log('[AuthContext] Ejecutando login()...');
//  console.log('[⚡ login()] token recibido:', token);
    localStorage.setItem('token', token);
    handleToken(token);

    // console.log('[AuthContext] Disparando fetchCounters()...');
    fetchCounters(); // 🔥 Aquí disparamos explícitamente
    fetchSolicitudes();
  };

  const logout = () => {
    // console.log('[AuthContext] Cerrando sesión...');
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserEmail('');
    setUserPermissions([]);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, userPermissions,isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

