'use client';

import { useCart } from '@/contexts/cart-context';
import { Product } from '@/lib/types';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  FiTrash2,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiArrowRight,
  FiPackage,
  FiTruck,
  FiShield,
  FiMapPin,
  FiX,
} from 'react-icons/fi';
import { ImSpinner2 } from 'react-icons/im';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeFromCart, refreshCart, addToCart } = useCart();
  const [productMap, setProductMap] = useState<Record<string, Product>>({});
  const [address, setAddress] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [removingItem, setRemovingItem] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const jsonResponse = await res.json();
        const products = jsonResponse.products as Product[];

        const map: Record<string, Product> = {};
        products.forEach(product => {
          map[product.product_id] = product;
        });
        setProductMap(map);
      } catch (err) {
        toast.error('Failed to load products');
      }
    };

    fetchProducts();
  }, []);

  const total = cart.reduce((sum, item) => {
    const product = productMap[item.product_id];
    return product
      ? sum + parseFloat(product.price.toString()) * item.quantity
      : sum;
  }, 0);

  const handleRemove = async (cart_id: string) => {
    setRemovingItem(cart_id);
    await removeFromCart(cart_id);
    setRemovingItem(null);
  };

  const handleOrder = async () => {
    if (cart.length === 0) {
      toast.error(
        'Your cart is empty. Please add items to your cart before ordering.'
      );
      return;
    }
    if (!address.trim()) {
      toast.error('Please enter a delivery address.');
      return;
    }
    setLoading(true);
    const res = await fetch('/api/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'unpaid',
        address,
        items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      toast.error(errorData.error || 'Failed to place order');
      setLoading(false);
      return;
    }

    setLoading(false);
    setAddress('');
    setShowModal(false);
    toast.success('Order placed successfully!');
    await refreshCart();
  };

  if (Object.keys(productMap).length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded-lg w-48 mb-8"></div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-2xl p-6 h-32"></div>
                ))}
              </div>
              <div className="bg-white rounded-2xl p-6 h-64"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <FiShoppingBag className="text-emerald-200" />
            Shopping Cart
          </h1>
          <p className="text-emerald-100 mt-2">
            {cart.length} item{cart.length !== 1 && 's'} in your cart
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {cart.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiShoppingBag className="text-5xl text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Looks like you have not added anything to your cart yet. Start
              shopping to fill it up!
            </p>
            <Link
              href="/shop"
              className="btn-primary inline-flex items-center gap-2"
            >
              Continue Shopping
              <FiArrowRight />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, index) => {
                const product = productMap[item.product_id];
                if (!product) return null;

                const subtotal =
                  parseFloat(product.price.toString()) * item.quantity;

                return (
                  <div
                    key={item.cart_id}
                    className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all animate-fade-in ${
                      removingItem === item.cart_id ? 'opacity-50 scale-98' : ''
                    }`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FiPackage className="text-3xl text-emerald-300" />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {product.name}
                            </h3>
                            <p className="text-gray-500 text-sm line-clamp-1">
                              {product.description}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemove(item.cart_id)}
                            disabled={removingItem === item.cart_id}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            {removingItem === item.cart_id ? (
                              <ImSpinner2 className="animate-spin" size={18} />
                            ) : (
                              <FiTrash2 size={18} />
                            )}
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          {/* Quantity */}
                          <div className="flex items-center gap-3">
                            <span className="text-gray-500 text-sm">Qty:</span>
                            <div className="quantity-selector">
                              <button disabled className="opacity-50">
                                <FiMinus size={16} />
                              </button>
                              <input
                                type="text"
                                value={item.quantity}
                                readOnly
                                className="bg-transparent"
                              />
                              <button disabled className="opacity-50">
                                <FiPlus size={16} />
                              </button>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <div className="text-lg font-bold text-emerald-600">
                              Rs {subtotal.toLocaleString()}
                            </div>
                            <div className="text-gray-400 text-sm">
                              Rs{' '}
                              {parseFloat(
                                product.price.toString()
                              ).toLocaleString()}{' '}
                              each
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Continue Shopping */}
              <Link
                href="/shop"
                className="flex items-center justify-center gap-2 py-4 text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              >
                <FiArrowRight className="rotate-180" />
                Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cart.length} items)</span>
                    <span>Rs {total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-emerald-600 font-medium">Free</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-gray-900">
                        Total
                      </span>
                      <span className="text-2xl font-bold text-emerald-600">
                        Rs {total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowModal(true)}
                  className="w-full btn-primary flex items-center justify-center gap-2 py-4"
                >
                  Proceed to Checkout
                  <FiArrowRight />
                </button>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <FiTruck className="mx-auto text-xl text-emerald-500 mb-1" />
                      <span className="text-xs text-gray-500">
                        Free Shipping
                      </span>
                    </div>
                    <div>
                      <FiShield className="mx-auto text-xl text-emerald-500 mb-1" />
                      <span className="text-xs text-gray-500">Secure</span>
                    </div>
                    <div>
                      <FiPackage className="mx-auto text-xl text-emerald-500 mb-1" />
                      <span className="text-xs text-gray-500">
                        Easy Returns
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Address Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
          <div
            className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <FiMapPin className="text-emerald-600" />
                  </div>
                  Delivery Address
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="text-gray-500" size={24} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter your delivery address
              </label>
              <textarea
                value={address}
                onChange={e => setAddress(e.target.value)}
                rows={4}
                className="input-modern resize-none"
                placeholder="Street address, city, postal code..."
              ></textarea>

              {/* Order Summary */}
              <div className="mt-6 bg-emerald-50 rounded-xl p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Order Total</span>
                  <span className="font-bold text-emerald-700">
                    Rs {total.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    {cart.length} item{cart.length !== 1 && 's'}
                  </span>
                  <span className="text-emerald-600">Free Shipping</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleOrder}
                disabled={loading || !address.trim()}
                className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <ImSpinner2 className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Confirm Order
                    <FiArrowRight />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
