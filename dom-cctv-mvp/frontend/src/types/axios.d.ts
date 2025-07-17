// Extensión de tipos para Axios
declare module 'axios' {
  export interface AxiosRequestConfig {
    _retry?: boolean;
  }
}