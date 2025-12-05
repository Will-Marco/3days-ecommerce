/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const { username, phoneNumber, password } = await req.json();

    const admin = await prisma.admin.findUnique({
      where: { id },
    });

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    const updatedData: any = {};

    if (username) updatedData.username = username;
    if (phoneNumber) updatedData.phoneNumber = phoneNumber;

    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    const updatedAdmin = await prisma.admin.update({
      where: { id },
      data: updatedData,
    });

    return NextResponse.json(
      { message: 'Admin updated', admin: updatedAdmin },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update admin error:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const admin = await prisma.admin.findUnique({
      where: { id },
    });

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    await prisma.admin.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Admin deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete admin error:', error);
    return NextResponse.json(
      { error: 'Failed to delete admin' },
      { status: 500 }
    );
  }
}
