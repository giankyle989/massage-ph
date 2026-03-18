import { describe, it, expect } from 'vitest';
import { generateS3Key, getCloudFrontUrl } from './s3';

describe('generateS3Key', () => {
  it('generates a key with the correct extension for jpeg', () => {
    const key = generateS3Key('image/jpeg');
    expect(key).toMatch(/^listings\/[a-f0-9-]+\.jpg$/);
  });

  it('generates a key with the correct extension for png', () => {
    const key = generateS3Key('image/png');
    expect(key).toMatch(/^listings\/[a-f0-9-]+\.png$/);
  });

  it('generates a key with the correct extension for webp', () => {
    const key = generateS3Key('image/webp');
    expect(key).toMatch(/^listings\/[a-f0-9-]+\.webp$/);
  });

  it('generates unique keys', () => {
    const key1 = generateS3Key('image/jpeg');
    const key2 = generateS3Key('image/jpeg');
    expect(key1).not.toBe(key2);
  });
});

describe('getCloudFrontUrl', () => {
  it('constructs a CloudFront URL from a key', () => {
    const url = getCloudFrontUrl('listings/abc.jpg');
    expect(url).toContain('listings/abc.jpg');
    expect(url).toMatch(/^https:\/\//);
  });
});
