import mongoose, { Schema } from "mongoose";
import { TUser } from "./user.interface";

const userSchema = new Schema<TUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["admin", "trainer", "trainee"],
    required: true,
  },
  password: {
    type: String,
    required: function () {
      return this.role === "admin" || this.role === "trainer" || this.role === "trainee";
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Add a custom `toJSON` method to exclude the password field
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    // Delete password from the returned object
    delete ret.password;
    return ret;
  },
});



// Create a Mongoose model based on the schema
const UserModel = mongoose.model<TUser>("User", userSchema);

export default UserModel;
