import { Request, Response } from "express";
import { container } from "tsyringe";
import { classToClass } from "class-transformer";
import AuthenticateUserService, {
  refreshTokens,
} from "@modules/users/services/AuthenticateUserService";
import AppError from "@shared/errors/AppError";
import authConfig from "@config/auth";
import { decode, sign } from "jsonwebtoken";

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticateUserService = container.resolve(AuthenticateUserService);

    const { user, token, refreshToken } = await authenticateUserService.execute(
      {
        email,
        password,
      },
    );

    return response
      .status(200)
      .json({ user: classToClass(user), token, refreshToken });
  }

  public async update(request: Request, response: Response) {
    const { refreshToken } = request.body;

    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new AppError("JWT token is missing", 401);
    }

    const [, token] = authHeader.split(" ");

    const decoded = decode(token);

    if (refreshToken in refreshTokens) {
      console.log("id === id", refreshTokens[refreshToken].id === decoded?.sub);
      console.log(
        "token === token ",
        refreshTokens[refreshToken].token === token,
      );
      console.log(refreshTokens[refreshToken].token, token);
    }

    if (
      refreshToken in refreshTokens &&
      refreshTokens[refreshToken].id === decoded?.sub &&
      refreshTokens[refreshToken].token === token
    ) {
      const { secret, expiresIn } = authConfig.jwt;

      const newToken = sign({}, secret, {
        subject: decoded?.sub,
        expiresIn,
      });

      console.log("refreshed");

      refreshTokens[refreshToken].token = newToken;

      const tokenCreationDate = new Date();

      return response.json({
        token: {
          token: newToken,
          creationDate: tokenCreationDate,
        },
      });
    } else {
      throw new AppError("Cannot refresh token, something is invalid", 401);
    }
  }
}
