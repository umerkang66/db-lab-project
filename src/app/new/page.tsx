'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FiPackage,
  FiArrowLeft,
  FiCheck,
  FiDollarSign,
  FiBox,
  FiFileText,
} from 'react-icons/fi';
import { ImSpinner2 } from 'react-icons/im';
import { Header } from '@/components/header';

export default function CreateProductPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        description,
        price: parseFloat(price),
        stock_quantity: parseInt(stockQuantity),
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || 'Failed to create product');
      setSuccess('');
    } else {
      setSuccess('Product created successfully!');
      setError('');
      setName('');
      setDescription('');
      setPrice('');
      setStockQuantity('');
      setTimeout(() => router.push('/products'), 1500);
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12 px-4">
        {/* Background Decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="blob blob-1 opacity-30"></div>
          <div className="blob blob-2 opacity-30"></div>
        </div>

        <div className="relative max-w-lg mx-auto">
          {/* Back Link */}
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-8 transition-colors"
          >
            <FiArrowLeft />
            Back to Products
          </Link>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8 animate-fade-in">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiPackage className="text-white text-2xl" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Add New Product
              </h1>
              <p className="text-gray-500 mt-1">
                Fill in the details to add a new product
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 animate-fade-in">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-red-500">!</span>
                </div>
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center gap-3 animate-fade-in">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiCheck className="text-emerald-500" />
                </div>
                <span>{success}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name
                </label>
                <div className="relative">
                  <FiPackage className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    required
                    onChange={e => setName(e.target.value)}
                    className="input-modern pl-11"
                    placeholder="e.g., Premium Headphones"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <div className="relative">
                  <FiFileText className="absolute left-4 top-4 text-gray-400" />
                  <textarea
                    value={description}
                    required
                    onChange={e => setDescription(e.target.value)}
                    className="input-modern pl-11 resize-none h-24"
                    placeholder="Describe your product..."
                  ></textarea>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (Rs)
                  </label>
                  <div className="relative">
                    <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={price}
                      required
                      onChange={e => setPrice(e.target.value)}
                      className="input-modern pl-11"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity
                  </label>
                  <div className="relative">
                    <FiBox className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      min="0"
                      value={stockQuantity}
                      required
                      onChange={e => setStockQuantity(e.target.value)}
                      className="input-modern pl-11"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center gap-2 py-4 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <ImSpinner2 className="animate-spin" />
                    Creating Product...
                  </>
                ) : (
                  <>
                    <FiPackage />
                    Create Product
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Tips */}
          <div className="mt-8 bg-white/50 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-700 mb-3">
              💡 Tips for a great product listing
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">✓</span>
                Use clear, descriptive product names
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">✓</span>
                Include key features in the description
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">✓</span>
                Set competitive pricing based on market research
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">✓</span>
                Keep stock levels updated to avoid overselling
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
