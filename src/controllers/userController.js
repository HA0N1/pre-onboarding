import Joi from 'joi';

const userJoi = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  nickname: Joi.string().required(),
});

export class UserController {
  constructor(userService, userRepo) {
    this.userService = userService;
    this.usersRepo = userRepo;
  }

  register = async (req, res, next) => {
    try {
      const { username, password, nickname } = await userJoi.validateAsync(req.body);

      const createUser = await this.userService.register(username, password, nickname);

      const response = {
        username: createUser.username,
        nickname: createUser.nickname,
        authorities: createUser.authorities.map((auth) => ({
          authorityName: auth.authorityName,
        })),
      };

      // Send the response
      return res.status(201).json(response);
    } catch (err) {
      return res.status(500).json({
        error: err.message,
      });
    }
  };
}
