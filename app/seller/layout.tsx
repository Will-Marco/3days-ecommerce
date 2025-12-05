"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, LogOut, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSellerAuth } from "@/src/contexts/SellerAuthContext";
import ProtectedRoute from "@/src/components/auth/ProtectedRoute";
import { ISeller } from "@/src/features/seller/types/seller.types";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { seller, logout } = useSellerAuth();

  const handleLogout = () => {
    logout();
    router.push("/seller/login");
  };

  console.log(seller);

  const navItems = [
    {
      href: "/seller/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/seller/products",
      label: "My Products",
      icon: Package,
    },
  ];

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      {seller ? (
        <aside className="w-64 bg-[#1E1E1E] border-r border-gray-700 flex flex-col">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Seller Panel</h2>
            {seller ? (
              <p className="text-sm text-gray-400 mt-1">
                  {(seller as ISeller).name}
                </p>
              ) : null}
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      isActive
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-700 space-y-2">
            <Link href="/seller">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </aside>
      ) : null}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <ProtectedRoute>{children}</ProtectedRoute>
      </main>
    </div>
  );
}
