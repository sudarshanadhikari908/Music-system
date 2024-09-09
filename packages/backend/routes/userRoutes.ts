import AuthMiddleware from '../middleware/authenticateToken';
import UserController from '../controllers/userController';
import express from 'express';
import UserValidator from '../validators/userValidator';

const router = express.Router();

router.get('/users', AuthMiddleware.authenticateToken, UserController.getUsers);

router.get('/user/:id',AuthMiddleware.authenticateToken, UserController.getUserById);
router.post('/user/create',AuthMiddleware.authenticateToken, UserValidator.getUserValidationRules(), UserValidator.validateMiddleware, UserController.createUser)

router.put('/user/:id',AuthMiddleware.authenticateToken, UserValidator.getUserValidationRules(), UserValidator.validateMiddleware, UserController.updateUser);

router.delete('/user/:id',AuthMiddleware.authenticateToken, UserController.deleteUser);

export default router;
