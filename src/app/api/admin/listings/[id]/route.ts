import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-guard';
import { prisma } from '@/lib/db';
import { ListingUpdateSchema } from '@/lib/validators';
import { generateSlug } from '@/lib/slug';
import { deleteFromS3 } from '@/lib/s3';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  const existing = await prisma.listing.findUnique({
    where: { id },
    include: { services: true },
  });

  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const body = await request.json();
  const result = ListingUpdateSchema.safeParse(body);

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    result.error.issues.forEach((err) => {
      const field = err.path.join('.');
      fieldErrors[field] = err.message;
    });
    return NextResponse.json({ error: fieldErrors }, { status: 400 });
  }

  const { services, ...listingData } = result.data;

  // Handle slug update if name changed
  let slug = existing.slug;
  if (listingData.name && listingData.name !== existing.name) {
    slug = generateSlug(listingData.name);
    let suffix = 1;
    while (true) {
      const found = await prisma.listing.findUnique({ where: { slug } });
      if (!found || found.id === existing.id) break;
      suffix++;
      slug = `${generateSlug(listingData.name)}-${suffix}`;
    }
  }

  // Clean up removed images from S3
  if (listingData.images) {
    const removedImages = existing.images.filter((img) => !listingData.images!.includes(img));
    await Promise.all(removedImages.map(deleteFromS3));
  }

  const listing = await prisma.$transaction(async (tx) => {
    // Delete existing services and recreate
    if (services) {
      await tx.service.deleteMany({ where: { listingId: existing.id } });
    }

    return tx.listing.update({
      where: { id },
      data: {
        ...listingData,
        slug,
        ...(services && {
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
        }),
      },
      include: { services: true },
    });
  });

  return NextResponse.json({ data: listing, message: 'Listing updated' });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  const existing = await prisma.listing.findUnique({
    where: { id },
  });

  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Delete images from S3
  await Promise.all(existing.images.map(deleteFromS3));

  await prisma.listing.delete({ where: { id } });

  return NextResponse.json({ message: 'Listing deleted' });
}
