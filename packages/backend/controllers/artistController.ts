import { Request, Response } from "express";
import Artist from "../models/artistModel";
import csvParser from "csv-parser";
import fs from "fs";
import { parse } from "json2csv";
import Pagination from "../utils/pagination";
import { validationResult } from "express-validator";

interface FileImportRequest extends Request {
  file?: Express.Multer.File;
}

interface ArtistInterface {
  name: string;
  dob: Date;
  gender: string;
  no_of_albums_released: number;
  genre: string;
  bio: string;
  first_release_year: number;
}

class ArtistController {
  static async getArtists(req: Request, res: Response): Promise<Response> {
    try {
      const page = req?.query?.page
        ? parseInt(req.query.page as string, 10)
        : 1;
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

    const {
      name,
      dob,
      gender,
      no_of_albums_released,
      bio,
      first_release_year,
    } = req.body;

    try {
      await Artist.create({
        name,
        dob,
        gender,
        no_of_albums_released,
        bio,
        first_release_year,
      });
      return res.status(201).json({ message: "Artist created successfully" });
    } catch (error) {
      console.error("Error creating artist:", error);
      return res.status(500).json({ message: "Server error", error });
    }
  }

  static async importArtists(req: FileImportRequest, res: Response): Promise<Response> {
    
    try {
      const file = req.file;

      const supportedMimeTypes = [
        "text/csv",
        "application/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
      ];

      if (!file || !supportedMimeTypes.includes(file.mimetype)) {
        return res.status(400).json({ message: "Please upload a valid CSV, XLS, or XLSX file." });
      }

      const artists: any[] = [];

      // Parse CSV files
      if (file.mimetype.includes("csv") || file.mimetype === "application/vnd.ms-excel") {
        await new Promise<void>((resolve, reject) => {
          fs.createReadStream(file.path)
            .pipe(csvParser())
            .on("data", (row) => {
              artists.push({
                name: row.name,
                dob: new Date(row.dob),
                gender: row.gender,
                no_of_albums_released: parseInt(row.no_of_albums_released, 10),
                genre: row.genre,
                bio: row.bio,
                first_release_year: parseInt(row.first_release_year, 10),
              });
            })
            .on("end", resolve)
            .on("error", reject);
        });
      }

      // For XLS or XLSX files, you would need to use a library like 'xlsx'
      if (file.mimetype.includes("spreadsheetml") || file.mimetype === "application/vnd.ms-excel") {
        // You would handle XLSX or XLS parsing here using a library like 'xlsx'
        // For example, you could use 'xlsx' to parse the file and then push rows to `artists`
      }

      // Save artists to the database
      for (const artist of artists) {
        await Artist.create(artist);
      }

      return res.status(201).json({ message: "Artists imported successfully" });
    } catch (error) {
      console.error("Error importing artists:", error);
      return res.status(500).json({ message: "Server error", error });
    }
  }

  static async exportArtists(req: Request, res: Response): Promise<Response> {
    try {
      const { artists } = await Artist.findAll(1000, 0);
      const fields = [
        "name",
        "dob",
        "gender",
        "no_of_albums_released",
        "genre",
        "bio",
        "first_release_year",
      ];

      const csv = parse(artists, { fields });
      res.header("Content-Type", "text/csv");
      res.attachment("artists.csv");
      return res.status(200).send(csv);
    } catch (error) {
      console.error("Error exporting artists:", error);
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

    const {
      name,
      dob,
      gender,
      no_of_albums_released,
      bio,
      first_release_year,
    } = req.body;

    try {
      const artist = await Artist.findById(artistId);
      if (!artist) {
        return res.status(404).json({ message: "Artist not found" });
      }

      const updatedArtist = await Artist.updateById(artistId, {
        name,
        dob,
        gender,
        no_of_albums_released,
        bio,
        first_release_year,
      });
      return res
        .status(200)
        .json({ message: "Artist updated", artist: updatedArtist });
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
