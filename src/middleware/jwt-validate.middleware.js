import { CustomError } from '../utils/customError.js';

export const jwtValidate = (authService) => async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new CustomError('액세스 토큰이 없습니다.', 401));
  }

  try {
    const user = await authService.verifyAccessToken(token);

    if (!user.username) {
      return next(new CustomError('토큰에 유저네임이 없습니다.', 401));
    }

    req.user = user;
    req.token = token;

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new CustomError('액세스 토큰이 만료되었습니다.', 401));
    } else {
      return next(new CustomError('유효하지 않은 액세스 토큰입니다.', 403));
    }
  }
};
