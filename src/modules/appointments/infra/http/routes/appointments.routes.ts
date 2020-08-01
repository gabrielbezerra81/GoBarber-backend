import { Router } from "express";
import ensureAuthenticated from "@modules/users/infra/http/middlewares/ensureAuthenticated";
import AppointmentsController from "../controllers/AppointmentsController";
import AppointmentsRepository from "../../typeorm/repositories/AppointmentsRepository";

// SoC: separation of concerns
// DTO: Data Transfer Object => passar parâmetros em objetos

// SOLID

const appointmentsRouter = Router();

const appointmentsController = new AppointmentsController();

appointmentsRouter.use(ensureAuthenticated);

// appointmentsRouter.get("/", async (request, response) => {
// const appointmentsRepository = new AppointmentsRepository();

//   const appointments = await appointmentsRepository.();

//   return response.json(appointments);
// });

appointmentsRouter.post("/", appointmentsController.create);

export default appointmentsRouter;
