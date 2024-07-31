export class UserController {
  constructor(userService, userRepo) {
    this.userService = userService;
    this.usersRepo = userRepo;
  }

  register = async (req, res) => {
    try {
      const { username, password, nickname } = req.body;

      const createUser = await this.userService.register(username, password, nickname);

      const response = {
        username: createUser.username,
        nickname: createUser.nickname,
        authorities: createUser.authorities.map((auth) => ({
          authorityName: auth.authorityName,
        })),
      };
      return res.status(201).json(response);
    } catch (err) {
      return res.status(500).json({
        error: err.message,
      });
    }
  };

  login = async (req, res) => {
    try {
      const { username, password } = req.body;

      const existingUser = await this.userService.checkExistingUser(username, password);
      if (!existingUser) throw new Error('존재하지 않는 사용자 입니다.');

      const token = await this.userService.login(username, password);

      return res.status(201).json({ token });
    } catch (err) {
      return res.status(500).json({
        error: err.message,
      });
    }
  };
}
