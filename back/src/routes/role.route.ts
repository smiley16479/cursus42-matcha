import { Router } from 'express';
import { deserializeUser, restrictTo } from '../middlewares';
import { RoleCodes } from '../models/role.model';
import { RoleController } from '../controllers';

const roleRouter = Router();

roleRouter.get(
    '/',
    deserializeUser,
    restrictTo(RoleCodes.Admin),
    RoleController.getAll,
);

export { roleRouter };
