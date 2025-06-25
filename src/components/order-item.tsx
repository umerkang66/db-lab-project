'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

function OrderItem({ order, orderItemsMap }: any) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const items = orderItemsMap[order.order_id] || [];

  const total = items.reduce((sum: number, item: any) => {
    const price = parseFloat(item.product.price);
    return sum + price * item.quantity;
  }, 0);

  const handlePay = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: order.order_id,
          payment_method: 'card', // or 'cash', 'easypaisa', etc.
          amount: total,
        }),
      });

      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        toast.error(data.error || 'Payment failed');
        return;
      }

      toast.success('Payment successful!');
      router.refresh();
    } catch (err) {
      toast.dismiss();
      toast.error('Something went wrong!');
      console.error(err);
    }
  };

  return (
    <div
      key={order.order_id}
      className="bg-white border border-emerald-100 shadow-md hover:shadow-emerald-200 rounded-2xl p-6 transition"
    >
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-emerald-700">
          Order #{order.order_id}
        </h2>
        <p className="text-gray-600">
          <span className="font-medium">Status:</span> {order.status}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Address:</span> {order.address}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Placed On:</span>{' '}
          {new Date(order.created_at).toDateString()}
        </p>
      </div>

      <div className="space-y-4">
        {items.map((item: any) => {
          const { product } = item;
          const subtotal = parseFloat(product.price) * item.quantity;

          return (
            <div
              key={item.product_id}
              className="border border-emerald-50 rounded-lg p-4 bg-emerald-50"
            >
              <h3 className="text-lg font-semibold text-emerald-800">
                {product.name}
              </h3>
              <p className="text-gray-700">{product.description}</p>
              <div className="text-sm text-gray-600 mt-1">
                <p>
                  <span className="font-medium">Price:</span> Rs{' '}
                  {parseFloat(product.price).toLocaleString()}
                </p>
                <p>
                  <span className="font-medium">Quantity:</span> {item.quantity}
                </p>
                <p>
                  <span className="font-medium">Subtotal:</span> Rs{' '}
                  {subtotal.toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="text-right mt-6 text-lg text-emerald-800 font-semibold">
        Total Amount: Rs {total.toLocaleString()}
      </div>

      {/* Pay button (only if status is unpaid) */}
      {order.status === 'unpaid' && (
        <div className="text-right mt-4">
          <button
            onClick={handlePay}
            className="cursor-pointer px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition"
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      )}
    </div>
  );
}

export default OrderItem;
