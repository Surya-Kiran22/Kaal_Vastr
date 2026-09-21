export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  sku: string;
  description: string;
  selling_price: number;
  compare_at_price?: number | null;
  sizes: string[];
  colors: string[];
  image_url: string;
  images?: string[];
  stock: number;
  is_available: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface BusinessSettings {
  id: string;
  business_name: string;
  description: string;
  whatsapp_number: string;
  mobile_number: string;
  email: string;
  address: string;
  store_timings: string;
  instagram_url?: string;
  facebook_url?: string;
  logo_url?: string;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor?: string;
  quantity: number;
}

export interface WhatsAppOrderPayload {
  customerName: string;
  customerPhone: string;
  addressNotes?: string;
  items: CartItem[];
  totalAmount: number;
}
