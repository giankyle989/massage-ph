import Link from 'next/link';
import { prisma } from '@/lib/db';
import { ADMIN_PAGE_SIZE } from '@/lib/constants';
import { Pagination } from '@/components/ui/pagination';
import { AdminListingsTable } from './admin-listings-table';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const { page: pageParam, search } = await searchParams;
  const page = Math.max(1, parseInt(pageParam || '1', 10) || 1);

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

  const totalPages = Math.ceil(total / ADMIN_PAGE_SIZE);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">All Listings</h1>
        <Link
          href="/listings/new"
          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          + Add New Listing
        </Link>
      </div>

      <form action="/dashboard" method="GET" className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            name="search"
            defaultValue={search || ''}
            placeholder="Search by name, region, or city..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Search
          </button>
        </div>
      </form>

      {listings.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
          {search ? (
            <p className="text-gray-500">No listings match &apos;{search}&apos;</p>
          ) : (
            <div>
              <p className="mb-4 text-gray-500">No listings yet. Create your first listing.</p>
              <Link
                href="/listings/new"
                className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                + Add New Listing
              </Link>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <AdminListingsTable listings={listings} />
          </div>
          <div className="mt-6">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              basePath="/dashboard"
              searchParams={search ? { search } : {}}
            />
          </div>
        </>
      )}
    </main>
  );
}
