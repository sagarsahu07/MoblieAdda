import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { Smartphone, Battery, ShieldAlert, Sparkles, MessageSquare, PhoneCall, ArrowLeft, BadgeCheck, Check, X, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const MobileDetail = () => {
  const { slug } = useParams();
  const { shopSettings, mobiles } = useShop();

  const [mobile, setMobile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Fetch mobile details
  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/mobiles/detail/${slug}`);
        if (res.data && res.data.success) {
          setMobile(res.data.data);
        }
      } catch (error) {
        console.warn('API error fetching detail, checking local context list:', error.message);
        // Fallback search local context list
        const localDevice = mobiles.find(m => m.slug === slug);
        if (localDevice) {
          setMobile(localDevice);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [slug, mobiles]);

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  if (!mobile) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-center px-4 bg-dark-950">
        <ShieldAlert className="w-16 h-16 text-brand-500 animate-pulse" />
        <h2 className="text-2xl font-black text-white">Device Not Found</h2>
        <p className="text-slate-400 text-sm max-w-sm">
          The smartphone you are looking for might have been sold or removed.
        </p>
        <Link
          to="/mobiles"
          className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all"
        >
          Back to Catalog
        </Link>
      </div>
    );
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
    warranty,
    description,
    price,
    offerPrice,
    status,
    images,
  } = mobile;

  // Format currency
  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getWhatsAppEnquiryLink = () => {
    const defaultOwnerNumber = '917000734481'; // Ashu's number +91 70007 34481
    const deviceName = `${brand} ${model} (${variant || ''})`;
    const currentPrice = offerPrice ? offerPrice : price;
    const message = `Hi Mobile Adda Bhilai, I am interested in purchasing this device from your Showcase inventory:\n\n📱 Device: ${deviceName}\n🎨 Color: ${color}\n🔋 Battery Health: ${batteryHealth}%\n💰 Price: ${formatPrice(currentPrice)}\n🌐 URL: ${window.location.href}\n\nIs this device still available for viewing in the showroom?`;
    
    return `https://wa.me/${defaultOwnerNumber}?text=${encodeURIComponent(message)}`;
  };

  const galleryImages = images && images.length > 0
    ? images
    : [{ imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600' }];

  // Status Badge configurations
  const statusBadges = {
    Available: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Sold: 'bg-red-500/10 text-red-400 border-red-500/20',
    Reserved: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'Coming Soon': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumb Navigation */}
      <Link
        to="/mobiles"
        className="inline-flex items-center space-x-2 text-slate-400 hover:text-white text-sm font-semibold transition-colors duration-200"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Inventory</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left: Image Gallery */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative pt-[100%] w-full bg-slate-950/40 rounded-3xl overflow-hidden border border-slate-800/80">
            <span className={`absolute top-4 left-4 z-10 text-xs font-semibold px-3 py-1.5 rounded-full border backdrop-blur-md ${statusBadges[status] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
              {status}
            </span>
            <img
              src={galleryImages[activeImageIdx]?.imageUrl}
              alt={`${brand} ${model}`}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>

          {/* Thumbnails Row */}
          {galleryImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto py-2">
              {galleryImages.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 bg-slate-950/40 transition-all ${
                    idx === activeImageIdx ? 'border-brand-500 scale-95' : 'border-slate-850 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img.imageUrl} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Spec Details & CTAs */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Header Info */}
          <div className="space-y-3">
            <span className="text-xs text-brand-500 font-bold uppercase tracking-widest">{brand} Smartphones</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{model}</h1>
            <p className="text-sm text-slate-400 font-medium">{variant}</p>
          </div>

          {/* Pricing Box */}
          <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-3xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-slate-500 uppercase tracking-widest block font-semibold">Price Offer</span>
              {offerPrice ? (
                <div className="flex items-baseline space-x-3">
                  <span className="text-3xl font-black text-brand-400">{formatPrice(offerPrice)}</span>
                  <span className="text-sm text-slate-500 line-through">{formatPrice(price)}</span>
                </div>
              ) : (
                <span className="text-3xl font-black text-white">{formatPrice(price)}</span>
              )}
            </div>
            <div className="text-right">
              <span className="text-xs bg-slate-800 text-slate-300 font-medium px-3 py-1.5 rounded-lg border border-slate-700/50">
                {warranty}
              </span>
            </div>
          </div>

          {/* Verified Quality Checklist (Diagnostics) */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <ShieldCheck className="w-4.5 h-4.5 text-brand-500" />
              <span>Verified Diagnostic Report</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {/* Battery Originality */}
              <div className="flex items-center justify-between p-3.5 bg-slate-900/30 border border-slate-850 rounded-2xl">
                <span className="text-slate-400">Battery Status</span>
                <span className="font-semibold flex items-center space-x-1.5 text-white">
                  <span>{batteryOriginal ? '100% Original' : 'Replaced (NEW)'}</span>
                  {batteryOriginal ? <Check className="w-4 h-4 text-emerald-400" /> : <Sparkles className="w-3.5 h-3.5 text-brand-500" />}
                </span>
              </div>
              
              {/* Display Originality */}
              <div className="flex items-center justify-between p-3.5 bg-slate-900/30 border border-slate-850 rounded-2xl">
                <span className="text-slate-400">Display panel</span>
                <span className="font-semibold flex items-center space-x-1.5 text-white">
                  <span>{displayOriginal ? 'Original Screen' : 'Replaced OLED'}</span>
                  {displayOriginal ? <Check className="w-4 h-4 text-emerald-400" /> : <Sparkles className="w-3.5 h-3.5 text-brand-500" />}
                </span>
              </div>

              {/* Battery Health */}
              <div className="flex items-center justify-between p-3.5 bg-slate-900/30 border border-slate-850 rounded-2xl">
                <span className="text-slate-400">Battery Health</span>
                <span className="font-bold flex items-center space-x-1.5 text-brand-400">
                  <Battery className="w-4.5 h-4.5" />
                  <span>{batteryHealth}%</span>
                </span>
              </div>

              {/* FaceID / TouchID */}
              <div className="flex items-center justify-between p-3.5 bg-slate-900/30 border border-slate-850 rounded-2xl">
                <span className="text-slate-400">Biometrics (FaceID/Touch)</span>
                <span className="font-semibold flex items-center space-x-1.5 text-white">
                  <span>{faceIdOrFingerprint ? 'Fully Functional' : 'Not Working'}</span>
                  {faceIdOrFingerprint ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-rose-500" />}
                </span>
              </div>

              {/* Network Lock */}
              <div className="flex items-center justify-between p-3.5 bg-slate-900/30 border border-slate-850 rounded-2xl">
                <span className="text-slate-400">Network Compatibility</span>
                <span className="font-semibold text-white">{network}</span>
              </div>

              {/* Body Condition */}
              <div className="flex items-center justify-between p-3.5 bg-slate-900/30 border border-slate-850 rounded-2xl">
                <span className="text-slate-400">Body & Frame Grade</span>
                <span className="font-semibold text-white">{bodyCondition}</span>
              </div>

              {/* Camera Condition */}
              <div className="flex items-center justify-between p-3.5 bg-slate-900/30 border border-slate-850 rounded-2xl sm:col-span-2">
                <span className="text-slate-400">Camera Sensors</span>
                <span className="font-semibold text-white">{cameraCondition}</span>
              </div>
            </div>
          </div>

          {/* Quick Specifications list */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Specifications</h3>
            <div className="grid grid-cols-2 gap-4 border border-slate-900 p-6 rounded-3xl text-sm">
              <div>
                <span className="text-slate-500 block text-xs uppercase tracking-wider">RAM Size</span>
                <span className="text-white font-medium mt-1 block">{ram}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs uppercase tracking-wider">Internal Storage</span>
                <span className="text-white font-medium mt-1 block">{storage}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs uppercase tracking-wider">Color Finish</span>
                <span className="text-white font-medium mt-1 block">{color}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs uppercase tracking-wider">Device ID (IMEI)</span>
                <span className="text-slate-400 text-xs italic mt-1 block font-medium">Secured • Available in Store</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {description && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Description / Overview</h3>
              <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line bg-slate-900/10 p-6 rounded-3xl border border-slate-900">
                {description}
              </p>
            </div>
          )}

          {/* Call-To-Action Enquiry Panel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
            <a
              href={getWhatsAppEnquiryLink()}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full py-4 text-center rounded-2xl font-bold flex items-center justify-center space-x-2 text-sm shadow-glow ${
                status === 'Sold'
                  ? 'bg-slate-800 text-slate-500 pointer-events-none cursor-not-allowed'
                  : 'bg-brand-500 hover:bg-brand-600 text-white'
              }`}
            >
              <MessageCircle className="w-5 h-5" />
              <span>Enquiry on WhatsApp</span>
            </a>

            <a
              href={`tel:${shopSettings.phone?.replace(/\s+/g, '')}`}
              className="w-full py-4 text-center rounded-2xl font-bold flex items-center justify-center space-x-2 text-sm bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 hover:text-white"
            >
              <PhoneCall className="w-4.5 h-4.5 text-brand-500" />
              <span>Call Showroom</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};

export default MobileDetail;
