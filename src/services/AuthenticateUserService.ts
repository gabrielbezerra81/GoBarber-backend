import { getCustomRepository } from "typeorm";
import UsersRepository from "../repositories/UsersRepository";
import { compare } from "bcryptjs";
import User from "../models/User";
import { sign } from "jsonwebtoken";
import authConfig from "../config/auth";
import AppError from "../errors/AppError";

interface Request {
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<AuthResponse> {
    const usersRepository = getCustomRepository(UsersRepository);

    const user = await usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new AppError("Incorrect email/password combination.", 401);
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError("Incorrect email/password combination.", 401);
    }

    delete user.password;
    // Usuário autenticado
    // expiresIn: experiência / segurança

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return { user, token };
  }
}

export default AuthenticateUserService;
