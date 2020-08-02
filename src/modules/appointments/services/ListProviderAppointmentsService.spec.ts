import "reflect-metadata";
import FakeAppointmentsRepository from "../repositories/fakes/FakeAppointmentRepository";
import ListProviderAppointmentsService from "./ListProviderAppointmentsService";
import Appointment from "../infra/typeorm/entities/Appointment";

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointmentsService: ListProviderAppointmentsService;

describe("ListProviderAppointments", () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderAppointmentsService = new ListProviderAppointmentsService(
      fakeAppointmentsRepository
    );
  });

  it("should be able to list the appointments in a day from a provider", async () => {
    jest.spyOn(Date, "now").mockImplementation(() => {
      return new Date(2020, 4, 20, 11).getTime();
    });

    const appointment1 = await fakeAppointmentsRepository.create({
      date: new Date(2020, 4, 20, 14, 0, 0),
      provider_id: "provider-id",
      user_id: "user-id",
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      date: new Date(2020, 4, 20, 15, 0, 0),
      provider_id: "provider-id",
      user_id: "user-id",
    });

    const appointments = await listProviderAppointmentsService.execute({
      provider_id: "provider-id",
      year: 2020,
      month: 5,
      day: 20,
    });

    expect(appointments).toEqual([appointment1, appointment2]);
  });
});
