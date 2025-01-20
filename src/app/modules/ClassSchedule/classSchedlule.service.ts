import UserModel from "../user/user.model";
import ClassModel from "./classSchedlule.model";


const createClass = async (classData: {
    title: string;
    date: string; // e.g., "2025-01-20"
    startTime: string; // e.g., "10:00 AM"
    endTime: string; // e.g., "11:00 AM"
    trainer: string; // Change trainerId to trainer
}) => {
    const { title, date, startTime, endTime, trainer } = classData;

    // Check if the trainer exists
    const trainerData = await UserModel.findById(trainer).select("-password").lean();

    if (!trainerData) {
        throw new Error("Trainer not found");
    }

    // Check the total number of classes on the given date
    const classesOnDate = await ClassModel.find({ date });

    if (classesOnDate.length >= 5) {
        throw new Error("Cannot schedule more than 5 classes per day");
    }
    // Create the class
    const newClass = new ClassModel({ title, date, startTime, endTime, trainer });
    await newClass.save();
    return newClass;
};
// Assuming this is your Mongoose model for class schedules


// Service to fetch assigned class schedules for a trainer
const getAssignedClassSchedules = async (trainerId: string) => {
    try {
        // Fetch class schedules for the specific trainer
        const assignedSchedules = await ClassModel.findOne({ trainer: trainerId });

        return assignedSchedules;  // Return the fetched schedules
    } catch (error) {
        // Handle any error while fetching from the database
        throw new Error("An error occurred while fetching assigned class schedules");
    }
};

const getAllClasses = async () => {
    try {
        const classes = await ClassModel.find();
        return classes;
    } catch (error) {
        console.error(error);
        throw new Error("An error occurred while fetching classes");
    }
};





export const classSchedluleService = { createClass, getAssignedClassSchedules, getAllClasses };
