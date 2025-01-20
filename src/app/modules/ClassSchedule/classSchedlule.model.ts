import mongoose, { Schema } from "mongoose";
import { TClass } from "./classSchedlule.interface";

const classSchema = new Schema<TClass>({
    title: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    trainer: {  // <-- Change this field name if necessary
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
});


const ClassModel = mongoose.model("Class", classSchema);
export default ClassModel;
