'use client';
import CustomInput from '@/components/common/customInput';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { AdminLoginFormSchema } from '@/src/features/admin/schema/admin.schema';
import { IAdminLoginTypes } from '@/src/features/admin/types/admin.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

export default function AdminLogin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof AdminLoginFormSchema>>({
    resolver: zodResolver(AdminLoginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
  const onSubmit: SubmitHandler<IAdminLoginTypes> = (data) => {
    console.log(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Card className="w-full max-w-md bg-[#1E1E1E] p-8 rounded-xl shadow-lg border border-gray-700">
        <CardTitle className="text-2xl font-semibold mb-6 text-center text-white">
          Admin Login
        </CardTitle>
        <CardContent>
          <form
            className="flex flex-col space-y-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <CustomInput
              errors={errors}
              register={register}
              type="text"
              label="Username"
            />

            <CustomInput
              errors={errors}
              register={register}
              type="password"
              label="Password"
            />

            <button
              type="submit"
              className="py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white"
            >
              Login
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
