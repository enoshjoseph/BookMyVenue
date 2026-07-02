export interface Booking {
  id: string;
  venueId: string;
  venueName: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  advanceAmount: number;
  balanceAmount: number;
  balanceDueDate: string | null;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

export interface CreateBookingRequest {
  venueId: string;
  startDate: string;
  endDate: string;
}
