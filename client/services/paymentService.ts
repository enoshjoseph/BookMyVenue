import api from '@/lib/axios';
import type { PaymentVerifyRequest } from '@/types/payment';

export const createPaymentOrder = async (bookingId: string) => {
  const response = await api.post(`/Payment/order/${bookingId}`);
  return response.data;
};

export const verifyPayment = async (data: PaymentVerifyRequest) => {
  const response = await api.post("/Payment/verify", data);
  return response.data;
};
