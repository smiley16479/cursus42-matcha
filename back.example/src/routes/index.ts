import { Router } from 'express';
// import { activityRouter } from './activity.route';
// import { authRouter } from './auth.route';
// import { contactRouter } from './contact.route';
// import { roleRouter } from './role.route';
import { userRouter } from './user.route';


const router = Router();

// router.use('/activity', activityRouter);
// router.use('/auth', authRouter);
// router.use('/contact', contactRouter);
// router.use('/role', roleRouter);
router.use('/user', userRouter);

export { router };
