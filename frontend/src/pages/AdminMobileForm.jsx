import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { Save, ArrowLeft, Image as ImageIcon, Trash2, Plus, Upload, CheckCircle2 } from 'lucide-react';

const AdminMobileForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchMobiles, isAdmin } = useShop();

  const isEditMode = !!id;

  // Authorization Redirect
  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, navigate]);

  // Form states
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    variant: '',
    ram: '',
    storage: '',
    color: '',
    batteryHealth: 100,
    batteryOriginal: true,
    displayOriginal: true,
    bodyCondition: 'Excellent',
    cameraCondition: 'Perfect',
    faceIdOrFingerprint: true,
    network: 'Unlocked (5G)',
    imei: '',
    warranty: '1 Month Shop Warranty',
    description: '',
    price: '',
    offerPrice: '',
    featured: false,
    status: 'Available',
  });

  const [images, setImages] = useState([]); // Array of strings (image URLs)

  // Fetch device details if Edit Mode
  useEffect(() => {
    if (isEditMode) {
      const getDeviceDetail = async () => {
        setFetchingData(true);
        try {
          const res = await api.get(`/mobiles/admin/detail/${id}`);
          if (res.data && res.data.success) {
            const dev = res.data.data;
            setFormData({
              brand: dev.brand || '',
              model: dev.model || '',
              variant: dev.variant || '',
              ram: dev.ram || '',
              storage: dev.storage || '',
              color: dev.color || '',
              batteryHealth: dev.batteryHealth || 100,
              batteryOriginal: dev.batteryOriginal,
              displayOriginal: dev.displayOriginal,
              bodyCondition: dev.bodyCondition || 'Excellent',
              cameraCondition: dev.cameraCondition || 'Perfect',
              faceIdOrFingerprint: dev.faceIdOrFingerprint,
              network: dev.network || 'Unlocked',
              imei: dev.imei || '',
              warranty: dev.warranty || '',
              description: dev.description || '',
              price: dev.price || '',
              offerPrice: dev.offerPrice || '',
              featured: dev.featured,
              status: dev.status || 'Available',
            });
            // Set images
            if (dev.images && dev.images.length > 0) {
              setImages(dev.images.map((img) => img.imageUrl));
            }
          }
        } catch (error) {
          console.error('Error fetching device data (admin):', error);
          alert('Failed to retrieve device details from database.');
        } finally {
          setFetchingData(false);
        }
      };
      getDeviceDetail();
    }
  }, [id, isEditMode]);

  // Input change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Trigger image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const data = new FormData();
    data.append('image', file);

    try {
      const res = await api.post('/upload', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.data && res.data.success) {
        setImages((prev) => [...prev, res.data.imageUrl]);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      // Local demo fallback if backend is offline
      const mockPics = [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600',
        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600',
        'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=80&w=600'
      ];
      const randomUrl = mockPics[Math.floor(Math.random() * mockPics.length)];
      setImages((prev) => [...prev, randomUrl]);
      alert('Upload request redirected to local mock storage because backend is offline.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Remove image from gallery
  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Form Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      offerPrice: formData.offerPrice ? parseFloat(formData.offerPrice) : null,
      batteryHealth: parseInt(formData.batteryHealth),
      images: images, // Pass array of strings
    };

    try {
      if (isEditMode) {
        await api.put(`/mobiles/${id}`, payload);
      } else {
        await api.post('/mobiles', payload);
      }
      fetchMobiles(); // Refresh inventory context
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Submit error:', error);
      alert(`API Error saving details: ${error.response?.data?.message || error.message}. (Simulating dashboard redirection)`);
      navigate('/admin/dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center space-x-2 text-slate-400 hover:text-white text-sm font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <span className="text-xs text-brand-500 font-bold uppercase tracking-wider">
          {isEditMode ? 'Modify Device Specifications' : 'New Device Entry'}
        </span>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white">
          {isEditMode ? 'Edit Mobile Specifications' : 'Add Mobile to Inventory'}
        </h1>
        <p className="text-slate-400 text-sm">
          Please fill out specs, conditions, diagnostics, and images. Sensitive information (IMEI) is hidden from customers.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: Product Identifiers */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-900/80 space-y-6">
          <h2 className="text-lg font-bold text-white border-b border-slate-850 pb-3">1. General Information</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Brand *</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
                placeholder="e.g. Apple, Samsung, OnePlus"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Model *</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
                placeholder="e.g. iPhone 14 Pro, Galaxy S23 Ultra"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Variant / Submodel</label>
              <input
                type="text"
                name="variant"
                value={formData.variant}
                onChange={handleChange}
                placeholder="e.g. 256GB Deep Purple"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">RAM *</label>
              <input
                type="text"
                name="ram"
                value={formData.ram}
                onChange={handleChange}
                required
                placeholder="e.g. 6GB, 8GB"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Storage *</label>
              <input
                type="text"
                name="storage"
                value={formData.storage}
                onChange={handleChange}
                required
                placeholder="e.g. 128GB, 256GB"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Color *</label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                required
                placeholder="e.g. Space Black, Gold"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Network Lock *</label>
              <input
                type="text"
                name="network"
                value={formData.network}
                onChange={handleChange}
                required
                placeholder="e.g. Unlocked, AT&T Locked"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Pricing & Availability */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-900/80 space-y-6">
          <h2 className="text-lg font-bold text-white border-b border-slate-850 pb-3">2. Pricing, Status & Warranty</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Original Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="e.g. 79999"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Offer Price (₹, optional)</label>
              <input
                type="number"
                name="offerPrice"
                value={formData.offerPrice}
                onChange={handleChange}
                placeholder="e.g. 74999"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Warranty Period *</label>
              <input
                type="text"
                name="warranty"
                value={formData.warranty}
                onChange={handleChange}
                required
                placeholder="e.g. 3 Months Shop Warranty"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Stock Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-brand-500"
              >
                <option value="Available">Available</option>
                <option value="Sold">Sold</option>
                <option value="Reserved">Reserved</option>
                <option value="Coming Soon">Coming Soon</option>
              </select>
            </div>

            <div className="flex items-center space-x-3 pt-6">
              <input
                type="checkbox"
                name="featured"
                id="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-5 h-5 rounded accent-brand-500 border-slate-700 bg-slate-900 cursor-pointer"
              />
              <label htmlFor="featured" className="text-sm font-semibold text-slate-300 cursor-pointer hover:text-white">
                Featured Product (Promote on home page)
              </label>
            </div>
          </div>
        </div>

        {/* SECTION 3: Diagnostics & Conditions */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-900/80 space-y-6">
          <h2 className="text-lg font-bold text-white border-b border-slate-850 pb-3">3. Diagnostic Report & Hidden Details</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Battery Health (%) *</label>
              <input
                type="number"
                name="batteryHealth"
                value={formData.batteryHealth}
                onChange={handleChange}
                required
                min="0"
                max="100"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Body & Frame Grade *</label>
              <input
                type="text"
                name="bodyCondition"
                value={formData.bodyCondition}
                onChange={handleChange}
                required
                placeholder="e.g. Excellent, Minor Dents"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Camera Condition *</label>
              <input
                type="text"
                name="cameraCondition"
                value={formData.cameraCondition}
                onChange={handleChange}
                required
                placeholder="e.g. Perfect, Lens scratch"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">IMEI Code (Hidden from Customers) *</label>
              <input
                type="text"
                name="imei"
                value={formData.imei}
                onChange={handleChange}
                required
                placeholder="Provide 15-digit IMEI number"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-2 pt-6">
              <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  name="batteryOriginal"
                  checked={formData.batteryOriginal}
                  onChange={handleChange}
                  className="w-4 h-4 rounded accent-brand-500"
                />
                <span>Orig. Battery</span>
              </label>

              <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  name="displayOriginal"
                  checked={formData.displayOriginal}
                  onChange={handleChange}
                  className="w-4 h-4 rounded accent-brand-500"
                />
                <span>Orig. Screen</span>
              </label>

              <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  name="faceIdOrFingerprint"
                  checked={formData.faceIdOrFingerprint}
                  onChange={handleChange}
                  className="w-4 h-4 rounded accent-brand-500"
                />
                <span>Biometrics OK</span>
              </label>
            </div>
          </div>
        </div>

        {/* SECTION 4: Images */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-900/80 space-y-6">
          <h2 className="text-lg font-bold text-white border-b border-slate-850 pb-3">4. Image Showcase Gallery</h2>
          
          {/* File Picker */}
          <div className="flex items-center space-x-4">
            <label className="bg-slate-900 border border-slate-800 hover:border-brand-500/30 px-5 py-3 rounded-xl cursor-pointer text-xs font-semibold text-slate-300 flex items-center space-x-2 transition-all">
              <Upload className="w-4 h-4 text-brand-500" />
              <span>{uploadingImage ? 'Uploading Image...' : 'Choose Device Photo'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="hidden"
              />
            </label>
            <span className="text-[10px] text-slate-500">Supports PNG, JPG, JPEG (Max 5MB)</span>
          </div>

          {/* Uploaded Previews */}
          {images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {images.map((img, index) => (
                <div key={index} className="relative rounded-2xl overflow-hidden pt-[100%] border border-slate-800 bg-slate-950/40 group">
                  <img src={img} alt="preview" className="absolute inset-0 w-full h-full object-cover" />
                  
                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-600 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  
                  {/* Aspect label badge */}
                  <span className="absolute bottom-2 left-2 text-[9px] font-semibold bg-black/70 px-1.5 py-0.5 rounded text-slate-400">
                    {index === 0 ? 'Primary' : `Angle ${index}`}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-slate-800/80 rounded-2xl p-8 text-center text-slate-500 flex flex-col items-center justify-center space-y-2">
              <ImageIcon className="w-10 h-10 text-slate-700 animate-pulse" />
              <p className="text-xs">No images uploaded yet. The default hardware mockup will be displayed.</p>
            </div>
          )}
        </div>

        {/* SECTION 5: Description */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-900/80 space-y-6">
          <h2 className="text-lg font-bold text-white border-b border-slate-850 pb-3">5. Additional Description</h2>
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Overview Details</label>
            <textarea
              name="description"
              rows="5"
              value={formData.description}
              onChange={handleChange}
              placeholder="List screen details, physical scratches, accessories included (box, cable, invoice), or exchange specs..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500"
            ></textarea>
          </div>
        </div>

        {/* Submission Toolbar */}
        <div className="flex items-center justify-end space-x-3">
          <Link
            to="/admin/dashboard"
            className="px-6 py-3.5 bg-slate-900 hover:bg-slate-850 border border-slate-850 text-slate-400 hover:text-white rounded-xl text-sm font-semibold transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="bg-brand-500 hover:bg-brand-600 disabled:bg-brand-500/50 text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-all shadow-glow flex items-center space-x-2"
          >
            <Save className="w-4.5 h-4.5" />
            <span>{loading ? 'Saving Changes...' : 'Save Product Specs'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};

export default AdminMobileForm;
