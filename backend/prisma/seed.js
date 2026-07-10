const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with dynamic shop settings and 5 demo smartphones...');

  // 1. Clean existing data
  await prisma.activityLog.deleteMany({});
  await prisma.mobileImage.deleteMany({});
  await prisma.mobile.deleteMany({});
  await prisma.shopSettings.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Cleared existing data.');

  // 2. Hash Password for Admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Ashu & Abhishek',
      email: 'admin@mobileadda.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('Created Admin User:', admin.email);

  // 3. Create Shop Settings
  const logoSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="black" stroke="%23f97316" stroke-width="2"/><circle cx="50" cy="50" r="42" fill="none" stroke="white" stroke-width="0.75" stroke-dasharray="2,2"/><text x="50" y="46" fill="white" font-family="'Outfit', 'Inter', sans-serif" font-weight="900" font-size="20" text-anchor="middle">MA</text><text x="50" y="62" fill="%23f97316" font-family="'Outfit', 'Inter', sans-serif" font-weight="800" font-size="7" text-anchor="middle" letter-spacing="1">MOBILE ADDA</text><text x="50" y="72" fill="white" font-family="'Outfit', 'Inter', sans-serif" font-weight="500" font-size="5" text-anchor="middle" opacity="0.6">ESTD. 2015</text></svg>`;

  const shop = await prisma.shopSettings.create({
    data: {
      shopName: 'Mobile Adda Bhilai',
      ownerName: 'Ashu & Abhishek',
      phone: '+91 70007 34481', // Ashu
      whatsapp: 'https://chat.whatsapp.com/DnKJOziIHrO2l0QZOc2WwG?mode=ac_t', // WhatsApp community link
      address: 'Shop No. 1, Supela Akash Ganga, Bhilai, Chhattisgarh, India (Near Khursipar Branch)',
      logo: logoSvg,
      instagram: 'https://www.instagram.com/mobileaddabhilai?igsh=YndkNmF6bDk0bzhz',
      facebook: 'https://www.facebook.com/mobileaddabhilai',
      youtube: '',
      googleMap: 'https://maps.app.goo.gl/QGwRTSc76uoBM1MV9',
      aboutShop: 'Mobile Adda is Bhilai\'s premier destination for high-quality certified pre-owned and premium mobile devices. Established in 2015, we specialize in offering iPhones, flagship Samsung models, OnePlus, and other premium brands at unmatched prices. Each device undergoes a rigorous multi-point quality check to ensure optimal performance, battery health, and body condition. We offer buy, sell, exchange, and finance options on premium smartphones. Visit our showroom at Supela Akash Ganga to experience premium service.',
      openingHours: '11:00 AM - 09:30 PM (Monday to Sunday)',
    },
  });
  console.log('Created Shop Settings:', shop.shopName);

  // 4. Seed 5 Demo Smartphones (Available, each with 4 images, 2 Featured)
  const mobilesData = [
    {
      brand: 'Apple',
      model: 'iPhone 13',
      variant: '128GB Blue',
      ram: '4GB',
      storage: '128GB',
      color: 'Blue',
      batteryHealth: 88,
      batteryOriginal: true,
      displayOriginal: true,
      bodyCondition: 'Excellent (Like New)',
      cameraCondition: 'Perfect - 100% Functional',
      faceIdOrFingerprint: true,
      network: 'Unlocked (5G)',
      imei: '351234567890121',
      warranty: '3 Months Shop Warranty',
      description: 'Prinstine condition Apple iPhone 13 in Blue. Display and battery are 100% original. Zero dents on the frame, screen is protected with premium tempered glass. Comes with box and original Apple Lightning to USB-C charging cable.',
      price: 45999,
      offerPrice: 42999,
      featured: true,
      status: 'Available',
      slug: 'apple-iphone-13-128gb-blue',
      images: [
        'https://images.unsplash.com/photo-1632649680185-15d910e677ba?q=80&w=600', // front
        'https://images.unsplash.com/photo-1644788390772-2d1e028b08ea?q=80&w=600', // back
        'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=600', // angle
        'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=80&w=600'  // box
      ]
    },
    {
      brand: 'Samsung',
      model: 'Galaxy S23',
      variant: '8GB RAM, 256GB Storage',
      ram: '8GB',
      storage: '256GB',
      color: 'Phantom Black',
      batteryHealth: 92,
      batteryOriginal: true,
      displayOriginal: true,
      bodyCondition: 'Excellent - Clean Frame',
      cameraCondition: 'Perfect - 100% Working Sensors',
      faceIdOrFingerprint: true,
      network: 'Unlocked (5G)',
      imei: '352345678901222',
      warranty: '6 Months Brand Warranty Left',
      description: 'Superb Samsung Galaxy S23 flagship with 256GB storage in Phantom Black. Screen has zero scratches. Battery is original with a healthy 92% life. Included in box is the original USB-C to USB-C charging cable, warranty card, and receipt.',
      price: 54999,
      offerPrice: 51999,
      featured: true,
      status: 'Available',
      slug: 'samsung-galaxy-s23-8gb-256gb-phantom-black',
      images: [
        'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600', // front
        'https://images.unsplash.com/photo-1610945415295-d9b226bba580?q=80&w=600', // back
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600', // accessories
        'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=80&w=600'  // box
      ]
    },
    {
      brand: 'OnePlus',
      model: '11 5G',
      variant: '16GB RAM, 256GB Storage',
      ram: '16GB',
      storage: '256GB',
      color: 'Eternal Green',
      batteryHealth: 90,
      batteryOriginal: true,
      displayOriginal: true,
      bodyCondition: 'Excellent - Minimal Pocket Scratches',
      cameraCondition: 'Hasselblad Optics - Flawless Lens',
      faceIdOrFingerprint: true,
      network: 'Unlocked (5G)',
      imei: '353456789012333',
      warranty: '1 Month Shop Warranty',
      description: 'High-performance OnePlus 11 5G in Eternal Green. 16GB RAM offers seamless multitasking. Both screen and battery are original. Comes with original 100W SuperVOOC charger in the box and a protective silicon cover.',
      price: 48999,
      offerPrice: 46999,
      featured: false,
      status: 'Available',
      slug: 'oneplus-11-5g-16gb-256gb-eternal-green',
      images: [
        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600', // front
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600', // back
        'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=80&w=600', // side
        'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=600'  // box
      ]
    },
    {
      brand: 'Google',
      model: 'Pixel 8',
      variant: '128GB Obsidian',
      ram: '8GB',
      storage: '128GB',
      color: 'Obsidian',
      batteryHealth: 94,
      batteryOriginal: true,
      displayOriginal: true,
      bodyCondition: 'Excellent - Pristine Display',
      cameraCondition: 'Perfect - AI Cameras Working',
      faceIdOrFingerprint: true,
      network: 'Unlocked (5G)',
      imei: '354567890123444',
      warranty: '3 Months Shop Warranty',
      description: 'Excellent condition Google Pixel 8 in Obsidian. Known for the best AI photo capabilities. Screen is 100% original. Battery health is at 94%, performing like a new device. Charging adapter and USB cable are included.',
      price: 52999,
      offerPrice: 49999,
      featured: false,
      status: 'Available',
      slug: 'google-pixel-8-128gb-obsidian',
      images: [
        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600',
        'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=80&w=600',
        'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=600'
      ]
    },
    {
      brand: 'Nothing',
      model: 'Phone (2)',
      variant: '12GB RAM, 256GB Dark Grey',
      ram: '12GB',
      storage: '256GB',
      color: 'Dark Grey',
      batteryHealth: 91,
      batteryOriginal: true,
      displayOriginal: true,
      bodyCondition: 'Pristine - Transparent Back Clean',
      cameraCondition: 'Dual 50MP Cameras - Flawless',
      faceIdOrFingerprint: true,
      network: 'Unlocked (5G)',
      imei: '355678901234555',
      warranty: '2 Months Shop Warranty',
      description: 'Extremely eye-catching Nothing Phone (2) with 256GB storage in Dark Grey. Glyph interface LEDs work 100% correctly. Clean transparent back panel without scratches. Comes with box and Nothing transparent USB-C cable.',
      price: 38999,
      offerPrice: 36999,
      featured: false,
      status: 'Available',
      slug: 'nothing-phone-2-12gb-256gb-dark-grey',
      images: [
        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600',
        'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=80&w=600',
        'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=600'
      ]
    }
  ];

  for (const m of mobilesData) {
    const { images, ...mobileFields } = m;
    const createdMobile = await prisma.mobile.create({
      data: {
        ...mobileFields,
        shopId: shop.id,
      },
    });

    // Create related images
    for (let i = 0; i < images.length; i++) {
      let imageType = 'accessories';
      if (i === 0) imageType = 'front';
      else if (i === 1) imageType = 'back';
      else if (i === 2) imageType = 'side';
      else if (i === 3) imageType = 'box';

      await prisma.mobileImage.create({
        data: {
          mobileId: createdMobile.id,
          imageUrl: images[i],
          imageType,
        },
      });
    }

    console.log(`Seeded mobile: ${createdMobile.brand} ${createdMobile.model}`);
  }

  // 5. Seed Activity Logs
  const activities = [
    'Added iPhone 13 to showcase catalog',
    'Added Galaxy S23 to showcase catalog',
    'Added OnePlus 11 5G to showcase catalog',
    'Added Google Pixel 8 to showcase catalog',
    'Added Nothing Phone (2) to showcase catalog',
    'Initialized Shop Settings using PDF data'
  ];

  for (const act of activities) {
    await prisma.activityLog.create({
      data: { action: act },
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
