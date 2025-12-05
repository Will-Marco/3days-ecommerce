"use client";

import CustomInput from "@/components/common/customInput";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { CUSTOMER_API_ROUTES } from "@/src/features/customer/constants";
import { CustomerLoginFormSchema } from "@/src/features/customer/schema/customer.schema";
import { ICustomerLoginTypes } from "@/src/features/customer/types/customer.types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";

export default function CustomerLogin() {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICustomerLoginTypes>({
    resolver: zodResolver(CustomerLoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<ICustomerLoginTypes> = async (data) => {
    try {
      setError("");
      setSuccess("");
      const response = await axios.post(CUSTOMER_API_ROUTES.LOGIN, data);

      setSuccess(response.data.message || "Login successful");
      console.log("Customer data:", response.data.customer);

      // Here you can redirect or store the customer data
      // For example: router.push('/customer/dashboard');
      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to login");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Card className="w-full max-w-md bg-[#1E1E1E] p-8 rounded-xl shadow-lg border border-gray-700">
        <CardTitle className="text-2xl font-semibold mb-6 text-center text-white">
          Customer Login
        </CardTitle>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-900/50 border border-green-700 rounded-lg text-green-200 text-sm">
            {success}
          </div>
        )}

        <CardContent>
          <form
            className="flex flex-col space-y-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <CustomInput
              errors={errors}
              register={register}
              type="email"
              label="Email"
              name="email"
              placeholder="customer@example.com"
            />

            <CustomInput
              errors={errors}
              register={register}
              type="password"
              label="Password"
              name="password"
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

