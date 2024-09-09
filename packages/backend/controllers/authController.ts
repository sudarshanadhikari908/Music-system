import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/userModel";
import config from "../config/config";
import { hashPassword } from "../utils/passwordUtil";

interface RegisterRequestBody {
  first_name:string;
  last_name:string;
  username: string;
  email: string;
  password: string;
  role: string;
  dob:string;
  gender:string;
  mobile_number:string;
  address:string;
}

interface LoginRequestBody {
  email: string;
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
    const { username, email, password, role,dob,gender,mobile_number,address,first_name,last_name } = req.body;
    try {
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser.length > 0) {
        res
          .status(400)
          .json({ message: "User with this email already exists." });
        return;
      }

      const hashedPassword = await hashPassword(password);


      await UserModel.create({
        username,
        email,
        password: hashedPassword,
        role,
        dob,
        gender,
        mobile_number,
        address,
        first_name,
        last_name,
      });
      res.status(201).json({ message: "User registered successfully." });
    } catch (err) {
      res.status(500).json({ message: "Server error." });
    }
  }

  async login(
    req: Request<{}, {}, LoginRequestBody>,
    res: Response
  ): Promise<void> {
    const { email, password } = req.body;

    try {
      const user = await UserModel.findByEmail(email);

      if (!user || user.length === 0) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
      }

      const userRecord = user[0];

      const isPasswordValid = await bcrypt.compare(
        password,
        userRecord.password
      );
      if (!isPasswordValid) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
      }

      const accessToken = jwt.sign(
        {
          id: userRecord.id,
          username: userRecord.email,
          role: userRecord.role,
        },
        config.jwtSecret,
        { expiresIn: "1h" }
      );

      const refreshToken = jwt.sign(
        { id: userRecord.id },
        config.jwtSecret, 
        { expiresIn: "7d" } 
      );

      
      await UserModel.storeRefreshToken(userRecord.id, refreshToken);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 3600 * 1000, 
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 3600 * 1000, 
      });

      res.json({
        message: "Login successful",
        role: userRecord.role,
        email: userRecord.email,
        username: userRecord.username,
        firstName: userRecord?.first_name,
        lastName: userRecord?.last_name,
        dob: userRecord?.dob,
        gender: userRecord?.gender,
        address: userRecord?.address
      });
    } catch (err) {
      console.error("Login error: ", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async refreshToken(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      res.status(401).json({ message: "Refresh token not provided" });
      return;
    }

    try {
      const decoded = jwt.verify(refreshToken, config.jwtSecret) as {
        id: number;
      };

      const user = await UserModel.findById(decoded.id);

      if (!user) {
        res.status(401).json({ message: "Invalid refresh token" });
        return;
      }

      const newAccessToken = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        config.jwtSecret,
        { expiresIn: "1h" }
      );

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 3600 * 1000, // 1 hour
      });

      res.json({
        message: "Access token refreshed successfully",
      });
    } catch (err) {
      console.error("Refresh token error: ", err);
      res.status(401).json({ message: "Invalid refresh token" });
    }
  }
  async logout(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies["refreshToken"];

      if (refreshToken) {
        await UserModel.removeRefreshToken(refreshToken);
      }
      res.cookie("accessToken", "", {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        expires: new Date(0),
      });

      res.cookie("refreshToken", "", {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
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
