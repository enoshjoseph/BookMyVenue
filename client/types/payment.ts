export interface PaymentOrder {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  paymentType: string;
}

export interface PaymentVerifyRequest {
  bookingId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  paymentType: string;
}
