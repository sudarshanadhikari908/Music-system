import { Request, Response } from "express";
import SongModel from "../models/songModel";
import Pagination from "../utils/pagination";
import { validationResult } from "express-validator";

class SongController {
  static async getSongsByArtist(req: Request, res: Response): Promise<Response> {
    const artistId: number = parseInt(req.params.artistId, 10);

    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : 10;
      const { limit, offset } = Pagination.getPaginationQuery(page, pageSize);

      const { songs, total } = await SongModel.findAllByArtist(artistId, limit, offset);

      const paginatedResponse = Pagination.paginate(songs, total, page, pageSize);

      return res.status(200).json(paginatedResponse);
    } catch (error) {
      console.error("Error fetching songs by artist:", error);
      return res.status(500).json({ message: "Error fetching songs", error });
    }
  }

  static async getSongById(req: Request, res: Response): Promise<Response> {
    const artistId: number = parseInt(req.params.artistId, 10);
    const songId: number = parseInt(req.params.songId, 10);

    try {
      const song = await SongModel.findBySongId(artistId, songId);
      if (!song) {
        return res.status(404).json({ message: "Song not found" });
      }
      return res.status(200).json(song);
    } catch (error) {
      console.error("Error fetching song by ID:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  static async createSong(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const artistId: number = parseInt(req.params.artistId, 10);
    const { title, album_name, genre } = req.body;

    try {
      await SongModel.create({ title, artist_id: artistId, album_name, genre });
      return res.status(201).json({ message: "Song created successfully" });
    } catch (error) {
      console.error("Error creating song:", error);
      return res.status(500).json({ message: "Server error", error });
    }
  }

  static async updateSong(req: Request, res: Response): Promise<Response> {
    const artistId: number = parseInt(req.params.artistId, 10);
    const songId: number = parseInt(req.params.songId, 10);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, album_name, genre } = req.body;

    try {
      const song = await SongModel.findBySongId(artistId, songId);
      if (!song) {
        return res.status(404).json({ message: "Song not found" });
      }

      const updatedSong = await SongModel.updateById(songId, { title, album_name, genre });
      return res.status(200).json({ message: "Song updated", song: updatedSong });
    } catch (error) {
      console.error("Error updating song:", error);
      return res.status(500).json({ message: "Server error", error });
    }
  }

  static async deleteSong(req: Request, res: Response): Promise<Response> {
    const artistId: number = parseInt(req.params.artistId, 10);
    const songId: number = parseInt(req.params.songId, 10);

    try {
      const song = await SongModel.findBySongId(artistId, songId);
      if (!song) {
        return res.status(404).json({ message: "Song not found" });
      }

      await SongModel.deleteById(songId);
      return res.status(200).json({ message: "Song deleted successfully" });
    } catch (error) {
      console.error("Error deleting song:", error);
      return res.status(500).json({ message: "Server error", error });
    }
  }
}

export default SongController;
