import { z } from "zod";

export const TrainerValidation = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    role: z.string().min(1, "Role is required"),
});

export const createTraineeSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const updateTraineeSchema = z.object({
    name: z.string().min(1, "Name is required").optional(),
    email: z.string().email("Invalid email address").optional(),
    phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits").optional(),
});

export const ClassScheduleValidation = z.object({
    title: z.string().min(1, "Title is required"),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, must be YYYY-MM-DD"),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format, must be HH:mm"),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format, must be HH:mm"),
    class: z.string().optional(), // ObjectId as string
    trainees: z.array(z.string()), // Array of ObjectIds as strings
});