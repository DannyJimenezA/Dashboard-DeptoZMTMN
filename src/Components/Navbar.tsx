import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, UserIcon } from '@heroicons/react/24/outline';
import { jwtDecode } from 'jwt-decode';

interface NavbarProps {
  isFixed?: boolean;
}

interface DecodedToken {
  email: string;
  exp: number;
}

export default function Navbar({ isFixed = false }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSolicitudesDropdownOpen, setIsSolicitudesDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const navigate = useNavigate();
  // const dropdownRef = useRef<HTMLDivElement>(null);

    // Referencia para detectar clics fuera del dropdown de usuario
    const userDropdownRef = useRef<HTMLDivElement>(null);
    const solicitudesDropdownRef = useRef<HTMLDivElement>(null);

  // Verificar si el usuario está autenticado y si el token ha expirado
  const checkAuthentication = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: DecodedToken = jwtDecode(token);
        
        // Verificar si el token ha expirado
        if (decodedToken.exp * 1000 > Date.now()) {
          setIsAuthenticated(true);
          setUserEmail(decodedToken.email);
        } else {
          // Token expirado
          setIsAuthenticated(false);
          setUserEmail(null);
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        setIsAuthenticated(false);
        setUserEmail(null);
      }
    } else {
      setIsAuthenticated(false);
      setUserEmail(null);
    }
  };

  // Ejecutar la verificación de autenticación al montar el componente
  useEffect(() => {
    checkAuthentication();

    // Escuchar cambios en el token en el almacenamiento local
    const handleStorageChange = () => checkAuthentication();
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserEmail(null);
    setIsMenuOpen(false); // cerrar menú mobile
    setIsUserDropdownOpen(false); // cerrar dropdown de usuario
    navigate('/');
  };

  // Cerrar el dropdown de "Solicitudes" al hacer clic fuera
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
  //       setIsSolicitudesDropdownOpen(false);
  //     }
  //   };

  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, []);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }

      if (
        solicitudesDropdownRef.current &&
        !solicitudesDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSolicitudesDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const navbarClasses = `
    w-full bg-white shadow-md transition-all duration-300 z-50
    ${isFixed ? 'fixed' : 'sticky'} top-0
  `;

  return (
    <nav className={navbarClasses}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-blue-600">Inicio</Link>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-8">
            <Link to="/mis-citas" className="text-gray-600 hover:text-blue-600">Citas</Link>
            <Link to="/usuario-denuncia" className="text-gray-600 hover:text-blue-600">Denuncias</Link>

            {/* Dropdown para "Realizar Solicitudes" */}
            <div 
              ref={solicitudesDropdownRef}
              onClick={() => {
                setIsSolicitudesDropdownOpen(!isSolicitudesDropdownOpen);
                setIsUserDropdownOpen(false);
              }} 
              className="relative dropdown-container"
            >
              <button className="text-gray-600 hover:text-blue-600">
                Realizar Solicitudes
              </button>
              {isSolicitudesDropdownOpen && (
                <div className="absolute top-full mt-2 bg-white shadow-lg rounded-md w-48">
                  <Link to="/mis-concesiones" className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100">
                    Concesiones
                  </Link>
                  <Link to="/mis-prorrogas" className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100">
                    Prorrogas
                  </Link>
                  <Link to="/mis-precarios" className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100">
                    Uso Precario
                  </Link>
                  <Link to="/mis-planos" className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100">
                    Revisión de Planos
                  </Link>
                  <Link to="/mis-expedientes" className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100">
                    Copia de Expediente
                  </Link>
                </div>
              )}
            </div>

            {/* <Link to="/mis-solicitudes" className="text-gray-600 hover:text-blue-600">Mis Solicitudes</Link> */}

            {/* Condición de usuario autenticado */}
            {isAuthenticated ? (
               <div ref={userDropdownRef} className="relative">
                {/* <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(!isMenuOpen);
                  }}
                  className="flex items-center gap-2"
                >
                  <UserIcon className="h-6 w-6 text-gray-600" />
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg py-2 p-4">
                    <p className="text-sm text-gray-700 font-semibold">{userEmail}</p>
                    <button onClick={handleLogout} className="block mt-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left">
                      Cerrar sesión
                    </button> */}
                    <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2"
                >
                  <UserIcon className="h-6 w-6 text-gray-600" />
                </button>
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg py-2 p-4">
                    <p className="text-sm text-gray-700 font-semibold">{userEmail}</p>
                    <Link
      to="/mi-perfil"
      className="block mt-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
      onClick={() => setIsUserDropdownOpen(false)}
    >
      Mi información
    </Link>
                    <button
                      onClick={handleLogout}
                      className="block mt-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-blue-600 hover:underline">Iniciar sesión</Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <XMarkIcon className="h-6 w-6 text-gray-600" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link to="/mis-citas" className="block py-2 px-4 text-gray-600 hover:text-blue-600">Citas</Link>
            <Link to="/usuario-denuncia" className="block py-2 px-4 text-gray-600 hover:text-blue-600">Denuncias</Link>
            
            {/* Dropdown de "Realizar Solicitudes" en móvil */}
            <div className="relative">
              <button
                onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                className="w-full text-left px-4 py-2 text-gray-600 hover:text-blue-600"
              >
                Realizar Solicitudes
              </button>
              {isMobileDropdownOpen && (
                <div className="pl-4">
                  <Link to="/mis-concesiones" className="block py-2 text-gray-600 hover:text-blue-600">Concesiones</Link>
                  <Link to="/mis-prorrogas" className="block py-2 text-gray-600 hover:text-blue-600">Prorrogas</Link>
                  <Link to="/mis-precarios" className="block py-2 text-gray-600 hover:text-blue-600">Uso Precario</Link>
                  <Link to="/mis-planos" className="block py-2 text-gray-600 hover:text-blue-600">Revisión de Planos</Link>
                  <Link to="/mis-expedientes" className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100">
                    Copia de Expediente
                  </Link>
                </div>
              )}
            </div>

            {/* <Link to="/mis-solicitudes" className="block py-2 px-4 text-gray-600 hover:text-blue-600">Mis Solicitudes</Link> */}

            {/* Autenticación en modo móvil */}
            {/* {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center w-full text-left px-4 py-2 text-gray-600 hover:text-blue-600 focus:outline-none"
                >
                  <UserIcon className="h-6 w-6 mr-2" /> {userEmail}
                </button>
                {isUserDropdownOpen && (
                  <div className="pl-4">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="block py-2 px-4 text-gray-600 hover:text-blue-600">Iniciar Sesión</Link>
            )} */}
            {isAuthenticated ? (
  <>
    <div className="block py-2 px-4 text-gray-600">{userEmail}</div>
    <Link
  to="/mi-perfil"
  className="block w-full text-left px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition"
  onClick={() => setIsMenuOpen(false)}
>
  Mi información
</Link>
    <button
      onClick={handleLogout}
      className="block w-full text-left px-4 py-2 text-red-600 hover:text-white hover:bg-red-500 transition"
    >
      Cerrar sesión
    </button>
  </>
) : (
  <Link to="/login" className="block py-2 px-4 text-gray-600 hover:text-blue-600">Iniciar Sesión</Link>
)}

          </div>
        )}
      </div>
    </nav>
  );
}