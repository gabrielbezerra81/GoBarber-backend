import { Router } from "express";
import AuthenticateUserService from "@modules/users/services/AuthenticateUserService";
import UsersRepository from "../../typeorm/repositories/UsersRepository";

const sessionsRouter = Router();



sessionsRouter.post("/", async (request, response) => {
  const { email, password } = request.body;

  const usersRepository = new UsersRepository();

  const authenticateUserService = new AuthenticateUserService(usersRepository);

  const { user, token } = await authenticateUserService.execute({
    email,
    password,
  });

  return response.status(200).json({ user, token });
});

export default sessionsRouter;
