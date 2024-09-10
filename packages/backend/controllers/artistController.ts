import { Request, Response } from "express";
import Artist from "../models/artistModel";
import Pagination from "../utils/pagination";
import { validationResult } from "express-validator";

class ArtistController {
  static async getArtists(req: Request, res: Response): Promise<Response> {
    try {
      const page = req?.query?.page ? parseInt(req.query.page as string, 10) : 1;
      const pageSize = req?.query?.pageSize
        ? parseInt(req.query.pageSize as string, 10)
        : 10;
      const { limit, offset } = Pagination.getPaginationQuery(page, pageSize);

      const { artists, total } = await Artist.findAll(limit, offset);

      const paginatedResponse = Pagination.paginate(
        artists,
        total,
        page,
        pageSize
      );

      return res.status(200).json(paginatedResponse);
    } catch (error) {
      console.error("Error fetching artists:", error);
      return res.status(500).json({ message: "Error fetching artists", error });
    }
  }

  static async getArtistById(req: Request, res: Response): Promise<Response> {
    const artistId: number = parseInt(req.params.id, 10);

    try {
      const artist = await Artist.findById(artistId);
      if (!artist) {
        return res.status(404).json({ message: "Artist not found" });
      }
      return res.status(200).json(artist);
    } catch (error) {
      console.error("Error fetching artist by ID:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  static async createArtist(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, dob, gender, no_of_albums_released, genre, bio, first_release_year } = req.body;

    try {
      await Artist.create({ name, dob, gender, no_of_albums_released, genre, bio, first_release_year });
      return res.status(201).json({ message: "Artist created successfully" });
    } catch (error) {
      console.error("Error creating artist:", error);
      return res.status(500).json({ message: "Server error", error });
    }
  }

  static async updateArtist(req: Request, res: Response): Promise<Response> {
    const artistId: number = parseInt(req.params.id, 10);

    if (isNaN(artistId)) {
      return res.status(400).json({ message: "Invalid artist ID" });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, dob, gender, no_of_albums_released, genre, bio, first_release_year } = req.body;

    try {
      const artist = await Artist.findById(artistId);
      if (!artist) {
        return res.status(404).json({ message: "Artist not found" });
      }

      const updatedArtist = await Artist.updateById(artistId, { name, dob, gender, no_of_albums_released, genre, bio, first_release_year });
      return res.status(200).json({ message: "Artist updated", artist: updatedArtist });
    } catch (error) {
      console.error("Error updating artist:", error);
      return res.status(500).json({ message: "Server error", error });
    }
  }

  static async deleteArtist(req: Request, res: Response): Promise<Response> {
    const artistId: number = parseInt(req.params.id, 10);

    if (isNaN(artistId)) {
      return res.status(400).json({ message: "Invalid artist ID" });
    }

    try {
      const artist = await Artist.findById(artistId);
      if (!artist) {
        return res.status(404).json({ message: "Artist not found" });
      }

      await Artist.deleteById(artistId);
      return res.status(200).json({ message: "Artist deleted successfully" });
    } catch (error) {
      console.error("Error deleting artist:", error);
      return res.status(500).json({ message: "Server error", error });
    }
  }
}

export default ArtistController;
