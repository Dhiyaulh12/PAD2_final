import { NextRequest, NextResponse } from 'next/server'
import { getRequestById, updateRequest } from '@/lib/mock-data'
import { RequestStatus, UserRole } from '@/lib/types/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const foundRequest = getRequestById(id)

    if (!foundRequest) {
      return NextResponse.json(
        {
          success: false,
          message: 'Request tidak ditemukan',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: foundRequest,
    })
  } catch (error) {
    console.error('Get request detail error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat mengambil data request',
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { status, approvedBy, rejectionReason, startedAt, completedAt } = body

    // Validate status
    const validStatuses = Object.values(RequestStatus)
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Status tidak valid',
        },
        { status: 400 }
      )
    }

    // Update request
    const updated = updateRequest(id, {
      status: status || undefined,
      approvedBy: approvedBy || undefined,
      approvedAt: approvedBy ? new Date() : undefined,
      rejectionReason: rejectionReason || undefined,
      startedAt: startedAt ? new Date(startedAt) : undefined,
      completedAt: completedAt ? new Date(completedAt) : undefined,
    })

    if (!updated) {
      return NextResponse.json(
        {
          success: false,
          message: 'Request tidak ditemukan',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Request berhasil diupdate',
      data: updated,
    })
  } catch (error) {
    console.error('Update request error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat mengupdate request',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // In this mock implementation, we just return success
    // In production, actually delete from database
    return NextResponse.json({
      success: true,
      message: 'Request berhasil dihapus',
    })
  } catch (error) {
    console.error('Delete request error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat menghapus request',
      },
      { status: 500 }
    )
  }
}
