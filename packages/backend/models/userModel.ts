import pool from '../db';
import  {RowDataPacket}  from 'mysql2/promise';

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
  static async findByUsername(username: string): Promise<any[]> {
    const [result] = await pool.query('SELECT * FROM User WHERE username = ?', [username]);
    return result as any[]; 
  }

  static async create(user: User): Promise<void> {
    const { username, email, password, role } = user;
    await pool.query(
      'INSERT INTO User (username, password, email, role) VALUES (?, ?, ?, ?)',
      [username, password, email, role]
    );
  }

   static async findById(id: number): Promise<any> {
    const query = 'SELECT * FROM User WHERE id = ?';
    const [rows] = await pool.query<RowDataPacket[]>(query, [id]);
    return rows[0]; 
}

static async storeRefreshToken(userId: number, refreshToken: string): Promise<void> {
  const query = 'UPDATE User SET refresh_token = ? WHERE id = ?';
  await pool.query(query, [refreshToken, userId]);
}
}

export default UserModel;
