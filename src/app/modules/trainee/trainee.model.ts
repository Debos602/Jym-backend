import mongoose, { Schema } from "mongoose";
import { IClassSchedule } from "./trainee.interface";

export const TClassSchema = new Schema({
    title: { type: String, required: false },
    date: { type: String, required: false, unique: true },
    startTime: { type: String, required: false },
    endTime: { type: String, required: false },
    trainer: { type: Schema.Types.ObjectId },
});

const TraineeSchema = new Schema({
    name: { type: String, required: false },
    email: { type: String, required: false, unique: true },
    phone: { type: String, required: false },
    password: { type: String, required: false },
});

const ClassScheduleSchema = new Schema({
    class: { type: Schema.Types.ObjectId, ref: "Class", required: false },
    trainees: [{ type: Schema.Types.ObjectId, ref: "Trainee", required: true }],
});

// Use mongoose.models to avoid OverwriteModelError
const TClassModel = mongoose.models.Class || mongoose.model<IClassSchedule>("Class", TClassSchema);
const TraineeModel = mongoose.models.Trainee || mongoose.model<IClassSchedule>("Trainee", TraineeSchema);
const ClassScheduleModel = mongoose.models.ClassSchedule || mongoose.model<IClassSchedule>("ClassSchedule", ClassScheduleSchema);

export { TraineeModel, TClassModel, ClassScheduleModel };
