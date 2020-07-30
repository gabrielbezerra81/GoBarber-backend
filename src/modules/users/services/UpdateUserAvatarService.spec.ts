import "reflect-metadata";
import FakeStorageProvider from "@shared/container/providers/StorageProvider/fakes/FakeStorageProvider";
import UpdateUserAvatarService from "./UpdateUserAvatarService";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";
import CreateUserService from "./CreateUserService";
import AppError from "@shared/errors/AppError";

let fakeStorageProvider: FakeStorageProvider;
let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;
let updateUserAvatarService: UpdateUserAvatarService;

describe("UpdateUserAvatar", () => {
  beforeEach(() => {
    fakeStorageProvider = new FakeStorageProvider();
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider
    );
  });

  it("should be able to update avatar", async () => {
    const user = await createUserService.execute({
      name: "gabriel",
      email: "a@a.com",
      password: "123456",
    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: "avatar.jpg",
    });

    await expect(user.avatar).toBe("avatar.jpg");
  });

  it("should be able to update avatar from non existing user", async () => {
    await expect(
      updateUserAvatarService.execute({
        user_id: "non-existing-user",
        avatarFilename: "avatar.jpg",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should delete old avatar when updating with a new one", async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, "deleteFile");

    const user = await createUserService.execute({
      name: "gabriel",
      email: "a@a.com",
      password: "123456",
    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: "avatar.jpg",
    });

    // spy

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: "avatar2.jpg",
    });

    await expect(deleteFile).toHaveBeenCalledWith("avatar.jpg");
    await expect(user.avatar).toBe("avatar2.jpg");
  });
});
