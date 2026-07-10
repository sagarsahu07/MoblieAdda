import React, { useState, useEffect, useCallback } from 'react';
import { useShop } from '../context/ShopContext';
import PhoneCard from '../components/PhoneCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, SlidersHorizontal, Trash2, Smartphone, DollarSign, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Mobiles = () => {
  const { mobiles, brands, loadingMobiles, fetchMobiles } = useShop();

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [showAvailableOnly, setShowAvailableOnly] = useState(true);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Trigger search with filters
  const applyFilters = useCallback(() => {
    const filters = {
      q: search,
      brand: selectedBrand,
      status: showAvailableOnly ? 'Available' : undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      sort: sortBy,
    };
    fetchMobiles(filters);
  }, [search, selectedBrand, showAvailableOnly, minPrice, maxPrice, sortBy, fetchMobiles]);

  // Debounce search/filters
  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters();
    }, 300);

    return () => clearTimeout(timer);
  }, [applyFilters]);

  // Clear filters
  const clearFilters = () => {
    setSearch('');
    setSelectedBrand('');
    setShowAvailableOnly(true);
    setMinPrice('');
    setMaxPrice('');
    setSortBy('latest');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <span className="text-xs text-brand-500 font-bold uppercase tracking-widest">Live Catalogue</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Showroom Inventory</h1>
        <p className="text-slate-400 text-sm max-w-lg">
          Browse certified pre-owned flagships. Filter by your budget or brand. Message us on WhatsApp to inspect in showroom.
        </p>
      </div>

      {/* Search & Actions Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Search Input */}
        <div className="lg:col-span-6 relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search by model or brand (e.g. iPhone 13, Samsung S23)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 glass-input rounded-2xl"
          />
        </div>

        {/* Brand Dropdown */}
        <div className="lg:col-span-3">
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full py-3.5 px-4 bg-slate-900 border border-slate-800 text-slate-300 rounded-2xl focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
          >
            <option value="">All Brands</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Select */}
        <div className="lg:col-span-3 flex space-x-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full py-3.5 px-4 bg-slate-900 border border-slate-800 text-slate-300 rounded-2xl focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
          >
            <option value="latest">Latest Arrivals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Model Name (A-Z)</option>
          </select>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className="lg:hidden p-3.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-2xl transition-colors"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Filters (Desktop) */}
        <div className="hidden lg:block lg:col-span-3 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-900 space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm tracking-wide">Filters</span>
              <button
                onClick={clearFilters}
                className="text-xs text-slate-500 hover:text-brand-400 flex items-center space-x-1 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                <span>Reset All</span>
              </button>
            </div>

            {/* Availability Checkbox */}
            <div className="space-y-3 pt-2">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Stock Status</label>
              <label className="flex items-center space-x-3 cursor-pointer text-slate-300 hover:text-white text-sm">
                <input
                  type="checkbox"
                  checked={showAvailableOnly}
                  onChange={(e) => setShowAvailableOnly(e.target.checked)}
                  className="w-4 h-4 rounded accent-brand-500 border-slate-700 bg-slate-900"
                />
                <span>Available Phones Only</span>
              </label>
            </div>

            {/* Price Filter */}
            <div className="space-y-3">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Price Range (₹)</label>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <span className="absolute left-2.5 top-2.5 text-xs text-slate-600">₹</span>
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full pl-6 pr-2 py-2 text-xs bg-slate-950 border border-slate-800 text-white rounded-xl focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-2.5 top-2.5 text-xs text-slate-600">₹</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full pl-6 pr-2 py-2 text-xs bg-slate-950 border border-slate-800 text-white rounded-xl focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Mobile Filters Overlay */}
        <AnimatePresence>
          {isFilterPanelOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden flex items-end"
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                className="w-full bg-dark-950 rounded-t-[2rem] p-6 space-y-6 border-t border-slate-800"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-base">Adjust Filters</span>
                  <button onClick={clearFilters} className="text-xs text-slate-400 flex items-center space-x-1">
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Availability */}
                  <label className="flex items-center space-x-3 cursor-pointer text-slate-300 text-sm py-2">
                    <input
                      type="checkbox"
                      checked={showAvailableOnly}
                      onChange={(e) => setShowAvailableOnly(e.target.checked)}
                      className="w-5 h-5 rounded accent-brand-500 border-slate-700 bg-slate-900"
                    />
                    <span>Available Phones Only</span>
                  </label>

                  {/* Price */}
                  <div className="space-y-2">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Price range</span>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        placeholder="Min Price"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl"
                      />
                      <input
                        type="number"
                        placeholder="Max Price"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsFilterPanelOpen(false)}
                  className="w-full py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-sm"
                >
                  Apply Filters
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Grid Area */}
        <div className="lg:col-span-9">
          {loadingMobiles ? (
            <LoadingSpinner />
          ) : mobiles.length === 0 ? (
            <div className="glass-panel rounded-3xl p-16 text-center text-slate-400 border border-slate-900 space-y-4">
              <Smartphone className="w-12 h-12 text-slate-700 mx-auto" />
              <div className="space-y-1">
                <p className="font-bold text-white text-lg">No phones match search filters</p>
                <p className="text-xs max-w-sm mx-auto">
                  Try typing a different model, removing the "Available Only" check, or resetting price sliders.
                </p>
              </div>
              <button
                onClick={clearFilters}
                className="bg-slate-900 hover:bg-slate-850 border border-slate-850 px-5 py-2 rounded-xl text-xs font-semibold text-brand-400 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mobiles.map((mobile) => (
                <PhoneCard key={mobile.id} mobile={mobile} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Mobiles;
