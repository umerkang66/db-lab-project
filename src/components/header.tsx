import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { SignoutBtn } from './signout-btn';
import { CartBtn } from './cart-btn';

export async function Header() {
  const session = await getServerSession();

  return (
    <header className="flex items-center justify-between text-gray-100 bg-emerald-700 py-7 px-4">
      <Link href="/">
        <h1 className="text-3xl font-bold">Ecommerce Order Management</h1>
      </Link>
      {!session?.user ? (
        <div>
          <Link
            className="mr-2 rounded px-4 py-2 bg-emerald-950"
            href="/auth/signin"
          >
            Signin
          </Link>
          <Link
            className="rounded px-4 py-2 bg-emerald-950"
            href="/auth/signup"
          >
            Signup
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="mr-4 text-gray-200">
            Welcome, {session.user.name || session.user.email}!
          </span>
          <Link
            className="px-4 rounded py-2 bg-emerald-300 text-black mr-2"
            href="my-orders"
          >
            My Orders
          </Link>
          <CartBtn />
          <SignoutBtn />
        </div>
      )}
    </header>
  );
}
