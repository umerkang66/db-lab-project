// app/admin/orders/page.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import pool from '@/lib/db';
import { authOptions } from '@/lib/auth-options';
import { Header } from '@/components/header';
import {
  FiShoppingCart,
  FiDollarSign,
  FiPackage,
  FiMapPin,
  FiCalendar,
  FiUser,
  FiCheck,
  FiClock,
} from 'react-icons/fi';
import { AdminOrdersSearch, CopyOrderId, MarkAsPaidButton } from './client';

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  // Only allow access to admins
  if (!user || user.role !== 'admin') {
    redirect('/auth/signin');
  }

  const params = await searchParams;
  const searchQuery = params.q || '';

  // Fetch all orders + user info
  let ordersRes;
  if (searchQuery) {
    ordersRes = await pool.query(
      `
      SELECT o.*, u.name AS user_name, u.email AS user_email
      FROM orders o
      JOIN users u ON o.user_id = u.user_id
      WHERE o.order_id::text ILIKE $1
      ORDER BY o.created_at DESC
      `,
      [`%${searchQuery}%`]
    );
  } else {
    ordersRes = await pool.query(
      `
      SELECT o.*, u.name AS user_name, u.email AS user_email
      FROM orders o
      JOIN users u ON o.user_id = u.user_id
      ORDER BY o.created_at DESC
      `
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
  const totalRevenue = orders
    .filter(o => o.status === 'paid')
    .reduce((sum, order) => {
      const items = orderItemsMap[order.order_id] || [];
      return (
        sum +
        items.reduce((itemSum: number, item: any) => {
          return itemSum + parseFloat(item.product.price) * item.quantity;
        }, 0)
      );
    }, 0);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        {/* Hero */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-10 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <FiShoppingCart className="text-emerald-200" />
              Order Management
            </h1>
            <p className="text-emerald-100 mt-2">
              Monitor and manage all customer orders
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Search */}
          <div className="mb-6">
            <AdminOrdersSearch initialQuery={searchQuery} />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <FiDollarSign className="text-2xl text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    Rs {(totalRevenue / 1000).toFixed(0)}K
                  </div>
                  <div className="text-gray-500 text-sm">Total Revenue</div>
                </div>
              </div>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiShoppingCart className="text-5xl text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                No orders yet
              </h2>
              <p className="text-gray-500">
                Orders will appear here when customers place them.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, index) => {
                const items = orderItemsMap[order.order_id] || [];
                const total = items.reduce((sum: number, item: any) => {
                  const price = parseFloat(item.product.price);
                  return sum + price * item.quantity;
                }, 0);
                const isPaid = order.status === 'paid';

                return (
                  <div
                    key={order.order_id}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {/* Order Header */}
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              isPaid ? 'bg-emerald-100' : 'bg-amber-100'
                            }`}
                          >
                            {isPaid ? (
                              <FiCheck className="text-2xl text-emerald-600" />
                            ) : (
                              <FiClock className="text-2xl text-amber-600" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                Order <CopyOrderId orderId={order.order_id} />
                              </h2>
                              <span
                                className={`badge ${
                                  isPaid ? 'badge-success' : 'badge-warning'
                                }`}
                              >
                                {isPaid ? 'Paid' : 'Unpaid'}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <FiUser className="text-emerald-500" />
                                {order.user_name}
                              </span>
                              <span className="text-gray-300">•</span>
                              <span>{order.user_email}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-emerald-600">
                            Rs {total.toLocaleString()}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {items.length} item{items.length !== 1 && 's'}
                          </div>
                        </div>
                      </div>

                      {/* Order Meta */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <FiMapPin className="text-emerald-500" />
                          <span className="truncate max-w-[300px]">
                            {order.address}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiCalendar className="text-emerald-500" />
                          <span>
                            {new Date(order.created_at).toLocaleDateString(
                              'en-US',
                              {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="border-t border-gray-100 p-6 bg-gray-50">
                      <h3 className="font-semibold text-gray-700 mb-4">
                        Order Items
                      </h3>
                      <div className="grid gap-3">
                        {items.map((item: any) => {
                          const { product } = item;
                          const subtotal =
                            parseFloat(product.price) * item.quantity;

                          return (
                            <div
                              key={item.product_id}
                              className="flex items-center gap-4 p-4 bg-white rounded-xl"
                            >
                              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FiPackage className="text-xl text-emerald-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 truncate">
                                  {product.name}
                                </h4>
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
                    </div>

                    {/* Admin Action - Mark as Paid */}
                    {!isPaid && (
                      <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-t border-emerald-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-amber-700">
                            <FiClock />
                            <span className="font-medium">
                              Awaiting payment (Cash on Delivery)
                            </span>
                          </div>
                          <MarkAsPaidButton
                            orderId={order.order_id}
                            total={total}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
