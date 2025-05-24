import { NextFunction, Request,  Response } from "express";
import { Enviroments } from "..";
import { User } from "../interfaces/User.interface";
import jwt from 'jsonwebtoken';



export const protectedToken = (user: Partial<User>): string => {
    const payload = {
        username: user.username,
    };

    const token = jwt.sign(payload, Enviroments.JWT_SECRET, {
        expiresIn: "7d", 
    });

    return token;
};


export const verifyToken = async(req:Request, res:Response , next: NextFunction) => {

    const token = req.body

    try {
        
        const verify = jwt.verify(token, Enviroments.JWT_SECRET)

        if(!verify){
            res.status(400).json({
                msj : "invalid token"
            })
        }

        next()


    } catch (error) {
        res.status(500).json({
            msj : "server error",
            error: error
        })
    }


}