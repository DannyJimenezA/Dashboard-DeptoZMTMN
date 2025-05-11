import { useAuth } from './AuthContext'; // Ajusta si tu path es diferente

export const useApi = () => {
  const { logout } = useAuth();

  const fetchWithToken = async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    const token = localStorage.getItem('token');

    const res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: token ? `Bearer ${token}` : '',
      },
    });

    // Si el backend devuelve un nuevo token, lo guardamos
    const newToken = res.headers.get('x-refresh-token');
    if (newToken) {
      localStorage.setItem('token', newToken);
    }

    // Si el token es inválido, cerramos sesión
    if (res.status === 401) {
      localStorage.removeItem('token');
      logout();
    }

    return res;
  };

  return { fetchWithToken };
};
