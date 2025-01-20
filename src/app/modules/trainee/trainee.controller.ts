import { Request, Response } from "express";
import { z } from "zod";
import { createTraineeSchema, updateTraineeSchema } from "./trainee.validation";
import { TraineeService } from "./trainee.service";

const createTraineeProfile = async (req: Request, res: Response) => {
    try {
        const validatedData = createTraineeSchema.parse(req.body);
        const trainee = await TraineeService.createTraineeProfile(validatedData);
        res.status(201).json({
            success: true,
            message: "Trainee created successfully",
            data: trainee,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                success: false,
                message: "Validation error",
                errors: error.errors,
            });
        } else {
            res.status(500).json({
                success: false,
                message: "An unknown error occurred",
            });
        }
    }
};

const updateTraineeProfile = async (req: Request, res: Response) => {
    try {
        const validatedData = updateTraineeSchema.parse(req.body);
        const traineeId = req.body._id; // Assuming the trainee is authenticated
        const updatedTrainee = await TraineeService.updateTraineeProfile(traineeId, validatedData);
        res.status(200).json({
            success: true,
            message: "Trainee profile updated successfully",
            data: updatedTrainee,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                success: false,
                message: "Validation error",
                errors: error.errors,
            });
        } else {
            res.status(500).json({
                success: false,
                message: "An unknown error occurred",
            });
        }
    }
};

const handleBookClassSchedule = async (req: Request, res: Response) => {
    try {
        // Call the service to book the class schedule
        const result = await TraineeService.bookClassSchedule(req.body);


        res.status(200).json({
            success: true,
            message: "Class schedule booked successfully",
            data: result,
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: "Failed to book class schedule: " + error.message,
            });
        } else {
            res.status(500).json({
                success: false,
                message: "An unknown error occurred",
            });
        }
    }
};

const getAllBookings = async (req: Request, res: Response) => {
    try {
        const result = await TraineeService.getAllBooking();

        res.status(200).json({
            success: true,
            message: "Bookings fetched successfully",
            data: result,
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: "Failed to fetch bookings: " + error.message,
            });
        } else {
            res.status(500).json({
                success: false,
                message: "An unknown error occurred",
            });
        }
    }
};
export const TraineeController = { createTraineeProfile, updateTraineeProfile, handleBookClassSchedule, getAllBookings };