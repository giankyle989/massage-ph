import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { requireAdmin } from '@/lib/auth-guard';
import { prisma } from '@/lib/db';
import { ChangePasswordSchema } from '@/lib/validators';

export async function PUT(request: NextRequest) {
  const { error, session } = await requireAdmin();
  if (error || !session) return error;

  const body = await request.json();
  const result = ChangePasswordSchema.safeParse(body);

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    result.error.issues.forEach((err) => {
      const field = err.path.join('.');
      fieldErrors[field] = err.message;
    });
    return NextResponse.json({ error: fieldErrors }, { status: 400 });
  }

  const user = await prisma.adminUser.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const passwordMatch = await bcrypt.compare(result.data.currentPassword, user.passwordHash);
  if (!passwordMatch) {
    return NextResponse.json(
      { error: { currentPassword: 'Current password is incorrect' } },
      { status: 400 }
    );
  }

  const newHash = await bcrypt.hash(result.data.newPassword, 10);
  await prisma.adminUser.update({
    where: { id: user.id },
    data: { passwordHash: newHash },
  });

  return NextResponse.json({ message: 'Password changed successfully' });
}
