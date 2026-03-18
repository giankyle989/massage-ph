import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { downloadAndUploadImages } from './seed-images';

const prisma = new PrismaClient();

async function main() {
  // === RESET ALL DATA ===
  console.log('Resetting database...');
  await prisma.service.deleteMany();
  await prisma.listing.deleteMany();
  console.log('All listings and services deleted.');

  // === CREATE ADMIN USER ===
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
  console.log('Admin user ready.');

  // === UPLOAD IMAGES TO S3 ===
  const images = await downloadAndUploadImages();
  if (images.length < 10) {
    throw new Error(`Only got ${images.length} images, need at least 10. Check network/S3 config.`);
  }

  // Distribute images across listings (2-3 per listing)
  let imgIdx = 0;
  function nextImages(count: number): string[] {
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
      result.push(images[imgIdx % images.length]);
      imgIdx++;
    }
    return result;
  }

  // === CREATE LISTINGS ===
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
        'Premium Thai massage experience in the heart of Makati. Our trained therapists from Chiang Mai bring authentic Northern Thai techniques to the CBD. Open daily from 10AM to 10PM. Contact: 0917-123-4567.',
      tags: ['Parking Available', 'WiFi Available', 'Credit Card Accepted', 'GCash Accepted'],
      images: nextImages(3),
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
        { name: 'Thai Herbal Compress', price: 900, duration: 90 },
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
        'Authentic Filipino Hilot massage using traditional techniques passed down through generations. Our manghihilot use virgin coconut oil and banana leaves for a truly Filipino healing experience. Walk-ins welcome! Call us at 0918-765-4321.',
      tags: ['Walk-In Welcome', 'Home Service', 'Senior Discount', 'GCash Accepted'],
      images: nextImages(3),
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
        { name: 'Dagdagay Foot Massage', price: 300, duration: 30 },
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
        'Japanese-style Shiatsu massage in Cebu. Our therapists trained in Tokyo bring authentic finger-pressure techniques to the Queen City of the South. By appointment only. Open Mon-Sat 9AM-8PM. Contact: 0919-888-7777.',
      tags: ['By Appointment Only', 'Parking Available', 'Couple Massage'],
      images: nextImages(2),
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
        'Relaxing Swedish massage in a peaceful setting near the hot springs of Calamba. Our signature treatments combine European techniques with natural Laguna mineral water. Open 24/7. Contact: 0920-555-1234.',
      tags: ['24/7', 'WiFi Available', 'Female Therapist', 'Male Therapist'],
      images: nextImages(3),
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
        'Specializing in deep tissue and sports massage. Perfect for athletes and active individuals. Our therapists are certified in myofascial release and trigger point therapy. Contact: 0921-333-9999.',
      tags: ['Walk-In Welcome', 'Parking Available', 'Student Discount', 'Wheelchair Accessible'],
      images: nextImages(3),
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
      name: 'Manila Aromatherapy Lounge',
      slug: 'manila-aromatherapy-lounge',
      category: 'Aromatherapy',
      region: 'NCR',
      city: 'Manila',
      address: '88 Roxas Blvd, Ermita, Manila',
      latitude: 14.5676,
      longitude: 120.9823,
      description:
        'Indulge your senses at Manila Aromatherapy Lounge. We use premium essential oils imported from France and Thailand. Our signature lavender-lemongrass blend is a guest favorite. Open daily 11AM-11PM. Contact: 0917-222-3333.',
      tags: ['WiFi Available', 'Credit Card Accepted', 'GCash Accepted', 'Couple Massage'],
      images: nextImages(2),
      isActive: true,
      services: [
        { name: 'Signature Aromatherapy', price: 800, duration: 60 },
        {
          name: 'Essential Oil Full Body',
          price: 1000,
          duration: 90,
          discount: 10,
          discountType: 'percentage',
        },
        { name: 'Aromatherapy Foot Soak & Massage', price: 450, duration: 45 },
      ],
    },
    {
      name: 'BGC Hot Stone Haven',
      slug: 'bgc-hot-stone-haven',
      category: 'Hot Stone',
      region: 'NCR',
      city: 'Taguig',
      address: '25th Street corner 5th Ave, BGC, Taguig',
      latitude: 14.5509,
      longitude: 121.0487,
      description:
        'Experience the healing warmth of volcanic basalt stones in the modern heart of BGC. Our hot stone therapy combines ancient Hawaiian Lomi Lomi techniques with heated stones for deep relaxation. Contact: 0918-444-5555.',
      tags: ['Parking Available', 'Credit Card Accepted', 'WiFi Available', 'By Appointment Only'],
      images: nextImages(3),
      isActive: true,
      services: [
        { name: 'Classic Hot Stone Therapy', price: 900, duration: 60 },
        { name: 'Premium Hot & Cold Stone', price: 1200, duration: 90 },
        { name: 'Hot Stone Back Relief', price: 500, duration: 30 },
      ],
    },
    {
      name: 'Baguio Mountain Spa',
      slug: 'baguio-mountain-spa',
      category: 'Combination / Multi-style',
      region: 'CAR',
      city: 'Baguio',
      address: '15 Session Road, Baguio City',
      latitude: 16.4119,
      longitude: 120.5933,
      description:
        'Escape to the cool mountain air of Baguio for a rejuvenating spa experience. We blend Cordilleran traditional healing with modern massage techniques. Our pine-scented rooms and mountain views make every session unforgettable. Contact: 0920-111-2222.',
      tags: ['Parking Available', 'Walk-In Welcome', 'Senior Discount', 'Pet Friendly'],
      images: nextImages(2),
      isActive: true,
      services: [
        { name: 'Mountain Blend Massage', price: 500, duration: 60 },
        { name: 'Cordilleran Healing Ritual', price: 700, duration: 75 },
        { name: 'Pine Oil Swedish', price: 650, duration: 60 },
        {
          name: 'Couples Mountain Retreat',
          price: 1200,
          duration: 90,
          discount: 200,
          discountType: 'fixed',
        },
      ],
    },
    {
      name: 'Boracay Beach Massage',
      slug: 'boracay-beach-massage',
      category: 'Swedish Massage',
      region: 'Region VI',
      city: 'Malay',
      address: 'Station 2, White Beach, Boracay Island, Malay, Aklan',
      latitude: 11.9674,
      longitude: 121.9249,
      description:
        'Nothing beats a massage by the beach. Our open-air massage huts on White Beach offer Swedish and Thai massage with the sound of waves. Perfect for tourists and locals alike. Open 8AM-sunset. Contact: 0919-666-7777.',
      tags: ['Walk-In Welcome', 'GCash Accepted', 'Female Therapist', 'Male Therapist'],
      images: nextImages(3),
      isActive: true,
      services: [
        { name: 'Beachside Swedish', price: 450, duration: 60 },
        { name: 'Sunset Thai Massage', price: 550, duration: 60 },
        { name: 'Aloe Vera After-Sun Treatment', price: 400, duration: 45 },
        { name: 'Couples Beach Massage', price: 900, duration: 60 },
      ],
    },
    {
      name: 'Iloilo Sports Recovery Hub',
      slug: 'iloilo-sports-recovery-hub',
      category: 'Sports Massage',
      region: 'Region VI',
      city: 'Iloilo City',
      address: '99 Diversion Road, Iloilo City',
      latitude: 10.7202,
      longitude: 122.5621,
      description:
        'The go-to recovery center for Ilonggo athletes. We specialize in sports massage, injury prevention, and rehabilitation. Our therapists work with local basketball and football teams. Contact: 0921-888-0000.',
      tags: ['Parking Available', 'Walk-In Welcome', 'Student Discount', 'Wheelchair Accessible'],
      images: nextImages(2),
      isActive: true,
      services: [
        { name: 'Sports Deep Tissue', price: 600, duration: 60 },
        {
          name: 'Post-Game Recovery',
          price: 750,
          duration: 75,
          discount: 10,
          discountType: 'percentage',
        },
        { name: 'Injury Rehab Massage', price: 500, duration: 45 },
      ],
    },
    {
      name: 'Clark Reflexology Center',
      slug: 'clark-reflexology-center',
      category: 'Reflexology',
      region: 'Region III',
      city: 'Angeles',
      address: '10 Don Juico Avenue, Angeles City, Pampanga',
      latitude: 15.1449,
      longitude: 120.5887,
      description:
        'Foot reflexology and body massage near Clark Freeport Zone. Popular with expats and tourists for our clean, air-conditioned facilities and skilled therapists. Open daily 10AM-12MN. Contact: 0917-999-1111.',
      tags: ['WiFi Available', 'Credit Card Accepted', 'Parking Available', '24/7'],
      images: nextImages(2),
      isActive: true,
      services: [
        { name: 'Foot Reflexology', price: 350, duration: 45 },
        {
          name: 'Full Body + Reflexology Combo',
          price: 700,
          duration: 90,
          discount: 50,
          discountType: 'fixed',
        },
        { name: 'Hand Reflexology', price: 250, duration: 30 },
      ],
    },
    {
      name: 'Tagaytay Prenatal Wellness',
      slug: 'tagaytay-prenatal-wellness',
      category: 'Prenatal Massage',
      region: 'Region IV-A',
      city: 'Tagaytay',
      address: '55 Aguinaldo Highway, Tagaytay City, Cavite',
      latitude: 14.1153,
      longitude: 120.9621,
      description:
        'Gentle, specialized massage for expectant mothers in the cool breeze of Tagaytay. Our certified prenatal massage therapists ensure comfort and safety at every stage of pregnancy. By appointment only. Contact: 0918-777-8888.',
      tags: ['By Appointment Only', 'Female Therapist', 'Parking Available', 'WiFi Available'],
      images: nextImages(2),
      isActive: true,
      services: [
        { name: 'Prenatal Relaxation Massage', price: 700, duration: 60 },
        { name: 'Postnatal Recovery Massage', price: 750, duration: 60 },
        { name: 'Prenatal Foot & Leg Relief', price: 400, duration: 30 },
      ],
    },
    {
      name: 'Closed For Renovation Spa',
      slug: 'closed-for-renovation-spa',
      category: 'Aromatherapy',
      region: 'NCR',
      city: 'Taguig',
      address: '100 BGC, Taguig City',
      description:
        'Currently closed for renovation. Will reopen soon with an all-new interior and expanded service menu!',
      tags: ['Credit Card Accepted'],
      images: [images[0]],
      isActive: false,
      services: [{ name: 'Aromatherapy Massage', price: 800, duration: 60 }],
    },
  ];

  for (const { services, ...listingData } of listings) {
    await prisma.listing.create({
      data: {
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

  console.log(`\nSeeded ${listings.length} listings with images!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
