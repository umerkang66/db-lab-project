'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { SignoutBtn } from './signout-btn';
import { CartBtn } from './cart-btn';
import { useState } from 'react';
import {
  FiShoppingBag,
  FiMenu,
  FiX,
  FiHome,
  FiPackage,
  FiShoppingCart,
  FiUser,
  FiSettings,
} from 'react-icons/fi';

export function Header() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-dark shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <FiShoppingBag className="text-white text-xl" />
            </div>
            <span className="text-2xl font-bold text-white hidden sm:block">
              ShopHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-emerald-100 hover:text-white hover:bg-white/10 transition-all font-medium"
            >
              <FiHome size={18} />
              <span>Home</span>
            </Link>
            <Link
              href="/shop"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-emerald-100 hover:text-white hover:bg-white/10 transition-all font-medium"
            >
              <FiPackage size={18} />
              <span>Shop</span>
            </Link>
            {session?.user && (
              <>
                {session.user.role === 'admin' ? (
                  <>
                    <Link
                      href="/orders"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-emerald-100 hover:text-white hover:bg-white/10 transition-all font-medium"
                    >
                      <FiShoppingCart size={18} />
                      <span>Orders</span>
                    </Link>
                    <Link
                      href="/products"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-emerald-100 hover:text-white hover:bg-white/10 transition-all font-medium"
                    >
                      <FiSettings size={18} />
                      <span>Products</span>
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/my-orders"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-emerald-100 hover:text-white hover:bg-white/10 transition-all font-medium"
                  >
                    <FiShoppingCart size={18} />
                    <span>My Orders</span>
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {!session?.user ? (
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 rounded-xl text-emerald-100 hover:text-white hover:bg-white/10 transition-all font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-5 py-2.5 rounded-xl bg-white text-emerald-700 font-semibold hover:bg-emerald-50 transition-all"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* User Info */}
                <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-white/10 rounded-xl">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                    <FiUser className="text-white text-sm" />
                  </div>
                  <span className="text-white font-medium">
                    {session.user.name || session.user.email?.split('@')[0]}
                  </span>
                  {session.user.role === 'admin' && (
                    <span className="px-2 py-0.5 bg-amber-400 text-amber-900 text-xs font-bold rounded-full">
                      Admin
                    </span>
                  )}
                </div>

                <CartBtn />
                <SignoutBtn />
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-white hover:bg-white/10 transition-all"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10 animate-fade-in">
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-white/10 transition-all"
              >
                <FiHome size={20} />
                <span>Home</span>
              </Link>
              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-white/10 transition-all"
              >
                <FiPackage size={20} />
                <span>Shop</span>
              </Link>
              {session?.user && (
                <>
                  {session.user.role === 'admin' ? (
                    <>
                      <Link
                        href="/orders"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-white/10 transition-all"
                      >
                        <FiShoppingCart size={20} />
                        <span>All Orders</span>
                      </Link>
                      <Link
                        href="/products"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-white/10 transition-all"
                      >
                        <FiSettings size={20} />
                        <span>Manage Products</span>
                      </Link>
                    </>
                  ) : (
                    <Link
                      href="/my-orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-white/10 transition-all"
                    >
                      <FiShoppingCart size={20} />
                      <span>My Orders</span>
                    </Link>
                  )}
                </>
              )}
              {!session?.user && (
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/10">
                  <Link
                    href="/auth/signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-xl text-center text-white hover:bg-white/10 transition-all"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-xl bg-white text-emerald-700 text-center font-semibold"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
