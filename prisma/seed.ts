import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const passwordHash = await bcrypt.hash('laguerta', 10);
  await prisma.adminUser.upsert({
    where: { email: 'test@gmail.com' },
    update: {},
    create: {
      email: 'test@gmail.com',
      passwordHash,
      name: 'Admin',
      role: 'admin',
    },
  });

  console.log('Admin user created: admin@massageph.com / changeme123');

  // Create sample listings
  const listings = [
    {
      name: 'Zen Thai Spa',
      slug: 'zen-thai-spa',
      category: 'Thai Massage',
      region: 'NCR',
      city: 'Makati',
      address: '123 Ayala Avenue, Makati City',
      latitude: 14.5547,
      longitude: 121.0244,
      description:
        'Premium Thai massage experience in the heart of Makati. Open daily from 10AM to 10PM. Contact: 0917-123-4567.',
      tags: ['Parking Available', 'WiFi Available', 'Credit Card Accepted', 'GCash Accepted'],
      images: ['https://massageph-s3.s3.ap-southeast-1.amazonaws.com/listings/zen-thai-spa.jpg'],
      isActive: true,
      services: [
        { name: 'Traditional Thai Massage', price: 500, duration: 60 },
        {
          name: 'Thai Oil Massage',
          price: 700,
          duration: 90,
          discount: 10,
          discountType: 'percentage',
        },
        { name: 'Foot Reflexology', price: 350, duration: 30 },
      ],
    },
    {
      name: 'Hilot Healing Hands',
      slug: 'hilot-healing-hands',
      category: 'Hilot (Filipino Traditional)',
      region: 'NCR',
      city: 'Quezon City',
      address: '456 Commonwealth Ave, Quezon City',
      latitude: 14.676,
      longitude: 121.0437,
      description:
        'Authentic Filipino Hilot massage using traditional techniques. Walk-ins welcome! Call us at 0918-765-4321.',
      tags: ['Walk-In Welcome', 'Home Service', 'Senior Discount', 'GCash Accepted'],
      images: ['https://massageph-s3.s3.ap-southeast-1.amazonaws.com/listings/hilot-healing.jpg'],
      isActive: true,
      services: [
        { name: 'Traditional Hilot', price: 400, duration: 60 },
        {
          name: 'Hilot with Banana Leaves',
          price: 600,
          duration: 90,
          discount: 50,
          discountType: 'fixed',
        },
      ],
    },
    {
      name: 'Cebu Shiatsu Center',
      slug: 'cebu-shiatsu-center',
      category: 'Shiatsu',
      region: 'Region VII',
      city: 'Cebu City',
      address: '789 Osmena Blvd, Cebu City',
      latitude: 10.3157,
      longitude: 123.8854,
      description:
        'Japanese-style Shiatsu massage in Cebu. By appointment only. Open Mon-Sat 9AM-8PM. Contact: 0919-888-7777.',
      tags: ['By Appointment Only', 'Parking Available', 'Couple Massage'],
      images: ['https://massageph-s3.s3.ap-southeast-1.amazonaws.com/listings/cebu-shiatsu.jpg'],
      isActive: true,
      services: [
        { name: 'Full Body Shiatsu', price: 600, duration: 60 },
        { name: 'Couples Shiatsu', price: 1100, duration: 60 },
        { name: 'Back and Shoulder Focus', price: 400, duration: 30 },
      ],
    },
    {
      name: 'Swedish Touch Calamba',
      slug: 'swedish-touch-calamba',
      category: 'Swedish Massage',
      region: 'Region IV-A',
      city: 'Calamba',
      address: '321 National Highway, Calamba, Laguna',
      latitude: 14.2114,
      longitude: 121.1653,
      description:
        'Relaxing Swedish massage in a peaceful setting. Open 24/7. Contact: 0920-555-1234.',
      tags: ['24/7', 'WiFi Available', 'Female Therapist', 'Male Therapist'],
      images: ['https://massageph-s3.s3.ap-southeast-1.amazonaws.com/listings/swedish-touch.jpg'],
      isActive: true,
      services: [
        { name: 'Classic Swedish Massage', price: 550, duration: 60 },
        {
          name: 'Deep Tissue Swedish',
          price: 750,
          duration: 90,
          discount: 15,
          discountType: 'percentage',
        },
        { name: 'Hot Stone Add-on', price: 200, duration: 30 },
      ],
    },
    {
      name: 'Davao Deep Tissue Studio',
      slug: 'davao-deep-tissue-studio',
      category: 'Deep Tissue',
      region: 'Region XI',
      city: 'Davao City',
      address: '567 Quirino Ave, Davao City',
      latitude: 7.0731,
      longitude: 125.6128,
      description:
        'Specializing in deep tissue and sports massage. Perfect for athletes and active individuals. Contact: 0921-333-9999.',
      tags: ['Walk-In Welcome', 'Parking Available', 'Student Discount', 'Wheelchair Accessible'],
      images: ['https://massageph-s3.s3.ap-southeast-1.amazonaws.com/listings/davao-deep.jpg'],
      isActive: true,
      services: [
        { name: 'Deep Tissue Full Body', price: 650, duration: 60 },
        {
          name: 'Sports Recovery Massage',
          price: 800,
          duration: 90,
          discount: 100,
          discountType: 'fixed',
        },
        { name: 'Targeted Muscle Release', price: 400, duration: 30 },
        { name: 'Pre-Game Warm-Up Massage', price: 350, duration: 20 },
      ],
    },
    {
      name: 'Closed For Renovation Spa',
      slug: 'closed-for-renovation-spa',
      category: 'Aromatherapy',
      region: 'NCR',
      city: 'Taguig',
      address: '100 BGC, Taguig City',
      description: 'Currently closed for renovation. Will reopen soon!',
      tags: ['Credit Card Accepted'],
      images: ['https://massageph-s3.s3.ap-southeast-1.amazonaws.com/listings/closed-spa.jpg'],
      isActive: false,
      services: [{ name: 'Aromatherapy Massage', price: 800, duration: 60 }],
    },
  ];

  for (const { services, ...listingData } of listings) {
    await prisma.listing.upsert({
      where: { slug: listingData.slug },
      update: {},
      create: {
        ...listingData,
        services: {
          create: services.map((s: Record<string, unknown>) => ({
            name: s.name as string,
            price: s.price as number,
            duration: s.duration as number,
            discount: (s.discount as number) ?? null,
            discountType: (s.discountType as string) ?? null,
          })),
        },
      },
    });
  }

  console.log(`Seeded ${listings.length} listings`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
