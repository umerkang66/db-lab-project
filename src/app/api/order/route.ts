import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import pool from '@/lib/db';
import { authOptions } from '@/lib/auth-options';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user_id = session?.user.user_id;

  if (!user_id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { address, status, items } = await req.json(); // items: [{ product_id, quantity }]

  if (!address || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Insert into orders table (now using raw address)
    const orderRes = await client.query(
      `
      INSERT INTO orders (user_id, address, status)
      VALUES ($1, $2, $3)
      RETURNING order_id
      `,
      [user_id, address, status]
    );

    const order_id = orderRes.rows[0].order_id;

    // Insert each item
    for (const item of items) {
      await client.query(
        `
        INSERT INTO order_items (order_id, product_id, quantity)
        VALUES ($1, $2, $3)
        `,
        [order_id, item.product_id, item.quantity]
      );
    }

    for (const item of items) {
      await pool.query(
        'DELETE FROM cart WHERE user_id = $1 AND product_id = $2 RETURNING *',
        [user_id, item.product_id]
      );
    }

    await client.query('COMMIT');

    return NextResponse.json({ success: true, order_id }, { status: 201 });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('DB error:', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  } finally {
    client.release();
  }
}
