export interface UserProfile {
    id: number;
    username: string;
    email: string;
    role: string;
    first_name: string;
    last_name: string;
    dob?: string | null; 
    gender?: 'M' | 'F' | 'O' | null; 
    address?: string | null; 
    mobile_number?: string;
  }

  export interface UsersTable {
    current: number;
    data: UserProfile[];
    pageSize: number;
    total: number;
  }