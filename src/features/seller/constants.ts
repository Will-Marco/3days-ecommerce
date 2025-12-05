export const BASE_URL = "http://localhost:3000";

export const SELLER_API_ROUTES = {
  LOGIN: "/api/seller/login",
  REGISTER: "/api/seller",
  UPDATE: (id: string) => `/api/seller/${id}`,
  DELETE: (id: string) => `/api/seller/${id}`,
};
