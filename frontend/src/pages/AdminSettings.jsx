import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { Save, ArrowLeft, Building2, Link as LinkIcon, MapPin, Clock } from 'lucide-react';

const AdminSettings = () => {
  const { shopSettings, fetchSettings, isAdmin } = useShop();
  const navigate = useNavigate();

  // Redirect if unauthorized
  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, navigate]);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: '',
    phone: '',
    whatsapp: '',
    address: '',
    logo: '',
    instagram: '',
    facebook: '',
    youtube: '',
    googleMap: '',
    aboutShop: '',
    openingHours: '',
  });

  // Pre-fill states
  useEffect(() => {
    if (shopSettings) {
      setFormData({
        shopName: shopSettings.shopName || '',
        ownerName: shopSettings.ownerName || '',
        phone: shopSettings.phone || '',
        whatsapp: shopSettings.whatsapp || '',
        address: shopSettings.address || '',
        logo: shopSettings.logo || '',
        instagram: shopSettings.instagram || '',
        facebook: shopSettings.facebook || '',
        youtube: shopSettings.youtube || '',
        googleMap: shopSettings.googleMap || '',
        aboutShop: shopSettings.aboutShop || '',
        openingHours: shopSettings.openingHours || '',
      });
    }
  }, [shopSettings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.put('/shop', formData);
      if (res.data && res.data.success) {
        fetchSettings(); // Refresh details in global context
        alert('Shop configurations updated successfully!');
        navigate('/admin/dashboard');
      }
    } catch (err) {
      console.error('Update settings failed:', err);
      alert(`API Error updating configurations: ${err.message}. (Simulating settings save locally)`);
      navigate('/admin/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Header toolbar */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center space-x-2 text-slate-400 hover:text-white text-sm font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <span className="text-xs text-brand-500 font-bold uppercase tracking-wider">Showroom Configuration</span>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white">Edit Shop Settings</h1>
        <p className="text-slate-400 text-sm">
          Modify contact details, GPS links, WhatsApp community invitations, opening hours, and logos. Updates reflect instantly across the public site.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Card 1: Core details */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-900/80 space-y-6">
          <h2 className="text-lg font-bold text-white border-b border-slate-850 pb-3 flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-brand-500" />
            <span>Showroom Identity</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Shop Name *</label>
              <input
                type="text"
                name="shopName"
                value={formData.shopName}
                onChange={handleChange}
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Owner/Representative Names *</label>
              <input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Logo URL (or SVG Data URI)</label>
              <textarea
                name="logo"
                rows="2"
                value={formData.logo}
                onChange={handleChange}
                placeholder="Place logo URL or custom circular SVG string"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Card 2: Contact channels */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-900/80 space-y-6">
          <h2 className="text-lg font-bold text-white border-b border-slate-850 pb-3 flex items-center space-x-2">
            <LinkIcon className="w-5 h-5 text-brand-500" />
            <span>Contact Numbers & Social Links</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Contact Call Number *</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">WhatsApp Group/Chat Link *</label>
              <input
                type="text"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Instagram Page Link</label>
              <input
                type="text"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Facebook Page Link</label>
              <input
                type="text"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Address and details */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-900/80 space-y-6">
          <h2 className="text-lg font-bold text-white border-b border-slate-850 pb-3 flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-brand-500" />
            <span>Showroom Location & Hours</span>
          </h2>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Physical Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Google Maps GPS Link</label>
                <input
                  type="text"
                  name="googleMap"
                  value={formData.googleMap}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Opening Hours *</label>
                <input
                  type="text"
                  name="openingHours"
                  value={formData.openingHours}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">About Description</label>
              <textarea
                name="aboutShop"
                rows="4"
                value={formData.aboutShop}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
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
            <span>{loading ? 'Saving Settings...' : 'Save Configuration'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};

export default AdminSettings;
