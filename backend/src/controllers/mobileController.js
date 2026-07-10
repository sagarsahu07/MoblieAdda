const prisma = require('../config/db');
const { validateMobile } = require('../validations/mobile');

// Helper to generate slug
const generateSlug = async (brand, model, variant, color) => {
  const baseString = `${brand} ${model} ${variant || ''} ${color || ''}`;
  let slug = baseString
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start
    .replace(/-+$/, ''); // Trim - from end

  // Check uniqueness
  let exists = await prisma.mobile.findUnique({
    where: { slug },
  });

  if (exists) {
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    slug = `${slug}-${randomSuffix}`;
  }

  return slug;
};

// GET /api/v1/mobiles (Public)
const getMobiles = async (req, res) => {
  try {
    const { q, brand, status, minPrice, maxPrice, sort, featured } = req.query;

    const where = {};

    // Text Search
    if (q) {
      where.OR = [
        { brand: { contains: q, mode: 'insensitive' } },
        { model: { contains: q, mode: 'insensitive' } },
        { variant: { contains: q, mode: 'insensitive' } },
      ];
    }

    // Brand filter
    if (brand) {
      where.brand = { equals: brand, mode: 'insensitive' };
    }

    // Status filter
    if (status) {
      where.status = status;
    }

    // Featured filter
    if (featured === 'true') {
      where.featured = true;
    }

    // Price filters
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    // Sorting
    let orderBy = { createdAt: 'desc' };
    if (sort) {
      if (sort === 'price-asc') orderBy = { price: 'asc' };
      if (sort === 'price-desc') orderBy = { price: 'desc' };
      if (sort === 'name-asc') orderBy = { model: 'asc' };
    }

    // Fetch mobiles, EXCLUDE imei
    const mobiles = await prisma.mobile.findMany({
      where,
      orderBy,
      select: {
        id: true,
        shopId: true,
        slug: true,
        brand: true,
        model: true,
        variant: true,
        ram: true,
        storage: true,
        color: true,
        batteryHealth: true,
        batteryOriginal: true,
        displayOriginal: true,
        bodyCondition: true,
        cameraCondition: true,
        faceIdOrFingerprint: true,
        network: true,
        warranty: true,
        description: true,
        price: true,
        offerPrice: true,
        featured: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        images: {
          select: {
            id: true,
            imageUrl: true,
            imageType: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      count: mobiles.length,
      data: mobiles,
    });
  } catch (error) {
    console.error('Error getting mobiles:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve mobiles list.',
    });
  }
};

// GET /api/v1/mobiles/brands (Public - Get unique brands in stock)
const getBrands = async (req, res) => {
  try {
    const brands = await prisma.mobile.groupBy({
      by: ['brand'],
      _count: {
        brand: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: brands.map((b) => b.brand),
    });
  } catch (error) {
    console.error('Error getting brands:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve brands list.',
    });
  }
};

// GET /api/v1/mobiles/featured (Public)
const getFeaturedMobiles = async (req, res) => {
  try {
    const mobiles = await prisma.mobile.findMany({
      where: {
        featured: true,
        status: 'Available',
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        shopId: true,
        slug: true,
        brand: true,
        model: true,
        variant: true,
        ram: true,
        storage: true,
        color: true,
        batteryHealth: true,
        price: true,
        offerPrice: true,
        featured: true,
        status: true,
        images: {
          select: {
            imageUrl: true,
          },
          take: 1,
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: mobiles,
    });
  } catch (error) {
    console.error('Error fetching featured mobiles:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch featured mobiles.',
    });
  }
};

// GET /api/v1/mobiles/detail/:slug (Public - Fetch by slug, EXCLUDE imei)
const getMobileBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const mobile = await prisma.mobile.findUnique({
      where: { slug },
      select: {
        id: true,
        shopId: true,
        slug: true,
        brand: true,
        model: true,
        variant: true,
        ram: true,
        storage: true,
        color: true,
        batteryHealth: true,
        batteryOriginal: true,
        displayOriginal: true,
        bodyCondition: true,
        cameraCondition: true,
        faceIdOrFingerprint: true,
        network: true,
        warranty: true,
        description: true,
        price: true,
        offerPrice: true,
        featured: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        images: {
          select: {
            id: true,
            imageUrl: true,
            imageType: true,
          },
        },
      },
    });

    if (!mobile) {
      return res.status(404).json({
        success: false,
        message: 'Mobile not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: mobile,
    });
  } catch (error) {
    console.error('Error fetching mobile detail by slug:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve mobile detail.',
    });
  }
};

// GET /api/v1/mobiles/admin/detail/:id (Admin-only - Fetch by ID, INCLUDE imei)
const getMobileByIdAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const mobile = await prisma.mobile.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });

    if (!mobile) {
      return res.status(404).json({
        success: false,
        message: 'Mobile not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: mobile,
    });
  } catch (error) {
    console.error('Error fetching mobile detail by id (admin):', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve mobile details.',
    });
  }
};

