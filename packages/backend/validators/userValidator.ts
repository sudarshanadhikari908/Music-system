import { body, validationResult, ValidationChain } from "express-validator";
import { Request, Response, NextFunction } from "express";

class UserValidator {
  public static getUserValidationRules(): ValidationChain[] {
    return [
      body("first_name")
        .isLength({ min: 1 })
        .withMessage("First name should be at least 1 character long.")
        .isAlpha()
        .withMessage("First name should contain only alphabetic characters."),

      body("last_name")
        .isLength({ min: 1 })
        .withMessage("Last name should be at least 1 character long.")
        .isAlpha()
        .withMessage("Last name should contain only alphabetic characters."),

      body("username")
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters long."),

      body("email").isEmail().withMessage("Please provide a valid email."),
      body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long.")
        .not()
        .isEmpty()
        .withMessage("Password is required."),

      body("role")
        .isIn(["super_admin", "artist_manager", "artist"])
        .withMessage("Invalid role provided."),

      body("mobile_number")
        .optional({ nullable: true })
        .matches(/^[9][0-9]{9}$/)
        .withMessage(
          "Phone number must be a valid 10-digit Nepali number starting with 9."
        ),

      body("dob")
        .optional({ nullable: true })
        .isISO8601()
        .withMessage("Date of birth must be a valid date."),

      body("gender")
        .optional({ nullable: true })
        .isIn(["M", "F", "O"])
        .withMessage('Gender must be either "M", "F", or "O".'),

      body("address")
        .optional({ nullable: true })
        .isLength({ max: 255 })
        .withMessage("Address must not exceed 255 characters."),
    ];
  }

  public static validateMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    next();
  }
}

export default UserValidator;
