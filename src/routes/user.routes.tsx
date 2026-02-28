import { Router } from "express";
import { getUsers } from "../controllers/user.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.use(requireAuth);
userRouter.get("/", getUsers);

export default userRouter;
