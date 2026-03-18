import type { Listing, Service } from '@prisma/client';

export type SerializedService = Omit<Service, 'price' | 'discount'> & {
  price: number;
  discount: number | null;
};

export type SerializedListing = Listing & {
  services: SerializedService[];
};

export function serializeListing<T extends Listing & { services: Service[] }>(
  listing: T
): SerializedListing {
  return {
    ...listing,
    services: listing.services.map((s) => ({
      ...s,
      price: Number(s.price),
      discount: s.discount ? Number(s.discount) : null,
    })),
  };
}

export function serializeListings<T extends (Listing & { services: Service[] })[]>(
  listings: T
): SerializedListing[] {
  return listings.map(serializeListing);
}
