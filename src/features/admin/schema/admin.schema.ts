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


export const AdminRegisterSchema = z
  .object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    phone_number: z
      .string()
      .regex(
        /^\+998\d{9}$/,
        'Phone number must be in the format +998XXXXXXXXX'
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });