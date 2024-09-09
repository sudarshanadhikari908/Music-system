import { Request, Response } from "express";
import User from "../models/userModel";
import Pagination from "../utils/pagination";
import { buildSearchParams } from "../utils/search";

class UserController {
  static async getUsers(req: Request, res: Response): Promise<Response> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : 10;
      const { limit, offset } = Pagination.getPaginationQuery(page, pageSize);

      const allowedFields = ['first_name', 'last_name', 'email'];

      const searchParams = buildSearchParams(req.query, allowedFields);

      const { users, total } = await User.findAll(limit, offset, searchParams);

      const paginatedResponse = Pagination.paginate(users, total, page, pageSize);

      return res.status(200).json(paginatedResponse);
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ message: "Error fetching users", error });
    }
  }
}

export default UserController;
