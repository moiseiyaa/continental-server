// server/src/services/flutterwave.service.ts
import axios from 'axios';

interface FlutterwavePaymentData {
  bookingId: string;
  email: string;
  amount: number;
  fullName: string;
  phoneNumber: string;
  currency?: string;
}

const FLUTTERWAVE_API_URL = process.env.FLUTTERWAVE_API_URL || 'https://api.flutterwave.com/v3';
const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;

/**
 * Initialize a Flutterwave payment transaction
 */
export const initializePayment = async (paymentData: FlutterwavePaymentData) => {
  try {
    if (!FLUTTERWAVE_SECRET_KEY) {
      throw new Error('FLUTTERWAVE_SECRET_KEY not configured');
    }

    const response = await axios.post(
      `${FLUTTERWAVE_API_URL}/payments`,
      {
        tx_ref: `booking_${paymentData.bookingId}_${Date.now()}`,
        amount: paymentData.amount,
        currency: paymentData.currency || 'USD',
        payment_options: 'card,account,ussd',
        customer: {
          email: paymentData.email,
          phone_number: paymentData.phoneNumber,
          name: paymentData.fullName,
        },
        customizations: {
          title: 'Continental Travels',
          description: `Booking Payment #${paymentData.bookingId}`,
          logo: process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/logo.png` : '',
        },
        redirect_url: `${process.env.FRONTEND_URL}/booking/callback`,
      },
      {
        headers: {
          Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Flutterwave initialization error:', error);
    throw error;
  }
};

/**
 * Verify a Flutterwave payment transaction
 */
export const verifyPayment = async (transactionId: string) => {
  try {
    if (!FLUTTERWAVE_SECRET_KEY) {
      throw new Error('FLUTTERWAVE_SECRET_KEY not configured');
    }

    const response = await axios.get(
      `${FLUTTERWAVE_API_URL}/transactions/${transactionId}/verify`,
      {
        headers: {
          Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Flutterwave verification error:', error);
    throw error;
  }
};

/**
 * Get transaction details
 */
export const getTransaction = async (transactionId: string) => {
  try {
    if (!FLUTTERWAVE_SECRET_KEY) {
      throw new Error('FLUTTERWAVE_SECRET_KEY not configured');
    }

    const response = await axios.get(
      `${FLUTTERWAVE_API_URL}/transactions/${transactionId}`,
      {
        headers: {
          Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Get transaction error:', error);
    throw error;
  }
};

/**
 * Refund a transaction
 */
export const refundPayment = async (transactionId: string, amount?: number) => {
  try {
    if (!FLUTTERWAVE_SECRET_KEY) {
      throw new Error('FLUTTERWAVE_SECRET_KEY not configured');
    }

    const response = await axios.post(
      `${FLUTTERWAVE_API_URL}/transactions/${transactionId}/refund`,
      amount ? { amount } : {},
      {
        headers: {
          Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Flutterwave refund error:', error);
    throw error;
  }
};

/**
 * Verify webhook signature
 */
export const verifyWebhookSignature = (
  payload: any,
  signature: string
): boolean => {
  try {
    const crypto = require('crypto');
    const secretKey = process.env.FLUTTERWAVE_SECRET_KEY || '';

    const computedHash = crypto
      .createHmac('sha256', secretKey)
      .update(JSON.stringify(payload))
      .digest('hex');

    return computedHash === signature;
  } catch (error) {
    console.error('Webhook signature verification error:', error);
    return false;
  }
};
