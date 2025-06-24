// types/next-auth.d.ts
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      user_id: string;
      name: string;
      email: string;
      role: 'customer' | 'admin';
      created_at: string;
    };
  }

  interface User {
    user_id: string;
    name: string;
    email: string;
    role: 'customer' | 'admin';
    created_at: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: {
      user_id: string;
      name: string;
      email: string;
      role: 'customer' | 'admin';
      created_at: string;
    };
  }
}
