'use client'

import { useAuth } from '@/lib/auth-context'
import { getRoleDisplayName, canViewAnalytics } from '@/lib/auth-utils'
import { BarChart3, Users, FileText, Clock, Zap, Leaf as PlantIcon, Settings } from 'lucide-react'
import { UserRole } from '@/lib/types/auth'

export default function DashboardPage() {
  const { user, isLoading } = useAuth()

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const roleDisplay = getRoleDisplayName(user.role)
  const canViewStats = canViewAnalytics(user.role)

  const dashboardContent = {
    [UserRole.MAHASISWA]: {
      title: 'Dashboard Mahasiswa',
      greeting: `Selamat datang, ${user.name}!`,
      description: 'Kelola pengajuan dan laporan praktikum Anda',
      features: [
        { href: '/dashboard/research', icon: FileText, label: 'Research Request', color: 'bg-blue-500' },
        { href: '/dashboard/plant-identification', icon: PlantIcon, label: 'Plant Identification', color: 'bg-green-500' },
        { href: '/dashboard/equipment', icon: Zap, label: 'Equipment Loan', color: 'bg-yellow-500' },
        { href: '/dashboard/overtime', icon: Clock, label: 'Overtime Request', color: 'bg-purple-500' },
      ],
    },
    [UserRole.ASISTEN_PRAKTIKUM]: {
      title: 'Dashboard Asisten Praktikum',
      greeting: `Selamat datang, ${user.name}!`,
      description: 'Kelola praktikum dan monitoring mahasiswa',
      features: [
        { href: '/dashboard/research', icon: FileText, label: 'All Requests', color: 'bg-blue-500' },
        { href: '/dashboard/overtime', icon: Clock, label: 'Overtime Request', color: 'bg-purple-500' },
        { href: '/dashboard/approvals', icon: FileText, label: 'Approvals Queue', color: 'bg-emerald-500' },
      ],
    },
    [UserRole.ADMIN]: {
      title: 'Dashboard Admin',
      greeting: `Selamat datang, ${user.name}!`,
      description: 'Kelola sistem dan semua pengguna',
      features: [
        { href: '/dashboard/research', icon: FileText, label: 'All Requests', color: 'bg-blue-500' },
        { href: '/dashboard/users', icon: Users, label: 'User Management', color: 'bg-red-500' },
        { href: '/dashboard/reports', icon: BarChart3, label: 'Reports', color: 'bg-purple-500' },
      ],
    },
  }

  const content = dashboardContent[user.role]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{content.greeting}</h1>
          <p className="text-gray-600">{content.description}</p>
        </div>

        {/* Stats Section */}
        {canViewStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-emerald-600">
              <p className="text-gray-600 text-sm mb-2">Total Pengajuan</p>
              <p className="text-3xl font-bold text-gray-900">24</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
              <p className="text-gray-600 text-sm mb-2">Disetujui</p>
              <p className="text-3xl font-bold text-green-600">18</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-600">
              <p className="text-gray-600 text-sm mb-2">Menunggu Persetujuan</p>
              <p className="text-3xl font-bold text-yellow-600">6</p>
            </div>
          </div>
        )}

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Menu Utama</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <a
                  key={idx}
                  href={feature.href}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-all p-6 group cursor-pointer border border-transparent hover:border-gray-200"
                >
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.label}</h3>
                  <p className="text-gray-600 text-sm">Akses fitur ini untuk mengelola {feature.label.toLowerCase()}</p>
                </a>
              )
            })}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-emerald-600">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Informasi Akun Anda</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 text-sm">Nama</p>
              <p className="text-gray-900 font-semibold">{user.name}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Email</p>
              <p className="text-gray-900 font-semibold">{user.email}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Role</p>
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full mt-1">
                {roleDisplay}
              </span>
            </div>
            {user.npm && (
              <div>
                <p className="text-gray-600 text-sm">NPM</p>
                <p className="text-gray-900 font-semibold">{user.npm}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
