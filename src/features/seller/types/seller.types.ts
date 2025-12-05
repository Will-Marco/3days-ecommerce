import { z } from "zod";
import {
  SellerLoginFormSchema,
  SellerRegisterSchema,
  SellerUpdateSchema,
} from "../schema/seller.schema";

export type ISellerLoginTypes = z.infer<typeof SellerLoginFormSchema>;
export type ISellerRegisterTypes = z.infer<typeof SellerRegisterSchema>;

export interface ISeller {
  id: string;
  email: string;
  name: string;
  phoneNumber: number;
  createdAt: string;
  updatedAt: string;
}

export interface ISellerUpdateForm {
  email?: string;
  name?: string;
  phoneNumber?: string;
  password?: string;
}

