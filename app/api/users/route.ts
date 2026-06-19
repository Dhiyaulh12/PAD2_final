import { NextRequest, NextResponse } from 'next/server'
import { MOCK_USERS } from '@/lib/mock-data'

export async function GET(request: NextRequest) {
  try {
    // Return all users (without passwords)
    const users = Object.values(MOCK_USERS).map(({ password, ...user }) => user)

    return NextResponse.json({
      success: true,
      data: users,
      total: users.length,
    })
  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat mengambil data users',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // In production, you would add a new user to the database
    // For now, just return success
    return NextResponse.json({
      success: true,
      message: 'User berhasil dibuat',
      data: body,
    })
  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat membuat user',
      },
      { status: 500 }
    )
  }
}
