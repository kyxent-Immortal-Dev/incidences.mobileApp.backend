import { Request, Response } from "express";
import { ModelUser } from "../models/ModelUser";
import { User } from "../interfaces/User.interface";
import bcrypt from 'bcrypt';

const userRepository = () => ({
  getAll: async (): Promise<User[]> => {
    try {
      const users = await ModelUser.find().select('-password');
      return users;
    } catch (error) {
      throw new Error(`${error}`);
    }
  },

  getById: async (id: string): Promise<User | null> => {
    try {
      const user = await ModelUser.findById(id).select('-password');
      return user;
    } catch (error) {
      throw new Error(`${error}`);
    }
  },

  update: async (id: string, data: Partial<User>): Promise<User | null> => {
    try {

      if (data.password) {
        const saltMethod = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, saltMethod);
      }

      const updatedUser = await ModelUser.findByIdAndUpdate(
        id,
        data,
        { new: true }
      ).select('-password');

      return updatedUser;
    } catch (error) {
      throw new Error(`${error}`);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await ModelUser.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`${error}`);
    }
  },

  getByEmail: async (email: string): Promise<User | null> => {
    try {
      const user = await ModelUser.findOne({ email }).select('-password');
      return user;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
});

export const userController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const repository = userRepository();
      const users = await repository.getAll();

      res.status(200).json({
        message: "Users retrieved successfully",
        data: users
      });
    } catch (error) {
      res.status(500).json({
        message: "Server error",
        error: error
      });
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const repository = userRepository();
      const user = await repository.getById(id);

      if (!user) {
        res.status(404).json({
          message: "User not found"
        });
        return
      }

      res.status(200).json({
        message: "User retrieved successfully",
        data: user
      });
    } catch (error) {
      res.status(500).json({
        message: "Server error",
        error: error
      });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const repository = userRepository();


      if (req.body.email) {
        const existingUser = await repository.getByEmail(req.body.email);
        if (existingUser && existingUser.id !== id) {
          res.status(400).json({
            message: "Email already exists"
          });
          return
        }
      }

      const updatedUser = await repository.update(id, req.body);

      if (!updatedUser) {
        res.status(404).json({
          message: "User not found"
        });
        return
      }

      res.status(200).json({
        message: "User updated successfully",
        data: updatedUser
      });
    } catch (error) {
      res.status(500).json({
        message: "Server error",
        error: error
      });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const repository = userRepository();


      const user = await repository.getById(id);
      if (!user) {
        res.status(404).json({
          message: "User not found"
        });
        return
      }

      await repository.delete(id);

      res.status(200).json({
        message: "User deleted successfully"
      });
    } catch (error) {
      res.status(500).json({
        message: "Server error",
        error: error
      });
    }
  },

  getProfile: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          message: "User not authenticated"
        });
        return
      }

      const repository = userRepository();
      const user = await repository.getById(userId);

      if (!user) {
        res.status(404).json({
          message: "User not found"
        });
        return
      }

      res.status(200).json({
        message: "Profile retrieved successfully",
        data: user
      });
    } catch (error) {
      res.status(500).json({
        message: "Server error",
        error: error
      });
    }
  }
};