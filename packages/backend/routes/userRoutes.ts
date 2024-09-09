import AuthMiddleware from '../middleware/authenticateToken';
import UserController from '../controllers/userController';
import express from 'express';

const router = express.Router();

router.get('/users', AuthMiddleware.authenticateToken, UserController.getUsers);

export default router;
