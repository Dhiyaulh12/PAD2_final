import { UserRole, type User } from './types/auth'

export type MockUserEntry = {
  email: string
  password: string
  user: User
  aliases?: Array<{ email: string; password: string }>
}

// Mock user data untuk development.
// Catatan penting:
// Project ini sempat memakai 2 format akun demo:
// 1) @pad2lab.edu + password123 pada halaman login Next.js
// 2) @example.com + password pada seeder Laravel
// Agar tombol demo dan akun yang dibuat lewat seeder sama-sama bisa login,
// setiap user diberi alias credential.
export const MOCK_USERS: Record<string, MockUserEntry> = {
  mahasiswa: {
    email: 'mahasiswa@pad2lab.edu',
    password: 'password123',
    aliases: [
      { email: 'mahasiswa@example.com', password: 'password' },
    ],
    user: {
      id: '1',
      name: 'Ahmad Rizki',
      email: 'mahasiswa@pad2lab.edu',
      role: UserRole.MAHASISWA,
      npm: '2021051001',
      phone: '08123456789',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad',
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
  },
  asisten: {
    email: 'asisten@pad2lab.edu',
    password: 'password123',
    aliases: [
      { email: 'asisten@example.com', password: 'password' },
    ],
    user: {
      id: '2',
      name: 'Siti Nur Aini',
      email: 'asisten@pad2lab.edu',
      role: UserRole.ASISTEN_PRAKTIKUM,
      phone: '08987654321',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti',
      createdAt: new Date('2022-06-10'),
      updatedAt: new Date('2024-01-10'),
    },
  },
  admin: {
    email: 'admin@pad2lab.edu',
    password: 'password123',
    aliases: [
      { email: 'admin@example.com', password: 'password' },
    ],
    user: {
      id: '3',
      name: 'Dr. Budi Santoso',
      email: 'admin@pad2lab.edu',
      role: UserRole.ADMIN,
      phone: '08555666777',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi',
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date('2024-01-15'),
    },
  },
}

const getNodeBuffer = () => {
  return typeof globalThis !== 'undefined'
    ? (globalThis as typeof globalThis & { Buffer?: { from: (...args: unknown[]) => { toString: (encoding?: string) => string } } }).Buffer
    : undefined
}

const encodeBase64 = (value: string): string => {
  const nodeBuffer = getNodeBuffer()

  if (nodeBuffer) {
    return nodeBuffer.from(value, 'utf-8').toString('base64')
  }

  return btoa(unescape(encodeURIComponent(value)))
}

export const decodeBase64 = (value: string): string => {
  const nodeBuffer = getNodeBuffer()

  if (nodeBuffer) {
    return nodeBuffer.from(value, 'base64').toString('utf-8')
  }

  return decodeURIComponent(escape(atob(value)))
}

// Generate mock token
export const generateMockToken = (userId: string): string => {
  return encodeBase64(JSON.stringify({ userId, iat: Date.now() }))
}

// Verify token format
export const verifyTokenFormat = (token: string): boolean => {
  try {
    const decoded = decodeBase64(token)
    JSON.parse(decoded)
    return true
  } catch {
    return false
  }
}

export const credentialsMatch = (
  userEntry: MockUserEntry,
  email: string,
  password: string
): boolean => {
  const normalizedEmail = email.trim().toLowerCase()
  const credentials = [
    { email: userEntry.email, password: userEntry.password },
    ...(userEntry.aliases ?? []),
  ]

  return credentials.some(
    (credential) =>
      credential.email.trim().toLowerCase() === normalizedEmail &&
      credential.password === password
  )
}

// Get role display name
export const getRoleDisplayName = (role: UserRole): string => {
  switch (role) {
    case UserRole.MAHASISWA:
      return 'Mahasiswa'
    case UserRole.ASISTEN_PRAKTIKUM:
      return 'Asisten Praktikum'
    case UserRole.ADMIN:
      return 'Admin'
    default:
      return 'User'
  }
}

// Get role badge color
export const getRoleBadgeColor = (role: UserRole): string => {
  switch (role) {
    case UserRole.MAHASISWA:
      return 'bg-emerald-500'
    case UserRole.ASISTEN_PRAKTIKUM:
      return 'bg-blue-500'
    case UserRole.ADMIN:
      return 'bg-red-500'
    default:
      return 'bg-slate-500'
  }
}

// Permissions check functions
export const canApproveRequests = (role: UserRole): boolean => {
  return role === UserRole.ASISTEN_PRAKTIKUM || role === UserRole.ADMIN
}

export const canSubmitRequests = (role: UserRole): boolean => {
  return role === UserRole.MAHASISWA || role === UserRole.ASISTEN_PRAKTIKUM
}

export const canManageUsers = (role: UserRole): boolean => {
  return role === UserRole.ADMIN
}

export const canViewAnalytics = (role: UserRole): boolean => {
  return role === UserRole.ADMIN || role === UserRole.ASISTEN_PRAKTIKUM
}
