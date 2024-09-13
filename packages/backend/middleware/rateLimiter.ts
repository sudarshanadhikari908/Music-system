import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';


const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 50, 
    message: 'Too many login attempts from this IP, please try again later.',
    headers: true, 
    handler: (req: Request, res: Response) => {
        res.status(429).json({ message: 'Too many login attempts., please try again later.' });
    }
});

export default loginRateLimiter;
