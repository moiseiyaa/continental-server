import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';

const prisma = new PrismaClient();

async function cancelExpiredReservations() {
  try {
    const now = dayjs().toISOString();

    // Find expired reservations
    const expiredReservations = await prisma.booking.findMany({
      where: {
        status: 'RESERVED',
        expiresAt: {
          lte: now,
        },
      },
    });

    // Cancel each expired reservation
    for (const reservation of expiredReservations) {
      await prisma.booking.update({
        where: { id: reservation.id },
        data: { status: 'CANCELLED' },
      });

      // Optionally, refund spots to the trip
      await prisma.trip.update({
        where: { id: reservation.tripId },
        data: {
          availableSpots: {
            increment: reservation.guests,
          },
        },
      });
    }

    console.log(`${expiredReservations.length} expired reservations cancelled.`);
  } catch (error) {
    console.error('Error cancelling expired reservations:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cancelExpiredReservations();