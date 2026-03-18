import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { ListingForm } from '@/components/admin/listing-form';

interface EditListingPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditListingPage({ params }: EditListingPageProps) {
  const { id } = await params;

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { services: true },
  });

  if (!listing) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Edit Listing</h1>
      <ListingForm listing={listing} />
    </div>
  );
}
