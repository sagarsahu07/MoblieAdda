const express = require('express');
const multer = require('multer');
const { verifyAdmin } = require('../middleware/auth');
const authController = require('../controllers/authController');
const shopController = require('../controllers/shopController');
const mobileController = require('../controllers/mobileController');
const logController = require('../controllers/logController');
const { uploadToSupabase } = require('../services/supabaseStorage');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// --- Auth Routes ---
router.post('/auth/login', authController.login);
router.get('/auth/me', verifyAdmin, authController.getMe);

// --- Shop Settings Routes ---
router.get('/shop', shopController.getSettings);
router.put('/shop', verifyAdmin, shopController.updateSettings);

// --- Mobiles Public Routes ---
router.get('/mobiles', mobileController.getMobiles);
router.get('/mobiles/brands', mobileController.getBrands);
router.get('/mobiles/featured', mobileController.getFeaturedMobiles);
router.get('/mobiles/detail/:slug', mobileController.getMobileBySlug);

// --- Mobiles Admin Routes ---
router.get('/mobiles/admin/stats', verifyAdmin, mobileController.getStats);
router.get('/mobiles/admin/detail/:id', verifyAdmin, mobileController.getMobileByIdAdmin);
router.post('/mobiles', verifyAdmin, mobileController.createMobile);
router.put('/mobiles/:id', verifyAdmin, mobileController.updateMobile);
router.delete('/mobiles/:id', verifyAdmin, mobileController.deleteMobile);

// --- Activity Logs Route ---
router.get('/logs', verifyAdmin, logController.getActivityLogs);

// --- Image Upload Route ---
router.post('/upload', verifyAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded.',
      });
    }

    const publicUrl = await uploadToSupabase(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    return res.status(200).json({
      success: true,
      message: 'Image uploaded successfully.',
      imageUrl: publicUrl,
    });
  } catch (error) {
    console.error('Upload Controller Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload image.',
      error: error.message,
    });
  }
});

module.exports = router;
