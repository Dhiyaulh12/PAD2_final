'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { RequestType } from '@/lib/types/auth'

interface PlantIdentificationFormProps {
  onSuccess?: () => void
}

export function PlantIdentificationForm({ onSuccess }: PlantIdentificationFormProps) {
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
      type: RequestType.PLANT_IDENTIFICATION,
      title: formData.get('title'),
      description: formData.get('description'),
      plantSpecies: formData.get('plantSpecies'),
      plantLocation: formData.get('plantLocation'),
      plantImages: [],
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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Form Identifikasi Tanaman</h2>

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
            placeholder="Contoh: Identifikasi Tanaman PAD"
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
            placeholder="Jelaskan tanaman yang ingin diidentifikasi..."
          />
        </div>

        {/* Plant Species */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Spesies/Nama Tanaman (jika diketahui)
          </label>
          <input
            type="text"
            name="plantSpecies"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            placeholder="Contoh: Aloe Vera, Unknown species"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Lokasi Ditemukan
          </label>
          <input
            type="text"
            name="plantLocation"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            placeholder="Contoh: Area PAD Garden, Rumah kaca C"
          />
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
