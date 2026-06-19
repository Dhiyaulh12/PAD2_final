'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { EquipmentLoanForm } from '@/components/forms/equipment-loan-form'
import { RequestType, UserRole } from '@/lib/types/auth'

interface RequestData {
  id: string
  title: string
  status: string
  createdAt: string
  userName: string
}

export default function EquipmentPage() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<RequestData[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (user?.role === UserRole.MAHASISWA) {
        params.append('userId', user.id)
      }
      params.append('role', user?.role || '')

      const response = await fetch(`/api/requests?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setRequests(
          data.data
            .filter((req: any) => req.type === RequestType.EQUIPMENT_LOAN)
            .map((req: any) => ({
              id: req.id,
              title: req.title,
              status: req.status,
              createdAt: new Date(req.createdAt).toLocaleDateString('id-ID'),
              userName: req.userName,
            }))
        )
      }
    } catch (error) {
      console.error('Failed to fetch requests:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Equipment Loan</h1>
          <p className="text-gray-600">Pengajuan peminjaman alat</p>
        </div>

        {showForm ? (
          <div className="mb-12">
            <button
              onClick={() => {
                setShowForm(false)
                fetchRequests()
              }}
              className="mb-6 px-4 py-2 text-gray-600 hover:text-gray-900 font-semibold"
            >
              ← Kembali ke Daftar
            </button>
            <EquipmentLoanForm onSuccess={() => setShowForm(false)} />
          </div>
        ) : (
          <div className="mb-12">
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
            >
              + Buat Equipment Loan Request
            </button>
          </div>
        )}

        {!showForm && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Judul</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nama Pengaju</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : requests.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                      Tidak ada data
                    </td>
                  </tr>
                ) : (
                  requests.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{req.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{req.userName}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            req.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : req.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : req.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{req.createdAt}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
