// User roles enum
export enum UserRole {
  MAHASISWA = 'mahasiswa',
  ASISTEN_PRAKTIKUM = 'asisten_praktikum',
  ADMIN = 'admin',
}

// User type
export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  phone?: string
  npm?: string
  createdAt: Date
  updatedAt: Date
}

// Auth session type
export interface AuthSession {
  user: User
  token: string
  expiresAt: Date
}

// Auth state
export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  loading: boolean
  error: string | null
  isLoading: boolean
}

// Request status enum
export enum RequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

// Request type enum
export enum RequestType {
  RESEARCH = 'research',
  PLANT_IDENTIFICATION = 'plant_identification',
  EQUIPMENT_LOAN = 'equipment_loan',
  OVERTIME = 'overtime',
}

// Request interface
export interface Request {
  id: string
  userId: string
  userName: string
  type: RequestType
  title: string
  description: string
  status: RequestStatus
  createdAt: Date
  updatedAt: Date
  
  // Research specific
  researchTitle?: string
  researchArea?: string
  researchStartDate?: Date
  researchEndDate?: Date
  
  // Plant Identification specific
  plantSpecies?: string
  plantLocation?: string
  plantImages?: string[]
  
  // Equipment Loan specific
  equipmentName?: string
  equipmentQuantity?: number
  loanStartDate?: Date
  loanEndDate?: Date
  
  // Overtime specific
  overtimeDate?: Date
  overtimeHours?: number
  overtimeReason?: string
  
  // Approval workflow
  approvedBy?: string
  approvedAt?: Date
  rejectionReason?: string
  startedAt?: Date
  completedAt?: Date
}

// Login request
export interface LoginRequest {
  email: string
  password: string
  role: UserRole
}

// Login response
export interface LoginResponse {
  success: boolean
  message: string
  user?: User
  token?: string
}

// Paginated response
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}
