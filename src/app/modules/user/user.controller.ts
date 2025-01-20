import { Request, Response } from "express";
import { userValidationSchema } from "./user.validation";
import { UserServices } from "./user.service";
import { TSignIn, TUser } from "./user.interface";
import { ZodError } from "zod"; // Import ZodError to handle schema validation errors
import UserModel from "./user.model";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const adminRegister = async (req: Request, res: Response) => {
  try {
    // Parse and validate the user input
    const parsedUser = userValidationSchema.parse(req.body);
    const user: TUser = parsedUser as TUser;

    // Call the createUser service to handle user creation
    const { result, accessToken } = await UserServices.admingSignUpInDB(user);

    // Send the success response
    res.status(201).json({
      success: true,
      message: "admin logged in successfully",
      data: { result, accessToken },
      // Include the generated JWT token in the response
    });
  } catch (error) {
    console.error(error);

    // Handle validation errors from Zod
    if (error instanceof ZodError) {
      const validationError = error.errors[0]; // Get the first validation error
      return res.status(400).json({
        success: false,
        message: "Validation error occurred.",
        errorDetails: {
          field: validationError.path[0], // The field that caused the error
          message: validationError.message, // The error message
        },
      });
    }

    // Check for specific custom errors
    if (error instanceof Error && error.message === "Password is required") {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    // Handle other errors (e.g., generic server errors)
    res.status(500).json({
      success: false,
      message: "An error occurred while processing the request.",
    });
  }
};

const adminSignIn = async (req: Request, res: Response) => {
  try {
    const { email, password }: TSignIn = req.body;

    // Find the user by email
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        statusCode: 404,
        message: 'Invalid email or password',
      });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password as string,
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        statusCode: 404,
        message: 'Invalid email or password',
      });
    }

    // Call signIn with user information to get the access token
    const { accessToken } = await UserServices.signIn(email, password);

    // Generate refresh token
    const refreshToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.jwt_refresh_secret!,
      {
        expiresIn: process.env.jwt_refresh_expires_in,
      },
    );

    // Set the refresh token as a cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // Prevent JavaScript access to the cookie
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Set cookie expiration (1 year)
    });

    // Send response
    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token: accessToken, // Include access token in response
    });
  } catch (err) {
    console.error('Error during sign-in:', err);
    res.status(500).json({
      success: false,
      message: 'An error occurred during sign-in',
    });
  }
};


const createTrainer = async (req: Request, res: Response) => {
  try {
    // Parse and validate the user input
    const parsedUser = userValidationSchema.parse(req.body);
    const user: TUser = parsedUser as TUser;

    // Call the createUser service to handle user creation
    const { result } = await UserServices.createTrainerInDb(user);

    // Send the success response
    res.status(201).json({
      success: true,
      message: "Trainer created successfully",
      data: { result },
      // Include the generated JWT token in the response
    });
  } catch (error) {
    console.error(error);

    // Handle validation errors from Zod
    if (error instanceof ZodError) {
      const validationError = error.errors[0]; // Get the first validation error
      return res.status(400).json({
        success: false,
        message: "Validation error occurred.",
        errorDetails: {
          field: validationError.path[0], // The field that caused the error
          message: validationError.message, // The error message
        },
      });
    }

    // Check for specific custom errors
    if (error instanceof Error && error.message === "Password is required") {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    // Handle other errors (e.g., generic server errors)
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the trainer.",
    });
  }
};

const getAllTrainers = async (req: Request, res: Response) => {

  try {
    const result = await UserServices.getAllTrainers();
    res.status(200).json({
      success: true,
      message: "Trainers fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching trainers.",
    });
  }
};

const updateTrainer = async (req: Request, res: Response) => {
  try {
    const { _id } = req.body;

    const result = await UserServices.updateTrainer(_id, req.body);
    res.status(200).json({
      success: true,
      message: "Trainer updated successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the trainer.",
    });
  }
};


const deleteTrainer = async (req: Request, res: Response) => {
  try {
    const { _id } = req.body;
    const result = await UserServices.deleteTrainerfromDb(_id);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Trainer not found',
      });
    }
    res.status(200).json({
      success: true,
      message: "Trainer deleted successfully",
      data: [],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the user.",
    });
  }
};

export const UserController = {
  adminRegister,
  createTrainer,
  adminSignIn,
  deleteTrainer,
  getAllTrainers,
  updateTrainer
};
