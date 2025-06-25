import { ProductCard } from '@/components/product-card';
import pool from '@/lib/db';
import { Product } from '@/lib/types';

export default async function Home() {
  const res = await pool.query('SELECT * FROM products;');
  let products = res.rows;

  return (
    <>
      {products.length === 0 ? (
        <div className="min-h-[500px] flex items-center justify-center">
          <div className="p-4 bg-red-700 rounded text-white text-2xl">
            No Products Found.
          </div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto mt-12 px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <ProductCard key={product.product_id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}
