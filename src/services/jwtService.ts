require("dotenv").config();
import jwt from "jsonwebtoken";


const secret = String(process.env.JWT_SECRET);


export const jwtService = {
    signToken: (payload: string | object | Buffer, expiration: string) => {
        return jwt.sign(payload, secret, { expiresIn: expiration });
    },

    verifyToken: (token: string, callbackfn: jwt.VerifyCallback) => {
        jwt.verify(token, secret, callbackfn);
    }
}