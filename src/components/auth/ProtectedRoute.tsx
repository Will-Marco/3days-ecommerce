"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSellerAuth } from "@/src/contexts/SellerAuthContext";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useSellerAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/seller/login");
    }
  }, [isAuthenticated, router]);

  return <>{children}</>;
}
