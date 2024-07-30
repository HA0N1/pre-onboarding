import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
export class UserService {
  constructor(userRepo) {
    this.userRepo = userRepo;
  }

  register = async (username, password, nickname) => {
    const existingUser = await this.checkExistingUser(username);
    if (existingUser) throw new Error('이미 존재하는 username 입니다.');

    const hashedPassword = await bcrypt.hash(password, 10);
    const createUser = await this.userRepo.register(username, hashedPassword, nickname);
    console.log('UserService ~ register= ~ createUser:', createUser);

    return createUser;
  };

  async checkExistingUser(username) {
    const user = await this.userRepo.findUserByName(username);
    return user;
  }

  async login(username, password) {
    const existingUser = await this.checkExistingUser(username);
    if (existingUser.username !== username || !(await bcrypt.compare(password, existingUser.password)))
      throw new Error('입력하신 정보가 잘못되었습니다.');

    const token = jwt.sign({ username: existingUser.username }, process.env.TOKEN_SECRET_KEY, { expiresIn: '12h' });

    return token;
  }
}
