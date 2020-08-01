import User from "@modules/users/infra/typeorm/entities/User";
import AppError from "@shared/errors/AppError";
import IUsersRepository from "../repositories/IUsersRepository";
import { inject, injectable } from "tsyringe";
import IStorageProvider from "@shared/container/providers/StorageProvider/models/IStorageProvider";

interface IRequest {
  user_id: string;
  avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject("UsersRepository") private usersRepository: IUsersRepository,
    @inject("StorageProvider") private storageProvider: IStorageProvider
  ) {}

  public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError("Only authenticated users can change avatar.", 401);
    }

    if (user.avatar) {
      // Deletar avatar anterior
      await this.storageProvider.deleteFile(user.avatar);
    }

    const fileName = await this.storageProvider.saveFile(avatarFilename);

    user.avatar = fileName;

    // Funciona para atualizar ou criar um novo usuario
    await this.usersRepository.save(user);

    delete user.password;

    return user;
  }
}

export default UpdateUserAvatarService;
