import { z } from 'zod';
import mongoose from 'mongoose'; // Import mongoose to use ObjectId



// Define the Zod schema for TUser validation
export const userValidationSchema = z.object({
  name: z.string().min(1, "Name is required"), // Ensure name is a non-empty string
  email: z.string().email("Invalid email Format"), // Ensure valid email format
  role: z.enum(['admin', 'trainer', 'trainee'], {
    errorMap: () => {
      return { message: "Invalid role. Choose between 'admin', 'trainer', or 'trainee'" };
    }
  }),
  password: z.string().optional(), // Optional for the password
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Use Zod's `parse` method to validate an object



// Validation schema for TSignIn
export const signInValidationSchema = z.object({
  user: z.string().refine((value) => mongoose.Types.ObjectId.isValid(value), {
    message: 'User must be a valid ObjectId',
  }),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});



