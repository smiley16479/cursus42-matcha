import { Router } from 'express';
import { Validators } from '../rules';
import { AuthController } from '../controllers';
import { validate } from '../middlewares';

const authRouter = Router();

authRouter.post(
    '/',
    validate(Validators.auth.login),
    AuthController.login
);

export { authRouter };
