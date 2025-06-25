import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const result = await pool.query(
      'SELECT * FROM products ORDER BY created_at DESC'
    );

    return NextResponse.json({ products: result.rows }, { status: 200 });
  } catch (err) {
    console.error('DB error:', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { name, description, price, stock_quantity } = await req.json();

  if (!name || !description || isNaN(price) || isNaN(stock_quantity)) {
    return NextResponse.json(
      { error: 'All fields are required and must be valid' },
      { status: 400 }
    );
  }

  try {
    await pool.query(
      'INSERT INTO products (name, description, price, stock_quantity) VALUES ($1, $2, $3, $4)',
      [name, description, price, stock_quantity]
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error('DB error:', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { product_id } = await req.json();

  try {
    const result = await pool.query(
      'DELETE FROM products WHERE product_id = $1 RETURNING *',
      [product_id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('DB error:', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const { product_id, name, description, price, stock_quantity } =
    await req.json();

  if (!name || !description || isNaN(price) || isNaN(stock_quantity)) {
    return NextResponse.json(
      { error: 'Invalid product data' },
      { status: 400 }
    );
  }

  try {
    const result = await pool.query(
      `
      UPDATE products
      SET name = $1,
          description = $2,
          price = $3,
          stock_quantity = $4
      WHERE product_id = $5
      RETURNING *
      `,
      [name, description, price, stock_quantity, product_id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, product: result.rows[0] },
      { status: 200 }
    );
  } catch (err) {
    console.error('DB error:', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
