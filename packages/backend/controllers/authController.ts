import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/userModel";
import config from "../config/config";

interface RegisterRequestBody {
  username: string;
  email: string;
  password: string;
  role: string;
}

interface LoginRequestBody {
  username: string;
  password: string;
}

class AuthController {
  constructor() {
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
  }

  async register(
    req: Request<{}, {}, RegisterRequestBody>,
    res: Response
  ): Promise<void> {
    const { username, email, password, role } = req.body;
    try {
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser.length > 0) {
        res
          .status(400)
          .json({ message: "User with this email already exists." });
        return;
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      await UserModel.create({
        username,
        email,
        password: hashedPassword,
        role,
      });
      res.status(201).json({ message: "User registered successfully." });
    } catch (err) {
      console.error("Registration error: ", err);
      res.status(500).json({ message: "Server error." });
    }
  }

  async login(req: Request<{}, {}, LoginRequestBody>, res: Response): Promise<void> {
    const { username, password } = req.body;

    try {
        const user = await UserModel.findByUsername(username);

        if (!user || user.length === 0) {
            res.status(401).json({ message: "Invalid username or password" });
            return;
        }

        const userRecord = user[0];

        const isPasswordValid = await bcrypt.compare(password, userRecord.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid username or password" });
            return;
        }

        const accessToken = jwt.sign(
            { id: userRecord.id, username: userRecord.username, role: userRecord.role },
            config.jwtSecret as string,
            { expiresIn: '1h' }
        );

        const refreshToken = jwt.sign(
            { id: userRecord.id },
            config.jwtSecret as string, // Use a different secret or options for added security
            { expiresIn: '7d' } // Longer expiration time
        );

        // Store the refresh token in the database or in-memory store
        // For example:
        await UserModel.storeRefreshToken(userRecord.id, refreshToken);

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 3600 * 1000, // 1 hour
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 7 * 24 * 3600 * 1000, // 7 days
        });

        res.json({
            message: "Login successful",
            role: userRecord.role,
            email: userRecord.email,
            username: userRecord.username,
        });
    } catch (err) {
        console.error("Login error: ", err);
        res.status(500).json({ message: "Internal server error" });
    }
}
async  refreshToken(req: Request, res: Response): Promise<void> {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
      res.status(401).json({ message: 'Refresh token not provided' });
      return;
  }

  try {
      const decoded = jwt.verify(refreshToken, config.jwtSecret as string) as { id: number };

      const user = await UserModel.findById(decoded.id);

      if (!user) {
          res.status(401).json({ message: 'Invalid refresh token' });
          return;
      }

      const newAccessToken = jwt.sign(
          { id: user.id, username: user.username, role: user.role },
          config.jwtSecret as string,
          { expiresIn: '1h' }
      );

      res.cookie('accessToken', newAccessToken, {
          httpOnly: true,
          secure: false,
          sameSite: 'strict',
          maxAge: 3600 * 1000, // 1 hour
      });

      res.json({
          message: 'Access token refreshed successfully',
      });
  } catch (err) {
      console.error('Refresh token error: ', err);
      res.status(401).json({ message: 'Invalid refresh token' });
  }
}
async logout(req: Request, res: Response): Promise<void> {
  try {
      const refreshToken = req.cookies['refreshToken'];

      if (refreshToken) {
          await UserModel.removeRefreshToken(refreshToken);
      }

      res.cookie('accessToken', '', {
          httpOnly: true,
          secure: false, 
          sameSite: 'strict',
          expires: new Date(0),
      });

      res.cookie('refreshToken', '', {
          httpOnly: true,
          secure: false,
          sameSite: 'strict',
          expires: new Date(0),
      });

      res.json({ message: "Logout successful" });
  } catch (err) {
      console.error("Logout error: ", err);
      res.status(500).json({ message: "Internal server error" });
  }
}

}

export default new AuthController();