// POST /api/v1/mobiles (Admin-only)
const createMobile = async (req, res) => {
  try {
    const { isValid, errors } = validateMobile(req.body);
    if (!isValid) {
      return res.status(400).json({ success: false, errors });
    }

    const {
      brand,
      model,
      variant,
      ram,
      storage,
      color,
      batteryHealth,
      batteryOriginal,
      displayOriginal,
      bodyCondition,
      cameraCondition,
      faceIdOrFingerprint,
      network,
      imei,
      warranty,
      description,
      price,
      offerPrice,
      featured,
      status,
      images, // array of image objects/urls
    } = req.body;

    const shop = await prisma.shopSettings.findFirst();
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop settings do not exist. Please configure shop settings first.',
      });
    }

    const slug = await generateSlug(brand, model, variant, color);

    const newMobile = await prisma.mobile.create({
      data: {
        shopId: shop.id,
        slug,
        brand,
        model,
        variant,
        ram,
        storage,
        color,
        batteryHealth: parseInt(batteryHealth),
        batteryOriginal: batteryOriginal === true || batteryOriginal === 'true',
        displayOriginal: displayOriginal === true || displayOriginal === 'true',
        bodyCondition,
        cameraCondition,
        faceIdOrFingerprint: faceIdOrFingerprint === true || faceIdOrFingerprint === 'true',
        network: network || 'Unlocked',
        imei,
        warranty,
        description,
        price: parseFloat(price),
        offerPrice: offerPrice ? parseFloat(offerPrice) : null,
        featured: featured === true || featured === 'true',
        status: status || 'Available',
      },
    });

    // Create image records
    if (images && Array.isArray(images) && images.length > 0) {
      const imageRecords = images.map((img) => ({
        mobileId: newMobile.id,
        imageUrl: typeof img === 'string' ? img : img.imageUrl,
        imageType: typeof img === 'string' ? null : img.imageType,
      }));

      await prisma.mobileImage.createMany({
        data: imageRecords,
      });
    }

    // Log Activity
    await prisma.activityLog.create({
      data: { action: `Added ${brand} ${model} (${variant})` },
    });

    return res.status(201).json({
      success: true,
      message: 'Mobile added successfully.',
      data: newMobile,
    });
  } catch (error) {
    console.error('Error creating mobile:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create mobile item.',
    });
  }
};

