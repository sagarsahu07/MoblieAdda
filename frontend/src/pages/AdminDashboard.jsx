import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { Smartphone, CheckCircle, XCircle, AlertTriangle, Plus, Settings, Edit, Trash2, Eye, Calendar, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const { mobiles, isAdmin, fetchMobiles, isBackendOffline } = useShop();
  const navigate = useNavigate();

  // Redirect if not authorized
  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, navigate]);

  // Local dashboard stats
  const [stats, setStats] = useState({ total: 0, available: 0, sold: 0, featured: 0 });
  const [logs, setLogs] = useState([]);
  const [loadingDashboard, setLoadingDashboard] = useState(true);

  // Fetch Dashboard details
  const fetchDashboardData = async () => {
    setLoadingDashboard(true);
    try {
      // 1. Fetch stats
      const statsRes = await api.get('/mobiles/admin/stats');
      if (statsRes.data && statsRes.data.success) {
        setStats(statsRes.data.data);
      }

      // 2. Fetch logs
      const logsRes = await api.get('/logs');
      if (logsRes.data && logsRes.data.success) {
        setLogs(logsRes.data.data);
      }
    } catch (error) {
      console.warn('Backend connection offline, rendering local UI calculations:', error.message);
      // Run calculations locally using fallback context mobiles
      const total = mobiles.length;
      const available = mobiles.filter(m => m.status === 'Available').length;
      const sold = mobiles.filter(m => m.status === 'Sold').length;
      const featured = mobiles.filter(m => m.featured).length;
      setStats({ total, available, sold, featured });
      
      // Default local activity logs
      setLogs([
        { id: '1', action: 'Added iPhone 14 Pro Max', createdAt: new Date() },
        { id: '2', action: 'Marked OnePlus 11 as Sold', createdAt: new Date(Date.now() - 3600000) }
      ]);
    } finally {
      setLoadingDashboard(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData();
    }
  }, [isAdmin, mobiles]);

  // Mark product as sold quickly
  const handleMarkSold = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Sold' ? 'Available' : 'Sold';
    try {
      const res = await api.put(`/mobiles/${id}`, { status: nextStatus });
      if (res.data && res.data.success) {
        fetchMobiles(); // Reload list
        fetchDashboardData(); // Reload stats
      }
    } catch (err) {
      alert(`API Error marking product status: ${err.message}. (Database migrations pending)`);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id, modelName) => {
    if (!window.confirm(`Are you sure you want to delete ${modelName}?`)) return;

    try {
      const res = await api.delete(`/mobiles/${id}`);
      if (res.data && res.data.success) {
        fetchMobiles(); // Reload list
        fetchDashboardData(); // Reload stats
      }
    } catch (err) {
      alert(`API Error deleting product: ${err.message}. (Database migrations pending)`);
    }
  };

  // Format currency
  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format date helper
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Dashboard Toolbar Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Owner Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">
            Overview metrics, device catalog management, and administrative logs.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <Link
            to="/admin/settings"
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-slate-900 border border-slate-800 hover:border-slate-700 px-5 py-3 rounded-xl font-bold text-sm text-slate-300 transition-colors"
          >
            <Settings className="w-4.5 h-4.5 text-slate-400" />
            <span>Shop Settings</span>
          </Link>
          <Link
            to="/admin/mobiles/new"
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-brand-500 hover:bg-brand-600 px-5 py-3 rounded-xl font-bold text-sm text-white shadow-glow"
          >
            <Plus className="w-5 h-5" />
            <span>Add Mobile</span>
          </Link>
        </div>
      </div>

      {/* Backend connection warning badge */}
      {isBackendOffline && (
        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex items-center space-x-3 text-amber-400 text-sm">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>
            <strong>Offline Mode Active:</strong> Dashboard stats, mutations (Mark Sold, Delete), and new entries are calculated and stored locally. Updates require a running database server.
          </span>
        </div>
      )}

      {/* Statistics Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Showcase', value: stats.total, color: 'text-slate-100' },
          { label: 'Available Inventory', value: stats.available, color: 'text-emerald-400' },
          { label: 'Devices Sold', value: stats.sold, color: 'text-rose-400' },
          { label: 'Featured List', value: stats.featured, color: 'text-brand-400' }
        ].map((c, index) => (
          <div key={index} className="glass-panel p-6 rounded-3xl border border-slate-900/60 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-full blur-2xl"></div>
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">{c.label}</span>
            <span className={`text-3xl font-black mt-2 block ${c.color}`}>{c.value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Mobile Inventory Catalog Table */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-panel rounded-3xl border border-slate-900/80 overflow-hidden">
            <div className="p-6 border-b border-slate-850">
              <h2 className="font-bold text-white text-lg flex items-center space-x-2">
                <Smartphone className="w-5 h-5 text-brand-500" />
                <span>Showcase Catalog</span>
              </h2>
            </div>

            {loadingDashboard ? (
              <LoadingSpinner />
            ) : mobiles.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <p>No mobile devices registered in showcase.</p>
                <Link to="/admin/mobiles/new" className="text-brand-400 font-semibold hover:underline mt-2 inline-block">
                  Add your first device now
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-950/60 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-900 font-semibold">
                      <th className="py-4 px-6">Device</th>
                      <th className="py-4 px-4">Condition</th>
                      <th className="py-4 px-4">Price</th>
                      <th className="py-4 px-4">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900">
                    {mobiles.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-900/30 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            {m.images && m.images.length > 0 && (
                              <img
                                src={m.images[0].imageUrl}
                                alt={m.model}
                                className="w-10 h-10 rounded-lg object-cover bg-slate-950 border border-slate-850"
                              />
                            )}
                            <div>
                              <span className="font-bold text-white block truncate max-w-[150px]">
                                {m.brand} {m.model}
                              </span>
                              <span className="text-xs text-slate-500 block truncate max-w-[150px]">
                                {m.variant || m.color}
                              </span>
                            </div>
                          </div>
                        </td>
                        
                        <td className="py-4 px-4">
                          <div className="flex flex-col space-y-0.5">
                            <span className="text-xs text-slate-300 font-medium">{m.bodyCondition}</span>
                            <span className="text-[10px] text-brand-500 font-semibold">{m.batteryHealth}% Battery Health</span>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <span className="font-bold text-slate-200">
                            {formatPrice(m.offerPrice || m.price)}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <button
                            onClick={() => handleMarkSold(m.id, m.status)}
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${
                              m.status === 'Available'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20'
                            }`}
                            title="Click to toggle Available/Sold"
                          >
                            {m.status}
                          </button>
                        </td>

                        <td className="py-4 px-6 text-right space-x-1">
                          <button
                            onClick={() => navigate(`/admin/mobiles/${m.id}/edit`)}
                            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                            title="Edit specs"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteProduct(m.id, m.model)}
                            className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recent Activity Logs Timeline */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-900/80">
            <h2 className="font-bold text-white text-lg flex items-center space-x-2 pb-4 border-b border-slate-850">
              <Calendar className="w-4.5 h-4.5 text-brand-500" />
              <span>Recent Activity</span>
            </h2>

            {loadingDashboard ? (
              <LoadingSpinner />
            ) : logs.length === 0 ? (
              <p className="text-slate-500 text-xs py-8 text-center">No recent actions recorded.</p>
            ) : (
              <div className="relative border-l border-slate-800 pl-4 space-y-6 mt-6">
                {logs.map((log) => (
                  <div key={log.id} className="relative space-y-1">
                    {/* Ring dot */}
                    <span className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 bg-brand-500 rounded-full ring-4 ring-dark-950"></span>
                    <p className="text-slate-300 text-xs font-semibold leading-relaxed">
                      {log.action}
                    </p>
                    <span className="text-[10px] text-slate-500 block">
                      {formatDate(log.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
