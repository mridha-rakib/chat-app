import User from "#app/models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class UserService {
  async findUsers() {
    return await User.find();
  }

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

  async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async generateProfilePicture(gender, username) {
    const baseUrl = "https://avatar.iran.liara.run/public";

    return gender === "male"
      ? `${baseUrl}/boy?username=${username}`
      : `${baseUrl}/girl?username=${username}`;
  }

  async createUser(userData) {
    const { fullName, username, email, password, gender } = userData;

    const existingUser = await this.findUserByUsername(username);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await this.hashPassword(password);

    const profilePic = await this.generateProfilePicture(gender, username);

    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
      gender,
      profilePic,
    });

    await newUser.save();

    const { password: _, ...userWithoutPassword } = newUser.toObject();
    return userWithoutPassword;
  }

  async authenticateUser({ username, password }) {
    const user = await User.findOne({ username });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await this.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const { password: _, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }

  async validateRefreshToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      return await this.findUserById(decoded.userId);
    } catch (error) {
      throw new Error("Invalid or expired refresh token");
    }
  }

  formatUserResponse(user) {
    return {
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
      gender: user.gender,
      createdAt: user.createdAt,
    };
  }
}

export default new UserService();
