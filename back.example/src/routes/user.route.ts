import { Router } from 'express';
import { Validators } from '../rules';
import { UserController } from '../controllers';
import { deserializeUser, restrictTo, validate } from '../middlewares';
import { RoleCodes } from '../models/role.model';
import { query } from 'express-validator';

const userRouter = Router();

userRouter.get('/all',
    deserializeUser,
    query('role').optional().toArray(),
    query('role.*').optional(),
    query('isActive').optional().toBoolean(),
    UserController.getAll
);

userRouter.get(
    '/:username/exists',
    deserializeUser,
    restrictTo(RoleCodes.Admin),
    UserController.usernameExists,
);


userRouter.get(
    '/:username',
    deserializeUser,
    restrictTo(RoleCodes.Admin),
    UserController.getByUsername
);

userRouter.get(
    '/all/coming-soon',
    deserializeUser,
    restrictTo(RoleCodes.Admin, RoleCodes.Associate, RoleCodes.HumanResource, RoleCodes.Consulting),
    UserController.getAllComingSoon
);

userRouter.get(
    '/all/interviews',
    deserializeUser,
    restrictTo(RoleCodes.Admin, RoleCodes.Associate),
    UserController.getAllWithInterviews
);

userRouter.get('/all/picture', 
    UserController.getAllWithPicture,
);

userRouter.post('/',
    deserializeUser,
    restrictTo(RoleCodes.Admin),
    validate(Validators.user.create), 
    UserController.create,
);
userRouter.put('/picture/:username',
    deserializeUser,
    restrictTo(RoleCodes.Admin),
    // uploadPicture,
    // resizePicture,
    UserController.putUserPicture,
);

userRouter.patch(
    '/change-password/:username',
    deserializeUser,
    validate(Validators.user.editPassword),
    UserController.changePassword    
);

userRouter.patch('/reset-password',
    UserController.resetPassword,
);

userRouter.patch('/:username',
    deserializeUser,
    restrictTo(RoleCodes.Admin),
    validate(Validators.user.edit),
    UserController.edit,
);
userRouter.delete('/:username', 
    deserializeUser,
    restrictTo(RoleCodes.Admin),
    UserController.deleteByUsername,
);

export { userRouter };
