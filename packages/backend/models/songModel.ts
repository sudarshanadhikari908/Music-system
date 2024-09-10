import pool from "../db";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

type Genre = 'rnb' | 'country' | 'classic' | 'rock' | 'jazz';

interface Song {
  title: string;
  artist_id: number;
  album_name?: string;
  genre?: Genre;
}

class SongModel {
  static async findAllByArtist(artistId: number, limit: number, offset: number): Promise<{ songs: Song[], total: number }> {
    try {
      const query = `
        SELECT 
          id, title, artist_id, album_name, genre, created_at, updated_at, 
          (SELECT COUNT(*) FROM Song WHERE artist_id = ?) AS total 
        FROM Song 
        WHERE artist_id = ?
        LIMIT ? OFFSET ?;
      `;
      const [rows]: any = await pool.query<RowDataPacket[]>(query, [artistId, artistId, limit, offset]);

      const songs = rows as Song[];
      const total = rows.length > 0 ? rows[0].total : 0;

      return { songs, total };
    } catch (error) {
      console.error("Error in findAllByArtist:", error);
      throw new Error("Database error in findAllByArtist");
    }
  }

  static async findBySongId(artistId: number, songId: number): Promise<Song | null> {
    const query = `SELECT id, title, artist_id, album_name, genre, created_at, updated_at FROM Song WHERE artist_id = ? AND id = ?`;

    try {
      const [rows] = await pool.query<RowDataPacket[]>(query, [artistId, songId]);
      if (rows.length > 0) {
        return rows[0] as Song;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error finding song by artist and ID:", error);
      throw error;
    }
  }

  static async create(song: Song): Promise<void> {
    const { title, artist_id, album_name, genre } = song;
    const query = `
      INSERT INTO Song (title, artist_id, album_name, genre) 
      VALUES (?, ?, ?, ?)
    `;

    try {
      await pool.query(query, [title, artist_id, album_name, genre]);
    } catch (error) {
      console.error("Error creating song:", error);
      throw error;
    }
  }

  static async updateById(id: number, data: Partial<Song>): Promise<boolean> {
    const allowedFields = ['title', 'album_name', 'genre'];
    const fieldsToUpdate = Object.keys(data).filter(key => allowedFields.includes(key));

    if (fieldsToUpdate.length === 0) {
      throw new Error('No valid fields provided for update');
    }

    const setClause = fieldsToUpdate.map(field => `${field} = ?`).join(', ');
    const query = `UPDATE Song SET ${setClause}, updated_at = NOW() WHERE id = ?`;

    const values = [...fieldsToUpdate.map(field => data[field as keyof Song]), id];

    try {
      const [result]: [ResultSetHeader, any] = await pool.execute<ResultSetHeader>(query, values);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error updating song:", error);
      throw error;
    }
  }

  static async deleteById(id: number): Promise<boolean> {
    const query = "DELETE FROM Song WHERE id = ?";

    try {
      const [result]: [ResultSetHeader, any] = await pool.execute<ResultSetHeader>(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error deleting song:", error);
      throw error;
    }
  }
}

export default SongModel;
