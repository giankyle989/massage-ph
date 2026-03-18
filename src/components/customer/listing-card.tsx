import Image from 'next/image';
import Link from 'next/link';
import { ListingWithServices } from '@/types';

interface ListingCardProps {
  listing: ListingWithServices;
}

export function ListingCard({ listing }: ListingCardProps) {
  const startingPrice =
    listing.services.length > 0 ? Math.min(...listing.services.map((s) => Number(s.price))) : null;

  const image = listing.images[0] || '/placeholder.jpg';

  return (
    <Link href={`/${listing.slug}`} className="group block">
      <div className="overflow-hidden rounded-lg border border-gray-200 transition-shadow group-hover:shadow-lg">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
          <Image
            src={image}
            alt={listing.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <h3 className="truncate text-lg font-semibold text-gray-900">{listing.name}</h3>
          <p className="mt-1 text-sm text-gray-500">{listing.category}</p>
          <p className="text-sm text-gray-500">{listing.city}</p>
          {startingPrice !== null && (
            <p className="mt-2 text-sm font-medium text-blue-600">
              From &#8369;{startingPrice.toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
