import pool from "../db";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

interface Artist {
  name: string;
  dob?: Date;
  gender?: string;
  no_of_albums_released?: number;
  genre?: string;
  bio?: string;
  first_release_year?: number;
}

class ArtistModel {
  static async findAll(limit: number, offset: number): Promise<{ artists: Artist[], total: number }> {
    try {
      const query = `
        SELECT 
          id, name, dob, gender, no_of_albums_released, bio, first_release_year, created_at, updated_at, 
          (SELECT COUNT(*) FROM Artist) AS total 
        FROM Artist 
        LIMIT ? OFFSET ?;
      `;
      const [rows]: any = await pool.query<RowDataPacket[]>(query, [limit, offset]);

      const artists = rows as Artist[];
      const total = rows.length > 0 ? rows[0].total : 0;

      return { artists, total };
    } catch (error) {
      console.error("Error in findAll:", error);
      throw new Error("Database error in findAll");
    }
  }

  static async findById(id: number): Promise<Artist | null> {
    const query = `
      SELECT id, name, dob, gender, no_of_albums_released, bio, first_release_year, created_at, updated_at 
      FROM Artist 
      WHERE id = ?
    `;

    try {
      const [rows] = await pool.query<RowDataPacket[]>(query, [id]);
      if (rows.length > 0) {
        return rows[0] as Artist;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error finding artist by ID:", error);
      throw error;
    }
  }

  static async create(artist: Artist): Promise<void> {
    const { name, dob, gender, no_of_albums_released, genre, bio, first_release_year } = artist;
    const query = `
      INSERT INTO Artist (name, dob, gender, no_of_albums_released, bio, first_release_year) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    try {
      await pool.query(query, [name, dob, gender, no_of_albums_released, bio, first_release_year]);
    } catch (error) {
      console.error("Error creating artist:", error);
      throw error;
    }
  }

  static async updateById(id: number, data: Partial<Artist>): Promise<boolean> {
    const allowedFields = ['name', 'dob', 'gender', 'no_of_albums_released', 'bio', 'first_release_year'];
    const fieldsToUpdate = Object.keys(data).filter(key => allowedFields.includes(key));

    if (fieldsToUpdate.length === 0) {
      throw new Error('No valid fields provided for update');
    }

    const setClause = fieldsToUpdate.map(field => `${field} = ?`).join(', ');
    const query = `UPDATE Artist SET ${setClause}, updated_at = NOW() WHERE id = ?`;

    const values = [...fieldsToUpdate.map(field => data[field as keyof Artist]), id];

    try {
      const [result]: [ResultSetHeader, any] = await pool.execute<ResultSetHeader>(query, values);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error updating artist:", error);
      throw error;
    }
  }

  static async deleteById(id: number): Promise<boolean> {
    const query = "DELETE FROM Artist WHERE id = ?";

    try {
      const [result]: [ResultSetHeader, any] = await pool.execute<ResultSetHeader>(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error deleting artist:", error);
      throw error;
    }
  }
}

export default ArtistModel;
