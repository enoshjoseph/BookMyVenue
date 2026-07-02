import api from '@/lib/axios';
import type { CreateBookingRequest } from '@/types/booking';

export const createBooking = async (data: CreateBookingRequest) => {
  const response = await api.post("/Booking", data);
  return response.data;
};

export const getMyBookings = async () => {
  const response = await api.get("/Booking/my");
  return response.data;
};

export const getBookingById = async (id: string) => {
  const response = await api.get(`/Booking/${id}`);
  return response.data;
};

export const getVenueBookings = async (venueId: string) => {
  const response = await api.get(`/Booking/venue/${venueId}`);
  return response.data;
};

export const confirmBooking = async (id: string) => {
  const response = await api.put(`/Booking/${id}/confirm`);
  return response.data;
};

export const declineBooking = async (id: string) => {
  const response = await api.put(`/Booking/${id}/decline`);
  return response.data;
};

export const cancelBooking = async (id: string) => {
  const response = await api.put(`/Booking/${id}/cancel`);
  return response.data;
};

export const getAdminAllBookings = async () => {
  const response = await api.get("/Booking/admin/all");
  return response.data;
};
