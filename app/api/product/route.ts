import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        quantity: true,
        imageUrl: true,
        category: true,
        sellerId: true,
        customerId: true,
        createdAt: true,
        updatedAt: true,
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("GET products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const {
      name,
      description,
      price,
      quantity,
      imageUrl,
      category,
      sellerId,
      customerId,
    } = await req.json();

    // Validate required fields
    if (!name || !description || price === undefined || !quantity || !imageUrl || !category) {
      return NextResponse.json(
        { error: "All fields are required (name, description, price, quantity, imageUrl, category)" },
        { status: 400 }
      );
    }

    // Validate price is a number and positive
    const priceFloat = parseFloat(price);
    if (isNaN(priceFloat) || priceFloat < 0) {
      return NextResponse.json(
        { error: "Price must be a valid positive number" },
        { status: 400 }
      );
    }

    // Validate quantity is an integer and non-negative
    const quantityInt = parseInt(quantity, 10);
    if (isNaN(quantityInt) || quantityInt < 0) {
      return NextResponse.json(
        { error: "Quantity must be a valid non-negative integer" },
        { status: 400 }
      );
    }

    // If sellerId is provided, verify seller exists
    if (sellerId) {
      const seller = await prisma.seller.findUnique({
        where: { id: sellerId },
      });

      if (!seller) {
        return NextResponse.json(
          { error: "Seller not found" },
          { status: 404 }
        );
      }
    }

    // If customerId is provided, verify customer exists
    if (customerId) {
      const customer = await prisma.customer.findUnique({
        where: { id: customerId },
      });

      if (!customer) {
        return NextResponse.json(
          { error: "Customer not found" },
          { status: 404 }
        );
      }
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: priceFloat,
        quantity: quantityInt,
        imageUrl,
        category,
        sellerId: sellerId || null,
        customerId: customerId || null,
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Product successfully created",
        product: newProduct,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Product creation error:", error);

    // Handle Prisma foreign key constraint errors
    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "Invalid seller or customer ID" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}

