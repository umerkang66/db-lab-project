'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { FiSearch, FiX, FiCopy, FiCreditCard } from 'react-icons/fi';
import { ImSpinner2 } from 'react-icons/im';
import toast from 'react-hot-toast';

export function AdminOrdersSearch({ initialQuery }: { initialQuery: string }) {
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
      router.push(`/orders?${params.toString()}`);
    });
  };

  const clearSearch = () => {
    setQuery('');
    startTransition(() => {
      router.push('/orders');
    });
  };

  return (
    <div className="relative max-w-md">
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

export function CopyOrderId({ orderId }: { orderId: string }) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(orderId);
    toast.success('Order ID copied to clipboard!');
  };

  return (
    <button
      onClick={copyToClipboard}
      className="text-gray-500 hover:text-emerald-600 flex items-center gap-1 transition-colors font-normal text-base"
      title="Click to copy full Order ID"
    >
      #{orderId.slice(0, 8)}...
      <FiCopy className="text-sm" />
    </button>
  );
}

export function MarkAsPaidButton({
  orderId,
  total,
}: {
  orderId: string;
  total: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleMarkAsPaid = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          payment_method: 'cash',
          amount: total,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        toast.error(data.error || 'Failed to mark as paid');
        return;
      }

      toast.success('Order marked as paid!');
      router.refresh();
    } catch (err) {
      toast.dismiss();
      toast.error('Something went wrong!');
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleMarkAsPaid}
      disabled={loading}
      className="btn-primary flex items-center gap-2 disabled:opacity-50"
    >
      {loading ? (
        <>
          <ImSpinner2 className="animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <FiCreditCard />
          Mark as Paid
        </>
      )}
    </button>
  );
}
