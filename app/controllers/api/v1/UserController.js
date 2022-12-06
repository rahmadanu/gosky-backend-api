const {
  GeneralError,
  IdNotFoundError,
  MissingFieldError,
} = require('../../../errors');
class UserController {
  constructor(userService, authService) {
    this.userService = userService;
    this.authService = authService;
  }

  handleGetSimpleUser = async (req, res) => {
    try {
      const user = await this.userService.simpleGet(req.params.id);
      if (!user) {
        const err = new IdNotFoundError();
        res.status(404).json(err.json());
        return;
      }
      res.status(200).json({
        status: 'success',
        message: 'get user data success',
        data: user,
      });
    } catch (err) {
      const error = new GeneralError(err.message);
      res.status(500).json(error.json());
    }
  };

  handleUpdateUser = async (req, res) => {
    try {
      const user = req.user;
      const updateBody = {};
      if (req.body.name) updateBody['name'] = req.body.name;
      if (req.body.phone) updateBody['phone'] = req.body.phone;
      if (req.body.address) updateBody['address'] = req.body.address;
      if (req.body.imageId) updateBody['imageId'] = req.body.imageId;
      if (req.body.imageUrl) updateBody['imageUrl'] = req.body.imageUrl;
      const success = await this.userService.update(user.id, updateBody);
      if (success) {
        const newUser = await this.userService.get(user.id);
        res.status(200).json({
          status: 'success',
          message: 'update user data success',
          data: newUser,
        });
      } else {
        throw new GeneralError('update failed');
      };
    } catch (err) {
      const error = new GeneralError(err.message);
      res.status(500).json(error.json());
    }
  };

  handleUpdateUserEmail = async (req, res) => {
    try {
      const user = req.user;
      if (
        !req.body.otp ||
        !req.body.otpToken
      ) {
        const error = new MissingFieldError();
        res.status(400).json(error.json());
        return;
      }
      const verify = this.authService.verifyOtpToken(
          req.body.otp, req.body.otpToken,
      );
      if (!verify) {
        res.status(422).json({
          status: 'failed',
          message: 'wrong otp or invalid otpToken',
        });
        return;
      }
      const otp = this.authService.decodeUserToken(req.body.otpToken);
      const success = await this.userService.update(user.id, {
        email: otp.email,
      });
      if (success) {
        const newUser = this.userService.get(user.id);
        res.status(200).json({
          status: 'success',
          message: 'update user email success',
          data: newUser,
        });
      } else {
        throw new GeneralError('update failed');
      };
    } catch (err) {
      const error = new GeneralError(err.message);
      res.status(500).json(error.json());
    }
  };
};

module.exports = UserController;
