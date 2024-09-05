import pool from '../db';

interface User {
  username: string;
  email: string;
  password: string;
  role: string;
}

class UserModel {
  static async findByEmail(email: string): Promise<any[]> {
    const [result] = await pool.query('SELECT * FROM User WHERE email = ?', [email]);
    return result as any[]; 
  }

  static async create(user: User): Promise<void> {
    const { username, email, password, role } = user;
    await pool.query(
      'INSERT INTO User (username, password, email, role) VALUES (?, ?, ?, ?)',
      [username, password, email, role]
    );
  }
}

export default UserModel;
