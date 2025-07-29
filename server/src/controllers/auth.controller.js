import { signupSchema, loginSchema } from "#app/schemas/user.schema";
import UserService from "#app/service/user.service";
import { asyncHandler } from "#app/middlewares/async-handler.middleware";
import { zParse } from "#app/utils/validators.utils";
import TokenService from "#app/service/token.service";
import { HTTPSTATUS } from "#app/config/http.config";

const signup = asyncHandler(async (req, res) => {
  const { body: userData } = await zParse(signupSchema, req);

  const newUser = await UserService.createUser(userData);

  const { accessToken } = TokenService.generateTokensAndSetCookies(newUser._id, res);

  const userResponse = UserService.formatUserResponse(newUser);

  res.status(HTTPSTATUS.CREATED).json({
    success: true,
    message: "User created successfully",
    data: {
      user: userResponse,
      accessToken,
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { body: userData } = await zParse(loginSchema, req);

  const user = await UserService.authenticateUser(userData);

  const { accessToken } = TokenService.generateTokensAndSetCookies(user._id, res);

  const userResponse = UserService.formatUserResponse(user);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: userResponse,
      accessToken,
    },
  });
});

const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  const user = await UserService.validateRefreshToken(refreshToken);

  const accessToken = TokenService.generateAccessToken(user._id);

  res.status(200).json({
    success: true,
    message: "Token refreshed successfully",
    data: { accessToken },
  });
});

const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const user = await UserService.findUserById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const userResponse = UserService.formatUserResponse(user);

  res.status(200).json({
    success: true,
    message: "Profile retrieved successfully",
    data: { user: userResponse },
  });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await UserService.findUsers();

  const usersResponse = users.map((user) => UserService.formatUserResponse(user));

  res.status(200).json({
    success: true,
    message: "Users data retrieved successfully",
    data: { users: usersResponse },
  });
});

const logout = asyncHandler(async (req, res) => {
  TokenService.clearTokenCookies(res);

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

export const UserController = { signup, login, getProfile, getAllUsers, refresh, logout };
