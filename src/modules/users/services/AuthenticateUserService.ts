import User from "@modules/users/infra/typeorm/entities/User";
import { sign } from "jsonwebtoken";
import authConfig from "@config/auth";
import AppError from "@shared/errors/AppError";
import IUsersRepository from "../repositories/IUsersRepository";
import { injectable, inject } from "tsyringe";
import IHashProvider from "../providers/HashProvider/models/IHashProvider";
import { uuid } from "uuidv4";

interface IRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  token: {
    token: string;
    creationDate: Date;
  };
  refreshToken: string;
}

interface RefreshTokens {
  [key: string]: any;
}

export var refreshTokens: RefreshTokens = {};

@injectable()
class AuthenticateUserService {
  constructor(
    @inject("UsersRepository") private usersRepository: IUsersRepository,
    @inject("HashProvider") private hashProvider: IHashProvider,
  ) {}

  public async execute({ email, password }: IRequest): Promise<AuthResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Incorrect email/password combination.", 401);
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatched) {
      throw new AppError("Incorrect email/password combination.", 401);
    }
    // Usuário autenticado
    // expiresIn: experiência / segurança

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    const refreshToken = uuid();

    refreshTokens[refreshToken] = {
      id: user.id,
      token,
    };

    const tokenCreationDate = new Date();

    return {
      user,
      token: { token, creationDate: tokenCreationDate },
      refreshToken,
    };
  }
}

export default AuthenticateUserService;
