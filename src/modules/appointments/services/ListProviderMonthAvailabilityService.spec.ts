import "reflect-metadata";
import ListProviderMonthAvailabilityService from "./ListProviderMonthAvailabilityService";
import FakeAppointmentsRepository from "../repositories/fakes/FakeAppointmentRepository";

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailabilityService: ListProviderMonthAvailabilityService;

describe("ListProviderMonthAvailability", () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailabilityService = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository
    );
  });

  it("should be able to list the month availability from provider", async () => {
    const appointmentsHours = Array.from({ length: 10 }, (_, key) => key + 8);

    for await (const hour of appointmentsHours) {
      await fakeAppointmentsRepository.create({
        date: new Date(2020, 4, 20, hour, 0, 0),
        provider_id: "user",
        user_id: "user-id",
      });
    }

    await fakeAppointmentsRepository.create({
      date: new Date(2020, 4, 21, 17, 0, 0),
      provider_id: "user",
      user_id: "user-id",
    });

    const availability = await listProviderMonthAvailabilityService.execute({
      provider_id: "user",
      year: 2020,
      month: 5,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: false },
        { day: 21, available: true },
        { day: 22, available: true },
      ])
    );
  });
});
