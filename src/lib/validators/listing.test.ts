import { describe, it, expect } from 'vitest';
import { ServiceSchema, ListingCreateSchema } from './listing';

describe('ServiceSchema', () => {
  it('validates a valid service', () => {
    const result = ServiceSchema.safeParse({
      name: 'Full Body Massage',
      price: 500,
      duration: 60,
    });
    expect(result.success).toBe(true);
  });

  it('validates a service with percentage discount', () => {
    const result = ServiceSchema.safeParse({
      name: 'Full Body Massage',
      price: 500,
      duration: 60,
      discount: 10,
      discountType: 'percentage',
    });
    expect(result.success).toBe(true);
  });

  it('validates a service with fixed discount', () => {
    const result = ServiceSchema.safeParse({
      name: 'Full Body Massage',
      price: 500,
      duration: 60,
      discount: 100,
      discountType: 'fixed',
    });
    expect(result.success).toBe(true);
  });

  it('rejects service with discount but no discount type', () => {
    const result = ServiceSchema.safeParse({
      name: 'Full Body Massage',
      price: 500,
      duration: 60,
      discount: 10,
    });
    expect(result.success).toBe(false);
  });

  it('rejects service with negative price', () => {
    const result = ServiceSchema.safeParse({
      name: 'Full Body Massage',
      price: -100,
      duration: 60,
    });
    expect(result.success).toBe(false);
  });

  it('rejects service with empty name', () => {
    const result = ServiceSchema.safeParse({
      name: '',
      price: 500,
      duration: 60,
    });
    expect(result.success).toBe(false);
  });
});

describe('ListingCreateSchema', () => {
  const validListing = {
    name: 'Zen Spa',
    category: 'Thai Massage',
    region: 'NCR',
    city: 'Makati',
    address: '123 Main St',
    description: 'A great spa experience.',
    images: ['https://example.com/img1.jpg'],
    services: [{ name: 'Full Body', price: 500, duration: 60 }],
  };

  it('validates a complete valid listing', () => {
    const result = ListingCreateSchema.safeParse(validListing);
    expect(result.success).toBe(true);
  });

  it('accepts optional fields', () => {
    const result = ListingCreateSchema.safeParse({
      ...validListing,
      latitude: 14.5547,
      longitude: 121.0244,
      tags: ['24/7', 'WiFi Available'],
      isActive: false,
    });
    expect(result.success).toBe(true);
  });

  it('rejects listing with no services', () => {
    const result = ListingCreateSchema.safeParse({
      ...validListing,
      services: [],
    });
    expect(result.success).toBe(false);
  });

  it('rejects listing with no images', () => {
    const result = ListingCreateSchema.safeParse({
      ...validListing,
      images: [],
    });
    expect(result.success).toBe(false);
  });

  it('rejects listing with missing required fields', () => {
    const result = ListingCreateSchema.safeParse({
      name: 'Zen Spa',
    });
    expect(result.success).toBe(false);
  });
});
