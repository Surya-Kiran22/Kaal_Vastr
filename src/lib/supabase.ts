import { createClient } from '@supabase/supabase-js';
import { Product, BusinessSettings } from '../types';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

function sanitizeUrl(urlStr: string): string {
  if (!urlStr) return 'https://placeholder.supabase.co';
  let formatted = urlStr.trim();
  if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
    formatted = `https://${formatted}`;
  }
  try {
    const parsed = new URL(formatted);
    // Check if it's a valid hostname (e.g. xyz.supabase.co) and not a key string
    if (parsed.hostname && parsed.hostname.includes('.') && !parsed.hostname.startsWith('sb_')) {
      return parsed.origin;
    }
  } catch {
    // Invalid URL string
  }
  return 'https://placeholder.supabase.co';
}

export const validSupabaseUrl = sanitizeUrl(rawUrl);
export const validSupabaseAnonKey = rawKey || 'placeholder-anon-key';

export const isSupabaseConfigured = Boolean(
  validSupabaseUrl !== 'https://placeholder.supabase.co' &&
  validSupabaseAnonKey !== 'placeholder-anon-key' &&
  validSupabaseAnonKey.length > 10
);

export const supabase = createClient(validSupabaseUrl, validSupabaseAnonKey);

// Fallback Initial Seed Data for standalone local execution & offline testing
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Shadow Oversized Hoodie',
    category: 'Hoodies',
    brand: 'Kaal Vastr',
    sku: 'KV-HD-001',
    description: 'Heavyweight 450 GSM French Terry cotton hoodie in deep obsidian black. Features dropped shoulders, double-stitched seams, and minimal silver branding.',
    selling_price: 4499,
    compare_at_price: 5999,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Obsidian Black', 'Charcoal Grey'],
    image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 15,
    is_available: true,
    is_archived: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-002',
    name: 'Obsidian Acid-Wash Tee',
    category: 'T-Shirts',
    brand: 'Kaal Vastr',
    sku: 'KV-TS-002',
    description: 'Custom vintage acid-washed 260 GSM combed cotton t-shirt featuring subtle silver typography on the chest.',
    selling_price: 2199,
    compare_at_price: 2799,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Acid Black', 'Silver Dust'],
    image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 25,
    is_available: true,
    is_archived: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-003',
    name: 'Monolith Utility Cargo Pants',
    category: 'Pants',
    brand: 'Kaal Vastr',
    sku: 'KV-PT-003',
    description: 'Tapered cargo trousers constructed from weather-resistant ripstop canvas with 6 tactical pockets and adjustable ankles.',
    selling_price: 4999,
    compare_at_price: 6499,
    sizes: ['M', 'L', 'XL'],
    colors: ['Charcoal Grey', 'Deep Black'],
    image_url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 8,
    is_available: true,
    is_archived: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-004',
    name: 'Nocturne Bomber Jacket',
    category: 'Outerwear',
    brand: 'Kaal Vastr',
    sku: 'KV-JK-004',
    description: 'Minimalist matte black nylon bomber jacket with brushed silver zippers and premium satin thermal lining.',
    selling_price: 7999,
    compare_at_price: 9999,
    sizes: ['S', 'M', 'L'],
    colors: ['Matte Black'],
    image_url: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 5,
    is_available: true,
    is_archived: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-005',
    name: 'Vanguard Sweatshirt',
    category: 'Sweatshirts',
    brand: 'Kaal Vastr',
    sku: 'KV-SW-005',
    description: 'Structured French terry crewneck with tonal embroidered Kaal Vastr chest crest and rib-knit cuffs.',
    selling_price: 3499,
    compare_at_price: 4299,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Steel Grey', 'Coal Black'],
    image_url: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 12,
    is_available: true,
    is_archived: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-006',
    name: 'Eclipse Structured Blazer',
    category: 'Outerwear',
    brand: 'Kaal Vastr',
    sku: 'KV-BL-006',
    description: 'Modern unconstructed tailored jacket crafted from premium wool-blend twill with clean lapels and minimal silver hardware.',
    selling_price: 8999,
    compare_at_price: 11999,
    sizes: ['M', 'L', 'XL'],
    colors: ['Charcoal Grey'],
    image_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 4,
    is_available: true,
    is_archived: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const INITIAL_BUSINESS_SETTINGS: BusinessSettings = {
  id: 'biz-001',
  business_name: 'Kaal Vastr',
  description: 'Minimalist dark grey & silver aesthetic streetwear and luxury clothing.',
  whatsapp_number: '919876543210',
  mobile_number: '+91 98765 43210',
  email: 'contact@kaalvastr.in',
  address: '104, Obsidian Avenue, Khar West, Mumbai, MH 400052',
  store_timings: 'Mon - Sat: 11:00 AM - 9:00 PM | Sun: 12:00 PM - 7:00 PM',
  instagram_url: 'https://instagram.com/kaalvastr',
  facebook_url: 'https://facebook.com/kaalvastr',
  logo_url: '',
  updated_at: new Date().toISOString(),
};

// Local storage keys
const LOCAL_STORAGE_PRODUCTS = 'kaalvastr_products_store';
const LOCAL_STORAGE_SETTINGS = 'kaalvastr_business_settings_store';

