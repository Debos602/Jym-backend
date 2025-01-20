import mongoose from "mongoose";

export interface TClass {
    title: string;
    date: Date;
    startTime: string;
    endTime: string;
    trainer: mongoose.Schema.Types.ObjectId;
}