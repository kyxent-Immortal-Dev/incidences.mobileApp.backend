import { Request, Response } from "express";
import { Incidences } from '../interfaces/Incidences.interface';
import { ModelInsidences } from "../models/ModelInsidences";

const incidencesRepository = () => ({
  create: async (data: Partial<Incidences>): Promise<Partial<Incidences>> => {
    try {
      const save = await ModelInsidences.create(data);
      return save;
    } catch (error) {
      throw new Error(`${error}`);
    }
  },

  getAll: async (): Promise<Incidences[]> => {
    try {
      const get = await ModelInsidences.find();
      return get;
    } catch (error) {
      throw new Error(`${error}`);
    }
  },

  update: async (id: string, data: Partial<Incidences>): Promise<Partial<Incidences> | null> => {
    try {
      const updateData = await ModelInsidences.findByIdAndUpdate(id, data, { new: true });
      return updateData;
    } catch (error) {
      throw new Error(`${error}`);
    }
  },

  deleted: async (id: string): Promise<void> => {
    try {
      await ModelInsidences.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
});

export const incidencesController = {
  create: async (req: Request, res: Response) => {
    try {
      const repository = incidencesRepository();
      const response = await repository.create(req.body);
      res.status(201).json({
        message: "Incidence created successfully",
        data: response
      });
    } catch (error) {
      res.status(500).json({
        message: "Server error",
        error: error
      });
    }
  },

  getAll: async (req: Request, res: Response) => {
    try {
      const repository = incidencesRepository();
      const response = await repository.getAll();
      res.status(200).json({
        message: "Incidences retrieved successfully",
        data: response
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
      const repository = incidencesRepository();
      const response = await repository.update(id, req.body);
      
      if (!response) {
        return res.status(404).json({
          message: "Incidence not found"
        });
      }

      res.status(200).json({
        message: "Incidence updated successfully",
        data: response
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
      const repository = incidencesRepository();
      await repository.deleted(id);
      
      res.status(200).json({
        message: "Incidence deleted successfully"
      });
    } catch (error) {
      res.status(500).json({
        message: "Server error",
        error: error
      });
    }
  }
};