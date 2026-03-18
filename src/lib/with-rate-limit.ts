import { NextRequest, NextResponse } from 'next/server';
import { createRateLimiter } from './rate-limit';
import { RATE_LIMIT_PUBLIC, RATE_LIMIT_ADMIN, RATE_LIMIT_UPLOAD } from './constants';

const publicLimiter = createRateLimiter({ maxRequests: RATE_LIMIT_PUBLIC, windowMs: 60000 });
const adminLimiter = createRateLimiter({ maxRequests: RATE_LIMIT_ADMIN, windowMs: 60000 });
const uploadLimiter = createRateLimiter({ maxRequests: RATE_LIMIT_UPLOAD, windowMs: 60000 });

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
}

export function checkPublicRateLimit(request: NextRequest): NextResponse | null {
  const result = publicLimiter.check(getClientIp(request));
  if (!result.allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil((result.retryAfterMs || 60000) / 1000)) },
      }
    );
  }
  return null;
}

export function checkAdminRateLimit(request: NextRequest): NextResponse | null {
  const result = adminLimiter.check(getClientIp(request));
  if (!result.allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil((result.retryAfterMs || 60000) / 1000)) },
      }
    );
  }
  return null;
}

export function checkUploadRateLimit(request: NextRequest): NextResponse | null {
  const result = uploadLimiter.check(getClientIp(request));
  if (!result.allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil((result.retryAfterMs || 60000) / 1000)) },
      }
    );
  }
  return null;
}
