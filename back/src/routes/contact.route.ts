import { Router } from 'express';
import { deserializeUser, restrictTo } from '../middlewares';
import { RoleCodes } from '../models/role.model';
import { ContactController } from '../controllers';

const contactRouter = Router();

contactRouter.get(
    '/',
    deserializeUser,
    restrictTo(RoleCodes.Admin),
    ContactController.getAll,
);

contactRouter.get(
    '/:id',
    deserializeUser,
    restrictTo(RoleCodes.Admin),
    ContactController.findById,
);


export { contactRouter };
