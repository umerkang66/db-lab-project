'use client';

import { signOut } from 'next-auth/react';
import { useState } from 'react';
import { FiLogOut } from 'react-icons/fi';
import { ImSpinner2 } from 'react-icons/im';

export function SignoutBtn() {
  const [loading, setLoading] = useState(false);

  return (
    <button
      onClick={() => {
        signOut({ callbackUrl: '/' });
        setLoading(true);
      }}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all font-medium disabled:opacity-50"
    >
      {loading ? (
        <ImSpinner2 className="animate-spin" size={18} />
      ) : (
        <FiLogOut size={18} />
      )}
      <span className="hidden sm:inline">Sign Out</span>
    </button>
  );
}
