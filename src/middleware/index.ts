import { NextFunction } from "express";
import { UserInstance } from "../models/User";
import { jwtService } from "../services/jwtService";
import { userService } from "../services/userService";
import { Express, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface AuthenticatedUserRequest extends Request {
    user?: UserInstance | null;
    file?: any;
    files?: any;
  }
  
  export function ensureUserAuth(
    req: AuthenticatedUserRequest,
    res: Response,
    next: NextFunction
  ) {
    const authorizationHeader = req.headers.authorization;
  
    if (!authorizationHeader) {
      return res
        .status(401)
        .json({ message: "Não autorizado: nenhum token encontrado" });
    }
  
    const token = authorizationHeader.replace(/Bearer /, "");
  
    jwtService.verifyToken(token, (err, decoded) => {
      if (err || typeof decoded === "undefined") {
        return res
          .status(401)
          .json({ message: "Não autorizado: token inválido" });
      }
  
      userService.findByEmail((decoded as JwtPayload).email).then((user) => {
        req.user = user;
        next();
      });
    });
  }