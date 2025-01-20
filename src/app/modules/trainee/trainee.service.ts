import { TraineeModel, ClassScheduleModel } from "./trainee.model";
import { IClassSchedule } from "./trainee.interface";
import bcrypt from "bcrypt";

const createTraineeProfile = async (data: { name: string; email: string; phone: string; password: string; }) => {
    try {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const trainee = new TraineeModel({ ...data, password: hashedPassword });
        return await trainee.save();
    } catch (error) {
        if (error instanceof Error) {
            throw new Error("Failed to create trainee profile: " + error.message);
        } else {
            throw new Error("Failed to create trainee profile: An unknown error occurred");
        }
    }
};

const updateTraineeProfile = async (traineeId: string, data: Partial<{ name: string; email: string; phone: string; }>) => {
    try {
        return await TraineeModel.findByIdAndUpdate(traineeId, data, { new: true });
    } catch (error) {
        if (error instanceof Error) {
            throw new Error("Failed to update trainee profile: " + error.message);
        } else {
            throw new Error("Failed to update trainee profile: An unknown error occurred");
        }
    }
};

const bookClassSchedule = async (booking: IClassSchedule) => {
    try {
        // Create the booking
        const bookingData = await ClassScheduleModel.create(booking);

        // Populate the booking data with related class and trainee information
        const populatedBooking = await ClassScheduleModel.findById(bookingData._id)
            .populate("class")
            .populate("trainees")
            .exec();
        console.log("service", populatedBooking);



        if (!populatedBooking) {
            throw new Error("Booking not found");
        }
        return populatedBooking;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error("Failed to book class schedule: " + error.message);
        } else {
            throw new Error("Failed to book class schedule: An unknown error occurred");
        }
    }
};

const getAllBooking = async () => {
    try {
        return await ClassScheduleModel.find();
    } catch (error) {
        if (error instanceof Error) {
            throw new Error("Failed to fetch all bookings: " + error.message);
        } else {
            throw new Error("Failed to fetch all bookings: An unknown error occurred");
        }
    }
};


export const TraineeService = {
    createTraineeProfile,
    updateTraineeProfile,
    bookClassSchedule,
    getAllBooking
};