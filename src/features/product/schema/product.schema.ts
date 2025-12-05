import { z } from "zod";

export const ProductCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be a positive number"),
  quantity: z
    .number()
    .int("Quantity must be an integer")
    .nonnegative("Quantity must be non-negative"),
  imageUrl: z.string().url("Image URL must be a valid URL"),
  category: z.string().min(1, "Category is required"),
  sellerId: z.string().optional(),
  customerId: z.string().optional(),
});

export const ProductUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  price: z.number().positive("Price must be a positive number").optional(),
  quantity: z
    .number()
    .int("Quantity must be an integer")
    .nonnegative("Quantity must be non-negative")
    .optional(),
  imageUrl: z.string().url("Image URL must be a valid URL").optional(),
  category: z.string().min(1, "Category is required").optional(),
});