// PUT /api/v1/mobiles/:id (Admin-only)
const updateMobile = async (req, res) => {
  try {
    const { id } = req.params;
    const { isValid, errors } = validateMobile(req.body, true);
    if (!isValid) {
      return res.status(400).json({ success: false, errors });
    }

    const existingMobile = await prisma.mobile.findUnique({
      where: { id },
    });

    if (!existingMobile) {
      return res.status(404).json({
        success: false,
        message: 'Mobile not found.',
      });
    }

    const {
      brand,
      model,
      variant,
      ram,
      storage,
      color,
      batteryHealth,
      batteryOriginal,
      displayOriginal,
      bodyCondition,
      cameraCondition,
      faceIdOrFingerprint,
      network,
      imei,
      warranty,
      description,
      price,
      offerPrice,
      featured,
      status,
      images,
    } = req.body;

    let slug = existingMobile.slug;
    // Update slug only if key identifiers change
    if (
      (brand && brand !== existingMobile.brand) ||
      (model && model !== existingMobile.model) ||
      (variant && variant !== existingMobile.variant) ||
      (color && color !== existingMobile.color)
    ) {
      slug = await generateSlug(
        brand || existingMobile.brand,
        model || existingMobile.model,
        variant || existingMobile.variant,
        color || existingMobile.color
      );
    }

    const updatedMobile = await prisma.mobile.update({
      where: { id },
      data: {
        slug,
        brand: brand ?? existingMobile.brand,
        model: model ?? existingMobile.model,
        variant: variant ?? existingMobile.variant,
        ram: ram ?? existingMobile.ram,
        storage: storage ?? existingMobile.storage,
        color: color ?? existingMobile.color,
        batteryHealth: batteryHealth ? parseInt(batteryHealth) : existingMobile.batteryHealth,
        batteryOriginal: batteryOriginal !== undefined ? (batteryOriginal === true || batteryOriginal === 'true') : existingMobile.batteryOriginal,
        displayOriginal: displayOriginal !== undefined ? (displayOriginal === true || displayOriginal === 'true') : existingMobile.displayOriginal,
        bodyCondition: bodyCondition ?? existingMobile.bodyCondition,
        cameraCondition: cameraCondition ?? existingMobile.cameraCondition,
        faceIdOrFingerprint: faceIdOrFingerprint !== undefined ? (faceIdOrFingerprint === true || faceIdOrFingerprint === 'true') : existingMobile.faceIdOrFingerprint,
        network: network ?? existingMobile.network,
        imei: imei ?? existingMobile.imei,
        warranty: warranty ?? existingMobile.warranty,
        description: description ?? existingMobile.description,
        price: price ? parseFloat(price) : existingMobile.price,
        offerPrice: offerPrice !== undefined ? (offerPrice ? parseFloat(offerPrice) : null) : existingMobile.offerPrice,
        featured: featured !== undefined ? (featured === true || featured === 'true') : existingMobile.featured,
        status: status ?? existingMobile.status,
      },
    });

    // If images array is provided, replace the image gallery
    if (images && Array.isArray(images)) {
      // Delete old images
      await prisma.mobileImage.deleteMany({
        where: { mobileId: id },
      });

      // Insert new images
      if (images.length > 0) {
        const imageRecords = images.map((img) => ({
          mobileId: id,
          imageUrl: typeof img === 'string' ? img : img.imageUrl,
          imageType: typeof img === 'string' ? null : img.imageType,
        }));

        await prisma.mobileImage.createMany({
          data: imageRecords,
        });
      }
    }

    // Determine activity details
    let actionDetail = `Updated ${updatedMobile.brand} ${updatedMobile.model}`;
    if (status && status !== existingMobile.status) {
      actionDetail = `Marked ${updatedMobile.brand} ${updatedMobile.model} as ${status}`;
    }

    // Log Activity
    await prisma.activityLog.create({
      data: { action: actionDetail },
    });

    return res.status(200).json({
      success: true,
      message: 'Mobile details updated successfully.',
      data: updatedMobile,
    });
  } catch (error) {
    console.error('Error updating mobile:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update mobile item.',
    });
  }
};

// DELETE /api/v1/mobiles/:id (Admin-only)
const deleteMobile = async (req, res) => {
  try {
    const { id } = req.params;

    const mobile = await prisma.mobile.findUnique({
      where: { id },
    });

    if (!mobile) {
      return res.status(404).json({
        success: false,
        message: 'Mobile not found.',
      });
    }

    await prisma.mobile.delete({
      where: { id },
    });

    // Log Activity
    await prisma.activityLog.create({
      data: { action: `Deleted ${mobile.brand} ${mobile.model}` },
    });

    return res.status(200).json({
      success: true,
      message: 'Mobile deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting mobile:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete mobile item.',
    });
  }
};

// GET /api/v1/mobiles/admin/stats (Admin-only)
const getStats = async (req, res) => {
  try {
    const total = await prisma.mobile.count();
    const available = await prisma.mobile.count({
      where: { status: 'Available' },
    });
    const sold = await prisma.mobile.count({
      where: { status: 'Sold' },
    });
    const reserved = await prisma.mobile.count({
      where: { status: 'Reserved' },
    });
    const featured = await prisma.mobile.count({
      where: { featured: true },
    });

    return res.status(200).json({
      success: true,
      data: {
        total,
        available,
        sold,
        reserved,
        featured,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard stats.',
    });
  }
};

module.exports = {
  getMobiles,
  getBrands,
  getFeaturedMobiles,
  getMobileBySlug,
  getMobileByIdAdmin,
  createMobile,
  updateMobile,
  deleteMobile,
  getStats,
};
