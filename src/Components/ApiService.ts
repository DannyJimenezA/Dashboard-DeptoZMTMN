const ApiService = {
  // GET request
  async get<T>(url: string): Promise<T> {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    return await response.json();
  },

  async post<T>(url: string, data: any): Promise<T> {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    return await response.json();
  },

  async put<T>(url: string, data: any): Promise<T> {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    return await response.json();
  },

  async delete(url: string): Promise<void> {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
  },


   async patch<T = any>(url: string, data?: any): Promise<T> {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  
    const response = await fetch(url, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      throw new Error(`Error en la solicitud PATCH: ${response.status}`);
    }
  
    return await response.json();
  }
  

};









// src/Components/ApiService.ts

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';
    return;
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    return;
  }

  return response;
};



export default ApiService;


