// Minimal payment service stub — replace with real provider integration (Stripe, etc.)
export const verifyPayment = async (paymentIntentId?: string): Promise<boolean> => {
  // In a real implementation you'd call Stripe's API to verify the payment intent status.
  // For now, consider any non-empty id as successful verification.
  if (!paymentIntentId) return false
  return true
}

export default { verifyPayment }
