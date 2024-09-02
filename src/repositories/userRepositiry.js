export class UserRepo {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findUserByUsername(username) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: { roles: true },
    });
    return user;
  }

  async createUser(username, nickname, hashedPassword) {
    return this.prisma.user.create({
      data: {
        username,
        nickname,
        password: hashedPassword,
        roles: {
          connectOrCreate: [
            {
              where: { authorityName: 'ROLE_USER' },
              create: { authorityName: 'ROLE_USER' },
            },
          ],
        },
      },
      include: {
        roles: true,
      },
    });
  }

  async saveRefreshToken(username, refreshToken) {
    await this.prisma.user.update({
      where: { username },
      data: { refreshToken: refreshToken },
    });
  }

  async removeRefreshToken(username) {
    this.prisma.user.update({
      where: { username },
      data: { refreshToken: null },
    });
  }
}
