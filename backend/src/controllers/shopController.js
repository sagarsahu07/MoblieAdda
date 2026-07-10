const prisma = require('../config/db');

const getSettings = async (req, res) => {
  try {
    let settings = await prisma.shopSettings.findFirst();

    // Fallback if the database has not been seeded yet
    if (!settings) {
      settings = {
        shopName: 'Mobile Adda Bhilai',
        ownerName: 'Ashu & Abhishek',
        phone: '+91 70007 34481',
        whatsapp: 'https://chat.whatsapp.com/DnKJOziIHrO2l0QZOc2WwG?mode=ac_t',
        address: 'Supela Akash Ganga, Bhilai, Chhattisgarh, India',
        logo: '',
        instagram: 'https://www.instagram.com/mobileaddabhilai?igsh=YndkNmF6bDk0bzhz',
        facebook: '',
        youtube: '',
        googleMap: 'https://maps.app.goo.gl/QGwRTSc76uoBM1MV9',
        aboutShop: 'Premium Mobile Showcase in Bhilai.',
        openingHours: '11:00 AM - 09:30 PM (Daily)',
      };
    }

    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Error fetching shop settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve shop settings.',
    });
  }
};

const updateSettings = async (req, res) => {
  try {
    const {
      shopName,
      ownerName,
      phone,
      whatsapp,
      address,
      logo,
      instagram,
      facebook,
      youtube,
      googleMap,
      aboutShop,
      openingHours,
    } = req.body;

    let settings = await prisma.shopSettings.findFirst();

    if (settings) {
      // Update
      settings = await prisma.shopSettings.update({
        where: { id: settings.id },
        data: {
          shopName: shopName ?? settings.shopName,
          ownerName: ownerName ?? settings.ownerName,
          phone: phone ?? settings.phone,
          whatsapp: whatsapp ?? settings.whatsapp,
          address: address ?? settings.address,
          logo: logo ?? settings.logo,
          instagram: instagram ?? settings.instagram,
          facebook: facebook ?? settings.facebook,
          youtube: youtube ?? settings.youtube,
          googleMap: googleMap ?? settings.googleMap,
          aboutShop: aboutShop ?? settings.aboutShop,
          openingHours: openingHours ?? settings.openingHours,
        },
      });
    } else {
      // Create if it doesn't exist
      settings = await prisma.shopSettings.create({
        data: {
          shopName: shopName || 'Mobile Adda Bhilai',
          ownerName: ownerName || 'Ashu & Abhishek',
          phone: phone || '+91 70007 34481',
          whatsapp: whatsapp || '',
          address: address || 'Supela Aakash Ganga',
          logo: logo || '',
          instagram: instagram || '',
          facebook: facebook || '',
          youtube: youtube || '',
          googleMap: googleMap || '',
          aboutShop: aboutShop || '',
          openingHours: openingHours || '',
        },
      });
    }

    // Log Activity
    await prisma.activityLog.create({
      data: { action: 'Updated Shop Settings' },
    });

    return res.status(200).json({
      success: true,
      message: 'Shop settings updated successfully.',
      data: settings,
    });
  } catch (error) {
    console.error('Error updating shop settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update shop settings.',
    });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
