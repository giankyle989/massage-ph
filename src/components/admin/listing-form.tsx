'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PREDEFINED_CATEGORIES, PREDEFINED_TAGS } from '@/lib/constants';
import regionsData from '@/lib/data/regions-cities.json';
import type { ListingWithServices } from '@/types';
import { ServiceRows, toServiceRow, fromServiceRow } from './service-rows';
import type { ServiceRow } from './service-rows';
import { ImageUploader } from './image-uploader';

interface ListingFormProps {
  listing?: ListingWithServices;
}

export function ListingForm({ listing }: ListingFormProps) {
  const router = useRouter();
  const isEdit = !!listing;

  const [name, setName] = useState(listing?.name ?? '');
  const [category, setCategory] = useState(listing?.category ?? '');
  const [region, setRegion] = useState(listing?.region ?? '');
  const [city, setCity] = useState(listing?.city ?? '');
  const [address, setAddress] = useState(listing?.address ?? '');
  const [description, setDescription] = useState(listing?.description ?? '');
  const [isActive, setIsActive] = useState(listing?.isActive ?? true);
  const [latitude, setLatitude] = useState(
    listing?.latitude != null ? String(listing.latitude) : ''
  );
  const [longitude, setLongitude] = useState(
    listing?.longitude != null ? String(listing.longitude) : ''
  );
  const [tags, setTags] = useState<string[]>(listing?.tags ?? []);
  const [images, setImages] = useState<string[]>(listing?.images ?? []);
  const [serviceRows, setServiceRows] = useState<ServiceRow[]>(
    listing?.services?.length
      ? listing.services.map((s) =>
          toServiceRow({
            name: s.name,
            price: Number(s.price),
            duration: s.duration,
            discountType: s.discountType as 'percentage' | 'fixed' | null,
            discount: s.discount != null ? Number(s.discount) : null,
            description: s.description,
          })
        )
      : [toServiceRow()]
  );

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const cities = useMemo(() => {
    const found = regionsData.regions.find((r) => r.name === region);
    return found?.cities ?? [];
  }, [region]);

  // Reset city when region changes (only after initial render)
  const [regionInitialized, setRegionInitialized] = useState(false);
  useEffect(() => {
    if (!regionInitialized) {
      setRegionInitialized(true);
      return;
    }
    setCity('');
  }, [region]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleTag = (tag: string) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    const body = {
      name,
      category,
      region,
      city,
      address,
      description,
      isActive,
      latitude: latitude ? Number(latitude) : null,
      longitude: longitude ? Number(longitude) : null,
      tags,
      images,
      services: serviceRows.map(fromServiceRow),
    };

    try {
      const url = isEdit ? `/api/admin/listings/${listing.id}` : '/api/admin/listings';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (!res.ok) {
        if (typeof json.error === 'object') {
          setErrors(json.error);
        } else {
          setErrors({ _form: json.error || 'Something went wrong' });
        }
        return;
      }

      router.push('/dashboard');
    } catch {
      setErrors({ _form: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors._form && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700" role="alert">
          {errors._form}
        </div>
      )}

      {/* Basic Info */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-800">Basic Information</h2>

        <Input
          label="Listing Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          required
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className={`block w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.category ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select category</option>
            {PREDEFINED_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-sm text-red-600" role="alert">
              {errors.category}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
            className={`block w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.description && (
            <p className="text-sm text-red-600" role="alert">
              {errors.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-slate-700">
            Active (visible to customers)
          </label>
        </div>
      </div>

      {/* Location */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-800">Location</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">Region</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              required
              className={`block w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.region ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select region</option>
              {regionsData.regions.map((r) => (
                <option key={r.code} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>
            {errors.region && (
              <p className="text-sm text-red-600" role="alert">
                {errors.region}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">City</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              disabled={!region}
              className={`block w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 ${
                errors.city ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select city</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.city && (
              <p className="text-sm text-red-600" role="alert">
                {errors.city}
              </p>
            )}
          </div>
        </div>

        <Input
          label="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          error={errors.address}
          required
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Latitude"
            type="number"
            step="any"
            min="-90"
            max="90"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            error={errors.latitude}
          />
          <Input
            label="Longitude"
            type="number"
            step="any"
            min="-180"
            max="180"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            error={errors.longitude}
          />
        </div>
      </div>

      {/* Tags */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-800">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {PREDEFINED_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                tags.includes(tag)
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Images */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <ImageUploader images={images} onChange={setImages} error={errors.images} />
      </div>

      {/* Services */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <ServiceRows rows={serviceRows} onChange={setServiceRows} error={errors.services} />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button type="submit" loading={submitting}>
          {isEdit ? 'Update Listing' : 'Create Listing'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/dashboard')}
          disabled={submitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
