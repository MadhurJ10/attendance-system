import userModel from "../models/user.model.js";
import { comparePassword, genPassword } from "../utils/hashing.js";
import { jwtToken } from "../utils/jwtUtil.js";

class AuthService {
  async register(data) {
    const check = await userModel.findOne({ email: data.email });

    if (check) {
      throw new Error("User already exists");
    }

    const hashedPassword = await genPassword(data.password);

    const user = await userModel.create({
      email: data.email,
      password: hashedPassword,
    });

    return user;
  }

  async login(data) {
    const check = await userModel.findOne({ email: data.email });

    if (!check) {
      throw new Error("No user found");
    }

    const isMatch = await comparePassword(data.password, check.password);

    if (!isMatch) {
      throw new Error("Wrong password");
    }

    const token = jwtToken(check._id);
    return token;
  }
}

export default AuthService;
