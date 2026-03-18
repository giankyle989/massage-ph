'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import regionsData from '@/lib/data/regions-cities.json';
import { PREDEFINED_CATEGORIES } from '@/lib/constants';

export function FilterSidebar({ onApply }: { onApply?: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentRegion = searchParams.get('region') || '';
  const currentCity = searchParams.get('city') || '';
  const currentCategory = searchParams.get('category') || '';

  const selectedRegionData = regionsData.regions.find((r) => r.code === currentRegion);
  const cities = selectedRegionData?.cities || [];

  const hasFilters = currentRegion || currentCity || currentCategory;

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('page');
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      router.push(`/?${params.toString()}`);
      onApply?.();
    },
    [router, searchParams, onApply]
  );

  const handleRegionChange = (value: string) => {
    updateParams({ region: value, city: '' });
  };

  const handleCityChange = (value: string) => {
    updateParams({ city: value });
  };

  const handleCategoryChange = (value: string) => {
    updateParams({ category: value });
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('region');
    params.delete('city');
    params.delete('category');
    params.delete('page');
    router.push(`/?${params.toString()}`);
    onApply?.();
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="filter-region" className="mb-1 block text-sm font-medium text-gray-700">
          Region
        </label>
        <select
          id="filter-region"
          value={currentRegion}
          onChange={(e) => handleRegionChange(e.target.value)}
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Regions</option>
          {regionsData.regions.map((region) => (
            <option key={region.code} value={region.code}>
              {region.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="filter-city" className="mb-1 block text-sm font-medium text-gray-700">
          City
        </label>
        <select
          id="filter-city"
          value={currentCity}
          onChange={(e) => handleCityChange(e.target.value)}
          disabled={!currentRegion}
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">All Cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="filter-category" className="mb-1 block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="filter-category"
          value={currentCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {PREDEFINED_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}

export function FilterDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-40 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-colors hover:bg-blue-700 md:hidden"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="4" x2="4" y1="21" y2="14" />
          <line x1="4" x2="4" y1="10" y2="3" />
          <line x1="12" x2="12" y1="21" y2="12" />
          <line x1="12" x2="12" y1="8" y2="3" />
          <line x1="20" x2="20" y1="21" y2="16" />
          <line x1="20" x2="20" y1="12" y2="3" />
          <line x1="2" x2="6" y1="14" y2="14" />
          <line x1="10" x2="14" y1="8" y2="8" />
          <line x1="18" x2="22" y1="16" y2="16" />
        </svg>
        Filters
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-gray-500 hover:bg-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" x2="6" y1="6" y2="18" />
                  <line x1="6" x2="18" y1="6" y2="18" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <FilterSidebar onApply={() => setIsOpen(false)} />
            </div>
            <div className="border-t p-4">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
