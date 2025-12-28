'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { ImSpinner2 } from 'react-icons/im';

export function MyOrdersSearch({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (value: string) => {
    setQuery(value);
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set('q', value);
      } else {
        params.delete('q');
      }
      router.push(`/my-orders?${params.toString()}`);
    });
  };

  const clearSearch = () => {
    setQuery('');
    startTransition(() => {
      router.push('/my-orders');
    });
  };

  return (
    <div className="relative">
      <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={query}
        onChange={e => handleSearch(e.target.value)}
        placeholder="Search by Order ID..."
        className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
      />
      {isPending ? (
        <ImSpinner2 className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" />
      ) : query ? (
        <button
          onClick={clearSearch}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <FiX />
        </button>
      ) : null}
    </div>
  );
}
