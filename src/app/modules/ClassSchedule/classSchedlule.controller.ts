import { Request, Response } from "express";
import { classSchedluleService } from "./classSchedlule.service";
import { classValidationSchema } from "./classSchedlule.vallidation";
import { z } from "zod";
import ClassModel from "./classSchedlule.model";
import moment from "moment"; // Using moment.js for date handling

const CreateScheduleGymClass = async (req: Request, res: Response) => {
    try {
        // Validate the request body using Zod schema
        const validatedData = classValidationSchema.parse(req.body);

        // Convert the start and end time to moment objects for easier comparison
        const startDateTime = moment(validatedData.startTime, "hh:mm A");
        const endDateTime = moment(validatedData.endTime, "hh:mm A");

        // Check if the duration between start and end time is exactly 2 hours
        const durationInHours = endDateTime.diff(startDateTime, 'hours');
        if (durationInHours !== 2) {
            return res.status(400).json({
                success: false,
                message: "Each class must last exactly two hours.",
            });
        }

        // Check if a class is already scheduled at the same time with the same trainer
        const conflictTime = await ClassModel.findOne({
            date: validatedData.date,
            trainer: validatedData.trainer,
            startTime: validatedData.startTime,
            endTime: validatedData.endTime
        });

        if (conflictTime) {
            return res.status(400).json({
                success: false,
                message: "Time slot is already scheduled, select another time slot",
            });
        }

        // Convert the date to a string in the desired format (e.g., ISO string)
        const dateString = new Date(validatedData.date).toISOString();

        // Call the service to schedule the class with validated data
        const scheduledClass = await classSchedluleService.createClass({
            ...validatedData,
            date: dateString, // Pass the date as a string
            trainer: validatedData.trainer, // Ensure trainer is passed correctly
        });

        res.status(201).json({
            success: true,
            message: "Class scheduled successfully",
            data: scheduledClass,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            // Handle validation errors
            res.status(400).json({
                success: false,
                message: "Validation error",
                errors: error.errors, // Return validation errors
            });
        } else {
            // Handle unexpected errors
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : "An error occurred",
            });
        }
    }
};


const ViewAssignedClassSchedules = async (req: Request, res: Response) => {
    try {
        // Get the trainer ID from the authenticated user (assumes trainer's ID is in req.user._id)
        const { trainerId } = req.params; // Assuming the trainer's ID is in req.user._id
        console.log(trainerId);
        // Call the service layer to fetch assigned class schedules for the trainer
        const assignedSchedules = await classSchedluleService.getAssignedClassSchedules(trainerId);

        // If no schedules are found for the trainer
        if (!assignedSchedules) {
            return res.status(404).json({
                success: false,
                message: "No assigned class schedules found.",
            });
        }

        // Return the assigned class schedules
        res.status(200).json({
            success: true,
            message: "Assigned class schedules retrieved successfully",
            data: assignedSchedules,
        });
    } catch (error) {
        // Handle unexpected errors
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "An error occurred",
        });
    }
};

const viewAllClassesSchedule = async (req: Request, res: Response) => {
    try {
        const classes = await classSchedluleService.getAllClasses();
        res.status(200).json({
            success: true,
            message: "Classes fetched successfully",
            data: classes,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "An error occurred",
        });
    }
};

export const ClassScheduleController = { CreateScheduleGymClass, ViewAssignedClassSchedules, viewAllClassesSchedule };
