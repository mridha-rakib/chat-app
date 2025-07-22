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

const logout = asyncHandler(async (req, res) => {
  TokenService.clearTokenCookies(res);

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

export const UserController = { signup, login, logout };
