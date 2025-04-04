export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'viewer' | 'editor';
}
