import { Router } from 'express';
import { validate } from '../middlewares';
import { ActivityController } from '../controllers';
import { Validators } from '../rules';
import { deserializeUser, restrictTo } from '../middlewares';
import { RoleCodes } from '../models/role.model';
import { param } from 'express-validator';

const activityRouter = Router();


activityRouter.post(
    '/', 
    deserializeUser,
    restrictTo(RoleCodes.Admin),
    validate(Validators.activity.create), 
    ActivityController.create
);

activityRouter.get(
    '/:id',
    param('id').isInt(),
    ActivityController.getById
);

export { activityRouter };
