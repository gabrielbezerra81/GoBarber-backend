import { Request, Response } from "express";
import { parseISO } from "date-fns";
import { container } from "tsyringe";
import CreateAppointmentServices from "@modules/appointments/services/CreateAppointmentServices";

export default class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { provider_id, date } = request.body;

    const { id: user_id } = request.user;

    const parsedDate = parseISO(date);

    const createAppointmentServices = container.resolve(
      CreateAppointmentServices
    );

    const appointment = await createAppointmentServices.execute({
      provider_id,
      date: parsedDate,
      user_id,
    });

    return response.status(200).json(appointment);
  }
}
