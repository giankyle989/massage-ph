import { Listing, Service } from '@prisma/client';

export type ListingWithServices = Listing & {
  services: Service[];
};

export type PublicListing = Omit<ListingWithServices, 'createdAt' | 'updatedAt'>;

export type ListingCardData = Pick<Listing, 'slug' | 'name' | 'category' | 'city' | 'images'> & {
  startingPrice: number;
};

export type ApiResponse<T = unknown> = {
  data?: T;
  error?: string | Record<string, string>;
  message?: string;
};

export type PaginatedResponse<T> = ApiResponse<T[]> & {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
