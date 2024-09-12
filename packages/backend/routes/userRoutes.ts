import AuthMiddleware from '../middleware/authenticateToken';
import RoleMiddleware from '../middleware/roleValidationMiddleware';
import UserController from '../controllers/userController';
import AuthController from '../controllers/authController';
import express from 'express';
import UserValidator from '../validators/userValidator';

const router = express.Router();


router.get('/profile', AuthMiddleware.authenticateToken, AuthController.getProfile);

router.get('/users', AuthMiddleware.authenticateToken,RoleMiddleware.authorize(['super_admin']), UserController.getUsers);

router.get('/user/:id',AuthMiddleware.authenticateToken,RoleMiddleware.authorize(['super_admin']), UserController.getUserById);
router.post('/user/create',AuthMiddleware.authenticateToken,RoleMiddleware.authorize(['super_admin']), UserValidator.getUserValidationRules(), UserValidator.validateMiddleware, UserController.createUser)

router.put('/user/:id',AuthMiddleware.authenticateToken,RoleMiddleware.authorize(['super_admin']), UserValidator.getUserValidationRules(), UserValidator.validateMiddleware, UserController.updateUser);

router.delete('/user/:id',AuthMiddleware.authenticateToken, RoleMiddleware.authorize(['super_admin']),UserController.deleteUser);

export default router;
