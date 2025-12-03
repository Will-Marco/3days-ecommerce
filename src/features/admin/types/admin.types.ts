import { z } from 'zod';
import { AdminLoginFormSchema, AdminRegisterSchema } from '../schema/admin.schema';

export type IAdminLoginTypes = z.infer<typeof AdminLoginFormSchema>;


export type IAdminRegisterTypes = z.infer<typeof AdminRegisterSchema>;
