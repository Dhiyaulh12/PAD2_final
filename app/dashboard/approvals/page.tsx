'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { UserRole, RequestStatus } from '@/lib/types/auth'

interface RequestData {
  id: string
  title: string
  type: string
  userName: string
  status: string
  createdAt: string
}

export default function ApprovalsPage() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<RequestData[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('pending')

  useEffect(() => {
    if (user?.role !== UserRole.ASISTEN_PRAKTIKUM && user?.role !== UserRole.ADMIN) {
      return
    }
    fetchRequests()
  }, [filter])

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/requests`)
      const data = await response.json()

      if (data.success) {
        const filtered = data.data.filter((req: any) => req.status === filter)
        setRequests(
          filtered.map((req: any) => ({
            id: req.id,
            title: req.title,
            type: req.type,
            userName: req.userName,
            status: req.status,
            createdAt: new Date(req.createdAt).toLocaleDateString('id-ID'),
          }))
        )
      }
    } catch (error) {
      console.error('Failed to fetch requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/requests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: RequestStatus.APPROVED,
          approvedBy: user?.id,
        }),
      })

      if (response.ok) {
        fetchRequests()
      }
    } catch (error) {
      console.error('Failed to approve request:', error)
    }
  }

  const handleReject = async (id: string) => {
    const reason = prompt('Alasan penolakan:')
    if (!reason) return

    try {
      const response = await fetch(`/api/requests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: RequestStatus.REJECTED,
          rejectionReason: reason,
        }),
      })

      if (response.ok) {
        fetchRequests()
      }
    } catch (error) {
      console.error('Failed to reject request:', error)
    }
  }

  if (user?.role !== UserRole.ASISTEN_PRAKTIKUM && user?.role !== UserRole.ADMIN) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Anda tidak memiliki akses ke halaman ini</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Approval Queue</h1>
          <p className="text-gray-600">Review dan approve pengajuan dari mahasiswa</p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex gap-4">
          {['pending', 'approved', 'rejected', 'in_progress', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === status
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Judul</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tipe</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Pengaju</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tanggal</th>
                {filter === 'pending' && (
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Aksi</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={filter === 'pending' ? 5 : 4} className="px-6 py-4 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={filter === 'pending' ? 5 : 4} className="px-6 py-4 text-center text-gray-500">
                    Tidak ada permintaan yang perlu diproses
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{req.title}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                        {req.type.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{req.userName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{req.createdAt}</td>
                    {filter === 'pending' && (
                      <td className="px-6 py-4 text-sm flex gap-2">
                        <button
                          onClick={() => handleApprove(req.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(req.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                        >
                          Reject
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
