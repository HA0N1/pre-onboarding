import express from 'express';
import { UserController } from '../controllers/userController.js';
import { UserRepo } from '../repositories/userRepositiry.js';
import { UserService } from '../services/userService.js';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();
const userRepo = new UserRepo(prisma);
const userService = new UserService(userRepo);
const userController = new UserController(userService, userRepo);

router.post('/signup', userController.register);
router.post('/login', userController.login);

export default router;
