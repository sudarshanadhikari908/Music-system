import { Request, Response, NextFunction } from "express";
import ArtistModel from "../models/artistModel";

class ArtistValidationMiddleware {
  public static async validateArtistExists(req: Request, res: Response, next: NextFunction): Promise<void> {
    const artistId: number = parseInt(req.params.artistId, 10);
    
    if (isNaN(artistId)) {
       res.status(400).json({ message: "Invalid artist ID" });
       return;
    }

    try {
      const artist = await ArtistModel.findById(artistId);
      if (!artist) {
         res.status(404).json({ message: "Artist not found" });
         return;
      }
      next();
    } catch (error) {
      console.error("Error checking artist existence:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }
}

export default ArtistValidationMiddleware;
