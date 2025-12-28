'use client';

import { useCart } from '@/contexts/cart-context';
import { Product } from '@/lib/types';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  FiShoppingCart,
  FiHeart,
  FiEye,
  FiPackage,
  FiCheck,
} from 'react-icons/fi';
import { ImSpinner2 } from 'react-icons/im';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const session = useSession();
  const [loading, setLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const cart = useCart();

  const handleAddToCart = async () => {
    if (!session || !session.data || !session.data.user) {
      toast.error('Please sign in to add products to the cart.');
      return;
    }

    setLoading(true);
    await cart.addToCart(product.product_id, 1);
    setLoading(false);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWishlist = () => {
    if (!session || !session.data || !session.data.user) {
      toast.error('Please sign in to add to wishlist.');
      return;
    }
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const stockStatus =
    product.stock_quantity === 0
      ? 'out'
      : product.stock_quantity < 10
      ? 'low'
      : 'high';

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex gap-6 group">
        {/* Product Image */}
        <div className="relative w-40 h-40 flex-shrink-0">
          <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-teal-50 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <FiPackage className="text-5xl text-emerald-300" />
          </div>
          {stockStatus === 'low' && (
            <span className="absolute top-2 left-2 badge badge-warning text-xs">
              Low Stock
            </span>
          )}
          {stockStatus === 'out' && (
            <span className="absolute top-2 left-2 badge badge-danger text-xs">
              Out of Stock
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
              {product.name}
            </h3>
            <p className="text-gray-500 mb-4 line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span
                className={`flex items-center gap-1 ${
                  stockStatus === 'high'
                    ? 'text-emerald-600'
                    : stockStatus === 'low'
                    ? 'text-amber-600'
                    : 'text-red-600'
                }`}
              >
                <FiPackage />
                {product.stock_quantity} in stock
              </span>
            </div>
          </div>

          {/* Price & Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="price-tag">
              <span className="price-tag-currency">Rs </span>
              {parseFloat(product.price.toString()).toLocaleString()}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleWishlist}
                className={`p-3 rounded-xl transition-all ${
                  isWishlisted
                    ? 'bg-red-100 text-red-500'
                    : 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500'
                }`}
              >
                <FiHeart
                  className={isWishlisted ? 'fill-current' : ''}
                  size={20}
                />
              </button>

              <button
                onClick={handleAddToCart}
                disabled={loading || stockStatus === 'out'}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  addedToCart
                    ? 'bg-emerald-100 text-emerald-700'
                    : stockStatus === 'out'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {loading ? (
                  <ImSpinner2 className="animate-spin" size={20} />
                ) : addedToCart ? (
                  <>
                    <FiCheck size={20} />
                    Added
                  </>
                ) : (
                  <>
                    <FiShoppingCart size={20} />
                    Add to Cart
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
        {/* Product Image */}
        <div className="relative aspect-square bg-gradient-to-br from-emerald-100 to-teal-50 overflow-hidden">
          <div className="w-full h-full flex items-center justify-center">
            <FiPackage className="text-6xl text-emerald-300 group-hover:scale-110 transition-transform duration-300" />
          </div>

          {/* Stock Badge */}
          {stockStatus === 'low' && (
            <span className="absolute top-3 left-3 badge badge-warning">
              Low Stock
            </span>
          )}
          {stockStatus === 'out' && (
            <span className="absolute top-3 left-3 badge badge-danger">
              Out of Stock
            </span>
          )}

          {/* Hover Actions */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
            <button
              onClick={() => setShowQuickView(true)}
              className="p-3 bg-white rounded-full text-gray-700 hover:bg-emerald-500 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0"
            >
              <FiEye size={20} />
            </button>
            <button
              onClick={handleWishlist}
              className={`p-3 bg-white rounded-full transition-all transform translate-y-4 group-hover:translate-y-0 delay-75 ${
                isWishlisted
                  ? 'text-red-500'
                  : 'text-gray-700 hover:text-red-500'
              }`}
            >
              <FiHeart
                className={isWishlisted ? 'fill-current' : ''}
                size={20}
              />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-emerald-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-500 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-emerald-600">
                Rs {parseFloat(product.price.toString()).toLocaleString()}
              </div>
              <span
                className={`text-xs ${
                  stockStatus === 'high'
                    ? 'text-emerald-600'
                    : stockStatus === 'low'
                    ? 'text-amber-600'
                    : 'text-red-600'
                }`}
              >
                {product.stock_quantity} in stock
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={loading || stockStatus === 'out'}
              className={`p-3 rounded-xl transition-all ${
                addedToCart
                  ? 'bg-emerald-100 text-emerald-600'
                  : stockStatus === 'out'
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:scale-105'
              }`}
            >
              {loading ? (
                <ImSpinner2 className="animate-spin" size={22} />
              ) : addedToCart ? (
                <FiCheck size={22} />
              ) : (
                <FiShoppingCart size={22} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
          onClick={() => setShowQuickView(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full p-8 animate-scale-in shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex gap-8">
              <div className="w-1/2">
                <div className="aspect-square bg-gradient-to-br from-emerald-100 to-teal-50 rounded-2xl flex items-center justify-center">
                  <FiPackage className="text-8xl text-emerald-300" />
                </div>
              </div>
              <div className="w-1/2 flex flex-col">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {product.name}
                </h2>
                <p className="text-gray-500 mb-6 flex-1">
                  {product.description}
                </p>

                <div className="space-y-4">
                  <div className="text-3xl font-bold text-emerald-600">
                    Rs {parseFloat(product.price.toString()).toLocaleString()}
                  </div>

                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                      stockStatus === 'high'
                        ? 'bg-emerald-100 text-emerald-700'
                        : stockStatus === 'low'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    <FiPackage />
                    {stockStatus === 'out'
                      ? 'Out of Stock'
                      : `${product.stock_quantity} in stock`}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleWishlist}
                      className={`p-4 rounded-xl transition-all ${
                        isWishlisted
                          ? 'bg-red-100 text-red-500'
                          : 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500'
                      }`}
                    >
                      <FiHeart
                        className={isWishlisted ? 'fill-current' : ''}
                        size={24}
                      />
                    </button>
                    <button
                      onClick={handleAddToCart}
                      disabled={loading || stockStatus === 'out'}
                      className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all ${
                        addedToCart
                          ? 'bg-emerald-100 text-emerald-700'
                          : stockStatus === 'out'
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {loading ? (
                        <ImSpinner2 className="animate-spin" size={22} />
                      ) : addedToCart ? (
                        <>
                          <FiCheck size={22} />
                          Added to Cart
                        </>
                      ) : (
                        <>
                          <FiShoppingCart size={22} />
                          Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowQuickView(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg
                className="w-6 h-6 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
