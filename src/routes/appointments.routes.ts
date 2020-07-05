import { Router } from "express";
import { parseISO } from "date-fns";
import AppointmentsRepository from "../repositories/AppointmentsRepository";
import CreateAppointmentServices from "../services/CreateAppointmentServices";
import { getCustomRepository } from "typeorm";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";

// SoC: separation of concerns
// DTO: Data Transfer Object => passar parâmetros em objetos

// SOLID

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.get("/", async (request, response) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRepository);

  const appointments = await appointmentsRepository.find();

  return response.json(appointments);
});

appointmentsRouter.post("/", async (request, response) => {
  const { provider_id, date } = request.body;

  const parsedDate = parseISO(date);

  const createAppointmentServices = new CreateAppointmentServices();

  const appointment = await createAppointmentServices.execute({
    provider_id,
    date: parsedDate,
  });

  return response.status(200).json(appointment);
});

export default appointmentsRouter;
