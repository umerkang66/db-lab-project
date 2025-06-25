// app/my-orders/page.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import pool from '@/lib/db';
import { authOptions } from '@/lib/auth-options';
import OrderItem from '@/components/order-item';

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
            <OrderItem
              key={order.order_id}
              orderItemsMap={orderItemsMap}
              order={order}
            />
          ))}
        </div>
      )}
    </div>
  );
}
