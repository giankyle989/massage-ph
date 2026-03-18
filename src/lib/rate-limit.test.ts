import { describe, it, expect } from 'vitest';
import { createRateLimiter } from './rate-limit';

describe('createRateLimiter', () => {
  it('allows requests under the limit', () => {
    const limiter = createRateLimiter({ maxRequests: 3, windowMs: 60000 });
    expect(limiter.check('ip1')).toEqual({ allowed: true, remaining: 2 });
    expect(limiter.check('ip1')).toEqual({ allowed: true, remaining: 1 });
    expect(limiter.check('ip1')).toEqual({ allowed: true, remaining: 0 });
  });

  it('blocks requests over the limit', () => {
    const limiter = createRateLimiter({ maxRequests: 2, windowMs: 60000 });
    limiter.check('ip1');
    limiter.check('ip1');
    const result = limiter.check('ip1');
    expect(result.allowed).toBe(false);
  });

  it('tracks different keys independently', () => {
    const limiter = createRateLimiter({ maxRequests: 1, windowMs: 60000 });
    expect(limiter.check('ip1').allowed).toBe(true);
    expect(limiter.check('ip2').allowed).toBe(true);
    expect(limiter.check('ip1').allowed).toBe(false);
  });
});
