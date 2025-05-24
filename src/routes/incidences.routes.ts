import { Request, Response, Router } from "express";
import { incidencesController } from "../controllers/Incidences.controller";
import { verifyToken } from "../middlewares/tokenJWT";

export const initIncidencesService = () => {
    try {
        const router = Router();

        router.use(verifyToken);


        router.post("/incidences", incidencesController.create);
        router.get("/incidences", incidencesController.getAll);
        router.get("/incidences/my", incidencesController.getMyIncidences);
        router.get("/incidences/:id", incidencesController.getById);
        router.put("/incidences/:id", incidencesController.update);
        router.delete("/incidences/:id", incidencesController.delete);

        return router;

    } catch (error) {
        throw new Error(`${error}`);
    }
};