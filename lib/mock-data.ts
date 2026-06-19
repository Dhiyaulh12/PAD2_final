import { User, Request, RequestType, RequestStatus, UserRole } from './types/auth'

// Mock users for all 3 roles
export const MOCK_USERS = {
  mahasiswa: {
    id: '1',
    name: 'Ahmad Rizki',
    email: 'mahasiswa@pad2lab.edu',
    password: 'password123',
    role: UserRole.MAHASISWA,
    avatar: 'AR',
    phone: '082123456789',
    npm: '2021051001',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  asisten: {
    id: '2',
    name: 'Dr. Siti Nurhayati',
    email: 'asisten@pad2lab.edu',
    password: 'password123',
    role: UserRole.ASISTEN_PRAKTIKUM,
    avatar: 'SN',
    phone: '085987654321',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  admin: {
    id: '3',
    name: 'Budi Santoso',
    email: 'admin@pad2lab.edu',
    password: 'password123',
    role: UserRole.ADMIN,
    avatar: 'BS',
    phone: '081234567890',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
}

// Mock requests data
export const MOCK_REQUESTS: Request[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Ahmad Rizki',
    type: RequestType.RESEARCH,
    title: 'Karakterisasi Tanaman Obat',
    description: 'Penelitian tentang kandungan kimia tanaman obat tradisional',
    status: RequestStatus.APPROVED,
    researchTitle: 'Karakterisasi Kimia Tanaman Obat Tradisional',
    researchArea: 'PAD Lab Room A',
    researchStartDate: new Date('2024-06-01'),
    researchEndDate: new Date('2024-06-30'),
    approvedBy: '2',
    approvedAt: new Date('2024-06-01'),
    createdAt: new Date('2024-05-25'),
    updatedAt: new Date('2024-06-01'),
  },
  {
    id: '2',
    userId: '1',
    userName: 'Ahmad Rizki',
    type: RequestType.PLANT_IDENTIFICATION,
    title: 'Identifikasi Spesies Tanaman',
    description: 'Identifikasi spesies tanaman yang ditemukan di area PAD',
    status: RequestStatus.PENDING,
    plantSpecies: 'Unknown species',
    plantLocation: 'Area PAD Garden',
    plantImages: [],
    createdAt: new Date('2024-06-18'),
    updatedAt: new Date('2024-06-18'),
  },
  {
    id: '3',
    userId: '1',
    userName: 'Ahmad Rizki',
    type: RequestType.EQUIPMENT_LOAN,
    title: 'Peminjaman Microscope',
    description: 'Peminjaman microscope digital untuk penelitian',
    status: RequestStatus.APPROVED,
    equipmentName: 'Digital Microscope Pro',
    equipmentQuantity: 1,
    loanStartDate: new Date('2024-06-15'),
    loanEndDate: new Date('2024-06-22'),
    approvedBy: '2',
    approvedAt: new Date('2024-06-15'),
    createdAt: new Date('2024-06-14'),
    updatedAt: new Date('2024-06-15'),
  },
  {
    id: '4',
    userId: '1',
    userName: 'Ahmad Rizki',
    type: RequestType.OVERTIME,
    title: 'Overtime Work',
    description: 'Perlu overtime untuk menyelesaikan penelitian',
    status: RequestStatus.REJECTED,
    overtimeDate: new Date('2024-06-17'),
    overtimeHours: 3,
    overtimeReason: 'Menyelesaikan pengumpulan data penelitian',
    rejectionReason: 'Tidak ada kebutuhan mendesak',
    createdAt: new Date('2024-06-17'),
    updatedAt: new Date('2024-06-17'),
  },
]

// Function to get all requests (can be filtered by role)
export function getAllRequests(): Request[] {
  return MOCK_REQUESTS
}

// Function to get user requests
export function getUserRequests(userId: string): Request[] {
  return MOCK_REQUESTS.filter(req => req.userId === userId)
}

// Function to add new request
export function addRequest(request: Request): Request {
  MOCK_REQUESTS.push(request)
  return request
}

// Function to update request
export function updateRequest(id: string, updates: Partial<Request>): Request | null {
  const index = MOCK_REQUESTS.findIndex(req => req.id === id)
  if (index === -1) return null
  MOCK_REQUESTS[index] = { ...MOCK_REQUESTS[index], ...updates, updatedAt: new Date() }
  return MOCK_REQUESTS[index]
}

// Function to get request by ID
export function getRequestById(id: string): Request | null {
  return MOCK_REQUESTS.find(req => req.id === id) || null
}
