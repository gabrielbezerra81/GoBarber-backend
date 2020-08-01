import { Router } from "express";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";
import ProfileController from "../controllers/ProfileController";

const profileRouter = Router();

profileRouter.use(ensureAuthenticated);

const profileController = new ProfileController();

profileRouter.get("/", profileController.show);

profileRouter.put("/", profileController.update);

export default profileRouter;
