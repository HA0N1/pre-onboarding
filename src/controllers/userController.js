import { CustomError } from '../utils/customError.js';

export class UserController {
  constructor(userService, authService) {
    this.userService = userService;
    this.authService = authService;
  }

  register = async (req, res, next) => {
    try {
      const { username, nickname, password } = req.body;

      if (!username || !nickname || !password) {
        throw new CustomError('요청 정보가 올바르지 않습니다.', 400);
      }

      const user = await this.userService.registerUser(username, nickname, password);

      res.status(201).json({
        success: true,
        message: '회원가입을 완료하였습니다.',
        data: {
          username: user.username,
          nickname: user.nickname,
          authorities: user.roles.map((role) => role.authorityName),
        },
      });
    } catch (err) {
      next(err);
    }
  };

  login = async (req, res, next) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        throw new CustomError('요청 정보가 올바르지 않습니다.', 400);
      }

      const { accessToken, refreshToken } = await this.userService.login(username, password);

      res.status(200).json({
        success: true,
        message: '로그인에 성공하였습니다.',
        data: { accessToken, refreshToken },
      });
    } catch (err) {
      next(err);
    }
  };

  // 새로운 Accese Token 발급
  refreshToken = async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw new CustomError('올바른 리프레쉬 토큰을 입력해야합니다.', 400);
      }
      const newAccessToken = await this.userService.refreshAccessToken(refreshToken);
      res.status(200).json({
        success: true,
        message: '새 액세스 토큰 발급에 성공하였습니다.',
        data: { accessToken: newAccessToken },
      });
    } catch (err) {
      next(err);
    }
  };

  logout = async (req, res, next) => {
    try {
      const { accessToken } = req.body;
      const currentToken = req.token;

      await this.userService.logout(accessToken, currentToken);

      res.status(200).json({ success: true, message: '로그아웃 되었습니다.' });
    } catch (err) {
      next(err);
    }
  };
}
