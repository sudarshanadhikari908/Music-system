import express from "express";
import AuthMiddleware from "../middleware/authenticateToken";
import SongController from "../controllers/songController";
import SongValidator from "../validators/songValidator";
import ArtistValidationMiddleware from "../middleware/artistValidationMiddleware";
import RoleMiddleware from "../middleware/roleValidationMiddleware";

const router = express.Router();

router.get(
  "/artists/:artistId/songs",
  AuthMiddleware.authenticateToken,
  RoleMiddleware.authorize(["super_admin", "artist_manager", "artist"]),
  ArtistValidationMiddleware.validateArtistExists,
  SongController.getSongsByArtist
);
router.get(
  "/artists/:artistId/songs/:songId",
  RoleMiddleware.authorize(["super_admin", "artist_manager", "artist"]),
  AuthMiddleware.authenticateToken,
  ArtistValidationMiddleware.validateArtistExists,
  SongController.getSongById
);
router.post(
  "/artists/:artistId/songs/create",
  AuthMiddleware.authenticateToken,
  RoleMiddleware.authorize(["artist"]),
  ArtistValidationMiddleware.validateArtistExists,
  SongValidator.getSongValidationRules(),
  SongValidator.validateMiddleware,
  SongController.createSong
);
router.put(
  "/artists/:artistId/songs/:songId",
  AuthMiddleware.authenticateToken,
  RoleMiddleware.authorize(["artist"]),
  ArtistValidationMiddleware.validateArtistExists,
  SongValidator.getSongValidationRules(),
  SongValidator.validateMiddleware,
  SongController.updateSong
);
router.delete(
  "/artists/:artistId/songs/:songId",
  AuthMiddleware.authenticateToken,
  RoleMiddleware.authorize(["artist"]),
  ArtistValidationMiddleware.validateArtistExists,
  SongController.deleteSong
);

export default router;
