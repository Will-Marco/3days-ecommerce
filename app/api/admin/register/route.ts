/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        username: true,
        phoneNumber: true,
        createdAt: true,
      },
      orderBy: { id: 'desc' },
    });

    return NextResponse.json({ admins }, { status: 200 });
  } catch (error) {
    console.error('GET admins error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admins' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { username, password, confirmPassword, phone_number } =
      await req.json();

    if (!username || !password || !confirmPassword || !phone_number) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    const existingAdmin = await prisma.admin.findUnique({
      where: { username },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 409 }
      );
    }

    const existingPhoneNumber = await prisma.admin.findUnique({
      where: { phoneNumber: phone_number },
    });

    if (existingPhoneNumber) {
      return NextResponse.json(
        { error: 'Phone number already taken' },
        { status: 409 }
      );
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newAdmin = await prisma.admin.create({
      data: {
        username,
        password: hashedPassword,
        phoneNumber: phone_number,
      },
    });

    return NextResponse.json(
      {
        message: 'Admin successfully created',
        admin: newAdmin,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Admin creation error:', error);
    return NextResponse.json(
      { error: 'Something went wrong!' },
      { status: 500 }
    );
  }
}