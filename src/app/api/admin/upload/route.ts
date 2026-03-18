import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-guard';
import { generateS3Key, uploadToS3 } from '@/lib/s3';
import { MAX_IMAGE_SIZE_BYTES, ACCEPTED_IMAGE_TYPES } from '@/lib/constants';

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Only JPEG, PNG, and WebP are accepted' }, { status: 415 });
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return NextResponse.json({ error: 'File exceeds 5MB limit' }, { status: 413 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const key = generateS3Key(file.type);
  const url = await uploadToS3(buffer, key, file.type);

  return NextResponse.json({ data: { url } });
}
