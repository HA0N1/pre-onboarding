import { Role } from '@prisma/client';
export class UserRepo {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findUserByNickname(username) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    return user;
  }

  async register(username, password, nickname) {
    return await this.prisma.user.create({
      data: {
        username,
        password,
        nickname,
        authorities: {
          create: {
            authorityName: Role.ROLE_USER,
          },
        },
      },
      include: {
        authorities: true,
      },
    });
  }

  async login(username, password) {}
}
