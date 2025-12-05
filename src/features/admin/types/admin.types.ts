import { z } from 'zod';
import { AdminLoginFormSchema, AdminRegisterSchema } from '../schema/admin.schema';

export type IAdminLoginTypes = z.infer<typeof AdminLoginFormSchema>;

export type IAdminRegisterTypes = z.infer<typeof AdminRegisterSchema>;


export interface IAdmin {
    id: string;
    username: string;
    phoneNumber: string;
    createdAt: string;
  }
  
  export interface IAdminUpdateForm {
    username?: string;
    phoneNumber?: string;
    password?: string;
  }