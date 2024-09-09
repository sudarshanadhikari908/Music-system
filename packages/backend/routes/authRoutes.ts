import express from 'express';
import AuthController from '../controllers/authController';
import AuthValidator from '../validators/authValidators';
import loginRateLimiter from '../middleware/rateLimiter'; 

const router = express.Router();

router.post('/register', 
    AuthValidator.getRegistrationValidationRules(),
    AuthValidator.validateMiddleware,  
    AuthController.register
);

router.post('/login', 
    loginRateLimiter, 
    AuthValidator.getLoginValidationRules(),  
    AuthValidator.validateMiddleware,  
    AuthController.login
);

router.post('/refresh', 
    AuthController.refreshToken 
);

router.post('/logout', AuthController.logout);

export default router;
