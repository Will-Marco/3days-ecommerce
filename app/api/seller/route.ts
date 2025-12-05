import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sellers = await prisma.seller.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phoneNumber: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { id: "desc" },
    });

    return NextResponse.json({ sellers }, { status: 200 });
  } catch (error) {
    console.error("GET sellers error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sellers" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { email, name, password, confirmPassword, phoneNumber } =
      await req.json();

    if (!email || !name || !password || !confirmPassword || !phoneNumber) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    // Validate phone number is a valid integer
    const phoneNumberInt = parseInt(phoneNumber, 10);
    if (isNaN(phoneNumberInt)) {
      return NextResponse.json(
        { error: "Phone number must be a valid number" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingSeller = await prisma.seller.findUnique({
      where: { email },
    });

    if (existingSeller) {
      return NextResponse.json(
        { error: "Email already taken" },
        { status: 409 }
      );
    }

    // Check if phone number already exists
    const existingPhoneNumber = await prisma.seller.findUnique({
      where: { phoneNumber: `+${phoneNumberInt}` },
    });

    if (existingPhoneNumber) {
      return NextResponse.json(
        { error: "Phone number already taken" },
        { status: 409 }
      );
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newSeller = await prisma.seller.create({
      data: {
        email,
        name,
        password: hashedPassword,
        phoneNumber: `+${phoneNumberInt}`,
      },
    });

    return NextResponse.json(
      {
        message: "Seller successfully created",
        seller: {
          id: newSeller.id,
          email: newSeller.email,
          name: newSeller.name,
          phoneNumber: newSeller.phoneNumber,
          createdAt: newSeller.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Seller creation error:", error);

    // Handle Prisma unique constraint errors
    if (error.code === "P2002") {
      const field = error.meta?.target?.[0];
      return NextResponse.json(
        { error: `${field} already exists` },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}
