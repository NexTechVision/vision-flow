
import { toast } from "@/hooks/use-toast";

// Types for HTTP client
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string>;
  data?: any;
  withAuth?: boolean;
}

interface HttpResponse<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

// Auth token management
const TOKEN_KEY = 'visionflow_auth_token';

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// HTTP Client class
class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  }

  // Generic request method
  private async request<T>(
    method: HttpMethod,
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<HttpResponse<T>> {
    const url = new URL(`${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`);
    
    // Add query parameters
    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    // Add auth token if requested
    if (options.withAuth !== false) {
      const token = getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    // Prepare fetch options
    const fetchOptions: RequestInit = {
      method,
      headers,
      credentials: 'include',
    };

    // Add request body for non-GET requests
    if (method !== 'GET' && options.data !== undefined) {
      fetchOptions.body = JSON.stringify(options.data);
    }

    try {
      const response = await fetch(url.toString(), fetchOptions);
      
      // Parse response data
      let data: T;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text() as unknown as T;
      }

      // Create headers object
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });
      
      // Check for error status
      if (!response.ok) {
        const error = {
          status: response.status,
          message: typeof data === 'object' && data !== null && 'message' in data 
            ? (data as any).message 
            : 'An unexpected error occurred',
          data
        };
        
        throw error;
      }

      return {
        data,
        status: response.status,
        headers: responseHeaders
      };
    } catch (error: any) {
      // Handle network errors
      if (!error.status) {
        toast({
          title: "Network Error",
          description: "Unable to connect to the server. Please check your connection.",
          variant: "destructive"
        });
        throw error;
      }
      
      // Handle API errors
      toast({
        title: `Error ${error.status}`,
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
      
      throw error;
    }
  }

  // HTTP methods
  public async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const response = await this.request<T>('GET', endpoint, options);
    return response.data;
  }

  public async post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    const response = await this.request<T>('POST', endpoint, { ...options, data });
    return response.data;
  }

  public async put<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    const response = await this.request<T>('PUT', endpoint, { ...options, data });
    return response.data;
  }

  public async patch<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    const response = await this.request<T>('PATCH', endpoint, { ...options, data });
    return response.data;
  }

  public async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const response = await this.request<T>('DELETE', endpoint, options);
    return response.data;
  }
}

// Create and export the HTTP client instance
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
export const httpClient = new HttpClient(API_BASE_URL);

export default httpClient;
