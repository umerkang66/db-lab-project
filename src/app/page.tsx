import Link from 'next/link';
import {
  FiShoppingBag,
  FiTruck,
  FiShield,
  FiCreditCard,
  FiStar,
  FiArrowRight,
  FiCheck,
  FiUsers,
  FiPackage,
  FiAward,
} from 'react-icons/fi';
import pool from '@/lib/db';

const features = [
  {
    icon: FiShoppingBag,
    title: 'Wide Selection',
    description:
      'Browse thousands of quality products across various categories.',
  },
  {
    icon: FiTruck,
    title: 'Fast Delivery',
    description:
      'Get your orders delivered quickly with our reliable shipping partners.',
  },
  {
    icon: FiShield,
    title: 'Secure Shopping',
    description: 'Shop with confidence knowing your data is protected.',
  },
  {
    icon: FiCreditCard,
    title: 'Easy Payments',
    description: 'Multiple payment options for your convenience.',
  },
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Verified Buyer',
    content:
      'Amazing shopping experience! The products are top quality and delivery was super fast.',
    rating: 5,
    avatar: 'SJ',
  },
  {
    name: 'Ahmed Khan',
    role: 'Regular Customer',
    content:
      'Best online store I have ever used. Great prices and excellent customer service.',
    rating: 5,
    avatar: 'AK',
  },
  {
    name: 'Maria Garcia',
    role: 'New Customer',
    content:
      'Love the user-friendly interface and the wide variety of products available.',
    rating: 5,
    avatar: 'MG',
  },
];

const stats = [
  { icon: FiUsers, value: '10K+', label: 'Happy Customers' },
  { icon: FiPackage, value: '5K+', label: 'Products' },
  { icon: FiTruck, value: '50K+', label: 'Deliveries' },
  { icon: FiAward, value: '99%', label: 'Satisfaction' },
];

export default async function LandingPage() {
  // Fetch featured products
  let featuredProducts: any[] = [];
  try {
    const res = await pool.query(
      'SELECT * FROM products ORDER BY created_at DESC LIMIT 4;'
    );
    featuredProducts = res.rows;
  } catch (error) {
    console.error('Error fetching products:', error);
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                <FiShoppingBag className="text-white text-xl" />
              </div>
              <span className="text-2xl font-bold text-white">ShopHub</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/shop"
                className="text-emerald-100 hover:text-white transition-colors font-medium"
              >
                Shop
              </Link>
              <Link
                href="/shop"
                className="text-emerald-100 hover:text-white transition-colors font-medium"
              >
                Categories
              </Link>
              <Link
                href="/shop"
                className="text-emerald-100 hover:text-white transition-colors font-medium"
              >
                Deals
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/auth/signin"
                className="text-emerald-100 hover:text-white transition-colors font-medium hidden sm:block"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-white text-emerald-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-emerald-50 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-pattern pt-20">
        {/* Animated Blobs */}
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fade-in">
              <FiStar className="text-yellow-500" />
              <span>Trusted by 10,000+ customers</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 animate-fade-in-delay-1">
              Shop Smarter,
              <br />
              <span className="gradient-text">Live Better</span>
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 animate-fade-in-delay-2">
              Discover a world of quality products at unbeatable prices. Your
              one-stop destination for everything you need.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-delay-3">
              <Link
                href="/shop"
                className="btn-primary flex items-center gap-2 text-lg px-8 py-4"
              >
                Start Shopping
                <FiArrowRight />
              </Link>
              <Link
                href="/shop"
                className="btn-secondary flex items-center gap-2 text-lg px-8 py-4"
              >
                Browse Categories
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg hover-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <stat.icon className="text-3xl text-emerald-500 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-gray-500 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave Decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Shop With Us?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We are committed to providing you with the best shopping
              experience possible.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 hover-card"
              >
                <div className="feature-icon mx-auto mb-6">
                  <feature.icon className="text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-white to-emerald-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-2">
                  Featured Products
                </h2>
                <p className="text-gray-600">Check out our latest arrivals</p>
              </div>
              <Link
                href="/shop"
                className="hidden sm:flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                View All
                <FiArrowRight />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <div
                  key={product.product_id}
                  className="bg-white rounded-2xl p-6 shadow-lg hover-card group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative mb-4">
                    <div className="aspect-square bg-gradient-to-br from-emerald-100 to-teal-50 rounded-xl flex items-center justify-center">
                      <FiPackage className="text-5xl text-emerald-300 group-hover:scale-110 transition-transform" />
                    </div>
                    {product.stock_quantity < 10 &&
                      product.stock_quantity > 0 && (
                        <span className="absolute top-3 right-3 badge badge-warning">
                          Low Stock
                        </span>
                      )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="price-tag">
                      <span className="price-tag-currency">Rs </span>
                      {parseFloat(product.price).toLocaleString()}
                    </div>
                    <Link
                      href="/shop"
                      className="w-10 h-10 bg-emerald-100 hover:bg-emerald-200 rounded-full flex items-center justify-center text-emerald-600 transition-colors"
                    >
                      <FiArrowRight />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10 sm:hidden">
              <Link
                href="/shop"
                className="btn-primary inline-flex items-center gap-2"
              >
                View All Products
                <FiArrowRight />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Shopping?
          </h2>
          <p className="text-emerald-100 text-xl max-w-2xl mx-auto mb-10">
            Join thousands of satisfied customers and discover amazing products
            at unbeatable prices.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/signup"
              className="bg-white text-emerald-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-50 transition-colors flex items-center gap-2"
            >
              Create Free Account
              <FiArrowRight />
            </Link>
            <Link
              href="/shop"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors"
            >
              Browse Products
            </Link>
          </div>

          <div className="flex items-center justify-center gap-8 mt-12 text-emerald-100">
            <div className="flex items-center gap-2">
              <FiCheck className="text-emerald-300" />
              <span>Free shipping over Rs 5,000</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCheck className="text-emerald-300" />
              <span>Easy returns</span>
            </div>
            <div className="flex items-center gap-2 hidden sm:flex">
              <FiCheck className="text-emerald-300" />
              <span>Secure payments</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Do not just take our word for it - hear from our satisfied
              customers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="testimonial-card shadow-lg hover-card"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiStar
                      key={i}
                      className="text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6">{testimonial.content}</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <Link href="/" className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                  <FiShoppingBag className="text-white text-xl" />
                </div>
                <span className="text-2xl font-bold text-white">ShopHub</span>
              </Link>
              <p className="text-gray-400 max-w-md">
                Your trusted destination for quality products and exceptional
                shopping experience.
              </p>
            </div>

            <div className="flex flex-wrap gap-6">
              <Link
                href="/shop"
                className="hover:text-emerald-400 transition-colors"
              >
                Shop
              </Link>
              <Link
                href="/auth/signin"
                className="hover:text-emerald-400 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="hover:text-emerald-400 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500">
              © 2025 ShopHub. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <FiCreditCard className="text-2xl text-gray-400" />
              <FiShield className="text-2xl text-gray-400" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
