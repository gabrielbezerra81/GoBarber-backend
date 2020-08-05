import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import CreateUserService from "./CreateUserService";
import AppError from "@shared/errors/AppError";
import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";
import FakeCashProvider from "@shared/container/providers/CacheProvider/fakes/FakeCacheProvider";

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;
let fakeCashProvider: FakeCashProvider;

describe("CreateUser", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCashProvider = new FakeCashProvider();

    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCashProvider
    );
  });

  it("should be able to create a new user", async () => {
    const user = await createUserService.execute({
      name: "fulano",
      email: "a@a.com",
      password: "123456",
    });

    await expect(user).toHaveProperty("id");
  });

  it("should not be able to create a new user with already used email", async () => {
    await createUserService.execute({
      name: "fulano",
      email: "a@a.com",
      password: "123456",
    });

    await expect(
      createUserService.execute({
        name: "fulano",
        email: "a@a.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
