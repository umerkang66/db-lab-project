'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ImSpinner2 } from 'react-icons/im';
import {
  FiEdit2,
  FiTrash2,
  FiPackage,
  FiPlus,
  FiX,
  FiSearch,
  FiDollarSign,
  FiBox,
} from 'react-icons/fi';
import { Product } from '@/lib/types';
import Link from 'next/link';
import { Header } from '@/components/header';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const json = await res.json();
      setProducts(json.products || []);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    setDeleteLoading(id);
    const res = await fetch(`/api/products`, {
      method: 'DELETE',
      body: JSON.stringify({ product_id: id }),
    });
    if (res.ok) {
      toast.success('Product deleted successfully');
      await fetchProducts();
    } else {
      toast.error('Failed to delete product');
    }
    setDeleteLoading(null);
  };

  const handleUpdate = async () => {
    if (!selectedProduct) return;
    setUpdateLoading(true);
    const res = await fetch(`/api/products`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedProduct),
    });

    if (res.ok) {
      toast.success('Product updated successfully');
      setShowModal(false);
      await fetchProducts();
    } else {
      toast.error('Failed to update product');
    }
    setUpdateLoading(false);
  };

  const filteredProducts = products.filter(
    p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats
  const totalProducts = products.length;
  const totalStock = products.reduce((acc, p) => acc + p.stock_quantity, 0);
  const totalValue = products.reduce(
    (acc, p) => acc + parseFloat(p.price.toString()) * p.stock_quantity,
    0
  );
  const lowStockCount = products.filter(
    p => p.stock_quantity < 10 && p.stock_quantity > 0
  ).length;

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded-lg w-64 mb-8"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white rounded-2xl p-6 h-48"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        {/* Hero */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-10 px-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-3">
                <FiPackage className="text-emerald-200" />
                Product Management
              </h1>
              <p className="text-emerald-100 mt-2">
                Manage your product inventory
              </p>
            </div>
            <Link
              href="/new"
              className="inline-flex items-center gap-2 bg-white text-emerald-700 px-6 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-colors"
            >
              <FiPlus />
              Add Product
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FiPackage className="text-2xl text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {totalProducts}
                  </div>
                  <div className="text-gray-500 text-sm">Total Products</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <FiBox className="text-2xl text-emerald-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {totalStock.toLocaleString()}
                  </div>
                  <div className="text-gray-500 text-sm">Total Stock</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <FiDollarSign className="text-2xl text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    Rs {(totalValue / 1000).toFixed(0)}K
                  </div>
                  <div className="text-gray-500 text-sm">Inventory Value</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {lowStockCount}
                  </div>
                  <div className="text-gray-500 text-sm">Low Stock Items</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-8">
            <div className="relative max-w-md">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="input-modern pl-11"
              />
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiPackage className="text-4xl text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No products found
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery
                  ? 'Try adjusting your search'
                  : 'Start by adding your first product'}
              </p>
              <Link
                href="/new"
                className="btn-primary inline-flex items-center gap-2"
              >
                <FiPlus />
                Add Product
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.product_id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden group animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center">
                    <FiPackage className="text-5xl text-emerald-300 group-hover:scale-110 transition-transform" />

                    {/* Stock Badge */}
                    {product.stock_quantity === 0 ? (
                      <span className="absolute top-3 left-3 badge badge-danger">
                        Out of Stock
                      </span>
                    ) : product.stock_quantity < 10 ? (
                      <span className="absolute top-3 left-3 badge badge-warning">
                        Low Stock
                      </span>
                    ) : null}

                    {/* Actions */}
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowModal(true);
                        }}
                        className="p-2 bg-white rounded-lg shadow-md text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.product_id)}
                        disabled={deleteLoading === product.product_id}
                        className="p-2 bg-white rounded-lg shadow-md text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        {deleteLoading === product.product_id ? (
                          <ImSpinner2 className="animate-spin" size={18} />
                        ) : (
                          <FiTrash2 size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-xl font-bold text-emerald-600">
                        Rs{' '}
                        {parseFloat(product.price.toString()).toLocaleString()}
                      </div>
                      <div
                        className={`text-sm font-medium ${
                          product.stock_quantity === 0
                            ? 'text-red-600'
                            : product.stock_quantity < 10
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {product.stock_quantity} in stock
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {showModal && selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
            <div
              className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-scale-in"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FiEdit2 className="text-blue-600" />
                    </div>
                    Edit Product
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
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name
                  </label>
                  <input
                    className="input-modern"
                    placeholder="Product name"
                    value={selectedProduct.name}
                    onChange={e =>
                      setSelectedProduct({
                        ...selectedProduct,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    className="input-modern resize-none h-24"
                    placeholder="Product description"
                    value={selectedProduct.description}
                    onChange={e =>
                      setSelectedProduct({
                        ...selectedProduct,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (Rs)
                    </label>
                    <input
                      type="number"
                      className="input-modern"
                      placeholder="0.00"
                      value={selectedProduct.price}
                      onChange={e =>
                        setSelectedProduct({
                          ...selectedProduct,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      className="input-modern"
                      placeholder="0"
                      value={selectedProduct.stock_quantity}
                      onChange={e =>
                        setSelectedProduct({
                          ...selectedProduct,
                          stock_quantity: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-100 flex gap-3">
                <button
                  className="flex-1 btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                  onClick={handleUpdate}
                  disabled={updateLoading}
                >
                  {updateLoading ? (
                    <>
                      <ImSpinner2 className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Product'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
