'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { UserRole, RequestStatus } from '@/lib/types/auth'

interface ReportStats {
  total: number
  pending: number
  approved: number
  rejected: number
  inProgress: number
  completed: number
}

export default function ReportsPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<ReportStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    inProgress: 0,
    completed: 0,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user?.role !== UserRole.ADMIN && user?.role !== UserRole.ASISTEN_PRAKTIKUM) {
      return
    }
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/requests')
      const data = await response.json()

      if (data.success) {
        const requests = data.data
        const stats: ReportStats = {
          total: requests.length,
          pending: requests.filter((r: any) => r.status === RequestStatus.PENDING).length,
          approved: requests.filter((r: any) => r.status === RequestStatus.APPROVED).length,
          rejected: requests.filter((r: any) => r.status === RequestStatus.REJECTED).length,
          inProgress: requests.filter((r: any) => r.status === RequestStatus.IN_PROGRESS).length,
          completed: requests.filter((r: any) => r.status === RequestStatus.COMPLETED).length,
        }
        setStats(stats)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (user?.role !== UserRole.ADMIN && user?.role !== UserRole.ASISTEN_PRAKTIKUM) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Anda tidak memiliki akses ke halaman ini</p>
        </div>
      </div>
    )
  }

  const approvalRate = stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
          <p className="text-gray-600">Statistik dan laporan sistem PAD Lab</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-emerald-600">
                <p className="text-gray-600 text-sm mb-2">Total Pengajuan</p>
                <p className="text-4xl font-bold text-gray-900">{stats.total}</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-600">
                <p className="text-gray-600 text-sm mb-2">Menunggu Persetujuan</p>
                <p className="text-4xl font-bold text-yellow-600">{stats.pending}</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
                <p className="text-gray-600 text-sm mb-2">Disetujui</p>
                <p className="text-4xl font-bold text-green-600">{stats.approved}</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-600">
                <p className="text-gray-600 text-sm mb-2">Ditolak</p>
                <p className="text-4xl font-bold text-red-600">{stats.rejected}</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
                <p className="text-gray-600 text-sm mb-2">Sedang Diproses</p>
                <p className="text-4xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600">
                <p className="text-gray-600 text-sm mb-2">Selesai</p>
                <p className="text-4xl font-bold text-purple-600">{stats.completed}</p>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Status Summary</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700">Approval Rate</span>
                      <span className="font-bold text-emerald-600">{approvalRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-emerald-600 h-3 rounded-full"
                        style={{ width: `${approvalRate}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700">Rejection Rate</span>
                      <span className="font-bold text-red-600">
                        {stats.total > 0 ? Math.round((stats.rejected / stats.total) * 100) : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-red-600 h-3 rounded-full"
                        style={{
                          width: `${stats.total > 0 ? Math.round((stats.rejected / stats.total) * 100) : 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700">Completion Rate</span>
                      <span className="font-bold text-purple-600">
                        {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-purple-600 h-3 rounded-full"
                        style={{
                          width: `${stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Info</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                    <span className="text-gray-700 font-semibold">Perlu Segera Ditindak</span>
                    <span className="text-2xl font-bold text-yellow-600">{stats.pending}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <span className="text-gray-700 font-semibold">Dalam Proses</span>
                    <span className="text-2xl font-bold text-blue-600">{stats.inProgress}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <span className="text-gray-700 font-semibold">Sudah Diselesaikan</span>
                    <span className="text-2xl font-bold text-green-600">{stats.completed}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
