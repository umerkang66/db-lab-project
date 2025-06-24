'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || 'Something went wrong');
      setSuccess('');
    } else {
      setSuccess('Registration successful! You can now sign in.');
      setError('');
      setName('');
      setEmail('');
      setPassword('');
      setTimeout(() => router.push('/auth/signin'), 1500);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-semibold text-emerald-700 mb-6 text-center">
        Create your account
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-emerald-700 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-5">
        <div>
          <label className="block text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={name}
            required
            onChange={e => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            required
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            required
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        <button
          type="submit"
          className="cursor-pointer w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-semibold transition"
        >
          {loading ? 'Registering...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}
