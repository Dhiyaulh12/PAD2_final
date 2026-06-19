import { NextRequest, NextResponse } from 'next/server'
import { MOCK_USERS, credentialsMatch, generateMockToken } from '@/lib/auth-utils'
import { LoginRequest, LoginResponse } from '@/lib/types/auth'

export async function POST(request: NextRequest): Promise<NextResponse<LoginResponse>> {
  try {
    const body: LoginRequest = await request.json()
    const { email, password } = body

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email dan password harus diisi',
        },
        { status: 400 }
      )
    }

    const normalizedEmail = email.trim().toLowerCase()

    // Find matching user by credentials.
    // Role tidak boleh dijadikan sumber kebenaran dari input user;
    // role diambil dari data user yang berhasil diautentikasi.
    let foundUser = null
    
    for (const userKey in MOCK_USERS) {
      const mockUserEntry = MOCK_USERS[userKey as keyof typeof MOCK_USERS]
      if (credentialsMatch(mockUserEntry, normalizedEmail, password)) {
        foundUser = mockUserEntry
        break
      }
    }

    if (!foundUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email atau password salah',
        },
        { status: 401 }
      )
    }

    // Generate token
    const token = generateMockToken(foundUser.user.id)

    return NextResponse.json({
      success: true,
      message: 'Login berhasil',
      user: foundUser.user,
      token,
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat login',
      },
      { status: 500 }
    )
  }
}
