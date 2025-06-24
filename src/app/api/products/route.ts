import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

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
