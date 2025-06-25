'use client';

import { signOut } from 'next-auth/react';
import { useState } from 'react';

export function SignoutBtn() {
  const [loading, setLoading] = useState(false);

  return (
    <button
      onClick={() => {
        signOut();
        setLoading(true);
      }}
      className="cursor-pointer rounded px-4 py-2 bg-emerald-300 text-gray-900"
    >
      Signout {loading && '...'}
    </button>
  );
}
