import { Suspense } from 'react';
import { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { CUSTOMER_PAGE_SIZE } from '@/lib/constants';
import { ListingCard } from '@/components/customer/listing-card';
import { SearchBar } from '@/components/customer/search-bar';
import { FilterSidebar, FilterDrawer } from '@/components/customer/filter-drawer';
import { EmptyState } from '@/components/customer/empty-state';
import { Pagination } from '@/components/ui/pagination';
import { Prisma } from '@prisma/client';
import { serializeListings } from '@/lib/serialize';

export const metadata: Metadata = {
  title: 'Browse Massage Listings | MassagePH',
  description:
    'Find the best massage parlors and spas near you in the Philippines. Browse by region, city, or category.',
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getStringParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] || '';
  return value || '';
}

export default async function BrowsePage({ searchParams }: PageProps) {
  const params = await searchParams;

  const search = getStringParam(params.search);
  const region = getStringParam(params.region);
  const city = getStringParam(params.city);
  const category = getStringParam(params.category);
  const page = Math.max(1, parseInt(getStringParam(params.page) || '1', 10));

  const where: Prisma.ListingWhereInput = {
    isActive: true,
  };

  if (region) where.region = region;
  if (city) where.city = city;
  if (category) where.category = category;
  if (search) {
    where.name = { contains: search, mode: 'insensitive' };
  }

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

  const serialized = serializeListings(listings);
  const totalPages = Math.ceil(total / CUSTOMER_PAGE_SIZE);
  const hasFilters = !!(search || region || city || category);

  const currentParams: Record<string, string> = {};
  if (search) currentParams.search = search;
  if (region) currentParams.region = region;
  if (city) currentParams.city = city;
  if (category) currentParams.category = category;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Suspense fallback={<div className="h-10 rounded-lg bg-gray-100" />}>
          <SearchBar />
        </Suspense>
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-60 shrink-0 md:block">
          <Suspense fallback={<div className="h-64 rounded-lg bg-gray-100" />}>
            <FilterSidebar />
          </Suspense>
        </aside>

        <div className="min-w-0 flex-1">
          <p className="mb-4 text-sm text-gray-600">
            {total} {total === 1 ? 'listing' : 'listings'} found
          </p>

          {serialized.length === 0 ? (
            <Suspense>
              <EmptyState hasFilters={hasFilters} />
            </Suspense>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {serialized.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>

              <div className="mt-8">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  basePath="/"
                  searchParams={currentParams}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <Suspense>
        <FilterDrawer />
      </Suspense>
    </div>
  );
}
