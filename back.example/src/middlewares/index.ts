
import { deserializeUser } from './deserializeUser';
import { errorMiddleware } from './error';
import { loggerMiddleware } from './logger';
import { validate } from './validate';
// import { uploadFile } from './uploadFile';
import { restrictTo } from './restrictTo';

export {
    deserializeUser,
    errorMiddleware,
    loggerMiddleware,
    restrictTo,
    // uploadFile,
    validate,
};
