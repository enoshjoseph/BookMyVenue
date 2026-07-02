import api from "@/lib/axios";

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  role: string;

  businessName?: string;
  businessAddress?: string;
  panNumber?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export const register = async (data: RegisterRequest) => {
  const response = await api.post("/Auth/register", data);
  return response.data;
};

export const login = async (data: LoginRequest) => {
  const response = await api.post("/Auth/login", data);
  return response.data;
};

export const getAdminAllUsers = async () => {
  const response = await api.get("/Auth/admin/users");
  return response.data;
};