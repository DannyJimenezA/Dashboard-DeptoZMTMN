import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/useAuth'; // Asegúrate de que el contexto de autenticación está configurado

const LogoutButton: React.FC = () => {
  const { logout } = useAuth(); // Usar autenticación desde el contexto
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Ejecuta la función de cierre de sesión
    localStorage.removeItem('token'); // Limpia el token del almacenamiento local
    navigate('/'); // Redirige al usuario a la página de inicio
  };

  return (
    <div
      className="block px-4 py-2 hover:bg-gray-200 cursor-pointer"
      onClick={handleLogout}
    >
      Cerrar sesión
    </div>
  );
};

export default LogoutButton;
