import FakeUsersRepository from "@modules/users/repositories/fakes/FakeUsersRepository";
import ListProvidersService from "./ListProvidersService";
import FakeCashProvider from "@shared/container/providers/CacheProvider/fakes/FakeCacheProvider";

let fakeUsersRepository: FakeUsersRepository;
let listProvidersService: ListProvidersService;
let fakeCashProvider: FakeCashProvider;

describe("ShowProfile", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCashProvider = new FakeCashProvider();

    listProvidersService = new ListProvidersService(
      fakeUsersRepository,
      fakeCashProvider
    );
  });

  it("should be able to list the providers", async () => {
    const loggedUser = await fakeUsersRepository.create({
      email: "gabriel@mail.com",
      name: "gabriel",
      password: "123456",
    });

    const user1 = await fakeUsersRepository.create({
      email: "fulano@mail.com",
      name: "fulano",
      password: "123456",
    });

    const user2 = await fakeUsersRepository.create({
      email: "sicrano@mail.com",
      name: "sicrano",
      password: "123456",
    });

    const providers = await listProvidersService.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});
