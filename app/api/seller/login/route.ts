import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find seller by email
    const seller = await prisma.seller.findUnique({
      where: { email },
    });

    if (!seller) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, seller.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Return seller data (without password)
    return NextResponse.json(
      {
        message: "Login successful",
        seller: {
          id: seller.id,
          email: seller.email,
          name: seller.name,
          phoneNumber: seller.phoneNumber,
          createdAt: seller.createdAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Seller login error:", error);
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}

