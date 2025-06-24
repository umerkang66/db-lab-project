import { AddToCartButton } from '@/components/add-to-cart-btn';
import pool from '@/lib/db';

export default async function Home() {
  const res = await pool.query('SELECT * FROM products;');
  const products = res.rows;

  return (
    <div className="max-w-5xl mx-auto mt-12 px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => (
        <div
          key={product.product_id}
          className="relative bg-white rounded-2xl shadow-xl p-6 border border-emerald-100 hover:shadow-emerald-200 transition"
        >
          <h3 className="text-xl font-semibold text-emerald-700 mb-2">
            {product.name}
          </h3>
          <p className="text-gray-700 mb-2">{product.description}</p>
          <p className="text-gray-600 mb-1">
            <span className="font-medium">Price:</span> Rs{' '}
            {parseFloat(product.price).toLocaleString()}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Stock:</span> {product.stock_quantity}
          </p>

          <div className="absolute bottom-4 right-4">
            <AddToCartButton product_id={product.product_id} />
          </div>
        </div>
      ))}
    </div>
  );
}
