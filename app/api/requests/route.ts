import { NextRequest, NextResponse } from 'next/server'
import { getAllRequests, addRequest, getUserRequests } from '@/lib/mock-data'
import { MOCK_USERS } from '@/lib/mock-data'
import { Request as RequestType, RequestStatus, UserRole } from '@/lib/types/auth'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const role = searchParams.get('role')

    let requests = getAllRequests()

    // Filter by userId if provided
    if (userId) {
      requests = requests.filter(req => req.userId === userId)
    }

    // Filter by role - Mahasiswa only sees own requests
    // Asisten sees all requests for approval
    // Admin sees all requests
    if (role === UserRole.MAHASISWA && userId) {
      requests = requests.filter(req => req.userId === userId)
    }

    return NextResponse.json({
      success: true,
      data: requests,
      total: requests.length,
    })
  } catch (error) {
    console.error('Get requests error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat mengambil data requests',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      type,
      title,
      description,
      researchTitle,
      researchArea,
      researchStartDate,
      researchEndDate,
      plantSpecies,
      plantLocation,
      plantImages,
      equipmentName,
      equipmentQuantity,
      loanStartDate,
      loanEndDate,
      overtimeDate,
      overtimeHours,
      overtimeReason,
    } = body

    // Find user name
    let userName = 'Unknown'
    for (const userKey in MOCK_USERS) {
      if (MOCK_USERS[userKey as keyof typeof MOCK_USERS].id === userId) {
        userName = MOCK_USERS[userKey as keyof typeof MOCK_USERS].name
        break
      }
    }

    // Create new request
    const newRequest: RequestType = {
      id: `req_${Date.now()}`,
      userId,
      userName,
      type,
      title,
      description,
      status: RequestStatus.PENDING,
      researchTitle,
      researchArea,
      researchStartDate: researchStartDate ? new Date(researchStartDate) : undefined,
      researchEndDate: researchEndDate ? new Date(researchEndDate) : undefined,
      plantSpecies,
      plantLocation,
      plantImages,
      equipmentName,
      equipmentQuantity,
      loanStartDate: loanStartDate ? new Date(loanStartDate) : undefined,
      loanEndDate: loanEndDate ? new Date(loanEndDate) : undefined,
      overtimeDate: overtimeDate ? new Date(overtimeDate) : undefined,
      overtimeHours,
      overtimeReason,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const created = addRequest(newRequest)

    return NextResponse.json({
      success: true,
      message: 'Request berhasil dibuat',
      data: created,
    })
  } catch (error) {
    console.error('Create request error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat membuat request',
      },
      { status: 500 }
    )
  }
}
