import { asyncHandler } from "#app/middlewares/async-handler.middleware";

const signup = asyncHandler(async (req, res) => {
  const userData = req.body;

  const newUser = await UserService.createUser(userData);
});

const login = asyncHandler(async (req, res) => {
  // Handle login logic
});

export const UserController = { signup, login };
