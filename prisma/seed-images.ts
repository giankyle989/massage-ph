import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import * as https from 'https';
import * as http from 'http';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const s3 = new S3Client({
  region: process.env.AWS_S3_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

function downloadImage(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const request = (targetUrl: string) => {
      client
        .get(targetUrl, { headers: { 'User-Agent': 'MassagePH-Seeder/1.0' } }, (res) => {
          // Follow redirects
          if (
            res.statusCode &&
            res.statusCode >= 300 &&
            res.statusCode < 400 &&
            res.headers.location
          ) {
            const redirectUrl = res.headers.location.startsWith('http')
              ? res.headers.location
              : new URL(res.headers.location, targetUrl).toString();
            const redirectClient = redirectUrl.startsWith('https') ? https : http;
            redirectClient
              .get(
                redirectUrl,
                { headers: { 'User-Agent': 'MassagePH-Seeder/1.0' } },
                (redirectRes) => {
                  const chunks: Buffer[] = [];
                  redirectRes.on('data', (chunk: Buffer) => chunks.push(chunk));
                  redirectRes.on('end', () => resolve(Buffer.concat(chunks)));
                  redirectRes.on('error', reject);
                }
              )
              .on('error', reject);
            return;
          }
          const chunks: Buffer[] = [];
          res.on('data', (chunk: Buffer) => chunks.push(chunk));
          res.on('end', () => resolve(Buffer.concat(chunks)));
          res.on('error', reject);
        })
        .on('error', reject);
    };
    request(url);
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

// Free stock images from Unsplash (massage/spa/wellness themed)
const IMAGE_SOURCES = [
  // Spa/massage interiors and scenes
  'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80', // spa massage
  'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&q=80', // massage therapy
  'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&q=80', // spa setting
  'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=800&q=80', // wellness spa
  'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80', // spa candles
  'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&q=80', // massage oils
  'https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?w=800&q=80', // spa treatment
  'https://images.unsplash.com/photo-1470259078422-826894b933aa?w=800&q=80', // relaxation
  'https://images.unsplash.com/photo-1591343395082-e120087004b4?w=800&q=80', // hot stone
  'https://images.unsplash.com/photo-1552693673-1bf958298935?w=800&q=80', // foot massage
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80', // yoga/wellness
  'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&q=80', // spa interior
  'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&q=80', // meditation
  'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=800&q=80', // aromatherapy
  'https://images.unsplash.com/photo-1531299204812-e6d44d9a185c?w=800&q=80', // skincare/beauty
  'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=800&q=80', // spa pool
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80', // spa room
  'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80', // face treatment
  'https://images.unsplash.com/photo-1611073615830-10be9b0389a8?w=800&q=80', // massage back
  'https://images.unsplash.com/photo-1609840113055-87680b1d9200?w=800&q=80', // spa towels
  'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=800&q=80', // couple yoga
  'https://images.unsplash.com/photo-1540324155974-7523202daa3f?w=800&q=80', // pool/wellness
  'https://images.unsplash.com/photo-1583416750470-965b2707b355?w=800&q=80', // spa products
  'https://images.unsplash.com/photo-1515461024012-0cabcca4de93?w=800&q=80', // bamboo spa
];

export async function downloadAndUploadImages(): Promise<string[]> {
  const uploadedUrls: string[] = [];

  console.log(`Downloading and uploading ${IMAGE_SOURCES.length} images to S3...`);

  for (let i = 0; i < IMAGE_SOURCES.length; i++) {
    const url = IMAGE_SOURCES[i];
    try {
      console.log(`  [${i + 1}/${IMAGE_SOURCES.length}] Downloading...`);
      const buffer = await downloadImage(url);
      if (buffer.length < 1000) {
        console.log(`    Skipped (too small: ${buffer.length} bytes)`);
        continue;
      }
      const s3Url = await uploadToS3(buffer, 'image/jpeg');
      uploadedUrls.push(s3Url);
      console.log(`    Uploaded: ${s3Url}`);
    } catch (err) {
      console.error(`    Failed: ${(err as Error).message}`);
    }
  }

  console.log(`\nSuccessfully uploaded ${uploadedUrls.length} images`);
  return uploadedUrls;
}

// Run standalone
if (require.main === module) {
  downloadAndUploadImages()
    .then((urls) => {
      console.log('\nAll URLs:');
      urls.forEach((u) => console.log(u));
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
