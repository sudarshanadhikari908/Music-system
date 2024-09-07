import { body, validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

class AuthValidator {
    public static getRegistrationValidationRules(): ValidationChain[] {
        return [
            body('username')
                .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long.')
                .not().isEmpty().withMessage('Username is required.'),
            body('email')
                .isEmail().withMessage('Please provide a valid email.')
                .not().isEmpty().withMessage('Email is required.'),
            body('password')
                .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
                .not().isEmpty().withMessage('Password is required.'),
            body('role')
                .isIn(['super_admin', 'artist_manager', 'artist']).withMessage('Invalid role provided.'),
        ];
    }

    public static getLoginValidationRules(): ValidationChain[] {
        return [
            body('username')
                .not().isEmpty().withMessage('Username is required.'),
            body('password')
                .not().isEmpty().withMessage('Password is required.'),
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

export default AuthValidator;
