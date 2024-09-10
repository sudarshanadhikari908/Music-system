import { body, validationResult, ValidationChain } from "express-validator";
import { Request, Response, NextFunction } from "express";

class SongValidator {
  public static getSongValidationRules(): ValidationChain[] {
    return [
      body("title")
        .isLength({ min: 1 })
        .withMessage("Song title is required."),
     body("album_name")
        .optional({ nullable: true })
        .isLength({ max: 255 })
        .withMessage("Album name must not exceed 255 characters."),
      body("genre")
        .optional({ nullable: true })
        .isIn(['rnb', 'country', 'classic', 'rock', 'jazz'])
        .withMessage("Genre must be one of: 'rnb', 'country', 'classic', 'rock', or 'jazz'.")
    ];
  }

  public static validateMiddleware(req: Request, res: Response, next: NextFunction): void {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    next();
  }
}

export default SongValidator;
