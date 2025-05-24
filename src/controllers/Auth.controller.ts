import { Request, Response } from "express";
import { ModelUser } from "../models/ModelUser";
import { User } from "../interfaces/User.interface";
import bcrypt from 'bcrypt';
import { protectedToken } from "../middlewares/tokenJWT";

const handleLogin = async (data: Partial<User>): Promise<Partial<User> | string> => {
    try {
        const user = await ModelUser.findOne({ email: data.email });

        if (!user) return "Correo inválido";

        const isPasswordValid = await bcrypt.compare(data.password || "", user.password);

        if (!isPasswordValid) return "Contraseña inválida";

        const { password, ...userWithoutPassword } = user.toObject();

        return userWithoutPassword;

    } catch (error) {
        throw new Error(`Error en login: ${error}`);
    }
};


export const LoginController = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const response = await handleLogin({ email, password });

        if (typeof response === "string") {
            res.status(400).json({ msj: response });
            return
        }

        const token = protectedToken(response);

        res.status(200).json({
            msj: "Login exitoso",
            data: response,
            token,
        });

    } catch (error) {
        res.status(500).json({ msj: "Error en el servidor", error: error });
    }
};




const handleRegister = async (data: Partial<User>): Promise<Partial<User>> => {

    try {

        const register = await ModelUser.create(data)

        return register

    } catch (error) {
        throw new Error(`${error}`);

    }
}


export const registerController = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    try {
        const saltMethod = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, saltMethod);

        const response = await handleRegister({
            username,
            email,
            password: encryptedPassword,
        });

        const { password: _, ...userWithoutPassword } = response;

        const token = protectedToken(userWithoutPassword);

        res.status(201).json({
            msj: "Cuenta creada exitosamente",
            data: userWithoutPassword,
            token,
        });

    } catch (error) {
        res.status(500).json({ msj: "Error en el servidor", error: error });
    }
};