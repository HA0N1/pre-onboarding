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
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 로그인에 성공하였습니다.
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       description: 액세스 토큰
 *                     refreshToken:
 *                       type: string
 *                       description: 리프레시 토큰
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 오류
 */
router.post('/login', userController.login);

/**
 * @swagger
 * /token:
 *   post:
 *     summary: Access Token 재발급 API
 *     description: Refresh Token으로 Access Token을 재발급하는 API입니다.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Refresh Token
 *     responses:
 *       200:
 *         description: 새 액세스 토큰 발급 성공
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
 *                   example: 새 액세스 토큰 발급에 성공하였습니다.
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       description: 새로 발급된 액세스 토큰
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 올바른 리프레쉬 토큰을 입력해야합니다.
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 오류
 */
router.post('/token', userController.refreshToken);

// jwt middleware test용 logout
/**
 * @swagger
 * /logout:
 *   post:
 *     summary: 로그아웃 API
 *     description: 사용자를 로그아웃 처리하는 API입니다.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accessToken
 *             properties:
 *               accessToken:
 *                 type: string
 *                 description: 현재 사용 중인 액세스 토큰
 *     responses:
 *       200:
 *         description: 로그아웃 성공
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
 *                   example: 로그아웃 되었습니다.
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 입력된 토큰이 로그인 된 사용자의 토큰과 일치하지 않습니다.
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 오류
 */
router.post('/logout', jwtValidate(authService), userController.logout);

export default router;
