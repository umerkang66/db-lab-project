'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
      setTimeout(() => router.push('/'), 1500);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-semibold text-emerald-700 mb-6 text-center">
        Create New Product
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-emerald-700 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 mb-1">Product Name</label>
          <input
            type="text"
            value={name}
            required
            onChange={e => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            required
            onChange={e => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          ></textarea>
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Price (Rs.)</label>
          <input
            type="number"
            step="0.01"
            value={price}
            required
            onChange={e => setPrice(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Stock Quantity</label>
          <input
            type="number"
            value={stockQuantity}
            required
            onChange={e => setStockQuantity(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        <button
          type="submit"
          className="cursor-pointer w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-semibold transition"
        >
          {loading ? 'Creating...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
}
