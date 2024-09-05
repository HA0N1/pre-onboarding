import { UserController } from '../src/controllers/userController';
import { beforeEach, expect, jest } from '@jest/globals';
import { CustomError } from '../src/utils/customError.js';

describe('Controller Test', () => {
  let mockUserService;
  let mockAuthService;
  let userController;
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    jest.resetAllMocks();
    mockUserService = {
      registerUser: jest.fn(),
      login: jest.fn(),
    };
    mockAuthService = {};
    mockReq = { params: {}, body: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    userController = new UserController(mockUserService, mockAuthService);
  });

  describe('회원가입', () => {
    test('회원가입 성공', async () => {
      const mockUser = {
        username: '홍길동',
        password: '123123',
        nickname: '동해번쩍서해번쩍',
      };
      mockReq.body = mockUser;
      const createdUser = {
        id: 1,
        username: mockUser.username,
        nickname: mockUser.nickname,
        roles: [{ authorityName: 'ROLE_USER' }],
      };
      mockUserService.registerUser.mockResolvedValue(createdUser);

      await userController.register(mockReq, mockRes, mockNext);

      expect(mockUserService.registerUser).toHaveBeenCalledWith(
        mockUser.username,
        mockUser.nickname,
        mockUser.password,
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: '회원가입을 완료하였습니다.',
        data: {
          username: createdUser.username,
          nickname: createdUser.nickname,
          authorities: ['ROLE_USER'],
        },
      });
    });

    test('회원가입 실패 - 정보 누락', async () => {
      mockReq.body = { username: '홍길동' };

      await userController.register(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(CustomError));
      expect(mockNext.mock.calls[0][0].message).toBe('요청 정보가 올바르지 않습니다.');
      expect(mockNext.mock.calls[0][0].status).toBe(400);
    });
  });

  describe('로그인', () => {
    test('로그인 성공', async () => {
      const req = { username: '홍길동', password: '123123' };
      const mockToken = {
        accessToken: 'mockAccessToken',
        refreshToken: 'mockRefreshToken',
      };
      mockReq.body = req;

      mockUserService.login.mockResolvedValue(mockToken);

      await userController.login(mockReq, mockRes, mockNext);

      expect(mockUserService.login).toHaveBeenCalledWith(req.username, req.password);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: '로그인에 성공하였습니다.',
        data: {
          accessToken: mockToken.accessToken,
          refreshToken: mockToken.refreshToken,
        },
      });
    });

    test('로그인 실패 - 정보 누락', async () => {
      mockReq.body = { username: '홍길동' };

      await userController.login(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(CustomError));
      expect(mockNext.mock.calls[0][0].message).toBe('요청 정보가 올바르지 않습니다.');
      expect(mockNext.mock.calls[0][0].status).toBe(400);
    });
  });
});
