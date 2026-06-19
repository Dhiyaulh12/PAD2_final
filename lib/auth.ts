import { AUTH_ENDPOINTS, TOKEN_KEY, USER_KEY } from './auth-config'
import type { User, AuthResponse } from './types'

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token)
  }
}

export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY)
  }
}

export const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null
  const user = localStorage.getItem(USER_KEY)
  return user ? JSON.parse(user) : null
}

export const setStoredUser = (user: User): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }
}

export const removeStoredUser = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_KEY)
  }
}

export const apiFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getToken()
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return fetch(url, {
    ...options,
    headers,
  })
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(AUTH_ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    let data
    try {
      data = await response.json()
    } catch (parseError) {
      return {
        success: false,
        message: 'Server response tidak valid',
      }
    }

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Login gagal',
      }
    }

    // Store token and user
    if (data.token) {
      setToken(data.token)
    }
    if (data.user) {
      setStoredUser(data.user)
    }

    return {
      success: true,
      message: 'Login successful',
      user: data.user,
      token: data.token,
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Login failed - network error',
    }
  }
}

export const logout = async (): Promise<AuthResponse> => {
  try {
    await apiFetch(AUTH_ENDPOINTS.LOGOUT, {
      method: 'POST',
    })

    removeToken()
    removeStoredUser()

    return {
      success: true,
      message: 'Logout successful',
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Logout failed',
    }
  }
}

export const getCurrentUser = async (): Promise<AuthResponse> => {
  try {
    const response = await apiFetch(AUTH_ENDPOINTS.ME, {
      method: 'GET',
    })

    if (!response.ok) {
      if (response.status === 401) {
        removeToken()
        removeStoredUser()
      }
      return {
        success: false,
        message: 'Failed to fetch user',
      }
    }

    const data = await response.json()

    if (data.user) {
      setStoredUser(data.user)
    }

    return {
      success: true,
      message: 'User fetched successfully',
      user: data.user,
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch user',
    }
  }
}
