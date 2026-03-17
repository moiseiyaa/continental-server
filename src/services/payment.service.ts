import Stripe from 'stripe';

// Initialize Stripe only if API key is available
const getStripe = () => {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured. Please set it in your environment variables.');
  }
  return new Stripe(apiKey, {
    apiVersion: '2025-12-15.clover' as any,
  });
};

export const verifyPayment = async (paymentIntentId?: string): Promise<boolean> => {
  if (!paymentIntentId) return false;

  try {
    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent.status === 'succeeded';
  } catch (error) {
    console.error('Error verifying payment:', error);
    return false;
  }
};

export default { verifyPayment };
