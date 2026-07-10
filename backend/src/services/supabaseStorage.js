const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const bucketName = process.env.SUPABASE_BUCKET || 'mobile-images';

let supabase = null;

// Initialize Supabase only if proper credentials are set
if (
  supabaseUrl &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  supabaseAnonKey &&
  supabaseAnonKey !== 'your-anon-key'
) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Supabase Storage client initialized successfully.');
  } catch (err) {
    console.error('Error initializing Supabase client:', err.message);
  }
} else {
  console.warn(
    'WARNING: Supabase credentials are not configured or are placeholders. File upload will fall back to returning default mock image URLs.'
  );
}

/**
 * Uploads a file to Supabase storage bucket
 * @param {Buffer} fileBuffer 
 * @param {string} originalName 
 * @param {string} mimeType 
 * @returns {Promise<string>} Public URL of the uploaded file
 */
const uploadToSupabase = async (fileBuffer, originalName, mimeType) => {
  if (!supabase) {
    console.log('Fallback: returning mock image URL.');
    // Return a random beautiful Unsplash electronic image as fallback for local testing
    const fallbacks = [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600',
      'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=80&w=600'
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const ext = path.extname(originalName);
  const fileName = `mobile-${uniqueSuffix}${ext}`;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, fileBuffer, {
      contentType: mimeType,
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Supabase upload error details:', error);
    throw new Error(`Supabase upload failed: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);

  if (!publicUrlData || !publicUrlData.publicUrl) {
    throw new Error('Failed to retrieve public URL from Supabase storage.');
  }

  return publicUrlData.publicUrl;
};

module.exports = {
  uploadToSupabase,
};
