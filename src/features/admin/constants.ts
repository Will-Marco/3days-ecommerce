export const BASE_URL = "http://localhost:3000";

export const ADMIN_API_ROUTES = {
  LOGIN: "/api/admin/login",
  REGISTER: "/api/admin/register",
  UPDATE: (id: string) => `/api/admin/register/${id}`,
  DELETE: (id: string) => `/api/admin/register/${id}`,
};
