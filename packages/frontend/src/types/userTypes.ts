export interface UserProfile {
    id: number;
    username: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    dob?: string | null; 
    gender?: 'M' | 'F' | 'O' | null; 
    address?: string | null; 
  }