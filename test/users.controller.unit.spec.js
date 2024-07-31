import { UserController } from '../src/controllers/userController';
import { beforeEach, expect, jest } from '@jest/globals';
import Joi from 'joi';

describe('Controller Test', () => {
  let mockUserService;
  let userController;
  let mockReq, mockRes;

  beforeEach(() => {
    jest.resetAllMocks();
    mockUserService = {
      register: jest.fn(),
      checkExistingUser: jest.fn(),
      login: jest.fn(),
    };
    mockReq = { params: {}, body: {} };
    mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    userController = new UserController(mockUserService);
    mockValidateAsync = jest.fn();
  });
  describe('회원가입', () => {
    test('회원가입 성공', async () => {
      const mockUser = {
        username: 'JIN HO',
        password: '12341234',
        nickname: 'Mentos',
      };
      mockReq.body = mockUser;
      const createdUser = {
        id: Number(),
        ...mockUser,
        authorities: [{ authorityName: 'ROLE_USER' }],
      };
      mockUserService.register.mockResolvedValue(createdUser);

      await userController.register(mockReq, mockRes);

      expect(mockUserService.register).toHaveBeenCalledWith(mockUser.username, mockUser.password, mockUser.nickname);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        username: createdUser.username,
        nickname: createdUser.nickname,
        authorities: [{ authorityName: 'ROLE_USER' }],
      });
    });
  });

  describe('로그인', () => {
    test('로그인 성공', async () => {
      const req = { username: 'JIN HO', password: '12341234' };
      const mockToken = 'mocktoken';
      mockReq.body = req;

      mockUserService.checkExistingUser.mockResolvedValue(true);
      mockUserService.login.mockResolvedValue(mockToken);

      await userController.login(mockReq, mockRes);

      expect(mockUserService.checkExistingUser).toHaveBeenCalledWith(req.username, req.password);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ token: mockToken });
    });
  });
});
