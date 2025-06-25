// app/my-orders/page.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import pool from '@/lib/db';
import { authOptions } from '@/lib/auth-options';

export default async function MyOrdersPage() {
  const session = await getServerSession(authOptions);
  const user_id = session?.user.user_id;

  if (!user_id) {
    redirect('/login');
  }

  const ordersRes = await pool.query(
    `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
    [user_id]
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-emerald-700 mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-600">You have not placed any orders yet.</p>
      ) : (
        <div className="space-y-8">
          {orders.map(order => (
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
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>

              <div className="space-y-4">
                {(orderItemsMap[order.order_id] || []).map(item => {
                  const { product } = item;
                  const subtotal =
                    parseFloat(product.price.toString()) * item.quantity;

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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
