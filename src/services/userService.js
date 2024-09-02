import bcrypt from 'bcrypt';
import { CustomError } from '../utils/customError.js';

export class UserService {
  constructor(userRepo, authService) {
    this.userRepo = userRepo;
    this.authService = authService;
  }

  async registerUser(username, nickname, password) {
    const existingUser = await this.checkExistingUser(username);

    if (existingUser) {
      throw new CustomError('이미 존재하는 사용자명입니다.', 400);
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepo.createUser(username, nickname, hashedPassword);

    if (!user) {
      throw new CustomError('사용자 정보를 생성할 수 없습니다.', 500);
    }

    return user;
  }

  // 존재하는 사용자명 조회
  async checkExistingUser(username) {
    return await this.userRepo.findUserByUsername(username);
  }

  /**
   * 로그인 요청 처리
   * 1. 아이디/비밀번호 확인
   * 2. authService를 통해 토큰 발급
   * 3. 리프레시 토큰 저장
   */
  async login(username, password) {
    //1. 아이디/비밀번호 확인
    await this.verifyUser(username, password);

    //2. authService를 통해 토큰 발급
    const payload = { username };
    const accessToken = this.authService.generateAccessToken(payload);
    const refreshToken = this.authService.generateRefreshToken(payload);

    // 3. 리프레시 토큰 저장
    await this.userRepo.saveRefreshToken(username, refreshToken);

    return { accessToken, refreshToken };
  }

  // 유저 검증 진행
  async verifyUser(username, password) {
    const user = await this.userRepo.findUserByUsername(username);
    if (!user) {
      throw new CustomError('사용자명 또는 비밀번호가 올바르지 않습니다.', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new CustomError('사용자명 또는 비밀번호가 올바르지 않습니다.', 401);
    }
    return user;
  }

  async refreshAccessToken(token) {
    const newAccessToken = await this.authService.refreshAccessToken(token);

    return newAccessToken;
  }

  async logout(accessToken, currentToken) {
    if (accessToken !== currentToken) {
      throw new CustomError('입력된 토큰이 로그인 된 사용자의 토큰과 일치하지 않습니다.', 400);
    }

    const user = await this.authService.verifyAccessToken(accessToken);
    await this.userRepo.removeRefreshToken(user.username);
  }
}
