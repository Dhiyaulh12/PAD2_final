'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { RequestType } from '@/lib/types/auth'

interface ResearchFormProps {
  onSuccess?: () => void
}

export function ResearchForm({ onSuccess }: ResearchFormProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const data = {
      userId: user?.id,
      type: RequestType.RESEARCH,
      title: formData.get('title'),
      description: formData.get('description'),
      researchTitle: formData.get('researchTitle'),
      researchArea: formData.get('researchArea'),
      researchStartDate: formData.get('researchStartDate'),
      researchEndDate: formData.get('researchEndDate'),
    }

    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Gagal membuat request')
      }

      setSuccess(true)
      e.currentTarget.reset()
      setTimeout(() => {
        setSuccess(false)
        onSuccess?.()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Form Pengajuan Research</h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          Request berhasil dibuat!
        </div>
      )}

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Judul Pengajuan
          </label>
          <input
            type="text"
            name="title"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            placeholder="Contoh: Penelitian Tanaman Obat"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Deskripsi
          </label>
          <textarea
            name="description"
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            placeholder="Jelaskan penelitian Anda..."
          />
        </div>

        {/* Research Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Judul Riset Lengkap
          </label>
          <input
            type="text"
            name="researchTitle"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            placeholder="Judul riset yang lebih detail"
          />
        </div>

        {/* Research Area */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Area Riset / Lokasi
          </label>
          <input
            type="text"
            name="researchArea"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            placeholder="Contoh: Lab A, Greenhouse, Outdoor"
          />
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Tanggal Mulai
            </label>
            <input
              type="date"
              name="researchStartDate"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Tanggal Selesai
            </label>
            <input
              type="date"
              name="researchEndDate"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Mengirim...' : 'Kirim Pengajuan'}
          </button>
        </div>
      </div>
    </form>
  )
}
