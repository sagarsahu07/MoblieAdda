import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Mobiles from './pages/Mobiles';
import MobileDetail from './pages/MobileDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminMobileForm from './pages/AdminMobileForm';
import AdminSettings from './pages/AdminSettings';

// Scroll to top on route change helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-dark-950">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mobiles" element={<Mobiles />} />
          <Route path="/mobiles/:slug" element={<MobileDetail />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/mobiles/new" element={<AdminMobileForm />} />
          <Route path="/admin/mobiles/:id/edit" element={<AdminMobileForm />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <ShopProvider>
      <Router>
        <ScrollToTop />
        <AppLayout />
      </Router>
    </ShopProvider>
  );
}

export default App;
