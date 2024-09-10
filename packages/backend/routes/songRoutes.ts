import express from "express";
import AuthMiddleware from "../middleware/authenticateToken";
import SongController from "../controllers/songController";
import SongValidator from "../validators/songValidator";
import ArtistValidationMiddleware from "../middleware/artistValidationMiddleware";

const router = express.Router();

router.get(
  "/artists/:artistId/songs",
  AuthMiddleware.authenticateToken,
  ArtistValidationMiddleware.validateArtistExists,
  SongController.getSongsByArtist
);
router.get(
  "/artists/:artistId/songs/:songId",
  AuthMiddleware.authenticateToken,
  ArtistValidationMiddleware.validateArtistExists,
  SongController.getSongById
);
router.post(
  "/artists/:artistId/songs/create",
  AuthMiddleware.authenticateToken,
  ArtistValidationMiddleware.validateArtistExists,
  SongValidator.getSongValidationRules(),
  SongValidator.validateMiddleware,
  SongController.createSong
);
router.put(
  "/artists/:artistId/songs/:songId",
  AuthMiddleware.authenticateToken,
  ArtistValidationMiddleware.validateArtistExists,
  SongValidator.getSongValidationRules(),
  SongValidator.validateMiddleware,
  SongController.updateSong
);
router.delete(
  "/artists/:artistId/songs/:songId",
  AuthMiddleware.authenticateToken,
  ArtistValidationMiddleware.validateArtistExists,
  SongController.deleteSong
);

export default router;
