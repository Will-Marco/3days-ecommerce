export const BASE_URL = "http://localhost:3000";

export const PRODUCT_API_ROUTES = {
  BASE: "/api/product",
  BY_SELLER: (sellerId: string) => `/api/product/seller/${sellerId}`,
  BY_ID: (id: string) => `/api/product/${id}`,
};

