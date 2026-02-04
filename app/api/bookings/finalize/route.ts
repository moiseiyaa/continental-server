import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

interface BookingRequest {
  tripId: string
  fullName: string
  email: string
  phone: string
  country: string
  paymentType: 'reserve' | 'pay-now'
}

export async function POST(request: Request) {
  try {
    const body: BookingRequest = await request.json()
    const { tripId, email, fullName, phone, country, paymentType } = body

    // Step 1: Find or create user
    let user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Create a ghost account
      user = await prisma.user.create({
        data: {
          email,
          name: fullName,
          phone,
          country,
          hasPassword: false,
        },
      })
    }

    // Step 2: Create booking
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 48) // 48-hour reservation

    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        tripId,
        status: paymentType === 'reserve' ? 'RESERVED' : 'PENDING',
        expiresAt: paymentType === 'reserve' ? expiresAt : null,
        totalAmount: 0, // You'll need to calculate this
        currency: 'USD', // Set appropriate currency
        guestInfo: {
          fullName,
          email,
          phone,
          country,
        },
      },
    })

    // Step 3: Generate magic link token
    const token = uuidv4()
    const expires = new Date()
    expires.setHours(expires.getHours() + 24) // 24-hour token

    await prisma.verificationToken.create({
      data: {
        identifier: user.id,
        token,
        expires,
      },
    })

    // Step 4: Send confirmation email with magic link
    const magicLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}&target=/dashboard/bookings/${booking.id}`
    
    // TODO: Implement email sending with your email service
    // await sendConfirmationEmail(user.email, magicLink, booking.id)

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      message: 'Booking created successfully',
    })

  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json(
      { error: 'Failed to process booking' },
      { status: 500 }
    )
  }
}
