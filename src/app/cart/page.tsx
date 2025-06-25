'use client';

import { useCart } from '@/contexts/cart-context';
import { Product } from '@/lib/types';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MdDelete } from 'react-icons/md';

export default function CartPage() {
  const { cart, removeFromCart, refreshCart } = useCart();
  const [productMap, setProductMap] = useState<Record<string, Product>>({});
  const [address, setAddress] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products'); // adjust path as needed
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

  const handleOrder = async () => {
    if (cart.length === 0) {
      toast.error(
        'Your cart is empty. Please add items to your cart before ordering.'
      );
      return;
    }
    if (!address.trim()) {
      toast.error('Please enter a delivery address.');
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
      return;
    }

    setLoading(false);
    setAddress('');
    setShowModal(false);
    toast.success('Order placed successfully!');
    await refreshCart();
  };

  return (
    <div>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-emerald-700 mb-6">Your Cart</h1>

        {cart.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cart.map(item => {
              const product = productMap[item.product_id];
              if (!product) return null;

              const subtotal =
                parseFloat(product.price.toString()) * item.quantity;

              return (
                <div
                  key={item.cart_id}
                  className="bg-white border border-emerald-100 shadow-md hover:shadow-emerald-200 rounded-2xl p-5 transition relative"
                >
                  <h2 className="text-xl font-semibold text-emerald-700">
                    {product.name}
                  </h2>
                  <p className="text-gray-700">{product.description}</p>
                  <div className="text-gray-600 mt-2">
                    <p>
                      <span className="font-medium">Price:</span> Rs{' '}
                      {parseFloat(product.price.toString()).toLocaleString()}
                    </p>
                    <p>
                      <span className="font-medium">Quantity:</span>{' '}
                      {item.quantity}
                    </p>
                    <p>
                      <span className="font-medium">Subtotal:</span> Rs{' '}
                      {subtotal.toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.cart_id)}
                    className="cursor_pointer absolute h-10 w-10 rounded-full cursor-pointer flex items-center justify-center bg-emerald-200 top-4 right-4 text-red-500 hover:text-red-700"
                  >
                    <MdDelete size={22} />
                  </button>
                </div>
              );
            })}

            <div className="flex items-center justify-between">
              <div></div>
              <div className="flex items-center gap-5">
                <div className="text-lg text-emerald-800 font-semibold mt-4">
                  Total: Rs {total.toLocaleString()}
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="px-8 py-4 inline-block rounded cursor-pointer bg-emerald-700 text-white"
                >
                  Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Address Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-2xl font-semibold text-emerald-700 mb-4">
              Enter Address
            </h2>
            <textarea
              value={address}
              onChange={e => setAddress(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Enter your delivery address..."
            ></textarea>
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="cursor-pointer px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleOrder}
                className="cursor-pointer px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Submit {loading && '...'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
