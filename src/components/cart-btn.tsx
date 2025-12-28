'use client';

import { useCart } from '@/contexts/cart-context';
import Link from 'next/link';
import { FiShoppingCart } from 'react-icons/fi';

export function CartBtn() {
  const { cartCount } = useCart();

  return (
    <Link
      href="/cart"
      className="relative p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all group"
    >
      <FiShoppingCart className="text-white text-xl group-hover:scale-110 transition-transform" />

      {cartCount > 0 && (
        <span className="notification-dot">
          {cartCount > 9 ? '9+' : cartCount}
        </span>
      )}
    </Link>
  );
}
