import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Smartphone, Battery, BadgeCheck, MessageCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const PhoneCard = ({ mobile }) => {
  const { shopSettings } = useShop();

  const {
    slug,
    brand,
    model,
    variant,
    ram,
    storage,
    color,
    batteryHealth,
    bodyCondition,
    warranty,
    price,
    offerPrice,
    status,
    images,
  } = mobile;

  // Extract primary image
  const primaryImage = images && images.length > 0
    ? images[0].imageUrl
    : 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600'; // Default placeholder

  // Format price helper
  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // WhatsApp Enquiry Link Builder
  const getWhatsAppEnquiryLink = () => {
    const defaultOwnerNumber = '917000734481'; // Ashu's number +91 70007 34481
    const deviceName = `${brand} ${model} (${variant || ''})`;
    const currentPrice = offerPrice ? offerPrice : price;
    const message = `Hi Mobile Adda Bhilai, I am interested in this device from your Showcase inventory:\n\n📱 Device: ${deviceName}\n🎨 Color: ${color}\n🔋 Battery Health: ${batteryHealth}%\n💰 Price: ${formatPrice(currentPrice)}\n\nIs this device still available for purchase? Please let me know the details.`;
    
    return `https://wa.me/${defaultOwnerNumber}?text=${encodeURIComponent(message)}`;
  };

  // Status Badge configurations
  const statusBadges = {
    Available: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Sold: 'bg-red-500/10 text-red-400 border-red-500/20',
    Reserved: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'Coming Soon': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };

  const currentBadgeStyle = statusBadges[status] || 'bg-slate-500/10 text-slate-400 border-slate-500/20';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="glass-panel rounded-3xl overflow-hidden flex flex-col h-full border border-slate-800/80 hover:border-brand-500/30 transition-all duration-300 hover:shadow-premium-hover"
    >
      {/* Product Image Section */}
      <div className="relative pt-[100%] w-full bg-slate-950/40 overflow-hidden group">
        {/* Status Badge */}
        <span className={`absolute top-4 left-4 z-10 text-xs font-semibold px-3 py-1.5 rounded-full border backdrop-blur-md ${currentBadgeStyle}`}>
          {status}
        </span>

        {/* Featured Badge */}
        {mobile.featured && status === 'Available' && (
          <span className="absolute top-4 right-4 z-10 text-[10px] font-bold uppercase tracking-wider bg-brand-500 text-white px-2 py-1 rounded-md shadow-glow">
            Featured
          </span>
        )}

        <img
          src={primaryImage}
          alt={`${brand} ${model}`}
          className="absolute inset-0 w-full h-full object-cover zoom-image"
          loading="lazy"
        />
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Brand & Model */}
        <div className="flex-grow space-y-2">
          <p className="text-xs text-brand-400 font-semibold uppercase tracking-wider">{brand}</p>
          <h3 className="text-lg font-bold text-white leading-snug line-clamp-1">
            {model}
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            {variant || `${storage} • ${color}`}
          </p>

          {/* Quick Specifications */}
          <div className="grid grid-cols-2 gap-2.5 py-4 border-y border-slate-800/60 my-4 text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <Smartphone className="w-3.5 h-3.5 text-slate-500" />
              <span>{storage} Storage</span>
            </div>
            <div className="flex items-center space-x-2">
              <Battery className="w-3.5 h-3.5 text-slate-500" />
              <span>{batteryHealth}% BH</span>
            </div>
            <div className="flex items-center space-x-2">
              <BadgeCheck className="w-3.5 h-3.5 text-slate-500" />
              <span className="truncate">{bodyCondition}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 border border-slate-800 px-1 py-0.5 rounded">
                RAM
              </span>
              <span>{ram}</span>
            </div>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="space-y-4 pt-2">
          <div className="flex items-baseline justify-between">
            <div>
              {offerPrice ? (
                <div className="flex items-baseline space-x-2">
                  <span className="text-xl font-black text-brand-400">
                    {formatPrice(offerPrice)}
                  </span>
                  <span className="text-xs text-slate-500 line-through">
                    {formatPrice(price)}
                  </span>
                </div>
              ) : (
                <span className="text-xl font-black text-white">
                  {formatPrice(price)}
                </span>
              )}
              <span className="text-[10px] text-slate-500 block mt-0.5">{warranty}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              to={`/mobiles/${slug}`}
              className="flex items-center justify-center space-x-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white py-2.5 rounded-xl text-xs font-semibold transition-all duration-300"
            >
              <span>Details</span>
              <ArrowRight className="w-3 h-3" />
            </Link>

            <a
              href={getWhatsAppEnquiryLink()}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center space-x-1.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                status === 'Sold'
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed pointer-events-none'
                  : 'bg-brand-500 hover:bg-brand-600 text-white shadow-glow hover:shadow-brand-500/10'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Enquiry</span>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PhoneCard;
