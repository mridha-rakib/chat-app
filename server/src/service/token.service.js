import env from "#app/env";
import jwt from "jsonwebtoken";

class TokenService {
  generateAccessToken(userId) {
    return jwt.sign({ userId }, env.ACCESS_TOKEN_SECRET, { expiresIn: "5m" });
  }

  generateRefreshToken(userId) {
    return jwt.sign({ userId }, env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
  }

  generateTokensAndSetCookies(userId, res) {
    const accessToken = this.generateAccessToken(userId);
    const refreshToken = this.generateRefreshToken(userId);

    res.cookie("refreshToken", refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: env.NODE_ENV === "production",
    });

    return { accessToken, refreshToken };
  }

  clearTokenCookies(res) {
    res.clearCookie("refreshToken");
  }
}

export default new TokenService();
