import { z } from "zod";
import {
  ProductCreateSchema,
  ProductUpdateSchema,
} from "../schema/product.schema";

export type IProductCreateTypes = z.infer<typeof ProductCreateSchema>;
export type IProductUpdateTypes = z.infer<typeof ProductUpdateSchema>;

export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
  category: string;
  sellerId: string | null;
  customerId: string | null;
  createdAt: string;
  updatedAt: string;
}

