import { body, validationResult, ValidationChain } from "express-validator";
import { Request, Response, NextFunction } from "express";

class ArtistValidator {
  public static getArtistValidationRules(): ValidationChain[] {
    return [
      body("name")
        .isLength({ min: 2 })
        .withMessage("Artist name must be at least 2 characters long.")
        .not()
        .isEmpty()
        .withMessage("Artist name is required."),
      body("dob")
        .isISO8601()
        .withMessage("Date of birth must be a valid date.")
        .optional({ nullable: true }),
      body("gender")
        .isIn(["M", "F", "O"])
        .withMessage("Gender must be either 'M', 'F', or 'O'.")
        .optional({ nullable: true }),
      body("no_of_albums_released")
        .isInt({ min: 0 })
        .withMessage("Number of albums must be a non-negative integer.")
        .optional({ nullable: true }),
      body("genre")
        .isLength({ max: 50 })
        .withMessage("Genre must not exceed 50 characters.")
        .optional({ nullable: true }),
      body("bio")
        .isLength({ max: 1000 })
        .withMessage("Bio must not exceed 1000 characters.")
        .optional({ nullable: true }),
      body("first_release_year")
        .isInt({ min: 1900, max: new Date().getFullYear() })
        .withMessage("First release year must be between 1900 and the current year.")
        .optional({ nullable: true })
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

export default ArtistValidator;
