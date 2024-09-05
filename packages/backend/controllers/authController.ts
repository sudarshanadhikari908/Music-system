import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import UserModel from '../models/userModel';

interface RegisterRequestBody {
  username: string;
  email: string;
  password: string;
  role: string;
}

export const register = async (req: Request<{}, {}, RegisterRequestBody>, res: Response): Promise<void> => {
  const { username, email, password, role } = req.body;

  try {
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser.length > 0) {
      res.status(400).json({ message: 'User with this email already exists.' });
      return;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await UserModel.create({ username, email, password: hashedPassword, role });
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error('Registration error: ', err);
    res.status(500).json({ message: 'Server error.' });
  }
};
