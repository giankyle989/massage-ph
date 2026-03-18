import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { CUSTOMER_PAGE_SIZE } from '@/lib/constants';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const region = searchParams.get('region') || undefined;
  const city = searchParams.get('city') || undefined;
  const category = searchParams.get('category') || undefined;
  const search = searchParams.get('search') || undefined;

  const where: Prisma.ListingWhereInput = {
    isActive: true,
    ...(region && { region }),
    ...(city && { city }),
    ...(category && { category }),
    ...(search && { name: { contains: search, mode: 'insensitive' } }),
  };

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      include: { services: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * CUSTOMER_PAGE_SIZE,
      take: CUSTOMER_PAGE_SIZE,
    }),
    prisma.listing.count({ where }),
  ]);

  return NextResponse.json({
    data: listings,
    total,
    page,
    pageSize: CUSTOMER_PAGE_SIZE,
    totalPages: Math.ceil(total / CUSTOMER_PAGE_SIZE),
  });
}
