import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { MapPin, Phone, Clock, Instagram, Facebook, MessageCircle } from 'lucide-react';

const Footer = () => {
  const { shopSettings } = useShop();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-950 border-t border-slate-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Column 1: Intro */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              {shopSettings.logo && (
                <div
                  className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-brand-500/20"
                  dangerouslySetInnerHTML={{
                    __html: shopSettings.logo.startsWith('data:image/svg+xml')
                      ? shopSettings.logo.replace('data:image/svg+xml;utf8,', '')
                      : `<img src="${shopSettings.logo}" alt="Logo" class="w-full h-full object-cover"/>`,
                  }}
                />
              )}
              <span className="text-xl font-bold text-white tracking-wide">
                {shopSettings.shopName || 'Mobile Adda'}
              </span>
            </div>
            
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              {shopSettings.aboutShop || 'Bhilai\'s premium hub for certified pre-owned smartphones and premium devices. Quality checks and customer satisfaction guaranteed since 2015.'}
            </p>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {shopSettings.instagram && (
                <a
                  href={shopSettings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-brand-500 hover:border-brand-500/30 transition-all duration-300"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {shopSettings.facebook && (
                <a
                  href={shopSettings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-brand-500 hover:border-brand-500/30 transition-all duration-300"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {shopSettings.whatsapp && (
                <a
                  href={shopSettings.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-brand-500 hover:border-brand-500/30 transition-all duration-300"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white text-sm transition-colors duration-200">
                  Home Page
                </Link>
              </li>
              <li>
                <Link to="/mobiles" className="text-slate-400 hover:text-white text-sm transition-colors duration-200">
                  All Available Phones
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-slate-400 hover:text-white text-sm transition-colors duration-200">
                  Owner Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Hours */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Showroom</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-slate-400 text-sm">
                <MapPin className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
                <span>{shopSettings.address}</span>
              </li>
              <li className="flex items-center space-x-3 text-slate-400 text-sm">
                <Phone className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <a href={`tel:${shopSettings.phone?.replace(/\s+/g, '')}`} className="hover:text-white transition-colors duration-200">
                  {shopSettings.phone}
                </a>
              </li>
              <li className="flex items-start space-x-3 text-slate-400 text-sm">
                <Clock className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-300">Opening Hours:</p>
                  <p className="text-xs mt-0.5">{shopSettings.openingHours}</p>
                </div>
              </li>
            </ul>
          </div>
          
        </div>

        <hr className="border-slate-900 my-12" />

        {/* Copy block */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-slate-500 text-xs gap-4">
          <p>© {currentYear} Mobile Adda Bhilai. All Rights Reserved.</p>
          <p className="flex items-center space-x-1">
            <span>Built for Premium Mobile Showcase</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
