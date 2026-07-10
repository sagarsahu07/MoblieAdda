import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import PhoneCard from '../components/PhoneCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { ShieldCheck, Sparkles, Award, RotateCcw, MapPin, Instagram, PhoneCall, HelpCircle, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const { shopSettings, mobiles, loadingMobiles, isBackendOffline } = useShop();

  // Get featured mobiles in stock
  const featuredMobiles = mobiles.filter(m => m.featured && m.status === 'Available').slice(0, 4);

  // Owners list with photos from PDF description and contact info
  const owners = [
    {
      name: 'Ashu',
      handle: 'aasshu_',
      role: 'Co-Owner & Inventory Head',
      phone: '+91 70007 34481',
      insta: 'https://www.instagram.com/aasshu__?igsh=MTA3NW05dXZkZG0xZg==',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300' // Placeholder face photo representing owner
    },
    {
      name: 'Abhishek',
      handle: 'Kesharwani_abhishek_',
      role: 'Co-Owner & Operations',
      phone: '+91 78793 46106',
      insta: 'https://www.instagram.com/kesharwani_abhishek_?igsh=MXZqeDBmMHZuZXFmdg==',
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300' // Placeholder face photo representing owner
    }
  ];

  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-20 px-4">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-brand-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 bg-brand-500/10 border border-brand-500/20 px-4 py-2 rounded-full text-brand-400 text-xs font-semibold uppercase tracking-wider"
          >
            <Sparkles className="w-4.5 h-4.5" />
            <span>Premium Certified Pre-Owned Showcase</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight"
          >
            Upgrade to Flagships <br />
            Without the <span className="text-gradient">Flagship Price</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Discover handpicked premium iPhones, Samsung Galaxy models, and OnePlus devices. Fully tested, certified, and ready for you at <span className="text-white font-semibold">Mobile Adda Bhilai</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              to="/mobiles"
              className="w-full sm:w-auto bg-brand-500 hover:bg-brand-600 text-white font-bold px-8 py-4 rounded-2xl shadow-glow hover:shadow-brand-500/20 transition-all duration-300"
            >
              Browse Inventory
            </Link>
            <a
              href="#why-choose-us"
              className="w-full sm:w-auto bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white px-8 py-4 rounded-2xl font-bold transition-colors duration-300"
            >
              Why Choose Us
            </a>
          </motion.div>
        </div>
      </section>

      {/* Offline Alert Badge */}
      {isBackendOffline && (
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-center">
            <p className="text-sm text-amber-400">
              💡 <strong>Demo Mode:</strong> The local backend server is offline or database is not connected. Showing mock details and showcase inventory.
            </p>
          </div>
        </div>
      )}

      {/* 2. Featured Inventory */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
          <div className="space-y-2">
            <span className="text-xs text-brand-500 font-bold uppercase tracking-widest">In Showroom Now</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Featured Smartphones</h2>
          </div>
          <Link
            to="/mobiles"
            className="group flex items-center space-x-1.5 text-sm font-semibold text-brand-400 hover:text-brand-300 transition-colors duration-200"
          >
            <span>View Complete Inventory</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
          </Link>
        </div>

        {loadingMobiles ? (
          <LoadingSpinner />
        ) : featuredMobiles.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center text-slate-400 border border-slate-900">
            <HelpCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="font-semibold text-white">No available phones found</p>
            <p className="text-sm mt-1">Please check back later or view all products.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredMobiles.map(mobile => (
              <PhoneCard key={mobile.id} mobile={mobile} />
            ))}
          </div>
        )}
      </section>

      {/* 3. Why Choose Us */}
      <section id="why-choose-us" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs text-brand-500 font-bold uppercase tracking-widest">Our Standards</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Why Buy from Mobile Adda?</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            We inspect each smartphone through an exhaustive diagnostic test to verify parts and functionalities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              icon: ShieldCheck,
              title: 'Multi-Point Quality Audits',
              desc: 'Every phone goes through hardware, speaker, Wi-Fi, and screen tests before it gets cataloged.'
            },
            {
              icon: Sparkles,
              title: 'Original Parts Guaranteed',
              desc: 'We disclose if battery or screen components have been replaced. Complete honesty is our policy.'
            },
            {
              icon: Award,
              title: 'Flexible Shop Warranties',
              desc: 'Get reassurance. Most phones come with our local shop guarantees ranging from 1 to 6 months.'
            },
            {
              icon: RotateCcw,
              title: 'Easy Exchange Options',
              desc: 'Bring in your old phone and get competitive exchange values for flagship upgrades.'
            }
          ].map((item, idx) => (
            <div key={idx} className="glass-panel p-8 rounded-3xl border border-slate-900 flex flex-col space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Owners Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs text-brand-500 font-bold uppercase tracking-widest">Meet the Owners</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">We are Here to Guide You</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Contact Ashu or Abhishek directly for customized deals, trade-in values, or device checks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {owners.map((owner, index) => (
            <div key={index} className="glass-panel p-8 rounded-3xl border border-slate-900/80 flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-6">
              <img
                src={owner.image}
                alt={owner.name}
                className="w-24 h-24 rounded-2xl object-cover border-2 border-slate-800/80 shadow-premium"
              />
              <div className="flex-grow space-y-4 text-center sm:text-left">
                <div>
                  <h3 className="text-xl font-bold text-white">{owner.name}</h3>
                  <p className="text-brand-500 text-xs font-semibold">{owner.role}</p>
                  <p className="text-slate-500 text-xs mt-0.5">@{owner.handle}</p>
                </div>
                
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <a
                    href={`tel:${owner.phone.replace(/\s+/g, '')}`}
                    className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-brand-500" />
                    <span>Call {owner.name}</span>
                  </a>
                  <a
                    href={owner.insta}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 transition-colors"
                  >
                    <Instagram className="w-3.5 h-3.5 text-brand-500" />
                    <span>Instagram</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Showroom Map & Visit */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-[2.5rem] border border-slate-900 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/5 rounded-full blur-[80px] pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Showroom Details */}
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-brand-500/10 border border-brand-500/20 px-3.5 py-1.5 rounded-full text-brand-400 text-xs font-semibold uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                <span>Visit Us</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Our Showroom in Bhilai</h2>
              
              <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
                Stop by to test-drive smartphones in person. We are located in the heart of Bhilai at **Supela Akash Ganga**. You can evaluate display performance, camera sensors, and pick up your device directly from the counter.
              </p>

              <div className="bg-slate-950/40 p-6 rounded-2xl border border-slate-900 space-y-4">
                <div>
                  <h4 className="text-xs text-brand-500 font-bold uppercase tracking-wider">Showroom Address</h4>
                  <p className="text-white text-sm mt-1">{shopSettings.address}</p>
                </div>
                <div>
                  <h4 className="text-xs text-brand-500 font-bold uppercase tracking-wider">Store Timing</h4>
                  <p className="text-white text-sm mt-1">{shopSettings.openingHours}</p>
                </div>
              </div>

              <a
                href={shopSettings.googleMap}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-brand-500 hover:bg-brand-600 text-white font-bold px-6 py-3.5 rounded-xl shadow-glow hover:shadow-brand-500/10 transition-all duration-300"
              >
                <span>Navigate in Google Maps</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>

            {/* Premium Maps Graphic / Card Visual */}
            <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-premium h-[350px] bg-slate-900 flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="absolute inset-0 bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
              
              {/* Fake Radar/Target Map Animation */}
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 bg-brand-500/20 rounded-full animate-ping"></div>
                <div className="absolute inset-4 bg-brand-500/30 rounded-full"></div>
                <div className="relative w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center text-white shadow-glow">
                  <MapPin className="w-5 h-5" />
                </div>
              </div>
              
              <div className="relative z-10 space-y-2">
                <h3 className="text-lg font-bold text-white">Supela Akash Ganga, Bhilai</h3>
                <p className="text-slate-400 text-xs max-w-sm">
                  Click below to open GPS directions directly on your smartphone mapping app.
                </p>
              </div>

              <a
                href={shopSettings.googleMap}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 bg-slate-950 border border-slate-850 hover:bg-slate-900 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all duration-200"
              >
                Get Directions
              </a>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
