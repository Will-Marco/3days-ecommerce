import { z } from "zod";
import {
  CustomerLoginFormSchema,
  CustomerRegisterSchema,
  CustomerUpdateSchema,
} from "../schema/customer.schema";

export type ICustomerLoginTypes = z.infer<typeof CustomerLoginFormSchema>;
export type ICustomerRegisterTypes = z.infer<typeof CustomerRegisterSchema>;

export interface ICustomer {
  id: string;
  email: string;
  name: string;
  phoneNumber: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICustomerUpdateForm {
  email?: string;
  name?: string;
  phoneNumber?: string;
  password?: string;
}

