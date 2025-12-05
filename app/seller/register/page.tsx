"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import CustomInput from "@/components/common/customInput";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { SELLER_API_ROUTES } from "@/src/features/seller/constants";
import { SellerRegisterSchema } from "@/src/features/seller/schema/seller.schema";
import { ISellerRegisterTypes } from "@/src/features/seller/types/seller.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useSellerAuth } from "@/src/contexts/SellerAuthContext";

export default function SellerRegister() {
  const router = useRouter();
  const { setSeller, isAuthenticated } = useSellerAuth();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/seller/dashboard");
    }
  }, [isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ISellerRegisterTypes>({
    resolver: zodResolver(SellerRegisterSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
    },
  });

  const onSubmit: SubmitHandler<ISellerRegisterTypes> = async (data) => {
    try {
      setError("");
      setSuccess("");
      const response = await axios.post(SELLER_API_ROUTES.REGISTER, data);

      const sellerData = response.data.seller;
      
      // Save seller data to localStorage via context
      setSeller({
        id: sellerData.id,
        email: sellerData.email,
        name: sellerData.name,
      });

      setSuccess(response.data.message || "Seller registered successfully");
      reset();
      
      // Redirect to dashboard after successful registration
      setTimeout(() => {
        router.push("/seller/dashboard");
      }, 500);
    } catch (error: any) {
      setError(
        error.response?.data?.error || "Failed to register seller"
      );
      console.error("Register error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Card className="w-full max-w-md bg-[#1E1E1E] p-8 rounded-xl shadow-lg border border-gray-700">
        <CardTitle className="text-2xl font-semibold mb-6 text-center text-white">
          Seller Register
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
              placeholder="seller@example.com"
            />

            <CustomInput
              errors={errors}
              register={register}
              type="text"
              name="name"
              label="Name"
              placeholder="John Doe"
            />

            <CustomInput
              errors={errors}
              register={register}
              type="text"
              name="phoneNumber"
              label="Phone Number"
              placeholder="998901234567"
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

