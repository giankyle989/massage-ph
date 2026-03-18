import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import * as https from 'https';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

const s3 = new S3Client({
  region: process.env.AWS_S3_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

function httpsGet(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doRequest = (targetUrl: string, redirectCount = 0) => {
      if (redirectCount > 5) return reject(new Error('Too many redirects'));
      https
        .get(targetUrl, (res) => {
          if (
            res.statusCode &&
            res.statusCode >= 300 &&
            res.statusCode < 400 &&
            res.headers.location
          ) {
            doRequest(res.headers.location, redirectCount + 1);
            return;
          }
          const chunks: Buffer[] = [];
          res.on('data', (chunk: Buffer) => chunks.push(chunk));
          res.on('end', () => resolve(Buffer.concat(chunks)));
          res.on('error', reject);
        })
        .on('error', reject);
    };
    doRequest(url);
  });
}

async function uploadToS3(buffer: Buffer, contentType: string): Promise<string> {
  const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
  const key = `listings/${randomUUID()}.${ext}`;
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    })
  );
  const domain = process.env.CLOUDFRONT_DOMAIN;
  if (domain) return `https://${domain}/${key}`;
  return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${key}`;
}

async function findPlaceId(query: string): Promise<string | null> {
  const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id&key=${GOOGLE_API_KEY}`;
  const buf = await httpsGet(url);
  const data = JSON.parse(buf.toString());
  return data.candidates?.[0]?.place_id ?? null;
}

async function getPlacePhotos(placeId: string): Promise<string[]> {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${GOOGLE_API_KEY}`;
  const buf = await httpsGet(url);
  const data = JSON.parse(buf.toString());
  const photos = data.result?.photos ?? [];
  return photos.map((p: { photo_reference: string }) => p.photo_reference);
}

async function downloadPlacePhoto(photoRef: string, maxWidth = 800): Promise<Buffer> {
  const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoRef}&key=${GOOGLE_API_KEY}`;
  return httpsGet(url);
}

export interface BusinessImages {
  [slug: string]: string[];
}

// Each entry: [slug, Google Maps search query, number of photos to fetch]
const BUSINESSES: [string, string, number][] = [
  ['breeze-oriental-spa-bgc', 'Breeze Oriental Spa & Massage BGC Taguig', 3],
  ['breeze-oriental-spa-makati', 'Breeze Oriental Spa & Massage Makati', 3],
  ['the-mandara-spa-bgc', 'The Mandara Spa BGC Taguig', 3],
  ['chang-thai-massage-poblacion', 'Chang Thai Massage Poblacion Makati', 2],
  ['celebrity-spiral-spa-qc', 'Celebrity Spiral Spa Quezon City', 2],
  ['thai-royale-spa-tomas-morato', 'Thai Royale Spa Tomas Morato Quezon City', 2],
  ['nuat-thai-cebu', 'Nuat Thai Cebu City', 2],
  ['tree-shade-spa-cebu', 'Tree Shade Spa Cebu', 3],
  ['body-and-sole-spa-cebu', 'Body & Sole Spa Cebu City', 2],
  ['big-apple-express-spa-bgc', 'Big Apple Express Spa BGC Taguig', 2],
  ['dusit-devarana-spa-davao', 'Dusit Thani Devarana Spa Davao', 3],
  ['tirta-spa-boracay', 'Tirta Spa Boracay', 3],
  ['massage-luxx-spa-baguio', 'Massage Luxx Spa Baguio', 2],
  ['reign-spa-angeles-city', 'Reign Spa Angeles City Pampanga', 2],
  ['nuat-thai-makati', 'Nuat Thai Makati', 2],
  ['nature-wellness-lapu-lapu', 'Nature Wellness Massage Spa Lapu-Lapu Cebu', 2],
  ['cedar-wellness-spa-qc', 'Cedar Wellness Spa Quezon City', 2],
];

export async function downloadBusinessImages(): Promise<BusinessImages> {
  const result: BusinessImages = {};
  let totalUploaded = 0;

  console.log(`Fetching photos for ${BUSINESSES.length} businesses via Google Places API...\n`);

  for (const [slug, query, count] of BUSINESSES) {
    console.log(`[${slug}] Searching: "${query}"`);
    try {
      const placeId = await findPlaceId(query);
      if (!placeId) {
        console.log(`  ⚠ Not found on Google Maps, skipping`);
        result[slug] = [];
        continue;
      }

      const photoRefs = await getPlacePhotos(placeId);
      if (photoRefs.length === 0) {
        console.log(`  ⚠ No photos available`);
        result[slug] = [];
        continue;
      }

      const urls: string[] = [];
      const toFetch = Math.min(count, photoRefs.length);
      for (let i = 0; i < toFetch; i++) {
        try {
          const buffer = await downloadPlacePhoto(photoRefs[i]);
          if (buffer.length < 5000) {
            console.log(`  ⚠ Photo ${i + 1} too small (${buffer.length}b), skipping`);
            continue;
          }
          const s3Url = await uploadToS3(buffer, 'image/jpeg');
          urls.push(s3Url);
          totalUploaded++;
          console.log(
            `  ✓ Photo ${i + 1}/${toFetch} uploaded (${(buffer.length / 1024).toFixed(0)}KB)`
          );
        } catch (err) {
          console.log(`  ✗ Photo ${i + 1} failed: ${(err as Error).message}`);
        }
      }
      result[slug] = urls;
    } catch (err) {
      console.log(`  ✗ Error: ${(err as Error).message}`);
      result[slug] = [];
    }
  }

  console.log(
    `\nDone! Uploaded ${totalUploaded} photos for ${Object.keys(result).length} businesses`
  );
  return result;
}

if (require.main === module) {
  downloadBusinessImages()
    .then((images) => {
      console.log('\nResults:');
      for (const [slug, urls] of Object.entries(images)) {
        console.log(`  ${slug}: ${urls.length} photos`);
      }
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
