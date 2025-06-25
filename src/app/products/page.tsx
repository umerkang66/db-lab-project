'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ImSpinner2 } from 'react-icons/im';
import { MdEdit, MdDelete } from 'react-icons/md';
import { Product } from '@/lib/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const json = await res.json();
    setProducts(json.products);
  };

  const handleDelete = async (id: string) => {
    setDeleteLoading(true);
    const res = await fetch(`/api/products`, {
      method: 'DELETE',
      body: JSON.stringify({ product_id: id }),
    });
    if (res.ok) {
      toast.success('Product deleted');
      await fetchProducts();
    } else {
      toast.error('Failed to delete');
    }
    setDeleteLoading(false);
  };

  const handleUpdate = async () => {
    if (!selectedProduct) return;
    setLoading(true);
    const res = await fetch(`/api/products`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedProduct),
    });

    if (res.ok) {
      toast.success('Product updated');
      setShowModal(false);
      await fetchProducts();
    } else {
      toast.error('Update failed');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-emerald-700 mb-6">
        Admin - Manage Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map(product => (
          <div
            key={product.product_id}
            className="bg-white rounded-2xl shadow-xl p-6 border border-emerald-100 hover:shadow-emerald-200 transition relative"
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
              <span className="font-medium">Stock:</span>{' '}
              {product.stock_quantity}
            </p>

            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => {
                  setSelectedProduct(product);
                  setShowModal(true);
                }}
                className="cursor-pointer transition text-blue-400 hover:text-blue-600"
              >
                <MdEdit size={22} />
              </button>
              {deleteLoading ? (
                '..'
              ) : (
                <button
                  onClick={() => handleDelete(product.product_id)}
                  className="cursor-pointer transition text-red-500 hover:text-red-700"
                >
                  <MdDelete size={22} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg">
            <h2 className="text-xl font-bold text-emerald-700 mb-4">
              Edit Product
            </h2>
            <div className="space-y-3">
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Name"
                value={selectedProduct.name}
                onChange={e =>
                  setSelectedProduct({
                    ...selectedProduct,
                    name: e.target.value,
                  })
                }
              />
              <textarea
                className="w-full border rounded px-3 py-2"
                placeholder="Description"
                value={selectedProduct.description}
                onChange={e =>
                  setSelectedProduct({
                    ...selectedProduct,
                    description: e.target.value,
                  })
                }
              />
              <input
                type="number"
                className="w-full border rounded px-3 py-2"
                placeholder="Price"
                value={selectedProduct.price}
                onChange={e =>
                  setSelectedProduct({
                    ...selectedProduct,
                    price: parseFloat(e.target.value),
                  })
                }
              />
              <input
                type="number"
                className="w-full border rounded px-3 py-2"
                placeholder="Stock Quantity"
                value={selectedProduct.stock_quantity}
                onChange={e =>
                  setSelectedProduct({
                    ...selectedProduct,
                    stock_quantity: parseInt(e.target.value),
                  })
                }
              />
              <div className="flex justify-end gap-3">
                <button
                  className="cursor-pointer px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="cursor-pointer px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={handleUpdate}
                  disabled={loading}
                >
                  {loading ? <ImSpinner2 className="animate-spin" /> : 'Update'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
