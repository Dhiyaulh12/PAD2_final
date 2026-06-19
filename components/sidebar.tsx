'use client'

import { useAuth } from '@/lib/auth-context'
import { UserRole } from '@/lib/types/auth'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Leaf, LogOut, Home, FileText, Leaf as PlantIcon, Zap, Clock, CheckCircle, Users, BarChart3, Settings } from 'lucide-react'

export function Sidebar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  if (!user) return null

  const getMenuItems = () => {
    const commonItems = [
      { href: '/dashboard', label: 'Dashboard', icon: Home },
    ]

    const studentItems = [
      { href: '/dashboard/research', label: 'Research Request', icon: FileText },
      { href: '/dashboard/plant-identification', label: 'Plant Identification', icon: PlantIcon },
      { href: '/dashboard/equipment', label: 'Equipment Loan', icon: Zap },
      { href: '/dashboard/overtime', label: 'Overtime Request', icon: Clock },
    ]

    const assistantItems = [
      { href: '/dashboard/research', label: 'Research Request', icon: FileText },
      { href: '/dashboard/overtime', label: 'Overtime Request', icon: Clock },
      { href: '/dashboard/approvals', label: 'Approvals Queue', icon: CheckCircle },
    ]

    const adminItems = [
      { href: '/dashboard/research', label: 'All Requests', icon: FileText },
      { href: '/dashboard/users', label: 'User Management', icon: Users },
      { href: '/dashboard/reports', label: 'Reports', icon: BarChart3 },
      { href: '/dashboard/settings', label: 'Settings', icon: Settings },
    ]

    let items = commonItems

    if (user.role === UserRole.MAHASISWA) {
      items = [...commonItems, ...studentItems]
    } else if (user.role === UserRole.ASISTEN_PRAKTIKUM) {
      items = [...commonItems, ...assistantItems]
    } else if (user.role === UserRole.ADMIN) {
      items = [...commonItems, ...adminItems]
    }

    return items
  }

  const menuItems = getMenuItems()

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">PAD Lab</h1>
            <p className="text-xs text-gray-500">System Manajemen</p>
          </div>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-gray-200 space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm font-semibold text-gray-900">{user.name}</p>
          <p className="text-xs text-gray-500 mt-1">{user.email}</p>
          <div className="mt-3">
            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
              {user.role.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>

        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
