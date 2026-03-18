import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { downloadBusinessImages, BusinessImages } from './seed-images';

const prisma = new PrismaClient();

function getImages(images: BusinessImages, slug: string, fallback: BusinessImages): string[] {
  const urls = images[slug];
  if (urls && urls.length > 0) return urls;
  // Fallback: grab any available images
  for (const imgs of Object.values(fallback)) {
    if (imgs.length > 0) return [imgs[0]];
  }
  return ['https://placehold.co/800x600?text=No+Image'];
}

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

  // === FETCH REAL BUSINESS IMAGES FROM GOOGLE PLACES ===
  const images = await downloadBusinessImages();

  // === CREATE LISTINGS WITH VERIFIED DATA ===
  const listings = [
    // --- BREEZE ORIENTAL SPA BGC ---
    {
      name: 'Breeze Oriental Spa & Massage - BGC',
      slug: 'breeze-oriental-spa-bgc',
      category: 'Chinese Massage',
      region: 'NCR',
      city: 'Taguig',
      address: 'G/F Orē Central, 9th Ave. cor. 31st St., Bonifacio Global City, Taguig 1634',
      latitude: 14.5509,
      longitude: 121.0487,
      description:
        'Breeze Oriental Spa provides authentic Chinese massage in a luxurious, healing environment in BGC. Therapists undergo 3-6 months of extensive training. The BGC branch has 17 fully equipped rooms for each massage category. Open Mon-Thu & Sun 11AM-1AM, Fri-Sat 11AM-2AM. Contact: 0917-867-6699.',
      tags: [
        'Parking Available',
        'Credit Card Accepted',
        'WiFi Available',
        'Walk-In Welcome',
        'Couple Massage',
      ],
      images: getImages(images, 'breeze-oriental-spa-bgc', images),
      isActive: true,
      services: [
        { name: 'Oriental Foot Massage', price: 1350, duration: 60 },
        { name: 'Breeze Foot Massage', price: 1850, duration: 90 },
        { name: 'Pressure Points Body Massage', price: 1500, duration: 60 },
        { name: 'Shiatsu Body Massage', price: 2100, duration: 90 },
        { name: 'Thai Body Massage', price: 2600, duration: 120 },
        { name: 'Revitalize Oil Therapy', price: 1800, duration: 60 },
        { name: 'Wellness Oil Therapy', price: 2300, duration: 90 },
        { name: 'Detoxify Oil Therapy', price: 3400, duration: 120 },
        { name: 'Neck & Shoulder Treatment', price: 900, duration: 30 },
        { name: 'Cupping / Ventosa', price: 800, duration: 20 },
      ],
    },
    // --- BREEZE ORIENTAL SPA MAKATI ---
    {
      name: 'Breeze Oriental Spa & Massage - Makati',
      slug: 'breeze-oriental-spa-makati',
      category: 'Chinese Massage',
      region: 'NCR',
      city: 'Makati',
      address:
        'G/F Skyland Plaza Tower B, Malugay St. cor. Talisay St., San Antonio Village, Makati 1210',
      latitude: 14.56,
      longitude: 121.0192,
      description:
        "The Makati branch of Breeze Oriental Spa brings the same authentic Chinese massage experience to Makati's San Antonio Village. Featuring a holistic approach to wellness with trained therapists specializing in Tui Na, acupressure, and oil therapies. Open Mon-Thu & Sun 11AM-1AM, Fri-Sat 11AM-2AM. Contact: 0917-846-8866.",
      tags: ['Parking Available', 'Credit Card Accepted', 'WiFi Available', 'Walk-In Welcome'],
      images: getImages(images, 'breeze-oriental-spa-makati', images),
      isActive: true,
      services: [
        { name: 'Oriental Foot Massage', price: 1350, duration: 60 },
        { name: 'Pressure Points Body Massage', price: 1500, duration: 60 },
        { name: 'Shiatsu Body Massage', price: 2100, duration: 90 },
        { name: 'Revitalize Oil Therapy', price: 1800, duration: 60 },
        { name: 'Head & Neck Treatment', price: 1200, duration: 30 },
        { name: 'Back Scraping (Gua Sha)', price: 800, duration: 20 },
        { name: 'Foot Scrub', price: 500, duration: 20 },
      ],
    },
    // --- THE MANDARA SPA BGC ---
    {
      name: 'The Mandara Spa - BGC 3rd Ave',
      slug: 'the-mandara-spa-bgc',
      category: 'Combination / Multi-style',
      region: 'NCR',
      city: 'Taguig',
      address: 'Unit 318 McKinley Park Residences, 3rd Ave. cor. 31st St., BGC, Taguig',
      latitude: 14.5535,
      longitude: 121.0502,
      description:
        'A boutique spa at the heart of BGC featuring wall arts and decor made of indigenous Filipino materials such as capiz shells, showcasing genuine warmth of Filipino hospitality. Private treatment rooms with soft lighting, calming music, and soothing aromas. Open Mon-Sun 12NN-11PM. Contact: 0915-844-3003 / (02) 8869-9910.',
      tags: ['By Appointment Only', 'Credit Card Accepted', 'Couple Massage', 'WiFi Available'],
      images: getImages(images, 'the-mandara-spa-bgc', images),
      isActive: true,
      services: [
        { name: 'Mandara Signature Massage (75 min)', price: 1850, duration: 75 },
        { name: 'Mandara Signature Massage (90 min)', price: 2250, duration: 90 },
        { name: 'Mandara Signature Massage (120 min)', price: 2850, duration: 120 },
        { name: 'Swedish Aromatherapy (60 min)', price: 1350, duration: 60 },
        { name: 'Shiatsu Dry Massage (60 min)', price: 1350, duration: 60 },
        { name: 'Hot Stone Massage (90 min)', price: 2400, duration: 90 },
        { name: 'Four Hands Therapy (60 min)', price: 2500, duration: 60 },
        { name: 'Ventosa Cupping with Hilot (90 min)', price: 2550, duration: 90 },
        { name: 'Xiamen Foot Massage (60 min)', price: 1350, duration: 60 },
        { name: 'Signature Foot Spa with Pedicure', price: 2150, duration: 75 },
        { name: 'Ultimate Mandara Experience (3hr 15min)', price: 5800, duration: 195 },
      ],
    },
    // --- CHANG THAI MASSAGE POBLACION ---
    {
      name: 'Chang Thai Massage - Poblacion',
      slug: 'chang-thai-massage-poblacion',
      category: 'Thai Massage',
      region: 'NCR',
      city: 'Makati',
      address: '5071 P. Burgos St., Poblacion, Makati City',
      latitude: 14.5636,
      longitude: 121.0321,
      description:
        'Chang Thai has 6 branches across Metro Manila, and the Poblacion branch is a favorite among Makati nightlife-goers. Specializing in Wat Pho traditional Thai massage — a dry massage focusing on pressure points and body stretching. Open 12NN-2AM daily.',
      tags: ['Walk-In Welcome', 'GCash Accepted', 'Male Therapist', 'Female Therapist'],
      images: getImages(images, 'chang-thai-massage-poblacion', images),
      isActive: true,
      services: [
        { name: 'Traditional Thai Massage', price: 500, duration: 60 },
        { name: 'Thai Oil Massage', price: 700, duration: 60 },
        { name: 'Thai Herbal Compress Massage', price: 900, duration: 90 },
        { name: 'Twin Thai Massage (2 persons)', price: 1500, duration: 60 },
      ],
    },
    // --- CELEBRITY SPIRAL SPA QC ---
    {
      name: 'Celebrity Spiral Spa',
      slug: 'celebrity-spiral-spa-qc',
      category: 'Combination / Multi-style',
      region: 'NCR',
      city: 'Quezon City',
      address:
        'Future Point Plaza 2, G/F 115 Mother Ignacia Ave., South Triangle, Quezon City 1103',
      latitude: 14.6334,
      longitude: 121.0378,
      description:
        'Celebrity Spiral Spa is a neighborhood favorite near Timog Avenue. VIP rooms with private en-suite showers are available. Known for affordable couples massage and a wide range of treatments. Open daily 10AM-10PM. Contact: (02) 8374-7786 / 0949-885-6273.',
      tags: ['Walk-In Welcome', 'Couple Massage', 'GCash Accepted', 'Senior Discount'],
      images: getImages(images, 'celebrity-spiral-spa-qc', images),
      isActive: true,
      services: [
        { name: 'Swedish Massage (60 min)', price: 350, duration: 60 },
        { name: 'Swedish Massage (90 min)', price: 550, duration: 90 },
        { name: 'Shiatsu Massage (60 min)', price: 600, duration: 60 },
        { name: 'Shiatsu Massage (90 min)', price: 900, duration: 90 },
        { name: 'Sports Massage', price: 550, duration: 60 },
        { name: 'Hilot Traditional Filipino (60 min)', price: 450, duration: 60 },
        { name: 'Hot Stone Massage', price: 600, duration: 60 },
        { name: 'Thai Massage w/ Herbal Compress', price: 600, duration: 60 },
        { name: 'Prenatal Massage', price: 450, duration: 60 },
        { name: 'Ventosa (Fire Cupping)', price: 600, duration: 60 },
        { name: 'Couples Massage (per person)', price: 350, duration: 60 },
        { name: 'Scalp Massage', price: 300, duration: 30 },
      ],
    },
    // --- THAI ROYALE SPA TOMAS MORATO ---
    {
      name: 'Thai Royale Spa - Tomas Morato',
      slug: 'thai-royale-spa-tomas-morato',
      category: 'Thai Massage',
      region: 'NCR',
      city: 'Quezon City',
      address: 'Unit 202 & 203, 2nd Floor, Condominium South Insula, 61 Timog Ave., Quezon City',
      latitude: 14.6355,
      longitude: 121.0345,
      description:
        'A family-oriented spa in the entertainment center of Quezon City. Franchised from EKG Thai Royale Spa Inc. and founded in 2024. Offers authentic Thai massage, Swedish, aromatherapy, combination massage, and chiropractic services. Open 24 hours Mon-Sun. Contact: 0939-932-8424 / 0917-308-8424.',
      tags: ['24/7', 'Walk-In Welcome', 'Parking Available', 'GCash Accepted'],
      images: getImages(images, 'thai-royale-spa-tomas-morato', images),
      isActive: true,
      services: [
        { name: 'Thai Massage', price: 500, duration: 60 },
        { name: 'Swedish Massage', price: 450, duration: 60 },
        { name: 'Aromatherapy Massage', price: 600, duration: 60 },
        { name: 'Combination Massage', price: 550, duration: 60 },
        { name: 'Back Massage', price: 300, duration: 30 },
        { name: 'Foot Massage', price: 300, duration: 30 },
        { name: 'Body Scrub', price: 400, duration: 30 },
      ],
    },
    // --- BIG APPLE EXPRESS SPA BGC ---
    {
      name: 'Big Apple Express Spa - Forbes Town',
      slug: 'big-apple-express-spa-bgc',
      category: 'Combination / Multi-style',
      region: 'NCR',
      city: 'Taguig',
      address: 'F103, Forbes Town Center, Burgos Circle cor. Rizal Drive, BGC, Taguig',
      latitude: 14.552,
      longitude: 121.0465,
      description:
        'Big Apple Express Spa combines the ancient art of massage with modern business systems. Known for affordable express massages starting at just ₱200. Located in Forbes Town Center BGC with a second branch at Market! Market! An innovative concept for quick relaxation during a busy day.',
      tags: ['Walk-In Welcome', 'Credit Card Accepted', 'GCash Accepted', 'WiFi Available'],
      images: getImages(images, 'big-apple-express-spa-bgc', images),
      isActive: true,
      services: [
        { name: 'Make Your Own Massage', price: 200, duration: 15 },
        { name: 'NYC Express Massage', price: 250, duration: 30 },
        { name: 'Manhattan Massage', price: 700, duration: 45 },
        { name: 'Balinese Deluxe', price: 1000, duration: 60 },
        { name: 'Brazilian Deluxe (Deep Tissue)', price: 1200, duration: 60 },
        { name: 'Quick Relief Foot Massage', price: 400, duration: 30 },
        { name: 'Sole Revival Foot Massage', price: 800, duration: 60 },
        { name: 'Deep Tissue Sole Revival', price: 950, duration: 60 },
        { name: 'GlutaWhite Body Treatment', price: 900, duration: 45 },
      ],
    },
    // --- CEDAR WELLNESS SPA QC ---
    {
      name: 'Cedar Wellness Spa',
      slug: 'cedar-wellness-spa-qc',
      category: 'Combination / Multi-style',
      region: 'NCR',
      city: 'Quezon City',
      address: '3F, 70 Holy Spirit Drive, Brgy. Holy Spirit, Quezon City 1127',
      latitude: 14.6815,
      longitude: 121.0602,
      description:
        'Planned and designed in Singapore, constructed by Filipinos. Cedar Wellness Spa follows the Singaporean massage technique. Features private soundproofed rooms with Asian home-like interior, hot showers in each room, a tea center, and automatic reclining chairs in the foot massage hall. Contact: 0967-048-3714.',
      tags: ['By Appointment Only', 'Parking Available', 'WiFi Available', 'Couple Massage'],
      images: getImages(images, 'cedar-wellness-spa-qc', images),
      isActive: true,
      services: [
        { name: 'Singaporean Signature Massage', price: 700, duration: 60 },
        { name: 'Full Body Massage', price: 600, duration: 60 },
        { name: 'Foot Reflexology', price: 400, duration: 45 },
        { name: 'Combination Massage', price: 800, duration: 90 },
      ],
    },
    // --- TREE SHADE SPA CEBU ---
    {
      name: 'Tree Shade Spa - Lahug',
      slug: 'tree-shade-spa-cebu',
      category: 'Combination / Multi-style',
      region: 'Region VII',
      city: 'Cebu City',
      address: 'Salinas Drive, Lahug, Cebu City',
      latitude: 10.3283,
      longitude: 123.8964,
      description:
        "One of Cebu's most popular spa chains, open 24/7 with branches across the city. Tree Shade offers premium massages by veteran therapists, aromatherapy with six essential oil options, and even massages for children aged 2-12. Also houses TREE NAIL salon. Price range: ₱350-₱900. Contact: 0917-638-8910.",
      tags: ['24/7', 'Walk-In Welcome', 'Parking Available', 'GCash Accepted'],
      images: getImages(images, 'tree-shade-spa-cebu', images),
      isActive: true,
      services: [
        { name: 'Swedish Massage', price: 400, duration: 60 },
        { name: 'Aromatherapy Massage', price: 550, duration: 60 },
        { name: 'Thai Massage', price: 500, duration: 60 },
        { name: 'Premium Massage (Veteran Therapist)', price: 700, duration: 60 },
        { name: 'Body Scrub', price: 500, duration: 45 },
        { name: 'Body Wrap', price: 600, duration: 45 },
        { name: 'Kids Massage (ages 2-12)', price: 350, duration: 30 },
      ],
    },
    // --- BODY & SOLE CEBU ---
    {
      name: 'Body & Sole Spa - Ayala Center Cebu',
      slug: 'body-and-sole-spa-cebu',
      category: 'Reflexology',
      region: 'Region VII',
      city: 'Cebu City',
      address: 'Ayala Center Cebu, Cardinal Rosales Ave., Cebu Business Park, Cebu City',
      latitude: 10.3189,
      longitude: 123.905,
      description:
        'One of the most accessible and affordable spa chains in Cebu with multiple branches across the city. Known for excellent foot reflexology and full-body massages at wallet-friendly prices (₱250-₱700). Clean facilities and professional therapists with a loyal following among Cebuano regulars. Open daily 10AM-10PM.',
      tags: ['Walk-In Welcome', 'WiFi Available', 'Credit Card Accepted', 'Student Discount'],
      images: getImages(images, 'body-and-sole-spa-cebu', images),
      isActive: true,
      services: [
        { name: 'Foot Reflexology', price: 300, duration: 60 },
        { name: 'Full Body Massage', price: 350, duration: 60 },
        { name: 'Combination Massage', price: 500, duration: 90 },
        { name: 'Back & Shoulder Massage', price: 250, duration: 30 },
      ],
    },
    // --- NUAT THAI CEBU ---
    {
      name: 'Nuat Thai - Lahug Cebu',
      slug: 'nuat-thai-cebu',
      category: 'Thai Massage',
      region: 'Region VII',
      city: 'Cebu City',
      address: 'Salinas Drive, Lahug, Cebu City',
      latitude: 10.3279,
      longitude: 123.8959,
      description:
        'Nuat Thai is one of the largest massage franchises in the Philippines, offering consistent quality across all its locations. The Cebu branch on Salinas Drive is popular with both locals and language school students. Known for affordable Thai-style and Swedish massages. Main office: PCF Bldg. No. 20, M. Zosa St., Capitol Site, Cebu. Tel: 032-234-9302.',
      tags: ['Walk-In Welcome', 'GCash Accepted', 'Student Discount', 'Female Therapist'],
      images: getImages(images, 'nuat-thai-cebu', images),
      isActive: true,
      services: [
        { name: 'Dry Thai Massage', price: 250, duration: 60 },
        { name: 'Foot Reflexology', price: 250, duration: 60 },
        { name: 'Swedish Massage', price: 350, duration: 60 },
        { name: 'Aromatherapy Massage', price: 450, duration: 60 },
        { name: 'Combination Massage (90 min)', price: 500, duration: 90 },
      ],
    },
    // --- NATURE WELLNESS LAPU-LAPU ---
    {
      name: 'Nature Wellness Massage & Spa',
      slug: 'nature-wellness-lapu-lapu',
      category: 'Swedish Massage',
      region: 'Region VII',
      city: 'Lapu-Lapu City',
      address: 'Augusto Building, 2 Casanta Soong, Lapu-Lapu City, Cebu',
      latitude: 10.3103,
      longitude: 123.9494,
      description:
        'Combining German standards and Filipino hospitality since 2016. Therapists trained from a Frankfurt, Germany academy using German products and materials. Offers packages for bridal showers, couples, and groups. Gift vouchers and home/hotel service available. Walk-ins welcome.',
      tags: ['Walk-In Welcome', 'Home Service', 'Couple Massage', 'GCash Accepted'],
      images: getImages(images, 'nature-wellness-lapu-lapu', images),
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
        { name: 'Body Scrub + Massage', price: 800, duration: 90 },
      ],
    },
    // --- DUSIT DEVARANA SPA DAVAO ---
    {
      name: 'Devarana Spa at Dusit Thani Davao',
      slug: 'dusit-devarana-spa-davao',
      category: 'Combination / Multi-style',
      region: 'Region XI',
      city: 'Davao City',
      address: 'Dusit Thani Residence, General Luna St., Davao City',
      latitude: 7.0667,
      longitude: 125.6095,
      description:
        'Devarana Spa at the 5-star Dusit Thani Residence Davao offers luxury wellness inspired by Thai hospitality. Premium products and therapists trained in traditional Thai and Western techniques. Private treatment suites, relaxation lounge, and steam facilities. Signature body scrub uses sweet potatoes, taro, oatmeal, and lavender essential oil. By appointment. Open daily 10AM-10PM.',
      tags: ['By Appointment Only', 'Parking Available', 'Credit Card Accepted', 'Couple Massage'],
      images: getImages(images, 'dusit-devarana-spa-davao', images),
      isActive: true,
      services: [
        { name: 'Devarana Signature Massage', price: 2500, duration: 90 },
        { name: 'Traditional Thai Massage', price: 1800, duration: 60 },
        { name: 'Deep Tissue Massage', price: 2000, duration: 60 },
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
    // --- MASSAGE LUXX SPA BAGUIO ---
    {
      name: 'Massage Luxx Spa - Baguio City',
      slug: 'massage-luxx-spa-baguio',
      category: 'Combination / Multi-style',
      region: 'CAR',
      city: 'Baguio',
      address: 'G/F West Burnham Place, 16 Kisad Rd. cor. Shanum St., Baguio City',
      latitude: 16.4119,
      longitude: 120.5933,
      description:
        "Baguio City's first Japanese Onsen-inspired spa. Facilities include a warm Jacuzzi, dry sauna, and infrared sauna. Clean private rooms and a relaxing atmosphere in the cool mountain air. Perfect after a long drive to the Summer Capital. Open daily 12PM-2AM. Contact: 0917-705-7398 / 0961-712-0185 / (074) 244-0382.",
      tags: ['Parking Available', 'WiFi Available', 'Couple Massage', 'Credit Card Accepted'],
      images: getImages(images, 'massage-luxx-spa-baguio', images),
      isActive: true,
      services: [
        { name: 'Signature Combination Massage', price: 600, duration: 60 },
        { name: 'Shiatsu Massage', price: 550, duration: 60 },
        { name: 'Swedish Massage', price: 550, duration: 60 },
        { name: 'Reflexology', price: 400, duration: 30 },
        { name: 'Organic Bamboo Massage', price: 700, duration: 60 },
      ],
    },
    // --- TIRTA SPA BORACAY ---
    {
      name: 'Tirta Spa Boracay',
      slug: 'tirta-spa-boracay',
      category: 'Aromatherapy',
      region: 'Region VI',
      city: 'Malay',
      address:
        'Boracay Tambisaan Jetty Port Rd., Sitio Malabunot, Manoc-Manoc, Boracay Island, Malay, Aklan',
      latitude: 11.9674,
      longitude: 121.9249,
      description:
        'Winner of the 2025 World Luxury Spa Awards (Best Luxury Healing Spa). Tirta Spa is a premier wellness destination on Boracay Island using natural and locally-sourced ingredients. Integrates traditional Filipino healing with Asian spa practices in a tropical garden setting with open-air treatment pavilions. Founded by En Calvert with a focus on spiritual wellness. Reservation recommended. Open daily 9AM-9PM.',
      tags: ['By Appointment Only', 'Credit Card Accepted', 'Couple Massage', 'WiFi Available'],
      images: getImages(images, 'tirta-spa-boracay', images),
      isActive: true,
      services: [
        { name: 'Tirta Signature Massage', price: 3355, duration: 90 },
        { name: 'Philippine Hilot with Banana Leaves', price: 2800, duration: 60 },
        { name: 'Aromatherapy Full Body', price: 3000, duration: 75 },
        { name: "Couple's Head-to-Toe Relaxing Massage", price: 11600, duration: 120 },
        { name: 'Body Polish', price: 2750, duration: 45 },
        { name: 'Body Wrap', price: 3000, duration: 60 },
      ],
    },
    // --- REIGN SPA ANGELES CITY ---
    {
      name: 'Reign Spa',
      slug: 'reign-spa-angeles-city',
      category: 'Combination / Multi-style',
      region: 'Region III',
      city: 'Angeles',
      address: '1016 Teodoro St., Sta. Maria 1 Village, Balibago, Angeles City, Pampanga 2009',
      latitude: 15.1449,
      longitude: 120.5887,
      description:
        'A living legacy of love, authentic Filipino hospitality, and world-class massage expertise perfected over two decades since 2004. Offering Swedish, Shiatsu, Thai, and traditional Hilot massages in a warm, elegant environment. Popular with both locals and tourists near Clark Freeport Zone. Contact: 0921-213-1111 / thereignspa@gmail.com.',
      tags: ['Walk-In Welcome', 'Parking Available', 'WiFi Available', 'Credit Card Accepted'],
      images: getImages(images, 'reign-spa-angeles-city', images),
      isActive: true,
      services: [
        { name: 'Swedish Massage', price: 450, duration: 60 },
        { name: 'Shiatsu Massage', price: 450, duration: 60 },
        { name: 'Thai Massage', price: 500, duration: 60 },
        { name: 'Hilot Filipino Massage', price: 400, duration: 60 },
        { name: 'Thai Foot Massage', price: 350, duration: 60 },
      ],
    },
    // --- NUAT THAI MAKATI ---
    {
      name: 'Nuat Thai - Makati',
      slug: 'nuat-thai-makati',
      category: 'Thai Massage',
      region: 'NCR',
      city: 'Makati',
      address: 'Unit GFC-4, Classica Tower, 114 H.V. Dela Costa St., Makati',
      latitude: 14.56,
      longitude: 121.023,
      description:
        'The Makati branch of Nuat Thai, one of the largest massage franchises in the Philippines. Affordable Thai-style massages in a clean, professional setting. A great option for a quick pick-me-up during a busy workday in Makati CBD.',
      tags: ['Walk-In Welcome', 'GCash Accepted', 'Male Therapist', 'Female Therapist'],
      images: getImages(images, 'nuat-thai-makati', images),
      isActive: true,
      services: [
        { name: 'Dry Thai Massage', price: 250, duration: 60 },
        { name: 'Foot Reflexology', price: 250, duration: 60 },
        { name: 'Swedish Massage', price: 500, duration: 60 },
        { name: 'Aromatherapy Massage', price: 550, duration: 60 },
        { name: 'Hot Oil Massage', price: 550, duration: 60 },
      ],
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

  console.log(`\nSeeded ${listings.length} listings with real data and Google Places photos!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
