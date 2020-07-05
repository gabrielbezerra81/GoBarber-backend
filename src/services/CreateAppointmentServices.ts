import { startOfHour } from "date-fns";
import Appointment from "../models/Appointment";
import AppointmentsRepository from "../repositories/AppointmentsRepository";
import { getCustomRepository } from "typeorm";
import AppError from "../errors/AppError";

/**
 * [x] Recebimento das informações
 * [x] Tratativa de erros/exceções
 * [x] Acesso ao repositório
 *
 * NEM SEMPRE REPETIR CÓDIGO É RUIM, CASO DAS
 * INTERFACES COM PROVIDER E DATE
 */

// S: Uma unica responsabilidade de criar o Appointment
// D: Dependency Inversion

/**
 * Dependency Inversion
 * Sempre que o service tiver uma dependência externa, ao invés de
 * instanciar o repositório, será recebido como parâmetro no construtor
 */

interface Request {
  provider_id: string;
  date: Date;
}

class CreateAppointmentServices {
  public async execute({ provider_id, date }: Request): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await appointmentsRepository.findByDate(
      appointmentDate
    );

    if (findAppointmentInSameDate) {
      throw new AppError("This appointment is already booked");
    }

    const appointment = appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentServices;
