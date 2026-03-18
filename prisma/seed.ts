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

  let imgIdx = 0;
  function nextImages(count: number): string[] {
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
      result.push(images[imgIdx % images.length]);
      imgIdx++;
    }
    return result;
  }

  // === CREATE LISTINGS — Real Philippine massage/spa businesses ===
  const listings = [
    // --- NCR ---
    {
      name: 'Breeze Oriental Spa & Massage',
      slug: 'breeze-oriental-spa-bgc',
      category: 'Chinese Massage',
      region: 'NCR',
      city: 'Taguig',
      address: 'G/F Ore Central, 9th Ave. cor. 31st St., Bonifacio Global City, Taguig',
      latitude: 14.5509,
      longitude: 121.0487,
      description:
        'Breeze Oriental Spa brings authentic Chinese massage traditions to the heart of BGC. Specializing in Tui Na, acupressure, and traditional Chinese cupping therapy, our trained therapists provide relief from chronic pain and stress. The modern, minimalist interiors offer a calming retreat from the busy city. Walk-ins welcome. Open daily 10AM-12MN.',
      tags: ['Parking Available', 'Credit Card Accepted', 'WiFi Available', 'Walk-In Welcome'],
      images: nextImages(3),
      isActive: true,
      services: [
        { name: 'Tui Na Full Body Massage', price: 800, duration: 60 },
        {
          name: 'Acupressure Therapy',
          price: 1000,
          duration: 90,
          discount: 10,
          discountType: 'percentage',
        },
        { name: 'Chinese Cupping (Ventosa)', price: 600, duration: 45 },
        { name: 'Foot Reflexology', price: 450, duration: 30 },
      ],
    },
    {
      name: 'The Mandara Spa BGC',
      slug: 'the-mandara-spa-bgc',
      category: 'Combination / Multi-style',
      region: 'NCR',
      city: 'Taguig',
      address: 'Unit 318 McKinley Park Residences, 3rd Ave. cor. 31st St., BGC, Taguig',
      latitude: 14.5535,
      longitude: 121.0502,
      description:
        'The Mandara Spa offers personalized, luxurious treatments from head to toe at value-for-money rates. Our signature Mandara massage blends Swedish long strokes with Balinese techniques for total relaxation. Private treatment rooms, complimentary herbal tea, and a tranquil ambience await. By appointment preferred. Open daily 11AM-11PM.',
      tags: ['By Appointment Only', 'Credit Card Accepted', 'Couple Massage', 'WiFi Available'],
      images: nextImages(3),
      isActive: true,
      services: [
        { name: 'Mandara Signature Massage (75 min)', price: 1850, duration: 75 },
        { name: 'Mandara Signature Massage (90 min)', price: 2250, duration: 90 },
        { name: 'Mandara Signature Massage (120 min)', price: 2850, duration: 120 },
        {
          name: 'Couples Relaxation Package',
          price: 3500,
          duration: 90,
          discount: 500,
          discountType: 'fixed',
        },
      ],
    },
    {
      name: 'Chang Thai Massage Poblacion',
      slug: 'chang-thai-massage-poblacion',
      category: 'Thai Massage',
      region: 'NCR',
      city: 'Makati',
      address: '5071 P. Burgos St., Poblacion, Makati City',
      latitude: 14.5636,
      longitude: 121.0321,
      description:
        'Chang Thai brings the authentic Wat Pho massage experience to the vibrant streets of Poblacion, Makati. With 6 branches across Metro Manila, our Thai-trained therapists deliver traditional dry massage focusing on pressure points and body stretching. A favorite after-work spot for professionals in the Makati CBD. Open 12NN-2AM daily.',
      tags: ['Walk-In Welcome', 'GCash Accepted', 'Male Therapist', 'Female Therapist'],
      images: nextImages(2),
      isActive: true,
      services: [
        { name: 'Traditional Thai Massage', price: 500, duration: 60 },
        { name: 'Thai Oil Massage', price: 700, duration: 60 },
        { name: 'Thai Herbal Compress Massage', price: 900, duration: 90 },
        { name: 'Twin Thai Massage (2 persons)', price: 1500, duration: 60 },
      ],
    },
    {
      name: 'Tonton Prestige Massage Legazpi',
      slug: 'tonton-prestige-massage-legazpi',
      category: 'Thai Massage',
      region: 'NCR',
      city: 'Makati',
      address: '126 Legazpi St., Legazpi Village, Makati City',
      latitude: 14.5553,
      longitude: 121.0198,
      description:
        'Tonton Prestige specializes in Wat Pho traditional Thai massage, a dry massage focusing on pressure points and body stretching techniques. With multiple branches in Makati, we are a trusted name for deep relaxation and pain relief. Our therapists are trained in Bangkok and bring years of expertise. Open daily 11AM-1AM.',
      tags: ['Walk-In Welcome', 'Parking Available', 'Credit Card Accepted', 'GCash Accepted'],
      images: nextImages(2),
      isActive: true,
      services: [
        { name: 'Wat Pho Thai Massage', price: 600, duration: 60 },
        { name: 'Thai Aromatherapy Massage', price: 800, duration: 60 },
        { name: 'Back & Shoulder Relief', price: 400, duration: 30 },
        { name: 'Foot Reflexology', price: 350, duration: 30 },
      ],
    },
    {
      name: 'Asian Massage Makati',
      slug: 'asian-massage-makati',
      category: 'Combination / Multi-style',
      region: 'NCR',
      city: 'Makati',
      address: 'Goldrich Mansion Building, South Superhighway, Makati City',
      latitude: 14.5437,
      longitude: 121.0088,
      description:
        'Asian Massage is a 24/7 wellness center offering a wide variety of Asian massage techniques. From Philippine traditional Hilot to Japanese Shiatsu, Korean Seomyeong, Thai massage, and more — we have something for everyone. We also offer Ventosa cupping therapy, lymphatic drainage, and gentle baby massage. A one-stop shop for holistic healing.',
      tags: ['24/7', 'Walk-In Welcome', 'Home Service', 'GCash Accepted'],
      images: nextImages(3),
      isActive: true,
      services: [
        { name: 'Hilot Filipino Massage', price: 450, duration: 60 },
        { name: 'Shiatsu Massage', price: 550, duration: 60 },
        { name: 'Thai Massage', price: 500, duration: 60 },
        { name: 'Hot Stone Therapy', price: 700, duration: 60 },
        { name: 'Ventosa Cupping', price: 400, duration: 30 },
        { name: 'Baby Massage', price: 350, duration: 30 },
      ],
    },
    {
      name: 'Celebrity Spiral Spa',
      slug: 'celebrity-spiral-spa-qc',
      category: 'Combination / Multi-style',
      region: 'NCR',
      city: 'Quezon City',
      address: 'Future Point Plaza 2, G/F 115 Mother Ignacia Ave., South Triangle, Quezon City',
      latitude: 14.6334,
      longitude: 121.0378,
      description:
        'Celebrity Spiral Spa is a neighborhood favorite near Timog Avenue offering a wide range of massage and wellness services at affordable prices. Our clean, air-conditioned rooms and friendly staff make every visit a treat. Popular with couples looking for a budget-friendly spa date. Open daily 10AM-10PM.',
      tags: ['Walk-In Welcome', 'Couple Massage', 'GCash Accepted', 'Senior Discount'],
      images: nextImages(2),
      isActive: true,
      services: [
        { name: 'Swedish Massage', price: 400, duration: 60 },
        { name: 'Shiatsu Massage', price: 400, duration: 60 },
        { name: 'Hot Stone Massage', price: 600, duration: 60 },
        { name: 'Hilot with Ventosa', price: 700, duration: 60 },
        { name: 'Thai Massage w/ Herbal Compress', price: 600, duration: 60 },
        { name: 'Couples Massage (per person)', price: 350, duration: 60 },
      ],
    },
    {
      name: 'Thai Royale Spa Tomas Morato',
      slug: 'thai-royale-spa-tomas-morato',
      category: 'Thai Massage',
      region: 'NCR',
      city: 'Quezon City',
      address: 'Tomas Morato Ave., South Triangle, Quezon City',
      latitude: 14.6355,
      longitude: 121.0345,
      description:
        'Thai Royale Spa is a family-oriented spa in the heart of the Tomas Morato entertainment district. We offer authentic Thai massage in a clean, relaxing environment. Our spacious rooms are perfect for groups and families looking for affordable wellness treatments. Open daily 12NN-12MN.',
      tags: ['Walk-In Welcome', 'Parking Available', 'WiFi Available', 'GCash Accepted'],
      images: nextImages(2),
      isActive: true,
      services: [
        { name: 'Royal Thai Massage', price: 500, duration: 60 },
        { name: 'Thai Oil Massage', price: 650, duration: 60 },
        { name: 'Thai Foot Massage', price: 350, duration: 30 },
        {
          name: 'Combination Massage',
          price: 750,
          duration: 90,
          discount: 50,
          discountType: 'fixed',
        },
      ],
    },
    {
      name: 'BlueWater Day Spa Makati',
      slug: 'bluewater-day-spa-makati',
      category: 'Swedish Massage',
      region: 'NCR',
      city: 'Makati',
      address: '7835 Makati Ave., Makati City',
      latitude: 14.5583,
      longitude: 121.0165,
      description:
        'BlueWater Day Spa is known for its specialized massages for kids and pregnant women. Baby massage starts from 6 months old. Our gentle, experienced therapists make sure every guest — from infants to seniors — feels cared for. A family-friendly spa in the heart of Makati. Open daily 10AM-10PM.',
      tags: [
        'Walk-In Welcome',
        'Credit Card Accepted',
        'Wheelchair Accessible',
        'Female Therapist',
      ],
      images: nextImages(2),
      isActive: true,
      services: [
        { name: 'Classic Swedish Massage', price: 600, duration: 60 },
        { name: 'Prenatal Massage', price: 700, duration: 60 },
        { name: 'Baby Massage (6mo-7yrs)', price: 550, duration: 60 },
        { name: 'Deep Tissue Massage', price: 750, duration: 60 },
      ],
    },
    // --- CEBU ---
    {
      name: 'Tree Shade Spa Cebu',
      slug: 'tree-shade-spa-cebu',
      category: 'Combination / Multi-style',
      region: 'Region VII',
      city: 'Cebu City',
      address: 'Archbishop Reyes Ave., Cebu City',
      latitude: 10.3175,
      longitude: 123.8917,
      description:
        "Tree Shade Spa is one of Cebu City's most popular wellness destinations, offering a wide range of services from Swedish and Shiatsu to Thai massage and hot stone treatments. Known for its lush, garden-like interiors and affordable prices, it's a favorite among locals and tourists alike. Body scrubs and facial treatments also available. Open daily 10AM-12MN.",
      tags: ['Walk-In Welcome', 'Parking Available', 'Couple Massage', 'GCash Accepted'],
      images: nextImages(3),
      isActive: true,
      services: [
        { name: 'Swedish Massage', price: 400, duration: 60 },
        { name: 'Shiatsu Massage', price: 400, duration: 60 },
        { name: 'Thai Massage', price: 450, duration: 60 },
        { name: 'Hot Stone Massage', price: 700, duration: 60 },
        {
          name: 'Body Scrub + Massage Combo',
          price: 900,
          duration: 90,
          discount: 100,
          discountType: 'fixed',
        },
      ],
    },
    {
      name: 'Body & Sole Spa Cebu',
      slug: 'body-and-sole-spa-cebu',
      category: 'Reflexology',
      region: 'Region VII',
      city: 'Cebu City',
      address: 'Ayala Center Cebu, Cardinal Rosales Ave., Cebu Business Park, Cebu City',
      latitude: 10.3189,
      longitude: 123.905,
      description:
        'Body & Sole is one of the most accessible and affordable spa chains in Cebu, with multiple branches across the city. Known for excellent foot reflexology and full-body massages at wallet-friendly prices. Clean facilities, professional therapists, and a loyal following among Cebuano regulars. Open daily 10AM-10PM.',
      tags: ['Walk-In Welcome', 'WiFi Available', 'Credit Card Accepted', 'Student Discount'],
      images: nextImages(2),
      isActive: true,
      services: [
        { name: 'Foot Reflexology', price: 300, duration: 60 },
        { name: 'Full Body Massage', price: 350, duration: 60 },
        { name: 'Combination Massage', price: 500, duration: 90 },
        { name: 'Back & Shoulder Massage', price: 250, duration: 30 },
      ],
    },
    {
      name: 'Nature Wellness Massage & Spa',
      slug: 'nature-wellness-lapu-lapu',
      category: 'Swedish Massage',
      region: 'Region VII',
      city: 'Lapu-Lapu City',
      address: 'M.L. Quezon National Highway, Lapu-Lapu City, Cebu',
      latitude: 10.3103,
      longitude: 123.9494,
      description:
        'Nature Wellness Massage & Spa offers a serene escape near the Mactan resort area. Our treatments use natural, locally-sourced ingredients including virgin coconut oil and calamansi extracts. A favorite among tourists visiting Mactan Island. Open daily 9AM-11PM.',
      tags: ['Parking Available', 'Walk-In Welcome', 'Couple Massage', 'GCash Accepted'],
      images: nextImages(2),
      isActive: true,
      services: [
        { name: 'Swedish Massage', price: 500, duration: 60 },
        { name: 'Aromatherapy Massage', price: 650, duration: 60 },
        {
          name: 'Couples Package',
          price: 1100,
          duration: 60,
          discount: 10,
          discountType: 'percentage',
        },
        { name: 'Calamansi Body Scrub + Massage', price: 800, duration: 90 },
      ],
    },
    // --- DAVAO ---
    {
      name: 'Dusit Thani Devarana Spa Davao',
      slug: 'dusit-devarana-spa-davao',
      category: 'Combination / Multi-style',
      region: 'Region XI',
      city: 'Davao City',
      address: 'Dusit Thani Residence, Puso ng Bayan, General Luna St., Davao City',
      latitude: 7.0667,
      longitude: 125.6095,
      description:
        'Devarana Spa at Dusit Thani Residence Davao offers a luxurious wellness experience inspired by Thai hospitality. Our treatments feature premium products and skilled therapists trained in traditional Thai and Western techniques. The spa includes private treatment suites, a relaxation lounge, and steam facilities. By appointment. Open daily 10AM-10PM.',
      tags: ['By Appointment Only', 'Parking Available', 'Credit Card Accepted', 'Couple Massage'],
      images: nextImages(3),
      isActive: true,
      services: [
        { name: 'Devarana Signature Massage', price: 2500, duration: 90 },
        { name: 'Traditional Thai Massage', price: 1800, duration: 60 },
        { name: 'Deep Tissue Sports Massage', price: 2000, duration: 60 },
        { name: 'Sweet Potato & Lavender Body Scrub', price: 1500, duration: 45 },
        {
          name: 'Couples Harmony Package',
          price: 4500,
          duration: 120,
          discount: 500,
          discountType: 'fixed',
        },
      ],
    },
    {
      name: 'Davao Hilot & Wellness Center',
      slug: 'davao-hilot-wellness-center',
      category: 'Hilot (Filipino Traditional)',
      region: 'Region XI',
      city: 'Davao City',
      address: '87 C.M. Recto St., Davao City',
      latitude: 7.0712,
      longitude: 125.6131,
      description:
        'Specializing in traditional Filipino Hilot, this wellness center is a Davao favorite for affordable, authentic healing massage. Our manghihilot use banana leaves, virgin coconut oil, and traditional techniques passed down through generations. We also offer Ventosa cupping and dagdagay foot massage. Walk-ins welcome. Open daily 8AM-10PM.',
      tags: ['Walk-In Welcome', 'Home Service', 'Senior Discount', 'GCash Accepted'],
      images: nextImages(2),
      isActive: true,
      services: [
        { name: 'Traditional Hilot Massage', price: 300, duration: 60 },
        { name: 'Hilot with Banana Leaves', price: 450, duration: 75 },
        { name: 'Ventosa Cupping Therapy', price: 250, duration: 30 },
        { name: 'Dagdagay Foot Massage', price: 200, duration: 30 },
        { name: 'Home Service Hilot', price: 500, duration: 60 },
      ],
    },
    // --- BAGUIO ---
    {
      name: 'Massage Luxx Spa Baguio',
      slug: 'massage-luxx-spa-baguio',
      category: 'Combination / Multi-style',
      region: 'CAR',
      city: 'Baguio',
      address: 'G/F West Burnham Place, 16 Kisad Rd. cor. Shanum St., Baguio City',
      latitude: 16.4119,
      longitude: 120.5933,
      description:
        "Baguio City's first Japanese Onsen-inspired spa offers a premium wellness experience in the cool mountain air. Massage Luxx combines Japanese bathing traditions with Filipino hospitality. Facilities include infrared sauna, jacuzzi, and clean private rooms. A must-visit after a long drive to the Summer Capital. Open daily 12PM-2AM.",
      tags: ['Parking Available', 'WiFi Available', 'Couple Massage', 'Credit Card Accepted'],
      images: nextImages(2),
      isActive: true,
      services: [
        { name: 'Signature Combination Massage', price: 600, duration: 60 },
        { name: 'Shiatsu Massage', price: 550, duration: 60 },
        { name: 'Swedish Massage', price: 550, duration: 60 },
        { name: 'Organic Bamboo Massage', price: 700, duration: 60 },
        { name: 'Japanese Atama Head Spa', price: 400, duration: 30 },
      ],
    },
    {
      name: 'Casa Vallejo Spa',
      slug: 'casa-vallejo-spa-baguio',
      category: 'Swedish Massage',
      region: 'CAR',
      city: 'Baguio',
      address: 'Upper Session Road, beside SM City Baguio, Baguio City',
      latitude: 16.4131,
      longitude: 120.5962,
      description:
        'Located in the historic Casa Vallejo building on Session Road, this spa combines heritage charm with modern wellness. The cool Baguio climate and pine-scented air enhance every treatment. A perfect way to unwind after exploring the city. Open daily 10AM-10PM.',
      tags: ['Walk-In Welcome', 'Parking Available', 'WiFi Available', 'Senior Discount'],
      images: nextImages(2),
      isActive: true,
      services: [
        { name: 'Swedish Relaxation Massage', price: 500, duration: 60 },
        { name: 'Aromatherapy Massage', price: 650, duration: 60 },
        { name: 'Foot Reflexology', price: 350, duration: 30 },
        { name: 'Pine Oil Signature Massage', price: 700, duration: 60 },
      ],
    },
    // --- BORACAY ---
    {
      name: 'Tirta Spa Boracay',
      slug: 'tirta-spa-boracay',
      category: 'Aromatherapy',
      region: 'Region VI',
      city: 'Malay',
      address: 'Station 1, Beachfront, Boracay Island, Malay, Aklan',
      latitude: 11.974,
      longitude: 121.9248,
      description:
        'Tirta Spa is a premier beachfront spa on Boracay Island offering luxury treatments with ocean views. Our therapists use premium organic products and blend Balinese, Thai, and Filipino healing traditions. The open-air treatment pavilions with sea breeze create an unforgettable spa experience. By appointment recommended. Open daily 9AM-9PM.',
      tags: ['By Appointment Only', 'Credit Card Accepted', 'Couple Massage', 'WiFi Available'],
      images: nextImages(3),
      isActive: true,
      services: [
        { name: 'Tirta Signature Aromatherapy', price: 2500, duration: 90 },
        { name: 'Traditional Filipino Hilot', price: 1800, duration: 60 },
        { name: 'Balinese Massage', price: 2200, duration: 75 },
        {
          name: 'Couples Sunset Package',
          price: 4000,
          duration: 90,
          discount: 10,
          discountType: 'percentage',
        },
        { name: 'After-Sun Aloe Treatment', price: 1200, duration: 45 },
      ],
    },
    // --- ILOILO ---
    {
      name: 'Daluy Spa Iloilo',
      slug: 'daluy-spa-iloilo',
      category: 'Hilot (Filipino Traditional)',
      region: 'Region VI',
      city: 'Iloilo City',
      address: 'Smallville Complex, Mandurriao, Iloilo City',
      latitude: 10.7133,
      longitude: 122.5572,
      description:
        'Daluy Spa celebrates the rich tradition of Ilonggo healing through its signature Daluy Hilot massage. Using locally-sourced virgin coconut oil and traditional techniques, our therapists provide a deeply rooted Filipino wellness experience. The crown jewel is our 90-minute Daluy Hilot Signature Massage. Open daily 11AM-11PM.',
      tags: ['Walk-In Welcome', 'Parking Available', 'GCash Accepted', 'Couple Massage'],
      images: nextImages(2),
      isActive: true,
      services: [
        { name: 'Daluy Hilot Signature Massage', price: 2200, duration: 90 },
        { name: 'Traditional Hilot', price: 600, duration: 60 },
        { name: 'Swedish Massage', price: 550, duration: 60 },
        { name: 'Premium Foot Spa with Pedicure', price: 420, duration: 45 },
      ],
    },
    // --- PAMPANGA ---
    {
      name: 'Reign Spa Angeles City',
      slug: 'reign-spa-angeles-city',
      category: 'Combination / Multi-style',
      region: 'Region III',
      city: 'Angeles',
      address: 'Don Juico Ave., Angeles City, Pampanga',
      latitude: 15.1449,
      longitude: 120.5887,
      description:
        'With over 20 years of expertise, Reign Spa is the premier massage destination in Angeles City. Popular with expats near Clark Freeport Zone, we offer Swedish, Shiatsu, Thai, and traditional Hilot massages in clean, air-conditioned facilities. Our experienced therapists and affordable prices keep guests coming back. Open daily 10AM-12MN.',
      tags: ['Walk-In Welcome', 'Parking Available', 'WiFi Available', 'Credit Card Accepted'],
      images: nextImages(2),
      isActive: true,
      services: [
        { name: 'Swedish Massage', price: 450, duration: 60 },
        { name: 'Shiatsu Massage', price: 450, duration: 60 },
        { name: 'Thai Massage', price: 500, duration: 60 },
        { name: 'Hilot Filipino Massage', price: 400, duration: 60 },
        {
          name: 'Combination Massage',
          price: 600,
          duration: 90,
          discount: 50,
          discountType: 'fixed',
        },
      ],
    },
    {
      name: 'Citronnelle Spa & Café',
      slug: 'citronnelle-spa-angeles',
      category: 'Combination / Multi-style',
      region: 'Region III',
      city: 'Angeles',
      address: 'Unit 5/6, 2nd Floor, BNK Bldg, Friendship Hi-way, Anunas, Angeles City',
      latitude: 15.1678,
      longitude: 120.5541,
      description:
        'Citronnelle Spa combines an authentic Moroccan bath experience with a cozy café in Angeles City. Their signature Moroccan Bath Package includes a body scrub, 1-hour massage, scalp treatment, and steam bath. A unique wellness concept near Clark that has been a local favorite for years. Open Mon-Sun 10AM-1AM.',
      tags: ['Parking Available', 'WiFi Available', 'GCash Accepted', 'Couple Massage'],
      images: nextImages(2),
      isActive: true,
      services: [
        { name: 'Moroccan Bath Package', price: 999, duration: 120 },
        { name: 'Full Body Massage', price: 500, duration: 60 },
        { name: 'Body Scrub', price: 400, duration: 30 },
        {
          name: 'Couple Spa Package',
          price: 1800,
          duration: 120,
          discount: 200,
          discountType: 'fixed',
        },
      ],
    },
    // --- LAGUNA ---
    {
      name: 'Calamba Hot Spring Spa',
      slug: 'calamba-hot-spring-spa',
      category: 'Hot Stone',
      region: 'Region IV-A',
      city: 'Calamba',
      address: 'National Highway, Pansol, Calamba, Laguna',
      latitude: 14.1964,
      longitude: 121.1756,
      description:
        'Located in the famous hot spring district of Pansol, Calamba, this spa harnesses the natural mineral-rich waters of Laguna for its treatments. Our hot stone therapy uses volcanic basalt stones heated in natural spring water. Combined with traditional Swedish techniques, it offers a uniquely Filipino wellness experience. Open 24/7.',
      tags: ['24/7', 'Parking Available', 'Walk-In Welcome', 'Couple Massage'],
      images: nextImages(2),
      isActive: true,
      services: [
        { name: 'Hot Stone Therapy', price: 800, duration: 60 },
        { name: 'Mineral Spring Swedish Massage', price: 600, duration: 60 },
        {
          name: 'Hot Spring Soak + Massage Package',
          price: 1000,
          duration: 90,
          discount: 15,
          discountType: 'percentage',
        },
        { name: 'Volcanic Mud Body Wrap', price: 700, duration: 45 },
      ],
    },
    // --- TAGAYTAY ---
    {
      name: 'Nurture Wellness Village Tagaytay',
      slug: 'nurture-wellness-village-tagaytay',
      category: 'Hilot (Filipino Traditional)',
      region: 'Region IV-A',
      city: 'Tagaytay',
      address: 'Purok 3, Barangay Maitim II West, Tagaytay City, Cavite',
      latitude: 14.1153,
      longitude: 120.9621,
      description:
        'Nurture Wellness Village is a sprawling spa resort in the cool highlands of Tagaytay, dedicated to preserving and promoting Filipino healing traditions. Our Hilot treatments use locally-grown herbs and organic coconut oil. The lush gardens, cool mountain air, and traditional nipa hut treatment rooms make this a destination spa experience. By appointment. Open daily 8AM-8PM.',
      tags: ['By Appointment Only', 'Parking Available', 'Female Therapist', 'Couple Massage'],
      images: nextImages(3),
      isActive: true,
      services: [
        { name: 'Traditional Hilot Healing', price: 800, duration: 60 },
        { name: 'Hilot with Herbal Wrap', price: 1200, duration: 90 },
        { name: 'Dagdagay Bamboo Foot Massage', price: 500, duration: 30 },
        {
          name: 'Couples Garden Hilot',
          price: 2000,
          duration: 90,
          discount: 200,
          discountType: 'fixed',
        },
        { name: 'Prenatal Hilot', price: 900, duration: 60 },
      ],
    },
    // --- MANILA ---
    {
      name: 'Crown Garden Spa Ermita',
      slug: 'crown-garden-spa-ermita',
      category: 'Combination / Multi-style',
      region: 'NCR',
      city: 'Manila',
      address: 'M. Adriatico St., Ermita, Manila',
      latitude: 14.5763,
      longitude: 120.9847,
      description:
        'Crown Garden Spa in Ermita is a well-established Manila spa offering a comprehensive menu of massage and body scrub services. From their signature Crown Garden massage to Swedish, Shiatsu, Thai, and aromatherapy, there is something for everyone. Their body scrub options include chocolate, coffee, sea salt, green tea, and vanilla whitening. Open 24/7.',
      tags: ['24/7', 'Walk-In Welcome', 'Credit Card Accepted', 'GCash Accepted'],
      images: nextImages(2),
      isActive: true,
      services: [
        { name: 'Crown Garden Signature Massage', price: 550, duration: 60 },
        { name: 'Swedish Massage', price: 500, duration: 60 },
        { name: 'Shiatsu Massage', price: 500, duration: 60 },
        { name: 'Aromatherapy Massage', price: 650, duration: 60 },
        {
          name: 'Coffee Body Scrub + Massage',
          price: 800,
          duration: 90,
          discount: 10,
          discountType: 'percentage',
        },
        { name: 'Vanilla Whitening Body Scrub', price: 600, duration: 45 },
      ],
    },
    // --- Inactive listing ---
    {
      name: 'Serenity Spa BGC (Temporarily Closed)',
      slug: 'serenity-spa-bgc-closed',
      category: 'Aromatherapy',
      region: 'NCR',
      city: 'Taguig',
      address: 'High Street South Block, BGC, Taguig City',
      description:
        'Temporarily closed for renovation. Reopening soon with expanded treatment rooms and new wellness packages. Follow our social media for updates.',
      tags: ['Credit Card Accepted', 'WiFi Available'],
      images: [images[0]],
      isActive: false,
      services: [{ name: 'Aromatherapy Signature Massage', price: 1200, duration: 60 }],
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

  console.log(`\nSeeded ${listings.length} listings with real data and images!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
