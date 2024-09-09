import { Request, Response } from "express";
import User from "../models/userModel";
import Pagination from "../utils/pagination";
import { buildSearchParams } from "../utils/search";
import { hashPassword } from "../utils/passwordUtil";

class UserController {
  static async getUsers(req: Request, res: Response): Promise<Response> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const pageSize = req.query.pageSize
        ? parseInt(req.query.pageSize as string, 10)
        : 10;
      const { limit, offset } = Pagination.getPaginationQuery(page, pageSize);

      const allowedFields = ["first_name", "last_name", "email"];

      const searchParams = buildSearchParams(req.query, allowedFields);

      const { users, total } = await User.findAll(limit, offset, searchParams);

      const paginatedResponse = Pagination.paginate(
        users,
        total,
        page,
        pageSize
      );

      return res.status(200).json(paginatedResponse);
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ message: "Error fetching users", error });
    }
  }
  static async getUserById(req: Request, res: Response): Promise<void> {
    const userId: number = parseInt(req.params.id, 10);

    try {
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
  public static async createUser(req: Request, res: Response): Promise<void> {
    const {
      username,
      email,
      password,
      role,
      dob,
      gender,
      mobile_number,
      address,
      first_name,
      last_name,
    } = req.body;
    try {
      const existingUser = await User.findByEmail(email);
      if (existingUser.length > 0) {
        res
          .status(400)
          .json({ message: "User with this email already exists." });
        return;
      }
      const hashedPassword = await hashPassword(password);
      await User.create({
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
      res.status(201).json({ message: "User created successfully." });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Server error", error });
      return;
    }
  }

  public static async updateUser(req: Request, res: Response): Promise<void> {
    const userId: number = parseInt(req.params.id, 10);
    const userData = req.body;

    if (isNaN(userId)) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    try {
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      const existingUser = await User.findByEmail(userData?.email);
      if (existingUser.length > 0) {
        res
          .status(400)
          .json({ message: "User with this email already exists." });
        return;
      }

      const updatedUser = await User.updateById(userId, userData);

      if (updatedUser) {
        res.json({ message: "User updated successfully", user: updatedUser });
      } else {
        res.status(500).json({ message: "Failed to update user" });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  public static async deleteUser(req: Request, res: Response): Promise<void> {
    const userId: number = parseInt(req.params.id, 10);

    if (isNaN(userId)) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }
    try {
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      const isDeleted = await User.deleteById(userId);
      if (isDeleted) {
        res.status(200).json({ message: "User deleted successfully" });
      } else {
        res.status(500).json({ message: "Failed to delete user" });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
}

export default UserController;
