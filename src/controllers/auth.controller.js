import AuthService from "../services/auth.service.js";

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  register = async (req, res) => {
    try {
      const data = req.body;
      const result = await this.authService.register(data);

      return res.json({
        msg: "register done",
        result,
      });
    } catch (error) {
      return res.status(500).json({
        msg: "error",
        error: error.message,
      });
    }
  };

  login = async (req, res) => {
    try {
      const data = req.body;
      const token = await this.authService.login(data);

      return res.json({
        msg: "login done",
        token,
      });
    } catch (error) {
      return res.status(401).json({
        msg: "error",
        error: error.message,
      });
    }
  };
}

export default new AuthController();