const getStoredProducts = (): Product[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_PRODUCTS);
  if (!data) {
    localStorage.setItem(LOCAL_STORAGE_PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_PRODUCTS;
  }
};

const getStoredSettings = (): BusinessSettings => {
  const data = localStorage.getItem(LOCAL_STORAGE_SETTINGS);
  if (!data) {
    localStorage.setItem(LOCAL_STORAGE_SETTINGS, JSON.stringify(INITIAL_BUSINESS_SETTINGS));
    return INITIAL_BUSINESS_SETTINGS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_BUSINESS_SETTINGS;
  }
};

export async function fetchProducts(includeArchived = false): Promise<Product[]> {
  if (isSupabaseConfigured) {
    try {
      let query = supabase.from('products').select('*');
      if (!includeArchived) {
        query = query.eq('is_archived', false);
      }
      const { data, error } = await query.order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data as Product[];
    } catch (err) {
      console.warn('Supabase fetch failed, resorting to fallback store', err);
    }
  }
  const products = getStoredProducts();
  return includeArchived ? products : products.filter(p => !p.is_archived);
}

export async function fetchProductById(id: string): Promise<Product | null> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (!error && data) return data as Product;
    } catch (err) {
      console.warn('Supabase fetchProductById failed, using fallback', err);
    }
  }
  const products = getStoredProducts();
  return products.find(p => p.id === id) || null;
}

export async function fetchBusinessSettings(): Promise<BusinessSettings> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('business_settings').select('*').limit(1).single();
      if (!error && data) return data as BusinessSettings;
    } catch (err) {
      console.warn('Supabase fetchBusinessSettings failed, using fallback', err);
    }
  }
  return getStoredSettings();
}

export async function saveProduct(product: Partial<Product>): Promise<Product> {
  if (isSupabaseConfigured) {
    try {
      if (product.id) {
        const { data, error } = await supabase
          .from('products')
          .update({ ...product, updated_at: new Date().toISOString() })
          .eq('id', product.id)
          .select()
          .single();
        if (!error && data) return data as Product;
      } else {
        const { data, error } = await supabase
          .from('products')
          .insert([{ ...product, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }])
          .select()
          .single();
        if (!error && data) return data as Product;
      }
    } catch (err) {
      console.warn('Supabase saveProduct failed, using fallback store', err);
    }
  }

  // Fallback Local Storage handler
  const products = getStoredProducts();
  if (product.id) {
    const idx = products.findIndex(p => p.id === product.id);
    if (idx !== -1) {
      const updated = { ...products[idx], ...product, updated_at: new Date().toISOString() } as Product;
      products[idx] = updated;
      localStorage.setItem(LOCAL_STORAGE_PRODUCTS, JSON.stringify(products));
      return updated;
    }
  }
  
  const newProduct: Product = {
    id: `prod-${Date.now()}`,
    name: product.name || 'Untitled Product',
    category: product.category || 'T-Shirts',
    brand: product.brand || 'Kaal Vastr',
    sku: product.sku || `KV-${Date.now()}`,
    description: product.description || '',
    selling_price: product.selling_price || 0,
    compare_at_price: product.compare_at_price || null,
    sizes: product.sizes || ['S', 'M', 'L', 'XL'],
    colors: product.colors || ['Black'],
    image_url: product.image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    images: product.images || [],
    stock: product.stock ?? 10,
    is_available: product.is_available ?? true,
    is_archived: product.is_archived ?? false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  products.unshift(newProduct);
  localStorage.setItem(LOCAL_STORAGE_PRODUCTS, JSON.stringify(products));
  return newProduct;
}

export async function archiveProductToggle(id: string, is_archived: boolean): Promise<boolean> {
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_archived, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (!error) return true;
    } catch (err) {
      console.warn('Supabase archiveProductToggle failed, using fallback', err);
    }
  }

  const products = getStoredProducts();
  const idx = products.findIndex(p => p.id === id);
  if (idx !== -1) {
    products[idx].is_archived = is_archived;
    products[idx].updated_at = new Date().toISOString();
    localStorage.setItem(LOCAL_STORAGE_PRODUCTS, JSON.stringify(products));
    return true;
  }
  return false;
}

export async function saveBusinessSettings(settings: Partial<BusinessSettings>): Promise<BusinessSettings> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('business_settings')
        .update({ ...settings, updated_at: new Date().toISOString() })
        .eq('id', settings.id || 'biz-001')
        .select()
        .single();
      if (!error && data) return data as BusinessSettings;
    } catch (err) {
      console.warn('Supabase saveBusinessSettings failed, using fallback', err);
    }
  }

  const current = getStoredSettings();
  const updated = { ...current, ...settings, updated_at: new Date().toISOString() };
  localStorage.setItem(LOCAL_STORAGE_SETTINGS, JSON.stringify(updated));
  return updated;
}

export async function uploadProductImage(file: File): Promise<string> {
  if (isSupabaseConfigured) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (!uploadError) {
        const { data } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);
        if (data.publicUrl) return data.publicUrl;
      }
    } catch (err) {
      console.warn('Supabase upload image failed, creating data URL fallback', err);
    }
  }

  // Local fallback object URL or data URL
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  });
}
