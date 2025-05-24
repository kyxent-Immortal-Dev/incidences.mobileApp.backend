import { NextFunction, Request, Response } from "express";
import { Enviroments } from "..";
import { User } from "../interfaces/User.interface";
import jwt from 'jsonwebtoken';

interface JwtPayload {
    username: string;
    id: string;
    iat?: number;
    exp?: number;
}

export interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}

export const protectedToken = (user: Partial<User> & { _id?: string }): string => {
    const payload = {
        username: user.username,
        id: user._id || user.id,
    };

    const token = jwt.sign(payload, Enviroments.JWT_SECRET, {
        expiresIn: "7d",
    });

    return token;
};

export const verifyToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            res.status(401).json({
                message: "No token provided"
            });
            return
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            res.status(401).json({
                message: "Invalid token format"
            });
            return
        }

        const decoded = jwt.verify(token, Enviroments.JWT_SECRET) as JwtPayload;


        req.user = decoded;

        next();

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({
                message: "Invalid token"
            });

            return
        }

        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({
                message: "Token expired"
            });
            return
        }

        res.status(500).json({
            message: "Server error",
            error: error
        });
    }
};


export const optionalAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader) {
            const token = authHeader.split(' ')[1];

            if (token) {
                const decoded = jwt.verify(token, Enviroments.JWT_SECRET) as JwtPayload;
                req.user = decoded;
            }
        }

        next();

    } catch (error) {

        next();
    }
};