import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { authRequired } from '../middleware/auth.js';
import { validateRegister, validateLogin } from '../middleware/validate.js';

const router = Router();

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.get('/me', authRequired, authController.me);

export default router;