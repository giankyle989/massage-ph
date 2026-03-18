import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { ImageGallery } from '@/components/customer/image-gallery';
import { ServicesTable } from '@/components/customer/services-table';
import { CopyAddress } from '@/components/customer/copy-address';
import { MapEmbed } from '@/components/customer/map-embed';
import { serializeListing } from '@/lib/serialize';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getListing(slug: string) {
  return prisma.listing.findUnique({
    where: { slug, isActive: true },
    include: { services: true },
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getListing(slug);

  if (!listing) {
    return { title: 'Not Found | MassagePH' };
  }

  return {
    title: `${listing.name} | MassagePH`,
    description: listing.description.slice(0, 160),
    openGraph: {
      title: `${listing.name} | MassagePH`,
      description: listing.description.slice(0, 160),
      images: listing.images[0] ? [listing.images[0]] : undefined,
    },
  };
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const rawListing = await getListing(slug);

  if (!rawListing) {
    notFound();
  }

  const listing = serializeListing(rawListing);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Back to listings
      </Link>

      {/* Image Gallery */}
      <section className="mb-8">
        <ImageGallery images={listing.images} name={listing.name} />
      </section>

      {/* Shop Info */}
      <section className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{listing.name}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
            {listing.category}
          </span>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <span>{listing.address}</span>
            <CopyAddress address={listing.address} />
          </div>
        </div>
      </section>

      {/* Tags */}
      {listing.tags.length > 0 && (
        <section className="mb-6">
          <div className="flex flex-wrap gap-2">
            {listing.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Description */}
      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">About</h2>
        <p className="whitespace-pre-line text-gray-700">{listing.description}</p>
      </section>

      {/* Services Table */}
      {listing.services.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Services</h2>
          <ServicesTable services={listing.services} />
        </section>
      )}

      {/* Map */}
      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Location</h2>
        <MapEmbed
          latitude={listing.latitude}
          longitude={listing.longitude}
          address={listing.address}
          name={listing.name}
        />
      </section>
    </div>
  );
}
