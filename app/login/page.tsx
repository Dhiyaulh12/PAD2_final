'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Leaf, Mail, Lock, AlertCircle } from 'lucide-react'
import { UserRole } from '@/lib/types/auth'
import { useAuth } from '@/lib/auth-context'

export default function LoginPage() {
  const router = useRouter()
  const { user, isLoading: authLoading, login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [role, setRole] = useState<UserRole>(UserRole.MAHASISWA)

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard')
    }
  }, [user, authLoading, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validasi input
    if (!email || !password) {
      setError('Email dan password harus diisi')
      setLoading(false)
      return
    }

    if (!email.includes('@')) {
      setError('Format email tidak valid')
      setLoading(false)
      return
    }

    try {
      await login(email.trim().toLowerCase(), password, role)
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login gagal. Silakan coba lagi.')
      setLoading(false)
    }
  }

  const handleDemoLogin = async (demoRole: UserRole) => {
    const demoCredentials: Record<UserRole, { email: string; password: string }> = {
      [UserRole.MAHASISWA]: {
        email: 'mahasiswa@pad2lab.edu',
        password: 'password123',
      },
      [UserRole.ASISTEN_PRAKTIKUM]: {
        email: 'asisten@pad2lab.edu',
        password: 'password123',
      },
      [UserRole.ADMIN]: {
        email: 'admin@pad2lab.edu',
        password: 'password123',
      },
    }
    
    const creds = demoCredentials[demoRole]
    setEmail(creds.email)
    setPassword(creds.password)
    setRole(demoRole)
    setError('')
    setLoading(true)

    try {
      await login(creds.email, creds.password, demoRole)
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login demo gagal. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Logo and Header */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">PAD Lab</h1>
            </div>
          </div>

          <h2 className="text-center text-xl font-semibold text-white mb-2">Selamat Datang</h2>
          <p className="text-center text-slate-400 text-sm mb-8">Sistem Manajemen Tanaman PAD Laboratory</p>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4 mb-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                  placeholder="user@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-slate-300 mb-2">
                Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all"
              >
                <option value={UserRole.MAHASISWA}>Mahasiswa</option>
                <option value={UserRole.ASISTEN_PRAKTIKUM}>Asisten Praktikum</option>
                <option value={UserRole.ADMIN}>Admin</option>
              </select>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || authLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Loading...' : 'Masuk'}
            </Button>
          </form>

          {/* Demo Users */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Demo Accounts</p>
            <div className="space-y-2">
              <button
                onClick={() => handleDemoLogin(UserRole.MAHASISWA)}
                disabled={loading || authLoading}
                className="w-full p-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <p className="text-sm font-medium text-emerald-300">Mahasiswa</p>
                <p className="text-xs text-slate-400">mahasiswa@pad2lab.edu</p>
              </button>

              <button
                onClick={() => handleDemoLogin(UserRole.ASISTEN_PRAKTIKUM)}
                disabled={loading || authLoading}
                className="w-full p-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <p className="text-sm font-medium text-blue-300">Asisten Praktikum</p>
                <p className="text-xs text-slate-400">asisten@pad2lab.edu</p>
              </button>

              <button
                onClick={() => handleDemoLogin(UserRole.ADMIN)}
                disabled={loading || authLoading}
                className="w-full p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <p className="text-sm font-medium text-red-300">Admin</p>
                <p className="text-xs text-slate-400">admin@pad2lab.edu</p>
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="mt-6 pt-6 border-t border-white/10 text-center text-xs text-slate-500">
            <p>Password untuk semua akun: <span className="text-slate-400">password123</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}
