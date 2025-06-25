import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user_id = session?.user.user_id;

  try {
    const response = await pool.query('SELECT * FROM cart WHERE user_id = $1', [
      user_id,
    ]);

    return NextResponse.json({ cart: response.rows }, { status: 200 });
  } catch (err) {
    console.error('DB error:', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user_id = session?.user.user_id;
  const { product_id, quantity } = await req.json();

  try {
    const res = await pool.query(
      'SELECT * FROM cart WHERE user_id = $1 AND product_id = $2',
      [user_id, product_id]
    );

    if (res.rows.length > 0) {
      // Item already exists in cart, update quantity
      const existingItem = res.rows[0];
      const newQuantity = existingItem.quantity + quantity;

      const updateResponse = await pool.query(
        'UPDATE cart SET quantity = $1 WHERE user_id = $2 AND product_id = $3 RETURNING *',
        [newQuantity, user_id, product_id]
      );

      return NextResponse.json(
        { item: updateResponse.rows[0] },
        { status: 200 }
      );
    }

    const response = await pool.query(
      'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
      [user_id, product_id, quantity]
    );

    return NextResponse.json({ item: response.rows[0] }, { status: 201 });
  } catch (err) {
    console.error('DB error:', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user_id = session?.user.user_id;
  const { cart_id } = await req.json();

  try {
    const response = await pool.query(
      'DELETE FROM cart WHERE user_id = $1 AND cart_id = $2 RETURNING *',
      [user_id, cart_id]
    );

    if (response.rowCount === 0) {
      return NextResponse.json(
        { message: 'Item not found in cart' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Item removed from cart' },
      { status: 200 }
    );
  } catch (err) {
    console.error('DB error:', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
