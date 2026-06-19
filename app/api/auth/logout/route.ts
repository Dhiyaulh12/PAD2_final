import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Logout logic - token dihapus dari client-side (localStorage)
    // Backend hanya return success response
    return NextResponse.json({
      success: true,
      message: 'Logout berhasil',
    })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat logout',
      },
      { status: 500 }
    )
  }
}
