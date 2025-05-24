import { Response, Request } from "express";
import { Incidences } from '../interfaces/Incidences.interface';
import { ModelInsidences } from "../models/ModelInsidences";
import { AuthenticatedRequest } from "../middlewares/tokenJWT";

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
      console.log(error);
      
      throw new Error(`${error}`);
    }
  },

  getById: async (id: string): Promise<Incidences | null> => {
    try {
      const incidence = await ModelInsidences.findById(id).populate('userReport', 'username email');
      return incidence;
    } catch (error) {
      throw new Error(`${error}`);
    }
  },

  update: async (id: string, data: Partial<Incidences>, userId?: string): Promise<Partial<Incidences> | null> => {
    try {

      const filter: any = { _id: id };
      if (userId) {
        filter.userReport = userId;
      }

      const updateData = await ModelInsidences.findOneAndUpdate(filter, data, { new: true });
      return updateData;
    } catch (error) {
      throw new Error(`${error}`);
    }
  },

  delete: async (id: string, userId?: string): Promise<boolean> => {
    try {
      const filter: any = { _id: id };
      if (userId) {
        filter.userReport = userId;
      }

      const result = await ModelInsidences.findOneAndDelete(filter);
      return !!result;
    } catch (error) {
      throw new Error(`${error}`);
    }
  },

  getByUser: async (userId: string): Promise<Incidences[]> => {
    try {
      const incidences = await ModelInsidences.find({ userReport: userId });
      return incidences;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
});

export const incidencesController = {
  create: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const repository = incidencesRepository();


      const incidenceData = {
        ...req.body,
        userReport: req.user?.id,
        date: req.body.date || new Date()
      };

      const response = await repository.create(incidenceData);

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
      console.log(error);
      
      res.status(500).json({
        message: "Server error",
        error: error
      });
    }
  },

  getById: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const repository = incidencesRepository();
      const response = await repository.getById(id);

      if (!response) {
        res.status(404).json({
          message: "Incidence not found"
        });
        return
      }

      res.status(200).json({
        message: "Incidence retrieved successfully",
        data: response
      });
    } catch (error) {
      res.status(500).json({
        message: "Server error",
        error: error
      });
    }
  },

  update: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const repository = incidencesRepository();


      const { allowAll } = req.query;
      const userId = allowAll !== 'true' ? req.user?.id : undefined;

      const response = await repository.update(id, req.body, userId);

      if (!response) {
        res.status(404).json({
          message: "Incidence not found or you don't have permission to update it"
        });
        return
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

  delete: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const repository = incidencesRepository();


      const { allowAll } = req.query;
      const userId = allowAll !== 'true' ? req.user?.id : undefined;

      const deleted = await repository.delete(id, userId);

      if (!deleted) {
        res.status(404).json({
          message: "Incidence not found or you don't have permission to delete it"
        });
        return
      }

      res.status(200).json({
        message: "Incidence deleted successfully"
      });
    } catch (error) {
      res.status(500).json({
        message: "Server error",
        error: error
      });
    }
  },

  getMyIncidences: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const repository = incidencesRepository();
      const response = await repository.getByUser(req.user?.id!);

      res.status(200).json({
        message: "Your incidences retrieved successfully",
        data: response,
        count: response.length
      });
    } catch (error) {
      res.status(500).json({
        message: "Server error",
        error: error
      });
    }
  }
};