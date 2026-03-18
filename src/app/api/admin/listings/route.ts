import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-guard';
import { prisma } from '@/lib/db';
import { ListingCreateSchema } from '@/lib/validators';
import { generateSlug } from '@/lib/slug';
import { ADMIN_PAGE_SIZE } from '@/lib/constants';

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const search = searchParams.get('search') || '';

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { region: { contains: search, mode: 'insensitive' as const } },
          { city: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {};

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      include: { services: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * ADMIN_PAGE_SIZE,
      take: ADMIN_PAGE_SIZE,
    }),
    prisma.listing.count({ where }),
  ]);

  return NextResponse.json({
    data: listings,
    total,
    page,
    pageSize: ADMIN_PAGE_SIZE,
    totalPages: Math.ceil(total / ADMIN_PAGE_SIZE),
  });
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const result = ListingCreateSchema.safeParse(body);

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    result.error.issues.forEach((err) => {
      const field = err.path.join('.');
      fieldErrors[field] = err.message;
    });
    return NextResponse.json({ error: fieldErrors }, { status: 400 });
  }

  const { services, ...listingData } = result.data;

  // Generate unique slug
  let slug = generateSlug(listingData.name);
  let suffix = 1;
  while (await prisma.listing.findUnique({ where: { slug } })) {
    suffix++;
    slug = `${generateSlug(listingData.name)}-${suffix}`;
  }

  const listing = await prisma.listing.create({
    data: {
      ...listingData,
      slug,
      services: {
        create: services.map((s) => ({
          name: s.name,
          price: s.price,
          duration: s.duration,
          discount: s.discount ?? null,
          discountType: s.discountType ?? null,
          description: s.description ?? null,
        })),
      },
    },
    include: { services: true },
  });

  return NextResponse.json({ data: listing, message: 'Listing created' }, { status: 201 });
}
