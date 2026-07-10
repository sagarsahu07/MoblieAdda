import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Menu, X, Smartphone, User, LogOut, MessageSquare, PhoneCall } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { shopSettings, isAdmin, logoutAdmin } = useShop();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const activeStyle = ({ isActive }) =>
    `px-4 py-2 rounded-xl transition-all duration-300 font-medium ${
      isActive
        ? 'text-brand-500 bg-brand-500/10'
        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
    }`;

  const handleLogout = () => {
    logoutAdmin();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b border-slate-800 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            {shopSettings.logo ? (
              <div
                className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-300 border border-brand-500/20"
                dangerouslySetInnerHTML={{ __html: shopSettings.logo.startsWith('data:image/svg+xml') ? shopSettings.logo.replace('data:image/svg+xml;utf8,', '') : `<img src="${shopSettings.logo}" alt="Logo" class="w-full h-full object-cover"/>` }}
              />
            ) : (
              <div className="w-12 h-12 bg-black border border-brand-500 rounded-full flex items-center justify-center font-bold text-brand-500 text-lg shadow-glow">
                MA
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-brand-400 transition-colors duration-300">
                {shopSettings.shopName || 'Mobile Adda'}
              </span>
              <span className="text-xs text-brand-500 font-medium tracking-widest uppercase">
                Inventory Showcase
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/" className={activeStyle}>
              Home
            </NavLink>
            <NavLink to="/mobiles" className={activeStyle}>
              Browse Phones
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin/dashboard" className={activeStyle}>
                Admin Panel
              </NavLink>
            )}
          </div>

          {/* Call / WhatsApp CTAs & Admin Account */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href={`tel:${shopSettings.phone?.replace(/\s+/g, '')}`}
              className="flex items-center space-x-2 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-all duration-300"
            >
              <PhoneCall className="w-4 h-4 text-brand-500" />
              <span className="text-sm font-medium">Call Us</span>
            </a>

            <a
              href={shopSettings.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-500 hover:bg-brand-600 text-white font-medium text-sm px-4 py-2.5 rounded-xl flex items-center space-x-2 shadow-glow hover:shadow-brand-500/20 transition-all duration-300"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Join Community</span>
            </a>

            {isAdmin ? (
              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-red-400 p-2 rounded-xl hover:bg-slate-800 transition-colors duration-300"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            ) : (
              <Link
                to="/admin/login"
                className="text-slate-400 hover:text-brand-500 p-2 rounded-xl hover:bg-slate-800 transition-colors duration-300"
                title="Admin Login"
              >
                <User className="w-5 h-5" />
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            {!isAdmin && (
              <Link to="/admin/login" className="text-slate-400 hover:text-brand-500 p-2 rounded-xl">
                <User className="w-5 h-5" />
              </Link>
            )}
            <button
              onClick={toggleMenu}
              className="text-slate-300 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors duration-300"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-800/80 bg-dark-950"
          >
            <div className="px-4 pt-4 pb-6 space-y-3">
              <Link
                to="/"
                onClick={toggleMenu}
                className="block px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 font-medium"
              >
                Home
              </Link>
              <Link
                to="/mobiles"
                onClick={toggleMenu}
                className="block px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 font-medium"
              >
                Browse Phones
              </Link>
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  onClick={toggleMenu}
                  className="block px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 font-medium"
                >
                  Admin Panel
                </Link>
              )}

              <hr className="border-slate-800 my-2" />

              <div className="grid grid-cols-2 gap-3 pt-2">
                <a
                  href={`tel:${shopSettings.phone?.replace(/\s+/g, '')}`}
                  className="flex items-center justify-center space-x-2 text-slate-300 hover:text-white px-4 py-3 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/50"
                >
                  <PhoneCall className="w-4 h-4 text-brand-500" />
                  <span className="text-sm font-medium">Call Us</span>
                </a>
                <a
                  href={shopSettings.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 bg-brand-500 hover:bg-brand-600 text-white font-medium text-sm px-4 py-3 rounded-xl shadow-glow"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Community</span>
                </a>
              </div>

              {isAdmin && (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 text-red-400 border border-red-500/20 hover:bg-red-500/10 py-3 rounded-xl font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
