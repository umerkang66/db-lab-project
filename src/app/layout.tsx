import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { getServerSession } from 'next-auth';
import Link from 'next/link';

import { authOptions } from './api/auth/[...nextauth]/route';
import pool, { initDb } from '@/lib/db';
import { Header } from '@/components/header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Ecommerce Order Management',
  description:
    'A Database Lab Semester Project for managing ecommerce orders in SQL',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  try {
    // if database is not connected, error will be shown from the start.
    await initDb(pool);

    return (
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased text-gray-800 bg-emerald-50`}
        >
          <Header />
          <div className="px-7 pb-7">{children}</div>
          {/* TODO: change customer to admin */}
          {session && session.user && session.user.role === 'customer' && (
            <div className="fixed bottom-12 right-10 z-50">
              <Link
                href="/new"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded shadow-lg font-semibold transition"
              >
                Create New Product
              </Link>
            </div>
          )}
        </body>
      </html>
    );
  } catch (error) {
    console.error('Error initializing database:', error);

    return (
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased text-gray-800 bg-emerald-50`}
        >
          <Header />
          <div className="flex items-center justify-center h-[600px]">
            <div className="p-3 rounded bg-red-600 text-white text-2xl">
              Something Went wrong.
            </div>
          </div>
        </body>
      </html>
    );
  }
}
