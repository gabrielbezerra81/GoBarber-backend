import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";
import UpdateProfileService from "./UpdateProfileService";
import AppError from "@shared/errors/AppError";

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe("UpdateProfile", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider
    );
  });

  it("should be able to update the profile", async () => {
    const user = await fakeUsersRepository.create({
      email: "fulano@mail.com",
      name: "fulano",
      password: "123456",
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: "sicrano",
      email: "sicrano@mail.com",
    });

    expect(updatedUser.name).toBe("sicrano");
    expect(updatedUser.email).toBe("sicrano@mail.com");
  });

  it("should be able to change to another user email", async () => {
    await fakeUsersRepository.create({
      email: "sicrano@mail.com",
      name: "sicrano",
      password: "123456",
    });

    const user = await fakeUsersRepository.create({
      email: "fulano@mail.com",
      name: "fulano",
      password: "123456",
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: "sicrano",
        email: "sicrano@mail.com",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to update the password", async () => {
    const user = await fakeUsersRepository.create({
      email: "fulano@mail.com",
      name: "fulano",
      password: "123456",
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: "sicrano",
      email: "sicrano@mail.com",
      old_password: "123456",
      password: "123123",
    });

    expect(updatedUser.password).toBe("123123");
  });

  it("should not be able to update the password without old password", async () => {
    const user = await fakeUsersRepository.create({
      email: "fulano@mail.com",
      name: "fulano",
      password: "123456",
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: "sicrano",
        email: "sicrano@mail.com",
        password: "123123",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to update the password with wrong old password", async () => {
    const user = await fakeUsersRepository.create({
      email: "fulano@mail.com",
      name: "fulano",
      password: "123456",
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: "sicrano",
        email: "sicrano@mail.com",
        old_password: "wrong-old-password",
        password: "123123",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to update the profile from non-existing user", async () => {
    await expect(
      updateProfileService.execute({
        user_id: "non-existing-id",
        name: "sicrano",
        email: "sicrano@mail.com",
        old_password: "wrong-old-password",
        password: "123123",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
