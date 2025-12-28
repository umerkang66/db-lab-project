// app/my-orders/page.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import pool from '@/lib/db';
import { authOptions } from '@/lib/auth-options';
import OrderItem from '@/components/order-item';
import Link from 'next/link';
import {
  FiShoppingCart,
  FiArrowRight,
  FiPackage,
  FiCheck,
  FiClock,
} from 'react-icons/fi';
import { MyOrdersSearch } from './search';

export default async function MyOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await getServerSession(authOptions);
  const user_id = session?.user.user_id;

  if (!user_id) {
    redirect('/auth/signin');
  }

  const params = await searchParams;
  const searchQuery = params.q || '';

  let ordersRes;
  if (searchQuery) {
    ordersRes = await pool.query(
      `SELECT * FROM orders WHERE user_id = $1 AND order_id::text ILIKE $2 ORDER BY created_at DESC`,
      [user_id, `%${searchQuery}%`]
    );
  } else {
    ordersRes = await pool.query(
      `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
      [user_id]
    );
  }

  const orders = ordersRes.rows;

  const orderIds = orders.map(order => order.order_id);
  let orderItemsMap: Record<string, any[]> = {};

  if (orderIds.length > 0) {
    const itemsRes = await pool.query(
      `
      SELECT 
        oi.order_id,
        oi.product_id,
        oi.quantity,
        p.name,
        p.description,
        p.price
      FROM order_items oi
      JOIN products p ON oi.product_id = p.product_id
      WHERE oi.order_id = ANY($1)
      `,
      [orderIds]
    );

    // Group items by order
    for (const row of itemsRes.rows) {
      if (!orderItemsMap[row.order_id]) {
        orderItemsMap[row.order_id] = [];
      }

      orderItemsMap[row.order_id].push({
        product_id: row.product_id,
        quantity: row.quantity,
        product: {
          name: row.name,
          description: row.description,
          price: row.price,
        },
      });
    }
  }

  // Stats calculation
  const totalOrders = orders.length;
  const paidOrders = orders.filter(o => o.status === 'paid').length;
  const unpaidOrders = orders.filter(o => o.status === 'unpaid').length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <FiPackage className="text-emerald-200" />
            My Orders
          </h1>
          <p className="text-emerald-100 mt-2">Track and manage your orders</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-6">
          <MyOrdersSearch initialQuery={searchQuery} />
        </div>

        {/* Stats Cards */}
        {orders.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FiShoppingCart className="text-2xl text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {totalOrders}
                  </div>
                  <div className="text-gray-500 text-sm">Total Orders</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <FiCheck className="text-2xl text-emerald-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {paidOrders}
                  </div>
                  <div className="text-gray-500 text-sm">Paid Orders</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <FiClock className="text-2xl text-amber-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {unpaidOrders}
                  </div>
                  <div className="text-gray-500 text-sm">Pending Payment</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiPackage className="text-5xl text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              No orders yet
            </h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              You have not placed any orders yet. Start shopping to see your
              orders here!
            </p>
            <Link
              href="/shop"
              className="btn-primary inline-flex items-center gap-2"
            >
              Start Shopping
              <FiArrowRight />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <div
                key={order.order_id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <OrderItem orderItemsMap={orderItemsMap} order={order} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
