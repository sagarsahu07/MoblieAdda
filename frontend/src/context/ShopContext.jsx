import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../services/api';

const ShopContext = createContext();

// Fallback static data representing PDF content if backend is offline
const FALLBACK_SETTINGS = {
  shopName: 'Mobile Adda Bhilai',
  ownerName: 'Ashu & Abhishek',
  phone: '+91 70007 34481',
  whatsapp: 'https://chat.whatsapp.com/DnKJOziIHrO2l0QZOc2WwG?mode=ac_t',
  address: 'Shop No. 1, Supela Akash Ganga, Bhilai, Chhattisgarh, India (Near Khursipar Branch)',
  logo: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="black" stroke="%23f97316" stroke-width="2"/><circle cx="50" cy="50" r="42" fill="none" stroke="white" stroke-width="0.75" stroke-dasharray="2,2"/><text x="50" y="46" fill="white" font-family="'Outfit', 'Inter', sans-serif" font-weight="900" font-size="20" text-anchor="middle">MA</text><text x="50" y="62" fill="%23f97316" font-family="'Outfit', 'Inter', sans-serif" font-weight="800" font-size="7" text-anchor="middle" letter-spacing="1">MOBILE ADDA</text><text x="50" y="72" fill="white" font-family="'Outfit', 'Inter', sans-serif" font-weight="500" font-size="5" text-anchor="middle" opacity="0.6">ESTD. 2015</text></svg>`,
  instagram: 'https://www.instagram.com/mobileaddabhilai?igsh=YndkNmF6bDk0bzhz',
  facebook: 'https://www.facebook.com/mobileaddabhilai',
  youtube: '',
  googleMap: 'https://maps.app.goo.gl/QGwRTSc76uoBM1MV9',
  aboutShop: 'Mobile Adda is Bhilai\'s premier destination for high-quality certified pre-owned and premium mobile devices. Established in 2015, we specialize in offering iPhones, flagship Samsung models, OnePlus, and other premium brands at unmatched prices. Each device undergoes a rigorous multi-point quality check to ensure optimal performance, battery health, and body condition. We offer buy, sell, exchange, and finance options on premium smartphones. Visit our showroom at Supela Akash Ganga to experience premium service.',
  openingHours: '11:00 AM - 09:30 PM (Monday to Sunday)',
};

const FALLBACK_MOBILES = [
  {
    id: 'f-1',
    slug: 'apple-iphone-13-128gb-blue',
    brand: 'Apple',
    model: 'iPhone 13',
    variant: '128GB Blue',
    ram: '4GB',
    storage: '128GB',
    color: 'Blue',
    batteryHealth: 88,
    batteryOriginal: true,
    displayOriginal: true,
    bodyCondition: 'Excellent (Like New)',
    cameraCondition: 'Perfect - 100% Functional',
    faceIdOrFingerprint: true,
    network: 'Unlocked (5G)',
    warranty: '3 Months Shop Warranty',
    description: 'Pristine condition Apple iPhone 13 in Blue. Display and battery are 100% original. Zero dents on the frame, screen is protected with premium tempered glass. Comes with box and original Apple Lightning to USB-C charging cable.',
    price: 45999,
    offerPrice: 42999,
    featured: true,
    status: 'Available',
    images: [
      { imageUrl: 'https://images.unsplash.com/photo-1632649680185-15d910e677ba?q=80&w=600', imageType: 'front' },
      { imageUrl: 'https://images.unsplash.com/photo-1644788390772-2d1e028b08ea?q=80&w=600', imageType: 'back' },
      { imageUrl: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=600', imageType: 'side' },
      { imageUrl: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=80&w=600', imageType: 'box' }
    ]
  },
  {
    id: 'f-2',
    slug: 'samsung-galaxy-s23-8gb-256gb-phantom-black',
    brand: 'Samsung',
    model: 'Galaxy S23',
    variant: '8GB RAM, 256GB Storage',
    ram: '8GB',
    storage: '256GB',
    color: 'Phantom Black',
    batteryHealth: 92,
    batteryOriginal: true,
    displayOriginal: true,
    bodyCondition: 'Excellent - Clean Frame',
    cameraCondition: 'Perfect - 100% Working Sensors',
    faceIdOrFingerprint: true,
    network: 'Unlocked (5G)',
    warranty: '6 Months Brand Warranty Left',
    description: 'Superb Samsung Galaxy S23 flagship with 256GB storage in Phantom Black. Screen has zero scratches. Battery is original with a healthy 92% life. Included in box is the original USB-C to USB-C charging cable, warranty card, and receipt.',
    price: 54999,
    offerPrice: 51999,
    featured: true,
    status: 'Available',
    images: [
      { imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600', imageType: 'front' },
      { imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9b226bba580?q=80&w=600', imageType: 'back' },
      { imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600', imageType: 'side' },
      { imageUrl: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=80&w=600', imageType: 'box' }
    ]
  },
  {
    id: 'f-3',
    slug: 'oneplus-11-5g-16gb-256gb-eternal-green',
    brand: 'OnePlus',
    model: '11 5G',
    variant: '16GB RAM, 256GB Storage',
    ram: '16GB',
    storage: '256GB',
    color: 'Eternal Green',
    batteryHealth: 90,
    batteryOriginal: true,
    displayOriginal: true,
    bodyCondition: 'Excellent - Minimal Pocket Scratches',
    cameraCondition: 'Hasselblad Optics - Flawless Lens',
    faceIdOrFingerprint: true,
    network: 'Unlocked (5G)',
    warranty: '1 Month Shop Warranty',
    description: 'High-performance OnePlus 11 5G in Eternal Green. 16GB RAM offers seamless multitasking. Both screen and battery are original. Comes with original 100W SuperVOOC charger in the box and a protective silicon cover.',
    price: 48999,
    offerPrice: 46999,
    featured: false,
    status: 'Available',
    images: [
      { imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600', imageType: 'front' },
      { imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600', imageType: 'back' },
      { imageUrl: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=80&w=600', imageType: 'side' },
      { imageUrl: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=600', imageType: 'box' }
    ]
  },
  {
    id: 'f-4',
    slug: 'google-pixel-8-128gb-obsidian',
    brand: 'Google',
    model: 'Pixel 8',
    variant: '128GB Obsidian',
    ram: '8GB',
    storage: '128GB',
    color: 'Obsidian',
    batteryHealth: 94,
    batteryOriginal: true,
    displayOriginal: true,
    bodyCondition: 'Excellent - Pristine Display',
    cameraCondition: 'Perfect - AI Cameras Working',
    faceIdOrFingerprint: true,
    network: 'Unlocked (5G)',
    warranty: '3 Months Shop Warranty',
    description: 'Excellent condition Google Pixel 8 in Obsidian. Known for the best AI photo capabilities. Screen is 100% original. Battery health is at 94%, performing like a new device. Charging adapter and USB cable are included.',
    price: 52999,
    offerPrice: 49999,
    featured: false,
    status: 'Available',
    images: [
      { imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600', imageType: 'front' },
      { imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600', imageType: 'back' },
      { imageUrl: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=80&w=600', imageType: 'side' },
      { imageUrl: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=600', imageType: 'box' }
    ]
  },
  {
    id: 'f-5',
    slug: 'nothing-phone-2-12gb-256gb-dark-grey',
    brand: 'Nothing',
    model: 'Phone (2)',
    variant: '12GB RAM, 256GB Dark Grey',
    ram: '12GB',
    storage: '256GB',
    color: 'Dark Grey',
    batteryHealth: 91,
    batteryOriginal: true,
    displayOriginal: true,
    bodyCondition: 'Pristine - Transparent Back Clean',
    cameraCondition: 'Dual 50MP Cameras - Flawless',
    faceIdOrFingerprint: true,
    network: 'Unlocked (5G)',
    warranty: '2 Months Shop Warranty',
    description: 'Extremely eye-catching Nothing Phone (2) with 256GB storage in Dark Grey. Glyph interface LEDs work 100% correctly. Clean transparent back panel without scratches. Comes with box and Nothing transparent USB-C cable.',
    price: 38999,
    offerPrice: 36999,
    featured: false,
    status: 'Available',
    images: [
      { imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600', imageType: 'front' },
      { imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600', imageType: 'back' },
      { imageUrl: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=80&w=600', imageType: 'side' },
      { imageUrl: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=600', imageType: 'box' }
    ]
  }
];

export const ShopProvider = ({ children }) => {
  const [shopSettings, setShopSettings] = useState(FALLBACK_SETTINGS);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [mobiles, setMobiles] = useState(FALLBACK_MOBILES);
  const [brands, setBrands] = useState(['Apple', 'Samsung', 'OnePlus', 'Google', 'Nothing']);
  const [loadingMobiles, setLoadingMobiles] = useState(true);
  
  const [adminToken, setAdminToken] = useState(localStorage.getItem('admin_token'));
  const [adminUser, setAdminUser] = useState(null);
  const [isBackendOffline, setIsBackendOffline] = useState(false);

  // Fetch Settings
  const fetchSettings = useCallback(async () => {
    setLoadingSettings(true);
    try {
      const res = await api.get('/shop');
      if (res.data && res.data.success) {
        setShopSettings(res.data.data);
        setIsBackendOffline(false);
      }
    } catch (error) {
      console.warn('API Error fetching settings, using local mock storage:', error.message);
      setIsBackendOffline(true);
    } finally {
      setLoadingSettings(false);
    }
  }, []);

  // Fetch Mobiles
  const fetchMobiles = useCallback(async (filters = {}) => {
    setLoadingMobiles(true);
    try {
      const params = new URLSearchParams();
      if (filters.q) params.append('q', filters.q);
      if (filters.brand) params.append('brand', filters.brand);
      if (filters.status) params.append('status', filters.status);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.featured) params.append('featured', filters.featured);

      const res = await api.get(`/mobiles?${params.toString()}`);
      if (res.data && res.data.success) {
        setMobiles(res.data.data);
        setIsBackendOffline(false);
      }
    } catch (error) {
      console.warn('API Error fetching mobiles, using local mock storage:', error.message);
      // Filter locally for mock demonstration
      let filtered = [...FALLBACK_MOBILES];
      if (filters.q) {
        const query = filters.q.toLowerCase();
        filtered = filtered.filter(
          m => m.brand.toLowerCase().includes(query) || m.model.toLowerCase().includes(query)
        );
      }
      if (filters.brand) {
        filtered = filtered.filter(m => m.brand.toLowerCase() === filters.brand.toLowerCase());
      }
      if (filters.status) {
        filtered = filtered.filter(m => m.status === filters.status);
      }
      if (filters.minPrice) {
        filtered = filtered.filter(m => m.price >= parseFloat(filters.minPrice));
      }
      if (filters.maxPrice) {
        filtered = filtered.filter(m => m.price <= parseFloat(filters.maxPrice));
      }
      if (filters.sort) {
        if (filters.sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
        if (filters.sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
      }
      setMobiles(filtered);
      setIsBackendOffline(true);
    } finally {
      setLoadingMobiles(false);
    }
  }, []);

  // Fetch unique brands
  const fetchBrands = useCallback(async () => {
    try {
      const res = await api.get('/mobiles/brands');
      if (res.data && res.data.success) {
        setBrands(res.data.data);
      }
    } catch (error) {
      console.warn('API Error fetching brands, using mock brands:', error.message);
      const mockBrands = Array.from(new Set(FALLBACK_MOBILES.map(m => m.brand)));
      setBrands(mockBrands);
    }
  }, []);

  // Auth Checks
  useEffect(() => {
    const verifyToken = async () => {
      if (adminToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data && res.data.success) {
            setAdminUser(res.data.user);
          }
        } catch (error) {
          console.warn('Admin token verification failed:', error.message);
          logoutAdmin();
        }
      }
    };
    verifyToken();
  }, [adminToken]);

  const loginAdmin = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data && res.data.success) {
        const token = res.data.token;
        localStorage.setItem('admin_token', token);
        setAdminToken(token);
        setAdminUser(res.data.user);
        return { success: true };
      }
    } catch (error) {
      console.error('Login error:', error);
      const errMsg = error.response?.data?.message || 'Login failed. Please check credentials.';
      return { success: false, message: errMsg };
    }
  };

  const logoutAdmin = () => {
    localStorage.removeItem('admin_token');
    setAdminToken(null);
    setAdminUser(null);
  };

  // Initial loads
  useEffect(() => {
    fetchSettings();
    fetchMobiles();
    fetchBrands();
  }, [fetchSettings, fetchMobiles, fetchBrands]);

  return (
    <ShopContext.Provider
      value={{
        shopSettings,
        loadingSettings,
        mobiles,
        brands,
        loadingMobiles,
        adminToken,
        adminUser,
        isAdmin: !!adminToken,
        isBackendOffline,
        fetchSettings,
        fetchMobiles,
        fetchBrands,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
