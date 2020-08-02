import { Router } from "express";
import ensureAuthenticated from "@modules/users/infra/http/middlewares/ensureAuthenticated";
import AppointmentsController from "../controllers/AppointmentsController";
import AppointmentsRepository from "../../typeorm/repositories/AppointmentsRepository";
import ProviderAppointmentsController from "../controllers/ProviderAppointmentsController";

// SoC: separation of concerns
// DTO: Data Transfer Object => passar parâmetros em objetos

// SOLID

const appointmentsRouter = Router();

const appointmentsController = new AppointmentsController();

const providerAppointmentsController = new ProviderAppointmentsController();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.get("/me", providerAppointmentsController.index);

appointmentsRouter.post("/", appointmentsController.create);

export default appointmentsRouter;
