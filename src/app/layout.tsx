import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

import { CartProvider } from '@/contexts/cart-context';
import { Providers } from '@/components/providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ShopHub - Modern E-commerce Experience',
  description:
    'Discover a world of quality products at unbeatable prices. Your one-stop destination for everything you need.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  try {
    return (
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased text-gray-800`}
        >
          <Providers>
            <CartProvider>{children}</CartProvider>
          </Providers>
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1f2937',
                color: '#fff',
                borderRadius: '12px',
                padding: '16px',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
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
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">⚠️</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Connection Error
              </h1>
              <p className="text-gray-500">
                Unable to connect to the database. Please try again later.
              </p>
            </div>
          </div>
        </body>
      </html>
    );
  }
}
