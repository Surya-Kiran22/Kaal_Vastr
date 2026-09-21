import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Archive, RefreshCw, Search, LogOut, Store, Package, Check, Save } from 'lucide-react';
import { Product, BusinessSettings } from '../types';
import { fetchProducts, archiveProductToggle } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useBusiness } from '../context/BusinessContext';
import { ProductFormModal } from '../components/ProductFormModal';

export const AdminDashboardPage: React.FC = () => {
  const { logout } = useAuth();
  const { settings, updateSettings, refreshSettings } = useBusiness();

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'products' | 'settings'>('products');
  const [productFilter, setProductFilter] = useState<'active' | 'archived'>('active');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Business Settings Form state
  const [whatsapp, setWhatsapp] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [timings, setTimings] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const data = await fetchProducts(true); // Include archived products for admin
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products for admin:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (settings) {
      setWhatsapp(settings.whatsapp_number || '');
      setMobile(settings.mobile_number || '');
      setEmail(settings.email || '');
      setAddress(settings.address || '');
      setTimings(settings.store_timings || '');
      setInstagram(settings.instagram_url || '');
      setFacebook(settings.facebook_url || '');
    }
  }, [settings]);

  const handleArchiveToggle = async (product: Product) => {
    const newArchivedState = !product.is_archived;
    const ok = await archiveProductToggle(product.id, newArchivedState);
    if (ok) {
      loadProducts();
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSuccess(false);

    const payload: Partial<BusinessSettings> = {
      id: settings?.id,
      whatsapp_number: whatsapp.trim(),
      mobile_number: mobile.trim(),
      email: email.trim(),
      address: address.trim(),
      store_timings: timings.trim(),
      instagram_url: instagram.trim(),
      facebook_url: facebook.trim(),
    };

    const success = await updateSettings(payload);
    setSavingSettings(false);
    if (success) {
      setSettingsSuccess(true);
      refreshSettings();
      setTimeout(() => setSettingsSuccess(false), 3000);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesFilter = productFilter === 'active' ? !p.is_archived : p.is_archived;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-widest text-white uppercase font-sans">
            Kaal Vastr Admin Dashboard
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage product inventory, upload images, archive styles, and configure business settings.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setEditingProduct(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2.5 bg-white text-black font-semibold text-xs tracking-wider uppercase rounded-md hover:bg-zinc-200 transition-all flex items-center space-x-2 shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>

          <button
            onClick={logout}
            className="px-4 py-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-xs tracking-wider uppercase font-medium rounded-md transition-colors flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-3 border-b border-zinc-800">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 text-xs font-semibold tracking-wider uppercase transition-colors flex items-center space-x-2 border-b-2 ${
            activeTab === 'products'
              ? 'border-white text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Product Catalogue ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 text-xs font-semibold tracking-wider uppercase transition-colors flex items-center space-x-2 border-b-2 ${
            activeTab === 'settings'
              ? 'border-white text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Business Settings</span>
        </button>
      </div>

      {/* Tab 1: Products Table */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          
          {/* Controls: Search & Sub-tabs */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
            
            {/* Active vs Archived Filter */}
            <div className="flex space-x-2">
              <button
                onClick={() => setProductFilter('active')}
                className={`px-3.5 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all ${
                  productFilter === 'active'
                    ? 'bg-zinc-800 text-white border border-zinc-700'
                    : 'bg-zinc-950 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Active Products ({products.filter((p) => !p.is_archived).length})
              </button>

              <button
                onClick={() => setProductFilter('archived')}
                className={`px-3.5 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all ${
                  productFilter === 'archived'
                    ? 'bg-zinc-800 text-white border border-zinc-700'
                    : 'bg-zinc-950 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Archived ({products.filter((p) => p.is_archived).length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[260px]">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by product name, SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#141416] border border-[#27272A] rounded-md text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              />
            </div>

          </div>

          {/* Table Container */}
          <div className="bg-[#141416] border border-[#27272A] rounded-lg overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0C0C0E] border-b border-zinc-800 text-zinc-400 uppercase tracking-widest text-[10px]">
                  <tr>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">SKU</th>
                    <th className="px-6 py-4">Selling Price</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
                  {loadingProducts ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                        Loading products from Supabase...
                      </td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                        No products match the selected tab or search query.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-zinc-900/60 transition-colors">
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={product.image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80'}
                              alt={product.name}
                              className="w-10 h-12 object-cover rounded border border-zinc-800 bg-zinc-900"
                            />
                            <div>
                              <strong className="block text-white font-medium text-xs tracking-wide">
                                {product.name}
                              </strong>
                              <span className="text-[11px] text-zinc-500">
                                Sizes: {product.sizes.join(', ')}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-zinc-400 font-mono text-[10px]">
                            {product.category}
                          </span>
                        </td>

                        <td className="px-6 py-4 font-mono text-zinc-400">{product.sku}</td>

                        <td className="px-6 py-4 font-semibold text-white">
                          ₹{product.selling_price.toLocaleString('en-IN')}
                          {product.compare_at_price && (
                            <span className="block text-[10px] text-zinc-500 line-through">
                              ₹{product.compare_at_price.toLocaleString('en-IN')}
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <span className={product.stock <= 3 ? 'text-red-400 font-bold' : 'text-zinc-300'}>
                            {product.stock} units
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          {product.is_archived ? (
                            <span className="px-2 py-0.5 bg-red-950 text-red-400 border border-red-800 rounded text-[10px] uppercase font-semibold">
                              Archived
                            </span>
                          ) : product.stock <= 0 || !product.is_available ? (
                            <span className="px-2 py-0.5 bg-amber-950 text-amber-400 border border-amber-800 rounded text-[10px] uppercase font-semibold">
                              Out of Stock
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded text-[10px] uppercase font-semibold">
                              Active / Published
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => {
                                setEditingProduct(product);
                                setIsModalOpen(true);
                              }}
                              className="p-1.5 text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded transition-colors"
                              title="Edit product"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleArchiveToggle(product)}
                              className={`p-1.5 border rounded transition-colors ${
                                product.is_archived
                                  ? 'text-emerald-400 bg-emerald-950/40 border-emerald-800 hover:bg-emerald-900'
                                  : 'text-zinc-400 hover:text-red-400 bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                              }`}
                              title={product.is_archived ? 'Restore / Unarchive product' : 'Archive product'}
                            >
                              <Archive className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Business Settings */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl bg-[#141416] border border-[#27272A] rounded-lg p-6 sm:p-8 space-y-6">
          <div className="border-b border-zinc-800 pb-4">
            <h2 className="text-base font-bold tracking-wider uppercase text-white">Business Settings Editor</h2>
            <p className="text-xs text-zinc-400">
              Updates global WhatsApp contact destination, mobile helpline, location, and store timings.
            </p>
          </div>

          {settingsSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-md text-xs flex items-center space-x-2">
              <Check className="w-4 h-4" />
              <span>Business settings saved to Supabase successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                WhatsApp Destination Number (Without + or spaces) *
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="919876543210"
                required
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-md text-xs text-white focus:outline-none focus:border-zinc-500"
              />
              <span className="text-[11px] text-zinc-500 mt-0.5 block">
                Customer WhatsApp orders generated on the cart drawer will redirect to this number.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                Mobile Helpline Number
              </label>
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-md text-xs text-white focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                Support Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@kaalvastr.in"
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-md text-xs text-white focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                Flagship Studio Address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                placeholder="104, Obsidian Avenue, Khar West, Mumbai, MH 400052"
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-md text-xs text-white focus:outline-none focus:border-zinc-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                Store Operating Hours / Timings
              </label>
              <input
                type="text"
                value={timings}
                onChange={(e) => setTimings(e.target.value)}
                placeholder="Mon - Sat: 11:00 AM - 9:00 PM | Sun: 12:00 PM - 7:00 PM"
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-md text-xs text-white focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                  Instagram Link
                </label>
                <input
                  type="url"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="https://instagram.com/kaalvastr"
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-md text-xs text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                  Facebook Link
                </label>
                <input
                  type="url"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="https://facebook.com/kaalvastr"
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-md text-xs text-white focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800">
              <button
                type="submit"
                disabled={savingSettings}
                className="w-full py-3 bg-white text-black font-semibold text-xs tracking-widest uppercase rounded-md hover:bg-zinc-200 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{savingSettings ? 'Saving Settings...' : 'Save Business Configuration'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
          }}
          onSaved={loadProducts}
        />
      )}

    </div>
  );
};
