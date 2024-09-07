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
    const query = 'SELECT * FROM User WHERE email = ?';
    
    try {
      const [result] = await pool.query<RowDataPacket[]>(query, [email]);
      return result as any[];
    } catch (err) {
      console.error("Error finding user by email: ", err);
      throw err;
    }
  }

  static async findByUsername(username: string): Promise<any[]> {
    const query = 'SELECT * FROM User WHERE username = ?';
    
    try {
      const [result] = await pool.query<RowDataPacket[]>(query, [username]);
      return result as any[];
    } catch (err) {
      console.error("Error finding user by username: ", err);
      throw err;
    }
  }

  static async create(user: User): Promise<void> {
    const { username, email, password, role } = user;
    const query = 'INSERT INTO User (username, password, email, role) VALUES (?, ?, ?, ?)';
    
    try {
      await pool.query(query, [username, password, email, role]);
    } catch (err) {
      console.error("Error creating user: ", err);
      throw err;
    }
  }

  static async findById(id: number): Promise<any> {
    const query = 'SELECT * FROM User WHERE id = ?';
    try {
      const [rows] = await pool.query<RowDataPacket[]>(query, [id]);
      return rows[0]; 
    } catch (err) {
      console.error("Error finding user by ID: ", err);
      throw err; 
    }
  }

static async storeRefreshToken(userId: number, refreshToken: string): Promise<void> {
  const query = 'UPDATE User SET refresh_token = ? WHERE id = ?';
  try {
    await pool.query(query, [refreshToken, userId]);
  } catch (err) {
    console.error("Error storing refresh token: ", err);
    throw err;
  }
}

static  async removeRefreshToken(refreshToken: string): Promise<void> {
  const query = 'UPDATE User SET refresh_token = NULL WHERE refresh_token = ?';
  try {
      await pool.query(query, [refreshToken]);
  } catch (err) {
      console.error("Error removing refresh token: ", err);
      throw err;
  }
}
}

export default UserModel;
