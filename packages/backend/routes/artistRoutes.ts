import express from "express";
import ArtistController from "../controllers/artistController";
import AuthMiddleware from "../middleware/authenticateToken";
import RoleMiddleware from "../middleware/roleValidationMiddleware";
import FileImportMiddleware from "../middleware/fileUploadMiddleware";
import ArtistValidator from "../validators/artistValidator";

const router = express.Router();

router.get(
  "/artists",
  AuthMiddleware.authenticateToken,
  RoleMiddleware.authorize(["super_admin", "artist_manager"]),
  ArtistController.getArtists
);

router.get(
  "/artist/:id",
  AuthMiddleware.authenticateToken,
  RoleMiddleware.authorize(["super_admin", "artist_manager"]),
  ArtistController.getArtistById
);

router.post(
  "/artist/create",
  AuthMiddleware.authenticateToken,
  RoleMiddleware.authorize(["artist_manager"]),
  ArtistValidator.getArtistValidationRules(),
  ArtistValidator.validateMiddleware,
  ArtistController.createArtist
);

router.post(
  "/artist/import",
  AuthMiddleware.authenticateToken,
  RoleMiddleware.authorize(["artist_manager"]),
  FileImportMiddleware.singleFile(),
  ArtistController.importArtists
);
router.post(
  "/artist/export",
  AuthMiddleware.authenticateToken,
  RoleMiddleware.authorize(["artist_manager"]),
  ArtistController.exportArtists
);

router.put(
  "/artist/:id",
  AuthMiddleware.authenticateToken,
  RoleMiddleware.authorize(["artist_manager"]),
  ArtistValidator.getArtistValidationRules(),
  ArtistValidator.validateMiddleware,
  ArtistController.updateArtist
);

router.delete(
  "/artist/:id",
  AuthMiddleware.authenticateToken,
  RoleMiddleware.authorize(["artist_manager"]),
  ArtistController.deleteArtist
);

export default router;
