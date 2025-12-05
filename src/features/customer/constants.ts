export const BASE_URL = "http://localhost:3000";

export const CUSTOMER_API_ROUTES = {
  LOGIN: "/api/customer/login",
  REGISTER: "/api/customer",
  UPDATE: (id: string) => `/api/customer/${id}`,
  DELETE: (id: string) => `/api/customer/${id}`,
};

