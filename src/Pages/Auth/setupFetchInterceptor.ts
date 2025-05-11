import { login, logout } from './AuthContextHelper';

export const setupFetchInterceptor = () => {
  const originalFetch = window.fetch;

  window.fetch = (async function (
    input: RequestInfo,
    init?: RequestInit
  ): Promise<Response> {
    const token = localStorage.getItem('token');

    const response = await originalFetch(input, {
      ...init,
      headers: {
        ...(init?.headers || {}),
        Authorization: token ? `Bearer ${token}` : '',
      },
    });

    const newToken = response.headers.get('x-refresh-token');
    if (newToken) {
      localStorage.setItem('token', newToken);
      login(newToken);
      console.log('🔄 Token actualizado correctamente');
    }

    if (response.status === 401) {
      localStorage.removeItem('token');
      logout();
      console.warn('🔒 Token inválido o expirado. Sesión cerrada.');
    }

    return response;
  }) as typeof window.fetch;
};
