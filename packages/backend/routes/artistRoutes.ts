import express from "express";
import ArtistController from "../controllers/artistController";
import AuthMiddleware from '../middleware/authenticateToken';
import FileImportMiddleware from '../middleware/fileUploadMiddleware';
import ArtistValidator from "../validators/artistValidator";

const router = express.Router();

router.get("/artists",AuthMiddleware.authenticateToken, ArtistController.getArtists);

router.get("/artist/:id",AuthMiddleware.authenticateToken, ArtistController.getArtistById);

router.post(
  "/artist/create", 
  AuthMiddleware.authenticateToken,
  ArtistValidator.getArtistValidationRules(), 
  ArtistValidator.validateMiddleware, 
  ArtistController.createArtist
);

router.post(
  "/artist/import",
  AuthMiddleware.authenticateToken,
  FileImportMiddleware.singleFile(), 
  ArtistController.importArtists
);
router.post(
  "/artist/export",
  AuthMiddleware.authenticateToken,
  ArtistController.exportArtists
);

router.put(
  "/artist/:id", 
  AuthMiddleware.authenticateToken,
  ArtistValidator.getArtistValidationRules(), 
  ArtistValidator.validateMiddleware, 
  ArtistController.updateArtist
);

router.delete("/artist/:id",AuthMiddleware.authenticateToken, ArtistController.deleteArtist);

export default router;