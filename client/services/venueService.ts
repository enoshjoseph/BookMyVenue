import api from '@/lib/axios';
import type { Venue, VenueSearchParams, CreateVenueRequest } from '@/types/venue';

export const getAllVenues = async () => {
  const response = await api.get("/Venue");
  return response.data;
};

export const getVenueById = async (id: string) => {
  const response = await api.get(`/Venue/${id}`);
  return response.data;
};

export const searchVenues = async (params: VenueSearchParams) => {
  const query = new URLSearchParams();
  if (params.city) query.append("City", params.city);
  if (params.type) query.append("Type", params.type);
  if (params.capacity) query.append("Capacity", params.capacity.toString());
  if (params.maxPrice) query.append("MaxPrice", params.maxPrice.toString());
  if (params.startDate) query.append("StartDate", params.startDate);
  if (params.endDate) query.append("EndDate", params.endDate);

  const response = await api.get(`/Venue?${query.toString()}`);
  return response.data;
};

export const getMyVenues = async () => {
  const response = await api.get("/Venue/my");
  return response.data;
};

export const createVenue = async (data: CreateVenueRequest) => {
  const response = await api.post("/Venue", data);
  return response.data;
};

export const updateVenue = async (id: string, data: CreateVenueRequest) => {
  const response = await api.put(`/Venue/${id}`, data);
  return response.data;
};

export const blockDates = async (
  venueId: string,
  data: { startDate: string; endDate: string; blockedReason: number; customerName?: string; customerPhone?: string }
) => {
  const response = await api.post(`/Venue/${venueId}/block-dates`, data);
  return response.data;
};

export const uploadVenueImages = async (files: File[]): Promise<{ urls: string[] }> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });
  const response = await api.post("/Venue/upload-images", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getAdminAllVenues = async (): Promise<Venue[]> => {
  const response = await api.get("/Venue/admin/all");
  return response.data;
};

export const approveVenue = async (id: string) => {
  const response = await api.put(`/Venue/${id}/approve`);
  return response.data;
};

export const rejectVenue = async (id: string) => {
  const response = await api.put(`/Venue/${id}/reject`);
  return response.data;
};