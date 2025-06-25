'use client';

import { useCart } from '@/contexts/cart-context';
import Link from 'next/link';
import { CiShoppingCart } from 'react-icons/ci';

export function CartBtn() {
  const { cartCount } = useCart();

  return (
    <Link
      href="/cart"
      className="relative mr-4 cursor-pointer rounded-full bg-emerald-800 p-3 transition hover:bg-emerald-600 active:bg-emerald-400"
    >
      <CiShoppingCart size={28} />

      {cartCount > 0 && (
        <span className="flex items-center justify-center absolute top-9 left-9 rounded-full bg-green-200 text-xs w-6 h-6 text-black p-1">
          {cartCount}
        </span>
      )}
    </Link>
  );
}
