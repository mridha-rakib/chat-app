import User from "#app/models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class UserService {
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(12);
    return await bcrypt.hash(password, salt);
  }

  async createUser(userData) {
    const { fullName, username, password, gender } = userData;

    const existingUser = await this.findUserByUsername(username);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await this.hashPassword(password);

    const profilePic


  }
}
