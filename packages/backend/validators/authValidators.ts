import { body, validationResult, ValidationChain } from "express-validator";
import { Request, Response, NextFunction } from "express";

class AuthValidator {
  public static getRegistrationValidationRules(): ValidationChain[] {
    return [
      body("first_name")
        .isLength({ min: 1 })
        .withMessage("First name is required.")
        .isAlpha()
        .withMessage("First name should contain only alphabetic characters.")
        .not()
        .isEmpty()
        .withMessage("First name is required."),

      body("last_name")
        .isLength({ min: 1 })
        .withMessage("Last name is required.")
        .isAlpha()
        .withMessage("Last name should contain only alphabetic characters.")
        .not()
        .isEmpty()
        .withMessage("Last name is required."),
      body("username")
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters long.")
        .not()
        .isEmpty()
        .withMessage("Username is required."),
      body("email")
        .isEmail()
        .withMessage("Please provide a valid email.")
        .not()
        .isEmpty()
        .withMessage("Email is required."),
      body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long.")
        .not()
        .isEmpty()
        .withMessage("Password is required."),
      body("role")
        .isIn(["super_admin", "artist_manager", "artist"])
        .withMessage("Invalid role provided."),
      body("mobile-number")
        .matches(/^[9][0-9]{9}$/)
        .withMessage(
          "Phone number must be a valid 10-digit Nepali number starting with 9."
        )
        .optional({ nullable: true }),

      body("dob")
        .isISO8601()
        .withMessage("Date of birth must be a valid date.")
        .optional({ nullable: true }),

      body("gender")
        .isIn(["M", "F", "O"])
        .withMessage('Gender must be either "m", "f", or "o".')
        .optional({ nullable: true }),

      body("address")
        .isLength({ max: 255 })
        .withMessage("Address must not exceed 255 characters.")
        .optional({ nullable: true }),
    ];
  }

  public static getLoginValidationRules(): ValidationChain[] {
    return [
      body("email").not().isEmpty().withMessage("Email is required."),
      body("password").not().isEmpty().withMessage("Password is required."),
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

export default AuthValidator;
