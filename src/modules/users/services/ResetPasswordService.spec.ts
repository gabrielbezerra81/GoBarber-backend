import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import AppError from "@shared/errors/AppError";
import FakeUserTokensRepository from "../repositories/fakes/FakeUserTokensRepository";
import ResetPasswordService from "./ResetPasswordService";
import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPasswordService: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe("SendForgotPasswordEmail", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider
    );
  });

  it("should be able to reset the password", async () => {
    const generateHash = jest.spyOn(fakeHashProvider, "generateHash");

    const user = await fakeUsersRepository.create({
      name: "fulano",
      email: "fulano@mail.com",
      password: "123456",
    });

    const token = await fakeUserTokensRepository.generate(user.id);

    await resetPasswordService.execute({
      password: "1234567",
      token: token.token,
    });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(updatedUser?.password).toBe("1234567");
    expect(generateHash).toHaveBeenCalledWith("1234567");
  });

  it("should not be able to reset the password with non-existing token", async () => {
    await expect(
      resetPasswordService.execute({
        token: "non-existing-token",
        password: "1234567",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to reset the password with non-existing user", async () => {
    const { token } = await fakeUserTokensRepository.generate(
      "non-existing-user"
    );

    await expect(
      resetPasswordService.execute({
        token,
        password: "1234567",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to reset the password with an expired token", async () => {
    const user = await fakeUsersRepository.create({
      name: "fulano",
      email: "fulano@mail.com",
      password: "123456",
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, "now").mockImplementation(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 2);
    });

    await expect(
      resetPasswordService.execute({
        token,
        password: "1234567",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});

// RED
// GREEN
// REFACTOR
