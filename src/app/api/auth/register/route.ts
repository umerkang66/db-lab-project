import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import pool from '@/lib/db';

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  if (existingUser.rows.length > 0) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  const role = email === 'ugulzar4512@gmail.com' ? 'admin' : 'customer';

  await pool.query(
    'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
    [name, email, hashedPassword, role]
  );

  return NextResponse.json({ success: true });
}
