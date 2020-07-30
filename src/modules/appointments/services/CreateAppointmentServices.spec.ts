import "reflect-metadata";
import CreateAppointmentService from "./CreateAppointmentServices";
import FakeAppointmentsRepository from "../repositories/fakes/FakeAppointmentRepository";
import AppError from "@shared/errors/AppError";

describe("CreateAppointment", () => {
  it("should be able to create a new appointment", async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository
    );

    const appointment = await createAppointmentService.execute({
      date: new Date(),
      provider_id: "jda12312831",
    });

    await expect(appointment).toHaveProperty("id");
    await expect(appointment.provider_id).toBe("jda12312831");
  });

  it("should not be able to create two appointment on the same date", async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository
    );

    const date = new Date();

    await createAppointmentService.execute({
      date,
      provider_id: "jda12312831",
    });

    await expect(
      createAppointmentService.execute({
        date,
        provider_id: "jda12312831",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
