import jwt from 'jsonwebtoken';
export class AuthService {
  constructor(userRepo) {
    this.accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    this.refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    this.accessTokenExpiry = '15m';
    this.refreshTokenExpiry = '7d';
    this.userRepo = userRepo;
  }
  generateAccessToken(payload) {
    return jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiry,
    });
  }
  generateRefreshToken(payload) {
    return jwt.sign(payload, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiry,
    });
  }

  verifyAccessToken = async (token) => {
    const accessToken = jwt.verify(token, this.accessTokenSecret);

    const user = await this.userRepo.findUserByUsername(accessToken.username);

    return user;
  };

  verifyRefreshToken(token) {
    return jwt.verify(token, this.refreshTokenSecret);
  }
  refreshAccessToken = async (refreshToken) => {
    const decoded = this.verifyRefreshToken(refreshToken);
    console.log('AuthService ~ refreshAccessToken ~ decoded:', decoded);
    return this.generateAccessToken({ username: decoded.username });
  };
}
