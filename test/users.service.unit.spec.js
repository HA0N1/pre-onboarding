import { beforeEach, describe, expect, jest } from '@jest/globals';
import { UserService } from '../src/services/userService';
import { CustomError } from '../src/utils/customError';
import bcrypt from 'bcrypt';

describe('Service Test', () => {
  let mockUserRepo;
  let mockAuthService;
  let userService;

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
      const hashedPassword = 'hash-password123';
      const storedUser = { ...userData, password: hashedPassword };
      const accessToken = 'access-token';
      const refreshToken = 'refresh-token';

      mockUserRepo.findUserByUsername.mockResolvedValue(storedUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      mockAuthService.generateAccessToken.mockReturnValue(accessToken);
      mockAuthService.generateRefreshToken.mockReturnValue(refreshToken);

      mockUserRepo.saveRefreshToken.mockResolvedValue();

      const result = await userService.login(userData.username, userData.password);
      expect(mockUserRepo.findUserByUsername).toHaveBeenCalledWith(userData.username);
      expect(bcrypt.compare).toHaveBeenCalledWith(userData.password, hashedPassword);
      expect(mockAuthService.generateAccessToken).toHaveBeenCalledWith({ username: userData.username });
      expect(mockAuthService.generateRefreshToken).toHaveBeenCalledWith({ username: userData.username });
      expect(mockUserRepo.saveRefreshToken).toHaveBeenCalledWith(userData.username, refreshToken);
      expect(result).toEqual({ accessToken, refreshToken });
    });
    test('로그인 실패 - 존재하지 않는 사용자', async () => {
      const userData = { username: 'nonexistent', password: 'password123' };

      mockUserRepo.findUserByUsername.mockResolvedValue(null);

      await expect(userService.login(userData.username, userData.password)).rejects.toThrow(CustomError);
      expect(mockUserRepo.findUserByUsername).toHaveBeenCalledWith(userData.username);
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    test('로그인 실패 - 잘못된 비밀번호', async () => {
      const userData = { username: 'testuser', password: 'wrongpassword' };
      const storedUser = { ...userData, password: 'hashedpassword' };

      mockUserRepo.findUserByUsername.mockResolvedValue(storedUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
      await expect(userService.login(userData.username, userData.password)).rejects.toThrow(CustomError);

      expect(mockUserRepo.findUserByUsername).toHaveBeenCalledWith(userData.username);
      expect(bcrypt.compare).toHaveBeenCalledWith(userData.password, storedUser.password);
    });
  });

  describe('토큰 재발급', () => {
    test('재발급 성공', async () => {
      const refreshToken = 'refresh-token';
      const newAccessToken = 'new-access-token';

      mockAuthService.refreshAccessToken.mockResolvedValue(newAccessToken);

      const result = await userService.refreshAccessToken(refreshToken);

      expect(mockAuthService.refreshAccessToken).toHaveBeenCalledWith(refreshToken);
      expect(result).toBe(newAccessToken);
    });
  });
  describe('로그아웃', () => {
    test('로그아웃 성공', async () => {});
  });
});
