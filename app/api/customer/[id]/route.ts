/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const { email, name, phoneNumber, password } = await req.json();

    const customer = await prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    const updatedData: any = {};

    if (email) updatedData.email = email;
    if (name) updatedData.name = name;

    if (phoneNumber !== undefined) {
      const phoneNumberInt = parseInt(phoneNumber, 10);
      if (isNaN(phoneNumberInt)) {
        return NextResponse.json(
          { error: "Phone number must be a valid number" },
          { status: 400 }
        );
      }
      updatedData.phoneNumber = phoneNumberInt;
    }

    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: updatedData,
      select: {
        id: true,
        email: true,
        name: true,
        phoneNumber: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      { message: "Customer updated", customer: updatedCustomer },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update customer error:", error);

    // Handle Prisma unique constraint errors
    if (error.code === "P2002") {
      const field = error.meta?.target?.[0];
      return NextResponse.json(
        { error: `${field} already exists` },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const customer = await prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    await prisma.customer.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Customer deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete customer error:", error);
    return NextResponse.json(
      { error: "Failed to delete customer" },
      { status: 500 }
    );
  }
}

