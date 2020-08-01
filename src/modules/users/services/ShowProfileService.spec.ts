import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import AppError from "@shared/errors/AppError";
import ShowProfileService from "./ShowProfileService";

let fakeUsersRepository: FakeUsersRepository;
let showProfileService: ShowProfileService;

describe("ShowProfile", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showProfileService = new ShowProfileService(fakeUsersRepository);
  });

  it("should be able to show the profile", async () => {
    const user = await fakeUsersRepository.create({
      email: "fulano@mail.com",
      name: "fulano",
      password: "123456",
    });

    const profile = await showProfileService.execute({
      user_id: user.id,
    });

    expect(profile.name).toBe("fulano");
    expect(profile.email).toBe("fulano@mail.com");
  });

  it("should not be able to show the profile from non-existing user", async () => {
    await expect(
      showProfileService.execute({
        user_id: "non-existing-id",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
