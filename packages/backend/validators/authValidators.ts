import { body, validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateRegistration: ValidationChain[] = [
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

export const validateRegistrationMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
     res.status(400).json({ errors: errors.array() });
     return;
    }
    next();
};
