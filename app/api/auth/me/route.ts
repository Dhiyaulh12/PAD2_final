import { NextRequest, NextResponse } from 'next/server'
import { MOCK_USERS, decodeBase64, verifyTokenFormat } from '@/lib/auth-utils'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader) {
      return NextResponse.json(
        {
          success: false,
          message: 'Token tidak ditemukan',
        },
        { status: 401 }
      )
    }

    // Extract token from "Bearer token" format
    const token = authHeader.split(' ')[1]

    if (!token || !verifyTokenFormat(token)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Token tidak valid',
        },
        { status: 401 }
      )
    }

    // Decode token and get userId
    const decoded = JSON.parse(decodeBase64(token))
    const userId = decoded.userId

    // Find user from MOCK_USERS
    let foundUser = null
    for (const userKey in MOCK_USERS) {
      if (MOCK_USERS[userKey as keyof typeof MOCK_USERS].user.id === userId) {
        foundUser = MOCK_USERS[userKey as keyof typeof MOCK_USERS].user
        break
      }
    }

    if (!foundUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'User tidak ditemukan',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'User ditemukan',
      user: foundUser,
    })
  } catch (error) {
    console.error('Get current user error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat mengambil data user',
      },
      { status: 500 }
    )
  }
}
