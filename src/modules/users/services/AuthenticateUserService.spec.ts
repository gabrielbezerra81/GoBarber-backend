import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import AuthenticateUserService from "./AuthenticateUserService";
import CreateUserService from "./CreateUserService";
import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";
import AppError from "@shared/errors/AppError";

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;
let authenticateUserService: AuthenticateUserService;

describe("AuthenticateUser", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );
    authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );
  });

  it("should be able to authenticate", async () => {
    const user = await createUserService.execute({
      name: "fulano",
      email: "fulano@exemplo.com",
      password: "123456",
    });

    const response = await authenticateUserService.execute({
      email: "fulano@exemplo.com",
      password: "123456",
    });

    await expect(response).toHaveProperty("token");
    await expect(response.user).toEqual(user);
  });

  it("should not be able to authenticate with non existing user", async () => {
    await expect(
      authenticateUserService.execute({ email: "a@a.com", password: "123456" })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to authenticate with incorrect email/password combination", async () => {
    await createUserService.execute({
      name: "fulano",
      email: "fulano@exemplo.com",
      password: "123456",
    });

    await expect(
      authenticateUserService.execute({
        email: "fulano@exemplo.com",
        password: "wrong-pass",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
