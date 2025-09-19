import { API_URL } from './config';

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

export async function apiRequest(
  endpoint: string,
  options: RequestOptions = {}
): Promise<Response> {
  const { skipAuth = false, headers = {}, ...restOptions } = options;

  const token = localStorage.getItem('jwt_token');

  const requestHeaders: HeadersInit = {
    ...headers,
  };

  if (!skipAuth && token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...restOptions,
    headers: requestHeaders,
  });

  // Check if the response is 401 (Unauthorized) or 403 (Forbidden)
  if (response.status === 401 || response.status === 403) {
    // Clear the token
    localStorage.removeItem('jwt_token');

    // Redirect to login page
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  return response;
}

export async function apiRequestJson<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const response = await apiRequest(endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed with status ${response.status}`);
  }

  return response.json();
}