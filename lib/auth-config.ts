// API Endpoints - menggunakan Next.js API routes untuk development
// Production: Ubah ke Laravel backend URL
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'

export const API_BASE_URL = IS_DEVELOPMENT 
  ? 'http://localhost:3000/api'
  : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export const LARAVEL_API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL || 'http://localhost:8000/api'
export const LARAVEL_BASE_URL = process.env.NEXT_PUBLIC_LARAVEL_BASE_URL || 'http://localhost:8000'

export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  ME: `${API_BASE_URL}/auth/me`,
  REFRESH: `${API_BASE_URL}/auth/refresh`,
}

export const TOKEN_KEY = 'auth_token'
export const USER_KEY = 'auth_user'
