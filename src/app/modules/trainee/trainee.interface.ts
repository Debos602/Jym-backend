import mongoose, { ObjectId } from "mongoose";

export interface TClass {
    title: string;
    date: Date;
    startTime: string;
    endTime: string;
    trainer: mongoose.Schema.Types.ObjectId;
}

export interface ITrainee {
    _id: ObjectId;
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
}

export interface IClassSchedule {
    _id?: ObjectId;
    class?: mongoose.Schema.Types.ObjectId;  // Reference to TClass
    trainees?: mongoose.Schema.Types.ObjectId[]; // Array of ObjectIds referencing ITrainee
}
