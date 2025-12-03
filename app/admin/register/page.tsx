'use client';

import CustomInput from '@/components/common/customInput';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { AdminRegisterSchema } from '@/src/features/admin/schema/admin.schema';
import { IAdminRegisterTypes } from '@/src/features/admin/types/admin.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';

export default function AdminRegister() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IAdminRegisterTypes>({
    resolver: zodResolver(AdminRegisterSchema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      phone_number: '',
    },
  });

  const onSubmit: SubmitHandler<IAdminRegisterTypes> = (data) => {
    console.log('Register data: ', data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Card className="w-full max-w-md bg-[#1E1E1E] p-8 rounded-xl shadow-lg border border-gray-700">
        <CardTitle className="text-2xl font-semibold mb-6 text-center text-white">
          Admin Register
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
              name="username"
            />

            <CustomInput
              errors={errors}
              register={register}
              type="text"
              name="phone_number"
              label="Phone Number"
            />

            <CustomInput
              errors={errors}
              register={register}
              type="password"
              name="password"
              label="Password"
            />

            <CustomInput
              errors={errors}
              register={register}
              type="password"
              name="confirmPassword"
              label="Confirm Password"
            />

            <button
              type="submit"
              className="py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white"
            >
              Register
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
