import { Router } from "express";
import { parseISO } from "date-fns";
import { getRepository } from "typeorm";
import AppointmentsRepository from "@modules/appointments/infra/typeorm/repositories/AppointmentsRepository";
import CreateAppointmentServices from "@modules/appointments/services/CreateAppointmentServices";
import ensureAuthenticated from "@modules/users/infra/http/middlewares/ensureAuthenticated";

// SoC: separation of concerns
// DTO: Data Transfer Object => passar parâmetros em objetos

// SOLID

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

// appointmentsRouter.get("/", async (request, response) => {
// const appointmentsRepository = new AppointmentsRepository();

//   const appointments = await appointmentsRepository.find();

//   return response.json(appointments);
// });

appointmentsRouter.post("/", async (request, response) => {
  const { provider_id, date } = request.body;

  const parsedDate = parseISO(date);

  const appointmentsRepository = new AppointmentsRepository();

  const createAppointmentServices = new CreateAppointmentServices(
    appointmentsRepository
  );

  const appointment = await createAppointmentServices.execute({
    provider_id,
    date: parsedDate,
  });

  return response.status(200).json(appointment);
});

export default appointmentsRouter;
