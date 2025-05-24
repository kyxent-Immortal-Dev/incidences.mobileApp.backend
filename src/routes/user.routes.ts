
import { LoginController, registerController } from "../controllers/Auth.controller";
import { Request, Response, Router } from "express";


export const initUserService = () => {

    try {
        
        const router = Router()

        router.post("/login", (req: Request, res: Response) => {LoginController(req, res)})
        router.post("/register", (req: Request, res: Response) => {registerController(req, res)})
        return router

    } catch (error) {
        throw new Error(`${error}`);
        
    }
}