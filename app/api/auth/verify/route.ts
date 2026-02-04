import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    const target = searchParams.get('target') || '/dashboard'

    if (!token) {
      return NextResponse.redirect(new URL('/auth/error?error=invalid-token', request.url))
    }

    // Find the verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!verificationToken || new Date() > verificationToken.expires) {
      return NextResponse.redirect(new URL('/auth/error?error=expired-token', request.url))
    }

    // Create a session
    const session = await prisma.session.create({
      data: {
        userId: verificationToken.userId,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        sessionToken: crypto.randomUUID(),
      },
    })

    // Delete the used token
    await prisma.verificationToken.delete({
      where: { id: verificationToken.id },
    })

    // Create the response with the session cookie
    const response = NextResponse.redirect(new URL(target, request.url))
    
    // Set the session cookie
    response.cookies.set({
      name: 'session_token',
      value: session.sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: session.expires,
    })

    return response

  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.redirect(new URL('/auth/error?error=server-error', request.url))
  }
}
