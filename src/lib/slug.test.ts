import { describe, it, expect } from 'vitest';
import { generateSlug } from './slug';

describe('generateSlug', () => {
  it('converts name to lowercase slug', () => {
    expect(generateSlug('Zen Thai Spa')).toBe('zen-thai-spa');
  });

  it('removes special characters', () => {
    expect(generateSlug('Spa & Wellness (Best!!)')).toBe('spa-wellness-best');
  });

  it('collapses multiple hyphens', () => {
    expect(generateSlug('Spa   ---  Wellness')).toBe('spa-wellness');
  });

  it('trims leading and trailing hyphens', () => {
    expect(generateSlug('  --Spa-- ')).toBe('spa');
  });

  it('handles Filipino characters', () => {
    expect(generateSlug('Hilot ni Ñaña')).toBe('hilot-ni-nana');
  });
});
