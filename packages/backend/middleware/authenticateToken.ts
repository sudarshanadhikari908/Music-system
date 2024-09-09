import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config";

interface JwtPayload {
  id: number;
  username: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

class AuthMiddleware {
  static authenticateToken(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ message: "Access token is required" });
    }

    jwt.verify(token, config.jwtSecret, (err: any, user: any) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }
      req.user = user;
      next();
    });
  }
}

export default AuthMiddleware;
