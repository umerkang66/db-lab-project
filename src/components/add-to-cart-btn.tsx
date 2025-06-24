'use client';

import { CiShoppingCart } from 'react-icons/ci';

export function AddToCartButton({ product_id }: { product_id: string }) {
  return (
    <button className="cursor-pointer rounded-full bg-emerald-200 p-2 transition hover:bg-emerald-300 active:bg-emerald-400">
      <CiShoppingCart size={24} />
    </button>
  );
}
