import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import pool from '@/lib/db';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user_id = session?.user.user_id;

  if (!user_id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { order_id, payment_method, amount } = await req.json();

  if (!order_id || !payment_method || isNaN(amount)) {
    return NextResponse.json(
      { error: 'Missing or invalid fields' },
      { status: 400 }
    );
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const paymentRes = await client.query(
      `
      INSERT INTO payments (order_id, payment_method, amount, status, paid_at)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING payment_id
      `,
      [order_id, payment_method, amount, 'paid', new Date()]
    );

    await client.query(
      `UPDATE orders SET status = 'paid' WHERE order_id = $1`,
      [order_id]
    );

    await client.query('COMMIT');

    return NextResponse.json(
      { success: true, payment_id: paymentRes.rows[0].payment_id },
      { status: 201 }
    );
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Payment error:', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  } finally {
    client.release();
  }
}
