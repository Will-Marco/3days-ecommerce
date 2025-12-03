import { z } from 'zod';

export const AdminLoginFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username eng kamida 2ta belgidan iborat bo'lishi kerak",
    })
    .max(16, {
      message: "Username eng ko'pida 16ta belgidan iborat bo'lishi kerak",
    }),
  password: z
    .string()
    .min(6, {
      message: "Password eng kamida 2ta belgidan iborat bo'lishi kerak",
    })
    .max(16, {
      message: "Password eng ko'pida 16ta belgidan iborat bo'lishi kerak",
    }),
});
