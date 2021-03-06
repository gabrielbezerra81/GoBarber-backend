import { injectable, inject } from "tsyringe";
import { getDaysInMonth, getDate, isAfter } from "date-fns";
import IAppointmentsRepository from "../repositories/IAppointmentsRepository";

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
export default class ListProviderMonthAvailabilityService {
  constructor(
    @inject("AppointmentsRepository")
    private appointmentsRepository: IAppointmentsRepository
  ) {}

  public async execute({
    provider_id,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
      { provider_id, month, year }
    );

    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

    const eachDayArray = Array.from(
      { length: numberOfDaysInMonth },
      (_, index) => index + 1
    );

    const currentDate = new Date(Date.now());

    const availability = eachDayArray.map((day) => {
      const appointmentsInDay = appointments.filter(
        (appointment) => getDate(appointment.date) === day
      );

      const compareDate = new Date(year, month - 1, day, 23, 59, 59);

      const isDateAfter = isAfter(compareDate, currentDate);

      return {
        day,
        available: appointmentsInDay.length < 10 && isDateAfter ? true : false,
      };
    });

    return availability;
  }
}
