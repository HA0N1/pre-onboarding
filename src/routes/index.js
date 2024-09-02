import express from 'express';
import UsersRouter from './user.router.js';

const router = express.Router();

router.use('/', UsersRouter);

export default router;
