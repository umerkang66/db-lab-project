'use client';

import { ProductCard } from '@/components/product-card';
import { Product } from '@/lib/types';
import { useEffect, useState } from 'react';
import { FiSearch, FiFilter, FiGrid, FiList, FiX } from 'react-icons/fi';
import { BiSort } from 'react-icons/bi';

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<
    'name' | 'price-low' | 'price-high' | 'newest'
  >('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [showFilters, setShowFilters] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data.products || []);
        setFilteredProducts(data.products || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = [...products];

    // Search filter
    if (searchQuery) {
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price filter
    result = result.filter(
      p =>
        parseFloat(p.price.toString()) >= priceRange[0] &&
        parseFloat(p.price.toString()) <= priceRange[1]
    );

    // Stock filter
    if (inStockOnly) {
      result = result.filter(p => p.stock_quantity > 0);
    }

    // Sorting
    switch (sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-low':
        result.sort(
          (a, b) =>
            parseFloat(a.price.toString()) - parseFloat(b.price.toString())
        );
        break;
      case 'price-high':
        result.sort(
          (a, b) =>
            parseFloat(b.price.toString()) - parseFloat(a.price.toString())
        );
        break;
      case 'newest':
        result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
    }

    setFilteredProducts(result);
  }, [products, searchQuery, sortBy, priceRange, inStockOnly]);

  const clearFilters = () => {
    setSearchQuery('');
    setSortBy('newest');
    setPriceRange([0, 100000]);
    setInStockOnly(false);
  };

  const hasActiveFilters =
    searchQuery ||
    sortBy !== 'newest' ||
    priceRange[0] > 0 ||
    priceRange[1] < 100000 ||
    inStockOnly;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded-lg w-64 mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-white rounded-2xl p-6 h-72">
                <div className="h-32 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
            Browse Our Products
          </h1>
          <p className="text-emerald-100 text-lg mb-8 animate-fade-in-delay-1">
            Discover amazing products at unbeatable prices
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl animate-fade-in-delay-2">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full py-4 pl-12 pr-4 rounded-2xl text-gray-800 bg-white shadow-lg focus:outline-none focus:ring-4 focus:ring-emerald-300 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX size={20} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                showFilters
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FiFilter />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white shadow-sm text-emerald-600'
                    : 'text-gray-500'
                }`}
              >
                <FiGrid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-white shadow-sm text-emerald-600'
                    : 'text-gray-500'
                }`}
              >
                <FiList size={20} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-500 text-sm">
              {filteredProducts.length} product
              {filteredProducts.length !== 1 && 's'}
            </span>

            <div className="flex items-center gap-2">
              <BiSort className="text-gray-500" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as typeof sortBy)}
                className="bg-gray-100 rounded-xl px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="newest">Newest First</option>
                <option value="name">Name A-Z</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm animate-fade-in">
            <div className="flex flex-wrap gap-8">
              <div className="flex-1 min-w-[200px]">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Price Range
                </h3>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange[0] || ''}
                    onChange={e =>
                      setPriceRange([
                        Number(e.target.value) || 0,
                        priceRange[1],
                      ])
                    }
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                  />
                  <span className="text-gray-400">to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange[1] === 100000 ? '' : priceRange[1]}
                    onChange={e =>
                      setPriceRange([
                        priceRange[0],
                        Number(e.target.value) || 100000,
                      ])
                    }
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex-1 min-w-[200px]">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Availability
                </h3>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={e => setInStockOnly(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-gray-700">In Stock Only</span>
                </label>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={clearFilters}
                  className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2"
                >
                  <FiX />
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiSearch className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No products found
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search or filters
            </p>
            <button onClick={clearFilters} className="btn-primary">
              Clear Filters
            </button>
          </div>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'flex flex-col gap-4'
            }
          >
            {filteredProducts.map((product, index) => (
              <div
                key={product.product_id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <ProductCard product={product} viewMode={viewMode} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
