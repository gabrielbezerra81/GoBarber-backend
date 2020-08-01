import "reflect-metadata";
import CreateAppointmentService from "./CreateAppointmentServices";
import FakeAppointmentsRepository from "../repositories/fakes/FakeAppointmentRepository";
import AppError from "@shared/errors/AppError";

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointmentService: CreateAppointmentService;

describe("CreateAppointment", () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository
    );
  });

  it("should be able to create a new appointment", async () => {
    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      return new Date(2020, 4, 20, 10, 0, 0).getTime();
    });

    const appointment = await createAppointmentService.execute({
      date: new Date(2020, 4, 20, 11, 0, 0),
      provider_id: "provider-id",
      user_id: "user-id",
    });

    await expect(appointment).toHaveProperty("id");
    await expect(appointment.provider_id).toBe("provider-id");
    await expect(appointment.user_id).toBe("user-id");
  });

  it("should not be able to create two appointment on the same date", async () => {
    const date = new Date(2020, 4, 20, 11, 0, 0);

    jest.spyOn(Date, "now").mockImplementation(() => {
      return new Date(2020, 4, 20, 10, 0, 0).getTime();
    });

    await createAppointmentService.execute({
      date,
      provider_id: "provider-id",
      user_id: "user-id",
    });

    await expect(
      createAppointmentService.execute({
        date,
        provider_id: "provider-id",
        user_id: "user-id",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create an appointment on a past date", async () => {
    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      return new Date(2020, 4, 20, 10, 0, 0).getTime();
    });

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 4, 20, 9, 0, 0),
        provider_id: "provider-id",
        user_id: "user-id",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create an appointment with same user as provider", async () => {
    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      return new Date(2020, 4, 20, 10, 0, 0).getTime();
    });

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 4, 20, 11, 0, 0),
        provider_id: "user-id",
        user_id: "user-id",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create an appointment before 8am or after 5pm", async () => {
    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      return new Date(2020, 4, 20, 10, 0, 0).getTime();
    });

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 4, 21, 7, 0, 0),
        provider_id: "user-id",
        user_id: "provider-id",
      })
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 4, 21, 18, 0, 0),
        provider_id: "user-id",
        user_id: "provider-id",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
