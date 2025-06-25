'use client';

import { useCart } from '@/contexts/cart-context';
import { Product } from '@/lib/types';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { CiShoppingCart } from 'react-icons/ci';
import { ImSpinner2 } from 'react-icons/im';

export function ProductCard({ product }: { product: Product }) {
  const session = useSession();

  const [loading, setLoading] = useState(false);
  const cart = useCart();

  const handleAddToCart = async () => {
    if (!session || !session.data || !session.data.user) {
      toast.error('Please sign in to add products to the cart.');
      return;
    }

    setLoading(true);
    await cart.addToCart(product.product_id, 1);
    setLoading(false);
  };

  return (
    <div
      key={product.product_id}
      className="relative bg-white rounded-2xl shadow-xl p-6 border border-emerald-100 hover:shadow-emerald-200 transition"
    >
      <h3 className="text-xl font-semibold text-emerald-700 mb-2">
        {product.name}
      </h3>
      <p className="text-gray-700 mb-2">{product.description}</p>
      <p className="text-gray-600 mb-1">
        <span className="font-medium">Price:</span> Rs{' '}
        {parseFloat(product.price.toString()).toLocaleString()}
      </p>
      <p className="text-gray-600">
        <span className="font-medium">Stock:</span> {product.stock_quantity}
      </p>

      <div className="absolute bottom-4 right-4">
        <button
          onClick={handleAddToCart}
          className="cursor-pointer h-10 w-10 flex items-center justify-center rounded-full bg-emerald-200 p-2 transition hover:bg-emerald-300 active:bg-emerald-400"
        >
          {loading ? (
            <span className="animate-spin">
              <ImSpinner2 />
            </span>
          ) : (
            <CiShoppingCart size={24} />
          )}
        </button>
      </div>
    </div>
  );
}
