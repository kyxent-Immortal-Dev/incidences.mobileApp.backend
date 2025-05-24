import { Router } from "express";
import { LoginController, registerController } from "../controllers/Auth.controller";
import { userController } from "../controllers/User.controller";
import { verifyToken } from "../middlewares/tokenJWT";

export const initUserService = () => {
    try {
        const router = Router();

        router.post("/login", LoginController);
        router.post("/register", registerController);


        router.get("/profile", verifyToken, userController.getProfile);
        router.get("/", verifyToken, userController.getAll);
        router.get("/:id", verifyToken, userController.getById);
        router.put("/:id", verifyToken, userController.update);
        router.delete("/:id", verifyToken, userController.delete);

        return router;

    } catch (error) {
        throw new Error(`${error}`);
    }
};