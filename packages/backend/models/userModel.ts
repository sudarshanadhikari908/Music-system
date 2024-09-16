import { searchQuery } from "../utils/search";
import pool from "../db";
import { RowDataPacket } from "mysql2/promise";
import { FieldPacket, ResultSetHeader } from 'mysql2';
import { hashPassword } from "../utils/passwordUtil";

interface User {
  username: string;
  email: string;
  password: string;
  role: string;
  gender: string;
  mobile_number: string;
  address: string;
  dob: string;
  first_name: string;
  last_name: string;
}

class UserModel {
  static async findAll(
    limit: number,
    offset: number,
    searchParams: { [key: string]: string } = {}
  ): Promise<any> {
    try {
      const allowedFields = ["first_name", "last_name", "email"];
      const { query: whereClause, params: queryParams } = searchQuery(
        searchParams,
        allowedFields
      );

      const query = `
        SELECT 
    id, 
    first_name, 
    last_name, 
    username, 
    email, 
    role, 
    mobile_number, 
    dob, 
    gender, 
    address, 
    created_at, 
    updated_at,
    (SELECT COUNT(*) FROM User ${whereClause}) AS total
FROM 
    User
${whereClause}
LIMIT ? OFFSET ?;

      `;
      queryParams.push(limit, offset);

      const [rows]: any = await pool.query(query, queryParams);

      if (rows.length > 0) {
        const users = rows as User[];
        const total = rows[0].total;

        return { users, total };
      } else {
        return { users: [], total: 0 };
      }
    } catch (error) {
      console.error("Error in findAll:", error);
      throw new Error("Database error in findAll");
    }
  }

  static async findByEmail(email: string): Promise<any[]> {
    const query = "SELECT * FROM User WHERE email = ?";

    try {
      const [result] = await pool.query<RowDataPacket[]>(query, [email]);
      return result as any[];
    } catch (err) {
      console.error("Error finding user by email: ", err);
      throw err;
    }
  }

  static async findByUsername(username: string): Promise<any[]> {
    const query = "SELECT * FROM User WHERE username = ?";

    try {
      const [result] = await pool.query<RowDataPacket[]>(query, [username]);
      return result as any[];
    } catch (err) {
      console.error("Error finding user by username: ", err);
      throw err;
    }
  }

  static async create(user: User): Promise<void> {
    const {
      username,
      first_name,
      last_name,
      password,
      email,
      role,
      mobile_number,
      dob,
      gender,
      address,
    } = user;
    const query =
    "INSERT INTO User (first_name, last_name, username, email, password, role, mobile_number, dob, gender, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    try {
      await pool.query(query, [
        first_name,
        last_name,
        username,
        email,
        password,
        role,
        mobile_number,
        dob,
        gender,
        address,
      ]);
    } catch (err) {
      throw err;
    }
  }

  static async findById(id: number): Promise<any> {
    const query = `SELECT id, 
    first_name, 
    last_name, 
    username, 
    email, 
    role, 
    mobile_number, 
    dob, 
    gender, 
    address, 
    created_at, 
    updated_at 
FROM User 
WHERE id = ?`;

    try {
      const [rows] = await pool.query<RowDataPacket[]>(query, [id]);
      return rows[0];
    } catch (err) {
      console.error("Error finding user by ID: ", err);
      throw err;
    }
  }
  

  static async updateById(id: number, data: Partial<Record<string, any>>): Promise<boolean> {
    const allowedFields = [
      'first_name', 'last_name', 'username', 'email', 'role',
      'mobile_number', 'dob', 'gender', 'address'
    ];
  
    const fieldsToUpdate = Object.keys(data).filter(key => allowedFields.includes(key));
  
    if (fieldsToUpdate.length === 0) {
      throw new Error('No valid fields provided for update');
    }
  
    if (data.password) {
      data.password = await hashPassword(data.password);
    }
  
    const setClause = fieldsToUpdate.map(field => `${field} = ?`).join(', ');
  
    const query = `UPDATE User SET ${setClause}, updated_at = NOW() WHERE id = ?`;
  
    const values = [...fieldsToUpdate.map(field => data[field]), id];
  
    try {
      const [result, _]: [ResultSetHeader, FieldPacket[]] = await pool.execute<ResultSetHeader>(query, values);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error executing updateById query:', error);
      throw error;
    }
  }

  static async deleteById(id: number): Promise<boolean> {
    const query = "DELETE FROM User WHERE id = ?";

    try {
      const [result, _]: [ResultSetHeader, FieldPacket[]] = await pool.execute<ResultSetHeader>(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error executing deleteById query:", error);
      throw error;
    }
  }

  static async storeRefreshToken(
    userId: number,
    refreshToken: string
  ): Promise<void> {
    const query = "UPDATE User SET refresh_token = ? WHERE id = ?";
    try {
      await pool.query(query, [refreshToken, userId]);
    } catch (err) {
      console.error("Error storing refresh token: ", err);
      throw err;
    }
  }

  static async removeRefreshToken(refreshToken: string): Promise<void> {
    const query =
      "UPDATE User SET refresh_token = NULL WHERE refresh_token = ?";
    try {
      await pool.query(query, [refreshToken]);
    } catch (err) {
      console.error("Error removing refresh token: ", err);
      throw err;
    }
  }
}

export default UserModel;
