import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
export class UserService {
  constructor(userRepo) {
    this.userRepo = userRepo;
  }

  register = async (username, password, nickname) => {
    await this.checkExistingUser(nickname);
    const hashedPassword = await bcrypt.hash(password, 10);
    const createUser = await this.userRepo.register(username, hashedPassword, nickname);
    return createUser;
  };

  async checkExistingUser(nickname) {
    const existingUser = await this.userRepo.findUserByNickname(nickname);
    if (existingUser) throw new Error('이미 존재하는 이메일 입니다.');
  }
}
