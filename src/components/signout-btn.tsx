'use client';

import { signOut } from 'next-auth/react';

export function SignoutBtn() {
  return (
    <button
      onClick={() => signOut()}
      className="cursor-pointer rounded px-4 py-2 bg-emerald-300 text-gray-900"
    >
      Signout
    </button>
  );
}
