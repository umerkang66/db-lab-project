'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  FiPackage,
  FiMapPin,
  FiCalendar,
  FiCheck,
  FiClock,
  FiChevronDown,
  FiChevronUp,
  FiCopy,
} from 'react-icons/fi';

function OrderItem({ order, orderItemsMap }: any) {
  const [expanded, setExpanded] = useState(false);

  const items = orderItemsMap[order.order_id] || [];

  const total = items.reduce((sum: number, item: any) => {
    const price = parseFloat(item.product.price);
    return sum + price * item.quantity;
  }, 0);

  const copyOrderId = () => {
    navigator.clipboard.writeText(order.order_id);
    toast.success('Order ID copied to clipboard!');
  };

  const isPaid = order.status === 'paid';

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden">
      {/* Order Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span
                className={`badge ${
                  isPaid ? 'badge-success' : 'badge-warning'
                }`}
              >
                {isPaid ? (
                  <>
                    <FiCheck className="mr-1" /> Paid
                  </>
                ) : (
                  <>
                    <FiClock className="mr-1" /> Unpaid
                  </>
                )}
              </span>
              <button
                onClick={copyOrderId}
                className="text-gray-400 text-sm hover:text-emerald-600 flex items-center gap-1 transition-colors"
                title="Click to copy full Order ID"
              >
                #{order.order_id.slice(0, 8)}...
                <FiCopy className="text-xs" />
              </button>
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {items.length} item{items.length !== 1 && 's'}
            </h2>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-emerald-600">
              Rs {total.toLocaleString()}
            </div>
            <div className="text-gray-400 text-sm">Total Amount</div>
          </div>
        </div>

        {/* Order Meta */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <FiMapPin className="text-emerald-500" />
            <span className="truncate max-w-[200px]">{order.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiCalendar className="text-emerald-500" />
            <span>
              {new Date(order.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Expandable Items Section */}
      <div className="border-t border-gray-100">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full px-6 py-3 flex items-center justify-between text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <span className="font-medium">Order Items ({items.length})</span>
          {expanded ? <FiChevronUp /> : <FiChevronDown />}
        </button>

        {expanded && (
          <div className="px-6 pb-4 space-y-3 animate-fade-in">
            {items.map((item: any) => {
              const { product } = item;
              const subtotal = parseFloat(product.price) * item.quantity;

              return (
                <div
                  key={item.product_id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FiPackage className="text-2xl text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {product.name}
                    </h3>
                    <p className="text-gray-500 text-sm truncate">
                      {product.description}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-semibold text-gray-900">
                      Rs {subtotal.toLocaleString()}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {item.quantity} × Rs{' '}
                      {parseFloat(product.price).toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Payment Pending Notice */}
      {!isPaid && (
        <div className="px-6 py-4 bg-gradient-to-r from-amber-50 to-orange-50 border-t border-amber-100">
          <div className="flex items-center gap-2 text-amber-700">
            <FiClock />
            <span className="font-medium">
              Payment pending - Pay on delivery
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderItem;
