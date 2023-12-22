import express from 'express';
import postRouter from './postRoute.js';
import loginRouter from './loginRoute.js';
import userRouter from './userRoute.js';
import teamRouter from './teamRoute.js';

const router = express.Router();

router.use("/auth", loginRouter);
router.use("/users", userRouter);
router.use("/publication", postRouter);
router.use("/teams", teamRouter);

export default router;