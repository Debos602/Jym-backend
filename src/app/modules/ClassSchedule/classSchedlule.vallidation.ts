import { z } from "zod";
import { TClass } from "./classSchedlule.interface";
import ClassModel from "./classSchedlule.model";

// Define Zod validation schema for the class
export const classValidationSchema = z.object({
    title: z.string().min(1, "Title is required"),
    date: z.coerce.date(), // Coerce input to Date
    startTime: z.string().regex(/^([0-9]{1,2}):([0-9]{2}) (AM|PM)$/, "Start time must be in HH:MM AM/PM format"),
    endTime: z.string().regex(/^([0-9]{1,2}):([0-9]{2}) (AM|PM)$/, "End time must be in HH:MM AM/PM format"),
    trainer: z.string().min(1, "Trainer ID is required").regex(/^[0-9a-fA-F]{24}$/, "Invalid Trainer ID format"),
});

// Example function to validate class data before saving
async function validateClassData(classData: TClass) {
    try {
        // Validate the class data using Zod schema
        const validatedData = classValidationSchema.parse(classData);
        return validatedData; // Return validated data
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("Validation errors:", error.errors); // Log the validation errors
            throw error; // Rethrow to be handled by calling function
        }
        throw new Error("Unexpected error occurred during validation.");
    }
}

// Example usage when creating a new class
export async function createClass(classData: TClass) {
    try {
        // Validate class data before creating a new Class record
        const validatedData = await validateClassData(classData);

        // If validation passes, save to the database using Mongoose
        const newClass = new ClassModel(validatedData);
        await newClass.save();
        console.log("Class successfully created!");
    } catch (error) {
        console.error("Error creating class:", error);
    }
}