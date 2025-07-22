import User from "#app/models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class UserService {
  async findUserByUsername(username) {
    return await User.findOne({ username }).lean();
  }

  async findUserById(userId) {
    return await User.findById(userId).select("-password").lean();
  }

  async hashPassword(password) {
    const salt = await bcrypt.genSalt(12);
    return await bcrypt.hash(password, salt);
  }

  async generateProfilePicture(gender, username) {
    const baseUrl = "https://avatar.iran.liara.run/public";

    return gender === "male"
      ? `${baseUrl}/boy?username=${username}`
      : `${baseUrl}/girl?username=${username}`;
  }

  async createUser(userData) {
    const { fullName, username, password, gender } = userData;

    const existingUser = await this.findUserByUsername(username);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await this.hashPassword(password);

    const profilePic = await this.generateProfilePicture(gender, username);

    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      gender,
      profilePic,
    });

    await newUser.save();

    const { password: _, ...userWithoutPassword } = newUser.toObject();
    return userWithoutPassword;
  }

  formatUserResponse(user) {
    return {
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic,
      gender: user.gender,
      createdAt: user.createdAt,
    };
  }
}

export default new UserService();
