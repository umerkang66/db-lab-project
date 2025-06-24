import pool from '@/lib/db';

export default async function Home() {
  const client = await pool.connect();

  try {
    const res = await client.query('SELECT * FROM products;');
    console.log('Product:', res.rows);
  } catch (err) {
    console.error('Error executing query', err);
  } finally {
    client.release();
  }

  return <div>Umer did this</div>;
}
