import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config/config";

interface CustomJwtPayload extends JwtPayload {
  role: string;
  userId: string;
  email: string;
}

class RoleMiddleware {
  private jwtSecret: string;

  constructor(jwtSecret: string) {
    this.jwtSecret = jwtSecret;
  }

  authenticate(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(403).json({ message: "Access denied" });
    }

    try {
      const decoded = jwt.verify(token, this.jwtSecret) as CustomJwtPayload;
      (req as any).user = decoded;


      
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  }

  authorize(roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(403).json({ message: "Access denied" });
      }

      const userRole = (req.user as unknown as CustomJwtPayload).role;
      if (!roles.includes(userRole)) {
        return res.status(403).json({ message: "Access denied" });
      }

      next();
    };
  }
}

export default new RoleMiddleware(config.jwtSecret);
