import { beforeEach, describe, expect, jest } from '@jest/globals';
import { UserService } from '../src/services/userService';
import { CustomError } from '../src/utils/customError';
import bcrypt from 'bcrypt';

describe('Service Test', () => {
  let mockUserRepo;
  let mockAuthService;
  let userService;
  let mockBcrypt;

  beforeEach(() => {
    jest.resetAllMocks();

    mockUserRepo = {
      createUser: jest.fn(),
      findUserByUsername: jest.fn(),
      saveRefreshToken: jest.fn(),
      removeRefreshToken: jest.fn(),
    };
    mockAuthService = {
      generateAccessToken: jest.fn(),
      generateRefreshToken: jest.fn(),
      refreshAccessToken: jest.fn(),
      verifyAccessToken: jest.fn(),
    };
    userService = new UserService(mockUserRepo, mockAuthService);
  });

  describe('회원가입', () => {
    test('회원가입 성공', async () => {
      const userData = { username: 'testuser', nickname: 'Test User', password: 'password123' };
      const hashedPassword = 'hash-password123';
      const expectedUser = { ...userData, password: hashedPassword };

      mockUserRepo.findUserByUsername.mockResolvedValue(null);

      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);

      mockUserRepo.createUser.mockResolvedValue(expectedUser);

      const result = await userService.registerUser(userData.username, userData.nickname, userData.password);

      expect(mockUserRepo.findUserByUsername).toHaveBeenCalledWith(userData.username);
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(mockUserRepo.createUser).toHaveBeenCalledWith(userData.username, userData.nickname, hashedPassword);
      expect(result).toEqual(expectedUser);
    });
    test('회원가입 실패 - 이미 존재하는 사용자명', async () => {
      const userData = { username: 'testuser', nickname: 'Test User', password: 'password123' };
      mockUserRepo.findUserByUsername.mockResolvedValue({ username: userData.username });

      await expect(userService.registerUser(userData.username, userData.nickname, userData.password)).rejects.toThrow(
        CustomError,
      );

      expect(mockUserRepo.findUserByUsername).toHaveBeenCalledWith(userData.username);
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(mockUserRepo.createUser).not.toHaveBeenCalled();
    });
  });

  describe('로그인', () => {
    test('로그인 성공', async () => {
      const userData = { username: 'testuser', password: 'password123' };
      const accessToken = 'access-token';
      const refreshToken = 'refresh-token';
    });
  });

  describe('토큰 재발급', () => {
    test('로그인 성공', async () => {});
  });
  describe('로그아웃', () => {
    test('로그인 성공', async () => {});
  });
});
