'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-gray-200">500</p>
      <h1 className="mt-4 text-2xl font-semibold text-gray-900">Something went wrong</h1>
      <p className="mt-2 text-gray-600">
        An unexpected error occurred. Please try again or go back to the listings page.
      </p>
      <div className="mt-6 flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
        >
          Back to listings
        </Link>
      </div>
    </div>
  );
}
