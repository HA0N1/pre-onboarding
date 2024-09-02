import express from 'express';
import { UserController } from '../controllers/userController.js';
import { UserRepo } from '../repositories/userRepositiry.js';
import { UserService } from '../services/userService.js';
import { PrismaClient } from '@prisma/client';
import { AuthService } from '../services/authService.js';
import { jwtValidate } from '../middleware/jwt-validate.middleware.js';

const router = express.Router();
const prisma = new PrismaClient();
const userRepo = new UserRepo(prisma);
const authService = new AuthService(userRepo);
const userService = new UserService(userRepo, authService);
const userController = new UserController(userService);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: 회원가입 API
 *     description: 새로운 사용자를 등록하는 API입니다.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - nickname
 *             properties:
 *               username:
 *                 type: string
 *                 description: 사용자 이름
 *                 example: '홍길동'
 *               password:
 *                 type: string
 *                 description: 사용자 비밀번호
 *                 example: '123123'
 *               nickname:
 *                 type: string
 *                 description: 사용자 닉네임
 *                 example: '동해번쩍서해번쩍'
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 회원가입을 완료하였습니다.
 *                 data:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       example: 홍길동
 *                     nickname:
 *                       type: string
 *                       example: 동해번쩍서해번쩍
 *                     authorities:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ['ROLE_USER']
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */
router.post('/signup', userController.register);
router.post('/login', userController.login);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: 로그인 API
 *     description: 기존 사용자가 로그인하는 API입니다.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: 사용자 이름
 *                 example: '홍길동'
 *               password:
 *                 type: string
 *                 description: 사용자 비밀번호
 *                 example: '123123'
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: 'eKDIkdfjoakIdkfjpekdkcjdkoIOdjOKJDFOlLDKFJKL'
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 오류
 */
router.post('/login', userController.login);

router.post('/token', userController.refreshToken);

// jwt middleware test용 logout
router.post('/logout', jwtValidate(authService), userController.logout);

export default router;
