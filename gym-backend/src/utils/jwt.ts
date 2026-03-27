import config from "../config";
import Jwt from "jsonwebtoken";

const JWT_SECRET = config.jwt_secretUrl;

export const generateToken = (userId: number) => {
    if (!JWT_SECRET){
        throw new Error("JWT_SECRET is not defined in env")
    }
    return Jwt.sign({id: userId}, JWT_SECRET, {
        expiresIn: "1d",
    });
};