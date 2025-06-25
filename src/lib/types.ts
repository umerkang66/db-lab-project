export type User = {
  user_id: string;
  name: string;
  email: string;
  password: string;
  role: 'customer' | 'admin';
  created_at: Date;
};

export type CartItem = {
  cart_id: string;
  user_id: string;
  product_id: string;
  quantity: number;
};

export type Product = {
  product_id: string;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  created_at: Date;
};
