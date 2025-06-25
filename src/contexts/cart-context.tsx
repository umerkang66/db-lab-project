'use client';

import { CartItem } from '@/lib/types';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import toast from 'react-hot-toast';

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  refreshCart: () => Promise<void>;
  addToCart: (product_id: string, quantity: number) => Promise<void>;
  loading?: boolean;
  removeFromCart: (cart_id: string) => Promise<void>;
}

const CartContext = createContext<CartContextType>({
  cart: [],
  cartCount: 0,
  refreshCart: async () => {},
  addToCart: async () => {
    console.warn('addToCart function not implemented');
  },
  loading: false,
  removeFromCart: async () => {
    console.warn('removeFromCart function not implemented');
  },
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart');
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }
      const data = await response.json();
      setCart(data.cart);
      setCartCount(data.cart.length);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = async (product_id: string, quantity: number) => {
    try {
      setLoading(true);
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_id, quantity: 1 }),
      });

      setLoading(false);
      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }

      const data = await response.json();
      console.log('Item added to cart:', data);
      toast.success('Item added to cart successfully!');
      fetchCart(); // Refresh the cart after adding an item
    } catch (error) {
      setLoading(false);
      console.error('Error adding item to cart:', error);
    }
  };

  const removeFromCart = async (cart_id: string) => {
    try {
      const response = await fetch(`/api/cart`, {
        method: 'DELETE',
        body: JSON.stringify({ cart_id }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }

      toast.success('Item removed from cart');
      fetchCart(); // Refresh after deletion
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast.error('Could not remove item');
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        refreshCart: fetchCart,
        addToCart,
        loading,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
