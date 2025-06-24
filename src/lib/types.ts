export type User = {
  user_id: string;
  name: string;
  email: string;
  password: string;
  role: 'customer' | 'admin';
  created_at: string;
};
