// app/admin/orders/page.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import pool from '@/lib/db';
import { authOptions } from '@/lib/auth-options';

export default async function AdminOrdersPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  // Only allow access to admins
  if (!user || user.role !== 'admin') {
    redirect('/auth/signin');
  }

  // Fetch all orders + user info
  const ordersRes = await pool.query(
    `
    SELECT o.*, u.name AS user_name, u.email AS user_email
    FROM orders o
    JOIN users u ON o.user_id = u.user_id
    ORDER BY o.created_at DESC
    `
  );

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

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-emerald-700 mb-6">
        Admin - All Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <div className="space-y-8">
          {orders.map(order => {
            const items = orderItemsMap[order.order_id] || [];

            const total = items.reduce((sum: number, item: any) => {
              const price = parseFloat(item.product.price);
              return sum + price * item.quantity;
            }, 0);

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
                    <span className="font-medium">Address:</span>{' '}
                    {order.address}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Placed On:</span>{' '}
                    {new Date(order.created_at).toDateString()}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Ordered By:</span>{' '}
                    {order.user_name} ({order.user_email})
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
                            <span className="font-medium">Quantity:</span>{' '}
                            {item.quantity}
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

                <div className="text-right mt-6 text-lg text-emerald-800 font-semibold">
                  Total Amount: Rs {total.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
