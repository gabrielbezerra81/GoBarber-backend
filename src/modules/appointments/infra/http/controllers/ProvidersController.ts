import { Request, Response } from "express";
import { container } from "tsyringe";
import ListProvidersService from "@modules/appointments/services/ListProvidersService";
import { classToClass } from "class-transformer";

export default class ProvidersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { id: user_id } = request.user;

    const listProvidersService = container.resolve(ListProvidersService);

    const providers = await listProvidersService.execute({ user_id });

    return response.status(200).json(classToClass(providers));
  }
}
