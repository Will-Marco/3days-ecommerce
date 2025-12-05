import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogIn, UserPlus } from "lucide-react";

export default function Seller() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <Card className="w-full max-w-2xl bg-[#1E1E1E] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-2xl text-center">
            Seller Panel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/seller/login" className="block">
              <Button
                variant="outline"
                className="w-full h-24 flex flex-col items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 border-gray-700 text-white"
              >
                <LogIn className="w-6 h-6" />
                <span>Login</span>
              </Button>
            </Link>
            <Link href="/seller/register" className="block">
              <Button
                variant="outline"
                className="w-full h-24 flex flex-col items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 border-gray-700 text-white"
              >
                <UserPlus className="w-6 h-6" />
                <span>Register</span>
              </Button>
            </Link>
            <Link href="/seller/dashboard" className="block">
              <Button
                variant="outline"
                className="w-full h-24 flex flex-col items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 border-gray-700 text-white"
              >
                <LayoutDashboard className="w-6 h-6" />
                <span>Dashboard</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
