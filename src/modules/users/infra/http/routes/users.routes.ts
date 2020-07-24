import { Router } from "express";
import multer from "multer";
import CreateUserService from "@modules/users/services/CreateUserService";
import ensureAuthenticated from "@modules/users/infra/http/middlewares/ensureAuthenticated";
import uploadConfig from "@config/upload";
import UpdateUserAvatarService from "@modules/users/services/UpdateUserAvatarService";

const usersRouter = Router();

const upload = multer(uploadConfig);

/**
 * Repositories
 * Services
 */

usersRouter.post("/", async (request, response) => {
  const { name, email, password } = request.body;

  const createUserService = new CreateUserService();

  const user = await createUserService.execute({ name, email, password });

  delete user.password;

  return response.status(200).json(user);
});

usersRouter.patch(
  "/avatar",
  ensureAuthenticated,
  upload.single("avatar"),
  async (request, response) => {
    const { user, file } = request;

    const updateUserAvatarService = new UpdateUserAvatarService();

    const updatedUser = await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: file.filename,
    });

    return response.json(updatedUser);
  }
);

export default usersRouter;
